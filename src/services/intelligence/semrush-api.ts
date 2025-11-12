/**
 * Semrush API Integration
 * SEO and competitor analysis with keyword rankings and opportunities
 */

const SEMRUSH_API_KEY = import.meta.env.VITE_SEMRUSH_API_KEY

export interface DomainOverview {
  domain: string
  organic_keywords: number
  organic_traffic: number
  paid_keywords: number
  backlinks: number
  authority_score: number
}

export interface KeywordRanking {
  keyword: string
  position: number
  searchVolume: number
  difficulty: number
  traffic: number
  url: string
  isBranded: boolean // New: flag for brand name keywords
}

export interface KeywordOpportunity {
  keyword: string
  searchVolume: number
  difficulty: number
  currentPosition?: number
  estimatedTraffic: number
  opportunity: 'quick-win' | 'high-value' | 'long-term'
  reasoning: string
}

export interface SEOMetrics {
  domain: string
  overview: DomainOverview
  rankings: KeywordRanking[]
  opportunities: KeywordOpportunity[]
  competitors: string[]
  healthScore: number
}

class SemrushAPIService {
  /**
   * Get comprehensive domain overview
   */
  async getDomainOverview(domain: string): Promise<DomainOverview> {
    console.log('[Semrush] Fetching domain overview for:', domain)

    if (!SEMRUSH_API_KEY) {
      console.warn('[Semrush] No API key, using mock data')
      return this.getMockDomainOverview(domain)
    }

    try {
      const url = `https://api.semrush.com/?type=domain_ranks&key=${SEMRUSH_API_KEY}&export_columns=Ot,Oc,Or,Ad,At&domain=${domain}&database=us`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`SEMrush API error: ${response.status}`)
      }

      const text = await response.text()
      const [, data] = text.split('\n')
      if (!data) {
        throw new Error('No data returned from SEMrush')
      }

      const [traffic, keywords, cost, ads, backlinks] = data.split(';')

