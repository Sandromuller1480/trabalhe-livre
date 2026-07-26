-- SUPABASE SCHEMA - PLATAFORMA TRABALHE LIVRE
-- Executar no editor SQL do Supabase para inicializar a estrutura do banco de dados.

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================================================
-- 1. TABELAS DE USUÁRIOS E PERFIS
-- =========================================================================

-- Tabela Profiles (Tabela base vinculada ao auth.users do Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('professional', 'contractor', 'admin')),
  email text unique not null,
  phone text,
  full_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Categorias Profissionais
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  is_active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Especialidades (vinculadas a uma Categoria)
create table public.specialties (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade not null,
  name text not null,
  slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category_id, slug)
);

-- Perfis Profissionais (Dados específicos de profissionais autônomos)
create table public.professional_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  professional_name text,
  category_id uuid references public.categories(id) on delete set null,
  bio text,
  experience_years integer default 0 check (experience_years >= 0),
  cep text,
  state text,
  city text,
  neighborhood text,
  address_hidden text, -- Endereço completo ocultado do público
  max_distance integer default 0, -- Distância máxima em km
  is_presential boolean default true not null,
  is_remote boolean default false not null,
  is_residential boolean default true not null,
  is_commercial boolean default false not null,
  is_emergency boolean default false not null,
  work_weekends boolean default false not null,
  work_night boolean default false not null,
  has_vehicle boolean default false not null,
  has_tools boolean default false not null,
  issues_invoice boolean default false not null,
  has_mei boolean default false not null,
  website text,
  instagram text,
  facebook text,
  tiktok text,
  youtube text,
  linkedin text,
  certificates text[] default '{}'::text[] not null,
  courses text[] default '{}'::text[] not null,
  availability text default 'unconfirmed' not null check (availability in ('available', 'busy', 'unconfirmed')),
  availability_forecast date,
  availability_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  rating_avg numeric(3,2) default 0.00 not null check (rating_avg >= 0.00 and rating_avg <= 5.00),
  rating_count integer default 0 not null check (rating_count >= 0),
  is_verified boolean default false not null,
  response_time_avg text default 'Não informado',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Perfis Contratantes (Dados específicos de clientes)
create table public.contractor_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  cpf text,
  cnpj text,
  company_name text,
  contractor_type text default 'individual' not null check (contractor_type in ('individual', 'company')),
  cep text,
  state text,
  city text,
  neighborhood text,
  address_hidden text,
  company_segment text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Relacionamento N:N entre Profissional e suas Especialidades
create table public.professional_specialties (
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  specialty_id uuid references public.specialties(id) on delete cascade not null,
  primary key(professional_id, specialty_id)
);

-- Áreas de Atendimento adicionais do profissional (Cidades/Estados atendidos)
create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  state text not null,
  city text, -- Se nulo, atende o estado inteiro
  unique(professional_id, state, city)
);

-- =========================================================================
-- 2. PORTFÓLIO E HISTÓRICO DE DISPONIBILIDADE
-- =========================================================================

-- Itens do Portfólio dos Profissionais
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  specialty_id uuid references public.specialties(id) on delete set null,
  image_url text not null,
  is_before_after boolean default false not null,
  image_after_url text, -- Utilizado caso is_before_after seja true
  service_date date,
  city text,
  alt_text text,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Histórico de alterações de status de disponibilidade
