/**
 * Customer Discovery Journey Section (JTBD Framework)
 * Post-UVP: Maps how customers discover and decide to hire you
 * Uses Jobs-to-be-Done framework with UVP context
 */

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Sparkles, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CustomerDiscoveryJourneySectionProps {
  brandId: string
  brandData?: any
  hasCompletedUVP: boolean
  className?: string
}

export const CustomerDiscoveryJourneySection: React.FC<CustomerDiscoveryJourneySectionProps> = ({
  brandId,
  brandData,
  hasCompletedUVP,
  className
}) => {
  const [isMapping, setIsMapping] = React.useState(false)

  const handleMap = async () => {
    setIsMapping(true)
    // TODO: Implement JTBD journey mapping
    console.log('[CustomerDiscoveryJourneySection] Mapping customer journey...')
    setTimeout(() => setIsMapping(false), 2000)
  }

  if (!hasCompletedUVP) {
    return (
      <div className={className}>
        <div className="container py-6 px-6">
          <Card className="p-12 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Complete Your UVP First</h3>
            <p className="text-muted-foreground">
              Customer Discovery Journey mapping requires your Value Proposition to be defined.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="container py-6 px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Customer Discovery Journey</h2>
            <p className="text-muted-foreground">
              Map how customers discover, research, and decide to work with you (JTBD Framework)
            </p>
          </div>
          <Button onClick={handleMap} disabled={isMapping}>
            <Sparkles className={`h-4 w-4 mr-2 ${isMapping ? 'animate-spin' : ''}`} />
            {isMapping ? 'Mapping...' : 'Map Journey'}
          </Button>
        </div>

        {/* Placeholder content */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <MapPin className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold">Jobs-to-be-Done Journey</h3>
              <Badge variant="outline">Post-UVP</Badge>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              This section maps your customer's journey using the JTBD framework and your UVP:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-6">
              <li>The "job" customers are trying to accomplish</li>
              <li>How they currently discover solutions (search, referrals, etc.)</li>
              <li>What triggers them to start looking</li>
              <li>How they research and evaluate options</li>
              <li>Why they choose you vs. alternatives (aligned with your UVP)</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
