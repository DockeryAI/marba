# TESTING GUIDE: Intelligence Data & MIRROR Fixes

**Purpose**: Verify that all recent fixes work end-to-end and that you see REAL intelligence data instead of dummy/placeholder data.

---

## What Was Fixed

### 1. Data Persistence (CRITICAL FIX)
- **Problem**: `MirrorContext.saveToServer()` had a TODO comment and wasn't actually saving
- **Fix**: Implemented proper Supabase upsert for all 6 MIRROR sections
- **Location**: `src/contexts/MirrorContext.tsx:152-207`

### 2. Refresh Button (CRITICAL FIX)
- **Problem**: Old brands didn't have intelligence data (SEO, competitors, etc.)
- **Fix**: Enhanced Refresh button with 4-step process to fetch and populate all data
- **Location**: `src/components/mirror/measure/MeasureSection.tsx:75-162`

### 3. API Configuration Documentation
- **Problem**: No guidance on required API keys
- **Fix**: Created `.env.example` and comprehensive `API_SETUP_GUIDE.md`
- **Location**: Root directory

### 4. Synapse Live Scoring Integration
- **Problem**: Component built but not used
- **Fix**: Integrated into BrandStrategy positioning statement editor
- **Location**: `src/components/mirror/reimagine/BrandStrategy.tsx:164-171`

---

## Test Plan

### ✅ Test 1: Refresh Button (Priority: HIGH)

**Goal**: Verify Refresh button fetches real intelligence data for existing brands

**Steps**:
1. Open the app at http://localhost:3001
2. Navigate to an **existing brand** (one created before today)
3. Go to the **Measure** section
4. Open browser console (Cmd+Option+J on Mac, F12 on Windows)
5. Click the **Refresh** button in the top-right corner

**Expected Results**:
```
Console Output:
[MeasureSection] ===== STARTING INTELLIGENCE REFRESH =====
[MeasureSection] Refresh params: { domain: '...', brandName: '...', industry: '...' }
[MeasureSection] Step 1/4: Fetching SEO metrics...
[SemrushAPI] Using configured API key (or: No API key configured, using demo data)
[MeasureSection] ✅ SEO metrics fetched: { authority: 65, keywords: 142, opportunities: 23 }
[MeasureSection] Step 2/4: Discovering competitors...
[Serper] Using configured API key (or: No API key configured, using mock data)
[MeasureSection] ✅ Competitors discovered: { total: 15, primary: 5, marketLeaders: 3 }
[MeasureSection] Step 3/4: Calculating brand health...
[MeasureSection] ✅ Brand health calculated: 68
[MeasureSection] Step 4/4: Updating MirrorContext...
[MirrorContext] Saving MIRROR state for brand: <brand-id>
[MirrorContext] Saving section: measure
[MirrorContext] All sections saved successfully
[MeasureSection] ✅ Data updated in context
[MeasureSection] ===== REFRESH COMPLETE =====
```

Alert Message:
```
✅ Intelligence data refreshed successfully! Data will save automatically in 2 seconds.
```

**Visual Changes**:
- Brand Health score should update
- SEO Health card should show metrics
- Keyword Opportunities should populate
- Competitive Dashboard should show competitors
- Content Gap Analysis should show gaps

**PASS/FAIL Criteria**:
- ✅ PASS: Console shows all 4 steps completing, data updates, alert shows success
- ❌ FAIL: Errors in console, alert shows failure, or visual data doesn't change

---

### ✅ Test 2: Data Persistence (Priority: HIGH)

**Goal**: Verify data persists to database after Refresh

**Steps**:
1. Complete Test 1 (Refresh Button)
2. Wait 3 seconds for auto-save
3. Check console for: `[MirrorContext] All sections saved successfully`
4. Refresh the browser page (Cmd+R or F5)
5. Navigate back to Measure section

**Expected Results**:
- Data should still be there (not reset to dummy data)
- Console shows: `Loaded MIRROR state for brand: <brand-id>`

