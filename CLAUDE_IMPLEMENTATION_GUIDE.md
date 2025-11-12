# Claude Implementation Guide - MIRROR Completion
**Created**: 2025-11-12
**Purpose**: Step-by-step guide for ANY Claude to complete remaining MIRROR tasks
**Status**: Tasks 1-19 outlined with exact implementation steps

---

## How to Use This Guide

1. **Check TodoWrite** - See which tasks are complete vs pending
2. **Pick next pending task** - They're prioritized (Priority 1 → Priority 4 → FINAL)
3. **Follow implementation steps** - Exact files, code patterns, test procedures
4. **Update TodoWrite** - Mark in_progress → completed
5. **Test** - Verify each task works before moving to next
6. **Commit often** - Don't wait until everything is done

---

## TASK 1: Fix Documentation Port References ✅ COMPLETE

**Status**: DONE (sed command replaced all localhost:3002 → localhost:3001)

---

## TASK 2: Integrate OpportunityDashboard with Real APIs

**Current State**: Component calls OpportunityDetector, but service uses mock data

**Files to Modify**:
1. `/src/services/intelligence/opportunity-detector.ts`
2. `/src/services/industryService.ts` (add to brand creation)

**Implementation Steps**:

### Step 2.1: Wire Weather API

**File**: `opportunity-detector.ts` method `detectWeatherOpportunities()`

**Current** (line 73-119):
```typescript
// Mock implementation - in production, call weather API
const opportunities: OpportunityInsight[] = []

if (config.industry?.includes('hvac')) {
  opportunities.push({ /* hardcoded */ })
}
```

**Change To**:
```typescript
import { WeatherAlertsService } from './weather-alerts'

static async detectWeatherOpportunities(config: DetectionConfig): Promise<OpportunityInsight[]> {
  try {
    const opportunities: OpportunityInsight[] = []

    // Get location from config or brand data
    const location = config.location || 'Dallas, TX'

    // Call real weather API
    const weather = await WeatherAlertsService.getCurrentWeather(location)
    const forecast = await WeatherAlertsService.get5DayForecast(location)

    // Detect opportunities based on real weather
    const weatherOpps = await WeatherAlertsService.detectWeatherOpportunities({
      industry: config.industry || '',
      location,
      keywords: config.keywords || []
    })

    // Transform to OpportunityInsight format
    for (const opp of weatherOpps) {
      opportunities.push({
        id: `weather_${Date.now()}_${Math.random()}`,
        brand_id: config.brandId,
        type: 'weather_based',
        title: opp.title,
        description: opp.description,
        source: 'weather_api',
        source_data: opp.weather_data,
        impact_score: opp.impact,
        urgency: opp.urgency,
        confidence: 0.85,
        expires_at: opp.expiration,
        status: 'new',
        suggested_actions: opp.recommended_actions || [],
        created_at: new Date().toISOString(),
      })
    }

    return opportunities
  } catch (error) {
    console.error('[OpportunityDetector] Weather API error:', error)
    return [] // Fail gracefully
  }
}
```

### Step 2.2: Wire Trend Analyzer

**File**: `opportunity-detector.ts` method `detectTrendingTopics()`

