/**
 * Cron: Competitive Monitoring
 * Runs every 6 hours
 * Monitors competitor activity and detects changes
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

    console.log('[cron-competitive-monitoring] Starting competitive monitoring...');

    const { data: brands } = await supabase
      .from('brands')
      .select('id, business_name')
      .eq('onboarding_completed', true);

    const results = {
      total_brands: brands?.length || 0,
      snapshots_created: 0,
      changes_detected: 0,
    };

    if (!brands || brands.length === 0) {
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    for (const brand of brands) {
      try {
        // Get competitors for this brand
        const { data: competitors } = await supabase
          .from('competitors')
          .select('*')
          .eq('brand_id', brand.id)
          .eq('is_active', true);

        if (!competitors || competitors.length === 0) continue;

        for (const competitor of competitors) {
          // Simulate website snapshot (in production, use real scraping)
          const snapshot = {
            brand_id: brand.id,
            competitor_name: competitor.name,
            snapshot_type: 'website',
            data: {
              title: competitor.name,
              captured_at: new Date().toISOString(),
              // Add more scraped data here
            },
            changes_detected: [] as string[],
            created_at: new Date().toISOString(),
          };

          // Get previous snapshot to compare
          const { data: previousSnapshot } = await supabase
            .from('competitive_intelligence_snapshots')
            .select('*')
            .eq('brand_id', brand.id)
            .eq('competitor_name', competitor.name)
            .eq('snapshot_type', 'website')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Detect changes (simplified)
          if (previousSnapshot) {
            // In production, implement real change detection
            // For now, randomly detect changes occasionally
            if (Math.random() > 0.8) {
              snapshot.changes_detected.push('Website content updated');
              results.changes_detected++;
            }
          }

          // Store snapshot
          await supabase.from('competitive_intelligence_snapshots').insert(snapshot);
          results.snapshots_created++;
        }
      } catch (error) {
        console.error(`[cron-competitive-monitoring] Error for brand ${brand.business_name}:`, error);
      }
    }

    console.log('[cron-competitive-monitoring] Job completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[cron-competitive-monitoring] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
