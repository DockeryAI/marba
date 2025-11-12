# Phase 6: Connection Discovery - Component Structure

## Component Hierarchy

```
OptimizeSection
├── OpportunityDashboard
├── ConnectionDiscovery ← NEW (Phase 6)
│   ├── Card (shadcn/ui)
│   │   ├── CardHeader
│   │   │   ├── CardTitle
│   │   │   │   └── Sparkles icon
│   │   │   └── CardDescription
│   │   └── CardContent
│   │       └── [State-dependent content]
│   │
│   ├── Loading State
│   │   ├── Animated dots
│   │   └── "Analyzing your brand data..."
│   │
│   ├── Error State
│   │   ├── AlertCircle icon
│   │   ├── Feature explanation
│   │   ├── What it will do (list)
│   │   └── Enable instructions
│   │
│   ├── Empty State
│   │   ├── Sparkles icon (faded)
│   │   ├── "No connections discovered yet"
│   │   └── "Discover Connections" button
│   │
│   └── Success State (when data available)
│       ├── Connection Cards (array)
│       │   ├── Type icon + label
│       │   ├── Confidence badge
│       │   ├── Insight text
│       │   ├── Data point badges
│       │   └── Suggested actions list
│       │       ├── ArrowRight icon
│       │       ├── Action text
│       │       └── Priority badge (if high)
│       └── "Refresh Connections" button
└── ContentCalendarHub / ActionBoard
```

## Data Flow

```
User loads Optimize section
    ↓
OptimizeSection renders
    ↓
Passes brandData prop to ConnectionDiscovery
    ↓
ConnectionDiscovery.useEffect() triggers
    ↓
discoverConnections() called
    ↓
    ├─→ [Future] ConnectionDiscoveryService.discoverConnections()
    ├─→ [Future] ConnectionDiscoveryEngine.findConnections()
    └─→ [Current] Shows helpful "Feature in Development" message
    ↓
Component displays appropriate state:
    ├─→ loading: Animated loading UI
    ├─→ error: Feature explanation + next steps
    ├─→ empty: Call-to-action
    └─→ success: Connection cards with actions
```

## State Management

```typescript
// Component State
const [connections] = useState<Connection[]>([])
  // Stores discovered connections
  // Currently always empty (stub implementation)

const [loading, setLoading] = useState(false)
  // true: Show loading animation
  // false: Show content or error

const [error, setError] = useState<string | null>(null)
  // null: No error
  // string: Error message to display
```

## Connection Data Structure

```typescript
interface Connection {
  id: string                    // Unique identifier
  type: ConnectionType          // What kind of connection
  confidence: number            // 0-1 confidence score
  insight: string              // Human-readable insight
  data_points: DataPoint[]     // Source data that created connection
  suggested_actions: Action[]  // What to do about it
  created_at: string          // Timestamp
}
```

### Connection Types

1. **customer_trigger_market**
   - Icon: Users
   - Color: Blue/Green based on confidence
   - Connects customer psychology to market opportunities

2. **competitor_weakness_opportunity**
   - Icon: Target
   - Color: Blue/Green based on confidence
   - Identifies gaps in competitor strategy

3. **content_gap_trend**
   - Icon: TrendingUp
   - Color: Blue/Green based on confidence
   - Matches content opportunities to trends

4. **archetype_channel**
   - Icon: Sparkles
   - Color: Blue/Green based on confidence
   - Maps customer types to optimal channels

## Color Coding System

```typescript
// Confidence-based colors
confidence >= 0.9  → Green    (bg-green-100, text-green-800, border-green-200)
confidence >= 0.7  → Blue     (bg-blue-100, text-blue-800, border-blue-200)
confidence < 0.7   → Gray     (bg-gray-100, text-gray-800, border-gray-200)
```

## Component Methods

### discoverConnections()
```typescript
async discoverConnections() {
  // 1. Validate brandData exists
  // 2. Set loading state
  // 3. Simulate API delay (1.5s)
  // 4. Throw helpful error (current stub)
  // 5. [Future] Call ConnectionDiscoveryEngine
  // 6. Update connections state
  // 7. Clear loading state
}
```

### getConnectionIcon(type)
```typescript
// Maps connection type to Lucide icon
customer_trigger_market          → Users
competitor_weakness_opportunity  → Target
content_gap_trend               → TrendingUp
archetype_channel               → Sparkles
```

### getConnectionColor(confidence)
```typescript
// Returns Tailwind classes based on confidence
>= 0.9  → 'bg-green-100 text-green-800 border-green-200'
>= 0.7  → 'bg-blue-100 text-blue-800 border-blue-200'
< 0.7   → 'bg-gray-100 text-gray-800 border-gray-200'
```

### getTypeLabel(type)
```typescript
// Converts type enum to display label
customer_trigger_market          → "Customer + Market"
competitor_weakness_opportunity  → "Competitive Gap"
content_gap_trend               → "Content Opportunity"
archetype_channel               → "Channel Strategy"
```

## Integration with OptimizeSection

```tsx
<OptimizeSection
  brandId={brandId}
  userId={userId}
  tactics={tactics}
  pillars={pillars}
  industry={industry}
  brandData={brandData}  // ← Passed to ConnectionDiscovery
>
  {/* ... other sections ... */}

  <section id="connection-discovery">
    <ConnectionDiscovery brandData={brandData} />
  </section>
</OptimizeSection>
```

## Props Interface

```typescript
interface ConnectionDiscoveryProps {
  brandData: any  // Brand information including:
                  // - id: string
                  // - name: string
                  // - industry: string
                  // - [other brand data fields]
}
```

## Future Service Integration

When fully implemented, the component will call:

```typescript
// services/mirror/connection-discovery.ts
ConnectionDiscoveryService.discoverConnections({
  brand_id: brandData.id,
  include_types: [
    'customer_trigger_market',
    'competitor_weakness_opportunity',
    'content_gap_trend',
    'archetype_channel'
  ],
  min_confidence: 0.7,
  max_connections: 20
})
```

Which will internally use:

```typescript
// services/synapse/connections/ConnectionDiscoveryEngine.ts
const engine = new ConnectionDiscoveryEngine(apiKey)
const result = await engine.findConnections(deepContext, options)
```

## UI/UX Features

1. **Loading State**
   - Animated bouncing dots
   - Clear loading message
   - Prevents multiple simultaneous calls

2. **Error State**
   - Prominent AlertCircle icon
   - Orange color scheme (warning, not critical)
   - Explains what the feature does
   - Lists specific capabilities
   - Provides clear next steps

3. **Empty State**
   - Faded Sparkles icon
   - Friendly empty message
   - Clear call-to-action button

4. **Success State**
   - Card-based layout
   - Hover effects on cards
   - Limited to top 3 actions per connection
   - Refresh button for new discoveries
   - Responsive grid layout

## Accessibility

- Semantic HTML structure
- Clear heading hierarchy
- Icon + text labels (not icon-only)
- Keyboard navigable buttons
- Color contrast meets WCAG AA
- Screen reader friendly

---

**Created**: 2025-11-12
**Component**: ConnectionDiscovery
**Status**: Production Ready (Stub Implementation)
