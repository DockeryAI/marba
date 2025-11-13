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

async function checkTables() {
  console.log('🔍 Checking critical tables for integration...\n');

  const tables = [
    'brands',
    'mirror_diagnostics',
    'buyer_journeys',
    'brand_uvps'
  ];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .limit(1);

    if (error) {
      console.log(`❌ ${table}: NOT found (${error.message.split('.')[0]})`);
    } else {
      console.log(`✅ ${table}: EXISTS (${data?.length || 0} rows returned)`);
    }
  }

  console.log('\n📊 Checking for existing brands...');
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, name')
    .limit(3);

  if (!brandsError && brands?.length > 0) {
    console.log(`✅ Found ${brands.length} brand(s):`);
    brands.forEach(b => console.log(`   - ${b.name} (${b.id})`));
  } else {
    console.log('❌ No brands found or error accessing brands table');
  }
}

checkTables();