**PASS/FAIL Criteria**:
- ✅ PASS: Data persists across page refresh
- ❌ FAIL: Data resets to dummy/placeholder values

---

### ✅ Test 3: New Brand Creation (Priority: MEDIUM)

**Goal**: Verify new brands get intelligence data automatically

**Steps**:
1. Go to Onboarding page
2. Create a new brand with:
   - Brand name: "Test Brand"
   - Website: "example.com" (or any real domain)
   - Industry: "Technology"
3. Complete onboarding
4. Navigate to Measure section
5. Check browser console

**Expected Results**:
Console Output:
```
[IndustryService] Starting brand creation with intelligence...
[IndustryService] Step 1/6: Analyzing website...
[IndustryService] Step 2/6: Fetching SEO metrics...
[IndustryService] Step 3/6: Discovering competitors...
[IndustryService] Step 4/6: Calculating brand health...
[IndustryService] Step 5/6: Generating strategy recommendations...
[IndustryService] Step 6/6: Saving to database...
[IndustryService] ✅ Brand created successfully
```

Visual:
- Measure section shows real data immediately
- SEO Health card populated
- Competitors appear in dashboard
- Keyword opportunities listed

**PASS/FAIL Criteria**:
- ✅ PASS: New brand shows intelligence data immediately
- ❌ FAIL: New brand shows dummy/placeholder data

---

### ✅ Test 4: Synapse Live Scoring (Priority: MEDIUM)

**Goal**: Verify Synapse psychology scoring works in real-time

**Steps**:
1. Navigate to **Reimagine** section
2. Find the **Brand Strategy** card
3. Click the **Edit** button (pencil icon) next to "Positioning Statement"
4. Start typing a positioning statement (e.g., "For marketers who need powerful insights...")
5. Watch for real-time psychology score

**Expected Results**:
- Score updates as you type (0-10 scale)
- Score breakdown shows 7 factors:
  - Emotional triggers
  - Power words
  - Curiosity gaps
  - Specificity
  - Action language
  - Brand voice alignment
  - Customer trigger alignment
- Visual indicator changes color:
  - Red: 0-5 (weak)
  - Yellow: 5-7 (good)
  - Green: 7-10 (excellent)

**PASS/FAIL Criteria**:
- ✅ PASS: Score updates in real-time, factors shown, colors change
- ❌ FAIL: No score shown, errors in console, or component doesn't render

---

### ✅ Test 5: API Key Configuration (Priority: LOW - Optional)

**Goal**: Verify real API keys work if configured

**Prerequisites**: You must have API keys from SEMrush, Serper, and/or OpenRouter

**Steps**:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your real API keys to `.env`:
   ```
   VITE_SEMRUSH_API_KEY=your-real-key
   VITE_SERPER_API_KEY=your-real-key
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-real-key
   ```
3. Restart dev server:
   ```bash
   # Kill existing server (Ctrl+C)
   npm run dev
   ```
4. Run Test 1 (Refresh Button) again
5. Check console

**Expected Results**:
Console should show:
```
[SemrushAPI] Using configured API key ✅
[Serper] Using configured API key ✅
```

Instead of:
```
[SemrushAPI] No API key configured, using demo data ⚠️
[Serper] No API key configured, using mock data ⚠️
```

**PASS/FAIL Criteria**:
- ✅ PASS: Console confirms API keys detected, real data returned
- ❌ FAIL: Still shows "using demo data" or errors about invalid keys

---

## Common Issues & Troubleshooting

### Issue 1: "No brand data to refresh" Alert

**Symptoms**: Refresh button shows alert "Unable to refresh: No brand name or industry found"

**Cause**: Brand data not loaded yet

**Fix**:
1. Ensure you're on a brand page (not empty state)
2. Refresh the entire browser page
3. Navigate back to Measure section
4. Try again

---

### Issue 2: Data Doesn't Persist After Refresh

**Symptoms**: Data shows after Refresh button, but disappears on page reload

**Cause**:
- Auto-save might be failing
- Database permissions issue

