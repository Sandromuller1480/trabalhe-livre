import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { FileText, Shield, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TermosUsoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header initialUser={user} />
      
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-premium bg-card-custom p-8 sm:p-12 border border-border-custom space-y-8">
            
            <div className="flex items-center gap-3 border-b border-border-custom pb-6">
              <FileText className="w-8 h-8 text-primary-base" />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Termos de Uso</h1>
                <p className="text-xs text-slate-400 mt-1">Última atualização: Julho de 2026</p>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">1. Relação de Autonomia</h3>
                <p>
                  O Trabalhe Livre é um marketplace de contatos de serviços profissionais autônomos. A plataforma NÃO possui qualquer vínculo empregatício com os profissionais cadastrados, NÃO atua como contratante e NÃO responde pela execução, qualidade, garantia ou pagamento dos serviços negociados.
                </p>
                <p>
                  Toda e qualquer negociação de valores, prazos e escopos é realizada de forma direta, independente e soberana entre o contratante e o autônomo.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">2. Ocultação de Contatos e Moderação</h3>
                <p>
                  Para preservar a privacidade e evitar abusos/spam, o Trabalhe Livre oculta dados de contato pessoais (e-mail, número de celular, WhatsApp, redes sociais) nas páginas públicas de biografia, portfólio ou títulos.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Importante:</strong> É terminantemente proibido inserir dados de contato em campos abertos ao público. Perfis que descumprirem essa regra passarão por moderação e poderão ser desativados ou suspensos temporariamente.
                  </span>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">3. Política de Créditos</h3>
                <p>
                  Os créditos adquiridos por contratantes são de uso exclusivo para o desbloqueio de dados de contato de profissionais autônomos e possuem validade indeterminada. Cada desbloqueio consome 1 crédito e mantém o contato daquele prestador liberado permanentemente na carteira do contratante.
                </p>
                <p>
                  Não haverá devolução ou reembolso de créditos por insatisfação na negociação direta ou caso o profissional não feche o serviço, uma vez que o crédito remunera o fornecimento do contato, e não a conclusão da empreitada.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">4. Selo de Verificação</h3>
                <p>
                  O selo de verificado indica que o profissional anexou um documento de identificação legível (RG/CNH) correspondente aos dados inseridos no cadastro. Esse selo visa aumentar a transparência e credibilidade do perfil, mas não constitui garantia do histórico criminal, técnico ou comercial do prestador de serviços.
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
