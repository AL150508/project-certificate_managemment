-- =====================================================
-- INSERT ADMIN & TEAM TO public.users
-- =====================================================
-- User IDs dari Supabase Dashboard:
-- Admin: ebd6c9b1-66d8-4521-94b3-6cd72aea4a66
-- Team: 01572696-1080-41c5-b675-989a1448fe15
-- =====================================================

-- Insert Admin
INSERT INTO public.users (id, email, role, created_at)
VALUES (
  'ebd6c9b1-66d8-4521-94b3-6cd72aea4a66',
  'admin@test.com',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', email = 'admin@test.com';

-- Insert Team
INSERT INTO public.users (id, email, role, created_at)
VALUES (
  '01572696-1080-41c5-b675-989a1448fe15',
  'team@test.com',
  'team',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'team', email = 'team@test.com';

-- Verify both accounts
SELECT 
  '✅ Accounts in public.users' as status,
  id,
  email,
  role,
  created_at
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- Verify IDs match with auth.users
SELECT 
  '✅ ID Match Verification' as status,
  au.email,
  au.id as auth_id,
  pu.id as public_id,
  CASE WHEN au.id = pu.id THEN '✅ MATCH' ELSE '❌ MISMATCH' END as status
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;

-- =====================================================
-- SUCCESS! Accounts ready for login.
-- =====================================================
