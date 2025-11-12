# Synapse Demo UI

**Location:** `/Users/byronhudson/Projects/MARBA/Synapse/demo-ui/`
**Purpose:** Full demo page and all its dependencies for testing Synapse content generation

---

## Overview

This folder contains the complete SynapseTest demo page and all services, components, and data files it depends on. It demonstrates the full end-to-end workflow of Synapse content generation.

---

## What's Inside

### Demo Page (1 file)
- **`pages/SynapseTest.tsx`** - Full-featured demo page for Synapse content generation
  - Business intelligence collection
  - Synapse insight generation
  - Content generation from insights
  - A/B variant testing UI
  - Character count validation
  - Section regeneration
  - Humor optimization
  - Provenance tracking

### Services (17 files)

#### Content Intelligence (7 files)
- **`services/contentIntelligence/`**
  - `dataAdapter.ts` - Collects and transforms business data
  - `orchestrator.ts` - Orchestrates intelligence gathering
  - `scorer.ts` - Scores content quality
  - `validator.ts` - Validates collected data
  - `types.ts` - Type definitions (includes `BusinessIntelligence`)
  - `index.ts` - Main export file
  - **`generators/`**
    - `contentPerformance.ts` - Content performance insights
    - `reviews.ts` - Review analysis
    - `searchSocial.ts` - Search and social insights

#### Industry Services (8 files)
- **`services/industry/`**
  - `OnDemandProfileGeneration.ts` - Generates industry profiles on demand
  - `IndustryMatchingService.ts` - Matches businesses to NAICS codes
  - `IndustryCodeDetectionService.ts` - Detects industry codes from URLs
  - `IndustryDetectionService.ts` - Main industry detection logic
  - `IndustryResearchService.ts` - Researches industry information
  - `IndustryLearningService.ts` - Learns from industry data
  - `DynamicNAICSDiscovery.ts` - Dynamic NAICS code discovery
  - `SimpleIndustryDetection.ts` - Simplified detection

### Components (4 files)
- **`components/onboarding-v5/`**
  - `IndustrySelector.tsx` - Industry selection UI with autocomplete
  - `ProfileGenerationLoading.tsx` - Loading state during profile generation
  - `DetailedResearchAnimation.tsx` - Research progress animation
  - `ConfirmCodeDetectionDialog.tsx` - Confirmation dialog for detected codes

### Data (1 file)
- **`data/complete-naics-codes.ts`** - Complete NAICS industry codes database (~75KB)

### Utilities (1 file)
- **`utils/supabase/client.tsx`** - Supabase client configuration

### Library (2 files)
- **`lib/intelligence/`**
  - `types.ts` - Intelligence type definitions
  - `types-growth.ts` - Growth-related type definitions

---

## Total File Count

**26 TypeScript/React files**
- 1 demo page
- 17 service files
- 4 React components
- 1 data file
- 1 utility file
- 2 library type files

**Total size:** ~170KB

---

## Key Dependencies

### External NPM Packages
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "@supabase/supabase-js": "^2.x"
}
```

### Internal Dependencies (from parent Synapse folder)
The demo UI imports from the core Synapse system:
- `@/services/synapse/SynapseGenerator`
- `@/services/synapse/generation/SynapseContentGenerator`
- `@/services/synapse/generation/HumorOptimizer`
- `@/components/synapse/ProvenanceViewer`
- `@/components/synapse/EdginessSlider`
- `@/components/synapse/ContentEnhancements`
- `@/types/synapse.types`
- `@/types/synapseContent.types`

**NOTE:** These paths reference the parent Synapse directory structure.

---

## Environment Variables Required

```bash
# Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# OpenRouter API (for AI content generation)
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

---

## How It Works

### 1. Business Intelligence Collection
The demo page uses `dataAdapter.collectAndTransform()` to:
- Scrape business website
- Collect Google reviews
- Gather social media data
- Extract SEO metadata
- Combine into `BusinessIntelligence` object

