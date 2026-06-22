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
  'f4943d15-2783-41a7-acb2-b0947640ad35',
  '00000000-0000-0000-0000-000000000000',
  'super@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "super"}'::jsonb,
  '2026-06-22 06:24:28.55853+00',
  '2026-06-22 06:24:28.581943+00',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. Factory 1 Users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
) VALUES
('ae415e71-05cf-425e-8d49-4fd73d2104ce', '00000000-0000-0000-0000-000000000000', 'admin1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "admin1a"}'::jsonb, '2026-06-22 08:05:46.067598+00', '2026-06-22 08:05:46.08438+00', 'authenticated', 'authenticated'),
('cdff452a-8f3c-450a-9a79-5734927cb291', '00000000-0000-0000-0000-000000000000', 'admin1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "admin1b"}'::jsonb, '2026-06-22 09:12:23.877686+00', '2026-06-22 09:12:23.89744+00', 'authenticated', 'authenticated'),
('062544be-5308-4428-9e33-7f44340da46b', '00000000-0000-0000-0000-000000000000', 'manager1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "manager1a"}'::jsonb, '2026-06-22 09:15:59.681069+00', '2026-06-22 09:15:59.710267+00', 'authenticated', 'authenticated'),
('237bcdb3-97e9-42ba-81a1-707378e21e11', '00000000-0000-0000-0000-000000000000', 'manager1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "manager1b"}'::jsonb, '2026-06-22 09:16:19.448989+00', '2026-06-22 09:16:19.460759+00', 'authenticated', 'authenticated'),
('23eaf1a2-00eb-4eb9-9c53-558e67b3abca', '00000000-0000-0000-0000-000000000000', 'operator1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "operator1a"}'::jsonb, '2026-06-22 09:17:08.875678+00', '2026-06-22 09:17:08.879251+00', 'authenticated', 'authenticated'),
('77377a61-55ec-4f77-93d8-0a54bc9e6f30', '00000000-0000-0000-0000-000000000000', 'operator1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "operator1b"}'::jsonb, '2026-06-22 09:19:07.540404+00', '2026-06-22 09:19:07.550531+00', 'authenticated', 'authenticated'),
('a017ebb3-ff33-495c-854d-e773577c5d2b', '00000000-0000-0000-0000-000000000000', 'base1a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "base1a"}'::jsonb, '2026-06-22 09:36:54.128562+00', '2026-06-22 09:36:54.148783+00', 'authenticated', 'authenticated'),
('705f7a04-77d0-4317-833c-8da8efd14331', '00000000-0000-0000-0000-000000000000', 'base1b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "base1b"}'::jsonb, '2026-06-22 09:37:22.744022+00', '2026-06-22 09:37:22.747506+00', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 3. Factory 2 Users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
) VALUES
('4a1430c3-a58f-4957-b4cc-cce6ae101b50', '00000000-0000-0000-0000-000000000000', 'admin2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "admin2a"}'::jsonb, '2026-06-22 09:37:57.365818+00', '2026-06-22 09:37:57.374346+00', 'authenticated', 'authenticated'),
('1dfe4326-557a-44d5-97bd-20b397b0e2fb', '00000000-0000-0000-0000-000000000000', 'admin2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "admin2b"}'::jsonb, '2026-06-22 09:38:17.785383+00', '2026-06-22 09:38:17.788949+00', 'authenticated', 'authenticated'),
('1c07ba19-90cf-42be-8fb8-d969833160be', '00000000-0000-0000-0000-000000000000', 'manager2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "manager2a"}'::jsonb, '2026-06-22 09:38:42.510893+00', '2026-06-22 09:38:42.514374+00', 'authenticated', 'authenticated'),
('5eb2af1d-d0ed-40dd-b4ff-f1ead56aee1f', '00000000-0000-0000-0000-000000000000', 'manager2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "manager2b"}'::jsonb, '2026-06-22 09:39:13.878181+00', '2026-06-22 09:39:13.881483+00', 'authenticated', 'authenticated'),
('c0ebe752-8c55-4a0a-8b30-25649f60aa45', '00000000-0000-0000-0000-000000000000', 'operator2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "operator2a"}'::jsonb, '2026-06-22 09:39:41.367814+00', '2026-06-22 09:39:41.371864+00', 'authenticated', 'authenticated'),
('945c1356-0cbc-4691-9184-4f4c014be032', '00000000-0000-0000-0000-000000000000', 'operator2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "operator2b"}'::jsonb, '2026-06-22 09:40:04.994683+00', '2026-06-22 09:40:05.012135+00', 'authenticated', 'authenticated'),
('a9898246-3b55-4f54-8d91-409e537c0044', '00000000-0000-0000-0000-000000000000', 'base2a@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "base2a"}'::jsonb, '2026-06-22 09:40:25.009783+00', '2026-06-22 09:40:25.014365+00', 'authenticated', 'authenticated'),
('eb8b09fe-a0eb-40b0-bda4-4593077020e3', '00000000-0000-0000-0000-000000000000', 'base2b@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'::jsonb, '{"name": "base2b"}'::jsonb, '2026-06-22 09:40:47.408996+00', '2026-06-22 09:40:47.413293+00', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;
