/**
 * Auto-Refresh Hook for Brand Intelligence
 * Automatically detects and refreshes stale brand data
 */

import { useEffect, useState, useCallback } from 'react';
import { EnrichmentEngine } from '@/services/enrichment/enrichment-engine';
import { supabase } from '@/lib/supabase';
import type { MIRRORSection } from '@/types/enrichment.types';

interface BrandFreshnessStatus {
  brandId: string;
  isStale: boolean;
  lastEnriched: string | null;
  sections: Record<
    MIRRORSection,
    {
      isStale: boolean;
      expiresAt: string | null;
      lastEnriched: string | null;
    }
  >;
}

interface AutoRefreshOptions {
  /**
   * Enable automatic refresh when data is detected as stale
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * Sections to monitor and auto-refresh
   * @default all sections
   */
  sections?: MIRRORSection[];

  /**
   * Threshold in milliseconds to consider data "stale" beyond cache expiration
   * @default 0 (refresh immediately when cache expires)
   */
  staleThreshold?: number;

  /**
   * Callback when refresh starts
   */
  onRefreshStart?: () => void;

  /**
   * Callback when refresh completes
   */
  onRefreshComplete?: () => void;

  /**
   * Callback when refresh fails
   */
  onRefreshError?: (error: Error) => void;
}

/**
 * Hook to automatically manage brand data freshness
 *
 * @example
 * ```tsx
 * const { status, isRefreshing, manualRefresh } = useBrandAutoRefresh(brandId, {
 *   autoRefresh: true,
 *   sections: ['measure', 'optimize'],
 *   onRefreshComplete: () => toast.success('Data refreshed')
 * });
 *
 * return (
 *   <div>
 *     {status.isStale && <Badge>Data needs refresh</Badge>}
 *     <Button onClick={manualRefresh} loading={isRefreshing}>
 *       Refresh
 *     </Button>
 *   </div>
 * );
 * ```
 */
export function useBrandAutoRefresh(
  brandId: string | null | undefined,
  options: AutoRefreshOptions = {}
) {
  const {
    autoRefresh = true,
    sections: targetSections,
    staleThreshold = 0,
    onRefreshStart,
    onRefreshComplete,
    onRefreshError,
  } = options;

  const [status, setStatus] = useState<BrandFreshnessStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const allSections: MIRRORSection[] = [
    'measure',
    'intend',
    'reimagine',
    'reach',
    'optimize',
    'reflect',
  ];

  const sectionsToMonitor = targetSections || allSections;

  /**
   * Check freshness status for a brand
   */
  const checkFreshness = useCallback(async (): Promise<BrandFreshnessStatus | null> => {
    if (!brandId) return null;

    try {
      // Get brand's last_enriched_at from database
      const { data: brand } = await supabase
        .from('brands')
        .select('last_enriched_at')
        .eq('id', brandId)
        .single();

      // Get enrichment status for each section
      const enrichmentStatus = await EnrichmentEngine.getEnrichmentStatus(brandId);

      const sectionStatuses: Record<MIRRORSection, any> = {} as any;
      let hasStaleSection = false;

      for (const section of sectionsToMonitor) {
        const sectionData = enrichmentStatus.sections[section];
        const isExpired = sectionData.expires_at
          ? new Date(sectionData.expires_at).getTime() < Date.now() + staleThreshold
          : true;

        sectionStatuses[section] = {
          isStale: !sectionData.cached || isExpired,
          expiresAt: sectionData.expires_at,
          lastEnriched: sectionData.last_enriched,
        };

        if (sectionStatuses[section].isStale) {
          hasStaleSection = true;
        }
      }

      return {
        brandId,
        isStale: hasStaleSection,
        lastEnriched: brand?.last_enriched_at || null,
        sections: sectionStatuses,
      };
    } catch (err) {
      console.error('Error checking brand freshness:', err);
      return null;
    }
  }, [brandId, sectionsToMonitor, staleThreshold]);

  /**
   * Manually trigger a refresh
   */
  const manualRefresh = useCallback(async (forceSections?: MIRRORSection[]) => {
    if (!brandId) return;

    setIsRefreshing(true);
    setError(null);
    onRefreshStart?.();

    try {
      const sectionsToRefresh = forceSections || sectionsToMonitor;

      // Refresh each section
      for (const section of sectionsToRefresh) {
        await EnrichmentEngine.enrichSection(brandId, section, {
          forceRefresh: true,
        });
      }

      // Update brand's last_enriched_at
      await supabase
        .from('brands')
        .update({ last_enriched_at: new Date().toISOString() })
        .eq('id', brandId);

      // Re-check freshness
      const newStatus = await checkFreshness();
      setStatus(newStatus);

      onRefreshComplete?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Refresh failed');
      setError(error);
      onRefreshError?.(error);
      console.error('Error refreshing brand data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [brandId, sectionsToMonitor, checkFreshness, onRefreshStart, onRefreshComplete, onRefreshError]);

  /**
   * Auto-refresh stale sections
   */
  const autoRefreshIfNeeded = useCallback(async () => {
    if (!brandId || !autoRefresh || isRefreshing) return;

    const freshness = await checkFreshness();
    if (!freshness || !freshness.isStale) return;

    // Get list of stale sections
    const staleSections = (Object.keys(freshness.sections) as MIRRORSection[]).filter(
      (section) => freshness.sections[section].isStale
    );

    if (staleSections.length > 0) {
      console.log(`Auto-refreshing ${staleSections.length} stale sections for brand ${brandId}`);
      await manualRefresh(staleSections);
    }
  }, [brandId, autoRefresh, isRefreshing, checkFreshness, manualRefresh]);

  // Initial freshness check
  useEffect(() => {
    if (!brandId) return;

    checkFreshness().then((freshness) => {
      setStatus(freshness);

      // Trigger auto-refresh if needed
      if (autoRefresh && freshness?.isStale) {
        autoRefreshIfNeeded();
      }
    });
  }, [brandId]); // Only run when brandId changes

  // Periodic freshness check (every 5 minutes)
  useEffect(() => {
    if (!brandId) return;

    const interval = setInterval(() => {
      checkFreshness().then((freshness) => {
        setStatus(freshness);

        // Trigger auto-refresh if needed
        if (autoRefresh && freshness?.isStale) {
          autoRefreshIfNeeded();
        }
      });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [brandId, autoRefresh, checkFreshness, autoRefreshIfNeeded]);

  return {
    /** Current freshness status */
    status,

    /** Whether a refresh is currently in progress */
    isRefreshing,

    /** Any error that occurred during refresh */
    error,

    /** Manually trigger a refresh */
    manualRefresh,

    /** Re-check freshness status without triggering refresh */
    checkFreshness,
  };
}

/**
 * Helper to calculate how old the data is
 */
export function getDataAge(lastEnriched: string | null): {
  ageMs: number;
  ageHours: number;
  ageDays: number;
  label: string;
} {
  if (!lastEnriched) {
    return {
      ageMs: Infinity,
      ageHours: Infinity,
      ageDays: Infinity,
      label: 'Never refreshed',
    };
  }

  const ageMs = Date.now() - new Date(lastEnriched).getTime();
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
  const ageDays = Math.floor(ageHours / 24);

  let label: string;
  if (ageMs < 60 * 60 * 1000) {
    const minutes = Math.floor(ageMs / (1000 * 60));
    label = `${minutes}m ago`;
  } else if (ageHours < 24) {
    label = `${ageHours}h ago`;
  } else {
    label = `${ageDays}d ago`;
  }

  return { ageMs, ageHours, ageDays, label };
}
