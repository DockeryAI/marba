/**
 * Cron: Enrichment Scheduler
 * Runs daily at 2 AM UTC
 * Enriches all MIRROR sections for active brands
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

    console.log('[cron-enrichment-scheduler] Starting enrichment job...');

    // Get all active brands
    const { data: brands, error } = await supabase
      .from('brands')
      .select('id, business_name')
      .eq('onboarding_completed', true);

    if (error) {
      throw error;
    }

    const results = {
      total: brands?.length || 0,
      enriched: 0,
      failed: 0,
      errors: [] as string[],
    };

    if (!brands || brands.length === 0) {
      console.log('[cron-enrichment-scheduler] No active brands found');
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enrich each brand's MIRROR sections
    for (const brand of brands) {
      try {
        console.log(`[cron-enrichment-scheduler] Enriching brand: ${brand.business_name}`);

        // Call the analyze-mirror function for each section
        const sections = ['measure', 'intend', 'reimagine', 'reach', 'optimize', 'reflect'];

        for (const section of sections) {
          try {
            const response = await fetch(`${supabaseUrl}/functions/v1/analyze-mirror`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                brandId: brand.id,
                section,
                analysisType: 'enrichment',
              }),
            });

            if (!response.ok) {
              throw new Error(`Failed to enrich ${section}: ${response.statusText}`);
            }

            const data = await response.json();

            // Cache the enrichment result
            const ttls: Record<string, number> = {
              measure: 24 * 60 * 60 * 1000, // 24 hours
              intend: 7 * 24 * 60 * 60 * 1000, // 7 days
              reimagine: 7 * 24 * 60 * 60 * 1000,
              reach: 3 * 24 * 60 * 60 * 1000,
              optimize: 24 * 60 * 60 * 1000,
              reflect: 6 * 60 * 60 * 1000, // 6 hours
            };

            const expiresAt = new Date(Date.now() + (ttls[section] || 86400000)).toISOString();

            await supabase.from('enrichment_cache').upsert({
              brand_id: brand.id,
              section,
              data,
              expires_at: expiresAt,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'brand_id,section',
            });

            console.log(`[cron-enrichment-scheduler] Enriched ${section} for ${brand.business_name}`);
          } catch (sectionError) {
            console.error(`[cron-enrichment-scheduler] Error enriching ${section}:`, sectionError);
            results.errors.push(`${brand.business_name}/${section}: ${sectionError.message}`);
          }
        }

        results.enriched++;
      } catch (brandError) {
        console.error(`[cron-enrichment-scheduler] Error enriching brand ${brand.business_name}:`, brandError);
        results.failed++;
        results.errors.push(`${brand.business_name}: ${brandError.message}`);
      }
    }

    console.log('[cron-enrichment-scheduler] Job completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[cron-enrichment-scheduler] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
