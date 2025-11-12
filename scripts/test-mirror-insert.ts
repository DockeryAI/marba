import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const anonClient = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function testMirrorInsert() {
  console.log('\n🧪 Testing mirror_sections insert with ANON key...\n')

  // First, create a test brand
  const { data: brand, error: brandError } = await anonClient
    .from('brands')
    .insert({
      name: 'Test Mirror Brand',
      website: 'testmirror.com',
      industry: 'Bar/Pub',
      naics_code: '722410',
      user_id: null
    })
    .select()
    .single()

  if (brandError) {
    console.log('❌ Brand creation failed:', brandError.message)
    return
  }

  console.log('✅ Brand created:', brand.id)

  // Try to insert a mirror section
  const { data, error } = await anonClient
    .from('mirror_sections')
    .insert({
      brand_id: brand.id,
      section: 'measure',
      content: JSON.stringify({ test: 'data' }),
      insights: ['Test insight']
    })
    .select()

  if (error) {
    console.log('❌ MIRROR SECTION INSERT FAILED')
    console.log('Error message:', error.message)
    console.log('Error code:', error.code)
    console.log('Error details:', error.details)
    console.log('Error hint:', error.hint)
    console.log('\nFull error:', JSON.stringify(error, null, 2))
  } else {
    console.log('✅ SUCCESS! Mirror section created')
    console.log('Section ID:', data[0].id)

    // Clean up
    await anonClient.from('mirror_sections').delete().eq('id', data[0].id)
    await anonClient.from('brands').delete().eq('id', brand.id)
    console.log('✅ Cleaned up test data')
  }
}

testMirrorInsert()
