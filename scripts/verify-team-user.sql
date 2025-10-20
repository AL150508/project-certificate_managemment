-- Verify Team User Setup
-- Run this in Supabase SQL Editor

-- 1. Check if team user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'team@gmail.com';

-- Expected: Should return 1 row with email_confirmed_at not null

-- 2. Check if team user exists in public.users with correct role
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
WHERE email = 'team@gmail.com';

-- Expected: Should return 1 row with role = 'team'

-- 3. If user exists but role is wrong, update it:
UPDATE public.users
SET role = 'team'
WHERE email = 'team@gmail.com';

-- 4. Verify update
SELECT email, role FROM public.users WHERE email = 'team@gmail.com';

-- 5. Check all users and their roles
SELECT 
  email,
  role,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- 6. If team user doesn't exist in public.users, insert:
INSERT INTO public.users (email, role, password)
VALUES ('team@gmail.com', 'team', 'team123')
ON CONFLICT (email) DO UPDATE 
SET role = 'team';

-- 7. Final verification
SELECT 
  u.email,
  u.role,
  CASE 
    WHEN au.email IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as in_auth_users
FROM public.users u
LEFT JOIN auth.users au ON u.email = au.email
WHERE u.email = 'team@gmail.com';

-- Expected result:
-- email: team@gmail.com
-- role: team
-- in_auth_users: Yes
