/**
 * UVP Wizard Context
 *
 * Central state management for the UVP wizard using React Context API.
 * Provides wizard state, navigation, suggestion management, and scoring.
 *
 * This is separate from UVPContext which manages the canvas builder.
 */

import * as React from 'react'
import { supabase } from '@/lib/supabase'
import {
  UVP,
  UVPWizardContext,
  WizardStep,
  WizardProgress,
  DraggableSuggestion,
  ValidationResult,
  FieldValidationStatus,
} from '@/types/uvp-wizard'
import { openRouterAI } from '@/services/uvp-wizard/openrouter-ai'
import { rhodesAI } from '@/services/uvp-wizard/rhodes-ai'
import { uvpScoringService } from '@/services/uvp-wizard/uvp-scoring'
import { websiteAnalyzer } from '@/services/uvp-wizard/website-analyzer'

/**
 * Wizard step order
 */
const WIZARD_STEPS: WizardStep[] = [
  'welcome',
  'target-customer',
  'customer-problem',
  'unique-solution',
  'key-benefit',
  'review',
  'complete',
]

/**
 * Initial UVP state
 */
const INITIAL_UVP: Partial<UVP> = {
  target_customer: '',
  customer_problem: '',
  unique_solution: '',
  key_benefit: '',
  differentiation: '',
  industry: '',
  competitors: [],
}

/**
 * Initial validation state
 */
const INITIAL_VALIDATION: ValidationResult = {
  is_valid: false,
  errors: {},
  warnings: {},
  field_statuses: {},
}

/**
 * Create the context
 */
const UVPWizardContext = React.createContext<UVPWizardContext | undefined>(undefined)

/**
 * UVP Wizard Context Provider Props
 */
interface UVPWizardProviderProps {
  children: React.ReactNode
  brandId: string
  brandData?: any
  initialUVP?: Partial<UVP>
  onComplete?: (uvp: UVP) => void
}

/**
 * UVP Wizard Context Provider
 */
