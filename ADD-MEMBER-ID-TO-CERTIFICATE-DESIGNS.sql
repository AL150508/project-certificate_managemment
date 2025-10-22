-- =====================================================
-- ADD member_id TO certificate_designs TABLE
-- =====================================================

-- Check current schema
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'certificate_designs'
ORDER BY ordinal_position;

-- Add member_id column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'certificate_designs' 
      AND column_name = 'member_id'
  ) THEN
    ALTER TABLE certificate_designs 
    ADD COLUMN member_id uuid REFERENCES auth.users(id);
    
    RAISE NOTICE '✅ Column member_id added to certificate_designs';
  ELSE
    RAISE NOTICE 'ℹ️ Column member_id already exists';
  END IF;
END $$;

-- Verify schema after update
SELECT 
  '✅ Updated Schema' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'certificate_designs'
ORDER BY ordinal_position;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON certificate_designs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON certificate_designs TO anon;

-- Setup RLS policies
ALTER TABLE certificate_designs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all designs" ON certificate_designs;
DROP POLICY IF EXISTS "Users can insert own designs" ON certificate_designs;
DROP POLICY IF EXISTS "Users can update own designs" ON certificate_designs;

-- Create new policies
CREATE POLICY "authenticated_can_read_designs" 
ON certificate_designs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_can_insert_designs" 
ON certificate_designs
FOR INSERT
TO authenticated
WITH CHECK (member_id = auth.uid());

CREATE POLICY "authenticated_can_update_own_designs" 
ON certificate_designs
FOR UPDATE
TO authenticated
USING (member_id = auth.uid());

RAISE NOTICE '✅ RLS policies configured for certificate_designs';

-- Verify policies
SELECT 
  '✅ RLS Policies' as status,
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'certificate_designs'
ORDER BY policyname;

-- =====================================================
-- DONE! certificate_designs table is ready
-- =====================================================
