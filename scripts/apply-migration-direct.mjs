#!/usr/bin/env node

/**
 * Apply migration by directly executing SQL via Supabase REST API
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

async function executeSQL(sql) {
  // Extract the project ref from URL
  const projectRef = supabaseUrl.split('//')[1].split('.')[0];

  console.log('🔧 Using Supabase Management API...');
  console.log('Project:', projectRef);

  // Try to execute via Management API
  const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

  const response = await fetch(managementUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed: ${response.status} - ${text}`);
  }

  return await response.json();
}

async function applyMigration() {
  console.log('🚀 Applying buyer_journeys migration...\n');

  const migrationPath = join(__dirname, '../supabase/migrations/20251113000020_create_buyer_journey.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  console.log('📄 Migration SQL loaded\n');

  try {
    // Try the Management API
    const result = await executeSQL(migrationSQL);
    console.log('✅ Migration applied via Management API');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Management API failed:', error.message);
    console.log('\n📋 Manual migration required:');
    console.log('\n1. Open Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0]);
    console.log('\n2. Navigate to: SQL Editor');
    console.log('\n3. Create new query and paste this file content:');
    console.log('   supabase/migrations/20251113000020_create_buyer_journey.sql');
    console.log('\n4. Click "Run" button');
    console.log('\n5. Verify with: node scripts/check-buyer-journey-table.mjs\n');
  }
}

applyMigration();
