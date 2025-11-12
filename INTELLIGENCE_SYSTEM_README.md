# MARBA Intelligence System

**Last Updated:** 2025-11-11
**Version:** 1.0.0
**Phase 5 Complete**

## Overview

The MARBA Intelligence System is an AI-powered marketing intelligence platform that continuously monitors multiple data sources to detect opportunities, identify patterns, and provide actionable recommendations. It combines real-time signal detection with machine learning pattern analysis to give brands a competitive advantage.

## Architecture

### Components

The intelligence system consists of 5 major subsystems:

1. **Opportunity Detection Engine**
2. **Trend Analysis System**
3. **Competitive Intelligence Monitor**
4. **Learning Pattern Analyzer**
5. **Synapse Auto-Analysis**

### Data Flow

```
External APIs → Intelligence Signals → Opportunity Detection → Database Storage → UI Components
                                     ↓
                              Pattern Analysis
                                     ↓
                           Recommended Actions
```

## Features

### 1. Real-Time Opportunity Detection (TASK-99-103)

**Purpose:** Detect time-sensitive marketing opportunities from 5+ signal types.

**Signal Types:**
- **Weather-based alerts:** Temperature extremes, precipitation, forecasts
- **Trending topics:** Google Trends API integration, rising search volume
- **Competitor activity:** Social media monitoring, product launches, campaigns
- **Seasonal triggers:** Holiday seasons, industry-specific peak times
- **Local news:** Events, festivals, community happenings

**Key Features:**
- Multi-source signal aggregation
- Impact scoring (0-100)
- Urgency levels (critical, high, medium, low)
- Confidence scoring
- Automatic expiration handling
- Dismissal and snoozing

**Files:**
- `/src/services/intelligence/weather-alerts.ts` - Weather opportunity detection
- `/src/services/intelligence/trend-analyzer.ts` - Trending topic analysis
- `/src/services/intelligence/competitive-intel.ts` - Competitor monitoring
- `/src/services/intelligence/opportunity-detector.ts` - Main orchestrator
- `/src/components/intelligence/WeatherOpportunities.tsx` - Weather UI
- `/src/components/intelligence/TrendingTopics.tsx` - Trends UI

### 2. Synapse Auto-Analysis (TASK-117-125)

**Purpose:** Automatically analyze content and positioning using psychology scoring.

**Capabilities:**
- Competitor messaging scraping
- Real-time positioning scoring
- Psychology score comparison (our vs theirs)
- "Apply Suggestion" action buttons
- Auto-enrichment of UVP comparisons
- Competitive gap detection

**Analysis Dimensions:**
- Psychology score (0-100)
- Power words effectiveness
- Emotional triggers
- Cognitive load
- Persuasion elements
- Connection strength

**Files:**
- `/src/services/intelligence/synapse-auto-analyzer.ts` - Auto analysis engine
- `/src/services/intelligence/competitive-intel.ts` - Competitive analysis
- `/src/components/intelligence/CompetitiveIntel.tsx` - Competitive UI

### 3. Learning Engine (TASK-132-138)

**Purpose:** Detect what works from historical performance data using ML-style pattern analysis.

**Pattern Categories:**
- **Format patterns:** Carousel vs single image vs video performance
- **Timing patterns:** Best days of week, optimal posting hours
- **Hashtag patterns:** Most effective hashtags for reach/engagement
- **Length patterns:** Optimal caption length ranges
- **Topic patterns:** Content themes that resonate
- **Tone patterns:** Messaging style effectiveness

**Visualization:**
- Pattern detection UI widgets
- Confidence scoring visualization (0-100%)
- Statistical significance indicators
- Auto-adjustment recommendations
- Historical pattern charts
- Success factor breakdown
- Evidence examples from top posts

**Files:**
- `/src/services/intelligence/pattern-analyzer.ts` - Pattern detection
- `/src/services/intelligence/learning-engine.ts` - Learning orchestrator
- `/src/components/intelligence/LearningPatterns.tsx` - Pattern visualization UI

### 4. Intelligence Hub

**Purpose:** Main orchestrator page that brings all intelligence features together.

**Sections:**
- **Overview:** High-level stats, top priorities
- **Weather:** Weather-based opportunities
- **Trends:** Trending topics and keywords
- **Competitive:** Competitor activity and positioning
- **Patterns:** Learning patterns from performance
- **All Opportunities:** Comprehensive opportunity list

**Features:**
- Unified interface for all intelligence
- Tab-based navigation
- Refresh all sources
- Filter and search
- Priority ordering
- Quick actions

