-- ============================================================================
-- ADD profile_data COLUMN TO brands TABLE
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- Add profile_data column to store AI-customized brand data
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_brands_profile_data
  ON brands USING gin(profile_data);

-- Add helpful comment
COMMENT ON COLUMN brands.profile_data IS
  'AI-customized brand profile data including UVPs, emotional triggers, brand voice, etc.';

-- ============================================================================
-- SUCCESS! Now the brands table can store AI analysis results.
-- ============================================================================
