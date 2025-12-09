/**
 * OutScraper API Service Tests
 * Verifies edge function integration and correct URL format for reviews
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutScraperAPI, type GoogleReview, type BusinessListing } from '../outscraper-api';

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabase';

describe('OutScraperAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scrapeGoogleReviews', () => {
    it('should call edge function with reviews action and placeId', async () => {
      const mockReviews: GoogleReview[] = [
        {
          author_name: 'John Doe',
          rating: 5,
          text: 'Great service!',
          time: '2025-01-01T00:00:00Z',
        },
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: mockReviews },
        error: null,
      });

      const result = await OutScraperAPI.scrapeGoogleReviews({
        place_id: 'ChIJN5X_gWdZwokRck9rk2guJ1M',
        business_name: 'Test Business',
        limit: 50,
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('outscraper-search', {
        body: {
          action: 'reviews',
          placeId: 'ChIJN5X_gWdZwokRck9rk2guJ1M',
          reviewsLimit: 50,
          sort: 'newest',
          language: 'en',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].author_name).toBe('John Doe');
    });

    /**
     * IMPORTANT: This test documents the expected behavior after the fix.
     * The edge function should convert raw placeId to Google Maps URL format
     * before calling OutScraper API, following the pattern in apify-api.ts:177
     *
     * Expected URL format: https://www.google.com/maps/place/?q=place_id:ChIJ...
     *
     * This test verifies the frontend passes raw placeId (which is correct).
     * The edge function is responsible for the URL conversion.
     */
    it('should pass raw placeId to edge function (edge function handles URL conversion)', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: [] },
        error: null,
      });

      await OutScraperAPI.scrapeGoogleReviews({
        place_id: 'ChIJN5X_gWdZwokRck9rk2guJ1M',
      });

      // Frontend passes raw placeId - edge function converts to URL format
      const callArgs = vi.mocked(supabase.functions.invoke).mock.calls[0];
      expect(callArgs[0]).toBe('outscraper-search');
      expect(callArgs[1]?.body?.placeId).toBe('ChIJN5X_gWdZwokRck9rk2guJ1M');

      // The placeId should NOT already be a URL (that's the edge function's job)
      expect(callArgs[1]?.body?.placeId).not.toContain('https://');
      expect(callArgs[1]?.body?.placeId).not.toContain('google.com');
    });

    it('should return empty array on error (graceful degradation)', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: false, error: 'API error' },
        error: null,
      });

      const result = await OutScraperAPI.scrapeGoogleReviews({
        place_id: 'ChIJtest',
      });

      expect(result).toEqual([]);
    });

    it('should use default limit of 100 when not specified', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: [] },
        error: null,
      });

      await OutScraperAPI.scrapeGoogleReviews({
        place_id: 'ChIJtest',
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('outscraper-search', {
        body: expect.objectContaining({
          reviewsLimit: 100,
        }),
      });
    });

    it('should use default sort of newest when not specified', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: [] },
        error: null,
      });

      await OutScraperAPI.scrapeGoogleReviews({
        place_id: 'ChIJtest',
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('outscraper-search', {
        body: expect.objectContaining({
          sort: 'newest',
        }),
      });
    });

    it('should respect custom sort parameter', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: [] },
        error: null,
      });

      await OutScraperAPI.scrapeGoogleReviews({
        place_id: 'ChIJtest',
        sort: 'highest',
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('outscraper-search', {
        body: expect.objectContaining({
          sort: 'highest',
        }),
      });
    });
  });

  describe('getBusinessListings', () => {
    it('should call edge function with maps-search action', async () => {
      const mockListings: BusinessListing[] = [
        {
          place_id: 'ChIJtest',
          name: 'Test Business',
          address: '123 Main St',
          category: ['Restaurant'],
          rating: 4.5,
          reviews_count: 100,
          verified: true,
        },
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: mockListings },
        error: null,
      });

      const result = await OutScraperAPI.getBusinessListings({
        query: 'restaurants',
        location: 'Austin, TX',
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('outscraper-search', {
        body: {
          action: 'maps-search',
          query: 'restaurants',
          location: 'Austin, TX',
          limit: 20,
          language: 'en',
          region: 'US',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Business');
    });

    it('should throw error when edge function fails', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'Edge function error' },
      });

      await expect(
        OutScraperAPI.getBusinessListings({ query: 'test' })
      ).rejects.toThrow('Edge function error');
    });
  });

  describe('getBusinessDetails', () => {
    it('should call edge function with business-details action', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            place_id: 'ChIJtest',
            name: 'Test Business',
            address: '123 Main St',
            category: ['Spa'],
            rating: 4.8,
            reviews_count: 200,
            verified: true,
          },
        },
        error: null,
      });

      const result = await OutScraperAPI.getBusinessDetails('ChIJtest');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('outscraper-search', {
        body: {
          action: 'business-details',
          placeId: 'ChIJtest',
          language: 'en',
        },
      });

      expect(result.name).toBe('Test Business');
      expect(result.rating).toBe(4.8);
    });
  });

  describe('analyzeReviewSentiment', () => {
    it('should correctly categorize reviews by rating', async () => {
      const reviews: GoogleReview[] = [
        { author_name: 'A', rating: 5, text: 'Amazing!', time: '2025-01-01' },
        { author_name: 'B', rating: 4, text: 'Good', time: '2025-01-01' },
        { author_name: 'C', rating: 3, text: 'Okay', time: '2025-01-01' },
        { author_name: 'D', rating: 2, text: 'Bad', time: '2025-01-01' },
        { author_name: 'E', rating: 1, text: 'Terrible', time: '2025-01-01' },
      ];

      const result = await OutScraperAPI.analyzeReviewSentiment(reviews);

      expect(result).toMatchObject({
        positive_count: 2, // ratings 4 and 5
        negative_count: 2, // ratings 1 and 2
        neutral_count: 1,  // rating 3
      });
    });

    it('should calculate overall sentiment correctly', async () => {
      const reviews: GoogleReview[] = [
        { author_name: 'A', rating: 5, text: 'Great', time: '2025-01-01' },
        { author_name: 'B', rating: 5, text: 'Perfect', time: '2025-01-01' },
      ];

      const result = await OutScraperAPI.analyzeReviewSentiment(reviews);

      // 5/5 = 1.0 overall sentiment
      expect(result.overall_sentiment).toBe(1);
    });
  });

  describe('discoverCompetitors', () => {
    it('should search for competitors and enrich with analysis', async () => {
      const mockListings: BusinessListing[] = [
        {
          place_id: 'ChIJ1',
          name: 'Competitor A',
          address: '456 Oak St',
          category: ['Spa'],
          rating: 4.7,
          reviews_count: 150,
          verified: true,
        },
        {
          place_id: 'ChIJ2',
          name: 'My Business', // This should be filtered out
          address: '789 Elm St',
          category: ['Spa'],
          rating: 4.5,
          reviews_count: 100,
          verified: true,
        },
      ];

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { success: true, data: mockListings },
        error: null,
      });

      const result = await OutScraperAPI.discoverCompetitors({
        businessName: 'My Business',
        location: 'Austin, TX',
        industry: 'spa',
      });

      // Should filter out own business
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Competitor A');

      // Should have enrichment data
      expect(result[0]).toHaveProperty('relative_strength');
      expect(result[0]).toHaveProperty('competitive_advantages');
    });
  });
});
