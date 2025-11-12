/**
 * Brand Freshness Indicator
 * Shows data freshness status and provides refresh actions
 */

import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useBrandAutoRefresh, getDataAge } from '@/hooks/useBrandAutoRefresh';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BrandFreshnessIndicatorProps {
  brandId: string | null | undefined;

  /**
   * Display variant
   * @default 'badge'
   */
  variant?: 'badge' | 'button' | 'inline' | 'full';

  /**
   * Auto-refresh when data is stale
   * @default false (manual refresh only)
   */
  autoRefresh?: boolean;

  /**
   * Show refresh button
   * @default true
   */
  showRefreshButton?: boolean;

  /**
   * Compact mode (smaller UI)
   * @default false
   */
  compact?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Callback when refresh completes
   */
  onRefreshComplete?: () => void;
}

export function BrandFreshnessIndicator({
  brandId,
  variant = 'badge',
  autoRefresh = false,
  showRefreshButton = true,
  compact = false,
  className,
  onRefreshComplete,
}: BrandFreshnessIndicatorProps) {
  const { status, isRefreshing, error, manualRefresh } = useBrandAutoRefresh(brandId, {
    autoRefresh,
    onRefreshComplete,
  });

  if (!brandId || !status) {
    return null;
  }

  const dataAge = getDataAge(status.lastEnriched);
  const isStale = status.isStale;
  const isFresh = !isStale && dataAge.ageHours < 24;

  const getFreshnessColor = () => {
    if (isStale) return 'destructive';
    if (dataAge.ageHours < 6) return 'default';
    if (dataAge.ageHours < 24) return 'secondary';
    return 'outline';
  };

  const getFreshnessIcon = () => {
    if (isRefreshing) return <RefreshCw className="w-3 h-3 animate-spin" />;
    if (error) return <AlertCircle className="w-3 h-3" />;
    if (isFresh) return <CheckCircle className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  const getFreshnessLabel = () => {
    if (isRefreshing) return 'Refreshing...';
    if (error) return 'Refresh failed';
    if (isStale) return `Stale (${dataAge.label})`;
    return dataAge.label;
  };

  // Render different variants
  if (variant === 'badge') {
    return (
      <TooltipProvider>
        <div className={cn('flex items-center gap-2', className)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={getFreshnessColor()} className="gap-1.5">
                {getFreshnessIcon()}
                {!compact && getFreshnessLabel()}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="font-medium">Data Freshness</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {status.lastEnriched ? new Date(status.lastEnriched).toLocaleString() : 'Never'}
                </p>
                {isStale && (
                  <p className="text-sm text-orange-600">
                    Some sections need refresh
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {showRefreshButton && !isRefreshing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => manualRefresh()}
              disabled={isRefreshing}
              className="h-6 px-2"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </TooltipProvider>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant={isStale ? 'destructive' : 'outline'}
        size={compact ? 'sm' : 'default'}
        onClick={() => manualRefresh()}
        disabled={isRefreshing}
        className={cn('gap-2', className)}
      >
        {getFreshnessIcon()}
        {!compact && getFreshnessLabel()}
        {showRefreshButton && !compact && 'Refresh'}
      </Button>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-2 text-sm', className)}>
        {getFreshnessIcon()}
        <span className={isStale ? 'text-orange-600' : 'text-muted-foreground'}>
          {getFreshnessLabel()}
        </span>
        {showRefreshButton && (
          <button
            onClick={() => manualRefresh()}
            disabled={isRefreshing}
            className="text-primary hover:underline"
          >
            Refresh
          </button>
        )}
      </span>
    );
  }

  // Full variant - detailed view
  return (
    <div className={cn('space-y-3 p-4 border rounded-lg', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getFreshnessIcon()}
          <div>
            <p className="font-medium">Data Freshness</p>
            <p className="text-sm text-muted-foreground">{getFreshnessLabel()}</p>
          </div>
        </div>

        {showRefreshButton && (
          <Button
            variant={isStale ? 'default' : 'outline'}
            size="sm"
            onClick={() => manualRefresh()}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        )}
      </div>

      {/* Section breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Sections:</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(status.sections).map(([section, data]) => {
            const sectionAge = getDataAge(data.lastEnriched);
            return (
              <div
                key={section}
                className={cn(
                  'flex items-center justify-between p-2 rounded border text-sm',
                  data.isStale ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                )}
              >
                <span className="capitalize">{section}</span>
                <span className="text-xs text-muted-foreground">
                  {sectionAge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Error: {error.message}</span>
        </div>
      )}

      {autoRefresh && (
        <p className="text-xs text-muted-foreground">
          Auto-refresh is enabled. Data will refresh automatically when stale.
        </p>
      )}
    </div>
  );
}

/**
 * Compact freshness badge for use in lists or headers
 */
export function BrandFreshnessBadge({
  brandId,
  className,
}: {
  brandId: string | null | undefined;
  className?: string;
}) {
  return (
    <BrandFreshnessIndicator
      brandId={brandId}
      variant="badge"
      compact
      showRefreshButton={false}
      className={className}
    />
  );
}

/**
 * Refresh button with loading state
 */
export function BrandRefreshButton({
  brandId,
  onRefreshComplete,
  className,
}: {
  brandId: string | null | undefined;
  onRefreshComplete?: () => void;
  className?: string;
}) {
  return (
    <BrandFreshnessIndicator
      brandId={brandId}
      variant="button"
      showRefreshButton
      onRefreshComplete={onRefreshComplete}
      className={className}
    />
  );
}
