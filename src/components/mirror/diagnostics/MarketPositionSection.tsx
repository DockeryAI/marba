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
    <div className="space-y-4">{/* Compact spacing */}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 border rounded-lg bg-card">
          <div className="text-xs text-muted-foreground mb-1">Market Rank</div>
          <div className="text-xl font-bold">
            #{data.current_rank}
            <span className="text-sm text-muted-foreground ml-1">/ {data.total_competitors}</span>
          </div>
        </div>

        <div className="p-3 border rounded-lg bg-card">
          <div className="text-xs text-muted-foreground mb-1">Pricing</div>
          <div className="text-xl font-bold capitalize">{data.pricing_position.tier}</div>
        </div>

        <div className="p-3 border rounded-lg bg-card">
          <div className="text-xs text-muted-foreground mb-1">Competitors</div>
          <div className="text-xl font-bold">{data.total_competitors}</div>
        </div>
      </div>

      {/* Grid Layout for Rankings and Competitors */}
      <div className="grid grid-cols-2 gap-4">
        {/* Keyword Rankings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Keyword Rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.keyword_rankings).slice(0, 5).map(([keyword, rank]) => (
              <div key={keyword} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{keyword}</span>
                <Badge variant={rank <= 3 ? 'default' : rank <= 10 ? 'secondary' : 'outline'} className="ml-2">
                  #{rank}
                </Badge>
              </div>
            ))}
            {Object.keys(data.keyword_rankings).length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Competitors - Compact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Competitors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.top_competitors.slice(0, 3).map((competitor, index) => (
              <div key={competitor.name} className="border rounded p-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  <span className="font-semibold text-sm">{competitor.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{competitor.positioning}</p>
                <div className="flex flex-wrap gap-1">
                  {competitor.strengths.slice(0, 3).map((strength) => (
                    <Badge key={strength} variant="secondary" className="text-xs px-1 py-0">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            {data.top_competitors.length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Competitive Gaps - Compact */}
      {data.competitive_gaps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Competitive Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.competitive_gaps.map((gap, index) => (
              <div key={index} className="border rounded p-2 bg-white dark:bg-background space-y-1">
                <div className="font-semibold text-sm">{gap.gap}</div>
                <p className="text-xs text-muted-foreground">{gap.impact}</p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Who:</span> {gap.competitors_doing.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
