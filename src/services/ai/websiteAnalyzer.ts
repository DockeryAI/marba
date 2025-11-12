/**
 * Website Analyzer Service
 * Uses Claude AI via OpenRouter to analyze website content and customize industry profiles
 */

import type { WebsiteData } from '@/services/scraping/websiteScraper'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface CustomizedProfile {
  brandVoice: string
  messagingThemes: string[]
  realUVPs: any[]
  customizedEmotionalTriggers: any[]
  actualBrandStory?: {
    origin: string
    narrative: string
  }
  extractedValues: string[]
  targetAudience: string
}

/**
 * Analyze website and customize industry profile for this specific brand
 */
export async function customizeIndustryProfile(
  websiteData: WebsiteData,
  genericProfile: any
): Promise<CustomizedProfile> {
  console.log('[websiteAnalyzer] Starting AI analysis for:', websiteData.url)

  try {
    // Build the analysis prompt
    const prompt = buildAnalysisPrompt(websiteData, genericProfile)

    console.log('[websiteAnalyzer] Sending to OpenRouter API...')

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MARBA - Marketing Intelligence',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[websiteAnalyzer] OpenRouter error details:', errorData)
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content || ''

    console.log('[websiteAnalyzer] OpenRouter response received, length:', responseText.length)

    // Parse the JSON response
    const customized = parseAnalysisResponse(responseText)

    console.log('[websiteAnalyzer] Analysis complete:', {
      brandVoice: customized.brandVoice?.substring(0, 50),
      uvps: customized.realUVPs?.length,
      themes: customized.messagingThemes?.length,
    })

    return customized
  } catch (error) {
    console.error('[websiteAnalyzer] Error:', error)

    // Return fallback customization
    return createFallbackCustomization(websiteData, genericProfile)
  }
}

/**
 * Build the analysis prompt for Claude
 */
function buildAnalysisPrompt(websiteData: WebsiteData, genericProfile: any): string {
  return `You are a brand strategist analyzing a website to create customized marketing intelligence.

WEBSITE DATA:
URL: ${websiteData.url}
Title: ${websiteData.metadata.title}
Description: ${websiteData.metadata.description}

Top Headings:
${websiteData.content.headings.slice(0, 10).map(h => `- ${h}`).join('\n')}

Key Content Paragraphs:
${websiteData.content.paragraphs.slice(0, 15).map((p, i) => `${i + 1}. ${p.substring(0, 200)}...`).join('\n\n')}

Navigation:
${websiteData.structure.navigation.slice(0, 10).join(', ')}

INDUSTRY CONTEXT:
Industry: ${genericProfile.title}
Generic UVPs: ${JSON.stringify(genericProfile.full_profile_data?.uvps?.slice(0, 3) || [])}
Generic Emotional Triggers: ${JSON.stringify(genericProfile.full_profile_data?.emotional_triggers?.slice(0, 3) || [])}

TASK:
Analyze this SPECIFIC website and extract/customize the following. Base everything on the actual website content, not the generic industry profile.

Return JSON in this exact format:
{
  "brandVoice": "Description of the brand's actual voice based on website language (professional, casual, technical, friendly, etc.)",
  "messagingThemes": ["Theme 1 from website", "Theme 2 from website", "Theme 3"],
  "realUVPs": [
    {
      "id": "uvp-1",
      "rank": 1,
      "proposition": "Actual unique value prop mentioned on website",
      "differentiator": "What makes this different from competitors"
    }
  ],
  "customizedEmotionalTriggers": [
    {
      "trigger": "Emotional trigger this brand uses",
      "psychology": "Why it works",
      "application": "How they apply it"
    }
  ],
  "actualBrandStory": {
    "origin": "If an origin story is mentioned, extract it",
    "narrative": "The brand's actual narrative from the website"
  },
  "extractedValues": ["Value 1 from website content", "Value 2", "Value 3"],
  "targetAudience": "Who this brand is clearly targeting based on content and messaging"
}

IMPORTANT:
- Extract real UVPs from the website content, don't use generic ones
- Identify the actual brand voice from how they write
- Find real messaging themes from their headings and content
- If the website doesn't have enough information, make educated inferences
- Keep responses concise and actionable
- Return ONLY valid JSON, no other text`
}

/**
 * Parse Claude's analysis response
 */
function parseAnalysisResponse(responseText: string): CustomizedProfile {
  try {
    // Extract JSON from response (Claude sometimes adds explanation)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      brandVoice: parsed.brandVoice || 'Professional',
      messagingThemes: parsed.messagingThemes || [],
      realUVPs: parsed.realUVPs || [],
      customizedEmotionalTriggers: parsed.customizedEmotionalTriggers || [],
      actualBrandStory: parsed.actualBrandStory,
      extractedValues: parsed.extractedValues || [],
      targetAudience: parsed.targetAudience || 'General audience',
    }
  } catch (error) {
    console.error('[websiteAnalyzer] Failed to parse response:', error)
    throw error
  }
}

/**
 * Create fallback customization when AI analysis fails
 */
function createFallbackCustomization(
  websiteData: WebsiteData,
  genericProfile: any
): CustomizedProfile {
  console.log('[websiteAnalyzer] Using fallback customization')

  // Extract basic info from website data
  const headings = websiteData.content.headings.slice(0, 5)
  const firstParagraphs = websiteData.content.paragraphs.slice(0, 3)

  // Determine brand voice from content
  const allText = [...headings, ...firstParagraphs].join(' ').toLowerCase()
  let brandVoice = 'Professional'

  if (allText.includes('we help') || allText.includes('you can') || allText.includes('your')) {
    brandVoice = 'Customer-focused and helpful'
  } else if (allText.includes('!') && (allText.includes('amazing') || allText.includes('awesome'))) {
    brandVoice = 'Enthusiastic and energetic'
  } else if (allText.includes('proven') || allText.includes('expert') || allText.includes('years of experience')) {
    brandVoice = 'Authoritative and experienced'
  }

  return {
    brandVoice,
    messagingThemes: headings.slice(0, 4),
    realUVPs: genericProfile.full_profile_data?.uvps?.slice(0, 3).map((uvp: any, i: number) => ({
      ...uvp,
      id: `uvp-${i + 1}`,
      rank: i + 1,
    })) || [],
    customizedEmotionalTriggers: genericProfile.full_profile_data?.emotional_triggers?.slice(0, 5) || [],
    extractedValues: ['Quality', 'Trust', 'Results'],
    targetAudience: genericProfile.full_profile_data?.customer_avatars?.[0]?.name || 'Target customers',
  }
}
