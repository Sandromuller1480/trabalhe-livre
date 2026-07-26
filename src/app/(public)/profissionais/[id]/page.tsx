import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProfileDetailClient from '@/components/professionals/ProfileDetailClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProfessionalProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Obter usuário logado na sessão atual
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Buscar perfil público do profissional
  const { data: professional } = await supabase
    .from('public_professional_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!professional) {
    notFound()
  }

  // 3. Buscar itens do portfólio
  const { data: portfolioItems } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('professional_id', id)
    .order('created_at', { ascending: false })

  // 4. Buscar avaliações recebidas
  const { data: rawReviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, contractor_id')
    .eq('professional_id', id)
    .order('created_at', { ascending: false })

  const contractorIds = Array.from(new Set((rawReviews || []).map((r: any) => r.contractor_id)))
  const { data: reviewerProfiles } = contractorIds.length > 0
    ? await adminClient
        .from('profiles')
        .select('id, full_name')
        .in('id', contractorIds)
    : { data: [] }

  const reviewerById = new Map((reviewerProfiles || []).map((profile: any) => [profile.id, profile]))

  // Mapear reviews para extrair o nome do contratante adequadamente
  const reviews = (rawReviews || []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    full_name: reviewerById.get(r.contractor_id)?.full_name || 'Contratante Anônimo',
  }))

  // 5. Determinar estado de desbloqueio e créditos do contratante
  let userRole = null
  let initialUnlocked = false
  let contactInfo = null
  let contractorCredits = 0

  if (user) {
    userRole = user.user_metadata?.role || user.raw_user_meta_data?.role

    const isOwner = user.id === id
    const isAdmin = userRole === 'admin'

    if (isOwner || isAdmin) {
      // Se for o próprio profissional ou admin, vê o contato diretamente
      initialUnlocked = true
      
      const { data: fullProfile } = await adminClient
        .from('professional_profiles')
        .select('*')
        .eq('id', id)
        .single()
      
      const { data: baseProfile } = await adminClient
        .from('profiles')
        .select('email, phone')
        .eq('id', id)
        .single()

      contactInfo = {
        phone: baseProfile?.phone,
        email: baseProfile?.email,
        address_hidden: fullProfile?.address_hidden,
        website: fullProfile?.website,
        instagram: fullProfile?.instagram,
        facebook: fullProfile?.facebook,
      }
    } else if (userRole === 'contractor') {
      // Se for contratante, checar se já desbloqueou este profissional
      const { data: unlockRecord } = await supabase
        .from('contact_unlocks')
        .select('contractor_id')
        .eq('contractor_id', user.id)
        .eq('professional_id', id)
        .maybeSingle()

      if (unlockRecord) {
        initialUnlocked = true

        const { data: baseProfile } = await adminClient
          .from('profiles')
          .select('email, phone')
          .eq('id', id)
          .single()

        const { data: fullProfile } = await adminClient
          .from('professional_profiles')
          .select('website, instagram, facebook, tiktok, youtube, linkedin')
          .eq('id', id)
          .single()

        contactInfo = {
          ...baseProfile,
          ...fullProfile,
        }
      }

      // Buscar carteira do contratante para saber o saldo de créditos
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('contractor_id', user.id)
        .single()

      contractorCredits = wallet?.balance || 0
    }
  }

  return (
    <>
      <Header initialUser={user} />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen">
        <ProfileDetailClient 
          professional={professional}
          portfolioItems={portfolioItems || []}
          reviews={reviews}
          userRole={userRole}
          initialUnlocked={initialUnlocked}
          initialContactInfo={contactInfo}
          contractorCredits={contractorCredits}
        />
      </main>
      <Footer />
    </>
  )
}
