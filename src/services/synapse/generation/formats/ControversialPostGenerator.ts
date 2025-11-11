/**
 * Controversial Post Generator
 *
 * Generates debate-starting content that challenges conventional wisdom
 * using the Problem-Agitate-Solution (PAS) framework.
 *
 * Framework: Problem-Agitate-Solution
 * - Problem: Identify the flawed conventional wisdom
 * - Agitate: Amplify the cost of believing it
 * - Solution: Present the counter-intuitive truth
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
import { PROBLEM_AGITATE_SOLUTION, type ContentFramework } from '../ContentFrameworkLibrary';
import { detectTargetAudience, getCleanEvidence } from '../utils/audienceDetection';

export class ControversialPostGenerator {
  private powerWordOptimizer: PowerWordOptimizer;
  private framework: ContentFramework;

  constructor() {
    this.powerWordOptimizer = new PowerWordOptimizer();
    this.framework = PROBLEM_AGITATE_SOLUTION;
  }

  /**
   * Generate a controversial post from an insight
   */
  async generate(
    insight: BreakthroughInsight,
    business: BusinessProfile
  ): Promise<SynapseContent> {
    // Detect actual target audience
    const targetAudience = detectTargetAudience(business);

    // Generate draft following Problem-Agitate-Solution framework
    const draft = this.generateFrameworkGuidedDraft(insight, business, targetAudience);

    // Optimize with power words (careful - don't make it clickbait)
    const optimized = await this.powerWordOptimizer.optimize(draft, business);

    // Build complete content object
    const content: SynapseContent = {
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      insightId: insight.id,
      format: 'controversial-post',

      content: {
        headline: optimized.headline,
        hook: optimized.hook,
        body: optimized.body,
        cta: optimized.cta,
        hashtags: this.generateHashtags(insight, business)
      },

      psychology: {
        principle: 'Cognitive Dissonance',
        trigger: {
          type: 'anger',
          strength: 0.85,
          target: 'engagement'
        },
        persuasionTechnique: 'Contrarian Challenge',
        expectedReaction: insight.expectedReaction || 'This challenges what I believe... let me think about it'
      },

      optimization: {
        powerWords: this.powerWordOptimizer.extractPowerWords(
          `${optimized.headline} ${optimized.hook} ${optimized.body}`
        ),
        framingDevice: this.framework.name,
        narrativeStructure: this.framework.stages.map(s => s.name).join(' → '),
        pacing: 'Fast (debate-driving)'
      },

      meta: {
        platform: ['LinkedIn', 'Twitter'],
        tone: 'controversial',
        targetAudience
      },

      prediction: {
        engagementScore: this.predictEngagement(insight),
        viralPotential: this.predictViralPotential(insight),
        leadGeneration: 0.55,
        brandImpact: this.predictBrandImpact(insight),
        confidenceLevel: insight.confidence
      },

      framework: {
        id: this.framework.id,
        name: this.framework.name,
        stages: this.framework.stages.map(s => s.name),
        reasoning: 'PAS framework perfect for challenging conventional wisdom with substantive arguments'
      },

      metadata: {
        generatedAt: new Date(),
        model: 'ControversialPostGenerator',
        iterationCount: 1,
        impactScore: insight.confidence
      }
    };

    return content;
  }

  /**
   * Generate draft following Problem-Agitate-Solution framework
   *
   * This is the KEY METHOD - it walks through PAS framework stages
   * and uses the stage guidelines to construct controversial content
   */
  private generateFrameworkGuidedDraft(
    insight: BreakthroughInsight,
    business: BusinessProfile,
    targetAudience: string
  ): ContentDraft {
    // Get clean evidence (filter out search keywords)
    const cleanEvidence = getCleanEvidence(insight.evidence, 3);

    // STAGE 1: PROBLEM
    // Purpose: Identify the flawed conventional wisdom
    const problem = this.buildProblemStage(insight, targetAudience);

    // STAGE 2: AGITATE
    // Purpose: Amplify the cost/pain of believing the flawed wisdom
    const agitate = this.buildAgitateStage(insight, cleanEvidence);

    // STAGE 3: SOLUTION
    // Purpose: Present the counter-intuitive truth with evidence
    const solution = this.buildSolutionStage(insight, business, targetAudience);

    // Assemble into content structure
    const headline = this.buildHeadline(insight);
    const hook = problem;
    const body = `${agitate}

${solution}`;
    const cta = `Disagree? Let's discuss in the comments. I'll respond to every thoughtful argument.`;

    return {
      format: 'controversial-post',
      headline,
      hook,
      body,
      cta
    };
  }

  /**
   * STAGE 1: Build Problem (The Conventional Wisdom)
   *
   * Framework guideline: "Identify the problem"
   * Uses: insight as the truth, so we need to present what people WRONGLY believe
   */
  private buildProblemStage(insight: BreakthroughInsight, targetAudience: string): string {
    // Frame as a provocative challenge/question
    if (insight.contentAngle && insight.contentAngle.length > 15) {
      // Make it more provocative by framing as a question or challenge
      const angle = insight.contentAngle;

      // If it's already a question or provocative, use it
      if (angle.includes('?') || angle.toLowerCase().includes('unpopular') || angle.toLowerCase().includes('hot take')) {
        return angle;
      }

      // Otherwise frame it provocatively
      return `Hot take: ${angle}`;
    }

    // Fall back to framing the insight provocatively
    return `Here's what nobody's talking about: ${insight.insight}`;
  }

  /**
   * STAGE 2: Build Agitate (Amplify the Pain)
   *
   * Framework guideline: "Amplify the pain of the problem"
   * Uses: insight.whyProfound (why conventional wisdom fails)
   */
  private buildAgitateStage(insight: BreakthroughInsight, cleanEvidence: string[]): string {
    const parts: string[] = [];

    // Present the counter-intuitive truth
    parts.push(`**The Truth:**\n${insight.insight}`);

    // Explain why this matters (the cost of getting it wrong)
    if (insight.whyProfound) {
      parts.push(`\n**Why This Matters:**\n${insight.whyProfound}`);
    }

    // Add evidence if available
    if (cleanEvidence.length > 0) {
      parts.push(`\n**The Evidence:**`);
      cleanEvidence.forEach(evidence => {
        parts.push(`• ${evidence}`);
      });
    }

    return parts.join('\n');
  }

  /**
   * STAGE 3: Build Solution (The Path Forward)
   *
   * Framework guideline: "Provide the solution"
   * Uses: insight.whyNow, business value prop
   */
  private buildSolutionStage(
    insight: BreakthroughInsight,
    business: BusinessProfile,
    targetAudience: string
  ): string {
    const parts: string[] = [];

    // Add timing/urgency if present
    if (insight.whyNow && insight.whyNow.length > 15) {
      parts.push(`**Why This Matters Now:**\n${insight.whyNow}`);
    }

    // Create insight-specific CTA based on contentAngle
    const cta = this.buildInsightSpecificCTA(insight, business, targetAudience);
    parts.push(`\n${cta}`);

    return parts.join('\n');
  }

  /**
   * Build an insight-specific CTA rather than generic "helps X do Y"
   */
  private buildInsightSpecificCTA(
    insight: BreakthroughInsight,
    business: BusinessProfile,
    targetAudience: string
  ): string {
    // Extract key action from the insight
    const angle = insight.contentAngle || insight.insight;

    // Create actionable CTAs based on the content
    if (angle.toLowerCase().includes('wedding')) {
      return `Want this at your next event? ${business.name} brings the experience. DM us to book.`;
    } else if (angle.toLowerCase().includes('office') || angle.toLowerCase().includes('corporate')) {
      return `Ready to surprise your team? ${business.name} makes office moments memorable. Let's chat.`;
    } else if (angle.toLowerCase().includes('event')) {
      return `Planning something special? ${business.name} creates moments people talk about. Reach out.`;
    }

    // Default actionable CTA
    return `Curious? ${business.name} helps ${targetAudience} turn insights into experiences. Let's connect.`;
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

    // Priority: contentAngle if it exists (cleaned)
    if (insight.contentAngle && insight.contentAngle.length > 10) {
      return cleanInstructions(insight.contentAngle);
    }

    // Use first sentence of core insight (cleaned)
    const firstSentence = cleanInstructions(insight.insight.split('.')[0]);

    return firstSentence;
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
      'controversial',
      'truth',
      'mindset',
      'debate'
    ].slice(0, 5);
  }

  /**
   * Predict engagement score
   */
  private predictEngagement(insight: BreakthroughInsight): number {
    let score = 0.8; // Base score for controversial content

    // Counter-intuitive insights drive higher engagement
    if (insight.type === 'counter_intuitive') {
      score += 0.15;
    }

    // High confidence means defensible position = more engagement
    if (insight.confidence > 0.8) {
      score += 0.05;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Predict viral potential
   */
  private predictViralPotential(insight: BreakthroughInsight): number {
    let score = 0.75; // Base score for controversial content

    // Counter-intuitive insights are highly shareable
    if (insight.type === 'counter_intuitive') {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Predict brand impact
   */
  private predictBrandImpact(insight: BreakthroughInsight): 'positive' | 'neutral' | 'risky' {
    // High confidence controversial = positive (thought leadership)
    if (insight.confidence > 0.8) {
      return 'positive';
    }

    // Medium confidence = neutral (some risk but manageable)
    if (insight.confidence > 0.6) {
      return 'neutral';
    }

    // Lower confidence controversial = risky
    return 'risky';
  }
}
