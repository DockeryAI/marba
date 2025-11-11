// Custom hook for Content Calendar operations

import { useState, useEffect } from 'react';
import { supabase, functions } from '@/lib/supabase';
import type {
  ContentCalendarItem,
  ContentGenerationMode,
  ContentPlatform,
  CalendarFilters,
} from '@/types';

export function useContentCalendar(brandId: string, userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<ContentCalendarItem[]>([]);
  const [filters, setFilters] = useState<CalendarFilters>({});

  // Fetch content calendar items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('content_calendar_items')
        .select('*')
        .eq('brand_id', brandId)
        .order('scheduled_for', { ascending: true });

      // Apply filters
      if (filters.platforms && filters.platforms.length > 0) {
        query = query.in('platform', filters.platforms);
      }

      if (filters.statuses && filters.statuses.length > 0) {
        query = query.in('status', filters.statuses);
      }

      if (filters.pillars && filters.pillars.length > 0) {
        query = query.in('pillar_id', filters.pillars);
      }

      if (filters.campaigns && filters.campaigns.length > 0) {
        query = query.in('campaign_id', filters.campaigns);
      }

      if (filters.generation_modes && filters.generation_modes.length > 0) {
        query = query.in('generation_mode', filters.generation_modes);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setItems(data || []);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching content calendar items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate new content
  const generateContent = async (params: {
    platform: ContentPlatform;
    topic: string;
    mode: ContentGenerationMode;
    pillarId?: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await functions.generateContent(
        brandId,
        params.platform,
        params.topic,
        params.mode,
        {
          tone: params.tone,
          length: params.length,
          pillarId: params.pillarId,
        }
      );

      return response;
    } catch (err: any) {
      setError(err);
      console.error('Error generating content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new content item
  const createItem = async (item: Partial<ContentCalendarItem>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('content_calendar_items')
        .insert({
          ...item,
          brand_id: brandId,
          user_id: userId,
          status: item.status || 'draft',
        })
        .select()
        .single();

      if (createError) throw createError;

      setItems(prev => [...prev, data]);

      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error creating content item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a content item
  const updateItem = async (itemId: string, updates: Partial<ContentCalendarItem>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('content_calendar_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      setItems(prev => prev.map(item => (item.id === itemId ? data : item)));

      return data;
    } catch (err: any) {
      setError(err);
      console.error('Error updating content item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a content item
  const deleteItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('content_calendar_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      setError(err);
      console.error('Error deleting content item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Schedule content for publishing
  const scheduleItem = async (itemId: string, scheduledFor: string) => {
    return await updateItem(itemId, {
      scheduled_for: scheduledFor,
      status: 'scheduled',
    });
  };

  // Publish content to platform
  const publishItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const item = items.find(i => i.id === itemId);
      if (!item) throw new Error('Content item not found');

      const response = await functions.publishToPlatform(
        itemId,
        item.platform,
        item.body,
        item.media_urls[0]
      );

      if (response.success) {
        await updateItem(itemId, {
          status: 'published',
          published_at: response.published_at,
          platform_post_id: response.platform_post_id,
        });
      }

      return response;
    } catch (err: any) {
      setError(err);
      console.error('Error publishing content item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Duplicate a content item
  const duplicateItem = async (itemId: string) => {
    const original = items.find(i => i.id === itemId);
    if (!original) throw new Error('Content item not found');

    const duplicate = {
      ...original,
      id: undefined,
      title: `${original.title} (Copy)`,
      status: 'draft' as const,
      scheduled_for: null,
      published_at: null,
      platform_post_id: null,
    };

    return await createItem(duplicate);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<CalendarFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    if (brandId) {
      fetchItems();
    }
  }, [brandId, filters]);

  // Real-time subscription
  useEffect(() => {
    if (!brandId) return;

    const channel = supabase
      .channel(`content_calendar_${brandId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_calendar_items',
          filter: `brand_id=eq.${brandId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setItems(prev => {
              const index = prev.findIndex(item => item.id === payload.new.id);
              if (index >= 0) {
                const newItems = [...prev];
                newItems[index] = payload.new as ContentCalendarItem;
                return newItems;
              }
              return [...prev, payload.new as ContentCalendarItem];
            });
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brandId]);

  return {
    loading,
    error,
    items,
    filters,
    generateContent,
    createItem,
    updateItem,
    deleteItem,
    scheduleItem,
    publishItem,
    duplicateItem,
    updateFilters,
    clearFilters,
    refreshItems: fetchItems,
  };
}
