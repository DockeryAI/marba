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
    <div className="space-y-6">
      {/* Overall Health */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Overall Brand Health</CardTitle>
              <CardDescription>
                Based on market position, customer alignment, and brand clarity
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${overallStatus.color}`}>
                {diagnostic.overall_health_score}
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {overallStatus.status.replace('-', ' ')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={diagnostic.overall_health_score} className="h-3" />
        </CardContent>
      </Card>

      {/* Three Core Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Position Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Market Position</span>
              <span className={`text-2xl font-bold ${marketStatus.color}`}>
                {diagnostic.market_position_score}
              </span>
            </CardTitle>
            <CardDescription>Where you stand vs competitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={diagnostic.market_position_score} />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Rank</span>
                <span className="font-medium">
                  #{diagnostic.market_position_data.current_rank} of{' '}
                  {diagnostic.market_position_data.total_competitors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pricing Tier</span>
                <span className="font-medium capitalize">
                  {diagnostic.market_position_data.pricing_position.tier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Competitive Gaps</span>
                <span className="font-medium">
                  {diagnostic.market_position_data.competitive_gaps.length} identified
                </span>
              </div>
            </div>

            {onViewSection && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onViewSection('market')}
              >
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Customer Match Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Match</span>
              <span className={`text-2xl font-bold ${customerStatus.color}`}>
                {diagnostic.customer_match_score}
              </span>
            </CardTitle>
            <CardDescription>Who really buys from you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={diagnostic.customer_match_score} />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Demographic Match</span>
                <span className="font-medium">
                  {diagnostic.customer_truth_data.match_percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value Perception</span>
                <span className="font-medium">
                  {diagnostic.customer_truth_data.price_vs_value_perception.includes('cheapest')
                    ? 'Price-driven'
                    : 'Value-driven'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Journey Gaps</span>
                <span className="font-medium">
                  {diagnostic.customer_truth_data.buyer_journey_gaps.length} found
                </span>
              </div>
            </div>

            {onViewSection && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onViewSection('customer')}
              >
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Brand Clarity Score */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Brand Clarity</span>
              <span className={`text-2xl font-bold ${brandStatus.color}`}>
                {diagnostic.brand_clarity_score}
              </span>
            </CardTitle>
            <CardDescription>Message consistency & clarity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={diagnostic.brand_clarity_score} />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Message Consistency</span>
                <span className="font-medium">
                  {diagnostic.brand_fit_data.messaging_consistency}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Differentiation</span>
                <span className="font-medium">
                  {diagnostic.brand_fit_data.differentiation_score}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clarity Issues</span>
                <span className="font-medium">
                  {diagnostic.brand_fit_data.clarity_issues.length} identified
                </span>
              </div>
            </div>

            {onViewSection && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onViewSection('brand')}
              >
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Timestamp */}
      <div className="text-center text-sm text-muted-foreground">
        Last analyzed: {new Date(diagnostic.analyzed_at).toLocaleString()}
      </div>
    </div>
  )
}
