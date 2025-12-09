/**
 * Edge Function: OutScraper Search
 * Proxies OutScraper API requests to hide API keys
 * Supports Google Maps search, reviews, and business details
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OUTSCRAPER_API_URL = 'https://api.app.outscraper.com';

interface OutScraperRequest {
  action: 'maps-search' | 'reviews' | 'business-details';
  query?: string;
  placeId?: string;
  location?: string;
  limit?: number;
  reviewsLimit?: number;
  sort?: 'newest' | 'highest' | 'lowest';
  language?: string;
  region?: string;
}

interface BusinessListing {
  place_id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  category: string[];
  rating: number;
  reviews_count: number;
  price_level?: number;
  verified: boolean;
  claimed?: boolean;
  latitude?: number;
  longitude?: number;
}

interface GoogleReview {
  author_name: string;
  author_photo?: string;
  rating: number;
  text: string;
  time: string;
  language?: string;
  likes?: number;
  author_reviews_count?: number;
  response?: {
    text: string;
    time: string;
  };
}

async function makeOutScraperRequest(
  apiKey: string,
  endpoint: string,
  params: Record<string, unknown>
): Promise<unknown> {
  const url = new URL(`${OUTSCRAPER_API_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  console.log(`[outscraper-search] Making request to: ${endpoint}`);
  console.log(`[outscraper-search] Params:`, params);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OutScraper API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Safe number parsing with NaN protection
 */
function safeParseFloat(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
}

function safeParseInt(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return Math.floor(value);
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function mapBusinessListing(item: Record<string, unknown>): BusinessListing {
  return {
    place_id: String(item.place_id || item.google_id || ''),
    name: String(item.name || ''),
    address: String(item.full_address || item.address || ''),
    phone: item.phone ? String(item.phone) : undefined,
    website: item.site || item.website ? String(item.site || item.website) : undefined,
    category: Array.isArray(item.category)
      ? item.category as string[]
      : [String(item.category || 'Business')],
    rating: safeParseFloat(item.rating, 0),
    reviews_count: safeParseInt(item.reviews, 0),
    price_level: item.price_level ? safeParseInt(item.price_level) : undefined,
    verified: item.verified === true || item.verified === 'true',
    claimed: item.claimed === true || item.claimed === 'true',
    latitude: item.latitude ? safeParseFloat(item.latitude) : undefined,
    longitude: item.longitude ? safeParseFloat(item.longitude) : undefined,
  };
}

function mapGoogleReview(review: Record<string, unknown>): GoogleReview {
  return {
    author_name: String(review.author_title || review.author_name || 'Anonymous'),
    author_photo: review.author_image || review.author_photo
      ? String(review.author_image || review.author_photo)
      : undefined,
    rating: safeParseInt(review.review_rating || review.rating, 0),
    text: String(review.review_text || review.text || ''),
    time: String(review.review_datetime_utc || review.time || new Date().toISOString()),
    language: review.review_language || review.language
      ? String(review.review_language || review.language)
      : undefined,
    likes: review.review_likes ? safeParseInt(review.review_likes) : undefined,
    author_reviews_count: review.reviews_count ? safeParseInt(review.reviews_count) : undefined,
    response: review.owner_answer ? {
      text: String(review.owner_answer),
      time: String(review.owner_answer_timestamp || ''),
    } : undefined,
  };
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

    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Request body must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const request = body as Record<string, unknown>;
    const action = request.action as string | undefined;

    const OUTSCRAPER_API_KEY = Deno.env.get('OUTSCRAPER_API_KEY');
    if (!OUTSCRAPER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'OutScraper API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'maps-search': {
        const query = request.query as string | undefined;
        const location = request.location as string | undefined;
        const limit = typeof request.limit === 'number' ? request.limit : 20;
        const language = (request.language as string) || 'en';
        const region = (request.region as string) || 'US';

        if (!query) {
          return new Response(
            JSON.stringify({ success: false, error: 'Query is required for maps-search action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const searchQuery = location ? `${query} near ${location}` : query;

        const apiParams = {
          query: searchQuery,
          limit,
          language,
          region,
          async: false,
          fields: 'place_id,name,full_address,phone,site,category,rating,reviews,price_level,working_hours,photos_count,verified,claimed,latitude,longitude',
        };

        const response = await makeOutScraperRequest(OUTSCRAPER_API_KEY, '/maps/search-v3', apiParams);
        const responseData = response as { data?: unknown[][] };
        const results = (responseData.data?.[0] || []) as Record<string, unknown>[];

        const listings = results.map(mapBusinessListing);

        console.log(`[outscraper-search] Returning ${listings.length} business listings`);

        return new Response(
          JSON.stringify({
            success: true,
            data: listings,
            count: listings.length,
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reviews': {
        const placeId = request.placeId as string | undefined;
        const reviewsLimit = typeof request.reviewsLimit === 'number' ? request.reviewsLimit : 100;
        const sort = (request.sort as string) || 'newest';
        const language = (request.language as string) || 'en';

        if (!placeId) {
          return new Response(
            JSON.stringify({ success: false, error: 'placeId is required for reviews action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const apiParams = {
          query: placeId,
          reviewsLimit,
          sort,
          language,
        };

        const response = await makeOutScraperRequest(OUTSCRAPER_API_KEY, '/maps/reviews-v3', apiParams);
        const responseData = response as { data?: unknown[] };
        const results = (responseData.data?.[0] || {}) as Record<string, unknown>;
        const reviewsData = (results.reviews_data || results.reviews || []) as Record<string, unknown>[];

        const reviews = reviewsData.map(mapGoogleReview);

        console.log(`[outscraper-search] Returning ${reviews.length} reviews`);

        return new Response(
          JSON.stringify({
            success: true,
            data: reviews,
            count: reviews.length,
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'business-details': {
        const placeId = request.placeId as string | undefined;
        const language = (request.language as string) || 'en';

        if (!placeId) {
          return new Response(
            JSON.stringify({ success: false, error: 'placeId is required for business-details action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const apiParams = {
          query: placeId,
          limit: 1,
          language,
        };

        const response = await makeOutScraperRequest(OUTSCRAPER_API_KEY, '/maps/search-v3', apiParams);
        const responseData = response as { data?: unknown[][] };
        const results = (responseData.data?.[0] || []) as Record<string, unknown>[];
        const item = results[0];

        if (!item) {
          return new Response(
            JSON.stringify({ success: false, error: `No business found with place_id: ${placeId}` }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const profile = {
          ...mapBusinessListing(item),
          description: item.description || item.about ? String(item.description || item.about) : undefined,
          services: Array.isArray(item.services) ? item.services as string[] : undefined,
          attributes: typeof item.attributes === 'object' && item.attributes !== null
            ? item.attributes as Record<string, boolean>
            : undefined,
        };

        console.log(`[outscraper-search] Returning business details for: ${profile.name}`);

        return new Response(
          JSON.stringify({
            success: true,
            data: profile,
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Invalid action: ${action}. Must be 'maps-search', 'reviews', or 'business-details'`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('[outscraper-search] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'OutScraper request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
