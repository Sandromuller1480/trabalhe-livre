import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  CheckCircle, 
  HelpCircle, 
  Search, 
  Unlock, 
  MessageSquare, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  Briefcase 
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ComoFuncionaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header initialUser={user} />
      
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/10 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Como Funciona a Trabalhe Livre?
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Entenda como conectamos clientes e profissionais autônomos diretamente em todo o Brasil de forma transparente e sem comissões.
            </p>
          </div>

          {/* Fluxo do Cliente */}
          <div id="contratar" className="card-premium bg-card-custom p-8 sm:p-12 border border-border-custom space-y-8 scroll-mt-24">
            <div className="border-b border-border-custom pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-base bg-primary-base/10 px-3 py-1 rounded-full">
                Para quem quer contratar
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-3">
                Como contratar um profissional?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-base text-white font-extrabold flex items-center justify-center">1</div>
                <h3 className="font-extrabold text-sm sm:text-base">1. Busque e Compare</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pesquise por categorias (eletricista, pintor, diarista) e filtre por estado e cidade. Compare notas, biografia e portfólio.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-base text-white font-extrabold flex items-center justify-center">2</div>
                <h3 className="font-extrabold text-sm sm:text-base">2. Desbloqueie Contatos</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gostou do perfil? Desbloqueie os dados de contato usando 1 crédito (R$ 5,00). O contato fica liberado para sempre.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-base text-white font-extrabold flex items-center justify-center">3</div>
                <h3 className="font-extrabold text-sm sm:text-base">3. Combine Direto</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fale diretamente por WhatsApp ou telefone. Negocie preços e prazos de forma livre. Não cobramos comissão!
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-border-custom flex items-start gap-3 text-xs text-slate-400">
              <HelpCircle className="w-5 h-5 text-primary-base shrink-0 mt-0.5" />
              <span>
                <strong>Dica:</strong> Você também pode publicar uma vaga detalhada de serviço por R$ 5,00. Assim, profissionais qualificados entram em contato com você enviando propostas prontas.
              </span>
            </div>

            <div className="pt-4 flex justify-center">
              <Link href="/profissionais" className="btn-premium-primary text-xs !px-8">
                Buscar Profissionais Agora
              </Link>
            </div>
          </div>

          {/* Fluxo do Profissional */}
          <div id="trabalhar" className="card-premium bg-card-custom p-8 sm:p-12 border border-border-custom space-y-8 scroll-mt-24">
            <div className="border-b border-border-custom pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-base bg-secondary-base/10 px-3 py-1 rounded-full">
                Para quem quer trabalhar
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-3">
                Como conseguir novos clientes?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-base text-white font-extrabold flex items-center justify-center">1</div>
                <h3 className="font-extrabold text-sm sm:text-base">1. Cadastro Gratuito</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Crie seu perfil profissional gratuitamente. Insira suas especialidades, biografia, fotos de portfólios e regiões de atendimento.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-base text-white font-extrabold flex items-center justify-center">2</div>
                <h3 className="font-extrabold text-sm sm:text-base">2. Mude para "Disponível"</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ative seu perfil como "Disponível". Clientes encontrarão você na busca e comprarão créditos para ver seus contatos.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-base text-white font-extrabold flex items-center justify-center">3</div>
                <h3 className="font-extrabold text-sm sm:text-base">3. Envie Propostas</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Acompanhe a lista de oportunidades publicadas por contratantes em sua região e envie suas propostas de interesse.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-border-custom flex items-start gap-3 text-xs text-slate-400">
              <CheckCircle className="w-5 h-5 text-secondary-base shrink-0 mt-0.5" />
              <span>
                <strong>Aviso:</strong> Para obter o <strong>Selo de Verificado</strong> em seu perfil, envie cópias legíveis de seu documento de identidade no painel profissional. Isso aumenta a confiança dos clientes.
              </span>
            </div>

            <div className="pt-4 flex justify-center">
              <Link href="/cadastro/profissional" className="btn-premium-secondary text-xs !px-8">
                Cadastrar Perfil Grátis
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
