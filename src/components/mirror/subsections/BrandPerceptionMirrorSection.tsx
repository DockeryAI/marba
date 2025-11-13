/**
 * Brand Perception Mirror Section
 * Post-UVP: Before/After comparison of brand perception
 * Shows current state vs. UVP-aligned target state
 */

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Sparkles, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BrandPerceptionMirrorSectionProps {
  brandId: string
  brandData?: any
  hasCompletedUVP: boolean
  className?: string
}

export const BrandPerceptionMirrorSection: React.FC<BrandPerceptionMirrorSectionProps> = ({
  brandId,
  brandData,
  hasCompletedUVP,
  className
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // TODO: Implement before/after perception mirror
    console.log('[BrandPerceptionMirrorSection] Generating perception mirror...')
    setTimeout(() => setIsGenerating(false), 2000)
  }

  if (!hasCompletedUVP) {
    return (
      <div className={className}>
        <div className="container py-6 px-6">
          <Card className="p-12 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Complete Your UVP First</h3>
            <p className="text-muted-foreground">
              Brand Perception Mirror requires your Value Proposition to be defined.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="container py-6 px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Brand Perception Mirror</h2>
            <p className="text-muted-foreground">
              See your brand before and after UVP alignment — current reality vs. target positioning
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Mirror'}
          </Button>
        </div>

        {/* Placeholder content */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
              <Eye className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold">Before & After Perception</h3>
              <Badge variant="outline">Post-UVP</Badge>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              This section creates a before/after comparison of your brand perception:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Before (Current State)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>How customers currently perceive you</li>
                  <li>Current messaging and positioning</li>
                  <li>Perception gaps and inconsistencies</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  After (Target State)
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>UVP-aligned positioning</li>
                  <li>Enhanced messaging strategy</li>
                  <li>Strategic recommendations for alignment</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
