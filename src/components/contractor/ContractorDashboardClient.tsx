'use client'

import { useState } from 'react'
import { buyCredits } from '@/actions/contractor'
import { formatPhone, formatCurrency } from '@/lib/utils/format'
import Link from 'next/link'
import { 
  Wallet, 
  Unlock, 
  FileText, 
  PlusCircle, 
  Search, 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  DollarSign
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  status: 'awaiting_moderation' | 'published' | 'rejected' | 'finished'
  city: string
  state: string
  created_at: string
}

interface UnlockedProf {
  id: string
  professional_name: string
  category_name: string
  phone: string
  email: string
  city: string
  state: string
  unlocked_at: string
}

interface ContractorDashboardClientProps {
  contractorName: string
  credits: number
  opportunities: Opportunity[]
  unlockedProfessionals: UnlockedProf[]
}

const CREDIT_PACKAGES = [
  { id: 'bronze', name: 'Bronze', credits: 1, price: 5.00, discount: 'Preço padrão' },
  { id: 'prata', name: 'Prata', credits: 5, price: 20.00, discount: 'Economize 20%' },
  { id: 'ouro', name: 'Ouro (Melhor Custo)', credits: 10, price: 30.00, discount: 'Economize 40%' },
]

export default function ContractorDashboardClient({
  contractorName,
  credits,
  opportunities,
  unlockedProfessionals,
}: ContractorDashboardClientProps) {
  const [walletCredits, setWalletCredits] = useState(credits)
  const [selectedPkg, setSelectedPkg] = useState<typeof CREDIT_PACKAGES[0] | null>(null)
  const [payMethod, setPayMethod] = useState<'pix' | 'credit_card'>('pix')
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'simulated_gateway' | 'success'>('details')
  const [message, setMessage] = useState('')

  const handleStartCheckout = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPkg(pkg)
    setCheckoutStep('details')
    setCheckoutModalOpen(true)
    setMessage('')
  }

  const handleSimulatePayment = async () => {
    if (!selectedPkg) return
    setLoading(true)
    setMessage('')

    try {
      const res = await buyCredits(selectedPkg.id, payMethod)
      if (res.success) {
        setWalletCredits((prev) => prev + selectedPkg.credits)
        setCheckoutStep('success')
      } else {
        setCheckoutStep('details')
        setMessage(res.message)
      }
    } catch (err: any) {
      setCheckoutStep('details')
      setMessage(err.message || 'Falha ao processar pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      
      {/* 1. Saudação do Contratante */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Olá, {contractorName}!</h2>
          <p className="text-xs text-slate-400 mt-1">Gerencie suas contratações, vagas e créditos de forma simples.</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cadastro/oportunidade" className="btn-premium-accent text-xs flex items-center gap-1.5 !py-3">
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Vaga (R$ 5,00)</span>
          </Link>
          <Link href="/profissionais" className="btn-premium-primary text-xs flex items-center gap-1.5 !py-3">
            <Search className="w-4 h-4" />
            <span>Buscar Profissionais</span>
          </Link>
        </div>
      </div>

      {/* 2. Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carteira / Créditos */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Saldo de Créditos</span>
            <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{walletCredits} Créditos</strong>
          </div>
        </div>

        {/* Desbloqueios Concluídos */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary-base/10 text-primary-base flex items-center justify-center shrink-0">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Contatos Desbloqueados</span>
            <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{unlockedProfessionals.length} autônomos</strong>
          </div>
        </div>

        {/* Vagas Publicadas */}
        <div className="card-premium bg-card-custom p-6 border border-border-custom flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Vagas Publicadas</span>
            <strong className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{opportunities.length} anúncios</strong>
          </div>
        </div>

      </div>

      {/* 3. Compre Créditos (Painel Central de Venda) */}
      <div className="card-premium bg-card-custom p-6 sm:p-8 border border-border-custom">
        <div className="border-b border-border-custom pb-4 mb-6">
          <h3 className="text-lg font-extrabold">Comprar Pacotes de Créditos</h3>
          <p className="text-xs text-slate-400 mt-1">Desbloqueie contatos de profissionais de forma econômica e direta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="p-6 rounded-2xl border border-border-custom bg-slate-50 dark:bg-slate-900/40 flex flex-col justify-between items-center text-center gap-4 group">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-base/10 text-primary-base px-3 py-1 rounded-full mb-3 inline-block">
                  {pkg.discount}
                </span>
                <h4 className="font-extrabold text-base mb-1">{pkg.name}</h4>
                <strong className="text-2xl font-extrabold block text-slate-800 dark:text-slate-100 my-2">
                  {pkg.credits} {pkg.credits === 1 ? 'Crédito' : 'Créditos'}
                </strong>
                <span className="text-sm font-semibold text-slate-500">
                  {formatCurrency(pkg.price)}
                </span>
              </div>

              <button
                onClick={() => handleStartCheckout(pkg)}
                className="w-full btn-premium-primary text-xs"
              >
                Adquirir Pacote
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Vagas Anunciadas & Contatos Salvos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Minhas Oportunidades Anunciadas */}
        <div className="card-premium bg-card-custom p-6 sm:p-8 border border-border-custom lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-border-custom pb-4">
            <h3 className="text-lg font-extrabold">Minhas Vagas Publicadas</h3>
            <Link href="/cadastro/oportunidade" className="text-xs font-bold text-primary-base hover:underline">Nova Publicação</Link>
          </div>

          <div className="space-y-4">
            {opportunities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">Você ainda não publicou nenhuma vaga de serviço.</p>
            ) : (
              opportunities.map((opp) => (
                <div key={opp.id} className="p-4 rounded-xl border border-border-custom bg-slate-50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{opp.title}</h4>
                    <p className="text-slate-400 mt-1">{opp.city} ({opp.state}) — {new Date(opp.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                    opp.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                    opp.status === 'awaiting_moderation' ? 'bg-amber-100 text-amber-700' :
                    opp.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {opp.status === 'published' ? 'Publicado' :
                     opp.status === 'awaiting_moderation' ? 'Moderação' :
                     opp.status === 'rejected' ? 'Recusado' : 'Finalizado'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contatos de Profissionais Salvos */}
        <div className="card-premium bg-card-custom p-6 sm:p-8 border border-border-custom lg:col-span-1 space-y-6">
          <div className="border-b border-border-custom pb-4">
            <h3 className="text-lg font-extrabold">Contatos Liberados</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Profissionais já desbloqueados na sua conta.</p>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {unlockedProfessionals.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">Você não desbloqueou contatos ainda.</p>
            ) : (
              unlockedProfessionals.map((prof) => (
                <div key={prof.id} className="p-4 rounded-xl border border-border-custom bg-slate-50 dark:bg-slate-900/40 text-xs space-y-3">
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-slate-150">{prof.professional_name}</h4>
                    <p className="text-slate-400">{prof.category_name} — {prof.city} ({prof.state})</p>
                  </div>

                  <div className="pt-2 border-t border-border-custom space-y-1.5 font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{formatPhone(prof.phone)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[180px]">{prof.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://wa.me/55${prof.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-premium-secondary !py-1 text-[10px] flex items-center justify-center gap-1"
                    >
                      <span>Mensagem</span>
                    </a>
                    <Link
                      href={`/profissionais/${prof.id}`}
                      className="btn-premium-outline !py-1 text-[10px] flex items-center justify-center gap-1 !border-border-custom"
                    >
                      <span>Perfil</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* =========================================================================
         MODAL DE CHECKOUT SIMULADO (INTERATIVO)
         ========================================================================= */}
      {checkoutModalOpen && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutModalOpen(false)}></div>
          
          <div className="relative bg-card-custom p-6 sm:p-8 rounded-3xl border border-border-custom shadow-2xl max-w-md w-full overflow-hidden animate-scale-up text-slate-800 dark:text-slate-100">
            
            {checkoutStep === 'details' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-base bg-primary-base/10 px-2 py-0.5 rounded">Checkout Simulado</span>
                  <h3 className="text-lg font-extrabold mt-1">Adquirir créditos - Pacote {selectedPkg.name}</h3>
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Créditos inclusos:</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{selectedPkg.credits} créditos</span>
                  </div>
                  <div className="flex justify-between border-t border-border-custom pt-3 font-extrabold text-sm text-slate-800 dark:text-white">
                    <span>Valor total:</span>
                    <span>{formatCurrency(selectedPkg.price)}</span>
                  </div>
                </div>

                {message && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                {/* Seleção de Meio de Pagamento */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Selecione o Meio de Pagamento</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPayMethod('pix')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${payMethod === 'pix' ? 'border-primary-base bg-primary-base/10 text-primary-base' : 'border-border-custom bg-slate-50 dark:bg-slate-900/20 text-slate-500'}`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Simular Pix</span>
                    </button>
                    <button
                      onClick={() => setPayMethod('credit_card')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${payMethod === 'credit_card' ? 'border-primary-base bg-primary-base/10 text-primary-base' : 'border-border-custom bg-slate-50 dark:bg-slate-900/20 text-slate-500'}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Simular Cartão</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('simulated_gateway')}
                  className="w-full btn-premium-primary py-3.5 text-xs font-extrabold"
                >
                  Seguir para Pagamento
                </button>
              </div>
            )}

            {checkoutStep === 'simulated_gateway' && (
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Ambiente de Teste</span>
                  <h3 className="text-lg font-extrabold mt-1">Processador de Pagamento Simulado</h3>
                </div>

                {payMethod === 'pix' ? (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-36 h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 border border-border-custom">
                      <QrCode className="w-20 h-20 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                      Escaneie o QR Code Pix fictício acima ou clique no botão abaixo para simular a compensação instantânea da transação de <strong>{formatCurrency(selectedPkg.price)}</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="space-y-2 border border-border-custom p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-xs">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Cartão de Teste:</span>
                        <span>4242 •••• •••• 4242</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Qualquer preenchimento de CVV e validade será aprovado automaticamente neste ambiente sandbox de demonstração.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCheckoutStep('details')}
                    disabled={loading}
                    className="w-1/3 btn-premium-outline py-3 text-xs"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={loading}
                    className="w-2/3 btn-premium-accent py-3 text-xs flex items-center justify-center gap-1.5"
                  >
                    {loading ? 'Confirmando...' : 'Confirmar Pagamento Simulado'}
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="space-y-6 text-center py-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Pagamento Compensado!</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                    Seu saldo foi recarregado com mais <strong>{selectedPkg.credits} créditos</strong>. Você já pode desbloquear novos contatos!
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full btn-premium-primary py-3 text-xs font-bold mt-4"
                >
                  Concluir e Voltar
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
