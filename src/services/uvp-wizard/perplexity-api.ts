/**
 * Perplexity API Service for UVP Wizard
 *
 * Provides real-time industry insights, market research, and competitive intelligence
 * using Claude via Supabase edge function.
 * Routes through Supabase edge function to hide API keys.
 *
 * This service helps generate UVP suggestions based on:
 * - Industry trends and best practices
 * - Customer pain points and needs
 * - Competitive differentiation opportunities
 * - Market positioning insights
 */

import { supabase } from '@/lib/supabase'
import {
  PerplexityRequest,
  PerplexityResponse,
  DraggableSuggestion,
  SuggestionType,
} from '@/types/uvp-wizard'

/**
 * Perplexity API configuration
 */
interface PerplexityConfig {
  maxTokens: number
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: PerplexityConfig = {
  maxTokens: 2000,
}

/**
 * Generate a unique ID using crypto.randomUUID or fallback
 */
function generateUniqueId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  // Fallback for environments without crypto.randomUUID
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Perplexity API service class
 */
export class PerplexityAPI {
  private config: PerplexityConfig

  constructor(config?: Partial<PerplexityConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Check if API is available (always true when using edge function)
   */
  async isAvailable(): Promise<boolean> {
    return true
  }

  /**
   * Get industry insights for a specific context
   */
  async getIndustryInsights(request: PerplexityRequest): Promise<PerplexityResponse> {
    console.log('[PerplexityAPI] Fetching industry insights:', request)

    try {
      const prompt = this.buildPrompt(request)
      const content = await this.makeRequest(prompt)

      return this.parseResponse(content)
    } catch (error) {
      console.error('[PerplexityAPI] Failed to get industry insights:', error)
      throw error
    }
  }

  /**
   * Generate customer problem suggestions
   */
  async generateCustomerProblems(
    industry: string,
    customerSegment: string
  ): Promise<DraggableSuggestion[]> {
    const request: PerplexityRequest = {
      query: `What are the top 5 most pressing problems and pain points that ${customerSegment} face in the ${industry} industry right now?`,
      context: { industry },
      max_results: 5,
    }

    const response = await this.getIndustryInsights(request)

    return response.insights.map((insight) => ({
      id: generateUniqueId('problem'),
      content: insight,
      type: 'problem' as SuggestionType,
      source: 'ai-generated',
      confidence: response.confidence,
      is_selected: false,
      is_customizable: true,
    }))
  }

  /**
   * Generate solution suggestions
   */
  async generateSolutions(
    industry: string,
    problem: string
  ): Promise<DraggableSuggestion[]> {
    const request: PerplexityRequest = {
      query: `What are the most effective solutions currently being used to solve this problem in the ${industry} industry: "${problem}"? Provide 5 specific solution approaches.`,
      context: { industry },
      max_results: 5,
    }

    const response = await this.getIndustryInsights(request)

    return response.insights.map((insight) => ({
      id: generateUniqueId('solution'),
      content: insight,
      type: 'solution' as SuggestionType,
      source: 'ai-generated',
      confidence: response.confidence,
      is_selected: false,
      is_customizable: true,
    }))
  }

  /**
   * Generate key benefit suggestions
   */
  async generateKeyBenefits(
    industry: string,
    solution: string
  ): Promise<DraggableSuggestion[]> {
    const request: PerplexityRequest = {
      query: `What are the top 5 measurable benefits that customers experience from this type of solution in the ${industry} industry: "${solution}"? Focus on tangible outcomes.`,
      context: { industry },
      max_results: 5,
    }

    const response = await this.getIndustryInsights(request)

    return response.insights.map((insight) => ({
      id: generateUniqueId('benefit'),
      content: insight,
      type: 'benefit' as SuggestionType,
      source: 'ai-generated',
      confidence: response.confidence,
      is_selected: false,
      is_customizable: true,
    }))
  }

  /**
   * Generate differentiation opportunities
   */
  async generateDifferentiators(
    industry: string,
    competitors: string[]
  ): Promise<DraggableSuggestion[]> {
    const competitorList = competitors.length > 0
      ? `Key competitors include: ${competitors.join(', ')}.`
      : ''

    const request: PerplexityRequest = {
      query: `In the ${industry} industry, what are 5 unique ways a company can differentiate itself from competitors? ${competitorList} Focus on sustainable competitive advantages.`,
      context: { industry, competitors },
      max_results: 5,
    }

    const response = await this.getIndustryInsights(request)

    return response.insights.map((insight) => ({
      id: generateUniqueId('differentiator'),
      content: insight,
      type: 'differentiator' as SuggestionType,
      source: 'ai-generated',
      confidence: response.confidence,
      is_selected: false,
      is_customizable: true,
    }))
  }

  /**
   * Get customer segment suggestions
   */
  async generateCustomerSegments(
    industry: string,
    brandName?: string
  ): Promise<DraggableSuggestion[]> {
    const brandContext = brandName ? `for a company like ${brandName}` : ''

    const request: PerplexityRequest = {
      query: `What are the 5 most valuable customer segments in the ${industry} industry ${brandContext}? Describe each segment with demographics and psychographics.`,
      context: { industry, brand_name: brandName },
      max_results: 5,
    }

    const response = await this.getIndustryInsights(request)

    return response.insights.map((insight) => ({
      id: generateUniqueId('customer'),
      content: insight,
      type: 'customer-segment' as SuggestionType,
      source: 'ai-generated',
      confidence: response.confidence,
      is_selected: false,
      is_customizable: true,
    }))
  }

  /**
   * Research competitors for context
   */
  async researchCompetitors(
    industry: string,
    brandName: string
  ): Promise<string[]> {
    const request: PerplexityRequest = {
      query: `Who are the top 10 competitors in the ${industry} industry for ${brandName}? List just the company names.`,
      context: { industry, brand_name: brandName },
      max_results: 10,
    }

    const response = await this.getIndustryInsights(request)
    return response.insights
  }

  /**
   * Build the prompt for the AI
   */
  private buildPrompt(request: PerplexityRequest): string {
    let prompt = request.query

    if (request.context) {
      const contextParts: string[] = []

      if (request.context.industry) {
        contextParts.push(`Industry: ${request.context.industry}`)
      }

      if (request.context.brand_name) {
        contextParts.push(`Brand: ${request.context.brand_name}`)
      }

      if (request.context.competitors && request.context.competitors.length > 0) {
        contextParts.push(`Competitors: ${request.context.competitors.join(', ')}`)
      }

      if (contextParts.length > 0) {
        prompt += `\n\nContext:\n${contextParts.join('\n')}`
      }
    }

    prompt += `\n\nProvide ${request.max_results || 5} specific, actionable insights. Format your response as a JSON array of strings.`

    return prompt
  }

  /**
   * Make API request via openai-proxy edge function
   */
  private async makeRequest(prompt: string): Promise<string> {
    const systemPrompt = 'You are a marketing intelligence AI. Provide current, accurate insights about industries, markets, and customer needs. Always respond with a valid JSON array of strings, nothing else.'

    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        action: 'chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        maxTokens: this.config.maxTokens,
      },
    })