      return {
        domain,
        organic_keywords: parseInt(keywords) || 0,
        organic_traffic: parseInt(traffic) || 0,
        paid_keywords: parseInt(ads) || 0,
        backlinks: parseInt(backlinks) || 0,
        authority_score: Math.min(100, Math.round((parseInt(backlinks) || 0) / 100))
      }
    } catch (error) {
      console.error('[Semrush API] Error:', error)
      return this.getMockDomainOverview(domain)
    }
  }

  /**
   * Get keyword rankings (excluding brand name keywords)
   */
  async getKeywordRankings(domain: string, brandName?: string): Promise<KeywordRanking[]> {
    console.log('[Semrush] Fetching keyword rankings for:', domain)

    if (!SEMRUSH_API_KEY) {
      return this.getMockKeywordRankings(domain, brandName)
    }

    try {
      const url = `https://api.semrush.com/?type=domain_organic&key=${SEMRUSH_API_KEY}&export_columns=Ph,Po,Nq,Cp,Ur,Tr&domain=${domain}&database=us&display_limit=100`
      const response = await fetch(url)
      const text = await response.text()
      const lines = text.split('\n').slice(1) // Skip header

      const rankings: KeywordRanking[] = lines
        .filter(line => line.trim())
        .map(line => {
          const [keyword, position, volume, cpc, url, traffic] = line.split(';')
          const isBranded = brandName
            ? keyword.toLowerCase().includes(brandName.toLowerCase())
            : false

          return {
            keyword: keyword || '',
            position: parseInt(position) || 0,
            searchVolume: parseInt(volume) || 0,
            difficulty: this.estimateDifficulty(parseInt(volume) || 0),
            traffic: parseInt(traffic) || 0,
            url: url || '',
            isBranded,
          }
        })
        .filter(r => r.keyword && !r.isBranded) // Exclude brand name keywords

      console.log('[Semrush] Found', rankings.length, 'non-branded keyword rankings')
      return rankings
    } catch (error) {
      console.error('[Semrush] Error fetching rankings:', error)
      return this.getMockKeywordRankings(domain, brandName)
    }
  }

  /**
   * Identify keyword opportunities based on rankings
   */
  async getKeywordOpportunities(
    domain: string,
    brandName?: string
  ): Promise<KeywordOpportunity[]> {
    console.log('[Semrush] Finding keyword opportunities for:', domain)

    const rankings = await this.getKeywordRankings(domain, brandName)
    const opportunities: KeywordOpportunity[] = []

    for (const ranking of rankings) {
      // Quick wins: position 11-20, decent volume
      if (ranking.position >= 11 && ranking.position <= 20 && ranking.searchVolume >= 100) {
        opportunities.push({
          keyword: ranking.keyword,
          searchVolume: ranking.searchVolume,
          difficulty: ranking.difficulty,
          currentPosition: ranking.position,
          estimatedTraffic: Math.round(ranking.searchVolume * 0.15), // Estimated traffic if we rank #1
          opportunity: 'quick-win',
          reasoning: `Currently ranked #${ranking.position} - just outside page 1. With optimization, could reach top 10.`,
        })
      }

      // High value: high volume, not ranked yet or ranked low
      if (ranking.searchVolume >= 1000 && (!ranking.position || ranking.position > 50)) {
        opportunities.push({
          keyword: ranking.keyword,
          searchVolume: ranking.searchVolume,
          difficulty: ranking.difficulty,
          currentPosition: ranking.position || undefined,
          estimatedTraffic: Math.round(ranking.searchVolume * 0.20),
          opportunity: 'high-value',
          reasoning: `High search volume (${ranking.searchVolume}/mo) with room for improvement.`,
        })
      }

      // Long-term: position 21-50, high difficulty
      if (ranking.position >= 21 && ranking.position <= 50 && ranking.difficulty >= 60) {
        opportunities.push({
          keyword: ranking.keyword,
          searchVolume: ranking.searchVolume,
          difficulty: ranking.difficulty,
          currentPosition: ranking.position,
          estimatedTraffic: Math.round(ranking.searchVolume * 0.10),
          opportunity: 'long-term',
          reasoning: `Competitive keyword but you already have some authority. Build content consistently.`,
        })
      }
    }

    // Sort by estimated traffic potential
    opportunities.sort((a, b) => b.estimatedTraffic - a.estimatedTraffic)

    console.log('[Semrush] Found', opportunities.length, 'keyword opportunities')
    return opportunities.slice(0, 20) // Top 20 opportunities
  }

  /**
   * Get comprehensive SEO metrics
   */
  async getComprehensiveSEOMetrics(
    domain: string,
    brandName?: string
  ): Promise<SEOMetrics> {
    console.log('[Semrush] Fetching comprehensive SEO metrics for:', domain)

    const [overview, rankings, opportunities] = await Promise.all([
      this.getDomainOverview(domain),
      this.getKeywordRankings(domain, brandName),
      this.getKeywordOpportunities(domain, brandName),
    ])

    // Calculate SEO health score
    const healthScore = this.calculateSEOHealth(overview, rankings)

    return {
      domain,
      overview,
      rankings: rankings.slice(0, 50), // Top 50 rankings
      opportunities,
      competitors: [], // Will be populated by competitor discovery service
      healthScore,
    }
  }

  /**
   * Legacy method for compatibility
   */
  async getCompetitorKeywords(domain: string): Promise<string[]> {
    const rankings = await this.getKeywordRankings(domain)
    return rankings.slice(0, 10).map(r => r.keyword)
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private estimateDifficulty(searchVolume: number): number {
    if (searchVolume < 100) return 20
    if (searchVolume < 500) return 35
    if (searchVolume < 1000) return 50
    if (searchVolume < 5000) return 65
    if (searchVolume < 10000) return 75
    return 85
  }

  private calculateSEOHealth(overview: DomainOverview, rankings: KeywordRanking[]): number {
    let score = 0

    // Authority score (40 points)
    score += Math.min(40, overview.authority_score * 0.4)

    // Keyword rankings (30 points)
    const top10Rankings = rankings.filter(r => r.position <= 10).length
    score += Math.min(30, top10Rankings * 2)

    // Backlinks (20 points)
    if (overview.backlinks > 10000) score += 20
    else if (overview.backlinks > 5000) score += 15
    else if (overview.backlinks > 1000) score += 10
    else if (overview.backlinks > 100) score += 5

    // Traffic (10 points)
    if (overview.organic_traffic > 100000) score += 10
    else if (overview.organic_traffic > 50000) score += 7
    else if (overview.organic_traffic > 10000) score += 5
    else if (overview.organic_traffic > 1000) score += 2

    return Math.round(score)
  }

  private getMockDomainOverview(domain: string): DomainOverview {
    return {
      domain,
      organic_keywords: 1250,
      organic_traffic: 25000,
      paid_keywords: 45,
      backlinks: 3420,
      authority_score: 58,
    }
  }

  private getMockKeywordRankings(domain: string, brandName?: string): KeywordRanking[] {
    const mockKeywords = [
      { keyword: 'business consulting services', position: 8, volume: 2400, traffic: 180 },
      { keyword: 'small business consulting', position: 12, volume: 1800, traffic: 90 },
      { keyword: 'strategic planning consultant', position: 15, volume: 1200, traffic: 60 },
      { keyword: 'business growth strategies', position: 6, volume: 3200, traffic: 280 },
      { keyword: 'consulting firm near me', position: 22, volume: 890, traffic: 20 },
      { keyword: 'business advisor', position: 18, volume: 1600, traffic: 40 },
      { keyword: 'management consulting', position: 45, volume: 8900, traffic: 15 },
      { keyword: 'business development services', position: 11, volume: 2100, traffic: 95 },
      { keyword: 'startup consulting', position: 9, volume: 1900, traffic: 140 },
      { keyword: 'executive coaching', position: 28, volume: 3400, traffic: 25 },
    ]

    return mockKeywords.map(k => ({
      ...k,
      searchVolume: k.volume,
      difficulty: this.estimateDifficulty(k.volume),
      url: `https://${domain}/services`,
      isBranded: brandName ? k.keyword.toLowerCase().includes(brandName.toLowerCase()) : false,
    }))
  }
}

export const SemrushAPI = new SemrushAPIService()
