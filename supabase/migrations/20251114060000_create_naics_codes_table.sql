-- Create NAICS codes table
-- Generated: 2025-11-14

BEGIN;

-- Create naics_codes table
CREATE TABLE IF NOT EXISTS naics_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  has_full_profile BOOLEAN DEFAULT false,
  popularity INTEGER DEFAULT 0,
  parent_code VARCHAR(10),
  level INTEGER NOT NULL,
  is_standard BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_naics_codes_code ON naics_codes(code);
CREATE INDEX IF NOT EXISTS idx_naics_codes_category ON naics_codes(category);
CREATE INDEX IF NOT EXISTS idx_naics_codes_popularity ON naics_codes(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_naics_codes_has_full_profile ON naics_codes(has_full_profile);
CREATE INDEX IF NOT EXISTS idx_naics_codes_keywords ON naics_codes USING GIN(keywords);

-- Add foreign key for parent_code (self-referencing)
ALTER TABLE naics_codes
  ADD CONSTRAINT fk_naics_parent
  FOREIGN KEY (parent_code)
  REFERENCES naics_codes(code)
  ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE naics_codes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for industry detection)
CREATE POLICY "Allow public read access to NAICS codes"
  ON naics_codes
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated insert/update (for admin operations)
CREATE POLICY "Allow authenticated insert to NAICS codes"
  ON naics_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to NAICS codes"
  ON naics_codes
  FOR UPDATE
  TO authenticated
  USING (true);

COMMIT;
