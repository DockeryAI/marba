# UVP Wizard Redesign + MARBA Framework Restructure
## Comprehensive Proposal - November 12, 2025

---

## PART 1: MARBA FRAMEWORK RESTRUCTURE

### Overview
Transform the MIRROR framework into **MARBA** - a more intuitive, action-oriented brand strategy framework.

### New Framework Structure

| Letter | Word | Plain-English Meaning | Current Section | Key Changes |
|--------|------|----------------------|-----------------|-------------|
| **M** | **Mirror** | See where you are — your audience, market, and message today | Measure | Rename from "Measure" to "Mirror" |
| **A** | **Align** | Set your direction — goals, results, and what success looks like | Intend | Rename from "Intend" to "Align" |
| **R** | **Roadmap** | Plan how to get there — the channels, audience, and strategy | Reimagine + Reach (combined) | **Merge sections:** Combine old "Reimagine" + "Reach" into single "Roadmap" section |
| **B** | **Broadcast** | Create and launch — your content, campaigns, and offers | (New) | **New section:** Content calendar, campaigns, publishing |
| **A** | **Assess** | Reflect on results — measure, learn, and refine what works | Optimize + Reflect (combined) | **Merge sections:** Combine "Optimize" + "Reflect" into single "Assess" section |

### Section Details

#### 1. Mirror (M)
**Purpose:** See where you are today
- **Subsections:**
  - Brand Health Dashboard
  - Market Position
  - Competitive Intelligence
  - Current Assets Audit
- **Key Metrics:** Brand awareness, sentiment, share of voice
- **Color Theme:** Blue (reflection, clarity)

#### 2. Align (A)
**Purpose:** Set your strategic direction
- **Subsections:**
  - Vision & Mission (WWH Framework)
  - Strategic Objectives
  - Target Audience Definition
  - **UVP Builder** ⭐ (New visual wizard experience)
- **Key Outputs:** Goals, KPIs, primary UVP
- **Color Theme:** Purple (strategy, planning)

#### 3. Roadmap (R)
**Purpose:** Plan your path forward
- **Subsections:**
  - Channel Strategy
  - Content Pillars
  - Campaign Timeline
  - Resource Allocation
- **Key Outputs:** 90-day content roadmap, channel mix
- **Color Theme:** Green (growth, planning)

#### 4. Broadcast (B)
**Purpose:** Execute and launch
- **Subsections:**
  - Content Calendar
  - Campaign Manager
  - Publishing Workflow
  - Distribution Tracking
- **Key Outputs:** Published content, active campaigns
- **Color Theme:** Orange (action, energy)

#### 5. Assess (A)
**Purpose:** Measure results and learn
- **Subsections:**
  - Performance Dashboard
  - Content Analytics
  - Optimization Recommendations
  - Retrospectives
- **Key Outputs:** Performance reports, insights, action items
- **Color Theme:** Teal (analysis, insight)

### Migration Strategy

**Phase 1: Navigation Updates**
- Update sidebar labels (Measure → Mirror, Intend → Align, etc.)
- Add new icons for each section
- Update URL routes (/mirror/measure → /marba/mirror)

**Phase 2: Section Consolidation**
- Merge Reimagine + Reach → Roadmap
- Merge Optimize + Reflect → Assess
- Create new Broadcast section with content calendar

**Phase 3: Content Migration**
- Move existing data to new structure
- Update database schema (mirror_sections table)
- Preserve all user data during transition

---

## PART 2: UVP WIZARD REDESIGN

### Current Problems
❌ Generic form-filling experience
❌ Plain textarea inputs - not visual
❌ No drag-and-drop functionality
❌ No AI suggestions as selectable blocks
❌ Not leveraging industry-specific data
❌ No context from brand's industry profile
❌ Linear, boring flow - feels like paperwork

