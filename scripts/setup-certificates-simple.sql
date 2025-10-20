-- Simple certificates table setup (no foreign keys initially)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  design_id UUID,
  user_id UUID,
  member_id UUID,
  category_id UUID,
  template_id UUID,
  status TEXT DEFAULT 'draft',
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  png_url TEXT,
  fields_data JSONB DEFAULT '{}',
  layout JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "certificates_select_policy" ON certificates FOR SELECT USING (true);
CREATE POLICY "certificates_insert_policy" ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "certificates_update_policy" ON certificates FOR UPDATE USING (true);
CREATE POLICY "certificates_delete_policy" ON certificates FOR DELETE USING (true);

-- Create RPC function for generating certificate identifiers
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
        
        -- Check uniqueness
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
