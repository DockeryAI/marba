-- SOSTAC objectives/goals
CREATE TABLE IF NOT EXISTS sostac_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  category TEXT NOT NULL CHECK (category IN ('awareness', 'leads', 'retention', 'revenue')),

  -- SMART criteria
  specific TEXT,
  measurable TEXT, -- Metric definition
  achievable TEXT, -- Why it's realistic
  relevant TEXT, -- Why it matters
  time_bound TEXT, -- Timeline

  -- Metrics
  current_value DECIMAL,
  target_value DECIMAL,
  unit TEXT, -- 'followers', 'leads', 'dollars', 'percent'

  timeline_start DATE,
  timeline_end DATE,

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'achieved', 'abandoned')),

  progress DECIMAL(5,2), -- Percentage complete

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_objectives_brand ON sostac_objectives(brand_id);
CREATE INDEX idx_objectives_status ON sostac_objectives(status);
CREATE INDEX idx_objectives_brand_status ON sostac_objectives(brand_id, status);
CREATE INDEX idx_objectives_timeline ON sostac_objectives(timeline_end) WHERE status = 'active';

-- Updated at trigger
CREATE TRIGGER update_sostac_objectives_updated_at
  BEFORE UPDATE ON sostac_objectives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE sostac_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own objectives"
  ON sostac_objectives FOR SELECT
  USING (brand_id IN (
    SELECT id FROM brands WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own objectives"
  ON sostac_objectives FOR INSERT
  WITH CHECK (brand_id IN (
    SELECT id FROM brands WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own objectives"
  ON sostac_objectives FOR UPDATE
  USING (brand_id IN (
    SELECT id FROM brands WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own objectives"
  ON sostac_objectives FOR DELETE
  USING (brand_id IN (
    SELECT id FROM brands WHERE user_id = auth.uid()
  ));
