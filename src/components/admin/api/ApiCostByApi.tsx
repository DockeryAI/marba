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
import type { ApiCostByApi, ApiProvider } from '@/types/api-admin.types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ApiCostByApiProps {
  data: ApiCostByApi[]
  loading?: boolean
  showChart?: boolean
  className?: string
}

const PROVIDER_LABELS: Record<ApiProvider, string> = {
  openrouter: 'OpenRouter',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  tiktok: 'TikTok',
  google: 'Google',
  other: 'Other',
}

const PROVIDER_ICONS: Record<ApiProvider, string> = {
  openrouter: '🤖',
  facebook: '📘',
  instagram: '📷',
  linkedin: '💼',
  twitter: '🐦',
  tiktok: '🎵',
  google: '🔍',
  other: '🔧',
}

export const ApiCostByApi: React.FC<ApiCostByApiProps> = ({
  data,
  loading = false,
  showChart = true,
  className,
}) => {
  const totalCost = React.useMemo(
    () => data?.reduce((sum, item) => sum + item.total_cost, 0) || 0,
    [data]
  )

  const totalRequests = React.useMemo(
    () => data?.reduce((sum, item) => sum + item.total_requests, 0) || 0,
    [data]
  )

  // Generate colors for chart segments
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
          <div className="text-muted-foreground">Loading API costs...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Pie Chart Visualization */}
        {showChart && data && data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution by API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bar chart representation */}
                <div className="space-y-2">
                  {data.slice(0, 8).map((item, index) => (
                    <div key={item.api_config_id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{PROVIDER_ICONS[item.provider]}</span>
                          <span className="font-medium">{item.api_name}</span>
                        </div>
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
                    <div key={item.api_config_id} className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded ${getColor(index)}`} />
                      <span className="truncate text-xs text-muted-foreground">
                        {item.api_name}
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
            <CardTitle>API Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {!data || data.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No API cost data available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider / API</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Avg Cost/Request</TableHead>
                    <TableHead className="text-right">Tokens Used</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.api_config_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{PROVIDER_ICONS[item.provider]}</span>
                          <div>
                            <div className="font-medium">{item.api_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {PROVIDER_LABELS[item.provider]}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.total_requests.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${item.total_cost.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${item.average_cost_per_request.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.total_tokens
                          ? item.total_tokens.toLocaleString()
                          : '-'}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Summary */}
            {data && data.length > 0 && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Requests:</span>
                  <span className="font-mono font-medium">
                    {totalRequests.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Cost:</span>
                  <span className="font-mono font-medium">
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Avg Cost/Request:</span>
                  <span className="font-mono font-medium">
                    ${(totalCost / totalRequests).toFixed(4)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
