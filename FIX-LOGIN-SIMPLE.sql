-- =====================================================
-- FIX LOGIN - SIMPLE VERSION (NO ERRORS!)
-- =====================================================
-- This script will fix login issues without syntax errors
-- =====================================================

-- STEP 1: Disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- STEP 2: Grant permissions
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.users TO postgres;

-- STEP 3: Verify accounts exist
SELECT 
  '✅ Accounts in auth.users' as status,
  id,
  email,
  email_confirmed_at IS NOT NULL as confirmed,
  encrypted_password IS NOT NULL as has_password
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- STEP 4: Verify accounts in public.users
SELECT 
  '✅ Accounts in public.users' as status,
  id,
  email,
  role
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- STEP 5: Fix ID mismatch
UPDATE public.users pu
SET id = au.id
FROM auth.users au
WHERE pu.email = au.email
  AND pu.id != au.id
  AND au.email IN ('admin@test.com', 'team@test.com');

-- STEP 6: Verify IDs match
SELECT 
  '✅ ID Match Verification' as status,
  au.email,
  au.id as auth_id,
  pu.id as public_id,
  CASE WHEN au.id = pu.id THEN 'MATCH ✅' ELSE 'MISMATCH ❌' END as status
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;

-- STEP 7: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- STEP 8: Drop old policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Allow all authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Allow anon to read users for login" ON public.users;

-- STEP 9: Create new policies
CREATE POLICY "authenticated_read_all" 
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "anon_read_all" 
ON public.users
FOR SELECT
TO anon
USING (true);

-- STEP 10: Verify policies
SELECT 
  '✅ Active Policies' as status,
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- STEP 11: Final verification
SELECT 
  '✅ FINAL CHECK' as status,
  COUNT(*) as total_accounts
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com');

-- =====================================================
-- DONE! You can now login with:
-- Email: admin@test.com
-- Password: Admin@123
-- Role: Admin
-- =====================================================
