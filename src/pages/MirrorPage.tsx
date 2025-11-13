import * as React from 'react'
import { MirrorLayout } from '@/components/layouts/MirrorLayout'
import { MeasureSection } from '@/components/mirror/measure'
import { IntendSection } from '@/components/mirror/intend'
import { ReimagineSection } from '@/components/mirror/reimagine'
import { ReachSection } from '@/components/mirror/reach'
import { OptimizeSection } from '@/components/mirror/optimize'
import { ReflectSection } from '@/components/mirror/reflect'
import { ActionCenterWidget } from '@/components/action-center/ActionCenterWidget'
import { useMirror } from '@/contexts/MirrorContext'
import { useBrand } from '@/contexts/BrandContext'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Save, Check, AlertCircle, Lock, Zap, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export const MirrorPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentBrand } = useBrand()
  const { state, updateMeasure, updateIntend, updateReimagine, updateReach, updateOptimize, updateReflect, loading, error } = useMirror()

  const brandId = currentBrand?.id

  // Memoize brandData to prevent infinite re-renders
  const brandData = React.useMemo(() => {
    if (!currentBrand) return null
    return {
      name: currentBrand.name,
      industry: currentBrand.industry,
      founded: currentBrand.founded,
      size: currentBrand.size,
      competitors: currentBrand.competitors || [],
    }
  }, [currentBrand?.name, currentBrand?.industry, currentBrand?.founded, currentBrand?.size, currentBrand?.competitors])

  const [activeSection, setActiveSection] = React.useState('mirror')
  const [hasCompletedUVP, setHasCompletedUVP] = React.useState(false)

  // Check if UVP is completed
  React.useEffect(() => {
    const checkUVPCompletion = async () => {
      if (!brandId) return

      const { data, error } = await supabase
        .from('value_statements')
        .select('id, is_primary')
        .eq('brand_id', brandId)
        .eq('is_primary', true)
        .maybeSingle()

      setHasCompletedUVP(!error && !!data)
    }

    checkUVPCompletion()
  }, [brandId])

  // Redirect to onboarding if no brand
  React.useEffect(() => {
    if (!brandId || !brandData) {
      window.location.href = '/onboarding'
    }
  }, [brandId, brandData])

  // Extract data from context state
  const objectives = state.intend.objectives || []
  const strategy = state.reimagine || {}
  const tactics = state.reach.tactics || []
  const measureData = state.measure

  // Show error if no brand data
  if (!brandId || !brandData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Brand Selected</h2>
          <p className="text-muted-foreground mb-4">Please complete onboarding to continue</p>
          <a href="/onboarding" className="text-primary underline">Go to Onboarding</a>
        </div>
      </div>
    )
  }

  // Scroll to section when activeSection changes
  React.useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  const sections = [
    {
      id: 'mirror',
      label: 'Mirror',
      tooltip: 'See where you are — your audience, market, and message today',
      color: 'blue',
      locked: false, // Always unlocked
      subsections: [
        // Pre-UVP subsections (always visible)
        { id: 'brand-perception-gap', label: 'Brand Perception Gap' },
        { id: 'competitive-intelligence', label: 'Competitive Intelligence' },
        { id: 'customer-understanding', label: 'Customer Understanding' },
        { id: 'search-visibility', label: 'Search Visibility' },
        // Post-UVP subsections (visible after UVP completion)
        ...(hasCompletedUVP ? [
          { id: 'customer-discovery-journey', label: 'Customer Discovery Journey' },
          { id: 'value-delivery-analysis', label: 'Value Delivery' },
          { id: 'competitive-positioning-canvas', label: 'Positioning Canvas' },
          { id: 'dynamic-swot', label: 'SWOT Analysis' },
          { id: 'brand-perception-mirror', label: 'Brand Perception Mirror' },
        ] : []),
      ],
    },
    {
      id: 'align',
      label: 'Align',
      tooltip: 'Set your direction — goals, results, and what success looks like',
      color: 'purple',
      locked: !hasCompletedUVP, // Locked until UVP complete
      subsections: [
        { id: 'wwh-framework', label: 'Why, What, How' },
        { id: 'goals', label: 'Goals' },
        { id: 'targets', label: 'Targets' },
      ],
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      tooltip: 'Plan how to get there — the channels, audience, and strategy',
      color: 'green',
      locked: false, // Always unlocked since UVP is inside
      subsections: [
        { id: 'uvp-flow', label: 'Value Proposition' },
        { id: 'strategy', label: 'Strategy' },
        { id: 'channels', label: 'Channels' },
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'content-pillars', label: 'Content Pillars' },
      ],
    },
    {
      id: 'broadcast',
      label: 'Broadcast',
      tooltip: 'Create and launch — your content, campaigns, and offers',
      color: 'orange',
      locked: !hasCompletedUVP, // Locked until UVP complete
      subsections: [
        { id: 'calendar', label: 'Content Calendar' },
        { id: 'campaigns', label: 'Campaign Manager' },
        { id: 'publishing', label: 'Publishing' },
      ],
    },
    {
      id: 'assess',
      label: 'Assess',
      tooltip: 'Reflect on results — measure, learn, and refine what works',
      color: 'teal',
      locked: !hasCompletedUVP, // Locked until UVP complete
      subsections: [
        { id: 'dashboard', label: 'Performance Dashboard' },
        { id: 'insights', label: 'Insights' },
        { id: 'optimization', label: 'Optimization' },
        { id: 'retrospective', label: 'Retrospective' },
      ],
    },
  ]

  // Calculate section completion (MARBA framework)
  const sectionCompletion = React.useMemo(() => ({
    mirror: Object.keys(state.measure).length > 0,
    align: hasCompletedUVP, // Align is complete when UVP is done
    roadmap: (Object.keys(state.reimagine).length > 0 || Object.keys(state.reach).length > 0) && hasCompletedUVP,
    broadcast: false, // Placeholder - will implement later
    assess: (Object.keys(state.optimize).length > 0 || Object.keys(state.reflect).length > 0) && hasCompletedUVP
  }), [state, hasCompletedUVP])

  const completedCount = Object.values(sectionCompletion).filter(Boolean).length

  return (
    <MirrorLayout
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      sidebarCTA={
        !hasCompletedUVP ? (
          <button
            onClick={() => {
              setActiveSection('roadmap')
              setTimeout(() => {
                const uvpSection = document.getElementById('uvp-flow')
                uvpSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }, 100)
            }}
            className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 animate-pulse" />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-sm">Complete Your UVP</span>
              </div>
              <p className="text-xs opacity-90 text-center">
                Takes 5 minutes • Unlocks everything
              </p>
            </div>
          </button>
        ) : null
      }
    >
      {/* Save Status Indicator */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-3 mb-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Progress:</span>
              <Badge variant="outline">{completedCount}/5 Sections</Badge>
            </div>
            {sectionCompletion.mirror && <Badge variant="secondary">Mirror</Badge>}
            {sectionCompletion.align && <Badge variant="secondary">Align</Badge>}
            {sectionCompletion.roadmap && <Badge variant="secondary">Roadmap</Badge>}
            {sectionCompletion.broadcast && <Badge variant="secondary">Broadcast</Badge>}
            {sectionCompletion.assess && <Badge variant="secondary">Assess</Badge>}
          </div>

          <div className="flex items-center gap-2">
            {error && (
              <div className="flex items-center gap-1 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Error saving</span>
              </div>
            )}
            {!state.isDirty && state.lastSaved && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Check className="h-4 w-4" />
                <span>Saved</span>
              </div>
            )}
            {state.isDirty && !loading && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Save className="h-4 w-4 animate-pulse" />
                <span>Saving...</span>
              </div>
            )}
            {state.lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved: {new Date(state.lastSaved).toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/sessions')}
              className="ml-2"
            >
              <Database className="h-4 w-4 mr-2" />
              Sessions
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* MIRROR - See where you are */}
        <div id="mirror">
          <MeasureSection
            brandId={brandId}
            brandData={state.measure}
            onDataUpdate={updateMeasure}
          />
        </div>

        {/* ALIGN - Set your direction */}
        <div id="align" className="relative">
          {/* Align section is always accessible since it contains the UVP wizard */}
          <IntendSection
            brandId={brandId}
            situationData={measureData}
            brandData={state.measure}
          />
        </div>

        {/* ROADMAP - Plan how to get there (combines Reimagine + Reach) */}
        <div id="roadmap" className="relative">
          <div className="space-y-12">
            {/* Strategy & Content Planning - UVP is now the first tab here */}
            <ReimagineSection
              brandId={brandId}
              brandData={state.reimagine}
              objectives={objectives}
              situationAnalysis={measureData}
              competitors={brandData?.competitors || []}
            />

            {/* Channel & Campaign Planning */}
            <ReachSection
              brandId={brandId}
              strategy={strategy}
              objectives={objectives}
              budget={0}
              teamSize={0}
            />
          </div>
        </div>

        {/* BROADCAST - Create and launch (Placeholder) */}
        <div id="broadcast" className="relative">
          {!hasCompletedUVP && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-center p-8 max-w-md">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Locked</h3>
                <p className="text-sm text-muted-foreground">Complete your Value Proposition to unlock</p>
              </div>
            </div>
          )}
          <div className={cn(!hasCompletedUVP && "pointer-events-none opacity-50")}>
            <div className="bg-card border rounded-lg p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                  <span className="text-3xl">📡</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Broadcast</h2>
                <p className="text-muted-foreground mb-4">
                  Create and launch — your content, campaigns, and offers
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100 rounded-full text-sm font-medium">
                  <span>🚧</span>
                  <span>Coming Soon - Content Calendar & Publishing Workflow</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ASSESS - Reflect on results (combines Optimize + Reflect) */}
        <div id="assess" className="relative">
          {!hasCompletedUVP && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-center p-8 max-w-md">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Locked</h3>
                <p className="text-sm text-muted-foreground">Complete your Value Proposition to unlock</p>
              </div>
            </div>
          )}
          <div className={cn(!hasCompletedUVP && "pointer-events-none opacity-50")}>
            <div className="space-y-12">
              {/* Action Board & Optimization */}
              <OptimizeSection
                brandId={brandId}
                userId={brandId}
                tactics={tactics}
                pillars={[]}
                industry={state.measure?.industry}
                brandData={state.measure}
              />

              {/* Performance & Insights */}
              <ReflectSection
                objectives={objectives}
                brandId={brandId}
                brandHealth={state.measure.brandHealth}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Center Widget - Persistent across all sections */}
      <ActionCenterWidget />
    </MirrorLayout>
  )
}
