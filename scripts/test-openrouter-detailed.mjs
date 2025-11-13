#!/usr/bin/env node
/**
 * Detailed OpenRouter API test with debugging
 */

const OPENROUTER_API_KEY = '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';

console.log('🔑 OpenRouter API Detailed Test\n');
console.log('API Key length:', OPENROUTER_API_KEY.length);
console.log('API Key prefix:', OPENROUTER_API_KEY.substring(0, 15));
console.log('API Key suffix:', '...' + OPENROUTER_API_KEY.substring(OPENROUTER_API_KEY.length - 10));
console.log('');

async function testAPI() {
  const requestBody = {
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      { role: 'user', content: 'Say "Hello" in one word.' }
    ],
    max_tokens: 10,
    temperature: 0.3,
  };

  console.log('📡 Request Details:');
  console.log('URL: https://openrouter.ai/api/v1/chat/completions');
  console.log('Model:', requestBody.model);
  console.log('Headers:');
  console.log('  Authorization: Bearer', OPENROUTER_API_KEY.substring(0, 20) + '...');
  console.log('  Content-Type: application/json');
  console.log('');

  try {
    console.log('⏳ Sending request...\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://marba.app',
        'X-Title': 'MARBA Test',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response received:');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('');

    const responseText = await response.text();
    console.log('Raw response body:', responseText);
    console.log('');

    if (!response.ok) {
      console.error('❌ Request Failed');

      try {
        const errorData = JSON.parse(responseText);
        console.error('Error object:', JSON.stringify(errorData, null, 2));

        if (response.status === 401) {
          console.error('\n💡 Authentication Error - Possible causes:');
          console.error('   1. API key is invalid or expired');
          console.error('   2. API key not activated at openrouter.ai');
          console.error('   3. Account has no credits/payment method');
          console.error('   4. API key has been revoked');
          console.error('\n📝 Actions to try:');
          console.error('   - Visit https://openrouter.ai/keys');
          console.error('   - Check account status at https://openrouter.ai/account');
          console.error('   - Generate a new API key');
        }
      } catch (e) {
        console.error('Could not parse error response');
      }

      return;
    }

    const data = JSON.parse(responseText);
    console.log('✅ SUCCESS!');
    console.log('\nParsed response:');
    console.log(JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0]) {
      console.log('\n✅ AI Response:', data.choices[0].message.content);
    }

  } catch (error) {
    console.error('\n❌ Exception:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPI();
