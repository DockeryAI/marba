import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function check() {
  const { data: sections } = await supabase
    .from('mirror_sections')
    .select('section, data')
    .eq('brand_id', 'ade13e5c-0f22-45ae-8e57-3d24d1109d48')
    .eq('section', 'measure')
    .single()

  if (sections?.data) {
    console.log('MEASURE section fields:', Object.keys(sections.data))
    console.log('\nAssets:', JSON.stringify(sections.data.assets, null, 2))
    console.log('\nCompetitive Landscape structure:', Object.keys(sections.data.competitiveLandscape || {}))
    console.log('\nCompetitors:', JSON.stringify(sections.data.competitiveLandscape?.competitors, null, 2))
    console.log('\nVulnerabilities:', JSON.stringify(sections.data.competitiveLandscape?.vulnerabilities, null, 2))
  }
}

check()
