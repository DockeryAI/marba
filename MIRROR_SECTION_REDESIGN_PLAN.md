# Mirror Section Redesign - Implementation Plan

## Vision
Transform Mirror from 9 confusing subsections into 3 powerful diagnostics that give SMB owners **the truth** about where they stand.

---

## Core Philosophy
**Pre-UVP:** "Let's see where you really stand"
**Post-UVP:** "Let's see how well you're executing your value proposition"

---

## Architecture Overview

### New Structure
```
MeasureSection (Mirror)
├── MirrorHealthDashboard (1 screen summary)
│   ├── Market Position Score
│   ├── Customer Match Score
│   └── Brand Clarity Score
│
├── Three Diagnostic Sections (expandable)
│   ├── MarketPositionSection
│   ├── CustomerTruthSection
│   └── BrandFitSection
│
└── MirrorMomentSummary
    └── "Your 3 biggest gaps to fix"
```

### Old Structure (To Remove)
- ❌ 9 separate subsection components
- ❌ WWH Framework card
- ❌ "Ask Marbs" button
- ❌ Manual "Analyze" buttons
- ❌ SubsectionTabs navigation

---

## Database Schema

### Table: `mirror_diagnostics`
```sql
CREATE TABLE mirror_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id),

  -- Scores
  market_position_score INTEGER, -- 0-100
  customer_match_score INTEGER,  -- 0-100
  brand_clarity_score INTEGER,   -- 0-100
  overall_health_score INTEGER,  -- 0-100

  -- Market Position Data
  market_position_data JSONB,
  -- {
  --   current_rank: number,
  --   total_competitors: number,
  --   top_competitors: [...],
  --   keyword_rankings: {...},
  --   competitive_gaps: [...]
  -- }

  -- Customer Truth Data
  customer_truth_data JSONB,
  -- {
  --   expected_demographic: string,
  --   actual_demographic: string,
  --   match_percentage: number,
  --   why_they_choose: [...],
  --   common_objections: [...],
  --   buyer_journey_gaps: [...]
  -- }

  -- Brand Fit Data
  brand_fit_data JSONB,
  -- {
  --   messaging_consistency: number,
  --   touchpoint_analysis: {...},
  --   perceived_positioning: string,
  --   differentiation_score: number,
  --   clarity_issues: [...]
  -- }

  -- Mirror Moment (Top 3 Gaps)
  critical_gaps JSONB,
  -- [
  --   { gap: string, impact: string, fix: string, priority: number }
  -- ]

  -- UVP Enhancement (Post-UVP only)
  uvp_delivery_analysis JSONB, -- null pre-UVP
  -- {
  --   uvp_promise: string,
  --   delivery_score: number,
  --   customer_confirmation: number,
  --   alignment_gaps: [...]
  -- }

  -- Metadata
  has_completed_uvp BOOLEAN DEFAULT false,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mirror_brand ON mirror_diagnostics(brand_id);
CREATE INDEX idx_mirror_analyzed ON mirror_diagnostics(analyzed_at DESC);
```

---

## Service Layer

### 1. MarketPositionService
**File:** `src/services/mirror/market-position.service.ts`

**Responsibilities:**
- Discover real competitors via Perplexity
- Get SERP rankings for industry keywords
- Scrape competitor websites for positioning
- Calculate market position score
- Identify competitive gaps

**APIs Used:**
- Perplexity API (competitor discovery)
- Custom SERP analyzer
- Website Scraper

**Key Methods:**
```typescript
analyzeMarketPosition(brandId: string, brandData: BrandData): Promise<MarketPositionAnalysis>
discoverCompetitors(industry: string, location: string): Promise<Competitor[]>
getRankings(brandName: string, keywords: string[]): Promise<Rankings>
findCompetitiveGaps(brand: Brand, competitors: Competitor[]): Promise<Gap[]>
calculatePositionScore(analysis: MarketPositionAnalysis): number
```

### 2. CustomerTruthService
**File:** `src/services/mirror/customer-truth.service.ts`

**Responsibilities:**
- Mine reviews for "why I chose" patterns
- Analyze actual buyer demographics
- Compare expected vs actual customers
- Extract common objections
- Map buyer journey gaps

**APIs Used:**
- Review mining (Google/Yelp APIs)
- OpenRouter AI (pattern extraction)
- Analytics API (demographics)

**Key Methods:**
```typescript
analyzeCustomerTruth(brandId: string, brandData: BrandData): Promise<CustomerTruthAnalysis>
mineReviews(businessName: string): Promise<ReviewInsights>
compareExpectedVsActual(expected: Profile, actual: Profile): Promise<Alignment>
extractWhyTheyChose(reviews: Review[]): Promise<Reason[]>
calculateMatchScore(analysis: CustomerTruthAnalysis): number
```

### 3. BrandFitService
**File:** `src/services/mirror/brand-fit.service.ts`

**Responsibilities:**
- Analyze messaging consistency across touchpoints
- Compare "what you say" vs "what they hear"
- Assess differentiation strength
- Check trust signals
- Calculate brand clarity score

