-- =====================================================
-- CREATE NEW ADMIN ACCOUNT
-- Email: superadmin@test.com
-- Password: Admin@123456
-- =====================================================

-- Step 1: Create user in auth.users (Supabase Auth)
-- Note: You need to run this in Supabase SQL Editor
-- The password will be hashed automatically by Supabase

-- IMPORTANT: Run this in Supabase Dashboard > SQL Editor
-- This will create a new user with email and password

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'superadmin@test.com',
  crypt('Admin@123456', gen_salt('bf')), -- Password: Admin@123456
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{}',
  NULL,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email;

-- Step 2: Get the user ID that was just created
-- (You'll need to copy this ID for the next step)

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'superadmin@test.com'
  LIMIT 1;

  -- Step 3: Create user profile in public.users table
  -- First, delete if exists to avoid conflicts
  DELETE FROM public.users WHERE email = 'superadmin@test.com';
  
  -- Then insert new user
  INSERT INTO public.users (
    id,
    email,
    role,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'superadmin@test.com',
    'admin',
    NOW(),
    NOW()
  );

  -- Step 4: Create identity record
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
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', 'superadmin@test.com'
    ),
    'email',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, user_id) DO NOTHING;

  RAISE NOTICE 'Admin account created successfully!';
  RAISE NOTICE 'Email: superadmin@test.com';
  RAISE NOTICE 'Password: Admin@123456';
  RAISE NOTICE 'User ID: %', new_user_id;
END $$;

-- Step 5: Verify the account was created
SELECT 
  u.id,
  u.email,
  u.role,
  u.created_at,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'superadmin@test.com';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if user exists in auth.users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'superadmin@test.com';

-- Check if user exists in public.users
SELECT id, email, role, created_at
FROM public.users
WHERE email = 'superadmin@test.com';

-- Check if identity exists
SELECT id, user_id, provider, created_at
FROM auth.identities
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'superadmin@test.com'
);

-- =====================================================
-- ALTERNATIVE: Simple method using Supabase Auth API
-- =====================================================

-- If the above doesn't work, use this simpler approach:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" button
-- 3. Enter:
--    Email: superadmin@test.com
--    Password: Admin@123456
--    Auto Confirm User: YES
-- 4. Click "Create User"
-- 5. Then run this to set role:

-- First check if user exists
SELECT id FROM public.users WHERE email = 'superadmin@test.com';

-- If user doesn't exist, insert:
INSERT INTO public.users (id, email, role, created_at, updated_at)
SELECT id, email, 'admin', NOW(), NOW()
FROM auth.users
WHERE email = 'superadmin@test.com'
AND NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'superadmin@test.com');

-- If user exists, update:
UPDATE public.users
SET role = 'admin', updated_at = NOW()
WHERE email = 'superadmin@test.com';

-- =====================================================
-- CLEANUP (if needed)
-- =====================================================

-- If you need to delete this user and start over:
-- DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'superadmin@test.com');
-- DELETE FROM public.users WHERE email = 'superadmin@test.com';
-- DELETE FROM auth.users WHERE email = 'superadmin@test.com';
