# MARBA Mirror + UVP Complete Build Task Breakdown
## Master Task List - Atomic, Ordered, Trackable

**Created:** 2025-11-11
**Updated:** 2025-11-11 14:45
**Status:** In Progress
**Approach:** Build systematically, mark complete, test at checkpoints

## 🎯 NEW REQUIREMENTS (Added 2025-11-11)

**1. Content Generation Toggle:**
- Every content generation button MUST have toggle: "MARBA" (Sonnet 3.5 via OpenRouter) OR "Synapse" (enhanced generation)
- Default to MARBA for speed, Synapse for quality
- Show which mode is being used in real-time

**2. Customer Logo Integration:**
- Pull customer logo from website analysis
- Display in top-left of main hub (after first analyze screen)
- Must look designed to fit, not like placeholder
- Graceful fallback if no logo available (app looks normal, not broken)

**3. Git Commits:**
- Commit to git after EVERY phase completion
- Use semantic commit messages
- Tag major checkpoints

**4. Directory Organization:**
- Everything in ~/Projects/MARBA
- No brandock references anywhere
- Follow best practices for file organization

---

## PHASE 0: FOUNDATION & SETUP (Tasks 1-15)

### Infrastructure Setup
- [ ] **TASK-001**: Create ~/Projects/MARBA directory structure (all folders)
- [ ] **TASK-002**: Initialize package.json with all dependencies
- [ ] **TASK-003**: Configure TypeScript (tsconfig.json)
- [ ] **TASK-004**: Configure Vite (vite.config.ts)
- [ ] **TASK-005**: Configure Tailwind CSS (tailwind.config.js)
- [ ] **TASK-006**: Set up ESLint and Prettier configs
- [ ] **TASK-007**: Create .gitignore file
- [ ] **TASK-008**: Initialize Git repository
- [ ] **TASK-009**: Create environment variables template (.env.example)
- [ ] **TASK-010**: Set up Supabase project connection
- [ ] **TASK-011**: Create basic project structure (src/components, src/services, etc.)
- [ ] **TASK-012**: Copy shadcn/ui components from marba
- [ ] **TASK-013**: Set up Supabase client configuration
- [ ] **TASK-014**: Create basic routing structure (React Router)
- [ ] **TASK-015**: Create main App.tsx and entry point

**TEST CHECKPOINT 1**: Basic app loads without errors at localhost:3000

**GIT COMMIT**: After Phase 0 complete

---

## PHASE 1: DATABASE & BACKEND (Tasks 16-45)

### Database Schema
- [ ] **TASK-016**: Create migration file: mirror_sections table
- [ ] **TASK-017**: Create migration file: marbs_conversations table
- [ ] **TASK-018**: Create migration file: content_calendar_items table (enhanced)
- [ ] **TASK-019**: Create migration file: design_templates table
- [ ] **TASK-020**: Create migration file: analytics_events table
- [ ] **TASK-021**: Create migration file: platform_metrics_snapshots table
- [ ] **TASK-022**: Create migration file: engagement_inbox table
- [ ] **TASK-023**: Create migration file: mirror_intend_objectives table (formerly sostac_objectives)
- [ ] **TASK-024**: Create migration file: enrichment_schedule table
- [ ] **TASK-025**: Create migration file: intelligence_opportunities table
- [ ] **TASK-026**: Create migration file: learning_patterns table
- [ ] **TASK-027**: Create migration file: synapse_analysis_cache table
- [ ] **TASK-028**: Create migration file: competitive_intelligence_snapshots table
- [ ] **TASK-029**: Run all migrations on Supabase
- [ ] **TASK-030**: Create database indexes for performance

### Supabase Edge Functions
- [ ] **TASK-031**: Create supabase/functions/analyze-mirror/index.ts
- [ ] **TASK-032**: Create supabase/functions/marbs-assistant/index.ts
- [ ] **TASK-033**: Create supabase/functions/generate-content/index.ts
- [ ] **TASK-034**: Create supabase/functions/enrich-with-synapse/index.ts
- [ ] **TASK-035**: Create supabase/functions/publish-to-platforms/index.ts
- [ ] **TASK-036**: Create supabase/functions/collect-analytics/index.ts
- [ ] **TASK-037**: Deploy all edge functions to Supabase
- [ ] **TASK-038**: Test each edge function with curl/Postman
- [ ] **TASK-039**: Set up edge function secrets (API keys)

### Service Layer - Core
- [ ] **TASK-040**: Copy synapse services from marba to MARBA
- [ ] **TASK-041**: Copy uvp services from marba to MARBA
- [ ] **TASK-042**: Copy valueForge services from marba to MARBA
- [ ] **TASK-043**: Copy contentIntelligence services from marba to MARBA
- [ ] **TASK-044**: Update all service imports to use new paths
- [ ] **TASK-045**: Fix any TypeScript errors in copied services

**TEST CHECKPOINT 2**: All services compile without errors, edge functions respond

**GIT COMMIT**: After Phase 1 complete

---

## PHASE 2: TYPE SYSTEM & UTILITIES (Tasks 46-60)

### Type Definitions
- [ ] **TASK-046**: Create src/types/mirror.types.ts
- [ ] **TASK-047**: Create src/types/marbs.types.ts
- [ ] **TASK-048**: Create src/types/content.types.ts
- [ ] **TASK-049**: Create src/types/marba-score.types.ts
- [ ] **TASK-050**: Copy and update synapse.types.ts
- [ ] **TASK-051**: Copy and update uvp.ts
- [ ] **TASK-052**: Copy and update valueForge.ts
- [ ] **TASK-053**: Create src/types/intelligence.types.ts (for Intelligence Showcase)
- [ ] **TASK-054**: Create src/types/api.types.ts

### Utilities & Helpers
- [ ] **TASK-055**: Create src/lib/utils.ts (utility functions)
- [ ] **TASK-056**: Create src/lib/constants.ts (app constants)
- [ ] **TASK-057**: Create src/lib/api/supabase.ts (Supabase helpers)
- [ ] **TASK-058**: Create src/lib/api/openrouter.ts (OpenRouter client)
- [ ] **TASK-059**: Create src/lib/api/platform-apis.ts (social platform APIs)
- [ ] **TASK-060**: Create custom React hooks (useMirror, useMarbs, etc.)

**TEST CHECKPOINT 3**: TypeScript compilation clean, no type errors

**GIT COMMIT**: After Phase 2 complete

---

## PHASE 3: DESIGN SYSTEM (Tasks 61-75)

