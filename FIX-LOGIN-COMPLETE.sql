-- =====================================================
-- FIX LOGIN COMPLETE - ONE SCRIPT TO RULE THEM ALL
-- =====================================================
-- This will fix EVERYTHING needed for login to work
-- =====================================================

-- STEP 1: Check current state
DO $$
DECLARE
  auth_count INT;
  public_count INT;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users WHERE email IN ('admin@test.com', 'team@test.com');
  SELECT COUNT(*) INTO public_count FROM public.users WHERE email IN ('admin@test.com', 'team@test.com');
  
  RAISE NOTICE '';
  RAISE NOTICE '=== CURRENT STATE ===';
  RAISE NOTICE 'Accounts in auth.users: %', auth_count;
  RAISE NOTICE 'Accounts in public.users: %', public_count;
  RAISE NOTICE '';
END $$;

-- STEP 2: Setup RLS policies first
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Allow all authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Allow anon to read users for login" ON public.users;
DROP POLICY IF EXISTS "authenticated_read_all" ON public.users;
DROP POLICY IF EXISTS "anon_read_all" ON public.users;
DROP POLICY IF EXISTS "authenticated_can_read_users" ON public.users;
DROP POLICY IF EXISTS "anon_can_read_users" ON public.users;

-- Grant permissions
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.users TO postgres;

-- Create simple, permissive policies
CREATE POLICY "allow_authenticated_read" 
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_anon_read" 
ON public.users
FOR SELECT
TO anon
USING (true);

RAISE NOTICE '✅ RLS policies configured';

-- STEP 3: Insert accounts to public.users (with IDs from Dashboard)
-- Replace these UUIDs with your actual user IDs from Supabase Dashboard

-- Admin account
INSERT INTO public.users (id, email, role, created_at)
VALUES (
  'ebd6c9b1-66d8-4521-94b3-6cd72aea4a66',  -- Admin ID from Dashboard
  'admin@test.com',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET email = 'admin@test.com', role = 'admin';

-- Team account
INSERT INTO public.users (id, email, role, created_at)
VALUES (
  '01572696-1080-41c5-b675-989a1448fe15',  -- Team ID from Dashboard
  'team@test.com',
  'team',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET email = 'team@test.com', role = 'team';

RAISE NOTICE '✅ Accounts inserted to public.users';

-- STEP 4: Verify everything
SELECT 
  '✅ Verification: auth.users' as status,
  id,
  email,
  email_confirmed_at IS NOT NULL as confirmed
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

SELECT 
  '✅ Verification: public.users' as status,
  id,
  email,
  role
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

SELECT 
  '✅ Verification: ID Match' as status,
  au.email,
  CASE WHEN au.id = pu.id THEN '✅ MATCH' ELSE '❌ MISMATCH' END as id_status,
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅ CONFIRMED' ELSE '❌ NOT CONFIRMED' END as email_status
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;

SELECT 
  '✅ Verification: RLS Policies' as status,
  policyname,
  roles
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- STEP 5: Final check
DO $$
DECLARE
  ready_count INT;
BEGIN
  SELECT COUNT(*) INTO ready_count
  FROM auth.users au
  JOIN public.users pu ON au.id = pu.id
  WHERE au.email IN ('admin@test.com', 'team@test.com')
    AND au.email_confirmed_at IS NOT NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  
  IF ready_count = 2 THEN
    RAISE NOTICE '║   ✅ LOGIN READY! ALL CHECKS PASSED!   ║';
    RAISE NOTICE '╚════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now login with:';
    RAISE NOTICE '';
    RAISE NOTICE 'Admin Account:';
    RAISE NOTICE '  Email: admin@test.com';
    RAISE NOTICE '  Password: Admin@123';
    RAISE NOTICE '  Role: Admin';
    RAISE NOTICE '';
    RAISE NOTICE 'Team Account:';
    RAISE NOTICE '  Email: team@test.com';
    RAISE NOTICE '  Password: Team@123';
    RAISE NOTICE '  Role: Team';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Go to: http://localhost:3000/login';
  ELSE
    RAISE NOTICE '║   ❌ NOT READY! % accounts ready      ║', ready_count;
    RAISE NOTICE '╚════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Please check the verification results above';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- =====================================================
-- DONE! Login should work now.
-- =====================================================
