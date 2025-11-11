# MARBA Mirror Complete Redesign & Migration Plan
## Project Codename: "Operation Nuclear Rebuild"

**Created:** 2025-11-11
**Status:** Planning Phase
**Estimated Completion:** When hell freezes over (optimistically: 8-10 weeks)
**Difficulty:** 🔥🔥🔥🔥🔥 (5/5 dumpster fires)

---

## Executive Summary (For When Your PM Asks "How Long?")

This is a complete ground-up rebuild of the Mirror application, restructured around the SOSTAC marketing framework, with full API enrichment, Synapse integration, persistent AI assistance, and a complete codebase migration from `/marba/Figma` to `~/Projects/MARBA`.

**What We're Building:**
- SOSTAC-based Mirror (6 main sections replacing current 7-tab structure)
- Persistent AI assistant "Marbs" with contextual awareness
- Content calendar with automated creation
- Visual design studio for posts
- Analytics dashboard with engagement
- Enriched UVP onboarding
- All references to "marba" → "marba"
- Clean, $100k SaaS aesthetic

**Tech Stack:**
- React 18.3.1 + TypeScript 5.9.3
- Tailwind CSS 4.1.16
- Supabase (PostgreSQL + Edge Functions)
- Claude AI via OpenRouter
- Existing API infrastructure (Synapse, UVP, ValueForge, Content Intelligence)

---

## Table of Contents

