# MIRROR 10X Enhancement - Implementation Guide
**Created:** 2025-11-12
**Status:** Ready to Execute
**Estimated Duration:** 7-8 weeks

---

## HOW TO USE THIS GUIDE

**For Any Claude Instance:**
1. Read `CURRENT_STATUS.md` first (understand what works/broken)
2. Read `MIRROR_10X_ENHANCEMENT_PLAN.md` (understand the vision)
3. **Start here** - Follow steps sequentially
4. Check TodoWrite for current progress
5. Mark task `in_progress` when starting
6. Complete ALL success criteria before marking `completed`
7. Any Claude can resume from any point

**Each Step Contains:**
- Status & Priority
- Dependencies
- Estimated Time
- Detailed Requirements
- Implementation Notes
- Success Criteria (checklist)
- File Locations

---

## PROGRESS TRACKING

Current: 0 of 29 steps completed

- [ ] Phase 1: Core Intelligence (Steps 1-4)
- [ ] Phase 2: Competitive Intel (Steps 5-9)
- [ ] Phase 3: Golden Circle & V4 (Steps 10-14)
- [ ] Phase 4: Synapse Scoring (Steps 15-16)
- [ ] Phase 5: Learning & Benchmarks (Steps 17-20)
- [ ] Phase 6: Section Integration (Steps 21-25)
- [ ] Phase 7: Testing & Completion (Steps 26-29)

---

# STEP 1: CREATE BRANDHEALTHCALCULATOR SERVICE

**Status:** Pending
**Priority:** CRITICAL
**Dependencies:** None
**Estimated Time:** 2-3 hours
**TodoWrite:** Task #1

## Requirements

Create `/src/services/mirror/brand-health-calculator.ts`

### 1.1 Four-Metric Scoring System

Implement scoring for:

**Clarity (0-100):**
- UVP clarity from Synapse analysis
- Message consistency across scraped website
- Jargon detection penalty (reduce score for: "synergy", "leverage", "paradigm", "utilize")
- Formula: `base_clarity - (jargon_count * 5) + consistency_bonus`

**Consistency (0-100):**
- Brand element alignment (colors, fonts, tone match)
- Message pillar coverage (how many pillars addressed)
- Cross-platform coherence
- Formula: `(element_alignment * 0.4) + (pillar_coverage * 0.3) + (cross_platform * 0.3)`

**Engagement Potential (0-100):**
- Psychology score from Synapse ContentPsychologyEngine
- Power word density (PowerWordOptimizer)
- Emotional trigger strength from industry profile
- Formula: `(psychology_score * 0.5) + (power_words * 0.3) + (emotional_triggers * 0.2)`

**Differentiation (0-100):**
- Competitive positioning gap analysis
- UVP uniqueness vs competitors
- Connection breakthrough potential
- Formula: `(positioning_gaps * 0.4) + (uvp_uniqueness * 0.4) + (breakthrough * 0.2)`

### 1.2 Overall Score Calculation

```typescript
Overall = (Clarity × 0.25) + (Consistency × 0.20) + (Engagement × 0.30) + (Differentiation × 0.25)
```

### 1.3 TypeScript Interface

```typescript
export interface BrandHealthScore {
  overall: number
  clarity: number
  consistency: number
  engagement: number
  differentiation: number
  breakdown: {
    clarity: {
      score: number
      factors: string[]
      suggestions: string[]
    }
    consistency: {
      score: number
      factors: string[]
      suggestions: string[]
    }
    engagement: {
      score: number
      factors: string[]
      recommendations: string[]
    }
    differentiation: {
      score: number
      gaps: string[]
      opportunities: string[]
    }
  }
  comparedToIndustry: {
    clarity: { yours: number; avg: number; top10: number }
    consistency: { yours: number; avg: number; top10: number }
    engagement: { yours: number; avg: number; top10: number }
    differentiation: { yours: number; avg: number; top10: number }
  }
}

export interface BrandHealthInput {
  websiteData: WebsiteData
  customization: CustomizedProfile
  industryProfile: IndustryProfile
  competitiveData?: any  // Optional for now, will add later
}
```

### 1.4 Main Method

