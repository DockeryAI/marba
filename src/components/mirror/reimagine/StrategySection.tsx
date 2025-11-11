import * as React from 'react'
import { BrandStrategy } from './BrandStrategy'
import { AudienceStrategy } from './AudienceStrategy'
import { ContentStrategy } from './ContentStrategy'
import { CompetitiveStrategy } from './CompetitiveStrategy'
import { MirrorSectionHeader } from '@/components/layouts/MirrorLayout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StrategyBuilder, MarketingStrategy } from '@/services/mirror/strategy-builder'
import { supabase } from '@/lib/supabase'
import { Sparkles, Target, Users, FileText, Swords } from 'lucide-react'

interface StrategySectionProps {
  brandId: string
  brandData: any
  objectives: any[]
  situationAnalysis: any
  competitors: any[]
  className?: string
}

export const StrategySection: React.FC<StrategySectionProps> = ({
  brandId,
  brandData,
  objectives,
  situationAnalysis,
  competitors,
  className,
}) => {
  const [strategy, setStrategy] = React.useState<Partial<MarketingStrategy>>({})
  const [personas, setPersonas] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('brand')

  React.useEffect(() => {
    loadStrategy()
  }, [brandId])

  React.useEffect(() => {
    if (brandData && objectives.length > 0 && Object.keys(strategy).length === 0) {
      generateFullStrategy()
    }
  }, [brandData, objectives])

  const loadStrategy = async () => {
    setIsLoading(true)
    try {
      // Load saved strategy from database
      const { data, error } = await supabase
        .from('marketing_strategies')
        .select('*')
        .eq('brand_id', brandId)
        .single()

      if (!error && data) {
        setStrategy(data.strategy_data)
        if (data.strategy_data.audience_strategy?.primary_personas) {
          setPersonas(data.strategy_data.audience_strategy.primary_personas)
        }
      }
    } catch (error) {
      console.error('Failed to load strategy:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateFullStrategy = async () => {
    setIsLoading(true)
    try {
      const fullStrategy = StrategyBuilder.generateStrategy({
        brandData,
        objectives,
        situationAnalysis,
        competitors,
      })

      setStrategy(fullStrategy)
      if (fullStrategy.audience_strategy?.primary_personas) {
        setPersonas(fullStrategy.audience_strategy.primary_personas)
      }
    } catch (error) {
      console.error('Failed to generate strategy:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveBrandStrategy = async (brandStrategyData: any) => {
    try {
      const updatedStrategy = {
        ...strategy,
        brand_strategy: {
          ...strategy.brand_strategy,
          ...brandStrategyData,
        },
      }

      const { error } = await supabase
        .from('marketing_strategies')
        .upsert({
          brand_id: brandId,
          strategy_data: updatedStrategy,
          updated_at: new Date().toISOString(),
        })

      if (!error) {
        setStrategy(updatedStrategy)
      }
    } catch (error) {
      console.error('Failed to save brand strategy:', error)
    }
  }

  const handleSaveAudienceStrategy = async (audienceStrategyData: any) => {
    try {
      const updatedStrategy = {
        ...strategy,
        audience_strategy: {
          ...strategy.audience_strategy,
          ...audienceStrategyData,
        },
      }

      const { error } = await supabase
        .from('marketing_strategies')
        .upsert({
          brand_id: brandId,
          strategy_data: updatedStrategy,
          updated_at: new Date().toISOString(),
        })

      if (!error) {
        setStrategy(updatedStrategy)
      }
    } catch (error) {
      console.error('Failed to save audience strategy:', error)
    }
  }

  const handleSaveContentStrategy = async (contentStrategyData: any) => {
    try {
      const updatedStrategy = {
        ...strategy,
        content_strategy: {
          ...strategy.content_strategy,
          ...contentStrategyData,
        },
      }

      const { error } = await supabase
        .from('marketing_strategies')
        .upsert({
          brand_id: brandId,
          strategy_data: updatedStrategy,
          updated_at: new Date().toISOString(),
        })

      if (!error) {
        setStrategy(updatedStrategy)
      }
    } catch (error) {
      console.error('Failed to save content strategy:', error)
    }
  }

  const handleSaveCompetitiveStrategy = async (competitiveStrategyData: any) => {
    try {
      const updatedStrategy = {
        ...strategy,
        competitive_strategy: {
          ...strategy.competitive_strategy,
          ...competitiveStrategyData,
        },
      }

      const { error } = await supabase
        .from('marketing_strategies')
        .upsert({
          brand_id: brandId,
          strategy_data: updatedStrategy,
          updated_at: new Date().toISOString(),
        })

      if (!error) {
        setStrategy(updatedStrategy)
      }
    } catch (error) {
      console.error('Failed to save competitive strategy:', error)
    }
  }

  return (
    <div className={className}>
      <MirrorSectionHeader
        title="Strategy"
        description="Define your positioning, audience, content, and competitive approach"
        badge={<span className="text-xs">MIRROR Analysis</span>}
        actions={
          <Button size="sm" onClick={generateFullStrategy} disabled={isLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Regenerate All'}
          </Button>
        }
      />

      <div className="container py-6 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brand" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Brand
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="competitive" className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              Competitive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="mt-6">
            <BrandStrategy
              brandData={brandData}
              objectives={objectives}
              onSave={handleSaveBrandStrategy}
            />
          </TabsContent>

          <TabsContent value="audience" className="mt-6">
            <AudienceStrategy
              brandData={brandData}
              objectives={objectives}
              situationAnalysis={situationAnalysis}
              onSave={handleSaveAudienceStrategy}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentStrategy
              personas={personas}
              objectives={objectives}
              onSave={handleSaveContentStrategy}
            />
          </TabsContent>

          <TabsContent value="competitive" className="mt-6">
            <CompetitiveStrategy
              brandData={brandData}
              competitors={competitors}
              industry={brandData.industry || 'Technology'}
              onSave={handleSaveCompetitiveStrategy}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
