import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function checkBrandsColumns() {
  console.log('\n🔍 Checking brands table columns...\n')

  // Try to insert a minimal record to see what columns are required/accepted
  const { data, error } = await supabase
    .from('brands')
    .insert({
      name: 'test',
      website: 'test.com',
      industry: 'Test Industry',
      naics_code: '123456', // Testing if this column exists
      user_id: null
    })
    .select()

  if (error) {
    console.log('❌ Error:', error.message)
    console.log('Details:', error.details)
    console.log('Code:', error.code)

    if (error.message.includes('naics_code')) {
      console.log('\n⚠️  PROBLEM: naics_code column does not exist!')
      console.log('Need to add this column to the brands table.')
    }
  } else {
    console.log('✅ Success! All columns exist.')
    console.log('Columns used:', Object.keys(data[0]))
    // Clean up
    await supabase.from('brands').delete().eq('id', data[0].id)
  }
}

checkBrandsColumns()
