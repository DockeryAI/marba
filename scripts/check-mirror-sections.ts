import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function checkMirrorSections() {
  // Get the most recent brand
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, industry')
    .order('created_at', { ascending: false })
    .limit(1)

  if (!brands || brands.length === 0) {
    console.log('No brands found')
    return
  }

  const brand = brands[0]
  console.log('Latest brand:', brand.name, brand.industry)
  console.log('Brand ID:', brand.id)

  // Check mirror sections
  const { data: sections } = await supabase
    .from('mirror_sections')
    .select('section, data')
    .eq('brand_id', brand.id)

  console.log('\n=== MIRROR SECTIONS ===')
  console.log('Total sections:', sections?.length || 0)

  sections?.forEach(s => {
    console.log(`\n--- ${s.section.toUpperCase()} SECTION ---`)
    const dataKeys = Object.keys(s.data || {})
    console.log('Number of fields:', dataKeys.length)
    console.log('Fields:', dataKeys.join(', '))

    if (s.section === 'measure') {
      console.log('\nMEASURE Data:')
      console.log('- Has marketPosition:', !!s.data.marketPosition)
      console.log('- Key trends:', s.data.marketPosition?.keyTrends)
      console.log('- Has competitiveLandscape:', !!s.data.competitiveLandscape)
      console.log('- Competitive advantages:', s.data.competitiveLandscape?.advantages)
    }

    if (s.section === 'reimagine') {
      console.log('\nREIMAGINE Data:')
      console.log('- Has uvps:', !!s.data.uvps)
      console.log('- UVPs count:', s.data.uvps?.length)
      if (s.data.uvps?.[0]) {
        console.log('- First UVP:', JSON.stringify(s.data.uvps[0]))
      }
      console.log('- Has contentStrategy:', !!s.data.contentStrategy)
      console.log('- Power words:', s.data.contentStrategy?.powerWords?.slice(0, 10))
    }
  })
}

checkMirrorSections()
