/**
 * OpenAI API Integration
 * Content generation and optimization via edge function
 */

import { supabase } from '@/lib/supabase'

class OpenAIAPIService {
  async generateHeadline(prompt: string, tone: string = 'professional'): Promise<string[]> {
    const fallbackHeadlines = [
      `${prompt} - Transform Your Business`,
      `Discover the Power of ${prompt}`,
      `${prompt}: The Complete Solution`
    ]

    try {
      const { data, error } = await supabase.functions.invoke('openai-proxy', {
        body: {
          action: 'chat',
          messages: [
            { role: 'system', content: `You are a professional copywriter. Generate 5 compelling headlines in a ${tone} tone.` },
            { role: 'user', content: prompt }
          ],
          maxTokens: 200
        }
      })

      if (error) {
        console.error('[OpenAI API] Edge function error:', error)
        return fallbackHeadlines
      }

      if (!data || !data.success) {
        console.error('[OpenAI API] Unsuccessful response:', data?.error)
        return fallbackHeadlines
      }

      const headlines = data.content.split('\n').filter((h: string) => h.trim())
      return headlines.slice(0, 5)
    } catch (error) {
      console.error('[OpenAI API] Error:', error)
      return fallbackHeadlines
    }
  }

  async generateCaption(prompt: string, maxLength: number = 280): Promise<string> {
    const fallbackCaption = `${prompt} - Learn more about how we can help you achieve your goals.`

    try {
      const { data, error } = await supabase.functions.invoke('openai-proxy', {
        body: {
          action: 'chat',
          messages: [
            { role: 'system', content: `Generate an engaging social media caption under ${maxLength} characters.` },
            { role: 'user', content: prompt }
          ],
          maxTokens: 100
        }
      })

      if (error) {
        console.error('[OpenAI API] Edge function error:', error)
        return fallbackCaption
      }

      if (!data || !data.success) {
        console.error('[OpenAI API] Unsuccessful response:', data?.error)
        return fallbackCaption
      }

      return data.content.trim()
    } catch (error) {
      console.error('[OpenAI API] Error:', error)
      return fallbackCaption
    }
  }
}

export const OpenAIAPI = new OpenAIAPIService()
