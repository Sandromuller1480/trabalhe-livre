import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProfessionalDashboardClient from '@/components/professional/ProfessionalDashboardClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProfessionalDashboardPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Obter usuário autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Buscar perfil detalhado do profissional
  const { data: profile } = await supabase
    .from('professional_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // 3. Buscar clientes que desbloquearam os contatos deste profissional
  const { data: rawUnlocks } = await adminClient
    .from('contact_unlocks')
    .select('created_at, contractor_id')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })

  const contractorIds = Array.from(new Set((rawUnlocks || []).map((u: any) => u.contractor_id)))
  const { data: contractorProfiles } = contractorIds.length > 0
    ? await adminClient
        .from('profiles')
        .select('id, full_name, phone, email')
        .in('id', contractorIds)
    : { data: [] }

  const contractorById = new Map((contractorProfiles || []).map((profile: any) => [profile.id, profile]))

  const unlocks = (rawUnlocks || []).map((u: any) => ({
    id: `${u.contractor_id}-${u.created_at}`,
    created_at: u.created_at,
    contractor_name: contractorById.get(u.contractor_id)?.full_name || 'Cliente Autônomo',
    contractor_phone: contractorById.get(u.contractor_id)?.phone || '',
    contractor_email: contractorById.get(u.contractor_id)?.email || '',
  }))

  // 4. Buscar total de propostas (candidaturas) enviadas
  const { count: interestsCount } = await supabase
    .from('service_interests')
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', user.id)

  // 5. Buscar alertas de notificações
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <>
      <Header initialUser={user} />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfessionalDashboardClient 
            profile={profile}
            unlocks={unlocks}
            interestsCount={interestsCount || 0}
            notifications={notifications || []}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
