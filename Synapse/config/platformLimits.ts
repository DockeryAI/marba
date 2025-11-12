/**
 * Platform Character Limits Configuration
 *
 * Defines character limits for different social media and content platforms.
 * Used for validating content length during generation.
 *
 * Created: 2025-11-11
 */

import type { PlatformLimits, Platform } from '@/types/synapseContent.types';

/**
 * Character limits by platform
 *
 * Each platform has min/max/optimal for:
 * - headline: Short attention-grabbing title
 * - body: Main content text
 * - total: Combined character count
 */
export const PLATFORM_LIMITS: Record<Platform, PlatformLimits> = {
  'LinkedIn': {
    platform: 'LinkedIn',
    headline: { min: 40, max: 150, optimal: 120 },
    body: { min: 200, max: 3000, optimal: 1300 },
    total: { min: 300, max: 3000, optimal: 1400 }
  },

  'Twitter': {
    platform: 'Twitter',
    headline: { min: 30, max: 100, optimal: 80 },
    body: { min: 50, max: 280, optimal: 240 },
    total: { min: 100, max: 280, optimal: 250 }
  },

  'Facebook': {
    platform: 'Facebook',
    headline: { min: 40, max: 150, optimal: 120 },
    body: { min: 100, max: 5000, optimal: 1500 },
    total: { min: 200, max: 5000, optimal: 1600 }
  },

  'Instagram': {
    platform: 'Instagram',
    headline: { min: 30, max: 100, optimal: 80 },
    body: { min: 100, max: 2200, optimal: 1000 },
    total: { min: 150, max: 2200, optimal: 1100 }
  },

  'Email': {
    platform: 'Email',
    headline: { min: 30, max: 90, optimal: 60 },  // Subject line
    body: { min: 200, max: 10000, optimal: 2000 },
    total: { min: 250, max: 10000, optimal: 2100 }
  },

  'Blog': {
    platform: 'Blog',
    headline: { min: 40, max: 150, optimal: 100 },
    body: { min: 1000, max: 50000, optimal: 2000 },
    total: { min: 1100, max: 50000, optimal: 2100 }
  },

  'SMS': {
    platform: 'SMS',
    headline: { min: 10, max: 50, optimal: 30 },
    body: { min: 20, max: 160, optimal: 140 },
    total: { min: 50, max: 160, optimal: 150 }
  },

  'Reddit': {
    platform: 'Reddit',
    headline: { min: 30, max: 300, optimal: 150 },
    body: { min: 100, max: 40000, optimal: 1500 },
    total: { min: 150, max: 40000, optimal: 1650 }
  }
};

/**
 * Get platform limits by name
 */
export function getPlatformLimits(platform: Platform): PlatformLimits {
  return PLATFORM_LIMITS[platform];
}

/**
 * Get all supported platforms
 */
export function getSupportedPlatforms(): Platform[] {
  return Object.keys(PLATFORM_LIMITS) as Platform[];
}

/**
 * Check if a platform is supported
 */
export function isPlatformSupported(platform: string): platform is Platform {
  return platform in PLATFORM_LIMITS;
}

/**
 * Get optimal character count for a specific section
 */
export function getOptimalCount(
  platform: Platform,
  section: 'headline' | 'body' | 'total'
): number {
  return PLATFORM_LIMITS[platform][section].optimal;
}

/**
 * Check if character count is within acceptable range
 */
export function isWithinRange(
  platform: Platform,
  section: 'headline' | 'body' | 'total',
  count: number
): boolean {
  const limits = PLATFORM_LIMITS[platform][section];
  return count >= limits.min && count <= limits.max;
}
