import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UVPFormula, UVPComponent, ValueStatement, UVPGenerator } from '@/services/uvp/uvp-generator'
import { ValueStatementCard } from './ValueStatementCard'
import { Sparkles, Lightbulb, Target, Plus } from 'lucide-react'

interface UVPBuilderProps {
  components: UVPComponent[]
  brandData: any
  personas: any[]
  onSaveStatement?: (statement: ValueStatement) => void
  className?: string
}

export const UVPBuilder: React.FC<UVPBuilderProps> = ({
  components,
  brandData,
  personas,
  onSaveStatement,
  className,
}) => {
  const [selectedFormula, setSelectedFormula] = React.useState<UVPFormula | null>(null)
  const [generatedStatements, setGeneratedStatements] = React.useState<ValueStatement[]>([])
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleGenerateAll = async () => {
    setIsGenerating(true)
    try {
      const statements = UVPGenerator.generateValueStatements(components, brandData, personas)
      setGeneratedStatements(statements)
    } catch (error) {
      console.error('Failed to generate statements:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateFromFormula = (formula: UVPFormula) => {
    setSelectedFormula(formula)
    // Generate a single statement using this formula
    const statements = UVPGenerator.generateValueStatements(components, brandData, personas)
    const statement = statements.find((s) => s.headline.includes(formula.placeholders[0]))
    if (statement) {
      setGeneratedStatements([statement, ...generatedStatements])
    }
  }

  const handleOptimize = (statement: ValueStatement) => {
    const optimized = UVPGenerator.optimizeUVP(statement, components, [])
    setGeneratedStatements(generatedStatements.map((s) => (s.id === statement.id ? optimized : s)))
  }

  const handleDelete = (id: string) => {
    setGeneratedStatements(generatedStatements.filter((s) => s.id !== id))
  }

  const handleDuplicate = (statement: ValueStatement) => {
    const duplicate = {
      ...statement,
      id: `${statement.id}-copy-${Date.now()}`,
      headline: `${statement.headline} (Copy)`,
    }
    setGeneratedStatements([duplicate, ...generatedStatements])
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>UVP Builder</CardTitle>
            </div>
            <Button size="sm" onClick={handleGenerateAll} disabled={isGenerating}>
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formula Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <h3 className="font-semibold">UVP Formulas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {UVPGenerator.FORMULAS.map((formula) => (
                <Card key={formula.name} className="p-4 hover:border-primary cursor-pointer transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{formula.name}</h4>
                        <p className="text-xs text-muted-foreground">{formula.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerateFromFormula(formula)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-xs font-mono bg-muted p-2 rounded">
                      {formula.template}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Example:</p>
                      <p className="text-xs italic">{formula.example}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {formula.best_for.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Generated Statements */}
          {generatedStatements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Generated Value Propositions</h3>

              <div className="space-y-4">
                {generatedStatements.map((statement) => (
                  <div key={statement.id} className="relative">
                    <ValueStatementCard
                      statement={statement}
                      onUpdate={(updated) => {
                        setGeneratedStatements(
                          generatedStatements.map((s) => (s.id === statement.id ? updated : s))
                        )
                      }}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                    />

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOptimize(statement)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Optimize
                      </Button>
                      {onSaveStatement && (
                        <Button size="sm" onClick={() => onSaveStatement(statement)}>
                          Save to Library
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedStatements.length === 0 && (
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-2">No value propositions generated yet</p>
              <p className="text-sm text-muted-foreground">
                Click "Generate All" or select a formula to create UVPs
              </p>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
