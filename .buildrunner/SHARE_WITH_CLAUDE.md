# Files to Share with Claude for Project Context

**Quick Reference:** These are the essential files to share when starting a new conversation with Claude about this project.

---

## 🔴 ESSENTIAL (Always Share These 3)

These files give Claude complete context about the project state:

```
1. .buildrunner/STATUS.md
   → Auto-generated project overview with feature list and stats

2. .buildrunner/features.json
   → Source of truth - complete feature registry with components, APIs, specs

3. package.json
   → Dependencies, scripts, project metadata
```

**How to share:** Just drag all 3 files into Claude's chat window.

---

## 🟡 OPTIONAL (Share Based on Context)

### If Working on Onboarding:
```
- Figma/src/components/onboarding-v3/OnboardingOrchestrator.tsx (main orchestrator)
- Figma/src/components/onboarding-v3/InstantRevealOrchestrator.tsx (Phase 1)
- Figma/src/components/onboarding-v3/UnifiedOnboardingV3.tsx (Phase 2)
- Figma/src/components/onboarding-v3/QuickWinOrchestrator.tsx (Phase 3)
- Figma/src/types/onboarding-v3.types.ts
```

### If Working on Phase 3 Quick Win Generator:
```
- Figma/src/services/quickWinGenerator.ts
- Figma/src/components/onboarding-v3/QuickWinSelector.tsx
- Figma/src/components/onboarding-v3/QuickWinGeneration.tsx
- Figma/src/components/onboarding-v3/QuickWinResult.tsx
```

### If Working on Gamification:
```
- Figma/src/components/onboarding-v3/gamification/BrandStrengthScore.tsx
- Figma/src/components/onboarding-v3/gamification/AnimatedProgressBar.tsx
- Figma/src/components/onboarding-v3/gamification/CelebrationConfetti.tsx
- Figma/src/hooks/useGamification.ts
```

### If Working on Database:
```
- Figma/supabase/migrations/*.sql (specific migration files)
```

### If Working on UI Components:
```
- Figma/src/components/ui/*.tsx (specific components)
```

---

## 🟢 HANDOFF DOCUMENTS (For Context Switching)

```
.buildrunner/HANDOFF_2025-11-05.md
   → Detailed summary of recent work (gamification system)
   → Testing checklist
   → Known limitations
```

---

## Quick Claude Prompt Template

When starting a new Claude conversation, use this prompt:

```
I'm working on the brandock project (AI-powered brand transformation platform).

Current state:
- Version 2.4.0
- 12 features complete, 3 in progress
- Just completed Phase 3 Quick Win Generator
- 3-phase onboarding: Instant Reveal → Deep Discovery → Quick Win
- Dev server running at http://localhost:3000/

[Attach: STATUS.md, features.json, package.json]

[Your specific question or task...]
```

---

## File Paths (Copy-Paste Ready)

For easy copying when sharing files:

```bash
# Essential trio
/Users/byronhudson/brandock/.buildrunner/STATUS.md
/Users/byronhudson/brandock/.buildrunner/features.json
/Users/byronhudson/brandock/Figma/package.json

# Handoff document
/Users/byronhudson/brandock/.buildrunner/HANDOFF_2025-11-05.md

# Recent work - Gamification system
/Users/byronhudson/brandock/Figma/src/components/onboarding-v3/gamification/
/Users/byronhudson/brandock/Figma/src/hooks/useGamification.ts

# Modified files - Onboarding integration
/Users/byronhudson/brandock/Figma/src/components/onboarding-v3/InstantRevealOrchestrator.tsx
/Users/byronhudson/brandock/Figma/src/components/onboarding-v3/UnifiedOnboardingV3.tsx
```

---

## What NOT to Share

Claude doesn't need:
- ❌ node_modules/ (dependencies)
- ❌ .git/ (git internals)
- ❌ Build output files
- ❌ Environment files (.env)
- ❌ Binary files (images, fonts)

---

**Last Updated:** 2025-11-05
**Valid For:** v2.4.0+
