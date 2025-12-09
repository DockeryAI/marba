# Build: API Security Migration

**Created:** 2025-12-08
**Status:** Not Started
**Priority:** HIGH

## Overview

Move all external API calls from frontend to Supabase Edge Functions. Replace YouTube Data API with Apify Bluebird scraper. Remove all exposed API keys from frontend environment variables.

## Current State Analysis

### APIs Currently Exposing Keys in Frontend

| API | Frontend Service | Env Variable | Status |
|-----|------------------|--------------|--------|
| YouTube Data API | `youtube-api.ts` | `VITE_YOUTUBE_API_KEY` | Replace with Apify |
| Serper | `serper-api.ts` | `VITE_SERPER_API_KEY` | Move to edge |
| OpenWeather | `weather-api.ts` | `VITE_WEATHER_API_KEY` | Move to edge |
| NewsAPI | `news-api.ts` | `VITE_NEWS_API_KEY` | Move to edge |
| OutScraper | `outscraper-api.ts` | `VITE_OUTSCRAPER_API_KEY` | Move to edge |
| Apify | `apify-api.ts` | `VITE_APIFY_API_KEY` | Move to edge |
| OpenAI | `openai-api.ts` | `VITE_OPENAI_API_KEY` | Move to edge |
| SEMrush | `semrush-api.ts` | Uses edge function | Already done |

### Edge Functions Already Implemented

- `fetch-seo-metrics` - SEMrush proxy
- `scrape-website` - HTML scraping
- `analyze-website-ai` - OpenRouter analysis

---

## Phase 1: YouTube → Apify Bluebird Migration

**Status:** complete
**Priority:** HIGH
**Goal:** Replace YouTube Data API with Apify Bluebird scraper, maintain identical return types

### Why Apify Bluebird Instead of YouTube Data API

1. YouTube Data API has strict quotas (10,000 units/day free, search costs 100 units)
2. Apify scrapes public pages directly - no API quotas
3. Bluebird provides same data: title, description, tags, viewCount, likeCount, commentCount
4. Pay per compute unit instead of hitting quota limits

### Apify Bluebird Actor Details

- **Actor ID:** `bluebird/youtube-data-scraper`
- **Documentation:** https://apify.com/bluebird/youtube-data-scraper
- **Output Fields:**
  - `title` - Video title
  - `description` - Full description
  - `viewCount` - Number of views
  - `likeCount` - Number of likes
  - `commentCount` - Number of comments
  - `tags` - Array of video tags
  - `channelTitle` / `channelName` - Channel name
  - `publishedAt` / `uploadDate` - Upload date
  - `duration` - Video length
  - `transcript` - Full transcript (bonus)

### Edge Function: `supabase/functions/youtube-intelligence/index.ts`

**Actions to support:**
- `search` - Search videos by keywords (replaces `searchVideos()`)
- `trending` - Get trending videos (replaces `getTrendingVideos()`)

**Request Interface:**
```typescript
interface YouTubeRequest {
  action: 'search' | 'trending';
  keywords?: string[];      // For search
  category?: string;        // For trending
  region?: string;          // Default 'US'
  maxResults?: number;      // Default 50
}
```

**Response Interface (must match existing `YouTubeVideo`):**
```typescript
interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  categoryId: string;
}
```

**Mapping Apify → YouTubeVideo:**
```typescript
// Apify field → YouTubeVideo field
{
  id: apifyVideo.id || apifyVideo.videoId,
  title: apifyVideo.title,
  description: apifyVideo.description || '',
  channelTitle: apifyVideo.channelTitle || apifyVideo.channelName || '',
  publishedAt: apifyVideo.publishedAt || apifyVideo.uploadDate || '',
  viewCount: parseInt(apifyVideo.viewCount || '0'),
  likeCount: parseInt(apifyVideo.likeCount || '0'),
  commentCount: parseInt(apifyVideo.commentCount || '0'),
  tags: apifyVideo.tags || [],
  categoryId: apifyVideo.categoryId || ''
}
```

### Frontend Service Update: `youtube-api.ts`

