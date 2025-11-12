/**
 * MICRO-BATCH GENERATOR
 * Generates 5 industry profiles at a time for maximum reliability
 * Usage: tsx opus-micro-batch-generator.ts <start_index> <end_index>
 * Example: tsx opus-micro-batch-generator.ts 0 5
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY || '';

interface Industry {
  name: string;
  naics: string;
  category: string;
}

interface IndustryProfile {
  // Core Identification (5 fields)
  industry: string;
  industry_name: string;
  naics_code: string;
  category: string;
  subcategory: string | null;

  // Customer Psychology & Triggers (8 fields)
  customer_triggers: any[];
  customer_journey: any;
  transformations: any[];
  success_metrics: any[];
  urgency_drivers: any[];
  objection_handlers: any[];
  risk_reversal: any;
  customer_language_dictionary: any;

  // Messaging & Content (7 fields)
  power_words: string[];
  avoid_words: string[];
  headline_templates: any[];
  cta_templates: any[];
  social_post_templates: any[];
  value_propositions: any[];
  messaging_frameworks: any;

  // Trust & Credibility (5 fields)
  trust_signals: any[];
  social_proof_statistics: any[];
  quality_indicators: any[];
  testimonial_capture_timing: any;
  competitive_advantages: any[];

  // Pricing & Economics (5 fields)
  pricing_psychology: any;
  price_sensitivity_thresholds: any;
  emergency_premium_pricing: any;
  tiered_service_models: any[];
  margin_optimization_strategies: any[];

  // Timing & Patterns (4 fields)
  seasonal_patterns: any[];
  weekly_patterns: any[];
  monthly_patterns: any;
  peak_crisis_times: any[];

  // Growth & Retention (6 fields)
  service_packages: any[];
  upsell_paths: any[];
  retention_hooks: any[];
  referral_strategies: any[];
  cross_sell_opportunity_map: any[];
  expansion_opportunities: any[];
}

const buildOpusPrompt = (industries: Industry[]): string => {
  const industryList = industries.map((ind, idx) =>
    `${idx + 1}. ${ind.name} - NAICS: ${ind.naics} - Category: ${ind.category}`
  ).join('\n');

  return `OPUS 4.1 - Generate EXACTLY 40 fields for comprehensive industry intelligence.

TARGET: 3,200+ words per profile with deep, actionable insights and extensive context.

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

---

## CRITICAL RULES:

1. You MUST include ALL 40 fields listed above in EVERY profile - no exceptions
2. Use the EXACT field names specified (no variations like "objections" vs "objection_handlers")
3. Write as if you have 30 years of hands-on experience in EACH specific industry
4. Include real percentages (e.g., "67% reduction"), specific timeframes, exact dollar amounts
5. Make insights actionable and based on actual industry patterns
6. TARGET 3,200+ words per profile - be comprehensive, detailed, include multiple examples and full context
7. For arrays, meet the minimum count specified (e.g., "8-10 items" means at least 8)
8. For objects, include ALL sub-fields specified (don't skip any)
9. Use industry-specific examples and real-world scenarios
10. Include numerical data wherever possible (conversion rates, percentages, multipliers)

---

## OUTPUT FORMAT:

Return ONLY a valid JSON array of ${industries.length} objects with ALL 40 fields.

CRITICAL: Include every single field listed in sections 1-7 above. Use exact field names. Meet minimum array counts. Include all object sub-fields.

Return raw JSON only - no markdown, no explanations, no extra text.`;
};;

const callOpus = async (prompt: string, retryCount: number = 0): Promise<IndustryProfile[]> => {
  const maxRetries = 3;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://branddock.com',
        'X-Title': 'BrandDock Industry Intelligence System'
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
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content || '';

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in OPUS response');
    }

    const profiles = JSON.parse(jsonMatch[0]);
    return profiles;

  } catch (error) {
    if (retryCount < maxRetries) {
      console.log(`   ⚠️  Attempt failed, retrying (${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return callOpus(prompt, retryCount + 1);
    }
    throw error;
  }
};

const validateProfile = (profile: any): boolean => {
  // ALL 40 required fields for comprehensive industry intelligence
  const required = [
    // Core (5)
    'industry', 'industry_name', 'naics_code', 'category', 'subcategory',
    // Customer Psychology & Triggers (8)
    'customer_triggers', 'customer_journey', 'transformations', 'success_metrics',
    'urgency_drivers', 'objection_handlers', 'risk_reversal', 'customer_language_dictionary',
    // Messaging & Content (7)
    'power_words', 'avoid_words', 'headline_templates', 'cta_templates',
    'social_post_templates', 'value_propositions', 'messaging_frameworks',
    // Trust & Credibility (5)
    'trust_signals', 'social_proof_statistics', 'quality_indicators',
    'testimonial_capture_timing', 'competitive_advantages',
    // Pricing & Economics (5)
    'pricing_psychology', 'price_sensitivity_thresholds', 'emergency_premium_pricing',
    'tiered_service_models', 'margin_optimization_strategies',
    // Timing & Patterns (4)
    'seasonal_patterns', 'weekly_patterns', 'monthly_patterns', 'peak_crisis_times',
    // Growth & Retention (6)
    'service_packages', 'upsell_paths', 'retention_hooks',
    'referral_strategies', 'cross_sell_opportunity_map', 'expansion_opportunities'
  ];

  const missing = required.filter(field => !(field in profile));
  const present = required.filter(field => field in profile);

  if (missing.length > 0) {
    console.error(`   ❌ Profile "${profile.industry_name || profile.industry || 'unknown'}" missing ${missing.length} fields:`);
    console.error(`      Missing: ${missing.join(', ')}`);
    console.error(`      Has: ${present.length}/40 fields`);
    return false;
  }

  // Verify critical arrays are not empty
  const criticalArrays = ['customer_triggers', 'trust_signals', 'seasonal_patterns', 'weekly_patterns'];
  for (const field of criticalArrays) {
    if (Array.isArray(profile[field]) && profile[field].length === 0) {
      console.error(`   ❌ Profile "${profile.industry_name}" has empty ${field} array`);
      return false;
    }
  }

  // Verify critical objects have required sub-fields
  if (profile.customer_journey && (!profile.customer_journey.awareness || !profile.customer_journey.decision)) {
    console.error(`   ❌ Profile "${profile.industry_name}" has incomplete customer_journey object`);
    return false;
  }

  if (profile.pricing_psychology && !profile.pricing_psychology.sweet_spots) {
    console.error(`   ❌ Profile "${profile.industry_name}" has incomplete pricing_psychology object`);
    return false;
  }

  return true;
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('Usage: tsx opus-micro-batch-generator.ts <start_index> <end_index>');
    console.error('Example: tsx opus-micro-batch-generator.ts 0 5');
    process.exit(1);
  }

  const startIndex = parseInt(args[0], 10);
  const endIndex = parseInt(args[1], 10);

  if (isNaN(startIndex) || isNaN(endIndex)) {
    console.error('❌ Invalid indices provided');
    process.exit(1);
  }

  try {
    // Load industry list
    const industryListPath = path.join(__dirname, 'industry-list.json');
    const allIndustries = JSON.parse(fs.readFileSync(industryListPath, 'utf-8')) as Industry[];

    // Get this batch's industries
    const batchIndustries = allIndustries.slice(startIndex, endIndex);

    if (batchIndustries.length === 0) {
      console.error('❌ No industries found for this range');
      process.exit(1);
    }

    console.log(`🎯 Micro-batch [${startIndex}-${endIndex}]: ${batchIndustries.length} industries\n`);

    // Generate prompt and call OPUS
    const prompt = buildOpusPrompt(batchIndustries);
    const rawProfiles = await callOpus(prompt);

    console.log(`   ✓ Received ${rawProfiles.length} profiles from OPUS`);

    // Normalize field names (OPUS uses "industry" instead of "industry_name")
    const profiles = rawProfiles.map((profile: any) => ({
      ...profile,
      industry_name: profile.industry || profile.industry_name
    }));

    // Validate
    let validCount = 0;
    for (const profile of profiles) {
      if (validateProfile(profile)) {
        validCount++;
      }
    }

    console.log(`   ✓ Validated ${validCount}/${profiles.length} profiles`);

    // Save to micro-batch file
    const outputDir = path.join(__dirname, 'opus-generated/micro-batches');
    fs.mkdirSync(outputDir, { recursive: true });

    const outputFile = path.join(outputDir, `batch-${startIndex}-${endIndex}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(profiles, null, 2));

    console.log(`   ✓ Saved to: batch-${startIndex}-${endIndex}.json\n`);

    if (validCount !== profiles.length) {
      console.error('   ⚠️  Some profiles failed validation');
      process.exit(1);
    }

    process.exit(0);

  } catch (err) {
    console.error('❌ Failed:', err instanceof Error ? err.message : 'Unknown error');
    process.exit(1);
  }
};

main();
