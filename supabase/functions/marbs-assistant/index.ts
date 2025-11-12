/**
 * Deno Edge Function: Marbs AI Assistant
 *
 * Conversational AI assistant that provides context-aware help
 * throughout the MARBA platform. Marbs can:
 * - Answer questions about marketing strategy
 * - Guide users through the MIRROR framework
 * - Suggest content ideas and optimizations
 * - Execute actions on behalf of the user
 * - Learn from conversation history
 *
 * @module marbs-assistant
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-3.5-sonnet';

interface AssistantRequest {
  message: string;
  context?: {
    section?: string;
    page?: string;
    contentId?: string;
    pillarId?: string;
    additionalContext?: string;
  };
  brandId: string;
  conversationId?: string;
}

interface BillingEvent {
  brand_id: string;
  provider: string;
  api_name: string;
  feature_name: string;
  use_case: string;
  request_type: string;
  model_used: string;
  tokens_input?: number;
  tokens_output?: number;
  tokens_total?: number;
  cost_total: number;
  response_time_ms: number;
  status: string;
  error_message?: string;
  user_id?: string;
}

/**
 * Main request handler
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    let userId: string | undefined;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    const {
      message,
      context,
      brandId,
      conversationId,
    } = await req.json() as AssistantRequest;

    if (!message || !brandId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message, brandId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch brand context
    const { data: brand } = await supabase
      .from('brands')
      .select('name, industry, target_audience, description')
      .eq('id', brandId)
      .single();

    if (!brand) {
      return new Response(
        JSON.stringify({ error: 'Brand not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch recent conversation history
    const { data: conversationHistory } = await supabase
      .from('marbs_conversations')
      .select('role, message, context, created_at')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Prepare billing event
    const billingEvent: Partial<BillingEvent> = {
      brand_id: brandId,
      provider: 'openrouter',
      api_name: 'openrouter',
      feature_name: 'marbs_assistant',
      use_case: `Conversation in ${context?.section || 'general'} section`,
      request_type: 'completion',
      model_used: MODEL,
      user_id: userId,
    };

    // Generate AI response
    const assistantResponse = await generateMarbsResponse(
      message,
      brand,
      context,
      conversationHistory || [],
      billingEvent
    );

    // Store conversation in database
    if (userId) {
      await supabase.from('marbs_conversations').insert({
        brand_id: brandId,
        user_id: userId,
        role: 'user',
        message,
        context: context || {},
        conversation_id: conversationId,
      });

      await supabase.from('marbs_conversations').insert({
        brand_id: brandId,
        user_id: userId,
        role: 'assistant',
        message: assistantResponse.message,
        context: context || {},
        conversation_id: conversationId,
      });
    }

    // Record billing event
    const responseTime = Date.now() - startTime;
    await recordBillingEvent(supabase, {
      ...billingEvent,
      response_time_ms: responseTime,
      status: 'success',
    } as BillingEvent);

    return new Response(
      JSON.stringify({
        message: assistantResponse.message,
        actions: assistantResponse.actions,
        suggestions: assistantResponse.suggestions,
        context,
        metadata: {
          responseTimeMs: responseTime,
          model: MODEL,
        },
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Marbs assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Generate context-aware response from Marbs
 */
async function generateMarbsResponse(
  userMessage: string,
  brand: any,
  context: any,
  conversationHistory: any[],
  billingEvent: Partial<BillingEvent>
) {
  const sectionContext = context?.section ? getSectionContext(context.section) : '';

  const systemPrompt = `You are Marbs, an AI marketing strategist and assistant for the MARBA platform.

MARBA uses the MIRROR framework for strategic marketing planning:
- Measure: Current state analysis
- Intend: Goals and objectives
- Reimagine: Strategy and positioning
- Reach: Audience and channels
- Optimize: Tactics and execution
- Reflect: Performance review

Your personality:
- Friendly, professional, and encouraging
- Strategic thinker who provides actionable advice
- Expert in marketing, branding, and content strategy
- Proactive in suggesting improvements
- Context-aware based on where the user is in the platform

Brand Context:
- Name: ${brand.name}
- Industry: ${brand.industry || 'Not specified'}
- Target Audience: ${brand.target_audience || 'Not specified'}
- Description: ${brand.description || 'Not specified'}

${sectionContext ? `Current Section Context:\n${sectionContext}\n` : ''}

${context?.additionalContext ? `Additional Context:\n${context.additionalContext}\n` : ''}

Your tasks:
1. Answer user questions with helpful, strategic advice
2. Guide users through the MIRROR framework
3. Suggest actionable next steps
4. Identify opportunities for improvement
5. When appropriate, suggest specific actions the user can take

Format your response as JSON:
{
  "message": "Your conversational response to the user",
  "actions": [
    {
      "type": "navigate|create|analyze|suggest",
      "label": "Action button label",
      "description": "What this action does",
      "payload": {} // Any data needed for the action
    }
  ],
  "suggestions": [
    "Quick suggestion 1",
    "Quick suggestion 2"
  ]
}`;

  // Build conversation history
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];

  // Add recent conversation history (reversed to get chronological order)
  const recentHistory = conversationHistory.reverse().slice(-5);
  for (const turn of recentHistory) {
    messages.push({
      role: turn.role === 'user' ? 'user' : 'assistant',
      content: turn.message
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage
  });

  const response = await callOpenRouter(messages, billingEvent);

  try {
    const parsed = JSON.parse(response.content);
    return {
      message: parsed.message,
      actions: parsed.actions || [],
      suggestions: parsed.suggestions || [],
    };
  } catch (e) {
    console.error('Failed to parse Marbs response:', e);
    // Return the raw response as fallback
    return {
      message: response.content,
      actions: [],
      suggestions: [],
    };
  }
}

/**
 * Get contextual information for each MIRROR section
 */
function getSectionContext(section: string): string {
  const contexts: Record<string, string> = {
    measure: 'The user is in the Measure section, analyzing their current marketing position and gathering baseline data.',
    intend: 'The user is in the Intend section, setting goals and defining objectives for their marketing strategy.',
    reimagine: 'The user is in the Reimagine section, developing their brand strategy and positioning.',
    reach: 'The user is in the Reach section, defining target audiences and selecting optimal channels.',
    optimize: 'The user is in the Optimize section, planning tactical execution and content creation.',
    reflect: 'The user is in the Reflect section, reviewing performance and extracting learnings.',
    content: 'The user is working with the content calendar and creation tools.',
    analytics: 'The user is viewing analytics and performance metrics.',
  };

  return contexts[section] || '';
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  billingEvent: Partial<BillingEvent>
): Promise<{ content: string; usage: any }> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://marba.app',
      'X-Title': 'MARBA Platform',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Update billing event with usage data
  if (data.usage) {
    billingEvent.tokens_input = data.usage.prompt_tokens;
    billingEvent.tokens_output = data.usage.completion_tokens;
    billingEvent.tokens_total = data.usage.total_tokens;

    const inputCost = (data.usage.prompt_tokens / 1000000) * 3.0;
    const outputCost = (data.usage.completion_tokens / 1000000) * 15.0;
    billingEvent.cost_total = inputCost + outputCost;
  }

  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

/**
 * Record billing event in database
 */
async function recordBillingEvent(supabase: any, event: BillingEvent) {
  try {
    const { error } = await supabase
      .from('api_billing_events')
      .insert(event);

    if (error) {
      console.error('Failed to record billing event:', error);
    }
  } catch (e) {
    console.error('Error recording billing event:', e);
  }
}
