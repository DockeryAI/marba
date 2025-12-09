# Build: UVP-Synapse Integration

**Created:** 2025-12-08
**Status:** Not Started

## Overview

Port the 6-step UVP wizard from ~/Projects/Synapse and create a conversion layer that uses UVP data to enhance Synapse content output with targeted CTAs, proof points, and risk reversals - without changing the content generation engine.

**Key Principle:** Synapse creates attention (unexpected content). UVP creates action (conversion elements). The bridge makes them feel like one continuous experience.

---

## Backend Configuration

**Supabase Project:** Use ~/Projects/Synapse Supabase instance
- All edge functions already deployed
- All API keys configured in Supabase secrets
- Database schema includes UVP tables

**Environment Setup:**
- Copy Synapse `.env` Supabase credentials to MARBA `.env`
- Required variables:
  - `VITE_SUPABASE_URL` (from Synapse)
  - `VITE_SUPABASE_ANON_KEY` (from Synapse)

**Edge Functions Available (Synapse Supabase):**
- `ai-proxy` - Routes to OpenRouter (Claude), Perplexity, OpenAI
- `perplexity-proxy` - Direct Perplexity API access
- `fetch-serper` - Google Search via Serper
- `fetch-outscraper` - Google Business data
- `scrape-website` - Website content extraction
- `analyze-website-ai` - Claude-powered website analysis
- `enrich-with-synapse` - Synapse enhancement

**Database Tables (Already Exist):**
- `brand_uvps` - Wizard progress tracking
- `value_statements` - Stored UVP variants
- `uvp_components` - Reusable building blocks
- `uvp_ab_tests` - A/B test configurations

---

## Phases

### Phase 1: Port UVP Wizard Services
**Status:** not_started
**Goal:** AI-powered UVP suggestions and scoring working in MARBA

**Deliverables:**
- [ ] Copy `.env` Supabase config from Synapse to MARBA
- [ ] Port `src/config/uvp-wizard-steps.ts` from Synapse
- [ ] Port `src/services/uvp-wizard/rhodes-ai.ts` (Claude via ai-proxy)
- [ ] Port `src/services/uvp-wizard/perplexity-api.ts` (via perplexity-proxy)
- [ ] Port `src/services/uvp-wizard/serp-api.ts` (via fetch-serper)
- [ ] Port `src/services/uvp-wizard/uvp-scoring.ts` (quality assessment)
- [ ] Update import paths to match MARBA structure
- [ ] Verify edge function connectivity

**Success Criteria:**
- Can call rhodes-ai and get Claude response
- Can call perplexity-api and get industry insights
- Can call serp-api and get competitor data
- Can call uvp-scoring and get quality assessment

**Source Files:**
```
~/Projects/Synapse/src/config/uvp-wizard-steps.ts
~/Projects/Synapse/src/services/uvp-wizard/rhodes-ai.ts
~/Projects/Synapse/src/services/uvp-wizard/perplexity-api.ts
~/Projects/Synapse/src/services/uvp-wizard/serp-api.ts
~/Projects/Synapse/src/services/uvp-wizard/uvp-scoring.ts
```

---

### Phase 2: Port UVP Wizard UI
**Status:** not_started
**Depends on:** Phase 1

**Goal:** Complete 6-step UVP wizard working in MARBA

**Deliverables:**
- [ ] Port `src/contexts/UVPWizardContext.tsx`
- [ ] Port `src/components/uvp-wizard/UVPWizard.tsx`
- [ ] Port wizard step components (WelcomeScreen, WizardStepScreen)
- [ ] Port `src/components/uvp-wizard/SuggestionPanel.tsx`
- [ ] Port `src/components/uvp-wizard/DropZone.tsx`
- [ ] Port `src/components/uvp-wizard/DraggableItem.tsx`
- [ ] Port `src/components/uvp-wizard/EditableSuggestion.tsx`
- [ ] Port `src/components/uvp-wizard/WizardProgress.tsx`
- [ ] Adapt UI imports to use `~/Projects/ui-libraries/` (shadcn, Radix)
- [ ] Style with dark theme per MARBA design system

**Success Criteria:**
- Can navigate through all 6 wizard steps
- AI suggestions appear for each step
- Can drag-drop or type custom inputs
- Real-time scoring displays
- Data saves to `brand_uvps` table on completion

**Source Files:**
```
~/Projects/Synapse/src/contexts/UVPWizardContext.tsx
~/Projects/Synapse/src/components/uvp-wizard/*
```

---

### Phase 3: Wire Into MARBA Flow
**Status:** not_started
**Depends on:** Phase 2

**Goal:** UVP wizard integrated into brand onboarding

**Deliverables:**
- [ ] Add UVP wizard route to MARBA router
- [ ] Trigger UVP wizard after brand creation (if no UVP exists)
- [ ] Add UVP completion check before content generation
- [ ] Create UVP status indicator in SynapsePage
- [ ] Add "Edit UVP" button in brand settings area
- [ ] Handle incomplete UVP gracefully (prompt to complete)

