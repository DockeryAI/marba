import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BrandHealthScore } from '@/services/mirror/situation-analyzer'
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface BrandHealthCardProps {
  health: BrandHealthScore
  hotSpots: string[]
  attentionNeeded: string[]
  industryAverage?: number
  className?: string
}

export const BrandHealthCard: React.FC<BrandHealthCardProps> = ({
  health,
  hotSpots,
  attentionNeeded,
  industryAverage = 65,
  className,
}) => {
  const scoreColor = health.overall >= 75 ? 'text-green-600' : health.overall >= 60 ? 'text-orange-600' : 'text-red-600'

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Brand Health</CardTitle>
          <Badge variant={health.overall >= industryAverage ? 'success' : 'warning'}>
            {health.overall >= industryAverage ? 'Above' : 'Below'} Industry Avg
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score Gauge */}
        <div className="text-center space-y-2">
          <div className={`text-6xl font-bold ${scoreColor}`}>{health.overall}</div>
          <div className="text-sm text-muted-foreground">Overall Health Score</div>
          <div className="text-xs text-muted-foreground">
            Industry Average: {industryAverage}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <MetricBar label="Clarity" value={health.clarity} />
          <MetricBar label="Consistency" value={health.consistency} />
          <MetricBar label="Engagement" value={health.engagement} />
          <MetricBar label="Differentiation" value={health.differentiation} />
        </div>

        {/* Hot Spots */}
        {hotSpots.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Hot Spots</span>
            </div>
            <div className="space-y-1">
              {hotSpots.map((spot, i) => (
                <div key={i} className="text-sm text-muted-foreground pl-6">
                  • {spot}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attention Needed */}
        {attentionNeeded.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span>Attention Needed</span>
            </div>
            <div className="space-y-1">
              {attentionNeeded.map((item, i) => (
                <div key={i} className="text-sm text-muted-foreground pl-6">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const MetricBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
)