### Design Inspiration
The **IndustrySelector** from Synapse/brandock demonstrates the experience we want:
- ✅ Highly visual with animations
- ✅ Smart suggestions based on data
- ✅ Drag/select blocks + custom input
- ✅ Progress animations with AI reasoning
- ✅ Industry-specific intelligence
- ✅ Delightful, engaging flow

### New UVP Wizard Experience

The UVP Wizard will be a **standalone full-screen experience** that lives in the **Align section** and is **required before unlocking Roadmap, Broadcast, or Assess**.

---

## SCREEN-BY-SCREEN UVP WIZARD FLOW

### Screen 0: Entry Point (from Align Section)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  ALIGN SECTION                                   │
│  ┌───────────────────────────────────────────┐  │
│  │  🎯 Your Unique Value Proposition          │  │
│  │                                            │  │
│  │  ⚠️ Not Set                                │  │
│  │                                            │  │
│  │  Your UVP is the foundation of your brand  │  │
│  │  strategy. It defines why customers        │  │
│  │  choose you over competitors.              │  │
│  │                                            │  │
│  │  [✨ Create Your UVP →]                    │  │
│  │                                            │  │
│  │  💡 This 5-10 minute wizard will help you  │  │
│  │     craft a compelling value proposition   │  │
│  │     tailored to your industry.             │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Behavior:**
- Button opens full-screen modal/overlay
- Blocks Roadmap/Broadcast/Assess sections until complete
- Shows completion badge when finished

---

### Screen 1: Welcome & Context

