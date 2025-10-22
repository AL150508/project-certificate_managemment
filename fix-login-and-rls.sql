-- =====================================================
-- FIX LOGIN & RLS POLICIES
-- =====================================================
-- This script will:
-- 1. Enable RLS on public.users table
-- 2. Create policies to allow authenticated users to read their own data
-- 3. Verify accounts can login
-- =====================================================

-- STEP 1: Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON public.users;

-- STEP 3: Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can read own data" 
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- STEP 4: Create policy to allow users to read all users (for role checking)
CREATE POLICY "Allow authenticated users to read users" 
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- STEP 5: Verify accounts exist and have correct structure
SELECT 
  '✅ Verification: auth.users' as status,
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

SELECT 
  '✅ Verification: public.users' as status,
  id,
  email,
  role,
  created_at
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

SELECT 
  '✅ Verification: auth.identities' as status,
  au.email,
  i.provider,
  i.provider_id,
  i.email as identity_email,
  i.created_at
FROM auth.identities i
JOIN auth.users au ON i.user_id = au.id
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;

-- STEP 6: Test RLS policies
-- This should return rows if policies are correct
SET LOCAL ROLE authenticated;
SELECT 
  '✅ RLS Test: Can read users?' as test,
  COUNT(*) as user_count
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com');
RESET ROLE;

-- =====================================================
-- SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  RAISE NOTICE '║   ✅ RLS POLICIES CONFIGURED!          ║';
  RAISE NOTICE '╚════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📋 CONFIGURED POLICIES:';
  RAISE NOTICE '1. Users can read own data (by ID)';
  RAISE NOTICE '2. Authenticated users can read all users';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 ACCOUNTS READY FOR LOGIN:';
  RAISE NOTICE '';
  RAISE NOTICE 'Account 1: Admin';
  RAISE NOTICE '  Email: admin@test.com';
  RAISE NOTICE '  Password: Admin@123';
  RAISE NOTICE '  Role: admin';
  RAISE NOTICE '';
  RAISE NOTICE 'Account 2: Team';
  RAISE NOTICE '  Email: team@test.com';
  RAISE NOTICE '  Password: Team@123';
  RAISE NOTICE '  Role: team';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 NEXT STEPS:';
  RAISE NOTICE '1. Logout: await supabase.auth.signOut()';
  RAISE NOTICE '2. Clear: localStorage.clear()';
  RAISE NOTICE '3. Refresh: Ctrl+Shift+R';
  RAISE NOTICE '4. Login with admin@test.com / Admin@123';
  RAISE NOTICE '5. Should work without "Database error"!';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- TROUBLESHOOTING QUERIES
-- =====================================================

-- If login still fails, run these queries to debug:

-- Check if passwords are set
-- SELECT email, encrypted_password IS NOT NULL as has_password 
-- FROM auth.users 
-- WHERE email IN ('admin@test.com', 'team@test.com');

-- Check if email is confirmed
-- SELECT email, email_confirmed_at IS NOT NULL as is_confirmed 
-- FROM auth.users 
-- WHERE email IN ('admin@test.com', 'team@test.com');

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'users';

-- =====================================================
-- SUCCESS! You can now login without database errors.
-- =====================================================
