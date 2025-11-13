# UVP Wizard Implementation - Atomic Task Breakdown
## Claude-Optimized Step-by-Step Plan

**Last Updated:** 2025-11-12
**Status:** Ready for Implementation
**Total Tasks:** 47
**Completed:** 0
**In Progress:** 0

---

## ✅ PHASE 0: FRAMEWORK MIGRATION (COMPLETE)

### Task 0.1: Rename MIRROR to MARBA Framework ✅
- **Status:** ✅ COMPLETE
- **Files Modified:**
  - `src/pages/MirrorPage.tsx`
  - `src/components/layouts/MirrorLayout.tsx`
  - `src/components/mirror/measure/MeasureSection.tsx`
  - `src/components/mirror/intend/IntendSection.tsx`
  - `src/components/mirror/reimagine/ReimagineSection.tsx`
  - `src/components/mirror/reach/ReachSection.tsx`
- **Changes:**
  - Mirror (M) - blue-600
  - Align (A) - purple-600
  - Roadmap (R) - green-600
  - Broadcast (B) - orange-600
  - Assess (A) - teal-600
- **Verification:** Sidebar shows MARBA acronym with colored first letters and tooltips

### Task 0.2: Lock Sections Until UVP Complete ✅
- **Status:** ✅ COMPLETE
- **Implementation:** All sections except Mirror locked until `hasCompletedUVP === true`
- **Verification:** Lock overlays appear on Align, Roadmap, Broadcast, Assess when UVP not complete

---

## 🔧 PHASE 1: PROJECT SETUP & DEPENDENCIES

### Task 1.1: Install @dnd-kit for Drag-and-Drop
- **Status:** ⏳ PENDING
- **Command:**
  ```bash
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  ```
- **Purpose:** Enable drag-and-drop functionality for suggestion blocks
- **Verification:** `package.json` updated with new dependencies
- **Next Task:** 1.2

### Task 1.2: Verify shadcn/ui Tooltip Component
- **Status:** ⏳ PENDING
- **File:** `src/components/ui/tooltip.tsx`
- **Action:** Verify exists and works (already implemented)
- **Verification:** Import and render tooltip component successfully
- **Next Task:** 1.3

### Task 1.3: Create Type Definitions for UVP Wizard
- **Status:** ⏳ PENDING
- **File:** `src/types/uvp-wizard.types.ts` (NEW)
- **Content:**
  ```typescript
  // Suggestion types
  export interface ProblemSuggestion {
    id: string
    text: string
    source: 'industry_profile' | 'competitor' | 'market_research'
    prevalence: number // % of brands facing this
    category: 'acquisition' | 'retention' | 'operations' | 'revenue'
  }

  export interface SolutionApproach {
    id: string
    label: string
    category: 'technology' | 'service' | 'expertise' | 'speed' | 'value'
    commonInIndustry: boolean
    differentiationScore: number // 1-10
  }

  export interface OutcomeTemplate {
    id: string
    label: string
    category: 'time' | 'revenue' | 'efficiency' | 'satisfaction'
    template: string // e.g., "Save {amount} hours per {period}"
    example: string
  }

  export interface PurposeStarter {
    id: string
    label: string
    category: 'mission' | 'innovation' | 'community'
    template: string
  }

  // Wizard state
  export interface UVPWizardData {
    problems: string[]
    solution: string
    solutionApproaches: string[]
    outcomes: string[]
    purpose: string
    customInputs: Record<string, string>
  }

  export interface UVPScores {
    clarity: number
    differentiation: number
    credibility: number
    conversion: number
    overall: number
  }

  // Screen types
  export type WizardScreen = 'welcome' | 'problem' | 'solution' | 'outcome' | 'purpose' | 'preview' | 'reveal'
  ```
- **Verification:** File imports successfully in other components
- **Next Task:** 2.1

---

## 🏗️ PHASE 2: API SERVICES LAYER

### Task 2.1: Create Competitor Intelligence Service
- **Status:** ⏳ PENDING
- **File:** `src/services/uvp/CompetitorIntelligenceService.ts` (NEW)
- **Purpose:** Fetch competitor UVPs using Perplexity API
- **Implementation:**
  ```typescript
  export class CompetitorIntelligenceService {
    static async getCompetitorUVPs(industry: string, location?: string): Promise<string[]>
    static async scrapeCompetitorWebsites(domain: string): Promise<CompetitorData>
    static async analyzeCompetitorPositioning(competitors: string[]): Promise<PositioningAnalysis>
  }
  ```
- **API Integration:** Perplexity AI API
- **Verification:** Returns array of competitor UVP strings
- **Next Task:** 2.2