**Full-screen animated wizard**

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Progress: ● ○ ○ ○ ○ ○]                           │
│                                                     │
│         🎯                                          │
│    LET'S BUILD YOUR                                 │
│  UNIQUE VALUE PROPOSITION                           │
│                                                     │
│  We'll use your industry data to suggest           │
│  messages that resonate with your audience.         │
│                                                     │
│  ✓ Industry-specific suggestions                   │
│  ✓ Competitor analysis                             │
│  ✓ Best practices from 10K+ brands                 │
│  ✓ AI-powered clarity scoring                      │
│                                                     │
│  Your Brand: Acme Dental                           │
│  Industry: Dental Practices (NAICS 621210)         │
│  Location: Austin, TX                              │
│                                                     │
│                                                     │
│                [Let's Begin →]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- Fade-in animation
- Shows brand context pulled from profile
- Single button to continue
- Duration: 3-5 seconds, then auto-advance (or manual)

---

### Screen 2: Problem Statement (P)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Progress: ● ● ○ ○ ○ ○]   1 of 6: The PROBLEM     │
│  [← Back]                                           │
│                                                     │
│  🔴 WHAT PROBLEM DO YOUR CUSTOMERS FACE?            │
│                                                     │
│  Select the challenges that resonate most with      │
│  your audience (drag to reorder, or write custom)   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  YOUR ANSWER (Drag blocks here)             │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │  [Selected Problem 1]              [x] │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │  [Selected Problem 2]              [x] │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │  [+ Add custom problem]                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  AI SUGGESTIONS (Click or drag)                    │
│  Based on 1,247 dental practices in your area:     │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 🎯 NEW PATIENTS ARE HARD TO ATTRACT       │      │
│  │ 📊 87% of dental practices struggle       │      │
│  │ [Drag or Click to Select]                 │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ ⏰ PATIENTS DON'T SHOW UP FOR APPTS       │      │
│  │ 📊 74% face no-show issues                │      │
│  │ [Drag or Click to Select]                 │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 💰 INSURANCE CLAIMS ARE A NIGHTMARE       │      │
│  │ 📊 62% cite administrative burden         │      │
│  │ [Drag or Click to Select]                 │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  [Show 5 more suggestions ↓]                       │
│                                                     │
│                         [Continue →] (disabled)     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Sources:**
- Industry profile (from `full_profile_data.common_problems`)
- Competitor analysis (scrape competitor websites)
- JTBD research data (from Synapse intelligence)
- Market research APIs (Perplexity, SerpAPI)

**Behavior:**
- Drag blocks from suggestions to answer area
- Click blocks to auto-add to answer
- Reorder by dragging within answer area
- Remove with [x] button
- Custom input via [+ Add custom] - opens textarea
- Minimum 1 problem required to continue
- Real-time character count
- Button enables when ≥1 selected

**Technical:**
```typescript
interface ProblemSuggestion {
  id: string
  text: string
  source: 'industry_profile' | 'competitor' | 'market_research'
  prevalence: number // % of brands facing this
  category: 'acquisition' | 'retention' | 'operations' | 'revenue'
}
```

---

### Screen 3: Solution Statement (S)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Progress: ● ● ● ○ ○ ○]   2 of 6: Your SOLUTION    │
│  [← Back]                                           │
│                                                     │
│  💡 HOW DO YOU SOLVE THESE PROBLEMS?                │
│                                                     │
│  Describe what makes your approach unique           │
│  (select approaches + add your unique twist)        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  YOUR SOLUTION (Build your message)         │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │ We combine [Approach 1] with           │ │   │
│  │  │ [Approach 2] to deliver [Outcome]      │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │  [Edit formula] [Write from scratch]       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  SELECT YOUR APPROACHES                             │
│  Choose what makes you different:                   │
│                                                     │
│  🤖 AI-POWERED                                      │
│  ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ AI Patient Matching  │ │ Smart Scheduling     │ │
│  │ [+] Select           │ │ [+] Select           │ │
│  └──────────────────────┘ └──────────────────────┘ │
│                                                     │
│  👥 HUMAN-CENTERED                                  │
│  ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ Concierge Service    │ │ 24/7 Support         │ │
│  │ [+] Select           │ │ [+] Select           │ │
│  └──────────────────────┘ └──────────────────────┘ │
│                                                     │
│  💼 EXPERTISE                                       │
│  ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ 20+ Years Experience │ │ Board Certified      │ │
│  │ [+] Select           │ │ [+] Select           │ │
│  └──────────────────────┘ └──────────────────────┘ │
│                                                     │
│  [+ Add custom approach]                            │
│                                                     │
│  📊 CLARITY SCORE: 72/100  ⚠️ Add more specifics   │
│                                                     │
│                                [Continue →]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Sources:**
- Industry best practices (from profiles)
- Common differentiators in sector
- Brand's existing mission/vision
- Competitor positioning analysis

**Behavior:**
- Multi-select approach blocks (not drag)
- Selected blocks highlight with checkmark
- Formula auto-fills with selections
- Can override formula with "Write from scratch"
- Real-time clarity scoring (debounced 500ms)
- Minimum 2 approaches required

**Technical:**
```typescript
interface SolutionApproach {
  id: string
  label: string
  category: 'technology' | 'service' | 'expertise' | 'speed' | 'value'
  commonInIndustry: boolean
  differentiationScore: number // 1-10
}
```

---

### Screen 4: Outcome Statement (O)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Progress: ● ● ● ● ○ ○]   3 of 6: The OUTCOME      │
│  [← Back]                                           │
│                                                     │
│  🎯 WHAT RESULTS DO YOUR CUSTOMERS ACHIEVE?         │
│                                                     │
│  Focus on tangible, measurable outcomes             │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  YOUR OUTCOMES (Drag to prioritize)         │   │
│  │  1. [Outcome Block 1]                  [x]  │   │
│  │  2. [Outcome Block 2]                  [x]  │   │
│  │  3. [Outcome Block 3]                  [x]  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  OUTCOME TEMPLATES                                  │
│  Drag or click to add:                              │
│                                                     │
│  ⏱️ TIME SAVINGS                                    │
│  ┌──────────────────────────────────────────┐      │
│  │ Save 10+ hours per week                  │      │
│  │ [Customize: ___ hours per ___]           │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  💰 REVENUE GROWTH                                  │
│  ┌──────────────────────────────────────────┐      │
│  │ Increase revenue by 25% in 90 days       │      │
│  │ [Customize: ___ % in ___ days]           │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  📈 EFFICIENCY                                      │
│  ┌──────────────────────────────────────────┐      │
│  │ Reduce no-shows by 40%                   │      │
│  │ [Customize: Reduce ___ by ___ %]         │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  😊 CUSTOMER SATISFACTION                           │
│  ┌──────────────────────────────────────────┐      │
│  │ 95% patient satisfaction rate             │      │
│  │ [Customize: ___ % ___ rate]              │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  [+ Write custom outcome]                           │
│                                                     │
│  💡 TIP: Include numbers and timeframes for impact  │
│                                                     │
│                                [Continue →]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Sources:**
- Industry benchmarks (from profiles)
- Common KPIs for sector
- Competitor outcome claims
- Case study data (if available)

**Behavior:**
- Drag blocks to answer area (reorder by priority)
- Click to expand inline editor for customization
- Fill-in-the-blank style for templates
- Custom outcomes via textarea
- Minimum 2 outcomes required
- Real-time validation (flag vague claims)

---

### Screen 5: WHY - Purpose Statement

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Progress: ● ● ● ● ● ○]   4 of 6: Your WHY         │
│  [← Back]                                           │
│                                                     │
│  ❤️ WHY DO YOU DO WHAT YOU DO?                      │
│                                                     │
│  Your purpose is your brand's core belief           │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  YOUR PURPOSE                               │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │ We believe that [purpose statement]    │ │   │
│  │  │                                        │ │   │
│  │  │                                        │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │  [Choose from templates] [Write your own]  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  PURPOSE STARTERS                                   │
│  Click to use as starting point:                    │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 🎯 MISSION-DRIVEN                         │      │
│  │ We believe everyone deserves [value]      │      │
│  │ [Edit & Use This]                         │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 💡 INNOVATION-FOCUSED                     │      │
│  │ We're reimagining [category] for [era]    │      │
│  │ [Edit & Use This]                         │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 🤝 COMMUNITY-CENTERED                     │      │
│  │ We exist to make [audience] feel [emotion]│      │
│  │ [Edit & Use This]                         │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ✨ INDUSTRY EXAMPLES                               │
│  See what similar brands say:                       │
│                                                     │
│  • "We believe dental care should be..."           │
│  • "Our mission is to transform..."                │
│  • "We exist to make healthcare..."                │
│                                                     │
│  [Show more examples ↓]                             │
│                                                     │
│  📊 Authenticity Score: --/100                      │
│                                                     │
│                                [Continue →]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Sources:**
- Brand's existing mission (if available)
- Industry purpose statements
- Competitor vision statements
- Purpose archetypes research