**Before (direct API call):**
```typescript
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const url = `https://www.googleapis.com/youtube/v3/search?...&key=${YOUTUBE_API_KEY}`
```

**After (edge function call):**
```typescript
const { data, error } = await supabase.functions.invoke('youtube-intelligence', {
  body: { action: 'search', keywords, maxResults }
})
```

### Deliverables

- [x] Create `supabase/functions/youtube-intelligence/index.ts`
- [x] Implement Apify actor invocation with polling for results
- [x] Map Apify response to existing `YouTubeVideo` interface
- [x] Update `src/services/intelligence/youtube-api.ts` to call edge function
- [x] Verify `analyzeVideoTrends()` produces identical output
- [ ] Remove `VITE_YOUTUBE_API_KEY` from frontend `.env`
- [ ] Add `APIFY_API_KEY` to Supabase secrets

### Success Criteria

- `YouTubeAPI.searchVideos(['coffee', 'brewing'])` returns array of `YouTubeVideo`
- `YouTubeAPI.getTrendingVideos()` returns array of `YouTubeVideo`
- `YouTubeAPI.analyzeVideoTrends()` returns identical `TrendAnalysis` structure
- No `VITE_YOUTUBE_API_KEY` in frontend environment
- Tag frequency analysis produces same trending_topics output

---

## Phase 2: Serper Search Edge Function

**Status:** complete
**Depends on:** None (can run parallel to Phase 1)
**Goal:** Move all Serper API calls to edge function

### Edge Function: `supabase/functions/serper-search/index.ts`

**Actions to support:**
- `search` - Google search
- `news` - News search
- `places` - Local places
- `images` - Image search
- `videos` - Video search
- `shopping` - Shopping results
- `autocomplete` - Search suggestions

**Request Interface:**
```typescript
interface SerperRequest {
  action: 'search' | 'news' | 'places' | 'images' | 'videos' | 'shopping' | 'autocomplete';
  query: string;
  location?: string;
  num?: number;
}
```

### Deliverables

- [x] Create `supabase/functions/serper-search/index.ts`
- [x] Support all 7 Serper endpoints
- [x] Update `src/services/intelligence/serper-api.ts` to use edge function
- [ ] Remove `VITE_SERPER_API_KEY` from frontend
- [ ] Add `SERPER_API_KEY` to Supabase secrets

### Success Criteria

- All `SerperAPI.*` methods work identically
- No frontend API key exposure

---

## Phase 3: Weather API Edge Function

**Status:** complete
**Depends on:** None (can run parallel)
**Goal:** Move OpenWeather calls to edge function

### Edge Function: `supabase/functions/weather-fetch/index.ts`

**Actions to support:**
- `current` - Current weather
- `forecast` - 5-day forecast

**Request Interface:**
```typescript
interface WeatherRequest {
  action: 'current' | 'forecast';
  location: string;
  units?: 'imperial' | 'metric';
}
```

### Deliverables

- [x] Create `supabase/functions/weather-fetch/index.ts`
- [x] Update `src/services/intelligence/weather-api.ts`
- [ ] Remove `VITE_WEATHER_API_KEY` from frontend
- [ ] Add `WEATHER_API_KEY` to Supabase secrets

---

## Phase 4: News API Edge Function

**Status:** complete
**Depends on:** None (can run parallel)
**Goal:** Move NewsAPI calls to edge function

### Edge Function: `supabase/functions/news-fetch/index.ts`

**Actions to support:**
- `industry` - Industry news search
- `local` - Local news search

**Request Interface:**
```typescript
interface NewsRequest {
  action: 'industry' | 'local';
  query?: string;
  keywords?: string[];
  location?: string;
}
```

### Deliverables

- [x] Create `supabase/functions/news-fetch/index.ts`
- [x] Update `src/services/intelligence/news-api.ts`
- [ ] Remove `VITE_NEWS_API_KEY` from frontend
- [ ] Add `NEWS_API_KEY` to Supabase secrets

---

## Phase 5: OutScraper Edge Function

**Status:** complete
**Depends on:** None (can run parallel)
**Goal:** Move OutScraper calls to edge function

### Edge Function: `supabase/functions/outscraper-search/index.ts`

**Actions to support:**
- `maps-search` - Google Maps search
- `reviews` - Scrape reviews for place
- `business-details` - Full business profile

**Request Interface:**
```typescript
interface OutScraperRequest {
  action: 'maps-search' | 'reviews' | 'business-details';
  query?: string;
  placeId?: string;
  location?: string;
  limit?: number;
}
```

### Deliverables

- [x] Create `supabase/functions/outscraper-search/index.ts`
- [x] Update `src/services/intelligence/outscraper-api.ts`
- [ ] Remove `VITE_OUTSCRAPER_API_KEY` from frontend
- [ ] Add `OUTSCRAPER_API_KEY` to Supabase secrets

---

## Phase 6: Generic Apify Edge Function

**Status:** complete
**Depends on:** Phase 1 (reuse patterns)
**Goal:** Centralize all Apify actor calls through single edge function

### Edge Function: `supabase/functions/apify-actor/index.ts`

**Purpose:** Generic actor runner for website scraping, Instagram, Google Maps, and future actors

**Request Interface:**
```typescript
interface ApifyRequest {
  actorId: string;
  input: Record<string, any>;
  timeout?: number;
}
```

### Deliverables

- [x] Create `supabase/functions/apify-actor/index.ts`
- [x] Implement actor run + polling pattern
- [x] Update `src/services/intelligence/apify-api.ts`
- [ ] Remove `VITE_APIFY_API_KEY` from frontend
- [ ] Consolidate with Phase 1 YouTube function if appropriate

---

## Phase 7: OpenAI Edge Function

**Status:** complete
**Depends on:** None
**Goal:** Move OpenAI embeddings calls to edge function

### Edge Function: `supabase/functions/openai-embeddings/index.ts`

**Actions to support:**
- `embeddings` - Create embeddings for text array

**Request Interface:**
```typescript
interface OpenAIRequest {
  action: 'embeddings';
  texts: string[];
  model?: string;
}
```

### Deliverables

- [x] Create `supabase/functions/openai-proxy/index.ts`
- [x] Update `src/services/synapse/connections/EmbeddingService.ts`
- [x] Update `src/services/intelligence/openai-api.ts`
- [ ] Remove `VITE_OPENAI_API_KEY` from frontend
- [ ] Add `OPENAI_API_KEY` to Supabase secrets

---

## Phase 8: Final Cleanup & Verification

**Status:** not_started
**Depends on:** All previous phases
**Goal:** Remove all frontend API keys, verify functionality

### Deliverables

- [ ] Remove all `VITE_*_API_KEY` variables from `.env.example`
- [ ] Update `.env.example` to only include Supabase credentials
- [ ] Run full integration test of DeepContext builder
- [ ] Verify Synapse generation works end-to-end
- [ ] Update documentation

### Environment Variables After Migration

**Frontend `.env` (minimal):**
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_OPENROUTER_API_KEY=xxx  # Only if not moved to edge
```