create table public.availability_history (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  status text not null check (status in ('available', 'busy', 'unconfirmed')),
  forecast date,
  changed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profissionais favoritos salvos pelos contratantes
create table public.favorites (
  contractor_id uuid references public.contractor_profiles(id) on delete cascade not null,
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key(contractor_id, professional_id)
);

-- =========================================================================
-- 3. CARTEIRA, CRÉDITOS E TRANSACIONAL FINANCEIRO
-- =========================================================================

-- Carteira de Créditos dos Contratantes
create table public.wallets (
  contractor_id uuid references public.contractor_profiles(id) on delete cascade primary key,
  balance integer default 0 not null check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pacotes de Créditos Disponíveis para Compra
create table public.credit_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  credits integer not null check (credits > 0),
  price numeric(10,2) not null check (price >= 0.00),
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Histórico de Transações de Créditos (Extrato da Carteira)
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references public.wallets(contractor_id) on delete cascade not null,
  type text not null check (type in ('purchase', 'unlock', 'refund', 'admin_adjustment', 'bonus')),
  amount integer not null, -- Positivo para entradas, Negativo para saídas
  balance_before integer not null,
  balance_after integer not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Registro de Contatos Desbloqueados por Contratantes
create table public.contact_unlocks (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references public.contractor_profiles(id) on delete cascade not null,
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(contractor_id, professional_id)
);

-- Pagamentos de Créditos ou Serviços (Simulados / Integrados)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references public.contractor_profiles(id) on delete cascade not null,
  package_id uuid references public.credit_packages(id) on delete set null,
  amount numeric(10,2) not null check (amount >= 0.00),
  status text default 'pending' not null check (status in ('pending', 'processing', 'approved', 'rejected', 'cancelled', 'refunded')),
  payment_method text check (payment_method in ('pix', 'credit_card')),
  gateway_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Registro de Retornos Webhook dos gateways de pagamento
create table public.payment_webhooks (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  processed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cupons de Desconto / Bônus
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percentage integer check (discount_percentage > 0 and discount_percentage <= 100),
  credits_bonus integer default 0 check (credits_bonus >= 0),
  expires_at timestamp with time zone,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reembolsos solicitados / efetuados
create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete cascade not null,
  amount numeric(10,2) not null check (amount >= 0.00),
  reason text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 4. OPORTUNIDADES E CANDIDATURAS (SOLICITAÇÕES DE SERVIÇOS)
-- =========================================================================

-- Oportunidades criadas por contratantes
create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references public.contractor_profiles(id) on delete cascade not null,
  title text not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  specialty_id uuid references public.specialties(id) on delete set null,
  description text not null,
  state text not null,
  city text not null,
  neighborhood text,
  desired_date date,
  desired_time text,
  urgency text not null check (urgency in ('low', 'this_week', 'next_days', 'urgent', 'emergency')),
  budget_range text,
  property_type text,
  visit_required boolean default false not null,
  estimated_duration text,
  status text default 'draft' not null check (status in ('draft', 'awaiting_payment', 'payment_processing', 'awaiting_moderation', 'published', 'in_progress', 'professional_selected', 'closed', 'expired', 'cancelled', 'rejected', 'suspended')),
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mídias vinculadas às oportunidades
create table public.service_request_media (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.service_requests(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Candidaturas de Profissionais Interessados nas Oportunidades
create table public.service_interests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.service_requests(id) on delete cascade not null,
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  proposal_message text not null,
  estimated_duration text,
  price_estimate numeric(10,2),
  visit_required boolean default false not null,
  experience_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(request_id, professional_id)
);

-- =========================================================================
-- 5. AVALIAÇÕES DOS PROFISSIONAIS
-- =========================================================================

-- Avaliações gerais dos profissionais realizadas por contratantes
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references public.contractor_profiles(id) on delete cascade not null,
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  request_id uuid references public.service_requests(id) on delete set null,
  rating numeric(3,2) not null check (rating >= 1.00 and rating <= 5.00),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(contractor_id, professional_id, request_id)
);

-- Critérios detalhados de avaliação
create table public.review_criteria (
  review_id uuid references public.reviews(id) on delete cascade primary key,
  quality integer not null check (quality >= 1 and quality <= 5),
  punctuality integer not null check (punctuality >= 1 and punctuality <= 5),
  communication integer not null check (communication >= 1 and communication <= 5),
  organization integer not null check (organization >= 1 and organization <= 5),
  professionalism integer not null check (professionalism >= 1 and professionalism <= 5),
  cost_benefit integer not null check (cost_benefit >= 1 and cost_benefit <= 5)
);

-- Resposta pública do profissional à avaliação
create table public.review_responses (
  review_id uuid references public.reviews(id) on delete cascade primary key,
  response_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 6. NOTIFICAÇÕES, DENÚNCIAS E SUPORTE
-- =========================================================================

-- Notificações Internas (Sinalização no Sistema)
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  link text,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Denúncias de Perfis, Oportunidades ou Avaliações
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reported_profile_id uuid references public.profiles(id) on delete set null,
  reported_request_id uuid references public.service_requests(id) on delete set null,
  reported_review_id uuid references public.reviews(id) on delete set null,
  reason text not null,
  details text,
  status text default 'pending' not null check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Verificações documentais solicitadas por profissionais
create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  document_front_url text not null,
  document_back_url text not null,
  selfie_url text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Fila de Moderação de Conteúdo Textual
create table public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('profile_bio', 'portfolio_item', 'service_request')),
  target_id uuid not null,
  content_text text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected', 'flagged')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chamados de Suporte
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  message text not null,
  status text default 'open' not null check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aceite de Termos de Uso e Política de Privacidade
create table public.terms_acceptances (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  accepted_terms boolean default false not null check (accepted_terms = true),
  accepted_privacy boolean default false not null check (accepted_privacy = true),
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Registro de Logs de Auditoria Administrativa
create table public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete cascade not null,
  action text not null,
  target_type text not null,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- =========================================================================
-- 7. VISÕES DE SEGURANÇA E PROTEÇÃO DOS DADOS
-- =========================================================================

-- View Pública de Profissionais (Ofusca dados sensíveis como celular, e-mail, redes e endereço completo)
create or replace view public.public_professional_profiles as
select 
  p.id,
  p.full_name,
  pp.professional_name,
  pp.category_id,
  pp.bio,
  pp.experience_years,
  pp.state,
  pp.city,
  pp.neighborhood,
  pp.max_distance,
  pp.is_presential,
  pp.is_remote,
  pp.is_residential,
  pp.is_commercial,
  pp.is_emergency,
  pp.work_weekends,
  pp.work_night,
  pp.has_vehicle,
  pp.has_tools,
  pp.issues_invoice,
  pp.has_mei,
  pp.availability,
  pp.availability_forecast,
  pp.availability_updated_at,
  pp.rating_avg,
  pp.rating_count,
  pp.is_verified,
  pp.response_time_avg
from public.profiles p
join public.professional_profiles pp on p.id = pp.id
where p.role = 'professional';


-- =========================================================================
-- 8. GATILHOS DE ATUALIZAÇÃO AUTOMÁTICA (updated_at)
-- =========================================================================

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_professional_profiles_updated_at before update on public.professional_profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_contractor_profiles_updated_at before update on public.contractor_profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_payments_updated_at before update on public.payments
  for each row execute procedure public.update_updated_at_column();

create trigger update_service_requests_updated_at before update on public.service_requests
  for each row execute procedure public.update_updated_at_column();

create trigger update_verifications_updated_at before update on public.verifications
  for each row execute procedure public.update_updated_at_column();

create trigger update_moderation_queue_updated_at before update on public.moderation_queue
  for each row execute procedure public.update_updated_at_column();

create trigger update_support_tickets_updated_at before update on public.support_tickets
  for each row execute procedure public.update_updated_at_column();


-- =========================================================================
-- 9. FUNÇÕES DE BANCO TRANSACIONAIS E PROTEGIDAS (RPC)
-- =========================================================================

-- RPC: Desbloquear Contato (Transação atômica que deduz crédito e revela contato)
create or replace function public.unlock_contact(
  p_contractor_id uuid,
  p_professional_id uuid
)
returns jsonb
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_unlocked boolean;
  v_balance_before integer;
  v_balance_after integer;
  v_professional_name text;
begin
  -- 1. Verificar se o contato já foi desbloqueado por este contratante
  select exists(
    select 1 from contact_unlocks
    where contractor_id = p_contractor_id and professional_id = p_professional_id
  ) into v_unlocked;

  if v_unlocked then
    return jsonb_build_object('success', true, 'message', 'Contato já desbloqueado anteriormente');
  end if;

  -- 2. Verificar saldo do contratante
  select balance into v_balance from wallets where contractor_id = p_contractor_id;
  if v_balance is null or v_balance < 1 then
    raise exception 'Saldo insuficiente de créditos para desbloquear o contato.';
  end if;

  -- 3. Debitar 1 crédito
  v_balance_before := v_balance;
  v_balance_after := v_balance - 1;

  update wallets
  set balance = v_balance_after, updated_at = now()
  where contractor_id = p_contractor_id;

  -- 4. Obter nome do profissional para o descritivo
  select full_name into v_professional_name from profiles where id = p_professional_id;

  -- 5. Inserir registro no extrato (credit_transactions)
  insert into credit_transactions (wallet_id, type, amount, balance_before, balance_after, description)
  values (
    p_contractor_id,
    'unlock',
    -1,
    v_balance_before,
    v_balance_after,
    'Desbloqueio de contato do profissional: ' || coalesce(v_professional_name, 'Autônomo')
  );

  -- 6. Inserir registro na tabela de desbloqueio
  insert into contact_unlocks (contractor_id, professional_id)
  values (p_contractor_id, p_professional_id);

  -- 7. Criar notificação interna para o profissional
  insert into notifications (profile_id, title, message, link)
  values (
    p_professional_id,
    'Contato Desbloqueado!',
    'Um contratante acabou de liberar seus dados de contato. Prepare-se para ser procurado!',
    '/profissional/desbloqueios'
  );

  return jsonb_build_object(
    'success', true, 
    'message', 'Contato desbloqueado com sucesso.', 
    'balance_after', v_balance_after
  );
end;
$$ language plpgsql;

-- RPC: Obter dados de contato revelados após validação de segurança
create or replace function public.get_unlocked_contact_info(
  p_contractor_id uuid,
  p_professional_id uuid
)
returns table (
  email text,
  phone text,
  website text,
  instagram text,
  facebook text,
  tiktok text,
  youtube text,
  linkedin text
) 
security definer
set search_path = public
as $$
declare
  v_is_unlocked boolean;
  v_role text;
  v_caller_id uuid;
begin
  -- Identificar id do usuário logado via Supabase Auth
  v_caller_id := auth.uid();
  
  -- Identificar papel (role) do usuário logado
  select role into v_role from profiles where id = v_caller_id;

  -- Verificar se existe o desbloqueio ativo
  select exists(
    select 1 from contact_unlocks
    where contractor_id = p_contractor_id and professional_id = p_professional_id
  ) into v_is_unlocked;

  -- Regra de Acesso: O solicitante deve ser o contratante do desbloqueio, o próprio profissional ou admin.
  if (v_caller_id = p_contractor_id and v_is_unlocked)
     or (v_caller_id = p_professional_id)
     or (v_role = 'admin') then
     
    return query
    select 
      p.email,
      p.phone,
      pp.website,
      pp.instagram,
      pp.facebook,
      pp.tiktok,
      pp.youtube,
      pp.linkedin
    from profiles p
    join professional_profiles pp on p.id = pp.id
    where p.id = p_professional_id;
  else
    raise exception 'Acesso negado: Contatos não desbloqueados por este contratante.';
  end if;
end;
$$ language plpgsql;

-- RPC: Adicionar créditos à carteira (Utilizado por webhooks ou painel administrador)
create or replace function public.add_credits_to_wallet(
  p_contractor_id uuid,
  p_credits integer,
  p_description text
)
returns jsonb
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_balance_before integer;
  v_balance_after integer;
begin
  select balance into v_balance from wallets where contractor_id = p_contractor_id;
  if v_balance is null then
    insert into wallets (contractor_id, balance) values (p_contractor_id, 0);
    v_balance := 0;
  end if;

  v_balance_before := v_balance;
  v_balance_after := v_balance + p_credits;

  update wallets
  set balance = v_balance_after, updated_at = now()
  where contractor_id = p_contractor_id;

  insert into credit_transactions (wallet_id, type, amount, balance_before, balance_after, description)
  values (
    p_contractor_id,
    'purchase',
    p_credits,
    v_balance_before,
    v_balance_after,
    p_description
  );

  return jsonb_build_object(
    'success', true, 
    'balance_after', v_balance_after
  );
end;
$$ language plpgsql;

-- RPC: Gatilho automático de criação de perfil público ao registrar na Auth do Supabase
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Usuário Fictício'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'contractor'),
    new.phone
  );

  -- Fluxo condicional para tabelas auxiliares
  if coalesce(new.raw_user_meta_data->>'role', 'contractor') = 'professional' then
    insert into public.professional_profiles (id, availability, rating_avg, rating_count, is_verified)
    values (new.id, 'unconfirmed', 0.00, 0, false);
  elsif coalesce(new.raw_user_meta_data->>'role', 'contractor') = 'contractor' then
    insert into public.contractor_profiles (id, contractor_type)
    values (new.id, 'individual');
    -- Criar carteira zerada para o contratante
    insert into public.wallets (contractor_id, balance)
    values (new.id, 0);
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger vinculando auth.users com handle_new_user
-- Nota: Habilitar essa trigger no Supabase após a criação das tabelas
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();


-- =========================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Ativar RLS em todas as tabelas privadas/estratégicas
alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.contractor_profiles enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.service_areas enable row level security;
alter table public.wallets enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.contact_unlocks enable row level security;
alter table public.payments enable row level security;
alter table public.service_requests enable row level security;
alter table public.service_interests enable row level security;
alter table public.reviews enable row level security;
alter table public.review_criteria enable row level security;
alter table public.review_responses enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;
alter table public.verifications enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.support_tickets enable row level security;
alter table public.terms_acceptances enable row level security;
alter table public.admin_logs enable row level security;

-- Políticas: PROFILES
create policy "Qualquer um visualiza perfis públicos" on public.profiles
  for select using (role = 'professional');
create policy "O próprio usuário edita seu perfil" on public.profiles
  for update using (auth.uid() = id);
create policy "Usuário logado lê o próprio perfil" on public.profiles
  for select using (auth.uid() = id);
create policy "Admins têm acesso total a perfis" on public.profiles
  to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: PROFESSIONAL_PROFILES
create policy "Acesso de leitura público a dados não-sensíveis" on public.professional_profiles
  for select using (true);
create policy "O próprio profissional atualiza seus dados" on public.professional_profiles
  for update using (auth.uid() = id);
create policy "Admins têm acesso total a dados de profissionais" on public.professional_profiles
  to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: CONTRACTOR_PROFILES
create policy "O próprio contratante visualiza seus dados" on public.contractor_profiles
  for select using (auth.uid() = id);
create policy "O próprio contratante atualiza seus dados" on public.contractor_profiles
  for update using (auth.uid() = id);
create policy "Admins têm acesso total a dados de contratantes" on public.contractor_profiles
  to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: PORTFOLIO_ITEMS
create policy "Qualquer um visualiza portfólios" on public.portfolio_items
  for select using (true);
create policy "Profissional edita seu próprio portfólio" on public.portfolio_items
  for all using (auth.uid() = professional_id);

-- Políticas: WALLETS
create policy "O próprio contratante visualiza sua carteira" on public.wallets
  for select using (auth.uid() = contractor_id);
create policy "Admins lêem todas as carteiras" on public.wallets
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: CREDIT_TRANSACTIONS
create policy "O próprio contratante lê seu extrato" on public.credit_transactions
  for select using (auth.uid() = wallet_id);
create policy "Admins lêem todo o histórico de extratos" on public.credit_transactions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: CONTACT_UNLOCKS
create policy "Visualiza se for o contratante ou profissional do desbloqueio" on public.contact_unlocks
  for select using (auth.uid() = contractor_id or auth.uid() = professional_id);
create policy "Admins lêem todos os desbloqueios" on public.contact_unlocks
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: SERVICE_REQUESTS (Oportunidades)
create policy "Qualquer um lê oportunidades publicadas" on public.service_requests
  for select using (status = 'published');
create policy "Contratante lê suas próprias oportunidades" on public.service_requests
  for select using (auth.uid() = contractor_id);
create policy "Contratante cria e edita suas oportunidades" on public.service_requests
  for all using (auth.uid() = contractor_id);
create policy "Admins têm acesso total a oportunidades" on public.service_requests
  to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: SERVICE_INTERESTS (Candidaturas)
create policy "Profissional gerencia suas demonstrações de interesse" on public.service_interests
  for all using (auth.uid() = professional_id);
create policy "Contratante lê interessados na sua oportunidade" on public.service_interests
  for select using (exists (
    select 1 from public.service_requests r 
    where r.id = request_id and r.contractor_id = auth.uid()
  ));

-- Políticas: REVIEWS (Avaliações)
create policy "Qualquer um lê avaliações" on public.reviews
  for select using (true);
create policy "Contratante cria avaliação para serviços contratados" on public.reviews
  for insert with check (auth.uid() = contractor_id);
create policy "Admins gerenciam avaliações" on public.reviews
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Políticas: NOTIFICATIONS
create policy "O próprio usuário gerencia suas notificações" on public.notifications
  for all using (auth.uid() = profile_id);