### Design System Implementation
- [ ] **TASK-061**: Create src/styles/globals.css with design tokens
- [ ] **TASK-062**: Define color palette in Tailwind config
- [ ] **TASK-063**: Define typography scale in Tailwind config
- [ ] **TASK-064**: Create Button component variants (primary, secondary, outline, ghost, danger)
- [ ] **TASK-065**: Create Card component variants (elevated, flat, interactive)
- [ ] **TASK-066**: Create Input components (text, number, email, search)
- [ ] **TASK-067**: Create Select component (single, multi, searchable)
- [ ] **TASK-068**: Create Modal component (small, medium, large, full-screen)
- [ ] **TASK-069**: Create Tabs component (horizontal, vertical)
- [ ] **TASK-070**: Create Badge component (status, count, category)
- [ ] **TASK-071**: Create Tooltip component
- [ ] **TASK-072**: Create Toast/Notification component
- [ ] **TASK-073**: Create Progress component
- [ ] **TASK-074**: Create Intelligence Badge component (🧠, 📊, 🎯, etc.)
- [ ] **TASK-075**: Create Storybook/test page for all components

### Customer Logo Integration
- [ ] **TASK-076**: Create src/components/ui/CustomerLogo.tsx component
- [ ] **TASK-077**: Implement logo extraction from brand analysis data
- [ ] **TASK-078**: Create logo display in top-left of main layout
- [ ] **TASK-079**: Implement responsive logo sizing (scales properly)
- [ ] **TASK-080**: Add graceful fallback (no logo = normal MARBA branding, not broken)
- [ ] **TASK-081**: Style logo to look integrated, not like placeholder
- [ ] **TASK-082**: Test logo display with various image formats/sizes
- [ ] **TASK-083**: Test fallback behavior (no logo looks clean)

**TEST CHECKPOINT 4**: Design system components render correctly, all variants work, logo integration looks designed

**GIT COMMIT**: After Phase 3 complete

---

## PHASE 4: MARBS AI ASSISTANT (Tasks 76-95)

### Marbs Core Services
- [ ] **TASK-076**: Create src/services/marbs/context-awareness.ts
- [ ] **TASK-077**: Create src/services/marbs/conversation-engine.ts
- [ ] **TASK-078**: Create src/services/marbs/action-executor.ts
- [ ] **TASK-079**: Test Marbs services with mock data

### Marbs UI Components
- [ ] **TASK-080**: Create src/components/marbs/MarbsContextProvider.tsx
- [ ] **TASK-081**: Create src/components/marbs/MarbsFloatingButton.tsx
- [ ] **TASK-082**: Create src/components/marbs/MarbsSidebar.tsx
- [ ] **TASK-083**: Create src/components/marbs/MarbsQuickActions.tsx
- [ ] **TASK-084**: Create src/components/marbs/MarbsInlineSuggestion.tsx
- [ ] **TASK-085**: Wire up Marbs to Supabase edge function (marbs-assistant)
- [ ] **TASK-086**: Implement conversation history storage
- [ ] **TASK-087**: Implement context detection (URL, section, data)
- [ ] **TASK-088**: Create Marbs capabilities registry (section-specific actions)
- [ ] **TASK-089**: Implement action execution (generate, apply, schedule, etc.)
- [ ] **TASK-090**: Add Marbs floating button to main layout
- [ ] **TASK-091**: Test Marbs conversation flow
- [ ] **TASK-092**: Test Marbs context awareness
- [ ] **TASK-093**: Test Marbs action execution
- [ ] **TASK-094**: Implement Marbs quick suggestions
- [ ] **TASK-095**: Test Marbs with Synapse integration

**TEST CHECKPOINT 5**: Marbs appears, responds to queries, executes basic actions

---

## PHASE 5: INTELLIGENCE SHOWCASE - CORE (Tasks 96-125)

### Opportunity Dashboard
- [ ] **TASK-096**: Create src/components/intelligence/OpportunityDashboard.tsx
- [ ] **TASK-097**: Create src/components/intelligence/OpportunityCard.tsx
- [ ] **TASK-098**: Create src/services/intelligence/opportunity-detector.ts
- [ ] **TASK-099**: Implement weather alert detection
- [ ] **TASK-100**: Implement trending topic detection (Google Trends API)
- [ ] **TASK-101**: Implement competitor activity monitoring
- [ ] **TASK-102**: Implement seasonal trigger detection
- [ ] **TASK-103**: Implement local news detection
- [ ] **TASK-104**: Create opportunity impact scoring algorithm
- [ ] **TASK-105**: Create opportunity expiration/urgency calculator
- [ ] **TASK-106**: Wire up opportunity dashboard to database
- [ ] **TASK-107**: Implement opportunity dismissal
- [ ] **TASK-108**: Implement one-click content generation from opportunity
- [ ] **TASK-109**: Test opportunity dashboard with mock opportunities

### Industry Intelligence Cards
- [ ] **TASK-110**: Create src/components/intelligence/IndustryTriggerCards.tsx
- [ ] **TASK-111**: Create src/components/intelligence/TriggerCard.tsx
- [ ] **TASK-112**: Create src/services/intelligence/industry-intelligence.ts
- [ ] **TASK-113**: Connect to existing industry profile data (140+ industries)
- [ ] **TASK-114**: Implement trigger card data display (urgency, conversion, timing)
- [ ] **TASK-115**: Implement "Generate Content" from trigger card
- [ ] **TASK-116**: Test industry intelligence cards

### Synapse Auto-Analysis
- [ ] **TASK-117**: Create src/components/intelligence/SynapseAnalysisCard.tsx
- [ ] **TASK-118**: Create src/services/intelligence/synapse-auto-analyzer.ts
- [ ] **TASK-119**: Implement competitor messaging scraping
- [ ] **TASK-120**: Implement auto psychology scoring (run on load)
- [ ] **TASK-121**: Implement real-time positioning statement scoring
- [ ] **TASK-122**: Create synapse analysis cache (database + service)
- [ ] **TASK-123**: Implement "Apply Suggestion" action
- [ ] **TASK-124**: Wire up synapse analysis to content generation
- [ ] **TASK-125**: Test synapse auto-analysis

### Industry Benchmarking
- [ ] **TASK-126**: Create src/components/intelligence/BenchmarkDisplay.tsx
- [ ] **TASK-127**: Create src/services/intelligence/benchmarking.ts
- [ ] **TASK-128**: Implement industry average calculation
- [ ] **TASK-129**: Implement percentile calculation
- [ ] **TASK-130**: Create benchmark data sources (industry profile + competitive)
- [ ] **TASK-131**: Test benchmark display on metrics

### Learning Engine Visibility
- [ ] **TASK-132**: Create src/components/intelligence/LearningDashboard.tsx
- [ ] **TASK-133**: Create src/services/intelligence/learning-engine.ts
- [ ] **TASK-134**: Implement pattern detection (format, timing, power words, platform)
- [ ] **TASK-135**: Implement confidence scoring
- [ ] **TASK-136**: Implement auto-adjustment recommendations
- [ ] **TASK-137**: Store learning patterns in database
- [ ] **TASK-138**: Test learning engine with mock performance data

**TEST CHECKPOINT 6**: Intelligence components visible, display data correctly

---

## PHASE 6: MIRROR - MEASURE PHASE (Tasks 139-165)
**Formerly "Situation Section" in SOSTAC®**

