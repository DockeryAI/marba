// Custom hook for Marbs AI Assistant

import { useState, useEffect, useCallback } from 'react';
import { supabase, functions } from '@/lib/supabase';
import type { MarbsConversation, MarbsMessage, MarbsContext, MarbsSuggestion } from '@/types';

export function useMarbs(brandId: string, userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversations, setConversations] = useState<MarbsConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<MarbsConversation | null>(null);
  const [suggestions, setSuggestions] = useState<MarbsSuggestion[]>([]);

  // Fetch all conversations for the brand
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('marbs_conversations')
        .select('*')
        .eq('brand_id', brandId)
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (fetchError) throw fetchError;

      setConversations(data || []);

      // Set the most recent as current if none is set
      if (!currentConversation && data && data.length > 0) {
        setCurrentConversation(data[0]);
      }
    } catch (err: any) {
      setError(err);
      console.error('Error fetching Marbs conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send a message to Marbs
  const sendMessage = async (message: string, context: MarbsContext) => {
    try {
      setLoading(true);
      setError(null);

      // Call Marbs assistant edge function
      const response = await functions.askMarbs(
        message,
        context,
        currentConversation?.id
      );

      // Create or update conversation in database
      const userMessage: MarbsMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      const assistantMessage: MarbsMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        metadata: response.metadata,
      };

      const messages = [
        ...(currentConversation?.messages || []),
        userMessage,
        assistantMessage,
      ];

      const actions = [
        ...(currentConversation?.actions_taken || []),
        ...(response.actions || []),
      ];

      if (currentConversation) {
        // Update existing conversation
        const { data: updated, error: updateError } = await supabase
          .from('marbs_conversations')
          .update({
            messages,
            actions_taken: actions,
            context,
            last_message_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentConversation.id)
          .select()
          .single();

        if (updateError) throw updateError;
        setCurrentConversation(updated);
      } else {
        // Create new conversation
        const { data: created, error: createError } = await supabase
          .from('marbs_conversations')
          .insert({
            brand_id: brandId,
            user_id: userId,
            messages,
            actions_taken: actions,
            context,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) throw createError;
        setCurrentConversation(created);
        setConversations(prev => [created, ...prev]);
      }

      // Update suggestions if any
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }

      return response;
    } catch (err: any) {
      setError(err);
      console.error('Error sending message to Marbs:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setCurrentConversation(null);
    setSuggestions([]);
  };

  // Switch to a different conversation
  const switchConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('marbs_conversations')
        .delete()
        .eq('id', conversationId);

      if (deleteError) throw deleteError;

      setConversations(prev => prev.filter(c => c.id !== conversationId));

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }
    } catch (err: any) {
      setError(err);
      console.error('Error deleting conversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Dismiss a suggestion
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  // Fetch on mount
  useEffect(() => {
    if (brandId && userId) {
      fetchConversations();
    }
  }, [brandId, userId]);

  // Real-time subscription
  useEffect(() => {
    if (!brandId || !userId) return;

    const channel = supabase
      .channel(`marbs_conversations_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marbs_conversations',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setConversations(prev => {
              const index = prev.findIndex(c => c.id === payload.new.id);
              if (index >= 0) {
                const newConversations = [...prev];
                newConversations[index] = payload.new as MarbsConversation;
                return newConversations;
              }
              return [payload.new as MarbsConversation, ...prev];
            });

            if (currentConversation?.id === payload.new.id) {
              setCurrentConversation(payload.new as MarbsConversation);
            }
          } else if (payload.eventType === 'DELETE') {
            setConversations(prev => prev.filter(c => c.id !== payload.old.id));
            if (currentConversation?.id === payload.old.id) {
              setCurrentConversation(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brandId, userId, currentConversation?.id]);

  return {
    loading,
    error,
    conversations,
    currentConversation,
    suggestions,
    sendMessage,
    startNewConversation,
    switchConversation,
    deleteConversation,
    dismissSuggestion,
    refreshConversations: fetchConversations,
  };
}
