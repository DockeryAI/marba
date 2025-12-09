/**
 * Edge Function: BuzzSumo Intelligence
 * Proxies BuzzSumo API requests to hide API keys
 * Phase 1: Trending endpoint only
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BuzzSumo API base URL - note: uses /search/ path structure
const BUZZSUMO_BASE_URL = 'https://api.buzzsumo.com/search';

interface BuzzSumoRequest {
  action: 'trending';
  query: string;
  hours?: number; // 24, 48, 168 (1 week)
  num_results?: number;
}

interface TrendingArticle {
  id: string;
  url: string;
  title: string;
  total_shares: number;
  facebook_shares: number;
  twitter_shares: number;
  pinterest_shares: number;
  total_reddit_engagements: number;
  published_date: string;
  domain_name: string;
  author_name?: string;
  thumbnail?: string;
}

/**
 * Call BuzzSumo Trends API
 * Docs: https://developers.buzzsumo.com/reference/trends
 * Endpoint: GET https://api.buzzsumo.com/search/trends.json
 */
async function callBuzzSumoAPI(
  apiKey: string,
  query: string,
  hours: number = 24,
  numResults: number = 20
): Promise<TrendingArticle[]> {
  // BuzzSumo Trends endpoint - discovers trending articles over last 24 hours
  const url = new URL(`${BUZZSUMO_BASE_URL}/trends.json`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('q', query);
  url.searchParams.set('hours', hours.toString());
  url.searchParams.set('num_results', numResults.toString());

  console.log(`[buzzsumo-intelligence] Fetching trends for: "${query}" (${hours}h)`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BuzzSumo API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // BuzzSumo returns { results: [...] } or { trending: [...] }
  const results = data.results || data.trending || [];
  if (!Array.isArray(results)) {
    console.warn('[buzzsumo-intelligence] Unexpected response structure:', Object.keys(data));
    return [];
  }

  return results.map((item: any) => ({
    id: item.id || item.url,
    url: item.url,
    title: item.title,
    total_shares: item.total_shares || item.total_facebook_shares || 0,
    facebook_shares: item.facebook_shares || item.total_facebook_shares || 0,
    twitter_shares: item.twitter_shares || 0,
    pinterest_shares: item.pinterest_shares || 0,
    total_reddit_engagements: item.total_reddit_engagements || 0,
    published_date: item.published_date,
    domain_name: item.domain_name,
    author_name: item.author_name,
    thumbnail: item.thumbnail,
  }));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Request body must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const request = body as Record<string, unknown>;
    const action = request.action as string | undefined;
    const query = request.query as string | undefined;
    const hours = typeof request.hours === 'number' ? request.hours : 24;
    const numResults = typeof request.num_results === 'number' ? request.num_results : 20;

    // Validate required fields
    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Query string is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const BUZZSUMO_API_KEY = Deno.env.get('BUZZSUMO_API_KEY');
    if (!BUZZSUMO_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'BuzzSumo API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'trending': {
        const articles = await callBuzzSumoAPI(BUZZSUMO_API_KEY, query, hours, numResults);

        console.log(`[buzzsumo-intelligence] Found ${articles.length} trending articles`);

        return new Response(
          JSON.stringify({
            success: true,
            action,
            articles,
            count: articles.length,
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid action: ${action}. Must be: trending`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('[buzzsumo-intelligence] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'BuzzSumo request failed'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
