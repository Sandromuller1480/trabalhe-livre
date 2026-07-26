import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Instanciar cliente Supabase para gerenciar cookies na requisição/resposta
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obter usuário da sessão de forma segura (chama a API do Supabase e valida o JWT)
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role || user?.raw_user_meta_data?.role

  const path = request.nextUrl.pathname

  // Verificar se o caminho atual é restrito
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/cadastro')
  const isProfessionalRoute = path.startsWith('/profissional')
  const isContractorRoute = path.startsWith('/contratante')
  const isAdminRoute = path.startsWith('/admin')

  // 1. Usuário Não Autenticado
  if (!user) {
    if (isProfessionalRoute || isContractorRoute || isAdminRoute) {
      // Redireciona para login e guarda a página de destino
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('next', path)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  // 2. Usuário Autenticado tentando acessar rotas de autenticação (Login / Cadastro)
  if (isAuthRoute) {
    const redirectUrl = request.nextUrl.clone()
    if (role === 'admin') redirectUrl.pathname = '/admin'
    else if (role === 'professional') redirectUrl.pathname = '/profissional'
    else redirectUrl.pathname = '/contratante'
    return NextResponse.redirect(redirectUrl)
  }

  // 3. Controle de Acesso Baseado em Função (RBAC)
  if (isProfessionalRoute && role !== 'professional') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = role === 'admin' ? '/admin' : '/contratante'
    return NextResponse.redirect(redirectUrl)
  }

  if (isContractorRoute && role !== 'contractor') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = role === 'admin' ? '/admin' : '/profissional'
    return NextResponse.redirect(redirectUrl)
  }

  if (isAdminRoute && role !== 'admin') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = role === 'professional' ? '/profissional' : '/contratante'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Configurar as rotas que acionam o middleware (ignorar arquivos estáticos e imagens)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|imagens|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
