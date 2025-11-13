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
  type BusinessModelDetection,
} from '@/types/mirror-diagnostics'
import { PerplexityAPI } from '@/services/uvp-wizard/perplexity-api'
import { chat } from '@/lib/openrouter'
import { SemrushAPI } from '@/services/intelligence/semrush-api'
import { BusinessModelDetectorService } from './business-model-detector.service'

// Initialize APIs
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
      // Detect brand's business model
      const brandModel = await BusinessModelDetectorService.detectBusinessModel(brandData)
      console.log('[MarketPosition] Brand classified as:', brandModel.model)

      // Discover real competitors
      let competitors = await this.discoverCompetitors(
        brandData.industry,
        brandData.location || '',
        brandData.name
      )

      // Classify each competitor's business model
      console.log('[MarketPosition] Classifying', competitors.length, 'competitors...')
      const classifiedCompetitors = await Promise.all(
        competitors.map(async (competitor) => {
          try {
            const competitorModel = await BusinessModelDetectorService.classifyCompetitor(
              competitor.name,
              brandData.industry
            )
            return {
              ...competitor,
              business_model: competitorModel.model,
              size_indicator: competitorModel.signals[0] || 'Unknown size',
            }
          } catch (error) {
            console.error('[MarketPosition] Failed to classify:', competitor.name)
            return competitor
          }
        })
      )

      // Filter to only relevant competitors (same size category)
      const relevantCompetitors = BusinessModelDetectorService.filterRelevantCompetitors(
        brandModel.model,
        classifiedCompetitors
      )

      console.log(
        '[MarketPosition] Filtered from',
        classifiedCompetitors.length,
        'to',
        relevantCompetitors.length,
        'relevant competitors'
      )

      // Get detailed keyword rankings from Semrush
      const keywordRankingsDetailed = await this.getDetailedKeywordRankings(
        brandData.name,
        brandData.website
      )

      // Create legacy format for backwards compatibility
      const keywordRankings: Record<string, number> = {}
      keywordRankingsDetailed.forEach((kw) => {
        keywordRankings[kw.keyword] = kw.position
      })

      // Find SMB-actionable competitive gaps
      const competitiveGaps = await this.findCompetitiveGaps(
        brandData,
        relevantCompetitors,
        brandModel.model
      )

      // Analyze pricing position
      const pricingPosition = await this.analyzePricingPosition(
        brandData,
        relevantCompetitors
      )

      // Build complete market position data
      const data: MarketPositionData = {
        current_rank: this.estimateRank(relevantCompetitors, brandData.name),
        total_competitors: relevantCompetitors.length,
        top_competitors: relevantCompetitors.slice(0, 3),
        keyword_rankings: keywordRankings,
        keyword_rankings_detailed: keywordRankingsDetailed,
        competitive_gaps: competitiveGaps,
        pricing_position: pricingPosition,
      }

      // Calculate score
      const score = this.calculatePositionScore(data)

      console.log('[MarketPositionService] Analysis complete. Score:', score)

      return { score, data }
    } catch (error) {
      console.error('[MarketPositionService] Analysis failed:', error)
      throw new Error(`Market Position analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      throw new Error(`Failed to discover competitors: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
   * Get detailed keyword rankings with volume, difficulty, and trend
   */
  private static async getDetailedKeywordRankings(
    brandName: string,
    brandWebsite?: string
  ): Promise<import('@/types/mirror-diagnostics').KeywordRankingSimple[]> {
    if (!brandWebsite) {
      throw new Error('Website/domain is required to fetch keyword rankings from Semrush')
    }

    try {
      // Extract domain from URL
      const domain = brandWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]

      console.log('[MarketPosition] Fetching detailed keyword rankings for domain:', domain)

      // Get detailed rankings from Semrush (filters out branded keywords)
      const rankings = await SemrushAPI.getDetailedKeywordMetrics(domain, brandName, 20)

      if (rankings.length === 0) {
        throw new Error(`No keyword ranking data available for domain: ${domain}`)
      }

      // Convert to simple format for storage
      const simpleRankings = rankings.map((ranking) => ({
        keyword: ranking.keyword,
        position: ranking.position,
        searchVolume: ranking.searchVolume,
        difficulty: ranking.difficulty,
        traffic: ranking.traffic,
        trend: ranking.trend,
      }))

      console.log('[MarketPosition] Found', simpleRankings.length, 'detailed keyword rankings')
      return simpleRankings
    } catch (error) {
      console.error('[MarketPosition] Failed to fetch keyword rankings:', error)
      throw new Error(`Failed to fetch keyword rankings from Semrush: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get keyword rankings from Semrush API (legacy format)
   * @deprecated Use getDetailedKeywordRankings instead
   */
  private static async getKeywordRankings(
    brandName: string,
    brandWebsite?: string
  ): Promise<Record<string, number>> {
    if (!brandWebsite) {
      throw new Error('Website/domain is required to fetch keyword rankings from Semrush')
    }

    try {
      // Extract domain from URL
      const domain = brandWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]

      console.log('[MarketPosition] Fetching keyword rankings for domain:', domain)

      // Get rankings from Semrush (filters out branded keywords)
      const rankings = await SemrushAPI.getKeywordRankings(domain, brandName)

      if (rankings.length === 0) {
        throw new Error(`No keyword ranking data available for domain: ${domain}`)
      }

      // Convert to Record<keyword, position> format
      const keywordMap: Record<string, number> = {}
      rankings.slice(0, 20).forEach(ranking => {
        keywordMap[ranking.keyword] = ranking.position
      })

      console.log('[MarketPosition] Found', Object.keys(keywordMap).length, 'keyword rankings')
      return keywordMap
    } catch (error) {
      console.error('[MarketPosition] Failed to fetch keyword rankings:', error)
      throw new Error(`Failed to fetch keyword rankings from Semrush: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Find SMB-actionable competitive gaps
   */
  private static async findCompetitiveGaps(
    brandData: BrandData,
    competitors: Competitor[],
    businessModel: string
  ): Promise<CompetitiveGap[]> {
    if (competitors.length === 0) return []

    // Define SMB-actionable gap categories based on business model
    const smbFocusAreas = this.getSMBFocusAreas(businessModel)

    const prompt = `Analyze competitive gaps for "${brandData.name}", a ${businessModel} business in the ${brandData.industry} industry.

Competitors (similar size businesses):
${competitors.map((c) => `- ${c.name} (${c.size_indicator || 'similar size'}): ${c.strengths.join(', ')}`).join('\n')}

Focus on SMB-ACTIONABLE gaps that a ${businessModel} can realistically implement:
${smbFocusAreas.map(area => `- ${area}`).join('\n')}

Avoid suggesting things that require enterprise resources (massive budgets, large teams, complex software platforms).

Identify the top 3-5 actionable gaps that multiple similar-sized competitors are exploiting.

Return ONLY valid JSON array:
[{"gap":"Specific actionable thing missing","impact":"Business impact for SMB","competitors_doing":["Competitor 1","Competitor 2"]}]`

    try {
      const response = await chat(
        [{ role: 'user', content: prompt }],
        {
          temperature: 0.4,
          maxTokens: 1000,
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
   * Get SMB-focused areas based on business model
   */
  private static getSMBFocusAreas(businessModel: string): string[] {
    const commonAreas = [
      'Online booking/scheduling',
      'Weekend/evening hours',
      'Specialized services/niches',
      'Response time commitments',
      'Service guarantees',
      'Local community presence',
      'Review generation systems',
      'Referral programs',
      'Content marketing (blog, videos)',
      'Local SEO optimization',
    ]

    if (businessModel === 'solo-practitioner' || businessModel === 'small-local') {
      return [
        'Faster response times (same-day, 24hr)',
        'Niche specialization',
        'Flexible hours (evenings, weekends)',
        'Personal touch/white glove service',
        'Active social media presence',
        'Google My Business optimization',
        'Local partnerships',
        'Free consultations/assessments',
        ...commonAreas.slice(0, 5),
      ]
    }

    if (businessModel === 'multi-location' || businessModel === 'regional') {
      return [
        'Consistent service across locations',
        'Franchise/multi-location management',
        'Brand consistency',
        'Employee training programs',
        'Regional marketing campaigns',
        ...commonAreas,
      ]
    }

    return commonAreas
  }

  /**
   * Analyze pricing position
   */
  private static async analyzePricingPosition(
    brandData: BrandData,
    competitors: Competitor[]
  ): Promise<{ tier: 'budget' | 'mid-market' | 'premium' | 'luxury'; vs_market: string }> {
    // For now, return estimated tier
    // TODO: Scrape actual pricing from websites
    return {
      tier: 'mid-market' as const,
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
