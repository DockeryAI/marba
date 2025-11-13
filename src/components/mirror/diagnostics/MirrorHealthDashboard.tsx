/**
 * Mirror Health Dashboard
 * Single-screen overview of brand health with 3 core scores
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import { type MirrorDiagnostic, getScoreStatus } from '@/types/mirror-diagnostics'

interface MirrorHealthDashboardProps {
  diagnostic: MirrorDiagnostic
  onViewSection?: (section: 'market' | 'customer' | 'brand') => void
}

export const MirrorHealthDashboard: React.FC<MirrorHealthDashboardProps> = ({
  diagnostic,
  onViewSection,
}) => {
  const marketStatus = getScoreStatus(diagnostic.market_position_score)
  const customerStatus = getScoreStatus(diagnostic.customer_match_score)
  const brandStatus = getScoreStatus(diagnostic.brand_clarity_score)
  const overallStatus = getScoreStatus(diagnostic.overall_health_score)

  return (
    <div className="space-y-4 max-w-full">
      {/* Overall Health */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl truncate">Overall Brand Health</CardTitle>
              <CardDescription className="text-xs">
                Market position + customer alignment + brand clarity
              </CardDescription>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-3xl font-bold ${overallStatus.color}`}>
                {diagnostic.overall_health_score}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {overallStatus.status.replace('-', ' ')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={diagnostic.overall_health_score} className="h-2" />
        </CardContent>
      </Card>

      {/* Three Core Scores */}
      <div className="grid grid-cols-3 gap-3">
        {/* Market Position Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="truncate">Market Position</span>
              <span className={`text-xl font-bold ${marketStatus.color}`}>
                {diagnostic.market_position_score}
              </span>
            </CardTitle>
            <CardDescription className="text-xs">Where you stand vs competitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <Progress value={diagnostic.market_position_score} className="h-1.5" />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Market Rank</span>
                <span className="font-medium flex-shrink-0">
                  #{diagnostic.market_position_data.current_rank}/{diagnostic.market_position_data.total_competitors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Pricing Tier</span>
                <span className="font-medium capitalize flex-shrink-0">
                  {diagnostic.market_position_data.pricing_position.tier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Competitive Gaps</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.market_position_data.competitive_gaps.length} identified
                </span>
              </div>
            </div>

            {onViewSection && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => onViewSection('market')}
              >
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Customer Match Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="truncate">Customer Match</span>
              <span className={`text-xl font-bold ${customerStatus.color}`}>
                {diagnostic.customer_match_score}
              </span>
            </CardTitle>
            <CardDescription className="text-xs">Who really buys from you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <Progress value={diagnostic.customer_match_score} className="h-1.5" />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Demographic Match</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.customer_truth_data.match_percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Value Perception</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.customer_truth_data.price_vs_value_perception.includes('cheapest')
                    ? 'Price-driven'
                    : 'Value-driven'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Journey Gaps</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.customer_truth_data.buyer_journey_gaps.length} found
                </span>
              </div>
            </div>

            {onViewSection && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => onViewSection('customer')}
              >
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Brand Clarity Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="truncate">Brand Clarity</span>
              <span className={`text-xl font-bold ${brandStatus.color}`}>
                {diagnostic.brand_clarity_score}
              </span>
            </CardTitle>
            <CardDescription className="text-xs">Message consistency & clarity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <Progress value={diagnostic.brand_clarity_score} className="h-1.5" />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Message Consistency</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.brand_fit_data.messaging_consistency}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Differentiation</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.brand_fit_data.differentiation_score}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground truncate">Clarity Issues</span>
                <span className="font-medium flex-shrink-0">
                  {diagnostic.brand_fit_data.clarity_issues.length} identified
                </span>
              </div>
            </div>

            {onViewSection && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => onViewSection('brand')}
              >
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Timestamp */}
      <div className="text-center text-xs text-muted-foreground">
        Last analyzed: {new Date(diagnostic.analyzed_at).toLocaleString()}
      </div>
    </div>
  )
}
