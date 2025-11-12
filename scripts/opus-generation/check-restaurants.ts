import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function checkRestaurants() {
  console.log('\n🔍 Searching for restaurant-related profiles...\n')

  // Search for restaurant-related profiles
  const { data: restaurants, error } = await supabase
    .from('industry_profiles')
    .select('naics_code, title, description, keywords')
    .or('title.ilike.%restaurant%,description.ilike.%restaurant%,title.ilike.%food service%,title.ilike.%eating%,title.ilike.%drinking%')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${restaurants?.length || 0} restaurant-related profiles:\n`)

  restaurants?.forEach((prof, index) => {
    console.log(`${index + 1}. ${prof.title}`)
    console.log(`   NAICS: ${prof.naics_code}`)
    console.log(`   Description: ${prof.description || 'N/A'}`)
    console.log(`   Keywords: ${prof.keywords?.slice(0, 5).join(', ') || 'N/A'}`)
    console.log()
  })

  // Also check total count
  const { count } = await supabase
    .from('industry_profiles')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📊 Total profiles in database: ${count}`)
}

checkRestaurants()
