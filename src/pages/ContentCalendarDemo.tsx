/**
 * Content Calendar Demo Page
 * Demonstrates the full content calendar system with sample data
 */

import React, { useEffect, useState } from 'react';
import { ContentCalendarHub } from '@/components/content-calendar';
import { OpportunityDetectorService } from '@/services/opportunity-detector.service';
import { ContentCalendarService } from '@/services/content-calendar.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw } from 'lucide-react';
import type { ContentPillar } from '@/types/content-calendar.types';

export function ContentCalendarDemo() {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Demo data
  const brandId = 'demo-brand-123';
  const userId = 'demo-user-123';

  const pillars: ContentPillar[] = [
    {
      id: 'pillar-1',
      brand_id: brandId,
      name: 'Educational Content',
      description: 'Tips, tutorials, and how-to guides',
      color: '#3B82F6',
      synapse_score: 85,
    },
    {
      id: 'pillar-2',
      brand_id: brandId,
      name: 'Promotional',
      description: 'Product features and special offers',
      color: '#10B981',
      synapse_score: 78,
    },
    {
      id: 'pillar-3',
      brand_id: brandId,
      name: 'Engagement',
      description: 'Questions, polls, and community building',
      color: '#F59E0B',
      synapse_score: 92,
    },
  ];

  /**
   * Initialize demo data
   */
  const initializeDemoData = async () => {
    setLoading(true);

    try {
      // Create sample opportunities
      await OpportunityDetectorService.createSampleOpportunities(brandId);

      // Create some sample content items
      const sampleContent = [
        {
          brand_id: brandId,
          user_id: userId,
          platform: 'instagram' as const,
          content_text: '🎯 Master your morning routine! Here are 5 proven strategies to start your day right.\n\n1️⃣ Wake up 30 minutes earlier\n2️⃣ Hydrate immediately\n3️⃣ Practice gratitude\n4️⃣ Plan your top 3 priorities\n5️⃣ Move your body\n\nWhich one will you try tomorrow? 👇\n\n#productivity #morningroutine #success',
          pillar_id: 'pillar-1',
          generation_mode: 'synapse' as const,
          synapse_score: 88,
          intelligence_badges: ['Synapse Enhanced', 'High-performing'],
          hashtags: ['#productivity', '#morningroutine', '#success'],
          status: 'scheduled' as const,
          scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        },
        {
          brand_id: brandId,
          user_id: userId,
          platform: 'linkedin' as const,
          content_text: '💼 The future of work is hybrid. Here\'s what successful companies are doing differently:\n\n✅ Flexible scheduling that respects work-life balance\n✅ Investment in collaboration tools\n✅ Focus on outcomes, not hours\n✅ Regular team connection points\n✅ Clear communication guidelines\n\nWhat\'s working (or not working) for your team? Let\'s discuss. 👇\n\n#futureofwork #hybrid #leadership',
          pillar_id: 'pillar-1',
          generation_mode: 'marba' as const,
          status: 'draft' as const,
        },
        {
          brand_id: brandId,
          user_id: userId,
          platform: 'twitter' as const,
          content_text: '🚀 Just launched! Our biggest update yet is live.\n\n✨ 3x faster performance\n✨ New AI-powered features\n✨ Cleaner, simpler interface\n\nTry it now → [link]\n\n#ProductLaunch #Innovation',
          pillar_id: 'pillar-2',
          generation_mode: 'synapse' as const,
          synapse_score: 82,
          intelligence_badges: ['Synapse Enhanced', 'Data-driven'],
          hashtags: ['#ProductLaunch', '#Innovation'],
          status: 'scheduled' as const,
          scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        },
        {
          brand_id: brandId,
          user_id: userId,
          platform: 'facebook' as const,
          content_text: '🎉 Weekend vibes! We want to hear from you.\n\nWhat\'s one thing you\'re grateful for this week?\n\nDrop it in the comments and let\'s spread some positivity! 💙\n\n#WeekendVibes #Gratitude #Community',
          pillar_id: 'pillar-3',
          generation_mode: 'marba' as const,
          status: 'published' as const,
          published_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          engagement_metrics: {
            likes: 247,
            comments: 32,
            shares: 18,
            clicks: 0,
            reach: 1842,
          },
        },
      ];

      for (const content of sampleContent) {
        try {
          await ContentCalendarService.createContentItem(content);
        } catch (error) {
          console.log('Content item may already exist, skipping...');
        }
      }

      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-initialize on mount
   */
  useEffect(() => {
    if (!initialized) {
      initializeDemoData();
    }
  }, [initialized]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Calendar System</h1>
          <p className="text-muted-foreground text-lg">
            Complete content creation, scheduling, and publishing platform
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={initializeDemoData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Demo Data
          </Button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">AI-Powered Generation</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate content with MARBA (fast) or Synapse (psychology-optimized) modes
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary">3 variations</Badge>
            <Badge variant="secondary">Psychology scores</Badge>
            <Badge variant="secondary">Industry benchmarks</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="font-semibold">Smart Scheduling</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Optimal time recommendations, conflict detection, and drag-and-drop rescheduling
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary">Auto-schedule</Badge>
            <Badge variant="secondary">Platform limits</Badge>
            <Badge variant="secondary">Bulk actions</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-semibold">Intelligence Opportunities</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time opportunities from weather, trends, competitors, and local events
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary">Auto-detect</Badge>
            <Badge variant="secondary">Countdown timers</Badge>
            <Badge variant="secondary">One-click generate</Badge>
          </div>
        </Card>
      </div>

      {/* Main Content Calendar Hub */}
      {initialized ? (
        <ContentCalendarHub
          brandId={brandId}
          userId={userId}
          pillars={pillars}
        />
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Initializing content calendar demo...</p>
          </div>
        </Card>
      )}

      {/* Features List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">System Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">✨ Content Generation</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>MARBA (Claude Sonnet 3.5) or Synapse (enhanced) mode toggle</li>
              <li>3 AI-generated variations per request</li>
              <li>Psychology scores and power word analysis</li>
              <li>Industry benchmark comparisons</li>
              <li>"Why This Works" explanations</li>
              <li>Inline content editing</li>
              <li>Generate from opportunities</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">📅 Calendar & Scheduling</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Month, week, day, and list views</li>
              <li>Drag-and-drop rescheduling</li>
              <li>Color-coding by platform and status</li>
              <li>Optimal time recommendations</li>
              <li>Platform-specific limits enforcement</li>
              <li>Conflict detection</li>
              <li>Hover previews with tooltips</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🚀 Bulk Operations</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Generate multiple posts at once</li>
              <li>Date range selection (week/month)</li>
              <li>Multi-platform support</li>
              <li>Pillar distribution settings</li>
              <li>Batch approve/reject</li>
              <li>Auto-schedule all items</li>
              <li>Generation summary reports</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">📊 Publishing Queue</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Upcoming 7-day schedule view</li>
              <li>Real-time status updates</li>
              <li>Manual publish buttons</li>
              <li>Error handling with retry</li>
              <li>Approval workflow (optional)</li>
              <li>Auto-refresh every 30 seconds</li>
              <li>Engagement metrics display</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">💡 Opportunities</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Weather alerts</li>
              <li>Trending topics</li>
              <li>Competitor activity</li>
              <li>Seasonal events</li>
              <li>Local news</li>
              <li>Countdown timers</li>
              <li>Impact scores</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🧠 Intelligence Badges</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Synapse Enhanced marker</li>
              <li>Data-driven indicator</li>
              <li>High-performing tag</li>
              <li>Psychology score visualization</li>
              <li>Power word highlights</li>
              <li>Emotional trigger analysis</li>
              <li>Connection discovery</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
