/**
 * YouTube API Service Tests
 * Verifies edge function integration and response mapping
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YouTubeAPI, type YouTubeVideo, type TrendAnalysis } from '../youtube-api';

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabase';

// Helper to create realistic video data with variation
function createMockVideo(overrides: Partial<YouTubeVideo> = {}): YouTubeVideo {
  const id = overrides.id || `vid_${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    title: overrides.title || `Video ${id}`,
    description: overrides.description || 'A video description',
    channelTitle: overrides.channelTitle || 'Test Channel',
    publishedAt: overrides.publishedAt || new Date().toISOString(),
    viewCount: overrides.viewCount ?? Math.floor(Math.random() * 1000000),
    likeCount: overrides.likeCount ?? Math.floor(Math.random() * 50000),
    commentCount: overrides.commentCount ?? Math.floor(Math.random() * 5000),
    tags: overrides.tags || ['tag1', 'tag2'],
    categoryId: overrides.categoryId || '22',
  };
}

describe('YouTubeAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    YouTubeAPI.clearCache();
  });

  describe('searchVideos', () => {
    it('should call edge function with search action and correct params', async () => {
      const mockVideos = [createMockVideo({ title: 'Coffee Brewing Tutorial' })];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.searchVideos(['coffee', 'brewing']);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('youtube-intelligence', {
        body: {
          action: 'search',
          keywords: ['coffee', 'brewing'],
          maxResults: 20,
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Coffee Brewing Tutorial');
    });

    it('should return YouTubeVideo array with all required properties', async () => {
      const mockVideo = createMockVideo({
        id: 'test123',
        title: 'Test Video',
        viewCount: 1000,
        likeCount: 100,
        commentCount: 50,
        tags: ['tag1'],
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: [mockVideo] },
        error: null,
      });

      const result = await YouTubeAPI.searchVideos(['test']);

      // Verify all interface properties exist
      const video = result[0];
      expect(video).toHaveProperty('id');
      expect(video).toHaveProperty('title');
      expect(video).toHaveProperty('description');
      expect(video).toHaveProperty('channelTitle');
      expect(video).toHaveProperty('publishedAt');
      expect(video).toHaveProperty('viewCount');
      expect(video).toHaveProperty('likeCount');
      expect(video).toHaveProperty('commentCount');
      expect(video).toHaveProperty('tags');
      expect(video).toHaveProperty('categoryId');

      // Type checks
      expect(typeof video.viewCount).toBe('number');
      expect(typeof video.likeCount).toBe('number');
      expect(typeof video.commentCount).toBe('number');
      expect(Array.isArray(video.tags)).toBe(true);
    });

    it('should throw error when edge function returns error', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'Edge function error' },
      });

      await expect(YouTubeAPI.searchVideos(['test-error'])).rejects.toThrow('Edge function error');
    });

    it('should throw error when response has success: false', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: false, error: 'API key not configured' },
        error: null,
      });

      await expect(YouTubeAPI.searchVideos(['test-fail'])).rejects.toThrow('API key not configured');
    });

    it('should throw error when data is null', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await expect(YouTubeAPI.searchVideos(['test-null'])).rejects.toThrow('No response from edge function');
    });

    it('should respect maxResults parameter', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: [] },
        error: null,
      });

      await YouTubeAPI.searchVideos(['test-max'], 50);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('youtube-intelligence', {
        body: {
          action: 'search',
          keywords: ['test-max'],
          maxResults: 50,
        },
      });
    });

    it('should return empty array for empty keywords', async () => {
      const result = await YouTubeAPI.searchVideos([]);
      expect(result).toEqual([]);
      expect(supabase.functions.invoke).not.toHaveBeenCalled();
    });
  });

  describe('getTrendingVideos', () => {
    it('should call edge function with trending action', async () => {
      const mockVideos = [createMockVideo({ viewCount: 5000000 })];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.getTrendingVideos();

      expect(supabase.functions.invoke).toHaveBeenCalledWith('youtube-intelligence', {
        body: {
          action: 'trending',
          category: undefined,
          region: 'US',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].viewCount).toBe(5000000);
    });

    it('should pass category and region parameters', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: [] },
        error: null,
      });

      await YouTubeAPI.getTrendingVideos('26', 'GB');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('youtube-intelligence', {
        body: {
          action: 'trending',
          category: '26',
          region: 'GB',
        },
      });
    });
  });

  describe('analyzeVideoTrends', () => {
    it('should return TrendAnalysis with correct structure', async () => {
      // Create varied, realistic mock data
      const mockVideos = [
        createMockVideo({ title: 'Tutorial: Coffee Basics', viewCount: 15000, likeCount: 800, commentCount: 120, tags: ['coffee', 'tutorial', 'beginner'] }),
        createMockVideo({ title: 'How to Brew Perfect Espresso', viewCount: 25000, likeCount: 1200, commentCount: 200, tags: ['coffee', 'espresso', 'howto'] }),
        createMockVideo({ title: 'Coffee Machine Review 2025', viewCount: 8000, likeCount: 400, commentCount: 80, tags: ['coffee', 'review', 'machine'] }),
        createMockVideo({ title: 'Best Coffee Tips', viewCount: 50000, likeCount: 3000, commentCount: 500, tags: ['coffee', 'tips', 'best'] }),
        createMockVideo({ title: 'Latte Art for Beginners', viewCount: 30000, likeCount: 2000, commentCount: 300, tags: ['coffee', 'latte', 'beginner'] }),
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.analyzeVideoTrends('coffee shop', ['coffee', 'brewing']);

      // Verify TrendAnalysis interface shape (without peakPostingTimes)
      expect(result).toHaveProperty('trending_topics');
      expect(result).toHaveProperty('popular_formats');
      expect(result).toHaveProperty('engagement_patterns');
      expect(result).toHaveProperty('content_angles');
      expect(result).toHaveProperty('relevance_score');

      // Verify engagement_patterns structure (no peakPostingTimes)
      expect(result.engagement_patterns).toHaveProperty('avgViewCount');
      expect(result.engagement_patterns).toHaveProperty('avgEngagementRate');
      expect(result.engagement_patterns).not.toHaveProperty('peakPostingTimes');

      // Type checks
      expect(Array.isArray(result.trending_topics)).toBe(true);
      expect(Array.isArray(result.popular_formats)).toBe(true);
      expect(typeof result.engagement_patterns.avgViewCount).toBe('number');
      expect(typeof result.engagement_patterns.avgEngagementRate).toBe('number');
      expect(typeof result.relevance_score).toBe('number');
    });

    it('should extract trending topics from video tags by frequency', async () => {
      const mockVideos = [
        createMockVideo({ tags: ['coffee', 'latte', 'espresso'] }),
        createMockVideo({ tags: ['coffee', 'cappuccino', 'latte'] }),
        createMockVideo({ tags: ['coffee', 'mocha'] }),
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.analyzeVideoTrends('coffee', ['coffee-tags']);

      // 'coffee' appears 3 times, 'latte' appears 2 times
      expect(result.trending_topics[0]).toBe('coffee');
      expect(result.trending_topics).toContain('latte');
    });

    it('should detect all popular formats from titles', async () => {
      const mockVideos = [
        createMockVideo({ title: 'How to Make Perfect Latte' }),
        createMockVideo({ title: 'Coffee Tutorial for Beginners' }),
        createMockVideo({ title: 'Espresso Machine Review' }),
        createMockVideo({ title: '10 Tips for Better Coffee' }),
        createMockVideo({ title: 'Breville vs DeLonghi Comparison' }),
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.analyzeVideoTrends('coffee', ['coffee-formats']);

      // Should detect all format types
      expect(result.popular_formats).toContain('How-To');
      expect(result.popular_formats).toContain('Tutorial');
      expect(result.popular_formats).toContain('Review');
      expect(result.popular_formats).toContain('Tips');
      expect(result.popular_formats).toContain('Comparison');
    });

    it('should calculate engagement metrics correctly', async () => {
      const mockVideos = [
        createMockVideo({ viewCount: 1000, likeCount: 100, commentCount: 50 }),
        createMockVideo({ viewCount: 2000, likeCount: 200, commentCount: 100 }),
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.analyzeVideoTrends('test', ['test-metrics']);

      // avgViewCount = (1000 + 2000) / 2 = 1500
      expect(result.engagement_patterns.avgViewCount).toBe(1500);

      // engagement rate per video:
      // video1: (100 + 50) / 1000 = 0.15 (15%)
      // video2: (200 + 100) / 2000 = 0.15 (15%)
      // avg = 15%
      expect(result.engagement_patterns.avgEngagementRate).toBe(15);
    });

    it('should handle videos with zero views without division error', async () => {
      const mockVideos = [
        createMockVideo({ viewCount: 0, likeCount: 0, commentCount: 0 }),
        createMockVideo({ viewCount: 1000, likeCount: 100, commentCount: 10 }),
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      const result = await YouTubeAPI.analyzeVideoTrends('test', ['test-zero']);

      // Should not throw, should calculate with Math.max(1, viewCount)
      expect(result.engagement_patterns.avgViewCount).toBe(500);
      expect(typeof result.engagement_patterns.avgEngagementRate).toBe('number');
      expect(Number.isFinite(result.engagement_patterns.avgEngagementRate)).toBe(true);
    });

    it('should return empty analysis for no results', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: [] },
        error: null,
      });

      const result = await YouTubeAPI.analyzeVideoTrends('obscure', ['very-obscure-term']);

      expect(result.trending_topics).toEqual([]);
      expect(result.popular_formats).toEqual([]);
      expect(result.engagement_patterns.avgViewCount).toBe(0);
      expect(result.engagement_patterns.avgEngagementRate).toBe(0);
      expect(result.content_angles).toEqual([]);
      expect(result.relevance_score).toBe(0);
    });

    it('should calculate relevance score based on multiple factors', async () => {
      // Full results with engagement and topics = high score
      const fullResults = Array.from({ length: 50 }, () =>
        createMockVideo({ tags: ['topic1', 'topic2'], viewCount: 1000, likeCount: 50, commentCount: 10 })
      );

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: fullResults },
        error: null,
      });

      const fullResult = await YouTubeAPI.analyzeVideoTrends('full', ['full-results']);
      expect(fullResult.relevance_score).toBe(100); // 50 + 25 + 25

      YouTubeAPI.clearCache();

      // Partial results = lower score
      const partialResults = Array.from({ length: 10 }, () =>
        createMockVideo({ tags: ['topic1'], viewCount: 1000, likeCount: 50, commentCount: 10 })
      );

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: partialResults },
        error: null,
      });

      const partialResult = await YouTubeAPI.analyzeVideoTrends('partial', ['partial-results']);
      // 10/50 * 50 = 10 + 25 (engagement) + 25 (topics) = 60
      expect(partialResult.relevance_score).toBe(60);
    });
  });

  describe('caching behavior', () => {
    it('should return cached results for identical requests', async () => {
      const mockVideos = [createMockVideo({ id: 'cached1' })];

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { success: true, videos: mockVideos },
        error: null,
      });

      // First call
      const result1 = await YouTubeAPI.searchVideos(['cache-test-unique']);
      // Second call with same params
      const result2 = await YouTubeAPI.searchVideos(['cache-test-unique']);

      // Should only call edge function once due to caching
      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('should not cache different requests', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { success: true, videos: [] },
        error: null,
      });

      await YouTubeAPI.searchVideos(['query-a']);
      await YouTubeAPI.searchVideos(['query-b']);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(new Error('Network error'));

      await expect(YouTubeAPI.searchVideos(['test-network'])).rejects.toThrow('Network error');
    });

    it('should handle malformed response with missing videos array', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true }, // Missing videos field
        error: null,
      });

      const result = await YouTubeAPI.searchVideos(['test-malformed']);
      expect(result).toEqual([]);
    });

    it('should handle response with videos as non-array', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, videos: 'not-an-array' },
        error: null,
      });

      const result = await YouTubeAPI.searchVideos(['test-non-array']);
      expect(result).toEqual([]);
    });
  });
});
