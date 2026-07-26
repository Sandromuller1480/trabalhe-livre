-- Correção direta do login administrador no Supabase Auth
-- Login: trabalhelivre@gmail.com
-- Senha: 123456SJ

insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  created_at,
  updated_at
) values (
  'd0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'trabalhelivre@gmail.com',
  crypt('123456SJ', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Administrador TL","role":"admin"}',
  false,
  'authenticated',
  'authenticated',
  now(),
  now()
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = coalesce(auth.users.email_confirmed_at, excluded.email_confirmed_at),
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  role = excluded.role,
  aud = excluded.aud,
  updated_at = now();

delete from auth.identities
where user_id = 'd0000000-0000-0000-0000-000000000001'
  and provider = 'email';

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  'd0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'sub', 'd0000000-0000-0000-0000-000000000001',
    'email', 'trabalhelivre@gmail.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now()
)
on conflict (id) do update set
  user_id = excluded.user_id,
  provider_id = excluded.provider_id,
  identity_data = excluded.identity_data,
  provider = excluded.provider,
  updated_at = now();

insert into public.profiles (id, role, email, phone, full_name) values
  ('d0000000-0000-0000-0000-000000000001', 'admin', 'trabalhelivre@gmail.com', null, 'Administrador TL')
on conflict (id) do update set
  role = excluded.role,
  email = excluded.email,
  phone = excluded.phone,
  full_name = excluded.full_name;