**Behavior:**
- Click template to load into editor
- Edit inline with live preview
- AI scores authenticity (flags corporate jargon)
- Min 20 characters required
- Suggestions based on P→S→O context

---

### Screen 6: Synthesis & Preview

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Progress: ● ● ● ● ● ●]   5 of 6: PREVIEW          │
│  [← Back]                                           │
│                                                     │
│  ✨ YOUR UNIQUE VALUE PROPOSITION                   │
│                                                     │
│  Here's what we've built together:                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │         [LOGO]  ACME DENTAL                 │   │
│  │                                             │   │
│  │  🎯 HEADLINE (auto-generated from S+O)     │   │
│  │  Get 40% more patients with AI-powered     │   │
│  │  scheduling that eliminates no-shows       │   │
│  │                                             │   │
│  │  📝 SUBHEADLINE (from WHY)                 │   │
│  │  We believe everyone deserves accessible,  │   │
│  │  stress-free dental care                   │   │
│  │                                             │   │
│  │  ✓ Outcome 1                               │   │
│  │  ✓ Outcome 2                               │   │
│  │  ✓ Outcome 3                               │   │
│  │                                             │   │
│  │  [Get Started →]                           │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📊 UVP SCORECARD                                   │
│  ┌──────────────────────────────────────────┐      │
│  │ Clarity:         █████████░ 88/100        │      │
│  │ Differentiation: ███████░░░ 72/100        │      │
│  │ Credibility:     ████████░░ 81/100        │      │
│  │ Conversion:      ████████░░ 79/100        │      │
│  │                                           │      │
│  │ Overall Score: 80/100  ⭐ STRONG          │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  💡 SUGGESTIONS TO IMPROVE                          │
│  • Add specific numbers to outcome 2                │
│  • Consider A/B testing headline variants           │
│  • Clarify your unique differentiator               │
│                                                     │
│  [Edit Problem] [Edit Solution] [Edit Outcomes]    │
│                                                     │
│                    [Save & Generate Big Reveal →]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Generation:**
- AI synthesizes P→S→O into headline
- WHY becomes subheadline
- Outcomes become bullet points
- Real-time scoring across 4 dimensions
- Actionable improvement suggestions

