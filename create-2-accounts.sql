-- =====================================================
-- CREATE 2 ACCOUNTS - ADMIN & TEAM
-- =====================================================
-- Account 1: Admin
--   Email: admin@test.com
--   Password: Admin@123
--   Role: admin
--
-- Account 2: Team
--   Email: team@test.com
--   Password: Team@123
--   Role: team
-- =====================================================

-- STEP 1: Clean up old data (if exists)
DO $$
BEGIN
  -- Delete admin account
  DELETE FROM auth.identities 
  WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@test.com');
  DELETE FROM public.users WHERE email = 'admin@test.com';
  DELETE FROM auth.users WHERE email = 'admin@test.com';
  
  -- Delete team account
  DELETE FROM auth.identities 
  WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'team@test.com');
  DELETE FROM public.users WHERE email = 'team@test.com';
  DELETE FROM auth.users WHERE email = 'team@test.com';
  
  RAISE NOTICE '🧹 Cleaned up old accounts (if any)';
END $$;

-- =====================================================
-- CREATE ACCOUNT 1: ADMIN
-- =====================================================
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Generate UUID for admin
  admin_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_user_id,
    'authenticated',
    'authenticated',
    'admin@test.com',
    crypt('Admin@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    ''
  );
  
  -- Insert into public.users
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (admin_user_id, 'admin@test.com', 'admin', NOW());
  
  -- Create identity
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    admin_user_id,
    jsonb_build_object('sub', admin_user_id::text, 'email', 'admin@test.com'),
    'email',
    NOW(),
    NOW(),
    NOW()
  );
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ACCOUNT 1: ADMIN CREATED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: admin@test.com';
  RAISE NOTICE 'Password: Admin@123';
  RAISE NOTICE 'Role: admin';
  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- CREATE ACCOUNT 2: TEAM
-- =====================================================
DO $$
DECLARE
  team_user_id UUID;
BEGIN
  -- Generate UUID for team
  team_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    team_user_id,
    'authenticated',
    'authenticated',
    'team@test.com',
    crypt('Team@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    ''
  );
  
  -- Insert into public.users
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (team_user_id, 'team@test.com', 'team', NOW());
  
  -- Create identity
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    team_user_id,
    jsonb_build_object('sub', team_user_id::text, 'email', 'team@test.com'),
    'email',
    NOW(),
    NOW(),
    NOW()
  );
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ACCOUNT 2: TEAM CREATED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: team@test.com';
  RAISE NOTICE 'Password: Team@123';
  RAISE NOTICE 'Role: team';
  RAISE NOTICE 'User ID: %', team_user_id;
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- VERIFY ALL ACCOUNTS
-- =====================================================

-- Check auth.users
SELECT 
  '✅ auth.users' as status,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- Check public.users
SELECT 
  '✅ public.users' as status,
  email,
  role,
  created_at
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- Check identities
SELECT 
  '✅ auth.identities' as status,
  au.email,
  i.provider,
  i.created_at
FROM auth.identities i
JOIN auth.users au ON i.user_id = au.id
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;

-- =====================================================
-- SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  RAISE NOTICE '║   ✅ 2 ACCOUNTS CREATED SUCCESSFULLY!  ║';
  RAISE NOTICE '╚════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📋 ACCOUNT 1: ADMIN';
  RAISE NOTICE '   Email: admin@test.com';
  RAISE NOTICE '   Password: Admin@123';
  RAISE NOTICE '   Role: admin';
  RAISE NOTICE '   Access: Full dashboard access';
  RAISE NOTICE '';
  RAISE NOTICE '📋 ACCOUNT 2: TEAM';
  RAISE NOTICE '   Email: team@test.com';
  RAISE NOTICE '   Password: Team@123';
  RAISE NOTICE '   Role: team';
  RAISE NOTICE '   Access: Limited team access';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 You can now login with either account!';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- QUICK LOGIN TEST
-- =====================================================
-- After running this script, you can test login with:
-- 
-- ADMIN LOGIN:
--   Email: admin@test.com
--   Password: Admin@123
--
-- TEAM LOGIN:
--   Email: team@test.com
--   Password: Team@123
-- =====================================================
