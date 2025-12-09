/**
 * Edge Function: AI Proxy
 * Proxies AI requests to OpenRouter (Claude Opus 4.5) and OpenAI (embeddings)
 * Hides API keys from frontend
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_BASE = 'https://api.openai.com/v1';
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

// Claude Opus 4.5 via OpenRouter for best quality
const DEFAULT_CHAT_MODEL = 'anthropic/claude-opus-4';
const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';

interface AIRequest {
  action: 'embeddings' | 'chat';
  // For embeddings
  texts?: string[];
  model?: string;
  // For chat
  messages?: Array<{ role: string; content: string }>;
  maxTokens?: number;
}

interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Create embeddings via OpenAI (still best for embeddings)
 */
async function createEmbeddings(
  apiKey: string,
  texts: string[],
  model: string = DEFAULT_EMBEDDING_MODEL
): Promise<{ success: true; data: number[][]; usage: { prompt_tokens: number; total_tokens: number } } | { success: false; error: string }> {
  try {
    // Filter out empty strings
    const validTexts = texts.filter(t => t && t.trim().length > 0);

    if (validTexts.length === 0) {
      return {
        success: false,
        error: 'All texts are empty - nothing to embed',
      };
    }

    const response = await fetch(`${OPENAI_API_BASE}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: validTexts,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ai-proxy] Embeddings API error: ${response.status}`);
      return {
        success: false,
        error: `Embeddings API error: ${response.status}`,
      };
    }

    const result = await response.json() as EmbeddingResponse;

    if (!result.data || !Array.isArray(result.data)) {
      return {
        success: false,
        error: 'Invalid response from embeddings API',
      };
    }

    return {
      success: true,
      data: result.data.map(item => item.embedding),
      usage: result.usage,
    };
  } catch (error) {
    console.error('[ai-proxy] Embeddings error:', error);
    return {
      success: false,
      error: 'Embeddings request failed',
    };
  }
}

/**
 * Chat completion via OpenRouter using Claude Opus 4.5
 */
async function chatCompletion(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = 200
): Promise<{ success: true; content: string } | { success: false; error: string }> {
  try {
    // Validate messages have content
    const validMessages = messages.filter(m => m.role && m.content && m.content.trim().length > 0);

    if (validMessages.length === 0) {
      return {
        success: false,
        error: 'No valid messages provided',
      };
    }

    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://marba.app',
        'X-Title': 'MARBA',
      },
      body: JSON.stringify({
        model: DEFAULT_CHAT_MODEL,
        messages: validMessages,
        max_tokens: Math.min(maxTokens, 4000), // Cap at 4000 tokens
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ai-proxy] Chat API error: ${response.status}`);
      return {
        success: false,
        error: `Chat API error: ${response.status}`,
      };
    }

    const result = await response.json() as OpenRouterResponse;

    if (!result.choices || result.choices.length === 0 || !result.choices[0].message) {
      return {
        success: false,
        error: 'Invalid response from chat API',
      };
    }

    return {
      success: true,
      content: result.choices[0].message.content,
    };
  } catch (error) {
    console.error('[ai-proxy] Chat completion error:', error);
    return {
      success: false,
      error: 'Chat request failed',
    };
  }
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

    switch (action) {
      case 'embeddings': {
        const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
        if (!OPENAI_API_KEY) {
          return new Response(
            JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const texts = request.texts as string[] | undefined;
        const model = (request.model as string) || DEFAULT_EMBEDDING_MODEL;

        if (!texts || !Array.isArray(texts) || texts.length === 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Texts array is required for embeddings action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[ai-proxy] Creating embeddings for ${texts.length} texts with model ${model}`);

        const result = await createEmbeddings(OPENAI_API_KEY, texts, model);

        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'chat': {
        const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
        if (!OPENROUTER_API_KEY) {
          return new Response(
            JSON.stringify({ success: false, error: 'OpenRouter API key not configured' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const messages = request.messages as Array<{ role: string; content: string }> | undefined;
        const maxTokens = typeof request.maxTokens === 'number' ? request.maxTokens : 200;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Messages array is required for chat action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[ai-proxy] Chat completion with ${messages.length} messages using Claude Opus 4.5`);

        const result = await chatCompletion(OPENROUTER_API_KEY, messages, maxTokens);

        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Invalid action: ${action}. Must be 'embeddings' or 'chat'` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('[ai-proxy] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Request failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
