import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { Shield, EyeOff, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PoliticaPrivacidadePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header initialUser={user} />
      
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-premium bg-card-custom p-8 sm:p-12 border border-border-custom space-y-8">
            
            <div className="flex items-center gap-3 border-b border-border-custom pb-6">
              <Shield className="w-8 h-8 text-primary-base" />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Política de Privacidade</h1>
                <p className="text-xs text-slate-400 mt-1">Última atualização: Julho de 2026</p>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">1. Tratamento de Dados (LGPD)</h3>
                <p>
                  O Trabalhe Livre está comprometido com a segurança e privacidade de seus dados pessoais. Coletamos apenas informações necessárias para viabilizar a conexão entre profissionais e contratantes, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">2. Dados Coletados</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Dados Cadastrais:</strong> Nome completo, CPF ou CNPJ, e-mail, telefone celular/WhatsApp, e endereço de base.</li>
                  <li><strong>Dados Profissionais:</strong> Categoria, especialidades, portfólio de fotos de serviços anteriores e biografia profissional.</li>
                  <li><strong>Dados Financeiros:</strong> Transações de recarga de créditos (não armazenamos dados de cartões de crédito; o faturamento é processado por gateways de pagamento integrados de forma criptografada).</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">3. Como Compartilhamos Seus Dados</h3>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border-custom flex items-start gap-2.5">
                  <EyeOff className="w-5 h-5 text-primary-base shrink-0 mt-0.5" />
                  <span>
                    <strong>Ofuscamento de Dados:</strong> O e-mail, telefone e endereço completo do profissional autônomo permanecem invisíveis e protegidos no banco de dados. Eles serão revelados unicamente para contratantes logados na plataforma que decidirem comprar o desbloqueio com crédito.
                  </span>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">4. Exclusão de Conta</h3>
                <p>
                  Você pode solicitar a qualquer momento a desativação permanente de seu perfil público e a exclusão de seus dados pessoais entrando em contato com o suporte ou acessando as configurações de sua conta no painel do usuário.
                </p>
              </section>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
