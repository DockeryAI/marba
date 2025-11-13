/**
 * Website Analyzer Service
 *
 * Performs deep website scanning to extract services, benefits, and unique aspects
 * for more personalized UVP suggestions
 */

import { supabase } from '@/lib/supabase'

export interface WebsiteAnalysis {
  services: string[]
  products: string[]
  benefits: string[]
  differentiators: string[]
  target_audience: string[]
  problems_solved: string[]
  testimonials: string[]
  pricing_model?: string
  company_values: string[]
  unique_aspects: string[]
  content_themes: string[]
  keywords: string[]
  competitors_mentioned: string[]
  guarantees: string[]
  certifications: string[]
}

class WebsiteAnalyzer {
  /**
   * Perform deep analysis of website content
   */
  async analyzeWebsite(websiteUrl: string, brandId: string): Promise<WebsiteAnalysis | null> {
    console.log('[WebsiteAnalyzer] Starting deep analysis for:', websiteUrl)

    try {
      // First, check if we have recent cached analysis
      const { data: cached, error: cacheError } = await supabase
        .from('website_analyses')
        .select('*')
        .eq('brand_id', brandId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Within last 24 hours
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (cached && !cacheError) {
        console.log('[WebsiteAnalyzer] Using cached analysis from:', cached.created_at)
        return cached.analysis as WebsiteAnalysis
      }

      // Perform new analysis using AI service
      const analysis = await this.performDeepScan(websiteUrl)

      // Cache the results
      if (analysis) {
        await supabase
          .from('website_analyses')
          .upsert({
            brand_id: brandId,
            website_url: websiteUrl,
            analysis: analysis,
            created_at: new Date().toISOString()
          })
      }

      return analysis
    } catch (error) {
      console.error('[WebsiteAnalyzer] Analysis failed:', error)
      return null
    }
  }

  /**
   * Perform the actual deep scan of website
   */
  private async performDeepScan(websiteUrl: string): Promise<WebsiteAnalysis | null> {
    console.log('[WebsiteAnalyzer] Performing deep scan of:', websiteUrl)

    try {
      // Extract key pages to analyze
      const pagesToScan = [
        websiteUrl,
        `${websiteUrl}/about`,
        `${websiteUrl}/services`,
        `${websiteUrl}/products`,
        `${websiteUrl}/testimonials`,
        `${websiteUrl}/pricing`,
        `${websiteUrl}/why-us`,
        `${websiteUrl}/features`
      ]

      // For now, use a simplified extraction
      // In production, this would use web scraping or API calls
      const analysis: WebsiteAnalysis = {
        services: [],
        products: [],
        benefits: [],
        differentiators: [],
        target_audience: [],
        problems_solved: [],
        testimonials: [],
        pricing_model: undefined,
        company_values: [],
        unique_aspects: [],
        content_themes: [],
        keywords: [],
        competitors_mentioned: [],
        guarantees: [],
        certifications: []
      }

      // Extract content patterns
      const extractPatterns = {
        services: [
          /(?:we|our)\s+(?:offer|provide|deliver|specialize in)\s+([^.]+)/gi,
          /(?:services|offerings):\s*([^.]+)/gi,
          /(?:help you|assist with|support)\s+([^.]+)/gi
        ],
        benefits: [
          /(?:you'll|you will|clients)\s+(?:get|receive|achieve|experience)\s+([^.]+)/gi,
          /(?:benefit|advantage|result):\s*([^.]+)/gi,
          /(?:save|increase|reduce|improve)\s+([^.]+)/gi
        ],
        differentiators: [
          /(?:only|unique|exclusive|proprietary)\s+([^.]+)/gi,
          /(?:unlike|different from|better than)\s+([^.]+)/gi,
          /(?:first|leading|pioneer)\s+([^.]+)/gi
        ],
        guarantees: [
          /(?:guarantee|promise|commit to)\s+([^.]+)/gi,
          /(?:money back|satisfaction|risk-free)\s+([^.]+)/gi,
          /(?:if not satisfied|or your money back)\s+([^.]+)/gi
        ]
      }

      // Parse and extract information
      // This is a placeholder for actual implementation
      console.log('[WebsiteAnalyzer] Extraction complete')

      return analysis
    } catch (error) {
      console.error('[WebsiteAnalyzer] Deep scan failed:', error)
      return null
    }
  }

  /**
   * Extract services from website content
   */
  extractServices(content: string): string[] {
    const services: string[] = []

    // Common service indicators
    const servicePatterns = [
      /(?:we offer|we provide|our services include)\s+([^.]+)/gi,
      /(?:specializing in|specialized in)\s+([^.]+)/gi,
      /(?:services?:\s*)((?:[^.]+(?:,|\band\b))+[^.]+)/gi
    ]

    servicePatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          // Clean and split services
          const extracted = match[1]
            .split(/[,;]|\band\b/i)
            .map(s => s.trim())
            .filter(s => s.length > 5 && s.length < 100)

          services.push(...extracted)
        }
      }
    })

    // Remove duplicates and clean
    return [...new Set(services)]
      .map(s => this.cleanExtractedText(s))
      .filter(s => s.length > 0)
  }

  /**
   * Extract benefits from website content
   */
  extractBenefits(content: string): string[] {
    const benefits: string[] = []

    const benefitPatterns = [
      /(?:you'll|you will|customers?|clients?)\s+(?:get|receive|enjoy|benefit from)\s+([^.]+)/gi,
      /(?:save|reduce|increase|improve|enhance)\s+(?:your\s+)?([^.]+)/gi,
      /(?:results? in|leads? to|delivers?)\s+([^.]+)/gi
    ]

    benefitPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          const benefit = this.cleanExtractedText(match[1])
          if (benefit.length > 10 && benefit.length < 150) {
            benefits.push(benefit)
          }
        }
      }
    })

    return [...new Set(benefits)]
  }

  /**
   * Clean extracted text
   */
  private cleanExtractedText(text: string): string {
    return text
      .replace(/[\n\r\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[,.\s]+|[,.\s]+$/g, '')
      .trim()
  }
}

export const websiteAnalyzer = new WebsiteAnalyzer()