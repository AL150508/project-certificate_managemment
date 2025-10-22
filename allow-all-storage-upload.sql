-- =====================================================
-- ALLOW ALL USERS TO UPLOAD TO STORAGE
-- =====================================================
-- Alternative solution: Add permissive policies
-- instead of disabling RLS
-- =====================================================

-- STEP 1: Drop existing restrictive policies (if any)
DROP POLICY IF EXISTS "Public can view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete certificates" ON storage.objects;

-- STEP 2: Create PERMISSIVE policies that allow ALL operations

-- Allow EVERYONE to SELECT (view/download)
CREATE POLICY "Allow all to view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Allow EVERYONE to INSERT (upload)
CREATE POLICY "Allow all to upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificates');

-- Allow EVERYONE to UPDATE
CREATE POLICY "Allow all to update certificates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificates')
WITH CHECK (bucket_id = 'certificates');

-- Allow EVERYONE to DELETE
CREATE POLICY "Allow all to delete certificates"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificates');

-- STEP 3: Verify policies
SELECT 
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
-- 4 policies that allow ALL users (no role restriction)
-- =====================================================
-- This achieves the same result as disabling RLS
-- but works within Supabase's permission system
-- =====================================================
