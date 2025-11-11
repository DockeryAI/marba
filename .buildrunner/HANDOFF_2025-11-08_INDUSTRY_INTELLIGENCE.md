# HANDOFF: Industry Intelligence System - 90% Complete

**Date:** 2025-11-08
**Status:** 90% Complete - Final UI Integration Needed
**Priority:** CRITICAL
**Next Session:** Build confirmation dialogs, enhance IndustrySelector, wire UI

---

## WHAT WAS COMPLETED

### 1. Industry Profile Generation (100% DONE)
- ✅ Generated 140 comprehensive industry profiles using Claude Opus 4.1
- ✅ Populated Supabase `industry_profiles` table (140 rows)
- ✅ Each profile: 40 fields, 3,200+ words, deep industry intelligence
- ✅ Cost: ~$85 total (~$0.60 per profile)

**Files:**
- `apps/web/data/industry-research/opus-generated/micro-batches/` (70 batch files)
- Populated via: `apps/web/data/industry-research/populate-supabase.ts`

### 2. 391 NAICS Codes - 99% SMB Coverage (100% DONE)
- ✅ 141 codes with full profiles (instant load)
- ✅ 250 codes for on-demand generation (3-5 min research)
- ✅ Covers Healthcare, Legal, Food, Retail, Services, Construction, etc.

**Files:**
- `apps/web/data/industry-research/complete-naics-codes.ts` (391 entries)
- `apps/web/data/industry-research/additional-naics-260.ts` (expansion data)

### 3. Fuzzy Matching Service (100% DONE)
- ✅ 3-tier matching: exact → keyword → partial
- ✅ Confidence scoring (0.0 - 1.0)
- ✅ Alternative suggestions
- ✅ Search functionality for dropdown

**File:** `Figma/src/services/industry/IndustryMatchingService.ts`

### 4. Opus-Powered NAICS Detection (100% DONE)
- ✅ Uses Claude Opus 4.1 to detect NAICS codes for unknown industries
- ✅ Returns: naics_code, display_name, category, keywords, confidence, reasoning
- ✅ Example: "kids doctor" → "Pediatric Medicine (621111)" with 95% confidence

**File:** `Figma/src/services/industry/IndustryCodeDetectionService.ts`

### 5. On-Demand Profile Generation (100% DONE)
- ✅ Uses Claude Opus 4.1 (NOT Sonnet)
- ✅ Same 40-field template as pre-generated profiles
- ✅ Auto-saves to database with NAICS code
- ✅ Environment variables fixed (`import.meta.env`)

**File:** `Figma/src/services/industry/OnDemandProfileGeneration.ts`
- Line 213: Confirmed Opus 4.1 model
- Lines 13-14, 191: Fixed to use `import.meta.env` (browser compatible)

### 6. Onboarding Flow Optimization (100% DONE)
- ✅ Detects pre-generated profiles in database
- ✅ Skips research animation for 141 instant-load industries
- ✅ Falls back to on-demand generation for remaining 250

**File:** `Figma/src/components/onboarding-v5/OnboardingV5Hybrid.tsx`
- Lines 76-127: Added database check in `handleScanningComplete`

---

## WHAT NEEDS TO BE BUILT (REMAINING 10%)

### 1. Confirmation Dialog Components (NOT STARTED)

**Required:** 2 dialog components

#### A. Pre-Research Confirmation Dialog
**Purpose:** Show before starting 3-5 min Opus generation for on-demand industries

**Component:** `Figma/src/components/onboarding-v5/ConfirmResearchDialog.tsx`

**Props:**
```typescript
interface ConfirmResearchDialogProps {
  industryName: string;          // e.g., "Hospital"
  naicsCode: string;             // e.g., "622110"
  estimatedTime: string;         // e.g., "3-5 minutes"
  model: string;                 // "Claude Opus 4.1"
  onConfirm: () => void;
  onCancel: () => void;
}
```

**UI Design:**
```
┌─────────────────────────────────────────────────┐
│  ⚠️  New Industry Research Required              │
│                                                  │
│  Industry: Hospital (NAICS 622110)              │
│  Model: Claude Opus 4.1                         │
│  Estimated Time: 3-5 minutes                    │
│                                                  │
│  We'll research this industry to provide you    │
│  with comprehensive insights, customer triggers, │
│  messaging frameworks, and more.                 │
│                                                  │
│  [Cancel]              [Yes, Start Research] ✓  │
└─────────────────────────────────────────────────┘
```

