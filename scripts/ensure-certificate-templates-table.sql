-- Ensure certificate_templates table exists with correct structure
-- (Table might already exist, so we'll check and add missing columns if needed)

-- Check if table exists, if not create it
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NULL,
  orientation TEXT NULL,
  width_px INTEGER NULL,
  height_px INTEGER NULL,
  background_url TEXT NULL,
  json_layout JSONB NULL,
  thumbnail_url TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  fields JSONB NOT NULL DEFAULT '[]'::JSONB,
  layout JSONB NOT NULL DEFAULT '{}'::JSONB,
  preview_url TEXT NULL,
  category_id TEXT NULL,
  CONSTRAINT templates_pkey PRIMARY KEY (id),
  CONSTRAINT templates_orientation_check CHECK (
    orientation = ANY (ARRAY['portrait'::TEXT, 'landscape'::TEXT])
  )
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add template_source column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'certificate_templates' 
                 AND column_name = 'template_source') THEN
    ALTER TABLE certificate_templates ADD COLUMN template_source TEXT;
  END IF;
  
  -- Add template_url column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'certificate_templates' 
                 AND column_name = 'template_url') THEN
    ALTER TABLE certificate_templates ADD COLUMN template_url TEXT;
  END IF;
  
  -- Add template_config_id column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'certificate_templates' 
                 AND column_name = 'template_config_id') THEN
    ALTER TABLE certificate_templates ADD COLUMN template_config_id TEXT;
  END IF;
  
  -- Add metadata column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'certificate_templates' 
                 AND column_name = 'metadata') THEN
    ALTER TABLE certificate_templates ADD COLUMN metadata JSONB DEFAULT '{}'::JSONB;
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view all templates" ON certificate_templates;
DROP POLICY IF EXISTS "Users can insert templates" ON certificate_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON certificate_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON certificate_templates;

-- Create policies for certificate_templates table
CREATE POLICY "Users can view all templates" ON certificate_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can insert templates" ON certificate_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own templates" ON certificate_templates
  FOR UPDATE USING (auth.uid()::text = created_by::text);

CREATE POLICY "Users can delete their own templates" ON certificate_templates
  FOR DELETE USING (auth.uid()::text = created_by::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificate_templates_created_by ON certificate_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_category_id ON certificate_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_created_at ON certificate_templates(created_at);

-- Create triggers if they don't exist
DO $$
BEGIN
  -- Try to create trigger with set_updated_at function
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_templates_updated_at') THEN
    BEGIN
      EXECUTE 'CREATE TRIGGER trg_templates_updated_at BEFORE UPDATE ON certificate_templates FOR EACH ROW EXECUTE FUNCTION set_updated_at()';
    EXCEPTION WHEN OTHERS THEN
      -- If that fails, try with update_updated_at_column function
      BEGIN
        EXECUTE 'CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON certificate_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()';
      EXCEPTION WHEN OTHERS THEN
        -- Create our own function if neither exists
        EXECUTE '
          CREATE OR REPLACE FUNCTION update_certificate_templates_updated_at()
          RETURNS TRIGGER AS $func$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $func$ LANGUAGE plpgsql;
        ';
        EXECUTE 'CREATE TRIGGER certificate_templates_updated_at_trigger BEFORE UPDATE ON certificate_templates FOR EACH ROW EXECUTE FUNCTION update_certificate_templates_updated_at()';
      END;
    END;
  END IF;
END $$;