### Task 2.2: Create Industry Suggestions Service
- **Status:** ⏳ PENDING
- **File:** `src/services/uvp/IndustrySuggestionsService.ts` (NEW)
- **Purpose:** Generate industry-specific UVP suggestions
- **Implementation:**
  ```typescript
  export class IndustrySuggestionsService {
    static async getIndustryProblems(naicsCode: string): Promise<ProblemSuggestion[]>
    static async getIndustryApproaches(naicsCode: string): Promise<SolutionApproach[]>
    static async getOutcomeTemplates(naicsCode: string): Promise<OutcomeTemplate[]>
    static async getPurposeStarters(naicsCode: string): Promise<PurposeStarter[]>
    static async getMarketTrends(industry: string): Promise<TrendData>
  }
  ```
- **Data Sources:**
  - Supabase: `industry_profiles.full_profile_data`
  - Perplexity API for market research
- **Verification:** Returns industry-specific suggestions
- **Next Task:** 2.3

### Task 2.3: Create UVP Scoring Service
- **Status:** ⏳ PENDING
- **File:** `src/services/uvp/UVPScoringService.ts` (NEW)
- **Purpose:** Score UVP quality across 4 dimensions
- **Implementation:**
  ```typescript
  export class UVPScoringService {
    static scoreClarity(text: string): number
    static scoreDifferentiation(uvp: UVPWizardData, competitors: CompetitorData[]): number
    static scoreCredibility(uvp: UVPWizardData): number
    static scoreConversion(uvp: UVPWizardData): number
    static calculateOverallScore(scores: UVPScores): number
    static generateSuggestions(scores: UVPScores, uvp: UVPWizardData): string[]
  }
  ```
- **Algorithm:** Analyze text for clarity, specificity, proof points, and emotional triggers
- **Verification:** Returns scores 0-100 for each dimension
- **Next Task:** 2.4

### Task 2.4: Create Custom Input Parser Service
- **Status:** ⏳ PENDING
- **File:** `src/services/uvp/CustomInputParserService.ts` (NEW)
- **Purpose:** AI parses and analyzes custom user input
- **Implementation:**
  ```typescript
  export class CustomInputParserService {
    static async parseCustomProblem(text: string): Promise<ParsedProblem>
    static async parseCustomSolution(text: string): Promise<ParsedSolution>
    static async parseCustomOutcome(text: string): Promise<ParsedOutcome>
    static async extractKeyPhrases(text: string): Promise<string[]>
    static async suggestImprovements(text: string, type: 'problem' | 'solution' | 'outcome'): Promise<string[]>
  }
  ```
- **API Integration:** Rhodes AI (Anthropic Claude)
- **Verification:** Returns structured data from free-form text
- **Next Task:** 3.1

---

## 🎨 PHASE 3: WIZARD UI INFRASTRUCTURE

### Task 3.1: Create Wizard Modal Container
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/UVPWizardModal.tsx` (NEW)
- **Purpose:** Full-screen modal overlay for wizard
- **Features:**
  - Full-screen overlay with backdrop blur
  - Close button (with confirmation if data entered)
  - Progress indicator at top
  - Screen navigation state management
- **Props:**
  ```typescript
  interface UVPWizardModalProps {
    isOpen: boolean
    onClose: () => void
    brandData: BrandData
    onComplete: (uvpData: UVPWizardData) => void
  }
  ```
- **Verification:** Modal opens full-screen, closes with confirmation
- **Next Task:** 3.2

### Task 3.2: Create Wizard Progress Component
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/WizardProgress.tsx` (NEW)
- **Purpose:** Visual progress indicator showing 7 steps
- **Design:**
  ```
  [● ○ ○ ○ ○ ○ ○]  3 of 7
  ```
- **Features:**
  - 7 dots (welcome, problem, solution, outcome, purpose, preview, reveal)
  - Current step highlighted
  - Completed steps with checkmark
  - Progress percentage
- **Verification:** Dots update as wizard progresses
- **Next Task:** 3.3

### Task 3.3: Create Wizard Navigation Hook
- **Status:** ⏳ PENDING
- **File:** `src/hooks/useWizardNavigation.ts` (NEW)
- **Purpose:** Manage wizard screen navigation
- **Implementation:**
  ```typescript
  export function useWizardNavigation() {
    const [currentScreen, setCurrentScreen] = useState<WizardScreen>('welcome')
    const [completedScreens, setCompletedScreens] = useState<Set<WizardScreen>>(new Set())
    const [wizardData, setWizardData] = useState<Partial<UVPWizardData>>({})

    const goToNext = () => void
    const goBack = () => void
    const canProceed = (screen: WizardScreen) => boolean
    const updateData = (screen: WizardScreen, data: Partial<UVPWizardData>) => void

    return { currentScreen, completedScreens, wizardData, goToNext, goBack, canProceed, updateData }
  }
  ```
- **Verification:** Navigation functions work correctly
- **Next Task:** 4.1

---

## 🧩 PHASE 4: DRAG-AND-DROP COMPONENTS

