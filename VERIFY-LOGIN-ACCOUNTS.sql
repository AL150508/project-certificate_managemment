-- =====================================================
-- VERIFY LOGIN ACCOUNTS
-- =====================================================
-- Check if admin and team accounts are ready for login
-- =====================================================

-- 1. Check accounts in auth.users
SELECT 
  '✅ Accounts in auth.users' as status,
  id,
  email,
  email_confirmed_at IS NOT NULL as is_confirmed,
  encrypted_password IS NOT NULL as has_password,
  created_at
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- 2. Check accounts in public.users
SELECT 
  '✅ Accounts in public.users' as status,
  id,
  email,
  role,
  created_at
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- 3. Verify IDs match
SELECT 
  '✅ ID Match Verification' as status,
  au.email,
  au.id as auth_id,
  pu.id as public_id,
  CASE 
    WHEN au.id = pu.id THEN '✅ MATCH' 
    ELSE '❌ MISMATCH' 
  END as id_status,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ CONFIRMED' 
    ELSE '❌ NOT CONFIRMED' 
  END as email_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;

-- 4. Check RLS policies on public.users
SELECT 
  '✅ RLS Policies' as status,
  policyname,
  roles,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- 5. Test if authenticated users can read public.users
-- (This simulates what happens during login)
DO $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count
  FROM public.users
  WHERE email IN ('admin@test.com', 'team@test.com');
  
  RAISE NOTICE '';
  RAISE NOTICE '=== LOGIN READINESS CHECK ===';
  RAISE NOTICE '';
  
  IF user_count = 2 THEN
    RAISE NOTICE '✅ Both accounts found in public.users';
  ELSIF user_count = 1 THEN
    RAISE NOTICE '⚠️ Only 1 account found in public.users';
  ELSE
    RAISE NOTICE '❌ No accounts found in public.users';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Expected: 2 accounts';
  RAISE NOTICE 'Found: % accounts', user_count;
  RAISE NOTICE '';
  
  IF user_count = 2 THEN
    RAISE NOTICE '🎉 READY FOR LOGIN!';
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
  ELSE
    RAISE NOTICE '❌ NOT READY! Please run INSERT-USERS-TO-PUBLIC.sql';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If accounts not found, run this:
-- File: INSERT-USERS-TO-PUBLIC.sql

-- If RLS policies missing, run this:
-- File: SETUP-RLS-POLICIES.sql

-- =====================================================
