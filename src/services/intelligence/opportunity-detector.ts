import {
  OpportunityInsight,
  OpportunityType,
  OpportunitySource,
  SuggestedAction,
} from '@/types/intelligence.types'
import { supabase } from '@/lib/supabase'

/**
 * Opportunity Detector Service
 * Detects marketing opportunities from various signals:
 * - Weather conditions
 * - Trending topics
 * - Competitor activity
 * - Seasonal triggers
 * - Local news/events
 */

interface DetectionConfig {
  brandId: string
  industry?: string
  location?: string
  keywords?: string[]
}

export class OpportunityDetector {
  /**
   * Detect all opportunities for a brand
   */
  static async detectOpportunities(
    config: DetectionConfig
  ): Promise<OpportunityInsight[]> {
    const opportunities: OpportunityInsight[] = []

    // Run all detectors in parallel
    const [
      weatherOpps,
      trendingOpps,
      competitorOpps,
      seasonalOpps,
      newsOpps,
    ] = await Promise.all([
      this.detectWeatherOpportunities(config),
      this.detectTrendingTopics(config),
      this.detectCompetitorActivity(config),
      this.detectSeasonalTriggers(config),
      this.detectLocalNews(config),
    ])

    opportunities.push(
      ...weatherOpps,
      ...trendingOpps,
      ...competitorOpps,
      ...seasonalOpps,
      ...newsOpps
    )

    // Sort by impact score and urgency
    return opportunities.sort((a, b) => {
      const urgencyWeight = { critical: 4, high: 3, medium: 2, low: 1 }
      const aScore = a.impact_score + urgencyWeight[a.urgency] * 10
      const bScore = b.impact_score + urgencyWeight[b.urgency] * 10
      return bScore - aScore
    })
  }

  /**
   * Detect weather-based opportunities
   */
  static async detectWeatherOpportunities(
    config: DetectionConfig
  ): Promise<OpportunityInsight[]> {
    // Mock implementation - in production, call weather API
    const opportunities: OpportunityInsight[] = []

    // Example: Hot weather for HVAC business
    if (config.industry?.includes('hvac') || config.industry?.includes('cooling')) {
      opportunities.push({
        id: `weather_${Date.now()}`,
        brand_id: config.brandId,
        type: 'weather_based',
        title: 'Heat Wave Alert - High AC Demand Expected',
        description:
          'Temperature forecast shows 7 days above 90°F. Historical data shows 300% increase in AC service calls during heat waves.',
        source: 'weather_api',
        source_data: {
          temperature: 95,
          forecast_days: 7,
          historical_correlation: 0.85,
        },
        impact_score: 85,
        urgency: 'high',
        confidence: 0.9,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        suggested_actions: [
          {
            action_type: 'create_content',
            description: 'Create urgency-based AC service promotion',
            priority: 'high',
            estimated_effort: 'low',
            potential_impact: 85,
            content_suggestions: [
              'Beat the Heat: Emergency AC Service Available Today',
              'Heat Wave Alert: Check Your AC Now Before It\'s Too Late',
              'Stay Cool: 24/7 AC Repair During This Heat Wave',
            ],
          },
          {
            action_type: 'adjust_budget',
            description: 'Increase ad spend by 50% for next 7 days',
            priority: 'high',
            estimated_effort: 'low',
            potential_impact: 70,
          },
        ],
        created_at: new Date().toISOString(),
      })
    }

    // Example: Rain for roofing business
    if (config.industry?.includes('roofing') || config.industry?.includes('construction')) {
      opportunities.push({
        id: `weather_${Date.now() + 1}`,
        brand_id: config.brandId,
        type: 'weather_based',
        title: 'Heavy Rain Expected - Roof Leak Awareness Peak',
        description:
          'Forecast shows 3 days of heavy rain. Searches for "roof repair" typically spike 400% during and after heavy rain.',
        source: 'weather_api',
        source_data: {
          precipitation: 'heavy',
          duration_days: 3,
          search_spike_correlation: 0.92,
        },
        impact_score: 75,
        urgency: 'medium',
        confidence: 0.88,
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        suggested_actions: [
          {
            action_type: 'create_content',
            description: 'Create preventative roof inspection content',
            priority: 'high',
            estimated_effort: 'low',
            potential_impact: 75,
            content_suggestions: [
              'Heavy Rain Coming: Free Roof Inspection This Week',
              'Don\'t Wait for a Leak: Pre-Storm Roof Check',
            ],
          },
        ],
        created_at: new Date().toISOString(),
      })
    }

    return opportunities
  }

