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
import { Badge } from '@/components/ui/badge'
import { Save, Check, AlertCircle } from 'lucide-react'
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
        { id: 'goals', label: 'Goals' },
        { id: 'targets', label: 'Targets' },
      ],
    },
    {
      id: 'reimagine',
      label: 'Reimagine',
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
      subsections: [
        { id: 'channels', label: 'Channels' },
        { id: 'campaigns', label: 'Campaigns' },
      ],
    },
    {
      id: 'optimize',
      label: 'Optimize',
      subsections: [
        { id: 'board', label: 'Action Board' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'priority', label: 'By Priority' },
      ],
    },
    {
      id: 'reflect',
      label: 'Reflect',
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
    intend: Object.keys(state.intend).length > 0,
    reimagine: Object.keys(state.reimagine).length > 0,
    reach: Object.keys(state.reach).length > 0,
    optimize: Object.keys(state.optimize).length > 0,
    reflect: Object.keys(state.reflect).length > 0
  }), [state])

  const completedCount = Object.values(sectionCompletion).filter(Boolean).length

  return (
    <MirrorLayout
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
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

        {/* Reimagine Phase */}
        <div id="reimagine">
          <ReimagineSection
            brandId={brandId}
            brandData={state.reimagine}
            objectives={objectives}
            situationAnalysis={measureData}
            competitors={brandData?.competitors || []}
          />
        </div>

        {/* Reach Phase */}
        <div id="reach">
          <ReachSection
            brandId={brandId}
            strategy={strategy}
            objectives={objectives}
            budget={0}
            teamSize={0}
          />
        </div>

        {/* Optimize Phase */}
        <div id="optimize">
          <OptimizeSection
            brandId={brandId}
            userId={brandId}
            tactics={tactics}
            pillars={[]}
            industry={state.measure?.industry}
            brandData={state.measure}
          />
        </div>

        {/* Reflect Phase */}
        <div id="reflect">
          <ReflectSection
            objectives={objectives}
            brandId={brandId}
            brandHealth={state.measure.brandHealth}
          />
        </div>
      </div>
    </MirrorLayout>
  )
}
