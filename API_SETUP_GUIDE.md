# API Setup Guide

This guide explains how to configure the APIs required for MIRROR intelligence features.

---

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to `.env`

3. Restart the dev server:
   ```bash
   npm run dev
   ```

---

## Required APIs

### 1. SEMrush API (High Priority)

**Used For:**
- SEO Health Dashboard
- Keyword Opportunities
- Competitor Discovery
- Authority Score

**Get API Key:**
1. Go to https://www.semrush.com/
2. Sign up for an account (free trial available)
3. Navigate to API Dashboard
4. Generate API key

**Cost:** Free tier available, paid plans from $119.95/month

**Add to .env:**
```
VITE_SEMRUSH_API_KEY=your-key-here
```

**Fallback:** Uses demo data if not configured

---

### 2. Serper API (High Priority)

**Used For:**
- Google search results
- Competitor discovery
- Content gap analysis
- Market research

**Get API Key:**
1. Go to https://serper.dev/
2. Sign up (email + password)
3. Get API key from dashboard

**Cost:** Free tier: 2,500 searches/month

**Add to .env:**
```
VITE_SERPER_API_KEY=your-key-here
```

**Fallback:** Uses demo data if not configured

---

### 3. OpenRouter API (Required for Synapse)

**Used For:**
- AI content generation
- Psychology analysis
- Synapse content engine

**Get API Key:**
1. Go to https://openrouter.ai/
2. Sign up
3. Add credits ($5 minimum)
4. Generate API key

**Cost:** Pay-as-you-go, ~$0.01-0.10 per generation

**Add to .env:**
```
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

**Fallback:** None - required for Synapse features

---

## Optional APIs

### 4. WeatherAPI (Optional)

**Used For:**
- Weather-based content opportunities
- Seasonal alerts

**Get API Key:**
1. Go to https://www.weatherapi.com/
2. Sign up (free)
3. Get API key

**Cost:** Free tier: 1M calls/month

**Add to .env:**
```
VITE_WEATHER_API_KEY=your-key-here
```

---

### 5. News API (Optional)

**Used For:**
- News-based opportunities
- Trending topics

**Get API Key:**
1. Go to https://newsapi.org/
2. Sign up (free)
3. Get API key

**Cost:** Free tier: 100 requests/day

**Add to .env:**
```
VITE_NEWS_API_KEY=your-key-here
```

---

## Verifying Setup

### Check API Configuration

1. Open browser console
2. Go to any MIRROR page
3. Click "Refresh" in Measure Section
4. Look for these logs:

**Success:**
```
[SemrushAPI] Using configured API key
[Serper] Using configured API key
✅ SEO metrics fetched: 65
✅ Competitors discovered: 15
```

**Missing Keys:**
```
[SemrushAPI] No API key configured, using demo data
[Serper] No API key configured, using mock data
```

---

## Cost Estimates

### Minimal Setup (Free Tier)
- Serper: FREE (2,500 searches/month)
- OpenRouter: $5-10/month
- **Total: $5-10/month**

### Full Intelligence (Paid)
- SEMrush: $119.95/month
- Serper: FREE
- OpenRouter: $10-20/month
- WeatherAPI: FREE
- News API: FREE
- **Total: ~$130-140/month**

---

## Testing Without APIs

### Demo Mode

The platform includes demo data that works without any API keys:

**What Works:**
- Brand Health Calculation ✅
- Customer Trigger Gallery ✅
- Archetype & Story ✅
- UI Components ✅

**What Shows Demo Data:**
- SEO metrics (shows example scores)
- Competitor analysis (shows 3 example competitors)
- Keyword opportunities (shows sample keywords)

**To Enable Demo Mode:**
```
VITE_USE_MOCK_DATA=true
```

---

## Troubleshooting

### "Invalid API Key" Error

**SEMrush:**
- Verify key is active in dashboard
- Check API quota hasn't been exceeded
- Ensure key has correct permissions

**Serper:**
- Confirm email verification complete
- Check monthly quota (2,500 free)
- Try regenerating key

### No Data Showing

1. Check `.env` file exists
2. Verify keys are uncommented (no `#` at start)
3. Restart dev server after adding keys
4. Check browser console for error messages
5. Click "Refresh" button in Measure Section

### API Quota Exceeded

**Symptoms:**
- "429 Too Many Requests" errors
- Data stops updating

**Solutions:**
- Wait for quota reset (usually monthly)
- Upgrade to paid tier
- Use demo mode temporarily

---

## Security Best Practices

1. **Never commit .env file**
   - Already in `.gitignore`
   - Always use `.env.example` for sharing

2. **Rotate keys regularly**
   - Change keys every 90 days
   - Rotate immediately if leaked

3. **Use environment-specific keys**
   - Development: Lower limits
   - Production: Full access

4. **Monitor usage**
   - Set up billing alerts
   - Track API calls
   - Review costs monthly

---

## Getting Help

**API Issues:**
- SEMrush: support@semrush.com
- Serper: https://serper.dev/contact
- OpenRouter: https://openrouter.ai/docs

**MARBA Issues:**
- Check console logs
- Review HONEST_GAP_ANALYSIS.md
- Create GitHub issue with logs
