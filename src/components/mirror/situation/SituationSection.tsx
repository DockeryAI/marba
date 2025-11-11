import * as React from 'react'
import { BrandHealthCard } from './BrandHealthCard'
import { MarketPositionCard } from './MarketPositionCard'
import { CompetitiveLandscapeCard } from './CompetitiveLandscapeCard'
import { CurrentAssetsCard } from './CurrentAssetsCard'
import { SituationAnalyzer } from '@/services/mirror/situation-analyzer'
import { MirrorSectionHeader } from '@/components/layouts/MirrorLayout'
import { Button } from '@/components/ui/button'
import { RefreshCw, Sparkles } from 'lucide-react'

interface SituationSectionProps {
  brandId: string
  brandData?: any
  className?: string
}

export const SituationSection: React.FC<SituationSectionProps> = ({
  brandId,
  brandData,
  className,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  // Calculate brand health
  const health = SituationAnalyzer.calculateBrandHealth(brandData)
  const hotSpots = SituationAnalyzer.getHotSpots(health)
  const attentionNeeded = SituationAnalyzer.getAttentionNeeded(health)

  // Get market position
  const position = SituationAnalyzer.getMarketPosition(brandData)

  // Mock competitive data
  const competitors = [
    { name: 'Competitor A', score: 78, strengths: ['Strong social presence'] },
    { name: 'Competitor B', score: 65, strengths: ['Great customer service'] },
    { name: 'Competitor C', score: 70, strengths: ['Industry leader'] },
  ]

  const differentiators = [
    'Premium service quality',
    '24/7 customer support',
    'Local market expertise',
  ]

  const gaps = [
    'Limited social media engagement',
    'No video content strategy',
  ]

  // Mock assets
  const assets = {
    colors: ['#2563eb', '#7c3aed', '#059669', '#f59e0b'],
    fonts: ['Inter', 'Roboto', 'Open Sans'],
    messagingThemes: ['Quality', 'Trust', 'Innovation', 'Results'],
    contentPerformance: {
      totalPosts: 127,
      avgEngagement: 4.2,
      topFormat: 'Carousel',
    },
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className={className}>
      <MirrorSectionHeader
        title="Situation"
        description="Current brand health, market position, and competitive landscape"
        badge={<span className="text-xs">SOSTAC Analysis</span>}
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
      </div>
    </div>
  )
}