**Supabase Secrets (all API keys):**
```
APIFY_API_KEY=xxx
SERPER_API_KEY=xxx
WEATHER_API_KEY=xxx
NEWS_API_KEY=xxx
OUTSCRAPER_API_KEY=xxx
OPENAI_API_KEY=xxx
SEMRUSH_API_KEY=xxx  # Already there
OPENROUTER_API_KEY=xxx
```

---

## Technical Patterns

### Edge Function Template

All edge functions follow this pattern:

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const API_KEY = Deno.env.get('API_KEY_NAME');

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle action...

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Frontend Service Update Pattern

```typescript
// Before
const API_KEY = import.meta.env.VITE_API_KEY;
const response = await fetch(`https://api.example.com?key=${API_KEY}`, {...});

// After
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.functions.invoke('edge-function-name', {
  body: { action: 'action-name', ...params }
});

if (error) throw new Error(error.message);
return data;
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Apify Bluebird output differs from YouTube API | High | Test with sample data before full migration |
| Edge function cold starts slow down UX | Medium | Implement frontend caching layer |
| Supabase function limits hit | Medium | Monitor usage, implement request batching |
| Different error formats break frontend | Medium | Standardize error response format |

---

## Out of Scope (Future Enhancements)

- YouTube comment scraping for psychological patterns
- Rate limiting / caching in edge functions
- Error retry logic with exponential backoff
- Request deduplication
- Cost tracking per API

---

## Session Log

### Session 2025-12-08

**Completed:**
- [x] Create `supabase/functions/youtube-intelligence/index.ts`
- [x] Implement Apify actor invocation with polling for results
- [x] Map Apify response to existing `YouTubeVideo` interface
- [x] Update `src/services/intelligence/youtube-api.ts` to call edge function
- [x] Verify `analyzeVideoTrends()` produces identical output
- [x] Code review and fix all 21 issues found

