import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ValueStatement, UVPGenerator } from '@/services/uvp/uvp-generator'
import { SynapseAutoAnalyzer } from '@/services/intelligence/synapse-auto-analyzer'
import { Edit, Save, Trash2, Award, TrendingUp, CheckCircle, Copy } from 'lucide-react'

interface ValueStatementCardProps {
  statement: ValueStatement
  onUpdate?: (statement: ValueStatement) => void
  onDelete?: (id: string) => void
  onDuplicate?: (statement: ValueStatement) => void
  showActions?: boolean
  className?: string
}

export const ValueStatementCard: React.FC<ValueStatementCardProps> = ({
  statement,
  onUpdate,
  onDelete,
  onDuplicate,
  showActions = true,
  className,
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedStatement, setEditedStatement] = React.useState(statement)
  const [synapseScore, setSynapseScore] = React.useState<number | null>(statement.synapse_score || null)
  const [validation, setValidation] = React.useState<any>(null)

  React.useEffect(() => {
    validateStatement()
    if (!synapseScore && statement.headline.length > 20) {
      scoreSynapse()
    }
  }, [statement])

  const validateStatement = () => {
    const result = UVPGenerator.validateUVP(editedStatement)
    setValidation(result)
  }

  const scoreSynapse = async () => {
    try {
      const score = await SynapseAutoAnalyzer.scorePositioningStatement(editedStatement.headline)
      setSynapseScore(score.overall_score)
    } catch (error) {
      console.error('Failed to score UVP:', error)
    }
  }

  const handleSave = async () => {
    if (onUpdate) {
      const updated = {
        ...editedStatement,
        synapse_score: synapseScore || undefined,
      }
      onUpdate(updated)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedStatement(statement)
    setIsEditing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number, label: string) => {
    if (score >= 80) return <Badge className="bg-green-500">{label}: {Math.round(score)}</Badge>
    if (score >= 60) return <Badge className="bg-yellow-500">{label}: {Math.round(score)}</Badge>
    return <Badge variant="destructive">{label}: {Math.round(score)}</Badge>
  }

  return (
    <Card className={`${className} relative`}>
      <CardContent className="p-6 space-y-4">
        {/* Header with Actions */}
        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {synapseScore !== null && (
                <div className="flex items-center gap-1">
                  <Award className={`h-4 w-4 ${getScoreColor(synapseScore)}`} />
                  <span className={`text-sm font-bold ${getScoreColor(synapseScore)}`}>
                    {Math.round(synapseScore)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  {onDuplicate && (
                    <Button size="sm" variant="ghost" onClick={() => onDuplicate(statement)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button size="sm" variant="ghost" onClick={() => onDelete(statement.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Headline */}
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={editedStatement.headline}
              onChange={(e) => setEditedStatement({ ...editedStatement, headline: e.target.value })}
              placeholder="Your value proposition headline"
              className="text-xl font-bold"
            />
          ) : (
            <h3 className="text-xl font-bold leading-tight">{statement.headline}</h3>
          )}
        </div>

        {/* Subheadline */}
        <div className="space-y-2">
          {isEditing ? (
            <Textarea
              value={editedStatement.subheadline}
              onChange={(e) => setEditedStatement({ ...editedStatement, subheadline: e.target.value })}
              placeholder="Supporting subheadline"
              rows={2}
            />
          ) : (
            <p className="text-muted-foreground">{statement.subheadline}</p>
          )}
        </div>

        {/* Supporting Points */}
        {statement.supporting_points.length > 0 && (
          <div className="space-y-2">
            <ul className="space-y-2">
              {statement.supporting_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={point}
                      onChange={(e) => {
                        const updated = [...editedStatement.supporting_points]
                        updated[i] = e.target.value
                        setEditedStatement({ ...editedStatement, supporting_points: updated })
                      }}
                      className="flex-1"
                    />
                  ) : (
                    <span className="flex-1">{point}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div>
          {isEditing ? (
            <Input
              value={editedStatement.call_to_action}
              onChange={(e) => setEditedStatement({ ...editedStatement, call_to_action: e.target.value })}
              placeholder="Call to action"
            />
          ) : (
            <Button className="w-full">{statement.call_to_action}</Button>
          )}
        </div>

        {/* Scores */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {getScoreBadge(statement.clarity_score, 'Clarity')}
          {getScoreBadge(statement.conversion_potential, 'Conversion')}
          {synapseScore !== null && getScoreBadge(synapseScore, 'Synapse')}
        </div>

        {/* Validation Messages */}
        {validation && !isEditing && (
          <div className="space-y-2 pt-2 border-t">
            {validation.errors.length > 0 && (
              <div className="space-y-1">
                {validation.errors.map((error: string, i: number) => (
                  <div key={i} className="text-xs text-red-600 flex items-start gap-1">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="space-y-1">
                {validation.warnings.map((warning: string, i: number) => (
                  <div key={i} className="text-xs text-yellow-600 flex items-start gap-1">
                    <span>!</span>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
            {validation.recommendations.length > 0 && (
              <div className="space-y-1">
                {validation.recommendations.map((rec: string, i: number) => (
                  <div key={i} className="text-xs text-green-600 flex items-start gap-1">
                    <TrendingUp className="h-3 w-3 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
