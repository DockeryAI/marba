/**
 * Buyer Journey Page
 * Standalone page for the Buyer Journey Wizard
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BuyerJourneyProvider } from '@/contexts/BuyerJourneyContext'
import { BuyerJourneyWizard } from '@/components/buyer-journey/BuyerJourneyWizard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const BuyerJourneyPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()

  if (!brandId) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Brand Not Found</h1>
          <p className="text-muted-foreground mb-4">No brand ID provided</p>
          <Button onClick={() => navigate('/brands')}>
            Go to Brands
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container py-4 px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/mirror/${brandId}`)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mirror
          </Button>
          <h1 className="text-2xl font-bold">Define Your Buyer Journey</h1>
          <p className="text-muted-foreground mt-1">
            Map your ideal customer profile and their path to purchase
          </p>
        </div>
      </div>

      {/* Wizard */}
      <div className="container py-8 px-6">
        <BuyerJourneyProvider brandId={brandId}>
          <BuyerJourneyWizard
            brandId={brandId}
            onComplete={() => {
              // Navigate back to Mirror with success message
              navigate(`/mirror/${brandId}`, {
                state: { message: 'Buyer journey completed successfully!' }
              })
            }}
            onCancel={() => {
              navigate(`/mirror/${brandId}`)
            }}
          />
        </BuyerJourneyProvider>
      </div>
    </div>
  )
}