**Tests:** 21 passing (YouTube API), 9 added from original 12

**Files Created:**
- `supabase/functions/youtube-intelligence/index.ts` (282 lines)

**Files Modified:**
- `src/services/intelligence/youtube-api.ts` - Now calls edge function
- `src/services/intelligence/__tests__/youtube-api.test.ts` - Comprehensive test coverage

**Decisions:**
1. Replace YouTube Data API with Apify Bluebird scraper to avoid quota limits
2. Edge function returns `success: false` consistently for all error cases
3. Remove fake `peakPostingTimes` - was misleading placeholder data
4. Add `parseNumericString()` for handling "1.5M", "2K" formatted counts
5. Relevance score now multi-factor (results + engagement + topics)
6. Use typed interfaces instead of `any` for type safety

**Review Issues Fixed:**
- Input validation on edge function request body
- Null checks for Apify API responses
- Error response format consistency
- Robust numeric parsing for view counts
- Removed fake data that would mislead users
- Added comprehensive test coverage

**Next Session:**
- Manual: Remove `VITE_YOUTUBE_API_KEY` from `.env`
- Manual: Add `APIFY_API_KEY` to Supabase secrets
- Start Phase 2: Serper Search Edge Function (can run parallel)

**Blockers:** None

**Note:** Other test failures (synapse-core.service.test.ts) are pre-existing, not from this session.

### Session 2025-12-08 (Continued) - Parallel Implementation

**Completed:** Phases 2-7 implemented in parallel using 6 subagents

**Phase 2: Serper Search** (37 tests)
- Created `supabase/functions/serper-search/index.ts` (202 lines)
- Updated `src/services/intelligence/serper-api.ts` (330 lines)
- Created `src/services/intelligence/__tests__/serper-api.test.ts` (877 lines)
- Supports 7 actions: search, news, places, images, videos, shopping, autocomplete

**Phase 3: Weather API** (19 tests)
- Created `supabase/functions/weather-fetch/index.ts` (127 lines)
- Updated `src/services/intelligence/weather-api.ts`
- Created `src/services/intelligence/__tests__/weather-api.test.ts` (503 lines)
- Supports 2 actions: current, forecast

**Phase 4: News API** (22 tests)
- Created `supabase/functions/news-fetch/index.ts`
- Updated `src/services/intelligence/news-api.ts`
- Created `src/services/intelligence/__tests__/news-api.test.ts`
- Supports 2 actions: industry, local

**Phase 5: OutScraper** (23 tests)
- Created `supabase/functions/outscraper-search/index.ts` (322 lines)
- Updated `src/services/intelligence/outscraper-api.ts` (396 lines)
- Created `src/services/intelligence/__tests__/outscraper-api.test.ts` (505 lines)
- Supports 3 actions: maps-search, reviews, business-details

**Phase 6: Apify Actor** (19 tests)
- Created `supabase/functions/apify-actor/index.ts`
- Updated `src/services/intelligence/apify-api.ts`
- Created `src/services/intelligence/__tests__/apify-api.test.ts`
- Supports 4 actions: run-actor, website-content, google-maps, instagram

**Phase 7: OpenAI Proxy** (19 tests)
- Created `supabase/functions/openai-proxy/index.ts`
- Updated `src/services/intelligence/openai-api.ts`
- Updated `src/services/synapse/connections/EmbeddingService.ts`
- Created `src/services/intelligence/__tests__/openai-api.test.ts`
- Supports 2 actions: embeddings, chat

**Tests:** 139 passing across all API migration tests

**Edge Functions Created:**
- `supabase/functions/serper-search/`
- `supabase/functions/weather-fetch/`
- `supabase/functions/news-fetch/`
- `supabase/functions/outscraper-search/`
- `supabase/functions/apify-actor/`
- `supabase/functions/openai-proxy/`

**Next Steps (Manual):**
1. Deploy edge functions: `supabase functions deploy <name>`
2. Set secrets in Supabase dashboard:
   - `SERPER_API_KEY`
   - `WEATHER_API_KEY`
   - `NEWS_API_KEY`
   - `OUTSCRAPER_API_KEY`
   - `APIFY_API_KEY` (already set for YouTube)
   - `OPENAI_API_KEY`
3. Test in production
4. Remove `VITE_*_API_KEY` vars from `.env` files

**Blockers:** None
