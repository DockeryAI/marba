/**
 * Deno Edge Function: Collect Analytics
 *
 * Aggregates and processes analytics data from:
 * - API billing events
 * - Platform metrics
 * - Content performance
 * - User engagement
 *
 * Calculates and stores:
 * - Cost metrics and trends
 * - Usage patterns
 * - Performance insights
 * - ROI calculations
 *
 * @module collect-analytics
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  brandId: string;
  dateRange?: {
    start: string;
    end: string;
  };
  aggregationType?: 'daily' | 'weekly' | 'monthly';
  metricsToCollect?: string[]; // ['api_costs', 'content_performance', 'engagement']
}

interface MetricsSummary {
  totalCost: number;
  totalRequests: number;
  totalTokens: number;
  averageResponseTime: number;
  errorRate: number;
  byFeature: Record<string, any>;
  byProvider: Record<string, any>;
  trends: any[];
}

/**
 * Main request handler
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      brandId,
      dateRange,
      aggregationType = 'daily',
      metricsToCollect = ['api_costs', 'content_performance', 'engagement'],
    } = await req.json() as AnalyticsRequest;

    if (!brandId) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: brandId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set default date range (last 30 days)
    const endDate = dateRange?.end || new Date().toISOString();
    const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const analytics: any = {
      brandId,
      dateRange: { start: startDate, end: endDate },
      collectedAt: new Date().toISOString(),
    };

    // Collect API costs analytics
    if (metricsToCollect.includes('api_costs')) {
      analytics.apiCosts = await collectApiCostsAnalytics(
        supabase,
        brandId,
        startDate,
        endDate
      );
    }

    // Collect content performance analytics
    if (metricsToCollect.includes('content_performance')) {
      analytics.contentPerformance = await collectContentPerformanceAnalytics(
        supabase,
        brandId,
        startDate,
        endDate
      );
    }

    // Collect engagement analytics
    if (metricsToCollect.includes('engagement')) {
      analytics.engagement = await collectEngagementAnalytics(
        supabase,
        brandId,
        startDate,
        endDate
      );
    }

    // Store aggregated analytics
    await storeAggregatedAnalytics(
      supabase,
      brandId,
      aggregationType,
      analytics
    );

    const responseTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        ...analytics,
        metadata: {
          responseTimeMs: responseTime,
          aggregationType,
          metricsCollected: metricsToCollect,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Analytics collection error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Collect and aggregate API costs analytics
 */
async function collectApiCostsAnalytics(
  supabase: any,
  brandId: string,
  startDate: string,
  endDate: string
): Promise<MetricsSummary> {
  // Fetch billing events for the date range
  const { data: billingEvents, error } = await supabase
    .from('api_billing_events')
    .select('*')
    .eq('brand_id', brandId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching billing events:', error);
    return getEmptyMetricsSummary();
  }

  if (!billingEvents || billingEvents.length === 0) {
    return getEmptyMetricsSummary();
  }

  // Calculate aggregate metrics
  const totalCost = billingEvents.reduce((sum: number, event: any) => sum + (event.cost_total || 0), 0);
  const totalRequests = billingEvents.length;
  const totalTokens = billingEvents.reduce((sum: number, event: any) => sum + (event.tokens_total || 0), 0);
  const avgResponseTime = billingEvents.reduce((sum: number, event: any) => sum + (event.response_time_ms || 0), 0) / totalRequests;
  const errorCount = billingEvents.filter((event: any) => event.status === 'error').length;
  const errorRate = (errorCount / totalRequests) * 100;

  // Group by feature
  const byFeature: Record<string, any> = {};
  for (const event of billingEvents) {
    const feature = event.feature_name;
    if (!byFeature[feature]) {
      byFeature[feature] = {
        count: 0,
        cost: 0,
        tokens: 0,
        avgResponseTime: 0,
      };
    }
    byFeature[feature].count++;
    byFeature[feature].cost += event.cost_total || 0;
    byFeature[feature].tokens += event.tokens_total || 0;
    byFeature[feature].avgResponseTime += event.response_time_ms || 0;
  }

  // Calculate averages
  for (const feature in byFeature) {
    byFeature[feature].avgResponseTime /= byFeature[feature].count;
  }

  // Group by provider
  const byProvider: Record<string, any> = {};
  for (const event of billingEvents) {
    const provider = event.provider;
    if (!byProvider[provider]) {
      byProvider[provider] = { count: 0, cost: 0, tokens: 0 };
    }
    byProvider[provider].count++;
    byProvider[provider].cost += event.cost_total || 0;
    byProvider[provider].tokens += event.tokens_total || 0;
  }

  // Calculate daily trends
  const trends = calculateDailyTrends(billingEvents);

  return {
    totalCost,
    totalRequests,
    totalTokens,
    averageResponseTime: avgResponseTime,
    errorRate,
    byFeature,
    byProvider,
    trends,
  };
}

