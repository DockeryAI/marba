/**
 * BuzzSumo API Integration
 * Engagement-validated trending content discovery
 * Proxied through Edge Function to hide API keys
 */

import { supabase } from '@/lib/supabase';

// Cache TTL: 6 hours for trending data (balances freshness vs API cost)
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// Viral threshold: 1000+ shares indicates significant social proof
// Based on BuzzSumo's industry benchmarks for "viral" content
const DEFAULT_MIN_VIRAL_SHARES = 1000;

// Query building: include industry + first 2 keywords to balance specificity vs API results
// More keywords = fewer results; fewer = less relevant
const MAX_KEYWORDS_IN_QUERY = 2;

export interface TrendingArticle {
  id: string;
  url: string;
  title: string;
  totalShares: number;
  facebookShares: number;
  twitterShares: number;
  pinterestShares: number;
  redditEngagements: number;
  publishedDate: string;
  domain: string;
  author?: string;
  thumbnail?: string;
}

export interface TrendingResult {
  articles: TrendingArticle[];
  query: string;
  hours: number;
  fetchedAt: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface EdgeFunctionResponse {
  success: boolean;
  articles?: any[];
  error?: string;
  count?: number;
}

class BuzzSumoAPIService {
  private cache = new Map<string, CacheEntry<unknown>>();

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear all cached data (for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Parse and validate edge function response
   */
  private parseResponse(data: unknown, error: unknown): TrendingArticle[] {
    if (error) {
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: string }).message)
        : 'Unknown edge function error';
      throw new Error(errorMsg);
    }

    if (!data) {
      throw new Error('No response from edge function');
    }

    const response = data as EdgeFunctionResponse;

    if (!response.success) {
      throw new Error(response.error || 'Edge function returned unsuccessful response');
    }

    if (!Array.isArray(response.articles)) {
      return [];
    }

    // Transform snake_case to camelCase
    return response.articles.map((article: any) => ({
      id: article.id,
      url: article.url,
      title: article.title,
      totalShares: article.total_shares || 0,
      facebookShares: article.facebook_shares || 0,
      twitterShares: article.twitter_shares || 0,
      pinterestShares: article.pinterest_shares || 0,
      redditEngagements: article.total_reddit_engagements || 0,
      publishedDate: article.published_date,
      domain: article.domain_name,
      author: article.author_name,
      thumbnail: article.thumbnail,
    }));
  }

  /**
   * Get trending content for a query/industry
   * @param query - Industry or topic to search (e.g., "restaurant marketing", "plumbing tips")
   * @param hours - Time window: 24, 48, or 168 (1 week). Default 24.
   * @param numResults - Max results to return. Default 20.
   */
  async getTrending(
    query: string,
    hours: number = 24,
    numResults: number = 20
  ): Promise<TrendingResult> {
    const cacheKey = `trending_${query}_${hours}_${numResults}`;
    const cached = this.getCached<TrendingResult>(cacheKey);
    if (cached) {
      console.log('[BuzzSumo API] Returning cached trending data');
      return cached;
    }

    console.log(`[BuzzSumo API] Fetching trending content for: "${query}"`);

    const { data, error } = await supabase.functions.invoke('buzzsumo-intelligence', {
      body: {
        action: 'trending',
        query,
        hours,
        num_results: numResults,
      },
    });

    const articles = this.parseResponse(data, error);
    console.log(`[BuzzSumo API] Received ${articles.length} trending articles`);

    const result: TrendingResult = {
      articles,
      query,
      hours,
      fetchedAt: new Date().toISOString(),
    };

    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Get trending content for an industry with smart query building
   * @param industry - Industry name (e.g., "Restaurant", "Plumbing")
   * @param keywords - Additional keywords to include
   */
  async getTrendingForIndustry(
    industry: string,
    keywords: string[] = []
  ): Promise<TrendingResult> {
    // Build query: industry + top keywords (limited to avoid overly narrow results)
    const queryParts = [industry, ...keywords.slice(0, MAX_KEYWORDS_IN_QUERY)];
    const query = queryParts.join(' ');

    return this.getTrending(query, 24, 20);
  }

  /**
   * Get viral content (high engagement threshold)
   * Filters to content with significant social proof
   */
  async getViralContent(
    query: string,
    minShares: number = DEFAULT_MIN_VIRAL_SHARES
  ): Promise<TrendingArticle[]> {
    const result = await this.getTrending(query, 48, 50);

    return result.articles.filter(article => article.totalShares >= minShares);
  }

  /**
   * Analyze trending topics to extract themes
   * Returns common patterns across viral content
   */
  async analyzeTrendingThemes(industry: string): Promise<{
    topDomains: string[];
    avgShares: number;
    topTitles: string[];
    contentTypes: string[];
  }> {
    const result = await this.getTrending(industry, 24, 30);

    if (result.articles.length === 0) {
      return {
        topDomains: [],
        avgShares: 0,
        topTitles: [],
        contentTypes: [],
      };
    }

    // Extract top domains
    const domainCounts = new Map<string, number>();
    result.articles.forEach(article => {
      domainCounts.set(article.domain, (domainCounts.get(article.domain) || 0) + 1);
    });
    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain]) => domain);

    // Calculate average shares
    const totalShares = result.articles.reduce((sum, a) => sum + a.totalShares, 0);
    const avgShares = Math.round(totalShares / result.articles.length);

    // Top performing titles
    const topTitles = result.articles
      .sort((a, b) => b.totalShares - a.totalShares)
      .slice(0, 5)
      .map(a => a.title);

    // Detect content types from titles
    const contentTypes: string[] = [];
    const patterns = [
      { pattern: /how to/i, type: 'How-To' },
      { pattern: /\d+ (ways|tips|steps|reasons)/i, type: 'Listicle' },
      { pattern: /guide/i, type: 'Guide' },
      { pattern: /vs\.?|versus/i, type: 'Comparison' },
      { pattern: /review/i, type: 'Review' },
      { pattern: /why/i, type: 'Explainer' },
    ];

    result.articles.forEach(article => {
      patterns.forEach(({ pattern, type }) => {
        if (pattern.test(article.title) && !contentTypes.includes(type)) {
          contentTypes.push(type);
        }
      });
    });

    return {
      topDomains,
      avgShares,
      topTitles,
      contentTypes,
    };
  }
}

export const BuzzSumoAPI = new BuzzSumoAPIService();
