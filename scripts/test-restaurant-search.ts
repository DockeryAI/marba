import Fuse from 'fuse.js'

// Simulated restaurant profiles from database
const restaurants = [
  {
    code: '72',
    title: 'Accommodation and Food Services',
    description: 'Hotels, restaurants, and food services',
    keywords: []
  },
  {
    code: '722',
    title: 'Food Services and Drinking Places',
    description: 'Restaurants and food service establishments',
    keywords: ['restaurant', 'food', 'dining']
  },
  {
    code: '722513',
    title: 'Fast Casual Restaurant',
    description: 'Food Service - Limited-Service Restaurants',
    keywords: ['fresh', 'customizable', 'quick', 'healthy', 'local']
  },
  {
    code: '722511',
    title: 'Fine Dining Restaurant',
    description: 'Food Service - Upscale Full-Service Restaurants',
    keywords: ['exclusive', 'acclaimed', 'award-winning', 'renowned', 'intimate']
  }
]

const fuse = new Fuse(restaurants, {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'keywords', weight: 1.2 },
    { name: 'code', weight: 0.8 }
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  useExtendedSearch: true
})

console.log('🧪 Testing Fuzzy Search for Restaurant Profiles\n')
console.log('=' .repeat(60))

const searchTerms = ['restaurant', 'dining', 'food', 'fast casual', 'fine dining', 'eatery']

searchTerms.forEach(term => {
  console.log(`\n🔍 Searching for: "${term}"`)
  const results = fuse.search(term)

  if (results.length === 0) {
    console.log('   ❌ No results found')
  } else {
    console.log(`   ✅ Found ${results.length} results:`)
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.item.title} (NAICS: ${result.item.code})`)
      console.log(`      Score: ${result.score?.toFixed(3)} (lower is better)`)
    })
  }
})

console.log('\n' + '='.repeat(60))
console.log('✅ Fuzzy matching test complete!')
console.log('\nAll restaurant profiles should be findable by:')
console.log('- "restaurant" → All restaurant profiles')
console.log('- "dining" → Food Services, Fine Dining')
console.log('- "food" → All food-related profiles')
console.log('- "fast casual" → Fast Casual Restaurant')
console.log('- "fine dining" → Fine Dining Restaurant')