  /**
   * Detect trending topics
   */
  static async detectTrendingTopics(
    config: DetectionConfig
  ): Promise<OpportunityInsight[]> {
    // Mock implementation - in production, call Google Trends API
    const opportunities: OpportunityInsight[] = []

    // Example trending topic
    opportunities.push({
      id: `trend_${Date.now()}`,
      brand_id: config.brandId,
      type: 'trending_topic',
      title: 'Trending: "Sustainable Business Practices" (+450%)',
      description:
        'Interest in sustainable business practices has spiked 450% in your industry this week. Create content to capture this trending search volume.',
      source: 'google_trends',
      source_data: {
        keyword: 'sustainable business practices',
        growth_rate: 450,
        related_keywords: ['eco-friendly', 'carbon footprint', 'green business'],
        search_volume: 12000,
      },
      impact_score: 70,
      urgency: 'high',
      confidence: 0.85,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'new',
      suggested_actions: [
        {
          action_type: 'create_content',
          description: 'Create thought leadership content on sustainability',
          priority: 'high',
          estimated_effort: 'medium',
          potential_impact: 70,
          content_suggestions: [
            'How We Reduced Our Carbon Footprint by 40%',
            '5 Sustainable Practices Every Business Should Adopt',
            'Our Journey to Becoming a Certified Green Business',
          ],
        },
      ],
      created_at: new Date().toISOString(),
    })

    return opportunities
  }

  /**
   * Detect competitor activity
   */
  static async detectCompetitorActivity(
    config: DetectionConfig
  ): Promise<OpportunityInsight[]> {
    // Mock implementation - in production, monitor competitor feeds
    const opportunities: OpportunityInsight[] = []

    opportunities.push({
      id: `competitor_${Date.now()}`,
      brand_id: config.brandId,
      type: 'competitor_move',
      title: 'Competitor Launched New Service - Respond Quickly',
      description:
        'Top competitor just announced a new premium service. This creates an opportunity to differentiate or match their offering.',
      source: 'competitor_monitoring',
      source_data: {
        competitor: 'ABC Services',
        announcement: 'Premium 24/7 support package',
        engagement: 2500,
        sentiment: 'positive',
      },
      impact_score: 65,
      urgency: 'high',
      confidence: 0.95,
      status: 'new',
      suggested_actions: [
        {
          action_type: 'create_content',
          description: 'Highlight your existing 24/7 support advantage',
          priority: 'critical',
          estimated_effort: 'low',
          potential_impact: 65,
        },
        {
          action_type: 'respond',
          description: 'Create comparison content',
          priority: 'high',
          estimated_effort: 'medium',
          potential_impact: 55,
        },
      ],
      created_at: new Date().toISOString(),
    })

    return opportunities
  }

  /**
   * Detect seasonal triggers
   */
  static async detectSeasonalTriggers(
    config: DetectionConfig
  ): Promise<OpportunityInsight[]> {
    const opportunities: OpportunityInsight[] = []

    const month = new Date().getMonth()
    const day = new Date().getDate()

    // Example: Tax season for accountants
    if (config.industry?.includes('accounting') || config.industry?.includes('tax')) {
      if (month >= 0 && month <= 3) {
        // Jan-Apr
        opportunities.push({
          id: `seasonal_${Date.now()}`,
          brand_id: config.brandId,
          type: 'seasonal_event',
          title: 'Tax Season Peak - Maximize Client Acquisition',
          description:
            'Tax season is in full swing. Historical data shows 80% of annual new client inquiries happen in Q1.',
          source: 'event_calendars',
          source_data: {
            event: 'tax_season',
            days_until_deadline: 105 - (month * 30 + day),
            historical_inquiry_rate: 0.8,
          },
          impact_score: 90,
          urgency: 'critical',
          confidence: 1.0,
          expires_at: new Date(new Date().getFullYear(), 3, 15).toISOString(),
          status: 'new',
          suggested_actions: [
            {
              action_type: 'create_content',
              description: 'Create tax deadline reminder content',
              priority: 'critical',
              estimated_effort: 'low',
              potential_impact: 90,
              content_suggestions: [
                'Only X Days Until Tax Deadline - Book Your Appointment',
                'Avoid Last-Minute Tax Stress - Schedule Today',
                'Tax Season Checklist: What You Need to File',
              ],
            },
            {
              action_type: 'adjust_budget',
              description: 'Double ad spend during peak season',
              priority: 'critical',
              estimated_effort: 'low',
              potential_impact: 85,
            },
          ],
          created_at: new Date().toISOString(),
        })
      }
    }

    return opportunities
  }

