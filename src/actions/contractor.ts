'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

interface ActionResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * Simular Compra de Pacote de Créditos
 */
export async function buyCredits(packageId: string, paymentMethod: 'pix' | 'credit_card'): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  // 1. Obter informações do pacote
  const { data: pkg, error: pkgError } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg) {
    return { success: false, message: 'Pacote de créditos não encontrado.' }
  }

  // 2. Inserir registro de pagamento pendente
  const { data: payment, error: payError } = await supabase
    .from('payments')
    .insert({
      contractor_id: user.id,
      package_id: packageId,
      amount: pkg.price,
      status: 'pending',
      payment_method: paymentMethod,
      gateway_reference: `sim_${paymentMethod}_${Math.random().toString(36).substring(2, 12)}`,
    })
    .select()
    .single()

  if (payError || !payment) {
    return { success: false, message: 'Falha ao iniciar pagamento: ' + (payError?.message || 'Pagamento não retornado.') }
  }

  // --- SIMULAÇÃO DE APROVAÇÃO ---
  // No ambiente de desenvolvimento, aprovamos o pagamento após 1 segundo
  try {
    // Atualizar status do pagamento
    await adminClient
      .from('payments')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', payment.id)

    // Adicionar créditos na carteira do contratante chamando a RPC transacional
    const { data: walletData, error: walletError } = await adminClient.rpc('add_credits_to_wallet', {
      p_contractor_id: user.id,
      p_credits: pkg.credits,
      p_description: `Compra de pacote: ${pkg.name} (${pkg.credits} créditos)`,
    })

    if (walletError) throw walletError

    revalidatePath('/contratante')
    revalidatePath('/contratante/carteira')

    return {
      success: true,
      message: `Compra de ${pkg.credits} créditos simulada e aprovada com sucesso!`,
      data: walletData,
    }
  } catch (err: any) {
    // Reverter pagamento para falha
    await adminClient
      .from('payments')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', payment.id)

    return {
      success: false,
      message: 'Falha ao processar créditos: ' + err.message,
    }
  }
}

/**
 * Desbloquear Dados de Contato de um Profissional
 */
