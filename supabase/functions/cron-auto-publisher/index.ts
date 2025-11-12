/**
 * Cron: Auto Publisher
 * Runs every 5 minutes
 * Publishes scheduled content at the right time
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

    console.log('[cron-auto-publisher] Starting auto-publisher...');

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Get content scheduled for now (±5 minute window)
    const { data: scheduledItems } = await supabase
      .from('content_calendar_items')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_for', fiveMinutesAgo.toISOString())
      .lte('scheduled_for', fiveMinutesFromNow.toISOString());

    const results = {
      total: scheduledItems?.length || 0,
      published: 0,
      failed: 0,
      errors: [] as string[],
    };

    if (!scheduledItems || scheduledItems.length === 0) {
      console.log('[cron-auto-publisher] No content scheduled for now');
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    for (const item of scheduledItems) {
      try {
        console.log(`[cron-auto-publisher] Publishing: ${item.title}`);

        // Update status to 'publishing'
        await supabase
          .from('content_calendar_items')
          .update({ status: 'publishing' })
          .eq('id', item.id);

        // Simulate publishing (in production, call actual platform APIs)
        // For now, we'll just mark it as published after a small delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In production, call the publish-to-platforms function:
        const response = await fetch(`${supabaseUrl}/functions/v1/publish-to-platforms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            contentItemId: item.id,
            platforms: item.platforms || [],
            content: item.content,
          }),
        });

        if (response.ok) {
          // Update status to 'published'
          await supabase
            .from('content_calendar_items')
            .update({
              status: 'published',
              published_at: new Date().toISOString(),
            })
            .eq('id', item.id);

          // Record success event
          await supabase.from('publish_events').insert({
            content_calendar_item_id: item.id,
            event_type: 'published',
            status: 'success',
            platform: item.platforms?.[0] || 'unknown',
            created_at: new Date().toISOString(),
          });

          results.published++;
        } else {
          throw new Error(`Publish failed: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`[cron-auto-publisher] Error publishing ${item.title}:`, error);

        // Update status to 'failed'
        await supabase
          .from('content_calendar_items')
          .update({
            status: 'failed',
            error_message: error.message,
          })
          .eq('id', item.id);

        // Record failure event
        await supabase.from('publish_events').insert({
          content_calendar_item_id: item.id,
          event_type: 'failed',
          status: 'failed',
          platform: item.platforms?.[0] || 'unknown',
          error: error.message,
          created_at: new Date().toISOString(),
        });

        results.failed++;
        results.errors.push(`${item.title}: ${error.message}`);
      }
    }

    console.log('[cron-auto-publisher] Job completed', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[cron-auto-publisher] Fatal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
