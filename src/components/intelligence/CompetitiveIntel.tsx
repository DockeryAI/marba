import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompetitiveIntelService } from '@/services/intelligence/competitive-intel'
import { CompetitorActivity, CompetitivePositioningAnalysis } from '@/types/intelligence.types'
import {
  Target,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  Activity,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompetitiveIntelProps {
  brandId: string
  competitorIds: string[]
  ourMessaging?: string
  onApplySuggestion?: (suggestion: string) => void
}

export function CompetitiveIntel({
  brandId,
  competitorIds,
  ourMessaging,
  onApplySuggestion,
}: CompetitiveIntelProps) {
  const [activities, setActivities] = useState<CompetitorActivity[]>([])
  const [analysis, setAnalysis] = useState<CompetitivePositioningAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('activity')

  useEffect(() => {
    loadCompetitiveIntel()
  }, [brandId, competitorIds])

  const loadCompetitiveIntel = async () => {
    try {
      setLoading(true)
      setError(null)

      // Monitor competitor activity
      const opportunities = await CompetitiveIntelService.monitorCompetitors({
        brandId,
        competitorIds,
        monitoringPlatforms: ['facebook', 'instagram', 'linkedin', 'twitter'],
        industry: 'services',
      })

      // Extract activities from opportunities
      const acts = opportunities
        .map((opp) => ({
          id: opp.id,
          competitor_id: opp.source_data.competitor?.id || competitorIds[0],
          competitor_name: opp.source_data.competitor?.name || 'Competitor',
          activity_type: opp.source_data.activity_type || 'content',
          description: opp.description,
          platform: opp.source_data.platform,
          engagement_metrics: opp.source_data.engagement,
          sentiment: opp.source_data.sentiment || 'neutral',
          threat_level: opp.urgency === 'critical' ? 'critical' : opp.urgency as any,
          opportunity_level: opp.impact_score > 70 ? 'high' : 'medium' as any,
          recommended_response: opp.suggested_actions.map((a) => a.description),
          detected_at: opp.created_at,
        }))

      setActivities(acts as CompetitorActivity[])

      // Load positioning analysis if we have messaging
      if (ourMessaging && competitorIds.length > 0) {
        // This would call the actual analysis - for now we'll skip to avoid errors
        // const posAnalysis = await CompetitiveIntelService.analyzePositioning(
        //   brandId,
        //   competitorIds[0],
        //   ourMessaging,
        //   'Competitor messaging here'
        // )
        // setAnalysis(posAnalysis)
      }
    } catch (err) {
      setError('Failed to load competitive intelligence')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getThreatColor = (level: CompetitorActivity['threat_level']) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product_launch':
        return <Target className="h-4 w-4" />
      case 'campaign':
        return <TrendingUp className="h-4 w-4" />
      case 'content':
        return <Activity className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
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
          <Skeleton className="h-64 w-full" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Competitive Intelligence
          <Badge variant="secondary" className="ml-auto">
            {activities.length} Activities
          </Badge>
        </CardTitle>
        <CardDescription>
          Monitor competitor moves and identify positioning opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="positioning">Positioning Analysis</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No competitor activity detected recently</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded border', getThreatColor(activity.threat_level))}>
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {activity.competitor_name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activity.activity_type.replace('_', ' ')} · {' '}
                          {new Date(activity.detected_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={activity.threat_level === 'critical' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {activity.threat_level} threat
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.opportunity_level} opportunity
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm">{activity.description}</p>

                  {/* Engagement Metrics */}
                  {activity.engagement_metrics && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{activity.engagement_metrics.likes.toLocaleString()} likes</span>
                      <span>{activity.engagement_metrics.comments.toLocaleString()} comments</span>
                      <span>{activity.engagement_metrics.shares.toLocaleString()} shares</span>
                      {activity.engagement_metrics.reach && (
                        <span>{activity.engagement_metrics.reach.toLocaleString()} reach</span>
                      )}
                    </div>
                  )}

                  {/* Recommended Responses */}
                  {activity.recommended_response.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase">
                        Recommended Response
                      </h5>
                      {activity.recommended_response.map((response, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-accent/30 rounded-md p-2"
                        >
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{response}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApplySuggestion?.(response)}
                            className="h-7"
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          {/* Positioning Analysis Tab */}
          <TabsContent value="positioning" className="space-y-4 mt-4">
            {!analysis ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  No positioning analysis available yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Add your messaging to enable competitive positioning analysis
                </p>
              </div>
            ) : (
              <>
                {/* Psychology Comparison */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">Psychology Score Comparison</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysis.psychology_comparison.our_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Our Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {analysis.psychology_comparison.their_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Their Score</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {analysis.psychology_comparison.gap_analysis.map((gap, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Our Strengths
                    </h4>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Positioning Gaps */}
                {analysis.positioning_gaps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Positioning Gaps</h4>
                    {analysis.positioning_gaps.map((gap, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{gap.gap}</h5>
                          <Badge
                            variant={
                              gap.severity === 'high'
                                ? 'destructive'
                                : gap.severity === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {gap.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {gap.opportunity_description}
                        </p>
                        <div className="flex items-center justify-between bg-accent/30 rounded-md p-2">
                          <span className="text-sm">{gap.suggested_adjustment}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApplySuggestion?.(gap.suggested_adjustment)}
                            className="h-7"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommended Pivots */}
                {analysis.recommended_pivots.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Recommended Strategic Pivots</h4>
                    {analysis.recommended_pivots.map((pivot, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">Current</div>
                            <div className="text-sm">{pivot.current_position}</div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">Suggested</div>
                            <div className="text-sm font-medium">{pivot.suggested_position}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span>
                            Impact: <strong>{pivot.expected_impact}%</strong>
                          </span>
                          <span>
                            Difficulty: <strong>{pivot.implementation_difficulty}</strong>
                          </span>
                        </div>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => onApplySuggestion?.(pivot.suggested_position)}
                          >
                            Apply This Pivot
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
