import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function testBrandCreation() {
  console.log('\n🧪 Testing Brand Creation for Bar/Pub...\n')

  const testDomain = 'harwoodarmsdallas.com'
  const naicsCode = '722410'

  // Step 1: Get industry profile
  console.log('Step 1: Fetching industry profile...')
  const { data: industryProfile, error: profileError } = await supabase
    .from('industry_profiles')
    .select('*')
    .eq('naics_code', naicsCode)
    .single()

  if (profileError) {
    console.error('❌ Profile fetch error:', profileError)
    return
  }

  console.log('✅ Industry profile found:', industryProfile.title)

  // Step 2: Try to create brand
  console.log('\nStep 2: Creating brand...')
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .insert({
      name: testDomain,
      domain: testDomain,
      industry: industryProfile.title,
      naics_code: naicsCode,
      user_id: null
    })
    .select()
    .single()

  if (brandError) {
    console.error('❌ Brand creation error:', brandError)
    console.error('Error details:', {
      message: brandError.message,
      details: brandError.details,
      hint: brandError.hint,
      code: brandError.code
    })
    return
  }

  console.log('✅ Brand created successfully!')
  console.log('Brand ID:', brand.id)
  console.log('Brand name:', brand.name)

  // Cleanup - delete test brand
  console.log('\nCleaning up test brand...')
  await supabase.from('brands').delete().eq('id', brand.id)
  console.log('✅ Test brand deleted')
}

testBrandCreation()
