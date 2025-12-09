/**
 * Edge Function: Weather Fetch
 * Proxies OpenWeather API requests to hide API keys
 * Supports current weather and 5-day forecast
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherRequest {
  action: 'current' | 'forecast';
  location: string;
  units?: 'imperial' | 'metric';
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
    const location = request.location as string | undefined;
    const unitsParam = request.units as string | undefined;

    // Validate units parameter
    const validUnits = ['imperial', 'metric'];
    const units = unitsParam && validUnits.includes(unitsParam) ? unitsParam : 'imperial';

    // Validate required fields
    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!location) {
      return new Response(
        JSON.stringify({ success: false, error: 'Location is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment
    const WEATHER_API_KEY = Deno.env.get('WEATHER_API_KEY');
    if (!WEATHER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Weather API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build API URL based on action
    let apiUrl: string;
    switch (action) {
      case 'current':
        apiUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)}&units=${units}&appid=${WEATHER_API_KEY}`;
        break;

      case 'forecast':
        apiUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(location)}&units=${units}&appid=${WEATHER_API_KEY}`;
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Invalid action: ${action}. Must be 'current' or 'forecast'` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[weather-fetch] Action: ${action}, Location: ${location}, Units: ${units}`);

    // Make request to OpenWeather API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[weather-fetch] OpenWeather API error: ${response.status} - ${errorText}`);

      return new Response(
        JSON.stringify({
          success: false,
          error: `Weather API error: ${response.statusText}`
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    console.log(`[weather-fetch] Successfully fetched ${action} data for ${location}`);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        action,
        location,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[weather-fetch] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Weather request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
