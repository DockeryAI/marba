import * as React from 'react'
import { UVPBuilder } from './UVPBuilder'
import { ComponentMatrix } from './ComponentMatrix'
import { CompetitiveComparison } from './CompetitiveComparison'
import { ValueStatementCard } from './ValueStatementCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { UVPComponent, ValueStatement, UVPGenerator } from '@/services/uvp/uvp-generator'
import { supabase } from '@/lib/supabase'
import { Sparkles, Target, Package, Swords, Save } from 'lucide-react'

interface UVPSectionProps {
  brandId: string
  brandData: any
  objectives: any[]
  differentiators: any[]
  personas: any[]
  competitors: any[]
  className?: string
}

export const UVPSection: React.FC<UVPSectionProps> = ({
  brandId,
  brandData,
  objectives,
  differentiators,
  personas,
  competitors,
  className,
}) => {
  const [components, setComponents] = React.useState<UVPComponent[]>([])
  const [savedStatements, setSavedStatements] = React.useState<ValueStatement[]>([])
  const [selectedStatement, setSelectedStatement] = React.useState<ValueStatement | null>(null)
  const [activeTab, setActiveTab] = React.useState('builder')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    loadUVPData()
  }, [brandId])

  React.useEffect(() => {
    if (objectives.length > 0 || differentiators.length > 0 || personas.length > 0) {
      generateComponents()
    }
  }, [objectives, differentiators, personas])

  const loadUVPData = async () => {
    setIsLoading(true)
    try {
      // Load saved value statements
      const { data, error } = await supabase
        .from('value_statements')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setSavedStatements(data)
        if (data.length > 0) {
          setSelectedStatement(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to load UVP data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateComponents = () => {
    const generated = UVPGenerator.generateComponents({
      brandData,
      objectives,
      differentiators,
      personas,
    })
    setComponents(generated)
  }

  const handleSaveStatement = async (statement: ValueStatement) => {
    try {
      const { data, error } = await supabase
        .from('value_statements')
        .insert({
          brand_id: brandId,
          headline: statement.headline,
          subheadline: statement.subheadline,
          supporting_points: statement.supporting_points,
          call_to_action: statement.call_to_action,
          clarity_score: statement.clarity_score,
          conversion_potential: statement.conversion_potential,
          synapse_score: statement.synapse_score,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (!error && data) {
        setSavedStatements([data, ...savedStatements])
        setSelectedStatement(data)
      }
    } catch (error) {
      console.error('Failed to save statement:', error)
    }
  }

  const handleUpdateStatement = async (statement: ValueStatement) => {
    try {
      const { error } = await supabase
        .from('value_statements')
        .update({
          headline: statement.headline,
          subheadline: statement.subheadline,
          supporting_points: statement.supporting_points,
          call_to_action: statement.call_to_action,
          clarity_score: statement.clarity_score,
          conversion_potential: statement.conversion_potential,
          synapse_score: statement.synapse_score,
        })
        .eq('id', statement.id)

      if (!error) {
        setSavedStatements(savedStatements.map((s) => (s.id === statement.id ? statement : s)))
        if (selectedStatement?.id === statement.id) {
          setSelectedStatement(statement)
        }
      }
    } catch (error) {
      console.error('Failed to update statement:', error)
    }
  }

  const handleDeleteStatement = async (id: string) => {
    try {
      const { error } = await supabase.from('value_statements').delete().eq('id', id)

      if (!error) {
        setSavedStatements(savedStatements.filter((s) => s.id !== id))
        if (selectedStatement?.id === id) {
          setSelectedStatement(savedStatements[0] || null)
        }
      }
    } catch (error) {
      console.error('Failed to delete statement:', error)
    }
  }

  const handleSetPrimary = async (statement: ValueStatement) => {
    // Update all statements to non-primary, then set the selected one as primary
    try {
      await supabase
        .from('value_statements')
        .update({ is_primary: false })
        .eq('brand_id', brandId)

      await supabase
        .from('value_statements')
        .update({ is_primary: true })
        .eq('id', statement.id)

      setSelectedStatement(statement)
    } catch (error) {
      console.error('Failed to set primary statement:', error)
    }
  }

  const competitorUVPs = competitors.map((c) => ({
    name: c.name || 'Competitor',
    uvp: c.value_proposition || 'Generic value proposition',
  }))

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Unique Value Proposition</h2>
            <p className="text-muted-foreground">
              Create and optimize your value propositions with AI-powered insights
            </p>
          </div>
          <Button onClick={generateComponents} disabled={isLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            Regenerate Components
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="competitive" className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Competitive
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="mt-6">
          <UVPBuilder
            components={components}
            brandData={brandData}
            personas={personas}
            onSaveStatement={handleSaveStatement}
          />
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="mt-6">
          <ComponentMatrix components={components} onRefresh={generateComponents} />
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="mt-6 space-y-4">
          {savedStatements.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-2">No saved value propositions yet</p>
              <p className="text-sm text-muted-foreground">
                Create UVPs in the Builder tab and save them to your library
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {savedStatements.map((statement) => (
                <div key={statement.id} className="relative">
                  <ValueStatementCard
                    statement={statement}
                    onUpdate={handleUpdateStatement}
                    onDelete={handleDeleteStatement}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={selectedStatement?.id === statement.id ? 'default' : 'outline'}
                      onClick={() => handleSetPrimary(statement)}
                    >
                      {selectedStatement?.id === statement.id ? 'Primary UVP' : 'Set as Primary'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Competitive Tab */}
        <TabsContent value="competitive" className="mt-6">
          {selectedStatement ? (
            <CompetitiveComparison yourUVP={selectedStatement} competitors={competitorUVPs} />
          ) : (
            <div className="text-center py-12">
              <Swords className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-2">Select a UVP to analyze competitive positioning</p>
              <p className="text-sm text-muted-foreground">
                Create and save a value proposition first, then compare it with competitors
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