```typescript
export class BrandHealthCalculator {
  static async calculate(input: BrandHealthInput): Promise<BrandHealthScore> {
    // Calculate each metric
    const clarity = await this.calculateClarity(input)
    const consistency = await this.calculateConsistency(input)
    const engagement = await this.calculateEngagement(input)
    const differentiation = await this.calculateDifferentiation(input)
    
    // Calculate overall
    const overall = Math.round(
      (clarity.score * 0.25) + 
      (consistency.score * 0.20) + 
      (engagement.score * 0.30) + 
      (differentiation.score * 0.25)
    )
    
    return {
      overall,
      clarity: clarity.score,
      consistency: consistency.score,
      engagement: engagement.score,
      differentiation: differentiation.score,
      breakdown: {
        clarity,
        consistency,
        engagement,
        differentiation
      },
      comparedToIndustry: this.getIndustryComparison(input.industryProfile, {
        clarity: clarity.score,
        consistency: consistency.score,
        engagement: engagement.score,
        differentiation: differentiation.score
      })
    }
  }
  
  private static async calculateClarity(input: BrandHealthInput): Promise<any> {
    // Implementation here
  }
  
  // ... other private methods
}
```

## Implementation Notes

- Import Synapse ContentPsychologyEngine for engagement scoring
- Import PowerWordOptimizer for power word analysis
- Use industry benchmark data for comparison
- Include detailed explanations in suggestions
- Handle missing data gracefully (fallback to 50)
- Log calculation details for debugging

## Success Criteria

- [ ] Service file created at correct path
- [ ] All 4 metrics calculate correctly
- [ ] Overall formula matches spec (weighted average)
- [ ] Returns detailed breakdown with suggestions
- [ ] No hardcoded values except formula weights
- [ ] TypeScript interfaces properly defined
- [ ] Handles missing data gracefully
- [ ] Includes industry benchmark comparison
- [ ] All methods have JSDoc comments
- [ ] No TypeScript errors

---

# STEP 2: INTEGRATE BRANDHEALTHCALCULATOR

**Status:** Pending
**Priority:** CRITICAL
**Dependencies:** Step 1
**Estimated Time:** 1-2 hours
**TodoWrite:** Task #2

## Requirements

Modify `/src/services/industryService.ts`

### 2.1 Remove Hardcoded Value

Find and delete:
```typescript
// Line 91 (approximately)
brandHealth: 75, // Default starting score ← DELETE THIS LINE
```

### 2.2 Import Calculator

Add at top of file:
```typescript
import { BrandHealthCalculator, type BrandHealthScore } from './mirror/brand-health-calculator'
```

### 2.3 Call Calculator in generateMeasureSection

Replace line 91 with:
```typescript
// Calculate real brand health
let brandHealthScore: BrandHealthScore
try {
  brandHealthScore = await BrandHealthCalculator.calculate({
    websiteData,
    customization,
    industryProfile: profile,
    competitiveData: null  // Will add in later step
  })
} catch (error) {
  console.error('[generateMeasureSection] Brand health calculation failed:', error)
  // Fallback to 50 if calculation fails
  brandHealthScore = {
    overall: 50,
    clarity: 50,
    consistency: 50,
    engagement: 50,
    differentiation: 50,
    breakdown: {
      clarity: { score: 50, factors: [], suggestions: ['Calculation failed, using default'] },
      consistency: { score: 50, factors: [], suggestions: [] },
      engagement: { score: 50, factors: [], recommendations: [] },
      differentiation: { score: 50, gaps: [], opportunities: [] }
    },
    comparedToIndustry: {
      clarity: { yours: 50, avg: 45, top10: 70 },
      consistency: { yours: 50, avg: 45, top10: 70 },
      engagement: { yours: 50, avg: 45, top10: 70 },
      differentiation: { yours: 50, avg: 45, top10: 70 }
    }
  }
}
```

### 2.4 Store in Return Object

Update return object to include:
```typescript
return {
  industry: profile.title,
  brandHealth: brandHealthScore.overall,  // Overall score
  brandHealthBreakdown: brandHealthScore.breakdown,  // Detailed breakdown
  brandHealthComparison: brandHealthScore.comparedToIndustry,  // Industry comparison
  // ... rest of existing properties
}
```

### 2.5 Update Function Signature

Change `generateMeasureSection` from sync to async:
```typescript
// BEFORE:
function generateMeasureSection(brandName: string, profile: IndustryProfile, fullProfile: any, websiteData?: any)

// AFTER:
async function generateMeasureSection(brandName: string, profile: IndustryProfile, fullProfile: any, websiteData?: any, customization?: any)
```

### 2.6 Update Caller

In `generateMirrorSectionsFromIndustry`, await the call:
```typescript
// BEFORE:
measure: generateMeasureSection(brandName, industryProfile, enrichedProfile, websiteData),

// AFTER:
measure: await generateMeasureSection(brandName, industryProfile, enrichedProfile, websiteData, customization),
```

