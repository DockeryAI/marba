# Synapse Dependencies & Setup Guide

**Location:** `/Users/byronhudson/Projects/MARBA/Synapse/`
**Status:** ✅ All internal Synapse code is self-contained

---

## What's Included (Self-Contained)

All core Synapse functionality is fully contained in this directory:

### ✅ Services (16 files)
- All content generation logic
- All validation and analysis services
- All format-specific generators
- All utilities and helpers

### ✅ Components (4 files)
- All React UI components for Synapse features
- Character count badges
- Content enhancements UI
- Provenance viewer
- Edginess slider

### ✅ Types (4 files)
- `synapseContent.types.ts` - Core content types
- `synapse.types.ts` - Synapse insight types
- `breakthrough.types.ts` - Breakthrough insight types
- `deepContext.types.ts` - Deep context types

### ✅ Configuration (1 file)
- `platformLimits.ts` - Character limits for 8 platforms

### ✅ Data (1 file)
- `powerWords.json` - Power word database (13KB)

### ✅ Documentation (4 files)
- README.md - Complete system overview
- DEPENDENCIES.md - This file
- CONTENT_ENHANCEMENTS_PROGRESS.md - Implementation log
- CONTENT_ENHANCEMENTS_GAP_ANALYSIS.md - Feature analysis

---

## External Dependencies (Need to Install)

### NPM Packages Required

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "lucide-react": "^0.x",
  "framer-motion": "^10.x"
}
```

Install with:
```bash
npm install react react-dom lucide-react framer-motion
```

### API Requirements

**OpenRouter API Key** (for Claude 3.5 Sonnet)
- Environment variable: `VITE_OPENROUTER_API_KEY`
- Fallback hardcoded key is present in code for testing
- Used by:
  - VariantGenerator
  - SectionRegenerator
  - ContrarianAngleDetector

---

## Build Configuration Required

### Path Aliases

The code uses `@/` as a path alias prefix. Configure in your build tool:

**Option 1: Vite (vite.config.ts)**
```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './Synapse')
    }
  }
});
```

**Option 2: TypeScript (tsconfig.json)**
```json
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

## Demo Page Dependencies (Optional)

The `pages/SynapseTest.tsx` demo page has additional dependencies:

**NOT included in this folder:**
- `@/services/contentIntelligence/dataAdapter` - Data collection service
- `@/components/onboarding-v5/IndustrySelector` - Industry selection UI
- `@/types/contentIntelligence` - Business intelligence types

**These are ONLY needed if you want to run the full demo page.**

The core Synapse services work independently without these dependencies.

---

## Integration Example (Without Demo Page)

```typescript
import { SynapseContentGenerator } from './Synapse/services/synapse/generation/SynapseContentGenerator';
import type { BusinessProfile } from './Synapse/types/synapseContent.types';
import type { BreakthroughInsight } from './Synapse/types/breakthrough.types';

// Create your own business profile and insight objects
const business: BusinessProfile = {
  name: 'My Business',
  industry: 'Software',
  targetAudience: 'B2B SaaS companies',
  // ... other fields
};

const insight: BreakthroughInsight = {
  id: '1',
  type: 'ANALYTICAL',
  // ... other fields
};

// Use Synapse
const generator = new SynapseContentGenerator();
const content = await generator.generateContent(
  insight,
  business,
  'CONTROVERSIAL-POST'
);

console.log(content.headline);
console.log(content.body);
```

---

## Verification Checklist

To confirm everything works:

- [ ] All TypeScript files in `Synapse/` directory
- [ ] Install npm packages: `react`, `lucide-react`, `framer-motion`
- [ ] Configure `@/` path alias in build config
- [ ] Set `VITE_OPENROUTER_API_KEY` environment variable (or use fallback)
- [ ] Import Synapse services and types in your code
- [ ] Generate content successfully

---

## Summary

**YES - All Synapse code is self-contained in `/Users/byronhudson/Projects/MARBA/Synapse/`**

The only external requirements are:
1. Standard npm packages (React, Lucide icons)
2. Build configuration for `@/` path alias
3. OpenRouter API key (optional - fallback exists)

**The core Synapse services have ZERO dependencies on other parts of your codebase.**
