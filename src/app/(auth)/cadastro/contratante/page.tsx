'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contractorRegisterSchema, ContractorRegisterInput } from '@/lib/validations/auth'
import { registerContractor } from '@/actions/auth'
import { BRAZILIAN_STATES } from '@/lib/constants/locations'
import { formatPhone, formatCPF, formatCNPJ, formatCEP } from '@/lib/utils/format'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  KeyRound, 
  Building2, 
  FileCheck2, 
  ShieldAlert, 
  ArrowLeft 
} from 'lucide-react'

export default function ContractorRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [contractorType, setContractorType] = useState<'individual' | 'company'>('individual')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContractorRegisterInput>({
    resolver: zodResolver(contractorRegisterSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      contractor_type: 'individual',
      cpf: '',
      cnpj: '',
      company_name: '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      password: '',
      confirm_password: '',
      accept_terms: false,
      accept_privacy: false,
    },
  })

  // Observar mudanças em campos para formatação e alternância
  const phoneValue = watch('phone')
  const cpfValue = watch('cpf')
  const cnpjValue = watch('cnpj')
  const cepValue = watch('cep')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhone(e.target.value))
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cpf', formatCPF(e.target.value))
  }

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cnpj', formatCNPJ(e.target.value))
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
        }
      } catch (err) {
        console.error('Falha ao buscar CEP:', err)
      }
    }
  }

  const onSubmit = async (data: ContractorRegisterInput) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await registerContractor(data)
      if (res.success) {
        router.push(res.redirectTo || '/contratante')
        router.refresh()
      } else {
        setErrorMsg(res.message)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Detalhes de Fundo */}
      <div className="absolute inset-0 bg-radial-[at_top] from-slate-900 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-primary-base/10 rounded-full blur-[100px] top-10 left-10 pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6 hover:opacity-90 transition-opacity">
            <Image 
              src="/imagens/ÍCONE.png" 
              alt="Trabalhe Livre" 
              width={80} 
              height={80} 
              className="h-14 w-auto object-contain" 
            />
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Criar conta de Contratante
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Precisa contratar profissionais autônomos? Registre-se abaixo ou <Link href="/login" className="text-primary-base hover:underline font-bold">Faça Login</Link>
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {errorMsg && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border border-red-900/50">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 1. Tipo de Cadastro */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase">Tipo de Contratante</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setContractorType('individual')
                    setValue('contractor_type', 'individual')
                    setValue('cnpj', '')
                    setValue('company_name', '')
                  }}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${contractorType === 'individual' ? 'border-primary-base bg-primary-base/10 text-white shadow-lg' : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'}`}
                >
                  <User className="w-4 h-4" />
                  <span>Pessoa Física (CPF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setContractorType('company')
                    setValue('contractor_type', 'company')
                    setValue('cpf', '')
                  }}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${contractorType === 'company' ? 'border-primary-base bg-primary-base/10 text-white shadow-lg' : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Pessoa Jurídica (CNPJ)</span>
                </button>
              </div>
            </div>

            {/* 2. Dados Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nome Completo */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="João da Silva"
                    {...register('full_name')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                  <User className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.full_name && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.full_name.message}</p>
                )}
              </div>

              {/* E-mail */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="joao@email.com"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                  <Phone className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.phone.message}</p>
                )}
              </div>

              {/* Documento Condicional (CPF ou CNPJ) */}
              {contractorType === 'individual' ? (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">CPF</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpfValue}
                      onChange={handleCPFChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                    />
                    <FileCheck2 className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.cpf && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.cpf.message}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">CNPJ</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={cnpjValue}
                      onChange={handleCNPJChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                    />
                    <Building2 className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.cnpj && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.cnpj.message}</p>
                  )}
                </div>
              )}

            </div>

            {/* Se for empresa, abre Razão Social */}
            {contractorType === 'company' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Razão Social / Nome da Empresa</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Minha Empresa Ltda"
                    {...register('company_name')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                  <Building2 className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.company_name && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.company_name.message}</p>
                )}
              </div>
            )}

            {/* 3. Localização */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Localização Base</h3>
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                    />
                    <MapPin className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.cep && (
                    <p className="text-[10px] text-red-400 font-bold">{errors.cep.message}</p>
                  )}
                </div>

                {/* Estado (UF) */}
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
                  placeholder="Centro"
                  {...register('neighborhood')}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                />
                {errors.neighborhood && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.neighborhood.message}</p>
                )}
              </div>

            </div>

            {/* 4. Senhas */}
            <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Senha */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="******"
                    {...register('password')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                  <KeyRound className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Confirmar Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="******"
                    {...register('confirm_password')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-base"
                  />
                  <KeyRound className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.confirm_password && (
                  <p className="text-[10px] text-red-400 font-bold">{errors.confirm_password.message}</p>
                )}
              </div>

            </div>

            {/* 5. Termos e Políticas */}
            <div className="border-t border-slate-800 pt-6 space-y-3">
              <label className="flex items-start gap-3 text-xs text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('accept_terms')}
                  className="rounded text-primary-base focus:ring-primary-base bg-slate-950 border-slate-850 w-4 h-4 mt-0.5"
                />
                <span>Aceito os <Link href="/termos" className="text-primary-base hover:underline font-bold">Termos de Uso</Link> da Trabalhe Livre.</span>
              </label>
              {errors.accept_terms && (
                <p className="text-[10px] text-red-400 font-bold">{errors.accept_terms.message}</p>
              )}

              <label className="flex items-start gap-3 text-xs text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('accept_privacy')}
                  className="rounded text-primary-base focus:ring-primary-base bg-slate-950 border-slate-850 w-4 h-4 mt-0.5"
                />
                <span>Aceito a <Link href="/privacidade" className="text-primary-base hover:underline font-bold">Política de Privacidade</Link>.</span>
              </label>
              {errors.accept_privacy && (
                <p className="text-[10px] text-red-400 font-bold">{errors.accept_privacy.message}</p>
              )}
            </div>

            {/* Botão Registrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium-primary py-3.5 text-xs font-extrabold"
            >
              {loading ? 'Criando Conta...' : 'Finalizar Cadastro de Contratante'}
            </button>

          </form>

          {/* Voltar Login */}
          <div className="text-center pt-6 border-t border-slate-800 text-xs">
            <p className="text-slate-500">
              Já possui conta? <Link href="/login" className="text-primary-base font-bold hover:underline">Faça Login</Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}
