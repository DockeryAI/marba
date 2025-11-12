import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ApiCostByFeature } from '@/types/api-admin.types'
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'

interface ApiCostByFeatureProps {
  data: ApiCostByFeature[]
  loading?: boolean
  showChart?: boolean
  className?: string
}

export const ApiCostByFeatureComponent: React.FC<ApiCostByFeatureProps> = ({
  data,
  loading = false,
  showChart = true,
  className,
}) => {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  const toggleRow = (featureName: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(featureName)) {
        next.delete(featureName)
      } else {
        next.add(featureName)
      }
      return next
    })
  }

  const totalCost = React.useMemo(
    () => data.reduce((sum, item) => sum + item.total_cost, 0),
    [data]
  )

  // Generate colors for pie chart segments
  const getColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500',
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading feature costs...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Pie Chart Visualization */}
        {showChart && data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution by Feature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple bar chart representation */}
                <div className="space-y-2">
                  {data.slice(0, 8).map((item, index) => (
                    <div key={item.feature_name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.feature_name}</span>
                        <span className="text-muted-foreground">
                          ${item.total_cost.toFixed(2)} ({item.percentage_of_total.toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full ${getColor(index)}`}
                          style={{ width: `${item.percentage_of_total}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 pt-4 md:grid-cols-4">
                  {data.slice(0, 8).map((item, index) => (
                    <div key={item.feature_name} className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded ${getColor(index)}`} />
                      <span className="truncate text-xs text-muted-foreground">
                        {item.feature_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No feature cost data available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-right">Total Uses</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Avg Cost/Use</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => {
                    const isExpanded = expandedRows.has(item.feature_name)
                    return (
                      <React.Fragment key={item.feature_name}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => toggleRow(item.feature_name)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.feature_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.feature_category}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {item.total_uses.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${item.total_cost.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${item.average_cost_per_use.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {item.percentage_of_total.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.trend_percentage !== undefined && (
                              <div className="flex items-center justify-end gap-1">
                                {item.trend_percentage >= 0 ? (
                                  <>
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                    <span className="text-xs text-green-600">
                                      +{item.trend_percentage.toFixed(1)}%
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                    <span className="text-xs text-red-600">
                                      {item.trend_percentage.toFixed(1)}%
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.api_breakdown.length > 0 && (
                              <>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>

                        {/* Expanded API Breakdown */}
                        {isExpanded && item.api_breakdown.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/50 p-0">
                              <div className="px-4 py-3">
                                <div className="text-xs font-medium text-muted-foreground mb-2">
                                  API Breakdown:
                                </div>
                                <div className="space-y-1">
                                  {item.api_breakdown.map((api, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span>{api.api_name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {api.provider}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-4 font-mono text-xs">
                                        <span className="text-muted-foreground">
                                          {api.uses.toLocaleString()} uses
                                        </span>
                                        <span>${api.cost.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            {/* Summary */}
            {data.length > 0 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
                <span className="font-medium">Total:</span>
                <span className="font-mono font-medium">${totalCost.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
