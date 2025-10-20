-- Create Team User
-- Run this in Supabase SQL Editor after creating user via Dashboard

-- STEP 1: Create user via Supabase Dashboard first
-- Go to: Authentication → Users → Add User
-- Email: team@example.com
-- Password: Team123!
-- Auto Confirm: ✅

-- STEP 2: Run this SQL to set role to "team"
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"team"'
)
WHERE email = 'team@example.com';

-- STEP 3: Verify role set correctly
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'team@example.com';

-- Expected result:
-- email: team@example.com
-- role: team
-- email_confirmed_at: (should have timestamp)

-- OPTIONAL: Create multiple team users
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"team"'
-- )
-- WHERE email IN ('team1@example.com', 'team2@example.com');

-- VERIFY ALL USERS AND ROLES
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC;
