/**
 * Learning Engine Widget
 * Displays what the AI has learned about content performance patterns
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, TrendingUp, TrendingDown, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react'

interface LearningEngineWidgetProps {
  brandId?: string
  className?: string
}

export function LearningEngineWidget({ brandId, className }: LearningEngineWidgetProps) {
  // In production, this would fetch from PatternAnalyzer + LearningEngine
  // For now, showing structure with sample data
  const lastUpdated = new Date()

  const provenWinners = [
    {
      pattern: 'Hook posts',
      multiplier: 3.8,
      confidence: 92,
      description: 'Posts starting with strong hooks get 3.8x more engagement'
    },
    {
      pattern: '"Emergency" keyword',
      multiplier: 2.3,
      confidence: 88,
      description: 'Content mentioning "emergency" gets 2.3x more clicks'
    },
    {
      pattern: 'Tuesday 10am posting',
      multiplier: 1.67,
      confidence: 85,
      description: 'Tuesday morning posts perform 67% better'
    }
  ]

  const avoidThese = [
    {
      pattern: 'Promotional posts',
      impact: -47,
      confidence: 88,
      description: 'Direct promotional content gets 47% less engagement'
    },
    {
      pattern: 'Friday posts',
      impact: -52,
      confidence: 82,
      description: 'Friday posts get 52% less reach on average'
    },
    {
      pattern: 'Posts over 200 words',
      impact: -38,
      confidence: 76,
      description: 'Long-form posts get 38% fewer reads'
    }
  ]

  const testing = [
    {
      pattern: 'Video posts',
      potential: 85,
      confidence: 42,
      description: 'Early data suggests video might boost engagement by 85%'
    },
    {
      pattern: 'Question format',
      potential: 120,
      confidence: 38,
      description: 'Questions in posts might increase comments by 120%'
    }
  ]

  const autoAdjustments = {
    contentMix: [
      { type: 'Hooks', percentage: 60 },
      { type: 'Social Proof', percentage: 25 },
      { type: 'Promotional', percentage: 15 }
    ],
    schedule: ['Tuesday 10am', 'Wednesday 2pm', 'Thursday 9am'],
    format: 'Short (<150 words), hook first, CTA, photo'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              What I've Learned
            </CardTitle>
            <CardDescription>
              AI-detected patterns from your content performance
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Proven Winners */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold">PROVEN WINNERS</h4>
          </div>
          <div className="space-y-2">
            {provenWinners.map((winner, index) => (
              <div
                key={index}
                className="rounded-lg border border-green-200 bg-green-50/50 dark:bg-green-950/20 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{winner.pattern}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">
                      {winner.multiplier}x
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {winner.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{winner.description}</p>
                <Progress value={winner.confidence} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Avoid These */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <h4 className="font-semibold">AVOID THESE</h4>
          </div>
          <div className="space-y-2">
            {avoidThese.map((avoid, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{avoid.pattern}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {avoid.impact}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {avoid.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{avoid.description}</p>
                <Progress value={avoid.confidence} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Testing Now */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold">TESTING NOW</h4>
          </div>
          <div className="space-y-2">
            {testing.map((test, index) => (
              <div
                key={index}
                className="rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{test.pattern}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      +{test.potential}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {test.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{test.description}</p>
                <div className="flex items-center gap-2">
                  <Progress value={test.confidence} className="h-1 flex-1" />
                  <span className="text-xs text-muted-foreground">Early data</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Adjusting Strategy */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">AUTO-ADJUSTING STRATEGY</h4>
          </div>

          <div className="rounded-lg bg-primary/5 p-4 space-y-3">
            {/* Content Mix */}
            <div>
              <div className="text-sm font-medium mb-2">Content Mix</div>
              <div className="space-y-2">
                {autoAdjustments.contentMix.map((mix, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{mix.type}</span>
                      <span className="font-semibold">{mix.percentage}%</span>
                    </div>
                    <Progress value={mix.percentage} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <div className="text-sm font-medium mb-2">Optimal Schedule</div>
              <div className="flex flex-wrap gap-2">
                {autoAdjustments.schedule.map((time, index) => (
                  <Badge key={index} variant="outline">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <div className="text-sm font-medium mb-1">Format</div>
              <p className="text-xs text-muted-foreground">{autoAdjustments.format}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{provenWinners.length}</div>
              <div className="text-xs text-muted-foreground">Proven Winners</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{avoidThese.length}</div>
              <div className="text-xs text-muted-foreground">Patterns to Avoid</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{testing.length}</div>
              <div className="text-xs text-muted-foreground">Active Tests</div>
            </div>
          </div>
        </div>

        {/* Learning Note */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          The AI continuously learns from your content performance and automatically adjusts recommendations.
          Confidence increases as more data is collected.
        </div>
      </CardContent>
    </Card>
  )
}
