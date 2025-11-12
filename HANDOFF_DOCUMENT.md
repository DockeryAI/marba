# MARBA System - Comprehensive Handoff Document
**Date:** November 12, 2025
**Context Continuation:** Session 3
**Current Status:** Website analysis not implemented - using generic industry data only

---

## 🚨 CRITICAL ISSUE TO FIX NEXT

### **Website Analysis Is NOT Happening**

**Problem:** The onboarding flow creates brands using generic industry profile data WITHOUT analyzing the actual website.

**Current Flow (BROKEN):**
```
User enters domain (e.g., tregdfw.com)
  ↓
System looks up industry (Residential Real Estate)
  ↓
Gets GENERIC industry profile from database
  ↓
Creates brand with generic data
  ↓
Redirects to MIRROR page with dummy data
```

**Expected Flow (NOT IMPLEMENTED):**
```
User enters domain (e.g., tregdfw.com)
  ↓
System SCRAPES the website
  ↓
Extracts: content, colors, fonts, meta tags, page structure
  ↓
AI analyzes website content against industry profile
  ↓
Customizes psychology data for THIS specific brand
  ↓
Creates brand with REAL, customized data
  ↓
Shows MIRROR page with actual brand analysis
```

**File to Fix:** `/src/services/industryService.ts` - `createBrandWithIndustryData()` function (lines 369-427)

**What Needs to Be Added:**
1. Website scraping service (fetch HTML, parse content)
2. Website metadata extraction (colors, fonts, logo, content sections)
3. AI customization layer (use Claude to analyze website + customize industry profile)
4. Real brand data merging (combine generic psychology + specific website analysis)

---

## 📊 System Architecture Overview

### **Technology Stack**
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL with JSONB)
- **AI:** Anthropic Claude (Opus for generation, Sonnet for analysis)
- **State:** React Context API (BrandContext, MirrorContext)
- **Routing:** React Router v6
- **Dev Server:** Running on `http://localhost:3001`

### **Core Concepts**

**1. MIRROR Framework** (Marketing Intelligence System)
- **M**easure: Current brand health, market position, competitive landscape
- **I**ntend: Goals, objectives, targets (using SMART framework)
- **R**eigmagine: Brand strategy, audience personas, content strategy
- **R**each: Tactical plans, channel strategies, campaigns
- **O**ptimize: Action boards, timelines, prioritization
- **R**eflect: KPIs, analytics, performance insights

