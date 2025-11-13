/**
 * UVP Wizard Main Component
 *
 * Main orchestrator for the UVP wizard. Manages wizard flow, step navigation,
 * and integrates all wizard screens and components.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useUVPWizard } from '@/contexts/UVPWizardContext'
import { getStepConfig, WIZARD_STEPS } from '@/config/uvp-wizard-steps'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { SimpleWizardStepScreen } from './screens/SimpleWizardStepScreen'
import { WizardProgress } from './WizardProgress'
import { CompetitorGapWidget } from './CompetitorGapWidget'
import { Sparkles, Target, Users, Lightbulb, Trophy, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * UVPWizard component props
 */
interface UVPWizardProps {
  brandName?: string
  industry?: string
  onComplete?: () => void
  className?: string
}

/**
 * UVP Wizard Component
 */
export const UVPWizard: React.FC<UVPWizardProps> = ({
  brandName,
  industry,
  onComplete,
  className,
}) => {
  const {
    uvp,
    progress,
    is_loading,
    available_suggestions,
    updateField,
    goNext,
    goBack,
    goToStep,
    generateSuggestions,
  } = useUVPWizard()

  console.log('[UVPWizard] Rendering with:', {
    currentStep: progress.current_step,
    progress,
    uvp,
    is_loading,
    available_suggestions: available_suggestions?.length || 0,
    brandName,
    industry
  })

  const currentStepConfig = getStepConfig(progress.current_step)
  console.log('[UVPWizard] Current step config:', currentStepConfig)

  // Auto-generate suggestions when step changes
  React.useEffect(() => {
    console.log('[UVPWizard] Step changed to:', progress.current_step, {
      supports_ai: currentStepConfig.supports_ai_suggestions,
      available_suggestions: available_suggestions.length,
      shouldGenerate: currentStepConfig.supports_ai_suggestions && !is_loading
    })
    if (currentStepConfig.supports_ai_suggestions && !is_loading) {
      console.log('[UVPWizard] Triggering suggestion generation for step:', progress.current_step)
      generateSuggestions()
    }
  }, [progress.current_step])

  // Handle completion
  React.useEffect(() => {
    if (progress.current_step === 'complete' && onComplete) {
      onComplete()
    }
  }, [progress.current_step, onComplete])

  // Render current step
  const renderStep = () => {
    console.log('[UVPWizard] renderStep called with step:', progress.current_step)
    switch (progress.current_step) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStart={goNext}
            brandName={brandName}
            industry={industry}
          />
        )

      case 'target-customer':
        console.log('[UVPWizard] Passing to SimpleWizardStepScreen:', {
          available_suggestions,
          suggestionsCount: available_suggestions?.length,
          suggestionsArray: available_suggestions
        })
        return (
          <SimpleWizardStepScreen
            config={currentStepConfig}
            value={uvp.target_customer || ''}
            onChange={(value) => updateField('target_customer', value)}
            suggestions={available_suggestions || []}
            onGenerateSuggestions={generateSuggestions}
            onNext={goNext}
            onBack={goBack}
            canGoNext={progress.can_go_forward}
            canGoBack={progress.can_go_back}
            isGenerating={is_loading}
            showProgress
            progressPercentage={progress.progress_percentage}
          />
        )

      case 'customer-problem':
        return (
          <SimpleWizardStepScreen
            config={currentStepConfig}
            value={uvp.customer_problem || ''}
            onChange={(value) => updateField('customer_problem', value)}
            suggestions={available_suggestions || []}
            onGenerateSuggestions={generateSuggestions}
            onNext={goNext}
            onBack={goBack}
            canGoNext={progress.can_go_forward}
            canGoBack={progress.can_go_back}
            isGenerating={is_loading}
            showProgress
            progressPercentage={progress.progress_percentage}
          />
        )

      case 'unique-solution':
        return (
          <div className="space-y-4">
            {/* Competitor Gap Widget */}
            <CompetitorGapWidget
              industry={industry}
              competitors={uvp.competitors || []}
            />

            <SimpleWizardStepScreen
              config={currentStepConfig}
              value={uvp.unique_solution || ''}
              onChange={(value) => {
                // Update both solution and differentiation fields
                updateField('unique_solution', value)
                // Also save to differentiation for backward compatibility
                updateField('differentiation', value)
              }}
              suggestions={available_suggestions || []}
              onGenerateSuggestions={generateSuggestions}
              onNext={goNext}
              onBack={goBack}
              canGoNext={progress.can_go_forward}
              canGoBack={progress.can_go_back}
              isGenerating={is_loading}
              showProgress
              progressPercentage={progress.progress_percentage}
            />
          </div>
        )

      case 'key-benefit':
        return (
          <SimpleWizardStepScreen
            config={currentStepConfig}
            value={uvp.key_benefit || ''}
            onChange={(value) => updateField('key_benefit', value)}
            suggestions={available_suggestions || []}
            onGenerateSuggestions={generateSuggestions}
            onNext={goNext}
            onBack={goBack}
            canGoNext={progress.can_go_forward}
            canGoBack={progress.can_go_back}
            isGenerating={is_loading}
            showProgress
            progressPercentage={progress.progress_percentage}
          />
        )

      // Differentiation step is now combined with unique-solution

      case 'review':
        return <ReviewScreen uvp={uvp} onNext={goNext} onBack={goBack} onEdit={goToStep} />

      case 'complete':
        return <CompleteScreen uvp={uvp} brandName={brandName} />

      default:
        return null
    }
  }

  return (
    <div className={cn('bg-background', className)} data-uvp-wizard>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Full Progress Bar - Only show after welcome */}
          {progress.current_step !== 'welcome' &&
            progress.current_step !== 'complete' && (
              <div className="mb-8">
                <WizardProgress progress={progress} onStepClick={goToStep} />
              </div>
            )}

          {/* Step Content */}
          <div className="bg-card rounded-lg border shadow-sm p-8">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Review Screen - Show all UVP components
 */
