-- Create certificates table for Certificate Manager
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    training_title TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    signer_1_name TEXT,
    signer_1_title TEXT,
    signer_2_name TEXT,
    signer_2_title TEXT,
    qr_code_url TEXT,
    certificate_number TEXT UNIQUE NOT NULL,
    template_url TEXT,
    orientation TEXT CHECK (orientation IN ('landscape', 'portrait')) DEFAULT 'landscape',
    text_positions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_certificates_certificate_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_name ON certificates(name);
CREATE INDEX idx_certificates_training_title ON certificates(training_title);
CREATE INDEX idx_certificates_date ON certificates(date);
CREATE INDEX idx_certificates_created_by ON certificates(created_by);
CREATE INDEX idx_certificates_is_verified ON certificates(is_verified);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_certificates_updated_at 
    BEFORE UPDATE ON certificates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for different user roles
-- Policy for authenticated users to read their own certificates
CREATE POLICY "Users can view their own certificates" ON certificates
    FOR SELECT USING (auth.uid() = created_by);

-- Policy for admin users to read all certificates
CREATE POLICY "Admins can view all certificates" ON certificates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy for team users to read team certificates
CREATE POLICY "Team users can view team certificates" ON certificates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'team')
        )
    );

-- Policy for public users to read public certificates (verified only)
CREATE POLICY "Public users can view verified certificates" ON certificates
    FOR SELECT USING (is_verified = true);

-- Policy for authenticated users to insert their own certificates
CREATE POLICY "Users can create certificates" ON certificates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Policy for admin users to update any certificate
CREATE POLICY "Admins can update any certificate" ON certificates
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy for users to update their own certificates
CREATE POLICY "Users can update their own certificates" ON certificates
    FOR UPDATE USING (auth.uid() = created_by);

-- Policy for admin users to delete any certificate
CREATE POLICY "Admins can delete any certificate" ON certificates
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy for users to delete their own certificates
CREATE POLICY "Users can delete their own certificates" ON certificates
    FOR DELETE USING (auth.uid() = created_by);

-- Create a function to generate certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the next sequential number
    SELECT COALESCE(MAX(CAST(SUBSTRING(certificate_number FROM 'CERT-(\d+)') AS INTEGER)), 0) + 1
    INTO counter
    FROM certificates
    WHERE certificate_number ~ '^CERT-\d+$';
    
    -- Format as CERT-XXXXXX
    new_number := 'CERT-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-generate certificate numbers
CREATE OR REPLACE FUNCTION set_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.certificate_number IS NULL OR NEW.certificate_number = '' THEN
        NEW.certificate_number := generate_certificate_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_certificate_number_trigger
    BEFORE INSERT ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION set_certificate_number();

