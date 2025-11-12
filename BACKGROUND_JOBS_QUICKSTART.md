# Background Jobs & Enrichment Engine - Quick Start Guide

## 5-Minute Setup

### 1. Run the Migration

```bash
# Apply the database schema
supabase db push

# Or manually run:
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20251111000020_background_jobs_cron.sql
```

### 2. Deploy Edge Functions

```bash
# Deploy all cron functions
supabase functions deploy cron-enrichment-scheduler
supabase functions deploy cron-opportunity-detector
supabase functions deploy cron-competitive-monitoring
supabase functions deploy cron-analytics-collector
supabase functions deploy cron-learning-engine
supabase functions deploy cron-auto-publisher
supabase functions deploy cron-engagement-collector

# Or deploy all at once
for func in cron-*; do
  supabase functions deploy $func
done
```

### 3. Set Up Cron Jobs

**Option A: Supabase Dashboard**
1. Go to Database > Cron Jobs
2. Enable pg_cron
3. Add each job using the schedule

**Option B: SQL (requires superuser)**
```sql
-- Enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Add jobs (replace YOUR_PROJECT_URL and YOUR_SERVICE_KEY)
SELECT cron.schedule('enrichment-scheduler', '0 2 * * *',
  $$SELECT net.http_post('https://YOUR_PROJECT_URL/functions/v1/cron-enrichment-scheduler',
  '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb)$$);

SELECT cron.schedule('opportunity-detector', '0 * * * *',
  $$SELECT net.http_post('https://YOUR_PROJECT_URL/functions/v1/cron-opportunity-detector',
  '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb)$$);

-- Repeat for other jobs...
```

### 4. Test Jobs Manually

```typescript
import { BackgroundJobScheduler } from '@/services/background/job-scheduler';

// Test enrichment
await BackgroundJobScheduler.triggerJob('cron-enrichment-scheduler');

// Check status
const status = await BackgroundJobScheduler.getJobStatus('cron-enrichment-scheduler');
console.log(status);
```

### 5. Monitor Jobs

```tsx
import { BackgroundJobsMonitor } from '@/components/admin/BackgroundJobsMonitor';

// Add to your admin page
<BackgroundJobsMonitor />
```

---

## Common Tasks

### Get Enrichment for a Brand

```typescript
import { EnrichmentEngine } from '@/services/enrichment';

// Get all sections
const results = await EnrichmentEngine.enrichAllSections(brandId);

// Get specific section
const measure = await EnrichmentEngine.enrichMeasure(brandId);

// Force refresh (bypass cache)
const fresh = await EnrichmentEngine.enrichSection(brandId, 'measure', { forceRefresh: true });
```

### Get Opportunities

```typescript
import { OpportunityDetection } from '@/services/enrichment';

// Get all opportunities
const opportunities = await OpportunityDetection.getAllOpportunities(brandId);

// Filter by urgency
const urgent = opportunities.filter(o => o.urgency === 'critical');

// Store opportunities
await OpportunityDetection.storeOpportunities(brandId, opportunities);
```

### Get Learning Recommendations

```typescript
import { LearningEngine } from '@/services/enrichment';

// Detect patterns
await LearningEngine.detectContentPatterns(brandId);
await LearningEngine.detectTimingPatterns(brandId);

// Get recommendations
const recs = await LearningEngine.generateRecommendations(brandId);
```

### Monitor Competitors

```typescript
import { CompetitiveMonitoring } from '@/services/enrichment';

// Monitor changes
await CompetitiveMonitoring.monitorWebsiteChanges(brandId);

// Detect messaging shifts
const shifts = await CompetitiveMonitoring.detectMessagingShifts(brandId);

// Get gap analysis
const gaps = await CompetitiveMonitoring.analyzeCompetitiveGaps(brandId);
```

### Get Intelligence Signals

```typescript
import { SignalDetection } from '@/services/enrichment';

// Get all signals
const signals = await SignalDetection.detectAllSignals(brandId);

// Get active signals
const active = await SignalDetection.getActiveSignals(brandId);

// Dismiss a signal
await SignalDetection.dismissSignal(signalId);
```

---

## Cron Schedules Reference

| Job | Schedule | Cron Expression | Runs |
|-----|----------|----------------|------|
| Enrichment Scheduler | Daily 2 AM UTC | `0 2 * * *` | 1x/day |
| Opportunity Detector | Hourly | `0 * * * *` | 24x/day |
| Competitive Monitoring | Every 6 hours | `0 */6 * * *` | 4x/day |
| Analytics Collector | Daily 3 AM UTC | `0 3 * * *` | 1x/day |
| Learning Engine | Daily 4 AM UTC | `0 4 * * *` | 1x/day |
| Auto Publisher | Every 5 minutes | `*/5 * * * *` | 288x/day |
| Engagement Collector | Hourly | `0 * * * *` | 24x/day |

---

## Cache TTLs

| Section | TTL | Reasoning |
|---------|-----|-----------|
| Measure | 24 hours | Analytics update daily |
| Intend | 7 days | Objectives rarely change |
| Reimagine | 7 days | Strategy is stable |
| Reach | 3 days | Tactics evolve moderately |
| Optimize | 1 day | Performance changes daily |
| Reflect | 6 hours | Real-time insights |

---

## Troubleshooting

### Job Not Running

```typescript
// Check status
const status = await BackgroundJobScheduler.getJobStatus('job-name');
console.log(status);

// Check logs
const logs = await BackgroundJobScheduler.getJobLogs('job-name', { limit: 20 });
console.log(logs);

// Manually trigger
await BackgroundJobScheduler.triggerJob('job-name');
```

### High Failure Rate

```typescript
// Get stats
const stats = await BackgroundJobScheduler.getJobStats('job-name');
if (stats.success_rate < 70) {
  // Pause job for investigation
  await BackgroundJobScheduler.pauseJob('job-name');
}

// View error logs
const errors = await BackgroundJobScheduler.getJobLogs('job-name', {
  level: 'error',
  limit: 50
});
```

### Cache Issues

```typescript
import { EnrichmentEngine } from '@/services/enrichment';

// Clear cache for section
await EnrichmentEngine.invalidateCache(brandId, 'measure');

// Clear all caches
await EnrichmentEngine.invalidateCache(brandId);

// Get cache status
const status = await EnrichmentEngine.getEnrichmentStatus(brandId);
console.log(status);
```

---

## Health Check

```bash
# Check job health via API
curl https://your-project.supabase.co/functions/v1/job-health \
  -H "Authorization: Bearer YOUR_KEY"

# Or in TypeScript
const jobs = await BackgroundJobScheduler.getAllJobs();
jobs.forEach(job => {
  console.log(`${job.name}: ${job.status} (${job.last_run_status})`);
});
```

---

## Key Metrics to Monitor

1. **Job Success Rate**: Should be > 90%
2. **Cache Hit Rate**: Should be 70-90%
3. **Average Duration**: Should be stable
4. **Last 24h Executions**: Should match schedule
5. **Error Count**: Should be minimal

---

## Quick Links

- [Full Documentation](./docs/BACKGROUND_JOBS_GUIDE.md)
- [Completion Summary](./PHASE_15_COMPLETION_SUMMARY.md)
- [Type Definitions](./src/types/enrichment.types.ts)
- [Admin Dashboard](./src/components/admin/BackgroundJobsMonitor.tsx)

---

**Need Help?** Check the full guide: `docs/BACKGROUND_JOBS_GUIDE.md`
