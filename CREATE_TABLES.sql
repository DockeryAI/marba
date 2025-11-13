-- Run this SQL in your Supabase SQL Editor
-- These tables are required for Mirror diagnostics and session management

-- 1. Mirror Diagnostics Table
CREATE TABLE IF NOT EXISTS mirror_diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  overall_health_score INTEGER NOT NULL,
  market_position_score INTEGER NOT NULL,
  customer_match_score INTEGER NOT NULL,
  brand_clarity_score INTEGER NOT NULL,
  market_position_data JSONB NOT NULL DEFAULT '{}',
  customer_truth_data JSONB NOT NULL DEFAULT '{}',
  brand_fit_data JSONB NOT NULL DEFAULT '{}',
  critical_gaps JSONB NOT NULL DEFAULT '[]',
  has_completed_uvp BOOLEAN DEFAULT FALSE,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mirror_diagnostics_brand ON mirror_diagnostics(brand_id);
CREATE INDEX IF NOT EXISTS idx_mirror_diagnostics_analyzed ON mirror_diagnostics(analyzed_at DESC);

-- 2. Brand Sessions Table
CREATE TABLE IF NOT EXISTS brand_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  url_slug TEXT NOT NULL,
  mirror_state JSONB DEFAULT '{}',
  uvp_state JSONB DEFAULT '{}',
  context_summary TEXT,
  completion_percentage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  last_saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(brand_id, url_slug)
);

CREATE INDEX IF NOT EXISTS idx_brand_sessions_brand ON brand_sessions(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_sessions_active ON brand_sessions(is_active, last_saved_at DESC);

-- 3. Brand UVPs Table (if not exists)
CREATE TABLE IF NOT EXISTS brand_uvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_uvps_brand ON brand_uvps(brand_id);

-- Enable Row Level Security
ALTER TABLE mirror_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_uvps ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for now - tighten in production)
CREATE POLICY IF NOT EXISTS "Allow all operations on mirror_diagnostics" ON mirror_diagnostics FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on brand_sessions" ON brand_sessions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on brand_uvps" ON brand_uvps FOR ALL USING (true);
