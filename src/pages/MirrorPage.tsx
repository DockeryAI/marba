import * as React from 'react'
import { MirrorLayout } from '@/components/layouts/MirrorLayout'
import { SituationSection } from '@/components/mirror/situation'
import { ObjectivesSection } from '@/components/mirror/objectives'
import { StrategySection } from '@/components/mirror/strategy'
import { TacticsSection } from '@/components/mirror/tactics'

export const MirrorPage: React.FC = () => {
  // Mock brand data - in production this would come from auth/context
  const brandId = 'demo-brand-001'
  const brandData = {
    name: 'Demo Brand',
    industry: 'Technology',
    founded: '2020',
    size: 'Small (1-50 employees)',
    competitors: [
      { name: 'Competitor A', score: 75 },
      { name: 'Competitor B', score: 68 },
      { name: 'Competitor C', score: 72 },
    ],
  }

  const [activeSection, setActiveSection] = React.useState('situation')
  const [objectives, setObjectives] = React.useState<any[]>([])
  const [strategy, setStrategy] = React.useState<any>({})
  const [situationData, setSituationData] = React.useState<any>({
    brandHealth: 72,
    industry: 'Technology',
    currentMetrics: {
      website_traffic: 10000,
      social_followers: 5000,
      email_subscribers: 2000,
    },
  })

  // Scroll to section when activeSection changes
  React.useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  const sections = [
    {
      id: 'situation',
      label: 'Situation',
      subsections: [
        { id: 'brand-health', label: 'Brand Health' },
        { id: 'market-position', label: 'Market Position' },
        { id: 'competitive', label: 'Competitive Landscape' },
        { id: 'assets', label: 'Current Assets' },
      ],
    },
    {
      id: 'objectives',
      label: 'Objectives',
      subsections: [
        { id: 'goals', label: 'Goals' },
        { id: 'targets', label: 'Targets' },
      ],
    },
    {
      id: 'strategy',
      label: 'Strategy',
      subsections: [
        { id: 'brand', label: 'Brand' },
        { id: 'audience', label: 'Audience' },
        { id: 'content', label: 'Content' },
        { id: 'competitive', label: 'Competitive' },
      ],
    },
    {
      id: 'tactics',
      label: 'Tactics',
      subsections: [
        { id: 'channels', label: 'Channels' },
        { id: 'campaigns', label: 'Campaigns' },
      ],
    },
  ]

  return (
    <MirrorLayout
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div className="space-y-12">
        {/* Situation Section */}
        <div id="situation">
          <SituationSection
            brandId={brandId}
            brandData={brandData}
            onDataUpdate={setSituationData}
          />
        </div>

        {/* Objectives Section */}
        <div id="objectives">
          <ObjectivesSection
            brandId={brandId}
            situationData={situationData}
          />
        </div>

        {/* Strategy Section */}
        <div id="strategy">
          <StrategySection
            brandId={brandId}
            brandData={brandData}
            objectives={objectives}
            situationAnalysis={situationData}
            competitors={brandData.competitors}
          />
        </div>

        {/* Tactics Section */}
        <div id="tactics">
          <TacticsSection
            brandId={brandId}
            strategy={strategy}
            objectives={objectives}
            budget={25000}
            teamSize={5}
          />
        </div>
      </div>
    </MirrorLayout>
  )
}
