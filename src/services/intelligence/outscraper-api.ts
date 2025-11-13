/**
 * OutScraper API Integration
 * Real Google Maps business data and review scraping
 * API Docs: https://outscraper.com/api-docs/
 */

const OUTSCRAPER_API_KEY = import.meta.env.VITE_OUTSCRAPER_API_KEY
const OUTSCRAPER_API_URL = 'https://api.app.outscraper.com'

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
  private baseUrl = OUTSCRAPER_API_URL

  /**
   * Check if API key is configured
   */
  private checkApiKey(): void {
    if (!OUTSCRAPER_API_KEY) {
      throw new Error(
        'OutScraper API key not configured.\n' +
        'Add VITE_OUTSCRAPER_API_KEY to your .env file.\n' +
        'Get a free API key from: https://outscraper.com/\n' +
        'Required for: Competitor discovery and review analysis'
      )
    }
  }

  /**
   * Make API request with error handling
   */
  private async makeRequest<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    this.checkApiKey()

    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-API-KEY': OUTSCRAPER_API_KEY!,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `OutScraper API error (${response.status}): ${errorText}\n` +
          `Endpoint: ${endpoint}\n` +
          `Check your API key and quota at: https://outscraper.com/dashboard/`
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof Error) {
        console.error('[OutScraper API] Request failed:', error.message)
        throw error
      }
      throw new Error(`OutScraper API request failed: ${String(error)}`)
    }
  }

  /**
   * 1. Get business listings from Google Maps
   * API Docs: https://outscraper.com/google-maps-scraper-api/
   */
  async getBusinessListings(params: {
    query: string
    location?: string
    limit?: number
    language?: string
    region?: string
  }): Promise<BusinessListing[]> {
    console.log('[OutScraper] Fetching business listings:', params.query)

    const endpoint = '/maps/search-v3'
    const apiParams = {
      query: params.location ? `${params.query} near ${params.location}` : params.query,
      limit: params.limit || 20,
      language: params.language || 'en',
      region: params.region || 'US',
      fields: 'place_id,name,full_address,phone,site,category,rating,reviews,price_level,working_hours,photos_count,verified,claimed,latitude,longitude'
    }

    try {
      const response = await this.makeRequest<any>(endpoint, apiParams)

      // OutScraper returns array of arrays (batch results)
      const results = response.data?.[0] || []

      const listings: BusinessListing[] = results.map((item: any) => ({
        place_id: item.place_id || item.google_id || '',
        name: item.name || '',
        address: item.full_address || item.address || '',
        phone: item.phone,
        website: item.site || item.website,
        category: Array.isArray(item.category) ? item.category : [item.category || 'Business'],
        rating: parseFloat(item.rating) || 0,
        reviews_count: parseInt(item.reviews) || 0,
        price_level: item.price_level,
        verified: item.verified === true || item.verified === 'true',
        claimed: item.claimed === true || item.claimed === 'true',
        latitude: item.latitude,
        longitude: item.longitude,
      }))

      console.log('[OutScraper] Found', listings.length, 'business listings')
      return listings
    } catch (error) {
      console.error('[OutScraper] getBusinessListings failed:', error)
      throw error
    }
  }

  /**
   * 2. Scrape Google reviews for a business
   * API Docs: https://outscraper.com/google-reviews-scraper-api/
   */
  async scrapeGoogleReviews(params: {
    place_id: string
    limit?: number
    sort?: 'newest' | 'highest' | 'lowest'
    cutoff_date?: string
  }): Promise<GoogleReview[]> {
    console.log('[OutScraper] Scraping reviews for:', params.place_id)

    const endpoint = '/maps/reviews-v3'
    const apiParams = {
      query: params.place_id,
      reviewsLimit: params.limit || 100,
      sort: params.sort || 'newest',
      cutoff: params.cutoff_date,
      language: 'en',
    }

    try {
      const response = await this.makeRequest<any>(endpoint, apiParams)

      const results = response.data?.[0] || []
      const reviewsData = results.reviews_data || results.reviews || []

      const reviews: GoogleReview[] = reviewsData.map((review: any) => ({
        author_name: review.author_title || review.author_name || 'Anonymous',
        author_photo: review.author_image || review.author_photo,
        rating: parseInt(review.review_rating) || parseInt(review.rating) || 0,
        text: review.review_text || review.text || '',
        time: review.review_datetime_utc || review.time || new Date().toISOString(),
        language: review.review_language || review.language,
        likes: parseInt(review.review_likes) || 0,
        author_reviews_count: parseInt(review.reviews_count) || 0,
        response: review.owner_answer ? {
          text: review.owner_answer,
          time: review.owner_answer_timestamp || '',
        } : undefined,
      }))

      console.log('[OutScraper] Found', reviews.length, 'reviews')
      return reviews
    } catch (error) {
      console.error('[OutScraper] scrapeGoogleReviews failed:', error)
      throw error
    }
  }

  /**
   * 3. Get detailed business profile
   */
  async getBusinessDetails(place_id: string): Promise<BusinessProfile> {
    console.log('[OutScraper] Fetching business details for:', place_id)

    // Use the maps search with place_id to get full details
    const endpoint = '/maps/search-v3'
    const apiParams = {
      query: place_id,
      limit: 1,
      language: 'en',
    }

    try {
      const response = await this.makeRequest<any>(endpoint, apiParams)
      const results = response.data?.[0] || []
      const item = results[0]

      if (!item) {
        throw new Error(`No business found with place_id: ${place_id}`)
      }

      const profile: BusinessProfile = {
        place_id: item.place_id || item.google_id || '',
        name: item.name || '',
        address: item.full_address || item.address || '',
        phone: item.phone,
        website: item.site || item.website,
        category: Array.isArray(item.category) ? item.category : [item.category || 'Business'],
        rating: parseFloat(item.rating) || 0,
        reviews_count: parseInt(item.reviews) || 0,
        price_level: item.price_level,
        verified: item.verified === true,
        claimed: item.claimed === true,
        latitude: item.latitude,
        longitude: item.longitude,
        description: item.description || item.about,
        services: item.services || [],
        attributes: item.attributes || {},
      }

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
