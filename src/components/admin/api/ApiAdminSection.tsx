/**
 * API Admin Section - Main orchestrator for API Management
 * Provides tabbed interface for API configuration, billing, and analytics
 */

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, DollarSign, BarChart3, TrendingUp } from 'lucide-react'
import { ApiConfigList } from './ApiConfigList'
import { ApiConfigForm } from './ApiConfigForm'
import { ApiBillingDashboard } from './ApiBillingDashboard'
import { ApiCostByFeature } from './ApiCostByFeature'
import { ApiCostByApi } from './ApiCostByApi'
import { ApiUsageChart } from './ApiUsageChart'
import { ApiCostProjection } from './ApiCostProjection'

interface ApiAdminSectionProps {
  brandId: string
}

export const ApiAdminSection: React.FC<ApiAdminSectionProps> = ({ brandId }) => {
  const [activeTab, setActiveTab] = React.useState('overview')
  const [showConfigForm, setShowConfigForm] = React.useState(false)
  const [editingConfigId, setEditingConfigId] = React.useState<string | undefined>(undefined)

  const handleEditConfig = (configId: string) => {
    setEditingConfigId(configId)
    setShowConfigForm(true)
    setActiveTab('configuration')
  }

  const handleNewConfig = () => {
    setEditingConfigId(undefined)
    setShowConfigForm(true)
    setActiveTab('configuration')
  }

  const handleCloseForm = () => {
    setShowConfigForm(false)
    setEditingConfigId(undefined)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Management</h1>
        <p className="text-muted-foreground">
          Configure APIs, monitor costs, and analyze usage across your platform
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Analytics
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends & Forecasts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Overview</CardTitle>
              <CardDescription>
                Current month's API costs and usage metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiBillingDashboard brandId={brandId} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top APIs by Cost</CardTitle>
                <CardDescription>
                  Most expensive API providers this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiCostByApi brandId={brandId} days={30} limit={5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Features by Cost</CardTitle>
                <CardDescription>
                  Which features are consuming the most API costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiCostByFeature brandId={brandId} days={30} limit={5} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          {showConfigForm ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingConfigId ? 'Edit API Configuration' : 'Add New API Configuration'}
                </CardTitle>
                <CardDescription>
                  Configure API credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiConfigForm
                  brandId={brandId}
                  configId={editingConfigId}
                  onSuccess={handleCloseForm}
                  onCancel={handleCloseForm}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>API Configurations</CardTitle>
                <CardDescription>
                  Manage API credentials, endpoints, and billing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiConfigList
                  brandId={brandId}
                  onEdit={handleEditConfig}
                  onNew={handleNewConfig}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cost Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost by Feature</CardTitle>
              <CardDescription>
                Detailed breakdown of costs by feature with API-level details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiCostByFeature brandId={brandId} days={30} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost by API Provider</CardTitle>
              <CardDescription>
                Compare costs across different API providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiCostByApi brandId={brandId} days={30} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends & Forecasts Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>
                Historical API usage and cost trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiUsageChart brandId={brandId} days={30} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Projection</CardTitle>
              <CardDescription>
                Forecast end-of-month costs based on current usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiCostProjection brandId={brandId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
