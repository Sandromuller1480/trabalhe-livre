'use client'

import { useState } from 'react'
import { moderateContent, verifyProfessionalDocument } from '@/actions/admin'
import { formatCurrency } from '@/lib/utils/format'
import { 
  ShieldAlert, 
  Check, 
  X, 
  Star, 
  FileText, 
  UserCheck, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Database,
  Calendar,
  AlertTriangle
} from 'lucide-react'

interface ModerationItem {
  id: string
  content_type: string
  target_id: string
  content_text: string
  status: string
  created_at: string
}

interface VerificationItem {
  id: string
  professional_id: string
  professional_name: string
  document_type: string
  document_url: string
  status: string
  created_at: string
}

interface AuditLog {
  id: string
  action: string
  target_type: string
  target_id: string
  created_at: string
  admin_name: string
  details?: any
}

interface Metrics {
  totalRevenue: number
  totalPaymentsCount: number
  professionalsCount: number
  contractorsCount: number
  totalRequestsCount: number
}

interface AdminDashboardClientProps {
  metrics: Metrics
  moderationQueue: ModerationItem[]
  verifications: VerificationItem[]
  auditLogs: AuditLog[]
}

export default function AdminDashboardClient({
  metrics,
  moderationQueue,
  verifications,
  auditLogs,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'moderation' | 'verifications' | 'logs' | 'metrics'>('moderation')
  const [modQueue, setModQueue] = useState(moderationQueue)
  const [verifs, setVerifs] = useState(verifications)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectingType, setRejectingType] = useState<'content' | 'verification' | null>(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const handleModerate = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setLoading(true)
    setActionMessage('')
    try {
      const res = await moderateContent(id, status, notes)
      if (res.success) {
        setModQueue((prev) => prev.filter((item) => item.id !== id))
        setActionMessage('Moderação concluída com sucesso!')
        setRejectingId(null)
        setRejectNotes('')
      } else {
        setActionMessage(res.message)
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Falha ao moderar.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setLoading(true)
    setActionMessage('')
    try {
      const res = await verifyProfessionalDocument(id, status, notes)
      if (res.success) {
        setVerifs((prev) => prev.filter((item) => item.id !== id))
        setActionMessage('Solicitação processada com sucesso!')
        setRejectingId(null)
        setRejectNotes('')
      } else {
        setActionMessage(res.message)
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Falha ao processar verificação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      
      {/* 1. Titulo Painel Admin */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary-base" />
            <span>Painel de Controle Administrativo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Moderação centralizada de oportunidades, bios, selos de verificação e auditorias.</p>
        </div>

        <div className="text-xs font-bold bg-primary-base/10 text-primary-base border border-primary-base/20 px-4 py-2 rounded-xl">
          Super Admin Modo Dev
        </div>
      </div>

      {/* 2. Abas de Navegação */}
      <div className="flex border-b border-border-custom">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-4 px-6 text-xs sm:text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'moderation' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Fila de Moderação ({modQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-4 px-6 text-xs sm:text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'verifications' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Verificações Pendentes ({verifs.length})
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-4 px-6 text-xs sm:text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'metrics' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Métricas & Receitas
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-4 px-6 text-xs sm:text-sm font-extrabold border-b-2 transition-all duration-200 ${activeTab === 'logs' ? 'border-primary-base text-primary-base' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Logs de Auditoria
        </button>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-100 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 3. Renderização Condicional de Abas */}
      
      {/* ABA 1: Fila de Moderação */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          {modQueue.length === 0 ? (
            <div className="card-premium bg-card-custom p-16 border border-border-custom text-center">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h4 className="font-extrabold text-sm mb-1">Tudo em ordem!</h4>
              <p className="text-xs text-slate-400">Não existem conteúdos pendentes de moderação manual na fila.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {modQueue.map((item) => (
                <div key={item.id} className="card-premium bg-card-custom p-6 border border-border-custom flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-base/10 text-primary-base px-2.5 py-0.5 rounded">
                        {item.content_type === 'service_request' ? 'Oportunidade de Serviço' : 'Biografia de Perfil'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Criado em: {new Date(item.created_at).toLocaleDateString('pt-BR')} {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border-custom max-w-4xl whitespace-pre-line">
                      {item.content_text}
                    </p>
                  </div>

                  <div className="flex md:flex-col justify-end gap-3 shrink-0 items-end">
                    <button
                      onClick={() => handleModerate(item.id, 'approved')}
                      disabled={loading}
                      className="btn-premium-secondary !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aprovar</span>
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(item.id)
                        setRejectingType('content')
                      }}
                      disabled={loading}
                      className="btn-premium-outline !py-2.5 !px-5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30 flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Rejeitar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: Pedidos de Verificação de Documento */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          {verifs.length === 0 ? (
            <div className="card-premium bg-card-custom p-16 border border-border-custom text-center">
              <UserCheck className="w-12 h-12 text-primary-base mx-auto mb-4" />
              <h4 className="font-extrabold text-sm mb-1">Nenhum pedido pendente</h4>
              <p className="text-xs text-slate-400">Todas as solicitações de selo de verificação já foram analisadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {verifs.map((item) => (
                <div key={item.id} className="card-premium bg-card-custom p-6 border border-border-custom flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-1 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                        Selo Verificado
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{item.professional_name}</h4>
                      <p className="text-xs text-slate-400">
                        Tipo de documento fornecido: <strong className="text-slate-600 dark:text-slate-300">{item.document_type}</strong>
                      </p>
                      <div className="border border-border-custom p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs flex items-center justify-between">
                        <span className="text-slate-400 font-bold">Arquivo anexado (RG/CNH):</span>
                        <a 
                          href={item.document_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-base font-extrabold hover:underline"
                        >
                          Visualizar Documento Fictício
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-3 shrink-0 items-end">
                    <button
                      onClick={() => handleVerify(item.id, 'approved')}
                      disabled={loading}
                      className="btn-premium-secondary !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aprovar Selo</span>
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(item.id)
                        setRejectingType('verification')
                      }}
                      disabled={loading}
                      className="btn-premium-outline !py-2.5 !px-5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30 flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Recusar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: Métricas & Receitas */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Faturamento */}
          <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Faturamento Total</span>
              <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{formatCurrency(metrics.totalRevenue)}</strong>
              <span className="text-[9px] text-slate-400 font-semibold block">Compras + Taxas de vagas</span>
            </div>
          </div>

          {/* Transações */}
          <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total de Transações</span>
              <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{metrics.totalPaymentsCount} pagamentos</strong>
            </div>
          </div>

          {/* Usuários */}
          <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary-base/10 text-primary-base flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Usuários Registrados</span>
              <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {metrics.professionalsCount + metrics.contractorsCount}
              </strong>
              <span className="text-[10px] text-slate-400 block">{metrics.professionalsCount} profs / {metrics.contractorsCount} clis</span>
            </div>
          </div>

          {/* Oportunidades */}
          <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Total de Vagas</span>
              <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{metrics.totalRequestsCount} publicações</strong>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: Logs de Auditoria */}
      {activeTab === 'logs' && (
        <div className="card-premium bg-card-custom border border-border-custom overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-custom bg-slate-50 dark:bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Data/Hora</th>
                  <th className="p-4 sm:p-5">Administrador</th>
                  <th className="p-4 sm:p-5">Ação Realizada</th>
                  <th className="p-4 sm:p-5">Origem</th>
                  <th className="p-4 sm:p-5">Notas / Detalhes</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-500 font-semibold">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">Nenhum log de auditoria disponível.</td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border-custom hover:bg-slate-50 dark:hover:bg-slate-900/10">
                      <td className="p-4 sm:p-5 font-semibold text-slate-400">
                        {new Date(log.created_at).toLocaleDateString('pt-BR')} {new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-slate-850 dark:text-slate-150">{log.admin_name}</td>
                      <td className="p-4 sm:p-5 font-extrabold text-primary-base">{log.action}</td>
                      <td className="p-4 sm:p-5 font-bold">{log.target_type}</td>
                      <td className="p-4 sm:p-5 text-[11px] truncate max-w-xs">{log.details ? JSON.stringify(log.details) : 'Nenhum'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE JUSTIFICATIVA DE REJEIÇÃO */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRejectingId(null)}></div>
          
          <div className="relative bg-card-custom p-6 sm:p-8 rounded-3xl border border-border-custom shadow-2xl max-w-md w-full space-y-6 text-slate-800 dark:text-slate-100">
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Justificar Rejeição</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Escreva o motivo da recusa. O usuário será notificado desse texto explicativo.</p>
            </div>

            <textarea
              rows={4}
              placeholder="Ex: O conteúdo infringe os termos de uso por publicar link externo WhatsApp na biografia pública."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-border-custom bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-semibold"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setRejectingId(null)}
                disabled={loading}
                className="w-1/3 btn-premium-outline text-xs py-3"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  if (rejectingType === 'content') {
                    handleModerate(rejectingId, 'rejected', rejectNotes)
                  } else {
                    handleVerify(rejectingId, 'rejected', rejectNotes)
                  }
                }}
                disabled={loading || !rejectNotes.trim()}
                className="w-2/3 btn-premium-primary !bg-red-600 hover:!bg-red-750 text-xs py-3 font-bold"
              >
                {loading ? 'Confirmando...' : 'Confirmar Rejeição'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