**Behavior:**
- Preview how UVP appears on website
- Edit any section without going back
- Scores update live as edits are made
- Can skip to any previous screen
- Final validation before reveal

---

### Screen 7: Big Reveal (Enhanced WWH)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ✨ GENERATING YOUR                     │
│           STRATEGIC FRAMEWORK...                    │
│                                                     │
│         [Animated Venn Diagram appears]             │
│                                                     │
│              P     S     O                          │
│               ╲   │   ╱                             │
│                 ╲ │ ╱                               │
│                  ★ ← Your UVP Sweet Spot            │
│                                                     │
│  [Fade in: BEFORE generic WWH]                     │
│                                                     │
│  WHY:  "We provide dental services"  (generic)      │
│  HOW:  "With experienced dentists"   (vague)        │
│  WHAT: "Dental care"                 (obvious)      │
│                                                     │
│  [Transition animation: → → →]                      │
│                                                     │
│  [Fade in: AFTER enhanced WWH]                     │
│                                                     │
│  WHY:  "We believe everyone deserves accessible,   │
│         stress-free dental care that fits their     │
│         busy lives"                                 │
│                                                     │
│  HOW:  "Through AI-powered scheduling, 24/7 online │
│         booking, and same-day appointments with     │
│         zero wait time"                             │
│                                                     │
│  WHAT: "Comprehensive family dentistry that saves  │
│         you 10+ hours per year and eliminates       │
│         no-show frustration"                        │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 📈 IMPROVEMENT: +87%                      │      │
│  │ ✓ +92% Clarity                            │      │
│  │ ✓ +84% Specificity                        │      │
│  │ ✓ +89% Differentiation                    │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│         [View Full Strategy] [Download PDF]        │
│                                                     │
│              [Save & Continue to Roadmap →]        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- 6-phase animation (as currently implemented)
- Auto-advance with manual skip option
- Shows before/after transformation
- Celebrates the improvement
- Downloads PDF export of UVP + WWH
- Saves to database and unlocks next sections

---

## TECHNICAL ARCHITECTURE

### Component Structure

```typescript
// Main wizard orchestrator
<UVPWizardExperience>
  <WizardProgress />
  <WizardScreen>
    {/* Screen 0 */}
    <WelcomeScreen />

    {/* Screen 1 */}
    <ProblemScreen
      suggestions={industryProblems}
      onSelect={handleProblemSelect}
      onCustomAdd={handleCustomProblem}
    />

    {/* Screen 2 */}
    <SolutionScreen
      approaches={industryApproaches}
      selectedProblems={problems}
      onSelect={handleSolutionSelect}
    />

    {/* Screen 3 */}
    <OutcomeScreen
      templates={outcomeTemplates}
      benchmarks={industryBenchmarks}
      onSelect={handleOutcomeSelect}
    />

    {/* Screen 4 */}
    <PurposeScreen
      starters={purposeStarters}
      examples={industryExamples}
      onChange={handlePurposeChange}
    />

    {/* Screen 5 */}
    <PreviewScreen
      uvpData={compiledUVP}
      scores={realTimeScores}
      onEdit={handleEdit}
      onSave={handleSaveAndReveal}
    />

    {/* Screen 6 */}
    <RevealExperience
      wwhData={enhancedWWH}
      onComplete={handleComplete}
    />
  </WizardScreen>
</UVPWizardExperience>
```