### Measure Phase Structure
- [ ] **TASK-139**: Create src/components/mirror/MirrorLayout.tsx
- [ ] **TASK-140**: Create src/components/mirror/MirrorNavigation.tsx (MIRROR phase tabs)
- [ ] **TASK-141**: Create src/pages/Mirror.tsx (main mirror page)
- [ ] **TASK-142**: Set up React Router for mirror phases

### Measure - Brand Health
- [ ] **TASK-143**: Create src/components/mirror/situation/SituationSection.tsx
- [ ] **TASK-144**: Create src/components/mirror/situation/BrandHealthCard.tsx
- [ ] **TASK-145**: Create src/services/mirror/situation-analyzer.ts
- [ ] **TASK-146**: Implement brand health calculation (clarity, consistency, engagement)
- [ ] **TASK-147**: Connect to existing brand analysis data
- [ ] **TASK-148**: Display brand health gauge (0-100 score)
- [ ] **TASK-149**: Display 3 key metrics with progress bars
- [ ] **TASK-150**: Show industry benchmark comparison
- [ ] **TASK-151**: Display "Hot Spots" and "Attention Needed" sections
- [ ] **TASK-152**: Integrate Marbs assistance (explain score, show opportunities)

### Situation - Market Position
- [ ] **TASK-153**: Create src/components/mirror/situation/MarketPositionCard.tsx
- [ ] **TASK-154**: Display industry classification
- [ ] **TASK-155**: Display target audience summary
- [ ] **TASK-156**: Display geographic reach
- [ ] **TASK-157**: Display primary archetype (1-2, simplified)

### Situation - Competitive Landscape
- [ ] **TASK-158**: Create src/components/mirror/situation/CompetitiveLandscapeCard.tsx
- [ ] **TASK-159**: Display top 3 competitors
- [ ] **TASK-160**: Display competitive score comparison (visual chart)
- [ ] **TASK-161**: Display key differentiators
- [ ] **TASK-162**: Display gaps competitors are exploiting
- [ ] **TASK-163**: Integrate Synapse competitor messaging analysis
- [ ] **TASK-164**: Show Competitive Intelligence Feed

### Situation - Current Assets
- [ ] **TASK-165**: Create src/components/mirror/situation/CurrentAssetsCard.tsx
- [ ] **TASK-166**: Display visual identity (colors, fonts, logo)
- [ ] **TASK-167**: Display messaging themes
- [ ] **TASK-168**: Display content performance summary
- [ ] **TASK-169**: Display social media presence
- [ ] **TASK-170**: Integrate Industry Intelligence Cards

**TEST CHECKPOINT 7**: Situation section loads, displays all cards with data

---

## PHASE 7: MIRROR - INTEND PHASE (Tasks 171-190)
**Formerly "Objectives Section" in SOSTAC®**

### Intend Phase Structure
- [ ] **TASK-171**: Create src/components/mirror/intend/IntendSection.tsx
- [ ] **TASK-172**: Create src/services/mirror/intend-generator.ts

### Goal Builder
- [ ] **TASK-173**: Create src/components/mirror/objectives/GoalBuilder.tsx
- [ ] **TASK-174**: Create goal categories (awareness, leads, retention, revenue)
- [ ] **TASK-175**: Create timeline selector (30/60/90 days, 6 months, 1 year)
- [ ] **TASK-176**: Create metric input fields (current, target, unit)
- [ ] **TASK-177**: Implement SMART goal validation
- [ ] **TASK-178**: Save goals to mirror_intend_objectives table

### Recommended Objectives
- [ ] **TASK-179**: Create src/components/mirror/objectives/RecommendedGoals.tsx
- [ ] **TASK-180**: Implement AI goal generation based on situation analysis
- [ ] **TASK-181**: Display top 3 recommended goals
- [ ] **TASK-182**: Show why each goal matters (reasoning)
- [ ] **TASK-183**: Show expected impact and effort required
- [ ] **TASK-184**: Implement "Accept Goal" action

### Custom Goals
- [ ] **TASK-185**: Create src/components/mirror/objectives/CustomGoals.tsx
- [ ] **TASK-186**: Create custom goal form
- [ ] **TASK-187**: Integrate Marbs to refine goals into SMART format
- [ ] **TASK-188**: Link goals to relevant metrics
- [ ] **TASK-189**: Display all active goals
- [ ] **TASK-190**: Implement goal edit/delete actions

**TEST CHECKPOINT 8**: Objectives section functional, can create and save goals

---

## PHASE 8: MIRROR - REIMAGINE PHASE (Tasks 191-225)
**Formerly "Strategy Section" in SOSTAC®**

### Reimagine Phase Structure
- [ ] **TASK-191**: Create src/components/mirror/reimagine/ReimaginSection.tsx
- [ ] **TASK-192**: Create src/services/mirror/reimagine-builder.ts

### Brand Strategy
- [ ] **TASK-193**: Create src/components/mirror/strategy/BrandStrategy.tsx
- [ ] **TASK-194**: Create positioning statement editor with real-time Synapse scoring
- [ ] **TASK-195**: Auto-generate positioning from UVP + triggers
- [ ] **TASK-196**: Display Synapse psychology score breakdown
- [ ] **TASK-197**: Show enhanced version with "Apply" button
- [ ] **TASK-198**: Create message pillars builder (drag-and-drop)
- [ ] **TASK-199**: Auto-generate message pillars from industry triggers
- [ ] **TASK-200**: Display trigger data on each pillar (urgency, conversion)
- [ ] **TASK-201**: Show Synapse score on each pillar
- [ ] **TASK-202**: Implement "Generate Content" from pillar
- [ ] **TASK-203**: Create voice & tone guidelines section
- [ ] **TASK-204**: Display archetype (simplified, 1-2 primary)

### Audience Strategy
- [ ] **TASK-205**: Create src/components/mirror/strategy/AudienceStrategy.tsx
- [ ] **TASK-206**: Display primary persona (from ValueForge)
- [ ] **TASK-207**: Display secondary personas
- [ ] **TASK-208**: Create customer journey map visualization (ValueForge integration)
- [ ] **TASK-209**: Create pain points → solutions mapping
- [ ] **TASK-210**: Show Synapse connections between UVP and triggers

### Content Strategy
- [ ] **TASK-211**: Create src/components/mirror/strategy/ContentStrategy.tsx
- [ ] **TASK-212**: Display content themes aligned with message pillars
- [ ] **TASK-213**: Create platform strategy section (where to focus)
- [ ] **TASK-214**: Show industry platform performance data
- [ ] **TASK-215**: Create content mix builder (formats, topics)
- [ ] **TASK-216**: Create seasonal planning calendar

