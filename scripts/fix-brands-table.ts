import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

async function fixBrandsTable() {
  console.log('\n🔧 Fixing brands table schema...\n')

  // The SQL we need to run
  const migrationSQL = `
-- Make user_id nullable to allow brands without authentication
ALTER TABLE brands ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow unauthenticated access for demo
DROP POLICY IF EXISTS "Users can insert their own brands" ON brands;
DROP POLICY IF EXISTS "Users can view their own brands" ON brands;
DROP POLICY IF EXISTS "Users can update their own brands" ON brands;
DROP POLICY IF EXISTS "Users can delete their own brands" ON brands;

-- Allow all access (temporary for demo - replace with proper auth later)
CREATE POLICY "Allow all access to brands (temp)"
  ON brands FOR ALL
  USING (true)
  WITH CHECK (true);
  `

  console.log('SQL to execute:')
  console.log(migrationSQL)
  console.log('\n' + '='.repeat(60))

  // Save to file for manual execution if needed
  const filename = 'fix-brands-table.sql'
  fs.writeFileSync(filename, migrationSQL)
  console.log(`\n✅ SQL saved to: ${filename}`)

  console.log('\n📋 To apply this migration:')
  console.log('1. Go to your Supabase Dashboard')
  console.log('2. Open SQL Editor')
  console.log('3. Paste the SQL from fix-brands-table.sql')
  console.log('4. Click "Run"')
  console.log('\nOR use the Supabase CLI:')
  console.log(`npx supabase db execute --file ${filename}`)

  // Test if we can create a brand now
  console.log('\n🧪 Testing brand creation (will likely fail until migration is run)...')
  const { data, error } = await supabase
    .from('brands')
    .insert({
      name: 'test-brand',
      website: 'test.com',
      industry: 'Test',
      user_id: null
    })
    .select()

  if (error) {
    console.log('❌ Still failing (expected):', error.message)
    console.log('\n👉 Please run the migration SQL above!')
  } else {
    console.log('✅ Success! Brand creation works!')
    // Clean up
    await supabase.from('brands').delete().eq('id', data[0].id)
  }
}

fixBrandsTable()
