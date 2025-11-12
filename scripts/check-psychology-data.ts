/**
 * Check if industry profiles have psychology data
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function checkPsychologyData() {
  // Check Bar/Pub profile (722410)
  const { data, error } = await supabase
    .from('industry_profiles')
    .select('naics_code, title, has_full_profile, full_profile_data')
    .eq('naics_code', '722410')
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return
  }

  console.log('\n=== BAR/PUB INDUSTRY PROFILE (722410) ===\n')
  console.log('Industry:', data.title)
  console.log('Has Full Profile:', data.has_full_profile)
  console.log('\n--- Psychology Fields ---')

  const profile = data.full_profile_data || {}

  console.log('✓ why (Golden Circle):', profile.why ? `YES (${profile.why.length} chars)` : 'NO')
  console.log('✓ how (Golden Circle):', profile.how ? `YES (${profile.how.length} chars)` : 'NO')
  console.log('✓ what (Golden Circle):', profile.what ? `YES (${profile.what.length} chars)` : 'NO')
  console.log('✓ primary_archetype:', profile.primary_archetype || 'NO')
  console.log('✓ secondary_archetype:', profile.secondary_archetype || 'NO')
  console.log('✓ emotional_triggers:', profile.emotional_triggers ? `YES (${profile.emotional_triggers.length} items)` : 'NO')
  console.log('✓ emotional_journey_map:', profile.emotional_journey_map ? 'YES' : 'NO')
  console.log('✓ psychological_hooks:', profile.psychological_hooks ? `YES (${profile.psychological_hooks.length} items)` : 'NO')
  console.log('✓ persuasion_sequences:', profile.persuasion_sequences ? `YES (${profile.persuasion_sequences.length} items)` : 'NO')
  console.log('✓ customer_avatars:', profile.customer_avatars ? `YES (${profile.customer_avatars.length} items)` : 'NO')
  console.log('✓ persona_priority_ranking:', profile.persona_priority_ranking ? `YES (${profile.persona_priority_ranking.length} items)` : 'NO')
  console.log('✓ brand_story_template:', profile.brand_story_template ? 'YES' : 'NO')
  console.log('✓ origin_story_elements:', profile.origin_story_elements ? 'YES' : 'NO')
  console.log('✓ narrative_arc:', profile.narrative_arc ? 'YES' : 'NO')

  console.log('\n--- Old Fields (Should Exist) ---')
  console.log('✓ value_propositions:', profile.value_propositions ? `YES (${profile.value_propositions.length} items)` : 'NO')
  console.log('✓ customer_triggers:', profile.customer_triggers ? `YES (${profile.customer_triggers.length} items)` : 'NO')
  console.log('✓ transformations:', profile.transformations ? `YES (${profile.transformations.length} items)` : 'NO')

  console.log('\n=== DIAGNOSIS ===')
  const hasPsychology = !!(profile.why || profile.primary_archetype || profile.emotional_triggers)
  if (hasPsychology) {
    console.log('✅ Profile HAS psychology data - should work!')
  } else {
    console.log('❌ Profile MISSING psychology data - showing dummy data')
    console.log('   → This profile needs to be regenerated with Opus')
    console.log('   → Wait for Opus generation to complete')
  }
}

checkPsychologyData()