interface ReviewScreenProps {
  uvp: any
  onNext: () => void
  onBack: () => void
  onEdit: (step: any) => void
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ uvp, onNext, onBack, onEdit }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your UVP</h2>
        <p className="text-muted-foreground">
          Review your complete value proposition below. You can edit any section by clicking on it.
        </p>
      </div>

      <div className="space-y-4">
        <ReviewCard
          title="Target Customer"
          content={uvp.target_customer}
          onEdit={() => onEdit('target-customer')}
        />
        <ReviewCard
          title="Customer Problem"
          content={uvp.customer_problem}
          onEdit={() => onEdit('customer-problem')}
        />
        <ReviewCard
          title="Unique Solution"
          content={uvp.unique_solution}
          onEdit={() => onEdit('unique-solution')}
        />
        <ReviewCard
          title="Key Benefit"
          content={uvp.key_benefit}
          onEdit={() => onEdit('key-benefit')}
        />
        {uvp.differentiation && (
          <ReviewCard
            title="Differentiation"
            content={uvp.differentiation}
            onEdit={() => onEdit('unique-solution')}
          />
        )}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button onClick={onBack} className="px-4 py-2 border rounded hover:bg-accent">
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Complete UVP
        </button>
      </div>
    </div>
  )
}

/**
 * Review Card Component
 */
const ReviewCard: React.FC<{ title: string; content: string; onEdit: () => void }> = ({
  title,
  content,
  onEdit,
}) => (
  <button
    onClick={onEdit}
    className="w-full text-left p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
  >
    <h3 className="font-semibold text-sm mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{content}</p>
  </button>
)

/**
 * Complete Screen - Celebration and next steps
 */
