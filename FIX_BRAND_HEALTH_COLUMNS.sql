-- ============================================================================
-- ADD MISSING COLUMNS FOR BRAND HEALTH CALCULATION
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- Add positioning_statement column (used by clarity, engagement, differentiation)
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS positioning_statement TEXT;

-- Add content_pillars column (used by consistency score)
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS content_pillars JSONB DEFAULT '[]'::jsonb;

-- Add full_profile_data column (same as profile_data but keeps backward compatibility)
-- This will be populated by the application from profile_data
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS full_profile_data JSONB DEFAULT '{}'::jsonb;

-- Add helpful comments
COMMENT ON COLUMN brands.positioning_statement IS
  'One-sentence brand positioning statement derived from UVPs and brand voice';

COMMENT ON COLUMN brands.content_pillars IS
  'Core content themes and messaging pillars for consistency tracking';

COMMENT ON COLUMN brands.full_profile_data IS
  'Copy of profile_data for brand health calculator compatibility';

-- ============================================================================
-- SUCCESS! Brand health calculator can now access all required fields.
-- ============================================================================
