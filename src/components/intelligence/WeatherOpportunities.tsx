import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherAlertsService } from '@/services/intelligence/weather-alerts'
import { OpportunityInsight } from '@/types/intelligence.types'
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Thermometer,
  AlertTriangle,
  TrendingUp,
  Zap,
  X,
  ChevronRight,
} from 'lucide-react'

interface WeatherOpportunitiesProps {
  brandId: string
  location: string
  industry: string
  onCreateContent?: (opportunity: OpportunityInsight) => void
}

export function WeatherOpportunities({
  brandId,
  location,
  industry,
  onCreateContent,
}: WeatherOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<OpportunityInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    detectOpportunities()
  }, [brandId, location, industry])

  const detectOpportunities = async () => {
    try {
      setLoading(true)
      setError(null)

      const opps = await WeatherAlertsService.detectWeatherOpportunities({
        brandId,
        location,
        industry,
      })

      setOpportunities(opps)
    } catch (err) {
      setError('Failed to detect weather opportunities')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const dismissOpportunity = (id: string) => {
    setOpportunities(opportunities.filter((o) => o.id !== id))
  }

  const getWeatherIcon = (type: string, sourceData: any) => {
    if (sourceData.temperature >= 90) return <Sun className="h-5 w-5 text-orange-500" />
    if (sourceData.temperature <= 32) return <CloudSnow className="h-5 w-5 text-blue-400" />
    if (sourceData.condition?.includes('rain') || sourceData.precipitation) {
      return <CloudRain className="h-5 w-5 text-blue-500" />
    }
    return <Cloud className="h-5 w-5 text-gray-400" />
  }

  const getUrgencyColor = (urgency: OpportunityInsight['urgency']) => {
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
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
            <Cloud className="h-5 w-5" />
            Weather Opportunities
          </CardTitle>
          <CardDescription>
            No weather-based opportunities detected for {location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sun className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Weather conditions are normal. We'll alert you when conditions change.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Opportunities
          <Badge variant="secondary" className="ml-auto">
            {opportunities.length} Active
          </Badge>
        </CardTitle>
        <CardDescription>
          Weather-based marketing opportunities for {location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getWeatherIcon(opportunity.type, opportunity.source_data)}
                  <div>
                    <h4 className="font-semibold text-sm">{opportunity.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getUrgencyColor(opportunity.urgency)} className="text-xs">
                        {opportunity.urgency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Impact: {opportunity.impact_score}/100
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Confidence: {Math.round(opportunity.confidence * 100)}%
                      </span>
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

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {opportunity.description}
              </p>

              {/* Weather Details */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                {opportunity.source_data.temperature && (
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span>{opportunity.source_data.temperature}°F</span>
                  </div>
                )}
                {opportunity.source_data.forecast_days && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span>{opportunity.source_data.forecast_days}-day forecast</span>
                  </div>
                )}
                {opportunity.expires_at && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>
                      Expires {new Date(opportunity.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Suggested Actions */}
              {opportunity.suggested_actions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase">
                    Suggested Actions
                  </h5>
                  {opportunity.suggested_actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="bg-accent/30 rounded-md p-3 space-y-2"
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

                      {/* Content Suggestions */}
                      {action.content_suggestions && action.content_suggestions.length > 0 && (
                        <div className="space-y-1 pl-6">
                          {action.content_suggestions.map((suggestion, sidx) => (
                            <div
                              key={sidx}
                              className="text-xs text-muted-foreground italic"
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex justify-end">
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
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" onClick={detectOpportunities}>
            Refresh Weather Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
