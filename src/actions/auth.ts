'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { LoginInput, ProfessionalRegisterInput, ContractorRegisterInput } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'

interface ActionResponse {
  success: boolean
  message: string
  redirectTo?: string
}

/**
 * Ação de Login
 */
export async function login(data: LoginInput): Promise<ActionResponse> {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return {
      success: false,
      message: 'Falha no login: E-mail ou senha incorretos.',
    }
  }

  const role = authData.user?.user_metadata?.role || authData.user?.raw_user_meta_data?.role

  let redirectTo = '/contratante'
  if (role === 'admin') redirectTo = '/admin'
  else if (role === 'professional') redirectTo = '/profissional'

  return {
    success: true,
    message: 'Login realizado com sucesso!',
    redirectTo,
  }
}

/**
 * Ação de Cadastro de Profissional Autônomo
 */
export async function registerProfessional(data: ProfessionalRegisterInput): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    phone: data.phone.replace(/\D/g, ''),
    options: {
      data: {
        full_name: data.full_name,
        role: 'professional',
      },
    },
  })

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || 'Falha ao registrar usuário na autenticação.',
    }
  }

  const userId = authData.user.id

  try {
    // 2. Atualizar dados complementares na tabela profiles (como o telefone formatado)
    await adminClient
      .from('profiles')
      .update({ phone: data.phone })
      .eq('id', userId)

    // 3. Atualizar dados complementares no professional_profiles
    const { error: profileError } = await adminClient
      .from('professional_profiles')
      .update({
        professional_name: data.professional_name || data.full_name,
        category_id: data.category_id,
        cep: data.cep,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        address_hidden: data.address,
        availability: 'unconfirmed',
      })
      .eq('id', userId)

    if (profileError) {
      throw profileError
    }

    // 4. Aceitar os Termos e Privacidade
    await adminClient.from('terms_acceptances').insert({
      profile_id: userId,
      accepted_terms: data.accept_terms,
      accepted_privacy: data.accept_privacy,
    })

    return {
      success: true,
      message: 'Cadastro de profissional realizado com sucesso! Redirecionando...',
      redirectTo: '/profissional',
    }
  } catch (err: any) {
    // Limpar o usuário criado na Auth em caso de falha de escrita no DB para permitir nova tentativa
    await adminClient.auth.admin.deleteUser(userId)
    return {
      success: false,
      message: err.message || 'Falha ao salvar dados complementares do profissional.',
    }
  }
}

/**
 * Ação de Cadastro de Contratante
 */
export async function registerContractor(data: ContractorRegisterInput): Promise<ActionResponse> {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    phone: data.phone.replace(/\D/g, ''),
    options: {
      data: {
        full_name: data.full_name,
        role: 'contractor',
      },
    },
  })

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || 'Falha ao criar usuário na autenticação.',
    }
  }

  const userId = authData.user.id

  try {
    // 2. Atualizar dados complementares no profiles (como telefone formatado)
    await adminClient
      .from('profiles')
      .update({ phone: data.phone })
      .eq('id', userId)

    // 3. Atualizar dados complementares no contractor_profiles
    const { error: profileError } = await adminClient
      .from('contractor_profiles')
      .update({
        contractor_type: data.contractor_type,
        cpf: data.cpf || null,
        cnpj: data.cnpj || null,
        company_name: data.company_name || null,
        cep: data.cnpj ? (data.cpf ? null : null) : null, // Opcionais
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood || null,
      })
      .eq('id', userId)

    if (profileError) {
      throw profileError
    }

    // 4. Aceitar os Termos e Privacidade
    await adminClient.from('terms_acceptances').insert({
      profile_id: userId,
      accepted_terms: data.accept_terms,
      accepted_privacy: data.accept_privacy,
    })

    return {
      success: true,
      message: 'Cadastro de contratante realizado com sucesso! Redirecionando...',
      redirectTo: '/contratante',
    }
  } catch (err: any) {
    // Limpar o usuário em caso de falha
    await adminClient.auth.admin.deleteUser(userId)
    return {
      success: false,
      message: err.message || 'Falha ao salvar dados complementares do contratante.',
    }
  }
}

/**
 * Ação de Logout
 */
export async function logout(): Promise<ActionResponse> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return {
    success: true,
    message: 'Desconectado com sucesso!',
    redirectTo: '/login',
  }
}