#### B. Code Detection Confirmation Dialog
**Purpose:** Show after Opus detects NAICS code for free-form input

**Component:** `Figma/src/components/onboarding-v5/ConfirmCodeDetectionDialog.tsx`

**Props:**
```typescript
interface ConfirmCodeDetectionDialogProps {
  userInput: string;             // e.g., "kids doctor"
  detectedIndustry: string;      // e.g., "Pediatric Medicine"
  naicsCode: string;             // e.g., "621111"
  confidence: number;            // e.g., 0.95
  reasoning: string;             // Opus explanation
  onConfirm: () => void;
  onCorrect: () => void;         // Let user choose different industry
}
```

**UI Design:**
```
┌─────────────────────────────────────────────────┐
│  🤖 Industry Detection                           │
│                                                  │
│  You entered: "kids doctor"                      │
│                                                  │
│  We detected: Pediatric Medicine                 │
│  NAICS Code: 621111                             │
│  Confidence: 95%                                │
│                                                  │
│  Reasoning:                                      │
│  The input "kids doctor" most closely matches   │
│  Pediatric Medicine (NAICS 621111), which       │
│  specifically covers physicians who treat        │
│  children and adolescents.                       │
│                                                  │
│  Is this correct?                                │
│                                                  │
│  [No, let me choose]      [Yes, that's right] ✓ │
└─────────────────────────────────────────────────┘
```

### 2. Enhanced IndustrySelector (NOT STARTED)

**File:** `Figma/src/components/onboarding-v5/IndustrySelector.tsx`

**Required Changes:**

1. **Add free-form input capability:**
   - Allow user to type any text and press Enter
   - Add "Use custom industry" button that appears when no exact match
   - Wire up to `IndustryMatchingService.findMatch()`

2. **Integration flow:**
```typescript
// Add to IndustrySelector.tsx

const handleFreeFormSubmit = async (text: string) => {
  // Step 1: Try fuzzy match
  const match = IndustryMatchingService.findMatch(text);

  if (match.type === 'exact' || (match.type === 'fuzzy' && match.confidence > 0.7)) {
    // Strong match - proceed directly
    onIndustrySelected(match.match);

  } else if (match.type === 'fuzzy' && match.confidence > 0.4) {
    // Weak match - show alternatives
    setAlternatives(match.alternatives);

  } else {
    // No match - use Opus detection
    await detectWithOpus(text);
  }
};

const detectWithOpus = async (text: string) => {
  // Step 1: Show loading
  setDetecting(true);

  // Step 2: Call Opus to detect NAICS
  const detection = await IndustryCodeDetectionService.detectCode(text);
  setDetecting(false);

  // Step 3: Show code detection confirmation
  const confirmed = await showCodeDetectionDialog(detection);

  if (!confirmed) {
    return; // User rejected, stay on selector
  }

  // Step 4: Check if we need to generate profile
  const industry = IndustryMatchingService.getByCode(detection.naics_code);

  if (industry && industry.has_full_profile) {
    // Profile already exists, use it
    onIndustrySelected(industry);

  } else {
    // Step 5: Show research confirmation
    const approveResearch = await showResearchConfirmationDialog(detection);

    if (!approveResearch) {
      return; // User rejected, stay on selector
    }

    // Step 6: Generate profile with Opus
    setGenerating(true);
    await OnDemandProfileGenerator.generateProfile(
      detection.display_name,
      detection.naics_code
    );
    setGenerating(false);

    // Step 7: Proceed with newly generated profile
    onIndustrySelected({
      naicsCode: detection.naics_code,
      displayName: detection.display_name,
      keywords: detection.keywords,
      category: detection.category,
      hasFullProfile: true
    });
  }
};
```

### 3. Detailed Research Status Animations (NOT STARTED)

**File:** `Figma/src/components/onboarding-v5/DetailedResearchAnimation.tsx`

**Requirements:**
- Replace simple loading spinner with detailed phase-by-phase progress
- Show exactly what's happening in real-time
- Display estimated time for each phase