### Task 4.1: Create Draggable Suggestion Block
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/DraggableSuggestion.tsx` (NEW)
- **Purpose:** Individual draggable suggestion block
- **Design:**
  ```
  ┌──────────────────────────────────────────┐
  │ 🎯 NEW PATIENTS ARE HARD TO ATTRACT      │
  │ 📊 87% of dental practices struggle      │
  │ [Drag or Click to Select]                │
  └──────────────────────────────────────────┘
  ```
- **Features:**
  - Draggable with @dnd-kit/core
  - Click to add to answer area
  - Hover effects
  - Visual feedback during drag
- **Props:**
  ```typescript
  interface DraggableSuggestionProps {
    suggestion: ProblemSuggestion | SolutionApproach | OutcomeTemplate
    onSelect: () => void
  }
  ```
- **Verification:** Block is draggable and clickable
- **Next Task:** 4.2

### Task 4.2: Create Droppable Answer Area
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/AnswerArea.tsx` (NEW)
- **Purpose:** Drop zone for selected answers
- **Design:**
  ```
  ┌─────────────────────────────────────────────┐
  │  YOUR ANSWER (Drag blocks here)             │
  │  ┌────────────────────────────────────────┐ │
  │  │  [Selected Item 1]              [x]    │ │
  │  └────────────────────────────────────────┘ │
  │  ┌────────────────────────────────────────┐ │
  │  │  [Selected Item 2]              [x]    │ │
  │  └────────────────────────────────────────┘ │
  │  [+ Add custom]                             │
  └─────────────────────────────────────────────┘
  ```
- **Features:**
  - Droppable zone with @dnd-kit/core
  - Reorder items by dragging
  - Remove with [x] button
  - "Add custom" opens textarea
  - Visual feedback when hovering during drag
- **Verification:** Accepts drops, allows reordering, removes items
- **Next Task:** 4.3

### Task 4.3: Create Custom Input Dialog
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/CustomInputDialog.tsx` (NEW)
- **Purpose:** Modal for entering custom text
- **Features:**
  - Textarea for input
  - AI parsing indicator (loading spinner)
  - Character count
  - Validation
  - AI-powered suggestions based on input
- **Props:**
  ```typescript
  interface CustomInputDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (text: string) => void
    type: 'problem' | 'solution' | 'outcome' | 'purpose'
    placeholder: string
  }
  ```
- **Verification:** Opens, parses input, saves custom text
- **Next Task:** 5.1

---

## 📱 PHASE 5: WIZARD SCREENS (Part 1: Problem, Solution, Outcome)

### Task 5.1: Create Welcome Screen
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/screens/WelcomeScreen.tsx` (NEW)
- **Design:** See proposal Screen 1
- **Features:**
  - Brand context display
  - Feature list (✓ items)
  - Auto-advance after 3 seconds OR manual continue
- **Verification:** Displays brand info, advances to problem screen
- **Next Task:** 5.2

### Task 5.2: Create Problem Screen
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/screens/ProblemScreen.tsx` (NEW)
- **Design:** See proposal Screen 2
- **Features:**
  - Fetch suggestions from `IndustrySuggestionsService`
  - Render `DraggableSuggestion` components
  - Render `AnswerArea` component
  - Support drag-and-drop AND click-to-select
  - "Add custom problem" button → `CustomInputDialog`
  - AI parsing of custom input via `CustomInputParserService`
  - Minimum 1 problem required
  - Continue button enabled when ≥1 selected
- **Data Flow:**
  1. Load suggestions from API
  2. User selects or drags suggestions
  3. User can add custom (parsed by AI)
  4. Save to wizard state
  5. Advance to solution screen
- **Verification:** Drag-and-drop works, custom input parsed, data saved
- **Next Task:** 5.3

### Task 5.3: Create Solution Screen
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/screens/SolutionScreen.tsx` (NEW)
- **Design:** See proposal Screen 3
- **Features:**
  - Fetch approaches from `IndustrySuggestionsService`
  - Multi-select approach blocks (NOT drag-and-drop, just click)
  - Formula auto-fills: "We combine [A] with [B] to deliver [C]"
  - "Write from scratch" option
  - Real-time clarity scoring
  - Minimum 2 approaches OR 10 characters custom required
- **Data Flow:**
  1. Load approach suggestions
  2. User selects 2+ approaches OR writes custom
  3. Real-time scoring via `UVPScoringService`
  4. Save to wizard state
  5. Advance to outcome screen
- **Verification:** Multi-select works, formula updates, scoring shows, custom input works
- **Next Task:** 5.4

### Task 5.4: Create Outcome Screen
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/screens/OutcomeScreen.tsx` (NEW)
- **Design:** See proposal Screen 4
- **Features:**
  - Fetch outcome templates from `IndustrySuggestionsService`
  - Drag templates to answer area
  - Click template to expand inline editor (fill-in-the-blank)
  - Example: "Save {10} hours per {week}"
  - Drag to reorder outcomes by priority
  - "Write custom outcome" option
  - Real-time validation (flag vague claims)
  - Minimum 2 outcomes required
- **Data Flow:**
  1. Load outcome templates
  2. User drags/selects outcomes
  3. User customizes templates inline
  4. Validation checks for specificity
  5. Save to wizard state
  6. Advance to purpose screen
- **Verification:** Drag works, inline editing works, validation works, data saved
- **Next Task:** 6.1

---

## 📱 PHASE 6: WIZARD SCREENS (Part 2: Purpose, Preview, Reveal)

### Task 6.1: Create Purpose Screen
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/screens/PurposeScreen.tsx` (NEW)
- **Design:** See proposal Screen 5
- **Features:**
  - Fetch purpose starters from `IndustrySuggestionsService`
  - Purpose templates with categories (mission, innovation, community)
  - "Edit & Use This" button loads template into textarea
  - Textarea with real-time editing
  - AI authenticity scoring (flags corporate jargon)
  - "Show more examples" expands list of industry examples
  - Minimum 20 characters required
