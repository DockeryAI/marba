import * as React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApiConfig, ApiProvider, CostCalculationMethod } from '@/types/api-admin.types'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

interface ApiConfigFormProps {
  config?: Partial<ApiConfig>
  onSave: (config: Partial<ApiConfig>) => Promise<void>
  onCancel: () => void
  className?: string
}

const PROVIDER_OPTIONS: Array<{ value: ApiProvider; label: string }> = [
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google' },
  { value: 'other', label: 'Other' },
]

const COST_METHOD_OPTIONS: Array<{ value: CostCalculationMethod; label: string }> = [
  { value: 'per_request', label: 'Per Request' },
  { value: 'per_token', label: 'Per Token' },
  { value: 'tiered', label: 'Tiered Pricing' },
  { value: 'custom', label: 'Custom' },
]

export const ApiConfigForm: React.FC<ApiConfigFormProps> = ({
  config,
  onSave,
  onCancel,
  className,
}) => {
  const [formData, setFormData] = React.useState<Partial<ApiConfig>>({
    provider: 'openrouter',
    api_name: '',
    api_key: '',
    api_secret: '',
    endpoint_url: '',
    rate_limits: {
      per_minute: 60,
      per_day: 10000,
    },
    monthly_budget_limit: 100,
    cost_structure: {
      calculation_method: 'per_request',
      cost_per_request: 0.001,
      cost_per_1k_tokens: 0.002,
    },
    is_active: true,
    is_test_mode: false,
    ...config,
  })

  const [showApiKey, setShowApiKey] = React.useState(false)
  const [showApiSecret, setShowApiSecret] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const updateFormData = (updates: Partial<ApiConfig>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const updateRateLimits = (field: 'per_minute' | 'per_day', value: string) => {
    setFormData((prev) => ({
      ...prev,
      rate_limits: {
        ...prev.rate_limits!,
        [field]: parseInt(value) || 0,
      },
    }))
  }

  const updateCostStructure = (updates: Partial<ApiConfig['cost_structure']>) => {
    setFormData((prev) => ({
      ...prev,
      cost_structure: {
        ...prev.cost_structure!,
        ...updates,
      },
    }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.api_name?.trim()) {
      newErrors.api_name = 'API name is required'
    }

    if (!formData.api_key?.trim()) {
      newErrors.api_key = 'API key is required'
    }

    if (!formData.rate_limits?.per_minute || formData.rate_limits.per_minute < 1) {
      newErrors.per_minute = 'Must be at least 1'
    }

    if (!formData.rate_limits?.per_day || formData.rate_limits.per_day < 1) {
      newErrors.per_day = 'Must be at least 1'
    }

    if (!formData.monthly_budget_limit || formData.monthly_budget_limit < 0) {
      newErrors.monthly_budget_limit = 'Must be 0 or greater'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSaving(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving API config:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {config?.id ? 'Edit API Configuration' : 'Add API Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider & Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) =>
                  updateFormData({ provider: value as ApiProvider })
                }
              >
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_name">
                API Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="api_name"
                value={formData.api_name}
                onChange={(e) => updateFormData({ api_name: e.target.value })}
                placeholder="e.g., OpenRouter Production"
              />
              {errors.api_name && (
                <p className="text-sm text-destructive">{errors.api_name}</p>
              )}
            </div>
          </div>

          {/* API Credentials */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api_key">
                API Key <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="api_key"
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.api_key}
                  onChange={(e) => updateFormData({ api_key: e.target.value })}
                  placeholder="Enter API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.api_key && (
                <p className="text-sm text-destructive">{errors.api_key}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_secret">API Secret (Optional)</Label>
              <div className="relative">
                <Input
                  id="api_secret"
                  type={showApiSecret ? 'text' : 'password'}
                  value={formData.api_secret || ''}
                  onChange={(e) => updateFormData({ api_secret: e.target.value })}
                  placeholder="Enter API secret if required"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowApiSecret(!showApiSecret)}
                >
                  {showApiSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint_url">Endpoint URL (Optional)</Label>
              <Input
                id="endpoint_url"
                value={formData.endpoint_url || ''}
                onChange={(e) => updateFormData({ endpoint_url: e.target.value })}
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>

          {/* Rate Limits */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Rate Limits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="per_minute">Requests Per Minute</Label>
                <Input
                  id="per_minute"
                  type="number"
                  min="1"
                  value={formData.rate_limits?.per_minute || ''}
                  onChange={(e) => updateRateLimits('per_minute', e.target.value)}
                />
                {errors.per_minute && (
                  <p className="text-sm text-destructive">{errors.per_minute}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="per_day">Requests Per Day</Label>
                <Input
                  id="per_day"
                  type="number"
                  min="1"
                  value={formData.rate_limits?.per_day || ''}
                  onChange={(e) => updateRateLimits('per_day', e.target.value)}
                />
                {errors.per_day && (
                  <p className="text-sm text-destructive">{errors.per_day}</p>
                )}
              </div>
            </div>
          </div>

          {/* Budget & Cost */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget Limit ($)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthly_budget_limit || ''}
                onChange={(e) =>
                  updateFormData({ monthly_budget_limit: parseFloat(e.target.value) || 0 })
                }
              />
              {errors.monthly_budget_limit && (
                <p className="text-sm text-destructive">{errors.monthly_budget_limit}</p>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Cost Structure</h4>

              <div className="space-y-2">
                <Label htmlFor="cost_method">Cost Calculation Method</Label>
                <Select
                  value={formData.cost_structure?.calculation_method}
                  onValueChange={(value) =>
                    updateCostStructure({
                      calculation_method: value as CostCalculationMethod,
                    })
                  }
                >
                  <SelectTrigger id="cost_method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COST_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.cost_structure?.calculation_method === 'per_request' && (
                <div className="space-y-2">
                  <Label htmlFor="cost_per_request">Cost Per Request ($)</Label>
                  <Input
                    id="cost_per_request"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={formData.cost_structure?.cost_per_request || ''}
                    onChange={(e) =>
                      updateCostStructure({
                        cost_per_request: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}

              {formData.cost_structure?.calculation_method === 'per_token' && (
                <div className="space-y-2">
                  <Label htmlFor="cost_per_1k_tokens">Cost Per 1K Tokens ($)</Label>
                  <Input
                    id="cost_per_1k_tokens"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={formData.cost_structure?.cost_per_1k_tokens || ''}
                    onChange={(e) =>
                      updateCostStructure({
                        cost_per_1k_tokens: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Settings</h4>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  updateFormData({ is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Is Active
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_test_mode"
                checked={formData.is_test_mode}
                onCheckedChange={(checked) =>
                  updateFormData({ is_test_mode: checked as boolean })
                }
              />
              <Label htmlFor="is_test_mode" className="cursor-pointer">
                Is Test Mode
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {config?.id ? 'Update' : 'Create'} Configuration
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
