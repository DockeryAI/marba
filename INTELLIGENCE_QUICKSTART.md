# MARBA Intelligence System - Quick Start Guide

**Get the Intelligence System running in 15 minutes**

## Prerequisites

- Node.js 18+ installed
- Supabase project set up
- MARBA platform running locally or deployed

## Step 1: Install Dependencies (2 min)

No additional dependencies needed! Intelligence features use existing packages.

## Step 2: Configure Environment Variables (3 min)

Add these to your `.env` file:

```bash
# Weather API (Optional - works with mock data if not provided)
VITE_WEATHER_API_KEY=your_weatherapi_key_here

# Google Trends API (Optional - works with mock data if not provided)
VITE_GOOGLE_TRENDS_API_KEY=your_trends_api_key_here

# Supabase (Already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting API Keys

**WeatherAPI.com (Free tier: 1M calls/month)**
1. Go to https://www.weatherapi.com/signup.aspx
2. Sign up for free account
3. Copy API key from dashboard
4. Add to `.env` as `VITE_WEATHER_API_KEY`

**Google Trends (Optional)**
- Option 1: Use SerpAPI (https://serpapi.com/) - $50/month
- Option 2: Use unofficial Google Trends API
- Option 3: Skip - system works with mock data

## Step 3: Run Database Migration (2 min)

Apply the intelligence system migration:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard
# SQL Editor → New Query → Paste contents of:
# supabase/migrations/20251111000022_intelligence_system.sql
```

Verify tables created:
- `trending_topics`
- `competitor_activities`
- `competitive_positioning_analysis`
- `content_patterns`
- `content_posts`
- `intelligence_signals`
- `competitors`

## Step 4: Deploy Edge Functions (3 min)

Deploy the opportunity detection edge function:

```bash
# Deploy detect-opportunities function
supabase functions deploy detect-opportunities

# Set environment variables for edge function
supabase secrets set WEATHER_API_KEY=your_key_here
```

Test the function:
```bash
curl -i --location --request POST \
  'https://your-project.supabase.co/functions/v1/detect-opportunities' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"brandId":"test-brand","location":"San Francisco","industry":"hvac"}'
```

## Step 5: Add Intelligence Hub to Navigation (2 min)

Add the Intelligence Hub to your app navigation:

```tsx
// src/App.tsx or your routing file
import { IntelligenceHub } from '@/components/intelligence/IntelligenceHub'

// Add route
<Route path="/intelligence" element={
  <IntelligenceHub
    brandId={user.id}
    location="San Francisco, CA"
    industry="services"
    keywords={['marketing', 'business growth']}
    competitorIds={[]}
  />
} />
```

## Step 6: Test Intelligence Features (3 min)

### Test Weather Opportunities

```tsx
import { WeatherOpportunities } from '@/components/intelligence/WeatherOpportunities'

<WeatherOpportunities
  brandId="your-brand-id"
  location="San Francisco, CA"
  industry="HVAC"
  onCreateContent={(opp) => console.log('Create content for:', opp)}
/>
```

### Test Pattern Detection

```tsx
import { LearningPatterns } from '@/components/intelligence/LearningPatterns'

<LearningPatterns
  brandId="your-brand-id"
  platforms={['instagram', 'facebook']}
  onApplyPattern={(pattern) => console.log('Apply pattern:', pattern)}
/>
```

### Test Competitive Intel

```tsx
import { CompetitiveIntel } from '@/components/intelligence/CompetitiveIntel'

<CompetitiveIntel
  brandId="your-brand-id"
  competitorIds={['comp-1', 'comp-2']}
  ourMessaging="We help businesses grow"
  onApplySuggestion={(suggestion) => console.log('Apply:', suggestion)}
/>
```

## Verification Checklist

- [ ] Database tables created successfully
- [ ] Edge function deployed and responds
- [ ] Weather opportunities display (even with mock data)
- [ ] Trending topics load
- [ ] Learning patterns calculate (needs 20+ posts)
- [ ] Competitive intel displays
- [ ] Intelligence Hub renders with all tabs
- [ ] No console errors

## Quick Demo

To see intelligence in action immediately:

1. **Navigate to Intelligence Hub:** `/intelligence`
2. **View Overview Tab:** See aggregated opportunities
3. **Check Weather Tab:** Weather-based opportunities (mock data OK)
4. **Check Trends Tab:** Trending topics
5. **Check Patterns Tab:** Need historical posts (see seed data below)

## Seeding Test Data

To test pattern detection, seed some historical posts:

```sql
-- Insert test content posts
INSERT INTO content_posts (id, brand_id, platform, content_type, posted_at, caption, hashtags, engagement_rate, likes, comments, shares, reach, impressions)
SELECT
  'post_' || generate_series,
  'your-brand-id'::uuid,
  CASE (generate_series % 3)
    WHEN 0 THEN 'instagram'
    WHEN 1 THEN 'facebook'
    ELSE 'linkedin'
  END,
  CASE (generate_series % 4)
    WHEN 0 THEN 'carousel'
    WHEN 1 THEN 'single_image'
    WHEN 2 THEN 'video'
    ELSE 'reel'
  END,
  NOW() - (generate_series || ' days')::interval,
  'Sample post caption ' || generate_series,
  ARRAY['#business', '#marketing', '#growth'],
  CASE WHEN (generate_series % 4) = 0 THEN 8.5 ELSE 4.2 END + random() * 2,
  floor(random() * 200 + 100)::int,
  floor(random() * 30 + 10)::int,
  floor(random() * 15 + 5)::int,
  floor(random() * 2000 + 1000)::int,
  floor(random() * 3000 + 1500)::int
FROM generate_series(1, 50);
```

