-- =====================================================
-- SIMPLE SUPABASE STORAGE SETUP (NO ERRORS)
-- =====================================================
-- Copy and paste this ENTIRE SQL into Supabase SQL Editor
-- Then click "RUN" button

-- STEP 1: Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates',
  'certificates',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- STEP 2: Drop old policies first (if exist)
DROP POLICY IF EXISTS "Public can view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete certificates" ON storage.objects;

-- STEP 3: Create storage policies
CREATE POLICY "Public can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated can upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "Authenticated can update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated can delete certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- STEP 4: Drop old certificate_templates policies (if exist)
DROP POLICY IF EXISTS "Anyone can read templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Authenticated can create templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Authenticated can update templates" ON public.certificate_templates;
DROP POLICY IF EXISTS "Authenticated can delete templates" ON public.certificate_templates;

-- STEP 5: Create certificate_templates table policies
CREATE POLICY "Anyone can read templates"
ON public.certificate_templates FOR SELECT
USING (true);

CREATE POLICY "Authenticated can create templates"
ON public.certificate_templates FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update templates"
ON public.certificate_templates FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated can delete templates"
ON public.certificate_templates FOR DELETE
TO authenticated
USING (true);

-- STEP 6: Verify setup
SELECT 'Bucket created:' as status, * FROM storage.buckets WHERE id = 'certificates';