**Change From**: Mock data push
**Change To**:
```typescript
import { TrendAnalyzer } from './trend-analyzer'

static async detectTrendingTopics(config: DetectionConfig): Promise<OpportunityInsight[]> {
  try {
    const opportunities: OpportunityInsight[] = []

    // Analyze trends for industry
    const trends = await TrendAnalyzer.analyzeTrends({
      industry: config.industry || '',
      keywords: config.keywords || [],
      timeframe: '7d'
    })

    // Convert trends to opportunities
    for (const trend of trends.filter(t => t.velocity > 0.5)) {
      opportunities.push({
        id: `trend_${Date.now()}_${Math.random()}`,
        brand_id: config.brandId,
        type: 'trending_topic',
        title: `Trending: ${trend.topic}`,
        description: `${trend.topic} is trending up ${Math.round(trend.velocity * 100)}% in your industry`,
        source: 'trend_analyzer',
        source_data: trend,
        impact_score: Math.min(trend.velocity * 100, 100),
        urgency: trend.velocity > 0.8 ? 'high' : 'medium',
        confidence: 0.75,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        suggested_actions: [{
          action_type: 'create_content',
          description: `Create content about ${trend.topic}`,
          priority: 'high',
          estimated_effort: 'medium',
          potential_impact: Math.round(trend.velocity * 100),
        }],
        created_at: new Date().toISOString(),
      })
    }

    return opportunities
  } catch (error) {
    console.error('[OpportunityDetector] Trend API error:', error)
    return []
  }
}
```

### Step 2.3: Wire News API

**File**: `opportunity-detector.ts` method `detectLocalNews()`

**Change To**:
```typescript
import { NewsAPI } from './news-api'

static async detectLocalNews(config: DetectionConfig): Promise<OpportunityInsight[]> {
  try {
    const opportunities: OpportunityInsight[] = []

    // Get industry news
    const news = await NewsAPI.getIndustryNews({
      industry: config.industry || '',
      limit: 10
    })

    // Filter for relevant, recent news
    const relevantNews = news.filter(article => article.relevance_score > 0.6)

    for (const article of relevantNews) {
      opportunities.push({
        id: `news_${Date.now()}_${Math.random()}`,
        brand_id: config.brandId,
        type: 'local_news',
        title: `News Opportunity: ${article.title}`,
        description: article.description,
        source: 'news_api',
        source_data: article,
        impact_score: article.relevance_score * 100,
        urgency: 'medium',
        confidence: 0.7,
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        suggested_actions: [{
          action_type: 'create_content',
          description: `Create response content about: ${article.title}`,
          priority: 'medium',
          estimated_effort: 'medium',
          potential_impact: Math.round(article.relevance_score * 100),
        }],
        created_at: new Date().toISOString(),
      })
    }

    return opportunities
  } catch (error) {
    console.error('[OpportunityDetector] News API error:', error)
    return []
  }
}
```

### Step 2.4: Add to Brand Creation

**File**: `/src/services/industryService.ts`

**Location**: Inside `createBrandWithIndustryData()` after competitor discovery

**Add**:
```typescript
// Step 7: Detect Opportunities
console.log('[createBrandWithIndustryData] Step 7/9: Detecting opportunities...')
const { OpportunityDetector } = await import('@/services/intelligence/opportunity-detector')
const opportunities = await OpportunityDetector.detectOpportunities({
  brandId: brand.id,
  industry: naicsTitle,
  keywords: uvps.map(u => u.proposition)
})
console.log(`[createBrandWithIndustryData] ✅ Detected ${opportunities.length} opportunities`)

// Store opportunities in MEASURE section
measure.weather_opportunities = opportunities.filter(o => o.type === 'weather_based')
measure.trending_topics = opportunities.filter(o => o.type === 'trending_topic')
measure.industry_news = opportunities.filter(o => o.type === 'local_news')
```

**Test**:
1. Create new brand
2. Check console for "Detected X opportunities"
3. Navigate to Optimize → Opportunity Dashboard
4. Should see real opportunities (not hardcoded)

---

## TASK 3: Expand Synapse Live Scoring to ContentStrategy

**Current State**: SynapseLiveScoring only in BrandStrategy positioning editor

**File to Modify**: `/src/components/mirror/reimagine/ContentStrategy.tsx`

**Implementation Steps**:

### Step 3.1: Import SynapseLiveScoring

**Add to imports**:
```typescript
import { SynapseLiveScoring } from './SynapseLiveScoring'
```

### Step 3.2: Find Text Inputs

**Search for**: Textarea or Input components used for:
- Theme descriptions
- Content pillar text
- Any user-editable message fields

