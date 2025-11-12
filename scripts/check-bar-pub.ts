import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function checkBarPub() {
  console.log('\n🔍 Checking Bar/Pub Profile (NAICS: 722410)...\n')

  const { data, error } = await supabase
    .from('industry_profiles')
    .select('*')
    .eq('naics_code', '722410')
    .single()

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  if (!data) {
    console.error('❌ No profile found for NAICS 722410')
    return
  }

  console.log('✅ Profile found!')
  console.log('Title:', data.title)
  console.log('Description:', data.description)
  console.log('Has Full Profile:', data.has_full_profile)
  console.log('Keywords:', data.keywords)
  console.log('\nFull Profile Data:', data.full_profile_data ? 'Present' : 'MISSING')

  if (data.full_profile_data) {
    console.log('Full Profile Fields:', Object.keys(data.full_profile_data).length)
    console.log('Fields:', Object.keys(data.full_profile_data).slice(0, 10).join(', '))
  }
}

checkBarPub()
