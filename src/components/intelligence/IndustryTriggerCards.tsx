import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TriggerCard } from './TriggerCard'
import { IndustryIntelligenceService } from '@/services/intelligence/industry-intelligence'
import { CustomerTrigger } from '@/types/intelligence.types'
import { Sparkles, RefreshCw } from 'lucide-react'

interface IndustryTriggerCardsProps {
  industry: string
  onGenerateContent?: (trigger: CustomerTrigger) => void
  className?: string
}

export const IndustryTriggerCards: React.FC<IndustryTriggerCardsProps> = ({
  industry,
  onGenerateContent,
  className,
}) => {
  const [triggers, setTriggers] = React.useState<CustomerTrigger[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    loadTriggers()
  }, [industry])

  const loadTriggers = async () => {
    setIsLoading(true)
    try {
      const profile = await IndustryIntelligenceService.getIndustryProfile(industry)

      if (profile) {
        const activeTriggers = IndustryIntelligenceService.getActiveTriggers(profile, {
          month: new Date().getMonth(),
        })
        setTriggers(activeTriggers)
      }
    } catch (error) {
      console.error('Failed to load industry triggers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Industry Intelligence</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={loadTriggers} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : triggers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active triggers for {industry}
          </div>
        ) : (
          <div className="space-y-3">
            {triggers.map((trigger, index) => (
              <TriggerCard
                key={index}
                trigger={trigger}
                onGenerateContent={() => onGenerateContent?.(trigger)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