- **Data Flow:**
  1. Load purpose starters
  2. User clicks template to load OR writes from scratch
  3. Real-time authenticity scoring
  4. Save to wizard state
  5. Advance to preview screen
- **Verification:** Templates load into textarea, scoring works, data saved
- **Next Task:** 6.2

### Task 6.2: Create Preview Screen
- **Status:** ⏳ PENDING
- **File:** `src/components/uvp-wizard/screens/PreviewScreen.tsx` (NEW)
- **Design:** See proposal Screen 6
- **Features:**
  - Generate UVP preview:
    - Headline (from solution + outcome)
    - Subheadline (from purpose)
    - Bullets (from outcomes)
  - UVP Scorecard with 4 dimensions
  - Improvement suggestions
  - Edit buttons to go back to specific screens
  - "Save & Generate Big Reveal" button
- **Data Flow:**
  1. Synthesize wizard data into UVP
  2. Calculate scores via `UVPScoringService`
  3. Generate improvement suggestions
  4. Allow editing any section
  5. On "Save", trigger WWH enhancement
  6. Advance to reveal screen
- **Verification:** Preview displays correctly, scores calculate, edits work, saves
- **Next Task:** 6.3

### Task 6.3: Integrate Existing Reveal Experience
- **Status:** ⏳ PENDING
- **File:** `src/components/mirror/value/RevealExperience.tsx` (EXISTS)
- **Action:** Wire up preview screen to trigger reveal
- **Changes Needed:**
  - Accept `UVPWizardData` as input
  - Call `WWHEnhancer.enhance()` with wizard data
  - Display 6-phase reveal animation
  - On complete, save to database and close wizard
- **Data Flow:**
  1. Preview screen calls `onComplete(wizardData)`
  2. Generate WWH enhanced data
  3. Show reveal animation
  4. Save to `value_statements` table
  5. Close wizard modal
  6. Refresh parent component
- **Verification:** Reveal plays, data saves, UVP appears in library, sections unlock
- **Next Task:** 7.1

---

## 🔌 PHASE 7: WIZARD INTEGRATION

### Task 7.1: Add "Create UVP" Button to UVPFlowSection
- **Status:** ⏳ PENDING
- **File:** `src/components/mirror/value/UVPFlowSection.tsx` (EXISTS)
- **Changes:**
  - Replace `WWHEnhancementFlow` with wizard button
  - Button: "✨ Create Your UVP" (large, prominent)
  - Opens `UVPWizardModal`
  - On complete, refresh statements list
- **Implementation:**
  ```typescript
  const [wizardOpen, setWizardOpen] = useState(false)

  const handleWizardComplete = async (wizardData: UVPWizardData) => {
    // Generate WWH enhanced data
    const enhanced = WWHEnhancer.enhance({ ...wizardData, ...brandData })

    // Save to database
    await createStatement({
      headline: enhanced.enhancedWhat,
      subheadline: enhanced.enhancedWhy,
      supporting_points: wizardData.outcomes,
      problem_statement: wizardData.problems.join('; '),
      solution_statement: wizardData.solution,
      outcome_statement: wizardData.outcomes.join('; '),
      purpose_statement: wizardData.purpose,
      unique_approach: wizardData.solutionApproaches,
      core_offerings: wizardData.outcomes,
      is_primary: true,
      status: 'active',
    })

    setWizardOpen(false)
    setActiveTab('library')
  }
  ```
- **Verification:** Button opens wizard, wizard saves data, library updates
- **Next Task:** 7.2

### Task 7.2: Update IntendSection CTA
- **Status:** ⏳ PENDING
- **File:** `src/components/mirror/intend/IntendSection.tsx` (EXISTS)
- **Changes:**
  - If no UVP, show "Complete Your UVP" CTA card
  - Card opens wizard modal
  - After completion, show checkmark and summary
- **Verification:** CTA appears when no UVP, opens wizard, disappears after completion
- **Next Task:** 7.3

### Task 7.3: Update Sidebar CTA Button
- **Status:** ⏳ PENDING
- **File:** `src/pages/MirrorPage.tsx` (EXISTS)
- **Changes:**
  - Existing glowing CTA button should open wizard modal
  - After completion, CTA disappears
  - Sections unlock
- **Verification:** CTA opens wizard, sections unlock after completion
- **Next Task:** 8.1

---

## 🎨 PHASE 8: STYLING & ANIMATIONS

