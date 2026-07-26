'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { professionalRegisterSchema, ProfessionalRegisterInput } from '@/lib/validations/auth'
import { registerProfessional } from '@/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { BRAZILIAN_STATES } from '@/lib/constants/locations'
import { formatPhone, formatCEP } from '@/lib/utils/format'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  KeyRound, 
  Briefcase, 
  FileCheck2, 
  ShieldAlert, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

export default function ProfessionalRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Instanciar cliente browser do Supabase
  const supabase = createClient()

  // Buscar categorias de serviço para preenchimento do select
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
    trigger,
    formState: { errors },
  } = useForm<ProfessionalRegisterInput>({
    resolver: zodResolver(professionalRegisterSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      professional_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      category_id: '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      address: '',
      accept_terms: false,
      accept_privacy: false,
    },
  })

  const phoneValue = watch('phone')
  const cepValue = watch('cep')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhone(e.target.value))
  }

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
          setValue('address', data.logradouro)
        }
      } catch (err) {
        console.error('Falha ao buscar CEP:', err)
      }
    }
  }

  // Validar etapa atual antes de avançar
  const nextStep = async () => {
    let fieldsToValidate: any[] = []
    
    if (step === 1) {
      fieldsToValidate = ['full_name', 'email', 'phone', 'password', 'confirm_password']
    } else if (step === 2) {
      fieldsToValidate = ['category_id', 'cep', 'state', 'city', 'neighborhood', 'address']
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setStep((prev) => prev + 1)
      setErrorMsg('')
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const onSubmit = async (data: ProfessionalRegisterInput) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await registerProfessional(data)
      if (res.success) {
        router.push(res.redirectTo || '/profissional')
        router.refresh()
      } else {
        setErrorMsg(res.message)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar profissional.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Detalhes de Fundo */}
      <div className="absolute inset-0 bg-radial-[at_top] from-slate-900 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-secondary-base/10 rounded-full blur-[100px] top-10 left-10 pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6 hover:opacity-90 transition-opacity">
            <Image 
              src="/imagens/LOGOTIPO TRABALHE LIVRE.png" 
              alt="Trabalhe Livre" 
              width={200} 
              height={55} 
              className="h-10 w-auto object-contain brightness-0 invert" 
            />
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Seja um Profissional Parceiro
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Aumente seus ganhos criando seu perfil gratuito ou <Link href="/login" className="text-secondary-base hover:underline font-bold">Faça Login</Link>
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Indicador de Etapas */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className={step === 1 ? 'text-secondary-base' : step > 1 ? 'text-emerald-500' : ''}>1. Dados Pessoais</span>
            <ChevronRight className="w-4 h-4" />
            <span className={step === 2 ? 'text-secondary-base' : step > 2 ? 'text-emerald-500' : ''}>2. Especialidade & Local</span>
            <ChevronRight className="w-4 h-4" />
            <span className={step === 3 ? 'text-secondary-base' : ''}>3. Termos</span>
          </div>

          {errorMsg && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border border-red-900/50">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* ETAPA 1: Dados Pessoais e Acesso */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                
                {/* Nome Completo */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Roberto Carlos"
                      {...register('full_name')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                    />
                    <User className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.full_name && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Nome Profissional / Fantasia */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Nome Comercial / Profissional <span className="text-slate-600 font-normal">(Opcional)</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Roberto Pinturas e Acabamentos"
                      {...register('professional_name')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                    />
                    <Briefcase className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="roberto@email.com"
                      {...register('email')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                    />
                    <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.email.message}</p>
                  )}
                </div>

                {/* Celular */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Celular / WhatsApp</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                    />
                    <Phone className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.phone.message}</p>
                  )}
                </div>

                {/* Senha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Senha</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="******"
                        {...register('password')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                      />
                      <KeyRound className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-red-400 font-bold">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Confirmar Senha</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="******"
                        {...register('confirm_password')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                      />
                      <KeyRound className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.confirm_password && (
                      <p className="text-[10px] text-red-400 font-bold">{errors.confirm_password.message}</p>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full btn-premium-secondary flex items-center justify-center gap-2 py-3.5 text-xs font-extrabold mt-8"
                >
                  <span>Avançar para Especialidade</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            )}

            {/* ETAPA 2: Categoria e Localização */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                
                {/* Seleção de Categoria */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Categoria Principal de Serviço</label>
                  <select
                    {...register('category_id')}
                    className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base cursor-pointer"
                  >
                    <option value="">Selecione sua categoria de atuação</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.category_id.message}</p>
                  )}
                </div>

                {/* Localização */}
                <div className="border-t border-slate-800 pt-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Endereço Profissional</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* CEP */}
                    <div className="space-y-1 col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase">CEP</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="00000-000"
                          value={cepValue}
                          onChange={handleCEPChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                        />
                        <MapPin className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.cep && (
                        <p className="text-[10px] text-red-400 font-bold">{errors.cep.message}</p>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-1 col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase">UF</label>
                      <select
                        {...register('state')}
                        className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base cursor-pointer"
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
                        className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
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
                      placeholder="Centro"
                      {...register('neighborhood')}
                      className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                    />
                    {errors.neighborhood && (
                      <p className="text-[10px] text-red-400 font-bold">{errors.neighborhood.message}</p>
                    )}
                  </div>

                  {/* Endereço Completo */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Endereço Completo <span className="text-[10px] text-slate-600 font-bold">(Ocultado do Perfil Público)</span></label>
                    <input
                      type="text"
                      placeholder="Rua das Flores, 123 - Apto 45"
                      {...register('address')}
                      className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-secondary-base"
                    />
                    {errors.address && (
                      <p className="text-[10px] text-red-400 font-bold">{errors.address.message}</p>
                    )}
                  </div>

                </div>

                {/* Botões de Navegação */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/3 btn-premium-outline flex items-center justify-center gap-1.5 !border-slate-800 !text-slate-300 hover:!bg-slate-900 py-3.5 text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-2/3 btn-premium-secondary flex items-center justify-center gap-1.5 py-3.5 text-xs font-bold"
                  >
                    <span>Termos de Uso</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* ETAPA 3: Termos e Políticas */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-secondary-base" />
                    <span>Compromisso do Profissional</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Para manter a plataforma Trabalhe Livre confiável e justa, você concorda em não divulgar dados de contato (telefone, e-mail, redes sociais ou endereços) nas áreas públicas de biografia, títulos, descrições ou portfólio.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Esses dados de contato serão ocultados por padrão e revelados apenas a clientes contratantes interessados que realizarem o desbloqueio. Descumprir esta política levará à moderação e suspensão temporária do seu perfil.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-xs text-slate-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      {...register('accept_terms')}
                      className="rounded text-secondary-base focus:ring-secondary-base bg-slate-950 border-slate-850 w-4 h-4 mt-0.5"
                    />
                    <span>Aceito os <Link href="/termos" className="text-secondary-base hover:underline font-bold">Termos de Uso</Link> do Trabalhe Livre.</span>
                  </label>
                  {errors.accept_terms && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.accept_terms.message}</p>
                  )}

                  <label className="flex items-start gap-3 text-xs text-slate-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      {...register('accept_privacy')}
                      className="rounded text-secondary-base focus:ring-secondary-base bg-slate-950 border-slate-850 w-4 h-4 mt-0.5"
                    />
                    <span>Aceito a <Link href="/privacidade" className="text-secondary-base hover:underline font-bold">Política de Privacidade</Link>.</span>
                  </label>
                  {errors.accept_privacy && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.accept_privacy.message}</p>
                  )}
                </div>

                {/* Botões de Navegação */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={loading}
                    className="w-1/3 btn-premium-outline flex items-center justify-center gap-1.5 !border-slate-800 !text-slate-300 hover:!bg-slate-900 py-3.5 text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 btn-premium-secondary flex items-center justify-center gap-1.5 py-3.5 text-xs font-extrabold"
                  >
                    {loading ? 'Criando Conta...' : 'Finalizar e Ativar Perfil'}
                  </button>
                </div>

              </div>
            )}

          </form>

          {/* Voltar Login */}
          <div className="text-center pt-6 border-t border-slate-800 text-xs">
            <p className="text-slate-500">
              Já possui conta? <Link href="/login" className="text-secondary-base font-bold hover:underline">Faça Login</Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}
