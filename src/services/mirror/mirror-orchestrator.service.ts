/**
 * Mirror Orchestrator Service
 * Coordinates all Mirror diagnostic services and manages data persistence
 */

import {
  type BrandData,
  type MirrorDiagnostic,
  type CriticalGap,
  calculateOverallHealthScore,
} from '@/types/mirror-diagnostics'
import { MarketPositionService } from './market-position.service'
import { CustomerTruthService } from './customer-truth.service'
import { BrandFitService } from './brand-fit.service'
import { supabase } from '@/lib/supabase'

export class MirrorOrchestratorService {
  /**
   * Run complete Mirror diagnostic for a brand
   */
  static async runFullDiagnostic(
    brandId: string,
    brandData: BrandData
  ): Promise<MirrorDiagnostic> {
    console.log('[MirrorOrchestrator] Starting full diagnostic for:', brandData.name)

    try {
      // Run all three analyses in parallel for performance
      const [marketPositionAnalysis, customerTruthAnalysis, brandFitAnalysis] =
        await Promise.all([
          MarketPositionService.analyzeMarketPosition(brandId, brandData),
          CustomerTruthService.analyzeCustomerTruth(brandId, brandData),
          BrandFitService.analyzeBrandFit(brandId, brandData),
        ])

      // Calculate overall health score (weighted average)
      const overallHealthScore = calculateOverallHealthScore(
        marketPositionAnalysis.score,
        customerTruthAnalysis.score,
        brandFitAnalysis.score
      )

      // Identify top 3 critical gaps
      const criticalGaps = await this.identifyCriticalGaps(
        marketPositionAnalysis.data,
        customerTruthAnalysis.data,
        brandFitAnalysis.data
      )

      // Check if brand has completed UVP
      const hasCompletedUVP = await this.checkUVPCompletion(brandId)

      // Build complete diagnostic
      const diagnostic: Omit<MirrorDiagnostic, 'id' | 'created_at' | 'updated_at'> = {
        brand_id: brandId,
        market_position_score: marketPositionAnalysis.score,
        customer_match_score: customerTruthAnalysis.score,
        brand_clarity_score: brandFitAnalysis.score,
        overall_health_score: overallHealthScore,
        market_position_data: marketPositionAnalysis.data,
        customer_truth_data: customerTruthAnalysis.data,
        brand_fit_data: brandFitAnalysis.data,
        critical_gaps: criticalGaps,
        uvp_delivery_analysis: null, // Will be populated post-UVP
        has_completed_uvp: hasCompletedUVP,
        analyzed_at: new Date().toISOString(),
      }

      // Save to database
      const savedDiagnostic = await this.saveDiagnostic(diagnostic)

      console.log('[MirrorOrchestrator] Diagnostic complete. Overall score:', overallHealthScore)

      return savedDiagnostic
    } catch (error) {
      console.error('[MirrorOrchestrator] Diagnostic failed:', error)
      throw new Error('Failed to run Mirror diagnostic')
    }
  }

  /**
   * Identify top 3 critical gaps from all analyses
   */
  private static async identifyCriticalGaps(
    marketData: any,
    customerData: any,
    brandData: any
  ): Promise<CriticalGap[]> {
    const gaps: CriticalGap[] = []

    // Gap 1: Price-based competition (from customer truth)
    if (customerData.price_vs_value_perception.includes('cheapest')) {
      gaps.push({
        priority: 1,
        gap: "You're competing on price, not value",
        impact:
          'Losing margin and attracting price-sensitive customers who switch to cheaper alternatives',
        fix: 'Define and communicate clear value proposition',
        fix_action_link: '/roadmap#uvp-flow',
      })
    }

    // Gap 2: Demographic mismatch (from customer truth)
    if (customerData.match_percentage < 50) {
      gaps.push({
        priority: gaps.length === 0 ? 1 : 2,
        gap: 'Targeting wrong customer demographic',
        impact: `Only ${customerData.match_percentage}% match between expected and actual customers`,
        fix: 'Realign targeting strategy or pivot positioning to actual audience',
        fix_action_link: '/align#target-audience',
      })
    }

    // Gap 3: Messaging inconsistency (from brand fit)
    if (brandData.messaging_consistency < 60) {
      gaps.push({
        priority: gaps.length === 0 ? 1 : gaps.length === 1 ? 2 : 3,
        gap: 'Inconsistent messaging across customer touchpoints',
        impact: `${brandData.messaging_consistency}% consistency score - customers confused about what you do`,
        fix: 'Unify messaging with strategic framework',
        fix_action_link: '/align#messaging',
      })
    }

    // Gap 4: Weak differentiation (from brand fit)
    if (brandData.differentiation_score < 50) {
      gaps.push({
        priority: gaps.length === 0 ? 1 : gaps.length === 1 ? 2 : 3,
        gap: 'No clear differentiation from competitors',
        impact: `${brandData.differentiation_score}% differentiation - blending in with competition`,
        fix: 'Identify and own unique market position',
        fix_action_link: '/align#positioning',
      })
    }

    // Gap 5: Poor market position (from market position)
    if (marketData.current_rank > 5) {
      gaps.push({
        priority: gaps.length === 0 ? 1 : gaps.length === 1 ? 2 : 3,
        gap: 'Low visibility in market',
        impact: `Ranked #${marketData.current_rank} of ${marketData.total_competitors} - missing potential customers`,
        fix: 'Improve SEO and local search presence',
        fix_action_link: '/broadcast#seo',
      })
    }

    // Gap 6: Competitive gaps
    if (marketData.competitive_gaps.length > 0) {
      const topGap = marketData.competitive_gaps[0]
      gaps.push({
        priority: gaps.length === 0 ? 1 : gaps.length === 1 ? 2 : 3,
        gap: topGap.gap,
        impact: topGap.impact,
        fix: 'Address competitive weaknesses',
        fix_action_link: '/roadmap',
      })
    }

    // Return top 3 by priority
    return gaps.slice(0, 3)
  }

