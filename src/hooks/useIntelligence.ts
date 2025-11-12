/**
 * useIntelligence Hook
 * Custom hook for intelligence opportunity detection
 */

import * as React from 'react'
import { OpportunityDetectorService } from '@/services/opportunity-detector.service'
import type { DetectedOpportunity } from '@/types/opportunity.types'

export interface UseIntelligenceOptions {
  brandId: string
  autoRefresh?: boolean
  refreshInterval?: number
  filters?: {
    signals?: string[]
    minImpact?: number
    maxAge?: number
  }
}

export interface UseIntelligenceReturn {
  // State
  opportunities: DetectedOpportunity[]
  loading: boolean
  error: Error | null
  lastRefresh?: Date

  // Actions
  refresh: () => Promise<void>
  dismissOpportunity: (id: string) => void
  actOnOpportunity: (id: string) => void

  // Queries
  getOpportunitiesBySignal: (signal: string) => DetectedOpportunity[]
  getHighImpactOpportunities: (threshold?: number) => DetectedOpportunity[]
  getExpiringOpportunities: (hours?: number) => DetectedOpportunity[]
}

/**
 * Hook for intelligence opportunity detection
 */
export const useIntelligence = ({
  brandId,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
  filters
}: UseIntelligenceOptions): UseIntelligenceReturn => {
  const [opportunities, setOpportunities] = React.useState<DetectedOpportunity[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [lastRefresh, setLastRefresh] = React.useState<Date>()

  const refresh = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await OpportunityDetectorService.detectOpportunities(brandId)

      // Apply filters
      let filtered = data

      if (filters?.signals) {
        filtered = filtered.filter(opp =>
          filters.signals!.includes(opp.signal_type)
        )
      }

      if (filters?.minImpact) {
        filtered = filtered.filter(opp =>
          opp.impact_score >= filters.minImpact!
        )
      }

      if (filters?.maxAge) {
        const maxDate = new Date(Date.now() - filters.maxAge * 60 * 60 * 1000)
        filtered = filtered.filter(opp =>
          new Date(opp.detected_at) >= maxDate
        )
      }

      setOpportunities(filtered)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load opportunities'))
    } finally {
      setLoading(false)
    }
  }, [brandId, filters])

  const dismissOpportunity = React.useCallback((id: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id))
    // TODO: Save dismissal to database
  }, [])

  const actOnOpportunity = React.useCallback((id: string) => {
    // Mark opportunity as acted upon
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id
          ? { ...opp, status: 'acted_on' as any }
          : opp
      )
    )
    // TODO: Save action to database
  }, [])

  const getOpportunitiesBySignal = React.useCallback((signal: string) => {
    return opportunities.filter(opp => opp.signal_type === signal)
  }, [opportunities])

  const getHighImpactOpportunities = React.useCallback((threshold: number = 80) => {
    return opportunities.filter(opp => opp.impact_score >= threshold)
  }, [opportunities])

  const getExpiringOpportunities = React.useCallback((hours: number = 24) => {
    const now = new Date()
    const expiryThreshold = new Date(now.getTime() + hours * 60 * 60 * 1000)

    return opportunities.filter(opp => {
      if (!opp.expires_at) return false
      return new Date(opp.expires_at) <= expiryThreshold
    })
  }, [opportunities])

  // Initial load
  React.useEffect(() => {
    refresh()
  }, [refresh])

  // Auto-refresh
  React.useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(refresh, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh])

  return {
    opportunities,
    loading,
    error,
    lastRefresh,
    refresh,
    dismissOpportunity,
    actOnOpportunity,
    getOpportunitiesBySignal,
    getHighImpactOpportunities,
    getExpiringOpportunities
  }
}
