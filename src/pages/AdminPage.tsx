/**
 * Admin Page - Platform Administration
 * Provides access to API Management and other admin functions
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings } from 'lucide-react'
import { ApiAdminSection } from '@/components/admin/api'

export const AdminPage: React.FC = () => {
  // Mock brand ID - in production this would come from auth/context
  const brandId = 'demo-brand-001'

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
      <main>
        <ApiAdminSection brandId={brandId} />
      </main>
    </div>
  )
}
