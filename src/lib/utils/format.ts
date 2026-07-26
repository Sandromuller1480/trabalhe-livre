// FORMATADORES - PLATAFORMA TRABALHE LIVRE
// Utilitários para formatação de dados do padrão brasileiro (CPF, CNPJ, CEP, Celular, Moeda BRL)

/**
 * Formata um valor numérico ou string em Moeda Brasileira (R$)
 */
export function formatCurrency(value: number | string): string {
  const amount = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(amount)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

/**
 * Formata CEP (99999-999)
 */
export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '')
  if (clean.length !== 8) return cep
  return `${clean.substring(0, 5)}-${clean.substring(5)}`
}

/**
 * Formata Celular ( (99) 99999-9999 ) ou Fixo ( (99) 9999-9999 )
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  // Remover código do país se houver 55 no início e tiver tamanho de 12 ou 13 dígitos
  const withoutCountry = clean.startsWith('55') && clean.length > 10 ? clean.substring(2) : clean

  if (withoutCountry.length === 11) {
    return `(${withoutCountry.substring(0, 2)}) ${withoutCountry.substring(2, 7)}-${withoutCountry.substring(7)}`
  } else if (withoutCountry.length === 10) {
    return `(${withoutCountry.substring(0, 2)}) ${withoutCountry.substring(2, 6)}-${withoutCountry.substring(6)}`
  }
  return phone
}

/**
 * Formata CPF (999.999.999-99)
 */
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '')
  if (clean.length !== 11) return cpf
  return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`
}

/**
 * Formata CNPJ (99.999.999/9999-99)
 */
export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '')
  if (clean.length !== 14) return cnpj
  return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.${clean.substring(5, 8)}/${clean.substring(8, 12)}-${clean.substring(12)}`
}

/**
 * Retorna as iniciais de um nome para avatares placeholder
 */
export function getInitials(name: string): string {
  if (!name) return 'TL'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}
