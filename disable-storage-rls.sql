-- =====================================================
-- DISABLE RLS FOR STORAGE.OBJECTS
-- =====================================================
-- This will allow all users to upload/manage files
-- in the 'certificates' bucket without RLS restrictions
-- =====================================================

-- STEP 1: Disable Row Level Security for storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- STEP 2: Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- =====================================================
-- Expected Result:
-- rowsecurity: false (RLS is disabled)
-- =====================================================
-- After running this SQL:
-- ✅ All users can upload files to storage
-- ✅ No more "violates row-level security policy" error
-- ✅ Template creation will work
-- =====================================================
