
-- Make user_id nullable to allow brands without authentication
ALTER TABLE brands ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow unauthenticated access for demo
DROP POLICY IF EXISTS "Users can insert their own brands" ON brands;
DROP POLICY IF EXISTS "Users can view their own brands" ON brands;
DROP POLICY IF EXISTS "Users can update their own brands" ON brands;
DROP POLICY IF EXISTS "Users can delete their own brands" ON brands;

-- Allow all access (temporary for demo - replace with proper auth later)
CREATE POLICY "Allow all access to brands (temp)"
  ON brands FOR ALL
  USING (true)
  WITH CHECK (true);
  