**UI Design:**
```
┌─────────────────────────────────────────────────┐
│                                                  │
│  🔬 Researching: Pediatric Medicine             │
│                                                  │
│  [████████░░░░░░░░] 45% Complete                │
│                                                  │
│  Current Phase: Market Intelligence Gathering   │
│  ⏱️  ~2 minutes remaining                        │
│                                                  │
│  Completed:                                      │
│  ✓ Customer Psychology Analysis (1m 20s)        │
│  ✓ Messaging Framework Development (45s)        │
│                                                  │
│  In Progress:                                    │
│  ⟳ Market Intelligence Gathering...             │
│                                                  │
│  Remaining:                                      │
│  ○ Seasonal Patterns Analysis                   │
│  ○ Validation & Storage                         │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Animation Phases:**
1. Customer Psychology Analysis (25% - ~90 seconds)
2. Messaging Framework Development (25% - ~60 seconds)
3. Market Intelligence Gathering (25% - ~90 seconds)
4. Seasonal Patterns Analysis (15% - ~45 seconds)
5. Validation & Storage (10% - ~15 seconds)

**Note:** These are visual estimates for user experience. The actual Opus call is a single request.

### 4. Wire Everything Into UI (NOT STARTED)

**Integration Points:**

1. **OnboardingV5Hybrid.tsx:**
   - Import both confirmation dialogs
   - Add state for showing dialogs
   - Wire up dialog callbacks

2. **IndustrySelector.tsx:**
   - Add free-form input field
   - Add "Use custom industry" button
   - Wire up `handleFreeFormSubmit`
   - Import and use confirmation dialogs

3. **ProfileGenerationLoading.tsx:**
   - Replace with `DetailedResearchAnimation.tsx`
   - Pass phase progress data
   - Show estimated times

---

## THE COMPLETE USER FLOWS

### Flow 1: Pre-Generated Industry (141 industries)
```
User enters URL → System detects industry → User confirms
→ Database has profile → INSTANT LOAD (no animation)
→ Brand Mirror → JTBD
```

### Flow 2: On-Demand Industry (250 industries)
```
User enters URL → System suggests "Hospital" (has code, no profile)
→ User selects → ⚠️ CONFIRMATION: "Research will take 3-5 min"
→ User confirms → 🔄 Detailed animation (shows phases)
→ Profile generated & saved → Brand Mirror → JTBD
```

### Flow 3: Free-Form Unknown Industry
```
User types: "kids doctor" → Presses Enter

→ 🔍 Fuzzy match (no strong match found)

→ 🤖 Opus NAICS Detection (5-10 seconds)
   Detects: "Pediatric Medicine (621111)", confidence: 95%

