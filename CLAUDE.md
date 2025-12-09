# BR3 Project Instructions

**Response:** Concise, no code unless asked.

## 5 Rules
1. Never disable RLS
2. UI from ~/Projects/ui-libraries/ only (no chakra/mui/antd)
3. APIs through edge functions (not frontend)
4. Check ARCHITECTURE.md before touching critical files
5. Log decisions: `br decision log "message"`

## PROTECTED FILES - DO NOT MODIFY

**The following files are BR3 infrastructure and must NEVER be modified, simplified, or "cleaned up":**

```
.buildrunner/components/vite-br-logger-plugin.ts  # READONLY - Vite dev server logging
.buildrunner/components/BRLogger.tsx              # READONLY - Browser log capture
.buildrunner/components/README.md                 # READONLY - Logger documentation
vite.config.ts (brLoggerPlugin import/usage)      # DO NOT REMOVE logger plugin
src/main.tsx (BRLogger import/component)          # DO NOT REMOVE BRLogger component
```

**Why:** These files enable `/dbg` command debugging. Without them, browser logs cannot be captured. They look like "unnecessary complexity" but are critical infrastructure.

**If you see these files and think "I should simplify this" - STOP. Leave them alone.**

## Governance
On code changes, follow `.buildrunner/governance.yaml`:
- Feature branches, not main
- Test after changes
- RLS on all tables
- No hardcoded secrets

## Reference (read when needed)
- `.buildrunner/ARCHITECTURE.md` - Critical files, patterns
- `.buildrunner/PROJECT_SPEC.md` - Features, requirements
- `.buildrunner/workflows/` - Audit, directory workflows

## Auto-Continue
Build to completion. Only stop for blockers or missing info.

## Debug
On errors, read `.buildrunner/browser.log` first.

---

## Existing Codebase

This project has code. Before building:
1. Check PROJECT_SPEC.md for existing features
2. Don't rebuild what exists
3. Type `audit` to run compliance audit (if not done)
4. Type `directory` to analyze/restructure directories

**Audit workflow:** `.buildrunner/workflows/AUDIT.md`
**Directory workflow:** `.buildrunner/workflows/DIRECTORY.md`
