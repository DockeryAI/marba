/**
 * NAICS Industry Profiles Migration Script
 * Copies fully populated industry profiles from Brandock Supabase to MARBA Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// MARBA Supabase (destination) - Use service role key for write access
const marbaUrl = process.env.VITE_SUPABASE_URL
const marbaKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!marbaUrl || !marbaKey) {
  console.error('❌ Error: MARBA Supabase credentials not found in .env')
  console.error('   Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Warning: Using anon key instead of service role key')
  console.warn('   This may fail due to RLS policies. Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env')
}

// Brandock Supabase (source)
// You'll need to provide these via environment variables or command line args
const brandockUrl = process.env.BRANDOCK_SUPABASE_URL || process.argv[2]
const brandockKey = process.env.BRANDOCK_SUPABASE_KEY || process.argv[3]

if (!brandockUrl || !brandockKey) {
  console.error('❌ Error: Brandock Supabase credentials not provided')
  console.error('')
  console.error('Usage:')
  console.error('  npx ts-node scripts/migrate-naics.ts <BRANDOCK_URL> <BRANDOCK_KEY>')
  console.error('')
  console.error('Or set environment variables:')
  console.error('  BRANDOCK_SUPABASE_URL=https://xxx.supabase.co')
  console.error('  BRANDOCK_SUPABASE_KEY=eyJhbGc...')
  console.error('')
  process.exit(1)
}

// Create clients
const brandockClient = createClient(brandockUrl, brandockKey)
const marbaClient = createClient(marbaUrl, marbaKey)

interface IndustryProfile {
  id?: string
  naics_code: string
  title: string
  description?: string
  level: number
  parent_code?: string
  is_standard?: boolean
  keywords?: string[]
  has_full_profile?: boolean
  industry_overview?: string
  market_size?: string
  growth_rate?: string
  key_trends?: string[]
  customer_segments?: string[]
  pain_points?: string[]
  common_objections?: string[]
  success_metrics?: string[]
  regulatory_considerations?: string[]
  seasonal_factors?: string[]
  competitive_landscape?: string
  created_at?: string
  updated_at?: string
}

async function migrateNAICS() {
  console.log('🚀 NAICS Industry Profiles Migration')
  console.log('=====================================\n')

  console.log(`📥 Source: ${brandockUrl.substring(0, 30)}...`)
  console.log(`📤 Destination: ${marbaUrl.substring(0, 30)}...\n`)

  try {
    // Step 1: Fetch all profiles from Brandock (no has_full_profile filter)
    console.log('📊 Fetching industry profiles from Brandock...')
    const { data: profiles, error: fetchError } = await brandockClient
      .from('industry_profiles')
      .select('*')

    if (fetchError) {
      console.error('❌ Error fetching from Brandock:', fetchError.message)
      process.exit(1)
    }

    if (!profiles || profiles.length === 0) {
      console.log('⚠️  No profiles found in Brandock')
      process.exit(0)
    }

    console.log(`✓ Found ${profiles.length} industry profiles\n`)

    // Step 2: Check what's already in MARBA
    console.log('🔍 Checking existing profiles in MARBA...')
    const { data: existing, error: existingError } = await marbaClient
      .from('industry_profiles')
      .select('naics_code')

    if (existingError && existingError.code !== 'PGRST116') {
      // PGRST116 = not found, which is ok
      console.error('❌ Error checking MARBA:', existingError.message)
      process.exit(1)
    }

    const existingCodes = new Set((existing || []).map((p: any) => p.naics_code))
    console.log(`✓ Found ${existingCodes.size} existing profiles in MARBA\n`)

    // Step 3: Prepare profiles for insertion (remove id, created_at, updated_at)
    // Also set has_full_profile to true for profiles with detailed data
    // Only include columns that exist in MARBA schema
    const allowedColumns = [
      'naics_code', 'title', 'description', 'level', 'parent_code', 'is_standard',
      'keywords', 'has_full_profile', 'industry_overview', 'market_size', 'growth_rate',
      'key_trends', 'customer_segments', 'pain_points', 'common_objections',
      'success_metrics', 'regulatory_considerations', 'seasonal_factors',
      'competitive_landscape'
    ]

    const profilesToInsert: IndustryProfile[] = profiles
      .filter((profile: any) => {
        // Skip profiles missing required fields (Brandock uses industry_name, not title)
        return profile.naics_code && (profile.industry_name || profile.industry)
      })
      .map((profile: any) => {
        const { id, created_at, updated_at, ...rest } = profile

        // Map Brandock schema to MARBA schema
        const mapped: any = {
          naics_code: profile.naics_code,
          title: profile.industry_name || profile.industry,
          description: profile.category && profile.subcategory
            ? `${profile.category} - ${profile.subcategory}`
            : profile.category || '',
          level: profile.level || 6, // Default to detailed industry level
          parent_code: profile.parent_code || null,
          is_standard: profile.is_standard !== false,
          keywords: profile.power_words?.slice(0, 20) || [],
          has_full_profile: true, // Brandock profiles are all fully populated

          // Extract rich marketing data for quick access
          industry_overview: profile.category || '',
          key_trends: profile.customer_triggers?.map((t: any) => t.trigger).slice(0, 10) || [],
          customer_segments: profile.customer_journey ?
            [
              ...profile.customer_journey.awareness || [],
              ...profile.customer_journey.consideration || []
            ].slice(0, 10) : [],
          pain_points: profile.customer_language_dictionary?.pain_keywords?.slice(0, 15) || [],
          common_objections: profile.objection_handlers?.map((o: any) => o.objection).slice(0, 10) || [],
          success_metrics: profile.success_metrics?.map((m: any) => m.metric).slice(0, 10) || [],
          competitive_landscape: profile.competitive_advantages?.join('. ') || '',

          // Store FULL Brandock profile data (all 475k words worth!)
          full_profile_data: {
            // Customer Intelligence
            customer_triggers: profile.customer_triggers,
            customer_journey: profile.customer_journey,
            transformations: profile.transformations,
            urgency_drivers: profile.urgency_drivers,
            customer_language_dictionary: profile.customer_language_dictionary,

            // Messaging & Copy
            objection_handlers: profile.objection_handlers,
            headline_templates: profile.headline_templates,
            cta_templates: profile.cta_templates,
            social_post_templates: profile.social_post_templates,
            value_propositions: profile.value_propositions,
            messaging_frameworks: profile.messaging_frameworks,
            power_words: profile.power_words,
            avoid_words: profile.avoid_words,

            // Trust & Credibility
            success_metrics: profile.success_metrics,
            risk_reversal: profile.risk_reversal,
            trust_signals: profile.trust_signals,
            social_proof_statistics: profile.social_proof_statistics,
            quality_indicators: profile.quality_indicators,
            testimonial_capture_timing: profile.testimonial_capture_timing,
            competitive_advantages: profile.competitive_advantages,

            // Pricing & Economics
            pricing_psychology: profile.pricing_psychology,
            price_sensitivity_thresholds: profile.price_sensitivity_thresholds,
            emergency_premium_pricing: profile.emergency_premium_pricing,
            tiered_service_models: profile.tiered_service_models,
            margin_optimization_strategies: profile.margin_optimization_strategies,

            // Seasonal & Industry Dynamics
            seasonal_patterns: profile.seasonal_patterns,

            // Original metadata
            category: profile.category,
            subcategory: profile.subcategory,
          }
        }

        return mapped
      })

    const skippedCount = profiles.length - profilesToInsert.length
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} profiles with missing required fields`)
    }

    // Deduplicate by NAICS code (keep first occurrence)
    const seen = new Set<string>()
    const deduplicated = profilesToInsert.filter(profile => {
      if (seen.has(profile.naics_code)) {
        return false
      }
      seen.add(profile.naics_code)
      return true
    })

    const duplicateCount = profilesToInsert.length - deduplicated.length
    if (duplicateCount > 0) {
      console.log(`⚠️  Removed ${duplicateCount} duplicate NAICS codes`)
    }

    // Step 4: Insert/Update profiles in MARBA
    console.log('💾 Migrating profiles to MARBA...')
    console.log(`   Inserting/updating ${deduplicated.length} profiles...`)

    // Use upsert with onConflict on naics_code
    const { data: inserted, error: insertError} = await marbaClient
      .from('industry_profiles')
      .upsert(deduplicated, {
        onConflict: 'naics_code',
        ignoreDuplicates: false, // Update if exists
      })
      .select()

    if (insertError) {
      console.error('❌ Error inserting into MARBA:', insertError.message)
      console.error('   Details:', insertError)
      process.exit(1)
    }

    console.log(`✅ Successfully migrated ${inserted?.length || deduplicated.length} profiles!\n`)

    // Step 5: Verification
    console.log('🔎 Verifying migration...')
    const { data: allProfiles, error: verifyError } = await marbaClient
      .from('industry_profiles')
      .select('naics_code, title, has_full_profile')

    if (verifyError) {
      console.error('⚠️  Could not verify migration:', verifyError.message)
    } else {
      const total = allProfiles?.length || 0
      const withFullProfile = allProfiles?.filter((p: any) => p.has_full_profile).length || 0
      console.log(`✓ Verified ${total} total profiles in MARBA`)
      console.log(`  • ${withFullProfile} with full marketing data`)
      console.log(`  • ${total - withFullProfile} with basic data only`)
    }

    // Show sample
    if (allProfiles && allProfiles.length > 0) {
      const samplesWithData = allProfiles.filter((p: any) => p.has_full_profile).slice(0, 5)
      if (samplesWithData.length > 0) {
        console.log('\n📋 Sample profiles with full data:')
        samplesWithData.forEach((p: any) => {
          console.log(`   • ${p.naics_code}: ${p.title}`)
        })
      }
    }

    console.log('\n✅ Migration complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Test the onboarding page: npm run dev')
    console.log('   2. Try searching for an industry (e.g., "restaurant" or "software")')
    console.log('   3. Verify NAICS codes appear in the dropdown')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

// Run migration
migrateNAICS()
