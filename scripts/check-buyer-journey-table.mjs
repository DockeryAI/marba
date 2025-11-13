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

async function checkBuyerJourneyTable() {
  console.log('🔍 Checking buyer_journeys table status...\n');

  // Try to query the table
  const { data, error } = await supabase
    .from('buyer_journeys')
    .select('id')
    .limit(1);

  if (error) {
    console.log('❌ Table does NOT exist in database');
    console.log('Error:', error.message);
    console.log('\n⚠️  Migration file exists but has NOT been applied');
    console.log('Migration file: supabase/migrations/20251113000020_create_buyer_journey.sql');
    console.log('\nTo apply: Run migration via Supabase Dashboard or CLI');
    return false;
  } else {
    console.log('✅ Table EXISTS in database');
    console.log('Rows found:', data?.length || 0);
    return true;
  }
}

checkBuyerJourneyTable();
