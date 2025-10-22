-- =====================================================
-- SETUP RLS POLICIES FOR LOGIN
-- =====================================================
-- This ensures authenticated users can read public.users
-- =====================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Allow all authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Allow anon to read users for login" ON public.users;
DROP POLICY IF EXISTS "authenticated_read_all" ON public.users;
DROP POLICY IF EXISTS "anon_read_all" ON public.users;

-- Grant permissions
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Create simple policies
CREATE POLICY "authenticated_can_read_users" 
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "anon_can_read_users" 
ON public.users
FOR SELECT
TO anon
USING (true);

-- Verify policies
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- =====================================================
-- DONE! RLS policies configured.
-- =====================================================
