-- =====================================================
-- FIX DATABASE RLS POLICIES
-- =====================================================
-- Error: Database insert error - RLS blocking INSERT
-- Solution: Add policies for certificate_templates table
-- =====================================================

-- STEP 1: Drop old policies (if exist)
DROP POLICY IF EXISTS "Allow all to view templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Allow all to insert templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Allow all to update templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Allow all to delete templates" ON public.certificate_templates;

-- STEP 2: Create PERMISSIVE policies for certificate_templates

-- Allow EVERYONE to SELECT (view)
CREATE POLICY "Allow all to view templates"
ON public.certificate_templates FOR SELECT
USING (true);

-- Allow EVERYONE to INSERT (create)
CREATE POLICY "Allow all to insert templates"
ON public.certificate_templates FOR INSERT
WITH CHECK (true);

-- Allow EVERYONE to UPDATE (edit)
CREATE POLICY "Allow all to update templates"
ON public.certificate_templates FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow EVERYONE to DELETE
CREATE POLICY "Allow all to delete templates"
ON public.certificate_templates FOR DELETE
USING (true);

-- STEP 3: Fix certificate_designs table (if exists)
DROP POLICY IF EXISTS "Allow all to view designs" ON public.certificate_designs;
DROP POLICY IF EXISTS "Allow all to insert designs" ON public.certificate_designs;
DROP POLICY IF EXISTS "Allow all to update designs" ON public.certificate_designs;
DROP POLICY IF EXISTS "Allow all to delete designs" ON public.certificate_designs;

CREATE POLICY "Allow all to view designs"
ON public.certificate_designs FOR SELECT
USING (true);

CREATE POLICY "Allow all to insert designs"
ON public.certificate_designs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to update designs"
ON public.certificate_designs FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all to delete designs"
ON public.certificate_designs FOR DELETE
USING (true);

-- STEP 4: Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies
WHERE schemaname = 'public' 
  AND (tablename = 'certificate_templates' OR tablename = 'certificate_designs')
ORDER BY tablename, policyname;

-- =====================================================
-- Expected Result:
-- 8 policies total (4 for each table):
-- - certificate_templates: SELECT, INSERT, UPDATE, DELETE
-- - certificate_designs: SELECT, INSERT, UPDATE, DELETE
-- =====================================================
-- After running this SQL:
-- ✅ Database INSERT will work
-- ✅ Template creation will succeed
-- ✅ No more "Database insert error"
-- =====================================================