And make parent function async:
```typescript
// BEFORE:
export function generateMirrorSectionsFromIndustry(...)

// AFTER:
export async function generateMirrorSectionsFromIndustry(...)
```

### 2.7 Update createBrandWithIndustryData

Await the MIRROR generation:
```typescript
// BEFORE:
const mirrorSections = generateMirrorSectionsFromIndustry(...)

// AFTER:
const mirrorSections = await generateMirrorSectionsFromIndustry(...)
```

## Implementation Notes

- Verify no TypeScript errors after making async
- Test with real website data from onboarding
- Log calculation results for debugging
- Fallback to 50 is intentional (not 72) to be obvious when failing
- Keep all existing measure section properties

## Success Criteria

- [ ] Hardcoded `brandHealth: 75` removed
- [ ] BrandHealthCalculator imported
- [ ] Calculator called with correct params
- [ ] Error handling in place (try/catch)
- [ ] Fallback to 50 if calculation fails
- [ ] Breakdown data stored in return object
- [ ] Industry comparison stored
- [ ] Function signature updated to async
- [ ] Parent functions updated to async
- [ ] All callers updated to await
- [ ] No TypeScript errors
- [ ] Test with brand creation works

---

# STEP 3: CREATE SEMRUSH INTEGRATION

**Status:** Pending
**Priority:** HIGH
**Dependencies:** None (SEMrush service exists)
**Estimated Time:** 1-2 hours
**TodoWrite:** Task #3

## Requirements

Enhance `/src/services/intelligence/semrush-api.ts`

### 3.1 Verify Existing Implementation

Current file has:
- `getDomainOverview(domain)` method
- Mock data fallback
- Basic error handling

### 3.2 Add Better Error Handling

```typescript
async getDomainOverview(domain: string): Promise<DomainOverview> {
  if (!SEMRUSH_API_KEY) {
    console.warn('[Semrush API] No API key found, using mock data')
    return this.getMockData(domain)
  }

  let lastError: Error | null = null
  
  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const url = `https://api.semrush.com/?type=domain_ranks&key=${SEMRUSH_API_KEY}&export_columns=Ot,Oc,Or,Ad,At&domain=${domain}&database=us`
      
      console.log(`[Semrush API] Attempt ${attempt}/3 for domain: ${domain}`)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const text = await response.text()
      console.log('[Semrush API] Response received:', text.substring(0, 100))
      
      const [header, data] = text.split('\n')
      if (!data) {
        throw new Error('Invalid response format')
      }
      
      const [traffic, keywords, cost, ads, backlinks] = data.split(';')
      
      return {
        domain,
        organic_keywords: parseInt(keywords) || 0,
        organic_traffic: parseInt(traffic) || 0,
        paid_keywords: parseInt(ads) || 0,
        backlinks: parseInt(backlinks) || 0,
        authority_score: Math.min(100, Math.round((parseInt(backlinks) || 0) / 100)),
        competitors: [],  // Will populate in later step
        domain_rank: 0,   // Will calculate in later step
        cached_at: new Date().toISOString()
      }
    } catch (error) {
      lastError = error as Error
      console.error(`[Semrush API] Attempt ${attempt}/3 failed:`, error)
      
      if (attempt < 3) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
  
  console.error('[Semrush API] All attempts failed, using mock data')
  return this.getMockData(domain)
}
```

### 3.3 Add Caching

```typescript
private static readonly CACHE_KEY_PREFIX = 'semrush_domain_'
private static readonly CACHE_TTL_MS = 24 * 60 * 60 * 1000  // 24 hours

async getDomainOverview(domain: string): Promise<DomainOverview> {
  // Check cache first
  const cached = this.getFromCache(domain)
  if (cached) {
    console.log('[Semrush API] Using cached data for:', domain)
    return cached
  }
  
  // ... existing API call logic ...
  
  // Cache the result
  this.saveToCache(domain, result)
  
  return result
}

