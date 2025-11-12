# API Admin UI Components

A comprehensive set of React components for managing API configurations, monitoring usage, tracking costs, and analyzing billing data in the MARBA platform.

## Components Overview

### 1. ApiConfigList.tsx (257 lines)
**Purpose**: Display and manage all configured APIs

**Features**:
- Table view of all API configurations
- Provider icons and labels
- Active/Inactive status badges
- Last used timestamps
- Total requests and costs (placeholders for integration)
- Search functionality
- Filter by provider
- Action buttons: Edit, Delete, Test Connection

**Props**:
```typescript
{
  configs: ApiConfig[]
  loading?: boolean
  onEdit?: (config: ApiConfig) => void
  onDelete?: (configId: string) => void
  onTest?: (configId: string) => void
  className?: string
}
```

### 2. ApiConfigForm.tsx (420 lines)
**Purpose**: Create or edit API configuration

**Features**:
- Provider selection (OpenRouter, Facebook, Instagram, LinkedIn, Twitter, TikTok, Google, Other)
- API name input
- Secure API key/secret inputs with show/hide toggles
- Optional endpoint URL
- Rate limits configuration (per_minute, per_day)
- Monthly budget limit
- Cost structure settings:
  - Cost calculation method (per_request, per_token, tiered, custom)
  - Cost per request
  - Cost per 1K tokens
- Active/Test mode toggles
- Form validation
- Save/Cancel actions

**Props**:
```typescript
{
  config?: Partial<ApiConfig>
  onSave: (config: Partial<ApiConfig>) => Promise<void>
  onCancel: () => void
  className?: string
}
```

### 3. ApiBillingDashboard.tsx (285 lines)
**Purpose**: High-level billing overview

**Features**:
- Current month cost with trend indicator
- Total requests this month with trend
- Average cost per day
- Projected month-end cost
- Budget utilization progress bar
- Cost vs budget comparison
- Top 3 most expensive APIs
- Top 3 most used features
- Budget alerts (over/near limit)

**Props**:
```typescript
{
  stats: ApiBillingStats
  loading?: boolean
  className?: string
}
```

### 4. ApiCostByFeature.tsx (261 lines)
**Purpose**: Cost breakdown by feature usage

**Features**:
- Visual bar chart showing cost distribution
- Detailed table with columns:
  - Feature name and category
  - Total uses
  - Total cost
  - Average cost per use
  - Percentage of total spend
  - Trend indicator
- Expandable rows showing API breakdown per feature
- Color-coded visualization
- Legend for chart segments

**Props**:
```typescript
{
  data: ApiCostByFeature[]
  loading?: boolean
  showChart?: boolean
  className?: string
}
```

### 5. ApiCostByApi.tsx (247 lines)
**Purpose**: Cost breakdown by API provider

**Features**:
- Visual bar chart showing cost distribution by API
- Detailed table with columns:
  - Provider/API name with icons
  - Total requests
  - Total cost
  - Average cost per request
  - Tokens used
  - Percentage of total spend
  - Trend indicator
- Summary statistics (total requests, cost, avg cost/request)
- Color-coded visualization
- Provider-specific icons

**Props**:
```typescript
{
  data: ApiCostByApi[]
  loading?: boolean
  showChart?: boolean
  className?: string
}
```

### 6. ApiUsageChart.tsx (294 lines)
**Purpose**: Time-series visualization of API usage

**Features**:
- Line chart using Recharts library
- View modes: Daily, Weekly, Monthly
- Metric types: Cost, Requests, or Both
- Dual Y-axis (cost on left, requests on right)
- Interactive tooltips
- Export to CSV functionality
- Summary statistics:
  - Total cost
  - Total requests
  - Average cost per period
- Custom tooltip with formatted values
- Responsive design

**Props**:
```typescript
{
  data: ApiUsageDataPoint[]
  loading?: boolean
  onExportCSV?: () => void
  className?: string
}
```

### 7. ApiCostProjection.tsx (349 lines)
**Purpose**: Forecast future costs and provide recommendations