**Debug Steps**:
1. Check console for: `[MirrorContext] Error saving <section>`
2. Check network tab for failed Supabase requests
3. Verify Supabase connection in console:
   ```javascript
   // Paste in browser console:
   import('@/lib/supabase').then(({ supabase }) => {
     supabase.from('mirror_sections').select('count').then(console.log)
   })
   ```

---

### Issue 3: "429 Too Many Requests" Error

**Symptoms**: Refresh fails with 429 error in console

**Cause**: API rate limit exceeded (common with free tier SEMrush/Serper)

**Fix**:
1. Wait for quota to reset (usually 1 hour or 1 day)
2. Use demo mode temporarily:
   ```
   VITE_USE_MOCK_DATA=true
   ```
3. Consider upgrading API plan

---

### Issue 4: Synapse Score Doesn't Update

**Symptoms**: Typing in positioning statement, no score appears

**Cause**:
- Component not rendering
- Psychology engine import issue

**Debug Steps**:
1. Check console for errors
2. Verify import in BrandStrategy.tsx:
   ```typescript
   import { SynapseLiveScoring } from './SynapseLiveScoring'
   ```
3. Check that SynapseLiveScoring.tsx exists in same directory

---

## How to Tell If You're Seeing Real Data vs Dummy Data

### Real Intelligence Data ✅

**SEO Health Card**:
- Authority score: Varies (usually 20-80)
- Organic keywords: Specific number (e.g., 1,247)
- Organic traffic: Specific number (e.g., 12,453)
- Backlinks: Specific number

**Competitors**:
- Lists actual competitor domains
- Shows authority scores for each
- Has "View Insights" buttons

**Keyword Opportunities**:
- Lists specific keywords with search volume
- Shows difficulty scores (0-100)
- Has "Generate Content" button for each

**Content Gap Analysis**:
- Shows specific gaps with revenue impact
- Has actionable recommendations
- Lists specific topics/keywords

### Dummy/Placeholder Data ❌

**SEO Health Card**:
- Authority score: Exactly 65
- Organic keywords: 0 or "N/A"
- Says "Demo data" or "Configure APIs"
- All scores are rounded numbers (50, 60, 70)

**Competitors**:
- Empty list or "No competitors found"
- Shows message "Configure Serper API for real data"
- Generic competitor names

**Keyword Opportunities**:
- Empty list
- Shows "No opportunities yet"
- All opportunities have same format

**Content Gap Analysis**:
- Shows generic gaps
- Revenue estimates are rounded ($10K, $50K)
- Recommendations are vague

---

## Test Results Template

Copy this section and fill it out:

```
## TEST RESULTS: [DATE]

### Test 1: Refresh Button
- Status: [ ] PASS / [ ] FAIL
- Notes:

### Test 2: Data Persistence
- Status: [ ] PASS / [ ] FAIL
- Notes:

### Test 3: New Brand Creation
- Status: [ ] PASS / [ ] FAIL / [ ] SKIPPED
- Notes:

### Test 4: Synapse Live Scoring
- Status: [ ] PASS / [ ] FAIL
- Notes:

### Test 5: API Key Configuration
- Status: [ ] PASS / [ ] FAIL / [ ] SKIPPED
- Notes:

### Overall Assessment:
- [ ] All core features working
- [ ] Some issues, but usable
- [ ] Major issues, needs more work

### Screenshots:
[Paste screenshots here]

### Console Logs:
[Paste relevant console output here]
```

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Mark all todos complete
2. Document any API keys you configured
3. Consider testing with real API keys if using demo mode
4. Share results

### If Tests Fail ❌
1. Copy the exact error messages from console
2. Note which test failed
3. Include screenshots of what you're seeing
4. Share the test results template above
5. I'll investigate and fix the issues

---

## Questions?

- Check `API_SETUP_GUIDE.md` for API configuration help
- Check `HONEST_GAP_ANALYSIS.md` for technical details
- Console logs are your friend - always check them first
- Most issues are API key related or database permissions