interface CompleteScreenProps {
  uvp: any
  brandName?: string
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ uvp, brandName }) => {
  const [showVennDiagram, setShowVennDiagram] = React.useState(false)
  const [showWWH, setShowWWH] = React.useState(false)

  React.useEffect(() => {
    console.log('[CompleteScreen] Mounted with UVP:', uvp)
    console.log('[CompleteScreen] UVP fields:', {
      target_customer: uvp.target_customer,
      customer_problem: uvp.customer_problem,
      unique_solution: uvp.unique_solution,
      key_benefit: uvp.key_benefit,
      differentiation: uvp.differentiation
    })
    console.log('[CompleteScreen] Starting reveal animations - showing Venn and WWH')

    // Force show immediately - no delays for debugging
    setShowVennDiagram(true)
    setShowWWH(true)

    // Keep the timers for animation effect but they're not needed for display
    const timer1 = setTimeout(() => {
      console.log('[CompleteScreen] Venn diagram should be visible now')
    }, 300)
    const timer2 = setTimeout(() => {
      console.log('[CompleteScreen] WWH framework should be visible now')
    }, 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="space-y-8 pb-12">
      {/* Celebration Header */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Your UVP is Complete!</h2>
        <p className="text-muted-foreground">
          {brandName ? `${brandName}'s value proposition is ready` : 'Your value proposition is ready'}
        </p>
      </motion.div>

      {/* UVP Statement Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Your Unique Value Proposition</h3>
              <p className="text-sm leading-relaxed">
                For <span className="font-medium text-primary">{uvp.target_customer}</span> who{' '}
                <span className="font-medium">{uvp.customer_problem}</span>, our{' '}
                <span className="font-medium text-primary">{uvp.unique_solution}</span> provides{' '}
                <span className="font-medium">{uvp.key_benefit}</span>.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Venn Diagram Reveal */}
      <AnimatePresence>
        {showVennDiagram && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <Card className="p-8">
              <h3 className="text-lg font-semibold mb-6 text-center">Your UVP Sweet Spot</h3>

              {/* Venn Diagram */}
              <div className="relative w-full max-w-lg mx-auto h-80">
                {/* Customer Needs Circle */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute left-0 top-8 w-52 h-52 rounded-full bg-blue-500/30 border-2 border-blue-500"
                >
                  <div className="absolute top-4 left-4 right-4">
                    <Users className="h-5 w-5 text-blue-600 mb-1" />
                    <p className="text-xs font-medium text-blue-900">Customer Needs</p>
                    <p className="text-xs text-blue-700 mt-1">{uvp.customer_problem?.slice(0, 50)}...</p>
                  </div>
                </motion.div>

                {/* Your Solution Circle */}
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute right-0 top-8 w-52 h-52 rounded-full bg-green-500/30 border-2 border-green-500"
                >
                  <div className="absolute top-4 right-4 left-4 text-right">
                    <Lightbulb className="h-5 w-5 text-green-600 mb-1 ml-auto" />
                    <p className="text-xs font-medium text-green-900">Your Solution</p>
                    <p className="text-xs text-green-700 mt-1">{uvp.unique_solution?.slice(0, 50)}...</p>
                  </div>
                </motion.div>

                {/* Competitor Gap Circle */}
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 w-52 h-52 rounded-full bg-purple-500/30 border-2 border-purple-500"
                >
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <Target className="h-5 w-5 text-purple-600 mb-1 mx-auto" />
                    <p className="text-xs font-medium text-purple-900">Market Gap</p>
                    <p className="text-xs text-purple-700 mt-1">Our unique approach</p>
                  </div>
                </motion.div>

                {/* Center Sweet Spot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center"
                >
                  <Trophy className="h-8 w-8 text-primary" />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                Your UVP sits at the perfect intersection of customer needs, your unique capabilities, and market opportunity
              </motion.p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced WWH Framework */}
      <AnimatePresence>
        {showWWH && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Your Enhanced WWH Framework
              </h3>

              <div className="space-y-4">
                {/* Why */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">WHY</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Your Purpose</p>
                    <p className="text-sm text-muted-foreground">
                      We exist to help {uvp.target_customer} overcome {uvp.customer_problem}
                      and achieve {uvp.key_benefit}.
                    </p>
                  </div>
                </div>

                {/* What */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">WHAT</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Your Solution</p>
                    <p className="text-sm text-muted-foreground">
                      {uvp.unique_solution} that delivers {uvp.key_benefit}.
                    </p>
                  </div>
                </div>

                {/* How */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600">HOW</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Your Approach</p>
                    <p className="text-sm text-muted-foreground">
                      Through our unique approach: {uvp.differentiation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Steps */}
      {showWWH && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-6"
        >
          <p className="text-sm text-muted-foreground mb-4">
            ✨ The full MARBA framework is now unlocked and powered by your UVP!
          </p>
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
            Continue to MARBA Framework
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
