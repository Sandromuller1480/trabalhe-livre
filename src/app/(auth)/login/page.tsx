'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginInput } from '@/lib/validations/auth'
import { login } from '@/actions/auth'
import { KeyRound, Mail, ShieldAlert, ArrowLeft, Shield, Briefcase, UserCheck } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const nextPath = searchParams.get('next') || ''

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await login(data)
      if (res.success) {
        router.push(nextPath || res.redirectTo || '/')
        router.refresh()
      } else {
        setErrorMsg(res.message)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao realizar o login.')
    } finally {
      setLoading(false)
    }
  }

  const fillAndSubmitDemo = async (email: string, password = 'SenhaDemo123!') => {
    setValue('email', email)
    setValue('password', password)
    setErrorMsg('')
    
    setLoading(true)
    try {
      const res = await login({ email, password })
      if (res.success) {
        router.push(nextPath || res.redirectTo || '/')
        router.refresh()
      } else {
        setErrorMsg(res.message)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro no login demo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Detalhes de Fundo */}
      <div className="absolute inset-0 bg-radial-[at_top] from-slate-900 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-primary-base/10 rounded-full blur-[100px] top-10 left-10 pointer-events-none"></div>
      <div className="absolute w-[300px] h-[300px] bg-secondary-base/5 rounded-full blur-[80px] bottom-10 right-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        
        {/* Cabeçalho de Login */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image 
              src="/imagens/ÍCONE.png" 
              alt="Trabalhe Livre" 
              width={80} 
              height={80} 
              className="h-14 w-auto object-contain" 
            />
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Acesse sua conta
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Ou navegue de volta para a <Link href="/" className="text-primary-base hover:underline font-bold flex inline-flex items-center gap-1">Página Inicial <ArrowLeft className="w-3.5 h-3.5" /></Link>
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {errorMsg && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border border-red-900/50">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* E-mail */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase">E-mail</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-base placeholder-slate-600"
                />
                <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-400 font-bold">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-400 uppercase">Senha</label>
                <Link href="/recuperar-senha" className="text-[10px] text-primary-base hover:underline font-bold">Esqueceu a senha?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="******"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-base placeholder-slate-600"
                />
                <KeyRound className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 font-bold">{errors.password.message}</p>
              )}
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium-primary py-3.5 text-xs font-extrabold"
            >
              {loading ? 'Entrando...' : 'Entrar na Conta'}
            </button>

          </form>

          {/* Divisor */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 border-t border-slate-800 -translate-y-1/2"></span>
            <span className="relative bg-slate-900 px-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Acesso de Demonstração (MVP)</span>
          </div>

          {/* PAINEL DE CONTAS DEMO */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => fillAndSubmitDemo('trabalhelivre@gmail.com', '123456SJ')}
              disabled={loading}
              className="flex items-center justify-between px-4 py-3 border border-slate-800 hover:border-primary-base/40 rounded-xl bg-slate-950 hover:bg-slate-900 text-left text-xs text-slate-300 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-primary-base" />
                <div>
                  <span className="font-extrabold block text-white text-[11px]">Administrador</span>
                  <span className="text-[10px] text-slate-500">Aprova perfis e modera serviços</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-primary-base bg-primary-base/10 px-2 py-0.5 rounded-full group-hover:bg-primary-base group-hover:text-white transition-all">Testar</span>
            </button>

            <button
              onClick={() => fillAndSubmitDemo('profissional@trabalhelivre.demo')}
              disabled={loading}
              className="flex items-center justify-between px-4 py-3 border border-slate-800 hover:border-secondary-base/40 rounded-xl bg-slate-950 hover:bg-slate-900 text-left text-xs text-slate-300 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-secondary-base" />
                <div>
                  <span className="font-extrabold block text-white text-[11px]">Profissional Autônomo</span>
                  <span className="text-[10px] text-slate-500">Gerencia portfólio e disponibilidade</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-secondary-base bg-secondary-base/10 px-2 py-0.5 rounded-full group-hover:bg-secondary-base group-hover:text-white transition-all">Testar</span>
            </button>

            <button
              onClick={() => fillAndSubmitDemo('contratante@trabalhelivre.demo')}
              disabled={loading}
              className="flex items-center justify-between px-4 py-3 border border-slate-800 hover:border-amber-500/40 rounded-xl bg-slate-950 hover:bg-slate-900 text-left text-xs text-slate-300 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="font-extrabold block text-white text-[11px]">Contratante (Cliente)</span>
                  <span className="text-[10px] text-slate-500">Compra créditos e publica vagas</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-all">Testar</span>
            </button>
          </div>

          {/* Cadastro Links */}
          <div className="text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Não possui conta?
            </p>
            <div className="flex justify-center gap-4 mt-2 text-xs font-bold">
              <Link href="/cadastro/contratante" className="text-primary-base hover:underline">Cadastrar como Contratante</Link>
              <span className="text-slate-700">|</span>
              <Link href="/cadastro/profissional" className="text-secondary-base hover:underline">Quero Trabalhar</Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="text-white text-xs font-extrabold animate-pulse">Carregando formulário...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
