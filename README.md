# MARBA Mirror

[![GitHub](https://img.shields.io/badge/github-DockeryAI%2Fmarba-blue)](https://github.com/DockeryAI/marba)
[![License](https://img.shields.io/badge/license-private-red)]()
[![Version](https://img.shields.io/badge/version-2.4.0-green)]()

**AI-powered brand transformation platform with MIRROR Framework diagnostics**

---

## 📍 Repository

**GitHub:** https://github.com/DockeryAI/marba
**Owner:** DockeryAI (Byron Hudson)

---

## 🚀 What is MARBA?

MARBA Mirror is a comprehensive AI-powered brand transformation platform that analyzes current brand identity, facilitates strategic goal-setting, and generates on-brand content at scale. Complete end-to-end journey from URL analysis to campaign execution.

**Built with the MIRROR Framework:**
- **M**easure - Brand diagnostics and analytics
- **I**ntend - Strategic goal setting
- **R**eimaging - Brand transformation planning
- **R**each - Audience and market positioning
- **O**ptimize - Content calendar and scheduling
- **R**eflect - Performance analysis and insights

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/DockeryAI/marba.git
cd marba

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

---

## 📚 Documentation

**For AI Code Assistants:**
- Start here: `.buildrunner/REPO_INFO.md`
- Project status: `.buildrunner/STATUS.md`
- Feature tracking: `.buildrunner/features.json`

**For Developers:**
- Current status: `GAP_ANALYSIS_ACTUAL_VS_PLAN.md`
- Production plan: `PRODUCTION_READY_PLAN.md`
- Coding standards: `.buildrunner/standards/CODING_STANDARDS.md`

---

## 🏗️ Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript 5.9.3
- Vite 6.3.5
- Tailwind CSS 4.1.16
- shadcn/ui components

**Backend:**
- Supabase (PostgreSQL, Auth, Edge Functions)
- OpenRouter (Claude AI)
- OpenAI (Embeddings)

**Tools:**
- Build Runner 3.0
- ESLint 9.38.0
- Vitest 2.1.8

---

## 📊 Project Status

**Version:** 2.4.0
**Status:** In Progress
**Completion:** ~92%

### Complete Features (12)
✅ Asset Analysis Engine
✅ Brand Mirror (7-Tab Analysis)
✅ Reflection & Goals System
✅ Competitive Intelligence
✅ Content Calendar
✅ AI Content Generator
✅ Gamification System
✅ Type System
✅ Admin Dashboard
✅ Design System
✅ Analytics & Tracking
✅ Brand Health Scoring

### In Progress (3)
🚧 Onboarding V3.0 Rebuild
🚧 Visual Flow Builder
🚧 SEO Optimization

See `.buildrunner/STATUS.md` for full details.

---

## 🔧 Available Scripts

**Development:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Check TypeScript
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

**Testing:**
```bash
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:ui      # Test UI
```

**Database:**
```bash
npm run db:setup     # Setup database
```

---

## 🌳 Project Structure

```
marba/
├── .buildrunner/           # Build Runner 3.0 governance
│   ├── STATUS.md           # Auto-generated status
│   ├── features.json       # Feature registry (source of truth)
│   ├── REPO_INFO.md        # Repository info for AI assistants
│   └── standards/          # Coding standards
├── src/
│   ├── components/         # React components
│   │   ├── mirror/         # MIRROR framework sections
│   │   ├── content-calendar/
│   │   ├── buyer-journey/
│   │   └── ui/             # shadcn/ui components
│   ├── services/           # Business logic & API calls
│   ├── types/              # TypeScript definitions
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities & helpers
├── supabase/
│   └── migrations/         # Database migrations
└── docs/                   # Additional documentation
```

---

## 🤝 Contributing

This is a private project. For authorized contributors:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Follow coding standards: `.buildrunner/standards/CODING_STANDARDS.md`
3. Commit: `git commit -m "feat: your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

**For Multiple AI Instances:**
- Check `CLAUDE_WORK_LOG.md` before starting
- Work in separate branches
- Coordinate on shared files

---

## 📝 License

Private - All Rights Reserved

---

## 📧 Contact

**Owner:** Byron Hudson (DockeryAI)
**Issues:** https://github.com/DockeryAI/marba/issues

---

## 🎯 Project History

MARBA was originally part of the Brandock project but was separated into its own standalone repository in November 2025 to enable independent development and deployment.

**Migration Complete:** November 13, 2025
**Reason:** MARBA is a standalone product, not a Brandock feature

---

**Built with ❤️ and way too much coffee ☕**
