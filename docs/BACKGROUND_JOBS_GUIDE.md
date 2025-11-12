# Background Jobs & Enrichment Engine Guide

## Overview

The Background Jobs and Enrichment Engine system provides automation, intelligence, and real-time updates for MARBA. This system runs scheduled jobs that enrich data, detect opportunities, monitor competitors, learn from performance, and automate publishing.

## Architecture

### Components

1. **Enrichment Services** (`src/services/enrichment/`)
   - EnrichmentEngine - Enriches MIRROR sections with AI insights
   - OpportunityDetection - Detects real-time marketing opportunities
   - CompetitiveMonitoring - Monitors competitor activity
   - LearningEngine - Learns from performance data
   - SignalDetection - Aggregates all intelligence signals

2. **Background Job Scheduler** (`src/services/background/`)
   - Manages job execution lifecycle
   - Monitors job health and status
   - Provides admin interface for job control

3. **Cron Edge Functions** (`supabase/functions/cron-*`)
   - 7 scheduled jobs running on Supabase Edge Functions
   - Triggered by pg_cron or Supabase Cron

## Background Jobs

### 1. Enrichment Scheduler
- **Schedule**: Daily at 2 AM UTC
- **Purpose**: Enriches all MIRROR sections for active brands
- **Function**: `cron-enrichment-scheduler`
- **What it does**:
  - Calls analyze-mirror for each section
  - Caches results with appropriate TTL
  - Provides AI insights, recommendations, benchmarks

### 2. Opportunity Detector
- **Schedule**: Hourly
- **Purpose**: Detects marketing opportunities in real-time
- **Function**: `cron-opportunity-detector`
- **Opportunity Types**:
  - Weather-based (rain, heat, cold)
  - Trending topics (Google Trends, social media)
  - Seasonal events (holidays, back-to-school)
  - Competitor activity
  - Local news events

### 3. Competitive Monitoring
- **Schedule**: Every 6 hours
- **Purpose**: Monitors competitor websites and social media
- **Function**: `cron-competitive-monitoring`
- **What it monitors**:
  - Website changes
  - Social media activity
  - Messaging shifts
  - New product launches
  - Pricing changes

### 4. Analytics Collector
- **Schedule**: Daily at 3 AM UTC
- **Purpose**: Collects and aggregates analytics data
- **Function**: `cron-analytics-collector`
- **What it collects**:
  - Platform metrics (likes, shares, comments)
  - Engagement rates
  - Follower growth
  - Click-through rates

### 5. Learning Engine
- **Schedule**: Daily at 4 AM UTC
- **Purpose**: Learns from performance to optimize future content
- **Function**: `cron-learning-engine`
- **Learning Areas**:
  - Best posting times per platform
  - Content formats that perform best
  - Topics that drive engagement
  - Power words that resonate
  - Hashtags that work

### 6. Auto Publisher
- **Schedule**: Every 5 minutes
- **Purpose**: Publishes scheduled content automatically
- **Function**: `cron-auto-publisher`
- **What it does**:
  - Checks for content scheduled for current time (±5 min window)
  - Publishes to configured platforms
  - Records success/failure events
  - Handles retry logic

### 7. Engagement Collector
- **Schedule**: Hourly
- **Purpose**: Collects comments, mentions, messages
- **Function**: `cron-engagement-collector`
- **What it collects**:
  - Comments on posts
  - Brand mentions
  - Direct messages
  - Reviews
  - Analyzes sentiment
  - Prioritizes responses

## Database Tables

### Core Tables

```sql
-- Background job tracking
background_jobs
job_executions
job_logs

-- Enrichment
enrichment_cache
enrichment_schedule
enrichment_logs

-- Intelligence
intelligence_opportunities
intelligence_signals
learning_patterns

-- Competitive
competitive_intelligence_snapshots
messaging_shifts
competitive_gaps
competitors

-- Publishing
publish_events

-- Engagement
engagement_inbox
```

## Usage Examples

### TypeScript/React

```typescript
import {
  EnrichmentEngine,
  OpportunityDetection,
  LearningEngine,
  BackgroundJobScheduler
} from '@/services/enrichment';

// Manually trigger enrichment
await EnrichmentEngine.enrichAllSections(brandId);

// Get opportunities
const opportunities = await OpportunityDetection.getAllOpportunities(brandId);

// Get learning recommendations
const recommendations = await LearningEngine.generateRecommendations(brandId);

// Check job status
const status = await BackgroundJobScheduler.getJobStatus('cron-enrichment-scheduler');

// Manually trigger a job
await BackgroundJobScheduler.triggerJob('cron-opportunity-detector');

// Pause a job
await BackgroundJobScheduler.pauseJob('cron-auto-publisher');
```

### Admin Dashboard

