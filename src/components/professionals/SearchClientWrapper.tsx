'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BRAZILIAN_STATES, getCitiesByState } from '@/lib/constants/locations'
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle, 
  SlidersHorizontal, 
  Briefcase, 
  ChevronRight,
  Sparkles,
  UserCheck
} from 'lucide-react'

interface Professional {
  id: string
  full_name: string
  professional_name: string
  category_id: string
  bio: string
  experience_years: number
  state: string
  city: string
  neighborhood: string
  availability: string
  rating_avg: number
  rating_count: number
  is_verified: boolean
  is_remote: boolean
  is_presential: boolean
  is_emergency: boolean
}

interface SearchClientWrapperProps {
  initialProfessionals: Professional[]
  categories: any[]
}

export default function SearchClientWrapper({ 
  initialProfessionals, 
  categories 
}: SearchClientWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedUf, setSelectedUf] = useState(searchParams.get('state') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  
  const [isVerified, setIsVerified] = useState(searchParams.get('is_verified') === 'true')
  const [isRemote, setIsRemote] = useState(searchParams.get('is_remote') === 'true')
  const [isPresential, setIsPresential] = useState(searchParams.get('is_presential') === 'true')
  const [isEmergency, setIsEmergency] = useState(searchParams.get('is_emergency') === 'true')
  const [onlyAvailable, setOnlyAvailable] = useState(searchParams.get('availability') === 'available')
  
  const [orderBy, setOrderBy] = useState(searchParams.get('orderBy') || 'relevance')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Sincronizar estados com URL ao mudar
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setSelectedCategory(searchParams.get('category') || '')
    setSelectedUf(searchParams.get('state') || '')
    setSelectedCity(searchParams.get('city') || '')
    setIsVerified(searchParams.get('is_verified') === 'true')
    setIsRemote(searchParams.get('is_remote') === 'true')
    setIsPresential(searchParams.get('is_presential') === 'true')
    setIsEmergency(searchParams.get('is_emergency') === 'true')
    setOnlyAvailable(searchParams.get('availability') === 'available')
    setOrderBy(searchParams.get('orderBy') || 'relevance')
  }, [searchParams])

  const applyFilters = (updates: Record<string, string | boolean>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, val]) => {
      if (val === '' || val === false || val === undefined) {
        params.delete(key)
      } else {
        params.set(key, String(val))
      }
    })

    router.push(`/profissionais?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters({ q: query })
  }

  const handleStateChange = (uf: string) => {
    setSelectedUf(uf)
    setSelectedCity('')
    applyFilters({ state: uf, city: '' })
  }

  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId || c.slug === catId)
    return found ? found.name : 'Outros Serviços'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
        <Link href="/" className="hover:text-primary-base transition-colors">Início</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-500">Buscar Profissionais</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* =========================================================================
           PAINEL DE FILTROS - DESKTOP
           ========================================================================= */}
        <aside className="hidden lg:block w-72 bg-card-custom p-6 rounded-2xl border border-border-custom shadow-sm shrink-0 sticky top-24">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-custom">
            <SlidersHorizontal className="w-5 h-5 text-primary-base" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Filtros</h3>
          </div>

          <div className="space-y-6">
            
            {/* Categoria */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => applyFilters({ category: e.target.value })}
                className="w-full text-xs font-semibold p-3 border border-border-custom rounded-lg bg-transparent cursor-pointer"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Estado</label>
              <select
                value={selectedUf}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-border-custom rounded-lg bg-transparent cursor-pointer"
              >
                <option value="">Brasil inteiro</option>
                {BRAZILIAN_STATES.map((state) => (
                  <option key={state.uf} value={state.uf}>{state.name} ({state.uf})</option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Cidade</label>
              <select
                value={selectedCity}
                disabled={!selectedUf}
                onChange={(e) => applyFilters({ city: e.target.value })}
                className="w-full text-xs font-semibold p-3 border border-border-custom rounded-lg bg-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">Todas as cidades</option>
                {selectedUf && getCitiesByState(selectedUf).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Atendimento e Perfil */}
            <div className="border-t border-border-custom pt-6 space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Atendimento & Perfil</h4>
              
              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={onlyAvailable}
                  onChange={(e) => applyFilters({ availability: e.target.checked ? 'available' : '' })}
                  className="rounded text-primary-base focus:ring-primary-base w-4 h-4 border-slate-300"
                />
                <span>Apenas Disponíveis</span>
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isVerified}
                  onChange={(e) => applyFilters({ is_verified: e.target.checked })}
                  className="rounded text-primary-base focus:ring-primary-base w-4 h-4 border-slate-300"
                />
                <span>Perfil Verificado</span>
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPresential}
                  onChange={(e) => applyFilters({ is_presential: e.target.checked })}
                  className="rounded text-primary-base focus:ring-primary-base w-4 h-4 border-slate-300"
                />
                <span>Atendimento Presencial</span>
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isRemote}
                  onChange={(e) => applyFilters({ is_remote: e.target.checked })}
                  className="rounded text-primary-base focus:ring-primary-base w-4 h-4 border-slate-300"
                />
                <span>Atendimento Remoto</span>
              </label>

              <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isEmergency}
                  onChange={(e) => applyFilters({ is_emergency: e.target.checked })}
                  className="rounded text-primary-base focus:ring-primary-base w-4 h-4 border-slate-300"
                />
                <span>Atendimento Emergencial</span>
              </label>
            </div>

          </div>
        </aside>

        {/* =========================================================================
           RESULTADOS E BUSCA TEXTUAL
           ========================================================================= */}
        <section className="flex-1 w-full">
          
          {/* Caixa de Pesquisa e Filtros Rápidos Mobile */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Pesquisar por nome ou palavra-chave..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:ring-2 focus:ring-primary-base text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
              
              {/* Botão para abrir filtros no mobile */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 border border-border-custom bg-card-custom rounded-xl font-bold text-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </button>

              {/* Ordenação */}
              <select
                value={orderBy}
                onChange={(e) => applyFilters({ orderBy: e.target.value })}
                className="px-4 py-3 border border-border-custom bg-card-custom rounded-xl font-bold text-xs cursor-pointer focus:outline-none"
              >
                <option value="relevance">Melhor Avaliados</option>
                <option value="experience">Mais Experientes</option>
              </select>

            </div>
          </div>

          {/* Listagem de Resultados */}
          {initialProfessionals.length === 0 ? (
            <div className="card-premium flex flex-col items-center justify-center p-12 sm:p-20 text-center bg-card-custom">
              <Briefcase className="w-16 h-16 text-slate-300 mb-6" />
              <h3 className="font-extrabold text-lg mb-2">Nenhum profissional encontrado</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                Tente ajustar os filtros ou pesquisar por outra palavra-chave para encontrar prestadores na sua região.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {initialProfessionals.map((prof) => (
                <div key={prof.id} className="card-premium flex flex-col justify-between bg-card-custom h-full">
                  
                  {/* Header */}
                  <div className="p-6 pb-4 border-b border-border-custom">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${prof.availability === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${prof.availability === 'available' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {prof.availability === 'available' ? 'Disponível' : 'Ocupado'}
                        </span>
                      </div>
                      
                      {prof.is_verified && (
                        <span className="flex items-center gap-1 bg-primary-base/10 text-primary-base text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" />
                          <span>Verificado</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                      {prof.professional_name || prof.full_name}
                    </h3>
                    <p className="text-xs text-primary-base font-bold mt-1">
                      {getCategoryName(prof.category_id)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{prof.city} ({prof.state})</span>
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6">
                      {prof.bio || 'Profissional qualificado pronto para atendê-lo.'}
                    </p>

                    <div className="flex justify-between items-center text-xs border-t border-border-custom pt-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{prof.rating_avg.toFixed(2)}</span>
                        <span className="text-slate-400 font-normal">({prof.rating_count})</span>
                      </div>
                      <div className="text-slate-400 font-medium">
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
          )}

        </section>

      </div>

      {/* =========================================================================
         MODAL DE FILTROS - MOBILE (DRAWER)
         ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          
          <aside className="relative w-80 max-w-xs h-full bg-card-custom p-6 border-l border-border-custom shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-custom">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary-base" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Filtros</h3>
                </div>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">Fechar</button>
              </div>

              <div className="space-y-6">
                {/* Categoria */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => applyFilters({ category: e.target.value })}
                    className="w-full text-xs font-semibold p-3 border border-border-custom rounded-lg bg-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Estado</label>
                  <select
                    value={selectedUf}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-border-custom rounded-lg bg-transparent"
                  >
                    <option value="">Brasil inteiro</option>
                    {BRAZILIAN_STATES.map((state) => (
                      <option key={state.uf} value={state.uf}>{state.name} ({state.uf})</option>
                    ))}
                  </select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Cidade</label>
                  <select
                    value={selectedCity}
                    disabled={!selectedUf}
                    onChange={(e) => applyFilters({ city: e.target.value })}
                    className="w-full text-xs font-semibold p-3 border border-border-custom rounded-lg bg-transparent"
                  >
                    <option value="">Todas as cidades</option>
                    {selectedUf && getCitiesByState(selectedUf).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Atendimento */}
                <div className="border-t border-border-custom pt-6 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase text-slate-400">Atendimento & Perfil</h4>
                  
                  <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={onlyAvailable}
                      onChange={(e) => applyFilters({ availability: e.target.checked ? 'available' : '' })}
                      className="rounded text-primary-base focus:ring-primary-base w-4 h-4"
                    />
                    <span>Apenas Disponíveis</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={isVerified}
                      onChange={(e) => applyFilters({ is_verified: e.target.checked })}
                      className="rounded text-primary-base focus:ring-primary-base w-4 h-4"
                    />
                    <span>Perfil Verificado</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={isPresential}
                      onChange={(e) => applyFilters({ is_presential: e.target.checked })}
                      className="rounded text-primary-base focus:ring-primary-base w-4 h-4"
                    />
                    <span>Atendimento Presencial</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={isRemote}
                      onChange={(e) => applyFilters({ is_remote: e.target.checked })}
                      className="rounded text-primary-base focus:ring-primary-base w-4 h-4"
                    />
                    <span>Atendimento Remoto</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={isEmergency}
                      onChange={(e) => applyFilters({ is_emergency: e.target.checked })}
                      className="rounded text-primary-base focus:ring-primary-base w-4 h-4"
                    />
                    <span>Atendimento Emergencial</span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="btn-premium-primary w-full text-xs mt-8"
            >
              Aplicar Filtros
            </button>
          </aside>
        </div>
      )}

    </div>
  )
}
