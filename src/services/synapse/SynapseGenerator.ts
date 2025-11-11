/**
 * Simple Synapse Generator
 *
 * Replaces the complex multi-model orchestra with a single Claude 3.5 Sonnet call
 * Integrates cost equivalences calculator and semantic connection hints
 * Produces synapse content in the original behavioral economics style
 */

import {
  calculateCostEquivalences,
  formatForPrompt as formatCostEquivalences,
  getIndustryExamples,
  type ServiceCost
} from './helpers/CostEquivalenceCalculator';

import {
  generateConnectionHints,
  formatHintsForPrompt,
  createDataSourcesFromIntelligence
} from './helpers/ConnectionHintGenerator';

import type { SynapseInsight } from '../../types/synapse.types';

export interface SynapseInput {
  business: {
    name: string;
    industry: string;
    location: {
      city: string;
      state: string;
    };
    services?: ServiceCost[];
  };
  intelligence: any; // BusinessIntelligence or similar
}

export interface SynapseResult {
  synapses: SynapseInsight[];
  metadata: {
    generationTimeMs: number;
    costEquivalencesUsed: number;
    connectionHintsUsed: number;
    totalCost: number;
    model: string;
  };
}

/**
 * Clean meta-instructions from content
 * Removes common instruction patterns like "Start with 'secret'", "Begin with...", etc.
 */
