-- =====================================================
-- CHECK CERTIFICATES TABLE SCHEMA
-- =====================================================

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'certificates'
) as table_exists;

-- Check columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'certificates'
ORDER BY ordinal_position;

-- Check sample data
SELECT 
  id,
  certificate_number,
  recipient_name,
  template_id,
  category_id,
  issue_date,
  status,
  created_by,
  created_at
FROM certificates
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- This will show us the actual schema
-- =====================================================
