-- Create certificate_designs table
CREATE TABLE IF NOT EXISTS certificate_designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_source TEXT NOT NULL,
  template_url TEXT NOT NULL,
  template_config_id TEXT,
  elements JSONB NOT NULL DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certificate_designs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own designs" ON certificate_designs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own designs" ON certificate_designs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs" ON certificate_designs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs" ON certificate_designs
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_certificate_designs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_certificate_designs_updated_at 
    BEFORE UPDATE ON certificate_designs 
    FOR EACH ROW EXECUTE FUNCTION update_certificate_designs_updated_at();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_certificate_designs_user_id ON certificate_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_certificate_designs_template_config_id ON certificate_designs(template_config_id);
CREATE INDEX IF NOT EXISTS idx_certificate_designs_created_at ON certificate_designs(created_at DESC);
