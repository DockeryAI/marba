/**
 * Buyer Journey Context
 * Manages state for the buyer journey wizard and journey map
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  type BuyerJourneyMap,
  type WizardStep,
  type WizardProgress,
  type IdealCustomerProfile,
  type JobsAnalysis,
  type Touchpoint,
  type PainPoint,
  type Opportunity,
  JOURNEY_STAGES,
} from '@/types/buyer-journey'

// ============================================================================
// Context Type
// ============================================================================

interface BuyerJourneyContextType {
  // State
  journeyMap: Partial<BuyerJourneyMap>
  wizardProgress: WizardProgress
  isLoading: boolean
  error: string | null

  // Journey Map Actions
  updateICP: (icp: IdealCustomerProfile) => void
  updateJobs: (jobs: JobsAnalysis) => void
  addTouchpoint: (touchpoint: Touchpoint) => void
  updateTouchpoint: (id: string, touchpoint: Partial<Touchpoint>) => void
  removeTouchpoint: (id: string) => void
  addPainPoint: (painPoint: PainPoint) => void
  updatePainPoint: (id: string, painPoint: Partial<PainPoint>) => void
  removePainPoint: (id: string) => void
  addOpportunity: (opportunity: Opportunity) => void
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void
  removeOpportunity: (id: string) => void

  // Wizard Flow Actions
  goToStep: (step: WizardStep) => void
  nextStep: () => void
  previousStep: () => void
  completeStep: (step: WizardStep) => void
  resetWizard: () => void

  // Persistence Actions
  saveJourney: () => Promise<void>
  loadJourney: (brandId: string) => Promise<void>

  // Pre-population from UVP
  prePopulateFromUVP: (uvpData: any) => void
}

const BuyerJourneyContext = createContext<BuyerJourneyContextType | undefined>(undefined)

// ============================================================================
// Provider Component
// ============================================================================

interface BuyerJourneyProviderProps {
  children: ReactNode
  brandId: string
}

export const BuyerJourneyProvider: React.FC<BuyerJourneyProviderProps> = ({
  children,
  brandId,
}) => {
  // State
  const [journeyMap, setJourneyMap] = useState<Partial<BuyerJourneyMap>>({
    brand_id: brandId,
    stages: JOURNEY_STAGES,
    touchpoints: [],
    pain_points: [],
    opportunities: [],
    is_complete: false,
    completed_steps: [],
  })

  const [wizardProgress, setWizardProgress] = useState<WizardProgress>({
    current_step: 'customer-definition',
    completed_steps: [],
    step_data: {},
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // Journey Map Actions
  // ============================================================================

  const updateICP = useCallback((icp: IdealCustomerProfile) => {
    setJourneyMap(prev => ({
      ...prev,
      ideal_customer_profile: icp,
    }))
  }, [])

  const updateJobs = useCallback((jobs: JobsAnalysis) => {
    setJourneyMap(prev => ({
      ...prev,
      jobs_analysis: jobs,
    }))
  }, [])

  const addTouchpoint = useCallback((touchpoint: Touchpoint) => {
    setJourneyMap(prev => ({
      ...prev,
      touchpoints: [...(prev.touchpoints || []), touchpoint],
    }))
  }, [])

  const updateTouchpoint = useCallback((id: string, updates: Partial<Touchpoint>) => {
    setJourneyMap(prev => ({
      ...prev,
      touchpoints: prev.touchpoints?.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ) || [],
    }))
  }, [])

  const removeTouchpoint = useCallback((id: string) => {
    setJourneyMap(prev => ({
      ...prev,
      touchpoints: prev.touchpoints?.filter(t => t.id !== id) || [],
    }))
  }, [])

  const addPainPoint = useCallback((painPoint: PainPoint) => {
    setJourneyMap(prev => ({
      ...prev,
      pain_points: [...(prev.pain_points || []), painPoint],
    }))
  }, [])

  const updatePainPoint = useCallback((id: string, updates: Partial<PainPoint>) => {
    setJourneyMap(prev => ({
      ...prev,
      pain_points: prev.pain_points?.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ) || [],
    }))
  }, [])

  const removePainPoint = useCallback((id: string) => {
    setJourneyMap(prev => ({
      ...prev,
      pain_points: prev.pain_points?.filter(p => p.id !== id) || [],
    }))
  }, [])

  const addOpportunity = useCallback((opportunity: Opportunity) => {
    setJourneyMap(prev => ({
      ...prev,
      opportunities: [...(prev.opportunities || []), opportunity],
    }))
  }, [])

  const updateOpportunity = useCallback((id: string, updates: Partial<Opportunity>) => {
    setJourneyMap(prev => ({
      ...prev,
      opportunities: prev.opportunities?.map(o =>
        o.id === id ? { ...o, ...updates } : o
      ) || [],
    }))
  }, [])

  const removeOpportunity = useCallback((id: string) => {
    setJourneyMap(prev => ({
      ...prev,
      opportunities: prev.opportunities?.filter(o => o.id !== id) || [],
    }))
  }, [])

  // ============================================================================
  // Wizard Flow Actions
  // ============================================================================

  const STEP_ORDER: WizardStep[] = [
    'customer-definition',
    'jobs-to-be-done',
    'journey-stages',
    'touchpoints',
    'pain-points',
    'opportunities',
    'review',
  ]

  const goToStep = useCallback((step: WizardStep) => {
    setWizardProgress(prev => ({
      ...prev,
      current_step: step,
    }))
  }, [])

  const nextStep = useCallback(() => {
    setWizardProgress(prev => {
      const currentIndex = STEP_ORDER.indexOf(prev.current_step)
      const nextIndex = Math.min(currentIndex + 1, STEP_ORDER.length - 1)
      return {
        ...prev,
        current_step: STEP_ORDER[nextIndex],
      }
    })
  }, [])

  const previousStep = useCallback(() => {
    setWizardProgress(prev => {
      const currentIndex = STEP_ORDER.indexOf(prev.current_step)
      const prevIndex = Math.max(currentIndex - 1, 0)
      return {
        ...prev,
        current_step: STEP_ORDER[prevIndex],
      }
    })
  }, [])

  const completeStep = useCallback((step: WizardStep) => {
    setWizardProgress(prev => {
      const updatedCompletedSteps = prev.completed_steps.includes(step)
        ? prev.completed_steps
        : [...prev.completed_steps, step]

      return {
        ...prev,
        completed_steps: updatedCompletedSteps,
      }
    })

    setJourneyMap(prev => ({
      ...prev,
      completed_steps: [...(prev.completed_steps || []), step],
    }))
  }, [])

  const resetWizard = useCallback(() => {
    setJourneyMap({
      brand_id: brandId,
      stages: JOURNEY_STAGES,
      touchpoints: [],
      pain_points: [],
      opportunities: [],
      is_complete: false,
      completed_steps: [],
    })

    setWizardProgress({
      current_step: 'customer-definition',
      completed_steps: [],
      step_data: {},
    })

    setError(null)
  }, [brandId])

  // ============================================================================
  // Persistence Actions
  // ============================================================================

  const saveJourney = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement Supabase save
      // For now, save to localStorage
      const key = `buyer-journey-${brandId}`
      localStorage.setItem(key, JSON.stringify({
        journey_map: journeyMap,
        wizard_progress: wizardProgress,
        saved_at: new Date().toISOString(),
      }))

      console.log('[BuyerJourney] Saved to localStorage:', key)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save journey'
      setError(errorMessage)
      console.error('[BuyerJourney] Save failed:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [brandId, journeyMap, wizardProgress])

  const loadJourney = useCallback(async (loadBrandId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement Supabase load
      // For now, load from localStorage
      const key = `buyer-journey-${loadBrandId}`
      const saved = localStorage.getItem(key)

      if (saved) {
        const data = JSON.parse(saved)
        setJourneyMap(data.journey_map)
        setWizardProgress(data.wizard_progress)
        console.log('[BuyerJourney] Loaded from localStorage:', key)
      } else {
        console.log('[BuyerJourney] No saved data found for:', key)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load journey'
      setError(errorMessage)
      console.error('[BuyerJourney] Load failed:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================================================
  // UVP Pre-population
  // ============================================================================

  const prePopulateFromUVP = useCallback((uvpData: any) => {
    if (!uvpData) return

    console.log('[BuyerJourney] Pre-populating from UVP data...')

    // Parse UVP data and map to buyer journey structure
    const icp: Partial<IdealCustomerProfile> = {}

    // Target Audience → Demographics
    if (uvpData.target_audience) {
      icp.demographics = {
        age_range: uvpData.target_audience.age || '35-55',
        income_range: uvpData.target_audience.income || '$60k-$100k',
        location_type: uvpData.target_audience.location || 'General market',
        occupation: uvpData.target_audience.occupation,
      }
    }

    // Problems → Pain Points
    const painPoints: PainPoint[] = (uvpData.problems || []).map((problem: string, i: number) => ({
      id: `pain-${Date.now()}-${i}`,
      stage: 'awareness' as const,
      friction_type: 'information' as const,
      description: problem,
      impact: 'high' as const,
      evidence: ['From UVP Wizard'],
    }))

    // Value Props → Opportunities
    const opportunities: Opportunity[] = (uvpData.value_props || []).map((prop: string, i: number) => ({
      id: `opp-${Date.now()}-${i}`,
      stage: 'consideration' as const,
      type: 'strategic' as const,
      title: prop,
      description: `Leverage: ${prop}`,
      expected_impact: 'Improves consideration and conversion',
      effort: 'medium' as const,
      priority: (i + 1) as 1 | 2 | 3,
      addresses_pain_points: [],
    }))

    // Update journey map with pre-populated data
    setJourneyMap(prev => ({
      ...prev,
      ideal_customer_profile: {
        ...(prev.ideal_customer_profile || {}),
        ...icp,
      } as IdealCustomerProfile,
      pain_points: [...(prev.pain_points || []), ...painPoints],
      opportunities: [...(prev.opportunities || []), ...opportunities],
    }))

    console.log('[BuyerJourney] Pre-populated with', painPoints.length, 'pain points and', opportunities.length, 'opportunities')
  }, [])

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: BuyerJourneyContextType = {
    // State
    journeyMap,
    wizardProgress,
    isLoading,
    error,

    // Journey Map Actions
    updateICP,
    updateJobs,
    addTouchpoint,
    updateTouchpoint,
    removeTouchpoint,
    addPainPoint,
    updatePainPoint,
    removePainPoint,
    addOpportunity,
    updateOpportunity,
    removeOpportunity,

    // Wizard Flow Actions
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    resetWizard,

    // Persistence Actions
    saveJourney,
    loadJourney,

    // Pre-population
    prePopulateFromUVP,
  }

  return (
    <BuyerJourneyContext.Provider value={value}>
      {children}
    </BuyerJourneyContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

export const useBuyerJourney = () => {
  const context = useContext(BuyerJourneyContext)
  if (context === undefined) {
    throw new Error('useBuyerJourney must be used within a BuyerJourneyProvider')
  }
  return context
}
