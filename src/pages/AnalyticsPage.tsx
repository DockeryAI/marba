/**
 * Analytics Page
 * Comprehensive analytics and performance tracking
 */

import * as React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { GoalProgressTracker } from '@/components/analytics/GoalProgressTracker'
import { KPIScorecard } from '@/components/analytics/KPIScorecard'
import { PerformanceCharts } from '@/components/analytics/PerformanceCharts'
import { ContentAnalytics } from '@/components/analytics/ContentAnalytics'
import { AudienceInsights } from '@/components/analytics/AudienceInsights'
import { CompetitiveMonitoring } from '@/components/analytics/CompetitiveMonitoring'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const AnalyticsPage: React.FC = () => {
  // TODO: Get from BrandContext when implemented
  const brandId = 'demo-brand-123'

  // Mock objectives for Goal Progress Tracker
  const mockObjectives = [
    {
      id: 'obj-1',
      name: 'Increase Social Media Engagement',
      description: 'Boost overall engagement rate to 5%',
      targetValue: 5,
      currentValue: 4.2,
      unit: '%',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'obj-2',
      name: 'Grow Follower Base',
      description: 'Reach 20,000 total followers across all platforms',
      targetValue: 20000,
      currentValue: 15000,
      unit: 'followers',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'obj-3',
      name: 'Improve Content Quality Score',
      description: 'Achieve average content quality score of 85+',
      targetValue: 85,
      currentValue: 78,
      unit: 'score',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const dateRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    preset: '30d' as const,
  }

  return (
    <AppLayout showBreadcrumbs={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance, measure goals, and gain insights across all your content and platforms
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <KPIScorecard brandId={brandId} dateRange={dateRange} />
            <PerformanceCharts brandId={brandId} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalProgressTracker brandId={brandId} objectives={mockObjectives} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentAnalytics brandId={brandId} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <AudienceInsights brandId={brandId} />
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <CompetitiveMonitoring brandId={brandId} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
