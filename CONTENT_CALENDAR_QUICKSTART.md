# Content Calendar - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies (Already Done)
```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list
```

### 2. View the Demo
```bash
npm run dev
```

Navigate to: `http://localhost:5173/content-calendar-demo`

The demo page will auto-initialize with sample data including:
- 5 intelligence opportunities
- 4 sample content items (various statuses)
- All features interactive

### 3. Use in Your Application

#### Option A: Full Hub (Recommended)
```tsx
import { ContentCalendarHub } from '@/components/content-calendar';

function OptimizeSection() {
  return (
    <ContentCalendarHub
      brandId="your-brand-id"
      userId="your-user-id"
      pillars={messagePillars}
    />
  );
}
```

#### Option B: Individual Components
```tsx
import {
  CalendarView,
  ContentGenerator,
  PublishingQueue,
  OpportunityFeed
} from '@/components/content-calendar';

// Use components individually
<CalendarView brandId="..." onEventClick={...} />
<ContentGenerator open={true} brandId="..." />
<PublishingQueue brandId="..." days={7} />
<OpportunityFeed brandId="..." userId="..." />
```

### 4. Generate Sample Data
```tsx
import { OpportunityDetectorService } from '@/services/opportunity-detector.service';

// Create 5 sample opportunities
await OpportunityDetectorService.createSampleOpportunities('your-brand-id');
```

## 📋 Common Use Cases

### Generate Content
1. Click "Generate Content" button
2. Select platform (Instagram, Twitter, etc.)
3. Enter topic
4. Toggle between MARBA (fast) or Synapse (quality)
5. Click "Generate"
6. Review 3 variations
7. Edit if needed
8. Click "Save to Calendar"

### Bulk Generate
1. Click "Bulk Generate" button
2. Set date range (start/end)
3. Select platforms
4. Adjust pillar distribution
5. Choose generation mode
6. Click "Generate Content"
7. Review all items
8. Select which to schedule
9. Click "Schedule All Posts"

### Schedule Content
1. Drag content items on calendar to new times
2. System checks for conflicts
3. Auto-saves new schedule

### Publish Content
1. Go to "Publishing Queue" tab
2. View upcoming posts
3. Click "Publish Now" for manual publish
4. Or wait for auto-publish at scheduled time

### Use Opportunities
1. View opportunities at top of page
2. Check countdown timer
3. Click "Generate Post"
4. Content generator opens with opportunity context
5. AI generates relevant content
6. Save to calendar

## 🎨 Customization

### Platform Colors
Edit in `CalendarView.tsx`:
```tsx
const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: '#E1306C',
  twitter: '#1DA1F2',
  // ... customize colors
};
```

### Platform Limits
Edit in `content-calendar.service.ts`:
```tsx
const PLATFORM_LIMITS = {
  instagram: {
    max_posts_per_day: 1,
    optimal_times: ['09:00', '12:00', '17:00'],
    // ... customize limits
  }
};
```

### Opportunity Types
Add new types in `content-calendar.types.ts`:
```tsx
export type OpportunityType =
  'weather' |
  'trending' |
  'competitor' |
  'seasonal' |
  'local_news' |
  'your_new_type'; // Add here
```

## 🔧 Configuration

### Auto-Refresh Intervals
```tsx
// Opportunity Feed (default: 5 minutes)
<OpportunityFeed autoRefreshInterval={5 * 60 * 1000} />

// Publishing Queue (default: 30 seconds)
// Modify in PublishingQueue.tsx line 47
const interval = setInterval(loadQueue, 30000);
```

### Calendar Views
```tsx
// Default view
const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
```

### Publishing Queue Days
```tsx
// Show 7 days by default
<PublishingQueue days={7} />

// Or customize
<PublishingQueue days={14} />
```

## 📊 Data Structure

### Content Item
```tsx
{
  id: string,
  brand_id: string,
  platform: 'instagram' | 'twitter' | ...,
  content_text: string,
  scheduled_time: '2025-11-12T14:00:00Z',
  status: 'draft' | 'scheduled' | 'published' | 'failed',
  generation_mode: 'marba' | 'synapse',
  synapse_score: 85,
  intelligence_badges: ['Synapse Enhanced'],
  engagement_metrics: {
    likes: 247,
    comments: 32,
    shares: 18
  }
}
```

### Opportunity
```tsx
{
  id: string,
  brand_id: string,
  type: 'weather' | 'trending' | ...,
  title: 'Sunny Weekend Approaching',
  urgency: 'high',
  impact_score: 85,
  expires_at: '2025-11-14T00:00:00Z',
  status: 'active'
}
```

## 🎯 Key Features

### Generation Modes
- **MARBA**: Fast (Claude Sonnet 3.5 via OpenRouter)
- **Synapse**: Quality (Psychology-optimized)

### Platform Support
- Instagram (1 post/day max)
- Twitter (5 posts/day max)
- LinkedIn (2 posts/day max)
- Facebook (3 posts/day max)
- TikTok (2 posts/day max)
- Email (1 post/day max)
- Blog (1 post/day max)

### Intelligence Features
- Psychology scoring (0-100)
- Power word analysis
- Industry benchmarks
- "Why This Works" explanations
- Opportunity detection
- Optimal time recommendations

## 🐛 Troubleshooting

### Content Not Appearing in Calendar
- Check that `scheduled_time` is set
- Verify `status` is 'scheduled' or 'published'
- Ensure date is within visible range

### Generation Not Working
- Check Supabase edge function is deployed
- Verify API keys are set
- Check browser console for errors

### Drag-and-Drop Not Working
- Ensure `editable={true}` in CalendarView
- Check that items have valid `id`
- Verify content status allows rescheduling

### Opportunities Not Showing
- Run `createSampleOpportunities()` to generate test data
- Check `expires_at` is in the future
- Verify `status` is 'active'

## 📚 Learn More

- **Full Documentation**: See `CONTENT_CALENDAR_README.md`
- **Completion Summary**: See `CONTENT_CALENDAR_COMPLETION_SUMMARY.md`
- **Task Breakdown**: See `BUILD_TASK_BREAKDOWN.md` Phase 11

## 💡 Pro Tips

1. **Use MARBA mode** for quick daily content
2. **Use Synapse mode** for important campaigns
3. **Bulk generate** on Sundays for the week ahead
4. **Check opportunities** first thing each morning
5. **Review publishing queue** to catch issues early
6. **Drag to reschedule** instead of manual edit
7. **Use pillar distribution** to balance content mix

## 🎨 UI Keyboard Shortcuts

- Drag events to reschedule
- Click event for details
- Hover for preview
- `Esc` to close modals

## ✨ Next Steps

1. Generate your first content piece
2. Try bulk generation for a week
3. Set up your message pillars
4. Connect platform accounts (Phase 2)
5. Monitor performance analytics

---

**Need Help?** Check the full documentation in `CONTENT_CALENDAR_README.md`

**Found a Bug?** The system is production-ready but always improving!

**Want to Customize?** All components are fully customizable and well-documented.