**APIs Used:**
- OpenRouter AI (messaging analysis)
- Website Analyzer
- Social media APIs

**Key Methods:**
```typescript
analyzeBrandFit(brandId: string, brandData: BrandData): Promise<BrandFitAnalysis>
checkMessagingConsistency(touchpoints: Touchpoint[]): Promise<ConsistencyScore>
analyzePerceptionGap(claimed: string, perceived: string): Promise<Gap>
assessDifferentiation(brand: Brand, competitors: Competitor[]): Promise<DiffScore>
calculateClarityScore(analysis: BrandFitAnalysis): number
```

### 4. MirrorOrchestratorService
**File:** `src/services/mirror/mirror-orchestrator.service.ts`

**Responsibilities:**
- Coordinate all three services
- Run full diagnostic
- Calculate overall health score
- Identify top 3 critical gaps
- Save to database
- Enhance with UVP context (post-UVP)

**Key Methods:**
```typescript
runFullDiagnostic(brandId: string): Promise<MirrorDiagnostic>
enhanceWithUVP(diagnostic: MirrorDiagnostic, uvp: UVP): Promise<EnhancedDiagnostic>
identifyCriticalGaps(diagnostic: MirrorDiagnostic): Promise<Gap[]>
saveDiagnostic(brandId: string, diagnostic: MirrorDiagnostic): Promise<void>
loadLatestDiagnostic(brandId: string): Promise<MirrorDiagnostic | null>
```

---

## Component Layer

### 1. MirrorHealthDashboard
**File:** `src/components/mirror/diagnostics/MirrorHealthDashboard.tsx`

**Purpose:** Single-screen overview of health scores

**Layout:**
```tsx
<Card>
  <div className="grid grid-cols-3 gap-4">
    <ScoreCard
      title="Market Position"
      score={72}
      status="needs-work"
      rank="#4 of 12"
    />
    <ScoreCard
      title="Customer Match"
      score={60}
      status="misaligned"
      message="Wrong audience"
    />
    <ScoreCard
      title="Brand Clarity"
      score={45}
      status="confusing"
      message="Mixed messages"
    />
  </div>

  <OverallHealthBar score={59} />

  <QuickActions>
    <Button>Dive Into Market Position</Button>
    <Button>See Customer Truth</Button>
    <Button>Check Brand Fit</Button>
  </QuickActions>
</Card>
```

### 2. MarketPositionSection
**File:** `src/components/mirror/diagnostics/MarketPositionSection.tsx`

**Purpose:** Deep dive into competitive reality

**Pre-UVP View:**
- Current market rank
- Top 3 competitors analysis
- What they do that you don't
- Keyword gap analysis
- Pricing position

**Post-UVP View:**
- UVP keyword rankings
- Differentiation delivery
- Competitive advantage validation
- Market recognition of UVP
- White space opportunities

### 3. CustomerTruthSection
**File:** `src/components/mirror/diagnostics/CustomerTruthSection.tsx`

**Purpose:** Who really buys and why

**Pre-UVP View:**
- Expected vs actual demographics
- Real "why I chose" reasons
- Price vs value positioning
- Common objections
- Journey drop-off points

**Post-UVP View:**
- UVP-customer alignment
- Delivery on promises
- Customer confirmation quotes
- NPS trend (before/after UVP)
- Loyalty indicators

### 4. BrandFitSection
**File:** `src/components/mirror/diagnostics/BrandFitSection.tsx`

**Purpose:** Message clarity and perception

**Pre-UVP View:**
- Messaging consistency score
- What you say in 5 places
- What customers think you do
- Perception gaps
- Differentiation reality

**Post-UVP View:**
- UVP consistency across touchpoints
- Market perception alignment
- Differentiation proof
- Message evolution
- Next messaging opportunities

### 5. MirrorMomentSummary
**File:** `src/components/mirror/diagnostics/MirrorMomentSummary.tsx`

**Purpose:** The "So what?" — Top 3 gaps

**Layout:**
```tsx
<Card className="border-2 border-destructive">
  <h3>Your 3 Biggest Gaps to Fix</h3>

  <GapCard priority={1}>
    <GapTitle>You're competing on price, not value</GapTitle>
    <GapImpact>Losing 40% margin and attracting wrong customers</GapImpact>
    <GapFix>Define clear value proposition → Align section</GapFix>
    <FixButton>Start UVP Flow</FixButton>
  </GapCard>

  <GapCard priority={2}>
    <GapTitle>Message is inconsistent across 5 touchpoints</GapTitle>
    <GapImpact>45% clarity score - customers confused</GapImpact>
    <GapFix>Unify messaging with strategic framework</GapFix>
  </GapCard>

  <GapCard priority={3}>
    <GapTitle>Targeting wrong demographic</GapTitle>
    <GapImpact>60% of revenue from unexpected segment</GapImpact>
    <GapFix>Realign targeting or pivot positioning</GapFix>
  </GapCard>
</Card>
```

### 6. New MeasureSection (Refactored)
**File:** `src/components/mirror/measure/MeasureSection.tsx`