### Competitive Strategy
- [ ] **TASK-217**: Create src/components/mirror/strategy/CompetitiveStrategy.tsx
- [ ] **TASK-218**: Display differentiation approach
- [ ] **TASK-219**: Show white space opportunities (from competitive gaps)
- [ ] **TASK-220**: Display message saturation avoidance recommendations
- [ ] **TASK-221**: Show speed advantages (where you can be faster)
- [ ] **TASK-222**: Integrate Competitive Intelligence Feed
- [ ] **TASK-223**: Show Competitive Gap Tracker

### UVP Integration in Strategy
- [ ] **TASK-224**: Embed UVP builder in Strategy section
- [ ] **TASK-225**: Link UVPs to message pillars (auto-populate)
- [ ] **TASK-226**: Show how UVPs translate to positioning statement
- [ ] **TASK-227**: Display UVP → Content Theme mapping

**TEST CHECKPOINT 9**: Strategy section complete, UVP integrated, all sub-sections work

---

## PHASE 9: UVP BUILDER (REDESIGNED) (Tasks 228-260)

### UVP Builder Structure
- [ ] **TASK-228**: Create src/components/uvp/UVPWizard.tsx (new design)
- [ ] **TASK-229**: Create src/components/uvp/ValuePropositionBuilder.tsx
- [ ] **TASK-230**: Create src/components/uvp/CompetitivePositioning.tsx
- [ ] **TASK-231**: Create src/components/uvp/UVPApplications.tsx
- [ ] **TASK-232**: Create src/pages/UVPBuilder.tsx (can be standalone or in Strategy)

### UVP Flow - Step 1: Context Setting
- [ ] **TASK-233**: Create context setting form (business name, industry, location)
- [ ] **TASK-234**: Implement quick website scan (if not from Mirror)
- [ ] **TASK-235**: Implement competitor identification
- [ ] **TASK-236**: Load existing Mirror data if available

### UVP Flow - Step 2: Value Discovery
- [ ] **TASK-237**: Create value discovery questionnaire
- [ ] **TASK-238**: Question 1: "What problems do you solve?" → Pain points
- [ ] **TASK-239**: Question 2: "What makes you different?" → Differentiators
- [ ] **TASK-240**: Question 3: "What results do you deliver?" → Outcomes
- [ ] **TASK-241**: Integrate Marbs to help refine answers

### UVP Flow - Step 3: UVP Generation
- [ ] **TASK-242**: Implement UVP generation algorithm (3 variations)
- [ ] **TASK-243**: Integrate Synapse psychology optimization
- [ ] **TASK-244**: Integrate power word optimization
- [ ] **TASK-245**: Create UVP scoring (clarity, differentiation, emotional appeal, specificity)
- [ ] **TASK-246**: Display 3 UVP variations with scores
- [ ] **TASK-247**: Show breakdown of each score dimension
- [ ] **TASK-248**: Implement "Enhance with Synapse" action
- [ ] **TASK-249**: Allow user to edit UVPs
- [ ] **TASK-250**: Allow user to select preferred UVP

### UVP Flow - Step 4: Competitive Positioning
- [ ] **TASK-251**: Create 2x2 positioning matrix visualization
- [ ] **TASK-252**: Plot user's UVP on matrix
- [ ] **TASK-253**: Plot competitor UVPs on matrix
- [ ] **TASK-254**: Show differentiation calculator
- [ ] **TASK-255**: Identify white space on matrix

### UVP Flow - Step 5: Application to Strategy
- [ ] **TASK-256**: Show UVP → Message Pillars translation
- [ ] **TASK-257**: Show UVP → Content Themes translation
- [ ] **TASK-258**: Show UVP → Positioning Statement translation
- [ ] **TASK-259**: Generate social bios from UVP
- [ ] **TASK-260**: Generate email signatures from UVP

### UVP → Mirror Integration
- [ ] **TASK-261**: Auto-populate Strategy section with UVP data
- [ ] **TASK-262**: Link UVP to content generation (every piece references UVP)
- [ ] **TASK-263**: Show content alignment score (includes UVP matching)
- [ ] **TASK-264**: Create UVP completion tracking
- [ ] **TASK-265**: Show "Complete UVP for better content" messaging

### Onboarding → UVP Flow
- [ ] **TASK-266**: Create post-onboarding UVP prompt
- [ ] **TASK-267**: Show benefits of completing UVP ("content 2x more effective")
- [ ] **TASK-268**: Allow "Skip for now" with persistent reminder
- [ ] **TASK-269**: Track UVP completion status per brand

**TEST CHECKPOINT 10**: UVP builder works standalone, integrates with Strategy, flows from onboarding

---

## PHASE 10: MIRROR - REACH PHASE (Tasks 270-295)
**Formerly "Tactics Section" in SOSTAC®**

### Reach Phase Structure
- [ ] **TASK-270**: Create src/components/mirror/reach/ReachSection.tsx
- [ ] **TASK-271**: Create src/services/mirror/reach-planner.ts

### Platform Tactics
- [ ] **TASK-272**: Create src/components/mirror/tactics/PlatformTactics.tsx
- [ ] **TASK-273**: Create tabbed interface for each platform
- [ ] **TASK-274**: Display platform-specific posting frequency (from industry data)
- [ ] **TASK-275**: Display optimal posting times (from industry + learned data)
- [ ] **TASK-276**: Display best content types per platform
- [ ] **TASK-277**: Display proven CTAs per platform
- [ ] **TASK-278**: Create hashtag strategy generator
- [ ] **TASK-279**: Show industry benchmark data ("Based on 3,247 businesses")
- [ ] **TASK-280**: Integrate "Apply Best Practices" action

### Content Tactics
- [ ] **TASK-281**: Create src/components/mirror/tactics/ContentTactics.tsx
- [ ] **TASK-282**: Display content frameworks library
- [ ] **TASK-283**: Show repurposing strategy (e.g., blog → social → email)
- [ ] **TASK-284**: Display content creation workflows
- [ ] **TASK-285**: Link to content calendar (preview)

### Engagement Tactics
- [ ] **TASK-286**: Create src/components/mirror/tactics/EngagementTactics.tsx
- [ ] **TASK-287**: Create response template library
- [ ] **TASK-288**: Display community building approach
- [ ] **TASK-289**: Show engagement triggers
- [ ] **TASK-290**: Display conversation starters

### SEO & Search Tactics
- [ ] **TASK-291**: Create src/components/mirror/tactics/SEOTactics.tsx
- [ ] **TASK-292**: Display keyword targets (from competitive intelligence)
- [ ] **TASK-293**: Create content optimization checklist
- [ ] **TASK-294**: Display local SEO tactics
- [ ] **TASK-295**: Show review generation strategy

**TEST CHECKPOINT 11**: Tactics section complete, all platform data displays correctly

---

## PHASE 11: CONTENT CALENDAR (OPTIMIZE PHASE) (Tasks 296-350)
**Formerly "Action Section" in SOSTAC®**

