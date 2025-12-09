/**
 * Edge Function: Serper Search
 * Proxies Google search requests through Serper API
 * Replaces direct Serper API calls to hide API keys
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERPER_BASE_URL = 'https://google.serper.dev';

interface SerperRequest {
  action: 'search' | 'news' | 'places' | 'images' | 'videos' | 'shopping' | 'autocomplete';
  query: string;
  location?: string;
  num?: number;
}

/**
 * Make request to Serper API
 */
async function callSerperAPI(
  endpoint: string,
  apiKey: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const response = await fetch(`${SERPER_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Serper API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
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
    const query = request.query as string | undefined;
    const location = request.location as string | undefined;
    const num = typeof request.num === 'number' ? request.num : undefined;

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

    const SERPER_API_KEY = Deno.env.get('SERPER_API_KEY');
    if (!SERPER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Serper API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let endpoint: string;
    let requestBody: Record<string, unknown>;

    switch (action) {
      case 'search': {
        endpoint = '/search';
        requestBody = { q: query };
        if (location) requestBody.location = location;
        if (num) requestBody.num = num;
        break;
      }

      case 'news': {
        endpoint = '/news';
        requestBody = { q: query };
        if (location) requestBody.location = location;
        if (num) requestBody.num = num;
        break;
      }

      case 'places': {
        endpoint = '/places';
        requestBody = { q: query };
        if (!location) {
          return new Response(
            JSON.stringify({ success: false, error: 'Location is required for places action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        requestBody.location = location;
        if (num) requestBody.num = num;
        break;
      }

      case 'images': {
        endpoint = '/images';
        requestBody = { q: query };
        if (num) requestBody.num = num;
        break;
      }

      case 'videos': {
        endpoint = '/videos';
        requestBody = { q: query };
        if (num) requestBody.num = num;
        break;
      }

      case 'shopping': {
        endpoint = '/shopping';
        requestBody = { q: query };
        if (num) requestBody.num = num;
        break;
      }

      case 'autocomplete': {
        // Autocomplete uses /search endpoint with autocorrect
        endpoint = '/search';
        requestBody = { q: query, autocorrect: true };
        break;
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid action: ${action}. Must be one of: search, news, places, images, videos, shopping, autocomplete`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[serper-search] Action: ${action}, Endpoint: ${endpoint}, Query: ${query}`);

    const data = await callSerperAPI(endpoint, SERPER_API_KEY, requestBody);

    return new Response(
      JSON.stringify({
        success: true,
        action,
        data,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[serper-search] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Search request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