1. [SOSTAC Framework Understanding](#1-sostac-framework-understanding)
2. [Current State Analysis](#2-current-state-analysis)
3. [Architecture Overview](#3-architecture-overview)
4. [Intelligence Showcase Strategy](#4-intelligence-showcase-strategy) ⭐ **NEW**
5. [Mirror Redesign Structure](#5-mirror-redesign-structure)
6. [Marbs AI Assistant System](#6-marbs-ai-assistant-system)
7. [Content Calendar System](#7-content-calendar-system)
8. [Design Studio](#8-design-studio)
9. [Analytics & Engagement](#9-analytics--engagement)
10. [UVP Redesign](#10-uvp-redesign)
11. [API Enrichment Strategy](#11-api-enrichment-strategy)
12. [Synapse Integration Points](#12-synapse-integration-points)
13. [Migration Plan](#13-migration-plan)
14. [Marba → MARBA Renaming](#14-marba--marba-renaming)
15. [Design System](#15-design-system)
16. [Database Schema Changes](#16-database-schema-changes)
17. [Implementation Phases](#17-implementation-phases)
18. [Risk Assessment](#18-risk-assessment)
19. [Success Metrics](#19-success-metrics)

---

## 1. SOSTAC Framework Understanding

### What is SOSTAC?

SOSTAC® is a marketing planning model created by PR Smith with 6 sequential stages:

**S - Situation Analysis** (Where are we now?)
- Current market position
- Competitive landscape
- Internal capabilities
- SWOT/TOWS analysis

**O - Objectives** (Where do we want to be?)
- SMART goals
- Measurable targets
- Business outcomes

**S - Strategy** (How do we get there?)
- Overall approach
- Competitive positioning
- Strategic direction

**T - Tactics** (How exactly do we get there?)
- Specific implementation methods
- Channel-specific tactics
- Content strategies

**A - Action** (What is our plan?)
- Executable steps
- Timelines
- Responsibilities
- Resource allocation

**C - Control** (Did we get there?)
- KPIs and metrics
- Performance monitoring
- Adjustment mechanisms

### Applying SOSTAC to SMB Owners

For a small business owner, SOSTAC needs to be:
- **Visual** - Show, don't tell
- **Actionable** - Every insight leads to a clear action
- **Simple** - No marketing jargon
- **Fast** - They can't spend hours analyzing
- **Automated** - System does the heavy lifting

### SOSTAC Content Balance (Industry Standard)
- 20% - Situation Analysis
- 5% - Objectives
- 45% - Strategy
- 30% - Tactics
- Action & Control - Integrated throughout

---

## 2. Current State Analysis

### What Exists Now

**Location:** `/Users/byronhudson/marba/Figma/`

**Current Mirror Structure (7 tabs):**
1. Overview - Brand health, golden circle summary
2. Voice & Archetype - 12 archetypes, channel alignment
3. Purpose - Why/How/What (Golden Circle)
4. Audience & Industry - Demographics, personas, industry profile
5. Messaging & Positioning - Narrative arc, differentiators
6. Visual & Tone - Color palette, typography, tone calibration
7. Performance - Metrics, trends, version history

**Current Data Sources:**
- Asset Analysis Engine (website crawling)
- Competitive Intelligence (4-phase analysis)
- Industry Profiles (140+ industries)
- Brand Mirror analysis
- Content performance tracking

**Current APIs:**
- OpenRouter (Claude AI)
- Supabase Edge Functions
- Competitive analysis
- Industry intelligence
- Content generation

**Existing Synapse Capabilities:**
- Connection Discovery Engine (2-way, 3-way connections)
- Content Psychology Engine
- Power Word Optimizer
- Multiple content format generators (Hook, Story, Data, Controversial, Email, Blog, Landing Page)
- Breakthrough Model Orchestra (archived)
- Holy Shit Scorer (archived)

**Existing UVP System:**
- UVP Wizard component
- Context adapter
- UVP generator service

**Existing ValueForge:**
- Customer Journey Module
- Persona Customizer
- BVP (Brand Value Proposition) Builder
- Pain/Pleasure Board
- Transformation Analyzer

### Problems with Current System

1. **Information Overload** - 7 tabs with dense data, hard to find actionable insights
2. **No Clear Path Forward** - Shows analysis but not "what to do next"
3. **Not Action-Oriented** - Focused on reporting, not execution
4. **No Marketing Framework** - Data doesn't follow proven planning model
5. **Limited Synapse Integration** - Capabilities exist but not exposed where valuable
6. **No Content Automation** - Calendar exists but not integrated with creation
7. **No Visual Creation** - Can generate text but not design posts
8. **No Engagement Tools** - Analytics exist but no engagement interface
9. **Scattered Experience** - Mirror, UVP, Content, Analytics all separate

---

## 3. Architecture Overview

### New Application Structure

```
~/Projects/MARBA/
├── src/
│   ├── app/                    # Main application
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── mirror/             # Mirror-specific components
│   │   │   ├── situation/      # SOSTAC: Situation
│   │   │   ├── objectives/     # SOSTAC: Objectives
│   │   │   ├── strategy/       # SOSTAC: Strategy
│   │   │   ├── tactics/        # SOSTAC: Tactics
│   │   │   ├── action/         # SOSTAC: Action (Content Calendar)
│   │   │   └── control/        # SOSTAC: Control (Analytics)
│   │   ├── marbs/              # AI Assistant
│   │   │   ├── MarbsAssistant.tsx
│   │   │   ├── MarbsContextProvider.tsx
│   │   │   ├── MarbsSidebar.tsx
│   │   │   └── MarbsFloatingButton.tsx
│   │   ├── content-calendar/   # Content Calendar System
│   │   │   ├── CalendarView.tsx
│   │   │   ├── ContentGenerator.tsx
│   │   │   ├── SchedulingEngine.tsx
│   │   │   └── PublishingQueue.tsx
│   │   ├── design-studio/      # Visual Design Studio
│   │   │   ├── CanvasEditor.tsx
│   │   │   ├── TemplateLibrary.tsx
│   │   │   ├── BrandAssets.tsx
│   │   │   └── ExportTools.tsx
│   │   ├── analytics/          # Analytics Dashboard
│   │   │   ├── PerformanceCharts.tsx
│   │   │   ├── EngagementMetrics.tsx
│   │   │   ├── AudienceInsights.tsx
│   │   │   └── ReportBuilder.tsx
│   │   ├── uvp/                # UVP System (redesigned)
│   │   │   ├── UVPWizard.tsx
│   │   │   ├── ValuePropositionBuilder.tsx
│   │   │   └── CompetitivePositioning.tsx
│   │   ├── synapse/            # Synapse Integration
│   │   │   ├── ConnectionDiscovery.tsx
│   │   │   ├── PsychologyEngine.tsx
│   │   │   └── ContentEnhancer.tsx
│   │   └── ui/                 # Shared UI components
│   ├── services/
│   │   ├── mirror/
│   │   │   ├── situation-analyzer.ts
│   │   │   ├── objectives-generator.ts
│   │   │   ├── strategy-builder.ts
│   │   │   └── tactics-planner.ts
│   │   ├── marbs/
│   │   │   ├── context-awareness.ts
│   │   │   ├── conversation-engine.ts
│   │   │   └── action-executor.ts
│   │   ├── content-intelligence/  # Content Intelligence Engine
│   │   ├── synapse/               # Synapse services
│   │   ├── uvp/                   # UVP services
│   │   └── valueForge/            # ValueForge services
│   ├── types/
│   │   ├── mirror.types.ts
│   │   ├── marbs.types.ts
│   │   ├── content.types.ts
│   │   └── marba.types.ts        # Main MARBA types
│   ├── lib/
│   │   ├── api/                   # API clients
│   │   ├── utils/                 # Utilities
│   │   └── constants/             # Constants
│   └── styles/
│       └── globals.css            # Tailwind + custom styles
├── supabase/
│   ├── functions/
│   │   ├── analyze-mirror/        # Mirror analysis
│   │   ├── marbs-assistant/       # Marbs AI endpoints
│   │   ├── generate-content/      # Content generation
│   │   └── enrich-with-synapse/   # Synapse enrichment
│   └── migrations/
│       └── 20251111_marba_redesign.sql
├── public/
│   ├── assets/
│   └── templates/
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── USER_GUIDE.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### Data Flow Architecture

```
User → Mirror Section (SOSTAC) → Marbs Assistant
                ↓                        ↓
          Analysis Engine ← → Synapse Enhancement
                ↓                        ↓
          Data Enrichment ← → API Stack
                ↓
          ┌─────────────────────────────┐
          │  Central Data Store         │
          │  (Supabase + Cache)         │
          └─────────────────────────────┘
                ↓           ↓           ↓
          Content Cal.  Design Stu.  Analytics
```

---

## 4. Intelligence Showcase Strategy

### Overview: Make the Data Assets the Hero

**The Problem:** The original plan treats your insane intelligence capabilities (140+ industry profiles, Synapse, real-time signals, competitive data) as background features. They need to be **front and center, visible, proactive, and constantly demonstrating value.**

**The Solution:** An "Intelligence Layer" that runs across every section, showing off what makes MARBA impossibly smart.

---

### Core Principle: "Show, Don't Hide"

Every piece of intelligence should be:
1. **Visible** - User sees it working, not just results
2. **Explained** - Why this insight matters
3. **Actionable** - One-click to do something with it
4. **Contextual** - Industry benchmarks on everything
5. **Proactive** - Platform suggests before user asks

---

### Intelligence Assets Inventory

**What Makes MARBA Impossibly Smart:**

**1. Industry Intelligence (140+ profiles)**
- Customer psychology triggers (urgency scores, conversion rates, best timing)
- Power words (impact scores, conversion lift data)
- Proven CTAs (conversion rates, best platforms)
- Seasonal trends (search volumes, optimal timing)
- Best performing platforms & content types
- Average competitor activity benchmarks

**2. Synapse Engine**
- 2-way & 3-way connection discovery (unexpected angles)
- Psychology scoring (emotional appeal, clarity, impact)
- Power word optimization (placement, intensity)
- Format-specific generators (Hook, Story, Data, Controversial, Email, Blog, Landing Page)
- Content psychology analysis

**3. Real-Time Signals**
- Weather alerts (location-specific)
- Trending topics (Google Trends, Reddit)
- Local news (relevance scoring)
- Reddit discussions (engagement, sentiment)
- Seasonal triggers

**4. Competitive Intelligence**
- Keyword gaps (search volume, difficulty, opportunity score)
- Content gaps (topics competitors haven't covered)
- Platform gaps (where competitors aren't active)
- Timing gaps (when competitors aren't posting)
- Format gaps (formats competitors underuse)
- Review advantages (where you outperform)
- Competitor weaknesses (content angles to exploit)

**5. Learning Engine**
- Content performance patterns
- Optimal posting times (learned, not guessed)
- Audience engagement patterns
- Format preferences
- Platform effectiveness

---

### The Intelligence Showcase Framework

## Component 1: Opportunity Dashboard (Action Section)

**Location:** Top of ACTION section, always visible

**Purpose:** Real-time feed of actionable opportunities with countdown timers

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  🔥 OPPORTUNITIES NOW                    [View All]     │
├─────────────────────────────────────────────────────────┤
│  🌧️ Weather Alert                        ⏱️ 3 hrs left │
│  Rain forecast tonight - Post ready for HVAC industry   │
│  [Generate Post] [Dismiss]              Impact: HIGH    │
├─────────────────────────────────────────────────────────┤
│  ⭐ Competitor Gap                       ⏱️ 2 days left │
│  Top competitor hasn't posted in 4 days on Instagram    │
│  [Generate Post] [Dismiss]              Impact: MEDIUM  │
├─────────────────────────────────────────────────────────┤
│  📈 Trending Now                         ⏱️ 6 hrs left  │
│  "supply chain" trending +340% in your industry         │
│  [Generate Post] [Dismiss]              Impact: HIGH    │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Auto-refreshes every 5 minutes
- Countdown timers showing urgency
- Impact scoring (HIGH/MEDIUM/LOW)
- One-click content generation
- Dismissible (but logs dismissals for learning)
- Categorized by type (Weather, Trends, Competitor, Seasonal, Local News)

**Data Sources:**
- Weather API (location-based alerts)
- Google Trends (industry-specific trending topics)
- Competitive Intelligence API (competitor activity monitoring)
- Reddit API (discussion volume spikes)
- Local News APIs (relevant stories)
- Industry Profile (seasonal trigger calendar)

**Proactive Notifications:**
- Push notification when HIGH impact opportunity appears
- Email digest of missed opportunities (daily)
- Slack/Teams integration for team alerts

---

## Component 2: Industry Intelligence Cards (Situation & Strategy)

**Location:** SITUATION section (prominent), STRATEGY section (integrated)

**Purpose:** Show the customer psychology triggers that drive their industry

**SITUATION Section - Customer Trigger Cards:**

```
┌─────────────────────────────────────────────────────────┐
│  🎯 YOUR CUSTOMERS RESPOND TO THESE TRIGGERS            │
│  Based on analysis of 3,247 businesses in your industry │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Emergency   │  │  Seasonal   │  │  Preventive │    │
│  │  Urgency: 9  │  │  Urgency: 6 │  │  Urgency: 4 │    │
│  │  Conv: 18%   │  │  Conv: 12%  │  │  Conv: 8%   │    │
│  │  [Generate]  │  │  [Generate] │  │  [Generate] │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  💡 Best time: Winter months (Dec-Feb)                 │
│  📊 Emotional driver: Peace of mind, avoid crisis      │
│  ✨ Top power words: "fast", "reliable", "24/7"        │
└─────────────────────────────────────────────────────────┘
```

**Each Trigger Card Shows:**
- Trigger name (e.g., "Emergency", "Seasonal", "Preventive")
- Urgency score (1-10)
- Historical conversion rate
- Best time to use
- Emotional driver
- Related power words
- [Generate Content] button - creates content using this trigger

**STRATEGY Section - Trigger-Based Message Pillars:**

Message pillars should auto-generate from top 3-5 triggers:

```
┌─────────────────────────────────────────────────────────┐
│  📌 MESSAGE PILLARS (Auto-generated from triggers)      │
├─────────────────────────────────────────────────────────┤
│  Pillar 1: Emergency Response                           │
│  Trigger: Emergency (Urgency 9, Conv 18%)              │
│  Synapse Score: 8.2/10 (High emotional resonance)      │
│  [Edit] [Generate Content]                              │
├─────────────────────────────────────────────────────────┤
│  Pillar 2: Seasonal Preparation                         │
│  Trigger: Seasonal (Urgency 6, Conv 12%)               │
│  Synapse Score: 7.8/10 (Good timing alignment)         │
│  [Edit] [Generate Content]                              │
└─────────────────────────────────────────────────────────┘
```

**Why This Matters:**
- User sees the DATA behind the strategy
- Not random pillars - backed by 3,247 businesses
- Direct connection between triggers → pillars → content
- Synapse validates the psychology automatically

---

## Component 3: Synapse Insights Everywhere

**Principle:** Synapse should run automatically and show results proactively, not hide behind a toggle.

### SITUATION Section - Competitor Psychology Analysis

```
┌─────────────────────────────────────────────────────────┐
│  🧠 SYNAPSE ANALYSIS: COMPETITOR MESSAGING              │
├─────────────────────────────────────────────────────────┤
│  Competitor A: "Fast, reliable HVAC service"            │
│  Psychology Score: 6.2/10                               │
│  ⚠️ Low emotional appeal, generic power words           │
│                                                         │
│  💡 Your Opportunity: Add urgency + peace of mind angle │
│  Suggested: "24/7 Emergency HVAC - Never Wait in Cold" │
│  Psychology Score: 8.7/10 (+2.5 vs competitor)          │
│  [Use This Positioning]                                 │
└─────────────────────────────────────────────────────────┘
```

**What It Shows:**
- Competitor messaging (scraped from website/ads)
- Synapse psychology score (0-10)
- What's weak about it
- Your differentiation angle
- Scored alternative
- One-click to adopt positioning

### STRATEGY Section - Positioning Statement Auto-Score

Every time user types a positioning statement, Synapse scores it in real-time:

```
┌─────────────────────────────────────────────────────────┐
│  Your Positioning Statement:                            │
│  "We provide fast and reliable HVAC services"           │
│                                                         │
│  🧠 SYNAPSE ANALYSIS                     Score: 5.8/10 │
│  ├─ Clarity: 7/10          ✅ Clear                    │
│  ├─ Emotional Appeal: 4/10 ⚠️ Generic                  │
│  ├─ Differentiation: 5/10  ⚠️ Common claim             │
│  └─ Specificity: 7/10      ✅ Specific service         │
│                                                         │
│  💡 SYNAPSE SUGGESTS:                                   │
│  • Add emotional benefit: "peace of mind", "comfort"    │
│  • Strengthen differentiation: "24/7 emergency"         │
│  • Use power word: "never" instead of "reliable"        │
│                                                         │
│  ✨ Enhanced Version (Score: 8.4/10):                   │
│  "24/7 Emergency HVAC Service - Never Suffer Through   │
│   a Cold Night or Sweltering Day"                      │
│  [Apply] [Edit More] [Keep Original]                   │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Real-time scoring as they type
- Breakdown by dimension (not just total score)
- Specific, actionable suggestions
- Auto-enhanced version they can apply
- Comparison score (original vs enhanced)

### ACTION Section - Content Generation with Synapse Visible

When generating content, show what Synapse is doing:

```
┌─────────────────────────────────────────────────────────┐
│  🧠 SYNAPSE ENHANCED CONTENT                            │
├─────────────────────────────────────────────────────────┤
│  [Draft 1]                           Psychology: 8.2/10 │
│  "Furnace acting up? Don't wait for a breakdown!        │
│   Our 24/7 emergency team is ready. Stay warm tonight." │
│                                                         │
│  ✨ Synapse Used:                                       │
│  • Connection: furnace breakdown → cold night (fear)    │
│  • Power words: "breakdown" (urgency 9)                 │
│  • Emotional appeal: safety/comfort (intensity 0.7)     │
│  • Format: Hook post (proven 3x engagement)             │
│                                                         │
│  📊 Industry Benchmark: 6.2/10 (you're +2.0 above avg) │
│  [Edit] [Publish] [See Alternatives]                   │
└─────────────────────────────────────────────────────────┘
```

**Why This Matters:**
- User sees Synapse working, not just results
- Understands WHY content is good
- Learns what makes effective content
- Benchmark shows competitive advantage

---

## Component 4: Industry Benchmarking Everywhere

**Principle:** Every metric needs context. Show industry comparison on EVERYTHING.

### Performance Metrics Format:

**Instead of:**
```
Engagement Rate: 4.2%
```

**Show:**
```
┌──────────────────────────────────────┐
│  Engagement Rate: 4.2%               │
│  ────────┬─────────────────          │
│     You  │  Industry    Top 10%      │
│     4.2% │    2.1%       5.8%        │
│  ────────┴─────────────────          │
│  💚 You're 2x above industry average │
│  📈 +0.8% from last month            │
└──────────────────────────────────────┘
```

### Benchmark Sources:
- Industry Profile data (140+ industries)
- Competitive Intelligence (your competitors)
- Historical platform data (MARBA aggregate)

### Where to Show Benchmarks:

**SITUATION Section:**
- Brand health score vs industry average
- Competitor scores vs industry average
- Content output vs average competitor

**OBJECTIVES Section:**
- Goal targets with industry realistic ranges
- "Industry top 10% achieve X" guidance

**CONTROL Section:**
- Every chart has industry benchmark line
- Every KPI shows industry percentile
- "You rank in top 15% for engagement"

---

## Component 5: Learning Engine Visibility

**Principle:** Show the AI learning in real-time. Users should see the platform getting smarter.

### Learning Dashboard Widget (CONTROL Section):

```
┌─────────────────────────────────────────────────────────┐
│  🤖 WHAT I'VE LEARNED ABOUT YOUR AUDIENCE               │
│  Updated 2 hours ago                                    │
├─────────────────────────────────────────────────────────┤
│  📈 Best Performing:                                    │
│  • Hook posts get 3.2x more engagement                  │
│  • Posts with "emergency" get 2.1x more clicks          │
│  • Tuesday 10am is your sweet spot (+45% engagement)    │
│  • Instagram performs 2.4x better than Facebook         │
│                                                         │
│  📉 Avoid:                                              │
│  • Promotional posts underperform (-32% engagement)     │
│  • Friday posts get 50% less reach                     │
│  • Blog-style social posts lose attention              │
│                                                         │
│  🎯 Adjusting Strategy:                                 │
│  • Generating more hook posts (3→5 per week)           │
│  • Auto-scheduling to Tuesday 10am                      │
│  • Prioritizing Instagram over Facebook                │
│  [View Full Analysis]                                   │
└─────────────────────────────────────────────────────────┘
```

**What It Tracks:**
- Content format performance
- Power word effectiveness (for THIS user)
- Optimal posting times (learned, not guessed)
- Platform effectiveness
- Audience preferences
- Topic resonance

**How It Shows Learning:**
- "I've learned..." language (personified)
- Shows sample size: "Based on 47 posts over 3 months"
- Shows adjustments being made automatically
- Links to content illustrating the pattern

### Auto-Adjustments Notifications:

```
┌─────────────────────────────────────────────────────────┐
│  🤖 I MADE AN ADJUSTMENT                                │
├─────────────────────────────────────────────────────────┤
│  Your Tuesday 10am posts get 45% more engagement        │
│  than any other time.                                   │
│                                                         │
│  I've automatically moved 3 upcoming posts to           │
│  Tuesday 10am for better performance.                   │
│                                                         │
│  [View Changes] [Undo] [Approve]                        │
└─────────────────────────────────────────────────────────┘
```

---

## Component 6: Proactive Opportunity Alerts

**Principle:** Don't wait for user to ask. TELL them when there's an opportunity.

### Alert Types:

**1. Competitive Opportunity Alerts**
```
🚨 COMPETITOR ALERT
Acme HVAC stopped posting on Instagram
5 days ago - opportunity to gain visibility
[Generate Instagram Posts]
```

**2. Real-Time Signal Alerts**
```
🌧️ WEATHER ALERT
Severe cold front tonight (-10°F)
High demand expected for emergency HVAC
[Generate Emergency Post Now]
```

**3. Seasonal Trigger Alerts**
```
📅 SEASONAL PEAK STARTING
Your industry peaks in 3 days (winter prep)
Top performers post 2 weeks early
[Generate Peak Season Content]
```

**4. Review/Reputation Alerts**
```
⭐ NEW 5-STAR REVIEW
Customer praised "fast response" - turn this
into social proof content
[Generate Thank You Post]
```

**5. Keyword Opportunity Alerts**
```
📈 KEYWORD GAP OPENED
"emergency furnace repair near me" just
spiked +200%, competitor doesn't rank
[Create SEO Content]
```

### Alert Delivery:
- In-app notification badge
- Opportunity Dashboard widget
- Email digest (configurable frequency)
- Push notifications (opt-in, HIGH impact only)
- Slack/Teams integration

### Alert Intelligence:
- Learns which alerts user acts on
- Stops showing ignored alert types
- Adjusts urgency thresholds based on user behavior
- Combines related opportunities (weather + keyword + seasonal)

---

## Component 7: Connection Discovery Showcase

**Principle:** Synapse's connection finder is magic. Show it off.

### In Content Generation:

When user clicks "Generate Content", show connection discovery process:

```
┌─────────────────────────────────────────────────────────┐
│  🔍 FINDING UNEXPECTED CONNECTIONS...                   │
├─────────────────────────────────────────────────────────┤
│  ✨ Found 3 powerful connections:                       │
│                                                         │
│  1️⃣ Furnace Repair → Cost of Emergency Hotel Stay     │
│     People spend $150/night on hotels when heat fails  │
│     Your $89 service call saves them $150+             │
│     Emotional Impact: 8.9/10                            │
│     [Use This Angle]                                    │
│                                                         │
│  2️⃣ Winter Cold → Sick Children                        │
│     Parents fear kids getting sick from cold           │
│     Position: "Keep your family healthy"               │
│     Emotional Impact: 9.2/10                            │
│     [Use This Angle]                                    │
│                                                         │
│  3️⃣ HVAC Maintenance → Car Oil Change                  │
│     Everyone understands preventive car maintenance    │
│     Make HVAC maintenance feel as normal               │
│     Emotional Impact: 7.4/10                            │
│     [Use This Angle]                                    │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Shows 3 strongest connections per concept
- Explains WHY the connection works
- Shows emotional impact score
- User picks which angle to use
- All 3 generate different content variations

### In Strategy Section:

Show connections between brand elements:

```
┌─────────────────────────────────────────────────────────┐
│  🔗 SYNAPSE CONNECTIONS: YOUR BRAND                     │
├─────────────────────────────────────────────────────────┤
│  Your UVP connects to 3 customer triggers:              │
│                                                         │
│  "24/7 Emergency" ←→ "Peace of Mind" (trigger)          │
│  Connection Strength: 9.1/10                            │
│  Use in: Message pillar 1, Instagram posts              │
│                                                         │
│  "Certified Technicians" ←→ "Trust/Safety" (trigger)    │
│  Connection Strength: 8.7/10                            │
│  Use in: Message pillar 2, Website copy                 │
│                                                         │
│  "Same-Day Service" ←→ "Urgency" (trigger)              │
│  Connection Strength: 8.4/10                            │
│  Use in: Message pillar 3, Ad copy                      │
└─────────────────────────────────────────────────────────┘
```

---

## Component 8: "Why This Works" Explanations

**Principle:** Don't just give answers. Teach users why they work.

### Format for All Recommendations:

```
┌─────────────────────────────────────────────────────────┐
│  💡 RECOMMENDATION: Post at Tuesday 10am                │
├─────────────────────────────────────────────────────────┤
│  WHY THIS WORKS:                                        │
│  • Your audience is most active at 10am (analytics)     │
│  • Tuesday has 45% higher engagement (your data)        │
│  • Industry average for HVAC is Tuesday 9am (similar)   │
│  • Your last 5 Tuesday posts averaged 127 engagements   │
│    vs 68 engagements on other days                      │
│                                                         │
│  CONFIDENCE: 94% (based on 47 posts)                    │
│  SOURCE: Your performance data + Industry patterns      │
│                                                         │
│  [Apply to Schedule] [See Data]                         │
└─────────────────────────────────────────────────────────┘
```

**Apply to:**
- Message pillar suggestions
- Content recommendations
- Timing suggestions
- Platform prioritization
- Power word selections
- CTA recommendations

---

## Component 9: Real-Time Competitive Intelligence

**Location:** CONTROL section + SITUATION section

### Competitive Activity Feed:

```
┌─────────────────────────────────────────────────────────┐
│  👀 COMPETITOR ACTIVITY (Last 7 Days)                   │
├─────────────────────────────────────────────────────────┤
│  Acme HVAC:                                             │
│  📉 Posted 2 times (down from usual 5)                  │
│  💡 Opportunity: Increase your visibility now           │
│  [Generate Competitive Post]                            │
│                                                         │
│  Quick Fix Heating:                                     │
│  📈 Posted 7 times (up from usual 3)                    │
│  ⚠️ Topics: emergency service, winter prep              │
│  💡 Response: Match their activity on these topics      │
│  [Generate Response Content]                            │
│                                                         │
│  Comfort Pro:                                           │
│  💬 Got 3 negative reviews mentioning "slow response"   │
│  💡 Angle: Highlight your fast response time            │
│  [Generate Differentiator Post]                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Updates every 6 hours
- Shows posting frequency changes
- Identifies topic shifts
- Flags reputation changes
- Suggests immediate responses
- One-click content generation

### Competitive Gap Tracker:

```
┌─────────────────────────────────────────────────────────┐
│  📊 COMPETITIVE GAPS                                    │
├─────────────────────────────────────────────────────────┤
│  Platform Gaps:                                         │
│  ├─ YouTube: 0 of 3 competitors active → HIGH value    │
│  ├─ LinkedIn: 1 of 3 competitors active → MEDIUM value │
│  └─ TikTok: 2 of 3 competitors active → LOW value      │
│                                                         │
│  Content Gaps:                                          │
│  ├─ "Energy efficiency tips" - No competitor coverage  │
│  ├─ "DIY troubleshooting" - Limited competitor content │
│  └─ "Seasonal maintenance" - Saturated topic           │
│                                                         │
│  Keyword Gaps:                                          │
│  ├─ "emergency furnace repair" - You don't rank        │
│  ├─ "hvac maintenance near me" - Competitor dominates  │
│  └─ "ac installation cost" - Opportunity to rank       │
└─────────────────────────────────────────────────────────┘
```

---

## Component 10: Industry Intelligence Everywhere

### Platform Recommendations (TACTICS Section):

```
┌─────────────────────────────────────────────────────────┐
│  📱 PLATFORM STRATEGY                                   │
│  Based on 3,247 HVAC businesses analyzed                │
├─────────────────────────────────────────────────────────┤
│  Facebook:                                              │
│  ├─ Industry Performance: 2.8% avg engagement          │
│  ├─ Best Content: Before/after photos, testimonials    │
│  ├─ Optimal Frequency: 5x/week                         │
│  ├─ Best Times: Tue/Thu 10am, Sat 2pm                  │
│  └─ Your Opportunity: Post maintenance tips (low sat.) │
│                                                         │
│  Instagram:                                             │
│  ├─ Industry Performance: 3.4% avg engagement (BEST)   │
│  ├─ Best Content: Behind-scenes, time-lapse work       │
│  ├─ Optimal Frequency: 4x/week + daily stories         │
│  ├─ Best Times: Mon/Wed/Fri 11am                       │
│  └─ Your Opportunity: Use Reels (competitors aren't)   │
│                                                         │
│  [Apply Industry Best Practices] [Customize]            │
└─────────────────────────────────────────────────────────┘
```

### Power Words in Action (Everywhere):

When user types content, highlight power words:

```
Your content: "We provide reliable HVAC service"
                      ^^^^^^^^
                Power word detected: "reliable"
                Impact Score: 6.2/10

💡 Higher impact alternatives:
   • "guaranteed" (8.4/10, +34% conversion lift)
   • "certified" (7.9/10, +27% conversion lift)
   • "trusted" (7.1/10, +14% conversion lift)

[Replace with "guaranteed"]
```

---

## Implementation Requirements for Intelligence Showcase

### UI/UX Patterns:

**1. Intelligence Badge System**
```
🧠 Synapse Enhanced
📊 Industry Data
🎯 Learning Applied
⚡ Real-Time Signal
🔍 Connection Found
```

Every intelligent feature gets a badge so user knows when AI is working.

**2. Explanation Tooltips**
Hover over any metric/recommendation = shows "Why this works" explanation

**3. Confidence Scores**
Every AI recommendation shows confidence % and sample size

**4. Source Attribution**
Every insight shows: "Based on [X]" (industry data, your performance, competitor analysis, etc.)

**5. One-Click Actions**
Every insight has immediate action: [Generate], [Apply], [Schedule], [Publish]

### Data Pipeline Requirements:

**Real-Time Processing:**
- Weather API checks every 15 minutes
- Competitor monitoring every 6 hours
- Trends API checks hourly
- Reddit API checks every 2 hours

**Background Jobs:**
- Synapse analysis runs on all new content (real-time)
- Learning engine updates daily
- Industry benchmarks refresh weekly
- Competitive intelligence updates daily

**Caching Strategy:**
- Industry profile data: 24 hour cache
- Competitor data: 6 hour cache
- Real-time signals: 15 minute cache
- Synapse results: Cache with content hash (recompute if content changes)

### Database Schema Additions:

```sql
-- Opportunity tracking
CREATE TABLE intelligence_opportunities (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),

  type TEXT, -- 'weather', 'trend', 'competitor', 'keyword', 'review'
  title TEXT,
  description TEXT,

  impact_score TEXT, -- 'HIGH', 'MEDIUM', 'LOW'
  urgency_expires_at TIMESTAMP,

  data JSONB, -- Type-specific data

  status TEXT, -- 'active', 'dismissed', 'acted_on', 'expired'
  acted_on_content_id UUID REFERENCES content_calendar_items(id),

  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning patterns
CREATE TABLE learning_patterns (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),

  pattern_type TEXT, -- 'format', 'timing', 'power_word', 'platform'
  pattern_name TEXT,

  confidence DECIMAL(3,2), -- 0.00 to 1.00
  sample_size INT,

  impact_data JSONB, -- Performance data supporting this pattern

  learned_at TIMESTAMP DEFAULT NOW(),
  last_validated TIMESTAMP
);

-- Synapse analysis cache
CREATE TABLE synapse_analysis_cache (
  id UUID PRIMARY KEY,

  content_hash TEXT, -- Hash of analyzed content
  analysis_type TEXT, -- 'psychology', 'connection', 'power_word'

  results JSONB,
  score DECIMAL(3,2),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_synapse_cache_hash ON synapse_analysis_cache(content_hash);

-- Competitive intelligence snapshots
CREATE TABLE competitive_intelligence_snapshots (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  competitor_domain TEXT,

  posting_frequency INT,
  platforms_active TEXT[],
  topics TEXT[],
  sentiment_score DECIMAL(3,2),

  gaps_identified JSONB,
  opportunities JSONB,

  snapshot_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Measuring Intelligence Showcase Success

### Key Metrics:

**Engagement with Intelligence:**
- % users who click on opportunity alerts
- % users who apply Synapse suggestions
- % users who use industry trigger cards
- Average time spent viewing intelligence widgets

**Intelligence Impact:**
- Content performance: Synapse-enhanced vs non-enhanced
- Posting timing: Industry-recommended vs user-selected
- Platform effectiveness: Industry-prioritized vs user-selected
- Conversion lift from power word optimization

**Learning Effectiveness:**
- Pattern confidence scores over time
- User satisfaction with auto-adjustments
- % of learned patterns that improve performance

**Competitive Intelligence Value:**
- % opportunity alerts that lead to content creation
- Performance of competitive-response content vs regular content
- Gap exploitation success rate

### Success Criteria:

**Week 1:**
- [ ] Intelligence badges visible throughout app
- [ ] Opportunity Dashboard shows live opportunities
- [ ] Synapse scoring visible on all content
- [ ] Industry benchmarks on all metrics

**Month 1:**
- [ ] 80% of users engage with opportunity alerts
- [ ] 60% of users apply Synapse suggestions
- [ ] Learning patterns identified for 70% of users
- [ ] Competitive intelligence driving 30% of content

**Month 3:**
- [ ] Synapse-enhanced content performs 2x better than baseline
- [ ] Industry-recommended timing improves engagement 40%
- [ ] Learning engine making accurate auto-adjustments
- [ ] Users view intelligence features as "magic"

---

## The "Holy Shit" Moment

When a user first logs in after onboarding, they should see:

```
┌─────────────────────────────────────────────────────────┐
│  🎉 YOUR BRAND INTELLIGENCE REPORT IS READY             │
├─────────────────────────────────────────────────────────┤
│  We analyzed 3,247 businesses in your industry,         │
│  studied your top 3 competitors, and found:             │
│                                                         │
│  🔥 7 immediate opportunities (3 expire today)          │
│  🎯 5 customer triggers that drive your sales           │
│  ⚡ 12 competitive gaps you can exploit                 │
│  ✨ 23 power words proven in your industry              │
│  📊 Your brand scores 68/100 (industry avg: 52)        │
│                                                         │
│  💡 We've generated 30 days of content using these     │
│     insights. Review and publish with one click.       │
│                                                         │
│  [Explore Your Intelligence] [Generate Content]         │
└─────────────────────────────────────────────────────────┘
```

**This is the moment they realize:** "Holy shit, this platform knows my business better than I do."

---

## Summary: Intelligence Showcase Checklist

**Every Section Must Have:**
- [ ] At least one proactive intelligence widget
- [ ] Industry benchmarks on key metrics
- [ ] Synapse analysis where relevant
- [ ] One-click actions on insights
- [ ] "Why this works" explanations
- [ ] Confidence scores on recommendations
- [ ] Source attribution for all data

**Core Components to Build:**
1. ✅ Opportunity Dashboard (Action section)
2. ✅ Industry Trigger Cards (Situation + Strategy)
3. ✅ Synapse Auto-Analysis (All sections)
4. ✅ Industry Benchmarking System (All metrics)
5. ✅ Learning Engine Visibility (Control section)
6. ✅ Proactive Alert System (Cross-platform)
7. ✅ Connection Discovery Showcase (Content generation)
8. ✅ "Why This Works" Framework (All recommendations)
9. ✅ Competitive Intelligence Feed (Control + Situation)
10. ✅ Intelligence Badge System (Visual indicators)

---

**This is how you make the data assets the hero.**

---

## 5. Mirror Redesign Structure

### Overview: SOSTAC Navigation

**New Structure (6 main sections):**

```
╔════════════════════════════════════════════════════════════╗
║                     MARBA Mirror                           ║
║  [Situation] [Objectives] [Strategy] [Tactics] [Action] [Control]  ║
╚════════════════════════════════════════════════════════════╝
```

### Section 1: SITUATION (Where Are We Now?)

**Purpose:** Show SMB owner exactly where their brand stands today

**Sub-sections:**
1. **Brand Health Overview**
   - Single score (0-100) with visual gauge
   - 3 key metrics: Clarity, Consistency, Engagement
   - Comparison to industry benchmark
   - "🔥 Hot Spots" - What's working well
   - "⚠️ Attention Needed" - What needs improvement

2. **Market Position**
   - Industry classification
   - Target audience summary
   - Geographic reach
   - Current archetype (simplified to 1-2 primary)

3. **Competitive Landscape**
   - Top 3 competitors identified
   - Your competitive score vs. theirs (visual comparison)
   - Key differentiators you already have
   - Gaps competitors are exploiting

4. **Current Assets**
   - Visual identity (colors, fonts, logo)
   - Messaging themes
   - Content performance summary
   - Social media presence

**Marbs Integration:**
- "Explain this score" - breaks down health score
- "Show me opportunities" - highlights competitive gaps
- "What's my biggest weakness?" - identifies priority fixes

**Synapse Integration:**
- Automatic connection discovery between brand assets and market position
- Psychology scoring on existing messaging
- Competitor messaging analysis

**Design:**
- Hero section: Large health score gauge (like credit score visual)
- 2-column grid: Strengths on left (green), Areas for improvement on right (amber)
- Competitive comparison: Side-by-side scorecard
- Visual assets: Color palette swatches, font samples

### Section 2: OBJECTIVES (Where Do We Want to Be?)

**Purpose:** Help SMB owner set clear, achievable marketing goals

**Sub-sections:**
1. **Goal Builder**
   - Pre-populated SMART goals based on situation
   - Categories: Brand Awareness, Lead Generation, Customer Retention, Revenue
   - Timeline selector: 30/60/90 days, 6 months, 1 year
   - Metric definitions: What success looks like

2. **Recommended Objectives** (AI-generated)
   - Top 3 recommended goals based on situation analysis
   - Why these goals matter
   - Expected impact
   - Effort required

3. **Custom Goals**
   - User can add their own
   - Marbs helps refine them into SMART format
   - Links to relevant metrics

**Marbs Integration:**
- "Help me set realistic goals" - suggests achievable targets
- "What should I focus on first?" - prioritizes goals
- "How do I measure this?" - defines success metrics

**Design:**
- Card-based layout with recommended goals
- Progress bars showing "current → goal"
- Visual timeline with milestones
- Simple goal builder form with AI assistance

### Section 3: STRATEGY (How Do We Get There?)

**Purpose:** Define the overall approach to achieve objectives

**Sub-sections:**
1. **Brand Strategy**
   - Positioning statement (auto-generated, editable)
   - Key message pillars (3-5 main themes)
   - Archetype transformation (if desired)
   - Voice & tone guidelines

2. **Audience Strategy**
   - Primary persona (detailed)
   - Secondary personas
   - Customer journey map (ValueForge integration)
   - Pain points → Solutions mapping

3. **Content Strategy**
   - Content themes aligned with message pillars
   - Platform strategy (where to focus)
   - Content mix (formats, topics)
   - Seasonal planning

4. **Competitive Strategy**
   - Differentiation approach
   - White space opportunities
   - Message saturation avoidance
   - Speed advantages

**Marbs Integration:**
- "Refine my positioning" - helps craft positioning statement
- "Show me content gaps" - identifies opportunities
- "What makes us different?" - extracts differentiators

**Synapse Integration:**
- Connection finder for unexpected angles
- Psychology scoring for positioning statements
- Breakthrough content ideas

**UVP Integration:**
- UVP builder embedded here
- Links UVPs to strategy sections
- Shows how UVPs translate to content

**Design:**
- Strategy canvas layout (visual, interactive)
- Drag-and-drop message pillars
- Customer journey visualization
- Competitive positioning matrix

### Section 4: TACTICS (How Exactly Do We Get There?)

**Purpose:** Specific implementation methods for each platform/channel

**Sub-sections:**
1. **Platform Tactics**
   - Platform-by-platform breakdown
   - For each: Posting frequency, best times, content types, CTAs
   - Templates for each platform
   - Hashtag strategy

2. **Content Tactics**
   - Content calendar preview (links to Action section)
   - Content frameworks library
   - Repurposing strategy
   - Content creation workflows

3. **Engagement Tactics**
   - Response templates
   - Community building approach
   - Engagement triggers
   - Conversation starters

4. **SEO & Search Tactics**
   - Keyword targets
   - Content optimization checklist
   - Local SEO tactics
   - Review generation strategy

**Marbs Integration:**
- "Create a posting schedule" - builds platform calendar
- "What should I post about?" - suggests topics
- "Write a template for me" - generates response templates

**Synapse Integration:**
- Format-specific generators (Hook, Story, Data posts)
- Psychology-optimized CTAs
- Power word optimization

**Design:**
- Tabbed interface by platform
- Checklist-style tactics
- Visual content calendar preview
- Template library cards

### Section 5: ACTION (Content Calendar & Execution)

**Purpose:** Where all content gets created, scheduled, and managed

**This is the Content Calendar System (detailed in Section 6)**

**Sub-sections:**
1. **Calendar View**
   - Month/week/day views
   - Drag-and-drop scheduling
   - Color-coded by platform/pillar
   - Status tracking (draft, scheduled, published)

2. **Content Generator**
   - AI-powered creation using all enrichments
   - Platform-specific formatting
   - Synapse-enhanced content
   - Brand alignment scoring

3. **Design Studio**
   - Visual post creation (detailed in Section 7)
   - Template selection
   - Brand asset integration
   - Export for platforms

4. **Publishing Queue**
   - Review & approve workflow
   - Schedule posts
   - Multi-platform publishing
   - Automation rules

**Marbs Integration:**
- "Create this week's posts" - batch generation
- "Improve this post" - enhancement suggestions
- "Schedule optimal times" - auto-scheduling

**Design:**
- Full-width calendar interface
- Split view: Calendar + content editor
- Real-time preview
- Bulk actions toolbar

### Section 6: CONTROL (Analytics & Monitoring)

**Purpose:** Track performance, measure results, adjust strategy

**This is the Analytics Dashboard (detailed in Section 8)**

**Sub-sections:**
1. **Performance Dashboard**
   - Goal progress tracking
   - KPI scorecards
   - Trend charts
   - Week-over-week comparison

2. **Content Analytics**
   - Best/worst performing content
   - Engagement metrics by platform
   - Content type performance
   - Optimal posting times (learned)

3. **Audience Analytics**
   - Growth metrics
   - Demographic insights
   - Engagement patterns
   - Sentiment analysis

4. **Competitive Monitoring**
   - Competitor activity tracking
   - Share of voice
   - Ranking changes
   - Opportunity alerts

5. **Learning System**
   - What's working (amplify)
   - What's not (adjust)
   - Pattern recognition
   - Recommendation engine

**Marbs Integration:**
- "Explain this drop in engagement" - analyzes trends
- "What should I change?" - suggests adjustments
- "Show me wins" - highlights successes

**Design:**
- Dashboard with customizable widgets
- Interactive charts (click to drill down)
- Comparison tools
- Export/report builder

---

## 5. Marbs AI Assistant System

### Overview

**Marbs** is a persistent, contextually-aware AI assistant that lives in every section of the MARBA platform. Named after "marketing assistant," Marbs understands:
- Where the user is in the platform
- What data they're looking at
- What actions are available
- The user's business context
- Previous conversations

### Architecture

```typescript
// Core Types
interface MarbsContext {
  section: SOSTACSection;
  subsection?: string;
  data: Record<string, any>;
  availableActions: Action[];
  userBusiness: BusinessProfile;
  conversationHistory: Message[];
}

interface MarbsCapability {
  id: string;
  name: string;
  description: string;
  contextRequired: string[];
  availableIn: SOSTACSection[];
  execute: (params: any) => Promise<any>;
}
```

### Contextual Awareness

**How Marbs Knows Context:**

1. **Section Detection**
   - URL path parsing
   - Active tab/section tracking
   - Visible data elements

2. **Data Awareness**
   - Current brand analysis in view
   - Selected competitors
   - Active goals
   - Draft content

3. **Action Availability**
   - Dynamically loaded based on section
   - Permission-aware
   - State-dependent (e.g., "publish" only if content ready)

4. **Conversation Memory**
   - Stores conversation in Supabase
   - References previous questions
   - Maintains context across sessions

### Capabilities by Section

**Situation Section:**
- "Explain this score" → Breaks down brand health calculation
- "Show opportunities" → Highlights competitive gaps
- "What's working?" → Summarizes strong points
- "Compare to [competitor]" → Detailed comparison
- "Generate situation report" → Creates PDF summary

**Objectives Section:**
- "Suggest goals" → AI-generated SMART goals
- "Make this SMART" → Refines user's goal
- "What's realistic?" → Reality check on timeline
- "How do I measure this?" → Defines metrics

**Strategy Section:**
- "Refine positioning" → Improves positioning statement
- "Find content gaps" → Identifies opportunities
- "Build customer journey" → Maps journey stages
- "Create message pillars" → Generates pillars

**Tactics Section:**
- "Create posting schedule" → Generates calendar
- "Write template" → Creates response template
- "Optimize for SEO" → SEO recommendations
- "Best times to post" → Data-driven timing

**Action Section:**
- "Generate week of content" → Batch content creation
- "Improve this post" → Enhancement suggestions
- "Schedule optimally" → Auto-scheduling
- "Create variations" → A/B test versions

**Control Section:**
- "Explain this trend" → Analyzes performance data
- "What should I change?" → Actionable recommendations
- "Compare periods" → Period-over-period analysis
- "Generate report" → Custom reports

### UI Components

**1. Floating Button (Always Visible)**
```tsx
<MarbsFloatingButton
  position="bottom-right"
  onClick={openMarbs}
  badge={hasNewSuggestions}
/>
```

**2. Sidebar Panel**
```tsx
<MarbsSidebar
  isOpen={isOpen}
  context={currentContext}
  onAction={handleAction}
/>
```

**3. Inline Suggestions**
```tsx
<MarbsInlineSuggestion
  trigger="data-quality-low"
  message="This brand health score seems low. Want me to analyze why?"
  actions={['Analyze', 'Dismiss']}
/>
```

**4. Quick Actions Bar**
```tsx
<MarbsQuickActions
  section="strategy"
  suggestions={[
    'Generate positioning statement',
    'Create message pillars',
    'Build customer journey'
  ]}
/>
```

### Implementation

**Service: `marbs/context-awareness.ts`**
```typescript
export class MarbsContextService {
  getCurrentContext(): MarbsContext {
    // Detects section, data, actions
  }

  getAvailableCapabilities(): MarbsCapability[] {
    // Returns section-specific capabilities
  }

  executeAction(action: string, params: any): Promise<any> {
    // Executes the requested action
  }
}
```

**Service: `marbs/conversation-engine.ts`**
```typescript
export class MarbsConversationEngine {
  async chat(message: string, context: MarbsContext): Promise<string> {
    // Uses Claude AI with enriched context
    // Returns natural language response
  }

  async suggestActions(context: MarbsContext): Promise<Action[]> {
    // Proactive suggestions based on context
  }
}
```

**Service: `marbs/action-executor.ts`**
```typescript
export class MarbsActionExecutor {
  async execute(action: Action, params: any): Promise<ExecutionResult> {
    // Executes actions like:
    // - Generate content
    // - Update strategy
    // - Create reports
    // - Schedule posts
  }
}
```

### Synapse Integration for Marbs

Marbs uses Synapse to enhance responses:
- **Connection Discovery** - "Find unexpected angles for this content"
- **Psychology Engine** - "Make this more emotionally compelling"
- **Power Words** - "Optimize this for engagement"

---

## 6. Content Calendar System

### Overview

Fully automated content creation, scheduling, and publishing system integrated into the Action (SOSTAC) section.

### Features

**1. Calendar Views**
- Month view (high-level overview)
- Week view (detailed scheduling)
- Day view (hourly breakdown)
- List view (filterable, sortable)

**2. Content Types**
- Social posts (Facebook, Instagram, LinkedIn, Twitter)
- Google My Business posts
- Blog posts
- Email campaigns
- YouTube videos

**3. Content States**
- Idea (not created yet)
- Draft (created, needs review)
- Scheduled (approved, waiting to publish)
- Published (live)
- Failed (publishing error)

**4. Smart Scheduling**
- Optimal time detection (learned from analytics)
- Platform-specific best times
- Avoid over-posting
- Holiday/event awareness

**5. Bulk Actions**
- Generate week/month of content
- Duplicate successful posts
- Reschedule failed posts
- Archive old content

### Content Generation Flow

```
User clicks "Generate Content"
         ↓
Marbs asks: "What type?" (Social, Blog, Email, etc.)
         ↓
System analyzes:
- Current objectives
- Strategy pillars
- Competitive gaps
- Real-time signals (weather, trends, news)
- Industry patterns
- Customer triggers
         ↓
Synapse Enhancement:
- Connection discovery for unique angles
- Psychology optimization
- Power word integration
         ↓
Generate 3 variations
         ↓
User reviews, selects, edits
         ↓
Design Studio (if visual needed)
         ↓
Schedule or publish
```

### Auto-Generation Logic

**Daily Auto-Generation:**
- Scans calendar for gaps
- Generates draft content to fill
- Notifies user for review
- Never publishes without approval

**Opportunity-Based Generation:**
- Weather alerts → timely posts
- Trending topics → relevant content
- Competitor activity → response content
- Customer reviews → thank you posts
- Local news → community engagement

### Components

**CalendarView.tsx**
- FullCalendar integration
- Drag-and-drop rescheduling
- Color-coded by platform/status
- Quick preview on hover

**ContentGenerator.tsx**
- Modal interface
- Platform selector
- Topic/pillar selector
- Synapse toggle
- Variation preview
- Bulk generation mode

**SchedulingEngine.tsx**
- Optimal time calculator
- Conflict detection
- Platform limits checker
- Timezone handling

**PublishingQueue.tsx**
- Approval workflow
- Scheduled job management
- Publishing status
- Error handling & retry

### Database Schema

```sql
-- Content Calendar Items
CREATE TABLE content_calendar_items (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),

  -- Content
  title TEXT,
  content TEXT,
  content_type TEXT, -- 'social', 'blog', 'email', 'gmb'
  platform TEXT, -- 'facebook', 'instagram', etc.

  -- Scheduling
  scheduled_for TIMESTAMP,
  status TEXT, -- 'idea', 'draft', 'scheduled', 'published', 'failed'

  -- Metadata
  pillar_id UUID,
  goal_id UUID,
  synapse_enhanced BOOLEAN DEFAULT false,

  -- Assets
  image_url TEXT,
  video_url TEXT,

  -- Publishing
  published_at TIMESTAMP,
  platform_id TEXT, -- ID from external platform

  -- Analytics
  views INT DEFAULT 0,
  engagement INT DEFAULT 0,
  clicks INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Auto-generation rules
CREATE TABLE content_auto_rules (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),

  enabled BOOLEAN DEFAULT true,
  frequency TEXT, -- 'daily', 'weekly'
  platforms TEXT[], -- ['facebook', 'instagram']
  content_types TEXT[], -- ['social', 'blog']

  max_drafts_per_day INT DEFAULT 3,
  require_approval BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Design Studio

### Overview

Visual post creation tool for designing stunning social media posts, graphics, and marketing materials using brand assets and templates.

### Core Features

**1. Canvas Editor**
- Drag-and-drop interface
- Text layers with brand fonts
- Image layers with filters
- Shape layers
- Brand color palette
- Undo/redo
- Alignment guides
- Layers panel

**2. Template Library**
- Platform-specific templates (IG post, FB cover, LinkedIn carousel, etc.)
- Industry-specific templates
- Seasonal templates
- Custom templates
- Template categories

**3. Brand Assets Integration**
- Logo auto-loaded
- Brand colors auto-applied
- Brand fonts available
- Previous images library
- Stock photo integration (Unsplash API)

**4. Export Tools**
- Platform-specific sizes (automatic resize)
- Multiple format export (PNG, JPG, PDF)
- Batch export for carousel posts
- Direct to content calendar
- Download to device

### Technical Stack

**Library:** Fabric.js (canvas manipulation) or Konva.js (React-friendly)

**Alternative:** If too complex, integrate with:
- Canva API (if budget allows)
- Custom simplified editor

### Components

**CanvasEditor.tsx**
- Main editing interface
- Tool palette (text, shape, image)
- Property inspector
- Zoom controls
- Export button

**TemplateLibrary.tsx**
- Grid of templates
- Search/filter
- Preview on hover
- One-click apply
- Save custom templates

**BrandAssets.tsx**
- Logo variants
- Color swatches (click to apply)
- Font list
- Image library
- Upload new assets

**ExportTools.tsx**
- Platform preset buttons
- Size customization
- Format selection
- Quality settings
- Save to calendar integration

### Workflow

```
1. User clicks "Create Visual" from content calendar
2. Opens Design Studio modal
3. Selects template or starts blank
4. Edit with brand assets
5. Preview for different platforms
6. Export or save to content item
7. Content calendar updated with image
```

### Integration with Content Calendar

- Design Studio accessible from calendar item
- Automatically attaches created image to content
- Saves design for future editing
- Template suggestions based on content type

---

## 8. Analytics & Engagement

### Overview

Comprehensive analytics dashboard in the Control (SOSTAC) section, showing performance metrics, insights, and providing engagement tools.

### Dashboard Sections

**1. Goal Progress Tracking**
- Visual progress bars for each objective
- Current vs. target
- On-track indicator
- Time remaining
- Projected completion date

**2. KPI Scorecards**
- Key metrics at-a-glance
- Week-over-week change
- Color-coded (green/red)
- Drill-down capability

**3. Content Performance**
- Best performing posts (by engagement, clicks, conversions)
- Worst performing (learn what doesn't work)
- Performance by platform
- Performance by pillar
- Performance by content type
- Optimal posting times (learned)

**4. Audience Analytics**
- Follower growth trends
- Demographic breakdown
- Geographic distribution
- Engagement patterns (when they're active)
- Sentiment analysis (from comments/reviews)

**5. Competitive Monitoring**
- Competitor posting frequency
- Competitor engagement rates
- Share of voice
- Keyword ranking changes
- Opportunity alerts

**6. Engagement Dashboard**
- Recent comments/messages
- Sentiment indicators
- Quick reply interface
- Template suggestions
- Engagement rate trends

### Analytics Data Sources

**Platform APIs:**
- Facebook Graph API
- Instagram Basic Display API
- LinkedIn API
- Twitter API
- Google My Business API
- YouTube Analytics API

**Internal Sources:**
- Content calendar publishing data
- Click tracking (UTM parameters)
- Conversion tracking
- Review monitoring

**Third-party:**
- SEMrush (competitive data)
- Google Analytics
- Google Search Console

### Engagement Tools

**Comment Management:**
- Unified inbox (all platforms)
- Sentiment detection
- Priority flagging (negative sentiment)
- Quick reply with templates
- AI-suggested responses (Marbs)

**Review Management:**
- Review monitoring (Google, Yelp, Facebook)
- Response templates
- Sentiment tracking
- Review generation campaigns

### Components

**PerformanceCharts.tsx**
- Time-series charts (engagement over time)
- Bar charts (comparison)
- Pie charts (distribution)
- Custom date ranges
- Export to PDF/CSV

**EngagementMetrics.tsx**
- Engagement rate calculator
- Platform comparison
- Content type comparison
- Trend indicators

**AudienceInsights.tsx**
- Demographic charts
- Growth charts
- Activity heatmaps
- Follower quality score

**ReportBuilder.tsx**
- Custom report creation
- Widget selection
- Date range
- Export formats
- Scheduled reports

### Database Schema

```sql
-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  content_item_id UUID REFERENCES content_calendar_items(id),

  platform TEXT,
  event_type TEXT, -- 'view', 'click', 'engagement', 'share'

  event_data JSONB,
  user_data JSONB, -- demographics, location

  occurred_at TIMESTAMP DEFAULT NOW()
);

-- Platform metrics snapshot
CREATE TABLE platform_metrics_snapshots (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),

  platform TEXT,
  snapshot_date DATE,

  followers INT,
  engagement_rate DECIMAL,
  impressions INT,
  reach INT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Engagement inbox
CREATE TABLE engagement_inbox (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),

  platform TEXT,
  platform_id TEXT, -- ID from platform

  type TEXT, -- 'comment', 'message', 'review'
  content TEXT,
  author TEXT,

  sentiment TEXT, -- 'positive', 'neutral', 'negative'
  priority TEXT, -- 'high', 'medium', 'low'

  status TEXT, -- 'new', 'replied', 'archived'
  replied_at TIMESTAMP,
  reply_text TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. UVP Redesign

### Overview

Redesign the UVP (Unique Value Proposition) builder to match the new MARBA aesthetic and integrate seamlessly with the Strategy section.

### Changes from Current UVP

**Current Issues:**
- Separate experience from Mirror
- Doesn't follow MARBA design system
- Limited integration with brand strategy
- UVP not utilized in content generation to full potential

**New Approach:**
- Embedded in Strategy section
- Follows MARBA design system
- UVPs directly linked to message pillars
- Real-time content enhancement with UVPs
- UVP builder can be standalone or guided

### Redesigned UVP Flow

**1. Context Setting** (If not from Mirror)
- Business name, industry, location
- Quick website scan
- Competitor identification

**2. Value Discovery** (Improved)
- "What problems do you solve?" → Pain points
- "What makes you different?" → Differentiators
- "What results do you deliver?" → Outcomes

**3. UVP Generation** (Enhanced with Synapse)
- 3 UVP variations generated
- Each scored for:
  - Clarity (1-10)
  - Differentiation (1-10)
  - Emotional appeal (1-10)
  - Specificity (1-10)
- Synapse enhancement for psychology optimization
- Power word integration

**4. Competitive Positioning**
- Plot UVP against competitors
- Show differentiation visually
- Identify positioning gaps

**5. Application to Strategy**
- UVPs → Message Pillars
- UVPs → Content Themes
- UVPs → Positioning Statement

### Components

**ValuePropositionBuilder.tsx**
- Multi-step wizard
- Real-time UVP preview
- Scoring visualizations
- Synapse enhancement toggle

**CompetitivePositioning.tsx**
- 2x2 positioning matrix
- Competitor plotting
- Differentiation calculator
- White space identifier

**UVPApplications.tsx**
- Shows how UVPs translate to:
  - Positioning statement
  - Message pillars
  - Content themes
  - Social bios
  - Email signatures

### Integration Points

**With Mirror Strategy:**
- UVP builder embedded in Strategy section
- UVPs auto-populate message pillars
- Positioning statement auto-generated from UVPs

**With Content Generation:**
- Every generated content piece references UVPs
- Content alignment score includes UVP matching
- Templates pre-populated with UVP language

**With Synapse:**
- Connection discovery between UVPs and customer triggers
- Psychology scoring on UVP clarity
- Emotional optimization

---

## 10. API Enrichment Strategy

### Overview

Every section of the Mirror should be enriched with data from our extensive API stack. No manual entry unless absolutely necessary.

### API Stack Inventory

**1. Content Intelligence APIs**
- Business intelligence analysis
- Industry profile (140+ industries)
- Customer triggers
- Power words
- Seasonal trends
- Proven CTAs

**2. Competitive Intelligence APIs**
- Competitor identification
- SEMrush integration
- Keyword gap analysis
- Content gap analysis
- Social opportunity detection

**3. Synapse APIs**
- Connection discovery (2-way, 3-way)
- Psychology engine
- Content generation (multiple formats)
- Power word optimization
- Breakthrough scoring

**4. UVP APIs**
- UVP generation
- Competitive positioning
- Context adaptation

**5. ValueForge APIs**
- Customer journey mapping
- Persona detection
- Transformation analysis
- Discovery path analysis

**6. Platform APIs**
- Facebook Graph API
- Instagram API
- Google My Business API
- LinkedIn API
- Twitter API
- YouTube API

**7. Data Enrichment APIs**
- Weather API (timely content)
- Google Trends API (trending topics)
- Reddit API (community discussions)
- News APIs (local news)
- Perplexity API (research)

### Enrichment by Section

**Situation Section:**
- Industry Profile API → Industry classification, benchmarbs
- Competitive Intelligence API → Competitor identification, scoring
- Platform APIs → Current performance metrics
- Content Intelligence API → Brand health calculation

**Objectives Section:**
- Industry Profile API → Realistic goal benchmarbs
- Competitive Intelligence API → Competitive goal setting
- Analytics API → Historical performance for projections

**Strategy Section:**
- UVP API → Value proposition generation
- ValueForge API → Customer journey mapping, personas
- Content Intelligence API → Message pillars, content themes
- Competitive Intelligence API → Differentiation opportunities

**Tactics Section:**
- Content Intelligence API → Platform-specific tactics
- Industry Profile API → Best times, formats, CTAs
- Synapse API → Content frameworks

**Action Section:**
- Content Intelligence API → Content generation with all enrichments
- Synapse API → Connection discovery, psychology optimization
- Platform APIs → Scheduling, publishing
- Weather/Trends APIs → Timely content triggers

**Control Section:**
- Platform APIs → Analytics data
- Competitive Intelligence API → Competitive monitoring
- Internal Analytics API → Performance tracking

### Auto-Enrichment Engine

**Service: `enrichment-engine.ts`**

```typescript
export class EnrichmentEngine {
  async enrichSituation(brandId: string): Promise<EnrichedSituation> {
    const [industry, competitors, performance, brandHealth] = await Promise.all([
      this.fetchIndustryProfile(brandId),
      this.fetchCompetitors(brandId),
      this.fetchCurrentPerformance(brandId),
      this.calculateBrandHealth(brandId)
    ]);

    return {
      industry,
      competitors,
      performance,
      brandHealth,
      lastEnriched: new Date()
    };
  }

  async enrichStrategy(brandId: string): Promise<EnrichedStrategy> {
    // Similar pattern for all sections
  }

  // Background job: Re-enrich every 24 hours
  async scheduleAutoEnrichment(brandId: string): Promise<void> {
    // Cron job setup
  }
}
```

### Caching Strategy

**Problem:** API calls are expensive and slow

**Solution:** Smart caching with TTL

```typescript
interface CachePolicy {
  key: string;
  ttl: number; // seconds
  refreshInBackground: boolean;
}

const CACHE_POLICIES: Record<string, CachePolicy> = {
  industryProfile: { key: 'industry:{brandId}', ttl: 86400, refreshInBackground: true }, // 24 hours
  competitors: { key: 'competitors:{brandId}', ttl: 3600, refreshInBackground: true }, // 1 hour
  performance: { key: 'performance:{brandId}', ttl: 300, refreshInBackground: false }, // 5 minutes
  brandHealth: { key: 'health:{brandId}', ttl: 1800, refreshInBackground: true }, // 30 minutes
};
```

---

## 11. Synapse Integration Points

### Overview

Synapse is our advanced content psychology and connection discovery engine. It should be integrated wherever it adds real value, not just "everywhere."

### Where Synapse Adds Value

**✅ YES - Integrate Synapse:**

**1. Content Generation (Action Section)**
- **Connection Discovery:** Find unexpected angles for content
- **Psychology Engine:** Optimize emotional appeal
- **Power Words:** Enhance engagement potential
- **Format Generators:** Use specialized generators (Hook, Story, Data)

**2. UVP Building (Strategy Section)**
- **Psychology Scoring:** Score UVP emotional appeal
- **Connection Discovery:** Find unexpected value connections
- **Power Words:** Optimize UVP language

**3. Message Pillar Creation (Strategy Section)**
- **Connection Discovery:** Link pillars to customer triggers
- **Psychology Engine:** Ensure emotional resonance

**4. Positioning Statement (Strategy Section)**
- **Psychology Scoring:** Score positioning clarity
- **Power Words:** Optimize for impact

**5. Content Review/Improvement (Action Section)**
- **Psychology Engine:** Analyze existing content
- **Power Words:** Suggest improvements
- **Format Conversion:** Repurpose content

**❌ NO - Don't Integrate Synapse:**

- Brand health calculation (objective metrics)
- Competitive scoring (data-driven)
- Analytics (performance data)
- Industry classification (algorithmic)
- Goal setting (user-driven)

### Synapse UI Patterns

**Pattern 1: Toggle Enhancement**

```tsx
<ContentGenerator>
  <SynapseToggle
    enabled={synapseEnabled}
    onChange={setSynapseEnabled}
    tooltip="Enhance with connection discovery and psychology optimization"
  />

  {synapseEnabled && (
    <SynapseOptions>
      <Checkbox>Connection Discovery</Checkbox>
      <Checkbox>Psychology Optimization</Checkbox>
      <Checkbox>Power Word Enhancement</Checkbox>
    </SynapseOptions>
  )}
</ContentGenerator>
```

**Pattern 2: Inline Suggestions**

```tsx
<PositioningStatementEditor>
  <TextArea value={positioning} onChange={setPositioning} />

  <SynapseInsight type="suggestion">
    💡 Synapse suggests: "Try connecting 'fast service' to 'peace of mind' for emotional appeal"
  </SynapseInsight>

  <Button onClick={applySynapseSuggestion}>Apply Suggestion</Button>
</PositioningStatementEditor>
```

**Pattern 3: Score Enhancement**

```tsx
<UVPCard uvp={uvp}>
  <ScoreDisplay>
    <Score label="Clarity" value={8.5} />
    <Score label="Differentiation" value={7.2} />
    <Score label="Emotional Appeal" value={6.8} synapse />
  </ScoreDisplay>

  <Button onClick={enhanceWithSynapse}>
    ✨ Enhance with Synapse
  </Button>
</UVPCard>
```

### Synapse Services Integration

```typescript
// In content generation
import { ConnectionDiscoveryEngine } from '@/services/synapse/connections';
import { ContentPsychologyEngine } from '@/services/synapse/generation/ContentPsychologyEngine';
import { PowerWordOptimizer } from '@/services/synapse/generation/PowerWordOptimizer';

async function generateContent(prompt: string, enableSynapse: boolean) {
  let content = await baseGeneration(prompt);

  if (enableSynapse) {
    // Find unexpected connections
    const connections = await ConnectionDiscoveryEngine.find2WayConnections(
      prompt.concepts
    );

    // Optimize psychology
    content = await ContentPsychologyEngine.optimize(content, {
      targetEmotion: 'excitement',
      intensityLevel: 0.7
    });

    // Add power words
    content = await PowerWordOptimizer.enhance(content, {
      industry: userIndustry,
      placement: ['headline', 'CTA']
    });
  }

  return content;
}
```

### Synapse Capabilities Exposed to Marbs

Marbs can invoke Synapse on user request:

- "Find connections for this concept"
- "Make this more emotional"
- "Optimize this for engagement"
- "Add power words"
- "Create a hook version"
- "Convert to story format"

---

## 12. Migration Plan

### Overview

Move from `/Users/byronhudson/marba/Figma/` to `~/Projects/MARBA/` with clean organization.

### Migration Strategy

**Rules:**
1. **COPY, don't move** - Original stays intact in marba
2. **Only copy what's needed** - No legacy code, no cruft
3. **Reorganize cleanly** - Follow new architecture
4. **Rename references** - marba → marba
5. **Update imports** - Fix all import paths

### What to Migrate

**✅ Components to Copy:**

From `Figma/src/components/`:
- `synapse/` → `MARBA/src/components/synapse/` (all synapse components)
- `uvp/` → `MARBA/src/components/uvp/` (redesigned)
- `valueForge/` → `MARBA/src/components/valueForge/`
- `ui/` → `MARBA/src/components/ui/` (shadcn components)
- `mirror/` → `MARBA/src/components/mirror/` (RESTRUCTURED for SOSTAC)

**✅ Services to Copy:**

From `Figma/src/services/`:
- `synapse/` → `MARBA/src/services/synapse/`
- `uvp/` → `MARBA/src/services/uvp/`
- `valueForge/` → `MARBA/src/services/valueForge/`
- `contentIntelligence/` → `MARBA/src/services/content-intelligence/`
- `v4Integration/` → `MARBA/src/services/integration/` (renamed)

**✅ Types to Copy:**

From `Figma/src/types/`:
- All `.ts` files → `MARBA/src/types/`
- Rename `BrandMirror.ts` → `mirror.types.ts`
- Rename `MARBAScore.ts` → `marba-score.types.ts`

**✅ Database:**

From `Figma/supabase/`:
- `migrations/` → Review and create new consolidated migration
- `functions/` → `MARBA/supabase/functions/` (selective copy)

**✅ Configuration:**

- `package.json` → Create new with updated deps
- `tsconfig.json` → Copy and update paths
- `tailwind.config.js` → Copy and enhance
- `vite.config.ts` → Copy and update

**❌ Do NOT Copy:**

- Old onboarding components (being replaced)
- Legacy admin components (out of scope)
- Test files (will rewrite)
- Build artifacts
- node_modules
- .git

### Migration Steps

**Phase 1: Setup New Structure**

```bash
# Create directory structure
cd ~/Projects/MARBA
mkdir -p src/{components,services,types,lib,styles}
mkdir -p src/components/{mirror,marbs,content-calendar,design-studio,analytics,uvp,synapse,ui}
mkdir -p src/services/{mirror,marbs,content-intelligence,synapse,uvp,valueForge,integration}
mkdir -p supabase/{functions,migrations}
mkdir -p public/assets
```

**Phase 2: Copy Core Services**

```bash
# Copy services (will need path updates)
cp -r /Users/byronhudson/marba/Figma/src/services/synapse src/services/
cp -r /Users/byronhudson/marba/Figma/src/services/uvp src/services/
cp -r /Users/byronhudson/marba/Figma/src/services/valueForge src/services/
cp -r /Users/byronhudson/marba/Figma/src/services/contentIntelligence src/services/content-intelligence
```

**Phase 3: Copy Types**

```bash
cp /Users/byronhudson/marba/Figma/src/types/*.ts src/types/
```

**Phase 4: Copy UI Components**

```bash
cp -r /Users/byronhudson/marba/Figma/src/components/ui src/components/
cp -r /Users/byronhudson/marba/Figma/src/components/synapse src/components/
```

**Phase 5: Copy Config**

```bash
cp /Users/byronhudson/marba/Figma/package.json .
cp /Users/byronhudson/marba/Figma/tsconfig.json .
cp /Users/byronhudson/marba/Figma/tailwind.config.js .
cp /Users/byronhudson/marba/Figma/vite.config.ts .
```

**Phase 6: Update All Imports**

Use find-replace across codebase:
- `../../components/` → Depends on new structure
- `@/components/` → Use absolute imports
- Fix all relative imports to use new paths

**Phase 7: Initialize Git**

```bash
cd ~/Projects/MARBA
git init
git add .
git commit -m "Initial commit: MARBA Mirror redesign"
```

### File Mapping Reference

```
OLD → NEW

# Components
Figma/src/components/AssetAnalysis/BrandMirrorTabs/BrandMirrorTabs.tsx
  → src/components/mirror/MirrorTabs.tsx (redesigned for SOSTAC)

Figma/src/components/synapse/
  → src/components/synapse/ (direct copy)

Figma/src/components/uvp/UVPWizard.tsx
  → src/components/uvp/UVPWizard.tsx (redesigned)

# Services
Figma/src/services/synapse/
  → src/services/synapse/ (direct copy)

Figma/src/services/contentIntelligence/
  → src/services/content-intelligence/ (renamed)

# Types
Figma/src/types/BrandMirror.ts
  → src/types/mirror.types.ts (renamed)

Figma/src/types/MARBAScore.ts
  → src/types/marba-score.types.ts (renamed)
```

---

## 13. Marba → MARBA Renaming

### Overview

Systematically replace all references to "marba", "MARBA", "Marba" with "marba", "MARBA", "Marba".

### Renaming Strategy

**Case Variations:**
- `marba` → `marba`
- `Marba` → `Marba`
- `MARBA` → `MARBA`
- `MARBA` → `MARBA`

**Where to Rename:**

1. **File Names**
   - Component files
   - Service files
   - Type files
   - Configuration files

2. **File Contents**
   - Comments
   - String literals
   - Variable names
   - Function names
   - Class names
   - Type names
   - Interface names

3. **Configuration**
   - package.json (name, description)
   - README.md
   - HTML title tags
   - Meta tags

4. **Database**
   - Table names (if any contain "marba")
   - Column names
   - Function names

5. **URLs/Routes**
   - API endpoints
   - Page routes
   - Supabase function names

### Find & Replace Script

```bash
#!/bin/bash
# rename-to-marba.sh

# Find all files (excluding node_modules, .git)
find ~/Projects/MARBA \
  -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  | while read file; do

  # Replace in file contents
  sed -i '' 's/marba/marba/g' "$file"
  sed -i '' 's/Marba/Marba/g' "$file"
  sed -i '' 's/MARBA/MARBA/g' "$file"
  sed -i '' 's/MARBA/MARBA/g' "$file"

  echo "Processed: $file"
done

# Rename files themselves
find ~/Projects/MARBA \
  -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  | grep -i marba \
  | while read file; do

  newfile=$(echo "$file" | sed 's/marba/marba/g' | sed 's/Marba/Marba/g')
  mv "$file" "$newfile"
  echo "Renamed file: $file → $newfile"
done
```

### Manual Review Required

After automated renaming, manually check:

1. **Brand-specific content**
   - Marketing copy
   - About page
   - Terms of service
   - Privacy policy

2. **External references**
   - API documentation
   - Third-party integrations
   - Environment variables

3. **Database**
   - Existing data (may reference old name)
   - Migration scripts

### Testing After Rename

```bash
# 1. Check for any remaining "marba" references
grep -r "marba" ~/Projects/MARBA/src --exclude-dir=node_modules

# 2. Check build succeeds
npm run build

# 3. Check TypeScript compilation
npm run type-check

# 4. Check for broken imports
npm run lint
```

---

## 14. Design System

### Overview

$100k SaaS aesthetic - clean, modern, professional, trustworthy.

### Design Principles

1. **Clean & Minimal** - Lots of white space, clear hierarchy
2. **Data-Forward** - Information is the hero, not decoration
3. **Professional** - Serious business tool, not a toy
4. **Accessible** - WCAG AA compliance minimum
5. **Consistent** - Reusable patterns throughout

### Color Palette

```css
:root {
  /* Primary - Professional Blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6; /* Main */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Secondary - Vibrant Purple */
  --color-secondary-500: #8b5cf6;
  --color-secondary-600: #7c3aed;

  /* Success - Green */
  --color-success-500: #10b981;
  --color-success-600: #059669;

  /* Warning - Amber */
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;

  /* Danger - Red */
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;

  /* Neutral - Grays */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}
```

### Typography

**Font Stack:**
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
}
```

**Type Scale:**
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Component Library

Using **shadcn/ui** as base (already in marba), with customizations:

**Key Components:**
- Button (primary, secondary, outline, ghost, danger)
- Card (elevated, flat, interactive)
- Input (text, number, email, password, search)
- Select (single, multi, searchable)
- Modal (small, medium, large, full-screen)
- Tabs (horizontal, vertical)
- Table (sortable, filterable, paginated)
- Chart (line, bar, pie, gauge)
- Badge (status, count, category)
- Tooltip (info, warning, help)
- Notification (toast, alert, banner)

### Layout Patterns

**Page Layout:**
```
┌─────────────────────────────────────────────┐
│ Top Navigation Bar                          │ (sticky)
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────┬──────────────────────────┐  │
│  │            │                          │  │
│  │  Sidebar   │  Main Content Area       │  │
│  │  (fixed)   │  (scrollable)            │  │
│  │            │                          │  │
│  └────────────┴──────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Card Grid Pattern:**
```
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Card 1   │ │  Card 2   │ │  Card 3   │
│           │ │           │ │           │
└───────────┘ └───────────┘ └───────────┘
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Card 4   │ │  Card 5   │ │  Card 6   │
│           │ │           │ │           │
└───────────┘ └───────────┘ └───────────┘
```

### Animation & Transitions

**Principles:**
- Purposeful, not decorative
- Fast (200-300ms)
- Ease-out for entrances
- Ease-in for exits

**Common Animations:**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Responsive Breakpoints

```css
/* Mobile-first approach */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Accessibility

**Requirements:**
- All interactive elements keyboard accessible
- Focus indicators visible (2px blue outline)
- Color contrast ratio ≥ 4.5:1 for text
- Alt text for all images
- ARIA labels for icon-only buttons
- Skip navigation link
- Semantic HTML

---

## 15. Database Schema Changes

### New Tables Required

```sql
-- Mirror sections data
CREATE TABLE mirror_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  section TEXT NOT NULL, -- 'situation', 'objectives', 'strategy', 'tactics', 'action', 'control'

  data JSONB NOT NULL, -- Section-specific data

  last_enriched TIMESTAMP,
  auto_enrich_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mirror_sections_brand ON mirror_sections(brand_id);
CREATE INDEX idx_mirror_sections_section ON mirror_sections(section);

-- Marbs conversation history
CREATE TABLE marbs_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  section TEXT, -- Which SOSTAC section
  subsection TEXT, -- Which subsection

  role TEXT NOT NULL, -- 'user' or 'assistant'
  message TEXT NOT NULL,

  context JSONB, -- Context at time of message
  actions_taken JSONB, -- Actions executed

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marbs_conversations_brand ON marbs_conversations(brand_id);
CREATE INDEX idx_marbs_conversations_user ON marbs_conversations(user_id);

-- Content calendar (expanded from existing)
CREATE TABLE content_calendar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'social', 'blog', 'email', 'gmb', 'video'
  platform TEXT, -- 'facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'gmb'

  -- Scheduling
  scheduled_for TIMESTAMP,
  status TEXT DEFAULT 'draft', -- 'idea', 'draft', 'scheduled', 'published', 'failed'

  -- Metadata
  pillar_id UUID,
  goal_id UUID,

  -- Enrichments
  synapse_enhanced BOOLEAN DEFAULT false,
  uvp_integrated BOOLEAN DEFAULT false,

  -- Assets
  image_url TEXT,
  video_url TEXT,
  design_data JSONB, -- Design studio canvas data

  -- Publishing
  published_at TIMESTAMP,
  platform_post_id TEXT, -- ID from external platform
  publish_error TEXT,

  -- Analytics
  views INT DEFAULT 0,
  engagement INT DEFAULT 0,
  clicks INT DEFAULT 0,
  shares INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_calendar_brand ON content_calendar_items(brand_id);
CREATE INDEX idx_content_calendar_scheduled ON content_calendar_items(scheduled_for);
CREATE INDEX idx_content_calendar_status ON content_calendar_items(status);

-- Design studio templates
CREATE TABLE design_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  category TEXT, -- 'social', 'ad', 'email', 'presentation'
  platform TEXT, -- 'instagram-post', 'facebook-cover', etc.

  thumbnail_url TEXT,
  canvas_data JSONB NOT NULL, -- Fabric.js/Konva canvas JSON

  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),

  usage_count INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_design_templates_category ON design_templates(category);
CREATE INDEX idx_design_templates_platform ON design_templates(platform);

-- Analytics events (expanded)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_calendar_items(id) ON DELETE SET NULL,

  platform TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'click', 'engagement', 'share', 'conversion'

  event_data JSONB, -- Event-specific data
  user_data JSONB, -- User demographics, location

  occurred_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_brand ON analytics_events(brand_id);
CREATE INDEX idx_analytics_events_content ON analytics_events(content_item_id);
CREATE INDEX idx_analytics_events_occurred ON analytics_events(occurred_at);

-- Platform metrics snapshots
CREATE TABLE platform_metrics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  platform TEXT NOT NULL,
  snapshot_date DATE NOT NULL,

  followers INT,
  following INT,
  engagement_rate DECIMAL(5,2),
  impressions INT,
  reach INT,
  profile_views INT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_platform_snapshots_brand ON platform_metrics_snapshots(brand_id);
CREATE INDEX idx_platform_snapshots_date ON platform_metrics_snapshots(snapshot_date);

-- Engagement inbox (comments, messages, reviews)
CREATE TABLE engagement_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  platform TEXT NOT NULL,
  platform_id TEXT NOT NULL, -- ID from platform

  type TEXT NOT NULL, -- 'comment', 'message', 'review', 'mention'
  content TEXT NOT NULL,
  author TEXT,
  author_id TEXT,

  sentiment TEXT, -- 'positive', 'neutral', 'negative'
  priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'

  status TEXT DEFAULT 'new', -- 'new', 'replied', 'archived', 'spam'

  reply_text TEXT,
  replied_at TIMESTAMP,
  replied_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_engagement_inbox_brand ON engagement_inbox(brand_id);
CREATE INDEX idx_engagement_inbox_status ON engagement_inbox(status);
CREATE INDEX idx_engagement_inbox_created ON engagement_inbox(created_at);

-- SOSTAC objectives/goals (expanded from brand_goals)
CREATE TABLE sostac_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  category TEXT NOT NULL, -- 'awareness', 'leads', 'retention', 'revenue'

  -- SMART criteria
  specific TEXT,
  measurable TEXT, -- Metric definition
  achievable TEXT, -- Why it's realistic
  relevant TEXT, -- Why it matters
  time_bound TEXT, -- Timeline

  -- Metrics
  current_value DECIMAL,
  target_value DECIMAL,
  unit TEXT, -- 'followers', 'leads', 'dollars', 'percent'

  timeline_start DATE,
  timeline_end DATE,

  status TEXT DEFAULT 'active', -- 'active', 'paused', 'achieved', 'abandoned'

  progress DECIMAL(5,2), -- Percentage complete

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_objectives_brand ON sostac_objectives(brand_id);
CREATE INDEX idx_objectives_status ON sostac_objectives(status);

-- Auto-enrichment schedule
CREATE TABLE enrichment_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  section TEXT NOT NULL,

  enabled BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'

  last_run TIMESTAMP,
  next_run TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_enrichment_schedule_next ON enrichment_schedule(next_run);
```

### Modified Tables

```sql
-- Add MARBA-specific fields to existing brands table
ALTER TABLE brands
  ADD COLUMN mirror_version TEXT DEFAULT '2.0',
  ADD COLUMN sostac_enabled BOOLEAN DEFAULT true,
  ADD COLUMN auto_enrichment_enabled BOOLEAN DEFAULT true,
  ADD COLUMN marbs_enabled BOOLEAN DEFAULT true;

-- Add synapse fields to existing content tables
ALTER TABLE content_calendar_ideas
  ADD COLUMN synapse_enhanced BOOLEAN DEFAULT false,
  ADD COLUMN psychology_score DECIMAL(3,2),
  ADD COLUMN connection_count INT DEFAULT 0;
```

---

## 16. Implementation Phases

### Overview

8-week implementation plan broken into 2-week sprints.

### Sprint 1: Foundation & Setup (Weeks 1-2)

**Goals:**
- Set up new MARBA directory structure
- Migrate core services and types
- Build Marbs assistant foundation
- Design system implementation

**Tasks:**

**Week 1:**
- [ ] Create ~/Projects/MARBA directory structure
- [ ] Copy and organize services (synapse, uvp, valueForge, content-intelligence)
- [ ] Copy and rename types
- [ ] Set up package.json with dependencies
- [ ] Configure TypeScript, Tailwind, Vite
- [ ] Initialize Git repository

**Week 2:**
- [ ] Implement design system (colors, typography, components)
- [ ] Build Marbs context awareness service
- [ ] Build Marbs conversation engine
- [ ] Create Marbs UI components (floating button, sidebar)
- [ ] Test Marbs in isolated environment

**Deliverables:**
- Clean project structure in ~/Projects/MARBA
- Working Marbs assistant (basic version)
- Design system implemented

### Sprint 2: SOSTAC Mirror Core (Weeks 3-4)

**Goals:**
- Build Situation section
- Build Objectives section
- Implement enrichment engine

**Tasks:**

**Week 3:**
- [ ] Create mirror navigation structure
- [ ] Build Situation section:
  - [ ] Brand health overview
  - [ ] Market position
  - [ ] Competitive landscape
  - [ ] Current assets
- [ ] Integrate Marbs into Situation
- [ ] Connect to existing APIs

**Week 4:**
- [ ] Build Objectives section:
  - [ ] Goal builder
  - [ ] Recommended objectives
  - [ ] Custom goals
- [ ] Integrate Marbs into Objectives
- [ ] Build enrichment engine service
- [ ] Implement auto-enrichment scheduling

**Deliverables:**
- Situation section complete and enriched
- Objectives section complete
- Auto-enrichment working

### Sprint 3: Strategy & Tactics (Weeks 5-6)

**Goals:**
- Build Strategy section
- Build Tactics section
- Integrate UVP and ValueForge

**Tasks:**

**Week 5:**
- [ ] Build Strategy section:
  - [ ] Brand strategy
  - [ ] Audience strategy (ValueForge integration)
  - [ ] Content strategy
  - [ ] Competitive strategy
- [ ] Redesign UVP wizard for new aesthetic
- [ ] Integrate UVP into Strategy
- [ ] Integrate Synapse into Strategy

**Week 6:**
- [ ] Build Tactics section:
  - [ ] Platform tactics
  - [ ] Content tactics
  - [ ] Engagement tactics
  - [ ] SEO tactics
- [ ] Integrate Marbs into Strategy and Tactics
- [ ] Build template libraries

**Deliverables:**
- Strategy section complete with UVP integration
- Tactics section complete
- Synapse integrated for content strategy

### Sprint 4: Action & Control (Weeks 7-8)

**Goals:**
- Build Content Calendar (Action)
- Build Design Studio
- Build Analytics Dashboard (Control)

**Tasks:**

**Week 7:**
- [ ] Build Content Calendar:
  - [ ] Calendar views (month/week/day)
  - [ ] Content generator
  - [ ] Scheduling engine
  - [ ] Publishing queue
- [ ] Build auto-generation logic
- [ ] Integrate Synapse into content generation
- [ ] Test publishing to platforms

**Week 8:**
- [ ] Build Design Studio:
  - [ ] Canvas editor (basic)
  - [ ] Template library
  - [ ] Brand assets integration
  - [ ] Export tools
- [ ] Build Analytics Dashboard:
  - [ ] Performance charts
  - [ ] Content analytics
  - [ ] Audience analytics
  - [ ] Engagement inbox
- [ ] Integrate Marbs into Action and Control

**Deliverables:**
- Content Calendar fully functional
- Design Studio working (MVP)
- Analytics Dashboard complete
- All 6 SOSTAC sections complete

### Post-Sprint: Polish & Launch (Weeks 9-10)

**Tasks:**
- [ ] Complete marba → marba renaming
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] User acceptance testing
- [ ] Bug fixes
- [ ] Launch preparation

---

## 17. Risk Assessment

### High-Risk Items 🔥🔥🔥

**1. API Rate Limits & Costs**
- **Risk:** Synapse, content generation, enrichment APIs could hit rate limits or cost too much
- **Mitigation:** Implement aggressive caching, user limits, freemium model

**2. Design Studio Complexity**
- **Risk:** Building a canvas editor is hard, could take weeks
- **Mitigation:** Use Fabric.js library, limit to MVP features, consider Canva API integration

**3. Platform Publishing Integration**
- **Risk:** Each platform API has quirks, auth flows, limitations
- **Mitigation:** Start with 2 platforms (Facebook, Instagram), add others incrementally

**4. Data Migration**
- **Risk:** Existing brand data needs to map to new SOSTAC structure
- **Mitigation:** Build data adapter, test with sample brands, provide manual override

### Medium-Risk Items 🔥🔥

**5. Marbs Context Awareness**
- **Risk:** Context detection could be buggy, suggestions irrelevant
- **Mitigation:** Extensive testing, fallback to generic suggestions, user feedback loop

**6. Auto-Enrichment Performance**
- **Risk:** Background enrichment could slow down app
- **Mitigation:** Use Supabase Edge Functions, queue system, only enrich when stale

**7. Analytics Data Accuracy**
- **Risk:** Platform APIs don't always return reliable data
- **Mitigation:** Data validation, anomaly detection, user-facing disclaimers

### Low-Risk Items 🔥

**8. UI/UX Polish**
- **Risk:** Design might not feel "$100k SaaS"
- **Mitigation:** Reference competitors (HubSpot, Salesforce), user testing, iterate

**9. Mobile Responsiveness**
- **Risk:** Complex dashboards hard to make mobile-friendly
- **Mitigation:** Mobile-first approach, simplified mobile views, progressive disclosure

---

## 18. Success Metrics

### Launch Metrics (Week 1)

- [ ] All 6 SOSTAC sections load without errors
- [ ] Marbs responds to queries in <2 seconds
- [ ] Content generation works for all platforms
- [ ] Design Studio can export images
- [ ] Analytics dashboard displays data
- [ ] 0 critical bugs

### 30-Day Metrics

- [ ] 10 beta users onboarded
- [ ] Average session time >10 minutes
- [ ] <5% error rate
- [ ] Content calendar used by 80% of users
- [ ] Marbs queries average 5+ per session
- [ ] User satisfaction score >4/5

### 90-Day Metrics

- [ ] 100+ active users
- [ ] 1000+ content pieces generated
- [ ] 500+ designs created
- [ ] 80% user retention
- [ ] <1% error rate
- [ ] User NPS >50

---

## Appendix A: Technology Stack Details

### Frontend
- **React** 18.3.1 - UI framework
- **TypeScript** 5.9.3 - Type safety
- **Vite** 6.3.5 - Build tool
- **Tailwind CSS** 4.1.16 - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Headless components
- **Lucide React** - Icons
- **FullCalendar** - Calendar views
- **Fabric.js** or **Konva.js** - Canvas editor
- **Recharts** - Charts
- **React Query** - Data fetching

### Backend
- **Supabase** - Backend-as-a-service
  - PostgreSQL database
  - Edge Functions (Deno)
  - Realtime subscriptions
  - Authentication
  - Storage
- **Claude AI** (via OpenRouter) - AI capabilities
- **Perplexity AI** - Research enrichment

### External APIs
- **Facebook Graph API** - Publishing, analytics
- **Instagram API** - Publishing, analytics
- **LinkedIn API** - Publishing, analytics
- **Twitter API** - Publishing, analytics
- **Google My Business API** - GMB posts, analytics
- **YouTube API** - Video analytics
- **SEMrush API** - Competitive intelligence
- **Google Analytics** - Web analytics
- **Weather API** - Real-time signals
- **Google Trends** - Trending topics
- **Reddit API** - Community signals
- **Unsplash API** - Stock photos

### Development Tools
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Vitest** - Testing
- **TypeScript** - Type checking
- **Git** - Version control

---

## Appendix B: File Structure Reference

```
~/Projects/MARBA/
├── .git/
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── assets/
│   │   ├── logo.svg
│   │   └── templates/
│   └── fonts/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── mirror/
│   │   │   ├── MirrorLayout.tsx
│   │   │   ├── MirrorNavigation.tsx
│   │   │   ├── situation/
│   │   │   │   ├── SituationSection.tsx
│   │   │   │   ├── BrandHealthCard.tsx
│   │   │   │   ├── MarketPositionCard.tsx
│   │   │   │   ├── CompetitiveLandscapeCard.tsx
│   │   │   │   └── CurrentAssetsCard.tsx
│   │   │   ├── objectives/
│   │   │   │   ├── ObjectivesSection.tsx
│   │   │   │   ├── GoalBuilder.tsx
│   │   │   │   ├── RecommendedGoals.tsx
│   │   │   │   └── CustomGoals.tsx
│   │   │   ├── strategy/
│   │   │   │   ├── StrategySection.tsx
│   │   │   │   ├── BrandStrategy.tsx
│   │   │   │   ├── AudienceStrategy.tsx
│   │   │   │   ├── ContentStrategy.tsx
│   │   │   │   └── CompetitiveStrategy.tsx
│   │   │   ├── tactics/
│   │   │   │   ├── TacticsSection.tsx
│   │   │   │   ├── PlatformTactics.tsx
│   │   │   │   ├── ContentTactics.tsx
│   │   │   │   ├── EngagementTactics.tsx
│   │   │   │   └── SEOTactics.tsx
│   │   │   ├── action/
│   │   │   │   └── (Content Calendar components below)
│   │   │   └── control/
│   │   │       └── (Analytics components below)
│   │   ├── marbs/
│   │   │   ├── MarbsAssistant.tsx
│   │   │   ├── MarbsContextProvider.tsx
│   │   │   ├── MarbsSidebar.tsx
│   │   │   ├── MarbsFloatingButton.tsx
│   │   │   ├── MarbsQuickActions.tsx
│   │   │   └── MarbsInlineSuggestion.tsx
│   │   ├── content-calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── ContentGenerator.tsx
│   │   │   ├── SchedulingEngine.tsx
│   │   │   ├── PublishingQueue.tsx
│   │   │   ├── ContentItem.tsx
│   │   │   └── PlatformSelector.tsx
│   │   ├── design-studio/
│   │   │   ├── DesignStudio.tsx
│   │   │   ├── CanvasEditor.tsx
│   │   │   ├── TemplateLibrary.tsx
│   │   │   ├── BrandAssets.tsx
│   │   │   ├── ExportTools.tsx
│   │   │   └── LayersPanel.tsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── PerformanceCharts.tsx
│   │   │   ├── EngagementMetrics.tsx
│   │   │   ├── AudienceInsights.tsx
│   │   │   ├── EngagementInbox.tsx
│   │   │   └── ReportBuilder.tsx
│   │   ├── uvp/
│   │   │   ├── UVPWizard.tsx
│   │   │   ├── ValuePropositionBuilder.tsx
│   │   │   ├── CompetitivePositioning.tsx
│   │   │   └── UVPApplications.tsx
│   │   ├── synapse/
│   │   │   ├── SynapseContentModal.tsx
│   │   │   ├── SynapseCard.tsx
│   │   │   ├── PsychologyExplanationModal.tsx
│   │   │   └── ContentModeToggle.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       ├── modal.tsx
│   │       ├── tooltip.tsx
│   │       ├── badge.tsx
│   │       ├── progress.tsx
│   │       └── [40+ more shadcn components]
│   ├── services/
│   │   ├── mirror/
│   │   │   ├── situation-analyzer.ts
│   │   │   ├── objectives-generator.ts
│   │   │   ├── strategy-builder.ts
│   │   │   ├── tactics-planner.ts
│   │   │   └── enrichment-engine.ts
│   │   ├── marbs/
│   │   │   ├── context-awareness.ts
│   │   │   ├── conversation-engine.ts
│   │   │   └── action-executor.ts
│   │   ├── content-intelligence/
│   │   │   ├── generators/
│   │   │   │   ├── contentPerformance.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   └── searchSocial.ts
│   │   │   ├── scorer.ts
│   │   │   ├── types.ts
│   │   │   └── dataAdapter.ts
│   │   ├── synapse/
│   │   │   ├── connections/
│   │   │   │   ├── ConnectionDiscoveryEngine.ts
│   │   │   │   ├── TwoWayConnectionFinder.ts
│   │   │   │   ├── ThreeWayConnectionFinder.ts
│   │   │   │   ├── ConnectionScorer.ts
│   │   │   │   └── EmbeddingService.ts
│   │   │   ├── generation/
│   │   │   │   ├── SynapseContentGenerator.ts
│   │   │   │   ├── ContentPsychologyEngine.ts
│   │   │   │   ├── PowerWordOptimizer.ts
│   │   │   │   ├── ContentFrameworkLibrary.ts
│   │   │   │   └── formats/
│   │   │   │       ├── HookPostGenerator.ts
│   │   │   │       ├── StoryPostGenerator.ts
│   │   │   │       ├── DataPostGenerator.ts
│   │   │   │       ├── ControversialPostGenerator.ts
│   │   │   │       ├── EmailGenerator.ts
│   │   │   │       ├── BlogGenerator.ts
│   │   │   │       └── LandingPageGenerator.ts
│   │   │   └── SynapseGenerator.ts
│   │   ├── uvp/
│   │   │   ├── uvpGenerator.ts
│   │   │   └── contextAdapter.ts
│   │   ├── valueForge/
│   │   │   ├── ValueForgeOrchestrator.ts
│   │   │   ├── PersonaDetectionService.ts
│   │   │   ├── JourneyMappingService.ts
│   │   │   ├── TransformationAnalyzer.ts
│   │   │   └── DiscoveryPathAnalyzer.ts
│   │   ├── content-calendar/
│   │   │   ├── generation.ts
│   │   │   ├── scheduling.ts
│   │   │   └── publishing.ts
│   │   ├── analytics/
│   │   │   ├── platform-connectors.ts
│   │   │   ├── metrics-calculator.ts
│   │   │   └── report-generator.ts
│   │   └── api/
│   │       ├── supabase.ts
│   │       ├── openrouter.ts
│   │       └── platform-apis.ts
│   ├── types/
│   │   ├── mirror.types.ts
│   │   ├── marbs.types.ts
│   │   ├── content.types.ts
│   │   ├── marba-score.types.ts
│   │   ├── synapse.types.ts
│   │   ├── uvp.ts
│   │   ├── valueForge.ts
│   │   └── api.types.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── hooks/
│   │   ├── useMarbs.ts
│   │   ├── useMirror.ts
│   │   ├── useContentCalendar.ts
│   │   └── useAnalytics.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   ├── analyze-mirror/
│   │   │   └── index.ts
│   │   ├── marbs-assistant/
│   │   │   └── index.ts
│   │   ├── generate-content/
│   │   │   └── index.ts
│   │   ├── enrich-with-synapse/
│   │   │   └── index.ts
│   │   ├── publish-to-platforms/
│   │   │   └── index.ts
│   │   └── collect-analytics/
│   │       └── index.ts
│   └── migrations/
│       ├── 20251111000000_marba_redesign.sql
│       └── 20251111000001_mirror_sections.sql
└── docs/
    ├── API.md
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    └── USER_GUIDE.md
```

---

## Conclusion

This is a massive undertaking. You're essentially rebuilding the entire Mirror application from scratch with a new framework, new features, new AI capabilities, and a complete migration.

**Estimated Timeline:** 8-10 weeks for MVP
**Estimated Effort:** 320-400 developer hours
**Complexity:** 🔥🔥🔥🔥🔥 (Maximum)

**What Could Go Wrong:** Everything. Literally everything.

**What Could Go Right:** You'll have the most advanced AI-powered marketing platform for SMBs, with a clear SOSTAC structure, persistent AI assistance, and full automation.

Your move, boss.

*stubs out cigarette*

---

**END OF PLAN**

File Path: `/Users/byronhudson/Projects/MARBA/MIRROR_REDESIGN_PLAN.md`
