-- =====================================================
-- FIX: Add member_id column to certificate_designs
-- =====================================================
-- Error: "Could not find the 'member_id' column"
-- Solution: Add the column and setup RLS
-- =====================================================

-- Check current schema
SELECT 
  '📋 Current Schema' as status,
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
    -- Add column
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

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read all designs" ON certificate_designs;
DROP POLICY IF EXISTS "Users can insert own designs" ON certificate_designs;
DROP POLICY IF EXISTS "Users can update own designs" ON certificate_designs;
DROP POLICY IF EXISTS "authenticated_can_read_designs" ON certificate_designs;
DROP POLICY IF EXISTS "authenticated_can_insert_designs" ON certificate_designs;
DROP POLICY IF EXISTS "authenticated_can_update_own_designs" ON certificate_designs;

-- Create new policies
CREATE POLICY "allow_authenticated_read_designs" 
ON certificate_designs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_authenticated_insert_designs" 
ON certificate_designs
FOR INSERT
TO authenticated
WITH CHECK (member_id = auth.uid());

CREATE POLICY "allow_authenticated_update_own_designs" 
ON certificate_designs
FOR UPDATE
TO authenticated
USING (member_id = auth.uid());

-- Verify policies
SELECT 
  '✅ RLS Policies' as status,
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'certificate_designs'
ORDER BY policyname;

-- Final verification
DO $$
DECLARE
  has_member_id BOOLEAN;
  policy_count INT;
BEGIN
  -- Check if member_id exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'certificate_designs' 
      AND column_name = 'member_id'
  ) INTO has_member_id;
  
  -- Check policy count
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'certificate_designs';
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  
  IF has_member_id AND policy_count >= 3 THEN
    RAISE NOTICE '║   ✅ FIXED! member_id column ready!   ║';
    RAISE NOTICE '╚════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Column member_id: ✅ EXISTS';
    RAISE NOTICE 'RLS Policies: ✅ % policies configured', policy_count;
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now save certificates!';
    RAISE NOTICE '🚀 Try saving again in Certificate Editor';
  ELSE
    RAISE NOTICE '║   ❌ NOT FIXED! Check errors above    ║';
    RAISE NOTICE '╚════════════════════════════════════════╝';
    RAISE NOTICE '';
    IF NOT has_member_id THEN
      RAISE NOTICE '❌ Column member_id: NOT FOUND';
    END IF;
    IF policy_count < 3 THEN
      RAISE NOTICE '❌ RLS Policies: Only % policies (need 3)', policy_count;
    END IF;
  END IF;
  
  RAISE NOTICE '';
END $$;

-- =====================================================
-- DONE! Certificate Editor should work now.
-- =====================================================
