-- Check Templates Data
-- Run this in Supabase SQL Editor to verify data exists

-- 1. Check if certificate_templates table exists and has data
SELECT 
  id,
  name,
  orientation,
  background_url,
  preview_url,
  category_id,
  template_source,
  created_at,
  fields
FROM certificate_templates
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check count
SELECT COUNT(*) as total_templates
FROM certificate_templates;

-- 3. Check certificate_designs
SELECT 
  id,
  template_id,
  orientation,
  created_at
FROM certificate_designs
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check if templates have category
SELECT 
  t.id,
  t.name,
  t.category_id,
  c.name as category_name
FROM certificate_templates t
LEFT JOIN certificate_categories c ON t.category_id = c.id
ORDER BY t.created_at DESC;

-- 5. Check RLS policies on certificate_templates
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'certificate_templates';