**2. Industry Profiles** (475k+ words across 147 NAICS codes)
Each profile contains ~40-55 psychology fields:
- Golden Circle (Why/How/What - Simon Sinek framework)
- Brand Archetypes (12 Jungian archetypes with sub-archetypes)
- Emotional Triggers (10-15 psychology-backed triggers per industry)
- Psychological Hooks (Cialdini's 6 principles of persuasion)
- Customer Avatars (3-5 detailed personas with pain points, desires, fears)
- Brand Story Elements (origin story, narrative arc, transformation journey)
- UVPs (5+ unique value propositions with differentiators)
- Power Words (industry-specific vocabulary that resonates)
- Competitive Advantages (what drives success in this industry)
- Market Position Data (key trends, opportunities, threats)

**3. Data Flow**
```
Industry Profiles (database)
  ↓
MIRROR Sections (generated from profile)
  ↓
Brand Record + mirror_sections table (JSONB storage)
  ↓
MirrorContext (loads sections for active brand)
  ↓
MIRROR Components (display real psychology data)
```

---

## 🗂️ Database Schema

### **Key Tables**

#### `brands`
```sql
id: uuid (primary key)
user_id: uuid (nullable - auth not implemented yet)
name: text (domain name, e.g., "tregdfw.com")
website: text (same as name for now)
industry: text (e.g., "Residential Real Estate")
created_at: timestamp
```

#### `industry_profiles`
```sql
id: uuid
naics_code: text (e.g., "531210")
title: text (e.g., "Residential Real Estate")
full_profile_data: jsonb (40-55 psychology fields)
created_at: timestamp
```

#### `mirror_sections`
```sql
id: uuid
brand_id: uuid (foreign key → brands.id)
section: text (one of: measure, intend, reimagine, reach, optimize, reflect)
data: jsonb (all section data stored here)
created_at: timestamp
updated_at: timestamp
```

**IMPORTANT:** Each brand has 6 rows in `mirror_sections` (one per MIRROR section)

### **Missing Tables (Expected to Cause 404s)**
These tables don't exist yet - errors are handled gracefully:
- `tactical_plans` (used by ReachSection)
- `marketing_strategies` (used by ReimagineSection)
- `mirror_objectives` (used by IntendSection)
- `mirror_intend_objectives` (used by GoalProgressTracker)
- `synapse_analysis_cache` (caching for AI analysis)

---

## 📁 Critical File Locations

### **Services Layer**

#### `/src/services/industryService.ts`
**Purpose:** Manages industry profiles and brand creation
**Key Functions:**
- `getIndustryProfile(naicsCode)` - Fetches industry profile from database
- `createBrandWithIndustryData(domain, naicsCode)` - **BROKEN - needs website analysis**
- `generateMirrorSectionsFromIndustry(domain, industryProfile)` - Generates 6 MIRROR sections

**Lines 369-427: createBrandWithIndustryData()**
```typescript
export async function createBrandWithIndustryData(
  domain: string,
  naicsCode: string,
  userId?: string
): Promise<{ brand: any; mirrorSections: MirrorSections } | null> {
  try {
    // Get industry profile
    const industryProfile = await getIndustryProfile(naicsCode)

    // ❌ MISSING: Website scraping goes here!
    // ❌ MISSING: Content extraction goes here!
    // ❌ MISSING: AI customization goes here!

    // Create brand
    const { data: brand } = await supabase
      .from('brands')
      .insert({
        name: domain,
        website: domain,
        industry: industryProfile.title,
        user_id: userId || null
      })
      .select()
      .single()

    // Generate MIRROR sections (using GENERIC industry data)
    const mirrorSections = generateMirrorSectionsFromIndustry(domain, industryProfile)

    // Store MIRROR sections
    await Promise.all(Object.entries(mirrorSections).map(([section, sectionData]) =>
      supabase
        .from('mirror_sections')
        .insert({
          brand_id: brand.id,
          section: section,
          data: sectionData
        })
    ))

    return { brand, mirrorSections }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
```

#### `/src/services/mirror/`
Contains MIRROR framework logic:
- `situation-analyzer.ts` - Analyzes brand health, market position
- `objectives-generator.ts` - Generates SMART goals
- `strategy-builder.ts` - Builds brand/audience/content/competitive strategy
- `tactics-planner.ts` - Creates tactical execution plans

### **Context Layer**

#### `/src/contexts/BrandContext.tsx`
**Purpose:** Manages current brand state across app
**Key State:**
- `currentBrand` - Active brand object
- `setCurrentBrand()` - Updates active brand

#### `/src/contexts/MirrorContext.tsx`
**Purpose:** Manages MIRROR section data and persistence
**Key Functions:**
- `loadFromServer(brandId)` - **FIXED in last session** - Now actually loads from database
- `updateMeasure/Intend/Reimagine/etc()` - Updates section data
- `saveToServer()` - Persists changes (debounced auto-save)

**Lines 177-220: loadFromServer()** (Recently fixed)
```typescript
const loadFromServer = React.useCallback(async (loadBrandId: string) => {
  try {
    setLoading(true)

    // Load MIRROR sections from Supabase
    const { data: sections } = await supabase
      .from('mirror_sections')
      .select('section, data')
      .eq('brand_id', loadBrandId)

    if (sections && sections.length > 0) {
      // Transform array into state object
      const loadedState: Partial<MirrorState> = {}
      sections.forEach(s => {
        if (s.section && s.data) {
          loadedState[s.section as keyof MirrorState] = s.data
        }
      })

      setState(prev => ({
        ...initialState,
        ...loadedState,
        lastSaved: new Date().toISOString(),
        isDirty: false
      }))
    }
  } catch (err) {
    console.error('Failed to load MIRROR data:', err)
  } finally {
    setLoading(false)
  }
}, [])
```

### **Component Layer**

#### `/src/pages/OnboardingPage.tsx`
**Purpose:** Brand onboarding flow
**Current Flow:**
1. User enters domain (e.g., "tregdfw.com")
2. User selects industry
3. System calls `createBrandWithIndustryData()` ← **NO WEBSITE ANALYSIS**
4. Redirects to `/mirror`

**Lines 152-187: handleAnalyze()** - Where website analysis SHOULD happen
```typescript
const handleAnalyze = async () => {
  setIsAnalyzing(true)
  setError(null)

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')

    // ❌ MISSING: const websiteData = await scrapeWebsite(cleanDomain)
    // ❌ MISSING: const analysis = await analyzeWebsite(websiteData, industryProfile)

    // Creates brand with GENERIC industry data only
    const result = await createBrandWithIndustryData(cleanDomain, selectedIndustry.code)

    setCurrentBrand(result.brand)
    navigate('/mirror')
  } catch (err) {
    setError(err.message)
  }
}
```

#### `/src/pages/MirrorPage.tsx`
**Purpose:** Main MIRROR framework interface
**Recently Fixed:** Now passes loaded section data to components instead of basic brand info

**Lines 187-211: Component Data Passing** (Recently fixed)
```typescript
<MeasureSection
  brandId={brandId}
  brandData={state.measure}  // ✅ FIXED - was brandData (basic info)
  onDataUpdate={updateMeasure}
/>

<ReimagineSection
  brandId={brandId}
  brandData={state.reimagine}  // ✅ FIXED - was brandData
  objectives={objectives}
  situationAnalysis={measureData}
  competitors={brandData?.competitors || []}
/>
```

#### `/src/components/mirror/measure/MeasureSection.tsx`
**Purpose:** Displays current brand situation analysis
**Recently Fixed:** Now uses real competitive advantages and assets instead of hardcoded dummy data

**Lines 41-68: Real Data Usage** (Recently fixed)
```typescript
// ✅ FIXED - was hardcoded "Competitor A", "Competitor B", "Competitor C"
const competitiveAdvantages = brandData?.competitiveLandscape?.advantages || []
const differentiators = competitiveAdvantages.slice(0, 5)
const gaps = brandData?.assets?.weaknesses || []
const competitors = []  // No competitor data in DB yet

// ✅ FIXED - now includes real SWOT data
const assets = {
  colors: ['#2563eb', '#7c3aed', '#059669', '#f59e0b'],
  fonts: ['Inter', 'Roboto', 'Open Sans'],
  messagingThemes: marketPosition.keyTrends?.slice(0, 4) || [],
  opportunities: realAssets.opportunities || [],
  threats: realAssets.threats || [],
  strengths: realAssets.strengths || [],
  weaknesses: realAssets.weaknesses || [],
}
```

#### `/src/components/mirror/reimagine/BrandStrategy.tsx`
**Purpose:** Brand positioning and messaging strategy
**Recently Fixed:** Now loads existing strategy from database first instead of always regenerating

**Lines 32-42: Load vs Generate Logic** (Recently fixed)
```typescript
// ✅ FIXED - was always regenerating, overwriting loaded data
React.useEffect(() => {
  if (brandData?.brandStrategy) {
    // Use loaded data from database
    setPositioning(brandData.brandStrategy.positioning_statement || '')
    setPillars(brandData.brandStrategy.message_pillars || [])
  } else if (brandData && objectives.length > 0) {
    // Only generate if no data exists
    generateRecommendedStrategy()
  }
}, [brandData, objectives])
```

#### `/src/components/layouts/MirrorLayout.tsx`
**Purpose:** Navigation sidebar for MIRROR sections
**Recently Fixed:** First letter of each section is now blue to highlight MIRROR acronym

**Lines 64-68: Styled Navigation** (Recently fixed)
```typescript
{!sidebarCollapsed && (
  <span className="truncate">
    <span className="text-blue-600 font-semibold">{section.label[0]}</span>
    {section.label.slice(1)}
  </span>
)}
```

---

## 🔧 Recent Session Work (What Was Fixed)

### **Session 2 Recap (Before This Session)**
Completed Phases 1-3:
1. ✅ Enhanced Opus script to generate 40-55 field industry profiles
2. ✅ Created API services for MIRROR framework
3. ✅ Updated MIRROR service layer with psychology integration

But encountered:
- Runtime crashes
- Dummy data showing instead of real industry data
- Database loading not working

### **Session 3 (Current Session) - Fixes Applied**

#### **Fix 1: objectives-generator.ts Runtime Crash**
**File:** `/src/services/mirror/objectives-generator.ts:82`
**Error:** `TypeError: Cannot read properties of undefined (reading 'toLowerCase')`
**Fix:** Added null check for `industry` parameter
```typescript
// Before:
if (industry.toLowerCase().includes('b2b')

// After:
if (industry && (industry.toLowerCase().includes('b2b')
```

#### **Fix 2: MirrorContext loadFromServer() Was Mock**
**File:** `/src/contexts/MirrorContext.tsx:177-220`
**Problem:** Function was just a TODO comment, never actually loaded from database
**Fix:** Implemented actual Supabase query to load mirror_sections

#### **Fix 3: MirrorProvider Not Receiving brandId**
**File:** `/src/contexts/MirrorContext.tsx:94-107`
**Problem:** MirrorProvider wasn't getting brandId from BrandContext
**Fix:** Added `useBrand()` hook to automatically pull brandId
```typescript
const { currentBrand } = useBrand()
const brandId = brandIdProp || currentBrand?.id
```

#### **Fix 4: MirrorPage Passing Wrong Data**
**File:** `/src/pages/MirrorPage.tsx:187-211`
**Problem:** Passing basic brand info instead of loaded MIRROR section data
**Fix:** Changed to pass `state.measure` and `state.reimagine` instead of `brandData`

#### **Fix 5: MeasureSection Using Dummy Data**
**File:** `/src/components/mirror/measure/MeasureSection.tsx:41-68`
**Problem:** Hardcoded "Competitor A/B/C" and generic gaps
**Fix:** Use real competitive advantages and SWOT data from industry profile

#### **Fix 6: BrandStrategy Overwriting Loaded Data**
**File:** `/src/components/mirror/reimagine/BrandStrategy.tsx:32-42`
**Problem:** Component was regenerating strategy on every mount, overwriting database data
**Fix:** Check for existing data first, only generate if missing

#### **Fix 7: Navigation Styling**
**File:** `/src/components/layouts/MirrorLayout.tsx:64-68`
**Enhancement:** Made first letter of each MIRROR section blue to highlight acronym

### **Verification**
Console logs confirm real data is now loading:
```
[MeasureSection] advantages: [
  'Only brokerage with in-house mortgage company offering exclusive rate discounts',
  'Proprietary buyer matching algorithm reducing showing-to-offer ratio by 43%',
  'Guaranteed backup offer program maintaining multiple interested parties',
  ...
]
```

---

## 🚧 Known Issues & Limitations

### **Critical Issues**

1. **❌ NO WEBSITE ANALYSIS** (Top priority to fix)
   - System creates brands using generic industry data only
   - Does not scrape actual website
   - Does not extract real colors, fonts, content
   - Does not customize psychology data for specific brand

2. **❌ Missing Database Tables**
   - `tactical_plans` - Tactical execution plans
   - `marketing_strategies` - Strategy definitions
   - `mirror_objectives` - Goals and objectives
   - `mirror_intend_objectives` - Sub-objectives
   - `synapse_analysis_cache` - AI analysis caching

   **Note:** These 404 errors are non-blocking and handled gracefully with console.log

3. **❌ No Authentication**
   - `user_id` is nullable in brands table
   - No login/signup flow
   - Anyone can create brands

### **Non-Critical Issues**

4. **Multiple GoTrueClient Instances**
   - Supabase warning about multiple auth clients
   - Not causing functional issues
   - Could be optimized

5. **GoalProgressTracker UUID Error**
   - Trying to query with ID "obj-1" (string) instead of UUID
   - Error: `invalid input syntax for type uuid: "obj-1"`
   - Needs proper UUID generation for objectives

---

## 🎯 Next Steps (Priority Order)

### **1. IMPLEMENT WEBSITE ANALYSIS (CRITICAL)**

**Goal:** Actually scrape and analyze websites to provide real brand data

**Steps:**

#### A. Create Website Scraping Service
**File:** `/src/services/scraping/websiteScraper.ts`

```typescript
export interface WebsiteData {
  url: string
  html: string
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
  content: {
    headings: string[]
    paragraphs: string[]
    navigation: string[]
  }
  design: {
    colors: string[]  // Extract from CSS
    fonts: string[]   // Extract from computed styles
    logo?: string     // Extract logo URL
  }
  structure: {
    pages: string[]
    sections: string[]
  }
}

export async function scrapeWebsite(domain: string): Promise<WebsiteData> {
  // 1. Fetch HTML using fetch() or axios
  // 2. Parse with cheerio or similar
  // 3. Extract metadata, content, design elements
  // 4. Return structured data
}
```

**Implementation Notes:**
- Use `fetch()` to get HTML (built-in, no dependencies)
- Use `cheerio` for parsing (lightweight jQuery-like syntax)
- Extract colors from inline styles, stylesheets
- Extract fonts from computed styles
- Handle CORS issues (may need server-side proxy)

#### B. Create AI Customization Service
**File:** `/src/services/ai/websiteAnalyzer.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

export async function customizeIndustryProfile(
  websiteData: WebsiteData,
  genericProfile: IndustryProfile
): Promise<CustomizedProfile> {
  // 1. Send website content + generic profile to Claude
  // 2. Ask Claude to customize psychology fields based on actual brand
  // 3. Return customized profile with real brand voice, positioning, etc.

  const anthropic = new Anthropic({
    apiKey: process.env.VITE_ANTHROPIC_API_KEY,
  })

  const prompt = `
  Analyze this website and customize the industry profile for this specific brand:

  Website: ${websiteData.url}
  Content: ${JSON.stringify(websiteData.content)}
  Design: ${JSON.stringify(websiteData.design)}

  Generic Industry Profile:
  ${JSON.stringify(genericProfile, null, 2)}

  Customize:
  - Brand voice (use actual website language)
  - UVPs (extract from website content)
  - Customer avatars (based on website messaging)
  - Emotional triggers (what this specific brand emphasizes)
  - Brand story (if mentioned on website)

  Return JSON with customized fields.
  `

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  })

  // Parse and return customized profile
}
```

#### C. Update createBrandWithIndustryData()
**File:** `/src/services/industryService.ts:369-427`

```typescript
export async function createBrandWithIndustryData(
  domain: string,
  naicsCode: string,
  userId?: string
): Promise<{ brand: any; mirrorSections: MirrorSections } | null> {
  try {
    // 1. Get generic industry profile
    const industryProfile = await getIndustryProfile(naicsCode)

    // 2. ✅ NEW: Scrape the actual website
    const websiteData = await scrapeWebsite(domain)

    // 3. ✅ NEW: Customize profile using AI
    const customizedProfile = await customizeIndustryProfile(
      websiteData,
      industryProfile
    )

    // 4. Create brand with enriched data
    const { data: brand } = await supabase
      .from('brands')
      .insert({
        name: websiteData.metadata.title || domain,
        website: domain,
        industry: industryProfile.title,
        user_id: userId || null,
        // ✅ NEW: Store extracted website data
        logo: websiteData.design.logo,
        colors: websiteData.design.colors,
        fonts: websiteData.design.fonts
      })
      .select()
      .single()

    // 5. Generate MIRROR sections with CUSTOMIZED data
    const mirrorSections = generateMirrorSectionsFromIndustry(
      domain,
      customizedProfile  // ✅ Use customized, not generic
    )

    // 6. Store MIRROR sections
    await Promise.all(Object.entries(mirrorSections).map(([section, sectionData]) =>
      supabase
        .from('mirror_sections')
        .insert({
          brand_id: brand.id,
          section: section,
          data: sectionData
        })
    ))

    return { brand, mirrorSections }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
```

#### D. Update OnboardingPage UI
**File:** `/src/pages/OnboardingPage.tsx`

Add progress indicators:
```typescript
const [analysisSteps, setAnalysisSteps] = useState({
  scraping: 'pending',
  extracting: 'pending',
  analyzing: 'pending',
  generating: 'pending'
})

// Show progress during analysis:
// ✓ Scraping website...
// ✓ Extracting brand elements...
// ✓ Analyzing with AI...
// ✓ Generating MIRROR framework...
```

### **2. CREATE MISSING DATABASE TABLES**

Create migration file for missing tables:
```sql
-- tactical_plans
CREATE TABLE tactical_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  channels JSONB,
  allocations JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- marketing_strategies
CREATE TABLE marketing_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  strategy_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- mirror_objectives
CREATE TABLE mirror_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  type TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- mirror_intend_objectives
CREATE TABLE mirror_intend_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  objective_id UUID,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### **3. FIX UUID GENERATION FOR OBJECTIVES**

**File:** `/src/components/mirror/intend/GoalProgressTracker.tsx:59`

Change from:
```typescript
const objectiveId = 'obj-1'  // ❌ String, not UUID
```

To:
```typescript
import { v4 as uuidv4 } from 'uuid'
const objectiveId = uuidv4()  // ✅ Proper UUID
```

### **4. IMPLEMENT AUTHENTICATION**

- Add Supabase Auth
- Create login/signup flow
- Update brands table to require user_id
- Add Row Level Security (RLS) policies

### **5. ADD COMPETITOR ANALYSIS**

Currently `competitiveLandscape.competitors` is empty. Add:
- Competitor discovery (based on industry + location)
- Competitor website scraping
- Competitive analysis comparison

---

## 🧪 Testing Instructions

### **How to Test Current System**

1. **Start Dev Server:**
```bash
cd /Users/byronhudson/Projects/MARBA
npm run dev
# Server runs on http://localhost:3001
```

2. **Test Onboarding:**
   - Go to `http://localhost:3001/onboarding`
   - Enter domain: `tregdfw.com`
   - Select industry: `Residential Real Estate`
   - Click "Analyze Brand"
   - **Expected:** Redirects to MIRROR page
   - **Current Issue:** Uses generic industry data, doesn't analyze website

3. **Verify MIRROR Data Loads:**
   - Open browser console
   - Should see: `[MirrorProvider] Loading MIRROR data for brand: [uuid]`
   - Should see: `Loaded MIRROR state for brand: [uuid]`
   - Should see: `[MeasureSection] advantages: [real competitive advantages]`

4. **Check Database:**
```bash
npx tsx scripts/check-mirror-sections.ts
# Shows all MIRROR section data for latest brand
```

5. **Expected 404 Errors (Non-Blocking):**
   - `tactical_plans` - Normal, table doesn't exist yet
   - `marketing_strategies` - Normal, table doesn't exist yet
   - `mirror_objectives` - Normal, table doesn't exist yet

### **How to Test After Website Analysis Is Implemented**

1. Enter real domain (e.g., `mcdonaldregroup.com`)
2. System should show progress:
   - "Scraping website..."
   - "Extracting brand elements..."
   - "Analyzing with AI..."
3. MIRROR page should show REAL data from website:
   - Actual brand colors
   - Actual fonts
   - Actual messaging themes
   - Customized UVPs based on website content

---

## 📝 Diagnostic Scripts

### **Check MIRROR Sections Data**
```bash
npx tsx scripts/check-mirror-sections.ts
```
Shows full MIRROR section data for most recent brand.

### **Check MEASURE Section Structure**
```bash
npx tsx scripts/check-measure-structure.ts
```
Shows detailed structure of MEASURE section data.

---

## 🔑 Environment Variables

**File:** `.env`

Required:
```env
VITE_SUPABASE_URL=https://eyytfnrvzfidxoonnqyt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (your key)
VITE_ANTHROPIC_API_KEY=sk-ant-... (your key)
```

---

## 💡 Code Patterns & Conventions

### **React Component Pattern**
```typescript
import * as React from 'react'
import { Card } from '@/components/ui/card'

interface MyComponentProps {
  brandId: string
  onUpdate?: (data: any) => void
}

export const MyComponent: React.FC<MyComponentProps> = ({
  brandId,
  onUpdate
}) => {
  const [state, setState] = React.useState<any>({})

  React.useEffect(() => {
    // Load data
  }, [brandId])

  return <Card>...</Card>
}
```

### **Service Function Pattern**
```typescript
export async function myService(
  param: string
): Promise<Result | null> {
  try {
    console.log('[myService] Starting...')

    const { data, error } = await supabase
      .from('table')
      .select('*')

    if (error) throw error

    console.log('[myService] Success')
    return data
  } catch (error) {
    console.error('[myService] Error:', error)
    return null
  }
}
```

### **Context Pattern**
```typescript
interface MyContextValue {
  state: MyState
  updateState: (data: Partial<MyState>) => void
  loading: boolean
}

const MyContext = React.createContext<MyContextValue | undefined>(undefined)

export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<MyState>(initialState)
  const [loading, setLoading] = React.useState(false)

  const value: MyContextValue = { state, updateState, loading }

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>
}

export const useMyContext = () => {
  const context = React.useContext(MyContext)
  if (!context) throw new Error('useMyContext must be used within MyProvider')
  return context
}
```

---

## 📚 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "@supabase/supabase-js": "^2.47.10",
    "@anthropic-ai/sdk": "^0.32.1",
    "tailwindcss": "^3.4.15",
    "framer-motion": "^11.11.17",
    "lucide-react": "^0.460.0",
    "date-fns": "^4.1.0"
  }
}
```

---

## 🐛 Debugging Tips

### **Enable Verbose Logging**
All service functions have `console.log` statements:
- `[ServiceName] Action...` format
- Check browser console for data flow

### **Inspect Database Directly**
```typescript
// In browser console:
const { data } = await window.supabase
  .from('mirror_sections')
  .select('*')
  .eq('brand_id', 'your-brand-id')
