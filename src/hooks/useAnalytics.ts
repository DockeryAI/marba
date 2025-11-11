// Custom hook for Analytics and Performance Metrics

import { useState, useEffect } from 'react';
import { supabase, functions } from '@/lib/supabase';
import type {
  PlatformMetricsSnapshot,
  EngagementInboxItem,
  ContentPlatform,
} from '@/types';

export function useAnalytics(brandId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetricsSnapshot[]>([]);
  const [inboxItems, setInboxItems] = useState<EngagementInboxItem[]>([]);

  // Fetch platform metrics
  const fetchMetrics = async (platform?: ContentPlatform, days: number = 30) => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('platform_metrics_snapshots')
        .select('*')
        .eq('brand_id', brandId)
        .gte('snapshot_date', startDate.toISOString())
        .lte('snapshot_date', endDate.toISOString())
        .order('snapshot_date', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setMetrics(data || []);

      return data || [];
    } catch (err: any) {
      setError(err);
      console.error('Error fetching metrics:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Collect fresh analytics from platform
  const collectAnalytics = async (platform: ContentPlatform, days: number = 7) => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await functions.collectAnalytics(
        brandId,
        platform,
        {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        }
      );

      // Refresh metrics after collection
      await fetchMetrics(platform, days);

      return response;
    } catch (err: any) {
      setError(err);
      console.error('Error collecting analytics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch engagement inbox items
  const fetchInboxItems = async (filters?: {
    platform?: ContentPlatform;
    status?: string;
    requiresResponse?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('engagement_inbox')
        .select('*')
        .eq('brand_id', brandId)
        .order('occurred_at', { ascending: false });

      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.requiresResponse !== undefined) {
        query = query.eq('requires_response', filters.requiresResponse);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setInboxItems(data || []);

      return data || [];
    } catch (err: any) {
      setError(err);
      console.error('Error fetching inbox items:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Respond to an engagement
  const respondToEngagement = async (
    itemId: string,
    responseContent: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('engagement_inbox')
        .update({
          status: 'responded',
          response_content: responseContent,
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      setInboxItems(prev =>
        prev.map(item => (item.id === itemId ? data : item))
      );

      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error responding to engagement:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update inbox item status
  const updateInboxItemStatus = async (
    itemId: string,
    status: 'new' | 'in_progress' | 'responded' | 'escalated' | 'archived'
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('engagement_inbox')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      setInboxItems(prev =>
        prev.map(item => (item.id === itemId ? data : item))
      );

      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error updating inbox item status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get metrics summary for a specific platform
  const getPlatformSummary = (platform: ContentPlatform) => {
    const platformMetrics = metrics.filter(m => m.platform === platform);

    if (platformMetrics.length === 0) {
      return null;
    }

    const latest = platformMetrics[0];
    const previous = platformMetrics.length > 1 ? platformMetrics[1] : null;

    return {
      current: latest.metrics,
      comparisons: latest.comparisons,
      trend: previous
        ? {
            followers: latest.metrics.followers - (previous.metrics.followers || 0),
            engagementRate:
              latest.metrics.avg_engagement_rate - (previous.metrics.avg_engagement_rate || 0),
          }
        : null,
    };
  };

  // Get overall summary across all platforms
  const getOverallSummary = () => {
    const latestByPlatform = metrics.reduce((acc, metric) => {
      if (!acc[metric.platform] || new Date(metric.snapshot_date) > new Date(acc[metric.platform].snapshot_date)) {
        acc[metric.platform] = metric;
      }
      return acc;
    }, {} as Record<string, PlatformMetricsSnapshot>);

    const totalFollowers = Object.values(latestByPlatform).reduce(
      (sum, m) => sum + m.metrics.followers,
      0
    );

    const avgEngagementRate =
      Object.values(latestByPlatform).reduce(
        (sum, m) => sum + m.metrics.avg_engagement_rate,
        0
      ) / Object.keys(latestByPlatform).length || 0;

    const totalReach = Object.values(latestByPlatform).reduce(
      (sum, m) => sum + (m.metrics.avg_reach || 0),
      0
    );

    return {
      totalFollowers,
      avgEngagementRate,
      totalReach,
      platformCount: Object.keys(latestByPlatform).length,
      platforms: Object.keys(latestByPlatform),
    };
  };

  // Get unread inbox count
  const getUnreadInboxCount = () => {
    return inboxItems.filter(item => item.status === 'new').length;
  };

  // Get high-priority inbox items
  const getHighPriorityItems = () => {
    return inboxItems
      .filter(item => item.urgency_score > 7 && item.status === 'new')
      .sort((a, b) => b.urgency_score - a.urgency_score);
  };

  // Fetch on mount
  useEffect(() => {
    if (brandId) {
      fetchMetrics();
      fetchInboxItems();
    }
  }, [brandId]);

  // Real-time subscription for metrics
  useEffect(() => {
    if (!brandId) return;

    const metricsChannel = supabase
      .channel(`platform_metrics_${brandId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_metrics_snapshots',
          filter: `brand_id=eq.${brandId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setMetrics(prev => {
              const index = prev.findIndex(m => m.id === payload.new.id);
              if (index >= 0) {
                const newMetrics = [...prev];
                newMetrics[index] = payload.new as PlatformMetricsSnapshot;
                return newMetrics;
              }
              return [payload.new as PlatformMetricsSnapshot, ...prev];
            });
          }
        }
      )
      .subscribe();

    const inboxChannel = supabase
      .channel(`engagement_inbox_${brandId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'engagement_inbox',
          filter: `brand_id=eq.${brandId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setInboxItems(prev => {
              const index = prev.findIndex(item => item.id === payload.new.id);
              if (index >= 0) {
                const newItems = [...prev];
                newItems[index] = payload.new as EngagementInboxItem;
                return newItems;
              }
              return [payload.new as EngagementInboxItem, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            setInboxItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(inboxChannel);
    };
  }, [brandId]);

  return {
    loading,
    error,
    metrics,
    inboxItems,
    fetchMetrics,
    collectAnalytics,
    fetchInboxItems,
    respondToEngagement,
    updateInboxItemStatus,
    getPlatformSummary,
    getOverallSummary,
    getUnreadInboxCount,
    getHighPriorityItems,
  };
}
