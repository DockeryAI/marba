import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MirrorSection {
  id: string
  label: string
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
}

export const MirrorLayout: React.FC<MirrorLayoutProps> = ({
  children,
  sections,
  currentSection,
  onSectionChange,
  className,
  sidebarCollapsible = true,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const currentSectionData = sections.find(s => s.id === currentSection)

  return (
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
            return (
              <div key={section.id}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    sidebarCollapsed && 'justify-center px-0'
                  )}
                  onClick={() => onSectionChange(section.id)}
                >
                  {section.icon && (
                    <span className="shrink-0">{section.icon}</span>
                  )}
                  {!sidebarCollapsed && (
                    <span className="truncate">
                      <span className="text-blue-600 font-semibold">{section.label[0]}</span>
                      {section.label.slice(1)}
                    </span>
                  )}
                </Button>

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
                            // Scroll to subsection
                            const element = document.getElementById(sub.id)
                            element?.scrollIntoView({ behavior: 'smooth' })
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
