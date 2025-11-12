# Background Jobs Setup Instructions

## Overview
MARBA uses 7 background jobs to automate intelligence gathering, analytics collection, and content publishing. These jobs run on Supabase using `pg_cron`.

## Status: READY TO CONFIGURE

All job code is written. You just need to run the SQL script in your Supabase dashboard.

---

## Quick Setup (5 Minutes)

### Step 1: Get Your Credentials
1. Open Supabase Dashboard
2. Go to **Settings > API**
3. Copy these values:
   - `Project URL`: `https://[YOUR_PROJECT_REF].supabase.co`
   - `anon/public key`: Long string starting with `eyJ...`

### Step 2: Update SQL Script
1. Open `supabase/migrations/configure_background_jobs.sql`
2. Replace all instances of:
   - `[YOUR_PROJECT_REF]` with your project ref (from URL)
   - `[YOUR_ANON_KEY]` with your anon key

### Step 3: Run SQL Script
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy/paste the ENTIRE contents of `configure_background_jobs.sql`
4. Click **Run**
5. Wait ~5 seconds for completion

### Step 4: Verify
Run this query to see all jobs:
```sql
SELECT jobname, schedule, active
FROM cron.job
WHERE jobname LIKE 'marba-%';
```

You should see 7 jobs:
- ✅ marba-brand-enrichment-daily
- ✅ marba-opportunity-detection-hourly
- ✅ marba-competitive-monitoring-6h
- ✅ marba-analytics-collection-daily
- ✅ marba-learning-engine-daily
- ✅ marba-auto-publisher-5min
- ✅ marba-engagement-collector-hourly

---

## Background Jobs Explained

| Job | Schedule | What It Does | Duration |
|-----|----------|--------------|----------|
| **Brand Enrichment** | Daily 2AM | Updates all brands with latest intelligence | 5-10 min |
| **Opportunity Detector** | Hourly | Finds weather/trends/news opportunities | 2-3 min |
| **Competitive Monitoring** | Every 6h | Monitors competitor changes | 5-7 min |
| **Analytics Collector** | Daily 3AM | Pulls metrics from social platforms | 10-15 min |
| **Learning Engine** | Daily 4AM | Analyzes content performance patterns | 5-8 min |
| **Auto Publisher** | Every 5min | Publishes scheduled content to platforms | 30 sec |
| **Engagement Collector** | Hourly :30 | Collects likes/comments/shares | 2-3 min |

---

## Manual Testing

To manually trigger a job (for testing):

```bash
curl -X POST 'https://[YOUR_PROJECT_REF].supabase.co/functions/v1/cron-opportunity-detector' \
  -H 'Authorization: Bearer [YOUR_ANON_KEY]' \
  -H 'Content-Type: application/json'
```

---

## Monitoring

### View Recent Job Runs
```sql
SELECT
  runid,
  jobid,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid IN (
  SELECT jobid FROM cron.job WHERE jobname LIKE 'marba-%'
)
ORDER BY start_time DESC
LIMIT 20;
```

### View Edge Function Logs
1. Go to **Edge Functions** in Supabase Dashboard
2. Click on any function (e.g., `cron-opportunity-detector`)
3. View **Logs** tab
4. Filter by time period

---

## Troubleshooting

### Jobs Not Running?
1. **Check if scheduled**:
   ```sql
   SELECT * FROM cron.job WHERE jobname LIKE 'marba-%';
   ```

2. **Check job history**:
   ```sql
   SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
   ```

3. **Verify edge functions are deployed**:
   - Go to **Edge Functions** in dashboard
   - Ensure all 7 functions are listed and deployed

### Jobs Failing?
1. Check edge function logs (Dashboard > Edge Functions > Logs)
2. Verify API keys are configured:
   - VITE_WEATHER_API_KEY
   - VITE_NEWS_API_KEY
   - VITE_GOOGLE_TRENDS_API_KEY
   - VITE_OPENROUTER_API_KEY
3. Check database tables exist (run migrations)

### Disable a Job
```sql
SELECT cron.unschedule('marba-job-name-here');
```

### Re-enable a Job
Re-run the relevant section from `configure_background_jobs.sql`

---

## Production Recommendations

### 1. Adjust Schedules
Current schedules are optimized for development. For production:
- **Opportunity Detector**: Consider every 30 minutes instead of hourly
- **Auto Publisher**: Keep at 5 minutes for timely publishing
- **Analytics Collector**: Keep daily (API rate limits)

### 2. Monitor Costs
- Each job execution costs compute time
- Most jobs take 2-10 minutes
- Estimated monthly cost: ~$5-10 on Supabase Pro plan

### 3. Set Up Alerts
Configure alerts in Supabase for:
- Job failures (> 3 consecutive failures)
- Long-running jobs (> 15 minutes)
- Edge function errors

---

## What's Next?

After background jobs are configured:
1. Let them run for 24 hours
2. Check job execution history
3. Verify data is being enriched:
   - `intelligence_opportunities` table should have new rows
   - `competitor_snapshots` table should update
   - `content_patterns` table should show learning
4. Monitor edge function logs for errors

---

## Support

If jobs aren't working:
1. Check Supabase Dashboard > Edge Functions > Logs
2. Check `cron.job_run_details` table
3. Verify all environment variables are set
4. Check that database migrations ran successfully

Everything is ready - just run the SQL script! 🚀
