/**
 * Customer Truth Section
 * Deep dive into who actually buys and why
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
import { AlertCircle, Users, DollarSign, MapPin, TrendingUp } from 'lucide-react'
import { type CustomerTruthData } from '@/types/mirror-diagnostics'

interface CustomerTruthSectionProps {
  data: CustomerTruthData
  hasCompletedUVP: boolean
}

export const CustomerTruthSection: React.FC<CustomerTruthSectionProps> = ({
  data,
  hasCompletedUVP,
}) => {
  const isGoodMatch = data.match_percentage >= 70
  const isModerateMatch = data.match_percentage >= 50 && data.match_percentage < 70
  const isPoorMatch = data.match_percentage < 50

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Customer Truth Assessment</h2>
        <p className="text-muted-foreground mt-1">
          {hasCompletedUVP
            ? 'How well your actual customers align with your UVP'
            : 'The reality of who buys from you and why'}
        </p>
      </div>

      {/* Expected vs Actual Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Who You Think Buys vs Who Actually Buys</CardTitle>
          <CardDescription>
            Alignment between your target audience and actual customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Match Score */}
          <div className="text-center p-6 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Demographic Match</div>
            <div
              className={`text-5xl font-bold mb-2 ${
                isGoodMatch
                  ? 'text-green-600'
                  : isModerateMatch
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {data.match_percentage}%
            </div>
            <Progress value={data.match_percentage} className="max-w-xs mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">
              {isGoodMatch && 'Great alignment - you know your customers well'}
              {isModerateMatch && 'Partial alignment - some surprises in who actually buys'}
              {isPoorMatch && 'Misalignment detected - reality differs from expectations'}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-center">Expected Customers</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Age Range</div>
                  <div className="font-medium">{data.expected_demographic.age}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Income Level</div>
                  <div className="font-medium">{data.expected_demographic.income}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{data.expected_demographic.location}</div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4 bg-blue-50/50">
              <h3 className="font-semibold text-center">Actual Customers</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Age Range</div>
                  <div className="font-medium">{data.actual_demographic.age}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Income Level</div>
                  <div className="font-medium">{data.actual_demographic.income}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{data.actual_demographic.location}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why They Choose You */}
      <Card>
        <CardHeader>
          <CardTitle>Why Customers Actually Choose You</CardTitle>
          <CardDescription>
            Real reasons from reviews and customer feedback (not assumptions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.why_they_choose.map((reason, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{reason.reason}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Source: {reason.source}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{reason.percentage}%</div>
                  <Progress value={reason.percentage} className="w-24 h-2 mt-1" />
                </div>
              </div>
            ))}
          </div>

          {data.why_they_choose.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No customer choice data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price vs Value Perception */}
      <Card
        className={
          data.price_vs_value_perception.includes('cheapest')
            ? 'border-yellow-200 bg-yellow-50/50'
            : 'border-green-200 bg-green-50/50'
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price vs Value Perception
          </CardTitle>
          <CardDescription>How customers view your pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{data.price_vs_value_perception}</p>
          {data.price_vs_value_perception.includes('cheapest') && (
            <div className="mt-4 p-3 bg-white border border-yellow-300 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <span className="font-semibold">Warning: </span>
                  Competing on price attracts customers who will leave for cheaper alternatives.
                  Consider building value-based differentiation instead.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Objections */}
      {data.common_objections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Common Customer Objections</CardTitle>
            <CardDescription>What holds people back from buying or returning</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.common_objections.map((objection, index) => (
                <li key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{objection}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Buyer Journey Gaps */}
      {data.buyer_journey_gaps.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle>Buyer Journey Drop-Off Points</CardTitle>
            <CardDescription>Where you're losing potential customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.buyer_journey_gaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {gap.stage}
                    </Badge>
                    <span className="font-semibold">{gap.gap}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{gap.impact}</p>
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
              <TrendingUp className="h-5 w-5 text-blue-600" />
              UVP Customer Alignment
            </CardTitle>
            <CardDescription>
              How well your customers validate your unique value proposition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Customer confirmation analysis coming soon</p>
              <p className="text-sm mt-2">
                We'll show what percentage of customers confirm your UVP promise in reviews
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
