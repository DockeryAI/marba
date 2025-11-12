import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const serviceClient = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function checkMirrorColumns() {
  console.log('\n🔍 Checking mirror_sections table schema...\n')

  // Query the table to see its columns (using service role key to bypass RLS)
  const { data, error } = await serviceClient
    .from('mirror_sections')
    .select('*')
    .limit(1)

  if (error) {
    console.log('❌ Error:', error.message)
    console.log('Error details:', error)
  } else {
    if (data.length > 0) {
      console.log('✅ Found existing row. Columns are:')
      console.log(Object.keys(data[0]))
    } else {
      console.log('⚠️ Table exists but is empty. Cannot determine columns from data.')
      console.log('Attempting to insert a minimal test row to discover required columns...')

      // Try inserting with just required fields
      const { data: testData, error: testError } = await serviceClient
        .from('mirror_sections')
        .insert({})
        .select()

      if (testError) {
        console.log('\nError from insert attempt:', testError.message)
        console.log('Details:', testError.details)
        console.log('Hint:', testError.hint)
      }
    }
  }
}

checkMirrorColumns()
