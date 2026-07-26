import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Validar autenticação e obter usuário da sessão
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Validar se o perfil do usuário logado é realmente 'admin'
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // 3. Buscar itens pendentes na Fila de Moderação
  const { data: moderationQueue } = await adminClient
    .from('moderation_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  // 4. Buscar solicitações de verificação pendentes
  const { data: verifsRaw } = await adminClient
    .from('verifications')
    .select(`
      id,
      professional_id,
      document_front_url,
      document_back_url,
      selfie_url,
      status,
      created_at,
      professional:professional_id (
        professional_name
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const verifications = (verifsRaw || []).map((v: any) => ({
    id: v.id,
    professional_id: v.professional_id,
    professional_name: v.professional?.professional_name || 'Profissional Autônomo',
    document_front_url: v.document_front_url,
    document_back_url: v.document_back_url,
    selfie_url: v.selfie_url,
    status: v.status,
    created_at: v.created_at,
  }))

  // 5. Buscar logs de auditoria
  const { data: logsRaw } = await adminClient
    .from('admin_logs')
    .select(`
      id,
      action,
      target_type,
      target_id,
      created_at,
      details,
      admin:admin_id (
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  const auditLogs = (logsRaw || []).map((l: any) => ({
    id: l.id,
    action: l.action,
    target_type: l.target_type,
    target_id: l.target_id,
    created_at: l.created_at,
    details: l.details,
    admin_name: l.admin?.full_name || 'Administrador',
  }))

  // 6. Consolidar Métricas e Receitas (Simulado + DB)
  const { data: paySums } = await adminClient
    .from('payments')
    .select('amount')
    .eq('status', 'approved')
  
  const totalRevenue = (paySums || []).reduce((sum, p) => sum + parseFloat(p.amount), 0)
  const totalPaymentsCount = (paySums || []).length

  const { count: professionalsCount } = await adminClient
    .from('professional_profiles')
    .select('id', { count: 'exact', head: true })

  const { count: contractorsCount } = await adminClient
    .from('contractor_profiles')
    .select('id', { count: 'exact', head: true })

  const { count: totalRequestsCount } = await adminClient
    .from('service_requests')
    .select('id', { count: 'exact', head: true })

  const metrics = {
    totalRevenue,
    totalPaymentsCount,
    professionalsCount: professionalsCount || 0,
    contractorsCount: contractorsCount || 0,
    totalRequestsCount: totalRequestsCount || 0,
  }

  return (
    <>
      <Header initialUser={user} />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminDashboardClient 
            metrics={metrics}
            moderationQueue={moderationQueue || []}
            verifications={verifications}
            auditLogs={auditLogs}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
