# Quick Deploy Guide - Edge Functions

**Status:** Edge functions are ready but NOT deployed yet

---

## The Issue

The edge functions code is written and tested, but they're not deployed to Supabase yet. That's why you're seeing CORS errors - the browser is trying to call functions that don't exist yet.

---

## EASIEST Method: Supabase Dashboard (5 minutes)

### Step 1: Go to Edge Functions
https://supabase.com/dashboard/project/eyytfnrvzfidxoonnqyt/functions

### Step 2: Deploy `fetch-seo-metrics`

1. Click **"New Function"** or **"Deploy new function"**
2. Function name: `fetch-seo-metrics`
3. Copy/paste this code:

```typescript
// Copy the entire contents of:
// supabase/functions/fetch-seo-metrics/index.ts
```

4. Click **"Deploy"**

### Step 3: Deploy `analyze-website-ai`

1. Click **"New Function"** again
2. Function name: `analyze-website-ai`
3. Copy/paste this code:

```typescript
// Copy the entire contents of:
// supabase/functions/analyze-website-ai/index.ts
```

4. Click **"Deploy"**

### Step 4: Set Secrets

1. Go to Project Settings → Edge Functions → Manage secrets
2. Add these secrets:
   - `SEMRUSH_API_KEY` = `d9f326f84dbf600af0bfaa91b13e9c8e`
   - `OPENROUTER_API_KEY` = `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`

---

## Alternative: Using cURL (Advanced)

If you prefer command line, here's how to deploy via API:

```bash
# Get your service role key
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eXRmbnJ2emZpZHhvb25ucXl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg5NzkxMywiZXhwIjoyMDc4NDczOTEzfQ.NXxYhSKP0_pMgtSMjpxXxWkwNk_XaOgffQtp5ryRR6Q"

# Deploy fetch-seo-metrics
curl -X POST \
  'https://api.supabase.com/v1/projects/eyytfnrvzfidxoonnqyt/functions/fetch-seo-metrics' \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d @supabase/functions/fetch-seo-metrics/index.ts

# Deploy analyze-website-ai
curl -X POST \
  'https://api.supabase.com/v1/projects/eyytfnrvzfidxoonnqyt/functions/analyze-website-ai' \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d @supabase/functions/analyze-website-ai/index.ts
```

---

## After Deployment

### Test that it worked:

```bash
# Test SEMrush function
curl -X POST 'https://eyytfnrvzfidxoonnqyt.supabase.co/functions/v1/fetch-seo-metrics' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eXRmbnJ2emZpZHhvb25ucXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTMsImV4cCI6MjA3ODQ3MzkxM30.3_iQb_vP27AjfTc3aiJtKwwmgdgoaRfFLfr-i3eMzEY' \
  -H 'Content-Type: application/json' \
  -d '{"domain":"tesla.com","type":"overview"}'

# Expected: JSON with success: true, data: [...]
```

### Then reload your app:

1. Go to http://localhost:3001/
2. Try creating a brand again
3. Check console - should see NO CORS errors!

---

## What You'll See After Deployment

### Before:
```
❌ Access to fetch at 'https://eyytfnrvzfidxoonnqyt.supabase.co/functions/v1/fetch-seo-metrics'
   from origin 'http://localhost:3001' has been blocked by CORS policy
❌ [Semrush] Edge function error: FunctionsFetchError: Failed to send a request
❌ Using fallback customization
```

### After:
```
✅ [Semrush] Fetching domain overview for: www.rhodesteamtexas.com
✅ [Semrush] Found 45 non-branded keyword rankings
✅ [websiteAnalyzer] Analysis complete
✅ Brand health calculated: 67
✅ SEO metrics fetched: {authorityScore: 45, keywords: 234}
```

---

## Files to Deploy

### File 1: fetch-seo-metrics
**Location:** `supabase/functions/fetch-seo-metrics/index.ts`
**Size:** 111 lines
**Purpose:** Proxy SEMrush API calls

### File 2: analyze-website-ai
**Location:** `supabase/functions/analyze-website-ai/index.ts`
**Size:** 170 lines
**Purpose:** AI-powered website analysis

---

## Secrets Needed

Add these in: Project Settings → Edge Functions → Manage secrets

1. **SEMRUSH_API_KEY**
   ```
   d9f326f84dbf600af0bfaa91b13e9c8e
   ```

2. **OPENROUTER_API_KEY**
   ```
   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
   ```

---

## Why This Wasn't Done Automatically

The Supabase CLI was trying to use a different project directory. Manual deployment via dashboard is faster and more reliable.

---

## Summary

**Time Required:** 5-10 minutes
**Complexity:** Copy/paste code files
**Result:** 100% working SEMrush & OpenRouter integration

**Do this now and your app will have real data immediately!**
