// LOCALIDADES - PLATAFORMA TRABALHE LIVRE
// Lista de estados e cidades brasileiras para preenchimento de filtros e cadastros

export interface State {
  uf: string
  name: string
}

export const BRAZILIAN_STATES: State[] = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
]

export const MAJOR_CITIES_BY_STATE: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'São Bernardo do Campo', 'Santo André', 'São José dos Campos', 'Ribeirão Preto', 'Sorocaba', 'Jundiaí', 'Piracicaba'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis', 'Campos dos Goytacazes', 'Volta Redonda', 'Macaé'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Uberaba', 'Ipatinga'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Sorriso', 'Lucas do Rio Verde', 'Primavera do Leste'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 'Lauro de Freitas', 'Juazeiro', 'Ilhéus'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó', 'Criciúma', 'Itajaí', 'Balneário Camboriú'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia', 'Águas Claras', 'Guará', 'Sobradinho'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Novo Hamburgo', 'Passo Fundo'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista', 'Cabo de Santo Agostinho'],
}

/**
 * Retorna cidades de um estado, ou lista geral de capitais se o estado não estiver mapeado.
 */
export function getCitiesByState(uf: string): string[] {
  return MAJOR_CITIES_BY_STATE[uf] || [
    'Rio Branco', 'Maceió', 'Macapá', 'Manaus', 'Salvador', 'Fortaleza', 'Brasília',
    'Vitória', 'Goiânia', 'São Luís', 'Cuiabá', 'Campo Grande', 'Belo Horizonte',
    'Belém', 'João Pessoa', 'Curitiba', 'Recife', 'Teresina', 'Rio de Janeiro',
    'Natal', 'Porto Alegre', 'Porto Velho', 'Boa Vista', 'Florianópolis', 'São Paulo',
    'Aracaju', 'Palmas'
  ]
}
