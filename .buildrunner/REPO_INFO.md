# MARBA Repository Information

**IMPORTANT:** This file is for AI code assistants (Claude Code, etc.) to understand the repository structure and location.

---

## Repository Details

**Project:** MARBA Mirror
**GitHub Repository:** https://github.com/DockeryAI/marba
**Local Path:** `/Users/byronhudson/Projects/MARBA`
**Owner:** DockeryAI (Byron Hudson)
**Visibility:** Public

---

## Quick Clone

```bash
git clone https://github.com/DockeryAI/marba.git
cd marba
npm install
```

---

## Repository Structure

This is a **standalone repository** - completely separate from Brandock or any other projects.

**Project Type:** React + TypeScript + Vite + Supabase
**Framework:** MIRROR (Measure, Intend, Reimagine, Reach, Optimize, Reflect)
**Build System:** Build Runner 3.0

---

## Branch Strategy

**Main Branch:** `main` (production-ready code)

**Feature Branches:**
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

**Example:**
```bash
git checkout -b feature/align-section
git checkout -b fix/buyer-journey-integration
```

---

## For AI Code Assistants

### When Starting a New Session:

1. **Check Current Branch:**
   ```bash
   git branch
   git status
   ```

2. **Pull Latest Changes:**
   ```bash
   git pull origin main
   ```

3. **Read Documentation:**
   - `.buildrunner/STATUS.md` - Project overview
   - `.buildrunner/features.json` - Feature tracking
   - `GAP_ANALYSIS_ACTUAL_VS_PLAN.md` - Current status
   - `PRODUCTION_READY_PLAN.md` - Next steps

4. **Check for Active Work:**
   - Look for `CLAUDE_WORK_LOG.md` to see if other instances are working
   - Check recent commits: `git log -10 --oneline`
   - Check open branches: `git branch -a`

### When Completing Work:

1. **Stage Changes:**
   ```bash
   git add .
   ```

2. **Commit with Semantic Message:**
   ```bash
   git commit -m "feat: description of feature"
   git commit -m "fix: description of fix"
   git commit -m "docs: description of docs change"
   ```

3. **Push to Remote:**
   ```bash
   git push origin <branch-name>
   ```

4. **Create Pull Request (if feature branch):**
   ```bash
   gh pr create --title "Feature: Description" --body "Details..."
   ```

---

## Parallel Development Protocol

If multiple Claude instances are working simultaneously:

1. **Check `CLAUDE_WORK_LOG.md`** for locked files
2. **Work in separate feature branches**
3. **Avoid shared files** (App.tsx, shared types, etc.)
4. **Communicate via work log** before touching shared resources
5. **Push frequently** to avoid conflicts

---

## Key Files to Never Modify Without Coordination

- `src/App.tsx` - Main router (coordinate route additions)
- `src/types/*.types.ts` - Shared types (use separate files when possible)
- `package.json` - Dependencies (coordinate additions)
- Database migrations - Use unique timestamps

---

## Remote URLs

**Fetch:** `https://github.com/DockeryAI/marba.git`
**Push:** `https://github.com/DockeryAI/marba.git`

**Verify with:**
```bash
git remote -v
```

**Expected output:**
```
origin  https://github.com/DockeryAI/marba.git (fetch)
origin  https://github.com/DockeryAI/marba.git (push)
```

---

## Deployment

- **Platform:** TBD (likely Vercel or Netlify)
- **Database:** Supabase
- **Environment:** Requires `.env` file (see `.env.example`)

---

## Issues & Bugs

**Report Issues:** https://github.com/DockeryAI/marba/issues

**Before Creating Issue:**
1. Check existing issues
2. Search closed issues
3. Reproduce the bug
4. Include error messages and stack traces

---

## Documentation

**Main Docs:**
- `.buildrunner/STATUS.md` - Auto-generated status
- `.buildrunner/features.json` - Feature registry (source of truth)
- `README.md` - Project README
- `/docs` - Additional documentation

**Gap Analysis:**
- `GAP_ANALYSIS_ACTUAL_VS_PLAN.md` - What's actually working
- `PRODUCTION_READY_PLAN.md` - Roadmap to production

---

## Common Commands

**Development:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Check TypeScript errors
npm run lint         # Run ESLint
```

**Testing:**
```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open test UI
```

**Database:**
```bash
npm run db:setup     # Setup database
npm run migrate:naics  # Run NAICS migration
```

---

## Project History

- **Origin:** Extracted from Brandock project
- **Migration Complete:** November 2025
- **Reason for Separation:** MARBA is a standalone product, not a Brandock feature
- **Independent Since:** November 13, 2025

---

## Contact

**Owner:** Byron Hudson (DockeryAI)
**Email:** byron@example.com

---

**Last Updated:** 2025-11-13
**Document Version:** 1.0.0