/**
 * Collect content performance analytics
 */
async function collectContentPerformanceAnalytics(
  supabase: any,
  brandId: string,
  startDate: string,
  endDate: string
) {
  // Fetch content calendar items
  const { data: contentItems } = await supabase
    .from('content_calendar_items')
    .select('*')
    .eq('brand_id', brandId)
    .gte('scheduled_for', startDate)
    .lte('scheduled_for', endDate);

  if (!contentItems || contentItems.length === 0) {
    return {
      totalContent: 0,
      published: 0,
      scheduled: 0,
      draft: 0,
      byPlatform: {},
      byStatus: {},
    };
  }

  const totalContent = contentItems.length;
  const published = contentItems.filter((item: any) => item.status === 'published').length;
  const scheduled = contentItems.filter((item: any) => item.status === 'scheduled').length;
  const draft = contentItems.filter((item: any) => item.status === 'draft').length;

  // Group by platform
  const byPlatform: Record<string, number> = {};
  for (const item of contentItems) {
    const platform = item.platform;
    byPlatform[platform] = (byPlatform[platform] || 0) + 1;
  }

  // Group by status
  const byStatus: Record<string, number> = {};
  for (const item of contentItems) {
    const status = item.status;
    byStatus[status] = (byStatus[status] || 0) + 1;
  }

  return {
    totalContent,
    published,
    scheduled,
    draft,
    byPlatform,
    byStatus,
  };
}

/**
 * Collect engagement analytics
 */
async function collectEngagementAnalytics(
  supabase: any,
  brandId: string,
  startDate: string,
  endDate: string
) {
  // Fetch engagement inbox items
  const { data: engagementItems } = await supabase
    .from('engagement_inbox')
    .select('*')
    .eq('brand_id', brandId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (!engagementItems || engagementItems.length === 0) {
    return {
      totalEngagements: 0,
      byType: {},
      byStatus: {},
      responseRate: 0,
    };
  }

  const totalEngagements = engagementItems.length;
  const responded = engagementItems.filter((item: any) => item.status === 'responded').length;
  const responseRate = (responded / totalEngagements) * 100;

  // Group by type
  const byType: Record<string, number> = {};
  for (const item of engagementItems) {
    const type = item.type;
    byType[type] = (byType[type] || 0) + 1;
  }

  // Group by status
  const byStatus: Record<string, number> = {};
  for (const item of engagementItems) {
    const status = item.status;
    byStatus[status] = (byStatus[status] || 0) + 1;
  }

  return {
    totalEngagements,
    byType,
    byStatus,
    responseRate,
  };
}

/**
 * Calculate daily trends from billing events
 */
function calculateDailyTrends(events: any[]): any[] {
  const dailyData: Record<string, any> = {};

  for (const event of events) {
    const date = new Date(event.created_at).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        cost: 0,
        requests: 0,
        tokens: 0,
        errors: 0,
      };
    }
    dailyData[date].cost += event.cost_total || 0;
    dailyData[date].requests++;
    dailyData[date].tokens += event.tokens_total || 0;
    if (event.status === 'error') {
      dailyData[date].errors++;
    }
  }

  return Object.values(dailyData).sort((a: any, b: any) => a.date.localeCompare(b.date));
}

/**
 * Store aggregated analytics in database
 */
async function storeAggregatedAnalytics(
  supabase: any,
  brandId: string,
  aggregationType: string,
  analytics: any
) {
  try {
    // Store in api_cost_aggregations table
    if (analytics.apiCosts) {
      const { error } = await supabase
        .from('api_cost_aggregations')
        .insert({
          brand_id: brandId,
          period_start: analytics.dateRange.start,
          period_end: analytics.dateRange.end,
          aggregation_type: aggregationType,
          total_cost: analytics.apiCosts.totalCost,
          total_requests: analytics.apiCosts.totalRequests,
          total_tokens: analytics.apiCosts.totalTokens,
          by_feature: analytics.apiCosts.byFeature,
          by_provider: analytics.apiCosts.byProvider,
          trends: analytics.apiCosts.trends,
        });

      if (error) {
        console.error('Error storing cost aggregations:', error);
      }
    }

    // Store in analytics_events table for general metrics
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        brand_id: brandId,
        event_type: 'analytics_collection',
        event_data: {
          contentPerformance: analytics.contentPerformance,
          engagement: analytics.engagement,
        },
        source: 'collect_analytics_function',
      });

    if (analyticsError) {
      console.error('Error storing analytics events:', analyticsError);
    }
  } catch (e) {
    console.error('Error in storeAggregatedAnalytics:', e);
  }
}

/**
 * Get empty metrics summary
 */
function getEmptyMetricsSummary(): MetricsSummary {
  return {
    totalCost: 0,
    totalRequests: 0,
    totalTokens: 0,
    averageResponseTime: 0,
    errorRate: 0,
    byFeature: {},
    byProvider: {},
    trends: [],
  };
}
