# 🎉 Found: Opus Micro Batch Profile Generation System

**Date:** 2025-11-11
**Status:** ✅ **SCRIPTS LOCATED AND COPIED**

---

## ✅ What Was Found

I found the **complete micro-batch generation system** that was used to create the industry profiles in Brandock via Claude Opus 4.1 through OpenRouter.

### Location of Original Scripts
```
/Users/byronhudson/brandock/Figma/apps/web/data/industry-research/
├── opus-micro-batch-generator.ts    # Core generator
├── industry-list.json                # 141 industries
├── run-all-micro-batches.sh         # Orchestration script
└── OPUS_GENERATION.md                # Full documentation
```

### Copied to MARBA Project
```
/Users/byronhudson/Projects/MARBA/scripts/opus-generation/
├── README.md                         # ✅ Complete usage guide
├── opus-micro-batch-generator.ts    # ✅ Copied from Brandock
├── industry-list.json                # ✅ 141 industries
└── run-all-micro-batches.sh         # ✅ Orchestration script
```

---

## 📊 Current Status

### What You Have Now
- **93 profiles** with full marketing data (migrated from Brandock) ✅
- **54 profiles** with only basic NAICS data (from local seed) ⚠️

### What These Scripts Can Generate
- **All 141 profiles** with comprehensive 40-field schema
- **~3,200+ words** per profile
- **Total content:** ~450,000 words of marketing intelligence

---

## 🎯 The 40-Field Comprehensive Schema

Each profile generated includes:

### Customer Intelligence (8 fields)
- Customer triggers (urgency scores, frequency)
- Customer journey (5-stage map)
- Transformations (before → after)
- Success metrics
- Urgency drivers
- Objection handlers
- Risk reversal strategies
- Customer language dictionary

### Messaging & Copy (7 fields)
- 20-30 power words
- 15-20 avoid words
- 10 headline templates (with CTR estimates)
- 8 CTA templates (with conversion rates)
- 9 social post templates (platform-specific)
- 5-7 value propositions
- Messaging frameworks (premium, budget, enterprise)

### Trust & Credibility (5 fields)
- Trust signals (ranked by importance)
- Social proof statistics
- Quality indicators
- Testimonial capture timing
- Competitive advantages

### Pricing & Economics (5 fields)
- Pricing psychology (anchoring, sweet spots)
- Price sensitivity thresholds
- Emergency premium pricing (multipliers)
- Tiered service models (3 tiers)
- Margin optimization strategies

### Timing & Patterns (4 fields)
- Seasonal patterns (12 months)
- Weekly patterns (7 days)
- Monthly patterns (billing cycles)
- Peak crisis times

### Growth & Retention (6 fields)
- Service packages
- Upsell paths
- Retention hooks
- Referral strategies
- Cross-sell opportunities
- Expansion opportunities

### Core Fields (5 fields)
- Industry name
- NAICS code
- Category
- Subcategory
- Metadata

**Total:** 40 fields covering every aspect of marketing intelligence

---

## 💡 How It Works

### Generation Process

1. **Input:** `industry-list.json` with 141 industries
2. **Batch Size:** 2 profiles per batch (71 total batches)
3. **AI Model:** Claude Opus 4.1 via OpenRouter API
4. **Prompt:** Comprehensive 40-field schema requirements
5. **Validation:** Ensures all 40 fields are present and valid
6. **Output:** JSON files in `opus-generated/micro-batches/`

### Cost & Time

**For 54 Missing Profiles:**
- Cost: ~$32 (27 batches × $1.20/batch)
- Time: ~20-30 minutes

**For All 141 Profiles:**
- Cost: ~$85 (71 batches × $1.20/batch)
- Time: ~45-60 minutes

**Model Pricing:**
- Input: ~$15 per 1M tokens
- Output: ~$75 per 1M tokens
- Per profile: ~8,000 output tokens = ~$0.60

---

## 🚀 Quick Start Guide

### Prerequisites

1. **OpenRouter API Key**
   - Sign up at: https://openrouter.ai
   - Get your API key (starts with `sk-or-v1-...`)

2. **Add to Environment**
   ```bash
   # Add to /Users/byronhudson/Projects/MARBA/.env
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

### Option 1: Generate One Batch (Test)

```bash
cd /Users/byronhudson/Projects/MARBA/scripts/opus-generation

# Set API key
export VITE_OPENROUTER_API_KEY="sk-or-v1-your-key-here"

# Generate first 2 profiles
npx tsx opus-micro-batch-generator.ts 0 2

