# MARBA MIRROR Psychology Enhancement - Implementation Log

**Started**: 2025-11-11
**Goal**: Add 15 missing psychology fields from old Brandock MIRROR to all 147 industry profiles

---

## PHASE 1: UPDATE OPUS GENERATION SCRIPT

### Task 1.1: Add 15 New Psychology Fields to Opus Prompt
- [x] Add Section 8: Psychological Frameworks (15 fields)
  - [x] Fields 41-43: Golden Circle (why, how, what)
  - [x] Fields 44-46: Brand Archetypes (primary, secondary, characteristics)
  - [x] Fields 47-48: Emotional Triggers (triggers array, journey map)
  - [x] Fields 49-50: Psychological Hooks (Cialdini principles, sequences)
  - [x] Fields 51-52: Customer Avatars (avatars array, priority ranking)
  - [x] Fields 53-55: Brand Story (template, origin, narrative arc)
- [x] Update prompt instructions to require 55 fields total
- [x] Update field count references in prompt

### Task 1.2: Update Validation Function
- [ ] Add all 15 new field names to required array
- [ ] Verify validation checks all 55 fields
- [ ] Test validation with sample profile

### Task 1.3: Update Schema Mapping Function
- [ ] Add new psychology fields to mapOpusToMarbaSchema
- [ ] Store psychology fields in full_profile_data JSONB
- [ ] Ensure all 55 fields mapped correctly

**Status**: Not Started
**File**: `/Users/byronhudson/Projects/MARBA/scripts/opus-generation/auto-generate-missing.ts`

---

## PHASE 2: WIRE UP 8 APIS TO INTELLIGENCE SERVICES

### Task 2.1: Create Weather API Service (OpenWeather)
- [ ] Create `/src/services/intelligence/weather-api.ts`
- [ ] Implement getCurrentWeather(location)
- [ ] Implement get5DayForecast(location)
- [ ] Implement detectWeatherOpportunities(brand, location, industry)
- [ ] Add caching layer (30min TTL)
- [ ] Test with real API calls

### Task 2.2: Create News API Service
- [ ] Create `/src/services/intelligence/news-api.ts`
- [ ] Implement getIndustryNews(industry, keywords)
- [ ] Implement getLocalNews(location)
- [ ] Implement detectNewsOpportunities(brand)
- [ ] Add caching layer (1hr TTL)
- [ ] Test with real API calls

### Task 2.3: Create YouTube Trends API Service
- [ ] Create `/src/services/intelligence/youtube-api.ts`
- [ ] Implement getTrendingVideos(category, region)
- [ ] Implement searchVideos(keywords)
- [ ] Implement analyzeVideoTrends(industry)
- [ ] Add caching layer (1hr TTL)
- [ ] Test with real API calls

### Task 2.4: Create Semrush API Service
- [ ] Create `/src/services/intelligence/semrush-api.ts`
- [ ] Implement getDomainOverview(domain)
- [ ] Implement getKeywordDifficulty(keywords)
- [ ] Implement getCompetitorKeywords(domain)
- [ ] Implement getBacklinkAnalysis(domain)
- [ ] Add caching layer (24hr TTL)
- [ ] Test with real API calls

### Task 2.5: Create Serper API Service (Google Search)
- [ ] Create `/src/services/intelligence/serper-api.ts`
- [ ] Implement searchGoogle(query)
- [ ] Implement getTrendingSearches()
- [ ] Implement getRelatedQueries(keyword)
- [ ] Add caching layer (1hr TTL)
- [ ] Test with real API calls

### Task 2.6: Create OutScraper API Service
- [ ] Create `/src/services/intelligence/outscraper-api.ts`
- [ ] Implement scrapeGoogleReviews(businessId)
- [ ] Implement scrapeCompetitorData(url)
- [ ] Implement getBusinessListings(location, category)
- [ ] Add caching layer (24hr TTL)
- [ ] Test with real API calls

### Task 2.7: Create Apify API Service
- [ ] Create `/src/services/intelligence/apify-api.ts`
- [ ] Implement scrapeWebsite(url, selectors)
- [ ] Implement scrapeInstagram(handle)
- [ ] Implement scrapeFacebook(pageId)
- [ ] Add caching layer (6hr TTL)
- [ ] Test with real API calls

### Task 2.8: Wire OpenAI API to Content Generation
- [ ] Update `/src/services/intelligence/content-generator.ts`
- [ ] Implement generateHeadline(prompt, psychology)
- [ ] Implement generateCaption(prompt, tone, length)
- [ ] Implement improveCopyWithAI(text, goal)
- [ ] Add caching layer for repeated prompts
- [ ] Test with real API calls

**Status**: Not Started
**Files**: `/Users/byronhudson/Projects/MARBA/src/services/intelligence/*.ts`

---

## PHASE 3: UPDATE MIRROR GENERATION SERVICE

### Task 3.1: Update generateMeasureSection
- [ ] Add emotional_triggers to customer insights
- [ ] Add customer_avatars to audience analysis
- [ ] Add emotional_journey_map to customer experience
- [ ] Add weather_opportunities from Weather API
- [ ] Add trending_topics from Serper/YouTube APIs
- [ ] Add industry_news from News API
- [ ] Add competitor_intelligence from Semrush/OutScraper/Apify
- [ ] Add new insights for emotional patterns

### Task 3.2: Update generateIntendSection
- [ ] Add Golden Circle 'why' to strategic direction
- [ ] Add persona_priority_ranking to target setting
- [ ] Update goals to include emotional value from avatars
- [ ] Add opportunity-based goal suggestions

