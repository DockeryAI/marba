import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'

interface MirrorSection {
  id: string
  label: string
  tooltip?: string
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'teal'
  locked?: boolean
  icon?: React.ReactNode
  subsections?: {
    id: string
    label: string
  }[]
}

interface MirrorLayoutProps {
  children: React.ReactNode
  sections: MirrorSection[]
  currentSection: string
  onSectionChange: (sectionId: string) => void
  className?: string
  sidebarCollapsible?: boolean
  sidebarCTA?: React.ReactNode
}

export const MirrorLayout: React.FC<MirrorLayoutProps> = ({
  children,
  sections,
  currentSection,
  onSectionChange,
  className,
  sidebarCollapsible = true,
  sidebarCTA,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true)

  const currentSectionData = sections.find(s => s.id === currentSection)

  // Color mapping for MARBA sections
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    teal: 'text-teal-600 dark:text-teal-400',
  }

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'border-r bg-muted/10 transition-all duration-300 flex flex-col',
            sidebarCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {/* Section Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {sections.map((section) => {
              const isActive = section.id === currentSection
              const colorClass = section.color ? colorClasses[section.color] : colorClasses.blue

              const buttonContent = (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2 relative',
                    sidebarCollapsed && 'justify-center px-0',
                    section.locked && 'opacity-60'
                  )}
                  onClick={() => !section.locked && onSectionChange(section.id)}
                  disabled={section.locked}
                >
                  {section.icon && (
                    <span className="shrink-0">{section.icon}</span>
                  )}
                  {!sidebarCollapsed && (
                    <span className="truncate flex items-center gap-2">
                      <span>
                        <span className={cn('text-2xl font-bold', colorClass)}>
                          {section.label[0]}
                        </span>
                        <span className="text-base">
                          {section.label.slice(1)}
                        </span>
                      </span>
                      {section.locked && (
                        <Lock className="h-3 w-3 text-muted-foreground ml-auto" />
                      )}
                    </span>
                  )}
                  {sidebarCollapsed && (
                    <span className={cn('text-xl font-bold', colorClass)}>
                      {section.label[0]}
                    </span>
                  )}
                </Button>
              )

              return (
                <div key={section.id}>
                  {section.tooltip ? (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        {buttonContent}
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        className="max-w-xs ml-2"
                      >
                        <p className="font-semibold">{section.label}</p>
                        <p className="text-sm text-muted-foreground">{section.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    buttonContent
                  )}

                  {/* Subsections */}
                  {!sidebarCollapsed &&
                    isActive &&
                    section.subsections &&
                    section.subsections.length > 0 && (
                      <div className="mt-1 ml-4 space-y-1">
                        {section.subsections.map((sub) => (
                          <Button
                            key={sub.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => {
                              // Dispatch custom event to open accordion
                              window.dispatchEvent(
                                new CustomEvent('mirrorSubsectionClick', {
                                  detail: { sectionId: sub.id },
                                })
                              )
                              // Scroll to subsection with delay for accordion animation
                              setTimeout(() => {
                                const element = document.getElementById(sub.id)
                                element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                              }, 300)
                            }}
                          >
                            {sub.label}
                          </Button>
                        ))}
                      </div>
                    )}
                </div>
              )
            })}
          </nav>

        {/* Sidebar CTA (e.g., UVP prompt) */}
        {!sidebarCollapsed && sidebarCTA && (
          <div className="p-4 border-t">
            {sidebarCTA}
          </div>
        )}

        {/* Collapse Toggle */}
        {sidebarCollapsible && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={cn('flex-1 overflow-y-auto', className)}>
        {children}
      </main>
    </div>
    </TooltipProvider>
  )
}

// Section Header Component
interface MirrorSectionHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const MirrorSectionHeader: React.FC<MirrorSectionHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  className,
}) => {
  return (
    <div className={cn('border-b bg-background sticky top-0 z-10', className)}>
      <div className="container py-6 px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {badge}
            </div>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
