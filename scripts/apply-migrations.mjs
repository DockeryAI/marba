#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSqlStatements(sql) {
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Executing ${statements.length} SQL statements...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Skip comments
    if (statement.trim().startsWith('--')) continue;

    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        // Check if it's a "already exists" error, which we can ignore
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Statement ${i + 1}: Already exists (skipping)`);
        } else {
          console.error(`❌ Statement ${i + 1} failed:`, error.message);
          errorCount++;
        }
      } else {
        console.log(`✅ Statement ${i + 1}: Success`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Statement ${i + 1} exception:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} failed\n`);
  return errorCount === 0;
}

async function runMigrations() {
  const migrations = [
    '../supabase/migrations/20251112000003_create_uvp_tables.sql',
    '../supabase/migrations/20251112000004_create_brand_uvps.sql',
  ];

  console.log('🚀 Starting migrations...\n');

  for (const migrationPath of migrations) {
    const fullPath = join(__dirname, migrationPath);
    console.log(`📂 Reading: ${migrationPath}`);

    const sql = readFileSync(fullPath, 'utf-8');
    console.log(`   Size: ${(sql.length / 1024).toFixed(2)} KB\n`);

    const success = await executeSqlStatements(sql);

    if (!success) {
      console.error(`❌ Migration ${migrationPath} had errors`);
    }

    console.log('─'.repeat(60));
  }

  console.log('\n✅ Migration process completed!');
}

runMigrations().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
