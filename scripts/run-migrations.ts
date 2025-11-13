/**
 * Run database migrations script
 * Executes SQL migrations directly against Supabase database
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration(filePath: string) {
  console.log(`Running migration: ${filePath}`)

  try {
    const sql = readFileSync(filePath, 'utf-8')

    // Execute SQL using Supabase RPC
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      console.error(`Error running migration ${filePath}:`, error)
      throw error
    }

    console.log(`✅ Successfully ran migration: ${filePath}`)
  } catch (error) {
    console.error(`❌ Failed to run migration ${filePath}:`, error)
    throw error
  }
}

async function main() {
  const migrations = [
    join(__dirname, '../supabase/migrations/20251112000003_create_uvp_tables.sql'),
    join(__dirname, '../supabase/migrations/20251112000004_create_brand_uvps.sql'),
    join(__dirname, '../supabase/migrations/20250112000003_add_wwh_fields.sql'),
  ]

  console.log('Starting migrations...\n')

  for (const migration of migrations) {
    try {
      await runMigration(migration)
    } catch (error) {
      console.error('Migration failed, stopping...')
      process.exit(1)
    }
  }

  console.log('\n✅ All migrations completed successfully!')
}

main()
