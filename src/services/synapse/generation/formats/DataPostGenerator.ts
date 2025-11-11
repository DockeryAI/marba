/**
 * Data Post Generator
 *
 * Generates data-driven, authority-building content using the AIDA framework
 * with evidence-based arguments and statistics.
 *
 * Framework: AIDA (Attention-Interest-Desire-Action)
 * - Attention: Lead with compelling data/stat
 * - Interest: Explain what it means
 * - Desire: Show why it matters
 * - Action: Clear next step
 *
 * Created: 2025-11-10
 * Updated: 2025-11-11 - COMPLETE REWRITE to use framework-guided generation
 */

import type { BreakthroughInsight } from '@/types/breakthrough.types';
import type {
  ContentDraft,
  SynapseContent,
  BusinessProfile
} from '@/types/synapseContent.types';
import { PowerWordOptimizer } from '../PowerWordOptimizer';
import { AIDA_SOCIAL, type ContentFramework } from '../ContentFrameworkLibrary';
import { detectTargetAudience, getCleanEvidence } from '../utils/audienceDetection';

export class DataPostGenerator {
  private powerWordOptimizer: PowerWordOptimizer;
  private framework: ContentFramework;

  constructor() {
    this.powerWordOptimizer = new PowerWordOptimizer();
    this.framework = AIDA_SOCIAL;
  }

  /**
   * Generate a data-driven post from an insight
   */
  async generate(
    insight: BreakthroughInsight,
    business: BusinessProfile
  ): Promise<SynapseContent> {
    // Detect actual target audience
    const targetAudience = detectTargetAudience(business);

    // Generate draft following AIDA framework
    const draft = this.generateFrameworkGuidedDraft(insight, business, targetAudience);

    // Optimize with power words (light touch for data posts)
    const optimized = await this.powerWordOptimizer.optimize(draft, business);

    // Build complete content object
    const content: SynapseContent = {
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      insightId: insight.id,
      format: 'data-post',

      content: {
        headline: optimized.headline,
        hook: optimized.hook,
        body: optimized.body,
        cta: optimized.cta,
        hashtags: this.generateHashtags(insight, business)
      },

      psychology: {
        principle: 'Social Proof + Authority',
        trigger: {
          type: 'curiosity',
          strength: 0.8,
          target: 'credibility'
        },
        persuasionTechnique: 'Data-Driven Authority',
        expectedReaction: insight.expectedReaction || 'These numbers tell a compelling story'
      },

      optimization: {
        powerWords: this.powerWordOptimizer.extractPowerWords(
          `${optimized.headline} ${optimized.hook} ${optimized.body}`
        ),
        framingDevice: this.framework.name,
        narrativeStructure: this.framework.stages.map(s => s.name).join(' → '),
        pacing: 'Medium-Fast (data-driven)'
      },

      meta: {
        platform: ['LinkedIn', 'Twitter'],
        tone: 'authoritative',
        targetAudience
      },

      prediction: {
        engagementScore: 0.7,
        viralPotential: 0.6,
        leadGeneration: 0.75,
        brandImpact: 'positive' as const,
        confidenceLevel: insight.confidence
      },

      framework: {
        id: this.framework.id,
        name: this.framework.name,
        stages: this.framework.stages.map(s => s.name),
        reasoning: 'AIDA framework perfect for data-driven content that builds authority and drives action'
      },

      metadata: {
        generatedAt: new Date(),
        model: 'DataPostGenerator',
        iterationCount: 1,
        impactScore: insight.confidence
      }
    };

    return content;
  }

  /**
   * Generate draft following AIDA framework
   */
  private generateFrameworkGuidedDraft(
    insight: BreakthroughInsight,
    business: BusinessProfile,
    targetAudience: string
  ): ContentDraft {
    // Get clean evidence
    const cleanEvidence = getCleanEvidence(insight.evidence, 5);

    // STAGE 1: ATTENTION
    // Purpose: Grab attention with compelling data
    const attention = this.buildAttentionStage(insight, targetAudience);

    // STAGE 2: INTEREST
    // Purpose: Explain what the data means
    const interest = this.buildInterestStage(insight);

    // STAGE 3: DESIRE
    // Purpose: Show why it matters (evidence)
    const desire = this.buildDesireStage(insight, cleanEvidence);

    // STAGE 4: ACTION
    // Purpose: Clear next step
    const action = this.buildActionStage(business, targetAudience);

    // Assemble into content structure
    const headline = this.buildHeadline(insight);
    const hook = attention;
    const body = `${interest}

${desire}`;
    const cta = action;

    return {
      format: 'data-post',
      headline,
      hook,
      body,
      cta
    };
  }

