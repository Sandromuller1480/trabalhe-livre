'use client'

import { useState } from 'react'
import { updateAvailability } from '@/actions/professional'
import { formatPhone, getInitials } from '@/lib/utils/format'
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Star, 
  Unlock, 
  Briefcase, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Bell,
  MessageSquare,
  AlertCircle
} from 'lucide-react'

interface UnlockLog {
  id: string
  created_at: string
  contractor_name: string
  contractor_phone: string
  contractor_email: string
}

interface Notification {
  id: string
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

interface ProfessionalDashboardClientProps {
  profile: any
  unlocks: UnlockLog[]
  interestsCount: number
  notifications: Notification[]
}

export default function ProfessionalDashboardClient({
  profile,
  unlocks,
  interestsCount,
  notifications,
}: ProfessionalDashboardClientProps) {
  const [availability, setAvailability] = useState(profile.availability || 'unconfirmed')
  const [forecastDate, setForecastDate] = useState(profile.availability_forecast || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleUpdateAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await updateAvailability(availability, forecastDate)
      if (res.success) {
        setMessage({ type: 'success', text: res.message })
      } else {
        setMessage({ type: 'error', text: res.message })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Falha ao atualizar status.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      
      {/* 1. Saudação do Profissional */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Olá, {profile.professional_name || 'Profissional'}!</h2>
          <p className="text-xs text-slate-400 mt-1">Bem-vindo ao seu painel de controle do Trabalhe Livre.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
          <span className={`w-3 h-3 rounded-full ${availability === 'available' ? 'bg-emerald-500 animate-pulse' : availability === 'busy' ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Status: {availability === 'available' ? 'Disponível' : availability === 'busy' ? 'Ocupado' : 'Não Confirmado'}
          </span>
        </div>
      </div>

      {/* 2. Grid de Métricas / Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Total Desbloqueios */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary-base/10 text-primary-base flex items-center justify-center shrink-0">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Perfil Desbloqueado</span>
            <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{unlocks.length} vezes</strong>
          </div>
        </div>

        {/* Card: Nota Média */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Nota Média</span>
            <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{profile.rating_avg.toFixed(2)}</strong>
            <span className="text-[10px] text-slate-400 block">Baseada em {profile.rating_count} avaliações</span>
          </div>
        </div>

        {/* Card: Candidaturas Ativas */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Candidaturas Ativas</span>
            <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{interestsCount} propostas</strong>
          </div>
        </div>

      </div>

      {/* 3. Coluna de Ação: Toggles de Disponibilidade & Notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Painel de Status de Disponibilidade */}
        <div className="card-premium bg-card-custom p-6 sm:p-8 border border-border-custom lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-extrabold">Configurar Disponibilidade</h3>
            <p className="text-xs text-slate-400 mt-1">Gerencie como você aparece nas pesquisas de contratantes.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateAvailability} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Botão Disponível */}
              <button
                type="button"
                onClick={() => { setAvailability('available'); setForecastDate(''); }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${availability === 'available' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-md font-bold' : 'border-border-custom bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-500'}`}
              >
                <CheckCircle className="w-8 h-8 mb-2" />
                <span className="text-sm">Disponível</span>
                <span className="text-[10px] opacity-75 mt-1">Aparece na busca de clientes</span>
              </button>

              {/* Botão Ocupado */}
              <button
                type="button"
                onClick={() => setAvailability('busy')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${availability === 'busy' ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 shadow-md font-bold' : 'border-border-custom bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-500'}`}
              >
                <XCircle className="w-8 h-8 mb-2" />
                <span className="text-sm">Ocupado</span>
                <span className="text-[10px] opacity-75 mt-1">Oculta temporariamente seu perfil</span>
              </button>

              {/* Botão Não Confirmado */}
              <button
                type="button"
                onClick={() => { setAvailability('unconfirmed'); setForecastDate(''); }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${availability === 'unconfirmed' ? 'border-slate-500 bg-slate-500/10 text-slate-700 dark:text-slate-400 shadow-md font-bold' : 'border-border-custom bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-500'}`}
              >
                <HelpCircle className="w-8 h-8 mb-2" />
                <span className="text-sm">Não Confirmado</span>
                <span className="text-[10px] opacity-75 mt-1">Status padrão pós cadastro</span>
              </button>
            </div>

            {/* Campo Previsão de Retorno se Ocupado */}
            {availability === 'busy' && (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-xs font-bold text-slate-400 uppercase">Previsão de Retorno / Liberação de Agenda</label>
                <input
                  type="date"
                  value={forecastDate}
                  onChange={(e) => setForecastDate(e.target.value)}
                  className="p-3 border border-border-custom rounded-xl bg-transparent text-sm w-full focus:outline-none focus:ring-2 focus:ring-secondary-base"
                />
                <p className="text-[10px] text-slate-400">Essa data ajudará os clientes a saberem quando você estará livre novamente para novos trabalhos.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-premium-secondary text-xs !py-3.5 !px-8"
            >
              {loading ? 'Salvando...' : 'Salvar Alteração de Status'}
            </button>

          </form>
        </div>

        {/* Notificações do Profissional */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 border-b border-border-custom pb-4">
            <Bell className="w-5 h-5 text-secondary-base" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Alertas & Avisos</h3>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Nenhuma notificação nova no momento.</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-3 rounded-xl border border-border-custom bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{notif.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{notif.message}</p>
                  <span className="text-[9px] text-slate-400 font-semibold block pt-1">
                    {new Date(notif.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 4. Clientes Interessados (Contatos Desbloqueados) */}
      <div className="card-premium bg-card-custom p-6 sm:p-8 border border-border-custom">
        <div className="border-b border-border-custom pb-4 mb-6">
          <h3 className="text-lg font-extrabold">Clientes Interessados</h3>
          <p className="text-xs text-slate-400 mt-1">Contratantes que desbloquearam seus dados de contato para negociar serviços.</p>
        </div>

        {unlocks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Unlock className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <span>Nenhum cliente desbloqueou seus contatos ainda. Melhore sua biografia e portfólio para atrair atenção!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlocks.map((unlock) => (
              <div key={unlock.id} className="p-5 rounded-2xl border border-border-custom bg-slate-50 dark:bg-slate-900/40 flex flex-col justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-base/10 text-primary-base flex items-center justify-center font-bold text-xs">
                      {getInitials(unlock.contractor_name)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100">{unlock.contractor_name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Desbloqueou em: {new Date(unlock.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 space-y-2 border-t border-border-custom text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{unlock.contractor_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatPhone(unlock.contractor_phone)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <a
                    href={`https://wa.me/55${unlock.contractor_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium-secondary !py-2 text-[10px] font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${unlock.contractor_phone.replace(/\D/g, '')}`}
                    className="btn-premium-primary !py-2 text-[10px] font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ligar</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
