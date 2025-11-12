import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function check() {
  const { data, error } = await supabase
    .from('industry_profiles')
    .select('has_full_profile, naics_code, title')
    .order('naics_code')

  if (error) {
    console.error('Error:', error)
    return
  }

  const withFull = data.filter(d => d.has_full_profile).length
  const withoutFull = data.filter(d => d.has_full_profile === false).length

  console.log('✅ Profiles with full data:', withFull)
  console.log('⚠️  Profiles without full data:', withoutFull)
  console.log('📊 Total profiles:', data.length)

  if (withoutFull > 0) {
    console.log('\n❌ Missing profiles:')
    data.filter(d => !d.has_full_profile).forEach(p => {
      console.log(`   ${p.naics_code}: ${p.title}`)
    })
  }
}

check()
