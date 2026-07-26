// UTILS DE MODERAÇÃO - PLATAFORMA TRABALHE LIVRE
// Bloqueia a inserção de contatos públicos em áreas não permitidas (Bios, Portfólio, Oportunidades, etc.)

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi

// Detecta celulares/telefones fixos em vários formatos comuns no Brasil (ex: (11) 99999-9999, 11 999999999, 99999-9999, etc.)
// Também detecta sequências longas de números separados por hífens, espaços ou barras
const PHONE_REGEX = /(?:\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})|(?:\d{8,11})|(?:\d{4,5}[-\s]\d{4})/g

// Detecta links de conversa (WhatsApp, Telegram) e redes sociais irregulares, além de encurtadores
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:wa\.me|t\.me|api\.whatsapp\.com|whatsapp\.com|instagram\.com|facebook\.com|tiktok\.com|youtube\.com|linkedin\.com|linktr\.ee|bit\.ly|tinyurl\.com|rebrand\.ly)/gi

// Detecta menções de "chave pix", "pix: " ou padrões de chaves pix aleatórias (geralmente UUIDs)
const PIX_KEYWORDS = /\b(?:pix|chave pix|pagamento pix|chaves pix|minha chave|meu pix)\b/i
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

// Detecta indicações de endereço completo (nomes de ruas, avenidas com números)
const ADDRESS_KEYWORDS = /\b(?:rua|avenida|av\.|alameda|travessa|nº|numero)\s+\w+/i

/**
 * Verifica se um texto contém qualquer informação de contato ou link proibido.
 * Retorna true se houver violação, false se estiver limpo.
 */
export function hasContactInformation(text: string): boolean {
  if (!text) return false

  // Normalizar texto (remover acentos e colocar em minúsculo para simplificar checagem de palavras-chave)
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  // 1. Checagem de E-mails
  if (EMAIL_REGEX.test(text)) return true

  // Resetar o lastIndex das regex globais antes do teste
  PHONE_REGEX.lastIndex = 0
  URL_REGEX.lastIndex = 0
  UUID_REGEX.lastIndex = 0

  // 2. Checagem de Números de Telefone
  if (PHONE_REGEX.test(text)) {
    // Evitar falsos positivos com anos (ex: 2026, 1998) ou valores monetários simples
    const matches = text.match(PHONE_REGEX)
    if (matches) {
      for (const match of matches) {
        // Se a sequência numérica for puramente um número menor que 10000000 (ex: R$ 5.000 ou ano 2024), ignora
        const digits = match.replace(/\D/g, '')
        if (digits.length >= 8 && digits.length <= 12) {
          return true
        }
      }
    }
  }

  // 3. Checagem de URLs Proibidas
  if (URL_REGEX.test(text)) return true

  // 4. Checagem de Chaves Pix
  if (PIX_KEYWORDS.test(normalized)) return true
  if (UUID_REGEX.test(text)) return true

  // 5. Checagem de Endereço Completo
  if (ADDRESS_KEYWORDS.test(normalized)) return true

  return false
}

/**
 * Modera o texto fornecido.
 * Retorna um objeto indicando se o texto é válido e a mensagem de erro padrão se for inválido.
 */
export function moderateText(text: string): { allowed: boolean; message?: string } {
  if (hasContactInformation(text)) {
    return {
      allowed: false,
      message: 'Não foi possível publicar este conteúdo. Identificamos possíveis informações de contato (telefone, e-mail, redes sociais, pix ou endereço completo) na descrição. Remova os contatos e tente novamente.',
    }
  }

  return { allowed: true }
}
