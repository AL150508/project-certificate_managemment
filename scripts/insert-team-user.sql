-- Insert Team User to public.users table
-- Run this in Supabase SQL Editor

-- OPTION 1: Insert team user (password will be hashed by your app)
INSERT INTO public.users (email, role, password)
VALUES ('team@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE
SET role = 'team';

-- OPTION 2: Insert multiple team users
INSERT INTO public.users (email, role, password)
VALUES 
  ('team1@example.com', 'team', 'Team123!'),
  ('team2@example.com', 'team', 'Team123!'),
  ('team@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE
SET role = EXCLUDED.role;

-- OPTION 3: Update existing user to team role
UPDATE public.users
SET role = 'team'
WHERE email = 'your-existing-email@example.com';

-- VERIFY: Check all users and their roles
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- VERIFY: Check team users only
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
WHERE role = 'team'
ORDER BY created_at DESC;

-- VERIFY: Check all roles distribution
SELECT 
  role,
  COUNT(*) as user_count
FROM public.users
GROUP BY role
ORDER BY role;
