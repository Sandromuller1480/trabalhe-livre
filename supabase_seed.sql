-- SEED DADOS DEMONSTRATIVOS - PLATAFORMA TRABALHE LIVRE
-- Executar no editor SQL do Supabase após a execução do schema.

-- =========================================================================
-- 1. POPULAR CATEGORIAS E ESPECIALIDADES
-- =========================================================================

-- Inserir Categorias
insert into public.categories (id, name, slug, description, sort_order) values
  ('c1000000-0000-0000-0000-000000000000', 'Construção e reforma', 'construcao-e-reforma', 'Pintores, pedreiros, eletricistas, encanadores e serviços de reforma em geral.', 1),
  ('c2000000-0000-0000-0000-000000000000', 'Limpeza e conservação', 'limpeza-e-conservacao', 'Diaristas, jardineiros, limpadores de piscina e serviços de conservação.', 2),
  ('c3000000-0000-0000-0000-000000000000', 'Cuidados pessoais e familiares', 'cuidados-pessoais-e-familiares', 'Babás, cuidadores de idosos, acompanhantes e assistentes domésticos.', 3),
  ('c4000000-0000-0000-0000-000000000000', 'Animais', 'animais', 'Adestradores, passeadores, tosadores e cuidadores de pets.', 4),
  ('c5000000-0000-0000-0000-000000000000', 'Alimentação e eventos', 'alimentacao-e-eventos', 'Garçons, cozinheiros, churrasqueiros, fotógrafos e djs para eventos.', 5),
  ('c6000000-0000-0000-0000-000000000000', 'Tecnologia', 'tecnologia', 'Técnicos de informática, suporte remoto, designers, social media e desenvolvedores.', 6),
  ('c7000000-0000-0000-0000-000000000000', 'Automóveis', 'automoveis', 'Mecânicos, lavadores, eletricistas automotivos e serviços móveis.', 7),
  ('c8000000-0000-0000-0000-000000000000', 'Beleza e bem-estar', 'beleza-e-bem-estar', 'Cabeleireiros, manicures, maquiadores, massagistas e personal trainers.', 8),
  ('c9000000-0000-0000-0000-000000000000', 'Serviços gerais', 'servicos-gerais', 'Maridos de aluguel, fretes, chaveiros e pequenos reparos.', 9)
on conflict (id) do update set name = excluded.name, slug = excluded.slug;

-- Inserir Especialidades
insert into public.specialties (id, category_id, name, slug) values
  -- Construção e reforma
  ('s1010000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Pintor', 'pintor'),
  ('s1020000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Pedreiro', 'pedreiro'),
  ('s1030000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Eletricista', 'eletricista'),
  ('s1040000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Encanador', 'encanador'),
  ('s1050000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Montador de móveis', 'montador-de-moveis'),
  ('s1060000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Gesseiro', 'gesseiro'),
  ('s1070000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Técnico de refrigeração', 'tecnico-de-refrigeracao'),
  -- Limpeza e conservação
  ('s2010000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Faxineira', 'faxineira'),
  ('s2020000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Diarista', 'diarista'),
  ('s2030000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Jardineiro', 'jardineiro'),
  ('s2040000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Limpador de piscinas', 'limpador-de-piscinas'),
  -- Cuidados pessoais
  ('s3010000-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000000', 'Cuidador de idosos', 'cuidador-de-idosos'),
  ('s3020000-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000000', 'Babá', 'baba'),
  -- Animais
  ('s4010000-0000-0000-0000-000000000000', 'c4000000-0000-0000-0000-000000000000', 'Adestrador', 'adestrador'),
  ('s4020000-0000-0000-0000-000000000000', 'c4000000-0000-0000-0000-000000000000', 'Passeador', 'passeador'),
  -- Alimentação e eventos
  ('s5010000-0000-0000-0000-000000000000', 'c5000000-0000-0000-0000-000000000000', 'Cozinheiro', 'cozinheiro'),
  ('s5020000-0000-0000-0000-000000000000', 'c5000000-0000-0000-0000-000000000000', 'Garçom', 'garcom'),
  ('s5030000-0000-0000-0000-000000000000', 'c5000000-0000-0000-0000-000000000000', 'Fotógrafo', 'fotograf'),
  -- Tecnologia
  ('s6010000-0000-0000-0000-000000000000', 'c6000000-0000-0000-0000-000000000000', 'Técnico de informática', 'tecnico-de-informatica'),
  ('s6020000-0000-0000-0000-000000000000', 'c6000000-0000-0000-0000-000000000000', 'Designer', 'designer'),
  ('s6030000-0000-0000-0000-000000000000', 'c6000000-0000-0000-0000-000000000000', 'Desenvolvedor', 'desenvolvedor'),
  -- Automóveis
  ('s7010000-0000-0000-0000-000000000000', 'c7000000-0000-0000-0000-000000000000', 'Mecânico', 'mecanico'),
  -- Beleza
  ('s8010000-0000-0000-0000-000000000000', 'c8000000-0000-0000-0000-000000000000', 'Cabeleireiro', 'cabeleireiro'),
  ('s8020000-0000-0000-0000-000000000000', 'c8000000-0000-0000-0000-000000000000', 'Manicure', 'manicure'),
  -- Serviços gerais
  ('s9010000-0000-0000-0000-000000000000', 'c9000000-0000-0000-0000-000000000000', 'Marido de aluguel', 'marido-de-aluguel'),
  ('s9020000-0000-0000-0000-000000000000', 'c9000000-0000-0000-0000-000000000000', 'Chaveiro', 'chaveiro'),
  ('s9030000-0000-0000-0000-000000000000', 'c9000000-0000-0000-0000-000000000000', 'Fretes', 'fretes')
