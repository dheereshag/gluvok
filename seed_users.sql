-- ===================================================
-- SEED DATA FOR AUTH.USERS IN SUPABASE
-- ===================================================

-- Ensure the pgcrypto extension is active for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clear any existing seed users to avoid conflicts (optional but recommended for clean runs)
-- DELETE FROM auth.users WHERE email LIKE '%@example.com';

-- 1. Super Admin
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
) VALUES (
  'f1a8e8b8-2b8d-4e9e-b5c6-7a8b9c0d1e2f',
  '00000000-0000-0000-0000-000000000000',
  'super@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"], "role": "super_admin"}'::jsonb,
  '{"name": "super"}'::jsonb,
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. Factory 1 Users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
) VALUES
('056c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'admin1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb, '{"name": "admin1a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('156c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'admin1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb, '{"name": "admin1b"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('1a6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'manager1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "manager"}'::jsonb, '{"name": "manager1a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('1b6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'manager1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "manager"}'::jsonb, '{"name": "manager1b"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('356c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'operator1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "operator"}'::jsonb, '{"name": "operator1a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('1d6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'operator1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "operator"}'::jsonb, '{"name": "operator1b"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('456c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'base1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "base"}'::jsonb, '{"name": "base1a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('1f6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'base1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "base"}'::jsonb, '{"name": "base1b"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 3. Factory 2 Users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
) VALUES
('2a6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'admin2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb, '{"name": "admin2a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('2b6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'admin2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb, '{"name": "admin2b"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('2c6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'manager2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "manager"}'::jsonb, '{"name": "manager2a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('2d6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'manager2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "manager"}'::jsonb, '{"name": "manager2b"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('2e6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'operator2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "operator"}'::jsonb, '{"name": "operator2a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('2f6c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'operator2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "operator"}'::jsonb, '{"name": "operator2b"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('206c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'base2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "base"}'::jsonb, '{"name": "base2a"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
('216c8f39-b406-4f2d-bca2-304b5645b342', '00000000-0000-0000-0000-000000000000', 'base2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"], "role": "base"}'::jsonb, '{"name": "base2b"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;
