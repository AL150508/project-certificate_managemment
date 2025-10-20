-- Complete Database Setup for Certificate Management System
-- Run this script in Supabase SQL Editor to ensure all tables exist

-- 1. Create certificate_categories table
CREATE TABLE IF NOT EXISTS certificate_categories (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Create certificate_templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NULL,
  orientation TEXT NULL,
  width_px INTEGER NULL,
  height_px INTEGER NULL,
  background_url TEXT NULL,
  template_source TEXT NULL,
  template_url TEXT NULL,
  template_config_id TEXT NULL,
  category_id UUID NULL,
  created_by UUID NULL,
  fields JSONB NOT NULL DEFAULT '[]'::JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT templates_orientation_check CHECK (
    orientation = ANY (ARRAY['portrait'::TEXT, 'landscape'::TEXT])
  )
);

-- 3. Create certificate_designs table
CREATE TABLE IF NOT EXISTS certificate_designs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES certificate_templates(id) ON DELETE CASCADE,
  layout_data JSONB DEFAULT '[]'::JSONB,
  orientation TEXT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Create certificates table (if not exists)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES certificate_templates(id),
  member_id UUID,
  category_id UUID,
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

-- 5. Create members table (if not exists)
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
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

-- Create RLS policies for certificate_categories
DROP POLICY IF EXISTS "Allow public read access to categories" ON certificate_categories;
CREATE POLICY "Allow public read access to categories" ON certificate_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON certificate_categories;
CREATE POLICY "Allow authenticated users to manage categories" ON certificate_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for certificate_templates
DROP POLICY IF EXISTS "Allow public read access to templates" ON certificate_templates;
CREATE POLICY "Allow public read access to templates" ON certificate_templates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert templates" ON certificate_templates;
CREATE POLICY "Allow authenticated users to insert templates" ON certificate_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow users to update their own templates" ON certificate_templates;
CREATE POLICY "Allow users to update their own templates" ON certificate_templates
  FOR UPDATE USING (auth.uid()::text = created_by::text);

DROP POLICY IF EXISTS "Allow users to delete their own templates" ON certificate_templates;
CREATE POLICY "Allow users to delete their own templates" ON certificate_templates
  FOR DELETE USING (auth.uid()::text = created_by::text);

-- Create RLS policies for certificate_designs
DROP POLICY IF EXISTS "Allow public read access to designs" ON certificate_designs;
CREATE POLICY "Allow public read access to designs" ON certificate_designs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert designs" ON certificate_designs;
CREATE POLICY "Allow authenticated users to insert designs" ON certificate_designs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow authenticated users to update designs" ON certificate_designs;
CREATE POLICY "Allow authenticated users to update designs" ON certificate_designs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow authenticated users to delete designs" ON certificate_designs;
CREATE POLICY "Allow authenticated users to delete designs" ON certificate_designs
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for certificates
DROP POLICY IF EXISTS "Allow public read access to certificates" ON certificates;
CREATE POLICY "Allow public read access to certificates" ON certificates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage certificates" ON certificates;
CREATE POLICY "Allow authenticated users to manage certificates" ON certificates
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for members
DROP POLICY IF EXISTS "Allow public read access to members" ON members;
CREATE POLICY "Allow public read access to members" ON members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage members" ON members;
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

-- Create RPC function for certificate identifiers
CREATE OR REPLACE FUNCTION next_certificate_identifiers(y INTEGER, m INTEGER, code_len INTEGER DEFAULT 10)
RETURNS JSON AS $$
DECLARE
    cert_num TEXT;
    verify_code TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        -- Generate certificate number: CERT-YYYY-MM-NNNN
        cert_num := 'CERT-' || LPAD(y::TEXT, 4, '0') || '-' || LPAD(m::TEXT, 2, '0') || '-' || LPAD(counter::TEXT, 4, '0');

        -- Generate random verification code
        verify_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR code_len));

        -- Check uniqueness in existing certificates table
        IF NOT EXISTS (SELECT 1 FROM certificates WHERE certificate_number = cert_num) AND
           NOT EXISTS (SELECT 1 FROM certificates WHERE verification_code = verify_code) THEN
            RETURN JSON_BUILD_OBJECT(
                'certificate_number', cert_num,
                'verification_code', verify_code
            );
        END IF;

        counter := counter + 1;

        -- Prevent infinite loop
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique certificate identifiers after 100 attempts';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
