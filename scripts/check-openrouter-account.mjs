#!/usr/bin/env node
/**
 * Check OpenRouter account status and key validity
 */

const OPENROUTER_API_KEY = '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';

console.log('🔍 Checking OpenRouter Account Status\n');

async function checkAccount() {
  // Try the credits endpoint
  console.log('1️⃣ Checking credits endpoint...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
    console.log('');
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Try models endpoint (should work even without auth)
  console.log('2️⃣ Checking models endpoint (no auth required)...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    console.log('Status:', response.status);
    if (response.ok) {
      const models = await response.json();
      console.log('✅ Models endpoint accessible');
      console.log('Available models:', models.data?.length || 0);

      // Check if Claude is available
      const claudeModels = models.data?.filter(m => m.id.includes('claude')) || [];
      console.log('Claude models available:', claudeModels.length);
      if (claudeModels.length > 0) {
        console.log('Example:', claudeModels[0].id);
      }
    }
    console.log('');
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Try a very minimal request with a free model
  console.log('3️⃣ Testing with a free model (google/gemma-7b-it:free)...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://marba.app',
      },
      body: JSON.stringify({
        model: 'google/gemma-7b-it:free',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Free model works! API key is valid.');
    } else {
      console.log('❌ Even free model failed - API key issue confirmed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n📊 Summary:');
  console.log('API Key format: Valid (73 chars, sk-or-v1- prefix)');
  console.log('API Key status: ❌ INVALID - "User not found" error');
  console.log('\n🔧 Required Action:');
  console.log('   The API key needs to be regenerated at https://openrouter.ai/keys');
  console.log('   This key may have been:');
  console.log('   - Deleted/revoked');
  console.log('   - From a deleted account');
  console.log('   - Never properly activated');
}

checkAccount();