### Drag-and-Drop Implementation

```typescript
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'

// Draggable suggestion block
const SuggestionBlock: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: suggestion.id,
    data: suggestion
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {/* Block UI */}
    </div>
  )
}

// Droppable answer area
const AnswerArea: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({ id: 'answer-area' })

  return (
    <div ref={setNodeRef} className={isOver ? 'highlight' : ''}>
      {/* Answer blocks */}
    </div>
  )
}
```

### Data Services

```typescript
// Fetch industry-specific suggestions
class UVPSuggestionService {
  static async getProblemSuggestions(industryCode: string): Promise<ProblemSuggestion[]> {
    // 1. Query industry_profiles.full_profile_data.common_problems
    // 2. Query competitor websites via intelligence system
    // 3. Query market research via Perplexity API
    // 4. Merge and rank by prevalence
  }

  static async getSolutionApproaches(industryCode: string): Promise<SolutionApproach[]> {
    // 1. Query industry best practices
    // 2. Analyze competitor positioning
    // 3. Return categorized approaches
  }

  static async getOutcomeTemplates(industryCode: string): Promise<OutcomeTemplate[]> {
    // 1. Query industry benchmarks
    // 2. Return fillable templates with typical metrics
  }
}
```

### Scoring Engine

```typescript
class UVPScorer {
  static scoreClarity(text: string): number {
    // Use existing RealTimeScoring logic
  }

  static scoreDifferentiation(uvp: UVPData, competitors: CompetitorData[]): number {
    // Compare against competitor UVPs
    // Measure unique value prop elements
  }

  static scoreCredibility(uvp: UVPData): number {
    // Check for specifics, numbers, proof points
    // Flag vague claims, jargon
  }

  static scoreConversion(uvp: UVPData): number {
    // Analyze call-to-action clarity
    // Check emotional triggers
    // Validate outcome specificity
  }
}
```

---

## IMPLEMENTATION PHASES

### Phase 1: Framework Migration (Week 1)
- ✅ Rename sections (Measure → Mirror, etc.)
- ✅ Update navigation and routes
- ✅ Consolidate Reimagine+Reach → Roadmap
- ✅ Consolidate Optimize+Reflect → Assess
- ✅ Create new Broadcast section shell

### Phase 2: UVP Wizard Shell (Week 1-2)
- ✅ Create wizard modal/overlay component
- ✅ Build screen navigation system
- ✅ Implement progress indicator
- ✅ Add welcome and preview screens

### Phase 3: Interactive Screens (Week 2-3)
- ✅ Build Problem screen with drag-and-drop
- ✅ Build Solution screen with multi-select
- ✅ Build Outcome screen with templates
- ✅ Build Purpose screen with starters
- ✅ Implement @dnd-kit for drag functionality

### Phase 4: Data Integration (Week 3-4)
- ✅ Connect to industry profiles API
- ✅ Build suggestion services
- ✅ Integrate competitor analysis
- ✅ Add real-time scoring
- ✅ Implement AI synthesis engine

### Phase 5: Polish & Testing (Week 4)
- ✅ Animations and transitions
- ✅ Mobile responsiveness
- ✅ Accessibility (keyboard nav, screen readers)
- ✅ User testing and feedback
- ✅ Performance optimization

---

## SUCCESS METRICS

**User Engagement:**
- ✓ 80%+ completion rate (vs 40% current)
- ✓ Average time: 8-12 minutes (engaging, not tedious)
- ✓ 90%+ satisfaction score

**UVP Quality:**
- ✓ Average clarity score: 75+ (vs 60 current)
- ✓ 50%+ use industry suggestions
- ✓ 85%+ include specific outcomes

**Business Impact:**
- ✓ UVP completion unlocks Roadmap section
- ✓ 3x increase in content quality downstream
- ✓ Reduced onboarding support tickets

