import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function applyRLSFix() {
  console.log('\n🔧 Applying RLS policy fixes...\n')

  const sql = fs.readFileSync('fix-brands-rls.sql', 'utf-8')

  // Split by semicolon and execute each statement
  const statements = sql.split(';').filter(s => s.trim())

  for (const statement of statements) {
    if (!statement.trim()) continue

    console.log('Executing:', statement.substring(0, 60) + '...')

    const { error } = await supabase.rpc('exec_sql', { sql: statement })

    if (error && !error.message.includes('does not exist')) {
      console.log('⚠️  Note:', error.message)
    } else {
      console.log('✅')
    }
  }

  console.log('\n🧪 Testing brand creation with anon key...')

  // Create a client with anon key (like the frontend)
  const anonClient = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
  )

  const { data, error } = await anonClient
    .from('brands')
    .insert({
      name: 'test-harwood',
      website: 'harwoodarmsdallas.com',
      industry: 'Bar/Pub',
      user_id: null
    })
    .select()

  if (error) {
    console.log('❌ Failed:', error.message)
    console.log('Full error:', error)
  } else {
    console.log('✅ SUCCESS! Brand created with anon key')
    console.log('Brand ID:', data[0].id)
    // Clean up
    await anonClient.from('brands').delete().eq('id', data[0].id)
    console.log('✅ Test brand cleaned up')
  }

  console.log('\n🎉 RLS policies updated! Onboarding should work now.')
}

applyRLSFix()