    if (error) {
      throw new Error(`Perplexity API error: ${error.message}`)
    }

    if (!data?.success) {
      throw new Error(`Perplexity API error: ${data?.error || 'Unknown error'}`)
    }

    return data.content
  }

  /**
   * Parse API response into PerplexityResponse
   */
  private parseResponse(content: string): PerplexityResponse {
    let insights: string[] = []

    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(content)
      insights = Array.isArray(parsed) ? parsed : [content]
    } catch {
      console.warn('[PerplexityAPI] Failed to parse JSON, using fallback parsing')

      // Try to extract JSON array from content
      const jsonArrayMatch = content.match(/\[[\s\S]*\]/)
      if (jsonArrayMatch) {
        try {
          insights = JSON.parse(jsonArrayMatch[0])
        } catch {
          // Continue to line-based fallback
        }
      }

      // If still no insights, split by newlines and filter
      if (insights.length === 0) {
        insights = content
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.replace(/^[\d.\-•\*]+\s*/, '').trim())
          .filter((line: string) => line.length > 10)
      }
    }

    // Fixed confidence value (edge function doesn't return finish_reason)
    const confidence = 0.85

    return {
      insights,
      sources: [],
      confidence,
    }
  }
}

/**
 * Singleton instance
 */
export const perplexityAPI = new PerplexityAPI()
