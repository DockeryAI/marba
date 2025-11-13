# MARBA Mirror Section - Immediate Action Plan

## Current Status Summary

### ✅ WORKING
- Brand onboarding collects all data successfully
- Website scraping works
- SEO metrics via Semrush works
- Competitor discovery works
- Diagnostic analysis IS running
- Scores are being generated: Market=85, Customer=50, Brand=35, Overall=56
- UI components exist and are structured correctly

### ❌ NOT WORKING
1. **API Method Calls** - Services calling wrong method names
2. **Database Tables** - mirror_diagnostics, brand_sessions, brand_uvps don't exist
3. **Sidebar Toggle** - Expand/collapse button not functional
4. **Horizontal Nav** - Section headers not visible/prominent enough
5. **Data Display** - Generated diagnostic data not showing in UI properly

## Critical Path to Fix (Priority Order)

### PHASE 1: Quick UI Wins (30 min)
**Goal:** Make the user see the data that's already being generated

1. **Fix Sidebar Toggle**
   - Debug the chevron button click handler
   - Ensure state updates properly

2. **Make Section Headers More Visible**
   - Increase z-index on MirrorSectionHeader
   - Add background color or shadow for visibility
   - Make sticky positioning more obvious

3. **Show Diagnostic Data Even When DB Fails**
   - Keep diagnostic in component state
   - Display even if database save fails
   - User can at least see their analysis

### PHASE 2: Database Setup (1 hour)
**Goal:** Create missing tables so data persists

Run these SQL migrations in Supabase:

```sql
-- mirror_diagnostics table
CREATE TABLE IF NOT EXISTS mirror_diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  overall_health_score INTEGER NOT NULL,
  market_position_score INTEGER NOT NULL,
  customer_match_score INTEGER NOT NULL,
  brand_clarity_score INTEGER NOT NULL,
  market_position_data JSONB NOT NULL,
  customer_truth_data JSONB NOT NULL,
  brand_fit_data JSONB NOT NULL,
  critical_gaps JSONB NOT NULL,
  has_completed_uvp BOOLEAN DEFAULT FALSE,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mirror_diagnostics_brand ON mirror_diagnostics(brand_id);
CREATE INDEX idx_mirror_diagnostics_analyzed ON mirror_diagnostics(analyzed_at DESC);

-- brand_sessions table
CREATE TABLE IF NOT EXISTS brand_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  url_slug TEXT NOT NULL,
  mirror_state JSONB,
  uvp_state JSONB,
  context_summary TEXT,
  completion_percentage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  last_saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(brand_id, url_slug)
);

CREATE INDEX idx_brand_sessions_brand ON brand_sessions(brand_id);
CREATE INDEX idx_brand_sessions_active ON brand_sessions(is_active, last_saved_at DESC);

-- brand_uvps table
CREATE TABLE IF NOT EXISTS brand_uvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  uvp_data JSONB NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brand_uvps_brand ON brand_uvps(brand_id);
CREATE INDEX idx_brand_uvps_primary ON brand_uvps(brand_id, is_primary);
```

### PHASE 3: API Service Fixes (2 hours)
**Goal:** Fix incorrect API method calls

**Files to Update:**
1. `src/services/mirror/market-position.service.ts`
2. `src/services/mirror/customer-truth.service.ts`
3. `src/services/mirror/brand-fit.service.ts`

**Changes Needed:**
- Replace `perplexityAPI.search()` with `perplexityAPI.getIndustryInsights()`
- Replace `openRouterAI.generateResponse()` with `chat()` from `@/lib/openrouter`
- Update all import statements
- Adjust parameter structures to match actual API signatures

### PHASE 4: Enhanced Data Display (1 hour)
**Goal:** Show ALL the data in detail sections

1. Expand Market Position Section to show:
   - Full competitor list with details
   - Detailed competitive gaps analysis
   - Market share breakdown
   - Pricing comparison table

2. Expand Customer Truth Section to show:
   - Actual customer segments identified
   - Review themes and sentiment analysis
   - Buyer journey map with gaps highlighted
   - Value perception breakdown

3. Expand Brand Clarity Section to show:
   - Touchpoint-by-touchpoint analysis
   - Message consistency heatmap
   - Differentiation opportunities list
   - Trust signals found/missing

## Immediate Next Steps

**RIGHT NOW:**
1. Run the database migrations above in Supabase SQL editor
2. Refresh the app - it should save diagnostics properly
3. Check if sidebar toggle works (might be a CSS issue)

**THEN:**
4. Create a GitHub issue for API method fixes with the specific changes needed
5. Prioritize showing data even when some API calls fail (graceful degradation)

## Expected Outcomes

**After Phase 1:** User can navigate the UI and see basic diagnostic data
**After Phase 2:** All data persists and sessions work
**After Phase 3:** All API-enhanced features work (competitor discovery, AI analysis)
**After Phase 4:** User has full transparency into every data point

## Time Estimate
- **Phase 1:** 30 minutes
- **Phase 2:** 1 hour
- **Phase 3:** 2 hours
- **Phase 4:** 1 hour
- **Total:** 4.5 hours of focused development
