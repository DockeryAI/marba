import * as React from 'react'
import { GoalBuilder } from './GoalBuilder'
import { RecommendedGoals } from './RecommendedGoals'
import { CustomGoals } from './CustomGoals'
import { WWHFramework } from './WWHFramework'
import { UVPFlowSection } from '@/components/mirror/value/UVPFlowSection'
import { IntentObjective } from '@/services/mirror/objectives-generator'
import { MirrorSectionHeader } from '@/components/layouts/MirrorLayout'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, AlertCircle, Zap } from 'lucide-react'

interface IntendSectionProps {
  brandId: string
  situationData: { brandHealth: number; industry: string; currentMetrics: Record<string, number> }
  brandData?: any
  className?: string
}

export const IntendSection: React.FC<IntendSectionProps> = ({
  brandId,
  situationData,
  brandData,
  className,
}) => {
  const [goals, setGoals] = React.useState<IntentObjective[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    loadGoals()
  }, [brandId])

  const loadGoals = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('mirror_objectives')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'active')

      if (!error && data) {
        setGoals(data as IntentObjective[])
      }
    } catch (error) {
      // Table may not exist yet - silently handle
      console.log('Mirror objectives table not found - using default goals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveGoal = async (objective: IntentObjective) => {
    try {
      const { error } = await supabase.from('mirror_objectives').insert({
        ...objective,
        brand_id: brandId,
        created_at: new Date().toISOString(),
      })

      if (!error) {
        await loadGoals()
      }
    } catch (error) {
      console.error('Failed to save goal:', error)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mirror_objectives')
        .delete()
        .eq('id', id)

      if (!error) {
        await loadGoals()
      }
    } catch (error) {
      console.error('Failed to delete goal:', error)
    }
  }

  const handleToggleStatus = async (id: string) => {
    const goal = goals.find((g) => g.id === id)
    if (!goal) return

    const newStatus = goal.status === 'active' ? 'paused' : 'active'

    try {
      const { error } = await supabase
        .from('mirror_objectives')
        .update({ status: newStatus })
        .eq('id', id)

      if (!error) {
        await loadGoals()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleUpdateGoal = async (id: string, updates: Partial<IntentObjective>) => {
    try {
      const { error } = await supabase
        .from('mirror_objectives')
        .update(updates)
        .eq('id', id)

      if (!error) {
        await loadGoals()
      }
    } catch (error) {
      console.error('Failed to update goal:', error)
    }
  }

  return (
    <div className={className}>
      <MirrorSectionHeader
        title="Align"
        description="Set your direction — goals, results, and what success looks like"
        badge={<span className="text-xs">MARBA Analysis</span>}
        actions={
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Ask Marbs
          </Button>
        }
      />

      <div className="container py-6 px-6 space-y-8">
        {/* UVP Flow - MUST COMPLETE FIRST */}
        <section id="uvp-flow" className="scroll-mt-20">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-600 p-3 animate-pulse">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  Start Here: Define Your Value Proposition
                  <Badge variant="default" className="bg-blue-600">
                    Required
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your Unique Value Proposition (UVP) is the foundation of your entire marketing strategy.
                  It tells customers why they should choose you over competitors. Complete this first - it only takes 5 minutes -
                  then the rest of the MIRROR framework will unlock.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>You cannot proceed to Reimagine, Reach, Optimize, or Reflect until your UVP is defined.</span>
                </div>
              </div>
            </div>
          </div>

          <UVPFlowSection brandId={brandId} brandData={brandData} />
        </section>

        {/* Divider */}
        <div className="border-t border-dashed my-8" />

        {/* WWH Framework (Why, What, How) */}
        <section id="wwh-framework" className="scroll-mt-20">
          <WWHFramework brandData={brandData} />
        </section>

        {/* Recommended Goals */}
        <RecommendedGoals
          situationData={situationData}
          onAccept={handleSaveGoal}
        />

        {/* Goal Builder */}
        <GoalBuilder onSave={handleSaveGoal} brandData={brandData} />

        {/* Active Goals */}
        <CustomGoals
          goals={goals}
          onDelete={handleDeleteGoal}
          onToggleStatus={handleToggleStatus}
          onUpdate={handleUpdateGoal}
          brandData={brandData}
        />
      </div>
    </div>
  )
}
