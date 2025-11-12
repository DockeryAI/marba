/**
 * Serper API Integration (Google Search)
 * Search insights and trending queries
 */

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY

interface SearchResult {
  title: string
  link: string
  snippet: string
  position: number
}

class SerperAPIService {
  async searchGoogle(query: string): Promise<SearchResult[]> {
    if (!SERPER_API_KEY) {
      throw new Error(
        'Serper API key not configured. Add VITE_SERPER_API_KEY to your .env file. ' +
        'Get a free API key from https://serper.dev/'
      )
    }

    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query })
      })

      const data = await response.json()
      return (data.organic || []).map((result: any, index: number) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        position: index + 1
      }))
    } catch (error) {
      console.error('[Serper API] Error:', error)
      throw error
    }
  }

  async getTrendingSearches(): Promise<string[]> {
    if (!SERPER_API_KEY) {
      throw new Error(
        'Serper API key not configured. Add VITE_SERPER_API_KEY to your .env file. ' +
        'Get a free API key from https://serper.dev/'
      )
    }

    // TODO: Implement real trending searches via Serper API
    throw new Error('getTrendingSearches() not yet implemented. Use Google Trends API instead.')
  }

  /**
   * Search for competitors in an industry
   */
  async searchCompetitors(query: string, excludeBrand?: string): Promise<string[]> {
    const results = await this.searchGoogle(query)

    // Extract domains from search results
    const domains = results
      .map(result => {
        try {
          const url = new URL(result.link)
          return url.hostname.replace(/^www\./, '')
        } catch {
          return null
        }
      })
      .filter((domain): domain is string => domain !== null)
      .filter(domain => {
        // Exclude common non-competitor domains
        const excluded = ['wikipedia.org', 'youtube.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com']
        if (excluded.some(e => domain.includes(e))) return false

        // Exclude the brand's own domain
        if (excludeBrand && domain.toLowerCase().includes(excludeBrand.toLowerCase())) return false

        return true
      })

    // Remove duplicates
    return Array.from(new Set(domains))
  }
}

export const SerperAPI = new SerperAPIService()
export type { SearchResult }
