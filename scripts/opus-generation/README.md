# Opus Micro Batch Profile Generation

**Source:** Brandock Figma project micro-batch scripts
**Purpose:** Generate comprehensive industry profiles using Claude Opus 4.1 via OpenRouter
**Status:** ✅ Ready to use

---

## Overview

This system generates **comprehensive 40-field industry profiles** with ~3,200+ words each, containing deep marketing intelligence including customer psychology, messaging templates, pricing strategies, and more.

### What You Have Now

- **93 profiles** with full marketing data (migrated from Brandock)
- **54 profiles** with only basic NAICS data (from local seed)

### What These Scripts Can Do

Generate **complete marketing profiles** for any industry, including all 54 missing profiles or even regenerate all 141 profiles with fresh data.

---

## Quick Start

### Prerequisites

1. **OpenRouter API Key** - Sign up at https://openrouter.ai
   - Model used: `anthropic/claude-opus-4.1`
   - Cost: ~$0.60 per profile
   - Total for 54 profiles: ~$32

2. **Environment Variable** - Add to `/Users/byronhudson/Projects/MARBA/.env`:
   ```bash
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

### Generate Missing Profiles

```bash
cd /Users/byronhudson/Projects/MARBA/scripts/opus-generation

# Generate profiles for industries 0-1 (first 2 industries)
npx tsx opus-micro-batch-generator.ts 0 2

# Generate profiles for industries 2-3
npx tsx opus-micro-batch-generator.ts 2 4

# Continue for all industries...
# Or use the orchestration script (see below)
```

### Generate All 141 Profiles (Automated)

```bash
cd /Users/byronhudson/Projects/MARBA/scripts/opus-generation

# Make script executable
chmod +x run-all-micro-batches.sh

