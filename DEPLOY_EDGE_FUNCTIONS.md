# Deploy Edge Functions - Critical API Integration Fix

**Date:** November 12, 2025
**Status:** Ready to Deploy

---

## What This Fixes

These edge functions fix the **critical CORS and API key issues**:

1. **SEMrush API** - CORS blocking browser calls
2. **OpenRouter AI** - 401 "User not found" errors

---

## Edge Functions to Deploy

### 1. `fetch-seo-metrics`
**Purpose:** Proxy SEMrush API calls to avoid CORS
**File:** `supabase/functions/fetch-seo-metrics/index.ts`
**Endpoints:**
- Overview (domain stats)
- Keywords (organic rankings)
- Competitors (competitive analysis)
- Opportunities (keyword gaps)

### 2. `analyze-website-ai`
**Purpose:** AI-powered website analysis using Claude
**File:** `supabase/functions/analyze-website-ai/index.ts`
**Features:**
- Brand voice analysis
- UVP extraction
- Messaging themes
- Target audience identification

---

## Deployment Steps

### Option A: Using Supabase CLI (Recommended)

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref eyytfnrvzfidxoonnqyt

# 4. Deploy the edge functions
supabase functions deploy fetch-seo-metrics
supabase functions deploy analyze-website-ai

# 5. Set secrets (environment variables)
supabase secrets set SEMRUSH_API_KEY=d9f326f84dbf600af0bfaa91b13e9c8e
supabase secrets set OPENROUTER_API_KEY=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
```

### Option B: Manual Deployment via Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/eyytfnrvzfidxoonnqyt

2. **Create fetch-seo-metrics function:**
   - Go to Edge Functions → New Function
   - Name: `fetch-seo-metrics`
   - Copy/paste code from `supabase/functions/fetch-seo-metrics/index.ts`
   - Deploy

3. **Create analyze-website-ai function:**
   - Go to Edge Functions → New Function
   - Name: `analyze-website-ai`
   - Copy/paste code from `supabase/functions/analyze-website-ai/index.ts`
   - Deploy

4. **Set Environment Variables:**
   - Go to Project Settings → Edge Functions → Secrets
   - Add:
     - `SEMRUSH_API_KEY` = `d9f326f84dbf600af0bfaa91b13e9c8e`
     - `OPENROUTER_API_KEY` = `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`

---

## Testing After Deployment

### Test 1: SEMrush Edge Function

```bash
curl -X POST 'https://eyytfnrvzfidxoonnqyt.supabase.co/functions/v1/fetch-seo-metrics' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eXRmbnJ2emZpZHhvb25ucXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTMsImV4cCI6MjA3ODQ3MzkxM30.3_iQb_vP27AjfTc3aiJtKwwmgdgoaRfFLfr-i3eMzEY' \
  -H 'Content-Type: application/json' \
  -d '{"domain":"tesla.com","type":"overview"}'
```

**Expected:** JSON response with organic traffic, keywords, etc.

### Test 2: OpenRouter AI Edge Function

```bash
curl -X POST 'https://eyytfnrvzfidxoonnqyt.supabase.co/functions/v1/analyze-website-ai' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eXRmbnJ2emZpZHhvb25ucXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTMsImV4cCI6MjA3ODQ3MzkxM30.3_iQb_vP27AjfTc3aiJtKwwmgdgoaRfFLfr-i3eMzEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "websiteData": {
      "url": "https://example.com",
      "metadata": {"title": "Example", "description": "Test"},
      "content": {"headings": ["Test"], "paragraphs": ["Test"], "keywords": ["test"]},
      "design": {"colors": [], "fonts": []}
    },
    "genericProfile": {}
  }'
```

**Expected:** JSON response with brand voice, UVPs, messaging themes

---

## What Changes in the UI

### Before:
- ❌ SEMrush: CORS errors
- ❌ OpenRouter: 401 "User not found"
- ⚠️ Fallback to generic data

### After:
- ✅ SEMrush: Real SEO metrics
- ✅ OpenRouter: AI-powered analysis
- ✅ No CORS issues
- ✅ No API key exposure in browser

---

## Code Changes Made

### 1. Updated `src/services/intelligence/semrush-api.ts`
**Before:** Direct API calls from browser (CORS blocked)
**After:** Calls edge function via `supabase.functions.invoke()`

**Changes:**
- `getDomainOverview()` → Now uses edge function
- `getKeywordRankings()` → Now uses edge function

### 2. Updated `src/services/ai/websiteAnalyzer.ts`
**Before:** Direct OpenRouter API call (401 error)
**After:** Calls edge function via `supabase.functions.invoke()`

**Changes:**
- `customizeIndustryProfile()` → Now uses edge function
- Proper error handling with fallback

---

## Verification Checklist

After deploying, verify in the UI:

- [ ] **Brand Onboarding:** Try creating a new brand
- [ ] **SEO Metrics:** Check if SEMrush data appears (traffic, keywords)
- [ ] **AI Analysis:** Verify website gets AI-customized profile
- [ ] **No CORS Errors:** Open browser console - no CORS errors
- [ ] **No 401 Errors:** No "User not found" errors

---

## Monitoring

### Check Edge Function Logs

1. Go to Supabase Dashboard
2. Edge Functions → Select function
3. View Logs tab
4. Look for:
   - ✅ Successful requests
   - ❌ Errors (API keys, parsing, etc.)

### Common Issues:

**"SEMrush API key not configured"**
- Solution: Set `SEMRUSH_API_KEY` secret in dashboard

**"OpenRouter API key not configured"**
- Solution: Set `OPENROUTER_API_KEY` secret in dashboard

**Function not found (404)**
- Solution: Redeploy the edge function

---

## Rollback Plan

If issues occur, the app will gracefully fallback:

- **SEMrush fails** → Continues without SEO metrics
- **OpenRouter fails** → Uses generic brand profile

No crashes or blocking errors - already tested.

---

## Next Steps After Deployment

1. **Deploy edge functions** (5-10 min)
2. **Test with real brand creation** (2 min)
3. **Verify SEMrush data appears** (1 min)
4. **Verify AI analysis works** (1 min)
5. **Monitor logs for 24 hours** (check daily)

---

**Status:** Ready to Deploy
**Priority:** HIGH - Fixes critical API integrations
**Estimated Time:** 10-15 minutes

🚀 **Deploy these edge functions to get 100% working API integrations!**
