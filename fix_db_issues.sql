-- CORREÇÕES DE SEGURANÇA E CONEXÃO DO BANCO DE DADOS - PLATAFORMA TRABALHE LIVRE
-- Este script resolve os problemas de políticas RLS em tabelas de catálogo/leitura pública e habilita o gatilho automático de novos cadastros.

-- =========================================================================
-- 1. GATILHO DE CADASTRO AUTOMÁTICO (VINCULA AUTH.USERS COM PUBLIC.PROFILES)
-- =========================================================================

-- Remover trigger se já existir
drop trigger if exists on_auth_user_created on auth.users;

-- Criar a trigger para executar handle_new_user() após a inserção de usuários no Supabase Auth
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- 2. POLÍTICAS DE ROW LEVEL SECURITY (RLS) PARA LEITURA PÚBLICA
-- =========================================================================

-- Habilitar RLS nas tabelas caso não estejam habilitadas (garantia)
alter table public.categories enable row level security;
alter table public.specialties enable row level security;
alter table public.professional_specialties enable row level security;
alter table public.service_areas enable row level security;
alter table public.credit_packages enable row level security;
alter table public.review_criteria enable row level security;
alter table public.review_responses enable row level security;
alter table public.service_request_media enable row level security;
alter table public.availability_history enable row level security;
alter table public.favorites enable row level security;
alter table public.terms_acceptances enable row level security;
alter table public.support_tickets enable row level security;

-- Categorias (categories): Leitura liberada para qualquer um (anon e autenticado)
drop policy if exists "Qualquer um lê categorias" on public.categories;
create policy "Qualquer um lê categorias" on public.categories
  for select using (true);

-- Especialidades (specialties): Leitura liberada para qualquer um
drop policy if exists "Qualquer um lê especialidades" on public.specialties;
create policy "Qualquer um lê especialidades" on public.specialties
  for select using (true);

-- Especialidades vinculadas aos profissionais (professional_specialties): Leitura liberada, escrita pelo próprio profissional
drop policy if exists "Qualquer um lê especialidades dos profissionais" on public.professional_specialties;
create policy "Qualquer um lê especialidades dos profissionais" on public.professional_specialties
  for select using (true);

drop policy if exists "Profissional gerencia suas especialidades" on public.professional_specialties;
create policy "Profissional gerencia suas especialidades" on public.professional_specialties
  for all using (auth.uid() = professional_id);

-- Áreas de Atendimento (service_areas): Leitura liberada, escrita pelo próprio profissional
drop policy if exists "Qualquer um lê áreas de atendimento" on public.service_areas;
create policy "Qualquer um lê áreas de atendimento" on public.service_areas
  for select using (true);

drop policy if exists "Profissional gerencia suas áreas de atendimento" on public.service_areas;
create policy "Profissional gerencia suas áreas de atendimento" on public.service_areas
  for all using (auth.uid() = professional_id);

-- Pacotes de Créditos (credit_packages): Leitura liberada para qualquer um
drop policy if exists "Qualquer um lê pacotes de crédito" on public.credit_packages;
create policy "Qualquer um lê pacotes de crédito" on public.credit_packages
  for select using (true);

-- Critérios de Avaliação (review_criteria): Leitura liberada para qualquer um
drop policy if exists "Qualquer um lê critérios de avaliação" on public.review_criteria;
create policy "Qualquer um lê critérios de avaliação" on public.review_criteria
  for select using (true);

-- Respostas de Avaliações (review_responses): Leitura liberada para qualquer um
drop policy if exists "Qualquer um lê respostas de avaliação" on public.review_responses;
create policy "Qualquer um lê respostas de avaliação" on public.review_responses
  for select using (true);

-- Mídias de Oportunidades (service_request_media): Leitura liberada para qualquer um
drop policy if exists "Qualquer um lê mídias de oportunidades" on public.service_request_media;
create policy "Qualquer um lê mídias de oportunidades" on public.service_request_media
  for select using (true);

-- Histórico de disponibilidade (availability_history): Leitura liberada para qualquer um
drop policy if exists "Qualquer um lê histórico de disponibilidade" on public.availability_history;
create policy "Qualquer um lê histórico de disponibilidade" on public.availability_history
  for select using (true);

-- Favoritos (favorites): Gerenciamento e leitura pelo próprio contratante
drop policy if exists "Contratante gerencia seus favoritos" on public.favorites;
create policy "Contratante gerencia seus favoritos" on public.favorites
  for all using (auth.uid() = contractor_id);

drop policy if exists "Contratante lê seus favoritos" on public.favorites;
create policy "Contratante lê seus favoritos" on public.favorites
  for select using (auth.uid() = contractor_id);

-- Aceite de Termos (terms_acceptances): Usuário grava e lê seus próprios aceites
drop policy if exists "Usuário cria seu próprio aceite" on public.terms_acceptances;
create policy "Usuário cria seu próprio aceite" on public.terms_acceptances
  for insert with check (auth.uid() = profile_id);

drop policy if exists "Usuário visualiza seu próprio aceite" on public.terms_acceptances;
create policy "Usuário visualiza seu próprio aceite" on public.terms_acceptances
  for select using (auth.uid() = profile_id);

-- Chamados de Suporte (support_tickets): Usuário gerencia seus chamados, Admins gerenciam todos
drop policy if exists "Usuário cria seus chamados" on public.support_tickets;
create policy "Usuário cria seus chamados" on public.support_tickets
  for insert with check (auth.uid() = profile_id);

drop policy if exists "Usuário lê seus próprios chamados" on public.support_tickets;
create policy "Usuário lê seus próprios chamados" on public.support_tickets
  for select using (auth.uid() = profile_id);

drop policy if exists "Admins gerenciam todos os chamados" on public.support_tickets;
create policy "Admins gerenciam todos os chamados" on public.support_tickets
  for all to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
