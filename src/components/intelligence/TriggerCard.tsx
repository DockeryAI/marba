import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomerTrigger } from '@/types/intelligence.types'
import { Sparkles, TrendingUp, Clock } from 'lucide-react'

interface TriggerCardProps {
  trigger: CustomerTrigger
  onGenerateContent?: () => void
}

const impactColors = {
  high: 'destructive' as const,
  medium: 'warning' as const,
  low: 'secondary' as const,
}

export const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  onGenerateContent,
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium mb-2">{trigger.trigger}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={impactColors[trigger.impact_level]}>
                {trigger.impact_level} impact
              </Badge>
              <Badge variant="outline">{trigger.category}</Badge>
            </div>
          </div>
        </div>

        {trigger.timing && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {trigger.timing}
          </div>
        )}

        {trigger.content_angles.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Content Angles:</div>
            <div className="flex flex-wrap gap-1">
              {trigger.content_angles.map((angle, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {angle}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {onGenerateContent && (
          <Button size="sm" variant="outline" className="w-full" onClick={onGenerateContent}>
            <Sparkles className="h-3 w-3 mr-2" />
            Generate Content
          </Button>
        )}
      </div>
    </Card>
  )
}
