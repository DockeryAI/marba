/**
 * Market Position Service
 * Analyzes competitive market position using real-time data
 */

import {
  type BrandData,
  type MarketPositionAnalysis,
  type MarketPositionData,
  type Competitor,
  type CompetitiveGap,
} from '@/types/mirror-diagnostics'
import { PerplexityAPI } from '@/services/uvp-wizard/perplexity-api'
import { chat } from '@/lib/openrouter'

// Initialize Perplexity API
const perplexityAPI = new PerplexityAPI()

export class MarketPositionService {
  /**
   * Run full market position analysis
   */
  static async analyzeMarketPosition(
    brandId: string,
    brandData: BrandData
  ): Promise<MarketPositionAnalysis> {
    console.log('[MarketPositionService] Starting analysis for:', brandData.name)

    try {
      // Discover real competitors
      const competitors = await this.discoverCompetitors(
        brandData.industry,
        brandData.location || '',
        brandData.name
      )

      // Get keyword rankings (mock for now, would integrate with SEO API)
      const keywordRankings = await this.getKeywordRankings(
        brandData.name,
        brandData.industry
      )

      // Find competitive gaps
      const competitiveGaps = await this.findCompetitiveGaps(
        brandData,
        competitors
      )

      // Analyze pricing position
      const pricingPosition = await this.analyzePricingPosition(
        brandData,
        competitors
      )

      // Build complete market position data
      const data: MarketPositionData = {
        current_rank: this.estimateRank(competitors, brandData.name),
        total_competitors: competitors.length,
        top_competitors: competitors.slice(0, 3),
        keyword_rankings: keywordRankings,
        competitive_gaps: competitiveGaps,
        pricing_position: pricingPosition,
      }

      // Calculate score
      const score = this.calculatePositionScore(data)

      console.log('[MarketPositionService] Analysis complete. Score:', score)

      return { score, data }
    } catch (error) {
      console.error('[MarketPositionService] Analysis failed:', error)

      // Return fallback data
      return {
        score: 50,
        data: this.getFallbackData(brandData),
      }
    }
  }

  /**
   * Discover competitors using Perplexity API
   */
  private static async discoverCompetitors(
    industry: string,
    location: string,
    brandName: string
  ): Promise<Competitor[]> {
    try {
      const query = location
        ? `top competitors in ${industry} industry in ${location}, excluding ${brandName}`
        : `top competitors in ${industry} industry, excluding ${brandName}`

      const response = await perplexityAPI.getIndustryInsights({
        query,
        context: { industry },
        max_results: 8,
      })

      // Parse response to extract competitors
      const competitors = await this.parseCompetitorsFromSearch(
        response.insights.join('\n'),
        industry
      )

      return competitors.slice(0, 8) // Return top 8
    } catch (error) {
      console.error('[MarketPositionService] Competitor discovery failed:', error)
      return this.getMockCompetitors(industry)
    }
  }

  /**
   * Parse competitors from Perplexity search results
   */
  private static async parseCompetitorsFromSearch(
    searchResponse: string,
    industry: string
  ): Promise<Competitor[]> {
    const prompt = `Extract competitor information from this search result about ${industry} companies.

For each competitor found, provide:
- name (company name)
- positioning (what they claim to be best at)
- strengths (3-5 key strengths)

Search Results:
${searchResponse}

Return ONLY valid JSON array with this structure:
[{"name":"Company","positioning":"What they claim","strengths":["Strength 1","Strength 2"]}]`

    try {
      const response = await chat(
        [{ role: 'user', content: prompt }],
        {
          temperature: 0.3,
          maxTokens: 1000,
        }
      )

      const parsed = JSON.parse(response)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('[MarketPositionService] Failed to parse competitors:', error)
      return []
    }
  }

  /**
   * Get keyword rankings (mock implementation)
   * TODO: Integrate with SEO API (SEMrush, Ahrefs, etc.)
   */
  private static async getKeywordRankings(
    brandName: string,
    industry: string
  ): Promise<Record<string, number>> {
    // Mock data for now
    const industryKeywords = {
      plumbing: [
        `${industry} near me`,
        `best ${industry}`,
        `affordable ${industry}`,
        `${industry} services`,
      ],
      default: [
        `${industry} company`,
        `${industry} services`,
        `best ${industry}`,
        `${industry} near me`,
      ],
    }

    const keywords =
      industryKeywords[industry as keyof typeof industryKeywords] ||
      industryKeywords.default

    // Mock rankings (would come from real SEO API)
    return keywords.reduce(
      (acc, keyword) => ({
        ...acc,
        [keyword]: Math.floor(Math.random() * 20) + 1,
      }),
      {}
    )
  }

