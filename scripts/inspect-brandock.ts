/**
 * Inspect Brandock Database Structure
 * Check what columns and data actually exist
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const brandockUrl = process.env.BRANDOCK_SUPABASE_URL
const brandockKey = process.env.BRANDOCK_SUPABASE_KEY

if (!brandockUrl || !brandockKey) {
  console.error('❌ Error: Brandock credentials not found')
  process.exit(1)
}

const brandockClient = createClient(brandockUrl, brandockKey)

async function inspect() {
  console.log('🔍 Inspecting Brandock Database')
  console.log('==============================\n')

  try {
    // Get all profiles
    const { data: profiles, error } = await brandockClient
      .from('industry_profiles')
      .select('*')
      .limit(5)

    if (error) {
      console.error('❌ Error:', error.message)
      process.exit(1)
    }

    console.log(`Found ${profiles?.length || 0} sample profiles\n`)

    if (profiles && profiles.length > 0) {
      console.log('📋 First profile structure:')
      console.log(JSON.stringify(profiles[0], null, 2))

      console.log('\n📊 Column names:')
      Object.keys(profiles[0]).forEach(key => {
        const value = profiles[0][key]
        const type = Array.isArray(value) ? 'array' : typeof value
        const preview = Array.isArray(value)
          ? `[${value.length} items]`
          : typeof value === 'string' && value.length > 50
          ? value.substring(0, 50) + '...'
          : value
        console.log(`  • ${key}: ${type} = ${preview}`)
      })

      // Count profiles with data
      const { count: totalCount } = await brandockClient
        .from('industry_profiles')
        .select('*', { count: 'exact', head: true })

      console.log(`\n📈 Total profiles in Brandock: ${totalCount}`)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

inspect()
