'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: 'Como funciona a contratação de profissionais?',
      answer: 'O contratante pesquisa os profissionais por categoria e região de forma gratuita. Após analisar o portfólio, biografia e avaliações, se desejar entrar em contato direto por telefone ou WhatsApp, o contratante realiza o desbloqueio usando 1 crédito de sua carteira. A negociação de preço, prazo e condições é direta e sem intermediários.',
    },
    {
      question: 'O Trabalhe Livre cobra comissão sobre o serviço?',
      answer: 'Não! O Trabalhe Livre é um marketplace de contatos. Não participamos da negociação do serviço, não retemos porcentagens dos valores cobrados e não definimos tabelas de preços. Todo o orçamento é feito e pago diretamente entre você e o profissional autônomo.',
    },
    {
      question: 'Quanto custa cada crédito de desbloqueio?',
      answer: 'Os créditos são comprados em pacotes: 1 desbloqueio custa R$ 5,00. Pacotes maiores oferecem descontos, por exemplo, o pacote de 10 créditos custa R$ 30,00 (saindo por R$ 3,00 cada desbloqueio). Cada contato desbloqueado permanece liberado para sempre na sua carteira de contratante.',
    },
    {
      question: 'Como posso publicar uma vaga de serviço (oportunidade)?',
      answer: 'Os contratantes podem publicar um anúncio detalhado de serviço pelo custo fixo de R$ 5,00. O anúncio fica ativo por 15 dias na plataforma. Profissionais qualificados na categoria e região receberão notificações e manifestarão interesse enviando suas propostas, permitindo ao contratante escolher o profissional ideal.',
    },
    {
      question: 'Sou profissional autônomo, preciso pagar mensalidade?',
      answer: 'Não. O cadastro profissional é 100% gratuito. Você cria seu perfil, adiciona até 20 fotos no portfólio, define suas áreas de atuação e disponibilidade sem custos mensais. Você só recebe contatos de clientes que já pagaram pelo desbloqueio na plataforma.',
    },
    {
      question: 'O site garante a execução ou devolução de valores dos serviços?',
      answer: 'O Trabalhe Livre não atua como fiador ou garantidor das negociações financeiras entre profissional e cliente. Recomendamos formalizar acordos e conferir portfólios e avaliações antes de efetuar adiantamentos financeiros.',
    },
  ]

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqItems.map((item, index) => {
        const isOpen = activeIndex === index
        return (
          <div 
            key={index} 
            className="card-premium !rounded-xl border border-border-custom bg-card-custom hover:translate-y-0 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex justify-between items-center px-6 py-5 text-left font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 transition-colors"
            >
              <span>{item.question}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-primary-base flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>
            
            {isOpen && (
              <div className="px-6 pb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-border-custom pt-4 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
