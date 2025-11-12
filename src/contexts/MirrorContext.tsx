/**
 * MirrorContext
 * Manages MIRROR framework state and data flow between sections
 */

import * as React from 'react'

// Section data types
export interface MeasureData {
  brandHealth?: number
  industry?: string
  currentMetrics?: Record<string, number>
  marketPosition?: any
  competitiveLandscape?: any
  assets?: any
}

export interface IntendData {
  goals?: any[]
  objectives?: any[]
  targets?: any[]
}

export interface ReimagineData {
  brandStrategy?: any
  audienceStrategy?: any
  contentStrategy?: any
  competitiveStrategy?: any
  uvps?: any[]
}

export interface ReachData {
  channels?: any[]
  campaigns?: any[]
  tactics?: any[]
}

export interface OptimizeData {
  actions?: any[]
  timeline?: any
  priorities?: any[]
}

export interface ReflectData {
  kpis?: any[]
  insights?: any[]
  recommendations?: any[]
}

export interface MirrorState {
  measure: MeasureData
  intend: IntendData
  reimagine: ReimagineData
  reach: ReachData
  optimize: OptimizeData
  reflect: ReflectData
  lastSaved?: string
  isDirty: boolean
}

interface MirrorContextValue {
  state: MirrorState
  updateMeasure: (data: Partial<MeasureData>) => void
  updateIntend: (data: Partial<IntendData>) => void
  updateReimagine: (data: Partial<ReimagineData>) => void
  updateReach: (data: Partial<ReachData>) => void
  updateOptimize: (data: Partial<OptimizeData>) => void
  updateReflect: (data: Partial<ReflectData>) => void
  saveToServer: () => Promise<void>
  loadFromServer: (brandId: string) => Promise<void>
  reset: () => void
  loading: boolean
  error: Error | null
}

const MirrorContext = React.createContext<MirrorContextValue | undefined>(undefined)

const initialState: MirrorState = {
  measure: {},
  intend: {},
  reimagine: {},
  reach: {},
  optimize: {},
  reflect: {},
  isDirty: false
}

interface MirrorProviderProps {
  children: React.ReactNode
  brandId?: string
}

export const MirrorProvider: React.FC<MirrorProviderProps> = ({
  children,
  brandId
}) => {
  const [state, setState] = React.useState<MirrorState>(initialState)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  // Auto-save debounced
  const saveTimeoutRef = React.useRef<NodeJS.Timeout>()

  const updateSection = React.useCallback((
    section: keyof Omit<MirrorState, 'lastSaved' | 'isDirty'>,
    data: any
  ) => {
    setState(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
      isDirty: true
    }))

    // Debounced auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer()
    }, 2000)
  }, [])

  const updateMeasure = React.useCallback((data: Partial<MeasureData>) => {
    updateSection('measure', data)
  }, [updateSection])

  const updateIntend = React.useCallback((data: Partial<IntendData>) => {
    updateSection('intend', data)
  }, [updateSection])

  const updateReimagine = React.useCallback((data: Partial<ReimagineData>) => {
    updateSection('reimagine', data)
  }, [updateSection])

  const updateReach = React.useCallback((data: Partial<ReachData>) => {
    updateSection('reach', data)
  }, [updateSection])

  const updateOptimize = React.useCallback((data: Partial<OptimizeData>) => {
    updateSection('optimize', data)
  }, [updateSection])

  const updateReflect = React.useCallback((data: Partial<ReflectData>) => {
    updateSection('reflect', data)
  }, [updateSection])

  const saveToServer = React.useCallback(async () => {
    if (!brandId) return

    try {
      setLoading(true)
      setError(null)

      // TODO: Save to Supabase
      // await MirrorPersistenceService.save(brandId, state)

      // Mock save for now
      console.log('Saving MIRROR state:', state)

      setState(prev => ({
        ...prev,
        lastSaved: new Date().toISOString(),
        isDirty: false
      }))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save'))
    } finally {
      setLoading(false)
    }
  }, [brandId, state])

  const loadFromServer = React.useCallback(async (loadBrandId: string) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Load from Supabase
      // const data = await MirrorPersistenceService.load(loadBrandId)

      // Mock load for now
      console.log('Loading MIRROR state for brand:', loadBrandId)

      // setState(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load'))
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = React.useCallback(() => {
    setState(initialState)
  }, [])

  // Load data on mount if brandId provided
  React.useEffect(() => {
    if (brandId) {
      loadFromServer(brandId)
    }
  }, [brandId, loadFromServer])

  // Cleanup auto-save timeout
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const value: MirrorContextValue = {
    state,
    updateMeasure,
    updateIntend,
    updateReimagine,
    updateReach,
    updateOptimize,
    updateReflect,
    saveToServer,
    loadFromServer,
    reset,
    loading,
    error
  }

  return <MirrorContext.Provider value={value}>{children}</MirrorContext.Provider>
}

export const useMirror = (): MirrorContextValue => {
  const context = React.useContext(MirrorContext)
  if (!context) {
    throw new Error('useMirror must be used within a MirrorProvider')
  }
  return context
}
