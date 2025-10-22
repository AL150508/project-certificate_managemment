-- =====================================================
-- CREATE ADMIN ACCOUNT - GUARANTEED TO WORK
-- Email: superadmin@test.com
-- Password: Admin@123456
-- =====================================================

-- STEP 1: Clean up old data (if exists)
DO $$
BEGIN
  -- Delete from identities
  DELETE FROM auth.identities 
  WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'superadmin@test.com');
  
  -- Delete from public.users
  DELETE FROM public.users 
  WHERE email = 'superadmin@test.com';
  
  -- Delete from auth.users
  DELETE FROM auth.users 
  WHERE email = 'superadmin@test.com';
  
  RAISE NOTICE '🧹 Cleaned up old data (if any)';
END $$;

-- STEP 2: Create user in auth.users
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generate new UUID
  new_user_id := gen_random_uuid();
  
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
    new_user_id,
    'authenticated',
    'authenticated',
    'superadmin@test.com',
    crypt('Admin@123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    ''
  );
  
  RAISE NOTICE '✅ Created user in auth.users';
  RAISE NOTICE 'User ID: %', new_user_id;
  
  -- Insert into public.users (only columns that exist)
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (new_user_id, 'superadmin@test.com', 'admin', NOW());
  
  RAISE NOTICE '✅ Created user profile in public.users';
  
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
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'superadmin@test.com'),
    'email',
    NOW(),
    NOW(),
    NOW()
  );
  
  RAISE NOTICE '✅ Created identity record';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ADMIN ACCOUNT CREATED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: superadmin@test.com';
  RAISE NOTICE 'Password: Admin@123456';
  RAISE NOTICE 'Role: admin';
  RAISE NOTICE 'User ID: %', new_user_id;
  RAISE NOTICE '========================================';
END $$;

-- STEP 3: Verify the account
SELECT 
  '✅ auth.users' as status,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'superadmin@test.com';

SELECT 
  '✅ public.users' as status,
  id,
  email,
  role,
  created_at
FROM public.users
WHERE email = 'superadmin@test.com';

SELECT 
  '✅ auth.identities' as status,
  id,
  user_id,
  provider,
  created_at
FROM auth.identities
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'superadmin@test.com');

-- =====================================================
-- SUCCESS! Now you can login with:
-- Email: superadmin@test.com
-- Password: Admin@123456
-- =====================================================
