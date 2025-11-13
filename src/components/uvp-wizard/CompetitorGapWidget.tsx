/**
 * Competitor Gap Widget
 * Shows messaging opportunities competitors are missing
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Target, TrendingUp, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CompetitorGap {
  id: string
  gap: string
  opportunity: string
  confidence: number
}

interface CompetitorGapWidgetProps {
  competitors?: string[]
  industry?: string
  className?: string
}

export const CompetitorGapWidget: React.FC<CompetitorGapWidgetProps> = ({
  competitors = [],
  industry = '',
  className
}) => {
  const [gaps, setGaps] = React.useState<CompetitorGap[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    // Generate competitor gaps based on industry
    generateGaps()
  }, [competitors, industry])

  const generateGaps = () => {
    setIsLoading(true)

    // Simulated gaps - in production, this would call an API
    const industryGaps: Record<string, CompetitorGap[]> = {
      'Real Estate': [
        {
          id: '1',
          gap: 'No competitors emphasize speed of response',
          opportunity: 'Position as the fastest-responding agency',
          confidence: 0.85
        },
        {
          id: '2',
          gap: 'Market lacks transparency in commission structure',
          opportunity: 'Be the first with clear, upfront pricing',
          confidence: 0.92
        }
      ],
      'default': [
        {
          id: '1',
          gap: 'Competitors focus on features, not outcomes',
          opportunity: 'Lead with transformation and results',
          confidence: 0.88
        },
        {
          id: '2',
          gap: 'No one addresses the emotional journey',
          opportunity: 'Connect with feelings, not just facts',
          confidence: 0.90
        }
      ]
    }

    setTimeout(() => {
      setGaps(industryGaps[industry] || industryGaps['default'])
      setIsLoading(false)
    }, 500)
  }

  if (!gaps.length && !isLoading) return null

  return (
    <Card className={cn('p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-sm">Competitive Messaging Gaps</h3>
        <Badge variant="secondary" className="text-xs">
          Opportunity
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-pulse text-sm text-muted-foreground">
            Analyzing competitor messaging...
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {gaps.map(gap => (
            <div key={gap.id} className="space-y-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{gap.gap}</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    {gap.opportunity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-6">
                <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${gap.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(gap.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {competitors.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Based on analysis of: {competitors.slice(0, 3).join(', ')}
            {competitors.length > 3 && ` +${competitors.length - 3} more`}
          </p>
        </div>
      )}
    </Card>
  )
}