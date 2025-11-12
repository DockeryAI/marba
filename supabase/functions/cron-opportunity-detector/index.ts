/**
 * Cron: Opportunity Detector
 * Runs hourly
 * Detects new marketing opportunities for all active brands
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

    console.log('[cron-opportunity-detector] Starting opportunity detection...');

    // Get all active brands
    const { data: brands } = await supabase
      .from('brands')
      .select('id, business_name, industry, location')
      .eq('onboarding_completed', true);

    const results = {
      total_brands: brands?.length || 0,
      opportunities_detected: 0,
      opportunities_by_type: {} as Record<string, number>,
    };

    if (!brands || brands.length === 0) {
      console.log('[cron-opportunity-detector] No active brands found');
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    for (const brand of brands) {
      try {
        // Detect different types of opportunities
        const opportunities: any[] = [];

        // 1. Weather-based (simulated)
        if (brand.location) {
          opportunities.push({
            id: crypto.randomUUID(),
            brand_id: brand.id,
            type: 'weather',
            title: 'Weather-based Marketing Opportunity',
            description: 'Current weather conditions present marketing opportunity',
            urgency: 'medium',
            expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            action_items: ['Create weather-related content', 'Adjust messaging'],
            context: { location: brand.location },
            confidence_score: 0.7,
            detected_at: new Date().toISOString(),
            source: 'weather_monitoring',
          });
        }

        // 2. Seasonal opportunities
        const month = new Date().getMonth();
        if (month === 11) { // December - holiday season
          opportunities.push({
            id: crypto.randomUUID(),
            brand_id: brand.id,
            type: 'seasonal',
            title: 'Holiday Season Marketing',
            description: 'Holiday shopping season in full swing',
            urgency: 'high',
            expires_at: new Date('2024-12-31').toISOString(),
            action_items: ['Create holiday campaigns', 'Offer seasonal promotions'],
            context: { season: 'winter_holidays' },
            confidence_score: 0.95,
            detected_at: new Date().toISOString(),
            source: 'seasonal_calendar',
          });
        }

        // Store opportunities
        if (opportunities.length > 0) {
          await supabase.from('intelligence_opportunities').insert(opportunities);
          results.opportunities_detected += opportunities.length;

          // Count by type
          for (const opp of opportunities) {
            results.opportunities_by_type[opp.type] =
              (results.opportunities_by_type[opp.type] || 0) + 1;
          }
        }

        // Clean up expired opportunities
        await supabase
          .from('intelligence_opportunities')
          .delete()
          .eq('brand_id', brand.id)
          .lt('expires_at', new Date().toISOString());

      } catch (error) {
        console.error(`[cron-opportunity-detector] Error for brand ${brand.business_name}:`, error);
      }
    }

    console.log('[cron-opportunity-detector] Job completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[cron-opportunity-detector] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
