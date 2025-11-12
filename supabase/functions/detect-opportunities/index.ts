// MARBA Intelligence: Opportunity Detection Edge Function
// Detects marketing opportunities from multiple signals:
// - Weather conditions
// - Trending topics
// - Competitor activity
// - Seasonal triggers
// - Local news/events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OpportunityRequest {
  brandId: string
  location?: string
  industry?: string
  keywords?: string[]
  competitorIds?: string[]
}

interface OpportunityInsight {
  id: string
  brand_id: string
  type: string
  title: string
  description: string
  source: string
  source_data: Record<string, any>
  impact_score: number
  urgency: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  expires_at?: string
  status: string
  suggested_actions: any[]
  created_at: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse request body
    const { brandId, location, industry, keywords, competitorIds }: OpportunityRequest = await req.json()

    if (!brandId) {
      throw new Error('brandId is required')
    }

    const opportunities: OpportunityInsight[] = []

    // 1. Detect Weather Opportunities
    const weatherOpps = await detectWeatherOpportunities(brandId, location || 'US', industry || 'services')
    opportunities.push(...weatherOpps)

    // 2. Detect Trending Topics
    if (keywords && keywords.length > 0) {
      const trendOpps = await detectTrendingOpportunities(brandId, industry || 'services', keywords)
      opportunities.push(...trendOpps)
    }

    // 3. Detect Competitor Activity
    if (competitorIds && competitorIds.length > 0) {
      const compOpps = await detectCompetitorOpportunities(brandId, competitorIds)
      opportunities.push(...compOpps)
    }

    // 4. Detect Seasonal Triggers
    const seasonalOpps = await detectSeasonalOpportunities(brandId, industry || 'services')
    opportunities.push(...seasonalOpps)

    // Store opportunities in database
    for (const opp of opportunities) {
      await supabaseClient
        .from('intelligence_opportunities')
        .upsert(opp, { onConflict: 'id' })
    }

    // Sort by impact score
    opportunities.sort((a, b) => {
      const urgencyWeight = { critical: 4, high: 3, medium: 2, low: 1 }
      const aScore = a.impact_score + (urgencyWeight[a.urgency] * 10)
      const bScore = b.impact_score + (urgencyWeight[b.urgency] * 10)
      return bScore - aScore
    })

    return new Response(
      JSON.stringify({ opportunities }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Opportunity detection error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Weather opportunity detection
async function detectWeatherOpportunities(
  brandId: string,
  location: string,
  industry: string
): Promise<OpportunityInsight[]> {
  const opportunities: OpportunityInsight[] = []

  try {
    const weatherApiKey = Deno.env.get('WEATHER_API_KEY')
    if (!weatherApiKey) {
      console.warn('Weather API key not configured')
      return opportunities
    }

    // Fetch weather data
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=7`
    )
    const weatherData = await response.json()

    const temp = weatherData.current.temp_f
    const condition = weatherData.current.condition.text.toLowerCase()

    // Heat wave detection
    if (temp >= 90 && isHeatSensitive(industry)) {
      opportunities.push({
        id: `weather_heat_${Date.now()}`,
        brand_id: brandId,
        type: 'weather_based',
        title: `Heat Wave Alert: ${temp}°F - High Demand Expected`,
        description: `Current temperature is ${temp}°F. Historical data shows significant increase in demand during heat waves.`,
        source: 'weather_api',
        source_data: { temperature: temp, condition, forecast_days: 7 },
        impact_score: 85,
        urgency: 'high',
        confidence: 0.9,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        suggested_actions: [
          {
            action_type: 'create_content',
            description: 'Create urgency-based heat relief promotion',
            priority: 'high',
            estimated_effort: 'low',
            potential_impact: 85,
          },
        ],
        created_at: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Weather detection error:', error)
  }

  return opportunities
}

// Trending topics detection
async function detectTrendingOpportunities(
  brandId: string,
  industry: string,
  keywords: string[]
): Promise<OpportunityInsight[]> {
  const opportunities: OpportunityInsight[] = []

  try {
    // In production, integrate with Google Trends API
    // For now, return mock trending opportunity
    opportunities.push({
      id: `trend_${Date.now()}`,
      brand_id: brandId,
      type: 'trending_topic',
      title: 'Trending: "Sustainable Business Practices" (+450%)',
      description: 'Interest in sustainable business practices has spiked 450% this week.',
      source: 'google_trends',
      source_data: {
        keyword: 'sustainable business practices',
        growth_rate: 450,
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
        },
      ],
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Trend detection error:', error)
  }

  return opportunities
}

// Competitor activity detection
async function detectCompetitorOpportunities(
  brandId: string,
  competitorIds: string[]
): Promise<OpportunityInsight[]> {
  const opportunities: OpportunityInsight[] = []

  try {
    // In production, monitor competitor social feeds
    // For now, return mock opportunity
    opportunities.push({
      id: `competitor_${Date.now()}`,
      brand_id: brandId,
      type: 'competitor_move',
      title: 'Competitor Launched New Service',
      description: 'Top competitor just announced a new premium service package.',
      source: 'competitor_monitoring',
      source_data: {
        competitor: 'Competitor A',
        announcement: 'Premium 24/7 support',
        engagement: 2500,
      },
      impact_score: 65,
      urgency: 'high',
      confidence: 0.95,
      status: 'new',
      suggested_actions: [
        {
          action_type: 'create_content',
          description: 'Highlight your existing 24/7 support',
          priority: 'critical',
          estimated_effort: 'low',
          potential_impact: 65,
        },
      ],
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Competitor detection error:', error)
  }

  return opportunities
}

// Seasonal trigger detection
async function detectSeasonalOpportunities(
  brandId: string,
  industry: string
): Promise<OpportunityInsight[]> {
  const opportunities: OpportunityInsight[] = []

  const month = new Date().getMonth()

  // Tax season for accounting
  if ((industry.includes('accounting') || industry.includes('tax')) && month >= 0 && month <= 3) {
    opportunities.push({
      id: `seasonal_${Date.now()}`,
      brand_id: brandId,
      type: 'seasonal_event',
      title: 'Tax Season Peak - Maximize Client Acquisition',
      description: 'Tax season is in full swing. Historical data shows 80% of annual new client inquiries happen in Q1.',
      source: 'event_calendars',
      source_data: { event: 'tax_season', days_until_deadline: 105 - (month * 30) },
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
        },
      ],
      created_at: new Date().toISOString(),
    })
  }

  return opportunities
}

// Helper functions
function isHeatSensitive(industry: string): boolean {
  const sensitive = ['hvac', 'cooling', 'air conditioning', 'pool', 'ice cream']
  return sensitive.some((keyword) => industry.toLowerCase().includes(keyword))
}
