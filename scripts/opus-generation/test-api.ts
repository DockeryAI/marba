import * as dotenv from 'dotenv'

dotenv.config()

const openrouterKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY

console.log('Testing OpenRouter API...')
console.log('API Key found:', openrouterKey ? `${openrouterKey.substring(0, 15)}...` : 'MISSING')

async function testAPI() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    console.log('\nSending test request...')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://marba.com',
        'X-Title': 'MARBA Test'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-opus-4.1',
        messages: [
          {
            role: 'user',
            content: 'Say "API connection successful!" and nothing else.'
          }
        ],
        max_tokens: 50
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    console.log('Response status:', response.status)
    console.log('Response OK:', response.ok)

    const data = await response.json()

    if (!response.ok) {
      console.error('\n❌ API Error:', JSON.stringify(data, null, 2))
      return
    }

    console.log('\n✅ API Test Successful!')
    console.log('Response:', data.choices[0].message.content)

  } catch (error) {
    console.error('\n❌ Connection Error:', error instanceof Error ? error.message : error)
  }
}

testAPI()