The BackgroundJobsMonitor component provides a visual interface for:
- Viewing all jobs and their status
- Monitoring job health
- Viewing execution history
- Reading job logs
- Manually triggering jobs
- Pausing/resuming jobs

```tsx
import { BackgroundJobsMonitor } from '@/components/admin/BackgroundJobsMonitor';

function AdminPage() {
  return <BackgroundJobsMonitor />;
}
```

## Cache Strategy

### Enrichment Cache TTLs

```typescript
const CACHE_TTL = {
  measure: 24 hours,    // Analytics data changes daily
  intend: 7 days,       // Objectives don't change often
  reimagine: 7 days,    // Strategy is stable
  reach: 3 days,        // Tactics evolve moderately
  optimize: 1 day,      // Performance data changes daily
  reflect: 6 hours,     // Real-time insights
};
```

### Cache Invalidation

Caches are automatically invalidated when:
- TTL expires
- User manually refreshes a section
- Relevant data changes (e.g., new analytics)
- Background job detects significant changes

## Opportunity Urgency Levels

```typescript
type OpportunityUrgency = 'critical' | 'high' | 'medium' | 'low';

// Critical: Expires < 4 hours (weather, breaking news)
// High: Expires < 24 hours (trends, viral moments)
// Medium: Expires < 7 days (seasonal events)
// Low: Expires > 7 days (general opportunities)
```

## Learning Engine Confidence

The Learning Engine calculates confidence based on data points:

```typescript
// 100+ data points: 0.9 confidence
// 30-100 data points: 0.7 confidence
// 10-30 data points: 0.5 confidence
// < 10 data points: 0.3 confidence
```

Only patterns with confidence > 0.5 generate recommendations.

## Setting Up Cron Jobs

### Option 1: Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard > Database > Cron Jobs
2. Enable pg_cron extension
3. Create cron jobs using the provided SQL

### Option 2: Manual SQL

```sql
-- Enable pg_cron (requires superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job
SELECT cron.schedule(
  'enrichment-scheduler',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/cron-enrichment-scheduler',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

### Option 3: Supabase Cron

Use Supabase's built-in cron feature (if available in your plan).

## Monitoring & Alerts

### Job Health Status

```typescript
type JobHealth = 'healthy' | 'degraded' | 'unhealthy';

// Healthy: Success rate > 90%, last run successful
// Degraded: Success rate 70-90% OR recent failures
// Unhealthy: Success rate < 70% OR job failed
```

### Monitoring Checklist

- [ ] All jobs showing as 'active'
- [ ] Health status is 'healthy'
- [ ] Success rate > 90%
- [ ] No jobs failing repeatedly
- [ ] Average duration is stable
- [ ] No error spikes in logs

## Error Handling

All jobs implement:
- **Automatic retry** (max 3 attempts)
- **Error logging** (stored in job_logs)
- **Graceful degradation** (continues with other brands if one fails)
- **Circuit breaker** (pauses job if failure rate too high)

## Rate Limiting

To avoid exceeding API limits:
- Enrichment calls are batched
- Delays between API calls
- Cost tracking for all AI operations
- Automatic throttling when approaching limits

## Cost Management

Track costs in the `api_billing_tracker`:
- Cost per enrichment operation
- Daily/monthly totals
- Budget alerts
- Per-brand cost breakdown

## Best Practices

1. **Monitor job health daily** - Check BackgroundJobsMonitor
2. **Review logs for errors** - Investigate failures promptly
3. **Optimize cache TTLs** - Balance freshness vs cost
4. **Clean up old data** - Use cleanupOldLogs() weekly
5. **Test before deploying** - Use manual triggers to test
6. **Set budget alerts** - Monitor AI API costs
7. **Review learning patterns** - Validate recommendations

## Troubleshooting

### Job Not Running

1. Check job status: `BackgroundJobScheduler.getJobStatus(jobName)`
2. Verify cron schedule is correct
3. Check job logs for errors
4. Ensure edge function is deployed
5. Verify Supabase service key is valid

### High Failure Rate

1. Review error logs
2. Check API rate limits
3. Verify database connections
4. Check for data issues
5. Pause job and investigate

### Slow Performance

1. Check average duration trends
2. Review database query performance
3. Optimize API calls (batching, caching)
4. Consider scaling resources
5. Review data volume

## Future Enhancements

- [ ] ML-based anomaly detection
- [ ] Predictive opportunity scoring
- [ ] Advanced competitor tracking
- [ ] Multi-language support
- [ ] Custom job scheduling
- [ ] Webhook integrations
- [ ] Real-time notifications
- [ ] A/B test automation

## Related Documentation

- [MIRROR Framework Guide](./MIRROR_FRAMEWORK.md)
- [Analytics Guide](./ANALYTICS_GUIDE.md)
- [Content Calendar Guide](./CONTENT_CALENDAR.md)
- [API Documentation](./API_DOCS.md)
