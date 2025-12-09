# Build: BuzzSumo Integration

**Created:** 2025-12-08
**Status:** In Progress (Phase 1 Complete)

## Overview

Replace YouTube's weak trend discovery (creator-chosen tags) with BuzzSumo's engagement-validated Trending API. Add post-generation badges to Synapse content based on Evergreen Score, Content Analyzer, and competitor analysis - without compromising unique angle generation.

**Key Principle:** BuzzSumo informs *validation*, not *generation*. Synapse finds non-obvious connections first; BuzzSumo adds confidence signals after.

## Phases

### Phase 1: BuzzSumo API Foundation
**Status:** complete

**Goal:** BuzzSumo Trending API accessible via edge function and service layer

**Deliverables:**
- [x] Edge function `buzzsumo-intelligence` (trending endpoint)
- [x] Service file `buzzsumo-api.ts` (same pattern as other intelligence APIs)
- [x] Caching strategy (6hr TTL for trending)
- [x] Tests for edge function and service (23 tests passing)
- [x] Integration with DeepContextBuilder (`includeBuzzSumo` flag, `fetchBuzzSumoIntelligence()`)
- [x] Added 'buzzsumo' to DataSource type
- [x] Exported from intelligence index.ts

**Success Criteria:** Can call `BuzzSumoAPI.getTrending(industry)` and get 24-hour viral content back

---

### Phase 2: Replace YouTube Trending
**Status:** partial (integration done, deprecation decision pending)
**Depends on:** Phase 1

**Goal:** DeepContextBuilder uses BuzzSumo for trending topics instead of YouTube tags

**Deliverables:**
- [x] Add `includeBuzzSumo` config flag to DeepContextBuilder
- [x] Add `fetchBuzzSumoIntelligence()` method returning `DataPoint[]`
- [ ] Update DeepContextBuilder to prefer BuzzSumo trending over YouTube (decision: keep both for now)
- [ ] Deprecate YouTube trending (keep YouTube for future comment mining)

**Success Criteria:** ConnectionFinder receives trending topics sourced from BuzzSumo engagement data, not YouTube tags

---

### Phase 3: Badge Infrastructure
**Status:** not_started
**Depends on:** Phase 1

**Goal:** Post-generation badge system that checks content against BuzzSumo signals

**Deliverables:**
- [ ] Badge service (`content-badge.service.ts`) with check methods
- [ ] Content Analyzer endpoint in edge function
- [ ] Evergreen Score lookup endpoint
- [ ] Domain analysis endpoint (competitor content)
- [ ] Badge type definitions

**Badge Types:**
- **Evergreen Topic** - Topic area has high Evergreen Scores historically
- **Trending Now** - Related content spiking in last 24-48hrs
- **Proven Format** - Similar content format performed well in industry
- **Untapped Angle** - No high-performing content on this specific angle (differentiation signal)
- **Competitor Blind Spot** - Competitors haven't published on this

**Success Criteria:** Can pass generated content and get back applicable badges with confidence scores

---

### Phase 4: Badge UI Integration
**Status:** not_started
**Depends on:** Phase 3

**Goal:** Badges visible on generated Synapse content

**Deliverables:**
- [ ] Badge component (visual design)
- [ ] Integration into content display components
- [ ] Tooltip explanations for each badge type
- [ ] Badge fetch on content generation complete

**Success Criteria:** User sees relevant badges on generated content

---

## Out of Scope (Future)
- YouTube comment mining for VoC (separate initiative)
- BuzzSumo Question Analyzer (API doesn't exist)
- Real-time badge updates (initial = generation-time only)
- Badge filtering/sorting in content list

## Architecture Notes

**Edge Function Pattern:**
```
supabase/functions/buzzsumo-intelligence/
├── trending (24hr viral) - Phase 1
├── articles (content analyzer) - Phase 3
├── evergreen (score lookup) - Phase 3
└── domain (competitor analysis) - Phase 3
```

**Service Integration:**
- `buzzsumo-api.ts` follows same pattern as `youtube-api.ts`, `serper-api.ts`
- Returns `DataPoint[]` for DeepContextBuilder compatibility
- Badge service is separate, runs post-generation

## Session Log

### 2025-12-08 - Phase 1 Complete + Deployed
**Files Created:**
- `supabase/functions/buzzsumo-intelligence/index.ts` - Edge function for BuzzSumo Trends API
- `src/services/intelligence/buzzsumo-api.ts` - Service layer with caching (6hr TTL)
- `src/services/intelligence/__tests__/buzzsumo-api.test.ts` - 23 tests (all passing)

**Files Modified:**
- `src/types/connections.types.ts` - Added 'buzzsumo' to DataSource union
- `src/services/intelligence/deepcontext-builder.service.ts` - Added `includeBuzzSumo` config and `fetchBuzzSumoIntelligence()` method
- `src/services/intelligence/index.ts` - Export BuzzSumoAPI

**Deployment:**
- [x] Edge function deployed to Supabase
- [x] `BUZZSUMO_API_KEY` secret configured
- [x] Live endpoint tested and returning real trending data

**Code Review Fixes Applied:**
- [x] Magic numbers replaced with named constants (viral threshold, cache TTL, confidence scaling)
- [x] Test overfitting fixed (structural assertions instead of exact value matching)
- [x] API endpoint corrected: `/search/trends.json` (not `/search/trending.json`)

**Decisions:**
- 6-hour cache TTL balances freshness vs API cost
- Confidence scoring: base 0.7, up to 0.95 at 10k+ shares
- Max 15 articles per fetch to limit context size
- 1000+ shares = viral threshold
- BuzzSumo runs alongside YouTube (both enabled), not replacing yet

**Tests:** 23 passing

**Next:** Phase 3 - Badge Infrastructure (Content Analyzer, Evergreen Score endpoints)
