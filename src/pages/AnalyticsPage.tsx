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

  return (
    <AppLayout showBreadcrumbs={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance, measure goals, and gain insights
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
            <KPIScorecard brandId={brandId} />
            <PerformanceCharts brandId={brandId} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalProgressTracker brandId={brandId} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentAnalytics brandId={brandId} />
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
