-- Fix RLS policies for mirror_sections table

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view their mirror sections" ON mirror_sections;
DROP POLICY IF EXISTS "Users can insert their mirror sections" ON mirror_sections;
DROP POLICY IF EXISTS "Users can update their mirror sections" ON mirror_sections;
DROP POLICY IF EXISTS "Users can delete their mirror sections" ON mirror_sections;

-- Allow anyone to insert mirror sections (for demo)
CREATE POLICY "Allow public mirror section creation"
  ON mirror_sections FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view mirror sections (for demo)
CREATE POLICY "Allow public mirror section viewing"
  ON mirror_sections FOR SELECT
  USING (true);

-- Allow anyone to update mirror sections (for demo)
CREATE POLICY "Allow public mirror section updates"
  ON mirror_sections FOR UPDATE
  USING (true);

-- Allow anyone to delete mirror sections (for demo)
CREATE POLICY "Allow public mirror section deletion"
  ON mirror_sections FOR DELETE
  USING (true);
