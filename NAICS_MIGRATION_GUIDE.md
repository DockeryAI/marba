# NAICS Profiles Migration Guide
## Copying Industry Profiles from Brandock to MARBA

**Date:** 2025-11-11
**Status:** Ready for migration
**Source:** Brandock Supabase Project
**Destination:** MARBA Supabase Project

---

## Overview

MARBA uses NAICS codes (North American Industry Classification System) for industry classification. The brandock project has fully populated industry profiles that need to be migrated to the MARBA Supabase database.

---

## Prerequisites

1. Access to both Supabase projects:
   - Brandock Supabase project URL and credentials
   - MARBA Supabase project URL and credentials
2. Supabase CLI installed: `npm install -g supabase`
3. PostgreSQL client (psql) or Supabase Studio access

---

## Step 1: Export Industry Profiles from Brandock

### Option A: Using Supabase Studio (Recommended)

1. Log into Brandock Supabase project at: https://supabase.com/dashboard
2. Navigate to **Table Editor** → **industry_profiles** table
3. Click **Export** → **Export as SQL**
4. Save as `brandock_industry_profiles.sql`

### Option B: Using psql Command Line

```bash
# Connect to Brandock Supabase
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Export industry profiles
\copy (SELECT * FROM industry_profiles WHERE has_full_profile = true) TO 'brandock_industry_profiles.csv' WITH CSV HEADER;
```

### Option C: Using Supabase API

```bash
# Export via REST API
curl -X GET 'https://[BRANDOCK_PROJECT_REF].supabase.co/rest/v1/industry_profiles?has_full_profile=eq.true' \
  -H "apikey: [BRANDOCK_ANON_KEY]" \
  -H "Authorization: Bearer [BRANDOCK_ANON_KEY]" \
  > brandock_industry_profiles.json
```

---

## Step 2: Verify Export

Check what you exported:

```bash
# Count records in CSV
wc -l brandock_industry_profiles.csv

# Or check JSON
jq length brandock_industry_profiles.json
```

**Expected:** ~400 fully populated industry profiles

---

## Step 3: Prepare MARBA Database

Ensure the `industry_profiles` table exists in MARBA:

```sql
-- Connect to MARBA Supabase
-- This table should already exist from migrations

CREATE TABLE IF NOT EXISTS industry_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naics_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL,
  parent_code TEXT,
  is_standard BOOLEAN DEFAULT true,
  keywords TEXT[],
  has_full_profile BOOLEAN DEFAULT false,

  -- Full profile data
  industry_overview TEXT,
  market_size TEXT,
  growth_rate TEXT,
  key_trends TEXT[],
  customer_segments TEXT[],
  pain_points TEXT[],
  common_objections TEXT[],
  success_metrics TEXT[],
  regulatory_considerations TEXT[],
  seasonal_factors TEXT[],
  competitive_landscape TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_industry_profiles_naics ON industry_profiles(naics_code);
CREATE INDEX IF NOT EXISTS idx_industry_profiles_full ON industry_profiles(has_full_profile) WHERE has_full_profile = true;
```

---

## Step 4: Import to MARBA

### Option A: Using Supabase Studio

1. Log into MARBA Supabase project
2. Navigate to **SQL Editor**
3. Paste the exported SQL from Step 1
4. Click **Run**

### Option B: Using psql

```bash
# Connect to MARBA Supabase
psql "postgresql://postgres:[MARBA_PASSWORD]@db.[MARBA_PROJECT_REF].supabase.co:5432/postgres"

# Import from SQL file
\i brandock_industry_profiles.sql

# Or from CSV
\copy industry_profiles FROM 'brandock_industry_profiles.csv' WITH CSV HEADER;
```

### Option C: Using Node.js Script

```typescript
// migrate-naics.ts
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const brandockClient = createClient(
  'https://[BRANDOCK_REF].supabase.co',
  '[BRANDOCK_ANON_KEY]'
)

const marbaClient = createClient(
  'https://[MARBA_REF].supabase.co',
  '[MARBA_ANON_KEY]'
)

async function migrateProfiles() {
  console.log('Fetching profiles from Brandock...')
  const { data, error } = await brandockClient
    .from('industry_profiles')
    .select('*')
    .eq('has_full_profile', true)

  if (error) throw error

  console.log(`Found ${data.length} profiles to migrate`)

  console.log('Importing to MARBA...')
  const { error: importError } = await marbaClient
    .from('industry_profiles')
    .upsert(data, { onConflict: 'naics_code' })

  if (importError) throw importError

  console.log('✅ Migration complete!')
}

migrateProfiles().catch(console.error)
```

Run with:
```bash
npx ts-node migrate-naics.ts
```

---

## Step 5: Verify Import