export const UVPWizardProvider: React.FC<UVPWizardProviderProps> = ({
  children,
  brandId,
  brandData,
  initialUVP,
  onComplete,
}) => {
  console.log('[UVPWizardProvider] Mounting with:', { brandId, brandData })

  // Core state
  const [uvp, setUVP] = React.useState<Partial<UVP>>(initialUVP || INITIAL_UVP)
  const [currentStep, setCurrentStep] = React.useState<WizardStep>('welcome')
  const [completedSteps, setCompletedSteps] = React.useState<WizardStep[]>([])

  // UI state
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(true)

  // Suggestions
  const [availableSuggestions, setAvailableSuggestions] = React.useState<
    DraggableSuggestion[]
  >([])
  const [selectedSuggestions, setSelectedSuggestions] = React.useState<
    DraggableSuggestion[]
  >([])

  // Validation
  const [validation, setValidation] = React.useState<ValidationResult>(INITIAL_VALIDATION)

  /**
   * Load existing UVP from database
   */
  React.useEffect(() => {
    if (brandId && !initialUVP) {
      loadUVP()
    }
  }, [brandId])

  /**
   * Update industry from brand data
   */
  React.useEffect(() => {
    if (brandData?.industry && !uvp.industry) {
      setUVP((prev) => ({ ...prev, industry: brandData.industry }))
    }
  }, [brandData?.industry, uvp.industry])

  /**
   * Calculate wizard progress
   */
  const progress = React.useMemo((): WizardProgress => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    const totalSteps = WIZARD_STEPS.length

    // Check if current step is valid
    const currentFieldValid = validateCurrentStep(currentStep, uvp)

    return {
      current_step: currentStep,
      completed_steps: completedSteps,
      total_steps: totalSteps,
      progress_percentage: Math.round((currentIndex / totalSteps) * 100),
      is_valid: currentFieldValid,
      validation_errors: validation.errors,
      can_go_back: currentIndex > 0,
      can_go_forward: currentIndex < totalSteps - 1 && currentFieldValid,
      can_submit: currentIndex === totalSteps - 2 && isUVPComplete(uvp),
    }
  }, [currentStep, completedSteps, uvp, validation])

  /**
   * Load UVP from database
   */
  const loadUVP = async () => {
    setIsLoading(true)
    try {
      const { data, error} = await supabase
        .from('brand_uvps')
        .select('*')
        .eq('brand_id', brandId)
        .maybeSingle()  // Use maybeSingle instead of single to handle no rows gracefully

      if (error) {
        console.error('[UVPWizardContext] Error loading UVP:', error)
      } else if (data) {
        console.log('[UVPWizardContext] Loaded existing UVP:', data)
        setUVP(data)

        // Restore progress
        if (data.current_step) {
          setCurrentStep(data.current_step as WizardStep)
        }
      } else {
        console.log('[UVPWizardContext] No existing UVP found for brand:', brandId)
      }
    } catch (error) {
      console.error('[UVPWizardContext] Failed to load UVP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Save UVP to database
   */
  const saveUVP = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from('brand_uvps').upsert({
        brand_id: brandId,
        ...uvp,
        current_step: currentStep,
        is_complete: isUVPComplete(uvp),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      console.log('[UVPWizardContext] UVP saved successfully')
    } catch (error) {
      console.error('[UVPWizardContext] Failed to save UVP:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Update a field in the UVP
   */
  const updateField = React.useCallback(
    (field: keyof UVP, value: any) => {
      setUVP((prev) => {
        const updated = { ...prev, [field]: value }

        // Auto-populate differentiation with unique_solution since they're combined
        if (field === 'unique_solution' && !updated.differentiation) {
          updated.differentiation = value
        }

        // Trigger session auto-save with updated UVP state
        import('@/services/session/session.service').then(({ SessionService }) => {
          if (brandId && brandData) {
            const urlSlug = SessionService.generateUrlSlug(brandData.name || 'session')
            SessionService.saveSession({
              brandId,
              sessionName: brandData.name || 'New Session',
              urlSlug,
              uvpState: updated,
            })
          }
        })

        return updated
      })

      // Auto-save to database after a delay
      const saveTimer = setTimeout(() => {
        saveUVP()
      }, 2000)

      return () => clearTimeout(saveTimer)
    },
    [brandId, brandData]
  )

  /**
   * Go to a specific step
   */
  const goToStep = React.useCallback((step: WizardStep) => {
    setCurrentStep(step)
  }, [])

  /**
   * Go to next step
   */
  const goNext = React.useCallback(async () => {
    console.log('[UVPWizardContext] goNext called, currentStep:', currentStep)
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    console.log('[UVPWizardContext] Current index:', currentIndex, 'of', WIZARD_STEPS.length)

    if (currentIndex < WIZARD_STEPS.length - 1) {
      const nextStep = WIZARD_STEPS[currentIndex + 1]
      console.log('[UVPWizardContext] Moving to next step:', nextStep)

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep])
      }

      // If moving from welcome to first step, trigger deep website scan
      if (currentStep === 'welcome' && nextStep === 'target-customer') {
        console.log('[UVPWizardContext] Starting wizard - triggering deep website scan')
        setIsLoading(true)

        // Perform deep website analysis immediately
        if (brandData?.website && brandData?.id) {
          console.log('[UVPWizardContext] Performing initial deep website scan...')
          try {
            const deepAnalysis = await websiteAnalyzer.analyzeWebsite(brandData.website, brandData.id)
            console.log('[UVPWizardContext] Initial deep analysis complete:', deepAnalysis)

            // Store the analysis for use in suggestions
            const enhancedWebsiteData = {
              ...(brandData?.website_analysis || brandData?.websiteData || {}),
              ...(deepAnalysis || {}),
              services: [
                ...(brandData?.services || []),
                ...(deepAnalysis?.services || [])
              ].filter((s, i, arr) => arr.indexOf(s) === i),
              products: [
                ...(brandData?.products || []),
                ...(deepAnalysis?.products || [])
              ].filter((p, i, arr) => arr.indexOf(p) === i),
              benefits: deepAnalysis?.benefits || [],
              differentiators: deepAnalysis?.differentiators || [],
              target_audience: deepAnalysis?.target_audience || [],
              problems_solved: deepAnalysis?.problems_solved || []
            }

            // Update brand data with enhanced website analysis
            if (brandData) {
              brandData.website_analysis = enhancedWebsiteData
            }
          } catch (error) {
            console.error('[UVPWizardContext] Deep website scan failed:', error)
          }
        }

        setIsLoading(false)
      }

      // Update step WITHOUT any scrolling
      setCurrentStep(nextStep)
      saveUVP()

      // Ensure we stay in the same viewport position
      const wizardElement = document.querySelector('[data-uvp-wizard]')
      if (wizardElement) {
        requestAnimationFrame(() => {
          wizardElement.scrollIntoView({ behavior: 'instant', block: 'nearest' })
        })
      }
    } else {
      console.log('[UVPWizardContext] Already at last step')
    }
  }, [currentStep, completedSteps, brandData])

  /**
   * Go to previous step
   */
  const goBack = React.useCallback(() => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    if (currentIndex > 0) {
      const prevStep = WIZARD_STEPS[currentIndex - 1]
      setCurrentStep(prevStep)
    }
  }, [currentStep])

  /**
   * Generate suggestions for current step
   */
  const generateSuggestions = React.useCallback(async () => {
    console.log('[UVPWizardContext] generateSuggestions called for step:', currentStep)
    setIsLoading(true)
    // Clear existing suggestions first
    setAvailableSuggestions([])
    setSelectedSuggestions([])

    try {
      let suggestions: DraggableSuggestion[] = []

      // Perform deeper website analysis if we have a website URL and brand ID
      let deepAnalysis = null
      if (brandData?.website && brandData?.id) {
        console.log('[UVPWizardContext] Performing deep website scan...')
        deepAnalysis = await websiteAnalyzer.analyzeWebsite(brandData.website, brandData.id)
        console.log('[UVPWizardContext] Deep analysis results:', deepAnalysis)
      }

      // Merge deep analysis with existing website data
      const enhancedWebsiteData = {
        ...(brandData?.website_analysis || brandData?.websiteData || {}),
        ...(deepAnalysis || {}),
        // Combine services and products from both sources
        services: [
          ...(brandData?.services || []),
          ...(deepAnalysis?.services || [])
        ].filter((s, i, arr) => arr.indexOf(s) === i), // Remove duplicates
        products: [
          ...(brandData?.products || []),
          ...(deepAnalysis?.products || [])
        ].filter((p, i, arr) => arr.indexOf(p) === i),
        benefits: deepAnalysis?.benefits || [],
        differentiators: deepAnalysis?.differentiators || [],
        target_audience: deepAnalysis?.target_audience || [],
        problems_solved: deepAnalysis?.problems_solved || []
      }

      // Create context for industry-specific suggestions
      const context = {
        industry: uvp.industry || brandData?.industry || 'Real Estate',
        brandName: brandData?.name,
        website: brandData?.website,
        competitors: uvp.competitors || brandData?.competitors || [],
        naicsCode: brandData?.naicsCode || brandData?.naics_code,
        websiteData: enhancedWebsiteData,
        services: enhancedWebsiteData.services,
        products: enhancedWebsiteData.products
      }

      console.log('[UVPWizardContext] Using enhanced context:', context)
      console.log('[UVPWizardContext] Generating with Claude Opus 4.1 (HIGHEST QUALITY MODEL)')

      // Generate industry-specific suggestions using OpenRouter AI (Claude Opus 4.1)
      switch (currentStep) {
        case 'target-customer':
          console.log('[UVPWizardContext] Generating customer segments...')
          suggestions = await openRouterAI.generateCustomerSegments(context)
          break

        case 'customer-problem':
          if (uvp.target_customer) {
            console.log('[UVPWizardContext] Generating customer problems...')
            suggestions = await openRouterAI.generateCustomerProblems(
              context,
              uvp.target_customer
            )
          } else {
            console.log('[UVPWizardContext] No target customer, skipping problem generation')
          }
          break

        case 'unique-solution':
          if (uvp.customer_problem) {
            console.log('[UVPWizardContext] Generating solutions...')
            suggestions = await openRouterAI.generateSolutions(
              context,
              uvp.customer_problem
            )
          } else {
            console.log('[UVPWizardContext] No customer problem, skipping solution generation')
          }
          break

        case 'key-benefit':
          if (uvp.unique_solution) {
            console.log('[UVPWizardContext] Generating key benefits...')
            suggestions = await openRouterAI.generateKeyBenefits(
              context,
              uvp.unique_solution
            )
          } else {
            console.log('[UVPWizardContext] No unique solution, skipping benefit generation')
          }
          break

        // Differentiation is now combined with unique-solution

        default:
          console.log('[UVPWizardContext] No suggestions for step:', currentStep)
      }

      console.log('[UVPWizardContext] Generated suggestions:', {
        count: suggestions.length,
        types: suggestions.map(s => s.type),
        suggestions: suggestions
      })
      setAvailableSuggestions(suggestions)

    } catch (error) {
      console.error('[UVPWizardContext] Failed to generate suggestions:', error)
      // Will use the smart industry-specific fallbacks from openRouterAI
      setAvailableSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [currentStep, uvp, brandData])

  /**
   * Add a suggestion
   */
  const addSuggestion = React.useCallback((suggestion: DraggableSuggestion) => {
    setSelectedSuggestions((prev) => [...prev, suggestion])
    setAvailableSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
  }, [])

  /**
   * Remove a suggestion
   */
  const removeSuggestion = React.useCallback((id: string) => {
    const removed = selectedSuggestions.find((s) => s.id === id)
    if (removed) {
      setAvailableSuggestions((prev) => [...prev, removed])
      setSelectedSuggestions((prev) => prev.filter((s) => s.id !== id))
    }
  }, [selectedSuggestions])

  /**
   * Score the current UVP
   */
  const scoreUVP = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const score = await uvpScoringService.quickScore(uvp)
      setUVP((prev) => ({ ...prev, score }))
    } catch (error) {
      console.error('[UVPWizardContext] Failed to score UVP:', error)
    } finally {
      setIsLoading(false)
    }
  }, [uvp])

  /**
   * Reset wizard
   */
  const reset = React.useCallback(() => {
    setUVP(INITIAL_UVP)
    setCurrentStep('welcome')
    setCompletedSteps([])
    setAvailableSuggestions([])
    setSelectedSuggestions([])
    setValidation(INITIAL_VALIDATION)
  }, [])

  /**
   * Context value
   */
  const value: UVPWizardContext = {
    uvp,
    progress,
    is_loading: isLoading,
    is_saving: isSaving,
    show_suggestions: showSuggestions,
    available_suggestions: availableSuggestions,
    selected_suggestions: selectedSuggestions,
    validation,
    updateField,
    goToStep,
    goNext,
    goBack,
    generateSuggestions,
    addSuggestion,
    removeSuggestion,
    saveUVP,
    scoreUVP,
    reset,
  }

  return <UVPWizardContext.Provider value={value}>{children}</UVPWizardContext.Provider>
}

