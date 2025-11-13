import * as React from 'react'
import { MirrorSectionHeader } from '@/components/layouts/MirrorLayout'
import { SubsectionTabs } from '../SubsectionTabs'
import {
  BrandPerceptionGapSection,
  CompetitiveIntelligenceSection,
  CustomerUnderstandingSection,
  SearchVisibilitySection,
  CustomerDiscoveryJourneySection,
  ValueDeliveryAnalysisSection,
  CompetitivePositioningCanvasSection,
  DynamicSWOTSection,
  BrandPerceptionMirrorSection,
} from '../subsections'
import { WWHFramework } from '../intend/WWHFramework'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw, Sparkles, Zap, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface MeasureSectionProps {
  brandId: string
  brandData?: any
  onDataUpdate?: (data: any) => void
  className?: string
}

export const MeasureSection: React.FC<MeasureSectionProps> = ({
  brandId,
  brandData,
  onDataUpdate,
  className,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasCompletedUVP, setHasCompletedUVP] = React.useState(false)
  const [activeSubsection, setActiveSubsection] = React.useState('brand-perception-gap')

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

  // Sync active subsection with URL hash
  React.useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && hash.startsWith('mirror-')) {
      const subsectionId = hash.replace('mirror-', '')
      setActiveSubsection(subsectionId)
    }
  }, [])

  // Update URL hash when subsection changes
  const handleSubsectionChange = (id: string) => {
    setActiveSubsection(id)
    window.history.pushState(null, '', `#mirror-${id}`)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // TODO: Implement refresh logic for active subsection
    console.log('[MeasureSection] Refreshing data for subsection:', activeSubsection)
    setTimeout(() => setIsLoading(false), 2000)
  }

  // Define subsections based on UVP completion
  const subsections = React.useMemo(() => {
    const preUVP = [
      { id: 'brand-perception-gap', label: 'Brand Perception Gap' },
      { id: 'competitive-intelligence', label: 'Competitive Intelligence' },
      { id: 'customer-understanding', label: 'Customer Understanding' },
      { id: 'search-visibility', label: 'Search Visibility' },
    ]

    const postUVP = hasCompletedUVP
      ? [
          { id: 'customer-discovery-journey', label: 'Customer Discovery' },
          { id: 'value-delivery-analysis', label: 'Value Delivery' },
          { id: 'competitive-positioning-canvas', label: 'Positioning Canvas' },
          { id: 'dynamic-swot', label: 'SWOT Analysis' },
          { id: 'brand-perception-mirror', label: 'Perception Mirror' },
        ]
      : []

    return [...preUVP, ...postUVP]
  }, [hasCompletedUVP])

  // Render active subsection content
  const renderActiveSubsection = () => {
    const commonProps = {
      brandId,
      brandData,
      className: 'mt-6',
    }

    switch (activeSubsection) {
      case 'brand-perception-gap':
        return <BrandPerceptionGapSection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
      case 'competitive-intelligence':
        return <CompetitiveIntelligenceSection {...commonProps} />
      case 'customer-understanding':
        return <CustomerUnderstandingSection {...commonProps} />
      case 'search-visibility':
        return <SearchVisibilitySection {...commonProps} />
      case 'customer-discovery-journey':
        return <CustomerDiscoveryJourneySection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
      case 'value-delivery-analysis':
        return <ValueDeliveryAnalysisSection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
      case 'competitive-positioning-canvas':
        return <CompetitivePositioningCanvasSection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
      case 'dynamic-swot':
        return <DynamicSWOTSection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
      case 'brand-perception-mirror':
        return <BrandPerceptionMirrorSection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
      default:
        return <BrandPerceptionGapSection {...commonProps} hasCompletedUVP={hasCompletedUVP} />
    }
  }

  return (
    <div className={className}>
      <MirrorSectionHeader
        title="Mirror"
        description="See where you are — your audience, market, and message today"
        badge={<span className="text-xs">AI-Powered Intelligence</span>}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Ask Marbs
            </Button>
          </>
        }
      />

      {/* WWH Framework Overview */}
      <div className="container px-6 py-4">
        <Card className="border-2 border-primary/20">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Strategic Foundation</h3>
                <p className="text-sm text-muted-foreground">
                  Why, What, How — The core of your brand
                </p>
              </div>
              {!hasCompletedUVP && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const uvpSection = document.getElementById('uvp-flow')
                    uvpSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Strengthen Your WHY
                </Button>
              )}
            </div>
            <WWHFramework brandData={brandData} />
            {!hasCompletedUVP && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Complete your Value Proposition to refine and strengthen your strategic foundation
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Horizontal subsection tabs */}
      <SubsectionTabs
        subsections={subsections}
        activeSubsection={activeSubsection}
        onSubsectionChange={handleSubsectionChange}
      />

      {/* Active subsection content */}
      {renderActiveSubsection()}
    </div>
  )
}
