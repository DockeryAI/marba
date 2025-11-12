-- Drop old restrictive policies
DROP POLICY IF EXISTS "Users can insert their own brands" ON brands;
DROP POLICY IF EXISTS "Users can view their own brands" ON brands;
DROP POLICY IF EXISTS "Users can update their own brands" ON brands;
DROP POLICY IF EXISTS "Users can delete their own brands" ON brands;
DROP POLICY IF EXISTS "Allow all access to brands (temp)" ON brands;

-- Allow anyone to insert brands (for demo/onboarding)
CREATE POLICY "Allow public brand creation"
  ON brands FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view all brands (for demo)
CREATE POLICY "Allow public brand viewing"
  ON brands FOR SELECT
  USING (true);

-- Allow anyone to update brands (for demo)
CREATE POLICY "Allow public brand updates"
  ON brands FOR UPDATE
  USING (true);

-- Allow anyone to delete brands (for demo)
CREATE POLICY "Allow public brand deletion"
  ON brands FOR DELETE
  USING (true);

-- Make sure user_id is nullable
ALTER TABLE brands ALTER COLUMN user_id DROP NOT NULL;
