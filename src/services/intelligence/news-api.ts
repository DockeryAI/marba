/**
 * News API Integration
 * Fetches industry news and local events for opportunity detection
 * Now proxied through Supabase Edge Function to hide API keys
 */

import { supabase } from '@/lib/supabase'

const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  author?: string
  content?: string
  relevanceScore: number
}

class NewsAPIService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  private getCached(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clearCache(): void {
    this.cache.clear()
  }

  async getIndustryNews(industry: string, keywords: string[]): Promise<NewsArticle[]> {
    const cacheKey = `industry_${industry}_${keywords.join('_')}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase.functions.invoke('news-fetch', {
        body: {
          action: 'industry',
          industry,
          keywords
        }
      })

      if (error) {
        console.warn('[NewsAPI] Edge function error:', error)
        return []
      }

      if (!data) {
        console.warn('[NewsAPI] No response from edge function')
        return []
      }

      if (!data.success) {
        console.warn('[NewsAPI] Edge function returned error:', data.error)
        return []
      }

      if (!Array.isArray(data.articles)) {
        console.warn('[NewsAPI] Invalid response structure from edge function')
        return []
      }

      // Add relevance scores to articles (post-processing in frontend)
      const articles: NewsArticle[] = data.articles.map((article: any) => ({
        ...article,
        relevanceScore: this.calculateRelevance(article, keywords)
      }))

      this.setCache(cacheKey, articles)
      return articles
    } catch (error) {
      console.warn('[NewsAPI] Failed to fetch industry news:', error)
      return []
    }
  }

  async getLocalNews(location: string): Promise<NewsArticle[]> {
    const cacheKey = `local_${location}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase.functions.invoke('news-fetch', {
        body: {
          action: 'local',
          location
        }
      })

      if (error) {
        console.warn('[NewsAPI] Edge function error:', error)
        return []
      }

      if (!data) {
        console.warn('[NewsAPI] No response from edge function')
        return []
      }

      if (!data.success) {
        console.warn('[NewsAPI] Edge function returned error:', data.error)
        return []
      }

      if (!Array.isArray(data.articles)) {
        console.warn('[NewsAPI] Invalid response structure from edge function')
        return []
      }

      // Add relevance scores to articles (fixed score for local news)
      const articles: NewsArticle[] = data.articles.map((article: any) => ({
        ...article,
        relevanceScore: 75
      }))

      this.setCache(cacheKey, articles)
      return articles
    } catch (error) {
      console.warn('[NewsAPI] Failed to fetch local news:', error)
      return []
    }
  }

  private calculateRelevance(article: any, keywords: string[]): number {
    let score = 50
    const text = `${article.title} ${article.description}`.toLowerCase()

    keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) score += 15
    })

    return Math.min(100, score)
  }
}

export const NewsAPI = new NewsAPIService()
export type { NewsArticle }
