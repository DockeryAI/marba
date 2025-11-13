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
  console.log('✅ Found businesses:', data.data[0]?.length || 0)
  if (data.data[0]?.length > 0) {
    console.log('   Example:', data.data[0][0].name)
  }
} catch (error) {
  console.log('❌ Test 1 Failed:', error.message)
}

console.log('\n✅ OutScraper API test complete!')
console.log('\nNote: Full testing requires running the app and checking the Mirror diagnostics.')
