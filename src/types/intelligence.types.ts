// Type definitions for Intelligence features (Industry data, Synapse, Opportunities)

// Industry Intelligence Types
export interface IndustryProfile {
  naics_code: string;
  industry_name: string;
  description: string;
  market_size?: string;
  growth_rate?: number;
  key_trends: string[];
  customer_triggers: CustomerTrigger[];
  seasonality: SeasonalityData;
  common_pain_points: string[];
  buying_journey_stages: BuyingJourneyStage[];
  content_opportunities: string[];
  benchmark_metrics: BenchmarkMetrics;
}

export interface CustomerTrigger {
  trigger: string;
  category: 'pain_point' | 'aspiration' | 'life_event' | 'seasonal' | 'regulatory';
  impact_level: 'high' | 'medium' | 'low';
  typical_solutions: string[];
  content_angles: string[];
  timing?: string;
}

export interface SeasonalityData {
  peak_months: string[];
  slow_months: string[];
  seasonal_trends: SeasonalTrend[];
}

export interface SeasonalTrend {
  period: string;
  trend_description: string;
  content_opportunities: string[];
  expected_demand_change: number;
}

export interface BuyingJourneyStage {
  stage: 'awareness' | 'consideration' | 'decision' | 'retention';
  typical_duration: string;
  key_questions: string[];
  content_types: string[];
  conversion_tactics: string[];
}

export interface BenchmarkMetrics {
  engagement_rate_range: { min: number; max: number; average: number };
  posting_frequency: { min: number; max: number; recommended: number };
  response_time: { min: number; max: number; expected: number };
  content_mix: Record<string, number>;
  top_performing_formats: string[];
}

// Synapse Analysis Types
export interface SynapseAnalysis {
  id: string;
  content: string;
  analysis_type: 'content' | 'uvp' | 'campaign' | 'audience';
  psychology_score: number;
  connections: Connection[];
  power_words: PowerWord[];
  emotional_triggers: EmotionalTrigger[];
  cognitive_load: number;
  persuasion_elements: PersuasionElement[];
  recommendations: string[];
  cached_at: string;
  cache_expires_at: string;
}

export interface Connection {
  from_concept: string;
  to_concept: string;
  relationship_type: 'causal' | 'analogical' | 'hierarchical' | 'sequential' | 'emotional';
  strength: number;
  explanation: string;
  impact_on_persuasion: number;
}

export interface PowerWord {
  word: string;
  category: 'urgency' | 'exclusivity' | 'emotion' | 'value' | 'trust' | 'action';
  power_score: number;
  context: string;
  alternatives?: string[];
}

export interface EmotionalTrigger {
  trigger_type: 'fear' | 'desire' | 'curiosity' | 'belonging' | 'status' | 'safety' | 'achievement';
  intensity: number;
  location: string;
  effectiveness: number;
  target_emotion: string;
}

export interface PersuasionElement {
  principle: 'reciprocity' | 'scarcity' | 'authority' | 'consistency' | 'liking' | 'consensus';
  present: boolean;
  strength?: number;
  location?: string;
  suggestion?: string;
}

// Opportunity Intelligence Types
export interface OpportunityInsight {
  id: string;
  brand_id: string;
  type: OpportunityType;
  title: string;
  description: string;
  source: OpportunitySource;
  source_data: Record<string, any>;
  impact_score: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  expires_at?: string;
  status: 'new' | 'reviewed' | 'actioned' | 'dismissed' | 'expired';
  suggested_actions: SuggestedAction[];
  related_opportunities?: string[];
  created_at: string;
  actioned_at?: string;
}

export type OpportunityType =
  | 'weather_based'
  | 'trending_topic'
  | 'competitor_move'
  | 'keyword_opportunity'
  | 'review_response'
  | 'seasonal_event'
  | 'local_news'
  | 'industry_shift'
  | 'audience_behavior'
  | 'platform_update';