private getFromCache(domain: string): DomainOverview | null {
  try {
    const key = `${BrandHealthCalculator.CACHE_KEY_PREFIX}${domain}`
    const cached = localStorage.getItem(key)
    
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    const age = Date.now() - timestamp
    
    if (age > this.CACHE_TTL_MS) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch (error) {
    console.error('[Semrush API] Cache read error:', error)
    return null
  }
}

private saveToCache(domain: string, data: DomainOverview): void {
  try {
    const key = `${this.CACHE_KEY_PREFIX}${domain}`
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('[Semrush API] Cache write error:', error)
  }
}
```

### 3.4 Add getMockData Method

```typescript
private getMockData(domain: string): DomainOverview {
  return {
    domain,
    organic_keywords: 1250,
    organic_traffic: 25000,
    paid_keywords: 45,
    backlinks: 3420,
    authority_score: 58,
    competitors: [],
    domain_rank: 4,
    cached_at: new Date().toISOString()
  }
}
```

### 3.5 Update Interface

```typescript
export interface DomainOverview {
  domain: string
  organic_keywords: number
  organic_traffic: number
  paid_keywords: number
  backlinks: number
  authority_score: number
  competitors?: string[]  // NEW
  domain_rank?: number    // NEW
  cached_at: string       // NEW
}
```

## Implementation Notes

- Keep existing mock data for development
- Real API only called if `VITE_SEMRUSH_API_KEY` is set
- Cache prevents excessive API calls
- Exponential backoff for retries
- Detailed logging for debugging

## Success Criteria

- [ ] API key checked before calling
- [ ] Retry logic with 3 attempts
- [ ] Exponential backoff implemented
- [ ] Caching added (24-hour TTL)
- [ ] Cache uses localStorage
- [ ] getMockData method added
- [ ] Interface updated with new fields
- [ ] Detailed logging throughout
- [ ] Error handling robust
- [ ] No TypeScript errors


---

# STEPS 4-29: CONTINUATION

**Note:** Steps 4-29 follow the same detailed format as Steps 1-3 above.

Each step includes:
- Status, Priority, Dependencies, Time Estimate
- Detailed Requirements section
- Implementation Notes
- Complete Success Criteria checklist
- Exact file locations and code snippets

**For the complete 29-step guide, refer to:**
- **TodoWrite Task List:** See all 29 tasks with descriptions
- **MIRROR_10X_ENHANCEMENT_PLAN.md:** See full vision for each phase

**Steps 4-29 Summary:**

**Step 4:** Build SEOHealthCard component  
**Step 5:** Create KeywordOpportunityService  
**Step 6:** Build KeywordOpportunities component with Synapse  
**Step 7:** Create CompetitorDiscoveryService  
**Step 8:** Build CompetitiveDashboard component  
**Step 9:** Create ContentGapAnalyzer service  
**Step 10:** Build GoldenCircle visual component  
**Step 11:** Create GoldenCircleEditor with Synapse  
**Step 12:** Build CustomerTriggerGallery component  
**Step 13:** Create ArchetypeVoiceAlignment component  
**Step 14:** Build BrandStoryBuilder component  
**Step 15:** Create SynapseLiveScoring component  
**Step 16:** Integrate SynapseLiveScoring into editors  
**Step 17:** Build OpportunityDashboard component  
**Step 18:** Create ConnectionDiscovery showcase  
**Step 19:** Build LearningEngineWidget  
**Step 20:** Create BenchmarkComparison utility  
**Step 21:** Update MeasureSection integration  
**Step 22:** Update IntendSection integration  
**Step 23:** Update ReimagineSection integration  
**Step 24:** Update OptimizeSection integration  
**Step 25:** Update ReflectSection integration  
**Step 26:** Test all API integrations  
**Step 27:** Perform gap analysis  
**Step 28:** Create overview documentation  
**Step 29:** Commit all changes  

---

## WORKING WITH THIS GUIDE

### Starting a New Step

1. Check TodoWrite - find first `pending` task
2. Mark it `in_progress`
3. Read the step requirements in this guide (or use the pattern from Steps 1-3)
4. Follow success criteria exactly
5. Mark `completed` only when ALL checkboxes ✅
6. Move to next task

### If You're Step 4-29

Follow the same pattern as Steps 1-3:
- Create detailed requirements section
- Include code snippets and examples
- List all files to create/modify
- Provide implementation notes
- Define clear success criteria
- Test thoroughly before marking complete

### When Stuck

- Check existing implementations in codebase
- Look at similar components for patterns
- Review MIRROR_REDESIGN_PLAN.md for original vision
- Ask user for clarification
- Don't guess - requirements must be exact

---

## FINAL NOTES

This implementation transforms MIRROR from generic to intelligent. Every step builds on the previous, and any Claude can resume at any point by checking TodoWrite and following this guide.

**Quality over speed:** Complete each step fully before moving on.

**Document as you go:** Update this guide if you find better approaches.

**Test everything:** User experience is paramount.

Good luck! 🚀
