'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { unlockProfessionalContact } from '@/actions/contractor'
import { getInitials, formatPhone } from '@/lib/utils/format'
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  UserCheck, 
  Lock, 
  MessageSquare,
  Mail, 
  Phone, 
  Globe, 
  Map, 
  AlertCircle,
  FileText,
  Briefcase,
  Truck,
  Wrench,
  Calendar,
  ThumbsUp
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description?: string
  image_url: string
  is_before_after: boolean
  image_after_url?: string
  service_date?: string
  city?: string
}

interface Review {
  id: string
  rating: number
  comment?: string
  created_at: string
  full_name: string // Nome do contratante
}

interface ProfileDetailClientProps {
  professional: any
  portfolioItems: PortfolioItem[]
  reviews: Review[]
  userRole: string | null
  initialUnlocked: boolean
  initialContactInfo: any | null
  contractorCredits: number
}

export default function ProfileDetailClient({
  professional,
  portfolioItems,
  reviews,
  userRole,
  initialUnlocked,
  initialContactInfo,
  contractorCredits,
}: ProfileDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'bio' | 'portfolio' | 'reviews'>('bio')
  const [unlocked, setUnlocked] = useState(initialUnlocked)
  const [contactInfo, setContactInfo] = useState<any>(initialContactInfo)
  const [credits, setCredits] = useState(contractorCredits)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleUnlock = async () => {
    if (credits < 1) {
      setErrorMsg('Saldo insuficiente. Por favor, adquira mais créditos na sua carteira.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    
    try {
      const res = await unlockProfessionalContact(professional.id)
      if (res.success && res.data) {
        setUnlocked(true)
        setContactInfo(res.data)
        setCredits((prev) => prev - 1)
      } else {
        setErrorMsg(res.message || 'Falha ao desbloquear contato.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado ao desbloquear.')
    } finally {
      setLoading(false)
    }
  }

  // Opções de atendimento para renderizar tags
  const options = [
    { label: 'Atendimento Presencial', checked: professional.is_presential, icon: MapPin },
    { label: 'Atendimento Remoto', checked: professional.is_remote, icon: Globe },
    { label: 'Atendimento Residencial', checked: professional.is_residential, icon: MapPin },
    { label: 'Atendimento Comercial', checked: professional.is_commercial, icon: Briefcase },
    { label: 'Atendimento Emergencial (24h)', checked: professional.is_emergency, icon: Clock },
    { label: 'Trabalha Finais de Semana', checked: professional.work_weekends, icon: Calendar },
    { label: 'Trabalha Período Noturno', checked: professional.work_night, icon: Clock },
    { label: 'Possui Veículo Próprio', checked: professional.has_vehicle, icon: Truck },
    { label: 'Possui Ferramentas Próprias', checked: professional.has_tools, icon: Wrench },
    { label: 'Emite Nota Fiscal', checked: professional.issues_invoice, icon: FileText },
    { label: 'Profissional MEI', checked: professional.has_mei, icon: ShieldCheck },
  ]

  const activeOptions = options.filter(opt => opt.checked)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* 1. Header do Perfil */}
      <div className="card-premium bg-card-custom p-6 sm:p-10 mb-10 overflow-visible relative">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          
          {/* Avatar com Letras Iniciais */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-primary-base/10 text-primary-base text-3xl font-extrabold flex items-center justify-center border-2 border-primary-base/20 shadow-inner shrink-0 animate-fade-in">
            {getInitials(professional.professional_name || professional.full_name)}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${professional.availability === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className={`text-xs font-extrabold uppercase tracking-wider ${professional.availability === 'available' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {professional.availability === 'available' ? 'Disponível' : professional.availability === 'busy' ? 'Ocupado' : 'Disponibilidade Não Confirmada'}
                </span>
              </div>

              {professional.is_verified && (
                <span className="flex items-center gap-1 bg-primary-base/10 text-primary-base text-[10px] font-bold px-3 py-1 rounded-full">
                  <UserCheck className="w-4 h-4" />
                  <span>Selo Verificado por Documentos</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {professional.professional_name || professional.full_name}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-semibold">
              <span className="text-primary-base bg-primary-base/5 px-3 py-1 rounded-lg">
                {professional.category_name}
              </span>
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {professional.city} ({professional.state})
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{professional.rating_avg.toFixed(2)}</span>
                <span className="text-slate-400 font-normal">({professional.rating_count} avaliações)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Conteúdo em Duas Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Coluna Esquerda: Informações Gerais & Tags */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Informações Básicas do Profissional */}
          <div className="card-premium bg-card-custom p-6 border border-border-custom">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 mb-4">Informações Gerais</h3>
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex justify-between border-b border-border-custom pb-3">
                <span className="text-slate-400">Tempo de Experiência:</span>
                <span>{professional.experience_years} anos</span>
              </div>
              <div className="flex justify-between border-b border-border-custom pb-3">
                <span className="text-slate-400">Raio de Atendimento:</span>
                <span>Até {professional.max_distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cidade Base:</span>
                <span>{professional.city} - {professional.state}</span>
              </div>
            </div>
          </div>

          {/* Características e Diferenciais */}
          {activeOptions.length > 0 && (
            <div className="card-premium bg-card-custom p-6 border border-border-custom">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 mb-6">Diferenciais</h3>
              <ul className="space-y-4">
                {activeOptions.map((opt, i) => {
                  const Icon = opt.icon
                  return (
                    <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <span>{opt.label}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Coluna Direita: Tabs e Detalhes Interativos */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Menu de Tabs */}
          <div className="flex border-b border-border-custom">
            <button
              onClick={() => setActiveTab('bio')}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'bio' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Biografia
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'portfolio' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Portfólio ({portfolioItems.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'reviews' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Avaliações ({reviews.length})
            </button>
          </div>

          {/* TAB: Biografia */}
          {activeTab === 'bio' && (
            <div className="card-premium bg-card-custom p-8 border border-border-custom space-y-6">
              <h3 className="text-lg font-extrabold">Sobre o Profissional</h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {professional.bio || 'Este profissional ainda não preencheu uma biografia pública.'}
              </p>
            </div>
          )}

          {/* TAB: Portfólio */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              {portfolioItems.length === 0 ? (
                <div className="card-premium bg-card-custom p-12 border border-border-custom text-center">
                  <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-extrabold text-sm mb-1">Nenhum serviço cadastrado</h4>
                  <p className="text-xs text-slate-400">Esse profissional ainda não adicionou fotos de seus trabalhos anteriores ao portfólio.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="card-premium bg-card-custom overflow-hidden border border-border-custom group">
                      
                      {/* Imagens (Antes e Depois vs Normal) */}
                      {item.is_before_after && item.image_after_url ? (
                        <div className="grid grid-cols-2 h-48 bg-slate-900 border-b border-border-custom overflow-hidden">
                          <div className="relative h-full w-full border-r border-slate-800">
                            <img 
                              src={item.image_url} 
                              alt={`${item.title} (Antes)`}
                              className="object-cover w-full h-full"
                            />
                            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">Antes</span>
                          </div>
                          <div className="relative h-full w-full">
                            <img 
                              src={item.image_after_url} 
                              alt={`${item.title} (Depois)`}
                              className="object-cover w-full h-full"
                            />
                            <span className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">Depois</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 overflow-hidden bg-slate-900 border-b border-border-custom relative">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Descrições do Item */}
                      <div className="p-6 space-y-2">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                        )}
                        {item.service_date && (
                          <p className="text-[10px] text-slate-400 font-semibold pt-2">
                            Realizado em: {new Date(item.service_date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Avaliações */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="card-premium bg-card-custom p-12 border border-border-custom text-center">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-extrabold text-sm mb-1">Nenhuma avaliação realizada</h4>
                  <p className="text-xs text-slate-400">Seja o primeiro a contratar este profissional e avaliar seus serviços.</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="card-premium bg-card-custom p-6 border border-border-custom flex gap-4">
                    {/* Avatar Contratante */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {getInitials(rev.full_name)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{rev.full_name}</h4>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {rev.comment && (
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{rev.comment}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* =========================================================================
             PAINEL DE DESBLOQUEIO DE CONTATO
             ========================================================================= */}
          <div className="card-premium bg-card-custom p-8 border-2 border-primary-base/20 relative overflow-hidden">
            
            {/* Background Decorativo */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-base/5 rounded-bl-full pointer-events-none"></div>

            {unlocked && contactInfo ? (
              // Contato Revelado
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-500">
                  <UserCheck className="w-5 h-5" />
                  <h3 className="font-extrabold text-base">Dados de Contato Desbloqueados!</h3>
                </div>
                
                <p className="text-xs text-slate-400">
                  Você já pode negociar os detalhes do serviço por telefone ou mandar mensagem direta no WhatsApp.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp Link */}
                  {contactInfo.phone && (
                    <a
                      href={`https://wa.me/55${contactInfo.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-premium-secondary flex items-center justify-center gap-2 py-3 text-xs w-full"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Falar no WhatsApp</span>
                    </a>
                  )}

                  {/* Telefone Fone */}
                  {contactInfo.phone && (
                    <a
                      href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                      className="btn-premium-primary flex items-center justify-center gap-2 py-3 text-xs w-full"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Ligar: {formatPhone(contactInfo.phone)}</span>
                    </a>
                  )}
                </div>

                {/* E-mail e Endereço */}
                <div className="space-y-3 pt-4 border-t border-border-custom text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {contactInfo.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>E-mail: <a href={`mailto:${contactInfo.email}`} className="text-primary-base hover:underline">{contactInfo.email}</a></span>
                    </div>
                  )}

                  {contactInfo.address_hidden && (
                    <div className="flex items-start gap-3">
                      <Map className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>Endereço de Base: {contactInfo.address_hidden}</span>
                    </div>
                  )}

                  {/* Links de Redes Sociais se houver */}
                  {(contactInfo.website || contactInfo.instagram || contactInfo.facebook) && (
                    <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-primary-base">
                      {contactInfo.website && (
                        <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" /> Site
                        </a>
                      )}
                      {contactInfo.instagram && (
                        <a href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Instagram
                        </a>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              // Contato Bloqueado
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <h3 className="font-extrabold text-base">Contato Ocultado</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Para falar diretamente com este profissional, desbloqueie seus contatos. Isso consumirá <strong className="text-primary-base">1 crédito</strong> de sua carteira. O contato ficará desbloqueado para sempre para você.
                </p>

                {/* Visualização de acordo com a Role do Usuário */}
                {!userRole ? (
                  // Deslogado
                  <div className="flex flex-col gap-4">
                    <Link href="/login" className="btn-premium-primary text-xs w-full text-center">
                      Fazer Login para Desbloquear
                    </Link>
                    <p className="text-[10px] text-slate-400 text-center">
                      Não possui conta? <Link href="/cadastro/contratante" className="text-primary-base font-bold hover:underline">Cadastre-se como contratante</Link>
                    </p>
                  </div>
                ) : userRole === 'professional' ? (
                  // Logado como Profissional
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span>Como profissional autônomo cadastrado, você não pode realizar desbloqueios de contato.</span>
                  </div>
                ) : (
                  // Logado como Contratante
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-border-custom">
                      <div className="text-xs">
                        <span className="text-slate-400 font-semibold">Seu Saldo Atual:</span>
                        <strong className="block text-sm text-slate-800 dark:text-slate-200 mt-0.5">{credits} Créditos</strong>
                      </div>
                      
                      <Link 
                        href="/contratante/carteira"
                        className="text-xs font-extrabold text-primary-base hover:underline flex items-center gap-1"
                      >
                        Comprar Créditos
                      </Link>
                    </div>

                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {credits >= 1 ? (
                      <button
                        onClick={handleUnlock}
                        disabled={loading}
                        className="w-full btn-premium-accent flex items-center justify-center gap-2 py-3.5 text-xs font-extrabold"
                      >
                        {loading ? 'Processando...' : 'Desbloquear Dados (1 crédito)'}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 border border-amber-100 dark:border-amber-900/30">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Você não possui créditos suficientes na sua carteira para este desbloqueio.</span>
                        </div>
                        <Link 
                          href="/contratante/carteira"
                          className="w-full btn-premium-primary flex items-center justify-center gap-2 py-3.5 text-xs font-extrabold"
                        >
                          Ir Adquirir Créditos (R$ 5,00)
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
