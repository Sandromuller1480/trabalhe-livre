'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

interface ActionResponse {
  success: boolean
  message: string
}

/**
 * Moderar Conteúdo (Aprovar / Rejeitar)
 */
export async function moderateContent(
  queueId: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  // Verificar se o usuário logado é admin
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, message: 'Acesso restrito a administradores.' }
  }

  try {
    // 1. Obter item da fila de moderação
    const { data: queueItem, error: queueError } = await adminClient
      .from('moderation_queue')
      .select('*')
      .eq('id', queueId)
      .single()

    if (queueError || !queueItem) {
      throw new Error('Item da fila de moderação não encontrado.')
    }

    // 2. Atualizar status na fila
    await adminClient
      .from('moderation_queue')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', queueId)

    // 3. Atualizar tabela de origem com base no tipo de conteúdo
    if (queueItem.content_type === 'service_request') {
      const targetStatus = status === 'approved' ? 'published' : 'rejected'

      const { data: reqData } = await adminClient
        .from('service_requests')
        .update({ status: targetStatus, updated_at: new Date().toISOString() })
        .eq('id', queueItem.target_id)
        .select('contractor_id, title')
        .single()

      if (reqData) {
        // Notificar o contratante sobre a aprovação/rejeição
        await adminClient.from('notifications').insert({
          profile_id: reqData.contractor_id,
          title: status === 'approved' ? 'Oportunidade Aprovada!' : 'Oportunidade Rejeitada',
          message: status === 'approved' 
            ? `Seu anúncio de serviço "${reqData.title}" foi aprovado e já está visível para profissionais.` 
            : `Seu anúncio "${reqData.title}" foi rejeitado. Motivo: ${adminNotes || 'Não cumpre as políticas da plataforma'}.`,
          link: '/contratante/oportunidades',
        })
      }
    } else if (queueItem.content_type === 'profile_bio') {
      // Caso seja bio de profissional
      if (status === 'rejected') {
        // Se rejeitado, podemos limpar a bio ou restaurar a anterior
        await adminClient
          .from('professional_profiles')
          .update({ bio: 'Conteúdo removido por violar as políticas de contato.' })
          .eq('id', queueItem.target_id)

        await adminClient.from('notifications').insert({
          profile_id: queueItem.target_id,
          title: 'Biografia Rejeitada',
          message: `Sua biografia profissional foi removida por conter informações de contato proibidas. Atualize seu texto sem divulgar telefones ou redes sociais.`,
          link: '/profissional/perfil',
        })
      }
    }

    // 4. Gravar log de auditoria
    await adminClient.from('admin_logs').insert({
      admin_id: user.id,
      action: `moderate_${status}`,
      target_type: queueItem.content_type,
      target_id: queueItem.target_id,
      details: { queue_id: queueId, notes: adminNotes },
    })

    revalidatePath('/admin')
    revalidatePath('/admin/moderacao')
    revalidatePath('/contratante/oportunidades')
    revalidatePath('/profissionais')

    return {
      success: true,
      message: `Conteúdo ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`,
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Falha na moderação: ' + err.message,
    }
  }
}

/**
 * Verificar Profissional (Aprovar selo de verificação mediante documentos)
 */
export async function verifyProfessionalDocument(
  verificationId: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, message: 'Acesso restrito a administradores.' }
  }

  try {
    // 1. Obter registro de verificação
    const { data: verif, error: verifError } = await adminClient
      .from('verifications')
      .select('*')
      .eq('id', verificationId)
      .single()

    if (verifError || !verif) {
      throw new Error('Solicitação de verificação não encontrada.')
    }

    // 2. Atualizar status da solicitação
    await adminClient
      .from('verifications')
      .update({
        status,
        admin_notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', verificationId)

    // 3. Atualizar flag no perfil do profissional
    const isVerifiedFlag = status === 'approved'
    await adminClient
      .from('professional_profiles')
      .update({ is_verified: isVerifiedFlag })
      .eq('id', verif.professional_id)

    // 4. Notificar profissional
    await adminClient.from('notifications').insert({
      profile_id: verif.professional_id,
      title: isVerifiedFlag ? 'Perfil Verificado!' : 'Verificação Recusada',
      message: isVerifiedFlag 
        ? 'Parabéns! Sua verificação de documentos foi aprovada e o selo verificado foi adicionado ao seu perfil público.' 
        : `Sua solicitação de selo verificado foi recusada. Motivo: ${notes || 'Documentos ilegíveis ou divergentes'}.`,
      link: '/profissional/verificacao',
    })

    // 5. Registrar log de auditoria
    await adminClient.from('admin_logs').insert({
      admin_id: user.id,
      action: `verify_professional_${status}`,
      target_type: 'verification',
      target_id: verificationId,
      details: { professional_id: verif.professional_id, notes },
    })

    revalidatePath('/admin')
    revalidatePath(`/profissionais/${verif.professional_id}`)

    return {
      success: true,
      message: `Verificação de profissional ${status === 'approved' ? 'aprovada' : 'recusada'} com sucesso!`,
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Falha ao processar verificação: ' + err.message,
    }
  }
}
