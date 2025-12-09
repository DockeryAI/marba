/**
 * OutScraper API Integration
 * Real Google Maps business data and review scraping
 * Migrated to Supabase Edge Functions for API key security
 */

import { supabase } from '@/lib/supabase'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface BusinessListing {
  place_id: string
  name: string
  address: string
  phone?: string
  website?: string
  category: string[]
  rating: number
  reviews_count: number
  price_level?: number
  hours?: OpeningHours
  photos?: string[]
  verified: boolean
  claimed?: boolean
  latitude?: number
  longitude?: number
}

export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface GoogleReview {
  author_name: string
  author_photo?: string
  rating: number
  text: string
  time: string  // ISO date string
  language?: string
  likes?: number
  author_reviews_count?: number
  response?: {
    text: string
    time: string
  }
}

export interface BusinessProfile extends BusinessListing {
  description?: string
  services?: string[]
  attributes?: Record<string, boolean>
  popular_times?: PopularTime[]
  reviews_per_rating?: Record<string, number>
  reviews_tags?: string[]
}

export interface PopularTime {
  day: string
  hours: { hour: number; popularity: number }[]
}

export interface EnrichedCompetitor extends BusinessListing {
  distance_from_brand?: number
  relative_strength?: 'stronger' | 'similar' | 'weaker'
  competitive_advantages?: string[]
  shared_keywords?: string[]
  overlapping_services?: string[]
}

export interface SentimentAnalysis {
  overall_sentiment: number  // 0-1
  positive_count: number
  negative_count: number
  neutral_count: number
  themes: {
    theme: string
    sentiment: number
    mention_count: number
  }[]
  common_phrases: string[]
}

export interface LocalRankingData {
  keyword: string
  position?: number
  map_pack_position?: number
  organic_position?: number
  competitors_above: string[]
}

// ============================================================================
// OutScraper API Service
// ============================================================================

class OutScraperAPIService {

