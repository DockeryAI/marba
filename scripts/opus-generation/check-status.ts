import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function checkStatus() {
  const { data: fullProfiles, error } = await supabase
    .from('industry_profiles')
    .select('has_full_profile')
    .eq('has_full_profile', true)

  if (error) {
    console.error('Error:', error)
    return
  }

  const { data: missingProfiles } = await supabase
    .from('industry_profiles')
    .select('naics_code, title')
    .eq('has_full_profile', false)

  console.log('\n📊 Industry Profile Status')
  console.log('=' .repeat(50))
  console.log(`✅ Profiles with full data: ${fullProfiles?.length || 0}`)
  console.log(`❌ Profiles missing full data: ${missingProfiles?.length || 0}`)
  console.log(`📈 Total profiles: ${(fullProfiles?.length || 0) + (missingProfiles?.length || 0)}`)
}

checkStatus()