export type OpportunitySource =
  | 'weather_api'
  | 'google_trends'
  | 'social_listening'
  | 'competitor_monitoring'
  | 'search_console'
  | 'review_platforms'
  | 'event_calendars'
  | 'news_apis'
  | 'platform_analytics'
  | 'synapse_analysis';

export interface SuggestedAction {
  action_type: 'create_content' | 'adjust_campaign' | 'respond' | 'adjust_budget' | 'monitor';
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimated_effort: 'low' | 'medium' | 'high';
  potential_impact: number;
  implementation_steps?: string[];
  content_suggestions?: string[];
}

// Learning Patterns Types
export interface LearningPattern {
  id: string;
  brand_id: string;
  pattern_type: 'content_performance' | 'audience_behavior' | 'timing' | 'format' | 'topic';
  description: string;
  discovered_from: {
    data_sources: string[];
    sample_size: number;
    time_period: string;
  };
  confidence_score: number;
  statistical_significance?: number;
  key_insights: string[];
  recommended_actions: string[];
  evidence: PatternEvidence[];
  impact_estimate: {
    metric: string;
    expected_improvement: number;
    confidence_interval: [number, number];
  };
  created_at: string;
  last_validated: string;
}

export interface PatternEvidence {
  data_point: string;
  value: number | string;
  comparison_baseline: number | string;
  variance: number;
  significance: number;
}

// Competitive Intelligence Types
export interface CompetitiveSnapshot {
  id: string;
  brand_id: string;
  competitor_id: string;
  snapshot_date: string;
  metrics: CompetitorMetrics;
  content_analysis: CompetitorContentAnalysis;
  strengths: string[];
  weaknesses: string[];
  opportunities_for_us: string[];
  threats: string[];
  created_at: string;
}

export interface CompetitorMetrics {
  follower_count?: Record<string, number>;
  engagement_rates?: Record<string, number>;
  posting_frequency?: Record<string, number>;
  estimated_ad_spend?: number;
  share_of_voice?: number;
  sentiment_score?: number;
}

export interface CompetitorContentAnalysis {
  top_performing_posts: ContentSummary[];
  content_themes: string[];
  posting_patterns: {
    best_days: string[];
    best_times: string[];
    frequency: number;
  };
  format_distribution: Record<string, number>;
  messaging_strategy: string;
  gaps_we_can_exploit: string[];
}

export interface ContentSummary {
  platform: string;
  type: string;
  summary: string;
  engagement: number;
  posted_at: string;
  key_elements: string[];
}

// Analytics Event Types
export interface AnalyticsEvent {
  id: string;
  brand_id: string;
  event_type: string;
  platform: string;
  event_data: Record<string, any>;
  occurred_at: string;
  processed: boolean;
  processed_at?: string;
  insights_generated?: string[];
}

// Platform Metrics Types
export interface PlatformMetricsSnapshot {
  id: string;
  brand_id: string;
  platform: string;
  snapshot_date: string;
  metrics: PlatformMetrics;
  comparisons: MetricComparisons;
  created_at: string;
}

export interface PlatformMetrics {
  followers: number;
  following?: number;
  total_posts: number;
  avg_engagement_rate: number;
  avg_reach: number;
  avg_impressions: number;
  top_performing_content_types: string[];
  audience_demographics?: Record<string, any>;
  best_posting_times?: string[];
}

export interface MetricComparisons {
  vs_previous_period: Record<string, number>;
  vs_industry_benchmark: Record<string, number>;
  vs_goals: Record<string, number>;
  trend_direction: Record<string, 'up' | 'down' | 'stable'>;
}

// Engagement Inbox Types
export interface EngagementInboxItem {
  id: string;
  brand_id: string;
  platform: string;
  engagement_type: 'comment' | 'message' | 'mention' | 'review' | 'share';
  content: string;
  author: string;
  author_profile?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency_score: number;
  requires_response: boolean;
  status: 'new' | 'in_progress' | 'responded' | 'escalated' | 'archived';
  platform_id: string;
  occurred_at: string;
  responded_at?: string;
  response_content?: string;
  ai_suggested_response?: string;
  created_at: string;
  updated_at: string;
}
