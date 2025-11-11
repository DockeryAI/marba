import * as React from 'react'
import { MirrorLayout } from '@/components/layouts/MirrorLayout'
import { SituationSection } from '@/components/mirror/measure'
import { ObjectivesSection } from '@/components/mirror/intend'
import { StrategySection } from '@/components/mirror/reimagine'
import { TacticsSection } from '@/components/mirror/reach'
import { ActionSection } from '@/components/mirror/optimize'
import { ReflectSection } from '@/components/mirror/reflect'

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

  const [activeSection, setActiveSection] = React.useState('measure')
  const [objectives, setObjectives] = React.useState<any[]>([])
  const [strategy, setStrategy] = React.useState<any>({})
  const [tactics, setTactics] = React.useState<any[]>([])
  const [measureData, setMeasureData] = React.useState<any>({
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

  return (
    <MirrorLayout
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div className="space-y-12">
        {/* Measure Phase (formerly Situation) */}
        <div id="measure">
          <SituationSection
            brandId={brandId}
            brandData={brandData}
            onDataUpdate={setMeasureData}
          />
        </div>

        {/* Intend Phase (formerly Objectives) */}
        <div id="intend">
          <ObjectivesSection
            brandId={brandId}
            situationData={measureData}
          />
        </div>

        {/* Reimagine Phase (formerly Strategy) */}
        <div id="reimagine">
          <StrategySection
            brandId={brandId}
            brandData={brandData}
            objectives={objectives}
            situationAnalysis={measureData}
            competitors={brandData.competitors}
          />
        </div>

        {/* Reach Phase (formerly Tactics) */}
        <div id="reach">
          <TacticsSection
            brandId={brandId}
            strategy={strategy}
            objectives={objectives}
            budget={25000}
            teamSize={5}
          />
        </div>

        {/* Optimize Phase (formerly Action) */}
        <div id="optimize">
          <ActionSection
            tactics={tactics}
          />
        </div>

        {/* Reflect Phase (formerly Control) */}
        <div id="reflect">
          <ReflectSection
            objectives={objectives}
          />
        </div>
      </div>
    </MirrorLayout>
  )
}
