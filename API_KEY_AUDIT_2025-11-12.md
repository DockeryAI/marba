# API Key Audit Report
**Date:** November 12, 2025
**Status:** 2 Keys Missing

---

## ✅ CONFIGURED API KEYS (11/13)

| Key | Status | Service | Usage |
|-----|--------|---------|-------|
| VITE_SUPABASE_URL | ✅ Present | Supabase | Database connection |
| VITE_SUPABASE_ANON_KEY | ✅ Present | Supabase | Database auth |
| VITE_OPENROUTER_API_KEY | ✅ Present | OpenRouter | Synapse AI, Connection Discovery |
| VITE_OPENAI_API_KEY | ✅ Present | OpenAI | Content generation |
| VITE_WEATHER_API_KEY | ✅ Present | WeatherAPI.com | Weather intelligence |
| VITE_NEWS_API_KEY | ✅ Present | NewsAPI.org | News intelligence |
| VITE_YOUTUBE_API_KEY | ✅ Present | Google/YouTube | Trending topics |
| VITE_SEMRUSH_API_KEY | ✅ Present | SEMrush | SEO metrics |
| VITE_SERPER_API_KEY | ✅ Present | Serper.dev | Google search |
| VITE_OUTSCRAPER_API_KEY | ✅ Present | OutScraper | Business data scraping |
| VITE_APIFY_API_KEY | ✅ Present | Apify | Web automation |

---

## ❌ MISSING API KEYS (2/13)

### 1. VITE_GOOGLE_TRENDS_API_KEY

**Status:** ❌ MISSING
**Used In:**
- `src/services/intelligence/trend-analyzer.ts` (line 31)

**Impact:**
- Trend detection will fail
- Google Trends analysis won't work

**How to Fix:**
Google Trends doesn't have an official API. Options:
1. Use SerpAPI: https://serpapi.com/ (Google Trends endpoint)
2. Use RapidAPI Google Trends: https://rapidapi.com/
3. Use Serper.dev (already have key) - supports trends

**Recommended:** Use existing SERPER_API_KEY for trends (no new key needed)

**Action Required:**
```bash
# Add to .env (if using dedicated trends API)
VITE_GOOGLE_TRENDS_API_KEY=your_key_here

# OR update trend-analyzer.ts to use Serper instead
```

---

### 2. VITE_ANTHROPIC_API_KEY

**Status:** ❌ MISSING
**Used In:**
- `src/services/uvp/uvpGenerator.ts` (line 176)
- `src/services/content-intelligence/contentIntelligence/dataAdapter.ts` (line 44)

**Impact:**
- UVP generation may fail (if Anthropic direct API is used)
- Business intelligence analysis may be degraded

**Note:** You already have VITE_OPENROUTER_API_KEY which can access Claude models. This key may be optional if using OpenRouter.

**How to Fix:**
Get API key from: https://console.anthropic.com/

**Action Required:**
```bash
# Add to .env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
```

**Alternative:** Modify code to use OpenRouter for all Claude calls (already configured)

---

## 📊 SUMMARY

**Total Keys Required:** 13
**Keys Configured:** 11 (85%)
**Keys Missing:** 2 (15%)

### Critical Assessment

**Can Ship Without Missing Keys?**
- ✅ **YES** - Both missing keys have workarounds:
  1. Google Trends: Use existing Serper API instead
  2. Anthropic: Use existing OpenRouter API instead

### Priority Actions

**HIGH PRIORITY:**
- [ ] Configure trend-analyzer.ts to use Serper API (already have key)

**OPTIONAL:**
- [ ] Get VITE_ANTHROPIC_API_KEY for direct Claude access
- [ ] Get dedicated Google Trends API key

---

## 🔧 RECOMMENDED FIXES

### Option A: Quick Fix (15 minutes)
Update trend-analyzer.ts to use Serper API instead of dedicated Trends API.

**File:** `src/services/intelligence/trend-analyzer.ts`
**Change:** Use VITE_SERPER_API_KEY instead of VITE_GOOGLE_TRENDS_API_KEY

### Option B: Add Missing Keys (30 minutes)
1. Get Anthropic API key from https://console.anthropic.com/
2. Get SerpAPI key from https://serpapi.com/ (for Google Trends)
3. Add both to .env

### Option C: Do Nothing (0 minutes)
- Services will throw clear errors with setup instructions
- Users can add keys when needed
- Not blocking production deployment

---

## 📝 .ENV UPDATE NEEDED

Add these lines to `.env`:

```bash
# Google Trends Intelligence (Optional - can use Serper instead)
VITE_GOOGLE_TRENDS_API_KEY=your_serpapi_key_here
GOOGLE_TRENDS_API_KEY=your_serpapi_key_here

# Anthropic Direct API (Optional - can use OpenRouter instead)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
```

---

## ✅ VERIFICATION CHECKLIST

After adding keys, verify:

```bash
# Check all services start without errors
npm run dev

# Test trend detection
# Navigate to: Measure > Opportunities
# Should see trending topics without errors

# Test UVP generation
# Navigate to: Reimagine > UVPs
# Should generate UVPs without errors
```

---

**Status:** Minor configuration needed, not blocking production deployment.
**Recommendation:** Apply Option A (use Serper for trends) - 15 minute fix.
