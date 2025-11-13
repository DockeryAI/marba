#!/usr/bin/env node

/**
 * Execute SQL migrations directly using Supabase management API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

async function executeSql(sqlContent) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sqlContent });

    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ SQL executed successfully');
          resolve(responseData);
        } else {
          console.error(`❌ HTTP ${res.statusCode}: ${responseData}`);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function runMigrations() {
  const migrations = [
    '../supabase/migrations/20251112000003_create_uvp_tables.sql',
    '../supabase/migrations/20251112000004_create_brand_uvps.sql',
    '../supabase/migrations/20250112000003_add_wwh_fields.sql',
  ];

  console.log('🚀 Starting migrations...\n');

  for (const migrationPath of migrations) {
    const fullPath = path.join(__dirname, migrationPath);
    const sqlContent = fs.readFileSync(fullPath, 'utf-8');

    console.log(`📝 Running: ${path.basename(migrationPath)}`);

    try {
      await executeSql(sqlContent);
    } catch (error) {
      console.error(`❌ Failed to execute ${path.basename(migrationPath)}:`, error.message);
      // Continue with next migration even if this one fails (tables might already exist)
    }

    console.log('');
  }

  console.log('✅ Migration process completed!');
}

runMigrations().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
