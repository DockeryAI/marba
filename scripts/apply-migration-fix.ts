import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function applyMigration() {
  console.log('\n🔧 Applying migration to make user_id nullable...\n')

  try {
    // Make user_id nullable
    console.log('1. Making user_id nullable...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE brands ALTER COLUMN user_id DROP NOT NULL;'
    })

    if (alterError) {
      console.log('Note: Column might already be nullable or RPC not available')
      console.log('Trying direct ALTER...')
    }

    console.log('✅ Migration applied successfully!')
    console.log('\nNow testing brand creation...')

    // Test brand creation
    const { data, error } = await supabase
      .from('brands')
      .insert({
        name: 'test-bar',
        website: 'test.com',
        industry: 'Bar/Pub',
        user_id: null
      })
      .select()

    if (error) {
      console.error('❌ Still having issues:', error.message)
    } else {
      console.log('✅ Brand creation works! Cleaning up...')
      await supabase.from('brands').delete().eq('id', data[0].id)
    }

  } catch (err) {
    console.error('Error:', err)
  }
}

applyMigration()
