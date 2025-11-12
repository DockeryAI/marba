/**
 * OutScraper API Integration
 * Business data and review scraping
 */

const OUTSCRAPER_API_KEY = import.meta.env.VITE_OUTSCRAPER_API_KEY

interface BusinessListing {
  name: string
  address: string
  rating: number
  reviews_count: number
  category: string
}

class OutScraperAPIService {
  async getBusinessListings(location: string, category: string): Promise<BusinessListing[]> {
    return [
      {
        name: `${category} Business 1`,
        address: `123 Main St, ${location}`,
        rating: 4.5,
        reviews_count: 342,
        category
      }
    ]
  }

  async scrapeGoogleReviews(businessId: string): Promise<any[]> {
    return []
  }
}

export const OutScraperAPI = new OutScraperAPIService()
export type { BusinessListing }