  /**
   * 1. Get business listings from Google Maps
   * Uses edge function to hide API key
   */
  async getBusinessListings(params: {
    query: string
    location?: string
    limit?: number
    language?: string
    region?: string
  }): Promise<BusinessListing[]> {
    console.log('[OutScraper] Fetching business listings:', params.query)

    try {
      const { data, error } = await supabase.functions.invoke('outscraper-search', {
        body: {
          action: 'maps-search',
          query: params.query,
          location: params.location,
          limit: params.limit || 20,
          language: params.language || 'en',
          region: params.region || 'US',
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('No response from edge function')
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error from edge function')
      }

      const listings = data.data || []
      console.log('[OutScraper] Found', listings.length, 'business listings')
      return listings
    } catch (error) {
      console.error('[OutScraper] getBusinessListings failed:', error)
      throw error
    }
  }

  /**
   * 2. Scrape Google reviews for a business
   * Uses edge function to hide API key
   */
  async scrapeGoogleReviews(params: {
    place_id: string
    business_name?: string
    industry?: string
    location?: string
    limit?: number
    sort?: 'newest' | 'highest' | 'lowest'
    cutoff_date?: string
  }): Promise<GoogleReview[]> {
    console.log('[OutScraper] Scraping reviews for:', params.business_name || params.place_id)

    try {
      const { data, error } = await supabase.functions.invoke('outscraper-search', {
        body: {
          action: 'reviews',
          placeId: params.place_id,
          reviewsLimit: params.limit || 100,
          sort: params.sort || 'newest',
          language: 'en',
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('No response from edge function')
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error from edge function')
      }

      const reviews = data.data || []
      console.log('[OutScraper] Found', reviews.length, 'reviews')
      return reviews
    } catch (error) {
      console.error('[OutScraper] scrapeGoogleReviews failed:', error)
      // Return empty array for graceful degradation
      return []
    }
  }


  /**
   * 3. Get detailed business profile
   * Uses edge function to hide API key
   */
  async getBusinessDetails(place_id: string): Promise<BusinessProfile> {
    console.log('[OutScraper] Fetching business details for:', place_id)

    try {
      const { data, error } = await supabase.functions.invoke('outscraper-search', {
        body: {
          action: 'business-details',
          placeId: place_id,
          language: 'en',
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('No response from edge function')
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error from edge function')
      }

      const profile = data.data
      console.log('[OutScraper] Retrieved business profile for:', profile.name)
      return profile
    } catch (error) {
      console.error('[OutScraper] getBusinessDetails failed:', error)
      throw error
    }
  }

  /**
   * 4. Discover competitors with enrichment
   */
  async discoverCompetitors(params: {
    businessName: string
    location: string
    industry: string
    radius?: number
  }): Promise<EnrichedCompetitor[]> {
    console.log('[OutScraper] Discovering competitors for:', params.businessName)

    // Search for competitors in the same industry
    const query = `${params.industry} near ${params.location}`
    const listings = await this.getBusinessListings({
      query,
      location: params.location,
      limit: 20,
    })

    // Filter out the brand itself
    const competitors = listings.filter(
      listing => !listing.name.toLowerCase().includes(params.businessName.toLowerCase())
    )

    // Enrich with basic competitive analysis
    const enriched: EnrichedCompetitor[] = competitors.map(competitor => ({
      ...competitor,
      relative_strength: this.assessRelativeStrength(competitor),
      competitive_advantages: this.identifyAdvantages(competitor),
    }))

    console.log('[OutScraper] Found', enriched.length, 'competitors')
    return enriched
  }

  /**
   * 5. Analyze review sentiment
   */
  async analyzeReviewSentiment(reviews: GoogleReview[]): Promise<SentimentAnalysis> {
    console.log('[OutScraper] Analyzing sentiment for', reviews.length, 'reviews')

    const positive = reviews.filter(r => r.rating >= 4).length
    const negative = reviews.filter(r => r.rating <= 2).length
    const neutral = reviews.filter(r => r.rating === 3).length

    const totalSentiment = reviews.reduce((sum, r) => sum + (r.rating / 5), 0) / reviews.length

    // Extract common phrases (simplified - in production, use NLP)
    const allText = reviews.map(r => r.text.toLowerCase()).join(' ')
    const phrases = this.extractCommonPhrases(allText)

    return {
      overall_sentiment: totalSentiment,
      positive_count: positive,
      negative_count: negative,
      neutral_count: neutral,
      themes: this.extractThemes(reviews),
      common_phrases: phrases,
    }
  }

  /**
   * 6. Get local search rankings
   */
  async getLocalSearchRankings(params: {
    keywords: string[]
    location: string
    businessName: string
  }): Promise<LocalRankingData[]> {
    console.log('[OutScraper] Checking local rankings for:', params.businessName)

    const rankings: LocalRankingData[] = []

    for (const keyword of params.keywords) {
      const listings = await this.getBusinessListings({
        query: keyword,
        location: params.location,
        limit: 10,
      })

      const position = listings.findIndex(
        listing => listing.name.toLowerCase().includes(params.businessName.toLowerCase())
      )

      rankings.push({
        keyword,
        position: position >= 0 ? position + 1 : undefined,
        map_pack_position: position >= 0 && position < 3 ? position + 1 : undefined,
        organic_position: position >= 3 ? position - 2 : undefined,
        competitors_above: listings.slice(0, position > 0 ? position : 0).map(l => l.name),
      })
    }

    return rankings
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private assessRelativeStrength(competitor: BusinessListing): 'stronger' | 'similar' | 'weaker' {
    if (competitor.rating >= 4.5 && competitor.reviews_count > 100) return 'stronger'
    if (competitor.rating >= 4.0 && competitor.reviews_count > 50) return 'similar'
    return 'weaker'
  }

  private identifyAdvantages(competitor: BusinessListing): string[] {
    const advantages: string[] = []

    if (competitor.rating >= 4.7) advantages.push('Excellent ratings')
    if (competitor.reviews_count > 200) advantages.push('High review volume')
    if (competitor.verified) advantages.push('Verified business')
    if (competitor.claimed) advantages.push('Claimed listing')
    if (competitor.photos && competitor.photos.length > 10) advantages.push('Strong visual presence')

    return advantages
  }

  private extractCommonPhrases(text: string): string[] {
    // Simplified phrase extraction - in production, use proper NLP
    const words = text.split(/\s+/).filter(w => w.length > 3)
    const frequency: Record<string, number> = {}

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  private extractThemes(reviews: GoogleReview[]): { theme: string; sentiment: number; mention_count: number }[] {
    // Simplified theme extraction
    const themes = [
      { keyword: 'service', theme: 'Service Quality' },
      { keyword: 'price', theme: 'Pricing' },
      { keyword: 'staff', theme: 'Staff' },
      { keyword: 'professional', theme: 'Professionalism' },
      { keyword: 'quick', theme: 'Speed' },
      { keyword: 'recommend', theme: 'Recommendation' },
    ]

    return themes.map(({ keyword, theme }) => {
      const mentions = reviews.filter(r => r.text.toLowerCase().includes(keyword))
      const avgSentiment = mentions.length > 0
        ? mentions.reduce((sum, r) => sum + r.rating, 0) / mentions.length / 5
        : 0

      return {
        theme,
        sentiment: avgSentiment,
        mention_count: mentions.length,
      }
    }).filter(t => t.mention_count > 0)
  }
}

export const OutScraperAPI = new OutScraperAPIService()
