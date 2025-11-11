import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BenchmarkResult } from '@/services/intelligence/benchmarking'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface BenchmarkDisplayProps {
  benchmarks: BenchmarkResult[]
  overallScore?: number
  className?: string
}

export const BenchmarkDisplay: React.FC<BenchmarkDisplayProps> = ({
  benchmarks,
  overallScore,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Industry Benchmarks</span>
          {overallScore !== undefined && (
            <Badge variant={overallScore > 60 ? 'success' : overallScore > 40 ? 'warning' : 'destructive'}>
              {overallScore}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {benchmarks.map((benchmark) => (
          <div key={benchmark.metric} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {benchmark.metric.replace(/_/g, ' ')}
                </span>
                {benchmark.status === 'above' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {benchmark.status === 'below' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {benchmark.status === 'average' && <Minus className="h-4 w-4 text-gray-500" />}
              </div>
              <span className="text-muted-foreground">
                {benchmark.actualValue} vs {benchmark.industryAverage} avg
              </span>
            </div>
            <Progress value={benchmark.percentile} className="h-2" />
            <p className="text-xs text-muted-foreground">{benchmark.recommendation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
