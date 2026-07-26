'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BRAZILIAN_STATES, getCitiesByState } from '@/lib/constants/locations'
import { Search, MapPin } from 'lucide-react'

export default function HomeSearchForm() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const handleStateChange = (uf: string) => {
    setSelectedUf(uf)
    setSelectedCity('') // Resetar cidade ao mudar estado
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedUf) params.set('state', selectedUf)
    if (selectedCity) params.set('city', selectedCity)

    router.push(`/profissionais?${params.toString()}`)
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full max-w-4xl bg-card-custom/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-full border border-border-custom shadow-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-2 transition-all duration-300 hover:shadow-primary-base/5"
    >
      
      {/* Serviço */}
      <div className="flex-1 w-full flex items-center gap-3 px-4 border-b sm:border-b-0 sm:border-r border-border-custom pb-3 sm:pb-0">
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input 
          type="text" 
          placeholder="Qual serviço você precisa?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm font-medium border-0 focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Estado */}
      <div className="w-full sm:w-48 flex items-center gap-2 px-4 border-b sm:border-b-0 sm:border-r border-border-custom pb-3 sm:pb-0">
        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <select
          value={selectedUf}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <option value="" className="bg-card-custom">Todo o Brasil</option>
          {BRAZILIAN_STATES.map((state) => (
            <option key={state.uf} value={state.uf} className="bg-card-custom">
              {state.name} ({state.uf})
            </option>
          ))}
        </select>
      </div>

      {/* Cidade */}
      <div className="w-full sm:w-56 flex items-center gap-2 px-4 pb-3 sm:pb-0">
        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedUf}
          className="w-full bg-transparent text-xs font-semibold border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <option value="" className="bg-card-custom">Todas as Cidades</option>
          {selectedUf && getCitiesByState(selectedUf).map((city) => (
            <option key={city} value={city} className="bg-card-custom">
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Botão Buscar */}
      <button 
        type="submit"
        className="w-full sm:w-auto btn-premium-primary !py-3.5 !px-8 !rounded-xl sm:!rounded-full text-sm shrink-0"
      >
        Buscar
      </button>

    </form>
  )
}
