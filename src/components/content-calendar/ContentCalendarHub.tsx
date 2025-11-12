/**
 * ContentCalendarHub Component
 * Main hub integrating all content calendar features
 * Integrates with Optimize section of MIRROR
 * Task 3.6 - Complete Content Calendar Hub Integration
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Grid,
  Palette,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Send,
  Lightbulb,
} from 'lucide-react';
import { CalendarView } from './CalendarView';
import { OpportunityFeed } from './OpportunityFeed';
import { ContentGenerator } from './ContentGenerator';
import { BulkContentGenerator } from './BulkContentGenerator';
import { PublishingQueue } from './PublishingQueue';
import { DesignStudio } from '@/components/design-studio';
import { ContentCalendarService } from '@/services/content-calendar.service';
import type { ContentItem, ContentPillar, Platform } from '@/types/content-calendar.types';

interface ContentCalendarHubProps {
  brandId: string;
  userId: string;
  pillars?: ContentPillar[];
}

export function ContentCalendarHub({ brandId, userId, pillars = [] }: ContentCalendarHubProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'queue' | 'generator' | 'opportunities'>(
    'calendar'
  );
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [showBulkGenerator, setShowBulkGenerator] = useState(false);
  const [showDesignStudio, setShowDesignStudio] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters and search
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    published: 0,
    pending: 0,
  });

  /**
   * Load stats
   */
  const loadStats = async () => {
    try {
      const items = await ContentCalendarService.getContentItems(
        brandId,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      );

      setStats({
        total: items.length,
        scheduled: items.filter(i => i.status === 'scheduled').length,
        published: items.filter(i => i.status === 'published').length,
        pending: items.filter(i => i.status === 'draft').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  /**
   * Load stats on mount and when refreshing
   */
  useEffect(() => {
    loadStats();
  }, [refreshKey, brandId]);

  /**
   * Handle content item click
   */
  const handleContentClick = (content: ContentItem) => {
    setSelectedContent(content);
    // Could open edit modal here
  };

  /**
   * Handle refresh after actions
   */
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    loadStats();
  };

  /**
   * Open design studio for a content item
   */
  const handleOpenDesignStudio = (contentId?: string) => {
    setEditingContentId(contentId);
    setShowDesignStudio(true);
  };

  /**
   * Handle design save
   */
  const handleDesignSave = () => {
    handleRefresh();
    setShowDesignStudio(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-muted-foreground mb-4">
          Plan, schedule, and publish content across all platforms
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Content</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1">Search Content</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by text, hashtags, or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Platform Filter */}
          <div className="w-full md:w-48">
            <Label className="text-xs text-muted-foreground mb-1">Platform</Label>
            <Select value={platformFilter} onValueChange={v => setPlatformFilter(v as Platform | 'all')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <div className="w-full md:w-40">
              <Label className="text-xs text-muted-foreground mb-1">Start Date</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="w-full md:w-40">
              <Label className="text-xs text-muted-foreground mb-1">End Date</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons and Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowContentGenerator(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
          <Button variant="outline" onClick={() => setShowBulkGenerator(true)}>
            <Grid className="w-4 h-4 mr-2" />
            Bulk Generate
          </Button>
          <Button variant="outline" onClick={() => handleOpenDesignStudio()}>
            <Palette className="w-4 h-4 mr-2" />
            Design Studio
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={v =>
            setActiveTab(v as 'calendar' | 'queue' | 'generator' | 'opportunities')
          }
        >
          <TabsList>
            <TabsTrigger value="calendar">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="queue">
              <Clock className="w-4 h-4 mr-2" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="generator">
              <Grid className="w-4 h-4 mr-2" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="opportunities">
              <Lightbulb className="w-4 h-4 mr-2" />
              Opportunities
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
        <TabsContent value="calendar" className="mt-0">
          <CalendarView
            key={`calendar-${refreshKey}`}
            brandId={brandId}
            onEventClick={handleContentClick}
            onEventDrop={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="queue" className="mt-0">
          <PublishingQueue
            key={`queue-${refreshKey}`}
            brandId={brandId}
            days={7}
            enableApprovalWorkflow={false}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="generator" className="mt-0">
          <Card className="p-8 text-center">
            <Grid className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Bulk Content Generator</h3>
            <p className="text-muted-foreground mb-6">
              Generate multiple posts at once across platforms and date ranges
            </p>
            <Button onClick={() => setShowBulkGenerator(true)} size="lg">
              <Grid className="w-4 h-4 mr-2" />
              Open Bulk Generator
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-0">
          <OpportunityFeed
            brandId={brandId}
            userId={userId}
            onGenerateFromOpportunity={() => {
              // Opportunity generator is handled within OpportunityFeed
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
          onClick={() => setShowContentGenerator(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Content Generator Modal */}
      <ContentGenerator
        open={showContentGenerator}
        onClose={() => setShowContentGenerator(false)}
        brandId={brandId}
        userId={userId}
        pillars={pillars}
        onContentCreated={handleRefresh}
      />

      {/* Bulk Content Generator Modal */}
      <BulkContentGenerator
        open={showBulkGenerator}
        onClose={() => setShowBulkGenerator(false)}
        brandId={brandId}
        userId={userId}
        pillars={pillars}
        onContentCreated={handleRefresh}
      />

      {/* Design Studio Modal */}
      <Dialog open={showDesignStudio} onOpenChange={setShowDesignStudio}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
          <DesignStudio
            contentItemId={editingContentId}
            brandId={brandId}
            userId={userId}
            mode="modal"
            onSave={handleDesignSave}
            onClose={() => setShowDesignStudio(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
