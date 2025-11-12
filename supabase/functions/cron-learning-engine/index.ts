/**
 * Cron: Learning Engine
 * Runs daily at 4 AM UTC
 * Updates learning patterns based on performance data
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[cron-learning-engine] Starting learning engine...');

    const { data: brands } = await supabase
      .from('brands')
      .select('id, business_name')
      .eq('onboarding_completed', true);

    const results = {
      total_brands: brands?.length || 0,
      patterns_detected: 0,
      recommendations_generated: 0,
    };

    if (!brands || brands.length === 0) {
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    for (const brand of brands) {
      try {
        // Get content performance data (last 90 days)
        const { data: performanceData } = await supabase
          .from('content_calendar_items')
          .select('*, analytics_events(*)')
          .eq('brand_id', brand.id)
          .eq('status', 'published')
          .gte('published_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

        if (!performanceData || performanceData.length < 10) {
          console.log(`[cron-learning-engine] Not enough data for brand ${brand.business_name}`);
          continue;
        }

        // Detect patterns (simplified)
        const patterns = [];

        // Content format pattern
        const formatGroups: Record<string, any[]> = {};
        for (const item of performanceData) {
          const format = item.content_format || 'text';
          if (!formatGroups[format]) formatGroups[format] = [];
          formatGroups[format].push(item);
        }

        for (const [format, items] of Object.entries(formatGroups)) {
          const avgEngagement = items.reduce((sum, item) => {
            const likes = item.analytics_events?.[0]?.likes || 0;
            const impressions = item.analytics_events?.[0]?.impressions || 1;
            return sum + (likes / impressions) * 100;
          }, 0) / items.length;

          patterns.push({
            brand_id: brand.id,
            pattern_type: 'content',
            category: format,
            insight: `${format} content achieves ${avgEngagement.toFixed(1)}% average engagement`,
            data_points: items.length,
            confidence_score: items.length >= 30 ? 0.8 : 0.5,
            actionable_recommendation: `Create more ${format} content`,
            metadata: { avg_engagement: avgEngagement },
            updated_at: new Date().toISOString(),
          });
        }

        // Store patterns
        if (patterns.length > 0) {
          for (const pattern of patterns) {
            await supabase.from('learning_patterns').upsert(pattern, {
              onConflict: 'brand_id,pattern_type,category',
            });
          }
          results.patterns_detected += patterns.length;
        }

        results.recommendations_generated++;
      } catch (error) {
        console.error(`[cron-learning-engine] Error for brand ${brand.business_name}:`, error);
      }
    }

    console.log('[cron-learning-engine] Job completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[cron-learning-engine] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
