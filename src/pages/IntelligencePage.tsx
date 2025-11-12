/**
 * Intelligence Page
 * Multi-signal opportunity detection hub
 */

import * as React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { IntelligenceHub } from '@/components/intelligence/IntelligenceHub'

export const IntelligencePage: React.FC = () => {
  // TODO: Get from BrandContext when implemented
  const brandId = 'demo-brand-123'

  return (
    <AppLayout showBreadcrumbs={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Intelligence Hub</h1>
          <p className="text-muted-foreground">
            Real-time opportunities from weather, trends, competitors, and more
          </p>
        </div>

        <IntelligenceHub brandId={brandId} />
      </div>
    </AppLayout>
  )
}
