import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomeSearchForm from '@/components/forms/HomeSearchForm'
import FAQAccordion from '@/components/layout/FAQAccordion'
import Link from 'next/link'
import { 
  Hammer, 
  Sparkles, 
  Heart, 
  Utensils, 
  Laptop, 
  Car, 
  Scissors, 
  Wrench,
  Smile,
  Shield,
  Star,
  CheckCircle2,
  ArrowRight,
  UserCheck
} from 'lucide-react'

// Retorna o ícone adequado para a categoria
function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'construcao-e-reforma':
      return Hammer
    case 'limpeza-e-conservacao':
      return Sparkles
    case 'cuidados-pessoais-e-familiares':
      return Heart
    case 'animais':
      return Smile
    case 'alimentacao-e-eventos':
      return Utensils
    case 'tecnologia':
      return Laptop
    case 'automoveis':
      return Car
    case 'beleza-e-bem-estar':
      return Scissors
    case 'servicos-gerais':
      return Wrench
    default:
      return Wrench
  }
}

// Fallback estático de categorias caso banco não esteja populado
const STATIC_CATEGORIES = [
  { id: '1', name: 'Construção e reforma', slug: 'construcao-e-reforma', description: 'Pintor, pedreiro, encanador...' },
  { id: '2', name: 'Limpeza e conservação', slug: 'limpeza-e-conservacao', description: 'Faxineira, diarista, jardineiro...' },
  { id: '3', name: 'Cuidados pessoais', slug: 'cuidados-pessoais-e-familiares', description: 'Babá, cuidador de idosos...' },
  { id: '4', name: 'Alimentação e eventos', slug: 'alimentacao-e-eventos', description: 'Cozinheiro, garçom, fotógrafo...' },
  { id: '5', name: 'Tecnologia', slug: 'tecnologia', description: 'Desenvolvedor, suporte de TI...' },
  { id: '6', name: 'Serviços gerais', slug: 'servicos-gerais', description: 'Marido de aluguel, fretes...' },
]

// Fallback estático de profissionais em destaque
const STATIC_PROFESSIONALS = [
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    professional_name: 'João Pinturas Residenciais',
    category_name: 'Construção e reforma',
    city: 'São Paulo',
    state: 'SP',
    rating_avg: 4.90,
    rating_count: 8,
    is_verified: true,
    availability: 'available',
    experience_years: 8,
    bio: 'Pinturas internas e externas, aplicação de texturas, grafiato e efeitos modernos. Organização e limpeza impecáveis!'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    professional_name: 'Lúcia Limpezas',
    category_name: 'Limpeza e conservação',
    city: 'São Paulo',
    state: 'SP',
    rating_avg: 4.95,
    rating_count: 12,
    is_verified: true,
    availability: 'available',
    experience_years: 15,
    bio: 'Diarista detalhista com foco em residências de grande porte e apartamentos. Organizada, confiável e pontual.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000011',
    professional_name: 'Felipe Montagem de Móveis',
    category_name: 'Serviços gerais',
    city: 'Rondonópolis',
    state: 'MT',
    rating_avg: 4.96,
    rating_count: 25,
    is_verified: true,
    availability: 'available',
    experience_years: 7,
    bio: 'Montagem rápida e alinhada de móveis de e-commerce e planejados residenciais. Possuo ferramentas completas.'
  }
]

