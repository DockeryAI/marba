/**
 * GROWTH-FOCUSED INTELLIGENCE TYPES
 *
 * Transforms problem-focused insights into opportunity-focused growth cards.
 * Every piece of data becomes a potential win, not a failure.
 */

export interface GrowthPotentialScore {
  score: number; // 0-100
  message: string; // Positive framing at every level
  categories: {
    searchVisibility: number;    // 0-25 points
    onlinePresence: number;      // 0-25 points
    customerEngagement: number;  // 0-25 points
    contentQuality: number;      // 0-25 points
  };
  breakdown: {
    category: string;
    current: number;
    potential: number;
    message: string;
  }[];
}

export interface OpportunityCard {
  // What they see first
  headline: string;        // "Activate Your Google Presence"
  tagline: string;         // "Reach 500+ active searchers in your area"

  // The potential
  potential: {
    amount: number;        // 15
    metric: string;        // "new leads monthly"
  };

  // The effort
  effort: {
    time: string;          // "10 minutes weekly"
    difficulty: 'easy' | 'moderate' | 'advanced';
  };

  // When they want to learn more
  deepDive: {
    whyThisWorks: string;              // Brief, data-backed explanation
    yourSolution: any;                  // Ready-to-use content or tool
    firstStep: string;                  // Exactly what to do first
    resultsTimeline: string;            // "See results in 48 hours"
  };

  // For our ranking
  impactScore: number;           // How much this moves the needle (0-100)
  quickWin: boolean;             // Can they do this today?
  category: 'search' | 'reviews' | 'social' | 'content' | 'visibility' | 'engagement';

  // Original insight reference (for debugging)
  sourceInsight?: any;
}

export interface QuickWin {
  opportunity: OpportunityCard;
  whyStartHere: string;           // "Easiest path to your first results"
  timeToComplete: string;         // "5 minutes"
  resultsIn: string;              // "48 hours"
  readyNow: any;                  // The actual content/tool
}

export interface GrowthAnalysis {
  growthScore: GrowthPotentialScore;
  topThree: OpportunityCard[];
  quickWin: QuickWin;
  strengths: string[];          // What they're doing RIGHT

  // Keep but don't show all at once
  allOpportunities: OpportunityCard[];

  // Original data for reference
  rawData?: {
    insights: any[];
    businessData: any;
    industryProfile: any;
  };
}
