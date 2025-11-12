import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function verifyMirrorSections() {
  console.log('\n🔍 Checking for MIRROR sections...\n')

  // Get the most recent brand
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  if (brandsError) {
    console.log('❌ Error fetching brands:', brandsError.message)
    return
  }

  console.log(`Found ${brands.length} recent brands:`)
  brands.forEach((brand, i) => {
    console.log(`  ${i + 1}. ${brand.name} (${brand.id})`)
  })

  // Check mirror sections for each brand
  for (const brand of brands) {
    console.log(`\n📊 Checking MIRROR sections for: ${brand.name}`)

    const { data: sections, error: sectionsError } = await supabase
      .from('mirror_sections')
      .select('section, data')
      .eq('brand_id', brand.id)
      .order('section')

    if (sectionsError) {
      console.log(`  ❌ Error: ${sectionsError.message}`)
      continue
    }

    if (sections.length === 0) {
      console.log('  ⚠️  No MIRROR sections found')
    } else {
      console.log(`  ✅ Found ${sections.length} sections:`)
      sections.forEach(section => {
        console.log(`     - ${section.section}`)
      })
    }
  }
}

verifyMirrorSections()
