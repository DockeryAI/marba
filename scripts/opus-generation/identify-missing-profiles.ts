/**
 * Identify which profiles need full data generation
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

const marbaClient = createClient(marbaUrl, marbaKey)

async function identifyMissingProfiles() {
  console.log('🔍 Identifying profiles without full marketing data...\n')

  // Get all profiles without full data
  const { data: missingProfiles, error } = await marbaClient
    .from('industry_profiles')
    .select('naics_code, title')
    .eq('has_full_profile', false)
    .order('naics_code')

  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }

  console.log(`Found ${missingProfiles.length} profiles without full data:\n`)

  // Load the industry list to map NAICS codes to the list
  const industryListPath = path.join(__dirname, 'industry-list.json')
  const industryList = JSON.parse(
    fs.readFileSync(industryListPath, 'utf-8')
  )

  // Create a list of missing industries
  const missingIndustries = missingProfiles.map(profile => {
    // Find matching industry in list
    const industry = industryList.find((ind: any) => ind.naics === profile.naics_code)

    return {
      naics: profile.naics_code,
      name: profile.title,
      category: industry?.category || 'Unknown',
      index: industry ? industryList.indexOf(industry) : -1
    }
  }).filter(ind => ind.index !== -1)

  console.log(`✓ Mapped ${missingIndustries.length} industries from the list\n`)

  // Group by category
  const byCategory = missingIndustries.reduce((acc: any, ind) => {
    acc[ind.category] = acc[ind.category] || []
    acc[ind.category].push(ind)
    return acc
  }, {})

  for (const category in byCategory) {
    console.log(`${category} (${byCategory[category].length}):`)
    byCategory[category].forEach((ind: any) => {
      console.log(`  ${ind.index}. ${ind.name} (${ind.naics})`)
    })
    console.log()
  }

  // Save indices to file for batch processing
  const indices = missingIndustries.map(ind => ind.index).sort((a, b) => a - b)
  fs.writeFileSync('missing-profile-indices.json', JSON.stringify(indices, null, 2))

  console.log(`✓ Saved ${indices.length} indices to missing-profile-indices.json`)
  console.log(`\nIndices: ${indices.join(', ')}`)

  return indices
}

identifyMissingProfiles()