### Content Calendar Structure
- [ ] **TASK-296**: Create src/components/content-calendar/CalendarView.tsx
- [ ] **TASK-297**: Integrate FullCalendar library
- [ ] **TASK-298**: Create month view
- [ ] **TASK-299**: Create week view
- [ ] **TASK-300**: Create day view
- [ ] **TASK-301**: Create list view (filterable, sortable)
- [ ] **TASK-302**: Implement drag-and-drop rescheduling
- [ ] **TASK-303**: Implement color-coding by platform/status
- [ ] **TASK-304**: Create quick preview on hover
- [ ] **TASK-305**: Wire up to content_calendar_items table

### Content Item Component
- [ ] **TASK-306**: Create src/components/content-calendar/ContentItem.tsx
- [ ] **TASK-307**: Display content preview
- [ ] **TASK-308**: Show platform icon/badge
- [ ] **TASK-309**: Show status badge (draft, scheduled, published, failed)
- [ ] **TASK-310**: Show intelligence badges (Synapse Enhanced, etc.)
- [ ] **TASK-311**: Show scheduled time
- [ ] **TASK-312**: Show engagement metrics (if published)
- [ ] **TASK-313**: Implement edit action
- [ ] **TASK-314**: Implement delete action
- [ ] **TASK-315**: Implement duplicate action

### Content Generator
- [ ] **TASK-316**: Create src/components/content-calendar/ContentGenerator.tsx
- [ ] **TASK-317**: Create modal interface
- [ ] **TASK-318**: Create platform selector
- [ ] **TASK-319**: Create topic/pillar selector
- [ ] **TASK-320**: Create generation mode toggle: "MARBA" (Sonnet 3.5) vs "Synapse" (Enhanced)
- [ ] **TASK-320a**: Default to MARBA mode, show mode indicator in UI
- [ ] **TASK-320b**: Add tooltip explaining difference (MARBA=fast, Synapse=quality+psychology)
- [ ] **TASK-321**: Implement content generation API call (mode-aware)
- [ ] **TASK-322**: Display 3 content variations
- [ ] **TASK-323**: Show Synapse analysis on each variation
- [ ] **TASK-324**: Show psychology score on each variation
- [ ] **TASK-325**: Show industry benchmark comparison
- [ ] **TASK-326**: Show "Why This Works" explanation
- [ ] **TASK-327**: Show connection discovery results
- [ ] **TASK-328**: Implement variation selection
- [ ] **TASK-329**: Implement inline editing
- [ ] **TASK-330**: Implement "Save to Calendar" action
- [ ] **TASK-331**: Integrate with Opportunity Dashboard (generate from opportunity)

### Bulk Content Generation
- [ ] **TASK-332**: Create bulk generation modal
- [ ] **TASK-333**: Create week/month date range selector
- [ ] **TASK-334**: Create platform selection (multi-select)
- [ ] **TASK-335**: Create pillar distribution settings
- [ ] **TASK-336**: Implement bulk generation API call
- [ ] **TASK-337**: Display all generated content in review mode
- [ ] **TASK-338**: Implement batch approve/reject
- [ ] **TASK-339**: Implement batch schedule
- [ ] **TASK-340**: Show summary (X posts created, Y platforms, Z days)

### Scheduling Engine
- [ ] **TASK-341**: Create src/components/content-calendar/SchedulingEngine.tsx
- [ ] **TASK-342**: Implement optimal time calculator (industry + learned data)
- [ ] **TASK-343**: Implement conflict detection (too many posts same day)
- [ ] **TASK-344**: Implement platform limits checker
- [ ] **TASK-345**: Implement timezone handling
- [ ] **TASK-346**: Create auto-schedule modal
- [ ] **TASK-347**: Show recommended times with reasoning
- [ ] **TASK-348**: Implement "Accept All" action

### Publishing Queue
- [ ] **TASK-349**: Create src/components/content-calendar/PublishingQueue.tsx
- [ ] **TASK-350**: Display all scheduled posts (upcoming 7 days)
- [ ] **TASK-351**: Show status of each (pending, publishing, published, failed)
- [ ] **TASK-352**: Create approval workflow (if enabled)
- [ ] **TASK-353**: Implement manual publish action
- [ ] **TASK-354**: Implement reschedule action
- [ ] **TASK-355**: Display publishing errors
- [ ] **TASK-356**: Implement retry on failure
- [ ] **TASK-357**: Create background job for scheduled publishing
- [ ] **TASK-358**: Connect to platform APIs (Facebook, Instagram, etc.)
- [ ] **TASK-359**: Test publishing to Facebook (mock/sandbox)
- [ ] **TASK-360**: Test publishing to Instagram (mock/sandbox)

### Opportunity Dashboard in Action Section
- [ ] **TASK-361**: Place Opportunity Dashboard at top of Optimize phase
- [ ] **TASK-362**: Wire up to intelligence_opportunities table
- [ ] **TASK-363**: Implement auto-refresh (every 5 minutes)
- [ ] **TASK-364**: Implement countdown timers
- [ ] **TASK-365**: Implement "Generate Post" from opportunity
- [ ] **TASK-366**: Implement "Dismiss" action
- [ ] **TASK-367**: Test opportunity detection and content generation

**TEST CHECKPOINT 12**: Content calendar works, can generate/schedule/view content, opportunity dashboard functional

---

## PHASE 12: DESIGN STUDIO (Tasks 368-400)

### Design Studio Structure
- [ ] **TASK-368**: Create src/components/design-studio/DesignStudio.tsx
- [ ] **TASK-369**: Create modal/full-screen layout
- [ ] **TASK-370**: Choose canvas library (Fabric.js or Konva.js)
- [ ] **TASK-371**: Install and configure canvas library

### Canvas Editor
- [ ] **TASK-372**: Create src/components/design-studio/CanvasEditor.tsx
- [ ] **TASK-373**: Initialize canvas with platform-specific dimensions
- [ ] **TASK-374**: Implement text layers (add, edit, delete)
- [ ] **TASK-375**: Implement text formatting (font, size, color, align)
- [ ] **TASK-376**: Implement image layers (upload, resize, crop)
- [ ] **TASK-377**: Implement shape layers (rectangle, circle, line)
- [ ] **TASK-378**: Implement layer ordering (bring forward, send backward)
- [ ] **TASK-379**: Implement undo/redo
- [ ] **TASK-380**: Implement alignment guides
- [ ] **TASK-381**: Create tool palette UI (text, shape, image tools)
- [ ] **TASK-382**: Create property inspector (selected element properties)
- [ ] **TASK-383**: Implement zoom controls
- [ ] **TASK-384**: Implement canvas pan (drag to move view)

### Template Library
- [ ] **TASK-385**: Create src/components/design-studio/TemplateLibrary.tsx
- [ ] **TASK-386**: Create template grid UI
- [ ] **TASK-387**: Create platform-specific template categories
- [ ] **TASK-388**: Design 5 templates per platform (Instagram, Facebook, LinkedIn)
- [ ] **TASK-389**: Store templates in design_templates table
- [ ] **TASK-390**: Implement template search/filter
- [ ] **TASK-391**: Implement template preview on hover
- [ ] **TASK-392**: Implement "Apply Template" action (loads to canvas)
- [ ] **TASK-393**: Implement "Save as Template" action

