import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Cloud,
  TrendingUp,
  Users,
  Calendar,
  Newspaper,
  Zap,
  Clock,
  Target,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { OpportunityInsight } from '@/types/intelligence.types'
import { cn } from '@/lib/utils'

interface OpportunityCardProps {
  opportunity: OpportunityInsight
  onDismiss?: () => void
  onTakeAction?: (actionIndex: number) => void
  className?: string
}

const typeIcons = {
  weather_based: <Cloud className="h-4 w-4" />,
  trending_topic: <TrendingUp className="h-4 w-4" />,
  competitor_move: <Users className="h-4 w-4" />,
  seasonal_event: <Calendar className="h-4 w-4" />,
  local_news: <Newspaper className="h-4 w-4" />,
  keyword_opportunity: <Target className="h-4 w-4" />,
  review_response: <Sparkles className="h-4 w-4" />,
  industry_shift: <TrendingUp className="h-4 w-4" />,
  audience_behavior: <Users className="h-4 w-4" />,
  platform_update: <Zap className="h-4 w-4" />,
}

const urgencyColors = {
  critical: 'border-destructive bg-destructive/5',
  high: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
  medium: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
  low: 'border-muted',
}

const urgencyBadgeVariants = {
  critical: 'destructive' as const,
  high: 'warning' as const,
  medium: 'secondary' as const,
  low: 'outline' as const,
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onDismiss,
  onTakeAction,
  className,
}) => {
  const [showActions, setShowActions] = React.useState(false)

  const timeUntilExpiration = opportunity.expires_at
    ? getTimeUntilExpiration(opportunity.expires_at)
    : null

  const icon = typeIcons[opportunity.type] || <Zap className="h-4 w-4" />

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-l-4 transition-all hover:shadow-md',
        urgencyColors[opportunity.urgency],
        className
      )}
    >
      {/* Dismiss Button */}
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 z-10"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      <CardHeader className="pb-3 pr-10">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>

          {/* Title and Badges */}
          <div className="flex-1 space-y-2">
            <CardTitle className="text-base leading-tight">
              {opportunity.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={urgencyBadgeVariants[opportunity.urgency]}>
                {opportunity.urgency}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {opportunity.type.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Impact: {opportunity.impact_score}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {Math.round(opportunity.confidence * 100)}% confident
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {opportunity.description}
        </p>

        {/* Expiration Timer */}
        {timeUntilExpiration && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <Clock className="h-3 w-3" />
            <span>Expires {timeUntilExpiration}</span>
          </div>
        )}

        {/* Source */}
        <div className="text-xs text-muted-foreground">
          Source: {opportunity.source.replace(/_/g, ' ')}
        </div>

        {/* Suggested Actions */}
        {opportunity.suggested_actions.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => setShowActions(!showActions)}
            >
              <span className="text-xs font-medium">
                {opportunity.suggested_actions.length} suggested action
                {opportunity.suggested_actions.length > 1 ? 's' : ''}
              </span>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  showActions && 'rotate-90'
                )}
              />
            </Button>

            {showActions && (
              <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                {opportunity.suggested_actions.map((action, index) => (
                  <div
                    key={index}
                    className="space-y-2 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {action.description}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {action.estimated_effort} effort
                          </Badge>
                        </div>
                        {action.content_suggestions &&
                          action.content_suggestions.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">
                                Content ideas:
                              </div>
                              <ul className="text-xs space-y-1">
                                {action.content_suggestions.map(
                                  (suggestion, i) => (
                                    <li
                                      key={i}
                                      className="text-muted-foreground italic pl-2 border-l-2 border-primary/30"
                                    >
                                      {suggestion}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                    {onTakeAction && (
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full"
                        onClick={() => onTakeAction(index)}
                      >
                        Take Action
                        <Zap className="ml-2 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Action Button for High Priority */}
        {(opportunity.urgency === 'critical' || opportunity.urgency === 'high') &&
          opportunity.suggested_actions.length > 0 &&
          !showActions && (
            <Button
              size="sm"
              variant="default"
              className="w-full"
              onClick={() => onTakeAction?.(0)}
            >
              {opportunity.suggested_actions[0].description}
              <Sparkles className="ml-2 h-3 w-3" />
            </Button>
          )}
      </CardContent>

      {/* Critical Indicator */}
      {opportunity.urgency === 'critical' && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute top-3 right-[-25px] bg-destructive text-destructive-foreground text-[10px] font-bold px-8 py-0.5 rotate-45 shadow">
            URGENT
          </div>
        </div>
      )}
    </Card>
  )
}

function getTimeUntilExpiration(expiresAt: string): string {
  const now = Date.now()
  const expiration = new Date(expiresAt).getTime()
  const diff = expiration - now

  if (diff < 0) return 'Expired'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`
  return 'soon'
}
