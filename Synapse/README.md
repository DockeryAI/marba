# Synapse Content Generation System

**Copied from:** `/Users/byronhudson/brandock/Figma/`
**Date:** 2025-11-11
**Status:** Complete standalone copy with all dependencies

---

## Overview

Synapse is an AI-powered content generation system that creates high-performing marketing content based on breakthrough insights. It includes A/B variant generation, character count validation, section regeneration, and contrarian angle detection.

---

## Directory Structure

```
Synapse/
├── services/synapse/          # Core generation services
│   ├── SynapseGenerator.ts    # Main orchestrator
│   ├── generation/            # Content generation
│   │   ├── SynapseContentGenerator.ts     # Master generator
│   │   ├── VariantGenerator.ts            # A/B variant strategies (5 types)
│   │   ├── SectionRegenerator.ts          # Individual section regeneration
│   │   ├── PowerWordOptimizer.ts          # Power word optimization
│   │   ├── HumorOptimizer.ts              # Humor enhancement
│   │   ├── ContentFrameworkLibrary.ts     # Framework definitions
│   │   └── formats/                       # Format-specific generators
│   │       ├── ControversialPostGenerator.ts
│   │       ├── DataPostGenerator.ts
│   │       ├── HookPostGenerator.ts
│   │       ├── StoryPostGenerator.ts
│   │       ├── EmailGenerator.ts
│   │       ├── BlogGenerator.ts
│   │       └── LandingPageGenerator.ts
│   ├── validation/            # Content validation
│   │   └── CharacterValidator.ts          # Platform character limits
│   └── analysis/              # Content analysis
│       └── ContrarianAngleDetector.ts     # Competitor analysis
│
├── components/synapse/        # React UI components
│   ├── ContentEnhancements.tsx            # Main enhancement UI
│   ├── CharacterCountBadge.tsx            # Validation badges
│   ├── ProvenanceViewer.tsx               # Data source tracking
│   └── EdginessSlider.tsx                 # Content edginess control
│
├── config/                    # Configuration
│   └── platformLimits.ts                  # Character limits for 8 platforms
│
├── types/                     # TypeScript definitions
│   ├── synapseContent.types.ts            # Core content types
│   ├── breakthrough.types.ts              # Insight types
│   └── deepContext.types.ts               # Deep context types
│
├── data/                      # Static data
│   └── powerWords.json                    # Power word database
│
├── pages/                     # Example implementation
│   └── SynapseTest.tsx                    # Full demo page
│
└── docs/                      # Documentation
    ├── CONTENT_ENHANCEMENTS_PROGRESS.md
    └── CONTENT_ENHANCEMENTS_GAP_ANALYSIS.md
```

---

## Folder Structure

```
Synapse/
├── [CORE SYNAPSE - Content Generation Engine]
│   ├── services/synapse/          # Content generation services
│   ├── components/synapse/        # UI components for content features
│   ├── types/                     # Type definitions
│   ├── config/                    # Platform configurations
│   ├── data/                      # Power words database
│   ├── pages/                     # Example pages (deprecated - use demo-ui)
│   └── docs/                      # Documentation
│
└── demo-ui/                       # DEMO UI + DEPENDENCIES
    ├── pages/SynapseTest.tsx      # Full-featured demo page
    ├── services/
    │   ├── contentIntelligence/   # Business data collection
    │   └── industry/              # Industry detection/matching
    ├── components/onboarding-v5/  # Industry selector UI
    ├── data/                      # NAICS industry codes
    ├── lib/                       # Intelligence types
    └── utils/                     # Supabase client
```

**Core Synapse:** 32 files (~384KB) - Self-contained content generation engine
**Demo UI:** 27 files (~544KB) - Full demo page with data collection layer

See `demo-ui/README.md` for details on the demo UI and its dependencies.

---

## Features

### 1. A/B Variant Generation
**File:** `services/synapse/generation/VariantGenerator.ts`

Generates A/B test variants using 5 psychological strategies:
- Scarcity (limited availability)
- FOMO (fear of missing out)
- Exclusivity (VIP positioning)
- Urgency (time-sensitive)
- Social Proof (bandwagon effect)

**API:** Claude 3.5 Sonnet via OpenRouter
**Temperature:** 0.8 for creative variations

### 2. Character Count Validation
**Files:**
- `config/platformLimits.ts`
- `services/synapse/validation/CharacterValidator.ts`

Validates content against platform-specific limits for:
- LinkedIn (3000 chars)
- Twitter (280 chars)
- Facebook (5000 chars)
- Instagram (2200 chars)
- Email (10000 chars)
- Blog (50000 chars)
- SMS (160 chars)
- Reddit (40000 chars)

Status levels: valid, warning, error