### Brand Assets
- [ ] **TASK-394**: Create src/components/design-studio/BrandAssets.tsx
- [ ] **TASK-395**: Auto-load brand colors (from Mirror data)
- [ ] **TASK-396**: Auto-load brand fonts (from Mirror data)
- [ ] **TASK-397**: Auto-load logo (from Mirror data)
- [ ] **TASK-398**: Create color swatches (click to apply to selected element)
- [ ] **TASK-399**: Create font dropdown (apply to text layer)
- [ ] **TASK-400**: Create previous images library (uploaded images)
- [ ] **TASK-401**: Integrate Unsplash API for stock photos
- [ ] **TASK-402**: Implement image upload
- [ ] **TASK-403**: Implement drag-and-drop image to canvas

### Export Tools
- [ ] **TASK-404**: Create src/components/design-studio/ExportTools.tsx
- [ ] **TASK-405**: Implement platform preset buttons (Instagram Post, FB Cover, etc.)
- [ ] **TASK-406**: Implement auto-resize to platform dimensions
- [ ] **TASK-407**: Implement PNG export
- [ ] **TASK-408**: Implement JPG export
- [ ] **TASK-409**: Implement quality settings
- [ ] **TASK-410**: Implement "Save to Content Calendar" (attach to content item)
- [ ] **TASK-411**: Implement "Download to Device"
- [ ] **TASK-412**: Save canvas data to design_data field (for future editing)

### Design Studio Integration
- [ ] **TASK-413**: Add "Create Visual" button to content calendar items
- [ ] **TASK-414**: Open Design Studio when clicked
- [ ] **TASK-415**: Load existing design if content item has design_data
- [ ] **TASK-416**: Auto-attach exported image to content item
- [ ] **TASK-417**: Test full flow: generate content → create visual → schedule

**TEST CHECKPOINT 13**: Design Studio works, can create simple designs, export images, attach to content

---

## PHASE 13: ANALYTICS & REFLECT PHASE (Tasks 418-465)
**Formerly "Control Section" in SOSTAC®**

### Reflect Phase Structure
- [ ] **TASK-418**: Create src/components/mirror/reflect/ReflectSection.tsx
- [ ] **TASK-419**: Create src/components/analytics/AnalyticsDashboard.tsx

### Goal Progress Tracking
- [ ] **TASK-420**: Create src/components/analytics/GoalProgressTracker.tsx
- [ ] **TASK-421**: Display all active objectives (from mirror_intend_objectives)
- [ ] **TASK-422**: Calculate current progress for each goal
- [ ] **TASK-423**: Display progress bars
- [ ] **TASK-424**: Show on-track indicator (green/yellow/red)
- [ ] **TASK-425**: Calculate time remaining
- [ ] **TASK-426**: Project completion date
- [ ] **TASK-427**: Show industry benchmark for goal

### KPI Scorecards
- [ ] **TASK-428**: Create src/components/analytics/KPIScorecard.tsx
- [ ] **TASK-429**: Define key metrics (engagement rate, follower growth, etc.)
- [ ] **TASK-430**: Display metric cards at-a-glance
- [ ] **TASK-431**: Show week-over-week change
- [ ] **TASK-432**: Color-code metrics (green/red)
- [ ] **TASK-433**: Show industry benchmark on each metric
- [ ] **TASK-434**: Implement drill-down on click

### Performance Charts
- [ ] **TASK-435**: Create src/components/analytics/PerformanceCharts.tsx
- [ ] **TASK-436**: Install and configure Recharts library
- [ ] **TASK-437**: Create engagement over time chart (line chart)
- [ ] **TASK-438**: Create follower growth chart (line chart)
- [ ] **TASK-439**: Create content type performance chart (bar chart)
- [ ] **TASK-440**: Create platform comparison chart (bar chart)
- [ ] **TASK-441**: Add industry benchmark line to charts
- [ ] **TASK-442**: Implement custom date range selector
- [ ] **TASK-443**: Implement export to CSV/PDF

### Content Analytics
- [ ] **TASK-444**: Create src/components/analytics/ContentAnalytics.tsx
- [ ] **TASK-445**: Display best performing posts (top 10)
- [ ] **TASK-446**: Display worst performing posts (bottom 10)
- [ ] **TASK-447**: Show performance by platform
- [ ] **TASK-448**: Show performance by pillar/topic
- [ ] **TASK-449**: Show performance by content type (Hook, Story, etc.)
- [ ] **TASK-450**: Show optimal posting times (learned from data)
- [ ] **TASK-451**: Show power word effectiveness (per user)
- [ ] **TASK-452**: Link to Learning Engine widget

### Audience Analytics
- [ ] **TASK-453**: Create src/components/analytics/AudienceInsights.tsx
- [ ] **TASK-454**: Display follower growth trends
- [ ] **TASK-455**: Display demographic breakdown (age, gender, location)
- [ ] **TASK-456**: Display geographic distribution (map or chart)
- [ ] **TASK-457**: Display engagement patterns (when active)
- [ ] **TASK-458**: Create activity heatmap (day of week × time of day)
- [ ] **TASK-459**: Show sentiment analysis (from comments/reviews)

### Engagement Inbox
- [ ] **TASK-460**: Create src/components/analytics/EngagementInbox.tsx
- [ ] **TASK-461**: Display recent comments/messages (from engagement_inbox table)
- [ ] **TASK-462**: Show sentiment indicators (positive/neutral/negative)
- [ ] **TASK-463**: Implement priority flagging (high/medium/low)
- [ ] **TASK-464**: Create quick reply interface
- [ ] **TASK-465**: Integrate Marbs for AI-suggested responses
- [ ] **TASK-466**: Implement template suggestions
- [ ] **TASK-467**: Show engagement rate trends
- [ ] **TASK-468**: Implement mark as read/archived

### Learning Engine Widget
- [ ] **TASK-469**: Create src/components/intelligence/LearningEngineWidget.tsx
- [ ] **TASK-470**: Display "What I've Learned" section
- [ ] **TASK-471**: Show best performing patterns
- [ ] **TASK-472**: Show patterns to avoid
- [ ] **TASK-473**: Show auto-adjustments being made
- [ ] **TASK-474**: Link to detailed analysis
- [ ] **TASK-475**: Show confidence scores and sample sizes

### Competitive Monitoring
- [ ] **TASK-476**: Create src/components/analytics/CompetitiveMonitoring.tsx
- [ ] **TASK-477**: Display Competitive Activity Feed
- [ ] **TASK-478**: Show competitor posting frequency changes
- [ ] **TASK-479**: Show topic shifts
- [ ] **TASK-480**: Flag reputation changes
- [ ] **TASK-481**: Suggest immediate responses
- [ ] **TASK-482**: Display Competitive Gap Tracker
- [ ] **TASK-483**: Show platform gaps, content gaps, keyword gaps
- [ ] **TASK-484**: Implement "Generate Response Content" action

