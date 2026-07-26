import { z } from 'zod'

// Regex para celular brasileiro: (XX) 9XXXX-XXXX ou XX9XXXXXXXX
const phoneRegex = /^(?:\+?55)?\s?(?:\(?([1-9][1-9])\)?)\s?(?:9\d{4})[-\s]?(\d{4})$/

// Regex para CEP brasileiro: XXXXX-XXX ou XXXXXXXX
const cepRegex = /^\d{5}-?\d{3}$/

// Schema de Login
export const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Schema de Cadastro de Profissional (Multi-etapas)
export const professionalRegisterSchema = z.object({
  // Etapa 1: Dados Pessoais e Acesso
  full_name: z.string().min(3, 'O nome completo deve ter pelo menos 3 caracteres'),
  professional_name: z.string().optional(),
  email: z.string().email('Endereço de e-mail inválido'),
  phone: z.string().refine((val) => phoneRegex.test(val), {
    message: 'Telefone celular inválido. Use o formato (XX) 9XXXX-XXXX',
  }),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirm_password: z.string().min(6, 'Confirmação de senha é obrigatória'),

  // Etapa 2: Categoria e Localização
  category_id: z.string().uuid('Selecione uma categoria válida'),
  cep: z.string().refine((val) => cepRegex.test(val), {
    message: 'CEP inválido. Use o formato XXXXX-XXX',
  }),
  state: z.string().length(2, 'Estado (UF) inválido'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),

  // Etapa 3: Termos
  accept_terms: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os Termos de Uso',
  }),
  accept_privacy: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar a Política de Privacidade',
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
})

export type ProfessionalRegisterInput = z.infer<typeof professionalRegisterSchema>

// Schema de Cadastro de Contratante
export const contractorRegisterSchema = z.object({
  full_name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  phone: z.string().refine((val) => phoneRegex.test(val), {
    message: 'Telefone celular inválido. Use o formato (XX) 9XXXX-XXXX',
  }),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirm_password: z.string().min(6, 'Confirmação de senha é obrigatória'),

  state: z.string().length(2, 'Estado (UF) inválido'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  neighborhood: z.string().optional(),
  contractor_type: z.enum(['individual', 'company']).default('individual'),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  company_name: z.string().optional(),

  accept_terms: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os Termos de Uso',
  }),
  accept_privacy: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar a Política de Privacidade',
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
})

export type ContractorRegisterInput = z.infer<typeof contractorRegisterSchema>
