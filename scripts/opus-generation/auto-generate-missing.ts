/**
 * AUTOMATED PIPELINE: Generate + Upload Missing Profiles
 *
 * This script:
 * 1. Identifies profiles without full data
 * 2. Generates comprehensive 40-field profiles using Opus 4.1
 * 3. Automatically uploads to Supabase
 * 4. Runs completely unattended
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root
dotenv.config({ path: path.join(process.cwd(), '.env') })

const marbaUrl = process.env.VITE_SUPABASE_URL!
const marbaKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
const openrouterKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY

if (!openrouterKey) {
  console.error('❌ OPENROUTER_API_KEY not found in .env')
  process.exit(1)
}

const marbaClient = createClient(marbaUrl, marbaKey)

interface Industry {
  naics: string
  name: string
  category: string
}

const buildOpusPrompt = (industries: Industry[]): string => {
  const industryList = industries.map((ind, idx) =>
    `${idx + 1}. ${ind.name} - NAICS: ${ind.naics} - Category: ${ind.category}`
  ).join('\n')

  return `OPUS 4.1 - Generate EXACTLY 55 fields for comprehensive industry intelligence with deep psychological frameworks.

TARGET: 4,000+ words per profile with deep, actionable insights and extensive psychological context.

## INDUSTRIES TO PROCESS:

${industryList}

---

## REQUIRED SCHEMA - Generate EXACTLY these 40 fields for EACH profile:

### 1. CORE IDENTIFICATION (5 fields)
1. industry: string (exact industry name)
2. industry_name: string (same as industry)
3. naics_code: string
4. category: string
5. subcategory: string or null

### 2. CUSTOMER PSYCHOLOGY & TRIGGERS (8 fields)
6. customer_triggers: Array of 8-10 {trigger: string, urgency: 1-10, frequency: string}
7. customer_journey: Object {awareness: string, consideration: string, decision: string, retention: string, advocacy: string}
8. transformations: Array of 6-8 {from: string, to: string, emotional_value: string, worth_premium: boolean}
9. success_metrics: Array of 5-7 {metric: string, timeframe: string, measurable: boolean}
10. urgency_drivers: Array of 5-7 strings describing what creates immediate action
11. objection_handlers: Array of 5-7 {objection: string, response: string, effectiveness: number}
12. risk_reversal: Object {guarantees: string[], proof_points: string[], risk_mitigation: string}
13. customer_language_dictionary: Object {problem_words: string[], solution_words: string[], avoid_jargon: string[]}

### 3. MESSAGING & CONTENT (7 fields)
14. power_words: Array of 20-30 high-converting words (strings)
15. avoid_words: Array of 15-20 conversion-killing words (strings)
16. headline_templates: Array of 10 {template: string, expected_ctr: number, use_case: string}
17. cta_templates: Array of 8 {template: string, conversion_rate: number, placement: string}
18. social_post_templates: Array of 9 {platform: string, template: string, engagement_rate: number}
19. value_propositions: Array of 5-7 {prop: string, rank: number, differentiator: string}
20. messaging_frameworks: Object {premium_messaging: string, budget_conscious: string, enterprise: string}

### 4. TRUST & CREDIBILITY (5 fields)
21. trust_signals: Array of 5-7 {signal: string, importance: 1-10, format: string}
22. social_proof_statistics: Array of 4-6 {stat: string, credibility_score: number, context: string}
23. quality_indicators: Array of 4-6 strings that signal premium vs budget
24. testimonial_capture_timing: Object {optimal_day: number, trigger_event: string, ask_method: string}
25. competitive_advantages: Array of 4-6 unique differentiators vs competitors

### 5. PRICING & ECONOMICS (5 fields)
26. pricing_psychology: Object {anchoring: string, sensitivity: string, sweet_spots: string[], decoy_pricing: string}
27. price_sensitivity_thresholds: Object {consultation_trigger: number, approval_required: number, competitor_research: number}
28. emergency_premium_pricing: Object {standard_multiplier: number, after_hours: number, weekend: number, holiday: number}
29. tiered_service_models: Array of 3 {tier: string, price_range: string, target_customer: string, margin: number}
30. margin_optimization_strategies: Array of 4-6 tactics with expected impact

### 6. TIMING & PATTERNS (4 fields)
31. seasonal_patterns: Array of 12 {month: string, variation: number, reason: string, opportunity: string}
32. weekly_patterns: Array of 7 {day: string, best_for: string, avoid: string, conversion_rate: number}
33. monthly_patterns: Object {bill_due_dates: string, cash_flow_peaks: string, slow_periods: string}
34. peak_crisis_times: Array of 3-5 {time: string, crisis_type: string, premium_multiplier: number}

### 7. GROWTH & RETENTION (6 fields)
35. service_packages: Array of 3-4 {name: string, components: string[], pricing_model: string, margin: number}
36. upsell_paths: Array of 4-6 natural progression steps from entry to premium
37. retention_hooks: Array of 5-7 tactics that keep customers long-term
38. referral_strategies: Array of 4-6 {strategy: string, timing: string, incentive: string, conversion_rate: number}
39. cross_sell_opportunity_map: Array of 4-6 {service: string, attach_rate: number, timing: string}
40. expansion_opportunities: Array of 4-6 {opportunity: string, market_size: string, difficulty: number}

### 8. PSYCHOLOGICAL FRAMEWORKS (15 fields) - NEW REQUIREMENT
41. why: string (Golden Circle - Brand purpose and belief system, 150-300 words)
42. how: string (Golden Circle - Unique process/methodology that delivers the promise, 100-200 words)
43. what: string (Golden Circle - Products/services offered, 50-100 words)
44. primary_archetype: string (One of: Hero, Sage, Explorer, Outlaw, Magician, Regular Guy, Lover, Jester, Caregiver, Creator, Ruler, Innocent)
45. secondary_archetype: string (Supporting archetype from the same list)
46. archetype_characteristics: Object {traits: string[] (5-7 traits), voice: string (tone description), avoid: string[] (3-5 things to avoid)}
47. emotional_triggers: Array of 8-10 {emotion: string, trigger: string, intensity: 1-10, application: string} - Focus on emotions (fear, desire, aspiration, pain, joy) NOT timing
48. emotional_journey_map: Object {before: string (emotional state before purchase), during: string (emotions during decision), after: string (emotions after purchase), peak_emotion: string}
49. psychological_hooks: Array of 6 {principle: string (Social Proof, Scarcity, Authority, Reciprocity, Commitment, Liking), application: string, examples: string[], effectiveness: number 1-10}
50. persuasion_sequences: Array of 3-4 {sequence: string (step-by-step persuasion flow), principles_used: string[], conversion_rate: number}
51. customer_avatars: Array of 3-4 detailed personas {name: string, demographics: object {age_range, income, education, family_status}, psychographics: object {values, fears, desires, lifestyle}, behaviors: object {buying_patterns, media_consumption, decision_factors}, pain_points: string[], desires: string[], objections: string[]}
52. persona_priority_ranking: Array of 3-4 {persona: string, market_size: number, profitability: number 1-10, ease_to_serve: number 1-10, total_score: number}
53. brand_story_template: Object {hero: string, challenge: string, guide: string, plan: string, call_to_action: string, success: string, failure_avoided: string} - Hero's journey structure
54. origin_story_elements: Object {founding_moment: string, founder_motivation: string, first_customer: string, pivot_points: string[]} - Brand founding narrative
55. narrative_arc: Object {setup: string, conflict: string, resolution: string, transformation: string} - Story structure for brand narrative

---

## CRITICAL RULES:

1. You MUST include ALL 55 fields listed above in EVERY profile - no exceptions
2. Use the EXACT field names specified (no variations)
3. Write as if you have 30 years of hands-on experience in EACH specific industry
4. Include real percentages (e.g., "67% reduction"), specific timeframes, exact dollar amounts
5. Make insights actionable and based on actual industry patterns
6. TARGET 4,000+ words per profile - be comprehensive, detailed, include multiple examples and deep psychology
7. For arrays, meet the minimum count specified (e.g., "8-10 items" means at least 8)
8. For objects, include ALL sub-fields specified (don't skip any)
9. Use industry-specific examples and real-world scenarios
10. Include numerical data wherever possible (conversion rates, percentages, multipliers)
11. **PSYCHOLOGY IS CRITICAL**: Spend extra effort on Section 8 (fields 41-55) - these differentiate great brands
12. Golden Circle (why/how/what) must be emotionally compelling and industry-specific
13. Brand archetypes must align with industry culture and customer expectations
14. Emotional triggers must be deep psychological drivers, not just timing-based triggers
15. Customer avatars must feel like real people with detailed psychographic profiles

---

## OUTPUT FORMAT:

Return ONLY a valid JSON array of ${industries.length} objects with ALL 55 fields.

CRITICAL: Include every single field listed in sections 1-8 above. Use exact field names. Meet minimum array counts. Include all object sub-fields. Section 8 (psychology) is MANDATORY.

Return raw JSON only - no markdown, no explanations, no extra text.`
}

async function callOpus(prompt: string, retryCount: number = 0): Promise<any[]> {
  const maxRetries = 3

  try {
    console.log(`   📤 Sending request to Opus 4.1...`)

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 180000) // 3 minute timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://marba.com',
        'X-Title': 'MARBA Industry Intelligence System'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-opus-4.1',
        messages: [
          {
            role: 'system',
            content: 'You are an expert industry analyst with 30 years of experience across all business sectors. Generate comprehensive, actionable industry intelligence with specific numbers, percentages, and insider insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 32000
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content || ''

    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in OPUS response')
    }

    const profiles = JSON.parse(jsonMatch[0])
    console.log(`   ✓ Received ${profiles.length} profiles`)
    return profiles

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.log(`   ❌ Error: ${errorMsg}`)

    if (retryCount < maxRetries) {
      console.log(`   ⚠️  Retrying (${retryCount + 1}/${maxRetries})...`)
      await new Promise(resolve => setTimeout(resolve, 5000))
      return callOpus(prompt, retryCount + 1)
    }
    throw error
  }
}

function validateProfile(profile: any): boolean {
  const required = [
    // Core (5 fields)
    'industry', 'industry_name', 'naics_code', 'category', 'subcategory',
    // Customer Psychology (8 fields)
    'customer_triggers', 'customer_journey', 'transformations', 'success_metrics',
    'urgency_drivers', 'objection_handlers', 'risk_reversal', 'customer_language_dictionary',
    // Messaging & Content (7 fields)
    'power_words', 'avoid_words', 'headline_templates', 'cta_templates',
    'social_post_templates', 'value_propositions', 'messaging_frameworks',
    // Trust & Credibility (5 fields)
    'trust_signals', 'social_proof_statistics', 'quality_indicators',
    'testimonial_capture_timing', 'competitive_advantages',
    // Pricing & Economics (5 fields)
    'pricing_psychology', 'price_sensitivity_thresholds', 'emergency_premium_pricing',
    'tiered_service_models', 'margin_optimization_strategies',
    // Timing & Patterns (4 fields)
    'seasonal_patterns', 'weekly_patterns', 'monthly_patterns', 'peak_crisis_times',
    // Growth & Retention (6 fields)
    'service_packages', 'upsell_paths', 'retention_hooks',
    'referral_strategies', 'cross_sell_opportunity_map', 'expansion_opportunities',
    // Psychological Frameworks (15 NEW fields)
    'why', 'how', 'what',
    'primary_archetype', 'secondary_archetype', 'archetype_characteristics',
    'emotional_triggers', 'emotional_journey_map',
    'psychological_hooks', 'persuasion_sequences',
    'customer_avatars', 'persona_priority_ranking',
    'brand_story_template', 'origin_story_elements', 'narrative_arc'
  ]

  const missing = required.filter(field => !(field in profile))

  if (missing.length > 0) {
    console.error(`   ❌ Profile missing ${missing.length} fields: ${missing.join(', ')}`)
    return false
  }

  // Extra validation for psychology fields
  if (profile.why && profile.why.length < 100) {
    console.error(`   ⚠️  'why' field too short (${profile.why.length} chars, needs 150+)`)
  }

  if (profile.primary_archetype && !['Hero', 'Sage', 'Explorer', 'Outlaw', 'Magician', 'Regular Guy', 'Lover', 'Jester', 'Caregiver', 'Creator', 'Ruler', 'Innocent'].includes(profile.primary_archetype)) {
    console.error(`   ⚠️  Invalid primary_archetype: ${profile.primary_archetype}`)
  }

  return true
}

function mapOpusToMarbaSchema(profile: any): any {
  return {
    naics_code: profile.naics_code,
    title: profile.industry_name || profile.industry,
    description: profile.category,
    has_full_profile: true,

    // Extract for quick access
    keywords: profile.power_words?.slice(0, 20) || [],
    key_trends: profile.customer_triggers?.map((t: any) => t.trigger).slice(0, 10) || [],
    customer_segments: profile.customer_journey ? [
      profile.customer_journey.awareness,
      profile.customer_journey.consideration
    ].filter(Boolean) : [],
    pain_points: profile.customer_language_dictionary?.problem_words?.slice(0, 15) || [],
    common_objections: profile.objection_handlers?.map((o: any) => o.objection).slice(0, 10) || [],
    success_metrics: profile.success_metrics?.map((m: any) => m.metric || m).slice(0, 10) || [],
    competitive_landscape: profile.competitive_advantages?.join('. ') || '',

    // Store FULL profile data (all 55 fields)
    full_profile_data: {
      // Original 40 fields
      customer_triggers: profile.customer_triggers,
      customer_journey: profile.customer_journey,
      transformations: profile.transformations,
      urgency_drivers: profile.urgency_drivers,
      customer_language_dictionary: profile.customer_language_dictionary,
      objection_handlers: profile.objection_handlers,
      headline_templates: profile.headline_templates,
      cta_templates: profile.cta_templates,
      social_post_templates: profile.social_post_templates,
      value_propositions: profile.value_propositions,
      messaging_frameworks: profile.messaging_frameworks,
      power_words: profile.power_words,
      avoid_words: profile.avoid_words,
      success_metrics: profile.success_metrics,
      risk_reversal: profile.risk_reversal,
      trust_signals: profile.trust_signals,
      social_proof_statistics: profile.social_proof_statistics,
      quality_indicators: profile.quality_indicators,
      testimonial_capture_timing: profile.testimonial_capture_timing,
      competitive_advantages: profile.competitive_advantages,
      pricing_psychology: profile.pricing_psychology,
      price_sensitivity_thresholds: profile.price_sensitivity_thresholds,
      emergency_premium_pricing: profile.emergency_premium_pricing,
      tiered_service_models: profile.tiered_service_models,
      margin_optimization_strategies: profile.margin_optimization_strategies,
      seasonal_patterns: profile.seasonal_patterns,
      weekly_patterns: profile.weekly_patterns,
      monthly_patterns: profile.monthly_patterns,
      peak_crisis_times: profile.peak_crisis_times,
      service_packages: profile.service_packages,
      upsell_paths: profile.upsell_paths,
      retention_hooks: profile.retention_hooks,
      referral_strategies: profile.referral_strategies,
      cross_sell_opportunity_map: profile.cross_sell_opportunity_map,
      expansion_opportunities: profile.expansion_opportunities,
      // NEW: 15 Psychology fields
      why: profile.why,
      how: profile.how,
      what: profile.what,
      primary_archetype: profile.primary_archetype,
      secondary_archetype: profile.secondary_archetype,
      archetype_characteristics: profile.archetype_characteristics,
      emotional_triggers: profile.emotional_triggers,
      emotional_journey_map: profile.emotional_journey_map,
      psychological_hooks: profile.psychological_hooks,
      persuasion_sequences: profile.persuasion_sequences,
      customer_avatars: profile.customer_avatars,
      persona_priority_ranking: profile.persona_priority_ranking,
      brand_story_template: profile.brand_story_template,
      origin_story_elements: profile.origin_story_elements,
      narrative_arc: profile.narrative_arc,
    }
  }
}

async function main() {
  console.log('🚀 AUTOMATED PROFILE GENERATION & UPLOAD')
  console.log('========================================\n')

  try {
    // Step 1: Identify missing profiles
    console.log('📊 Step 1: Identifying profiles without full data...')
    const { data: missingProfiles, error } = await marbaClient
      .from('industry_profiles')
      .select('naics_code, title, description')
      .eq('has_full_profile', false)
      .order('naics_code')

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`   ✓ Found ${missingProfiles.length} profiles to generate\n`)

    if (missingProfiles.length === 0) {
      console.log('✅ All profiles already have full data!')
      return
    }

    // Step 2: Convert to industry list format
    console.log('📝 Step 2: Preparing industry list...')
    const industries: Industry[] = missingProfiles.map(p => ({
      naics: p.naics_code,
      name: p.title,
      category: p.description || 'General'
    }))
    console.log(`   ✓ Prepared ${industries.length} industries\n`)

    // Step 3: Generate in batches of 2
    console.log(`🤖 Step 3: Generating profiles with Opus 4.1...`)
    console.log(`   Batch size: 2 profiles per batch`)
    console.log(`   Total batches: ${Math.ceil(industries.length / 2)}\n`)

    const batchSize = 2
    const allGeneratedProfiles = []

    for (let i = 0; i < industries.length; i += batchSize) {
      const batch = industries.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(industries.length / batchSize)

      console.log(`📦 Batch ${batchNum}/${totalBatches}: ${batch.map(b => b.name).join(', ')}`)

      const prompt = buildOpusPrompt(batch)
      const profiles = await callOpus(prompt)

      // Normalize and validate
      const normalized = profiles.map((p: any) => ({
        ...p,
        industry_name: p.industry || p.industry_name
      }))

      let validCount = 0
      for (const profile of normalized) {
        if (validateProfile(profile)) {
          validCount++
          allGeneratedProfiles.push(profile)
        }
      }

      console.log(`   ✓ Validated ${validCount}/${normalized.length} profiles\n`)

      // Wait between batches to avoid rate limits
      if (i + batchSize < industries.length) {
        console.log(`   ⏸️  Waiting 10 seconds before next batch...\n`)
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    }

    console.log(`✅ Generation complete: ${allGeneratedProfiles.length} profiles\n`)

    // Step 4: Upload to Supabase
    console.log(`💾 Step 4: Uploading to Supabase...`)
    const mapped = allGeneratedProfiles.map(mapOpusToMarbaSchema)

    const { data, error: uploadError } = await marbaClient
      .from('industry_profiles')
      .upsert(mapped, {
        onConflict: 'naics_code',
        ignoreDuplicates: false
      })
      .select()

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`)
    }

    console.log(`   ✓ Uploaded ${allGeneratedProfiles.length} profiles\n`)

    // Step 5: Verify
    console.log(`🔍 Step 5: Verifying...`)
    const { data: verification, error: verifyError } = await marbaClient
      .from('industry_profiles')
      .select('naics_code, title, has_full_profile')
      .eq('has_full_profile', true)

    if (verifyError) {
      throw new Error(`Verification error: ${verifyError.message}`)
    }

    console.log(`   ✓ Total profiles with full data: ${verification.length}\n`)

    console.log('========================================')
    console.log('✅ AUTOMATION COMPLETE!')
    console.log(`   Generated: ${allGeneratedProfiles.length} new profiles`)
    console.log(`   Total with full data: ${verification.length}`)
    console.log(`   All data automatically uploaded to Supabase`)
    console.log('========================================\n')

  } catch (error) {
    console.error('\n❌ AUTOMATION FAILED:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
