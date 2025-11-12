import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { TrendAnalyzerService } from '@/services/intelligence/trend-analyzer'
import { OpportunityInsight } from '@/types/intelligence.types'
import {
  TrendingUp,
  TrendingDown,
  Search,
  AlertTriangle,
  Zap,
  X,
  ChevronRight,
  BarChart3,
  Globe,
} from 'lucide-react'

interface TrendingTopicsProps {
  brandId: string
  industry: string
  keywords: string[]
  onCreateContent?: (opportunity: OpportunityInsight) => void
}

export function TrendingTopics({
  brandId,
  industry,
  keywords,
  onCreateContent,
}: TrendingTopicsProps) {
  const [opportunities, setOpportunities] = useState<OpportunityInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    detectTrends()
  }, [brandId, industry, keywords])

  const detectTrends = async () => {
    try {
      setLoading(true)
      setError(null)

      const opps = await TrendAnalyzerService.detectTrendingTopics({
        brandId,
        industry,
        keywords,
      })

      setOpportunities(opps)
    } catch (err) {
      setError('Failed to detect trending topics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const dismissOpportunity = (id: string) => {
    setOpportunities(opportunities.filter((o) => o.id !== id))
  }

  const getGrowthColor = (growthRate: number) => {
    if (growthRate >= 300) return 'text-red-500'
    if (growthRate >= 150) return 'text-orange-500'
    if (growthRate >= 75) return 'text-amber-500'
    return 'text-green-500'
  }

  const getUrgencyVariant = (urgency: OpportunityInsight['urgency']) => {
    switch (urgency) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
          <CardDescription>
            No significant trending topics detected for your industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>We're monitoring trends. You'll be notified when relevant topics spike.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
          <Badge variant="secondary" className="ml-auto">
            {opportunities.length} Trending
          </Badge>
        </CardTitle>
        <CardDescription>
          Rising search interest in your industry - capture traffic now
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opportunity) => {
            const growthRate = opportunity.source_data.growth_rate || 0
            const searchVolume = opportunity.source_data.search_volume || 0
            const relatedQueries = opportunity.source_data.related_queries || []
            const trendingDuration = opportunity.source_data.trending_duration || 'emerging'

            return (
              <div
                key={opportunity.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        growthRate >= 300
                          ? 'bg-red-100'
                          : growthRate >= 150
                          ? 'bg-orange-100'
                          : 'bg-green-100'
                      }`}
                    >
                      <TrendingUp
                        className={`h-5 w-5 ${getGrowthColor(growthRate)}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        {opportunity.source_data.keyword}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getUrgencyVariant(opportunity.urgency)} className="text-xs">
                          {opportunity.urgency}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          +{growthRate}% growth
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {trendingDuration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dismissOpportunity(opportunity.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Growth Visualization */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Search Interest Growth</span>
                    <span className={getGrowthColor(growthRate)}>
                      +{growthRate}%
                    </span>
                  </div>
                  <Progress value={Math.min(growthRate / 5, 100)} className="h-2" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Search Volume</div>
                    <div className="text-sm font-semibold">
                      {searchVolume.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Relevance</div>
                    <div className="text-sm font-semibold">
                      {Math.round(
                        ((opportunity.source_data.relevance_to_brand || 70) / 100) * 100
                      )}
                      %
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Impact Score</div>
                    <div className="text-sm font-semibold">{opportunity.impact_score}/100</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {opportunity.description}
                </p>

                {/* Related Queries */}
                {relatedQueries.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Related Searches
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {relatedQueries.slice(0, 4).map((query: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <Search className="h-3 w-3 mr-1" />
                          {query}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Actions */}
                {opportunity.suggested_actions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">
                      Content Opportunities
                    </h5>
                    {opportunity.suggested_actions.map((action, idx) => (
                      <div
                        key={idx}
                        className="bg-accent/30 rounded-md p-3 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">
                              {action.description}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {action.estimated_effort} effort
                          </Badge>
                        </div>

                        {/* Content Angles */}
                        {action.content_suggestions && action.content_suggestions.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">
                              Suggested Content Angles:
                            </div>
                            {action.content_suggestions.slice(0, 3).map((suggestion, sidx) => (
                              <div
                                key={sidx}
                                className="flex items-start gap-2 pl-6 text-xs"
                              >
                                <ChevronRight className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="flex justify-end pt-2">
                          <Button
                            size="sm"
                            onClick={() => onCreateContent?.(opportunity)}
                            className="h-8"
                          >
                            Create Content
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>Data from Google Trends</span>
          </div>
          <Button variant="link" size="sm" onClick={detectTrends} className="h-auto p-0">
            Refresh Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
