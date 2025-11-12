/**
 * Seed NAICS Codes from Local File
 * Uses the src/data/naics-codes.ts file to populate the database
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { NAICS_CODES } from '../src/data/naics-codes'

// Load environment variables
dotenv.config()

// MARBA Supabase (use service role key for write access)
const marbaUrl = process.env.VITE_SUPABASE_URL
const marbaKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!marbaUrl || !marbaKey) {
  console.error('❌ Error: MARBA Supabase credentials not found in .env')
  console.error('   Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const marbaClient = createClient(marbaUrl, marbaKey)

async function seedNAICS() {
  console.log('🚀 NAICS Local File Seed')
  console.log('=======================\n')

  console.log(`📋 Found ${NAICS_CODES.length} NAICS codes in local file\n`)

  try {
    // Prepare profiles for insertion
    const profiles = NAICS_CODES.map(code => ({
      naics_code: code.code,
      title: code.title,
      description: code.description,
      level: code.level,
      parent_code: code.parentCode || null,
      is_standard: code.isStandard !== false, // default true
      keywords: code.keywords || [],
      has_full_profile: false, // We don't have full profiles in the local file
    }))

    console.log('💾 Inserting profiles into MARBA...')
    console.log(`   Inserting ${profiles.length} profiles...\n`)

    // Insert in batches of 100 to avoid timeout
    const batchSize = 100
    let inserted = 0
    let errors = 0

    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize)
      const { data, error } = await marbaClient
        .from('industry_profiles')
        .upsert(batch, {
          onConflict: 'naics_code',
          ignoreDuplicates: false,
        })

      if (error) {
        console.error(`   ❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        errors += batch.length
      } else {
        inserted += batch.length
        const progress = Math.floor((inserted / profiles.length) * 100)
        process.stdout.write(`   Progress: ${inserted}/${profiles.length} (${progress}%)\r`)
      }
    }

    console.log(`\n\n✅ Successfully inserted ${inserted} profiles!`)
    if (errors > 0) {
      console.log(`   ⚠️  ${errors} profiles failed to insert`)
    }

    // Verification
    console.log('\n🔎 Verifying...')
    const { data: verification, error: verifyError } = await marbaClient
      .from('industry_profiles')
      .select('naics_code, title, level')
      .order('naics_code')

    if (verifyError) {
      console.error('⚠️  Could not verify:', verifyError.message)
    } else {
      console.log(`✓ Total profiles in database: ${verification?.length || 0}`)

      // Group by level
      const byLevel: Record<number, number> = {}
      verification?.forEach((p: any) => {
        byLevel[p.level] = (byLevel[p.level] || 0) + 1
      })

      console.log('\n📊 Breakdown by level:')
      Object.entries(byLevel)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .forEach(([level, count]) => {
          const levelName = {
            '2': 'Sector',
            '3': 'Subsector',
            '4': 'Industry Group',
            '5': 'Industry',
            '6': 'National Industry',
            '7': 'Custom Sub-Industry',
          }[level] || 'Unknown'
          console.log(`   Level ${level} (${levelName}): ${count} codes`)
        })

      // Show samples
      console.log('\n📋 Sample codes:')
      verification?.slice(0, 5).forEach((p: any) => {
        console.log(`   • ${p.naics_code}: ${p.title}`)
      })
    }

    console.log('\n✅ Seed complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Test the onboarding page: npm run dev')
    console.log('   2. Search for industries (e.g., "restaurant", "software")')
    console.log('   3. Industries should now appear in the dropdown!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

// Run seed
seedNAICS()
