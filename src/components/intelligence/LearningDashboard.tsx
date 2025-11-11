import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LearningPattern } from '@/types/intelligence.types'
import { LearningEngineService } from '@/services/intelligence/learning-engine'
import { Brain, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react'

interface LearningDashboardProps {
  brandId: string
  className?: string
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  brandId,
  className,
}) => {
  const [patterns, setPatterns] = React.useState<LearningPattern[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    loadPatterns()
  }, [brandId])

  const loadPatterns = async () => {
    setIsLoading(true)
    try {
      const detected = await LearningEngineService.detectPatterns(brandId)
      setPatterns(detected)
    } catch (error) {
      console.error('Failed to load patterns:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>Learning Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Analyzing patterns...
          </div>
        ) : patterns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Not enough data to detect patterns yet
          </div>
        ) : (
          patterns.map((pattern) => (
            <Card key={pattern.id} className="p-4 border-l-4 border-l-primary">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">{pattern.description}</h4>
                  <Badge variant="secondary">
                    {Math.round(pattern.confidence_score * 100)}% confident
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Key Insights:
                  </div>
                  {pattern.key_insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Recommended Actions:
                  </div>
                  {pattern.recommended_actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <TrendingUp className="h-3 w-3" />
                  <span>
                    Expected {pattern.impact_estimate.expected_improvement}% improvement
                    in {pattern.impact_estimate.metric.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
