/**
 * Market Position Section
 * Deep dive into competitive reality and market standing
 */

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, ExternalLink, TrendingUp, Target } from 'lucide-react'
import { type MarketPositionData } from '@/types/mirror-diagnostics'

interface MarketPositionSectionProps {
  data: MarketPositionData
  hasCompletedUVP: boolean
}

export const MarketPositionSection: React.FC<MarketPositionSectionProps> = ({
  data,
  hasCompletedUVP,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Market Position Reality Check</h2>
        <p className="text-muted-foreground mt-1">
          {hasCompletedUVP
            ? 'How your UVP is performing in the market'
            : 'Where you stand vs competitors right now'}
        </p>
      </div>

      {/* Current Position */}
      <Card>
        <CardHeader>
          <CardTitle>Your Market Standing</CardTitle>
          <CardDescription>
            Based on search visibility, competitive analysis, and market presence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Market Rank</div>
              <div className="text-2xl font-bold">
                #{data.current_rank}
                <span className="text-base text-muted-foreground ml-2">
                  of {data.total_competitors}
                </span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Pricing Position</div>
              <div className="text-2xl font-bold capitalize">{data.pricing_position.tier}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {data.pricing_position.vs_market}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Competitors Tracked</div>
              <div className="text-2xl font-bold">{data.total_competitors}</div>
              <div className="text-xs text-muted-foreground mt-1">In your market</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Rankings</CardTitle>
          <CardDescription>
            Where you appear for important search terms in your market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.keyword_rankings).map(([keyword, rank]) => (
              <div key={keyword} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{keyword}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress
                      value={Math.max(0, 100 - rank * 5)}
                      className="h-2 flex-1 max-w-xs"
                    />
                    <Badge variant={rank <= 3 ? 'default' : rank <= 10 ? 'secondary' : 'outline'}>
                      Position #{rank}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(data.keyword_rankings).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No keyword ranking data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Competitors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Competitors</CardTitle>
          <CardDescription>Who you're competing against and what they're doing well</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.top_competitors.map((competitor, index) => (
              <div key={competitor.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <h3 className="font-semibold">{competitor.name}</h3>
                    </div>
                    {competitor.url && (
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Visit website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Their Positioning:
                  </div>
                  <p className="text-sm">{competitor.positioning}</p>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Key Strengths:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {competitor.strengths.map((strength) => (
                      <Badge key={strength} variant="secondary">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.top_competitors.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No competitor data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitive Gaps */}
      {data.competitive_gaps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Competitive Gaps
            </CardTitle>
            <CardDescription>Things competitors are doing that you're not</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.competitive_gaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white space-y-2">
                  <div className="font-semibold">{gap.gap}</div>
                  <p className="text-sm text-muted-foreground">{gap.impact}</p>
                  <div className="text-sm">
                    <span className="font-medium">Who's doing this: </span>
                    {gap.competitors_doing.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post-UVP Enhancement */}
      {hasCompletedUVP && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              UVP Market Recognition
            </CardTitle>
            <CardDescription>
              How well the market recognizes your unique value proposition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>UVP delivery analysis coming soon</p>
              <p className="text-sm mt-2">
                We'll show how your differentiation is being recognized in the market
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
