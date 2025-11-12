import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function checkBrandsSchema() {
  console.log('\n🔍 Checking brands table schema...\n')

  // Try to query with select all to see what columns exist
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Error querying brands:', error)
  } else {
    console.log('✅ Sample brand record:')
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]))
      console.log('\nSample data:', data[0])
    } else {
      console.log('No brands in database yet')
    }
  }

  // Also try a minimal insert to see what's required
  console.log('\n🧪 Testing minimal brand insert...')
  const { data: testBrand, error: insertError } = await supabase
    .from('brands')
    .insert({
      name: 'test-brand'
    })
    .select()

  if (insertError) {
    console.error('❌ Insert error:', insertError.message)
    console.error('Details:', insertError.details)
  } else {
    console.log('✅ Test brand created:', testBrand)
    // Clean up
    if (testBrand && testBrand.length > 0) {
      await supabase.from('brands').delete().eq('id', testBrand[0].id)
      console.log('✅ Test brand deleted')
    }
  }
}

checkBrandsSchema()
