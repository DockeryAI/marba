import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function testRealBrand() {
  console.log('\n🧪 Testing brand creation with valid NAICS code (722410 - Bar/Pub)...\n')

  const { data, error } = await supabase
    .from('brands')
    .insert({
      name: 'Harwood Arms Dallas',
      website: 'harwoodarmsdallas.com',
      industry: 'Bar/Pub',
      naics_code: '722410',
      user_id: null
    })
    .select()

  if (error) {
    console.log('❌ Error:', error.message)
    console.log('Details:', error)
  } else {
    console.log('✅ SUCCESS! Brand created')
    console.log('Brand ID:', data[0].id)
    console.log('Brand data:', data[0])

    // Clean up
    await supabase.from('brands').delete().eq('id', data[0].id)
    console.log('✅ Cleaned up test brand')
  }
}

testRealBrand()