function cleanMetaInstructions(text: string): string {
  if (!text) return text;

  // Remove common instruction patterns
  const patterns = [
    /^Start with ['"]?[^'"]*['"]?\s*/i,
    /^Begin with\s+/i,
    /^Open with\s+/i,
    /^Create (a|an)\s+/i,
    /^Write (a|an)\s+/i,
    /^Make (a|an)\s+/i,
    /^Build (a|an)\s+/i,
    /^Use (a|an)\s+/i,
    /^Try (a|an)\s+/i,
    /^Consider (a|an)\s+/i,
    /^Post (a|an)\s+/i,
    /^Share (a|an)\s+/i,
    /^Show (a|an)\s+/i,
  ];

  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // If we removed something, capitalize the first letter
  if (cleaned !== text && cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Generate synapses using simple single-model approach
 */
export async function generateSynapses(
  input: SynapseInput
): Promise<SynapseResult> {
  const startTime = Date.now();
  console.log(`[Synapse] Starting generation for ${input.business.name}...`);

  // ==========================================================================
  // STEP 1: Calculate Cost Equivalences
  // ==========================================================================
  console.log('[Synapse] Step 1: Calculating cost equivalences...');

  const services = input.business.services || getIndustryExamples(input.business.industry);
  const costEquivalences = services.length > 0
    ? services.map(service => calculateCostEquivalences(service))
    : [];

  const costEquivalenceText = costEquivalences.length > 0
    ? costEquivalences.map(eq => formatCostEquivalences(eq)).join('\n\n')
    : 'No service costs provided for equivalence calculation.';

  console.log(`[Synapse] Found ${costEquivalences.length} cost equivalence sets`);

  // ==========================================================================
  // STEP 2: Generate Semantic Connection Hints
  // ==========================================================================
  console.log('[Synapse] Step 2: Generating connection hints...');

  const dataSources = createDataSourcesFromIntelligence(input.intelligence);
  const connectionResult = await generateConnectionHints(dataSources, {
    minSimilarity: 0.65,
    maxHints: 5,
    prioritizeCrossDomain: true
  });

  const connectionHintText = formatHintsForPrompt(connectionResult);
  console.log(`[Synapse] Found ${connectionResult.hints.length} connection hints`);

  // ==========================================================================
  // STEP 3: Build Comprehensive Data Context
  // ==========================================================================
  console.log('[Synapse] Step 3: Building data context...');

  const dataContext = buildDataContext(input.intelligence);

  // ==========================================================================
  // STEP 4: Build Synapse Prompt
  // ==========================================================================
  console.log('[Synapse] Step 4: Building prompt...');

  const prompt = buildSynapsePrompt({
    business: input.business,
    dataContext,
    costEquivalenceText,
    connectionHintText
  });

  // ==========================================================================
  // STEP 5: Call Claude 3.5 Sonnet
  // ==========================================================================
  console.log('[Synapse] Step 5: Calling Claude 3.5 Sonnet...');

  const claudeResponse = await callClaude(prompt);

  // ==========================================================================
  // STEP 6: Parse Response into Synapses
  // ==========================================================================
  console.log('[Synapse] Step 6: Parsing response...');

  const synapses = parseClaudeResponse(claudeResponse, input.business);

  const generationTimeMs = Date.now() - startTime;
  const totalCost = connectionResult.cost + (claudeResponse.usage?.total_tokens || 0) * 0.000015; // Sonnet pricing

  console.log(`[Synapse] ✓ Generated ${synapses.length} synapses in ${generationTimeMs}ms`);
  console.log(`[Synapse] Total cost: $${totalCost.toFixed(4)}`);

  return {
    synapses,
    metadata: {
      generationTimeMs,
      costEquivalencesUsed: costEquivalences.length,
      connectionHintsUsed: connectionResult.hints.length,
      totalCost,
      model: 'claude-3-5-sonnet-20241022'
    }
  };
}

/**
 * Build data context from intelligence
 */
function buildDataContext(intelligence: any): string {
  let context = '';

  // Weather
  if (intelligence.realTimeSignals?.weather?.triggers) {
    context += '### Weather Context\n';
    for (const trigger of intelligence.realTimeSignals.weather.triggers.slice(0, 3)) {
      context += `- ${trigger.type}: ${trigger.description}\n`;
    }
    context += '\n';
  }

  // Local Events
  if (intelligence.localIntelligence?.localEvents) {
    context += '### Local Events\n';
    for (const event of intelligence.localIntelligence.localEvents.slice(0, 5)) {
      context += `- ${event.title} (${event.date}): ${event.relevance || ''}\n`;
    }
    context += '\n';
  }

  // Review Pain Points
  if (intelligence.reviewData?.painPoints) {
    context += '### Customer Pain Points (from reviews)\n';
    for (const pain of intelligence.reviewData.painPoints.slice(0, 5)) {
      context += `- ${pain.concern || pain}\n`;
    }
    context += '\n';
  }

  // Trending Topics
  if (intelligence.culturalSnapshot?.trendingTopics) {
    context += '### Trending Topics\n';
    for (const topic of intelligence.culturalSnapshot.trendingTopics.slice(0, 5)) {
      context += `- ${topic.term || topic} (${topic.volume || 'N/A'} mentions)\n`;
    }
    context += '\n';
  }

  // Search Keywords
  if (intelligence.searchData?.opportunityKeywords) {
    context += '### Search Opportunity Keywords\n';
    for (const kw of intelligence.searchData.opportunityKeywords.slice(0, 5)) {
      context += `- ${kw.keyword || kw} (position ${kw.position || 'N/A'})\n`;
    }
    context += '\n';
  }

  // Competitive Gaps
  if (intelligence.competitive?.contentGaps) {
    context += '### What Competitors Are Missing\n';
    for (const gap of intelligence.competitive.contentGaps.slice(0, 5)) {
      context += `- ${gap.gap || gap}\n`;
    }
    context += '\n';
  }

  return context || 'No real-time intelligence data available.';
}

/**
 * Build the synapse prompt
 */
function buildSynapsePrompt(params: {
  business: any;
  dataContext: string;
  costEquivalenceText: string;
  connectionHintText: string;
}): string {
  return `You are a viral content strategist who creates ENTERTAINING, CULTURALLY-RELEVANT content that makes people say "this is SO good I need to share it!"

Your job is to find the FUN, SURPRISING, CULTURAL angle - NOT the boring business case.

BUSINESS: ${params.business.name} (${params.business.industry})
LOCATION: ${params.business.location.city}, ${params.business.location.state}

${params.dataContext}

${params.costEquivalenceText}

${params.connectionHintText}

---

YOUR TASK: Generate 3 ENTERTAINING content ideas that connect this business to culture, trends, or unexpected moments.

WHAT MAKES GREAT CONTENT (LEARN FROM THESE):

For a Coffee Cart:
❌ "Wedding venues charge 3x markup on coffee" (boring ROI talk)
✅ "That TikTok sound everyone's using at weddings? We time the coffee service drop to THAT moment - couples lose their minds" (cultural + fun)

For a Mobile Barista:
❌ "Save 40 minutes of productivity with coffee delivery" (boring business case)
✅ "Your Zoom background is giving 'forgot to make coffee again' energy - we pull up mid-meeting and become the hero of the call" (relatable + entertaining)

For an Event Coffee Service:
❌ "Professional coffee service increases attendee satisfaction" (yawn)
✅ "Corporate events where someone brings their own ceramic mug have 73% better networking - we're making it a thing in Dallas" (quirky data + trend-starting)

RULES FOR BREAKTHROUGH CONTENT:
1. ✅ CULTURAL CONNECTIONS - TikTok sounds, viral moments, trending topics, memes
2. ✅ FUN & ENTERTAINING - Make people smile, not calculate ROI
3. ✅ RELATABLE MOMENTS - "This is so me" reactions
4. ✅ SURPRISING TRUTHS - Counter-intuitive but makes sense
5. ✅ SHAREABILITY - "I need to send this to my friend"
6. ❌ NO BORING BUSINESS CASES - No "save money", "increase productivity", "ROI calculations"
7. ❌ NO GENERIC ADVICE - No "5 tips to...", "How to improve..."
8. ✅ USE REAL-TIME HOOKS - Weather, local events, trending topics, seasonal moments

CRITICAL: Your contentAngle MUST be the actual content hook, NOT instructions on how to create it.

BAD contentAngle: "Start with 'secret' Video series showing cost comparisons..."
GOOD contentAngle: "The barista at your wedding who's more popular than the bride - yes that's our cart and it's always like this"

OUTPUT FORMAT (JSON):

{
  "synapses": [
    {
      "title": "Hook-style title that captures attention",
      "insight": "The core insight (FUN/CULTURAL, not business-y)",
      "whyCounterIntuitive": "Why this goes against conventional thinking",
      "psychologyPrinciple": "The psychological/behavioral principle at work",
      "contentAngle": "THE ACTUAL CONTENT HOOK - not creation instructions",
      "expectedReaction": "What 'holy shit' or 'omg same' moment this creates",
      "dataUsed": ["weather", "trending topic", "local event", "connection", etc.],
      "confidence": 0.85
    }
  ]
}

Generate 3 synapse ideas that are ENTERTAINING and SHAREABLE. Make people want to repost them, not calculate business value.`;
}

/**
 * Call Claude 3.5 Sonnet via OpenRouter
 */
async function callClaude(prompt: string): Promise<any> {
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!openRouterKey) {
    throw new Error('No OpenRouter API key found');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://brandock-agent.app',
      'X-Title': 'MARBA.ai Synapse Generator'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      max_tokens: 4096,
      temperature: 0.8,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  // OpenRouter returns the response in data.choices[0].message.content
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from OpenRouter');
  }

  // Return in the same format as before
  return {
    content: [{
      text: data.choices[0].message.content
    }]
  };
}

/**
 * Parse Claude response into SynapseInsight objects
 */
function parseClaudeResponse(response: any, business: any): SynapseInsight[] {
  try {
    // Extract text content
    const content = response.content[0]?.text || '';

    // Find JSON in response
    const jsonMatch = content.match(/\{[\s\S]*"synapses"[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Synapse] No JSON found in response');
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const synapses = parsed.synapses || [];

    // Convert to SynapseInsight format
    return synapses.map((bt: any, index: number) => ({
      id: `simple-${Date.now()}-${index}`,
      type: 'counter_intuitive',
      thinkingStyle: 'analytical',
      insight: cleanMetaInstructions(bt.insight || ''),
      whyProfound: bt.whyCounterIntuitive || bt.psychologyPrinciple,
      whyNow: `Based on current ${(bt.dataUsed || []).join(', ')}`,
      contentAngle: cleanMetaInstructions(bt.contentAngle || ''),
      expectedReaction: bt.expectedReaction,
      // NOTE: Don't use dataUsed as evidence - it's data SOURCES, not actual proof points
      // Leave evidence empty for now - generators will use whyProfound instead
      evidence: [],
      confidence: bt.confidence || 0.75,
      metadata: {
        generatedAt: new Date(),
        model: 'claude-3-5-sonnet-20241022',
        tokensUsed: response.usage?.total_tokens,
        generationTimeMs: 0
      },
      // Additional fields for display
      title: bt.title,
      psychologyPrinciple: bt.psychologyPrinciple,
      dataUsed: bt.dataUsed
    } as any));

  } catch (error) {
    console.error('[Synapse] Error parsing response:', error);
    return [];
  }
}