→ ⚠️ CODE CONFIRMATION:
   "Is this correct? Pediatric Medicine (621111)"
   [No, let me choose] [Yes, that's right]

→ User clicks "Yes"

→ Check database: Does 621111 have a profile?
   - If YES: Load instantly
   - If NO: Continue to research confirmation

→ ⚠️ RESEARCH CONFIRMATION:
   "Research Pediatric Medicine? Takes 3-5 min"
   [Cancel] [Yes, start research]

→ User confirms

→ 🔄 Detailed Research Animation
   Phase 1: Customer Psychology... 25%
   Phase 2: Messaging Framework... 50%
   Phase 3: Market Intelligence... 75%
   Phase 4: Seasonal Patterns... 90%
   Phase 5: Validation & Storage... 100%

→ Profile saved to database

→ Brand Mirror → JTBD with pediatric-specific questions
```

---

## TESTING CHECKLIST

Once UI is built, test these scenarios:

### Scenario A: Pre-Generated Industry
- [ ] Enter a law firm URL
- [ ] Select "Legal Services - General Practice Law"
- [ ] Verify: NO research animation shows
- [ ] Verify: Goes directly to Brand Mirror
- [ ] Verify: JTBD questions are legal-specific

### Scenario B: On-Demand Industry
- [ ] Type "hospital" in selector
- [ ] Select "Hospital (622110)"
- [ ] Verify: Research confirmation dialog appears
- [ ] Click "Yes, Start Research"
- [ ] Verify: Detailed animation shows with phases
- [ ] Verify: After 3-5 min, profile is saved
- [ ] Verify: Can see profile in Supabase `industry_profiles` table

### Scenario C: Free-Form with Fuzzy Match
- [ ] Type "dentist" (should match "Dental Practice")
- [ ] Verify: Strong fuzzy match found
- [ ] Verify: No Opus detection needed
- [ ] Verify: Proceeds directly (instant load)

### Scenario D: Free-Form with Opus Detection
- [ ] Type "kids doctor"
- [ ] Press Enter or click "Use custom industry"
- [ ] Verify: "Detecting industry..." appears
- [ ] Verify: Code detection dialog shows
- [ ] Verify: Shows "Pediatric Medicine (621111)" with reasoning
- [ ] Click "Yes, that's right"
- [ ] Verify: Research confirmation shows
- [ ] Click "Yes, start research"
- [ ] Verify: Detailed animation with phases
- [ ] Verify: Profile generated and saved

### Scenario E: Free-Form with User Rejection
- [ ] Type "kids doctor"
- [ ] Wait for detection: "Pediatric Medicine"
- [ ] Click "No, let me choose"
- [ ] Verify: Returns to IndustrySelector
- [ ] Verify: Can browse and select different industry

---

## KEY FILES REFERENCE

### Services (All Complete)
```
Figma/src/services/industry/
├── IndustryMatchingService.ts          (Fuzzy matching)
├── IndustryCodeDetectionService.ts     (Opus NAICS detection)
└── OnDemandProfileGeneration.ts        (Opus profile generation)
```

### Data (All Complete)
```
apps/web/data/industry-research/
├── complete-naics-codes.ts                    (391 codes)
├── additional-naics-260.ts                    (expansion data)
└── opus-generated/micro-batches/*.json        (140 generated profiles)
```

### Components (Need to Build)
```
Figma/src/components/onboarding-v5/
├── ConfirmResearchDialog.tsx           ❌ TO BUILD
├── ConfirmCodeDetectionDialog.tsx      ❌ TO BUILD
├── DetailedResearchAnimation.tsx       ❌ TO BUILD
├── IndustrySelector.tsx                ⚠️  NEEDS ENHANCEMENT
└── OnboardingV5Hybrid.tsx              ⚠️  NEEDS WIRING
```

### Database
```
Supabase table: industry_profiles
- 140 rows (pre-generated)
- Expanding as users select on-demand industries
- Schema: 40 fields per profile
```

---

## IMPORTANT TECHNICAL NOTES

### 1. Model Confirmation
- **On-Demand Generation:** Uses Claude Opus 4.1 (line 213 of OnDemandProfileGeneration.ts)
- **NAICS Detection:** Uses Claude Opus 4.1 (line 67 of IndustryCodeDetectionService.ts)
- **NOT using Sonnet** - User initially asked to switch to Opus, but we were already using it

### 2. Environment Variables
- **Browser code:** Must use `import.meta.env.VITE_*`
- **Server/scripts:** Use `process.env.*`
- Already fixed in OnDemandProfileGeneration.ts (lines 13-14, 191)

### 3. Database RLS
- Admin operations (bulk insert) require service role key
- User operations use anon key with RLS policies
- populate-supabase.ts uses service role key

### 4. 40-Field Template Structure
```
CORE IDENTIFICATION (5 fields):
- industry, industry_name, naics_code, category, subcategory

CUSTOMER PSYCHOLOGY & TRIGGERS (8 fields):
- customer_triggers, customer_journey, transformations
- success_metrics, urgency_drivers, objection_handlers
- risk_reversal, customer_language_dictionary

VALUE PROPOSITION & DIFFERENTIATION (7 fields):
- value_propositions, differentiators, competitive_advantages
- pricing_strategies, service_delivery_models
- unique_selling_propositions, brand_positioning_templates

MESSAGING & COMMUNICATION (9 fields):
- power_words, avoid_words, headline_templates
- call_to_action_templates, email_subject_line_templates
- social_media_hooks, pain_point_language
- solution_language, proof_point_frameworks

MARKET INTELLIGENCE (6 fields):
- seasonal_patterns, geographic_variations
- demographic_insights, psychographic_profiles
- market_trends, innovation_opportunities

OPERATIONAL CONTEXT (5 fields):
- typical_business_models, common_challenges
- growth_strategies, technology_stack_recommendations
- industry_associations_resources
```

---

## JTBD & SEASONAL INTEGRATION (FROM AUTO-SCRIPTS)

### What Happens in Step 2: auto-build-jtbd-flow.sh

**Purpose:** Integrate industry intelligence into JTBD (Jobs-to-be-Done) discovery

**How It Works:**
1. Reads the 140 generated profiles from `industry_profiles` table
2. Extracts industry-specific triggers, pain points, and customer language
3. Generates dynamic JTBD questions based on industry context
4. Creates industry-specific conversation flows

**Example:**
- **Generic JTBD:** "What problems do your customers face?"
- **Legal-Specific JTBD:** "What urgent legal situations drive clients to seek your services? (e.g., facing lawsuit, contract dispute, criminal charges)"
- **Dental-Specific JTBD:** "What triggers prompt patients to schedule? (e.g., toothache, cosmetic concerns, routine cleaning)"

**Data Used:**
- `customer_triggers` → Forms basis of "why now?" questions
- `customer_language_dictionary` → Ensures questions use natural language
- `pain_point_language` → Helps articulate customer problems
- `transformations` → Creates before/after outcome questions

### What Happens in Step 3: auto-setup-ondemand.sh

**Purpose:** Set up seasonal patterns and on-demand generation system

**How It Works:**
1. Extracts `seasonal_patterns` from all 140 profiles
2. Creates a seasonal calendar system
3. Maps industries to peak/off-peak periods
4. Prepares the 250 on-demand codes for future generation

**Example Seasonal Data:**
```typescript
// From Dental Practice profile
seasonal_patterns: {
  peak_months: ["January", "May", "August"],
  peak_reasoning: "Insurance resets (Jan), pre-summer checkups (May), back-to-school (Aug)",
  slow_months: ["November", "December"],
  slow_reasoning: "Holidays, budget constraints, travel",
  marketing_calendar: {
    january: "Insurance benefits messaging, New Year health goals",
    may: "Summer smile prep, graduation season",
    august: "Back-to-school checkups, orthodontic consultations"
  }
}
```

**Integration with Messaging:**
- Content Calendar Generator uses seasonal_patterns to suggest timely content
- Email templates adjust messaging based on current month
- Social media hooks incorporate seasonal urgency

---

## COST & PERFORMANCE DATA

### Profile Generation Costs
- **Per Profile (Opus 4.1):** ~$0.60
- **140 Profiles Total:** ~$85
- **On-Demand Generation:** ~$0.60 per new industry (one-time)

### Generation Times
- **Opus 4.1:** 5-7 minutes per profile (premium quality)
- **Sonnet 3.5:** 30-60 seconds (if we switched - but we didn't)

### Database Size
- **140 Pre-Generated Profiles:** ~2.1 MB
- **Average Profile Size:** ~15 KB
- **Estimated Full 391:** ~5.9 MB (minimal DB impact)

---

## NEXT CLAUDE SESSION - START HERE

### Quick Start Instructions:

1. **Read This Document First**
2. **Verify Current State:**
   ```bash
   # Check if services exist
   cat Figma/src/services/industry/IndustryMatchingService.ts
   cat Figma/src/services/industry/IndustryCodeDetectionService.ts

   # Check NAICS codes
   grep -c "naics_code" apps/web/data/industry-research/complete-naics-codes.ts
   # Should output: 391

   # Check database
   # Supabase dashboard → industry_profiles table → should have 140 rows
   ```

3. **Build Components in This Order:**
   - ConfirmResearchDialog.tsx (simplest)
   - ConfirmCodeDetectionDialog.tsx
   - DetailedResearchAnimation.tsx
   - Enhance IndustrySelector.tsx
   - Wire into OnboardingV5Hybrid.tsx

4. **Test Each Flow:**
   - Pre-generated (instant)
   - On-demand (3-5 min research)
   - Free-form unknown (fuzzy match + Opus detection)

5. **Final Documentation:**
   - Update this handoff with completion status
   - Create user-facing guide explaining the 3 flows
   - Document JTBD and seasonal integration

---

## COMMIT HISTORY REFERENCE

**Last Major Commit:**
```
feat: Complete industry intelligence system - 391 NAICS codes with fuzzy matching and Opus detection

- Added 260 NAICS codes (391 total: 141 pre-generated + 250 on-demand)
- Built IndustryMatchingService (fuzzy matching with confidence scoring)
- Built IndustryCodeDetectionService (Opus-powered NAICS detection)
- Fixed OnDemandProfileGeneration environment variables
- Optimized OnboardingV5Hybrid to skip research for pre-generated profiles
- Created comprehensive IMPLEMENTATION_SUMMARY.md

Remaining: Confirmation dialogs, IndustrySelector enhancement, research animations

284 files changed, 334,357 insertions(+)
```

---

**Status:** Ready for UI component development
**Estimated Time:** 2-3 hours for remaining work
**Priority:** CRITICAL - This completes the industry intelligence system

**Questions?** Read:
- `apps/web/data/industry-research/IMPLEMENTATION_SUMMARY.md` (technical details)
- This handoff document (continuation plan)
