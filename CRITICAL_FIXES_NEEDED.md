# Critical Fixes Needed for MARBA Mirror Section

## Status: Multiple Critical Issues Found

### 1. API Method Calls Are Incorrect
**Problem:** Services are calling non-existent API methods
- `perplexityAPI.search()` doesn't exist
- `openRouterAI.generateResponse()` doesn't exist

**Actual Methods Available:**
- PerplexityAPI: `getIndustryInsights()`
- OpenRouter: `chat()` function

**Files Affected:**
- market-position.service.ts
- customer-truth.service.ts
- brand-fit.service.ts

### 2. Database Tables Don't Exist
**Errors:**
- `mirror_diagnostics` table returns 406 (Not Acceptable)
- `brand_sessions` table returns 404 (Not Found)
- `brand_uvps` table returns 400 (Bad Request)

**Actions Needed:**
- Create migrations for these tables OR
- Update services to use existing tables

### 3. UI Issues
**Problems:**
- Sidebar expand/collapse button not working
- No horizontal nav visible (MirrorSectionHeader exists but not rendering)
- No drill-down data in diagnostic cards
- Brand health score shows but no underlying data breakdown

### 4. Data Generation Working But Not Saving
**Good News:** Diagnostics ARE running and generating scores:
- Market Position: 85/100
- Customer Truth: 50/100
- Brand Fit: 35/100
- Overall: 56/100

**Problem:** Data not being saved to database due to table errors

### 5. Session Management Broken
**Error:** `brand_sessions` table doesn't exist
**Impact:** Cannot save/resume sessions

## Quick Wins to Implement Now

### Fix #1: Update API Service Imports
Create a unified AI service wrapper that provides consistent methods

### Fix #2: Skip Database Saves Temporarily
Show diagnostic results in UI even if database save fails

### Fix #3: Expand Diagnostic Cards
Add expandable sections to show detailed breakdowns

### Fix #4: Fix Sidebar Toggle
Debug the collapse/expand button

### Fix #5: Make Section Headers More Visible
Increase z-index and add more prominent styling

## Priority Order
1. Fix API method calls (critical - nothing works without this)
2. Show diagnostic data in UI without database dependency
3. Add drill-down capability to diagnostic cards
4. Fix sidebar toggle
5. Create database migrations

## Estimated Impact
- Fixing API calls: 80% of errors gone
- UI improvements: User can actually see and use the data
- Database fixes: Persistence works long-term
