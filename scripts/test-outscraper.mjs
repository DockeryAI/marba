#!/usr/bin/env node
/**
 * Simple OutScraper API Test Script
 * Tests basic connectivity and response format
 */

const API_KEY = process.env.VITE_OUTSCRAPER_API_KEY || 'NGE3MWQ0ZjQ3MTUzNGJmY2I5ZjNmM2U2OGY2MTljOTB8YzE1OWJmZGVjNA'

console.log('🧪 Testing OutScraper API...\n')

// Test 1: Business Listings Search
console.log('📍 Test 1: Searching for Austin CPA firms...')
try {
  const response = await fetch('https://api.app.outscraper.com/maps/search-v3', {
    method: 'POST',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'CPA Austin TX',
      limit: 3,
      language: 'en',
      region: 'US',
    })
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()

  console.log('Response keys:', Object.keys(data))

  // OutScraper uses async processing - check if we need to poll for results
  if (data.status && data.id) {
    console.log(`⏳ Request queued with ID: ${data.id}`)
    console.log(`   Status: ${data.status}`)

    if (data.results_location) {
      console.log('   Results will be available at:', data.results_location)
      console.log('\n⚠️  OutScraper uses async processing.')
      console.log('   For real-time results, use the synchronous endpoint or poll the results_location.')
    }

    console.log('\n✅ API connection successful (async mode)')
  } else if (data.data) {
    // Direct response with data
    let businesses = []
    if (Array.isArray(data.data)) {
      businesses = data.data.flat()
    }

    console.log('✅ Found businesses:', businesses.length)
    if (businesses.length > 0) {
      console.log('   Example:', businesses[0]?.name || businesses[0]?.title || 'Name not found')
    }
  } else {
    console.log('⚠️  Unexpected response format:', JSON.stringify(data, null, 2))
  }
} catch (error) {
  console.log('❌ Test 1 Failed:', error.message)
}

console.log('\n✅ OutScraper API test complete!')
console.log('\nNote: Full testing requires running the app and checking the Mirror diagnostics.')