### Step 3.3: Replace with Synapse

**Pattern** (for each textarea):
```typescript
// BEFORE:
<Textarea
  value={theme.description}
  onChange={(e) => handleUpdateTheme(theme.id, { description: e.target.value })}
  placeholder="Describe this theme..."
  rows={3}
/>

// AFTER:
<SynapseLiveScoring
  value={theme.description}
  onChange={(value) => handleUpdateTheme(theme.id, { description: value })}
  brandData={brandData}
  placeholder="Describe this theme..."
  label="Theme Description"
  minScore={6}
/>
```

**Test**:
1. Navigate to Reimagine → Content Strategy
2. Start typing in theme description
3. Should see real-time psychology score appear
4. Score should update as you type

---

## TASK 4: Expand Synapse Live Scoring to AudienceStrategy

**File**: `/src/components/mirror/reimagine/AudienceStrategy.tsx`

**Same pattern as Task 3**:
1. Import SynapseLiveScoring
2. Find Textarea/Input for audience descriptions, pain points, desires
3. Replace with SynapseLiveScoring component
4. Test real-time scoring

---

## TASK 5: Expand Synapse Live Scoring to Goal Inputs

**File**: `/src/components/mirror/intend/IntendSection.tsx` or `/src/components/mirror/intend/GoalBuilder.tsx`

**Same pattern**:
1. Import SynapseLiveScoring
2. Find goal description inputs
3. Replace with SynapseLiveScoring
4. Test

---

## TASK 6: Wire LearningEngineWidget to Real Data

**Current State**: Shows hardcoded "proven winners" and patterns

**File**: `/src/components/mirror/reflect/LearningEngineWidget.tsx`

**Implementation Steps**:

### Step 6.1: Import PatternAnalyzer

```typescript
import { PatternAnalyzer } from '@/services/intelligence/pattern-analyzer'
```

### Step 6.2: Load Real Patterns

**Add useEffect**:
```typescript
const [patterns, setPatterns] = React.useState<any>(null)
const [isLoading, setIsLoading] = React.useState(true)

React.useEffect(() => {
  loadPatterns()
}, [brandId])

const loadPatterns = async () => {
  setIsLoading(true)
  try {
    const analyzed = await PatternAnalyzer.analyzeContentPatterns({
      brandId,
      timeframe: '30d',
      minConfidence: 0.7
    })
    setPatterns(analyzed)
  } catch (error) {
    console.error('[LearningEngine] Error:', error)
    // Fall back to mock data
    setPatterns(getMockPatterns())
  } finally {
    setIsLoading(false)
  }
}
```

### Step 6.3: Display Real Data

**Replace hardcoded arrays**:
```typescript
// BEFORE:
const provenWinners = [
  { pattern: 'Hook posts', impact: '+3.8x engagement', confidence: 92 },
  // ... hardcoded
]

// AFTER:
const provenWinners = patterns?.proven_winners || []
const avoidPatterns = patterns?.avoid_patterns || []
const testing = patterns?.currently_testing || []
```

**Test**:
1. Navigate to Reflect → Learning tab
2. Should see "Loading..." then real patterns
3. If no performance data yet, shows mock data with note

---

## TASK 7: Wire BenchmarkComparison to Real Data

**File**: `/src/components/mirror/reflect/BenchmarkComparison.tsx`

**Current State**: Hardcoded industry averages

**Implementation Steps**:

### Step 7.1: Import Benchmarking Service

```typescript
import { BenchmarkingService } from '@/services/intelligence/benchmarking'
```

### Step 7.2: Load Real Benchmarks

```typescript
const [benchmarks, setBenchmarks] = React.useState<any>(null)

React.useEffect(() => {
  loadBenchmarks()
}, [industry])

const loadBenchmarks = async () => {
  try {
    const data = await BenchmarkingService.getBenchmarks({
      industry,
      metrics: ['engagement_rate', 'click_through_rate', 'conversion_rate', 'cost_per_lead']
    })
    setBenchmarks(data)
  } catch (error) {
    console.error('[Benchmarks] Error:', error)
    // Use hardcoded fallback
  }
}
```

