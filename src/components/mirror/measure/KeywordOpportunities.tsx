/**
 * Keyword Opportunities Component
 * Displays keyword opportunities with one-click Synapse content generation
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Sparkles, TrendingUp, Target, Clock,
  Search, Zap, CheckCircle2, Copy
} from 'lucide-react'
import type { KeywordOpportunity } from '@/services/intelligence/semrush-api'
import { ContentPsychologyEngine } from '@/services/synapse/generation/ContentPsychologyEngine'
import { Textarea } from '@/components/ui/textarea'

interface KeywordOpportunitiesProps {
  opportunities: KeywordOpportunity[]
  brandProfile?: any
}

export function KeywordOpportunities({ opportunities, brandProfile }: KeywordOpportunitiesProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordOpportunity | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [psychologyScore, setPsychologyScore] = useState<number>(0)
  const [showDialog, setShowDialog] = useState(false)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  if (!opportunities || opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keyword Opportunities
          </CardTitle>
          <CardDescription>
            No keyword opportunities found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keyword opportunities will appear here once SEO analysis is complete.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group opportunities by type
  const quickWins = opportunities.filter(o => o.opportunity === 'quick-win')
  const highValue = opportunities.filter(o => o.opportunity === 'high-value')
  const longTerm = opportunities.filter(o => o.opportunity === 'long-term')

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'quick-win':
        return <Zap className="h-4 w-4" />
      case 'high-value':
        return <Target className="h-4 w-4" />
      case 'long-term':
        return <Clock className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'quick-win':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'high-value':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'long-term':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleGenerateContent = async (opportunity: KeywordOpportunity) => {
    setIsGenerating(true)
    setSelectedKeyword(opportunity)
    setShowDialog(true)
    setGeneratedContent('')
    setPsychologyScore(0)

    try {
      // Generate SEO-optimized content using Synapse
      const psychologyEngine = new ContentPsychologyEngine()

      // Create a prompt for content generation
      const contentPrompt = `Write a compelling 300-word blog post or article targeting the keyword "${opportunity.keyword}".
Make it informative, engaging, and naturally incorporate the keyword.
Use the brand voice and emotional triggers from the industry profile.
Include a strong hook, valuable insights, and a call-to-action.`

      // Generate content (simplified - in production, this would call OpenRouter)
      const mockContent = await generateSEOContent(
        opportunity.keyword,
        brandProfile,
        opportunity.reasoning
      )

      // Analyze psychology score
      const score = await psychologyEngine.analyzePsychology(
        mockContent,
        brandProfile?.full_profile_data || {}
      )

      setGeneratedContent(mockContent)
      setPsychologyScore(score)
    } catch (error) {
      console.error('[KeywordOpportunities] Error generating content:', error)
      setGeneratedContent('Error generating content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyContent = (keyword: string) => {
    navigator.clipboard.writeText(generatedContent)
    setCopiedStates({ ...copiedStates, [keyword]: true })
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [keyword]: false })
    }, 2000)
  }

  const renderOpportunityCard = (opportunity: KeywordOpportunity) => (
    <div
      key={opportunity.keyword}
      className={`rounded-lg border p-4 space-y-3 ${getOpportunityColor(opportunity.opportunity)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {getOpportunityIcon(opportunity.opportunity)}
            <h4 className="font-semibold">{opportunity.keyword}</h4>
          </div>
          <p className="text-xs opacity-80">
            {opportunity.reasoning}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="opacity-70">Search Volume</div>
          <div className="font-semibold">
            {opportunity.searchVolume.toLocaleString()}/mo
          </div>
        </div>
        <div>
          <div className="opacity-70">Difficulty</div>
          <div className="font-semibold">{opportunity.difficulty}%</div>
        </div>
        <div>
          <div className="opacity-70">Est. Traffic</div>
          <div className="font-semibold">
            {opportunity.estimatedTraffic.toLocaleString()}
          </div>
        </div>
      </div>

      {opportunity.currentPosition && (
        <div className="text-xs opacity-80">
          Current Rank: #{opportunity.currentPosition}
        </div>
      )}

      <Button
        onClick={() => handleGenerateContent(opportunity)}
        className="w-full"
        size="sm"
        disabled={isGenerating}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate Content with Synapse
      </Button>
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keyword Opportunities
          </CardTitle>
          <CardDescription>
            {opportunities.length} opportunities to boost your SEO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Wins */}
          {quickWins.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">
                  Quick Wins ({quickWins.length})
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Keywords ranked 11-20 that can quickly move to page 1
              </p>
              <div className="space-y-2">
                {quickWins.slice(0, 5).map(renderOpportunityCard)}
              </div>
            </div>
          )}

          {/* High Value */}
          {highValue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">
                  High Value ({highValue.length})
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                High search volume keywords worth targeting
              </p>
              <div className="space-y-2">
                {highValue.slice(0, 5).map(renderOpportunityCard)}
              </div>
            </div>
          )}

          {/* Long Term */}
          {longTerm.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">
                  Long Term ({longTerm.length})
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Competitive keywords that require sustained effort
              </p>
              <div className="space-y-2">
                {longTerm.slice(0, 3).map(renderOpportunityCard)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Generation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generated Content: {selectedKeyword?.keyword}
            </DialogTitle>
            <DialogDescription>
              SEO-optimized content generated with Synapse psychology engine
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Psychology Score */}
            {psychologyScore > 0 && (
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Psychology Score</span>
                  <Badge variant={psychologyScore >= 7 ? 'default' : 'secondary'}>
                    {psychologyScore.toFixed(1)}/10
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {psychologyScore >= 8 && 'Excellent! Strong emotional appeal and persuasive language.'}
                  {psychologyScore >= 6 && psychologyScore < 8 && 'Good balance of logic and emotion.'}
                  {psychologyScore < 6 && 'Could benefit from more emotional triggers.'}
                </div>
              </div>
            )}

            {/* Generated Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-medium">Generated Content</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyContent(selectedKeyword?.keyword || '')}
                >
                  {copiedStates[selectedKeyword?.keyword || ''] ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {isGenerating ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="ml-3 text-muted-foreground">
                    Generating content...
                  </span>
                </div>
              ) : (
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              )}
            </div>

            {/* Keyword Metrics Reminder */}
            {selectedKeyword && (
              <div className="rounded-lg border p-3 text-sm bg-muted/50">
                <div className="font-medium mb-2">Keyword Metrics</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Volume:</span>{' '}
                    <span className="font-semibold">
                      {selectedKeyword.searchVolume.toLocaleString()}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Difficulty:</span>{' '}
                    <span className="font-semibold">{selectedKeyword.difficulty}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Traffic:</span>{' '}
                    <span className="font-semibold">
                      {selectedKeyword.estimatedTraffic.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ============================================================================
// Helper: Generate SEO Content (Mock - would use OpenRouter in production)
// ============================================================================

async function generateSEOContent(
  keyword: string,
  brandProfile: any,
  reasoning: string
): Promise<string> {
  // In production, this would call OpenRouter with Claude
  // For now, return a template that demonstrates the structure

  const brandVoice = brandProfile?.full_profile_data?.brand_voice || 'professional'
  const emotionalTriggers = brandProfile?.full_profile_data?.emotional_triggers || []

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  return `🎯 ${keyword.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}: Your Complete Guide

In today's competitive landscape, understanding ${keyword} is crucial for business success. Whether you're just starting out or looking to optimize your existing strategy, this guide will walk you through everything you need to know.

**Why ${keyword} Matters**

${reasoning} This represents a significant opportunity for brands that can capture attention and deliver value in this space.

**The Path Forward**

Success with ${keyword} requires a strategic approach. Start by understanding your audience's needs, then craft content that speaks directly to their pain points while showcasing your unique value proposition.

Key considerations include:
• Aligning your message with customer expectations
• Building trust through consistent delivery
• Leveraging data to refine your approach
• Staying ahead of industry trends

**Take Action Today**

Don't let this opportunity pass you by. The brands that succeed are those that act decisively while maintaining a customer-first mindset. Start implementing these strategies today and watch your results transform.

${emotionalTriggers[0]?.trigger ? `Remember: ${emotionalTriggers[0].trigger}` : 'Ready to make a change?'} The time to act is now.

---
*Note: This content was generated by Synapse AI and should be reviewed and customized for your specific brand voice and audience.*
`
}
