# Build: API Security & Intelligence Integration

**Created:** 2025-12-09
**Status:** Complete

## Overview

Migrate all frontend API calls to Supabase edge functions (hide API keys), replace YouTube Data API with Apify actor, and integrate BuzzSumo for content intelligence.

---

## Backend Configuration

**Supabase Project:** eyytfnrvzfidxoonnqyt
- Edge functions handle all external API calls
- API keys stored in Supabase secrets (not exposed to frontend)

**Edge Functions Available:**
- `openai-proxy` - Routes to OpenRouter (Claude Opus 4.5) and OpenAI (embeddings)
- `serper-search` - Google Search via Serper
- `outscraper-search` - Google Maps/Business data
- `youtube-intelligence` - YouTube data via Apify actor
- `weather-fetch` - OpenWeather API
- `news-fetch` - News API
- `fetch-seo-metrics` - Semrush SEO data
- `buzzsumo-intelligence` - BuzzSumo content intelligence
- `apify-actor` - Generic Apify actor runner
- `scrape-website` - Website content extraction
- `analyze-website-ai` - Claude-powered website analysis

---

## Phases

### Phase 1: Migrate APIs to Edge Functions
**Status:** complete
**Goal:** All external API calls go through Supabase edge functions

**Services migrated:**
- [x] `src/services/intelligence/serper-api.ts` → `serper-search` edge function
- [x] `src/services/intelligence/outscraper-api.ts` → `outscraper-search` edge function
- [x] `src/services/intelligence/openai-api.ts` → `openai-proxy` edge function
- [x] `src/services/intelligence/youtube-api.ts` → `youtube-intelligence` edge function
- [x] `src/services/intelligence/weather-api.ts` → `weather-fetch` edge function
- [x] `src/services/intelligence/news-api.ts` → `news-fetch` edge function
- [x] `src/services/intelligence/semrush-api.ts` → `fetch-seo-metrics` edge function
- [x] `src/services/intelligence/buzzsumo-api.ts` → `buzzsumo-intelligence` edge function
- [x] `src/services/uvp-wizard/rhodes-ai.ts` → `openai-proxy` edge function
- [x] `src/services/uvp-wizard/perplexity-api.ts` → `openai-proxy` edge function

**Success Criteria:** ✅ ALL MET
- No `VITE_*_API_KEY` variables used in frontend code (except Supabase)
- All API calls route through Supabase edge functions
- API keys only exist in Supabase secrets

---

### Phase 2: Replace YouTube API with Apify Actor
**Status:** complete
**Depends on:** Phase 1

**Goal:** Use Apify YouTube scraper instead of YouTube Data API (cheaper, more data)

**Deliverables:**
- [x] Create `youtube-intelligence` edge function using Apify actor
- [x] Update `src/services/intelligence/youtube-api.ts` to call edge function
- [x] Remove `VITE_YOUTUBE_API_KEY` from frontend
- [x] Test comments scraping (using `streamers/youtube-comments-scraper`)

**Implementation Notes:**
- Uses `streamers/youtube-comments-scraper` Apify actor
- Polls for results with 3-second intervals
- Maps Apify response to standardized YouTubeComment interface

**Success Criteria:** ✅ ALL MET
- YouTube intelligence works without YouTube Data API key
- Can fetch video comments via Apify
- API key hidden in edge function

---

### Phase 3: Integrate BuzzSumo
**Status:** complete
**Depends on:** Phase 1

**Goal:** Add BuzzSumo content intelligence for trending topics and competitor content

**Deliverables:**
- [x] Create `buzzsumo-intelligence` edge function
- [x] Create `src/services/intelligence/buzzsumo-api.ts`
- [x] Add BuzzSumo API key to Supabase secrets
- [x] Implement trending content lookup
- [x] Wire into content calendar suggestions

**Implementation Notes:**
- 6-hour cache TTL for trending content
- Viral threshold filtering for high-engagement content
- Graceful degradation on API errors

**Success Criteria:** ✅ ALL MET
- Can fetch trending content by industry/topic
- Data available for Synapse content suggestions

---

## Summary

All 10 frontend services now route through Supabase edge functions:
- **8 intelligence services** were already migrated
- **2 UVP wizard services** (rhodes-ai, perplexity-api) migrated in this session

YouTube already uses Apify via the `youtube-intelligence` edge function.
BuzzSumo already integrated via the `buzzsumo-intelligence` edge function.

**No frontend API keys exposed.** All secrets stored in Supabase.

---

## Session Log

**2025-12-09:**
- Analyzed codebase - found 8/10 services already using edge functions
- Migrated `rhodes-ai.ts` to use `openai-proxy` edge function
- Migrated `perplexity-api.ts` to use `openai-proxy` edge function
- Verified `youtube-intelligence` edge function uses Apify (not YouTube Data API)
- Verified `buzzsumo-intelligence` edge function exists and is integrated
- Build complete
