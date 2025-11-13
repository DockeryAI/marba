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

const testBrandId = 'f2a18c4f-ade8-43f8-bff3-5832d3ced7aa'; // Existing brand from database

async function testCRUD() {
  console.log('🧪 Testing Buyer Journey Service CRUD Operations\n');

  // Test 1: Save a buyer journey
  console.log('1️⃣ Testing SAVE operation...');
  const journeyData = {
    icp: {
      demographics: {
        age_range: '35-55',
        income_range: '$75k-$150k',
        location: 'Dallas, TX',
        occupation: 'Business Owners & Executives'
      },
      psychographics: {
        values: ['Quality', 'Tradition', 'Community'],
        lifestyle: 'Upscale dining, social gatherings'
      }
    },
    jobs: {
      functional: 'Find a reliable place for business dinners',
      emotional: 'Feel confident impressing clients',
      social: 'Be known as someone with good taste'
    },
    stages: [
      {
        id: 'awareness',
        name: 'Awareness',
        touchpoints: ['Google Search', 'Word of Mouth']
      }
    ]
  };

  const { data: savedJourney, error: saveError } = await supabase
    .from('buyer_journeys')
    .insert({
      brand_id: testBrandId,
      journey_map: journeyData,
      is_complete: true,
      completed_steps: ['icp', 'jobs', 'stages']
    })
    .select()
    .single();

  if (saveError) {
    console.log('❌ SAVE failed:', saveError.message);
    return;
  }
  console.log('✅ SAVE successful, ID:', savedJourney.id);

  // Test 2: Load the buyer journey
  console.log('\n2️⃣ Testing LOAD operation...');
  const { data: loadedJourney, error: loadError } = await supabase
    .from('buyer_journeys')
    .select('*')
    .eq('brand_id', testBrandId)
    .single();

  if (loadError) {
    console.log('❌ LOAD failed:', loadError.message);
  } else {
    console.log('✅ LOAD successful');
    console.log('   - ICP age range:', loadedJourney.journey_map.icp?.demographics?.age_range);
    console.log('   - Is complete:', loadedJourney.is_complete);
  }

  // Test 3: Check completion
  console.log('\n3️⃣ Testing COMPLETION check...');
  const { data: completionCheck, error: completionError } = await supabase
    .from('buyer_journeys')
    .select('is_complete')
    .eq('brand_id', testBrandId)
    .single();

  if (completionError) {
    console.log('❌ COMPLETION check failed:', completionError.message);
  } else {
    console.log('✅ COMPLETION check successful:', completionCheck.is_complete ? 'COMPLETE' : 'INCOMPLETE');
  }

  // Test 4: Get ICP data
  console.log('\n4️⃣ Testing ICP data retrieval...');
  if (loadedJourney?.journey_map?.icp) {
    console.log('✅ ICP data retrieved:');
    console.log('   - Demographics:', JSON.stringify(loadedJourney.journey_map.icp.demographics, null, 2));
  } else {
    console.log('❌ ICP data not found');
  }

  // Test 5: Update journey
  console.log('\n5️⃣ Testing UPDATE operation...');
  const { data: updatedJourney, error: updateError } = await supabase
    .from('buyer_journeys')
    .update({
      journey_map: {
        ...journeyData,
        updated_test: true
      }
    })
    .eq('id', savedJourney.id)
    .select()
    .single();

  if (updateError) {
    console.log('❌ UPDATE failed:', updateError.message);
  } else {
    console.log('✅ UPDATE successful');
  }

  // Test 6: Delete journey (cleanup)
  console.log('\n6️⃣ Testing DELETE operation...');
  const { error: deleteError } = await supabase
    .from('buyer_journeys')
    .delete()
    .eq('id', savedJourney.id);

  if (deleteError) {
    console.log('❌ DELETE failed:', deleteError.message);
  } else {
    console.log('✅ DELETE successful');
  }

  console.log('\n🎉 All CRUD operations completed!\n');
}

testCRUD();
