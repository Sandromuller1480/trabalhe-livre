import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-slate-800">
          
          {/* Coluna 1: Branding */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/imagens/LOGOTIPO TRABALHE LIVRE.png" 
                alt="Trabalhe Livre" 
                width={200} 
                height={55} 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-sm font-semibold tracking-wide text-primary-base">
              Seu trabalho. Sua liberdade. Suas oportunidades.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              O Trabalhe Livre conecta profissionais autônomos e clientes diretamente em todo o território nacional. Sem taxas ocultas, sem intermediários. Negociação direta e transparente.
            </p>
            <div className="flex items-center gap-2 text-xs text-secondary-base font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Plataforma 100% Brasileira</span>
            </div>
          </div>

          {/* Coluna 2: Para Profissionais */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Para Profissionais</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/cadastro/profissional" className="hover:text-white hover:underline transition-colors">
                  Criar Perfil Grátis
                </Link>
              </li>
              <li>
                <Link href="/como-funciona#trabalhar" className="hover:text-white hover:underline transition-colors">
                  Como funciona para trabalhar
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  Acessar Painel do Profissional
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Para Contratantes */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Para Contratantes</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/profissionais" className="hover:text-white hover:underline transition-colors">
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link href="/como-funciona#contratar" className="hover:text-white hover:underline transition-colors">
                  Como funciona para contratar
                </Link>
              </li>
              <li>
                <Link href="/cadastro/contratante" className="hover:text-white hover:underline transition-colors">
                  Publicar Oportunidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Institucional & Suporte */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Institucional</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/sobre" className="hover:text-white hover:underline transition-colors">
                  Sobre a Plataforma
                </Link>
              </li>
              <li>
                <Link href="/perguntas-frequentes" className="hover:text-white hover:underline transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/termos-uso" className="hover:text-white hover:underline transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="hover:text-white hover:underline transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Rodapé inferior */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Trabalhe Livre. Todos os direitos reservados.
          </p>
          <p className="text-slate-600">
            A contratação é negociada e acertada de forma autônoma entre as partes. O Trabalhe Livre não responde pela execução dos serviços.
          </p>
        </div>
      </div>
    </footer>
  )
}
