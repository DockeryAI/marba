/**
 * Edge Function: YouTube Intelligence
 * Proxies YouTube data requests through Apify scrapers
 * Uses streamers/youtube-comments-scraper for comments
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APIFY_API_URL = 'https://api.apify.com/v2';
const YOUTUBE_COMMENTS_ACTOR = 'streamers/youtube-comments-scraper';

interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  authorIsChannelOwner: boolean;
  publishedAt: string;
  likeCount: number;
  replyCount: number;
  videoId: string;
  videoTitle: string;
}

/**
 * Run an Apify actor and poll for results
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

  if (!runData?.data?.id) {
    throw new Error('Invalid response from Apify: missing run ID');
  }

  const runId = runData.data.id;
  console.log(`[youtube-intelligence] Started actor run: ${runId} (${actorId})`);

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

    if (!statusData?.data?.status) {
      throw new Error('Invalid status response from Apify: missing status field');
    }

    const status = statusData.data.status;
    console.log(`[youtube-intelligence] Run status: ${status}`);

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

      if (!Array.isArray(results)) {
        console.warn('[youtube-intelligence] Dataset response is not an array, returning empty');
        return [];
      }

      return results;
    } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      throw new Error(`Actor run ${status}: ${statusData.data.statusMessage || 'Unknown error'}`);
    }
  }

  throw new Error(`Actor run timed out after ${timeout} seconds`);
}

/**
 * Map Apify comment to our interface
 */
function mapComment(raw: Record<string, unknown>): YouTubeComment {
  return {
    id: String(raw.cid || ''),
    text: String(raw.comment || ''),
    author: String(raw.author || ''),
    authorIsChannelOwner: Boolean(raw.authorIsChannelOwner),
    publishedAt: String(raw.publishedTimeText || ''),
    likeCount: typeof raw.voteCount === 'number' ? raw.voteCount : 0,
    replyCount: typeof raw.replyCount === 'number' ? raw.replyCount : 0,
    videoId: String(raw.videoId || ''),
    videoTitle: String(raw.title || ''),
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

    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Apify API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'comments': {
        const videoUrl = request.videoUrl as string | undefined;
        const videoId = request.videoId as string | undefined;
        const maxComments = typeof request.maxComments === 'number' ? request.maxComments : 50;

        // Build video URL from videoId if not provided directly
        let url: string;
        if (videoUrl) {
          url = videoUrl;
        } else if (videoId) {
          url = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
          return new Response(
            JSON.stringify({ success: false, error: 'Either videoUrl or videoId is required for comments action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[youtube-intelligence] Fetching comments for: ${url}`);

        const input = {
          startUrls: [{ url }],
          maxComments: Math.min(maxComments, 500),
        };

        const results = await runApifyActor(APIFY_API_KEY, YOUTUBE_COMMENTS_ACTOR, input, 180);

        const comments: YouTubeComment[] = results
          .map((item) => mapComment(item as Record<string, unknown>))
          .filter((c) => c.id && c.text);

        console.log(`[youtube-intelligence] Returning ${comments.length} comments`);

        return new Response(
          JSON.stringify({
            success: true,
            comments,
            count: comments.length,
            videoId: comments[0]?.videoId || videoId || '',
            videoTitle: comments[0]?.videoTitle || '',
            action,
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Invalid action: ${action}. Must be 'comments'` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('[youtube-intelligence] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'YouTube intelligence request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