export async function unlockProfessionalContact(professionalId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  // Chamar a RPC transacional segura do Supabase
  const { data, error } = await adminClient.rpc('unlock_contact', {
    p_contractor_id: user.id,
    p_professional_id: professionalId,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath(`/profissionais/${professionalId}`)
  revalidatePath('/contratante/desbloqueios')

  // Se sucesso, obter os dados desbloqueados para devolver apenas ao contratante autenticado nesta action.
  const { data: baseProfile, error: baseProfileError } = await adminClient
    .from('profiles')
    .select('email, phone')
    .eq('id', professionalId)
    .single()

  const { data: professionalProfile, error: professionalProfileError } = await adminClient
    .from('professional_profiles')
    .select('website, instagram, facebook, tiktok, youtube, linkedin')
    .eq('id', professionalId)
    .single()

  if (baseProfileError || professionalProfileError) {
    return {
      success: true,
      message: 'Contato desbloqueado, mas falha ao obter detalhes.',
    }
  }

  return {
    success: true,
    message: 'Contato desbloqueado com sucesso!',
    data: {
      ...baseProfile,
      ...professionalProfile,
    },
  }
}

/**
 * Publicar Oportunidade (Taxa de publicação: R$ 5,00)
 */
export async function publishOpportunity(data: {
  title: string
  category_id: string
  specialty_id?: string
  description: string
  state: string
  city: string
  neighborhood?: string
  desired_date?: string
  desired_time?: string
  urgency: 'low' | 'this_week' | 'next_days' | 'urgent' | 'emergency'
  budget_range?: string
  property_type?: string
  visit_required: boolean
  estimated_duration?: string
  image_urls?: string[]
}): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  // 1. Simular taxa de R$ 5,00 e criar pagamento aprovado
  const { data: payment, error: payError } = await adminClient
    .from('payments')
    .insert({
      contractor_id: user.id,
      amount: 5.00,
      status: 'approved',
      payment_method: 'pix',
      gateway_reference: `opp_pix_${Math.random().toString(36).substring(2, 12)}`,
    })
    .select()
    .single()

  if (payError || !payment) {
    return { success: false, message: 'Falha ao processar taxa de publicação: ' + (payError?.message || 'Pagamento não retornado.') }
  }

  // 2. Inserir oportunidade na fila de moderação (awaiting_moderation)
  const { data: request, error: reqError } = await adminClient
    .from('service_requests')
    .insert({
      contractor_id: user.id,
      title: data.title,
      category_id: data.category_id,
      specialty_id: data.specialty_id || null,
      description: data.description,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood || null,
      desired_date: data.desired_date || null,
      desired_time: data.desired_time || null,
      urgency: data.urgency,
      budget_range: data.budget_range || null,
      property_type: data.property_type || null,
      visit_required: data.visit_required,
      estimated_duration: data.estimated_duration || null,
      status: 'awaiting_moderation', // Segue para moderação administrativa
      expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias de validade
    })
    .select()
    .single()

  if (reqError || !request) {
    return { success: false, message: 'Falha ao salvar oportunidade: ' + (reqError?.message || 'Oportunidade não retornada.') }
  }

  // 3. Vincular imagens da oportunidade se houver
  if (data.image_urls && data.image_urls.length > 0) {
    const mediaToInsert = data.image_urls.map((url) => ({
      request_id: request.id,
      image_url: url,
    }))
    await adminClient.from('service_request_media').insert(mediaToInsert)
  }

  // 4. Jogar texto na fila de moderação centralizada para revisão administrativa
  await adminClient.from('moderation_queue').insert({
    content_type: 'service_request',
    target_id: request.id,
    content_text: `${data.title} - ${data.description}`,
    status: 'pending',
  })

  revalidatePath('/contratante/oportunidades')
  return {
    success: true,
    message: 'Serviço publicado com sucesso! O pagamento de R$ 5,00 foi compensado e o anúncio está na fila de moderação.',
    data: request,
  }
}

/**
 * Avaliar Profissional (Nota de 1 a 5, com critérios detalhados)
 */
export async function addReview(data: {
  professional_id: string
  request_id?: string
  rating: number
  comment?: string
  criteria: {
    quality: number
    punctuality: number
    communication: number
    organization: number
    professionalism: number
    cost_benefit: number
  }
}): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  try {
    // 1. Inserir avaliação principal
    const { data: review, error: reviewError } = await adminClient
      .from('reviews')
      .insert({
        contractor_id: user.id,
        professional_id: data.professional_id,
        request_id: data.request_id || null,
        rating: data.rating,
        comment: data.comment || null,
      })
      .select()
      .single()

    if (reviewError || !review) {
      throw new Error('Falha ao salvar avaliação: ' + reviewError?.message)
    }

    // 2. Inserir critérios detalhados
    const { error: critError } = await adminClient
      .from('review_criteria')
      .insert({
        review_id: review.id,
        quality: data.criteria.quality,
        punctuality: data.criteria.punctuality,
        communication: data.criteria.communication,
        organization: data.criteria.organization,
        professionalism: data.criteria.professionalism,
        cost_benefit: data.criteria.cost_benefit,
      })

    if (critError) throw critError

    // 3. Atualizar nota média (rating_avg) e contagem no perfil do profissional
    const { data: allReviews } = await adminClient
      .from('reviews')
      .select('rating')
      .eq('professional_id', data.professional_id)

    if (allReviews && allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0)
      const count = allReviews.length
      const avg = totalRating / count

      await adminClient
        .from('professional_profiles')
        .update({
          rating_avg: parseFloat(avg.toFixed(2)),
          rating_count: count,
        })
        .eq('id', data.professional_id)
    }

    // 4. Notificar profissional
    await adminClient.from('notifications').insert({
      profile_id: data.professional_id,
      title: 'Você recebeu uma Avaliação!',
      message: `Um contratante avaliou seu serviço com nota ${data.rating} estrelas.`,
      link: '/profissional/avaliacoes',
    })

    revalidatePath('/contratante/avaliacoes')
    revalidatePath(`/profissionais/${data.professional_id}`)

    return {
      success: true,
      message: 'Avaliação enviada com sucesso!',
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Falha ao processar avaliação.',
    }
  }
}
