'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { publishOpportunity } from '@/actions/contractor'
import { createClient } from '@/lib/supabase/client'
import { BRAZILIAN_STATES } from '@/lib/constants/locations'
import { formatCEP } from '@/lib/utils/format'
import { 
  FileText, 
  MapPin, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  DollarSign,
  QrCode,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'
import { z } from 'zod'

// Schema do formulário de oportunidade
const opportunitySchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres').max(80, 'O título deve ter no máximo 80 caracteres'),
  category_id: z.string().uuid('Selecione uma categoria de serviço'),
  description: z.string().min(15, 'Forneça uma descrição detalhada de pelo menos 15 caracteres'),
  cep: z.string().optional(),
  state: z.string().length(2, 'Estado (UF) é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  neighborhood: z.string().optional(),
  desired_date: z.string().optional(),
  urgency: z.enum(['low', 'this_week', 'next_days', 'urgent', 'emergency']),
  budget_range: z.string().optional(),
  property_type: z.string().optional(),
  visit_required: z.boolean(),
  estimated_duration: z.string().optional(),
})

type OpportunityInput = z.infer<typeof opportunitySchema>

export default function PublishOpportunityPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Checkout simulado
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [formDataCache, setFormDataCache] = useState<OpportunityInput | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('sort_order')
      if (data) setCategories(data)
    }
    loadCategories()
  }, [supabase])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OpportunityInput>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      category_id: '',
      description: '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      desired_date: '',
      urgency: 'this_week',
      budget_range: '',
      property_type: '',
      visit_required: false,
      estimated_duration: '',
    },
  })

  const cepValue = watch('cep')

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value)
    setValue('cep', formatted)
    
    const clean = formatted.replace(/\D/g, '')
    if (clean.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setValue('state', data.uf)
          setValue('city', data.localidade)
          setValue('neighborhood', data.bairro)
        }
      } catch (err) {
        console.error('Falha ao buscar CEP:', err)
      }
    }
  }

  // Pre-submit: valida os dados e abre a simulação de pagamento de R$ 5,00
  const handlePreSubmit = (data: OpportunityInput) => {
    setFormDataCache(data)
    setCheckoutOpen(true)
  }

  const handleConfirmPublish = async () => {
    if (!formDataCache) return
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await publishOpportunity({
        ...formDataCache,
        image_urls: [] // Vazio no MVP do formulário básico
      })

      if (res.success) {
        setSuccess(true)
        setCheckoutOpen(false)
      } else {
        setErrorMsg(res.message)
        setCheckoutOpen(false)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao processar publicação.')
      setCheckoutOpen(false)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-16 px-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Vaga Publicada com Sucesso!</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              O pagamento de R$ 5,00 foi compensado e seu anúncio foi enviado para a <strong>fila de moderação administrativa</strong>. Uma notificação será enviada quando estiver visível para profissionais.
            </p>
          </div>
          <Link href="/contratante" className="w-full btn-premium-primary py-3.5 text-xs font-bold">
            Voltar para o Painel
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Detalhes de Fundo */}
      <div className="absolute inset-0 bg-radial-[at_top] from-slate-900 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-primary-base/10 rounded-full blur-[100px] top-10 left-10 pointer-events-none"></div>

      <div className="w-full max-w-3xl mx-auto relative z-10 space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center">
          <Link href="/contratante" className="mb-6 hover:opacity-90 transition-opacity">
            <Image 
              src="/imagens/ÍCONE.png" 
              alt="Trabalhe Livre" 
              width={80} 
              height={80} 
              className="h-14 w-auto object-contain" 
            />
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-base" />
            <span>Publicar oportunidade de serviço</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Descreva o que precisa ser feito e receba propostas de profissionais qualificados.
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {errorMsg && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border border-red-900/50">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-6">
            
            {/* 1. Detalhes Gerais */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dados do Serviço</h3>
              
              {/* Título do Serviço */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Título da Oportunidade</label>
                <input
                  type="text"
                  placeholder="Ex: Pintura de apartamento de 2 quartos"
                  {...register('title')}
                  className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-base"
                />
                {errors.title && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.title.message}</p>
                )}
              </div>

              {/* Categoria */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Categoria Principal</label>
                <select
                  {...register('category_id')}
                  className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-base cursor-pointer"
                >
                  <option value="">Selecione a categoria de serviço</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.category_id.message}</p>
                )}
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Descrição Detalhada do Serviço</label>
                <textarea
                  rows={5}
                  placeholder="Descreva o que precisa ser feito, materiais necessários, acessos disponíveis e detalhes que facilitem a proposta..."
                  {...register('description')}
                  className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-base resize-none"
                />
                {errors.description && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* 2. Filtros e Região */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Localização e Agenda</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* CEP */}
                <div className="space-y-1 col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">CEP do Local</label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={cepValue}
                    onChange={handleCEPChange}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                </div>

                {/* UF */}
                <div className="space-y-1 col-span-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">UF</label>
                  <select
                    {...register('state')}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base cursor-pointer"
                  >
                    <option value="">UF</option>
                    {BRAZILIAN_STATES.map((state) => (
                      <option key={state.uf} value={state.uf}>{state.uf}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.state.message}</p>
                  )}
                </div>

                {/* Cidade */}
                <div className="space-y-1 col-span-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Cidade</label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    {...register('city')}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                  {errors.city && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.city.message}</p>
                  )}
                </div>

              </div>

              {/* Bairro */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Bairro</label>
                <input
                  type="text"
                  placeholder="Bairro"
                  {...register('neighborhood')}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                />
              </div>
            </div>

            {/* 3. Urgência e Orçamento */}
            <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Urgência */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Urgência do Serviço</label>
                <select
                  {...register('urgency')}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base cursor-pointer"
                >
                  <option value="this_week">Para esta semana</option>
                  <option value="next_days">Nos próximos dias</option>
                  <option value="low">Sem urgência (Planejado)</option>
                  <option value="urgent">Urgente (Mais rápido possível)</option>
                  <option value="emergency">Emergencial (Plantão)</option>
                </select>
              </div>

              {/* Faixa de Orçamento */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Faixa de Orçamento Estimada</label>
                <select
                  {...register('budget_range')}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base cursor-pointer"
                >
                  <option value="">Selecione uma estimativa</option>
                  <option value="Até R$ 200">Até R$ 200</option>
                  <option value="R$ 200 - R$ 500">R$ 200 - R$ 500</option>
                  <option value="R$ 500 - R$ 1.500">R$ 500 - R$ 1.500</option>
                  <option value="R$ 1.500 - R$ 5.000">R$ 1.500 - R$ 5.000</option>
                  <option value="Mais de R$ 5.000">Mais de R$ 5.000</option>
                  <option value="A combinar">A combinar</option>
                </select>
              </div>

              {/* Tipo de Imóvel */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Tipo de Imóvel</label>
                <select
                  {...register('property_type')}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base cursor-pointer"
                >
                  <option value="">Selecione</option>
                  <option value="Residencial (Casa)">Residencial (Casa)</option>
                  <option value="Residencial (Apartamento)">Residencial (Apartamento)</option>
                  <option value="Comercial (Loja/Escritório)">Comercial (Loja/Escritório)</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Duração Estimada */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Duração Estimada do Trabalho</label>
                <select
                  {...register('estimated_duration')}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base cursor-pointer"
                >
                  <option value="">Selecione</option>
                  <option value="Poucas horas">Poucas horas</option>
                  <option value="1 dia">1 dia</option>
                  <option value="2 a 3 dias">2 a 3 dias</option>
                  <option value="1 semana">1 semana</option>
                  <option value="Mais de 1 semana">Mais de 1 semana</option>
                </select>
              </div>

            </div>

            {/* 4. Opções adicionais */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <label className="flex items-center gap-3 text-xs text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('visit_required')}
                  className="rounded text-primary-base focus:ring-primary-base bg-slate-950 border-slate-850 w-4 h-4"
                />
                <span>Necessita de visita técnica prévia para orçamento?</span>
              </label>
            </div>

            {/* Aviso de Taxa */}
            <div className="bg-primary-base/5 p-4 rounded-xl border border-primary-base/10 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-primary-base shrink-0 mt-0.5" />
              <span>A publicação de uma oportunidade de serviço é tarifada em <strong>R$ 5,00 (taxa única)</strong>. O pagamento é processado no checkout simulado. O anúncio passará pela moderação e ficará ativo por 15 dias para propostas de profissionais autônomos.</span>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <Link
                href="/contratante"
                className="w-1/3 btn-premium-outline flex items-center justify-center gap-1.5 !border-slate-800 !text-slate-300 hover:!bg-slate-900 py-3.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancelar</span>
              </Link>
              <button
                type="submit"
                className="w-2/3 btn-premium-accent py-3.5 text-xs font-extrabold"
              >
                Seguir para Checkout (R$ 5,00)
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* =========================================================================
         MODAL DE CHECKOUT SIMULADO DA TAXA DE PUBLICAÇÃO
         ========================================================================= */}
      {checkoutOpen && formDataCache && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)}></div>
          
          <div className="relative bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6 text-center animate-scale-up text-white">
            
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Processador de Teste</span>
              <h3 className="text-base font-extrabold mt-1">Taxa de Publicação de Vaga</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Serviço:</span>
                <span className="truncate max-w-[150px]">{formDataCache.title}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-extrabold text-sm text-white">
                <span>Taxa única:</span>
                <span>R$ 5,00</span>
              </div>
            </div>

            {/* Simulação de QR Code Pix */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-slate-850 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-600">
                <QrCode className="w-16 h-16 text-slate-500" />
              </div>
              <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">Clique no botão abaixo para confirmar a simulação e aprovação instantânea da taxa Pix.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCheckoutOpen(false)}
                disabled={loading}
                className="w-1/3 btn-premium-outline !border-slate-800 hover:!bg-slate-950 text-xs py-3"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={loading}
                className="w-2/3 btn-premium-accent text-xs py-3 flex items-center justify-center gap-1.5"
              >
                {loading ? 'Confirmando...' : 'Confirmar Pagamento Simulado'}
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  )
}
