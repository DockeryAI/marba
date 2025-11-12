import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { ApiCostProjection } from '@/types/api-admin.types'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Lightbulb,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { format, addDays } from 'date-fns'

interface ApiCostProjectionProps {
  projection: ApiCostProjection
  loading?: boolean
  className?: string
}

export const ApiCostProjectionComponent: React.FC<ApiCostProjectionProps> = ({
  projection,
  loading = false,
  className,
}) => {
  // Generate chart data for projection
  const chartData = React.useMemo(() => {
    const data = []
    const today = new Date()
    const totalDays = projection.days_elapsed + projection.days_remaining

    // Historical data (using daily average for simplicity)
    for (let i = 0; i < projection.days_elapsed; i++) {
      data.push({
        day: i + 1,
        date: format(addDays(today, i - projection.days_elapsed), 'MMM dd'),
        actual: (projection.current_month_cost / projection.days_elapsed) * (i + 1),
        projected: null,
      })
    }

    // Projected data
    for (let i = projection.days_elapsed; i <= totalDays; i++) {
      data.push({
        day: i + 1,
        date: format(addDays(today, i - projection.days_elapsed), 'MMM dd'),
        actual: i === projection.days_elapsed ? projection.current_month_cost : null,
        projected:
          projection.current_month_cost +
          projection.daily_average * (i - projection.days_elapsed),
      })
    }

    return data
  }, [projection])

  // Confidence indicator icon
  const ConfidenceIcon = () => {
    switch (projection.confidence_level) {
      case 'high':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
    }
  }

  // Trend icon
  const TrendIcon = () => {
    switch (projection.trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-600" />
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-600" />
    }
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null
    }

    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="mb-2 font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-mono font-medium">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading projection...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Main Projection Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cost Projection & Forecast</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    projection.will_exceed_budget
                      ? 'destructive'
                      : projection.projected_end_cost > projection.budget_limit * 0.9
                        ? 'warning'
                        : 'success'
                  }
                >
                  {projection.will_exceed_budget ? (
                    <>
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Will Exceed Budget
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Within Budget
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Current Cost</span>
                  </div>
                  <p className="text-2xl font-bold">
                    ${projection.current_month_cost.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendIcon />
                    <span>Daily Average</span>
                  </div>
                  <p className="text-2xl font-bold">
                    ${projection.daily_average.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Days Remaining</span>
                  </div>
                  <p className="text-2xl font-bold">{projection.days_remaining}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ConfidenceIcon />
                    <span>Confidence</span>
                  </div>
                  <p className="text-2xl font-bold capitalize">
                    {projection.confidence_level}
                  </p>
                </div>
              </div>

              {/* Projection Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fontSize: 11 }}
                      interval={Math.floor(chartData.length / 8)}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={projection.budget_limit}
                      stroke="hsl(var(--destructive))"
                      strokeDasharray="5 5"
                      label={{
                        value: 'Budget Limit',
                        position: 'right',
                        fill: 'hsl(var(--destructive))',
                        fontSize: 11,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Actual Cost"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      name="Projected Cost"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))' }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Projection Summary */}
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Projected Month-End Cost</span>
                  <span className="text-2xl font-bold">
                    ${projection.projected_end_cost.toFixed(2)}
                  </span>
                </div>

                <Progress
                  value={
                    (projection.projected_end_cost / projection.budget_limit) * 100
                  }
                  className="h-2"
                />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Budget Limit: ${projection.budget_limit.toFixed(2)}</span>
                  <span>
                    {projection.will_exceed_budget ? (
                      <span className="font-medium text-destructive">
                        Over by $
                        {(projection.projected_end_cost - projection.budget_limit).toFixed(
                          2
                        )}
                      </span>
                    ) : (
                      <span className="font-medium text-green-600">
                        Under by $
                        {(projection.budget_limit - projection.projected_end_cost).toFixed(
                          2
                        )}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        {projection.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-base">
                  Recommendations to Optimize Costs
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projection.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border bg-background p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-700">
                      {index + 1}
                    </div>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trend Insight */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <TrendIcon />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Cost Trend</p>
                <p className="text-sm text-muted-foreground">
                  {projection.trend === 'increasing' &&
                    'Your costs are trending upward. Consider implementing cost optimization strategies.'}
                  {projection.trend === 'stable' &&
                    'Your costs are stable and predictable. Continue monitoring for any changes.'}
                  {projection.trend === 'decreasing' &&
                    'Your costs are trending downward. Great job optimizing your API usage!'}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {projection.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
