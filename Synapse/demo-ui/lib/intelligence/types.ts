/**
 * INTELLIGENCE ENGINE - TYPE DEFINITIONS
 *
 * Core TypeScript interfaces for the Intelligence Engine that transforms
 * raw business data into actionable insights.
 *
 * Created: 2025-11-09
 */

// ============================================================================
// INSIGHT TYPES
// ============================================================================

export type InsightType =
  | 'ranking_gap'
  | 'review_deficit'
  | 'social_absence'
  | 'messaging_gap'
  | 'competitive_opportunity'
  | 'technical_issue'
  | 'gmb_optimization'
  | 'content_gap'
  | 'trust_signal';

export type InsightCategory = 'search' | 'reviews' | 'social' | 'website' | 'competition';

export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Solution {
  action: string;
  effort: 'quick_win' | 'medium' | 'long_term';
  expectedTimeframe: string;
  estimatedCost?: string;
}

export interface ImpactMetric {
  type: 'revenue' | 'leads' | 'traffic' | 'engagement' | 'trust';
  current: number;
  potential: number;
  lift: number;
  liftPercentage: number;
  calculation: string;
  timeframe: string;
}

export interface Insight {
  id: string;
  type: InsightType;
  category: InsightCategory;
  severity: InsightSeverity;

  // Core messaging
  headline: string;
  description: string;
  whyItMatters: string;

  // Data backing
  dataPoints: {
    label: string;
    value: string | number;
    context?: string;
  }[];

  // Impact quantification
  impact: ImpactMetric;

  // Industry context
  industryBenchmark?: {
    metric: string;
    yourValue: number;
    industryAverage: number;
    topPerformers: number;
    percentile: number;
  };

  // Actionable next steps
  solutions: Solution[];

  // Prioritization
  priorityScore: number;
  urgency: string;

  // Metadata
  confidence: number;
  source: string[];
  generatedAt: string;
}

// ============================================================================
// OPPORTUNITY DASHBOARD
// ============================================================================

export interface OpportunityDashboard {
  summary: {
    totalRevenueAtRisk: number;
    totalLeadsLost: number;
    marketPosition: 'leading' | 'competitive' | 'lagging' | 'invisible';
    digitalMaturityScore: number;
  };

  quickWins: {
    title: string;
    impact: string;
    effort: string;
    insightId: string;
  }[];

  biggestThreats: {
    title: string;
    severity: InsightSeverity;
    impact: string;
    insightId: string;
  }[];

  hiddenStrengths: {
    title: string;
    description: string;
  }[];

  unclaimedOpportunities: {
    title: string;
    potential: string;
    insightId: string;
  }[];
}

// ============================================================================
// BUSINESS DATA (Input)
// ============================================================================

export interface WebsiteData {
  url: string;
  title?: string;
  description?: string;
  content: string;
  metadata: {
    hasHttps: boolean;
    loadTime?: number;
    mobileOptimized?: boolean;
    hasSchema?: boolean;
    wordCount?: number;
  };
  scrapedAt: string;
}

export interface SerperResult {
  query: string;
  position?: number;
  competitors: {
    url: string;
    position: number;
    title: string;
    snippet: string;
  }[];
  localPack?: {
    position?: number;
    totalResults: number;
  };
  paa?: {
    question: string;
    snippet: string;
  }[];
}

export interface GMBData {
  exists: boolean;
  name?: string;
  rating?: number;
  reviewCount?: number;
  categoryPrimary?: string;
  categories?: string[];
  description?: string;
  descriptionLength?: number;
  photoCount?: number;
  hasWebsite?: boolean;
  hasPhone?: boolean;
  hasHours?: boolean;
  postCount?: number;
  lastPostDate?: string;
  recentReviews?: {
    rating: number;
    text: string;
    date: string;
  }[];
}

export interface SocialMediaData {
  facebook?: {
    exists: boolean;
    url?: string;
    followers?: number;
    likes?: number;
    lastPostDate?: string;
    daysSincePost?: number;
    postFrequency?: number;
    engagementRate?: number;
    pageCompleteness?: number;
    missingElements?: string[];
  };
  instagram?: {
    exists: boolean;
    url?: string;
    followers?: number;
    following?: number;
    posts?: number;
    lastPostDate?: string;
    daysSincePost?: number;
    engagementRate?: number;
    bioComplete?: boolean;
  };
  linkedin?: {
    exists: boolean;
    url?: string;
    followers?: number;
    employees?: number;
    lastPostDate?: string;
    daysSincePost?: number;
    hasDescription?: boolean;
  };
  youtube?: {
    exists: boolean;
    url?: string;
    subscribers?: number;
    videoCount?: number;
    lastVideoDate?: string;
    daysSinceVideo?: number;
    viewCount?: number;
  };
}

export interface BusinessData {
  businessUrl: string;
  industryCode: string;
  industryName: string;
  location?: {
    city: string;
    state: string;
    zip?: string;
  };

