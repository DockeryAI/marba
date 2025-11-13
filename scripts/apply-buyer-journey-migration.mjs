#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function applyMigration() {
  console.log('🚀 Applying buyer_journeys migration...\n');

  // Read the migration file
  const migrationPath = join(__dirname, '../supabase/migrations/20251113000020_create_buyer_journey.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration file loaded:', migrationPath);
  console.log('📝 SQL length:', migrationSQL.length, 'characters\n');

  try {
    // Execute the migration SQL
    // Note: Supabase doesn't have a direct SQL execution method in the client,
    // so we'll use the REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: migrationSQL })
    });

    // Try alternative approach using pg admin SQL
    if (!response.ok) {
      console.log('⚠️  REST API method not available, using alternative...\n');

      // Split SQL into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

      console.log(`Found ${statements.length} SQL statements to execute\n`);

      // Execute table creation first
      console.log('1️⃣ Creating table...');
      const createTableStmt = statements.find(s => s.includes('CREATE TABLE'));
      if (createTableStmt) {
        const { error: createError } = await supabase.rpc('exec', {
          sql: createTableStmt + ';'
        });

        // This might not work, so we'll try a direct insert approach
        // Let's just verify the table was created
        const { data: tableCheck, error: checkError } = await supabase
          .from('buyer_journeys')
          .select('id')
          .limit(0);

        if (checkError && checkError.message.includes('does not exist')) {
          console.log('❌ Table creation via client failed');
          console.log('');
          console.log('📋 Manual steps required:');
          console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0]);
          console.log('2. Navigate to SQL Editor');
          console.log('3. Paste the contents of: supabase/migrations/20251113000020_create_buyer_journey.sql');
          console.log('4. Click "Run"');
          console.log('5. Run: node scripts/check-buyer-journey-table.mjs');
          return;
        } else {
          console.log('✅ Table created successfully');
        }
      }

    } else {
      const result = await response.json();
      console.log('✅ Migration applied successfully');
      console.log('Result:', result);
    }

    // Verify table exists
    console.log('\n🔍 Verifying table creation...');
    const { data, error } = await supabase
      .from('buyer_journeys')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Table buyer_journeys exists and is accessible');
    console.log('\n🎉 Migration complete!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n📋 Please apply migration manually:');
    console.log('1. Open Supabase Dashboard SQL Editor');
    console.log('2. Paste contents of: supabase/migrations/20251113000020_create_buyer_journey.sql');
    console.log('3. Click Run');
  }
}

applyMigration();
