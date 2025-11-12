/**
 * Edge Function: Fetch SEO Metrics
 * Proxies SEMrush API calls to avoid CORS issues
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SEMrushRequest {
  domain: string;
  type: 'overview' | 'keywords' | 'competitors' | 'opportunities';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { domain, type } = await req.json() as SEMrushRequest;

    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SEMRUSH_API_KEY = Deno.env.get('SEMRUSH_API_KEY');
    if (!SEMRUSH_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'SEMrush API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let semrushUrl: string;

    switch (type) {
      case 'overview':
        semrushUrl = `https://api.semrush.com/?type=domain_ranks&key=${SEMRUSH_API_KEY}&export_columns=Ot,Oc,Or,Ad,At&domain=${domain}&database=us`;
        break;

      case 'keywords':
        semrushUrl = `https://api.semrush.com/?type=domain_organic&key=${SEMRUSH_API_KEY}&export_columns=Ph,Po,Nq,Cp,Ur,Tr&domain=${domain}&database=us&display_limit=100`;
        break;

      case 'competitors':
        semrushUrl = `https://api.semrush.com/?type=domain_organic_organic&key=${SEMRUSH_API_KEY}&domain=${domain}&database=us&display_limit=20&export_columns=Dn,Cr,Np,Or,Ot,Oc,Ad`;
        break;

      case 'opportunities':
        semrushUrl = `https://api.semrush.com/?type=domain_organic&key=${SEMRUSH_API_KEY}&export_columns=Ph,Po,Nq,Cp,Ur,Tr&domain=${domain}&database=us&display_limit=100`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid type. Must be: overview, keywords, competitors, or opportunities' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[fetch-seo-metrics] Fetching ${type} for: ${domain}`);

    const response = await fetch(semrushUrl);
    const text = await response.text();

    if (!response.ok) {
      console.error(`[fetch-seo-metrics] SEMrush error:`, text);
      return new Response(
        JSON.stringify({ error: `SEMrush API error: ${response.status}`, details: text }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse CSV response
    const lines = text.trim().split('\n');
    const headers = lines[0].split(';');
    const data = lines.slice(1).map(line => {
      const values = line.split(';');
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });
      return obj;
    });

    console.log(`[fetch-seo-metrics] Success: ${data.length} rows returned`);

    return new Response(
      JSON.stringify({
        success: true,
        domain,
        type,
        data,
        rawHeaders: headers,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[fetch-seo-metrics] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