### Step 7.3: Display Dynamic Benchmarks

**Replace hardcoded values with**:
```typescript
const industryAvg = benchmarks?.engagement_rate?.average || 2.1
const top10 = benchmarks?.engagement_rate?.top_10_percent || 5.8
```

---

## TASK 8: Add Synapse Generation Modal to KeywordOpportunities

**File**: `/src/components/mirror/measure/KeywordOpportunities.tsx`

**Current State**: "Generate with Synapse" button exists but doesn't work

**Implementation Steps**:

### Step 8.1: Create Modal State

```typescript
const [isGenerating, setIsGenerating] = React.useState(false)
const [selectedKeyword, setSelectedKeyword] = React.useState<any>(null)
const [generatedContent, setGeneratedContent] = React.useState<any>(null)
```

### Step 8.2: Create Generation Function

```typescript
const handleGenerateContent = async (keyword: any) => {
  setSelectedKeyword(keyword)
  setIsGenerating(true)

  try {
    const { ContentPsychologyEngine } = await import('@/services/synapse/generation/ContentPsychologyEngine')

    const content = await ContentPsychologyEngine.generateContent({
      keyword: keyword.keyword,
      industry: brandProfile?.industry,
      triggers: brandProfile?.emotional_triggers || [],
      tone: brandProfile?.brand_voice || 'professional'
    })

    setGeneratedContent(content)
  } catch (error) {
    console.error('[KeywordOpportunities] Generation error:', error)
  } finally {
    setIsGenerating(false)
  }
}
```

### Step 8.3: Add Modal UI

```typescript
<Dialog open={!!selectedKeyword} onOpenChange={() => setSelectedKeyword(null)}>
  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Synapse Content Generation</DialogTitle>
      <DialogDescription>
        AI-generated content for: {selectedKeyword?.keyword}
      </DialogDescription>
    </DialogHeader>

    {isGenerating ? (
      <div className="flex items-center justify-center py-12">
        <Sparkles className="h-8 w-8 animate-spin" />
        <p className="ml-3">Analyzing psychology and generating content...</p>
      </div>
    ) : generatedContent ? (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Blog Post (1,500 words)</h3>
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded">
            {generatedContent.blog_post}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Social Posts (3 variations)</h3>
          {generatedContent.social_posts?.map((post, i) => (
            <div key={i} className="bg-muted p-3 rounded mb-2">
              {post}
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Psychology Score: {generatedContent.score}/10</h3>
          <Progress value={generatedContent.score * 10} />
        </div>

        <Button onClick={() => {/* Copy all */}}>
          <Copy className="mr-2 h-4 w-4" />
          Copy All
        </Button>
      </div>
    ) : null}
  </DialogContent>
</Dialog>
```

**Test**:
1. Navigate to Measure → Keyword Opportunities
2. Click "Generate with Synapse" on any keyword
3. Modal should open with loading state
4. Content should generate with psychology score
5. "Copy All" should work

---

## TASK 9-11: Implement Phase 6 - Connection Discovery

**These are the most complex tasks - requires new component + integration**

### TASK 9: Build ConnectionDiscovery Component

**Create**: `/src/components/mirror/optimize/ConnectionDiscovery.tsx`

