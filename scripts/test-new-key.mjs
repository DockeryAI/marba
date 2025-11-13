#!/usr/bin/env node
/**
 * Test the new OpenRouter API key
 */

const NEW_KEY = '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';

console.log('🔑 Testing New OpenRouter API Key\n');
console.log('Key prefix:', NEW_KEY.substring(0, 20) + '...');
console.log('Key length:', NEW_KEY.length, 'chars\n');

async function testNewKey() {
  try {
    console.log('📡 Sending test request...\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEW_KEY}`,
        'HTTP-Referer': 'https://marba.app',
        'X-Title': 'MARBA',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'user', content: 'Say "Hello MARBA" in exactly 2 words.' }
        ],
        max_tokens: 10,
        temperature: 0.3,
      }),
    });

    console.log('Status:', response.status, response.statusText, '\n');

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Request Failed');
      console.error('Error:', JSON.stringify(errorData, null, 2));

      if (response.status === 401) {
        console.error('\n⚠️  New key is also invalid!');
      } else if (response.status === 402) {
        console.error('\n💳 Payment Required - Account needs credits');
      }

      return;
    }

    const data = await response.json();

    console.log('✅ SUCCESS! New API key is working!\n');
    console.log('Response:', data.choices[0].message.content);
    console.log('\nUsage:');
    console.log('  Model:', data.model);
    console.log('  Tokens:', data.usage?.total_tokens || 'N/A');

    console.log('\n🎉 OpenRouter API is now fully functional!');
    console.log('✅ All AI analysis features should work now.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testNewKey();