**Success Criteria:**
- New brands automatically go to UVP wizard
- Existing brands without UVP get prompted
- UVP data available in Synapse content generation context

---

### Phase 4: UVP Conversion Layer (NEW CODE)
**Status:** not_started
**Depends on:** Phase 3

**Goal:** Synapse content enhanced with UVP-powered CTAs and proof

**Deliverables:**
- [ ] Create `src/services/uvp/UVPConversionEngine.ts`
- [ ] Implement `detectTensionType()` - analyze content angle
- [ ] Implement `generateBridge()` - connect content to CTA
- [ ] Implement `buildCTA()` - pull from UVP fields by tension type
- [ ] Implement `buildProofBar()` - reviews, years, certifications
- [ ] Implement `buildRiskReversal()` - guarantees from UVP
- [ ] Create `src/services/uvp/tension-templates.ts` - bridge templates
- [ ] Add `enhance()` method to wrap Synapse output
- [ ] Hook into `SynapseGenerator.ts` post-generation

**Tension Types:**
- `timing_urgency` - Content about windows, deadlines, seasons
- `trust_credibility` - Content about quality, reliability
- `cost_value` - Content about money, ROI, investment
- `availability_access` - Content about scarcity, competition
- `pain_resolution` - Content about problems, frustrations

**Bridge Templates (per tension type):**
```
timing_urgency → "While most [industry] businesses are backed up for weeks, [brand] was built for exactly this moment."
trust_credibility → "Finding someone you can actually trust with [problem] shouldn't be this hard. [brand] has spent [years] earning [review_count] five-star reviews."
cost_value → "The real cost isn't the price tag—it's what happens when you choose wrong. [brand] guarantees [key_benefit] or [guarantee]."
pain_resolution → "You don't have to keep living with [problem]. [brand] exists because [unique_solution]."
```

**Success Criteria:**
- Content includes UVP-powered CTA that matches content angle
- Proof bar displays real UVP data (reviews, years, certs)
- Risk reversal shows actual guarantee
- Bridge sentence connects content to CTA naturally
- CTA feels like resolution of content tension, not a pivot

---

### Phase 5: Integration & Testing
**Status:** not_started
**Depends on:** Phase 4

**Goal:** End-to-end flow working and validated

**Deliverables:**
- [ ] Test: brand creation → UVP wizard → content generation → enhanced output
- [ ] Test bridge quality across all 5 tension types
- [ ] Test with various industries (restaurant, roofer, lawyer, etc.)
- [ ] Test with minimal UVP (only required fields)
- [ ] Test with complete UVP (all fields including proof points)
- [ ] Add error handling for missing UVP fields
- [ ] Add fallback CTAs when UVP incomplete
- [ ] Performance test (lazy loading, caching)

**Success Criteria:**
- Full flow completes without errors
- Content reads as one continuous piece from hook to CTA
- Different tension types produce different bridges/CTAs
- Graceful degradation when UVP fields missing

---

## Out of Scope (Future Enhancements)

- Journey stage CTA adaptation (awareness vs. decision)
- Persona-specific CTA routing
- A/B testing infrastructure for CTAs
- Real-time conversion tracking
- UVP variant management UI
- Performance feedback loops
- Multi-language support

---

## Key Files Summary

| Source (Synapse) | Destination (MARBA) | Action |
|------------------|---------------------|--------|
| `config/uvp-wizard-steps.ts` | `src/config/uvp-wizard-steps.ts` | Port |
| `services/uvp-wizard/rhodes-ai.ts` | `src/services/uvp-wizard/rhodes-ai.ts` | Port |
| `services/uvp-wizard/perplexity-api.ts` | `src/services/uvp-wizard/perplexity-api.ts` | Port |
| `services/uvp-wizard/serp-api.ts` | `src/services/uvp-wizard/serp-api.ts` | Port |
| `services/uvp-wizard/uvp-scoring.ts` | `src/services/uvp-wizard/uvp-scoring.ts` | Port |
| `contexts/UVPWizardContext.tsx` | `src/contexts/UVPWizardContext.tsx` | Port |
| `components/uvp-wizard/*` | `src/components/uvp-wizard/*` | Port |
| N/A | `src/services/uvp/UVPConversionEngine.ts` | New |
| N/A | `src/services/uvp/tension-templates.ts` | New |

---

## The Bridge Formula

```
Synapse Content (creates tension)
       ↓
Tension Detection (what loop opened?)
       ↓
Bridge Generation (acknowledges tension, positions brand)
       ↓
UVP-Powered CTA (resolves tension with action)
       +
Proof Bar (credibility from UVP)
       +
Risk Reversal (removes final objection)
       ↓
Enhanced Content (attention → action)
```

**The reader should feel:** "That's a really interesting angle... oh and they can actually help me with this... and they have proof... and there's no risk... okay, I'm clicking."

---

## Session Log

*Will be populated by /save command*