# Check output
cat opus-generated/micro-batches/batch-0-2.json | jq '.'
```

**Expected output:**
- File: `opus-generated/micro-batches/batch-0-2.json`
- Contains: 2 complete profiles with all 40 fields
- Size: ~100-150 KB per profile

### Option 2: Generate All 141 Profiles (Full Run)

```bash
cd /Users/byronhudson/Projects/MARBA/scripts/opus-generation

# Set API key
export VITE_OPENROUTER_API_KEY="sk-or-v1-your-key-here"

# Make script executable
chmod +x run-all-micro-batches.sh

# Run all 71 batches (background with logging)
./run-all-micro-batches.sh 2>&1 | tee opus-batch-run.log &

# Monitor progress
tail -f opus-batch-run.log
```

**Script Features:**
- ✅ Auto-resume (skips completed batches)
- ✅ Retry on failures (3 attempts)
- ✅ Progress logging
- ✅ Validation checks

### Monitor Progress

```bash
# Count completed batches
ls -1 opus-generated/micro-batches/ | wc -l
# Target: 71 batches

# View latest activity
tail -20 opus-batch-run.log

# Check for errors
grep -i "error\|failed" opus-batch-run.log
```

---

## 📥 Upload Generated Profiles to Database

After generation completes, you'll need to upload profiles to MARBA Supabase.

### Option 1: Adapt Existing Migration Script

Update `/Users/byronhudson/Projects/MARBA/scripts/migrate-naics.ts`:

```typescript
// Instead of reading from Brandock Supabase:
// Read from: opus-generated/micro-batches/batch-*.json

const batchFiles = fs.readdirSync('scripts/opus-generation/opus-generated/micro-batches')
  .filter(f => f.startsWith('batch-') && f.endsWith('.json'))

const allProfiles = []
for (const file of batchFiles) {
  const profiles = JSON.parse(fs.readFileSync(`scripts/opus-generation/opus-generated/micro-batches/${file}`))
  allProfiles.push(...profiles)
}

// Then use existing upsert logic
await marbaClient
  .from('industry_profiles')
  .upsert(allProfiles.map(mapOpusToMarbaSchema), {
    onConflict: 'naics_code'
  })
```

### Option 2: Create New Upload Script

```typescript
// scripts/upload-opus-profiles.ts

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const marbaClient = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadOpusProfiles() {
  // Read all batch files
  const batchDir = 'scripts/opus-generation/opus-generated/micro-batches'
  const files = fs.readdirSync(batchDir).filter(f => f.endsWith('.json'))

  let allProfiles = []
  for (const file of files) {
    const profiles = JSON.parse(fs.readFileSync(path.join(batchDir, file), 'utf-8'))
    allProfiles.push(...profiles)
  }

  console.log(`📊 Found ${allProfiles.length} profiles to upload`)

  // Map to MARBA schema
  const mapped = allProfiles.map(profile => ({
    naics_code: profile.naics_code,
    title: profile.industry_name,
    has_full_profile: true,

    // Quick-access fields
    keywords: profile.power_words?.slice(0, 20) || [],
    key_trends: profile.customer_triggers?.map(t => t.trigger).slice(0, 10) || [],
    pain_points: profile.customer_language_dictionary?.problem_words?.slice(0, 15) || [],
    common_objections: profile.objection_handlers?.map(o => o.objection).slice(0, 10) || [],

    // Full profile in JSONB
    full_profile_data: {
      customer_triggers: profile.customer_triggers,
      customer_journey: profile.customer_journey,
      transformations: profile.transformations,
      success_metrics: profile.success_metrics,
      urgency_drivers: profile.urgency_drivers,
      objection_handlers: profile.objection_handlers,
      risk_reversal: profile.risk_reversal,
      customer_language_dictionary: profile.customer_language_dictionary,
      power_words: profile.power_words,
      avoid_words: profile.avoid_words,
      headline_templates: profile.headline_templates,
      cta_templates: profile.cta_templates,
      social_post_templates: profile.social_post_templates,
      value_propositions: profile.value_propositions,
      messaging_frameworks: profile.messaging_frameworks,
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
    }
  }))

  // Upsert to database
  const { data, error } = await marbaClient
    .from('industry_profiles')
    .upsert(mapped, { onConflict: 'naics_code' })

  if (error) {
    console.error('❌ Upload failed:', error)
    process.exit(1)
  }

  console.log(`✅ Uploaded ${allProfiles.length} profiles!`)
}

