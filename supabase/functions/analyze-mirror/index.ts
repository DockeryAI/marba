/**
 * Deno Edge Function: Mirror Analysis
 *
 * Analyzes MIRROR framework sections using Claude AI:
 * - Measure: Current state analysis
 * - Intend: Goal setting and objectives
 * - Reimagine: Strategy and positioning
 * - Reach: Audience and channels
 * - Optimize: Tactics and execution
 * - Reflect: Performance review
 *
 * @module analyze-mirror
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-3.5-sonnet';

type MirrorSection = 'measure' | 'intend' | 'reimagine' | 'reach' | 'optimize' | 'reflect';

interface AnalyzeRequest {
  brandId: string;
  section: MirrorSection;
  currentData?: any;
  context?: string;
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

    const {
      brandId,
      section,
      currentData,
      context,
    } = await req.json() as AnalyzeRequest;

    if (!brandId || !section) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: brandId, section' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate section
    const validSections: MirrorSection[] = ['measure', 'intend', 'reimagine', 'reach', 'optimize', 'reflect'];
    if (!validSections.includes(section)) {
      return new Response(
        JSON.stringify({ error: `Invalid section. Must be one of: ${validSections.join(', ')}` }),
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

    // Fetch existing mirror section data
    const { data: existingSection } = await supabase
      .from('mirror_sections')
      .select('data')
      .eq('brand_id', brandId)
      .eq('section', section)
      .single();

    // Perform AI analysis
    const billingEvent: Partial<BillingEvent> = {
      brand_id: brandId,
      provider: 'openrouter',
      api_name: 'openrouter',
      feature_name: 'mirror_analysis',
      use_case: `Analyze ${section} section for brand ${brand.name}`,
      request_type: 'completion',
      model_used: MODEL,
    };

    const analysis = await analyzeMirrorSection(
      section,
      brand,
      existingSection?.data || currentData,
      context,
      billingEvent
    );

    // Update or insert mirror section with enriched data
    const { error: upsertError } = await supabase
      .from('mirror_sections')
      .upsert({
        brand_id: brandId,
        section,
        data: analysis.enrichedData,
        last_enriched: new Date().toISOString(),
      }, {
        onConflict: 'brand_id,section'
      });

    if (upsertError) {
      console.error('Failed to update mirror section:', upsertError);
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
        section,
        brandId,
        enrichedData: analysis.enrichedData,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        lastEnriched: new Date().toISOString(),
        metadata: {
          responseTimeMs: responseTime,
          model: MODEL,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Mirror analysis error:', error);
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
 * Analyze a specific MIRROR section with AI
 */
async function analyzeMirrorSection(
  section: MirrorSection,
  brand: any,
  currentData: any,
  context: string | undefined,
  billingEvent: Partial<BillingEvent>
) {
  const sectionPrompts = {
    measure: {
      title: 'Measure - Current State Analysis',
      focus: 'Analyze the current state of the brand\'s marketing and business position',
      questions: [
        'What is the current market position?',
        'What are the key performance metrics?',
        'What are the strengths and weaknesses?',
        'What data and insights do we have?',
      ],
    },
    intend: {
      title: 'Intend - Goals & Objectives',
      focus: 'Define clear, measurable goals and strategic objectives',
      questions: [
        'What are the primary business goals?',
        'What are specific, measurable objectives?',
        'What is the timeline for achieving these goals?',
        'How will success be measured?',
      ],
    },
    reimagine: {
      title: 'Reimagine - Strategy & Positioning',
      focus: 'Develop strategic positioning and brand differentiation',
      questions: [
        'What is the unique value proposition?',
        'How should the brand be positioned?',
        'What is the competitive advantage?',
        'What is the brand story and narrative?',
      ],
    },
    reach: {
      title: 'Reach - Audience & Channels',
      focus: 'Define target audiences and optimal channels',
      questions: [
        'Who are the target audience segments?',
        'What channels should be prioritized?',
        'What is the content distribution strategy?',
        'How will we engage and attract the audience?',
      ],
    },
    optimize: {
      title: 'Optimize - Tactics & Execution',
      focus: 'Define tactical execution and optimization strategies',
      questions: [
        'What specific tactics will be implemented?',
        'What is the content and campaign calendar?',
        'What are the optimization opportunities?',
        'What processes and workflows are needed?',
      ],
    },
    reflect: {
      title: 'Reflect - Performance Review',
      focus: 'Review performance and extract learnings',
      questions: [
        'What worked well and why?',
        'What didn\'t work and why?',
        'What were the key learnings?',
        'What should be changed going forward?',
      ],
    },
  };

  const sectionConfig = sectionPrompts[section];

  const systemPrompt = `You are a strategic marketing consultant analyzing the "${sectionConfig.title}" section of the MIRROR framework.

Focus: ${sectionConfig.focus}

Brand Context:
- Name: ${brand.name}
- Industry: ${brand.industry || 'Not specified'}
- Target Audience: ${brand.target_audience || 'Not specified'}
- Description: ${brand.description || 'Not specified'}

Your task is to provide:
1. Deep analysis of the current state
2. Strategic insights and observations
3. Actionable recommendations
4. Enriched data structure with missing fields filled in`;

  const userPrompt = `Analyze the ${section} section for this brand.

Key Questions to Address:
${sectionConfig.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Current Data:
${JSON.stringify(currentData || {}, null, 2)}

${context ? `Additional Context:\n${context}` : ''}

Provide your analysis in JSON format:
{
  "enrichedData": {
    // The original data enriched with your insights and filled-in gaps
    // Structure this according to what makes sense for the ${section} section
  },
  "insights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "action": "Specific recommendation",
      "rationale": "Why this is important",
      "impact": "Expected impact"
    }
  ]
}`;

  const response = await callOpenRouter([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], billingEvent);

  try {
    const parsed = JSON.parse(response.content);
    return {
      enrichedData: parsed.enrichedData || currentData || {},
      insights: parsed.insights || [],
      recommendations: parsed.recommendations || [],
    };
  } catch (e) {
    console.error('Failed to parse Mirror analysis response:', e);
    // Return fallback structure
    return {
      enrichedData: currentData || {},
      insights: ['Analysis generated, but parsing failed. Please review raw response.'],
      recommendations: [],
      rawResponse: response.content,
    };
  }
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
      temperature: 0.7,
      max_tokens: 3000,
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
