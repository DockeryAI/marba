import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { RefreshCw, Sparkles, Filter } from 'lucide-react'
import { OpportunityCard } from './OpportunityCard'
import { OpportunityDetector } from '@/services/intelligence/opportunity-detector'
import { OpportunityInsight } from '@/types/intelligence.types'
import { generateContent } from '@/lib/openrouter'
import { cn } from '@/lib/utils'

interface OpportunityDashboardProps {
  brandId: string
  industry?: string
  location?: string
  className?: string
}

export const OpportunityDashboard: React.FC<OpportunityDashboardProps> = ({
  brandId,
  industry,
  location,
  className,
}) => {
  const [opportunities, setOpportunities] = React.useState<OpportunityInsight[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'critical' | 'high'>(
    'all'
  )

  // Load opportunities on mount
  React.useEffect(() => {
    loadOpportunities()
  }, [brandId, industry, location])

  const loadOpportunities = async () => {
    setIsLoading(true)
    try {
      // Try to get from database first
      const existingOpps = await OpportunityDetector.getActiveOpportunities(
        brandId
      )

      if (existingOpps.length > 0) {
        setOpportunities(existingOpps)
      } else {
        // Generate new opportunities
        const newOpps = await OpportunityDetector.detectOpportunities({
          brandId,
          industry,
          location,
        })
        setOpportunities(newOpps)

        // Save to database
        for (const opp of newOpps) {
          await OpportunityDetector.saveOpportunity(opp)
        }
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = async (opportunityId: string) => {
    await OpportunityDetector.dismissOpportunity(opportunityId)
    setOpportunities((prev) =>
      prev.filter((opp) => opp.id !== opportunityId)
    )
  }

  const handleTakeAction = async (
    opportunity: OpportunityInsight,
    actionIndex: number
  ) => {
    const action = opportunity.suggested_actions[actionIndex]

    if (!action) return

    try {
      // Mark as actioned
      await OpportunityDetector.markAsActioned(opportunity.id)

      // If action is content creation, generate content
      if (action.action_type === 'create_content') {
        const contentSuggestion = action.content_suggestions?.[0] || action.description

        // Call content generation
        const content = await generateContent({
          platform: 'linkedin',
          contentType: 'post',
          topic: contentSuggestion,
          tone: 'professional',
          mode: 'marba',
          context: {
            opportunity: opportunity.title,
            urgency: opportunity.urgency,
          },
        })

        // TODO: Navigate to content calendar with generated content
        console.log('Generated content:', content)
      }

      // Remove from list
      setOpportunities((prev) =>
        prev.filter((opp) => opp.id !== opportunity.id)
      )
    } catch (error) {
      console.error('Failed to take action:', error)
    }
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'critical') return opp.urgency === 'critical'
    if (activeFilter === 'high')
      return opp.urgency === 'critical' || opp.urgency === 'high'
    return true
  })

  const criticalCount = opportunities.filter(
    (opp) => opp.urgency === 'critical'
  ).length
  const highCount = opportunities.filter(
    (opp) => opp.urgency === 'critical' || opp.urgency === 'high'
  ).length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Opportunity Dashboard</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time marketing opportunities detected from multiple signals
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadOpportunities}
          disabled={isLoading}
        >
          <RefreshCw
            className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')}
          />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-2xl font-bold">{opportunities.length}</div>
          <div className="text-xs text-muted-foreground">Total Opportunities</div>
        </div>
        <div className="p-4 rounded-lg border bg-destructive/5 border-destructive/20">
          <div className="text-2xl font-bold text-destructive">
            {criticalCount}
          </div>
          <div className="text-xs text-muted-foreground">Critical</div>
        </div>
        <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
          <div className="text-2xl font-bold text-orange-600">
            {highCount}
          </div>
          <div className="text-xs text-muted-foreground">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {opportunities.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="critical">
            Critical
            <Badge variant="destructive" className="ml-2">
              {criticalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="high">
            High Priority
            <Badge variant="secondary" className="ml-2">
              {highCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="mt-4 space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>Scanning for opportunities...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredOpportunities.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">No opportunities found</p>
              <p className="text-sm">
                {activeFilter === 'all'
                  ? 'Check back later for new opportunities'
                  : `No ${activeFilter} priority opportunities at this time`}
              </p>
            </div>
          )}

          {/* Opportunities Grid */}
          {!isLoading && filteredOpportunities.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onDismiss={() => handleDismiss(opportunity.id)}
                  onTakeAction={(actionIndex) =>
                    handleTakeAction(opportunity, actionIndex)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
