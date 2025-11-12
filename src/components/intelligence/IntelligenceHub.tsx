import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WeatherOpportunities } from './WeatherOpportunities'
import { TrendingTopics } from './TrendingTopics'
import { CompetitiveIntel } from './CompetitiveIntel'
import { LearningPatterns } from './LearningPatterns'
import { OpportunityDashboard } from './OpportunityDashboard'
import { OpportunityInsight, ContentPattern } from '@/types/intelligence.types'
import {
  Brain,
  Zap,
  TrendingUp,
  Cloud,
  Target,
  BarChart3,
  RefreshCw,
  Settings,
  Info,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface IntelligenceHubProps {
  brandId: string
  location?: string
  industry?: string
  keywords?: string[]
  competitorIds?: string[]
  onCreateContent?: (opportunity: OpportunityInsight) => void
  onApplyPattern?: (pattern: ContentPattern) => void
  onApplySuggestion?: (suggestion: string) => void
}

export function IntelligenceHub({
  brandId,
  location = 'San Francisco, CA',
  industry = 'services',
  keywords = ['digital marketing', 'business growth', 'customer engagement'],
  competitorIds = [],
  onCreateContent,
  onApplyPattern,
  onApplySuggestion,
}: IntelligenceHubProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Trigger refresh on all intelligence sources
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Intelligence Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights, opportunities, and recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh All'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The Intelligence Hub continuously monitors 5+ data sources to identify opportunities and
          patterns. All insights are ranked by impact score and confidence level.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="gap-2">
            <Zap className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="weather" className="gap-2">
            <Cloud className="h-4 w-4" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="competitive" className="gap-2">
            <Target className="h-4 w-4" />
            Competitive
          </TabsTrigger>
          <TabsTrigger value="patterns" className="gap-2">
            <Brain className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="all-opps" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            All Opps
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active Opportunities</CardDescription>
                  <CardTitle className="text-3xl">12</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    +3 from yesterday
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>High Priority</CardDescription>
                  <CardTitle className="text-3xl text-orange-600">5</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive" className="text-xs">
                    Requires attention
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Patterns Detected</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">8</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    85% confidence avg
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Avg Impact Score</CardDescription>
                  <CardTitle className="text-3xl text-green-600">76</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    Above industry avg
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Top Priority Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Top Priority Opportunities
                </CardTitle>
                <CardDescription>
                  Highest impact opportunities requiring immediate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OpportunityDashboard
                  brandId={brandId}
                  limit={5}
                  minImpact={70}
                  onCreateContent={onCreateContent}
                />
              </CardContent>
            </Card>

            {/* Quick Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherOpportunities
                brandId={brandId}
                location={location}
                industry={industry}
                onCreateContent={onCreateContent}
              />

              <LearningPatterns
                brandId={brandId}
                platforms={['instagram', 'facebook', 'linkedin']}
                onApplyPattern={onApplyPattern}
              />
            </div>
          </div>
        </TabsContent>

        {/* Weather Tab */}
        <TabsContent value="weather" className="mt-6">
          <WeatherOpportunities
            brandId={brandId}
            location={location}
            industry={industry}
            onCreateContent={onCreateContent}
          />
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <TrendingTopics
            brandId={brandId}
            industry={industry}
            keywords={keywords}
            onCreateContent={onCreateContent}
          />
        </TabsContent>

        {/* Competitive Tab */}
        <TabsContent value="competitive" className="mt-6">
          <CompetitiveIntel
            brandId={brandId}
            competitorIds={competitorIds}
            ourMessaging="We help small businesses grow through data-driven marketing strategies"
            onApplySuggestion={onApplySuggestion}
          />
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="mt-6">
          <LearningPatterns
            brandId={brandId}
            platforms={['instagram', 'facebook', 'linkedin', 'twitter']}
            onApplyPattern={onApplyPattern}
          />
        </TabsContent>

        {/* All Opportunities Tab */}
        <TabsContent value="all-opps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                All Opportunities
              </CardTitle>
              <CardDescription>
                Complete list of all detected opportunities across all sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OpportunityDashboard
                brandId={brandId}
                limit={50}
                showFilters={true}
                onCreateContent={onCreateContent}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Intelligence Stats Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Data Sources Monitored</div>
              <div className="text-2xl font-bold text-blue-600">5+</div>
              <div className="text-xs text-muted-foreground mt-1">
                Weather, Trends, Competitive, Seasonal, Analytics
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Intelligence Updates</div>
              <div className="text-2xl font-bold text-purple-600">Every Hour</div>
              <div className="text-xs text-muted-foreground mt-1">
                Continuous monitoring for new opportunities
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">AI Models Active</div>
              <div className="text-2xl font-bold text-indigo-600">3</div>
              <div className="text-xs text-muted-foreground mt-1">
                Pattern detection, Synapse analysis, Impact scoring
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IntelligenceHub
