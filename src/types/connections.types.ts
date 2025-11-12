/**
 * Connection Discovery Types
 * For Phase 6: AI-powered connection discovery between disparate data points
 */

export interface DataPoint {
  source: 'weather' | 'trends' | 'news' | 'competitor' | 'content_gap' | 'customer_trigger' | 'seo' | 'archetype' | 'benchmark'
  insight: string
  data: any
  confidence: number
}

export interface Connection {
  id: string
  brand_id: string
  type: '2-way' | '3-way' | '4-way' | '5-way'
  title: string
  description: string
  data_points: DataPoint[]
  confidence: number // 0-1
  impact_score: number // 0-100
  breakthrough_score: number // 0-1 (how unexpected/valuable)
  content_angle: string
  suggested_actions: Array<{
    action_type: 'create_content' | 'adjust_strategy' | 'target_audience' | 'timing' | 'platform_shift'
    description: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    estimated_effort: string
    potential_impact: number
    implementation_steps?: string[]
  }>
  created_at: string
  expires_at?: string
}

export interface DeepContext {
  brand_id: string
  industry: string
  keywords: string[]
  triggers: string[]
  competitors: any[]
  content_gaps: any[]
  current_opportunities: any[]
  seo_data: any
  weather_data: any
  trend_data: any
  archetype: string
  brand_voice: string
  target_personas: any[]
  benchmarks: any
}

export interface ConnectionDiscoveryOptions {
  minBreakthroughScore?: number // 0-1, default 0.7
  maxConnections?: number // default 20
  includeWeakSignals?: boolean // default true
  focusAreas?: Array<'customer_psychology' | 'market_trends' | 'competitive_gaps' | 'timing' | 'channels'>
}

export interface ConnectionDiscoveryResult {
  connections: Connection[]
  summary: {
    total_connections: number
    high_confidence_count: number
    breakthrough_insights: number
    categories: Record<string, number>
  }
  processing_time_ms: number
  data_sources_used: string[]
}
