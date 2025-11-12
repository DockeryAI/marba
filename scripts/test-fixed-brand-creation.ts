import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function testFixedBrandCreation() {
  console.log('\n🧪 Testing FIXED Brand Creation for Bar/Pub...\n')

  const testDomain = 'harwoodarmsdallas.com'
  const naicsCode = '722410'
  const defaultUserId = '00000000-0000-0000-0000-000000000000'

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

  // Step 2: Try to create brand with FIXED schema
  console.log('\nStep 2: Creating brand with correct schema...')
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .insert({
      name: testDomain,
      website: testDomain, // FIXED: using 'website' not 'domain'
      industry: industryProfile.title,
      user_id: defaultUserId // FIXED: providing required user_id
    })
    .select()
    .single()

  if (brandError) {
    console.error('❌ Brand creation error:', brandError)
    return
  }

  console.log('✅ Brand created successfully!')
  console.log('Brand ID:', brand.id)
  console.log('Brand name:', brand.name)
  console.log('Brand website:', brand.website)
  console.log('Brand industry:', brand.industry)

  // Cleanup - delete test brand
  console.log('\nCleaning up test brand...')
  await supabase.from('brands').delete().eq('id', brand.id)
  console.log('✅ Test brand deleted')
  console.log('\n🎉 All tests passed! Brand creation is now working.')
}

testFixedBrandCreation()
