-- Create certificates table if it doesn't exist
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  design_id UUID,
  user_id UUID,
  member_id UUID,
  category_id UUID,
  template_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'revoked')),
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  png_url TEXT,
  fields_data JSONB DEFAULT '{}',
  layout JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) TABLESPACE pg_default;

-- Add foreign key constraints (if tables exist)
DO $$
BEGIN
  -- Add foreign key to certificate_templates if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certificate_templates') THEN
    ALTER TABLE certificates ADD CONSTRAINT fk_certificates_template_id 
      FOREIGN KEY (template_id) REFERENCES certificate_templates(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key to members if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'members') THEN
    ALTER TABLE certificates ADD CONSTRAINT fk_certificates_member_id 
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key to categories if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
    ALTER TABLE certificates ADD CONSTRAINT fk_certificates_category_id 
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates table
CREATE POLICY "Allow public read access to published certificates" ON certificates
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow authenticated users to read their own certificates" ON certificates
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow authenticated users to insert certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update their own certificates" ON certificates
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow users to delete their own certificates" ON certificates
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_member_id ON certificates(member_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date);

-- Create updated_at trigger (try both function names, one will work)
DO $$
BEGIN
  -- Try to create trigger with set_updated_at function
  BEGIN
    EXECUTE 'CREATE TRIGGER trg_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION set_updated_at()';
  EXCEPTION WHEN OTHERS THEN
    -- If that fails, try with update_updated_at_column function
    BEGIN
      EXECUTE 'CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()';
    EXCEPTION WHEN OTHERS THEN
      -- If both fail, create our own function
      EXECUTE '
        CREATE OR REPLACE FUNCTION update_certificates_updated_at()
        RETURNS TRIGGER AS $func$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
      ';
      EXECUTE 'CREATE TRIGGER certificates_updated_at_trigger BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_certificates_updated_at()';
    END;
  END;
END $$;

-- Create RPC function for generating certificate identifiers
CREATE OR REPLACE FUNCTION next_certificate_identifiers(y INTEGER, m INTEGER, code_len INTEGER DEFAULT 10)
RETURNS JSON AS $$
DECLARE
    cert_num TEXT;
    verify_code TEXT;
    counter INTEGER := 1;
    max_attempts INTEGER := 100;
BEGIN
    LOOP
        -- Generate certificate number: CERT-YYYY-MM-NNNN
        cert_num := 'CERT-' || LPAD(y::TEXT, 4, '0') || '-' || LPAD(m::TEXT, 2, '0') || '-' || LPAD(counter::TEXT, 4, '0');
        
        -- Generate random verification code
        verify_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR code_len));
        
        -- Check if certificate number already exists
        IF NOT EXISTS (SELECT 1 FROM certificates WHERE certificate_number = cert_num) AND
           NOT EXISTS (SELECT 1 FROM certificates WHERE verification_code = verify_code) THEN
            RETURN JSON_BUILD_OBJECT(
                'certificate_number', cert_num,
                'verification_code', verify_code
            );
        END IF;
        
        counter := counter + 1;
        
        -- Prevent infinite loop
        IF counter > max_attempts THEN
            RAISE EXCEPTION 'Could not generate unique certificate identifiers after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
