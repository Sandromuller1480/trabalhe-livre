import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContractorDashboardClient from '@/components/contractor/ContractorDashboardClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ContractorDashboardPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Obter usuário logado na sessão atual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Buscar carteira de créditos do contratante
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('contractor_id', user.id)
    .single()

  const credits = wallet?.balance || 0

  // 3. Buscar oportunidades de serviço publicadas por este contratante
  const { data: opportunities } = await supabase
    .from('service_requests')
    .select('id, title, status, city, state, created_at')
    .eq('contractor_id', user.id)
    .order('created_at', { ascending: false })

  // 4. Buscar contatos desbloqueados (profissionais e seus dados de contato)
  const { data: rawUnlocked } = await adminClient
    .from('contact_unlocks')
    .select('created_at, professional_id')
    .eq('contractor_id', user.id)
    .order('created_at', { ascending: false })

  const { data: creditPackages } = await supabase
    .from('credit_packages')
    .select('id, name, credits, price')
    .eq('is_active', true)
    .order('credits', { ascending: true })

  const professionalIds = Array.from(new Set((rawUnlocked || []).map((u: any) => u.professional_id)))

  const { data: professionalProfiles } = professionalIds.length > 0
    ? await adminClient
        .from('professional_profiles')
        .select(`
          id,
          professional_name,
          city,
          state,
          category:category_id (
            name
          )
        `)
        .in('id', professionalIds)
    : { data: [] }

  const { data: baseProfiles } = professionalIds.length > 0
    ? await adminClient
        .from('profiles')
        .select('id, phone, email')
        .in('id', professionalIds)
    : { data: [] }

  const professionalById = new Map((professionalProfiles || []).map((profile: any) => [profile.id, profile]))
  const baseProfileById = new Map((baseProfiles || []).map((profile: any) => [profile.id, profile]))

  const unlockedProfessionals = (rawUnlocked || []).map((u: any) => ({
    id: u.professional_id,
    professional_name: professionalById.get(u.professional_id)?.professional_name || 'Profissional Autônomo',
    category_name: professionalById.get(u.professional_id)?.category?.name || 'Serviços Gerais',
    phone: baseProfileById.get(u.professional_id)?.phone || '',
    email: baseProfileById.get(u.professional_id)?.email || '',
    city: professionalById.get(u.professional_id)?.city || '',
    state: professionalById.get(u.professional_id)?.state || '',
    unlocked_at: u.created_at,
  }))

  return (
    <>
      <Header initialUser={user} />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContractorDashboardClient 
            contractorName={user.user_metadata?.full_name || 'Contratante'}
            credits={credits}
            creditPackages={creditPackages || []}
            opportunities={opportunities || []}
            unlockedProfessionals={unlockedProfessionals}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