---

## MARBA LOOK & FEEL

### Design System

**Color Palette by Section:**
- Mirror (M): `blue-600` - Reflection, clarity
- Align (A): `purple-600` - Strategy, vision
- Roadmap (R): `green-600` - Growth, planning
- Broadcast (B): `orange-600` - Action, energy
- Assess (A): `teal-600` - Analysis, insight

**Typography:**
- Headlines: `font-bold text-2xl`
- Section labels: First letter in brand color, rest in muted
- Body: `text-base text-muted-foreground`

**Navigation Enhancement:**
- First letter of each section is styled as an icon/initial
- Larger size (text-2xl), bold, colored with section theme
- Example: **M**irror, **A**lign, **R**oadmap, **B**roadcast, **A**ssess
- Tooltips on hover explaining each section's purpose
- Tooltip content:
  - Mirror: "See where you are — your audience, market, and message today"
  - Align: "Set your direction — goals, results, and what success looks like"
  - Roadmap: "Plan how to get there — the channels, audience, and strategy"
  - Broadcast: "Create and launch — your content, campaigns, and offers"
  - Assess: "Reflect on results — measure, learn, and refine what works"

**Animations:**
- Framer Motion for all transitions
- 200-300ms duration (snappy, not sluggish)
- Ease-out timing for natural feel
- Micro-interactions on hover/drag

**Components:**
- shadcn/ui base components
- Custom wizard progress indicator
- Animated suggestion blocks
- Draggable cards with hover effects

---

## NEXT STEPS

1. ✅ **Review this proposal** - Confirm direction
2. ⏳ **Approve design mockups** - Screen-by-screen
3. ⏳ **Begin Phase 1** - Framework migration
4. ⏳ **Prototype drag-and-drop** - Validate UX
5. ⏳ **Build data services** - Industry suggestions
6. ⏳ **Full implementation** - 4-week timeline

---

## FINAL REQUIREMENTS (APPROVED)

1. ✅ **Quality First:** Build it right with best quality - no rush
2. ✅ **Drag-and-drop Everywhere:** Implement wherever it makes sense, BUT always provide custom input option
3. ✅ **AI Custom Input Parsing:** AI must understand, analyze, and apply all custom data entries
4. ✅ **Broadcast Section:** Create placeholder only - will be developed separately later
5. ✅ **Competitor Data:** Use API stack (Perplexity, SerpAPI, Rhodes) - not database lookups
6. ✅ **Data Migration:** Preserve existing MIRROR data, add new MARBA structure alongside

---

## IMPLEMENTATION STRATEGY

### Core Principles
- **Quality over speed** - Take time to build it right
- **Flexibility** - Every suggestion can be customized or replaced
- **Intelligence** - AI analyzes all inputs (suggested or custom)
- **Progressive enhancement** - Preserve existing features while adding new

### Drag-and-Drop Implementation
- Problem screen: Drag suggestions OR write custom
- Solution screen: Drag approaches OR write custom formula
- Outcome screen: Drag templates OR write custom outcomes
- All custom inputs parsed by AI for scoring and synthesis

### API Integration Architecture
```typescript
// Competitor UVP Service
class CompetitorIntelligenceService {
  // Use Perplexity to research competitor messaging
  static async getCompetitorUVPs(industry: string, location?: string)

  // Use SerpAPI to scrape competitor websites
  static async scrapeCompetitorWebsites(domain: string)

  // Use Rhodes AI for analysis
  static async analyzeCompetitorPositioning(competitors: string[])
}

// Industry Suggestions Service
class IndustrySuggestionsService {
  // Pull from industry_profiles.full_profile_data
  static async getIndustryProblems(naicsCode: string)

  // Use Perplexity for market research
  static async getMarketTrends(industry: string)

  // Combine data sources for suggestions
  static async synthesizeSuggestions(context: BrandContext)
}
```

---

**Implementation begins now! 🚀**