### Task 3.3: Update generateReimagineSection
- [ ] Add Golden Circle (why/how/what) to brand strategy
- [ ] Add brand archetypes to personality section
- [ ] Add archetype_characteristics to voice guidelines
- [ ] Add brand_story_template to narrative section
- [ ] Add origin_story_elements to brand history
- [ ] Add AI-generated content suggestions from OpenAI

### Task 3.4: Update generateReachSection
- [ ] Add psychological_hooks to messaging tactics
- [ ] Add persuasion_sequences to campaign frameworks
- [ ] Link hooks to existing headlines/CTAs
- [ ] Add AI-optimized headlines from OpenAI
- [ ] Add search insights from Serper
- [ ] Add trending content angles from YouTube

### Task 3.5: Update generateOptimizeSection
- [ ] Add persona_priority_ranking to resource allocation
- [ ] Add narrative_arc to content planning
- [ ] Add competitive positioning from Semrush
- [ ] Add keyword opportunities from Semrush

### Task 3.6: Update generateReflectSection
- [ ] Add emotional journey KPIs
- [ ] Add archetype alignment metrics
- [ ] Add psychological hook effectiveness tracking
- [ ] Add API data refresh indicators
- [ ] Add intelligence summary

**Status**: Not Started
**File**: `/Users/byronhudson/Projects/MARBA/src/services/industryService.ts`

---

## PHASE 3: UPDATE UI COMPONENTS

### Task 3.1: Update MeasureSection.tsx
- [ ] Add Emotional Triggers panel
- [ ] Add Customer Avatars panel
- [ ] Add Emotional Journey Map visualization
- [ ] Style and layout new sections

### Task 3.2: Update IntendSection.tsx
- [ ] Add Golden Circle WHY section
- [ ] Add Persona Priority visualization
- [ ] Update goals display with emotional context

### Task 3.3: Update ReimagineSection.tsx
- [ ] Add Golden Circle (Why/How/What) display
- [ ] Add Brand Archetype cards
- [ ] Add Archetype Characteristics panel
- [ ] Add Brand Story Framework section
- [ ] Add Origin Story section
- [ ] Update layout for new content

### Task 3.4: Update ReachSection.tsx
- [ ] Add Psychological Hooks panel
- [ ] Add Persuasion Sequences section
- [ ] Link hooks to tactics display

### Task 3.5: Update OptimizeSection.tsx
- [ ] Add Persona Prioritization matrix
- [ ] Add Narrative Arc timeline

### Task 3.6: Update ReflectSection.tsx
- [ ] Add Emotional Journey KPIs
- [ ] Add Archetype Alignment metrics

**Status**: Not Started
**Files**: `/Users/byronhudson/Projects/MARBA/src/pages/mirror/*.tsx`

---

## PHASE 4: GENERATE PROFILES

### Task 4.1: Run Opus Generation
- [ ] Clear old generation log
- [ ] Start generation for 54 missing profiles
- [ ] Monitor progress (27 batches × 10 seconds = ~5 minutes)
- [ ] Verify no errors

### Task 4.2: Verify Profile Data
- [ ] Check all 54 profiles have has_full_profile=true
- [ ] Spot-check 3 profiles have all 55 fields
- [ ] Verify psychology fields have quality data

**Status**: Not Started

---

## PHASE 5: END-TO-END TESTING

### Task 5.1: Test Brand Creation Flow
- [ ] Go to onboarding page
- [ ] Search for industry (e.g., "restaurant")
- [ ] Enter domain (e.g., "test-restaurant.com")
- [ ] Verify brand created successfully
- [ ] Verify 6 MIRROR sections created
- [ ] Verify navigation to MIRROR page works

### Task 5.2: Test All MIRROR Sections
- [ ] MEASURE: Verify emotional triggers, avatars, journey map display
- [ ] INTEND: Verify Golden Circle why, persona priorities display
- [ ] REIMAGINE: Verify complete Golden Circle, archetypes, brand story display
- [ ] REACH: Verify psychological hooks, persuasion sequences display
- [ ] OPTIMIZE: Verify persona matrix, narrative arc display
- [ ] REFLECT: Verify emotional KPIs display

### Task 5.3: Test Multiple Industries
- [ ] Test with construction industry
- [ ] Test with healthcare industry
- [ ] Test with retail industry
- [ ] Verify all show unique, relevant psychology data

**Status**: Not Started

---

## PHASE 6: GAP ANALYSIS

### Task 6.1: Compare to Original Build Plan
- [ ] Review `/Users/byronhudson/Projects/MARBA/docs/build-plan.md`
- [ ] Check all MIRROR features implemented
- [ ] Check all API integrations documented
- [ ] Identify any missing features

### Task 6.2: Complete Missing Features
- [ ] (To be determined based on gap analysis)

### Task 6.3: Final Validation
- [ ] All 147 profiles have 55 fields
- [ ] All 6 MIRROR sections render correctly
- [ ] No console errors
- [ ] All data flows work end-to-end

**Status**: Not Started

---

## COMPLETION CHECKLIST

- [ ] Phase 1: Opus script updated (55 fields)
- [ ] Phase 2: MIRROR generation updated (6 sections)
- [ ] Phase 3: UI components updated (6 pages)
- [ ] Phase 4: All 147 profiles generated
- [ ] Phase 5: End-to-end testing passed
- [ ] Phase 6: Gap analysis complete
- [ ] READY FOR USER TESTING

---

## NOTES & ISSUES

(Will be updated as work progresses)