console.log(data)
```

### **Check MirrorContext State**
```typescript
// In React DevTools:
// Find MirrorProvider component
// Inspect value prop to see current state
```

### **Common Issues**

**Issue:** "No brandId available yet"
**Fix:** MirrorProvider loads before BrandContext sets currentBrand. This is normal on initial load.

**Issue:** "Loaded MIRROR state" but UI shows dummy data
**Fix:** Component may not be receiving the loaded data. Check props in MirrorPage.

**Issue:** 404 errors for missing tables
**Fix:** Normal - tables don't exist yet. Errors are handled gracefully.

---

## 🎨 UI Component Library

Using **shadcn/ui** components:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button`, `Input`, `Textarea`, `Label`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Badge`, `Select`, `Dialog`, `Tooltip`
- All in `/src/components/ui/`

---

## 📊 Data Structures

### **IndustryProfile Interface**
```typescript
interface IndustryProfile {
  naics_code: string
  title: string
  full_profile_data: {
    // Golden Circle
    golden_circle: {
      why: string
      how: string
      what: string
    }

    // Brand Archetype
    brand_archetype: {
      primary: string
      secondary: string
      sub_archetype: string
      traits: string[]
    }

    // Emotional Triggers (10-15)
    emotional_triggers: Array<{
      trigger: string
      psychology: string
      application: string
    }>

    // Psychological Hooks
    psychological_hooks: {
      reciprocity: string
      scarcity: string
      authority: string
      consistency: string
      liking: string
      consensus: string
    }

    // Customer Avatars (3-5)
    customer_avatars: Array<{
      name: string
      demographics: string
      pain_points: string[]
      desires: string[]
      fears: string[]
      buying_triggers: string[]
    }>

    // UVPs (5+)
    uvps: Array<{
      id: string
      rank: number
      proposition: string
      differentiator: string
    }>

    // Power Words
    contentStrategy: {
      powerWords: string[]
    }

    // Competitive Advantages
    competitiveLandscape: {
      advantages: string[]
      description: string
    }

    // Market Position
    marketPosition: {
      keyTrends: string[]
      opportunities: string[]
    }

    // Brand Story
    brand_story: {
      origin: string
      narrative_arc: string
      transformation: string
    }

    // ... 40-55 total fields
  }
}
```

### **MirrorSections Interface**
```typescript
interface MirrorSections {
  measure: {
    assets: {
      opportunities: string[]
      threats: string[]
      strengths: string[]
      weaknesses: string[]
    }
    industry: string
    insights: any[]
    brandHealth: number
    currentMetrics: Record<string, number>
    marketPosition: {
      keyTrends: string[]
    }
    competitiveLandscape: {
      advantages: string[]
      description: string
    }
    customer_avatars: any[]
    emotional_journey: any
    emotional_triggers: any[]
  }