/**
 * Hook to use UVP Wizard context
 */
export const useUVPWizard = (): UVPWizardContext => {
  const context = React.useContext(UVPWizardContext)

  if (!context) {
    throw new Error('useUVPWizard must be used within a UVPWizardProvider')
  }

  return context
}

/**
 * Validate current step
 */
function validateCurrentStep(step: WizardStep, uvp: Partial<UVP>): boolean {
  switch (step) {
    case 'welcome':
      return true
    case 'target-customer':
      return !!uvp.target_customer && uvp.target_customer.length > 10
    case 'customer-problem':
      return !!uvp.customer_problem && uvp.customer_problem.length > 10
    case 'unique-solution':
      return !!uvp.unique_solution && uvp.unique_solution.length > 10
    case 'key-benefit':
      return !!uvp.key_benefit && uvp.key_benefit.length > 10
    // Differentiation is combined with unique-solution
    case 'review':
    case 'complete':
      return isUVPComplete(uvp)
    default:
      return false
  }
}

/**
 * Check if UVP is complete
 */
function isUVPComplete(uvp: Partial<UVP>): boolean {
  const isComplete = !!(
    uvp.target_customer &&
    uvp.customer_problem &&
    uvp.unique_solution &&
    uvp.key_benefit &&
    uvp.target_customer.length > 10 &&
    uvp.customer_problem.length > 10 &&
    uvp.unique_solution.length > 10 &&
    uvp.key_benefit.length > 10
  )

  // Log for debugging
  console.log('[isUVPComplete] Checking UVP completion:', {
    has_target_customer: !!uvp.target_customer && uvp.target_customer.length > 10,
    has_customer_problem: !!uvp.customer_problem && uvp.customer_problem.length > 10,
    has_unique_solution: !!uvp.unique_solution && uvp.unique_solution.length > 10,
    has_key_benefit: !!uvp.key_benefit && uvp.key_benefit.length > 10,
    has_differentiation: !!uvp.differentiation && uvp.differentiation.length > 10,
    is_complete: isComplete
  })

  return isComplete
}

export { UVPWizardContext }