### Task 8.1: Create Wizard Theme Variables
- **Status:** ⏳ PENDING
- **File:** `src/styles/wizard.css` (NEW)
- **Content:**
  ```css
  :root {
    --wizard-primary: #8B5CF6;
    --wizard-secondary: #6366F1;
    --wizard-accent: #EC4899;
    --wizard-success: #10B981;
    --wizard-warning: #F59E0B;
    --wizard-error: #EF4444;
  }

  .wizard-screen {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50;
    @apply dark:from-slate-950 dark:via-blue-950 dark:to-purple-950;
  }

  .suggestion-block {
    @apply p-4 border rounded-lg cursor-pointer transition-all;
    @apply hover:shadow-lg hover:scale-105;
    @apply active:scale-95;
  }

  .answer-block {
    @apply p-3 bg-white dark:bg-slate-800 border rounded-lg;
    @apply flex items-center justify-between;
    @apply shadow-sm hover:shadow-md transition-all;
  }
  ```
- **Verification:** Styles apply to wizard components
- **Next Task:** 8.2

### Task 8.2: Add Framer Motion Animations
- **Status:** ⏳ PENDING
- **Files:** All wizard screen components
- **Animations:**
  - Screen transitions: `<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} />`
  - Suggestion blocks: `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}`
  - Progress dots: `<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} />`
  - Answer blocks: Drag feedback with opacity change
- **Verification:** Animations play smoothly, no jank
- **Next Task:** 8.3

### Task 8.3: Add Loading States
- **Status:** ⏳ PENDING
- **Components:** All screens with API calls
- **Implementation:**
  - Skeleton loaders for suggestion blocks while fetching
  - Spinner for custom input parsing
  - Progress indicator for scoring
  - Shimmer effect for loading suggestions
- **Verification:** Loading states display correctly
- **Next Task:** 9.1

---

## 🧪 PHASE 9: TESTING & VALIDATION

### Task 9.1: Create Test Data Generator
- **Status:** ⏳ PENDING
- **File:** `src/services/uvp/TestDataGenerator.ts` (NEW)
- **Purpose:** Generate mock suggestions for testing
- **Implementation:**
  ```typescript
  export class TestDataGenerator {
    static generateProblemSuggestions(count: number): ProblemSuggestion[]
    static generateSolutionApproaches(count: number): SolutionApproach[]
    static generateOutcomeTemplates(count: number): OutcomeTemplate[]
    static generatePurposeStarters(count: number): PurposeStarter[]
  }
  ```
- **Verification:** Generates realistic test data
- **Next Task:** 9.2

### Task 9.2: Test End-to-End Wizard Flow
- **Status:** ⏳ PENDING
- **Test Steps:**
  1. Open wizard from UVPFlowSection
  2. Complete welcome screen
  3. Select 2 problems (1 drag, 1 click)
  4. Add 1 custom problem
  5. Select 3 solution approaches
  6. Select 3 outcomes (2 templates, 1 custom)
  7. Select purpose starter and edit
  8. Review preview
  9. Trigger reveal
  10. Verify UVP saved to database
  11. Verify sections unlock
- **Verification:** Complete flow works without errors
- **Next Task:** 9.3

