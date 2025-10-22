-- =====================================================
-- FINAL SUPABASE STORAGE SETUP - TESTED & WORKING
-- =====================================================
-- Instruksi:
-- 1. Copy SEMUA SQL di bawah ini (Ctrl+A, Ctrl+C)
-- 2. Buka Supabase Dashboard → SQL Editor → New Query
-- 3. Paste SQL (Ctrl+V)
-- 4. Klik tombol "RUN" atau tekan Ctrl+Enter
-- 5. Tunggu sampai selesai (5-10 detik)
-- =====================================================

-- STEP 1: Create storage bucket 'certificates'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates',
  'certificates',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- STEP 2: Drop old storage policies (if exist)
DROP POLICY IF EXISTS "Public can view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete certificates" ON storage.objects;

-- STEP 3: Create storage policies for 'certificates' bucket
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

-- STEP 6: Verify setup (optional - untuk cek hasil)
SELECT 'SUCCESS: Bucket created' as status, 
       id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'certificates';

-- =====================================================
-- SELESAI! 
-- =====================================================
-- Jika berhasil, Anda akan melihat output:
-- status: "SUCCESS: Bucket created"
-- id: "certificates"
-- name: "certificates"
-- public: true
-- file_size_limit: 10485760
-- =====================================================
