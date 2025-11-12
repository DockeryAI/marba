-- ============================================================================
-- FIX ALL MISSING DATABASE TABLES
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- 1. Tactical Plans table (for Reach section)
CREATE TABLE IF NOT EXISTS tactical_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  channels JSONB DEFAULT '[]'::jsonb,
  allocations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id)
);

CREATE INDEX IF NOT EXISTS idx_tactical_plans_brand_id ON tactical_plans(brand_id);

ALTER TABLE tactical_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on tactical_plans" ON tactical_plans;
CREATE POLICY "Allow all on tactical_plans" ON tactical_plans FOR ALL USING (true) WITH CHECK (true);

-- 2. Marketing Strategies table (for Reimagine section)
CREATE TABLE IF NOT EXISTS marketing_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  strategy_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id)
);

CREATE INDEX IF NOT EXISTS idx_marketing_strategies_brand_id ON marketing_strategies(brand_id);

ALTER TABLE marketing_strategies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on marketing_strategies" ON marketing_strategies;
CREATE POLICY "Allow all on marketing_strategies" ON marketing_strategies FOR ALL USING (true) WITH CHECK (true);

-- 3. Mirror Objectives table (for Intend section)
CREATE TABLE IF NOT EXISTS mirror_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mirror_objectives_brand_id ON mirror_objectives(brand_id);
CREATE INDEX IF NOT EXISTS idx_mirror_objectives_status ON mirror_objectives(status);
CREATE INDEX IF NOT EXISTS idx_mirror_objectives_category ON mirror_objectives(category);

ALTER TABLE mirror_objectives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on mirror_objectives" ON mirror_objectives;
CREATE POLICY "Allow all on mirror_objectives" ON mirror_objectives FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SUCCESS! All tables created. Refresh your app now.
-- ============================================================================