**Template**:
```typescript
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, TrendingUp } from 'lucide-react'

interface ConnectionDiscoveryProps {
  brandId: string
  brandData?: any
}

export function ConnectionDiscovery({ brandId, brandData }: ConnectionDiscoveryProps) {
  const [connections, setConnections] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    loadConnections()
  }, [brandId])

  const loadConnections = async () => {
    setIsLoading(true)
    try {
      const { ConnectionDiscoveryEngine } = await import('@/services/intelligence/connection-discovery')

      // Find 2-way and 3-way connections
      const twoWay = await ConnectionDiscoveryEngine.findTwoWayConnections({
        brandId,
        industry: brandData?.industry,
        keywords: brandData?.uvps || []
      })

      const threeWay = await ConnectionDiscoveryEngine.findThreeWayConnections({
        brandId,
        industry: brandData?.industry,
        keywords: brandData?.uvps || []
      })

      setConnections([...threeWay, ...twoWay])
    } catch (error) {
      console.error('[ConnectionDiscovery] Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Connection Discovery
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Analyzing connections...</p>
        ) : connections.length === 0 ? (
          <p>No breakthrough connections found yet</p>
        ) : (
          <div className="space-y-4">
            {connections.map((conn, i) => (
              <Card key={i} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={conn.type === '3-way' ? 'default' : 'secondary'}>
                        {conn.type.toUpperCase()} CONNECTION
                      </Badge>
                      <h3 className="font-semibold mt-2 mb-1">{conn.title}</h3>
                      <p className="text-sm text-muted-foreground">{conn.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{conn.score}/10</p>
                      <p className="text-xs text-muted-foreground">Breakthrough Score</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Connected Data Points:</p>
                    {conn.data_points.map((point, j) => (
                      <div key={j} className="text-sm bg-muted p-2 rounded">
                        {point.source}: {point.insight}
                      </div>
                    ))}
                  </div>

                  {conn.content_angle && (
                    <div className="mt-4 p-3 bg-purple-50 rounded">
                      <p className="text-sm font-medium mb-1">💡 Content Angle:</p>
                      <p className="text-sm">{conn.content_angle}</p>
                    </div>
                  )}

                  <Button className="mt-4" onClick={() => {/* Generate campaign */}}>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Full Campaign
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### TASK 10: Integrate ConnectionDiscoveryEngine Service

**File**: Create if doesn't exist: `/src/services/intelligence/connection-discovery.ts`

**Implementation**: This service finds patterns across multiple data sources

**Methods needed**:
- `findTwoWayConnections()` - Connects 2 data points
- `findThreeWayConnections()` - Connects 3+ data points

**Example logic**:
```typescript
export class ConnectionDiscoveryEngine {
  static async findThreeWayConnections(config: any) {
    const connections = []

    // Example: Weather + Keyword Gap + Customer Trigger
    const weather = await WeatherAPI.getCurrentWeather(config.location)
    const gaps = await ContentGapAnalyzer.analyzeGaps(config)
    const triggers = config.triggers || []

    // Find connections
    if (weather.temperature > 90 && gaps.some(g => g.topic.includes('cooling'))) {
      const trigger = triggers.find(t => t.includes('emergency'))
      if (trigger) {
        connections.push({
          type: '3-way',
          score: 9.4,
          title: 'Hot Weather + Content Gap + Urgency Trigger',
          description: 'Heat wave predicted, no cooling content, emergency trigger available',
          data_points: [
            { source: 'Weather', insight: `${weather.temperature}°F heat wave` },
            { source: 'Content Gap', insight: 'No cooling/AC content' },
            { source: 'Customer Trigger', insight: 'Emergency urgency trigger' }
          ],
          content_angle: '"Beat the Heat: Emergency AC Service - Call Now Before It\'s Too Late"'
        })
      }
    }

    return connections
  }
}
```

### TASK 11: Add to OptimizeSection

**File**: `/src/components/mirror/optimize/OptimizeSection.tsx`

**Add**:
1. Import ConnectionDiscovery component
2. Add new tab "Connections"
3. Render component in tab content

---

## TASK 12-13: Priority 4 Tasks (Server-Side & Background Jobs)

**These are optimizations, not blocking for "complete"**

**Skip for now** - Document as "Future Enhancement"

---

## TASKS 14-19: FINAL Testing & Commit

### TASK 14: Test NEW Brand Creation

**Steps**:
1. Navigate to onboarding
2. Enter test domain + industry
3. Watch console for all API calls
4. Verify MIRROR sections populated
5. Check for any errors

**Expected**:
- SEMrush metrics fetched
- Competitors discovered
- Brand health calculated
- Opportunities detected
- All sections have data

### TASK 15: Test OLD Brand Refresh

**Steps**:
1. Navigate to existing brand
2. Go to Measure section
3. Click Refresh button
4. Watch console logs
5. Verify data updates
6. Refresh page, verify persistence

**Expected**:
- 4-step refresh completes
- Console shows success messages
- Data persists after page reload

### TASK 16: Verify API Endpoints

**Check**:
- All services have proper imports
- No broken import paths
- API keys documented in .env.example
- Fallback behavior works

### TASK 17: Final Gap Analysis

**Run**:
- Compare completed tasks vs plan
- Check all 20 phases from MIRROR_10X_ENHANCEMENT_PLAN.md
- Document completion percentage
- List remaining gaps

### TASK 18: Git Commit

**Command**:
```bash
git add .
git commit -m "feat: Complete MIRROR Gap Analysis Fixes