uploadOpusProfiles()
```

---

## 🎯 Recommended Approach

### For Immediate Results (54 Missing Profiles)

1. **Get OpenRouter API Key** (~5 minutes)
2. **Generate 27 Batches** (~20-30 minutes, ~$32)
3. **Upload to Database** (~5 minutes)
4. **Test in UI** (~5 minutes)

**Total Time:** ~1 hour
**Total Cost:** ~$32
**Result:** All 147 profiles with full marketing data ✅

### For Complete Refresh (All 141 Profiles)

1. **Get OpenRouter API Key** (~5 minutes)
2. **Generate All 71 Batches** (~45-60 minutes, ~$85)
3. **Upload to Database** (~10 minutes)
4. **Test in UI** (~5 minutes)

**Total Time:** ~1.5 hours
**Total Cost:** ~$85
**Result:** Fresh, comprehensive data for all profiles ✅

---

## 📋 Industry Coverage (141 Industries)

The system generates profiles for:

- **Technology** (10): MSP, Cybersecurity, Web Development, etc.
- **Healthcare** (22): Dentistry, Medical, Veterinary, etc.
- **Professional Services** (29): Legal, Accounting, Consulting, etc.
- **Construction** (22): HVAC, Plumbing, Roofing, Remodeling, etc.
- **Food Service** (17): Restaurants, Catering, Cafes, etc.
- **Personal Services** (28): Salons, Fitness, Auto Repair, etc.
- **Retail** (10): Boutiques, Pet Stores, Furniture, etc.

See `scripts/opus-generation/industry-list.json` for complete list.

---

## 🔍 Example Output

Here's what each generated profile looks like:

```json
{
  "industry": "MSP (Managed Service Provider)",
  "industry_name": "MSP (Managed Service Provider)",
  "naics_code": "541519",
  "category": "Technology",
  "subcategory": null,

  "customer_triggers": [
    {
      "trigger": "Server just went down at 5:47am",
      "urgency": 10,
      "frequency": "Monthly for 40% of SMBs"
    },
    // ... 7-9 more
  ],

  "customer_journey": {
    "awareness": "Realizing current IT setup is reactive not proactive",
    "consideration": "Comparing break-fix vs managed services cost",
    "decision": "Trust in 24/7 monitoring and rapid response",
    "retention": "Consistent uptime and predictable monthly costs",
    "advocacy": "Referrals when business peers face IT crisis"
  },

  "power_words": [
    "uptime", "proactive", "monitored", "secure", "compliant",
    "backup", "disaster recovery", "24/7", "guaranteed",
    // ... 20-30 total
  ],

  "headline_templates": [
    {
      "template": "Stop Firefighting IT Issues - Get 99.9% Uptime Guaranteed",
      "expected_ctr": 8.2,
      "use_case": "Homepage hero for SMBs tired of downtime"
    },
    // ... 10 total
  ],

  "pricing_psychology": {
    "anchoring": "Start with most expensive tier to make mid-tier feel reasonable",
    "sensitivity": "Price resistance at $200/user/month for SMBs under 25 employees",
    "sweet_spots": ["$99-149/user", "$1,500-2,500 flat fee for <20 users"],
    "decoy_pricing": "Offer premium tier at 2.5x mid-tier to boost mid-tier sales"
  },

  // ... all 40 fields
}
```

---

## ✅ Success Criteria

When complete, you'll have:

1. ✅ **147 profiles** in MARBA database (93 existing + 54 new)
2. ✅ **All profiles** with `has_full_profile = true`
3. ✅ **~450,000 words** of marketing intelligence
4. ✅ **40-field schema** for every profile
5. ✅ **Comprehensive data** for all customer psychology, messaging, pricing, and growth strategies

---

## 📚 Documentation

- **Full README:** `/Users/byronhudson/Projects/MARBA/scripts/opus-generation/README.md`
- **Original Docs:** `/Users/byronhudson/brandock/Figma/apps/web/data/industry-research/OPUS_GENERATION.md`
- **Migration Guide:** `/Users/byronhudson/Projects/MARBA/BRANDOCK_MIGRATION_COMPLETE.md`

---

## 🎉 You're Ready!

The scripts are ready to use. Just need to:

1. Get your OpenRouter API key
2. Add it to `.env`
3. Run the generation scripts
4. Upload to database
5. Enjoy comprehensive marketing intelligence for all industries! 🚀

---

**Questions or issues?** Check the README at `scripts/opus-generation/README.md`
