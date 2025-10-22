-- =====================================================
-- SUPABASE STORAGE SETUP FOR CERTIFICATE TEMPLATES
-- =====================================================
-- Run this SQL in Supabase SQL Editor to setup storage bucket and policies

-- 1. Create 'certificates' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates',
  'certificates',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access for certificates bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from certificates" ON storage.objects;

-- 3. Create policy: Public can READ all files in certificates bucket
CREATE POLICY "Public Access for certificates bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- 4. Create policy: Authenticated users can INSERT files to certificates bucket
CREATE POLICY "Authenticated users can upload to certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

-- 5. Create policy: Authenticated users can UPDATE files in certificates bucket
CREATE POLICY "Authenticated users can update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates')
WITH CHECK (bucket_id = 'certificates');

-- 6. Create policy: Authenticated users can DELETE files in certificates bucket
CREATE POLICY "Authenticated users can delete from certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- 7. Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'certificates';

-- =====================================================
-- ADDITIONAL: Fix RLS for certificate_templates table
-- =====================================================

-- Drop existing policies on certificate_templates if any
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.certificate_templates;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.certificate_templates;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.certificate_templates;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.certificate_templates;

-- Create policies for certificate_templates table
CREATE POLICY "Enable read for authenticated users"
ON public.certificate_templates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.certificate_templates FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.certificate_templates FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.certificate_templates FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check storage bucket
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'certificates';

-- Check storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Check certificate_templates policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'certificate_templates';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If all queries run successfully, you should see:
-- 1. Bucket 'certificates' created with public access
-- 2. 4 storage policies created (SELECT, INSERT, UPDATE, DELETE)
-- 3. 4 certificate_templates policies created
-- =====================================================