**Features**:
- Projected month-end cost calculation
- Visual trend chart with actual vs projected data
- Budget limit reference line
- Key metrics:
  - Current cost
  - Daily average
  - Days remaining
  - Confidence level (high/medium/low)
- Trend analysis (increasing/stable/decreasing)
- Budget alerts (will exceed/within budget)
- Cost optimization recommendations
- Progress bar for budget utilization
- Interactive chart with Recharts

**Props**:
```typescript
{
  projection: ApiCostProjection
  loading?: boolean
  className?: string
}
```

## Supporting Files

### api-admin.types.ts (146 lines)
Complete TypeScript type definitions for:
- `ApiProvider` - Supported API providers
- `CostCalculationMethod` - Cost calculation strategies
- `ApiConfig` - API configuration structure
- `ApiUsageRecord` - Individual usage records
- `ApiBillingPeriod` - Billing period data
- `ApiCostByFeature` - Feature cost breakdown
- `ApiCostByApi` - API cost breakdown
- `ApiUsageDataPoint` - Time-series data point
- `ApiCostProjection` - Projection and forecast data
- `ApiBillingStats` - Dashboard statistics

### UI Components (Added)
- **checkbox.tsx** (27 lines) - Radix UI checkbox component
- **table.tsx** (116 lines) - Table components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)

## Dependencies

These components use:
- **UI Components**: From `@/components/ui` (shadcn/ui based on Radix UI)
  - Card, Button, Input, Label, Badge, Select, Progress, Checkbox, Table
- **Icons**: From `lucide-react`
- **Charts**: `recharts` library for data visualization
- **Date Formatting**: `date-fns` for relative times and date formatting
- **Types**: From `@/types/api-admin.types`

## Integration Points

All components are designed to integrate with:
- **ApiConfigManager** service (to be implemented)
- **ApiBillingTracker** service (to be implemented)

These services should provide methods for:
- `getApiConfigs()` - Fetch all API configurations
- `createApiConfig(config)` - Create new API configuration
- `updateApiConfig(id, config)` - Update existing configuration
- `deleteApiConfig(id)` - Delete configuration
- `testApiConnection(id)` - Test API connectivity
- `getBillingStats(brandId, period)` - Get billing statistics
- `getCostByFeature(brandId, period)` - Get feature cost breakdown
- `getCostByApi(brandId, period)` - Get API cost breakdown
- `getUsageData(brandId, dateRange)` - Get time-series usage data
- `getProjection(brandId)` - Get cost projection

## Usage Example

```typescript
import {
  ApiConfigList,
  ApiConfigForm,
  ApiBillingDashboard,
  ApiCostByFeature,
  ApiCostByApi,
  ApiUsageChart,
  ApiCostProjection,
} from '@/components/admin/api'

// In your admin page component
function ApiAdminPage() {
  const [configs, setConfigs] = useState<ApiConfig[]>([])
  const [stats, setStats] = useState<ApiBillingStats | null>(null)

  return (
    <div className="space-y-6">
      <ApiBillingDashboard stats={stats} />
      <ApiConfigList
        configs={configs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTest={handleTest}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ApiCostByFeature data={featureData} />
        <ApiCostByApi data={apiData} />
      </div>
      <ApiUsageChart data={usageData} />
      <ApiCostProjection projection={projectionData} />
    </div>
  )
}
```

## Features Checklist

- ✅ Filtering and search
- ✅ Loading states
- ✅ Error handling (empty states)
- ✅ Responsive design
- ✅ TypeScript types
- ✅ Icons and badges
- ✅ Interactive charts
- ✅ Export functionality
- ✅ Form validation
- ✅ Trend indicators
- ✅ Budget alerts
- ✅ Recommendations
- ✅ Expandable rows
- ✅ Provider-specific icons
- ✅ Secure password inputs
- ✅ Progress visualizations

## Total Stats

- **7 Component Files**: 2,113 lines of code
- **1 Type Definition File**: 146 lines
- **2 New UI Components**: 143 lines
- **Total**: 2,402 lines across 10 files
