-- Add preview and thumbnail columns to certificate_templates
-- Run this in Supabase SQL Editor

ALTER TABLE certificate_templates 
ADD COLUMN IF NOT EXISTS preview_url TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Verify columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'certificate_templates' 
AND column_name IN ('preview_url', 'thumbnail_url');