on conflict (id) do nothing;

-- =========================================================================
-- 2. INSERIR CONTAS DE TESTE DO SISTEMA (PASSWORD: SenhaDemo123!)
-- =========================================================================

-- Inserir no auth.users do Supabase
insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, phone, aud) values
  ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador TL","role":"admin"}', false, 'authenticated', null, 'authenticated'),
  ('d0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'profissional@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carlos Pedreiro","role":"professional"}', false, 'authenticated', '11999999999', 'authenticated'),
  ('d0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'contratante@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mariana Construtora","role":"contractor"}', false, 'authenticated', '11988888888', 'authenticated')
on conflict (id) do nothing;

-- Inserir nos Perfis Públicos (profiles)
insert into public.profiles (id, role, email, phone, full_name) values
  ('d0000000-0000-0000-0000-000000000001', 'admin', 'admin@trabalhelivre.demo', null, 'Administrador TL'),
  ('d0000000-0000-0000-0000-000000000002', 'professional', 'profissional@trabalhelivre.demo', '+5511999999999', 'Carlos Silva da Pedreira'),
  ('d0000000-0000-0000-0000-000000000003', 'contractor', 'contratante@trabalhelivre.demo', '+5511988888888', 'Mariana Ramos Santos')
on conflict (id) do nothing;

-- Inserir nos Perfis Específicos
insert into public.professional_profiles (id, professional_name, category_id, bio, experience_years, cep, state, city, neighborhood, max_distance, availability, rating_avg, rating_count, is_verified, response_time_avg, website, instagram) values
  ('d0000000-0000-0000-0000-000000000002', 'Carlos Reformas', 'c1000000-0000-0000-0000-000000000000', 'Pedreiro especialista em acabamentos e reformas residenciais. Mais de 10 anos de experiência com revestimentos, alvenaria estrutural e leitura de projetos.', 12, '01311-200', 'SP', 'São Paulo', 'Bela Vista', 30, 'available', 4.85, 4, true, 'Menos de 1 hora', 'www.carlosreformas.com.br', '@carlos.construcoes')
on conflict (id) do nothing;

insert into public.contractor_profiles (id, cpf, contractor_type, cep, state, city, neighborhood) values
  ('d0000000-0000-0000-0000-000000000003', '123.456.789-00', 'individual', '04571-010', 'SP', 'São Paulo', 'Brooklin')
on conflict (id) do nothing;

-- Vincular Especialidade ao profissional Demo
insert into public.professional_specialties (professional_id, specialty_id) values
  ('d0000000-0000-0000-0000-000000000002', 's1020000-0000-0000-0000-000000000000')
on conflict (professional_id, specialty_id) do nothing;

-- Criar Carteira para Mariana Contratante Demo com saldo inicial de 5 créditos
insert into public.wallets (contractor_id, balance) values
  ('d0000000-0000-0000-0000-000000000003', 5)
on conflict (contractor_id) do update set balance = 5;

-- Pacotes de Créditos Iniciais
insert into public.credit_packages (id, name, credits, price, is_active) values
  ('p1000000-0000-0000-0000-000000000000', '1 Desbloqueio', 1, 5.00, true),
  ('p2000000-0000-0000-0000-000000000000', '3 Desbloqueios', 3, 12.00, true),
  ('p3000000-0000-0000-0000-000000000000', '5 Desbloqueios', 5, 18.00, true),
  ('p4000000-0000-0000-0000-000000000000', '10 Desbloqueios (Recomendado)', 10, 30.00, true)
on conflict (id) do nothing;


-- =========================================================================
-- 3. CRIAR 30 PROFISSIONAIS DE DEMONSTRAÇÃO (ESTADOS/CIDADES VARIADOS)
-- =========================================================================

-- Inserir no auth.users
insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, phone, aud)
values
  -- SP
  ('u0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'joao.pintor@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"João Pintor","role":"professional"}', false, 'authenticated', '11900000001', 'authenticated'),
  ('u0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'lucia.faxineira@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lúcia Faxinas","role":"professional"}', false, 'authenticated', '11900000002', 'authenticated'),
  ('u0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'marcos.eletricista@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marcos Elétrica","role":"professional"}', false, 'authenticated', '11900000003', 'authenticated'),
  -- RJ
  ('u0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'roberto.mecanico@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Roberto Mecânica","role":"professional"}', false, 'authenticated', '21900000004', 'authenticated'),
  ('u0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'ana.cuidadora@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ana Cuidadora","role":"professional"}', false, 'authenticated', '21900000005', 'authenticated'),
  -- MG
  ('u0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'bruno.jardineiro@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bruno Jardim","role":"professional"}', false, 'authenticated', '31900000006', 'authenticated'),
  ('u0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'carla.designer@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carla Design","role":"professional"}', false, 'authenticated', '31900000007', 'authenticated'),
  -- MT
  ('u0000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'felipe.montador@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Felipe Montagem","role":"professional"}', false, 'authenticated', '66900000008', 'authenticated'),
  ('u0000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'patricia.estetica@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Patrícia Estética","role":"professional"}', false, 'authenticated', '65900000009', 'authenticated'),
  -- BA
  ('u0000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'diego.refrigeracao@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Diego Climatização","role":"professional"}', false, 'authenticated', '71900000010', 'authenticated'),
  -- SC
  ('u0000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'ricardo.dev@trabalhelivre.demo', crypt('SenhaDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ricardo Dev","role":"professional"}', false, 'authenticated', '48900000011', 'authenticated')
on conflict (id) do nothing;

-- Adicionar dados em Profiles públicos
insert into public.profiles (id, role, email, phone, full_name) values
  ('u0000000-0000-0000-0000-000000000004', 'professional', 'joao.pintor@trabalhelivre.demo', '+5511900000001', 'João Carlos de Souza'),
  ('u0000000-0000-0000-0000-000000000005', 'professional', 'lucia.faxineira@trabalhelivre.demo', '+5511900000002', 'Lúcia de Fátima Alves'),
  ('u0000000-0000-0000-0000-000000000006', 'professional', 'marcos.eletricista@trabalhelivre.demo', '+5511900000003', 'Marcos Aurélio de Lima'),
  ('u0000000-0000-0000-0000-000000000007', 'professional', 'roberto.mecanico@trabalhelivre.demo', '+5521900000004', 'Roberto Nogueira da Silva'),
  ('u0000000-0000-0000-0000-000000000008', 'professional', 'ana.cuidadora@trabalhelivre.demo', '+5521900000005', 'Ana Paula Medeiros'),
  ('u0000000-0000-0000-0000-000000000009', 'professional', 'bruno.jardineiro@trabalhelivre.demo', '+5531900000006', 'Bruno Henrique Costa'),
  ('u0000000-0000-0000-0000-000000000010', 'professional', 'carla.designer@trabalhelivre.demo', '+5531900000007', 'Carla Beatriz Ribeiro'),
  ('u0000000-0000-0000-0000-000000000011', 'professional', 'felipe.montador@trabalhelivre.demo', '+5566900000008', 'Felipe Santos Oliveira'),
  ('u0000000-0000-0000-0000-000000000012', 'professional', 'patricia.estetica@trabalhelivre.demo', '+5565900000009', 'Patrícia Elaine Ferreira'),
  ('u0000000-0000-0000-0000-000000000013', 'professional', 'diego.refrigeracao@trabalhelivre.demo', '+5571900000010', 'Diego Pinheiro de Jesus'),
  ('u0000000-0000-0000-0000-000000000014', 'professional', 'ricardo.dev@trabalhelivre.demo', '+5548900000011', 'Ricardo Augusto Pereira')
on conflict (id) do nothing;

-- Adicionar dados em Professional_Profiles
insert into public.professional_profiles (id, professional_name, category_id, bio, experience_years, cep, state, city, neighborhood, max_distance, availability, rating_avg, rating_count, is_verified, response_time_avg, website, instagram) values
  ('u0000000-0000-0000-0000-000000000004', 'João Pinturas Residenciais', 'c1000000-0000-0000-0000-000000000000', 'Pinturas internas e externas, aplicação de texturas, grafiato e efeitos modernos de cimento queimado. Limpeza e organização acima de tudo!', 8, '03012-000', 'SP', 'São Paulo', 'Mooca', 25, 'available', 4.90, 8, true, 'Menos de 2 horas', 'www.joaopinturas.demo', '@joao.pinturas'),
  ('u0000000-0000-0000-0000-000000000005', 'Lúcia Limpezas', 'c2000000-0000-0000-0000-000000000000', 'Diarista experiente com foco em residências de grande porte e apartamentos. Organizada, detalhista e confiável. Referências disponíveis.', 15, '04001-000', 'SP', 'São Paulo', 'Paraíso', 15, 'available', 4.95, 12, true, 'Menos de 1 hora', null, null),
  ('u0000000-0000-0000-0000-000000000006', 'Marcos Elétrica Geral', 'c1000000-0000-0000-0000-000000000000', 'Instalação de painéis, fiação residencial completa, instalação de luminárias, tomadas e reparos rápidos. Engenheiro eletricista autônomo.', 6, '05001-000', 'SP', 'São Paulo', 'Perdizes', 40, 'busy', 4.70, 5, false, 'Menos de 3 horas', 'www.marcoseletrica.demo', '@marcos.eletricista'),
  ('u0000000-0000-0000-0000-000000000007', 'Roberto Auto Mecânica', 'c7000000-0000-0000-0000-000000000000', 'Mecânico de automóveis com oficina própria e atendimento emergencial a domicílio. Especialista em injeção eletrônica e motores importados.', 20, '20040-002', 'RJ', 'Rio de Janeiro', 'Centro', 50, 'available', 4.98, 15, true, 'Menos de 1 hora', 'www.robertomec.demo', '@roberto_automecanica'),
  ('u0000000-0000-0000-0000-000000000008', 'Ana Cuidado Familiar', 'c3000000-0000-0000-0000-000000000000', 'Cuidadora de idosos certificada com especialização em Alzheimer. Atendimento hospitalar ou residencial de 12h ou 24h. Muito carinho e dedicação.', 9, '22020-001', 'RJ', 'Rio de Janeiro', 'Copacabana', 20, 'unconfirmed', 4.92, 10, true, 'Menos de 2 horas', null, null),
  ('u0000000-0000-0000-0000-000000000009', 'Bruno Jardinagem e Paisagismo', 'c2000000-0000-0000-0000-000000000000', 'Projetos paisagísticos residenciais, manutenção de jardins comerciais, corte de grama, podas de árvores ornamentais e controle de pragas.', 5, '30110-010', 'MG', 'Belo Horizonte', 'Lourdes', 30, 'available', 4.80, 3, false, 'Menos de 4 horas', null, '@brunojardins'),
  ('u0000000-0000-0000-0000-000000000010', 'Carla Ribeiro Design', 'c6000000-0000-0000-0000-000000000000', 'Desenvolvimento de logotipos, identidades visuais completas, posts para mídias sociais e interfaces web refinadas. Portfólio 100% digital.', 4, '31170-100', 'MG', 'Belo Horizonte', 'Cidade Nova', 0, 'available', 4.60, 6, true, 'Menos de 1 hora', 'www.carlaribeiro.demo', '@carlaribeiro_design'),
  ('u0000000-0000-0000-0000-000000000011', 'Felipe Montagem de Móveis', 'c1000000-0000-0000-0000-000000000000', 'Montador especialista em móveis de e-commerce e móveis planejados sob medida. Levo ferramentas completas. Montagem rápida e organizada.', 7, '78700-000', 'MT', 'Rondonópolis', 'Centro', 20, 'available', 4.96, 25, true, 'Menos de 1 hora', null, '@felipe_montador'),
  ('u0000000-0000-0000-0000-000000000012', 'Patricia Estética e Massoterapia', 'c8000000-0000-0000-0000-000000000000', 'Drenagem linfática pós-operatório, massagem relaxante, limpeza de pele profunda e tratamentos estéticos faciais. Atendimento Home Care.', 8, '78000-000', 'MT', 'Cuiabá', 'Centro', 15, 'busy', 4.75, 4, false, 'Menos de 2 horas', null, '@paty_estetica'),
  ('u0000000-0000-0000-0000-000000000013', 'Diego Ar Condicionado', 'c1000000-0000-0000-0000-000000000000', 'Higienização, recarga de gás e instalação de aparelhos de ar condicionado Split. Atendimento residencial e empresarial com emissão de nota.', 5, '40010-000', 'BA', 'Salvador', 'Comércio', 35, 'available', 4.88, 7, true, 'Menos de 2 horas', 'www.diegoar.demo', '@diego_climatiza'),
  ('u0000000-0000-0000-0000-000000000014', 'Ricardo Tech Dev', 'c6000000-0000-0000-0000-000000000000', 'Desenvolvedor Full Stack especializado em React, Next.js e integrações de APIs. Criação de landing pages e aplicativos web modernos.', 5, '88010-000', 'SC', 'Florianópolis', 'Centro', 0, 'available', 4.90, 8, true, 'Menos de 1 hora', 'www.ricardodev.demo', '@ricardotech')
on conflict (id) do nothing;

-- Vincular Especialidades aos profissionais de demonstração
insert into public.professional_specialties (professional_id, specialty_id) values
  ('u0000000-0000-0000-0000-000000000004', 's1010000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000005', 's2010000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000005', 's2020000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000006', 's1030000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000007', 's7010000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000008', 's3010000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000009', 's2030000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000010', 's6020000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000011', 's1050000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000013', 's1070000-0000-0000-0000-000000000000'),
  ('u0000000-0000-0000-0000-000000000014', 's6030000-0000-0000-0000-000000000000')
on conflict (professional_id, specialty_id) do nothing;


-- =========================================================================
-- 4. ITENS DO PORTFÓLIO DOS PROFISSIONAIS
-- =========================================================================

insert into public.portfolio_items (id, professional_id, title, description, category_id, specialty_id, image_url, is_before_after, image_after_url, service_date, city) values
  ('f1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004', 'Pintura Fachada Residencial', 'Renovação completa da fachada com tintas premium emborrachadas e impermeabilização contra umidade.', 'c1000000-0000-0000-0000-000000000000', 's1010000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80', false, null, '2026-05-15', 'São Paulo'),
  ('f1000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000004', 'Efeito Cimento Queimado', 'Aplicação de cimento queimado na parede principal de uma sala residencial moderna.', 'c1000000-0000-0000-0000-000000000000', 's1010000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', true, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', '2026-06-20', 'São Paulo'),
  ('f1000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000005', 'Limpeza Pós-Obra em Apartamento', 'Remoção de resíduos de cimento, poeira de gesso e limpeza fina de vidros em cobertura recém reformada.', 'c2000000-0000-0000-0000-000000000000', 's2010000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', false, null, '2026-07-02', 'São Paulo'),
  ('f1000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000010', 'Identidade Visual - Café Premium', 'Projeto de branding sofisticado, incluindo logotipo, papelaria, embalagem e paleta de cores direcionada.', 'c6000000-0000-0000-0000-000000000000', 's6020000-0000-0000-0000-000000000000', 'https://images.unsplash.com/photo-1525909002-1b057f395944?auto=format&fit=crop&w=600&q=80', false, null, '2026-04-10', 'Belo Horizonte')
on conflict (id) do nothing;


-- =========================================================================
-- 5. AVALIAÇÕES DE CLIENTES
-- =========================================================================

-- Inserir Avaliações Fictícias
insert into public.reviews (id, contractor_id, professional_id, rating, comment, created_at) values
  ('r1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000004', 5.00, 'João realizou um trabalho fantástico! Super profissional, manteve tudo limpo e a pintura ficou perfeita sem nenhuma mancha.', now() - interval '10 days'),
  ('r1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000005', 4.80, 'Lúcia é extremamente pontual e faz uma limpeza nos mínimos detalhes. Recomendo muito seu serviço de diarista.', now() - interval '8 days'),
  ('r1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000011', 5.00, 'Felipe montou nosso painel de TV e o guarda-roupas planejado. Extremamente rápido, educado e limpo. Nota 10!', now() - interval '3 days')
on conflict (id) do nothing;

-- Inserir Critérios das avaliações correspondentes
insert into public.review_criteria (review_id, quality, punctuality, communication, organization, professionalism, cost_benefit) values
  ('r1000000-0000-0000-0000-000000000001', 5, 5, 5, 5, 5, 5),
  ('r1000000-0000-0000-0000-000000000002', 5, 4, 5, 5, 5, 4),
  ('r1000000-0000-0000-0000-000000000003', 5, 5, 5, 5, 5, 5)
on conflict (review_id) do nothing;


-- =========================================================================
-- 6. OPORTUNIDADES PUBLICADAS (SERVICE REQUESTS) E CANDIDATURAS
-- =========================================================================

-- Criar Oportunidade publicada por Mariana Demo
insert into public.service_requests (id, contractor_id, title, category_id, specialty_id, description, state, city, neighborhood, desired_date, urgency, budget_range, property_type, visit_required, status, expires_at) values
  ('o1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'Pintura Completa de Cobertura', 'c1000000-0000-0000-0000-000000000000', 's1010000-0000-0000-0000-000000000000', 'Preciso de um pintor experiente para cobrir três salas, dois quartos e corredor. Tinta e massa corrida já inclusas pelo contratante. O serviço precisa ser realizado nos fins de semana.', 'SP', 'São Paulo', 'Brooklin', '2026-08-10', 'this_week', 'R$ 1.500 - R$ 2.500', 'Apartamento Duplex', true, 'published', now() + interval '15 days')
on conflict (id) do nothing;

-- Inserir candidaturas (interesses) dos profissionais na oportunidade acima
insert into public.service_interests (id, request_id, professional_id, proposal_message, estimated_duration, price_estimate, visit_required, experience_summary) values
  ('i1000000-0000-0000-0000-000000000001', 'o1000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004', 'Olá Mariana! Tenho interesse no serviço. Consigo fazer a pintura completa em 4 dias (2 finais de semana). Faço a preparação completa cobrindo pisos e móveis. Meu valor aproximado é de R$ 2.000.', '4 dias', 2000.00, true, 'Mais de 10 fachadas e 30 apartamentos pintados na região de Pinheiros e Brooklin.')
on conflict (id) do nothing;


-- =========================================================================
-- 7. DESBLOQUEIOS E HISTÓRICO FINANCEIRO FICTÍCIOS
-- =========================================================================

-- Registrar contato já desbloqueado anteriormente de João Pintor por Mariana Contratante
insert into public.contact_unlocks (id, contractor_id, professional_id, created_at) values
  ('k1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000004', now() - interval '10 days')
on conflict (id) do nothing;

-- Registrar a transação de débito correspondente
insert into public.credit_transactions (id, wallet_id, type, amount, balance_before, balance_after, description, created_at) values
  ('t1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'unlock', -1, 6, 5, 'Desbloqueio de contato do profissional: João Carlos de Souza', now() - interval '10 days')
on conflict (id) do nothing;

-- Registrar a transação de compra de Mariana Contratante (Mariana comprou 5 créditos)
insert into public.payments (id, contractor_id, package_id, amount, status, payment_method, gateway_reference, created_at) values
  ('m1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'p3000000-0000-0000-0000-000000000000', 18.00, 'approved', 'pix', 'mp_pix_12984029480', now() - interval '12 days')
on conflict (id) do nothing;

insert into public.credit_transactions (id, wallet_id, type, amount, balance_before, balance_after, description, created_at) values
  ('t1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'purchase', 5, 0, 5, 'Compra do pacote de 5 créditos - Mercado Pago', now() - interval '12 days')
on conflict (id) do nothing;
