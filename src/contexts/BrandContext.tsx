/**
 * BrandContext
 * Manages current brand selection and brand-related data
 */

import * as React from 'react'

export interface Brand {
  id: string
  name: string
  industry: string
  description?: string
  logo_url?: string
  website?: string
  founded?: string
  size?: string
  created_at?: string
  updated_at?: string
}

interface BrandContextValue {
  currentBrand: Brand | null
  brands: Brand[]
  loading: boolean
  error: Error | null
  setCurrentBrand: (brand: Brand) => void
  refreshBrands: () => Promise<void>
}

const BrandContext = React.createContext<BrandContextValue | undefined>(undefined)

interface BrandProviderProps {
  children: React.ReactNode
  initialBrand?: Brand
}

export const BrandProvider: React.FC<BrandProviderProps> = ({
  children,
  initialBrand
}) => {
  const [currentBrand, setCurrentBrand] = React.useState<Brand | null>(initialBrand || null)
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const refreshBrands = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Fetch brands from Supabase
      // const { data, error } = await supabase
      //   .from('brands')
      //   .select('*')
      //   .order('name')
      // if (error) throw error
      // setBrands(data || [])

      throw new Error('Supabase connection not configured. Please set up Supabase to load brands.')
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load brands'))
      setBrands([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Load brands on mount
  React.useEffect(() => {
    refreshBrands()
  }, [refreshBrands])

  const value: BrandContextValue = {
    currentBrand,
    brands,
    loading,
    error,
    setCurrentBrand,
    refreshBrands
  }

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export const useBrand = (): BrandContextValue => {
  const context = React.useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}
