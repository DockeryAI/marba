import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const anonClient = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''  // <-- Using ANON key like the browser
)

async function testWithAnonKey() {
  console.log('\n🧪 Testing brand creation with ANON key (like the browser)...\n')

  const { data, error } = await anonClient
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
    console.log('❌ FAILED with anon key:', error.message)
    console.log('Error code:', error.code)
    console.log('Error details:', error.details)
    console.log('\n⚠️  This is why the browser is failing!')
    console.log('The RLS policies are blocking unauthenticated inserts.')
  } else {
    console.log('✅ SUCCESS! Brand created with anon key')
    console.log('Brand ID:', data[0].id)

    // Clean up
    await anonClient.from('brands').delete().eq('id', data[0].id)
    console.log('✅ Cleaned up test brand')
  }
}

testWithAnonKey()