**Files:**
- `/src/components/intelligence/IntelligenceHub.tsx` - Main hub component
- `/src/components/intelligence/OpportunityDashboard.tsx` - Opportunity feed

## Database Schema

### Tables

#### `trending_topics`
Stores detected trending topics from Google Trends.

```sql
- id: TEXT PRIMARY KEY
- keyword: TEXT NOT NULL
- category: TEXT NOT NULL
- growth_rate: INTEGER
- search_volume: INTEGER
- related_queries: TEXT[]
- trending_duration: TEXT
- peak_interest: TEXT
- relevance_to_brand: INTEGER
- content_angles: TEXT[]
- detected_at: TIMESTAMPTZ
```

#### `competitor_activities`
Tracks competitor activities across platforms.

```sql
- id: TEXT PRIMARY KEY
- competitor_id: TEXT NOT NULL
- competitor_name: TEXT NOT NULL
- activity_type: TEXT (product_launch, campaign, etc.)
- description: TEXT
- platform: TEXT
- engagement_metrics: JSONB
- sentiment: TEXT
- threat_level: TEXT (low, medium, high, critical)
- opportunity_level: TEXT
- recommended_response: TEXT[]
- detected_at: TIMESTAMPTZ
```

#### `competitive_positioning_analysis`
Synapse-powered competitive analysis.

```sql
- id: TEXT PRIMARY KEY
- brand_id: UUID REFERENCES profiles
- competitor_id: TEXT
- our_messaging: TEXT
- their_messaging: TEXT
- psychology_comparison: JSONB
- positioning_gaps: JSONB
- strengths: TEXT[]
- weaknesses: TEXT[]
- recommended_pivots: JSONB
```

#### `content_patterns`
ML-detected patterns from content performance.

```sql
- id: TEXT PRIMARY KEY
- brand_id: UUID REFERENCES profiles
- pattern_category: TEXT (format, timing, topic, hashtag, length)
- title: TEXT
- description: TEXT
- discovered_from: JSONB
- performance_metrics: JSONB
- confidence_score: DECIMAL(3,2)
- statistical_significance: DECIMAL(3,2)
- actionable_insights: TEXT[]
- implementation_guide: TEXT[]
- evidence_examples: JSONB
```

#### `content_posts`
Historical content posts for analysis.

```sql
- id: TEXT PRIMARY KEY
- brand_id: UUID REFERENCES profiles
- platform: TEXT
- content_type: TEXT (carousel, single_image, video, reel, story, text)
- posted_at: TIMESTAMPTZ
- caption: TEXT
- hashtags: TEXT[]
- engagement_rate: DECIMAL(5,2)
- likes, comments, shares, reach, impressions: INTEGER
```

#### `intelligence_signals`
Raw intelligence signals before processing.

```sql
- id: TEXT PRIMARY KEY
- signal_type: TEXT (weather, trend, competitive, seasonal, news)
- source: TEXT
- raw_data: JSONB
- processed: BOOLEAN
- opportunities_generated: INTEGER
- detected_at: TIMESTAMPTZ
```

#### `competitors`
Competitor profiles for monitoring.

```sql
- id: TEXT PRIMARY KEY
- brand_id: UUID REFERENCES profiles
- name: TEXT
- website: TEXT
- social_handles: JSONB
- industry: TEXT
```

### Migration

Run migration: `/supabase/migrations/20251111000022_intelligence_system.sql`

## API Integration

### External APIs Required

1. **Weather API** (WeatherAPI.com or OpenWeatherMap)
   - Purpose: Real-time weather data and forecasts
   - Frequency: Every 30 minutes
   - Cache TTL: 30 minutes
   - Env var: `VITE_WEATHER_API_KEY`

2. **Google Trends API** (SerpAPI or unofficial API)
   - Purpose: Trending search topics and volume
   - Frequency: Every 1 hour
   - Cache TTL: 1 hour
   - Env var: `VITE_GOOGLE_TRENDS_API_KEY`

3. **Social Media APIs** (Facebook, Instagram, LinkedIn, Twitter)
   - Purpose: Competitor activity monitoring
   - Frequency: Every 6 hours
   - Cache TTL: 6 hours
   - Platform-specific API keys required

### Supabase Edge Functions

#### `detect-opportunities`
Main opportunity detection function.

**Endpoint:** `/functions/v1/detect-opportunities`

**Request:**
```json
{
  "brandId": "uuid",
  "location": "San Francisco, CA",
  "industry": "HVAC",
  "keywords": ["air conditioning", "heating"],
  "competitorIds": ["comp_1", "comp_2"]
}
```

