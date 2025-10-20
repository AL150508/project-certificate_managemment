-- Setup Supabase Storage for Certificate Assets
-- Run this in Supabase SQL Editor

-- Create storage bucket for certificate assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificate-assets',
  'certificate-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for certificate-assets bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload certificate assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'certificate-assets' AND 
    auth.role() = 'authenticated'
  );

-- Allow public read access to certificate assets
CREATE POLICY "Allow public read access to certificate assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificate-assets');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated users to update certificate assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'certificate-assets' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated users to delete certificate assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'certificate-assets' AND 
    auth.role() = 'authenticated'
  );
