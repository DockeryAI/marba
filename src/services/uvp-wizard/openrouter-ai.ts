/**
 * OpenRouter AI Service for UVP Wizard
 *
 * Uses premium LLMs via OpenRouter for highest quality industry-specific suggestions
 */

import { DraggableSuggestion, SuggestionType } from '@/types/uvp-wizard'
import { getIndustryEQ, adjustSuggestionPrompt } from './emotional-quotient'

interface IndustryContext {
  industry?: string
  brandName?: string
  website?: string
  websiteData?: any
  services?: string[]
  products?: string[]
  competitors?: string[]
  naicsCode?: string
}

// Best models for marketing/UVP content generation
const MODELS = {
  CLAUDE_OPUS_41: 'anthropic/claude-opus-4.1', // Claude Opus 4.1 - HIGHEST QUALITY
  CLAUDE_35_SONNET: 'anthropic/claude-3.5-sonnet-20240620', // Claude 3.5 Sonnet
  CLAUDE_SONNET: 'anthropic/claude-3.5-sonnet', // Claude 3.5 Sonnet
  GPT4_TURBO: 'openai/gpt-4-turbo', // Excellent structured reasoning
  // DEPRECATED - DO NOT USE
  // CLAUDE_OPUS: 'anthropic/claude-3-opus-20240229', // OLD VERSION - USE OPUS 4.1 INSTEAD
  MISTRAL_LARGE: 'mistralai/mistral-large', // Good cost/performance ratio
}