**TEST CHECKPOINT 14**: Control section complete, all analytics display, learning engine visible

---

## PHASE 14: PLATFORM INTEGRATIONS (Tasks 485-515)

### Platform API Setup
- [ ] **TASK-485**: Create src/lib/api/facebook-api.ts
- [ ] **TASK-486**: Create src/lib/api/instagram-api.ts
- [ ] **TASK-487**: Create src/lib/api/linkedin-api.ts
- [ ] **TASK-488**: Create src/lib/api/twitter-api.ts
- [ ] **TASK-489**: Create src/lib/api/gmb-api.ts
- [ ] **TASK-490**: Create src/lib/api/youtube-api.ts
- [ ] **TASK-491**: Set up OAuth flows for each platform
- [ ] **TASK-492**: Store platform tokens securely (Supabase)

### Publishing Implementation
- [ ] **TASK-493**: Implement Facebook post publishing
- [ ] **TASK-494**: Implement Instagram post publishing (via Facebook API)
- [ ] **TASK-495**: Implement LinkedIn post publishing
- [ ] **TASK-496**: Implement Twitter post publishing
- [ ] **TASK-497**: Implement GMB post publishing
- [ ] **TASK-498**: Handle image uploads to each platform
- [ ] **TASK-499**: Handle video uploads (if applicable)
- [ ] **TASK-500**: Implement error handling and retry logic
- [ ] **TASK-501**: Store platform_post_id after successful publish
- [ ] **TASK-502**: Update content status to "published"

### Analytics Collection
- [ ] **TASK-503**: Implement Facebook analytics fetching
- [ ] **TASK-504**: Implement Instagram analytics fetching
- [ ] **TASK-505**: Implement LinkedIn analytics fetching
- [ ] **TASK-506**: Implement Twitter analytics fetching
- [ ] **TASK-507**: Implement GMB analytics fetching
- [ ] **TASK-508**: Store analytics in analytics_events table
- [ ] **TASK-509**: Create background job to fetch analytics daily
- [ ] **TASK-510**: Update content items with engagement metrics

### Engagement Collection
- [ ] **TASK-511**: Implement comment/message fetching from platforms
- [ ] **TASK-512**: Store in engagement_inbox table
- [ ] **TASK-513**: Implement sentiment analysis on comments
- [ ] **TASK-514**: Implement priority scoring
- [ ] **TASK-515**: Create background job to fetch engagement hourly

**TEST CHECKPOINT 15**: Can publish to at least Facebook & Instagram, analytics are fetched

---

## PHASE 15: ENRICHMENT ENGINE & BACKGROUND JOBS (Tasks 516-540)

### Enrichment Engine
- [ ] **TASK-516**: Create src/services/mirror/enrichment-engine.ts
- [ ] **TASK-517**: Implement enrichSituation() function
- [ ] **TASK-518**: Implement enrichObjectives() function
- [ ] **TASK-519**: Implement enrichStrategy() function
- [ ] **TASK-520**: Implement enrichTactics() function
- [ ] **TASK-521**: Implement enrichAction() function
- [ ] **TASK-522**: Implement enrichControl() function
- [ ] **TASK-523**: Connect to all data sources (industry, competitive, platform APIs)
- [ ] **TASK-524**: Implement caching with TTL
- [ ] **TASK-525**: Implement background refresh

### Background Jobs (Supabase Edge Functions or Cron)
- [ ] **TASK-526**: Create enrichment scheduler (runs daily)
- [ ] **TASK-527**: Create opportunity detector job (runs hourly)
- [ ] **TASK-528**: Create competitive monitoring job (runs every 6 hours)
- [ ] **TASK-529**: Create analytics collection job (runs daily)
- [ ] **TASK-530**: Create engagement collection job (runs hourly)
- [ ] **TASK-531**: Create learning engine update job (runs daily)
- [ ] **TASK-532**: Create auto-schedule job (for scheduled posts)
- [ ] **TASK-533**: Create publishing job (for scheduled posts)
- [ ] **TASK-534**: Test all background jobs
- [ ] **TASK-535**: Set up monitoring/alerting for job failures

### Real-Time Signal Detection
- [ ] **TASK-536**: Create weather alert detection service
- [ ] **TASK-537**: Create trending topic detection service (Google Trends)
- [ ] **TASK-538**: Create Reddit discussion detection service
- [ ] **TASK-539**: Create local news detection service
- [ ] **TASK-540**: Create opportunity creation from signals

**TEST CHECKPOINT 16**: Background jobs run, enrichment works, opportunities are detected

---

## PHASE 16: ONBOARDING & UVP FLOW (Tasks 541-560)

### Post-Onboarding UVP Prompt
- [ ] **TASK-541**: Create post-onboarding screen
- [ ] **TASK-542**: Show "Complete Your UVP" prompt
- [ ] **TASK-543**: Show benefits ("Make your content 2x more effective")
- [ ] **TASK-544**: Create "Start UVP Builder" button
- [ ] **TASK-545**: Create "Skip for Now" button
- [ ] **TASK-546**: Track UVP completion status per brand
- [ ] **TASK-547**: Show persistent reminder if UVP not complete
- [ ] **TASK-548**: Remove reminder once UVP complete

### Onboarding Flow Updates
- [ ] **TASK-549**: Review existing onboarding flow
- [ ] **TASK-550**: Add UVP prompt at end of onboarding
- [ ] **TASK-551**: Connect onboarding to Mirror (load initial data)
- [ ] **TASK-552**: Test full onboarding → UVP → Mirror flow

### UVP Completion Tracking
- [ ] **TASK-553**: Add uvp_completed field to brands table
- [ ] **TASK-554**: Update field when UVP completed
- [ ] **TASK-555**: Show UVP status in Mirror
- [ ] **TASK-556**: Show content alignment improvement with UVP

### Content Generation with UVP
- [ ] **TASK-557**: Reference UVP in all content generation
- [ ] **TASK-558**: Calculate content alignment score (includes UVP match)
- [ ] **TASK-559**: Show UVP impact on content quality
- [ ] **TASK-560**: Test content with vs without UVP

**TEST CHECKPOINT 17**: Onboarding → UVP → Mirror flow works end-to-end

---

## PHASE 17: POLISH & REFINEMENT (Tasks 561-585)

### Design Polish
- [ ] **TASK-561**: Review all components for design consistency
- [ ] **TASK-562**: Ensure color palette used consistently
- [ ] **TASK-563**: Ensure typography scale used consistently
- [ ] **TASK-564**: Add loading states to all async operations
- [ ] **TASK-565**: Add error states to all forms
- [ ] **TASK-566**: Add empty states to all lists
- [ ] **TASK-567**: Ensure all buttons have hover states
- [ ] **TASK-568**: Add transitions/animations (200-300ms)
- [ ] **TASK-569**: Test all intelligence badges display correctly
- [ ] **TASK-570**: Test all tooltips work

