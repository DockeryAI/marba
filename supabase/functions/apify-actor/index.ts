/**
 * Edge Function: Apify Actor
 * Generic proxy for Apify actors to hide API keys
 * Supports multiple preset actors and custom actor execution
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APIFY_API_URL = 'https://api.apify.com/v2';

// Preset Actor IDs
const ACTORS = {
  WEBSITE_CONTENT: 'apify/website-content-crawler',
  GOOGLE_MAPS: 'nwua9Gu5YrADL7ZDj',
  INSTAGRAM: 'apify/instagram-scraper',
};

// Timeout constants
const DEFAULT_TIMEOUT = 120;
const LONG_RUNNING_TIMEOUT = 180;
const MAX_TIMEOUT = 300; // 5 minutes max to prevent function lockup

interface ApifyRequest {
  action: 'run-actor' | 'website-content' | 'google-maps' | 'instagram';
  actorId?: string;
  input: Record<string, unknown>;
  timeout?: number;
}

/**
 * Run an Apify Actor and poll for results
 */
async function runApifyActor(
  apiKey: string,
  actorId: string,
  input: Record<string, unknown>,
  timeout: number = 120
): Promise<unknown[]> {
  // Start actor run
  const runResponse = await fetch(
    `${APIFY_API_URL}/acts/${actorId}/runs?token=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Failed to start Apify actor: ${runResponse.status} - ${errorText}`);
  }

  const runData = await runResponse.json();

  // Validate response structure
  if (!runData?.data?.id) {
    throw new Error('Invalid response from Apify: missing run ID');
  }

  const runId = runData.data.id;
  console.log(`[apify-actor] Started actor run: ${runId} (actor: ${actorId})`);

  // Poll for results
  const startTime = Date.now();
  while (Date.now() - startTime < timeout * 1000) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const statusResponse = await fetch(
      `${APIFY_API_URL}/actor-runs/${runId}?token=${apiKey}`
    );

    if (!statusResponse.ok) {
      throw new Error(`Failed to check run status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();

    // Validate status response structure
    if (!statusData?.data?.status) {
      throw new Error('Invalid status response from Apify: missing status field');
    }

    const status = statusData.data.status;
    console.log(`[apify-actor] Run status: ${status}`);

    if (status === 'SUCCEEDED') {
      const datasetId = statusData.data.defaultDatasetId;

      if (!datasetId) {
        throw new Error('Invalid response from Apify: missing dataset ID');
      }

      const datasetResponse = await fetch(
        `${APIFY_API_URL}/datasets/${datasetId}/items?token=${apiKey}`
      );

      if (!datasetResponse.ok) {
        throw new Error(`Failed to get dataset: ${datasetResponse.status}`);
      }

      const results = await datasetResponse.json();

      // Validate results is an array
      if (!Array.isArray(results)) {
        console.warn('[apify-actor] Dataset response is not an array, returning empty');
        return [];
      }

      return results;
    } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      throw new Error(`Actor run ${status}: ${statusData.data.statusMessage || 'Unknown error'}`);
    }
  }

  throw new Error(`Actor run timed out after ${timeout} seconds`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate body is an object
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Request body must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const request = body as Record<string, unknown>;
    const action = request.action as string | undefined;
    const customActorId = request.actorId as string | undefined;
    const input = request.input as Record<string, unknown> | undefined;
    const requestedTimeout = typeof request.timeout === 'number' ? request.timeout : DEFAULT_TIMEOUT;
    // Clamp timeout to prevent function lockup
    const timeout = Math.min(Math.max(requestedTimeout, 10), MAX_TIMEOUT);

    // Validate input
    if (!input || typeof input !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Input must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Apify API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let actorId: string;
    let actorTimeout: number = timeout;

    switch (action) {
      case 'run-actor': {
        if (!customActorId) {
          return new Response(
            JSON.stringify({ success: false, error: 'actorId is required for run-actor action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        actorId = customActorId;
        break;
      }

      case 'website-content': {
        actorId = ACTORS.WEBSITE_CONTENT;
        break;
      }

      case 'google-maps': {
        actorId = ACTORS.GOOGLE_MAPS;
        actorTimeout = LONG_RUNNING_TIMEOUT;
        break;
      }

      case 'instagram': {
        actorId = ACTORS.INSTAGRAM;
        actorTimeout = LONG_RUNNING_TIMEOUT;
        break;
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid action: ${action}. Must be 'run-actor', 'website-content', 'google-maps', or 'instagram'`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[apify-actor] Action: ${action}, Actor: ${actorId}, Timeout: ${actorTimeout}s`);

    const results = await runApifyActor(APIFY_API_KEY, actorId, input, actorTimeout);

    console.log(`[apify-actor] Returning ${results.length} results`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        count: results.length,
        action,
        actorId,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[apify-actor] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Apify actor request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
