# Auto-Refresh for Brand Intelligence - Integration Guide

**Created:** November 12, 2025
**Status:** ✅ Complete and Ready for Integration

---

## Overview

The auto-refresh system automatically detects when brand intelligence data is stale and refreshes it. This ensures users always see fresh insights without manual intervention.

### Features

✅ **Automatic staleness detection** - Monitors cache expiration across all MIRROR sections
✅ **Smart refresh logic** - Only refreshes stale sections, not entire brand
✅ **Manual refresh option** - Users can force refresh anytime
✅ **Visual indicators** - Shows data age and freshness status
✅ **Configurable behavior** - Auto-refresh can be enabled/disabled per component
✅ **Background integration** - Works seamlessly with background jobs

---

## Architecture

### Components

1. **`useBrandAutoRefresh` Hook** (`src/hooks/useBrandAutoRefresh.ts`)
   - Core logic for detecting stale data
   - Triggers enrichment when needed
   - Provides freshness status and manual refresh

2. **`BrandFreshnessIndicator` Component** (`src/components/brand/BrandFreshnessIndicator.tsx`)
   - UI components to display freshness status
   - Multiple variants: badge, button, inline, full
   - Compact mode for space-constrained areas

3. **Database Migration** (`supabase/migrations/add_brand_last_enriched_at.sql`)
   - Adds `last_enriched_at` column to brands table
   - Creates trigger to auto-update timestamp
   - Backfills existing brand data

### Data Flow

```
┌─────────────────────┐
│   Component         │
│   (uses hook)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ useBrandAutoRefresh │◄─── Checks cache expiration
│   Hook              │◄─── Monitors last_enriched_at
└──────────┬──────────┘
           │
           ▼ (if stale)
┌─────────────────────┐
│ EnrichmentEngine    │◄─── Calls edge functions
│ .enrichSection()    │◄─── Updates cache
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase Database   │
│ - enrichment_cache  │◄─── Stores enriched data
│ - brands            │◄─── Updates last_enriched_at
└─────────────────────┘
```

---

## Setup Instructions

### Step 1: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/add_brand_last_enriched_at.sql`
3. Run the migration
4. Verify: `SELECT * FROM brands LIMIT 1;` should show `last_enriched_at` column

### Step 2: Update TypeScript Types (Already Done)

The `src/types/database.types.ts` file has been updated to include `last_enriched_at` in the brands table types.

### Step 3: Integration Options

Choose one or more integration points:

---

## Integration Examples

### Option A: Add to Brand Dashboard/Header

Show freshness indicator in the main brand view where users spend most time.

```tsx
// src/components/layout/BrandHeader.tsx
import { BrandFreshnessIndicator } from '@/components/brand/BrandFreshnessIndicator';
import { useBrand } from '@/contexts/BrandContext';

export function BrandHeader() {
  const { currentBrand } = useBrand();

  return (
    <header className="flex items-center justify-between">
      <h1>{currentBrand?.name}</h1>

      {/* Option 1: Badge with manual refresh button */}
      <BrandFreshnessIndicator
        brandId={currentBrand?.id}
        variant="badge"
        showRefreshButton
        onRefreshComplete={() => {
          toast.success('Brand data refreshed!');
        }}
      />
    </header>
  );
}
```

### Option B: Add to MIRROR Section Pages

Show freshness per section with auto-refresh enabled.

```tsx
// src/pages/MirrorPage.tsx
import { BrandFreshnessIndicator } from '@/components/brand/BrandFreshnessIndicator';
import { useBrand } from '@/contexts/BrandContext';

export function MeasureSection() {
  const { currentBrand } = useBrand();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Measure</h2>

        {/* Auto-refresh enabled - data refreshes automatically */}
        <BrandFreshnessIndicator
          brandId={currentBrand?.id}
          variant="badge"
          autoRefresh={true}  // ⚡ Automatic refresh when stale
          onRefreshComplete={() => {
            // Reload section data here
            reloadMeasureData();
          }}
        />
      </div>

      {/* Section content */}
    </div>
  );
}
```

### Option C: Add to Brand List

Show freshness badges in brand selection lists.