After seeding, refresh the Patterns tab to see detected patterns!

## Common Issues & Fixes

### Issue: "No opportunities detected"

**Fix:**
- Working with mock data is expected without API keys
- Add `VITE_WEATHER_API_KEY` for real weather data
- Check browser console for errors

### Issue: "Insufficient data for pattern detection"

**Fix:**
- Need minimum 20 posts in `content_posts` table
- Run seed data SQL above
- Wait for organic data to accumulate

### Issue: "Edge function not responding"

**Fix:**
```bash
# Check function logs
supabase functions logs detect-opportunities

# Redeploy
supabase functions deploy detect-opportunities --no-verify-jwt
```

### Issue: "Components not rendering"

**Fix:**
- Verify all imports are correct
- Check that shadcn/ui components are installed
- Run `npm install` to ensure dependencies

## Next Steps

After basic setup:

1. **Configure Real APIs:**
   - Add WeatherAPI key for live weather data
   - Add Google Trends access for real trends
   - Connect social media APIs for competitor monitoring

2. **Customize for Your Brand:**
   - Update location to your target market
   - Set accurate industry keywords
   - Add competitor profiles to database

3. **Integrate with Content Creation:**
   - Wire up `onCreateContent` callbacks
   - Connect to content calendar
   - Link to design studio

4. **Set Up Background Jobs:**
   - Schedule hourly opportunity detection
   - Daily pattern analysis
   - 6-hour competitive monitoring

5. **Monitor & Optimize:**
   - Track API usage and costs
   - Monitor confidence scores
   - Adjust thresholds based on accuracy

## Usage Examples

### Basic Intelligence Hub

```tsx
import { IntelligenceHub } from '@/components/intelligence/IntelligenceHub'

function IntelligencePage() {
  return (
    <IntelligenceHub
      brandId={currentUser.id}
      location="San Francisco, CA"
      industry="SaaS"
      keywords={['software', 'productivity', 'automation']}
      competitorIds={['competitor-1', 'competitor-2']}
      onCreateContent={(opportunity) => {
        // Navigate to content creator with opportunity context
        navigate('/content/create', { state: { opportunity } })
      }}
      onApplyPattern={(pattern) => {
        // Apply pattern to content strategy
        console.log('Applying pattern:', pattern)
      }}
      onApplySuggestion={(suggestion) => {
        // Apply competitive suggestion to UVP
        console.log('Applying suggestion:', suggestion)
      }}
    />
  )
}
```

### Individual Components

```tsx
// Just weather opportunities in a widget
<WeatherOpportunities
  brandId={user.id}
  location={user.business_location}
  industry={user.industry}
/>

// Just learning patterns in analytics page
<LearningPatterns
  brandId={user.id}
  platforms={user.connected_platforms}
/>

// Just trending topics in content ideation
<TrendingTopics
  brandId={user.id}
  industry={user.industry}
  keywords={user.target_keywords}
/>
```

### Programmatic Access

```typescript
// Detect opportunities programmatically
import { OpportunityDetector } from '@/services/intelligence/opportunity-detector'

const opportunities = await OpportunityDetector.detectOpportunities({
  brandId: 'brand-123',
  industry: 'HVAC',
  location: 'Phoenix, AZ',
  keywords: ['air conditioning', 'cooling'],
})

// Analyze patterns
import { PatternAnalyzerService } from '@/services/intelligence/pattern-analyzer'

const patterns = await PatternAnalyzerService.detectPatterns({
  brandId: 'brand-123',
  platforms: ['instagram'],
  minSampleSize: 25,
  confidenceThreshold: 0.8,
})

// Monitor competitors
import { CompetitiveIntelService } from '@/services/intelligence/competitive-intel'

const activities = await CompetitiveIntelService.monitorCompetitors({
  brandId: 'brand-123',
  competitorIds: ['comp-1', 'comp-2'],
  monitoringPlatforms: ['facebook', 'instagram'],
  industry: 'HVAC',
})
```

## Performance Tips

1. **Enable Caching:** Intelligence data is cached automatically
2. **Lazy Load:** Only load IntelligenceHub when needed
3. **Batch Updates:** Use background jobs for bulk detection
4. **Monitor Costs:** Track API usage in Supabase dashboard

## Getting Help

- **Documentation:** See INTELLIGENCE_SYSTEM_README.md for full details
- **API Docs:** Check individual service files for function signatures
- **Examples:** Review component props for usage examples
- **Logs:** Check browser console and Supabase logs

## Support

Having issues? Check:
1. Browser console for errors
2. Supabase logs for edge function errors
3. Network tab for failed API calls
4. Database tables for missing data

## Congratulations!

Your Intelligence System is now running. Start exploring:
- Navigate to `/intelligence`
- View detected opportunities
- Check learning patterns
- Monitor competitors
- Apply insights to content

For advanced configuration and customization, see INTELLIGENCE_SYSTEM_README.md.
