/**
 * YouTube Intelligence Service
 * Analyzes trending videos and content for industry insights
 * Now proxied through Supabase Edge Function using Apify scraper
 */

import { supabase } from '@/lib/supabase'

// Cache TTL: 1 hour - balance between freshness and API cost
const CACHE_TTL_MS = 60 * 60 * 1000

interface YouTubeVideo {
  id: string
  title: string
  description: string
  channelTitle: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags: string[]
  categoryId: string
}

interface TrendAnalysis {
  trending_topics: string[]
  popular_formats: string[]
  engagement_patterns: {
    avgViewCount: number
    avgEngagementRate: number
  }
  content_angles: string[]
  relevance_score: number
}

interface EdgeFunctionResponse {
  success: boolean
  videos?: YouTubeVideo[]
  error?: string
  count?: number
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class YouTubeAPIService {
  private cache = new Map<string, CacheEntry<unknown>>()

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T
    }
    this.cache.delete(key)
    return null
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Clear all cached data (for testing)
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Parse and validate edge function response
   */
  private parseResponse(data: unknown, error: unknown): YouTubeVideo[] {
    // Handle Supabase invoke error
    if (error) {
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: string }).message)
        : 'Unknown edge function error'
      throw new Error(errorMsg)
    }

    // Handle null/undefined response
    if (!data) {
      throw new Error('No response from edge function')
    }

    // Type check response
    const response = data as EdgeFunctionResponse

    // Check for application-level error
    if (!response.success) {
      throw new Error(response.error || 'Edge function returned unsuccessful response')
    }

    // Return videos array (default to empty if missing)
    return Array.isArray(response.videos) ? response.videos : []
  }

  /**
   * Get trending videos for a specific category and region
   */
  async getTrendingVideos(category?: string, region: string = 'US'): Promise<YouTubeVideo[]> {
    const cacheKey = `trending_${category ?? 'all'}_${region}`
    const cached = this.getCached<YouTubeVideo[]>(cacheKey)
    if (cached) return cached

    console.log('[YouTube API] Fetching trending videos via edge function')

    const { data, error } = await supabase.functions.invoke('youtube-intelligence', {
      body: {
        action: 'trending',
        category,
        region,
      },
    })

    const videos = this.parseResponse(data, error)
    console.log(`[YouTube API] Received ${videos.length} trending videos`)

    this.setCache(cacheKey, videos)
    return videos
  }

  /**
   * Search videos by keywords
   */
  async searchVideos(keywords: string[], maxResults: number = 20): Promise<YouTubeVideo[]> {
    if (!keywords || keywords.length === 0) {
      return []
    }

    const query = keywords.join(' ')
    const cacheKey = `search_${query}_${maxResults}`
    const cached = this.getCached<YouTubeVideo[]>(cacheKey)
    if (cached) return cached

    console.log('[YouTube API] Searching videos via edge function:', keywords)

    const { data, error } = await supabase.functions.invoke('youtube-intelligence', {
      body: {
        action: 'search',
        keywords,
        maxResults,
      },
    })

    const videos = this.parseResponse(data, error)
    console.log(`[YouTube API] Received ${videos.length} search results`)

    this.setCache(cacheKey, videos)
    return videos
  }

  /**
   * Analyze video trends for an industry
   * Note: This performs client-side analysis of video metadata
   */
  async analyzeVideoTrends(industry: string, keywords: string[]): Promise<TrendAnalysis> {
    const cacheKey = `trends_${industry}_${keywords.join('_')}`
    const cached = this.getCached<TrendAnalysis>(cacheKey)
    if (cached) return cached

    const videos = await this.searchVideos(keywords, 50)

    // Handle empty results
    if (videos.length === 0) {
      const emptyAnalysis: TrendAnalysis = {
        trending_topics: [],
        popular_formats: [],
        engagement_patterns: {
          avgViewCount: 0,
          avgEngagementRate: 0,
        },
        content_angles: [],
        relevance_score: 0,
      }
      this.setCache(cacheKey, emptyAnalysis)
      return emptyAnalysis
    }

    // Extract trending topics from tags (frequency analysis)
    const tagFrequency = new Map<string, number>()
    for (const video of videos) {
      for (const tag of video.tags) {
        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1)
      }
    }

    const trendingTopics = Array.from(tagFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag)

    // Detect content formats from titles
    const formatPatterns: Array<{ pattern: RegExp; name: string }> = [
      { pattern: /tutorial/i, name: 'Tutorial' },
      { pattern: /review/i, name: 'Review' },
      { pattern: /how\s+to/i, name: 'How-To' },
      { pattern: /tips/i, name: 'Tips' },
      { pattern: /\bvs\.?\b/i, name: 'Comparison' },
    ]

    const formatCounts = new Map<string, number>()
    for (const video of videos) {
      for (const { pattern, name } of formatPatterns) {
        if (pattern.test(video.title)) {
          formatCounts.set(name, (formatCounts.get(name) || 0) + 1)
        }
      }
    }

    const popularFormats = Array.from(formatCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([format]) => format)

    // Calculate engagement metrics
    let totalViews = 0
    let totalEngagementRate = 0

    for (const video of videos) {
      totalViews += video.viewCount
      // Engagement rate = (likes + comments) / views
      // Use max(1, viewCount) to avoid division by zero
      const engagementRate = (video.likeCount + video.commentCount) / Math.max(1, video.viewCount)
      totalEngagementRate += engagementRate
    }

    const avgViewCount = Math.round(totalViews / videos.length)
    const avgEngagementRate = parseFloat(((totalEngagementRate / videos.length) * 100).toFixed(2))

    // Extract content angles from title keywords
    const anglePatterns: Array<{ pattern: RegExp; angle: string }> = [
      { pattern: /beginner/i, angle: 'Beginner-friendly content' },
      { pattern: /advanced/i, angle: 'Advanced techniques' },
      { pattern: /mistake/i, angle: 'Common mistakes to avoid' },
      { pattern: /secret/i, angle: 'Insider secrets' },
      { pattern: /best/i, angle: 'Best practices' },
    ]

    const detectedAngles = new Set<string>()
    for (const video of videos.slice(0, 10)) {
      let matched = false
      for (const { pattern, angle } of anglePatterns) {
        if (pattern.test(video.title)) {
          detectedAngles.add(angle)
          matched = true
        }
      }
      if (!matched) {
        detectedAngles.add('Educational content')
      }
    }

    // Relevance score based on result quality, not just count
    // Score higher if we got meaningful results with engagement
    const hasEngagement = avgEngagementRate > 0
    const hasTopics = trendingTopics.length > 0
    const resultRatio = videos.length / 50

    const relevance_score = Math.min(100, Math.round(
      (resultRatio * 50) + (hasEngagement ? 25 : 0) + (hasTopics ? 25 : 0)
    ))

    const analysis: TrendAnalysis = {
      trending_topics: trendingTopics,
      popular_formats: popularFormats,
      engagement_patterns: {
        avgViewCount,
        avgEngagementRate,
      },
      content_angles: Array.from(detectedAngles),
      relevance_score,
    }

    this.setCache(cacheKey, analysis)
    return analysis
  }
}

export const YouTubeAPI = new YouTubeAPIService()
export type { YouTubeVideo, TrendAnalysis }