  /**
   * Detect local news opportunities
   */
  static async detectLocalNews(
    config: DetectionConfig
  ): Promise<OpportunityInsight[]> {
    // Mock implementation - in production, monitor local news APIs
    const opportunities: OpportunityInsight[] = []

    // Example: Local event
    opportunities.push({
      id: `news_${Date.now()}`,
      brand_id: config.brandId,
      type: 'local_news',
      title: 'Local Festival This Weekend - High Foot Traffic',
      description:
        'Annual city festival happening 2 blocks from your location. Expected attendance: 50,000. Opportunity for local awareness campaign.',
      source: 'news_apis',
      source_data: {
        event: 'City Summer Festival',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        attendance: 50000,
        distance: '0.2 miles',
      },
      impact_score: 60,
      urgency: 'medium',
      confidence: 0.8,
      expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'new',
      suggested_actions: [
        {
          action_type: 'create_content',
          description: 'Create festival-specific promotion',
          priority: 'medium',
          estimated_effort: 'low',
          potential_impact: 60,
          content_suggestions: [
            'Visiting the Festival? Stop By for a Special Offer',
            'Festival Weekend Special: Show Your Ticket, Get 20% Off',
          ],
        },
      ],
      created_at: new Date().toISOString(),
    })

    return opportunities
  }

  /**
   * Calculate impact score for an opportunity
   */
  static calculateImpactScore(
    reach: number,
    relevance: number,
    timeliness: number,
    confidence: number
  ): number {
    // Weighted scoring: Relevance (40%), Reach (30%), Timeliness (20%), Confidence (10%)
    return Math.round(
      relevance * 0.4 + reach * 0.3 + timeliness * 0.2 + confidence * 0.1
    )
  }

  /**
   * Calculate urgency level based on expiration
   */
  static calculateUrgency(expiresAt?: string): 'critical' | 'high' | 'medium' | 'low' {
    if (!expiresAt) return 'low'

    const hoursUntilExpiration =
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)

    if (hoursUntilExpiration < 24) return 'critical'
    if (hoursUntilExpiration < 72) return 'high'
    if (hoursUntilExpiration < 168) return 'medium'
    return 'low'
  }

  /**
   * Get active opportunities from database
   */
  static async getActiveOpportunities(
    brandId: string
  ): Promise<OpportunityInsight[]> {
    try {
      const { data, error } = await supabase
        .from('intelligence_opportunities')
        .select('*')
        .eq('brand_id', brandId)
        .in('status', ['new', 'reviewed'])
        .order('impact_score', { ascending: false })
        .limit(20)

      if (error) throw error

      return data as OpportunityInsight[]
    } catch (error) {
      console.error('Failed to get active opportunities:', error)
      return []
    }
  }

  /**
   * Save opportunity to database
   */
  static async saveOpportunity(
    opportunity: OpportunityInsight
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intelligence_opportunities')
        .insert(opportunity)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Failed to save opportunity:', error)
      return false
    }
  }

  /**
   * Dismiss opportunity
   */
  static async dismissOpportunity(opportunityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intelligence_opportunities')
        .update({ status: 'dismissed' })
        .eq('id', opportunityId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Failed to dismiss opportunity:', error)
      return false
    }
  }

  /**
   * Mark opportunity as actioned
   */
  static async markAsActioned(opportunityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intelligence_opportunities')
        .update({
          status: 'actioned',
          actioned_at: new Date().toISOString(),
        })
        .eq('id', opportunityId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Failed to mark opportunity as actioned:', error)
      return false
    }
  }
}
