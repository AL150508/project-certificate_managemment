-- Fix Save Template Errors - Create Required Tables
-- Run this script in Supabase SQL Editor to fix database issues

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create certificate_categories table (if not exists)
CREATE TABLE IF NOT EXISTS certificate_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Create certificate_templates table with correct structure
DROP TABLE IF EXISTS certificate_templates CASCADE;
CREATE TABLE certificate_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  orientation TEXT CHECK (orientation IN ('portrait', 'landscape')),
  width_px INTEGER,
  height_px INTEGER,
  background_url TEXT,
  template_source TEXT,
  template_url TEXT,
  template_config_id TEXT,
  category_id UUID REFERENCES certificate_categories(id),
  created_by UUID,
  fields JSONB DEFAULT '[]'::JSONB,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Create certificate_designs table with correct structure
DROP TABLE IF EXISTS certificate_designs CASCADE;
CREATE TABLE certificate_designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES certificate_templates(id) ON DELETE CASCADE,
  layout_data JSONB DEFAULT '[]'::JSONB,
  orientation TEXT CHECK (orientation IN ('portrait', 'landscape')),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Create certificates table for final certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES certificate_templates(id),
  member_id UUID,
  category_id UUID REFERENCES certificate_categories(id),
  status TEXT DEFAULT 'draft',
  issue_date DATE DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  png_url TEXT,
  fields_data JSONB DEFAULT '{}',
  data_json JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE certificate_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to categories" ON certificate_categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON certificate_categories;
DROP POLICY IF EXISTS "Allow public read access to templates" ON certificate_templates;
DROP POLICY IF EXISTS "Allow authenticated users to insert templates" ON certificate_templates;
DROP POLICY IF EXISTS "Allow users to update their own templates" ON certificate_templates;
DROP POLICY IF EXISTS "Allow users to delete their own templates" ON certificate_templates;
DROP POLICY IF EXISTS "Allow authenticated users to update templates" ON certificate_templates;
DROP POLICY IF EXISTS "Allow authenticated users to delete templates" ON certificate_templates;
DROP POLICY IF EXISTS "Allow public read access to designs" ON certificate_designs;
DROP POLICY IF EXISTS "Allow authenticated users to insert designs" ON certificate_designs;
DROP POLICY IF EXISTS "Allow authenticated users to update designs" ON certificate_designs;
DROP POLICY IF EXISTS "Allow authenticated users to delete designs" ON certificate_designs;
DROP POLICY IF EXISTS "Allow public read access to certificates" ON certificates;
DROP POLICY IF EXISTS "Allow authenticated users to manage certificates" ON certificates;
DROP POLICY IF EXISTS "Allow public read access to members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to manage members" ON members;

-- Create RLS policies for certificate_categories
CREATE POLICY "Allow public read access to categories" ON certificate_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage categories" ON certificate_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for certificate_templates
CREATE POLICY "Allow public read access to templates" ON certificate_templates
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert templates" ON certificate_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update templates" ON certificate_templates
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete templates" ON certificate_templates
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for certificate_designs
CREATE POLICY "Allow public read access to designs" ON certificate_designs
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert designs" ON certificate_designs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update designs" ON certificate_designs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete designs" ON certificate_designs
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for certificates
CREATE POLICY "Allow public read access to certificates" ON certificates
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage certificates" ON certificates
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for members
CREATE POLICY "Allow public read access to members" ON members
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage members" ON members
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert sample categories
INSERT INTO certificate_categories (name, description, slug, is_active) VALUES
  ('Achievement', 'Achievement and award certificates', 'achievement', true),
  ('Completion', 'Course completion certificates', 'completion', true),
  ('Participation', 'Event participation certificates', 'participation', true),
  ('Excellence', 'Excellence award certificates', 'excellence', true),
  ('Training', 'Training certificates', 'training', true),
  ('Workshop', 'Workshop completion certificates', 'workshop', true),
  ('Seminar', 'Seminar attendance certificates', 'seminar', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample members
INSERT INTO members (name, email) VALUES
  ('John Doe', 'john.doe@example.com'),
  ('Jane Smith', 'jane.smith@example.com'),
  ('Bob Johnson', 'bob.johnson@example.com'),
  ('Alice Brown', 'alice.brown@example.com'),
  ('Charlie Wilson', 'charlie.wilson@example.com')
ON CONFLICT DO NOTHING;

-- Verify tables were created successfully
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'certificate_categories',
  'certificate_templates', 
  'certificate_designs',
  'certificates',
  'members'
)
ORDER BY table_name;
