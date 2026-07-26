'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { logout } from '@/actions/auth'
import { Menu, X, User, Briefcase, LogOut, Shield } from 'lucide-react'

interface HeaderProps {
  initialUser?: any
}

export default function Header({ initialUser }: HeaderProps) {
  const [user, setUser] = useState<any>(initialUser)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    // Escutar mudanças de autenticação no cliente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    setDropdownOpen(false)
    router.push('/login')
  }

  const role = user?.user_metadata?.role || user?.raw_user_meta_data?.role
  const fullName = user?.user_metadata?.full_name || 'Usuário'

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin'
    if (role === 'professional') return '/profissional'
    return '/contratante'
  }

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border-custom transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/imagens/LOGOTIPO TRABALHE LIVRE.png" 
                alt="Trabalhe Livre" 
                width={180} 
                height={50} 
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/profissionais" className="text-sm font-semibold hover:text-primary-base transition-colors">
              Buscar Profissionais
            </Link>
            <Link href="/como-funciona" className="text-sm font-semibold hover:text-primary-base transition-colors">
              Como Funciona
            </Link>
            
            {/* Controle de Usuário */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-border-custom rounded-full bg-card-custom hover:border-border-hover-custom transition-all duration-200"
                >
                  <User className="w-4 h-4 text-primary-base" />
                  <span className="text-xs font-bold max-w-[120px] truncate">{fullName}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card-custom rounded-xl border border-border-custom shadow-xl py-2 z-50">
                    <Link 
                      href={getDashboardLink()} 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {role === 'admin' ? (
                        <Shield className="w-4 h-4 text-primary-base" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-primary-base" />
                      )}
                      <span>Painel de Controle</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-border-custom mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-semibold hover:text-primary-base transition-colors">
                  Entrar
                </Link>
                <Link href="/cadastro/contratante" className="btn-premium-primary text-xs !py-2.5 !px-5">
                  Criar Conta
                </Link>
                <Link href="/cadastro/profissional" className="btn-premium-secondary text-xs !py-2.5 !px-5">
                  Sou Profissional
                </Link>
              </div>
            )}
          </nav>

          {/* Botão Mobile Hamburger */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-border-custom hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border-custom py-4 px-6 animate-fade-in absolute w-full left-0 top-20 z-45">
          <div className="flex flex-col gap-4">
            <Link 
              href="/profissionais" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold py-2 hover:text-primary-base transition-colors"
            >
              Buscar Profissionais
            </Link>
            <Link 
              href="/como-funciona" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold py-2 hover:text-primary-base transition-colors"
            >
              Como Funciona
            </Link>

            {user ? (
              <div className="border-t border-border-custom pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary-base" />
                  <span className="font-bold text-sm">{fullName}</span>
                </div>
                <Link 
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-premium-primary w-full text-center"
                >
                  Ir para o Painel
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-premium-outline w-full text-red-600 hover:bg-red-50 text-center"
                >
                  Sair da Conta
                </button>
              </div>
            ) : (
              <div className="border-t border-border-custom pt-4 flex flex-col gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-premium-outline w-full text-center"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro/contratante" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-premium-primary w-full text-center"
                >
                  Criar Conta de Contratante
                </Link>
                <Link 
                  href="/cadastro/profissional" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-premium-secondary w-full text-center"
                >
                  Cadastrar como Profissional
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
