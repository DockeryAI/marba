#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkRLSStatus() {
  console.log('🔍 Checking RLS status on tables...\n');

  const { data, error } = await supabase.rpc('run_sql', {
    sql: `
      SELECT
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN (
        'value_statements',
        'uvp_components',
        'uvp_ab_tests',
        'brand_uvps',
        'mirror_intend_objectives',
        'marketing_strategies'
      )
      ORDER BY tablename;
    `
  }).single();

  if (error) {
    // Try alternate method
    console.log('Cannot check via SQL, testing table access instead...\n');

    const tables = [
      'value_statements',
      'uvp_components',
      'uvp_ab_tests',
      'brand_uvps',
      'mirror_intend_objectives',
      'marketing_strategies'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      console.log(`${table}: ${error ? '❌ Error' : '✅ Accessible'}`);
    }
  } else {
    console.log(data);
  }
}

checkRLSStatus();