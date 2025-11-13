import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
)

async function testLawyerSearch() {
  console.log('Testing lawyer search in industry_search_index...\n')

  // Test 1: Search by keyword array contains
  const { data: lawyerResults } = await supabase
    .from('industry_search_index')
    .select('naics_code, display_name, keywords')
    .or('keywords.cs.{lawyer},keywords.cs.{attorney},keywords.cs.{legal}')
    .limit(10)

  console.log('🔍 Lawyer/Attorney/Legal keyword search:')
  console.log('Found', lawyerResults?.length, 'results:\n')
  lawyerResults?.forEach(r => {
    console.log(`  - ${r.display_name} (${r.naics_code})`)
    const keywordsPreview = r.keywords.slice(0, 3).join(', ')
    console.log(`    Keywords: ${keywordsPreview}...`)
  })

  // Test 2: Direct search for "lawyer" in display name
  const { data: directResults } = await supabase
    .from('industry_search_index')
    .select('naics_code, display_name, keywords')
    .ilike('display_name', '%law%')
    .limit(10)

  console.log('\n🔍 Display name containing "law":')
  console.log('Found', directResults?.length, 'results:\n')
  directResults?.forEach(r => {
    console.log(`  - ${r.display_name} (${r.naics_code})`)
  })

  // Test 3: Get all legal services (NAICS 541110)
  const { data: legalServices } = await supabase
    .from('industry_search_index')
    .select('naics_code, display_name, keywords')
    .eq('naics_code', '541110')

  console.log('\n🔍 All entries for NAICS 541110 (Legal Services):')
  console.log('Found', legalServices?.length, 'specializations:\n')
  legalServices?.forEach(r => {
    console.log(`  - ${r.display_name}`)
  })

  // Test 4: Check total count
  const { count } = await supabase
    .from('industry_search_index')
    .select('*', { count: 'exact', head: true })

  console.log(`\n✅ Total entries in index: ${count}`)
}

testLawyerSearch().catch(console.error)