  // Data from 5 parallel sources
  website: WebsiteData;
  serper: SerperResult[];
  gmb: GMBData;
  social: SocialMediaData;
  semrush?: {
    domain: string;
    organicTraffic?: number;
    organicKeywords?: number;
    backlinks?: number;
    domainAuthority?: number;
    keywords?: {
      keyword: string;
      position: number;
      searchVolume: number;
      difficulty: number;
      url: string;
      traffic: number;
    }[];
  };

  // Metadata
  analyzedAt: string;
  dataCompleteness: {
    website: boolean;
    serper: boolean;
    gmb: boolean;
    social: boolean;
    semrush: boolean;
  };
}

// ============================================================================
// INDUSTRY PROFILE (Benchmarking)
// ============================================================================

export interface CustomerTrigger {
  trigger: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  emotionalWeight: number;
}

export interface PowerWord {
  word: string;
  category: 'trust' | 'urgency' | 'value' | 'expertise';
  weight: number;
}

export interface IndustryBenchmarks {
  avgGoogleRating: number;
  avgReviewCount: number;
  avgResponseTime: string;
  avgSocialFollowers: {
    facebook: number;
    instagram: number;
    linkedin: number;
  };
  avgPostFrequency: {
    facebook: number;
    instagram: number;
    linkedin: number;
  };
  avgGMBPhotoCount: number;
  avgWebsiteLoadTime: number;
  topKeywords: string[];
}

export interface IndustryProfile {
  industryCode: string;
  industryName: string;
  eq: number;

  // Customer psychology
  customerTriggers: CustomerTrigger[];
  powerWords: PowerWord[];
  trustSignals: string[];
  painPoints: string[];

  // Benchmarks
  benchmarks: IndustryBenchmarks;

  // Search behavior
  primaryKeywords: string[];
  secondaryKeywords: string[];
  localModifiers: string[];

  // Content themes
  contentThemes: string[];
  commonServices: string[];

  // Metadata
  profileVersion: string;
  lastUpdated: string;
  confidenceScore: number;
}

// ============================================================================
// CALCULATOR INPUTS
// ============================================================================

export interface CTRCalculation {
  currentPosition: number;
  targetPosition: number;
  currentCTR: number;
  targetCTR: number;
  monthlySearches: number;
  clicksLost: number;
}

export interface ConversionCalculation {
  clicks: number;
  conversionRate: number;
  leads: number;
  closeRate: number;
  customers: number;
}

export interface RevenueCalculation {
  leads: number;
  closeRate: number;
  avgDealSize: number;
  revenue: number;
  timeframe: string;
}

export interface TrustDeficitCalculation {
  metric: string;
  currentValue: number;
  benchmarkValue: number;
  deficit: number;
  deficitPercentage: number;
  impactOnConversion: number;
}

export interface SocialReachCalculation {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'youtube';
  currentFollowers: number;
  benchmarkFollowers: number;
  gap: number;
  potentialReach: number;
  estimatedLeads: number;
}

// ============================================================================
// ANALYSIS RESULT
// ============================================================================

export interface IntelligenceAnalysis {
  businessData: BusinessData;
  industryProfile?: IndustryProfile;

  insights: Insight[];
  dashboard: OpportunityDashboard;

  metadata: {
    totalInsightsGenerated: number;
    analysisTimeMs: number;
    dataSourcesUsed: string[];
    confidenceScore: number;
    generatedAt: string;
  };
}

// ============================================================================
// GENERATOR CONFIGURATION
// ============================================================================

export interface GeneratorConfig {
  enabled: boolean;
  minConfidence: number;
  requireIndustryProfile: boolean;
  skipIfDataMissing: string[];
}

export interface AnalysisConfig {
  generators: {
    searchRanking: GeneratorConfig;
    reviewDeficit: GeneratorConfig;
    socialMedia: GeneratorConfig;
    gmbOptimization: GeneratorConfig;
    technicalIssues: GeneratorConfig;
    messagingGap: GeneratorConfig;
    competitiveOpportunity: GeneratorConfig;
    contentGap: GeneratorConfig;
  };

  // Calculation defaults
  defaultConversionRate: number;
  defaultCloseRate: number;
  defaultAvgDealSize: number;

  // Thresholds
  minPriorityScore: number;
  maxInsightsPerCategory: number;

  // Industry context
  useIndustryBenchmarks: boolean;
  fallbackToBenchmarks: boolean;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface GeneratorError {
  generator: string;
  error: string;
  dataContext: Record<string, any>;
  timestamp: string;
}

export interface AnalysisWarning {
  type: 'missing_data' | 'low_confidence' | 'insufficient_benchmarks' | 'calculation_estimate';
  message: string;
  affectedInsights: string[];
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  Insight,
  ImpactMetric,
  Solution,
  OpportunityDashboard,
  BusinessData,
  IndustryProfile,
  IntelligenceAnalysis,
  AnalysisConfig,
  GeneratorError,
  AnalysisWarning,
};