-- Insert sample data for testing
INSERT INTO certificates (
    name, 
    training_title, 
    date, 
    location, 
    signer_1_name, 
    signer_1_title, 
    signer_2_name, 
    signer_2_title,
    template_url,
    orientation,
    text_positions,
    is_verified
) VALUES 
(
    'John Doe',
    'Web Development Fundamentals',
    '2024-12-15',
    'Jakarta, Indonesia',
    'Dr. Jane Smith',
    'Director of Education',
    'Prof. Michael Johnson',
    'Head of Technology',
    '/contoh sertifikat.png',
    'landscape',
    '{
        "name": {"x": 400, "y": 200, "size": 32},
        "training_title": {"x": 400, "y": 300, "size": 24},
        "date": {"x": 400, "y": 400, "size": 18},
        "location": {"x": 400, "y": 450, "size": 18},
        "signer_1_name": {"x": 200, "y": 600, "size": 16},
        "signer_1_title": {"x": 200, "y": 650, "size": 14},
        "signer_2_name": {"x": 800, "y": 600, "size": 16},
        "signer_2_title": {"x": 800, "y": 650, "size": 14}
    }',
    true
),
(
    'Jane Smith',
    'React.js Advanced Training',
    '2024-12-10',
    'Bandung, Indonesia',
    'Dr. Sarah Wilson',
    'Senior Developer',
    'Mr. David Brown',
    'Tech Lead',
    '/contoh sertifikat.png',
    'portrait',
    '{
        "name": {"x": 400, "y": 250, "size": 28},
        "training_title": {"x": 400, "y": 350, "size": 20},
        "date": {"x": 400, "y": 450, "size": 16},
        "location": {"x": 400, "y": 500, "size": 16},
        "signer_1_name": {"x": 150, "y": 700, "size": 14},
        "signer_1_title": {"x": 150, "y": 750, "size": 12},
        "signer_2_name": {"x": 650, "y": 700, "size": 14},
        "signer_2_title": {"x": 650, "y": 750, "size": 12}
    }',
    true
),
(
    'Mike Johnson',
    'Node.js Fundamentals',
    '2024-12-05',
    'Surabaya, Indonesia',
    'Dr. Lisa Garcia',
    'Backend Developer',
    'Mr. Tom Wilson',
    'Senior Engineer',
    '/contoh sertifikat.png',
    'landscape',
    '{
        "name": {"x": 400, "y": 200, "size": 32},
        "training_title": {"x": 400, "y": 300, "size": 24},
        "date": {"x": 400, "y": 400, "size": 18},
        "location": {"x": 400, "y": 450, "size": 18},
        "signer_1_name": {"x": 200, "y": 600, "size": 16},
        "signer_1_title": {"x": 200, "y": 650, "size": 14},
        "signer_2_name": {"x": 800, "y": 600, "size": 16},
        "signer_2_title": {"x": 800, "y": 650, "size": 14}
    }',
    false
);

-- Create a view for certificate statistics
CREATE VIEW certificate_stats AS
SELECT 
    COUNT(*) as total_certificates,
    COUNT(*) FILTER (WHERE is_verified = true) as verified_certificates,
    COUNT(*) FILTER (WHERE is_verified = false) as pending_certificates,
    COUNT(*) FILTER (WHERE orientation = 'landscape') as landscape_certificates,
    COUNT(*) FILTER (WHERE orientation = 'portrait') as portrait_certificates,
    COUNT(DISTINCT training_title) as unique_trainings,
    COUNT(DISTINCT location) as unique_locations
FROM certificates;

-- Grant permissions
GRANT ALL ON certificates TO authenticated;
GRANT SELECT ON certificate_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE certificates IS 'Stores certificate information and template data';
COMMENT ON COLUMN certificates.id IS 'Unique identifier for each certificate';
COMMENT ON COLUMN certificates.name IS 'Name of the certificate recipient';
COMMENT ON COLUMN certificates.training_title IS 'Title of the training/course';
COMMENT ON COLUMN certificates.date IS 'Date when the certificate was issued';
COMMENT ON COLUMN certificates.location IS 'Location where the training took place';
COMMENT ON COLUMN certificates.signer_1_name IS 'Name of the first signatory';
COMMENT ON COLUMN certificates.signer_1_title IS 'Title/position of the first signatory';
COMMENT ON COLUMN certificates.signer_2_name IS 'Name of the second signatory';
COMMENT ON COLUMN certificates.signer_2_title IS 'Title/position of the second signatory';
COMMENT ON COLUMN certificates.qr_code_url IS 'URL of the QR code image';
COMMENT ON COLUMN certificates.certificate_number IS 'Unique certificate number';
COMMENT ON COLUMN certificates.template_url IS 'URL of the certificate template image';
COMMENT ON COLUMN certificates.orientation IS 'Certificate orientation: landscape or portrait';
COMMENT ON COLUMN certificates.text_positions IS 'JSON object storing text element positions and sizes';
COMMENT ON COLUMN certificates.is_verified IS 'Whether the certificate has been verified';
COMMENT ON COLUMN certificates.created_by IS 'User ID who created the certificate';