### Responsive Design
- [ ] **TASK-571**: Test Mirror on mobile (320px width)
- [ ] **TASK-572**: Test Mirror on tablet (768px width)
- [ ] **TASK-573**: Test Mirror on desktop (1280px width)
- [ ] **TASK-574**: Fix any layout issues on mobile
- [ ] **TASK-575**: Fix any layout issues on tablet
- [ ] **TASK-576**: Simplify complex visualizations for mobile

### Accessibility
- [ ] **TASK-577**: Add ARIA labels to all interactive elements
- [ ] **TASK-578**: Ensure all images have alt text
- [ ] **TASK-579**: Test keyboard navigation (tab through all interactive elements)
- [ ] **TASK-580**: Ensure focus indicators visible (2px blue outline)
- [ ] **TASK-581**: Test color contrast ratios (minimum 4.5:1)
- [ ] **TASK-582**: Add skip navigation link

### Performance Optimization
- [ ] **TASK-583**: Implement code splitting (React.lazy)
- [ ] **TASK-584**: Optimize images (use WebP, lazy load)
- [ ] **TASK-585**: Implement virtual scrolling for long lists
- [ ] **TASK-586**: Optimize database queries (add indexes)
- [ ] **TASK-587**: Implement request debouncing (search, autocomplete)
- [ ] **TASK-588**: Test Lighthouse score (aim for >90)

**TEST CHECKPOINT 18**: App looks polished, works on all devices, performs well

---

## PHASE 18: TESTING & QA (Tasks 589-615)

### Unit Testing
- [ ] **TASK-589**: Set up Vitest
- [ ] **TASK-590**: Write tests for utility functions
- [ ] **TASK-591**: Write tests for service layer functions
- [ ] **TASK-592**: Write tests for API clients
- [ ] **TASK-593**: Aim for >70% code coverage

### Integration Testing
- [ ] **TASK-594**: Test Mirror data flow (Measure → Intend → Reimagine → Reach → Optimize → Reflect)
- [ ] **TASK-595**: Test Marbs conversation flow
- [ ] **TASK-596**: Test content generation end-to-end
- [ ] **TASK-597**: Test content scheduling end-to-end
- [ ] **TASK-598**: Test UVP builder end-to-end
- [ ] **TASK-599**: Test Design Studio end-to-end
- [ ] **TASK-600**: Test analytics dashboard data display

### Manual QA Checklist
- [ ] **TASK-601**: Test all MIRROR phases load correctly
- [ ] **TASK-602**: Test all intelligence widgets display data
- [ ] **TASK-603**: Test Marbs responds to queries
- [ ] **TASK-604**: Test Marbs executes actions
- [ ] **TASK-605**: Test opportunity dashboard updates
- [ ] **TASK-606**: Test content generation (all platforms)
- [ ] **TASK-607**: Test content scheduling
- [ ] **TASK-608**: Test Design Studio (create simple design)
- [ ] **TASK-609**: Test UVP builder (complete flow)
- [ ] **TASK-610**: Test analytics dashboard (all widgets)
- [ ] **TASK-611**: Test learning engine visibility
- [ ] **TASK-612**: Test competitive intelligence feed
- [ ] **TASK-613**: Test platform publishing (sandbox)
- [ ] **TASK-614**: Test all Marbs capabilities
- [ ] **TASK-615**: Test all one-click actions

**TEST CHECKPOINT 19**: All features work, no critical bugs, ready for user testing

---

## PHASE 19: GAP ANALYSIS (Tasks 616-630)

### Gap Analysis Process
- [ ] **TASK-616**: Review original plan (MIRROR_REDESIGN_PLAN.md)
- [ ] **TASK-617**: Compare built features vs planned features
- [ ] **TASK-618**: Document missing features
- [ ] **TASK-619**: Document incomplete features
- [ ] **TASK-620**: Document features built differently than planned
- [ ] **TASK-621**: Prioritize gaps (critical, important, nice-to-have)
- [ ] **TASK-622**: Create tasks for critical gaps
- [ ] **TASK-623**: Create tasks for important gaps
- [ ] **TASK-624**: Decide on nice-to-have gaps (defer or implement)

### Gap Remediation
- [ ] **TASK-625**: Implement critical gap fixes
- [ ] **TASK-626**: Implement important gap fixes
- [ ] **TASK-627**: Test gap fixes
- [ ] **TASK-628**: Update documentation with final feature set
- [ ] **TASK-629**: Create "Future Enhancements" document for deferred items
- [ ] **TASK-630**: Final review of all sections

**TEST CHECKPOINT 20**: All critical gaps addressed, app matches plan

---

## PHASE 20: FINAL VERIFICATION & DEPLOYMENT PREP (Tasks 631-650)

### Endpoint Verification
- [ ] **TASK-631**: Test all Supabase edge functions
- [ ] **TASK-632**: Test all platform API integrations
- [ ] **TASK-633**: Test all external API integrations (Weather, Trends, etc.)
- [ ] **TASK-634**: Verify all API keys configured
- [ ] **TASK-635**: Verify rate limits not exceeded
- [ ] **TASK-636**: Test error handling on all endpoints

### UI Integration Verification
- [ ] **TASK-637**: Verify all components connected to services
- [ ] **TASK-638**: Verify all services connected to APIs
- [ ] **TASK-639**: Verify all data flows from API → service → component → UI
- [ ] **TASK-640**: Test all user interactions trigger correct actions
- [ ] **TASK-641**: Verify no console errors
- [ ] **TASK-642**: Verify no TypeScript errors
- [ ] **TASK-643**: Verify no broken links

### End-to-End Flows
- [ ] **TASK-644**: Complete end-to-end test: Onboarding → UVP → Mirror → Content Generation → Schedule → Publish
- [ ] **TASK-645**: Complete end-to-end test: Opportunity Alert → Generate Content → Schedule → Publish
- [ ] **TASK-646**: Complete end-to-end test: Marbs Query → Action Execution → Result Display
- [ ] **TASK-647**: Complete end-to-end test: Design Studio → Create Design → Attach to Content → Publish

### Documentation
- [ ] **TASK-648**: Create USER_GUIDE.md
- [ ] **TASK-649**: Create API.md (API documentation)
- [ ] **TASK-650**: Create DEPLOYMENT.md (deployment instructions)

**FINAL TEST CHECKPOINT**: Everything works end-to-end, ready for user testing

---

## SUMMARY

**Total Tasks:** 650
**Estimated Time:** 8-10 weeks (full-time)
**Test Checkpoints:** 20 (browser-testable)

**Next Steps:**
1. Mark tasks complete as finished
2. Log progress in BUILD_PROGRESS.md
3. Create test checkpoints at logical intervals
4. Notify user when checkpoint ready for testing
5. Continue after user approval
6. Perform gap analysis before final deployment
