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

async function testTables() {
  console.log('🧪 Testing UVP tables...\n');

  const tables = ['value_statements', 'uvp_components', 'uvp_ab_tests', 'brand_uvps'];

  for (const table of tables) {
    try {
      const { data, error, status, statusText } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${status} ${statusText}`);
        console.log(`   Error:`, error);
      } else {
        console.log(`✅ ${table}: Working (${data?.length || 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Exception -`, err.message);
    }
  }
}

testTables();
