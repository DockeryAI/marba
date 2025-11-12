import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { ApiBillingStats } from '@/types/api-admin.types'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  AlertTriangle,
} from 'lucide-react'

interface ApiBillingDashboardProps {
  stats: ApiBillingStats
  loading?: boolean
  className?: string
}

export const ApiBillingDashboard: React.FC<ApiBillingDashboardProps> = ({
  stats,
  loading = false,
  className,
}) => {
  const budgetPercentage = (stats.current_month_cost / (stats.budget_utilization * stats.current_month_cost / 100)) * 100
  const isOverBudget = stats.budget_utilization > 100
  const isNearBudget = stats.budget_utilization > 80 && stats.budget_utilization <= 100

  if (loading) {
    return (
      <div className={className}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Current Month Cost */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Month Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.current_month_cost.toFixed(2)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.cost_trend_percentage >= 0 ? (
                  <>
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    <span className="text-green-600">
                      +{stats.cost_trend_percentage.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                    <span className="text-red-600">
                      {stats.cost_trend_percentage.toFixed(1)}%
                    </span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests This Month
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_requests_this_month.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.requests_trend_percentage >= 0 ? (
                  <>
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    <span className="text-green-600">
                      +{stats.requests_trend_percentage.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                    <span className="text-red-600">
                      {stats.requests_trend_percentage.toFixed(1)}%
                    </span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Average Cost Per Day */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Cost Per Day</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.average_cost_per_day.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Daily average spend</p>
            </CardContent>
          </Card>

          {/* Projected Month End Cost */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projected Month End
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.projected_month_end_cost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on current trends
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress & Top Items */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Budget Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cost vs Budget</CardTitle>
                {isOverBudget && (
                  <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Over Budget
                  </Badge>
                )}
                {isNearBudget && (
                  <Badge variant="warning">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Near Limit
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget Utilization</span>
                  <span className="font-medium">
                    {stats.budget_utilization.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(stats.budget_utilization, 100)}
                  className="h-2"
                />
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Spend:</span>
                  <span className="font-mono">
                    ${stats.current_month_cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projected:</span>
                  <span className="font-mono">
                    ${stats.projected_month_end_cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-medium">Budget Limit:</span>
                  <span className="font-mono font-medium">
                    ${(stats.current_month_cost / stats.budget_utilization * 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Lists */}
          <div className="space-y-4">
            {/* Top Expensive APIs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top 3 Most Expensive APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.top_expensive_apis.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  ) : (
                    stats.top_expensive_apis.map((api, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-6 w-6 justify-center p-0">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{api.api_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-muted-foreground">
                            ${api.cost.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({api.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Used Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top 3 Most Used Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.top_used_features.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  ) : (
                    stats.top_used_features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-6 w-6 justify-center p-0">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{feature.feature_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {feature.uses.toLocaleString()} uses
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            ${feature.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
