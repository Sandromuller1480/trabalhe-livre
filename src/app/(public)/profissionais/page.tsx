import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SearchClientWrapper from '@/components/professionals/SearchClientWrapper'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    state?: string
    city?: string
    is_verified?: string
    is_remote?: string
    is_presential?: string
    is_emergency?: string
    availability?: string
    orderBy?: string
  }>
}

export default async function ProfessionalsSearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const supabase = await createClient()
  
  // 1. Obter usuário logado para controle de cabeçalho
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Buscar categorias ativas para o painel de filtros
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  // 3. Montar a consulta contra a view pública de perfis profissionais
  let query = supabase
    .from('public_professional_profiles')
    .select('*')

  // Aplicar busca por texto (nome ou bio)
  if (resolvedParams.q) {
    query = query.or(`professional_name.ilike.%${resolvedParams.q}%,bio.ilike.%${resolvedParams.q}%`)
  }

  // Aplicar filtro de categoria (slug)
  if (resolvedParams.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', resolvedParams.category)
      .single()
    
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  // Aplicar filtros regionais
  if (resolvedParams.state) {
    query = query.eq('state', resolvedParams.state)
  }

  if (resolvedParams.city) {
    query = query.eq('city', resolvedParams.city)
  }

  // Aplicar filtros de flags de atendimento
  if (resolvedParams.is_verified === 'true') {
    query = query.eq('is_verified', true)
  }

  if (resolvedParams.is_remote === 'true') {
    query = query.eq('is_remote', true)
  }

  if (resolvedParams.is_presential === 'true') {
    query = query.eq('is_presential', true)
  }

  if (resolvedParams.is_emergency === 'true') {
    query = query.eq('is_emergency', true)
  }

  // Filtrar apenas por disponíveis
  if (resolvedParams.availability === 'available') {
    query = query.eq('availability', 'available')
  }

  // Ordenação de resultados
  if (resolvedParams.orderBy === 'experience') {
    query = query.order('experience_years', { ascending: false })
  } else {
    // Default: Melhor avaliados
    query = query.order('rating_avg', { ascending: false }).order('rating_count', { ascending: false })
  }

  const { data: professionals } = await query

  return (
    <>
      <Header initialUser={user} />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen">
        <SearchClientWrapper 
          initialProfessionals={professionals || []} 
          categories={categories || []} 
        />
      </main>
      <Footer />
    </>
  )
}
