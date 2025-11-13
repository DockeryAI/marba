/**
 * Customer Definition Step
 * Define Ideal Customer Profile (ICP)
 */

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'
import { useBuyerJourney } from '@/contexts/BuyerJourneyContext'
import type { IdealCustomerProfile } from '@/types/buyer-journey'

export const CustomerDefinitionStep: React.FC = () => {
  const { journeyMap, updateICP } = useBuyerJourney()

  const [icp, setIcp] = useState<IdealCustomerProfile>(
    journeyMap.ideal_customer_profile || {
      segment_name: '',
      demographics: {
        age_range: '',
        income_range: '',
        location_type: '',
        occupation: '',
        household_size: '',
      },
      psychographics: {
        values: [],
        personality_traits: [],
        lifestyle: [],
        interests: [],
      },
      pain_points: [],
      goals: [],
      buying_triggers: [],
      decision_criteria: [],
    }
  )

  // Auto-save on change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateICP(icp)
    }, 500)
    return () => clearTimeout(timer)
  }, [icp, updateICP])

  const addListItem = (field: keyof IdealCustomerProfile, value: string) => {
    if (!value.trim()) return
    const currentArray = icp[field] as string[]
    setIcp(prev => ({
      ...prev,
      [field]: [...currentArray, value],
    }))
  }

  const removeListItem = (field: keyof IdealCustomerProfile, index: number) => {
    const currentArray = icp[field] as string[]
    setIcp(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Segment Name */}
      <div>
        <Label htmlFor="segment_name">Customer Segment Name</Label>
        <Input
          id="segment_name"
          placeholder="e.g., Busy Homeowners, Growth-Stage Startups"
          value={icp.segment_name}
          onChange={e =>
            setIcp(prev => ({ ...prev, segment_name: e.target.value }))
          }
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Give this customer segment a memorable name
        </p>
      </div>

      {/* Demographics */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Demographics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age_range">Age Range</Label>
            <Input
              id="age_range"
              placeholder="e.g., 35-55"
              value={icp.demographics.age_range}
              onChange={e =>
                setIcp(prev => ({
                  ...prev,
                  demographics: { ...prev.demographics, age_range: e.target.value },
                }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="income_range">Income Range</Label>
            <Input
              id="income_range"
              placeholder="e.g., $60k-$100k"
              value={icp.demographics.income_range}
              onChange={e =>
                setIcp(prev => ({
                  ...prev,
                  demographics: {
                    ...prev.demographics,
                    income_range: e.target.value,
                  },
                }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location_type">Location Type</Label>
            <Input
              id="location_type"
              placeholder="e.g., Suburban families"
              value={icp.demographics.location_type}
              onChange={e =>
                setIcp(prev => ({
                  ...prev,
                  demographics: {
                    ...prev.demographics,
                    location_type: e.target.value,
                  },
                }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              placeholder="e.g., Small business owners"
              value={icp.demographics.occupation}
              onChange={e =>
                setIcp(prev => ({
                  ...prev,
                  demographics: {
                    ...prev.demographics,
                    occupation: e.target.value,
                  },
                }))
              }
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Pain Points */}
      <ListInput
        label="Top Pain Points"
        description="What problems or frustrations do they have?"
        items={icp.pain_points}
        onAdd={value => addListItem('pain_points', value)}
        onRemove={index => removeListItem('pain_points', index)}
        placeholder="e.g., Not enough time to handle home maintenance"
      />

      {/* Goals */}
      <ListInput
        label="Goals & Desires"
        description="What are they trying to achieve?"
        items={icp.goals}
        onAdd={value => addListItem('goals', value)}
        onRemove={index => removeListItem('goals', index)}
        placeholder="e.g., Maintain property value without hassle"
      />

      {/* Buying Triggers */}
      <ListInput
        label="Buying Triggers"
        description="What prompts them to make a purchase?"
        items={icp.buying_triggers}
        onAdd={value => addListItem('buying_triggers', value)}
        onRemove={index => removeListItem('buying_triggers', index)}
        placeholder="e.g., Emergency situation, seasonal maintenance"
      />
    </div>
  )
}

// Helper component for list inputs
const ListInput: React.FC<{
  label: string
  description: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  placeholder: string
}> = ({ label, description, items, onAdd, onRemove, placeholder }) => {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    onAdd(input)
    setInput('')
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-1">{label}</h3>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>

      <div className="flex gap-2 mb-3">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <Button type="button" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
          >
            <span className="text-sm">{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items added yet
          </p>
        )}
      </div>
    </Card>
  )
}
