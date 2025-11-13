/**
 * Import Complete NAICS Codes to Industry Search Index
 *
 * This script imports all 384 industry entries from complete-naics-codes.ts
 * into the new industry_search_index table for comprehensive search functionality
 */

import { createClient } from '@supabase/supabase-js'
import { COMPLETE_NAICS_CODES } from '../Synapse/demo-ui/data/complete-naics-codes'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
)

async function importNAICSCodes() {
  console.log('🚀 Starting NAICS codes import...')
  console.log(`📊 Total entries to import: ${COMPLETE_NAICS_CODES.length}`)

  // Clear existing search index
  const { error: deleteError } = await supabase
    .from('industry_search_index')
    .delete()
    .neq('id', 0) // Delete all

  if (deleteError) {
    console.error('❌ Error clearing existing index:', deleteError)
    return
  }

  console.log('✅ Cleared existing search index')

  // Prepare batch insert data
  const insertData = COMPLETE_NAICS_CODES.map(entry => ({
    naics_code: entry.naics_code,
    display_name: entry.display_name,
    category: entry.category,
    keywords: entry.keywords,
    has_full_profile: entry.has_full_profile,
    popularity: entry.popularity || 0
  }))

  // Insert in batches of 50 to avoid timeout
  const batchSize = 50
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < insertData.length; i += batchSize) {
    const batch = insertData.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from('industry_search_index')
      .insert(batch)

    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
      errorCount += batch.length
    } else {
      successCount += batch.length
      console.log(`✅ Inserted batch ${i / batchSize + 1} (${batch.length} entries)`)
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`✅ Successfully imported: ${successCount} entries`)
  if (errorCount > 0) {
    console.log(`❌ Failed to import: ${errorCount} entries`)
  }

  // Verify the import
  const { count } = await supabase
    .from('industry_search_index')
    .select('*', { count: 'exact', head: true })

  console.log(`\n🔍 Verification: ${count} total entries in search index`)

  // Test lawyer search
  const { data: lawyerTest } = await supabase
    .from('industry_search_index')
    .select('*')
    .or('keywords.cs.{lawyer},keywords.cs.{attorney},keywords.cs.{legal}')
    .limit(10)

  console.log(`\n⚖️  Lawyer search test: Found ${lawyerTest?.length || 0} legal-related entries`)
  if (lawyerTest && lawyerTest.length > 0) {
    console.log('Sample results:')
    lawyerTest.slice(0, 5).forEach(entry => {
      console.log(`  - ${entry.display_name} (${entry.naics_code})`)
    })
  }
}

// Run the import
importNAICSCodes()
  .then(() => {
    console.log('\n✅ Import complete!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  })