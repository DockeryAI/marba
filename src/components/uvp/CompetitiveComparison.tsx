import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ValueStatement, UVPGenerator, CompetitivePosition } from '@/services/uvp/uvp-generator'
import { Swords, Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react'

interface CompetitiveComparisonProps {
  yourUVP: ValueStatement
  competitors?: { name: string; uvp: string }[]
  onAnalyze?: (positions: CompetitivePosition[]) => void
  className?: string
}

export const CompetitiveComparison: React.FC<CompetitiveComparisonProps> = ({
  yourUVP,
  competitors = [],
  onAnalyze,
  className,
}) => {
  const [competitorList, setCompetitorList] = React.useState(competitors)
  const [newCompetitor, setNewCompetitor] = React.useState({ name: '', uvp: '' })
  const [analysis, setAnalysis] = React.useState<CompetitivePosition[]>([])

  const handleAddCompetitor = () => {
    if (newCompetitor.name && newCompetitor.uvp) {
      setCompetitorList([...competitorList, newCompetitor])
      setNewCompetitor({ name: '', uvp: '' })
    }
  }

  const handleRemoveCompetitor = (index: number) => {
    setCompetitorList(competitorList.filter((_, i) => i !== index))
  }

  const handleAnalyze = () => {
    const uvps = competitorList.map((c) => c.uvp)
    const positions = UVPGenerator.compareWithCompetitors(yourUVP, uvps)
    setAnalysis(positions)
    if (onAnalyze) {
      onAnalyze(positions)
    }
  }

  const getGapColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGapBadge = (score: number) => {
    if (score >= 70) return <Badge className="bg-green-500">Strong</Badge>
    if (score >= 40) return <Badge className="bg-yellow-500">Moderate</Badge>
    return <Badge variant="destructive">Weak</Badge>
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <CardTitle>Competitive Comparison</CardTitle>
            </div>
            <Button size="sm" onClick={handleAnalyze} disabled={competitorList.length === 0}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Your UVP */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Your Value Proposition</h3>
            <Card className="p-4 bg-primary/5 border-primary">
              <p className="text-sm font-medium">{yourUVP.headline}</p>
            </Card>
          </div>

          {/* Competitor Input */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Add Competitors</h3>

            <div className="flex gap-2">
              <Input
                placeholder="Competitor name"
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="Their value proposition"
                value={newCompetitor.uvp}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, uvp: e.target.value })}
                className="flex-[2]"
              />
              <Button size="sm" onClick={handleAddCompetitor}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Competitor List */}
          {competitorList.length > 0 && (
            <div className="space-y-2">
              {competitorList.map((comp, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{comp.name}</p>
                      <p className="text-xs text-muted-foreground">{comp.uvp}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveCompetitor(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Analysis Results */}
          {analysis.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold">Differentiation Analysis</h3>

              <div className="space-y-3">
                {analysis.map((position, i) => (
                  <Card key={i} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{competitorList[i]?.name || `Competitor ${i + 1}`}</span>
                        {getGapBadge(position.gap_score)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Differentiation Score</span>
                          <span className={`font-bold ${getGapColor(position.gap_score)}`}>
                            {position.gap_score}/100
                          </span>
                        </div>
                        <Progress value={position.gap_score} className="h-2" />
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-muted-foreground font-medium">Competitor Position:</p>
                          <p className="italic">{position.competitor_value}</p>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">{position.message_opportunity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <Card className="p-4 bg-muted/50">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Overall Assessment</p>
                  {(() => {
                    const avgGap = analysis.reduce((sum, p) => sum + p.gap_score, 0) / analysis.length
                    if (avgGap >= 70) {
                      return (
                        <p className="text-green-600">
                          ✓ Strong differentiation across competitors. Your UVP stands out clearly.
                        </p>
                      )
                    } else if (avgGap >= 40) {
                      return (
                        <p className="text-yellow-600">
                          ! Moderate differentiation. Consider emphasizing unique elements more prominently.
                        </p>
                      )
                    } else {
                      return (
                        <p className="text-red-600">
                          ⚠ Weak differentiation. Your UVP overlaps significantly with competitors. Reposition or find
                          stronger unique angles.
                        </p>
                      )
                    }
                  })()}
                </div>
              </Card>
            </div>
          )}

          {competitorList.length === 0 && (
            <Card className="p-6 text-center">
              <Swords className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-2">No competitors added yet</p>
              <p className="text-sm text-muted-foreground">
                Add competitor UVPs to analyze differentiation
              </p>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