# Run all 71 batches (141 industries ÷ 2 per batch)
./run-all-micro-batches.sh 2>&1 | tee opus-batch-run.log
```

**Time:** ~45-60 minutes for all 71 batches
**Output:** JSON files in `opus-generated/micro-batches/`

---

## The 40-Field Schema

Each profile includes comprehensive marketing intelligence:

### 1. Core Identification (5 fields)
- `industry` - Industry name
- `industry_name` - Same as industry
- `naics_code` - NAICS classification
- `category` - Technology, Healthcare, Professional Services, etc.
- `subcategory` - Optional sub-classification

### 2. Customer Psychology & Triggers (8 fields)
- `customer_triggers` - 8-10 triggers with urgency scores
- `customer_journey` - 5-stage journey map (awareness → advocacy)
- `transformations` - 6-8 before/after transformations
- `success_metrics` - 5-7 measurable outcomes
- `urgency_drivers` - 5-7 time-sensitive motivators
- `objection_handlers` - 5-7 objections with responses
- `risk_reversal` - Guarantees and proof points
- `customer_language_dictionary` - Problem/solution vocabulary

### 3. Messaging & Content (7 fields)
- `power_words` - 20-30 high-converting words
- `avoid_words` - 15-20 conversion-killing words
- `headline_templates` - 10 templates with CTR estimates
- `cta_templates` - 8 CTAs with conversion rates
- `social_post_templates` - 9 platform-specific posts
- `value_propositions` - 5-7 ranked propositions
- `messaging_frameworks` - Premium, budget, enterprise messaging

### 4. Trust & Credibility (5 fields)
- `trust_signals` - 5-7 credibility indicators
- `social_proof_statistics` - 4-6 persuasive stats
- `quality_indicators` - 4-6 premium vs budget signals
- `testimonial_capture_timing` - Optimal asking moments
- `competitive_advantages` - 4-6 unique differentiators

### 5. Pricing & Economics (5 fields)
- `pricing_psychology` - Anchoring, sensitivity, sweet spots
- `price_sensitivity_thresholds` - Price points triggering behaviors
- `emergency_premium_pricing` - Rush job multipliers
- `tiered_service_models` - 3-tier pricing structures
- `margin_optimization_strategies` - 4-6 margin improvement tactics

### 6. Timing & Patterns (4 fields)
- `seasonal_patterns` - 12 months with variation percentages
- `weekly_patterns` - 7 days with best/avoid guidance
- `monthly_patterns` - Cash flow and billing cycles
- `peak_crisis_times` - 3-5 emergency scenarios

### 7. Growth & Retention (6 fields)
- `service_packages` - 3-4 bundled offerings
- `upsell_paths` - 4-6 progression steps
- `retention_hooks` - 5-7 long-term tactics
- `referral_strategies` - 4-6 referral programs
- `cross_sell_opportunity_map` - 4-6 related services
- `expansion_opportunities` - 4-6 growth markets

**Total:** 40 fields, ~3,200+ words per profile

---

## Mapping to MARBA Database

The 40-field schema maps to your MARBA `industry_profiles` table:

### Quick-Access Fields (Stored as Columns)
```typescript
{
  naics_code: profile.naics_code,
  title: profile.industry_name,
  has_full_profile: true,

  // Extracted for quick access
  keywords: profile.power_words?.slice(0, 20),
  key_trends: profile.customer_triggers?.map(t => t.trigger).slice(0, 10),
  customer_segments: profile.customer_journey?.awareness,
  pain_points: profile.customer_language_dictionary?.problem_words?.slice(0, 15),
  common_objections: profile.objection_handlers?.map(o => o.objection).slice(0, 10),
  success_metrics: profile.success_metrics?.map(m => m.metric).slice(0, 10),
  competitive_landscape: profile.competitive_advantages?.join('. ')
}
```

### Full Profile Data (Stored as JSONB)
```typescript
{
  full_profile_data: {
    // All 40 fields stored here as JSON
    customer_triggers: [...],
    customer_journey: {...},
    transformations: [...],
    // ... all other fields
  }
}
```

---

## Industry List (141 Industries)

The system generates profiles for these categories:

- **Technology** (10): MSP, Cybersecurity, Software Development, Web Development, etc.
- **Healthcare** (22): Dentistry, Medical, Veterinary, Physical Therapy, etc.
- **Professional Services** (29): CPA, Legal, Consulting, Coaching, Marketing, etc.
- **Construction** (22): Residential, Commercial, HVAC, Plumbing, Roofing, etc.
- **Food Service** (17): Restaurants, Catering, Cafes, Breweries, etc.
- **Personal Services** (28): Salons, Fitness, Auto Repair, Childcare, etc.
- **Retail** (10): Boutiques, Gift Shops, Pet Stores, Furniture, etc.

See `industry-list.json` for complete list with NAICS codes.

---

## How It Works

### 1. Script: opus-micro-batch-generator.ts

```typescript
// Takes start and end indices
// Generates 2 profiles per batch
tsx opus-micro-batch-generator.ts 0 2  // Industries 0-1
tsx opus-micro-batch-generator.ts 2 4  // Industries 2-3
```

**Process:**
1. Reads industries from `industry-list.json`
2. Builds comprehensive prompt with all 40 field requirements
3. Sends to Claude Opus 4.1 via OpenRouter API
4. Validates all 40 fields are present
5. Saves to `opus-generated/micro-batches/batch-X-Y.json`

**Retry Logic:**
- Automatic retries on API failures (3 attempts)
- Validates schema compliance before saving
- Logs all errors to console

### 2. Script: run-all-micro-batches.sh

Orchestrates all 71 batches:
- Automatically skips completed batches (resume support)
- Runs batches sequentially to avoid rate limits
- Logs progress to `opus-batch-run.log`

---

## Output Structure

```
opus-generated/
└── micro-batches/
    ├── batch-0-2.json      # Industries 0-1
    ├── batch-2-4.json      # Industries 2-3
    ├── batch-4-6.json      # Industries 4-5
    ...
    └── batch-140-142.json  # Industries 140-141
```

Each batch file contains:
```json
[
  {
    "industry": "MSP (Managed Service Provider)",
    "industry_name": "MSP (Managed Service Provider)",
    "naics_code": "541519",
    "category": "Technology",
    "subcategory": null,
    "customer_triggers": [...],
    "customer_journey": {...},
    // ... all 40 fields
  },
  {
    // Second profile
  }
]
```

---

## Uploading to MARBA Database

After generation completes, use the existing migration script:

```bash
cd /Users/byronhudson/Projects/MARBA

# Option 1: Create a new upload script for Opus profiles
npx tsx scripts/upload-opus-profiles.ts

