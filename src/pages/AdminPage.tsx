/**
 * Admin Page - Platform Administration
 * Provides access to API Management, Background Jobs, and other admin functions
 */

import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Settings, Database, Cog } from 'lucide-react'
import { ApiAdminSection } from '@/components/admin/api'
import { BackgroundJobsMonitor } from '@/components/admin/BackgroundJobsMonitor'

export const AdminPage: React.FC = () => {
  // Mock brand ID - in production this would come from auth/context
  const brandId = 'demo-brand-001'
  const [activeTab, setActiveTab] = useState('apis')

  // TODO: Add proper authentication and role-based access control
  // - Check if user is authenticated
  // - Verify user has admin role/permissions
  // - Redirect to login if not authenticated
  // - Show "Access Denied" if authenticated but not admin

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Administration</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="apis" className="gap-2">
              <Database className="h-4 w-4" />
              API Management
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Cog className="h-4 w-4" />
              Background Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apis" className="mt-0">
            <ApiAdminSection brandId={brandId} />
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            <BackgroundJobsMonitor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
