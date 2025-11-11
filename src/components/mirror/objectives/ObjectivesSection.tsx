import * as React from 'react'
import { GoalBuilder } from './GoalBuilder'
import { RecommendedGoals } from './RecommendedGoals'
import { CustomGoals } from './CustomGoals'
import { SOSTACObjective } from '@/services/mirror/objectives-generator'
import { MirrorSectionHeader } from '@/components/layouts/MirrorLayout'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface ObjectivesSectionProps {
  brandId: string
  situationData: { brandHealth: number; industry: string; currentMetrics: Record<string, number> }
  className?: string
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({
  brandId,
  situationData,
  className,
}) => {
  const [goals, setGoals] = React.useState<SOSTACObjective[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    loadGoals()
  }, [brandId])

  const loadGoals = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('sostac_objectives')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'active')

      if (!error && data) {
        setGoals(data as SOSTACObjective[])
      }
    } catch (error) {
      console.error('Failed to load goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveGoal = async (objective: SOSTACObjective) => {
    try {
      const { error } = await supabase.from('sostac_objectives').insert({
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
        .from('sostac_objectives')
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
        .from('sostac_objectives')
        .update({ status: newStatus })
        .eq('id', id)

      if (!error) {
        await loadGoals()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  return (
    <div className={className}>
      <MirrorSectionHeader
        title="Objectives"
        description="Set SMART goals and track progress towards your targets"
        badge={<span className="text-xs">SOSTAC Analysis</span>}
        actions={
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Ask Marbs
          </Button>
        }
      />

      <div className="container py-6 px-6 space-y-6">
        {/* Recommended Goals */}
        <RecommendedGoals
          situationData={situationData}
          onAccept={handleSaveGoal}
        />

        {/* Goal Builder */}
        <GoalBuilder onSave={handleSaveGoal} />

        {/* Active Goals */}
        <CustomGoals
          goals={goals}
          onDelete={handleDeleteGoal}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  )
}