### Task 9.3: Test Edge Cases
- **Status:** ⏳ PENDING
- **Test Cases:**
  - Empty state handling (no suggestions loaded)
  - API failure handling (network error)
  - Custom input validation (min length, max length)
  - Duplicate prevention (can't add same suggestion twice)
  - Navigation validation (can't skip required fields)
  - Browser back button handling
  - Close wizard with unsaved changes (show confirmation)
- **Verification:** All edge cases handled gracefully
- **Next Task:** 9.4

### Task 9.4: Test Mobile Responsiveness
- **Status:** ⏳ PENDING
- **Devices:** iPhone SE, iPhone 14, iPad, Desktop
- **Test Points:**
  - Wizard is full-screen on mobile
  - Drag-and-drop works on touch devices
  - Buttons are large enough (44x44px minimum)
  - Text is readable
  - No horizontal scroll
  - Keyboard doesn't obscure inputs
- **Verification:** Wizard works on all device sizes
- **Next Task:** 9.5

### Task 9.5: Test Accessibility
- **Status:** ⏳ PENDING
- **Tools:** axe DevTools, Screen Reader (VoiceOver/NVDA)
- **Checks:**
  - All interactive elements keyboard accessible
  - Focus visible and logical order
  - ARIA labels on drag-and-drop elements
  - Color contrast meets WCAG AA
  - Screen reader announces progress
  - Error messages read by screen reader
- **Verification:** No accessibility violations
- **Next Task:** 10.1

---

## 🚀 PHASE 10: API INTEGRATION & DATA PERSISTENCE

### Task 10.1: Connect to Supabase Industry Profiles
- **Status:** ⏳ PENDING
- **Service:** `IndustrySuggestionsService`
- **Queries:**
  ```sql
  SELECT full_profile_data->'common_problems' as problems
  FROM industry_profiles
  WHERE naics_code = $1;

  SELECT full_profile_data->'unique_approaches' as approaches
  FROM industry_profiles
  WHERE naics_code = $1;

  SELECT full_profile_data->'typical_outcomes' as outcomes
  FROM industry_profiles
  WHERE naics_code = $1;
  ```
- **Verification:** Returns real industry data
- **Next Task:** 10.2

### Task 10.2: Connect to Perplexity API
- **Status:** ⏳ PENDING
- **Service:** `CompetitorIntelligenceService`
- **Endpoint:** `https://api.perplexity.ai/chat/completions`
- **Prompt:** "What are the unique value propositions of top {industry} companies in {location}? List 5 examples with their core messaging."
- **Implementation:**
  ```typescript
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [{ role: 'user', content: prompt }]
    })
  })
  ```
- **Verification:** Returns competitor UVPs
- **Next Task:** 10.3

### Task 10.3: Connect to Rhodes AI (Claude)
- **Status:** ⏳ PENDING
- **Service:** `CustomInputParserService`
- **API:** Anthropic Claude API
- **Prompt Template:**
  ```
  Parse this user input for a {type} statement:
  "{userInput}"

  Extract:
  1. Main theme
  2. Key phrases
  3. Specificity level (1-10)
  4. Clarity score (1-10)
  5. Suggested improvements

  Return as JSON.
  ```
- **Verification:** Parses custom input and returns structured data
- **Next Task:** 10.4

### Task 10.4: Create Database Triggers for UVP Completion
- **Status:** ⏳ PENDING
- **File:** Supabase migration file
- **Trigger:** When `value_statements.is_primary = true` is inserted:
  1. Update `brands.has_completed_uvp = true`
  2. Emit event for frontend to refresh
- **SQL:**
  ```sql
  CREATE OR REPLACE FUNCTION update_brand_uvp_status()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.is_primary = true THEN
      UPDATE brands
      SET has_completed_uvp = true
      WHERE id = NEW.brand_id;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER uvp_completion_trigger
  AFTER INSERT OR UPDATE ON value_statements
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_uvp_status();
  ```
- **Verification:** Trigger fires and updates brand record
- **Next Task:** 10.5

### Task 10.5: Update MirrorPage to Check UVP Status
- **Status:** ⏳ PENDING
- **File:** `src/pages/MirrorPage.tsx` (EXISTS)
- **Changes:**
  - Query `brands.has_completed_uvp` instead of just checking `value_statements`
  - Real-time subscription to changes
  - Unlock sections when UVP completes
- **Implementation:**
  ```typescript
  useEffect(() => {
    if (!brandId) return

    // Subscribe to brand changes
    const subscription = supabase
      .channel('brand-uvp-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'brands',
        filter: `id=eq.${brandId}`
      }, (payload) => {
        setHasCompletedUVP(payload.new.has_completed_uvp)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [brandId])
  ```
- **Verification:** Sections unlock in real-time when UVP completes
- **Next Task:** 11.1

---

## 🔍 PHASE 11: GAP ANALYSIS & VERIFICATION

### Task 11.1: Verify All API Endpoints
- **Status:** ⏳ PENDING
- **Checklist:**
  - [ ] IndustrySuggestionsService.getIndustryProblems() works
  - [ ] IndustrySuggestionsService.getIndustryApproaches() works
  - [ ] IndustrySuggestionsService.getOutcomeTemplates() works
  - [ ] IndustrySuggestionsService.getPurposeStarters() works
  - [ ] CompetitorIntelligenceService.getCompetitorUVPs() works
  - [ ] CustomInputParserService.parseCustomProblem() works
  - [ ] CustomInputParserService.parseCustomSolution() works
  - [ ] CustomInputParserService.parseCustomOutcome() works
  - [ ] UVPScoringService.scoreClarity() works
  - [ ] UVPScoringService.scoreDifferentiation() works
  - [ ] UVPScoringService.scoreCredibility() works
  - [ ] UVPScoringService.scoreConversion() works
- **Verification Method:** Postman/Thunder Client API tests
- **Next Task:** 11.2

### Task 11.2: Verify UI Components Render
- **Status:** ⏳ PENDING
- **Checklist:**
  - [ ] UVPWizardModal renders
  - [ ] WizardProgress shows correct step
  - [ ] WelcomeScreen displays brand data
  - [ ] ProblemScreen shows suggestions
  - [ ] SolutionScreen shows approaches
  - [ ] OutcomeScreen shows templates
  - [ ] PurposeScreen shows starters
  - [ ] PreviewScreen synthesizes UVP correctly
  - [ ] RevealExperience plays animation
  - [ ] DraggableSuggestion is draggable
  - [ ] AnswerArea accepts drops
  - [ ] CustomInputDialog saves input
- **Verification Method:** Visual inspection in browser
- **Next Task:** 11.3

### Task 11.3: Verify Data Persistence
- **Status:** ⏳ PENDING
- **Test:** Complete wizard and check database
- **Checklist:**
  - [ ] `value_statements` record created
  - [ ] `problem_statement` saved
  - [ ] `solution_statement` saved
  - [ ] `outcome_statement` saved
  - [ ] `purpose_statement` saved
  - [ ] `unique_approach` array saved
  - [ ] `core_offerings` array saved
  - [ ] `is_primary` set to true
  - [ ] `clarity_score` calculated
  - [ ] `conversion_potential` calculated
  - [ ] `brands.has_completed_uvp` updated
- **Verification Method:** Supabase table inspector
- **Next Task:** 11.4

### Task 11.4: Compare Implementation vs. Proposal
- **Status:** ⏳ PENDING
- **Document:** Create gap analysis comparing:
  - ✅ Features implemented vs. planned
  - ✅ Screens completed vs. designed
  - ✅ APIs integrated vs. specified
  - ✅ Data flows working vs. documented
  - ⚠️ Deviations from original plan
  - ⚠️ Missing features or edge cases
  - ⚠️ Technical debt or workarounds
- **Output:** `UVP_WIZARD_GAP_ANALYSIS.md`
- **Verification:** All features from proposal are implemented or documented as future work
- **Next Task:** 12.1

---

## 📝 PHASE 12: DOCUMENTATION & HANDOFF

### Task 12.1: Create User Guide
- **Status:** ⏳ PENDING
- **File:** `docs/UVP_WIZARD_USER_GUIDE.md` (NEW)
- **Sections:**
  1. What is the UVP Wizard?
  2. When to use it
  3. Step-by-step walkthrough with screenshots
  4. Tips for best results
  5. Troubleshooting
- **Verification:** Guide is clear and accurate
- **Next Task:** 12.2

### Task 12.2: Create Developer Documentation
- **Status:** ⏳ PENDING
- **File:** `docs/UVP_WIZARD_DEVELOPER_DOCS.md` (NEW)
- **Sections:**
  1. Architecture overview
  2. Component hierarchy
  3. Data flow diagrams
  4. API service documentation
  5. Adding new suggestion types
  6. Customizing scoring algorithms
  7. Extending the wizard (adding screens)
- **Verification:** Developers can understand and modify code
- **Next Task:** 12.3

### Task 12.3: Create Deployment Checklist
- **Status:** ⏳ PENDING
- **File:** `UVP_WIZARD_DEPLOYMENT.md` (NEW)
- **Checklist:**
  - [ ] Environment variables set (Perplexity API, Rhodes API)
  - [ ] Supabase migrations applied
  - [ ] Database triggers created
  - [ ] RLS policies updated
  - [ ] API rate limits configured
  - [ ] Error monitoring enabled (Sentry/LogRocket)
  - [ ] Analytics tracking added
  - [ ] Performance monitoring enabled
  - [ ] Smoke tests passing
- **Verification:** All items checked before deploying
- **Next Task:** 12.4

### Task 12.4: Create Overview Document
- **Status:** ⏳ PENDING
- **File:** `UVP_WIZARD_OVERVIEW.md` (NEW)
- **Sections:**
  1. **Executive Summary** - What was built and why
  2. **Features Implemented** - Complete feature list
  3. **Technical Architecture** - High-level diagram
  4. **User Journey** - Step-by-step flow
  5. **API Integrations** - External services used
  6. **Database Schema Changes** - New tables/columns
  7. **Performance Metrics** - Load times, API latency
  8. **Known Issues** - Bugs or limitations
  9. **Future Enhancements** - Roadmap items
  10. **Commit Summary** - Git commit hash and changelog
- **Verification:** Comprehensive overview of entire implementation
- **Next Task:** 13.1

---

## 🎯 PHASE 13: COMMIT & DEPLOYMENT

### Task 13.1: Run Final Tests
- **Status:** ⏳ PENDING
- **Commands:**
  ```bash
  npm run lint
  npm run type-check
  npm run build
  ```
- **Verification:** No errors or warnings
- **Next Task:** 13.2

### Task 13.2: Create Git Commit
- **Status:** ⏳ PENDING
- **Command:**
  ```bash
  git add .
  git commit -m "$(cat <<'EOF'
  feat: Complete UVP Wizard with Drag-and-Drop Experience

  Implements comprehensive visual UVP wizard with 7-screen flow:
  - Welcome screen with brand context
  - Problem identification with drag-and-drop suggestions
  - Solution builder with multi-select approaches
  - Outcome templates with inline customization
  - Purpose statement with AI-powered starters
  - Preview screen with real-time scoring
  - Enhanced reveal experience with WWH transformation

  Features:
  - Drag-and-drop suggestion blocks (@dnd-kit/core)
  - Industry-specific AI suggestions (Perplexity API)
  - Custom input parsing (Rhodes AI/Claude)
  - Real-time UVP quality scoring
  - 4-dimensional scoring (clarity, differentiation, credibility, conversion)
  - Integration with existing WWH enhancement
  - Section unlocking on UVP completion
  - Full mobile responsiveness
  - Accessibility compliance (WCAG AA)

  API Integrations:
  - Perplexity AI for competitor research
  - Rhodes AI (Claude) for custom input parsing
  - Supabase for industry profile data
  - Real-time subscriptions for UVP status

  Database Changes:
  - Added trigger for UVP completion status
  - Updated brands.has_completed_uvp column
  - Enhanced value_statements RLS policies

  Files Changed: 47 files
  Lines Added: ~8,500
  Lines Removed: ~200

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  EOF
  )"
  ```
- **Verification:** Commit created with comprehensive message
- **Next Task:** 13.3

### Task 13.3: Push to Repository
- **Status:** ⏳ PENDING
- **Command:**
  ```bash
  git push origin main
  ```
- **Verification:** Code pushed successfully
- **Next Task:** 13.4

### Task 13.4: Create Deployment Tag
- **Status:** ⏳ PENDING
- **Commands:**
  ```bash
  git tag -a v2.0.0-uvp-wizard -m "Release: UVP Wizard with MARBA Framework"
  git push origin v2.0.0-uvp-wizard
  ```
- **Verification:** Tag created and pushed
- **Next Task:** DONE

---

## 📊 PROGRESS TRACKING

**Update this section as tasks are completed:**

- **Phase 0 (Framework):** 2/2 ✅ COMPLETE
- **Phase 1 (Setup):** 0/3 ⏳ PENDING
- **Phase 2 (Services):** 0/4 ⏳ PENDING
- **Phase 3 (Infrastructure):** 0/3 ⏳ PENDING
- **Phase 4 (Drag-Drop):** 0/3 ⏳ PENDING
- **Phase 5 (Screens 1):** 0/4 ⏳ PENDING
- **Phase 6 (Screens 2):** 0/3 ⏳ PENDING
- **Phase 7 (Integration):** 0/3 ⏳ PENDING
- **Phase 8 (Styling):** 0/3 ⏳ PENDING
- **Phase 9 (Testing):** 0/5 ⏳ PENDING
- **Phase 10 (APIs):** 0/5 ⏳ PENDING
- **Phase 11 (Verification):** 0/4 ⏳ PENDING
- **Phase 12 (Docs):** 0/4 ⏳ PENDING
- **Phase 13 (Deploy):** 0/4 ⏳ PENDING

**Total:** 2/47 tasks complete (4%)

---

## 🚨 CRITICAL NOTES FOR ANY CLAUDE

1. **Task Atomicity:** Each task is self-contained. Complete one fully before moving to next.
2. **Verification Required:** Every task has a verification step. Do not skip.
3. **Update Progress:** Mark tasks as complete in this file as you go.
4. **No Shortcuts:** Do not combine tasks or skip steps for speed.
5. **Quality Over Speed:** Take time to implement correctly the first time.
6. **Test as You Go:** Run verification after each task, not at the end.
7. **Document Deviations:** If you deviate from a task, document why in comments.
8. **API Keys Required:** Perplexity and Anthropic API keys must be in `.env` file.
9. **Mobile First:** Test on mobile at every step, not just at the end.
10. **Accessibility First:** Add ARIA labels and keyboard support from the start.

---

## 🔗 DEPENDENCIES

**Environment Variables Required:**
```env
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_PERPLEXITY_API_KEY=<perplexity-key>
VITE_ANTHROPIC_API_KEY=<anthropic-key>
```

**NPM Packages to Install:**
- `@dnd-kit/core` - Drag and drop primitives
- `@dnd-kit/sortable` - Sortable drag and drop
- `@dnd-kit/utilities` - Helper utilities

**Existing Dependencies:**
- `framer-motion` - Animations (already installed)
- `@radix-ui/react-tooltip` - Tooltips (already installed via shadcn/ui)
- `lucide-react` - Icons (already installed)
- `tailwindcss` - Styling (already installed)

---

## 📅 ESTIMATED TIMELINE

- **Phase 0:** ✅ Complete (2 hours)
- **Phase 1-2:** 4 hours (Setup + Services)
- **Phase 3-4:** 6 hours (Infrastructure + Drag-Drop)
- **Phase 5-6:** 10 hours (Wizard Screens)
- **Phase 7-8:** 4 hours (Integration + Styling)
- **Phase 9:** 6 hours (Testing)
- **Phase 10:** 6 hours (API Integration)
- **Phase 11-12:** 4 hours (Verification + Docs)
- **Phase 13:** 1 hour (Deployment)

**Total Estimated Time:** 43 hours

---

## 🎯 SUCCESS CRITERIA

Implementation is complete when:
1. ✅ All 47 tasks marked as complete
2. ✅ End-to-end wizard flow works without errors
3. ✅ All APIs integrated and returning data
4. ✅ UVP saves to database correctly
5. ✅ Sections unlock after UVP completion
6. ✅ Mobile responsive and accessible
7. ✅ No console errors or warnings
8. ✅ All tests passing
9. ✅ Documentation complete
10. ✅ Code committed and pushed

---

**Last Updated By:** Claude (2025-11-12)
**Current Task:** Ready to begin Phase 1, Task 1.1
