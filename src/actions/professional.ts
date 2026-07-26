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
 * Atualizar status de Disponibilidade do Profissional
 */
export async function updateAvailability(
  status: 'available' | 'busy' | 'unconfirmed',
  forecastDate?: string
): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  const forecast = status === 'busy' && forecastDate ? forecastDate : null

  // 1. Atualizar o perfil profissional
  const { error: updateError } = await supabase
    .from('professional_profiles')
    .update({
      availability: status,
      availability_forecast: forecast,
      availability_updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    return { success: false, message: 'Falha ao atualizar disponibilidade: ' + updateError.message }
  }

  // 2. Gravar no histórico de disponibilidade
  const { error: historyError } = await supabase
    .from('availability_history')
    .insert({
      professional_id: user.id,
      status,
      forecast,
    })

  if (historyError) {
    console.error('Falha ao registrar histórico de disponibilidade:', historyError)
  }

  revalidatePath('/profissional')
  revalidatePath(`/profissionais`)

  return {
    success: true,
    message: `Disponibilidade alterada para "${status === 'available' ? 'Disponível' : status === 'busy' ? 'Ocupado' : 'Não Confirmado'}" com sucesso!`,
  }
}

/**
 * Atualizar Perfil Completo do Profissional
 */
export async function updateProfessionalProfile(data: any): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  try {
    // 1. Atualizar nome no profiles
    if (data.full_name) {
      await adminClient
        .from('profiles')
        .update({ full_name: data.full_name, phone: data.phone })
        .eq('id', user.id)
    }

    // 2. Atualizar tabela professional_profiles
    const { error: profileError } = await adminClient
      .from('professional_profiles')
      .update({
        professional_name: data.professional_name || null,
        category_id: data.category_id || null,
        bio: data.bio || null,
        experience_years: parseInt(data.experience_years) || 0,
        cep: data.cep || null,
        state: data.state || null,
        city: data.city || null,
        neighborhood: data.neighborhood || null,
        max_distance: parseInt(data.max_distance) || 0,
        is_presential: !!data.is_presential,
        is_remote: !!data.is_remote,
        is_residential: !!data.is_residential,
        is_commercial: !!data.is_commercial,
        is_emergency: !!data.is_emergency,
        work_weekends: !!data.work_weekends,
        work_night: !!data.work_night,
        has_vehicle: !!data.has_vehicle,
        has_tools: !!data.has_tools,
        issues_invoice: !!data.issues_invoice,
        has_mei: !!data.has_mei,
        website: data.website || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        tiktok: data.tiktok || null,
        youtube: data.youtube || null,
        linkedin: data.linkedin || null,
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    // 3. Atualizar especialidades vinculadas
    if (data.specialties && Array.isArray(data.specialties)) {
      // Remover especialidades anteriores
      await adminClient
        .from('professional_specialties')
        .delete()
        .eq('professional_id', user.id)

      // Adicionar novas especialidades
      if (data.specialties.length > 0) {
        const specialtiesToInsert = data.specialties.map((specId: string) => ({
          professional_id: user.id,
          specialty_id: specId,
        }))
        const { error: specInsertError } = await adminClient
          .from('professional_specialties')
          .insert(specialtiesToInsert)

        if (specInsertError) throw specInsertError
      }
    }

    revalidatePath('/profissional')
    revalidatePath(`/profissionais`)

    return {
      success: true,
      message: 'Perfil profissional atualizado com sucesso!',
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Falha ao atualizar o perfil.',
    }
  }
}

/**
 * Adicionar Item ao Portfólio (MVP - Simula upload se imagens estáticas ou insere url do Supabase Storage)
 */
export async function addPortfolioItem(data: {
  title: string
  description?: string
  image_url: string
  is_before_after: boolean
  image_after_url?: string
  service_date?: string
  city?: string
  alt_text?: string
}): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  // Obter perfil para checar categoria
  const { data: profData } = await supabase
    .from('professional_profiles')
    .select('category_id')
    .eq('id', user.id)
    .single()

  const { error } = await supabase
    .from('portfolio_items')
    .insert({
      professional_id: user.id,
      title: data.title,
      description: data.description || null,
      category_id: profData?.category_id || null,
      image_url: data.image_url,
      is_before_after: data.is_before_after,
      image_after_url: data.is_before_after ? data.image_after_url : null,
      service_date: data.service_date || null,
      city: data.city || null,
      alt_text: data.alt_text || data.title,
    })

  if (error) {
    return { success: false, message: 'Falha ao adicionar item: ' + error.message }
  }

  revalidatePath('/profissional/portfolio')
  return {
    success: true,
    message: 'Item de portfólio adicionado com sucesso!',
  }
}

/**
 * Excluir Item do Portfólio
 */
export async function deletePortfolioItem(itemId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', itemId)
    .eq('professional_id', user.id)

  if (error) {
    return { success: false, message: 'Falha ao excluir item: ' + error.message }
  }

  revalidatePath('/profissional/portfolio')
  return {
    success: true,
    message: 'Item de portfólio excluído com sucesso!',
  }
}

/**
 * Demonstrar Interesse em uma Oportunidade (Candidatura)
 */
export async function applyToOpportunity(data: {
  request_id: string
  proposal_message: string
  estimated_duration: string
  price_estimate: number
  visit_required: boolean
  experience_summary: string
}): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Não autorizado.' }
  }

  const { error } = await supabase
    .from('service_interests')
    .insert({
      request_id: data.request_id,
      professional_id: user.id,
      proposal_message: data.proposal_message,
      estimated_duration: data.estimated_duration,
      price_estimate: data.price_estimate,
      visit_required: data.visit_required,
      experience_summary: data.experience_summary,
    })

  if (error) {
    // Código de duplicidade no Postgres é geralmente 23505
    if (error.code === '23505') {
      return { success: false, message: 'Você já demonstrou interesse nesta oportunidade.' }
    }
    return { success: false, message: 'Falha ao enviar interesse: ' + error.message }
  }

  // Notificar o contratante da oportunidade
  const { data: requestData } = await supabase
    .from('service_requests')
    .select('contractor_id, title')
    .eq('id', data.request_id)
    .single()

  if (requestData) {
    await supabase.from('notifications').insert({
      profile_id: requestData.contractor_id,
      title: 'Novo Profissional Interessado!',
      message: `Um profissional demonstrou interesse na sua oportunidade "${requestData.title}".`,
      link: `/contratante/oportunidades/${data.request_id}`,
    })
  }

  revalidatePath('/profissional/oportunidades')
  return {
    success: true,
    message: 'Candidatura enviada com sucesso! O contratante foi notificado.',
  }
}
