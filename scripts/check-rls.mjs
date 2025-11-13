#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking table access and RLS...\n');

// Test with ANON key (what the browser uses)
const anonClient = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Test with Service Role key (bypasses RLS)
const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function testTable(tableName) {
  console.log(`\n📊 Testing table: ${tableName}`);
  console.log('─'.repeat(40));

  // Test with service role (bypasses RLS)
  try {
    const { data: serviceData, error: serviceError } = await serviceClient
      .from(tableName)
      .select('*')
      .limit(1);

    if (serviceError) {
      console.log(`❌ Service Role: Failed - ${serviceError.message}`);
    } else {
      console.log(`✅ Service Role: Success (${serviceData?.length || 0} rows)`);
    }
  } catch (err) {
    console.log(`❌ Service Role: Exception - ${err.message}`);
  }

  // Test with anon key (subject to RLS)
  try {
    const { data: anonData, error: anonError, status, statusText } = await anonClient
      .from(tableName)
      .select('*')
      .limit(1);

    if (anonError) {
      console.log(`❌ Anon Key: Failed (${status}) - ${anonError.message}`);
      if (status === 406) {
        console.log(`   💡 406 error typically means RLS is blocking access`);
      }
    } else {
      console.log(`✅ Anon Key: Success (${anonData?.length || 0} rows)`);
    }
  } catch (err) {
    console.log(`❌ Anon Key: Exception - ${err.message}`);
  }
}

// Test all problematic tables
const tables = [
  'value_statements',
  'uvp_components',
  'uvp_ab_tests',
  'brand_uvps',
  'mirror_intend_objectives',
  'marketing_strategies'
];

async function runTests() {
  for (const table of tables) {
    await testTable(table);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 Summary:');
  console.log('If Service Role works but Anon Key gets 406 errors,');
  console.log('it means RLS policies are blocking access.');
  console.log('The fix is to either:');
  console.log('1. Temporarily disable RLS on these tables');
  console.log('2. Fix the RLS policies to allow anon access');
}

runTests();