COMPLETED:
- Fixed all port references (3002→3001)
- Integrated OpportunityDashboard with real APIs (weather, trends, news)
- Expanded Synapse Live Scoring to ContentStrategy, AudienceStrategy, Goals
- Wired LearningEngineWidget to PatternAnalyzer
- Wired BenchmarkComparison to real benchmarking data
- Added Synapse generation modal to KeywordOpportunities
- Implemented Phase 6: ConnectionDiscovery component
- Integrated ConnectionDiscoveryEngine service
- Added Connection Discovery to OptimizeSection

TESTING:
- End-to-end NEW brand creation verified
- OLD brand Refresh functionality verified
- All API endpoints configured and working

REMAINING:
- Background refresh job (Priority 4, optional)
- Server-side generation optimization (Priority 4, optional)

🤖 Generated with Claude Code"
```

### TASK 19: Create Overview Document

**Create**: `COMPLETION_OVERVIEW.md`

**Include**:
- What was completed
- What's working end-to-end
- What's remaining (if any)
- How to test
- Known limitations
- Next steps

---

## Quick Reference

**High-Value Tasks** (Do These First):
- Task 1: Port fix ✅
- Tasks 3-5: Synapse expansion
- Tasks 9-11: Phase 6 (Connection Discovery)

**Medium-Value Tasks**:
- Task 2: OpportunityDashboard APIs
- Tasks 6-7: Learning/Benchmarks real data
- Task 8: Synapse generation modal

**Low-Priority Tasks** (Optional):
- Tasks 12-13: Server optimizations

**Always Do**:
- Tasks 14-19: Testing, verification, commit, docs

---

## Common Pitfalls to Avoid

1. **Don't claim "complete" without testing** - User will verify
2. **Don't use mock data when real API exists** - Wire it up properly
3. **Don't skip error handling** - All API calls need try/catch
4. **Don't forget to update TodoWrite** - Other Claudes need to track progress
5. **Commit often** - Don't wait until all 19 tasks done

---

## Success Criteria

**Task is COMPLETE when**:
1. Code compiles without errors
2. Component renders without console errors
3. Data flows end-to-end (not mock)
4. TodoWrite marked as completed
5. Tested manually or with test case

**Phase is COMPLETE when**:
1. All tasks in phase done
2. Integration verified
3. User can see results in UI
4. No regression in other features

**Project is COMPLETE when**:
1. Gap analysis shows 90%+ end-to-end completion
2. All Priority 1-3 tasks done
3. User can create brand and see intelligence everywhere
4. No dummy/mock data in critical components
5. Documentation accurate

---

*Created for seamless Claude handoff - any instance can pick up where another left off*
