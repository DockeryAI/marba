/**
 * useMirrorData Hook
 * Custom hook for MIRROR data persistence and management
 */

import * as React from 'react'
import { useMirror } from '@/contexts/MirrorContext'

export interface UseMirrorDataReturn {
  // State
  measure: any
  intend: any
  reimagine: any
  reach: any
  optimize: any
  reflect: any

  // Status
  loading: boolean
  error: Error | null
  lastSaved?: string
  isDirty: boolean

  // Actions
  updateMeasure: (data: any) => void
  updateIntend: (data: any) => void
  updateReimagine: (data: any) => void
  updateReach: (data: any) => void
  updateOptimize: (data: any) => void
  updateReflect: (data: any) => void
  save: () => Promise<void>
  refresh: (brandId: string) => Promise<void>
  reset: () => void
}

/**
 * Hook for working with MIRROR framework data
 */
export const useMirrorData = (): UseMirrorDataReturn => {
  const mirror = useMirror()

  return {
    // State
    measure: mirror.state.measure,
    intend: mirror.state.intend,
    reimagine: mirror.state.reimagine,
    reach: mirror.state.reach,
    optimize: mirror.state.optimize,
    reflect: mirror.state.reflect,

    // Status
    loading: mirror.loading,
    error: mirror.error,
    lastSaved: mirror.state.lastSaved,
    isDirty: mirror.state.isDirty,

    // Actions
    updateMeasure: mirror.updateMeasure,
    updateIntend: mirror.updateIntend,
    updateReimagine: mirror.updateReimagine,
    updateReach: mirror.updateReach,
    updateOptimize: mirror.updateOptimize,
    updateReflect: mirror.updateReflect,
    save: mirror.saveToServer,
    refresh: mirror.loadFromServer,
    reset: mirror.reset
  }
}

/**
 * Hook for checking if a MIRROR section has data
 */
export const useMirrorProgress = () => {
  const { state } = useMirror()

  const hasData = React.useMemo(() => ({
    measure: Object.keys(state.measure).length > 0,
    intend: Object.keys(state.intend).length > 0,
    reimagine: Object.keys(state.reimagine).length > 0,
    reach: Object.keys(state.reach).length > 0,
    optimize: Object.keys(state.optimize).length > 0,
    reflect: Object.keys(state.reflect).length > 0
  }), [state])

  const completedSections = React.useMemo(() => {
    return Object.values(hasData).filter(Boolean).length
  }, [hasData])

  const totalSections = 6
  const progress = (completedSections / totalSections) * 100

  return {
    hasData,
    completedSections,
    totalSections,
    progress
  }
}
