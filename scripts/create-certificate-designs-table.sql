-- Create certificate_designs table if it doesn't exist
CREATE TABLE IF NOT EXISTS certificate_designs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  template_source TEXT,
  template_url TEXT,
  template_config_id TEXT,
  elements JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certificate_designs ENABLE ROW LEVEL SECURITY;

-- Create policies for certificate_designs table
CREATE POLICY "Users can view their own designs" ON certificate_designs
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own designs" ON certificate_designs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own designs" ON certificate_designs
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own designs" ON certificate_designs
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificate_designs_user_id ON certificate_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_certificate_designs_created_at ON certificate_designs(created_at);

-- Create updated_at trigger
CREATE TRIGGER trg_certificate_designs_updated_at BEFORE UPDATE
    ON certificate_designs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