**New Structure:**
```tsx
export const MeasureSection = ({ brandId, brandData }) => {
  const [diagnostic, setDiagnostic] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasCompletedUVP, setHasCompletedUVP] = useState(false)

  // Auto-analyze on mount
  useEffect(() => {
    if (brandData && !diagnostic) {
      runDiagnostic()
    }
  }, [brandData])

  const runDiagnostic = async () => {
    setIsAnalyzing(true)
    const result = await MirrorOrchestratorService.runFullDiagnostic(brandId)
    setDiagnostic(result)
    setIsAnalyzing(false)
  }

  return (
    <div>
      <MirrorSectionHeader
        title="Mirror"
        description="The honest truth about where you stand"
        actions={<RefreshButton />}
      />

      {isAnalyzing && <LoadingState />}

      {diagnostic && (
        <>
          <MirrorHealthDashboard diagnostic={diagnostic} />

          <Accordion>
            <MarketPositionSection
              data={diagnostic.marketPosition}
              hasCompletedUVP={hasCompletedUVP}
            />
            <CustomerTruthSection
              data={diagnostic.customerTruth}
              hasCompletedUVP={hasCompletedUVP}
            />
            <BrandFitSection
              data={diagnostic.brandFit}
              hasCompletedUVP={hasCompletedUVP}
            />
          </Accordion>

          <MirrorMomentSummary gaps={diagnostic.criticalGaps} />
        </>
      )}
    </div>
  )
}
```

---

## Implementation Steps

### Phase 1: Foundation (Steps 1-5)
1. ✅ Create plan document
2. Create database migration
3. Create MarketPositionService
4. Create CustomerTruthService
5. Create BrandFitService

### Phase 2: Orchestration (Steps 6-10)
6. Create MirrorOrchestratorService
7. Build MirrorHealthDashboard component
8. Build MarketPositionSection component
9. Build CustomerTruthSection component
10. Build BrandFitSection component

### Phase 3: Integration (Steps 11-14)
11. Build MirrorMomentSummary component
12. Refactor MeasureSection with new architecture
13. Add Pre-UVP vs Post-UVP logic
14. Integrate auto-analysis

### Phase 4: Cleanup (Steps 15)
15. Remove old subsection components

### Phase 5: Testing (Steps 16-18)
16. Test all API endpoints
17. Test UI end-to-end
18. Gap analysis: built vs plan

### Phase 6: Delivery (Steps 19-20)
19. Build production bundle
20. Commit + create overview doc

---

## Success Criteria

### Functional
- ✅ Auto-analyzes on brand data entry (no manual buttons)
- ✅ Shows 3 clear diagnostics (not 9 confusing subsections)
- ✅ Different insights pre/post UVP
- ✅ All scores calculate correctly
- ✅ Top 3 gaps identified accurately
- ✅ APIs integrated and working
- ✅ Data persists to database

### UX
- ✅ Can be understood in 5 minutes
- ✅ Every insight has clear "what this means"
- ✅ Natural bridge to Align section
- ✅ No redundant/duplicate content
- ✅ Mobile responsive

### Technical
- ✅ All TypeScript types defined
- ✅ Error handling on all API calls
- ✅ Loading states for async operations
- ✅ Data caching to avoid re-analysis
- ✅ Build passes with no errors
- ✅ E2E tests pass

---

## API Integration Details

### Perplexity API
- **Endpoint:** `/api/search`
- **Usage:** Competitor discovery
- **Rate Limit:** Handle gracefully
- **Fallback:** Use cached industry data

### SERP Analysis
- **Custom implementation**
- **Data:** Google search rankings
- **Caching:** 24 hours

### Review Mining
- **Sources:** Google, Yelp APIs
- **Extraction:** OpenRouter AI for patterns
- **Privacy:** Anonymize customer data

### OpenRouter AI
- **Model:** Claude 3.5 Sonnet
- **Usage:** Messaging analysis, pattern extraction
- **Prompts:** System prompts in `/src/services/mirror/prompts/`

---

## File Structure

```
src/
├── services/mirror/
│   ├── market-position.service.ts
│   ├── customer-truth.service.ts
│   ├── brand-fit.service.ts
│   ├── mirror-orchestrator.service.ts
│   └── prompts/
│       ├── market-analysis.prompt.ts
│       ├── customer-analysis.prompt.ts
│       └── brand-analysis.prompt.ts
│
├── components/mirror/
│   ├── measure/
│   │   └── MeasureSection.tsx (refactored)
│   │
│   └── diagnostics/
│       ├── MirrorHealthDashboard.tsx
│       ├── MarketPositionSection.tsx
│       ├── CustomerTruthSection.tsx
│       ├── BrandFitSection.tsx
│       └── MirrorMomentSummary.tsx
│
└── types/
    └── mirror-diagnostics.ts

supabase/migrations/
└── 20251113000002_create_mirror_diagnostics.sql
```

---

## Notes for Handoff

- Each task is atomic and can be completed independently
- All API calls have error handling and fallbacks
- Mock data available for development without API keys
- Components use shared UI library (shadcn/ui)
- Services are stateless and testable
- Database migration is reversible