  /**
   * Check if brand has completed UVP flow
   */
  private static async checkUVPCompletion(brandId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('brand_uvps')
        .select('id, status')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) return false

      return data.status === 'completed'
    } catch (error) {
      console.error('[MirrorOrchestrator] UVP check failed:', error)
      return false
    }
  }

  /**
   * Save diagnostic to database
   */
  private static async saveDiagnostic(
    diagnostic: Omit<MirrorDiagnostic, 'id' | 'created_at' | 'updated_at'>
  ): Promise<MirrorDiagnostic> {
    try {
      // Check if diagnostic already exists for this brand
      const { data: existing } = await supabase
        .from('mirror_diagnostics')
        .select('id')
        .eq('brand_id', diagnostic.brand_id)
        .single()

      if (existing) {
        // Update existing diagnostic
        const { data, error } = await supabase
          .from('mirror_diagnostics')
          .update({
            market_position_score: diagnostic.market_position_score,
            customer_match_score: diagnostic.customer_match_score,
            brand_clarity_score: diagnostic.brand_clarity_score,
            overall_health_score: diagnostic.overall_health_score,
            market_position_data: diagnostic.market_position_data,
            customer_truth_data: diagnostic.customer_truth_data,
            brand_fit_data: diagnostic.brand_fit_data,
            critical_gaps: diagnostic.critical_gaps,
            uvp_delivery_analysis: diagnostic.uvp_delivery_analysis,
            has_completed_uvp: diagnostic.has_completed_uvp,
            analyzed_at: diagnostic.analyzed_at,
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Insert new diagnostic
        const { data, error } = await supabase
          .from('mirror_diagnostics')
          .insert([diagnostic])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('[MirrorOrchestrator] Save failed:', error)
      throw new Error('Failed to save diagnostic')
    }
  }

  /**
   * Load latest diagnostic for a brand
   */
  static async loadLatestDiagnostic(brandId: string): Promise<MirrorDiagnostic | null> {
    try {
      const { data, error } = await supabase
        .from('mirror_diagnostics')
        .select('*')
        .eq('brand_id', brandId)
        .order('analyzed_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        console.log('[MirrorOrchestrator] No diagnostic found for brand:', brandId)
        return null
      }

      return data
    } catch (error) {
      console.error('[MirrorOrchestrator] Load failed:', error)
      return null
    }
  }

  /**
   * Enhance diagnostic with UVP delivery analysis (Post-UVP only)
   */
  static async enhanceWithUVP(brandId: string): Promise<MirrorDiagnostic | null> {
    try {
      // Load current diagnostic
      const diagnostic = await this.loadLatestDiagnostic(brandId)
      if (!diagnostic) return null

      // Check if UVP is completed
      const hasCompletedUVP = await this.checkUVPCompletion(brandId)
      if (!hasCompletedUVP) {
        console.log('[MirrorOrchestrator] UVP not completed yet')
        return diagnostic
      }

      // Get UVP data
      const { data: uvp } = await supabase
        .from('brand_uvps')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!uvp) return diagnostic

      // TODO: Implement UVP delivery analysis
      // This would analyze:
      // - How well messaging aligns with UVP
      // - Customer confirmation of UVP promise
      // - UVP keyword rankings
      // - NPS before/after trends
      // - Differentiation proof

      const uvpDeliveryAnalysis = {
        uvp_promise: uvp.value_proposition || 'Unknown',
        delivery_score: 0,
        customer_confirmation_percentage: 0,
        alignment_metrics: {
          messaging: 0,
          reviews: 0,
          search: 0,
        },
        uvp_keyword_rankings: {},
        differentiation_proof: [],
        nps_before: null,
        nps_after: null,
        alignment_gaps: [],
      }

      // Update diagnostic with UVP analysis
      const { data: updated, error } = await supabase
        .from('mirror_diagnostics')
        .update({
          uvp_delivery_analysis: uvpDeliveryAnalysis,
          has_completed_uvp: true,
        })
        .eq('id', diagnostic.id)
        .select()
        .single()

      if (error) throw error

      return updated
    } catch (error) {
      console.error('[MirrorOrchestrator] UVP enhancement failed:', error)
      return null
    }
  }

  /**
   * Refresh diagnostic (re-run analysis)
   */
  static async refreshDiagnostic(
    brandId: string,
    brandData: BrandData
  ): Promise<MirrorDiagnostic> {
    console.log('[MirrorOrchestrator] Refreshing diagnostic for:', brandData.name)
    return this.runFullDiagnostic(brandId, brandData)
  }
}
