#!/usr/bin/env node
/**
 * Test OpenRouter API authentication
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;

console.log('🔑 Testing OpenRouter API Authentication\n');
console.log('API Key:', OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 20)}...` : 'NOT SET');

if (!OPENROUTER_API_KEY) {
  console.error('❌ VITE_OPENROUTER_API_KEY is not set in .env file');
  process.exit(1);
}

async function testAuth() {
  try {
    console.log('\n📡 Sending test request to OpenRouter...\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://marba.app',
        'X-Title': 'MARBA Test',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'user', content: 'Say "Hello, MARBA!" in exactly three words.' }
        ],
        max_tokens: 50,
        temperature: 0.3,
      }),
    });

    console.log('Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('\n❌ API Request Failed');
      console.error('Status:', response.status);
      console.error('Error:', JSON.stringify(errorData, null, 2));

      if (response.status === 401) {
        console.error('\n💡 This is an authentication error. The API key may be:');
        console.error('   - Invalid or expired');
        console.error('   - Not activated on OpenRouter');
        console.error('   - Missing credits/payment method');
        console.error('\n📝 Visit https://openrouter.ai/keys to check your API key');
      }

      process.exit(1);
    }

    const data = await response.json();

    console.log('\n✅ Authentication Successful!');
    console.log('\nAPI Response:');
    console.log('Model:', data.model);
    console.log('Content:', data.choices[0].message.content);
    console.log('\nUsage:');
    console.log('  Prompt tokens:', data.usage?.prompt_tokens || 'N/A');
    console.log('  Completion tokens:', data.usage?.completion_tokens || 'N/A');
    console.log('  Total tokens:', data.usage?.total_tokens || 'N/A');

    console.log('\n✅ OpenRouter API is working correctly!');

  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    process.exit(1);
  }
}

testAuth();
