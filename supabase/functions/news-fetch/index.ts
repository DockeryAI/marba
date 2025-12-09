/**
 * Edge Function: News Fetch
 * Proxies news requests through Serper API
 * Uses Serper's news endpoint for reliable news data
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERPER_BASE_URL = 'https://google.serper.dev';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
}

interface SerperNewsResult {
  title?: string;
  snippet?: string;
  link?: string;
  date?: string;
  source?: string;
  imageUrl?: string;
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

    const SERPER_API_KEY = Deno.env.get('SERPER_API_KEY');
    if (!SERPER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Serper API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let query: string;
    let num: number;

    switch (action) {
      case 'industry': {
        const industry = request.industry as string | undefined;
        const keywords = request.keywords as string[] | undefined;

        if (!industry) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Industry string is required for industry action'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Build query from industry and optional keywords
        query = keywords && Array.isArray(keywords) && keywords.length > 0
          ? `${industry} ${keywords.join(' ')}`
          : industry;
        num = 20;
        break;
      }

      case 'local': {
        const location = request.location as string | undefined;

        if (!location) {
          return new Response(
            JSON.stringify({ success: false, error: 'Location is required for local action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        query = `${location} local news`;
        num = 15;
        break;
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid action: ${action}. Must be 'industry' or 'local'`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[news-fetch] Action: ${action}, Query: ${query}`);

    // Call Serper News API
    const response = await fetch(`${SERPER_BASE_URL}/news`, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[news-fetch] Serper API error (${response.status}):`, errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: `News API error: ${response.statusText}`
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data.news || !Array.isArray(data.news)) {
      console.warn('[news-fetch] No news results from Serper');
      return new Response(
        JSON.stringify({ success: true, articles: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Serper news results to our interface
    const articles: NewsArticle[] = data.news.map((item: SerperNewsResult) => ({
      title: item.title || '',
      description: item.snippet || '',
      url: item.link || '',
      publishedAt: item.date || '',
      source: item.source || 'Unknown',
      imageUrl: item.imageUrl,
    }));

    console.log(`[news-fetch] Returning ${articles.length} articles`);

    return new Response(
      JSON.stringify({
        success: true,
        articles,
        count: articles.length,
        action,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[news-fetch] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'News fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