**Response:**
```json
{
  "opportunities": [
    {
      "id": "weather_heat_123",
      "type": "weather_based",
      "title": "Heat Wave Alert",
      "impact_score": 85,
      "urgency": "high",
      "confidence": 0.9,
      "suggested_actions": [...]
    }
  ]
}
```

## Caching Strategy

### Cache TTLs
- Weather data: 30 minutes
- Trending topics: 1 hour
- Competitor activity: 6 hours
- Pattern analysis: 24 hours
- Synapse analysis: 7 days

### Storage
- LocalStorage for client-side caching
- Supabase tables for persistent storage
- Redis for high-frequency data (future)

## Confidence & Scoring

### Impact Score Calculation
```
impact_score = (relevance * 0.4) + (reach * 0.3) + (timeliness * 0.2) + (confidence * 0.1)
```

### Urgency Levels
- **Critical:** Action needed within 24 hours
- **High:** Action needed within 72 hours
- **Medium:** Action needed within 1 week
- **Low:** Action needed within 2 weeks

### Confidence Scoring
Based on:
- Sample size (number of data points)
- Statistical significance
- Data source reliability
- Historical accuracy

## Usage Examples

### Detecting Opportunities

```typescript
import { WeatherAlertsService } from '@/services/intelligence/weather-alerts'

const opportunities = await WeatherAlertsService.detectWeatherOpportunities({
  brandId: 'brand-123',
  location: 'San Francisco, CA',
  industry: 'HVAC',
})
```

### Analyzing Patterns

```typescript
import { PatternAnalyzerService } from '@/services/intelligence/pattern-analyzer'

const patterns = await PatternAnalyzerService.detectPatterns({
  brandId: 'brand-123',
  platforms: ['instagram', 'facebook'],
  minSampleSize: 20,
  confidenceThreshold: 0.75,
})
```

### Competitive Analysis

```typescript
import { CompetitiveIntelService } from '@/services/intelligence/competitive-intel'

const analysis = await CompetitiveIntelService.analyzePositioning(
  'brand-123',
  'competitor-456',
  'Our messaging here',
  'Their messaging here'
)
```

### Using Intelligence Hub

```tsx
import { IntelligenceHub } from '@/components/intelligence/IntelligenceHub'

<IntelligenceHub
  brandId={brandId}
  location="San Francisco, CA"
  industry="HVAC"
  keywords={['air conditioning', 'heating']}
  competitorIds={['comp-1', 'comp-2']}
  onCreateContent={(opp) => handleCreateContent(opp)}
  onApplyPattern={(pattern) => handleApplyPattern(pattern)}
/>
```

## Performance Optimization

### Best Practices
1. Use caching aggressively (30min - 24hr TTLs)
2. Batch API calls when possible
3. Lazy load intelligence components
4. Implement optimistic UI updates
5. Use background jobs for heavy processing

### Monitoring
- Track API call volume and costs
- Monitor cache hit rates
- Log confidence scores and accuracy
- Alert on API failures

## Testing

### Unit Tests
- Service layer functions
- Impact score calculations
- Pattern detection algorithms
- Confidence scoring

### Integration Tests
- API integrations (with mocks)
- Database operations
- Edge function execution

### Manual QA
- Opportunity accuracy
- Pattern relevance
- UI responsiveness
- Error handling

## Future Enhancements

### Phase 6 Additions
1. **Reddit Discussion Detection** - Monitor subreddits for brand mentions
2. **Review Platform Integration** - Yelp, Google Reviews sentiment
3. **Industry News Monitoring** - RSS feeds, news APIs
4. **Audience Behavior Signals** - Website analytics, engagement shifts
5. **Platform Algorithm Updates** - Track social media algorithm changes

### Advanced Features
- Multi-brand intelligence comparison
- Industry benchmarking
- Predictive opportunity forecasting
- Automated A/B testing recommendations
- Custom signal creation

## Troubleshooting

### Common Issues

**No opportunities detected:**
- Check API keys are configured
- Verify location and industry parameters
- Ensure sufficient historical data exists

**Low confidence scores:**
- Increase sample size (more historical posts)
- Wait for more data collection
- Adjust confidence threshold

**Pattern detection failing:**
- Need minimum 20 posts for analysis
- Ensure posts have complete metadata
- Check date range (90 days recommended)

**API rate limits:**
- Implement exponential backoff
- Increase cache TTLs
- Batch requests where possible

## Support

For questions or issues with the Intelligence System:
- Review this documentation
- Check INTELLIGENCE_QUICKSTART.md for setup
- Review service logs in Supabase
- Check browser console for client errors

## License

MARBA Intelligence System © 2025 MARBA.ai
