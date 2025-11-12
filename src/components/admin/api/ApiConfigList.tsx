import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApiConfig, ApiProvider } from '@/types/api-admin.types'
import {
  Edit,
  Trash2,
  CheckCircle2,
  PlayCircle,
  Search,
  Filter,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ApiConfigListProps {
  configs: ApiConfig[]
  loading?: boolean
  onEdit?: (config: ApiConfig) => void
  onDelete?: (configId: string) => void
  onTest?: (configId: string) => void
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

export const ApiConfigList: React.FC<ApiConfigListProps> = ({
  configs,
  loading = false,
  onEdit,
  onDelete,
  onTest,
  className,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [providerFilter, setProviderFilter] = React.useState<string>('all')

  // Calculate usage stats
  const getUsageStats = (config: ApiConfig) => {
    // This would normally come from the ApiBillingTracker service
    // Placeholder data for now
    return {
      totalRequests: 0,
      totalCost: 0,
    }
  }

  // Filter configs
  const filteredConfigs = React.useMemo(() => {
    return configs.filter((config) => {
      const matchesSearch =
        config.api_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        PROVIDER_LABELS[config.provider]
          .toLowerCase()
          .includes(searchQuery.toLowerCase())

      const matchesProvider =
        providerFilter === 'all' || config.provider === providerFilter

      return matchesSearch && matchesProvider
    })
  }, [configs, searchQuery, providerFilter])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading API configurations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Configurations</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredConfigs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {searchQuery || providerFilter !== 'all'
              ? 'No APIs match your filters'
              : 'No API configurations found'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>API Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Total Requests</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConfigs.map((config) => {
                const stats = getUsageStats(config)
                return (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {PROVIDER_ICONS[config.provider]}
                        </span>
                        <span className="font-medium">
                          {PROVIDER_LABELS[config.provider]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{config.api_name}</div>
                        {config.is_test_mode && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Test Mode
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={config.is_active ? 'success' : 'secondary'}
                      >
                        {config.is_active ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Active
                          </>
                        ) : (
                          'Inactive'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {config.last_used_at
                        ? formatDistanceToNow(new Date(config.last_used_at), {
                            addSuffix: true,
                          })
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {stats.totalRequests.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${stats.totalCost.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {onTest && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onTest(config.id)}
                            title="Test Connection"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(config)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(config.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
