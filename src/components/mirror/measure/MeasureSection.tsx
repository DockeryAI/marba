import * as React from 'react'
import { BrandHealthCard } from './BrandHealthCard'
import { MarketPositionCard } from './MarketPositionCard'
import { CompetitiveLandscapeCard } from './CompetitiveLandscapeCard'
import { CurrentAssetsCard } from './CurrentAssetsCard'
import { SEOHealthCard } from './SEOHealthCard'
import { KeywordOpportunities } from './KeywordOpportunities'
import { CustomerTriggerGallery } from './CustomerTriggerGallery'
import { CompetitiveDashboard } from './CompetitiveDashboard'
import { ContentGapAnalysis } from './ContentGapAnalysis'
import { SituationAnalyzer } from '@/services/mirror/situation-analyzer'
import { MirrorSectionHeader } from '@/components/layouts/MirrorLayout'
import { Button } from '@/components/ui/button'
import { RefreshCw, Sparkles } from 'lucide-react'

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

  // Debug logging
  React.useEffect(() => {
    console.log('[MeasureSection] brandData received:', brandData)
    console.log('[MeasureSection] competitiveLandscape:', brandData?.competitiveLandscape)
    console.log('[MeasureSection] advantages:', brandData?.competitiveLandscape?.advantages)
  }, [brandData])

  // Calculate brand health
  const health = SituationAnalyzer.calculateBrandHealth(brandData)
  const hotSpots = SituationAnalyzer.getHotSpots(health)
  const attentionNeeded = SituationAnalyzer.getAttentionNeeded(health)

  // Get market position
  const position = SituationAnalyzer.getMarketPosition(brandData)

  // Get real competitive data from industry profile
  const competitiveAdvantages = brandData?.competitiveLandscape?.advantages || []
  const differentiators = competitiveAdvantages.slice(0, 5)

  // Use real weaknesses from assets as gaps
  const gaps = brandData?.assets?.weaknesses || []

  // No competitor data in database - show differentiators only
  const competitors = []

  // Get real assets from industry profile
  const marketPosition = brandData?.marketPosition || {}
  const realAssets = brandData?.assets || {}
  const assets = {
    colors: ['#2563eb', '#7c3aed', '#059669', '#f59e0b'],
    fonts: ['Inter', 'Roboto', 'Open Sans'],
    messagingThemes: marketPosition.keyTrends?.slice(0, 4) || [],
    contentPerformance: {
      totalPosts: 0,
      avgEngagement: 0,
      topFormat: 'To be determined',
    },
    // Include SWOT data from industry profile
    opportunities: realAssets.opportunities || [],
    threats: realAssets.threats || [],
    strengths: realAssets.strengths || [],
    weaknesses: realAssets.weaknesses || [],
  }

  const handleRefresh = async () => {
    if (!brandData?.name && !brandData?.industry) {
      console.warn('[MeasureSection] No brand data to refresh')
      alert('Unable to refresh: No brand name or industry found. Please ensure brand data is loaded.')
      return
    }

    setIsLoading(true)
    try {
      console.log('[MeasureSection] ===== STARTING INTELLIGENCE REFRESH =====')

      // Get domain from brandData
      const domain = (brandData as any).website || window.location.hostname
      const brandName = (brandData as any).name || 'Brand'
      const industry = (brandData as any).industry || 'Technology'

      console.log('[MeasureSection] Refresh params:', { domain, brandName, industry })

      // Step 1: Fetch fresh SEO metrics
      console.log('[MeasureSection] Step 1/4: Fetching SEO metrics...')
      const { SemrushAPI } = await import('@/services/intelligence/semrush-api')
      const seoMetrics = await SemrushAPI.getComprehensiveSEOMetrics(domain, brandName)
      console.log('[MeasureSection] ✅ SEO metrics fetched:', {
        authority: seoMetrics?.overview?.authority_score,
        keywords: seoMetrics?.rankings?.length,
        opportunities: seoMetrics?.opportunities?.length
      })

      // Step 2: Discover competitors
      console.log('[MeasureSection] Step 2/4: Discovering competitors...')
      const { CompetitorDiscovery } = await import('@/services/intelligence/competitor-discovery')
      const competitorAnalysis = await CompetitorDiscovery.discoverCompetitors(
        domain,
        industry,
        brandName
      )
      console.log('[MeasureSection] ✅ Competitors discovered:', {
        total: competitorAnalysis?.total_found,
        primary: competitorAnalysis?.primary_competitors?.length,
        marketLeaders: competitorAnalysis?.market_leaders?.length
      })

      // Step 3: Calculate brand health
      console.log('[MeasureSection] Step 3/4: Calculating brand health...')
      const { BrandHealthCalculator } = await import('@/services/mirror/brand-health-calculator')
      const brandHealthScore = await BrandHealthCalculator.calculate({
        brandProfile: {
          name: brandName,
          full_profile_data: (brandData as any).full_profile_data || {},
          positioning_statement: (brandData as any).positioning_statement || '',
          content_pillars: (brandData as any).content_pillars || []
        } as any,
        industryData: {
          title: industry,
          full_profile_data: (brandData as any).full_profile_data || {}
        } as any,
        seoMetrics: seoMetrics
      })
      console.log('[MeasureSection] ✅ Brand health calculated:', brandHealthScore.overall)

      // Step 4: Update the section with fresh data
      console.log('[MeasureSection] Step 4/4: Updating MirrorContext...')
      const updatedData = {
        ...brandData,
        seoMetrics,
        keywordOpportunities: seoMetrics?.opportunities || [],
        competitorAnalysis,
        brandHealth: brandHealthScore.overall,
        brandHealthDetails: brandHealthScore
      }

      if (onDataUpdate) {
        onDataUpdate(updatedData)
        console.log('[MeasureSection] ✅ Data updated in context')
      } else {
        console.warn('[MeasureSection] ⚠️ No onDataUpdate handler provided')
      }

      console.log('[MeasureSection] ===== REFRESH COMPLETE =====')
      alert('✅ Intelligence data refreshed successfully! Data will save automatically in 2 seconds.')

    } catch (error) {
      console.error('[MeasureSection] ❌ Refresh error:', error)
      alert(`Failed to refresh intelligence data: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <MirrorSectionHeader
        title="Situation"
        description="Current brand health, market position, and competitive landscape"
        badge={<span className="text-xs">MIRROR Analysis</span>}
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

      <div className="container py-6 px-6 space-y-6">
        {/* Brand Health */}
        <section id="brand-health">
          <BrandHealthCard
            health={health}
            hotSpots={hotSpots}
            attentionNeeded={attentionNeeded}
            industryAverage={65}
            brandHealthDetails={brandData?.brandHealthDetails}
          />
        </section>

        {/* Grid of other cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section id="market-position">
            <MarketPositionCard position={position} />
          </section>

          <section id="competitive-landscape">
            <CompetitiveLandscapeCard
              competitors={competitors}
              userScore={health.overall}
              differentiators={differentiators}
              gaps={gaps}
            />
          </section>
        </div>

        {/* Current Assets */}
        <section id="current-assets">
          <CurrentAssetsCard assets={assets} />
        </section>

        {/* SEO Health & Keywords - NEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section id="seo-health">
            <SEOHealthCard seoMetrics={brandData?.seoMetrics} />
          </section>

          <section id="keyword-opportunities">
            <KeywordOpportunities
              opportunities={brandData?.keywordOpportunities || []}
              brandProfile={brandData}
            />
          </section>
        </div>

        {/* Customer Psychology - NEW */}
        <section id="customer-psychology">
          <CustomerTriggerGallery
            triggers={brandData?.emotional_triggers || []}
            psychologicalHooks={brandData?.psychological_hooks || []}
            customerAvatars={brandData?.customer_avatars || []}
          />
        </section>

        {/* Competitive Intelligence - NEW */}
        <section id="competitive-intelligence">
          <CompetitiveDashboard
            analysis={brandData?.competitorAnalysis || null}
            brandAuthority={brandData?.seoMetrics?.overview?.authority_score || health.overall}
            industryData={brandData}
          />
        </section>

        {/* Content Gap Analysis - NEW */}
        <section id="content-gap-analysis">
          <ContentGapAnalysis
            brandData={brandData}
            competitorAnalysis={brandData?.competitorAnalysis || null}
            industryData={brandData}
          />
        </section>
      </div>
    </div>
  )
}
