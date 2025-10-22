-- =====================================================
-- CREATE ADMIN ACCOUNT - SIMPLE VERSION
-- Email: superadmin@test.com
-- Password: Admin@123456
-- =====================================================

-- STEP 1: Clean up old data (if exists)
DELETE FROM auth.identities 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'superadmin@test.com');

DELETE FROM public.users 
WHERE email = 'superadmin@test.com';

DELETE FROM auth.users 
WHERE email = 'superadmin@test.com';

-- STEP 2: Create user in auth.users
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
  gen_random_uuid(),
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

-- STEP 3: Get the user ID and create profile
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'superadmin@test.com';

  -- Create user profile
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (new_user_id, 'superadmin@test.com', 'admin', NOW(), NOW());

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

  RAISE NOTICE '✅ Admin account created!';
  RAISE NOTICE 'Email: superadmin@test.com';
  RAISE NOTICE 'Password: Admin@123456';
  RAISE NOTICE 'User ID: %', new_user_id;
END $$;

-- STEP 4: Verify
SELECT 
  'auth.users' as table_name,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'superadmin@test.com'

UNION ALL

SELECT 
  'public.users' as table_name,
  id,
  email,
  role::text as email_confirmed_at,
  created_at
FROM public.users
WHERE email = 'superadmin@test.com';

-- =====================================================
-- SUCCESS!
-- Now you can login with:
-- Email: superadmin@test.com
-- Password: Admin@123456
-- =====================================================