### 3. Section Regeneration
**File:** `services/synapse/generation/SectionRegenerator.ts`

Regenerates individual content sections without regenerating entire piece:
- Headline regeneration (3-5 variations)
- Hook regeneration (3-5 variations)
- Body regeneration (3-5 variations)
- CTA regeneration (3-5 variations)

Each includes section-specific best practice guidelines.

### 4. Contrarian Angle Detection
**File:** `services/synapse/analysis/ContrarianAngleDetector.ts`

AI-powered competitor analysis for differentiation:
- Extracts common competitor claims from insights
- Generates "everyone says X, but actually Y" angles
- Validates authenticity and truthfulness
- Assesses risk level (low/medium/high)
- Ranks by differentiation potential

### 5. Content Frameworks
**File:** `services/synapse/generation/ContentFrameworkLibrary.ts`

Multiple content format generators:
- Controversial Posts (opinion/stance)
- Data Posts (statistics/research)
- Hook Posts (curiosity-driven)
- Story Posts (narrative)
- Email campaigns
- Blog articles
- Landing pages

### 6. Power Word Optimization
**Files:**
- `services/synapse/generation/PowerWordOptimizer.ts`
- `data/powerWords.json`

Enhances content with psychology-driven power words categorized by emotion and impact.

### 7. Deep Provenance Tracking
**Component:** `components/synapse/ProvenanceViewer.tsx`

Tracks content generation sources:
- Data sources used
- Psychology selection reasoning
- Topic correlation scores
- Insight connections

---

## External Dependencies

### Required NPM Packages
```json
{
  "react": "^18.x",
  "lucide-react": "^0.x",
  "framer-motion": "^10.x"
}
```

### API Requirements
- **OpenRouter API Key:** Required for Claude 3.5 Sonnet
- Environment variable: `VITE_OPENROUTER_API_KEY`
- Fallback hardcoded key available in code

### Type Imports
All type definitions are included in `types/` directory:
- `synapseContent.types.ts` - Core content types
- `breakthrough.types.ts` - Insight types
- `deepContext.types.ts` - Deep context types

---

## Usage Example

```typescript
import { SynapseContentGenerator } from './services/synapse/generation/SynapseContentGenerator';
import type { BusinessProfile } from './types/synapseContent.types';
import type { BreakthroughInsight } from './types/breakthrough.types';

const generator = new SynapseContentGenerator();

// Generate content
const content = await generator.generateContent(
  insight,
  business,
  'CONTROVERSIAL-POST'
);

// Generate A/B variants
const variants = await generator.generateVariants(content, business);

// Validate character counts
const validation = generator.validateContent(content, ['LinkedIn', 'Twitter']);

// Regenerate a section
const result = await generator.regenerateSection(
  content,
  'headline',
  business,
  insight
);
```

---

## Integration Notes

### Path Aliases
The original code uses Vite path aliases:
- `@/services/*` → `services/*`
- `@/components/*` → `components/*`
- `@/types/*` → `types/*`
- `@/config/*` → `config/*`
- `@/data/*` → `data/*`

Update these in your `vite.config.ts` or `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./Synapse/*"]
    }
  }
}
```

### Dark Mode Support
All components include Tailwind CSS dark mode classes:
- `dark:bg-*` - Background colors
- `dark:text-*` - Text colors
- `dark:border-*` - Border colors

---

## Code Statistics

**Total Files:** 28
**Total Lines:** ~1,791 lines of TypeScript/TSX
**TypeScript Errors:** 0 (all code compiles cleanly)

**Breakdown:**
- Services: 16 files
- Components: 4 files
- Configuration: 1 file
- Types: 3 files
- Data: 1 file
- Pages: 1 file
- Documentation: 2 files

---

## Key Features Summary

✅ A/B Variant Generator (5 strategies)
✅ Character Count Validation (8 platforms)
✅ Competitor Contrarian Angle Detection
✅ Section Regenerator (all 4 sections)
✅ Power Word Optimization
✅ Humor Enhancement
✅ Deep Provenance Tracking
✅ 7 Content Format Generators
✅ Dark Mode Support Throughout
✅ Full TypeScript Support

---

## Recent Updates

**Latest Fix (2025-11-11):**
Fixed CSS gradient rendering issue in ContentEnhancements.tsx button. Changed from Tailwind gradient classes to inline CSS styles for guaranteed visibility.

**Location:** `components/synapse/ContentEnhancements.tsx:191-196`

---

## Testing

All features have been tested and are ready for production use. See the demo page at `pages/SynapseTest.tsx` for a complete implementation example.

---

## License & Source

This code is part of the MARBA project. All rights reserved.

**Original Source:** `/Users/byronhudson/brandock/Figma/`
**Copied To:** `~/Projects/MARBA/Synapse/`
**Date:** 2025-11-11
