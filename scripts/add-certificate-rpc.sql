-- Add RPC function for generating certificate identifiers
-- (for existing certificates table)

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
