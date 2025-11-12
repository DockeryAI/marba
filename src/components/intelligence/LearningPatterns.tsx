import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatternAnalyzerService } from '@/services/intelligence/pattern-analyzer'
import { ContentPattern, PowerWordAnalysis } from '@/types/intelligence.types'
import {
  Brain,
  TrendingUp,
  Clock,
  Hash,
  Type,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
  Zap,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LearningPatternsProps {
  brandId: string
  platforms: string[]
  onApplyPattern?: (pattern: ContentPattern) => void
}

export function LearningPatterns({
  brandId,
  platforms,
  onApplyPattern,
}: LearningPatternsProps) {
  const [patterns, setPatterns] = useState<ContentPattern[]>([])
  const [powerWords, setPowerWords] = useState<PowerWordAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    detectPatterns()
  }, [brandId, platforms])

  const detectPatterns = async () => {
    try {
      setLoading(true)
      setError(null)

      const [detectedPatterns, words] = await Promise.all([
        PatternAnalyzerService.detectPatterns({
          brandId,
          platforms,
          minSampleSize: 20,
          confidenceThreshold: 0.75,
        }),
        PatternAnalyzerService.analyzePowerWords(brandId),
      ])

      setPatterns(detectedPatterns)
      setPowerWords(words)
    } catch (err) {
      setError('Failed to detect learning patterns')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: ContentPattern['pattern_category']) => {
    switch (category) {
      case 'format':
        return <MessageSquare className="h-4 w-4" />
      case 'timing':
        return <Clock className="h-4 w-4" />
      case 'hashtag':
        return <Hash className="h-4 w-4" />
      case 'length':
        return <Type className="h-4 w-4" />
      case 'topic':
        return <Brain className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.8) return 'text-blue-600'
    if (score >= 0.7) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.9) return 'Very High'
    if (score >= 0.8) return 'High'
    if (score >= 0.7) return 'Moderate'
    return 'Low'
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
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Learning Patterns
          <Badge variant="secondary" className="ml-auto">
            {patterns.length} Patterns Found
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-detected patterns from your content performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patterns" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patterns">Performance Patterns</TabsTrigger>
            <TabsTrigger value="powerwords">Power Words</TabsTrigger>
          </TabsList>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-4 mt-4">
            {patterns.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-30 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Not Enough Data Yet</h3>
                <p className="text-muted-foreground mb-4">
                  We need at least 20 posts to detect meaningful patterns
                </p>
                <p className="text-sm text-muted-foreground">
                  Keep posting consistently, and we'll start identifying what works best
                </p>
              </div>
            ) : (
              patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="border rounded-lg p-5 space-y-4 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100">
                        {getCategoryIcon(pattern.pattern_category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {pattern.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {pattern.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('ml-2', getConfidenceColor(pattern.confidence_score))}
                    >
                      {getConfidenceLabel(pattern.confidence_score)} Confidence
                    </Badge>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 bg-accent/30 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {pattern.performance_metrics.baseline_engagement.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Baseline
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {pattern.performance_metrics.pattern_engagement.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        With Pattern
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        +{pattern.performance_metrics.improvement_percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Improvement
                      </div>
                    </div>
                  </div>

                  {/* Confidence & Significance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence Score</span>
                      <span className={cn('font-medium', getConfidenceColor(pattern.confidence_score))}>
                        {Math.round(pattern.confidence_score * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={pattern.confidence_score * 100}
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Statistical Significance</span>
                      <span className="font-medium">
                        {Math.round(pattern.statistical_significance * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={pattern.statistical_significance * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Data Source */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                    <span>
                      {pattern.discovered_from.posts_analyzed} posts analyzed
                    </span>
                    <span>•</span>
                    <span>{pattern.discovered_from.time_period}</span>
                    <span>•</span>
                    <span>{pattern.discovered_from.platforms.join(', ')}</span>
                  </div>

                  {/* Key Insights */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Key Insights
                    </h5>
                    <div className="space-y-1">
                      {pattern.actionable_insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implementation Guide */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      How to Apply This
                    </h5>
                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                      {pattern.implementation_guide.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="font-semibold text-blue-600 flex-shrink-0">
                            {idx + 1}.
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => onApplyPattern?.(pattern)}
                      className="gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Apply This Pattern
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Power Words Tab */}
          <TabsContent value="powerwords" className="space-y-4 mt-4">
            {powerWords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No power word analysis available yet</p>
              </div>
            ) : (
              <>
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    These words have been proven to increase engagement in your content.
                    Use them strategically in headlines and calls-to-action.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-3">
                  {powerWords.map((word, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{word.word}</h4>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {word.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            +{Math.round(word.avg_engagement_lift)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            engagement lift
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Effectiveness Score</span>
                          <span className="font-semibold">{word.effectiveness_score}/100</span>
                        </div>
                        <Progress value={word.effectiveness_score} className="h-2" />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Used in:</span>
                          <span className="ml-1 font-medium">{word.usage_count} posts</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sentiment impact:</span>
                          <span className="ml-1 font-medium">
                            {Math.round(word.sentiment_impact * 100)}%
                          </span>
                        </div>
                      </div>

                      {word.alternatives.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-2">
                            Similar power words:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {word.alternatives.map((alt, aidx) => (
                              <Badge key={aidx} variant="outline" className="text-xs">
                                {alt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {word.best_context.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">
                            Best used in:
                          </div>
                          <div className="text-sm">
                            {word.best_context.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Refresh Button */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" onClick={detectPatterns}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
