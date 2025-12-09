/**
 * UVP Wizard Services Connectivity Test
 *
 * Quick verification that all UVP services can connect to their APIs.
 * Run with: npx vitest run src/services/uvp-wizard/__tests__/connectivity-test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { rhodesAI } from '../rhodes-ai'
import { perplexityAPI } from '../perplexity-api'
import { serpAPI } from '../serp-api'
import { uvpScoringService } from '../uvp-scoring'

describe('UVP Wizard Services Connectivity', () => {
  describe('RhodesAI (Claude)', () => {
    it('should have API available', async () => {
      const available = await rhodesAI.isAvailable()
      expect(available).toBe(true)
    })

    it('should generate suggestions', async () => {
      const response = await rhodesAI.process({
        prompt: 'Generate 3 target customer segments for a roofing company',
        context: { industry: 'roofing' },
        action: 'suggest',
      })

      expect(response).toBeDefined()
      expect(response.suggestions).toBeDefined()
      console.log('[RhodesAI] Suggestions:', response.suggestions)
    }, 30000) // 30s timeout for API call
  })

  describe('PerplexityAPI', () => {
    it('should have API available', async () => {
      const available = await perplexityAPI.isAvailable()
      expect(available).toBe(true)
    })

    it('should get industry insights', async () => {
      const response = await perplexityAPI.getIndustryInsights({
        query: 'What are common customer problems in the roofing industry?',
        context: { industry: 'roofing' },
        max_results: 3,
      })

      expect(response).toBeDefined()
      expect(response.insights).toBeDefined()
      expect(response.insights.length).toBeGreaterThan(0)
      console.log('[PerplexityAPI] Insights:', response.insights)
    }, 30000)
  })

  describe('SerpAPI (Google Search)', () => {
    it('should have API available', async () => {
      const available = await serpAPI.isAvailable()
      expect(available).toBe(true)
    })

    it('should discover competitors', async () => {
      const response = await serpAPI.discoverCompetitors({
        query: 'top roofing companies Dallas Texas',
        num_results: 5,
      })

      expect(response).toBeDefined()
      expect(response.competitors).toBeDefined()
      console.log('[SerpAPI] Competitors:', response.competitors.map(c => c.name))
    }, 30000)
  })

  describe('UVP Scoring Service', () => {
    it('should validate UVP completeness', () => {
      const result = uvpScoringService.validateCompleteness({
        target_customer: 'Homeowners in Dallas',
        customer_problem: 'Roof damage from storms',
      })

      expect(result.is_complete).toBe(false)
      expect(result.missing_fields).toContain('unique_solution')
      expect(result.completion_percentage).toBe(40) // 2 of 5 required fields
      console.log('[UVPScoring] Validation:', result)
    })

    it('should quick score a partial UVP', async () => {
      const score = await uvpScoringService.quickScore({
        target_customer: 'Homeowners in Dallas who need roof repairs after storm damage',
        customer_problem: 'Storm damage leaves roofs vulnerable and homeowners worried about costly repairs',
        unique_solution: 'Same-day emergency inspections with insurance claim assistance',
        key_benefit: 'Get your roof fixed in 48 hours with zero out-of-pocket costs',
        differentiation: 'Only company with certified storm damage specialists and direct insurance partnerships',
        industry: 'roofing',
      })

      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
      console.log('[UVPScoring] Quick Score:', score)
    }, 30000)
  })
})
