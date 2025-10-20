-- Fix Templates Data - Update existing template only
-- Based on actual database schema

-- 1. Update existing template with missing data
UPDATE certificate_templates 
SET 
  name = CASE 
    WHEN name IS NULL OR name = '' OR name LIKE '%Template %' 
    THEN 'Professional Certificate Template'
    ELSE name
  END,
  background_url = 'https://via.placeholder.com/1200x850/1e293b/ffffff?text=Professional+Certificate+Template',
  thumbnail_url = 'https://via.placeholder.com/400x300/1e293b/ffffff?text=Certificate+Thumbnail',
  preview_url = 'https://via.placeholder.com/800x600/1e293b/ffffff?text=Certificate+Preview',
  orientation = COALESCE(orientation, 'landscape'),
  width_px = COALESCE(width_px, 1200),
  height_px = COALESCE(height_px, 850),
  json_layout = COALESCE(json_layout, '{"elements": [], "background": {"type": "color", "value": "#ffffff"}}'),
  fields = COALESCE(fields, '[
    {"id": "name", "type": "text", "label": "Name", "required": true, "position": {"x": 600, "y": 300}},
    {"id": "description", "type": "text", "label": "Description", "required": false, "position": {"x": 600, "y": 380}},
    {"id": "date", "type": "date", "label": "Date", "required": true, "position": {"x": 300, "y": 700}},
    {"id": "signature", "type": "text", "label": "Signature", "required": false, "position": {"x": 900, "y": 700}}
  ]'),
  layout = COALESCE(layout, '{"width": 1200, "height": 850, "orientation": "landscape", "margins": {"top": 50, "right": 50, "bottom": 50, "left": 50}}')
WHERE id = 'd9753f81-dbbb-40e4-8eb5-1109b51190fd';

-- 3. Create certificate_categories table if it doesn't exist (simple version)
CREATE TABLE IF NOT EXISTS certificate_categories (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Add slug column if it doesn't exist
ALTER TABLE certificate_categories 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 5. Create unique index on slug if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificate_categories_slug 
ON certificate_categories(slug);

-- 6. Insert default categories with UUID (handle both name and slug conflicts)
INSERT INTO certificate_categories (name, slug, description) 
SELECT 'Achievement', 'achievement', 'Certificates for achievements and awards'
WHERE NOT EXISTS (SELECT 1 FROM certificate_categories WHERE name = 'Achievement' OR slug = 'achievement');

INSERT INTO certificate_categories (name, slug, description) 
SELECT 'Completion', 'completion', 'Course and training completion certificates'
WHERE NOT EXISTS (SELECT 1 FROM certificate_categories WHERE name = 'Completion' OR slug = 'completion');

INSERT INTO certificate_categories (name, slug, description) 
SELECT 'Participation', 'participation', 'Event and workshop participation certificates'
WHERE NOT EXISTS (SELECT 1 FROM certificate_categories WHERE name = 'Participation' OR slug = 'participation');

INSERT INTO certificate_categories (name, slug, description) 
SELECT 'Training', 'training', 'Professional training certificates'
WHERE NOT EXISTS (SELECT 1 FROM certificate_categories WHERE name = 'Training' OR slug = 'training');

INSERT INTO certificate_categories (name, slug, description) 
SELECT 'General', 'general', 'General purpose certificates'
WHERE NOT EXISTS (SELECT 1 FROM certificate_categories WHERE name = 'General' OR slug = 'general');

-- 6a. Update existing categories to add slug if missing
UPDATE certificate_categories SET slug = 'achievement' WHERE name = 'Achievement' AND (slug IS NULL OR slug = '');
UPDATE certificate_categories SET slug = 'completion' WHERE name = 'Completion' AND (slug IS NULL OR slug = '');
UPDATE certificate_categories SET slug = 'participation' WHERE name = 'Participation' AND (slug IS NULL OR slug = '');
UPDATE certificate_categories SET slug = 'training' WHERE name = 'Training' AND (slug IS NULL OR slug = '');
UPDATE certificate_categories SET slug = 'general' WHERE name = 'General' AND (slug IS NULL OR slug = '');

-- 7. Check if category_id column exists and its type
-- If it's TEXT, we'll work with TEXT; if it's UUID, we'll work with UUID
-- For now, let's assume it's TEXT based on the data you showed

-- 8. Update existing template category_id to reference proper category
-- Since category_id is already 'general' (TEXT), let's update it to use the UUID
UPDATE certificate_templates 
SET category_id = (
  SELECT id::text FROM certificate_categories WHERE slug = 'general' LIMIT 1
)
WHERE id = 'd9753f81-dbbb-40e4-8eb5-1109b51190fd' AND category_id = 'general';

-- 9. Verify the data
SELECT 
  id,
  name,
  orientation,
  width_px,
  height_px,
  category_id,
  CASE 
    WHEN background_url IS NOT NULL THEN 'Present'
    ELSE 'Missing'
  END as background_url_status,
  CASE 
    WHEN thumbnail_url IS NOT NULL THEN 'Present'
    ELSE 'Missing'
  END as thumbnail_url_status,
  created_at
FROM certificate_templates
ORDER BY created_at DESC;
