-- =====================================================
-- DELETE OLD ACCOUNTS (Created via SQL)
-- =====================================================
-- These accounts won't work because password was not
-- hashed correctly for Supabase Auth
-- =====================================================

-- Delete identities
DELETE FROM auth.identities 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin@test.com', 'team@test.com')
);

-- Delete from public.users
DELETE FROM public.users 
WHERE email IN ('admin@test.com', 'team@test.com');

-- Delete from auth.users
DELETE FROM auth.users 
WHERE email IN ('admin@test.com', 'team@test.com');

-- Verify deletion
SELECT 'Deleted from auth.users' as status, COUNT(*) as remaining
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com');

SELECT 'Deleted from public.users' as status, COUNT(*) as remaining
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com');

-- =====================================================
-- DONE! Old accounts deleted.
-- Now create new accounts via Supabase Dashboard.
-- =====================================================