class OpenRouterAI {
  private apiKey: string
  private endpoint = 'https://openrouter.ai/api/v1/chat/completions'
  private model = MODELS.CLAUDE_OPUS_41 // Using Claude Opus 4.1 - HIGHEST QUALITY

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || ''
    console.log('[OpenRouterAI] Initialized with Claude Opus 4.1 - HIGHEST QUALITY:', {
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey.length,
      model: this.model,
      endpoint: this.endpoint
    })
  }

  /**
   * Generate industry-specific customer segments
   */
  async generateCustomerSegments(context: IndustryContext): Promise<DraggableSuggestion[]> {
    const industry = context.industry || 'Real Estate'
    console.log('[OpenRouterAI] generateCustomerSegments called with:', context)

    try {
      if (this.apiKey) {
        console.log('[OpenRouterAI] Making API call to Claude Opus 4.1...')
        const prompt = `You are a marketing strategist for the ${industry} industry.

${context.websiteData ? `Based on their website data: ${JSON.stringify(context.websiteData.services || [])}` : ''}

Generate 5 BROAD, MARKETABLE customer categories. Each should:
- Be a GENERAL category you can actually market to (e.g., "luxury buyers", "first-time customers", "repeat clients")
- Have enough market size to be worth targeting
- NOT be overly specific (avoid narrow demographics like "divorced women aged 45-60")
- Focus on buying behavior and general life situations
- Be 1 sentence describing a broad market segment

Format your response as a JSON array of exactly 5 strings. Keep them BROAD and MARKETABLE.`

        const suggestions = await this.callOpenRouter(prompt)
        console.log('[OpenRouterAI] API Response - suggestions:', suggestions)
        const formatted = this.formatSuggestions(suggestions, 'customer-segment')
        console.log('[OpenRouterAI] Formatted suggestions:', formatted)
        return formatted
      } else {
        console.log('[OpenRouterAI] No API key found, using fallback')
      }
    } catch (error) {
      console.error('[OpenRouterAI] API call failed:', error)
    }

    // Fallback to industry-specific templates
    console.log('[OpenRouterAI] Using fallback suggestions for:', industry)
    const fallback = this.getIndustryCustomerSegments(industry)
    console.log('[OpenRouterAI] Fallback suggestions:', fallback)
    return fallback
  }

  /**
   * Generate industry-specific problems (JTBD-centric)
   */
  async generateCustomerProblems(
    context: IndustryContext,
    targetCustomer: string
  ): Promise<DraggableSuggestion[]> {
    const industry = context.industry || 'Real Estate'
    const eq = await getIndustryEQ(industry, context.naicsCode)

    try {
      if (this.apiKey) {
        console.log('[OpenRouterAI] Generating problems with Brandock-calibrated EQ:', eq.emotional_weight, 'for', industry)

        let prompt = `You are a world-class Jobs-to-be-Done (JTBD) researcher specializing in the ${industry} industry.

Industry context: ${eq.purchase_mindset}
Emotional weight: ${eq.emotional_weight}% (${eq.emotional_weight > 70 ? 'Highly emotional' : eq.emotional_weight > 40 ? 'Mixed rational/emotional' : 'Primarily rational'})
Business location: ${context.brandName ? 'This is a local business - avoid geographic-specific scenarios (no mountains, oceans, etc)' : ''}

For this specific customer segment: "${targetCustomer}"

Generate 5 deep, JTBD-focused emotional desires and aspirations. Each should:`

        // Adjust based on emotional quotient
        if (eq.emotional_weight > 70) {
          prompt += `
- Focus on the emotional ASPIRATION - what they want to FEEL or BECOME
- Describe the transformation they're seeking in their identity or status
- Use "wanting", "yearning", "craving", "desiring" language to show aspirations
- Focus on emotional end-states: confidence, peace of mind, pride, control, freedom
- Avoid specific scenarios - keep it conceptual and universally applicable
- NO geographic specifics, numbers, or situational details`
        } else if (eq.emotional_weight > 40) {
          prompt += `
- Balance emotional frustration with practical challenges
- Show both personal impact and operational difficulties (without specific numbers)
- Reveal the underlying job they're trying to get done
- Include both feelings and general impacts
- Connect to their goals and aspirations
- AVOID specific metrics - use concepts like "significant time lost", "unnecessary costs", "missed opportunities"`
        } else {
          prompt += `
- Focus on operational challenges and inefficiencies
- Describe the TYPE of impact (time constraints, resource waste, process bottlenecks)
- Show clear cause-and-effect relationships
- Use precise language about problems without invented metrics
- AVOID made-up numbers - use qualitative descriptors like "excessive", "insufficient", "delayed"`
        }

        prompt += `

Remember: In ${industry}, customers are ${eq.purchase_mindset.toLowerCase()}

Format your response as a JSON array of exactly 5 strings. Each should be 1-2 powerful sentences.`

        const adjustedPrompt = adjustSuggestionPrompt(prompt, industry, 'customer-problem')
        const suggestions = await this.callOpenRouter(adjustedPrompt)
        return this.formatSuggestions(suggestions, 'problem')
      }
    } catch (error) {
      console.warn('[OpenRouterAI] API failed, using fallback:', error)
    }

    return this.getIndustryProblems(industry)
  }

  /**
   * Generate industry-specific solutions
   */
  async generateSolutions(
    context: IndustryContext,
    problem: string
  ): Promise<DraggableSuggestion[]> {
    const industry = context.industry || 'Real Estate'

    try {
      if (this.apiKey) {
        // Extract services from website data if available
        let servicesContext = ''
        if (context.websiteData) {
          const { services, products, content } = context.websiteData
          if (services?.length) {
            servicesContext = `\nTheir current services include: ${services.join(', ')}`
          } else if (content?.services) {
            servicesContext = `\nTheir website mentions: ${content.services}`
          }
        }

        // Check if we actually have website data
        const hasWebsiteData = context.websiteData && (
          context.websiteData.services?.length > 0 ||
          context.websiteData.products?.length > 0 ||
          context.websiteData.benefits?.length > 0
        )

        if (!hasWebsiteData) {
          console.warn('[OpenRouterAI] No website data available, will use industry knowledge')
        }

        const prompt = `You are a marketing strategist helping ${context.brandName || 'a business'} in the ${industry} industry.
${servicesContext}
${context.competitors?.length ? `\nKey competitors: ${context.competitors.slice(0, 3).join(', ')}` : ''}

CRITICAL RULES:
1. DO NOT make up specific program names (no "Phoenix Collection", "Heritage Circle", etc.)
2. ${hasWebsiteData ? 'Use ONLY services mentioned on their website' : 'Use GENERAL service concepts only'}
3. Keep solutions CONCEPTUAL - describe approaches, not specific offerings

For this problem: "${problem}"

Generate 5 solution CONCEPTS. Each should:
- Describe a general approach or method (not a specific made-up program)
- Focus on the transformation or outcome
- Be something ANY business in this industry could realistically offer
- NOT include made-up names or specific programs

Example: "A personalized consultation process that..." NOT "Our Phoenix Collection program..."

Format your response as a JSON array of exactly 5 conceptual solutions.`

        const suggestions = await this.callOpenRouter(prompt)
        return this.formatSuggestions(suggestions, 'solution')
      }
    } catch (error) {
      console.warn('[OpenRouterAI] API failed, using fallback:', error)
    }

    return this.getIndustrySolutions(industry)
  }

  /**
   * Generate industry-specific benefits
   */
  async generateKeyBenefits(
    context: IndustryContext,
    solution: string
  ): Promise<DraggableSuggestion[]> {
    const industry = context.industry || 'Real Estate'

    try {
      if (this.apiKey) {
        const prompt = `You are a marketing strategist helping ${context.brandName || 'a business'} in the ${industry} industry.

For this solution: "${solution}"

Generate 5 key benefit TEMPLATES that customers will experience. Each should:
- Include placeholders for metrics (use <enter number>%, <specify timeframe>, <amount>, etc.)
- Focus on OUTCOMES and TRANSFORMATIONS, not specific numbers
- Be relevant to ${industry} industry success factors
- Let the business owner fill in their actual metrics

Example formats:
- "Save <enter amount> in <specify area> costs per <timeframe>"
- "Reduce <enter metric> by <percentage>% within <timeframe>"
- "Achieve <enter result> <percentage>% faster than traditional methods"

Format your response as a JSON array of exactly 5 template strings with placeholders.`

        const suggestions = await this.callOpenRouter(prompt)
        return this.formatSuggestions(suggestions, 'benefit')
      }
    } catch (error) {
      console.warn('[OpenRouterAI] API failed, using fallback:', error)
    }

    return this.getIndustryBenefits(industry)
  }

  /**
   * Generate industry-specific differentiators
   */
  async generateDifferentiators(
    context: IndustryContext
  ): Promise<DraggableSuggestion[]> {
    const industry = context.industry || 'Real Estate'

    try {
      if (this.apiKey) {
        const competitorContext = context.competitors?.length
          ? `Key competitors include: ${context.competitors.slice(0, 5).join(', ')}.`
          : ''

        // Extract unique aspects from website if available
        let uniqueAspects = ''
        if (context.websiteData) {
          const { unique_value, differentiators, strengths } = context.websiteData
          if (unique_value) {
            uniqueAspects = `\nTheir website emphasizes: ${unique_value}`
          } else if (differentiators?.length) {
            uniqueAspects = `\nTheir current differentiators: ${differentiators.join(', ')}`
          }
        }

        const prompt = `You are a marketing strategist helping ${context.brandName || 'a business'} in the ${industry} industry.
${competitorContext}
${uniqueAspects}

Analyze their website and industry to generate 5 differentiator CONCEPTS. Each should:
- Build on what makes them unique (if website data provided)
- Be a CONCEPT or APPROACH, not a specific claim
- Include placeholders where they need to add specifics
- Focus on methods, processes, or guarantees they could offer
- Be defensible and hard to copy

Example formats:
- "The only <industry> firm that guarantees <specify guarantee>"
- "Proprietary <describe system/method> that delivers <specify outcome>"
- "Exclusive access to <specify resource/network>"

Format your response as a JSON array of exactly 5 differentiator concepts.`

        const suggestions = await this.callOpenRouter(prompt)
        return this.formatSuggestions(suggestions, 'differentiator')
      }
    } catch (error) {
      console.warn('[OpenRouterAI] API failed, using fallback:', error)
    }

    return this.getIndustryDifferentiators(industry)
  }

  /**
   * Call OpenRouter API
   */
  private async callOpenRouter(prompt: string): Promise<string[]> {
    console.log('[OpenRouterAI] Calling API with model:', this.model)

    const requestBody = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are a world-class marketing strategist and business consultant with deep expertise in value proposition development. Create highly specific, creative, and actionable suggestions that are uniquely compelling and differentiated. Each suggestion should be memorable, precise, and include concrete details that make it immediately actionable. Always respond with a valid JSON array of exactly 5 strings, no other text or formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1200,
      top_p: 0.95,
    }

    console.log('[OpenRouterAI] Request URL:', this.endpoint)

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MARBA UVP Wizard'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('[OpenRouterAI] Response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('[OpenRouterAI] API Error Response:', error)
      throw new Error(`OpenRouter API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    console.log('[OpenRouterAI] API Response data:', data)

    const content = data.choices[0].message.content
    console.log('[OpenRouterAI] Content from API:', content)

    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        console.log('[OpenRouterAI] Parsed JSON:', parsed)
        return parsed
      }
      const parsed = JSON.parse(content)
      console.log('[OpenRouterAI] Direct parsed JSON:', parsed)
      return parsed
    } catch (error) {
      // Fallback parsing if not valid JSON
      console.warn('[OpenRouterAI] Failed to parse JSON, error:', error)
      console.warn('[OpenRouterAI] Attempting text parsing of:', content)
      const fallbackParsed = content
        .split('\n')
        .filter((line: string) => line.trim().length > 10)
        .map((line: string) => line.replace(/^[\d.-]+\s*/, '').replace(/^["']|["']$/g, '').replace(/^\*\s*/, '').trim())
        .filter((line: string) => line.length > 10)
        .slice(0, 5)
      console.log('[OpenRouterAI] Fallback parsed result:', fallbackParsed)
      return fallbackParsed
    }
  }

  /**
   * Format suggestions
   */
  private formatSuggestions(
    content: string[],
    type: SuggestionType
  ): DraggableSuggestion[] {
    return content.map((text, index) => ({
      id: `${type}-ai-${Date.now()}-${index}`,
      content: text,
      type,
      source: 'ai-generated',
      confidence: 0.95,
      is_selected: false,
      is_customizable: true
    }))
  }

  // Fallback methods (same as industry-ai.ts)
  private getIndustryCustomerSegments(industry: string): DraggableSuggestion[] {
    const segments: Record<string, string[]> = {
      'Real Estate': [
        "First-time homebuyers seeking guidance through the purchase process",
        "Real estate investors looking for profitable opportunities",
        "Growing families needing more space in good school districts",
        "Downsizers transitioning to smaller, more manageable homes",
        "Luxury buyers seeking premium properties and exclusive service"
      ],
      'default': [
        "Small business owners with 5-20 employees seeking operational efficiency without enterprise complexity",
        "Department managers at mid-size companies looking to optimize team performance with limited budgets",
        "Independent professionals wanting to scale their service offerings beyond solo capacity",
        "Startup founders needing cost-effective growth solutions that scale with revenue",
        "Enterprise teams requiring better collaboration tools that integrate with existing systems"
      ]
    }

    const suggestions = segments[industry] || segments['default']
    return this.formatSuggestions(suggestions, 'customer-segment')
  }

  private getIndustryProblems(industry: string): DraggableSuggestion[] {
    const problems: Record<string, string[]> = {
      'Real Estate': [
        "Craving the freedom to focus on building meaningful client relationships instead of drowning in repetitive administrative work",
        "Yearning for confidence that every lead gets the attention they deserve, even when you're with other clients",
        "Seeking the peace of mind that comes from knowing your pricing strategy is backed by data, not just intuition",
        "Desiring seamless coordination where nothing falls through the cracks and every party stays informed",
        "Wanting to feel connected to your past clients, knowing you're top of mind when opportunities arise"
      ],
      'default': [
        "Stuck in a cycle of repetitive manual tasks that drain your energy and steal time from strategic growth",
        "The constant stress of information scattered across multiple platforms, never quite sure you have the full picture",
        "The uncertainty of making critical decisions without clear data, hoping your instincts are right",
        "Watching quality slip as you grow, torn between maintaining standards and meeting demand",
        "The frustration of sensing opportunities just out of reach, lacking the visibility to seize them"
      ]
    }

    const suggestions = problems[industry] || problems['default']
    return this.formatSuggestions(suggestions, 'problem')
  }

  private getIndustrySolutions(industry: string): DraggableSuggestion[] {
    const solutions: Record<string, string[]> = {
      'Real Estate': [
        "The only lead management system with proprietary AI that learns from your successful closings to automatically qualify and prioritize prospects better than any competitor",
        "Exclusive virtual staging technology with patented room-scanning that creates photorealistic furnished spaces in minutes - no other platform offers this speed and quality",
        "Our unique pricing algorithm combines MLS data with proprietary market sentiment analysis that competitors don't have access to, ensuring optimal listing prices",
        "The first and only transaction platform with built-in compliance checking that automatically prevents delays - something no other system offers",
        "Proprietary client relationship system that uses behavioral data to predict referral timing with uncanny accuracy - a capability exclusive to our platform"
      ],
      'default': [
        "The only platform designed from the ground up for your specific industry niche, with features competitors' generic solutions can't match",
        "Proprietary automation technology that learns from your business patterns - unlike competitors' rigid rule-based systems",
        "Exclusive access to industry benchmarking data that competitors don't provide, giving you insights others simply can't offer",
        "The only solution with true no-code customization that adapts to your unique processes without expensive consultants",
        "Our patented integration method that syncs data in real-time without the delays and errors common in competitor platforms"
      ]
    }

    const suggestions = solutions[industry] || solutions['default']
    return this.formatSuggestions(suggestions, 'solution')
  }

  private getIndustryBenefits(industry: string): DraggableSuggestion[] {
    const benefits: Record<string, string[]> = {
      'Real Estate': [
        "Close more deals by responding to every lead instantly and maintaining consistent follow-up throughout the sales cycle",
        "Dramatically reduce administrative overhead through automated workflow management and intelligent task coordination",
        "Maximize property values through strategic pricing insights and professional presentation that attracts premium buyers",
        "Build a thriving referral network by maintaining meaningful relationships with past clients long after closing",
        "Accelerate sales velocity with compelling property presentations and targeted marketing that reaches qualified buyers faster"
      ],
      'default': [
        "Reclaim valuable time each week by automating repetitive tasks and streamlining workflows",
        "Drive significant revenue growth through better insights and data-driven decision making",
        "Reduce operational costs while simultaneously improving service quality and consistency",
        "Scale your operations efficiently without proportional increases in overhead or complexity",
        "Achieve exceptional customer satisfaction through reliable and consistent service delivery"
      ]
    }

    const suggestions = benefits[industry] || benefits['default']
    return this.formatSuggestions(suggestions, 'benefit')
  }

  private getIndustryDifferentiators(industry: string): DraggableSuggestion[] {
    const differentiators: Record<string, string[]> = {
      'Real Estate': [
        "The only brokerage with guaranteed rapid response times backed by our commission-reduction promise if we don't deliver",
        "Proprietary valuation technology leveraging extensive local market data for unmatched pricing accuracy",
        "Exclusive bridge financing program that lets clients buy their dream home before selling their current one",
        "Dedicated transaction success team that handles all coordination and paperwork as part of our standard service",
        "Industry-leading satisfaction guarantee that demonstrates our complete confidence in exceeding your expectations"
      ],
      'default': [
        "Purpose-built solution designed exclusively for businesses in your specific situation and industry",
        "Proprietary technology and methodology that delivers dramatically faster results than traditional approaches",
        "Industry-leading guarantee that eliminates all risk from your decision to work with us",
        "Direct access to our leadership team for strategic guidance and priority support",
        "Completely transparent pricing model with no hidden fees or unexpected charges"
      ]
    }

    const suggestions = differentiators[industry] || differentiators['default']
    return this.formatSuggestions(suggestions, 'differentiator')
  }
}

export const openRouterAI = new OpenRouterAI()