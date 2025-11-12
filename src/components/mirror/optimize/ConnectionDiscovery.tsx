import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, Users, Target, ArrowRight, AlertCircle } from 'lucide-react'

interface Connection {
  id: string
  type: 'customer_trigger_market' | 'competitor_weakness_opportunity' | 'content_gap_trend' | 'archetype_channel'
  confidence: number
  insight: string
  data_points: Array<{
    source: string
    data: any
  }>
  suggested_actions: Array<{
    action: string
    priority: 'high' | 'medium' | 'low'
    impact: number
  }>
  created_at: string
}

interface ConnectionDiscoveryProps {
  brandData: any
}

export function ConnectionDiscovery({ brandData }: ConnectionDiscoveryProps) {
  const [connections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (brandData?.id) {
      discoverConnections()
    }
  }, [brandData?.id])

  const discoverConnections = async () => {
    if (!brandData) {
      setError('Brand data is required to discover connections')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // For now, show a helpful message since the full implementation requires additional setup
      // In production, this would call the ConnectionDiscoveryEngine

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Show helpful error with next steps
      throw new Error(
        'Connection Discovery requires OpenAI API key and additional data integrations. ' +
        'This feature discovers unexpected connections between your brand data, customer triggers, ' +
        'market trends, and opportunities to create breakthrough insights.'
      )

      // Production implementation would be:
      // const { ConnectionDiscoveryEngine } = await import('@/services/synapse/connections/ConnectionDiscoveryEngine')
      // const engine = new ConnectionDiscoveryEngine(process.env.OPENAI_API_KEY)
      // const result = await engine.findConnections(deepContext, {
      //   minBreakthroughScore: 0.7,
      //   maxConnections: 20
      // })
      // setConnections(result.connections.map(mapToUIConnection))

    } catch (err: any) {
      setError(err.message || 'Failed to discover connections')
      console.error('[ConnectionDiscovery] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'customer_trigger_market': return <Users className="h-5 w-5" />
      case 'competitor_weakness_opportunity': return <Target className="h-5 w-5" />
      case 'content_gap_trend': return <TrendingUp className="h-5 w-5" />
      case 'archetype_channel': return <Sparkles className="h-5 w-5" />
      default: return <Sparkles className="h-5 w-5" />
    }
  }

  const getConnectionColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800 border-green-200'
    if (confidence >= 0.7) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'customer_trigger_market': return 'Customer + Market'
      case 'competitor_weakness_opportunity': return 'Competitive Gap'
      case 'content_gap_trend': return 'Content Opportunity'
      case 'archetype_channel': return 'Channel Strategy'
      default: return type.replace(/_/g, ' ')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            Discovering Connections...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p>Analyzing your brand data for hidden opportunities...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Connection Discovery
          </CardTitle>
          <CardDescription>
            Discover unexpected insights connecting your brand data, customer psychology, and market opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-2">Feature In Development</h4>
                <p className="text-sm text-orange-800 mb-4">{error}</p>
                <div className="bg-white rounded p-4 border border-orange-200 mb-4">
                  <p className="text-sm font-semibold text-orange-900 mb-2">What this feature will do:</p>
                  <ul className="text-xs text-orange-800 space-y-1">
                    <li>• Find unexpected connections between customer triggers and market trends</li>
                    <li>• Identify competitor weaknesses aligned with your strengths</li>
                    <li>• Discover content gaps that match trending topics</li>
                    <li>• Map customer archetypes to optimal channel strategies</li>
                  </ul>
                </div>
                <p className="text-xs text-orange-700">
                  To enable this feature, configure your OpenAI API key and ensure all data sources are connected.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Connection Discovery
        </CardTitle>
        <CardDescription>
          Unexpected insights connecting your brand data, customer psychology, and market opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No connections discovered yet.</p>
            <Button onClick={discoverConnections} variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Discover Connections
            </Button>
          </div>
        ) : (
          <>
            {connections.map((connection) => (
              <div
                key={connection.id}
                className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${getConnectionColor(connection.confidence)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getConnectionIcon(connection.type)}
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {getTypeLabel(connection.type)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(connection.confidence * 100)}% confidence
                  </Badge>
                </div>

                <h4 className="font-semibold mb-2 text-sm">{connection.insight}</h4>

                {connection.data_points && connection.data_points.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {connection.data_points.slice(0, 3).map((dp, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {dp.source}
                      </Badge>
                    ))}
                    {connection.data_points.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{connection.data_points.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {connection.suggested_actions && connection.suggested_actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <p className="text-xs font-semibold mb-2 opacity-90">Suggested Actions:</p>
                    <ul className="space-y-1.5">
                      {connection.suggested_actions.slice(0, 3).map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <ArrowRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                          <span className="flex-1">{action.action}</span>
                          {action.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0">
                              {action.priority}
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <Button onClick={discoverConnections} variant="outline" className="w-full mt-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Connections
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