  /**
   * Find competitive gaps
   */
  private static async findCompetitiveGaps(
    brandData: BrandData,
    competitors: Competitor[]
  ): Promise<CompetitiveGap[]> {
    if (competitors.length === 0) return []

    const prompt = `Analyze competitive gaps for "${brandData.name}" in the ${brandData.industry} industry.

Competitors and their strengths:
${competitors.map((c) => `- ${c.name}: ${c.strengths.join(', ')}`).join('\n')}

Identify the top 3-5 things that multiple competitors are doing that ${brandData.name} should consider.

Return ONLY valid JSON array:
[{"gap":"What's missing","impact":"Why it matters","competitors_doing":["Competitor 1","Competitor 2"]}]`

    try {
      const response = await chat(
        [{ role: 'user', content: prompt }],
        {
          temperature: 0.4,
          maxTokens: 800,
        }
      )

      const parsed = JSON.parse(response)
      return Array.isArray(parsed) ? parsed.slice(0, 5) : []
    } catch (error) {
      console.error('[MarketPositionService] Failed to find gaps:', error)
      return []
    }
  }

  /**
   * Analyze pricing position
   */
  private static async analyzePricingPosition(
    brandData: BrandData,
    competitors: Competitor[]
  ): Promise<{ tier: string; vs_market: string }> {
    // For now, return estimated tier
    // TODO: Scrape actual pricing from websites
    return {
      tier: 'mid-market',
      vs_market: 'Positioned in middle tier - not cheapest, not premium',
    }
  }

  /**
   * Estimate brand's rank among competitors
   */
  private static estimateRank(competitors: Competitor[], brandName: string): number {
    // Since we're excluding the brand from competitor search,
    // assume they're in the middle of the pack
    return Math.ceil(competitors.length / 2) + 1
  }

  /**
   * Calculate market position score (0-100)
   */
  private static calculatePositionScore(data: MarketPositionData): number {
    let score = 100

    // Penalty for low rankings
    const avgRank =
      Object.values(data.keyword_rankings).reduce((sum, rank) => sum + rank, 0) /
      Object.keys(data.keyword_rankings).length

    if (avgRank > 10) score -= 30
    else if (avgRank > 5) score -= 15

    // Penalty for many competitive gaps
    score -= data.competitive_gaps.length * 5

    // Penalty for low market position
    if (data.current_rank > 5) score -= 20
    else if (data.current_rank > 3) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Get mock competitors for development
   */
  private static getMockCompetitors(industry: string): Competitor[] {
    return [
      {
        name: `${industry} Pro`,
        url: `https://${industry.toLowerCase()}pro.com`,
        positioning: '24/7 emergency service with lifetime guarantees',
        strengths: [
          'Licensed and bonded',
          'Fast response time',
          'Money-back guarantee',
          'Transparent pricing',
        ],
      },
      {
        name: `Quick ${industry}`,
        url: `https://quick${industry.toLowerCase()}.com`,
        positioning: 'Same-day service specialists',
        strengths: [
          'Same-day availability',
          'Upfront pricing',
          'Highly rated',
          'Family owned',
        ],
      },
      {
        name: `Elite ${industry} Services`,
        url: `https://elite${industry.toLowerCase()}.com`,
        positioning: 'Premium service for discerning customers',
        strengths: [
          'Master-level expertise',
          'White-glove service',
          'Premium materials',
          'Concierge support',
        ],
      },
    ]
  }

  /**
   * Fallback data for when analysis fails
   */
  private static getFallbackData(brandData: BrandData): MarketPositionData {
    return {
      current_rank: 6,
      total_competitors: 8,
      top_competitors: this.getMockCompetitors(brandData.industry),
      keyword_rankings: {
        [`${brandData.industry} near me`]: 8,
        [`best ${brandData.industry}`]: 12,
        [`${brandData.industry} services`]: 6,
      },
      competitive_gaps: [
        {
          gap: 'No online booking system',
          impact: 'Losing customers who want instant scheduling',
          competitors_doing: ['Quick Plumbing', 'Plumbing Pro'],
        },
        {
          gap: 'Limited service guarantee',
          impact: 'Customers choosing competitors with stronger guarantees',
          competitors_doing: ['Elite Plumbing Services', 'Plumbing Pro'],
        },
      ],
      pricing_position: {
        tier: 'mid-market',
        vs_market: 'Positioned in middle tier - competitive but not premium',
      },
    }
  }
}