  intend: {
    goals: any[]
    objectives: any[]
    targets: any[]
    golden_circle: any
  }

  reimagine: {
    uvps: any[]
    brandStrategy: any
    contentStrategy: any
    audienceStrategy: any
    competitiveStrategy: any
    golden_circle: any
    brand_archetype: any
    brand_story: any
  }

  reach: {
    tactics: any[]
    channels: any[]
    campaigns: any[]
    psychological_hooks: any
  }

  optimize: {
    actions: any[]
    timeline: any
    priorities: any[]
  }

  reflect: {
    kpis: any[]
    insights: any[]
    recommendations: any[]
    emotional_kpis: any
  }
}
```

---

## 🔍 Where to Look Next

**To implement website analysis:**
1. Start with `/src/services/scraping/websiteScraper.ts` (create new file)
2. Then `/src/services/ai/websiteAnalyzer.ts` (create new file)
3. Update `/src/services/industryService.ts` lines 369-427
4. Update `/src/pages/OnboardingPage.tsx` lines 152-187

**To fix UUID error:**
1. Check `/src/components/mirror/intend/GoalProgressTracker.tsx:59`

**To create missing tables:**
1. Create migration file in Supabase dashboard
2. Run SQL from "Next Steps" section

---

## ✅ Verification Checklist

Before marking website analysis as complete, verify:

- [ ] Website scraping works for test domains
- [ ] Colors extracted match actual website
- [ ] Fonts extracted match actual website
- [ ] Content analysis customizes UVPs
- [ ] AI customization produces non-generic results
- [ ] MIRROR sections contain website-specific data
- [ ] Progress indicators show during analysis
- [ ] Error handling for failed scrapes
- [ ] Timeout handling for slow websites
- [ ] CORS issues resolved (proxy if needed)

---

## 📞 Contact & Resources

**Supabase Dashboard:** https://app.supabase.com/project/eyytfnrvzfidxoonnqyt
**Anthropic Console:** https://console.anthropic.com/
**GitHub (if exists):** [Your repo URL]

---

## 🏁 Summary for Next Claude Instance

**What Works:**
- ✅ Industry profiles loaded from database (147 profiles, 475k+ words)
- ✅ Brand creation flow
- ✅ MIRROR sections generated and saved
- ✅ MirrorContext loads real data from database
- ✅ Components display real psychology data (competitive advantages, trends, etc.)
- ✅ Navigation styled with blue MIRROR acronym

**What's Broken:**
- ❌ NO WEBSITE ANALYSIS - Creates brands using generic industry data only
- ❌ Missing database tables causing 404s (non-blocking)
- ❌ UUID generation error for objectives

**Priority 1: IMPLEMENT WEBSITE ANALYSIS**
The system must:
1. Scrape the actual website
2. Extract real colors, fonts, content
3. Use AI to customize industry profile
4. Create brand with real, specific data

Start with creating `/src/services/scraping/websiteScraper.ts` and follow the implementation guide in "Next Steps" section above.

**Testing:**
```bash
npm run dev  # Runs on http://localhost:3001
npx tsx scripts/check-mirror-sections.ts  # Verify data
```

**Console Logs to Watch:**
- `[OnboardingPage] Starting brand creation`
- `[createBrandWithIndustryData] Industry profile: Found`
- `[MirrorProvider] Loading MIRROR data for brand`
- `Loaded MIRROR state for brand`
- `[MeasureSection] advantages:` (should show real competitive advantages)

Good luck! The infrastructure is solid - just need to add the website analysis layer.
