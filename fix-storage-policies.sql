-- =====================================================
-- FIX STORAGE RLS POLICIES - Row Level Security
-- =====================================================
-- Error: "new row violates row-level security policy"
-- Solution: Update storage policies to allow authenticated users
-- =====================================================

-- STEP 1: Drop all existing storage policies
DROP POLICY IF EXISTS "Public can view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete certificates" ON storage.objects;

-- STEP 2: Create NEW policies with correct permissions

-- Policy 1: Allow PUBLIC to SELECT (view/download) files
CREATE POLICY "Public can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Policy 2: Allow AUTHENTICATED users to INSERT (upload) files
CREATE POLICY "Authenticated can upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

-- Policy 3: Allow AUTHENTICATED users to UPDATE files
CREATE POLICY "Authenticated can update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates')
WITH CHECK (bucket_id = 'certificates');

-- Policy 4: Allow AUTHENTICATED users to DELETE files
CREATE POLICY "Authenticated can delete certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- STEP 3: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%certificates%'
ORDER BY policyname;

-- =====================================================
-- Expected Result:
-- You should see 4 policies:
-- 1. "Public can view certificates" - SELECT
-- 2. "Authenticated can upload certificates" - INSERT
-- 3. "Authenticated can update certificates" - UPDATE
-- 4. "Authenticated can delete certificates" - DELETE
-- =====================================================