  /**
   * STAGE 1: Build Attention (The Data Hook)
   */
  private buildAttentionStage(insight: BreakthroughInsight, targetAudience: string): string {
    // Frame as a data-driven discovery/finding
    // Make it more analytical and factual than controversial posts

    // Extract the core finding from insight
    const coreFinding = insight.insight;

    // Frame it as a discovery or data point
    if (coreFinding.toLowerCase().includes('data') || coreFinding.toLowerCase().includes('study') || coreFinding.toLowerCase().includes('%')) {
      return `New research shows: ${coreFinding}`;
    }

    // Use a more analytical framing
    return `We analyzed ${targetAudience} behavior and found: ${coreFinding}`;
  }

  /**
   * STAGE 2: Build Interest (What It Means)
   */
  private buildInterestStage(insight: BreakthroughInsight): string {
    return `**The Finding:**\n${insight.insight}`;
  }

  /**
   * STAGE 3: Build Desire (Why It Matters)
   */
  private buildDesireStage(insight: BreakthroughInsight, cleanEvidence: string[]): string {
    const parts: string[] = [];

    // Explain significance
    if (insight.whyProfound) {
      parts.push(`**Why This Matters:**\n${insight.whyProfound}`);
    }

    // Add evidence if available
    if (cleanEvidence.length > 0) {
      parts.push(`\n**Supporting Data:**`);
      cleanEvidence.forEach((evidence, index) => {
        parts.push(`${index + 1}. ${evidence}`);
      });
    }

    // Add timing if present
    if (insight.whyNow && insight.whyNow.length > 15) {
      parts.push(`\n**Timing:**\n${insight.whyNow}`);
    }

    return parts.join('\n');
  }

  /**
   * STAGE 4: Build Action (The CTA)
   */
  private buildActionStage(business: BusinessProfile, targetAudience: string): string {
    // Data posts need more analytical/credibility-building CTAs
    return `See how ${business.name} uses behavioral insights to create memorable experiences for ${targetAudience}. Follow for more data.`;
  }

  /**
   * Build headline
   */
  private buildHeadline(insight: BreakthroughInsight): string {
    // Clean meta-instructions helper
    const cleanInstructions = (text: string): string => {
      const patterns = [
        /^Start with ['""\u201C\u201D]?[^'"\u201C\u201D]*['""\u201C\u201D]?\s*/i,
        /^Begin with\s+/i,
        /^Create (a|an)\s+/i,
        /^Post (a|an)\s+/i,
        /^Share (a|an)\s+/i,
        /^Video series:\s*/i,
        /^POV:\s*/i
      ];
      let cleaned = text;
      for (const pattern of patterns) {
        cleaned = cleaned.replace(pattern, '');
      }
      // Also remove any remaining "secret" artifacts
      cleaned = cleaned.replace(/^"?secret"?\s*/i, '');

      if (cleaned !== text && cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
      return cleaned;
    };

    // Use contentAngle if available (cleaned)
    if (insight.contentAngle && insight.contentAngle.length > 10) {
      return cleanInstructions(insight.contentAngle);
    }

    // Use first sentence of insight (cleaned)
    const firstSentence = cleanInstructions(insight.insight.split('.')[0]);
    return firstSentence.length > 100 ? firstSentence.substring(0, 97) + '...' : firstSentence;
  }

  /**
   * Generate relevant hashtags
   */
  private generateHashtags(
    insight: BreakthroughInsight,
    business: BusinessProfile
  ): string[] {
    const industry = business.industry.toLowerCase().replace(/\s+/g, '');

    return [
      industry,
      'data',
      'insights',
      'research',
      'trends'
    ].slice(0, 5);
  }
}
