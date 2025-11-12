import * as React from 'react'
import { MirrorLayout } from '@/components/layouts/MirrorLayout'
import { MeasureSection } from '@/components/mirror/measure'
import { IntendSection } from '@/components/mirror/intend'
import { ReimagineSection } from '@/components/mirror/reimagine'
import { ReachSection } from '@/components/mirror/reach'
import { OptimizeSection } from '@/components/mirror/optimize'
import { ReflectSection } from '@/components/mirror/reflect'
import { useMirror } from '@/contexts/MirrorContext'
import { useBrand } from '@/contexts/BrandContext'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Save, Check, AlertCircle, Lock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export const MirrorPage: React.FC = () => {
  const { currentBrand } = useBrand()
  const { state, updateMeasure, updateIntend, updateReimagine, updateReach, updateOptimize, updateReflect, loading, error } = useMirror()

  const brandId = currentBrand?.id
  const brandData = currentBrand ? {
    name: currentBrand.name,
    industry: currentBrand.industry,
    founded: currentBrand.founded,
    size: currentBrand.size,
    competitors: currentBrand.competitors || [],
  } : null

  const [activeSection, setActiveSection] = React.useState('measure')
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
        .single()

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
      id: 'measure',
      label: 'Measure',
      subsections: [
        { id: 'brand-health', label: 'Brand Health' },
        { id: 'market-position', label: 'Market Position' },
        { id: 'competitive', label: 'Competitive Landscape' },
        { id: 'assets', label: 'Current Assets' },
      ],
    },
    {
      id: 'intend',
      label: 'Intend',
      subsections: [
        { id: 'uvp-flow', label: 'Value Proposition' },
        { id: 'wwh-framework', label: 'Why, What, How' },
        { id: 'goals', label: 'Goals' },
        { id: 'targets', label: 'Targets' },
      ],
    },
    {
      id: 'reimagine',
      label: 'Reimagine',
      locked: !hasCompletedUVP,
      subsections: [
        { id: 'brand', label: 'Brand' },
        { id: 'audience', label: 'Audience' },
        { id: 'content', label: 'Content' },
        { id: 'competitive', label: 'Competitive' },
      ],
    },
    {
      id: 'reach',
      label: 'Reach',
      locked: !hasCompletedUVP,
      subsections: [
        { id: 'channels', label: 'Channels' },
        { id: 'campaigns', label: 'Campaigns' },
      ],
    },
    {
      id: 'optimize',
      label: 'Optimize',
      locked: !hasCompletedUVP,
      subsections: [
        { id: 'board', label: 'Action Board' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'priority', label: 'By Priority' },
      ],
    },
    {
      id: 'reflect',
      label: 'Reflect',
      locked: !hasCompletedUVP,
      subsections: [
        { id: 'kpis', label: 'KPI Dashboard' },
        { id: 'insights', label: 'Performance Insights' },
        { id: 'report', label: 'Reflection Report' },
      ],
    },
  ]

  // Calculate section completion
  const sectionCompletion = React.useMemo(() => ({
    measure: Object.keys(state.measure).length > 0,
    intend: hasCompletedUVP, // Intend is complete when UVP is done
    reimagine: Object.keys(state.reimagine).length > 0 && hasCompletedUVP,
    reach: Object.keys(state.reach).length > 0 && hasCompletedUVP,
    optimize: Object.keys(state.optimize).length > 0 && hasCompletedUVP,
    reflect: Object.keys(state.reflect).length > 0 && hasCompletedUVP
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
              setActiveSection('intend')
              setTimeout(() => {
                const uvpSection = document.getElementById('uvp-flow')
                uvpSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }, 100)
            }}
            className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 animate-pulse" />

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
              <Badge variant="outline">{completedCount}/6 Sections</Badge>
            </div>
            {sectionCompletion.measure && <Badge variant="secondary">Measure</Badge>}
            {sectionCompletion.intend && <Badge variant="secondary">Intend</Badge>}
            {sectionCompletion.reimagine && <Badge variant="secondary">Reimagine</Badge>}
            {sectionCompletion.reach && <Badge variant="secondary">Reach</Badge>}
            {sectionCompletion.optimize && <Badge variant="secondary">Optimize</Badge>}
            {sectionCompletion.reflect && <Badge variant="secondary">Reflect</Badge>}
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
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Measure Phase */}
        <div id="measure">
          <MeasureSection
            brandId={brandId}
            brandData={state.measure}
            onDataUpdate={updateMeasure}
          />
        </div>

        {/* Intend Phase */}
        <div id="intend">
          <IntendSection
            brandId={brandId}
            situationData={measureData}
            brandData={state.measure}
          />
        </div>

        {/* Reimagine Phase - LOCKED UNTIL UVP COMPLETE */}
        <div id="reimagine" className="relative">
          {!hasCompletedUVP && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-center p-8 max-w-md">
                <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Complete Your Value Proposition First</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your UVP is the foundation for everything that follows. Scroll up to the Intend section to define it now.
                </p>
                <Button onClick={() => {
                  const uvpSection = document.getElementById('uvp-flow')
                  uvpSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}>
                  <Zap className="h-4 w-4 mr-2" />
                  Go to Value Proposition
                </Button>
              </div>
            </div>
          )}
          <div className={cn(!hasCompletedUVP && "pointer-events-none opacity-50")}>
            <ReimagineSection
              brandId={brandId}
              brandData={state.reimagine}
              objectives={objectives}
              situationAnalysis={measureData}
              competitors={brandData?.competitors || []}
            />
          </div>
        </div>

        {/* Reach Phase - LOCKED UNTIL UVP COMPLETE */}
        <div id="reach" className="relative">
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
            <ReachSection
              brandId={brandId}
              strategy={strategy}
              objectives={objectives}
              budget={0}
              teamSize={0}
            />
          </div>
        </div>

        {/* Optimize Phase - LOCKED UNTIL UVP COMPLETE */}
        <div id="optimize" className="relative">
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
            <OptimizeSection
              brandId={brandId}
              userId={brandId}
              tactics={tactics}
              pillars={[]}
              industry={state.measure?.industry}
              brandData={state.measure}
            />
          </div>
        </div>

        {/* Reflect Phase - LOCKED UNTIL UVP COMPLETE */}
        <div id="reflect" className="relative">
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
            <ReflectSection
              objectives={objectives}
              brandId={brandId}
              brandHealth={state.measure.brandHealth}
            />
          </div>
        </div>
      </div>
    </MirrorLayout>
  )
}