```tsx
// src/components/brands/BrandList.tsx
import { BrandFreshnessBadge } from '@/components/brand/BrandFreshnessIndicator';

export function BrandList({ brands }) {
  return (
    <div>
      {brands.map(brand => (
        <div key={brand.id} className="flex items-center justify-between">
          <span>{brand.name}</span>

          {/* Compact badge, no refresh button */}
          <BrandFreshnessBadge brandId={brand.id} />
        </div>
      ))}
    </div>
  );
}
```

### Option D: Dedicated Refresh Panel

Full-featured refresh control panel for advanced users.

```tsx
// src/components/settings/DataManagement.tsx
import { BrandFreshnessIndicator } from '@/components/brand/BrandFreshnessIndicator';
import { useBrand } from '@/contexts/BrandContext';

export function DataManagement() {
  const { currentBrand } = useBrand();

  return (
    <div>
      <h3>Data Freshness</h3>

      {/* Full detailed view with section breakdown */}
      <BrandFreshnessIndicator
        brandId={currentBrand?.id}
        variant="full"  // Shows all sections
        showRefreshButton
        autoRefresh={false}  // Manual control
        onRefreshComplete={() => {
          toast.success('All sections refreshed!');
        }}
      />
    </div>
  );
}
```

### Option E: Use the Hook Directly

For custom UI or advanced control.

```tsx
// src/components/custom/MyComponent.tsx
import { useBrandAutoRefresh, getDataAge } from '@/hooks/useBrandAutoRefresh';

export function MyComponent({ brandId }) {
  const { status, isRefreshing, manualRefresh } = useBrandAutoRefresh(brandId, {
    autoRefresh: true,
    sections: ['measure', 'optimize'],  // Only monitor these sections
    onRefreshComplete: () => {
      console.log('Refresh complete');
    },
  });

  if (!status) return null;

  const dataAge = getDataAge(status.lastEnriched);

  return (
    <div>
      <p>Data is {dataAge.label} old</p>
      {status.isStale && (
        <button onClick={() => manualRefresh()}>
          Refresh Now
        </button>
      )}
    </div>
  );
}
```

---

## Configuration Options

### Hook Options

```typescript
interface AutoRefreshOptions {
  /**
   * Enable automatic refresh when data is detected as stale
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * Sections to monitor and auto-refresh
   * @default all sections: ['measure', 'intend', 'reimagine', 'reach', 'optimize', 'reflect']
   */
  sections?: MIRRORSection[];

  /**
   * Threshold in milliseconds to consider data "stale" beyond cache expiration
   * @default 0 (refresh immediately when cache expires)
   */
  staleThreshold?: number;

  /**
   * Callback when refresh starts
   */
  onRefreshStart?: () => void;

  /**
   * Callback when refresh completes
   */
  onRefreshComplete?: () => void;

  /**
   * Callback when refresh fails
   */
  onRefreshError?: (error: Error) => void;
}
```

### Component Variants

```typescript
type Variant = 'badge' | 'button' | 'inline' | 'full';

// badge - Compact status badge with optional refresh button
// button - Clickable refresh button with status
// inline - Text-based inline indicator
// full - Detailed panel with section breakdown
```

---

## Cache TTLs (Time to Live)

Defined in `enrichment-engine.ts`:

| Section    | TTL      | Description                    |
|------------|----------|--------------------------------|
| Measure    | 24 hours | Analytics, current metrics     |
| Intend     | 7 days   | Goals, objectives (stable)     |
| Reimagine  | 7 days   | Strategy, positioning (stable) |
| Reach      | 3 days   | Channels, campaigns            |
| Optimize   | 24 hours | Performance, quick changes     |
| Reflect    | 6 hours  | Recent analytics, fast-moving  |

**Note:** These TTLs determine when data is considered "stale" and triggers auto-refresh.

---

## Testing

### Manual Testing

1. **Create a brand** and run onboarding
2. **Wait for cache to expire** (or manually expire in database)
3. **Visit page with freshness indicator** - should show "Stale" status
4. **With autoRefresh enabled** - should automatically trigger refresh
5. **Verify data updates** - last_enriched_at should update

### Test Stale Data Manually

```sql
-- Force data to be stale (for testing)
UPDATE brands
SET last_enriched_at = NOW() - INTERVAL '48 hours'
WHERE id = 'your-brand-id';

-- Clear cache to force refresh
DELETE FROM enrichment_cache
WHERE brand_id = 'your-brand-id';
```

### Verify Refresh Works