```sql
-- Connect to MARBA Supabase

-- Count total profiles
SELECT COUNT(*) FROM industry_profiles;

-- Count fully populated profiles
SELECT COUNT(*) FROM industry_profiles WHERE has_full_profile = true;

-- Check sample profiles
SELECT naics_code, title, has_full_profile
FROM industry_profiles
WHERE has_full_profile = true
LIMIT 10;

-- Verify specific codes exist
SELECT naics_code, title
FROM industry_profiles
WHERE naics_code IN ('541618', '541611', '541690', '722513', '236220')
ORDER BY naics_code;
```

**Expected Results:**
- Total profiles: ~400-1000
- Fully populated: ~400
- All major industries represented

---

## Step 6: Update MARBA Frontend

The MARBA frontend is already configured to use these profiles:

**File:** `src/data/naics-codes.ts`
- Contains the NAICS code structure
- Used by OnboardingPage for industry selection

**No code changes needed** - the profiles will be fetched from Supabase automatically once migration is complete.

---

## Step 7: Test Onboarding Flow

1. Start MARBA dev server: `npm run dev`
2. Navigate to `/onboarding`
3. Enter a domain: `example.com`
4. Search for an industry: type "restaurant" or "software"
5. Verify industries appear in dropdown
6. Select an industry
7. Verify analysis starts (will show error until Edge Functions are deployed)

---

## Troubleshooting

### Issue: Duplicate NAICS codes

```sql
-- Check for duplicates in export
SELECT naics_code, COUNT(*)
FROM industry_profiles
GROUP BY naics_code
HAVING COUNT(*) > 1;

-- Remove duplicates before import
DELETE FROM industry_profiles a USING industry_profiles b
WHERE a.id > b.id AND a.naics_code = b.naics_code;
```

### Issue: Missing columns

If MARBA's schema differs from Brandock:

```sql
-- Add missing columns
ALTER TABLE industry_profiles ADD COLUMN IF NOT EXISTS column_name TEXT;

-- Drop extra columns
ALTER TABLE industry_profiles DROP COLUMN IF EXISTS old_column_name;
```

### Issue: Permission errors

Ensure RLS policies allow inserts:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'industry_profiles';

-- Add policy if needed (temporary for migration)
ALTER TABLE industry_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable after migration
ALTER TABLE industry_profiles ENABLE ROW LEVEL SECURITY;
```

---

## Alternative: Seeding Script

If direct migration is not possible, use a seeding script:

```sql
-- seed-industries.sql
-- This would contain INSERT statements for all 400 profiles
-- Generated from Brandock export

INSERT INTO industry_profiles (naics_code, title, description, ...) VALUES
  ('541618', 'Other Management Consulting Services', '...', ...),
  ('541611', 'Administrative Management Consulting', '...', ...),
  -- ... 398 more rows
ON CONFLICT (naics_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();
```

---

## Data Structure

Each industry profile includes:

**Basic Info:**
- `naics_code`: "541618"
- `title`: "Other Management Consulting Services"
- `description`: "Management consulting not classified elsewhere"
- `level`: 6 (2=sector, 3=subsector, 4=industry, 6=detailed)
- `keywords`: ["consulting", "management", "strategy"]

**Full Profile Data (when has_full_profile = true):**
- `industry_overview`: Detailed industry description
- `market_size`: "$X billion" or growth metrics
- `key_trends`: Array of current industry trends
- `customer_segments`: Array of typical customer types
- `pain_points`: Array of common challenges
- `common_objections`: Array of objections businesses face
- `success_metrics`: Array of KPIs for industry
- `regulatory_considerations`: Compliance requirements
- `seasonal_factors`: Seasonal business patterns
- `competitive_landscape`: Competitive dynamics

---

## Post-Migration Checklist

- [ ] All ~400 profiles imported successfully
- [ ] Verified with SQL COUNT queries
- [ ] Tested onboarding page industry search
- [ ] Verified fuzzy matching works
- [ ] No duplicate NAICS codes
- [ ] RLS policies re-enabled
- [ ] Backup created of MARBA database

---

## Next Steps After Migration

1. **Deploy Edge Functions** to use these profiles:
   - `analyze-domain` function needs industry profiles
   - `detect-opportunities` function uses industry data
   - `generate-content` function leverages industry insights

2. **Test Domain Analysis:**
   ```bash
   curl -X POST https://[MARBA_REF].supabase.co/functions/v1/analyze-domain \
     -H "Authorization: Bearer [MARBA_ANON_KEY]" \
     -H "Content-Type: application/json" \
     -d '{"domain": "example.com", "naics_code": "541618"}'
   ```

3. **Verify MIRROR Population:**
   - Complete onboarding flow
   - Check that MIRROR sections populate with industry data
   - Verify recommendations are industry-specific

---

## Contact & Support

If you encounter issues during migration:
1. Check Supabase logs in Dashboard → Logs
2. Verify connection strings are correct
3. Ensure you have admin access to both projects
4. Check that export/import file formats match

---

**Migration Owner:** Byron Hudson
**Last Updated:** 2025-11-11
**Status:** Ready to execute
