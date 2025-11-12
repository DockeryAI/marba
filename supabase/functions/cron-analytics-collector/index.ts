/**
 * Cron: Analytics Collector
 * Runs daily at 3 AM UTC
 * Collects and aggregates analytics data from platforms
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

    console.log('[cron-analytics-collector] Starting analytics collection...');

    const { data: brands } = await supabase
      .from('brands')
      .select('id, business_name')
      .eq('onboarding_completed', true);

    const results = {
      total_brands: brands?.length || 0,
      analytics_collected: 0,
      errors: [] as string[],
    };

    if (!brands || brands.length === 0) {
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    for (const brand of brands) {
      try {
        // Call the collect-analytics function
        const response = await fetch(`${supabaseUrl}/functions/v1/collect-analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            brandId: brand.id,
            dateRange: { start: yesterday, end: today },
            aggregationType: 'daily',
          }),
        });

        if (response.ok) {
          results.analytics_collected++;
        } else {
          throw new Error(`Analytics collection failed: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`[cron-analytics-collector] Error for brand ${brand.business_name}:`, error);
        results.errors.push(`${brand.business_name}: ${error.message}`);
      }
    }

    console.log('[cron-analytics-collector] Job completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[cron-analytics-collector] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