### 2. Synapse Insight Generation
Calls `generateSynapses()` with business intelligence to create breakthrough insights.

### 3. Content Generation
Uses `SynapseContentGenerator` to create marketing content from insights:
- Controversial posts
- Data posts
- Hook posts
- Story posts
- Email campaigns
- Blog articles
- Landing pages

### 4. Content Enhancement
Provides UI for:
- A/B variant generation (5 strategies)
- Character count validation (8 platforms)
- Section regeneration (headline, hook, body, CTA)
- Humor optimization
- Provenance tracking

---

## Usage Example

```typescript
import { SynapseTest } from './demo-ui/pages/SynapseTest';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <SynapseTest />
    </BrowserRouter>
  );
}
```

---

## Path Alias Configuration

The demo UI uses `@/` path aliases. Configure your build tool:

### Vite
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './Synapse')
    }
  }
});
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./Synapse/*"]
    }
  }
}
```

---

## Industry Detection Flow

1. User enters business URL in IndustrySelector
2. IndustryCodeDetectionService scrapes website
3. Matches content to NAICS codes using AI
4. User confirms or selects industry
5. OnDemandProfileGeneration creates full industry profile
6. Profile used for content generation

---

## Content Intelligence Flow

1. dataAdapter collects all business data
2. Multiple generators run in parallel:
   - contentPerformance: Analyzes existing content
   - reviews: Extracts insights from reviews
   - searchSocial: Gathers search/social data
3. orchestrator combines all insights
4. scorer validates and scores quality
5. Final BusinessIntelligence object passed to Synapse

---

## Relationship to Core Synapse

```
Synapse/
├── [Core Synapse Code]        ← Core content generation engine
│   ├── services/synapse/      ← Content generation services
│   ├── components/synapse/    ← Content UI components
│   └── types/                 ← Type definitions
│
└── demo-ui/                   ← THIS FOLDER
    ├── pages/SynapseTest.tsx  ← Demo page that uses core Synapse
    ├── services/              ← Data collection services
    │   ├── contentIntelligence/  ← Gathers business intelligence
    │   └── industry/             ← Industry detection/matching
    ├── components/            ← Industry selector UI
    └── data/                  ← NAICS industry codes
```

**The demo UI provides the data collection layer.**
**The core Synapse provides the content generation layer.**

---

## Integration Steps

To use this demo UI in your project:

1. **Copy the entire Synapse folder** to your project
2. **Install NPM dependencies** (React, Supabase, etc.)
3. **Configure path aliases** (`@/` → `./Synapse/`)
4. **Set environment variables** (Supabase, OpenRouter)
5. **Import and render** `<SynapseTest />` component
6. **Add React Router** for navigation (uses `<Link>`)

---

## Known External Dependencies

### Supabase Functions (Optional)
The system can optionally call Supabase edge functions:
- `collect-cultural-intelligence` - Gathers cultural/demographic data

These are NOT required for core functionality.

### External APIs Used
- **OpenRouter** (Claude 3.5 Sonnet) - Content generation
- **Google Places API** (optional) - Review collection
- **Web scraping** - Website content extraction

---

## Testing Without Full Integration

You can test individual services:

```typescript
// Test content intelligence collection
import { dataAdapter } from './demo-ui/services/contentIntelligence/dataAdapter';

const intel = await dataAdapter.collectAndTransform({
  websiteUrl: 'https://example.com',
  businessName: 'Example Corp'
});

// Test industry detection
import { IndustryCodeDetectionService } from './demo-ui/services/industry/IndustryCodeDetectionService';

const detector = new IndustryCodeDetectionService();
const result = await detector.detectIndustryCode('https://example.com');
```

---

## Summary

✅ **Complete demo UI with all dependencies**
✅ **26 files covering all functionality**
✅ **Full business intelligence collection**
✅ **Industry detection and matching**
✅ **Comprehensive type definitions**
✅ **Ready to integrate with core Synapse**

**Everything needed to run the SynapseTest demo page is in this folder.**
