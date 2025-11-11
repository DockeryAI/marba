import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UVPComponent } from '@/services/uvp/uvp-generator'
import { Sparkles, TrendingUp, Package, Award, Target } from 'lucide-react'

interface ComponentMatrixProps {
  components: UVPComponent[]
  onRefresh?: () => void
  className?: string
}

export const ComponentMatrix: React.FC<ComponentMatrixProps> = ({
  components,
  onRefresh,
  className,
}) => {
  const benefits = components.filter((c) => c.type === 'benefit')
  const features = components.filter((c) => c.type === 'feature')
  const differentiators = components.filter((c) => c.type === 'differentiator')
  const proof = components.filter((c) => c.type === 'proof')

  const getEmotionalColor = (appeal: string) => {
    switch (appeal) {
      case 'high':
        return 'bg-green-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getClarityBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Clear</Badge>
    if (score >= 60) return <Badge className="bg-yellow-500">Moderate</Badge>
    return <Badge variant="destructive">Unclear</Badge>
  }

  const renderComponentGroup = (
    title: string,
    icon: React.ReactNode,
    items: UVPComponent[]
  ) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>

      {items.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">No {title.toLowerCase()} yet</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((component) => (
            <Card key={component.id} className="p-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm flex-1">{component.content}</p>
                  <div className="flex items-center gap-2 ml-2">
                    <div className={`w-2 h-2 rounded-full ${getEmotionalColor(component.emotional_appeal)}`} />
                    {getClarityBadge(component.clarity_score)}
                  </div>
                </div>

                {component.target_audience && (
                  <Badge variant="outline" className="text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    {component.target_audience}
                  </Badge>
                )}

                {component.synapse_score && (
                  <div className="flex items-center gap-1 text-xs">
                    <Award className="h-3 w-3" />
                    <span>Synapse: {Math.round(component.synapse_score)}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>UVP Components</CardTitle>
            </div>
            {onRefresh && (
              <Button size="sm" variant="outline" onClick={onRefresh}>
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{benefits.length}</div>
              <div className="text-xs text-muted-foreground">Benefits</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{differentiators.length}</div>
              <div className="text-xs text-muted-foreground">Differentiators</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{features.length}</div>
              <div className="text-xs text-muted-foreground">Features</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{proof.length}</div>
              <div className="text-xs text-muted-foreground">Proof Points</div>
            </Card>
          </div>

          {/* Emotional Appeal Legend */}
          <Card className="p-3 bg-muted/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Emotional Appeal:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span>Low</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Component Groups */}
          {renderComponentGroup(
            'Differentiators',
            <TrendingUp className="h-4 w-4 text-green-600" />,
            differentiators
          )}

          {renderComponentGroup(
            'Benefits',
            <Sparkles className="h-4 w-4 text-blue-600" />,
            benefits
          )}

          {renderComponentGroup(
            'Features',
            <Package className="h-4 w-4 text-purple-600" />,
            features
          )}

          {renderComponentGroup(
            'Proof Points',
            <Award className="h-4 w-4 text-orange-600" />,
            proof
          )}
        </CardContent>
      </Card>
    </div>
  )
}