# Option 2: Merge with existing migrate-naics.ts logic
# The script will need to:
# 1. Read all batch files from opus-generated/micro-batches/
# 2. Map 40-field schema to MARBA schema
# 3. Upsert to industry_profiles table
```

See `/scripts/migrate-naics.ts` for reference on the database upload logic.

---

## Cost Breakdown

### Per Profile
- Input tokens: ~2,000 tokens (prompt)
- Output tokens: ~8,000 tokens (3,200+ words)
- Cost per profile: ~$0.60

### For 54 Missing Profiles
- Total batches: 27 (54 ÷ 2)
- Total cost: ~$32
- Time: ~20-30 minutes

### For All 141 Profiles
- Total batches: 71 (141 ÷ 2)
- Total cost: ~$85
- Time: ~45-60 minutes

**Note:** Prices based on Claude Opus 4.1 pricing via OpenRouter (~$15/1M input, ~$75/1M output)

---

## Quality Metrics

### Target Metrics
- ✅ **3,200+ words per profile** (comprehensive context)
- ✅ **All 40 fields populated** (no missing data)
- ✅ **Industry-specific insights** (not generic content)
- ✅ **Actionable data** (real percentages, timeframes, dollar amounts)

### Validation
The script validates:
- All 40 required fields present
- Critical arrays not empty (customer_triggers, trust_signals, etc.)
- Critical objects have required sub-fields (customer_journey, pricing_psychology)

---

## Example Usage

### Generate One Batch (Manual)

```bash
cd /Users/byronhudson/Projects/MARBA/scripts/opus-generation

# Set API key
export VITE_OPENROUTER_API_KEY="sk-or-v1-your-key-here"

# Generate first 2 profiles
npx tsx opus-micro-batch-generator.ts 0 2

# Check output
cat opus-generated/micro-batches/batch-0-2.json | jq '.[0].industry_name'
```

### Generate All 141 Profiles (Automated)

```bash
cd /Users/byronhudson/Projects/MARBA/scripts/opus-generation

# Set API key
export VITE_OPENROUTER_API_KEY="sk-or-v1-your-key-here"

# Make script executable
chmod +x run-all-micro-batches.sh

# Run all batches (background with logging)
./run-all-micro-batches.sh 2>&1 | tee opus-batch-run.log &

# Monitor progress
tail -f opus-batch-run.log

# Check status
ls -1 opus-generated/micro-batches/ | wc -l  # Should reach 71
```

### Monitor Live Progress

```bash
# View last 20 lines
tail -20 opus-batch-run.log

# Watch for errors
grep -i "error\|failed" opus-batch-run.log

# Count completed batches
ls -1 opus-generated/micro-batches/ | wc -l
```

---

## Troubleshooting

### API Key Not Found
```bash
Error: VITE_OPENROUTER_API_KEY not found
```
**Solution:** Add to `.env` file or export in terminal

### Rate Limit Errors
```bash
Error: Rate limit exceeded
```
**Solution:** Script has automatic retry logic. Wait 5 seconds between retries.

### Validation Failures
```bash
❌ Profile missing 5 fields: power_words, avoid_words, ...
```
**Solution:** Script automatically retries (up to 3 times). Opus usually completes all fields on retry.

### Batch Already Exists
**Solution:** Script skips existing batches automatically. Delete file if you want to regenerate.

---

## Next Steps

1. **Get OpenRouter API Key** - Sign up at https://openrouter.ai
2. **Add to .env** - `VITE_OPENROUTER_API_KEY=sk-or-v1-...`
3. **Run Generation** - Start with a test batch or run all 71
4. **Upload to Database** - Adapt `migrate-naics.ts` or create new upload script
5. **Verify in UI** - Test onboarding with newly populated profiles

---

## Files in This Directory

```
opus-generation/
├── README.md                          # This file
├── opus-micro-batch-generator.ts      # Core generator script
├── industry-list.json                 # 141 industries to process
├── run-all-micro-batches.sh           # Orchestration script
└── opus-generated/                    # Output directory (created on first run)
    └── micro-batches/
        ├── batch-0-2.json
        ├── batch-2-4.json
        └── ...
```

---

## Credits

**Original System:** Brandock Figma project
**AI Model:** Claude Opus 4.1 via OpenRouter
**Schema Version:** 1.0 (40 fields)
**Migration Date:** 2025-11-11

---

**Questions?** Check the original documentation at:
`/Users/byronhudson/brandock/Figma/apps/web/data/industry-research/OPUS_GENERATION.md`
