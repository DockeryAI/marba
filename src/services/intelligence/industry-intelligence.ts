import { IndustryProfile, CustomerTrigger } from '@/types/intelligence.types'

/**
 * Industry Intelligence Service
 * Provides industry-specific insights, triggers, and benchmarks
 */

export class IndustryIntelligenceService {
  /**
   * Get industry profile by NAICS code or industry name
   */
  static async getIndustryProfile(
    industryIdentifier: string
  ): Promise<IndustryProfile | null> {
    // Mock implementation - in production, fetch from database or API
    // For now, return sample data based on common industries

    const profiles: Record<string, IndustryProfile> = {
      hvac: {
        naics_code: '238220',
        industry_name: 'HVAC Services',
        description: 'Heating, ventilation, and air conditioning installation and repair',
        market_size: '$120B',
        growth_rate: 4.2,
        key_trends: [
          'Smart thermostats adoption',
          'Energy efficiency regulations',
          'Seasonal demand patterns',
        ],
        customer_triggers: [
          {
            trigger: 'Extreme weather conditions',
            category: 'seasonal',
            impact_level: 'high',
            typical_solutions: ['Emergency service', '24/7 availability'],
            content_angles: ['Beat the heat', 'Stay warm this winter'],
            timing: 'Summer peaks June-Aug, Winter peaks Dec-Feb',
          },
          {
            trigger: 'Unit failure during extreme weather',
            category: 'pain_point',
            impact_level: 'high',
            typical_solutions: ['Same-day service', 'Financing options'],
            content_angles: ['Emergency AC repair', 'Don\'t freeze tonight'],
          },
        ],
        seasonality: {
          peak_months: ['June', 'July', 'August', 'December', 'January'],
          slow_months: ['March', 'April', 'September', 'October'],
          seasonal_trends: [
            {
              period: 'Summer',
              trend_description: 'AC installation and repair demand peaks',
              content_opportunities: ['Preventative maintenance', 'Energy efficiency tips'],
              expected_demand_change: 300,
            },
          ],
        },
        common_pain_points: [
          'High energy bills',
          'Inconsistent temperature',
          'Old inefficient systems',
        ],
        buying_journey_stages: [
          {
            stage: 'awareness',
            typical_duration: '1-7 days',
            key_questions: ['Why is my AC not working?', 'How much does AC repair cost?'],
            content_types: ['Educational blog posts', 'Troubleshooting guides'],
            conversion_tactics: ['Free inspection', 'Emergency hotline'],
          },
        ],
        benchmark_metrics: {
          engagement_rate_range: { min: 2, max: 8, average: 4.5 },
          posting_frequency: { min: 3, max: 10, recommended: 5 },
          response_time: { min: 1, max: 24, expected: 4 },
          content_mix: {
            'Educational': 30,
            'Promotional': 25,
            'Emergency': 20,
            'Testimonial': 15,
            'Behind-the-scenes': 10,
          },
          top_performing_formats: ['Before/after photos', 'Emergency response videos', 'Energy savings tips'],
        },
      },
      // Add more industry profiles as needed
    }

    const key = industryIdentifier.toLowerCase().replace(/\s+/g, '_')
    return profiles[key] || null
  }

  /**
   * Get active triggers for an industry based on current context
   */
  static getActiveTriggers(
    profile: IndustryProfile,
    context: {
      month?: number
      weather?: string
      localEvents?: string[]
    }
  ): CustomerTrigger[] {
    const activeTriggers: CustomerTrigger[] = []

    // Check seasonal triggers
    const currentMonth = context.month || new Date().getMonth()
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    const currentMonthName = monthNames[currentMonth]

    if (profile.seasonality.peak_months.includes(currentMonthName)) {
      activeTriggers.push(...profile.customer_triggers.filter(
        (t) => t.category === 'seasonal'
      ))
    }

    // Check weather-based triggers
    if (context.weather) {
      const weatherTriggers = profile.customer_triggers.filter(
        (t) => t.trigger.toLowerCase().includes(context.weather!.toLowerCase())
      )
      activeTriggers.push(...weatherTriggers)
    }

    // Return high-impact triggers first
    return activeTriggers.sort((a, b) => {
      const impactWeight = { high: 3, medium: 2, low: 1 }
      return impactWeight[b.impact_level] - impactWeight[a.impact_level]
    })
  }

  /**
   * Get benchmark comparison for a metric
   */
  static getBenchmarkComparison(
    profile: IndustryProfile,
    metric: string,
    actualValue: number
  ): {
    percentile: number
    status: 'below' | 'average' | 'above'
    recommendation: string
  } {
    const benchmarks = profile.benchmark_metrics

    let min = 0
    let max = 100
    let avg = 50

    // Map metric to benchmark data
    if (metric === 'engagement_rate') {
      min = benchmarks.engagement_rate_range.min
      max = benchmarks.engagement_rate_range.max
      avg = benchmarks.engagement_rate_range.average
    }

    // Calculate percentile
    const range = max - min
    const percentile = Math.min(100, Math.max(0, ((actualValue - min) / range) * 100))

    // Determine status
    let status: 'below' | 'average' | 'above' = 'average'
    if (actualValue < avg * 0.8) status = 'below'
    if (actualValue > avg * 1.2) status = 'above'

    // Generate recommendation
    let recommendation = ''
    if (status === 'below') {
      recommendation = `Your ${metric} is below industry average. Consider increasing engagement tactics.`
    } else if (status === 'above') {
      recommendation = `Great! Your ${metric} is above industry average. Keep up the good work.`
    } else {
      recommendation = `Your ${metric} is within industry norms. Room for optimization.`
    }

    return { percentile, status, recommendation }
  }
}