export default async function HomePage() {
  const supabase = await createClient()

  // Buscar usuário logado
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Buscar categorias do banco
  let categories = []
  try {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    categories = data || []
  } catch (e) {
    console.error('Falha ao obter categorias do banco:', e)
  }
  if (categories.length === 0) {
    categories = STATIC_CATEGORIES
  }

  // 2. Buscar profissionais disponíveis em destaque
  let featuredProfessionals = []
  try {
    const { data } = await supabase
      .from('public_professional_profiles')
      .select('*')
      .eq('availability', 'available')
      .order('rating_avg', { ascending: false })
      .limit(3)
    featuredProfessionals = data || []
  } catch (e) {
    console.error('Falha ao obter profissionais em destaque:', e)
  }
  if (featuredProfessionals.length === 0) {
    featuredProfessionals = STATIC_PROFESSIONALS
  }

  return (
    <>
      <Header initialUser={user} />
      
      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden bg-slate-950 text-primary-base min-h-[680px] pt-[500px] pb-10 sm:min-h-0 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat sm:hidden"
          style={{
            backgroundImage: "url('/imagens/HERO PARA MOBILE.png')",
          }}
        ></div>
        <div
          className="absolute inset-0 hidden bg-cover bg-no-repeat sm:block"
          style={{
            backgroundImage: "url('/imagens/HERO PLATAFORMA TRABALHE LIVRE.png')",
            backgroundPosition: 'center right',
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-start text-left">
          <div className="hidden -mt-10 sm:block sm:-mt-14 lg:-mt-20">
            <span className="inline-block text-xs font-bold text-secondary-base uppercase tracking-widest bg-secondary-base/10 px-4 py-1.5 rounded-full mb-6">
              A Maior Rede de Serviços do Brasil
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 max-w-2xl leading-tight">
              Encontre profissionais<br />
              para o <span className="text-yellow-400">serviço</span><br />
              que você precisa.
            </h1>
          </div>
          <div className="mt-0 w-full sm:mt-10 lg:mt-12">
            <p className="relative -top-8 hidden text-base text-primary-base max-w-xl mb-12 sm:block sm:-top-10 sm:text-lg lg:-top-12">
              Pesquise profissionais em todo o Brasil,<br />
              conheça seus portfólios e libere os contatos<br />
              diretamente somente quando decidir conversar.
            </p>

            {/* Form de Busca Central */}
            <div className="flex w-full justify-center">
              <HomeSearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categorias mais Procuradas */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              O que você precisa fazer hoje?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Selecione uma categoria e veja todos os profissionais disponíveis
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link 
                  key={category.id} 
                  href={`/profissionais?category=${category.slug}`}
                  className="card-premium flex flex-col items-center justify-center p-6 text-center bg-card-custom hover:border-primary-base/50 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-base/5 flex items-center justify-center text-primary-base mb-4 group-hover:bg-primary-base group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    {category.name}
                  </h3>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Como Funciona */}
      <section className="py-24 bg-card-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Simples, Rápido e Descomplicado
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Veja como a conexão é feita diretamente, sem intermediários.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Como funciona para Contratar */}
            <div className="bg-slate-50 dark:bg-slate-900/20 p-8 sm:p-12 rounded-3xl border border-border-custom relative overflow-hidden">
              <span className="text-xs font-bold text-primary-base uppercase bg-primary-base/10 px-3 py-1 rounded-full">
                Para Clientes
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-4 mb-8 text-slate-900 dark:text-white">
                Como contratar um profissional?
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-base text-white font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Faça sua pesquisa</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Busque profissionais qualificados no Brasil por categoria, estado e cidade.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-base text-white font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Analise o perfil público</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Veja anos de experiência, especialidades, regiões atendidas, fotos de portfólios e avaliações.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-base text-white font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Desbloqueie e converse</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Libere o telefone, WhatsApp e e-mail com créditos e negocie diretamente de forma livre.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Como funciona para Trabalhar */}
            <div className="bg-slate-50 dark:bg-slate-900/20 p-8 sm:p-12 rounded-3xl border border-border-custom relative overflow-hidden">
              <span className="text-xs font-bold text-secondary-base uppercase bg-secondary-base/10 px-3 py-1 rounded-full">
                Para Autônomos
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-4 mb-8 text-slate-900 dark:text-white">
                Como conseguir novos clientes?
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-secondary-base text-white font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Crie seu perfil gratuitamente</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Registre suas especialidades, biografia, portfólio de serviços e mude para o status "Disponível".</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-secondary-base text-white font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Seja encontrado na busca</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Clientes pesquisam no Trabalhe Livre e compram créditos para liberar seus dados de contato.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-secondary-base text-white font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Demonstre interesse em vagas</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Veja ofertas de serviços publicadas por clientes na sua área e envie propostas diretas.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Profissionais em Destaque */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Profissionais Disponíveis
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Conecte-se com autônomos prontos para atender suas necessidades.
              </p>
            </div>
            <Link 
              href="/profissionais" 
              className="flex items-center gap-2 text-sm font-bold text-primary-base hover:underline"
            >
              <span>Ver todos os profissionais</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProfessionals.map((prof) => (
              <div key={prof.id} className="card-premium flex flex-col bg-card-custom h-full">
                
                {/* Header do Card */}
                <div className="p-6 pb-4 border-b border-border-custom flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                        Disponível
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                      {prof.professional_name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {prof.city} ({prof.state})
                    </p>
                  </div>

                  {prof.is_verified && (
                    <span className="flex items-center gap-1 bg-primary-base/10 text-primary-base text-[10px] font-bold px-2 py-1 rounded-full">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verificado</span>
                    </span>
                  )}
                </div>

                {/* Corpo do Card */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                    {prof.bio}
                  </p>

                  <div className="flex justify-between items-center text-xs border-t border-border-custom pt-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{prof.rating_avg.toFixed(2)}</span>
                      <span className="text-slate-400 font-normal">({prof.rating_count})</span>
                    </div>
                    <div className="text-slate-400">
                      <strong>{prof.experience_years}</strong> anos exp.
                    </div>
                  </div>
                </div>

                {/* Ação */}
                <div className="p-6 pt-0 border-t border-border-custom">
                  <Link 
                    href={`/profissionais/${prof.id}`}
                    className="w-full btn-premium-primary text-xs mt-4"
                  >
                    Ver Perfil Completo
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Segurança da Plataforma */}
      <section className="py-24 bg-card-custom relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-16 flex flex-col lg:flex-row items-center gap-12 border border-slate-800 shadow-3xl">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-base/10 flex items-center justify-center text-primary-base shrink-0">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-xl sm:text-3xl font-extrabold mb-4">Contratação Segura e Protegida</h3>
              <p className="text-xs sm:text-base text-slate-400 leading-relaxed max-w-3xl">
                Nossa prioridade é a sua segurança. Ofuscamos os contatos públicos de profissionais para evitar spam e garantir privacidade. Somente contratantes autorizados que efetuam o desbloqueio seguro podem acessar os dados. Além disso, as contas e oportunidades publicadas passam por moderação humana rigorosa para barrar golpes e conteúdos indesejados.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
              <Link href="/como-funciona" className="btn-premium-primary w-full text-center">
                Saiba Mais
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Dúvidas Frequentes
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Fique por dentro de todos os detalhes operacionais da plataforma.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* 7. Call To Action (Cadastro) */}
      <section className="py-24 bg-gradient-to-b from-card-custom to-slate-50 dark:to-slate-900/20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Seja você um profissional em busca de liberdade e novas rendas, ou um cliente precisando de soluções rápidas, o Trabalhe Livre é para você.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <Link href="/cadastro/profissional" className="w-full btn-premium-secondary !py-3.5">
              Cadastrar como Profissional
            </Link>
            <Link href="/cadastro/contratante" className="w-full btn-premium-primary !py-3.5">
              Cadastrar como Contratante
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