1. Add `BrandFreshnessIndicator` to a page
2. Artificially age the data (SQL above)
3. Reload page - should show "Stale (48h ago)"
4. Enable `autoRefresh={true}` - should start refreshing automatically
5. Or click manual refresh button
6. Verify: `last_enriched_at` updates in database

---

## Integration with Background Jobs

The background job scheduler (`cron-enrichment-scheduler`) already updates `last_enriched_at` when it runs. The auto-refresh system works alongside background jobs:

- **Background jobs**: Refresh all brands on schedule (daily 2AM)
- **Auto-refresh**: Refresh individual brands when user views them and data is stale

This ensures:
- Active brands get real-time updates when viewed
- Inactive brands still get updated by background jobs
- No redundant refreshes (cache prevents double-refresh)

---

## Performance Considerations

### Efficient Caching

- Auto-refresh checks cache expiration first (fast database query)
- Only refreshes sections that are truly stale
- Uses enrichment_cache table to avoid redundant API calls

### API Rate Limits

- Each section refresh makes 1-3 API calls (depending on intelligence services)
- With 6 sections, full refresh = 6-18 API calls
- Cache prevents excessive refreshes (respects TTLs)

### UI Performance

- Freshness checks run every 5 minutes (not on every render)
- Uses React hooks efficiently (no unnecessary re-renders)
- Refresh operations are async and don't block UI

---

## Troubleshooting

### Data Never Refreshes

1. Check migration ran: `SELECT last_enriched_at FROM brands LIMIT 1;`
2. Verify edge function is deployed: `supabase functions list`
3. Check API keys are configured in `.env`
4. Look for errors in browser console

### "Refreshing..." Never Completes

1. Check edge function logs in Supabase Dashboard
2. Verify network requests in browser DevTools
3. Check for API key errors in console
4. Ensure enrichment_cache table exists

### Refresh Button Not Showing

1. Ensure `showRefreshButton={true}` is set
2. Check component is receiving valid `brandId`
3. Verify hook is properly initialized

### Data Shows as Stale Immediately After Refresh

1. Check cache TTLs are being set correctly
2. Verify enrichment_cache.expires_at is in the future
3. Check system time is correct

---

## Advanced: Custom Staleness Logic

You can implement custom staleness detection:

```tsx
const { status, manualRefresh } = useBrandAutoRefresh(brandId, {
  autoRefresh: false,  // Disable built-in auto-refresh
  staleThreshold: 12 * 60 * 60 * 1000,  // 12 hours threshold
});

// Custom logic
useEffect(() => {
  if (status && status.isStale) {
    // Custom conditions
    const criticalSections = ['measure', 'optimize'];
    const hasCriticalStale = criticalSections.some(
      section => status.sections[section]?.isStale
    );

    if (hasCriticalStale && isBusinessHours()) {
      manualRefresh(criticalSections);  // Refresh only critical sections
    }
  }
}, [status]);
```

---

## Summary

### Files Created

1. ✅ `src/hooks/useBrandAutoRefresh.ts` - Core refresh logic
2. ✅ `src/components/brand/BrandFreshnessIndicator.tsx` - UI components
3. ✅ `supabase/migrations/add_brand_last_enriched_at.sql` - Database schema
4. ✅ `src/types/database.types.ts` - Updated type definitions (edited)

### Integration Checklist

- [ ] Run database migration in Supabase
- [ ] Choose integration point(s) from examples above
- [ ] Add `BrandFreshnessIndicator` to desired pages
- [ ] Configure `autoRefresh` behavior per use case
- [ ] Test with artificially stale data
- [ ] Monitor edge function logs for errors
- [ ] Configure API keys if not already done

### Recommended Integration

**For initial launch:**

1. **Add badge to brand header** - Shows overall freshness status
2. **Enable auto-refresh on Measure/Optimize pages** - Most dynamic sections
3. **Add full panel to settings** - For power users who want control

This provides a balance of automation (UX) and control (advanced users).

---

## Next Steps

1. Run the database migration
2. Add `BrandFreshnessIndicator` to 1-2 key pages
3. Test with a real brand
4. Monitor performance and adjust TTLs if needed
5. Consider adding toast notifications for completed refreshes

---

**Status:** ✅ Implementation Complete
**Estimated Integration Time:** 30-60 minutes
**Complexity:** Low (drop-in components with sensible defaults)

🚀 Ready to ship!
