// Custom hook for Mirror section data and operations

import { useState, useEffect } from 'react';
import { supabase, functions } from '@/lib/supabase';
import type { MirrorSection, SOSTACSection } from '@/types';

export function useMirror(brandId: string, section?: SOSTACSection) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sections, setSections] = useState<MirrorSection[]>([]);
  const [currentSection, setCurrentSection] = useState<MirrorSection | null>(null);

  // Fetch mirror sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('mirror_sections')
        .select('*')
        .eq('brand_id', brandId);

      if (section) {
        query = query.eq('section', section);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSections(data || []);

      if (section && data && data.length > 0) {
        setCurrentSection(data[0]);
      }
    } catch (err: any) {
      setError(err);
      console.error('Error fetching mirror sections:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update section data
  const updateSection = async (sectionName: SOSTACSection, data: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);

      const { data: updated, error: updateError } = await supabase
        .from('mirror_sections')
        .upsert({
          brand_id: brandId,
          section: sectionName,
          data,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setSections(prev => {
        const index = prev.findIndex(s => s.section === sectionName);
        if (index >= 0) {
          const newSections = [...prev];
          newSections[index] = updated;
          return newSections;
        }
        return [...prev, updated];
      });

      if (section === sectionName) {
        setCurrentSection(updated);
      }

      return updated;
    } catch (err: any) {
      setError(err);
      console.error('Error updating mirror section:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Run AI analysis on a section
  const analyzeSection = async (sectionName: SOSTACSection, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await functions.analyzeMirror(brandId, sectionName, forceRefresh);

      // Update the section with analysis results
      await updateSection(sectionName, result.analysis);

      return result;
    } catch (err: any) {
      setError(err);
      console.error('Error analyzing mirror section:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle auto-enrichment
  const toggleAutoEnrich = async (sectionName: SOSTACSection, enabled: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { data: updated, error: updateError } = await supabase
        .from('mirror_sections')
        .update({ auto_enrich_enabled: enabled })
        .eq('brand_id', brandId)
        .eq('section', sectionName)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setSections(prev =>
        prev.map(s => (s.section === sectionName ? updated : s))
      );

      if (section === sectionName) {
        setCurrentSection(updated);
      }

      return updated;
    } catch (err: any) {
      setError(err);
      console.error('Error toggling auto-enrich:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (brandId) {
      fetchSections();
    }
  }, [brandId, section]);

  // Real-time subscription
  useEffect(() => {
    if (!brandId) return;

    const channel = supabase
      .channel(`mirror_sections_${brandId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mirror_sections',
          filter: `brand_id=eq.${brandId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setSections(prev => {
              const index = prev.findIndex(s => s.id === payload.new.id);
              if (index >= 0) {
                const newSections = [...prev];
                newSections[index] = payload.new as MirrorSection;
                return newSections;
              }
              return [...prev, payload.new as MirrorSection];
            });

            if (section === payload.new.section) {
              setCurrentSection(payload.new as MirrorSection);
            }
          } else if (payload.eventType === 'DELETE') {
            setSections(prev => prev.filter(s => s.id !== payload.old.id));
            if (currentSection?.id === payload.old.id) {
              setCurrentSection(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brandId, section]);

  return {
    loading,
    error,
    sections,
    currentSection,
    fetchSections,
    updateSection,
    analyzeSection,
    toggleAutoEnrich,
  };
}
