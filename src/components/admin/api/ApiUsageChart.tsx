import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApiUsageDataPoint } from '@/types/api-admin.types'
import { Download, Calendar } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface ApiUsageChartProps {
  data: ApiUsageDataPoint[]
  loading?: boolean
  onExportCSV?: () => void
  className?: string
}

type ViewMode = 'daily' | 'weekly' | 'monthly'
type MetricType = 'cost' | 'requests' | 'both'

export const ApiUsageChart: React.FC<ApiUsageChartProps> = ({
  data,
  loading = false,
  onExportCSV,
  className,
}) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>('daily')
  const [metricType, setMetricType] = React.useState<MetricType>('both')

  // Aggregate data based on view mode
  const aggregatedData = React.useMemo(() => {
    if (viewMode === 'daily') {
      return data
    }

    // For weekly/monthly, group data points
    const grouped: Record<string, ApiUsageDataPoint> = {}

    data.forEach((point) => {
      const date = parseISO(point.date)
      let key: string

      if (viewMode === 'weekly') {
        // Group by week
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = format(weekStart, 'yyyy-MM-dd')
      } else {
        // Group by month
        key = format(date, 'yyyy-MM')
      }

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          cost: 0,
          requests: 0,
          tokens: 0,
        }
      }

      grouped[key].cost += point.cost
      grouped[key].requests += point.requests
      if (point.tokens) {
        grouped[key].tokens = (grouped[key].tokens || 0) + point.tokens
      }
    })

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date))
  }, [data, viewMode])

  // Format data for chart
  const chartData = React.useMemo(() => {
    return aggregatedData.map((point) => ({
      date: format(parseISO(point.date), viewMode === 'daily' ? 'MMM dd' : 'MMM dd, yyyy'),
      cost: parseFloat(point.cost.toFixed(2)),
      requests: point.requests,
      tokens: point.tokens || 0,
    }))
  }, [aggregatedData, viewMode])

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
              <span className="font-mono font-medium">
                {entry.name === 'Cost'
                  ? `$${entry.value.toFixed(2)}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (onExportCSV) {
      onExportCSV()
      return
    }

    // Default CSV export
    const headers = ['Date', 'Cost', 'Requests', 'Tokens']
    const rows = aggregatedData.map((point) => [
      point.date,
      point.cost.toFixed(2),
      point.requests.toString(),
      (point.tokens || 0).toString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-usage-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading usage data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Usage Trends</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <SelectTrigger className="w-32">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={metricType}
              onValueChange={(value) => setMetricType(value as MetricType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="cost">Cost Only</SelectItem>
                <SelectItem value="requests">Requests Only</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No usage data available for the selected period
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'hsl(var(--muted))' }}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'hsl(var(--muted))' }}
                  tickFormatter={(value) => `$${value}`}
                />
                {(metricType === 'both' || metricType === 'requests') && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {(metricType === 'both' || metricType === 'cost') && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cost"
                    name="Cost"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {(metricType === 'both' || metricType === 'requests') && (
                  <Line
                    yAxisId={metricType === 'both' ? 'right' : 'left'}
                    type="monotone"
                    dataKey="requests"
                    name="Requests"
                    stroke="hsl(var(--secondary-foreground))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary-foreground))' }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary Stats */}
        {chartData.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Cost</p>
              <p className="text-xl font-bold">
                ${aggregatedData.reduce((sum, point) => sum + point.cost, 0).toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Requests</p>
              <p className="text-xl font-bold">
                {aggregatedData
                  .reduce((sum, point) => sum + point.requests, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg Cost/{viewMode === 'daily' ? 'Day' : viewMode === 'weekly' ? 'Week' : 'Month'}</p>
              <p className="text-xl font-bold">
                ${(
                  aggregatedData.reduce((sum, point) => sum + point.cost, 0) /
                  aggregatedData.length
                ).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
