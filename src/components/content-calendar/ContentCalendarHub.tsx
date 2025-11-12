/**
 * ContentCalendarHub Component
 * Main hub integrating all content calendar features
 * Integrates with Optimize section of MIRROR
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid, List, Palette } from 'lucide-react';
import { CalendarView } from './CalendarView';
import { OpportunityFeed } from './OpportunityFeed';
import { ContentGenerator } from './ContentGenerator';
import { BulkContentGenerator } from './BulkContentGenerator';
import { PublishingQueue } from './PublishingQueue';
import { DesignStudio } from '@/components/design-studio';
import type { ContentItem, ContentPillar } from '@/types/content-calendar.types';

interface ContentCalendarHubProps {
  brandId: string;
  userId: string;
  pillars?: ContentPillar[];
}

export function ContentCalendarHub({ brandId, userId, pillars = [] }: ContentCalendarHubProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'queue'>('calendar');
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [showBulkGenerator, setShowBulkGenerator] = useState(false);
  const [showDesignStudio, setShowDesignStudio] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

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
    setRefreshKey((prev) => prev + 1);
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
      {/* Opportunity Feed */}
      <OpportunityFeed
        brandId={brandId}
        userId={userId}
        onGenerateFromOpportunity={() => {
          // Opportunity generator is handled within OpportunityFeed
        }}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setShowContentGenerator(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Content
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'calendar' | 'queue')}>
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="queue">Publishing Queue</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === 'calendar' && (
          <CalendarView
            key={`calendar-${refreshKey}`}
            brandId={brandId}
            onEventClick={handleContentClick}
            onEventDrop={handleRefresh}
          />
        )}

        {activeTab === 'queue' && (
          <PublishingQueue
            key={`queue-${refreshKey}`}
            brandId={brandId}
            days={7}
            enableApprovalWorkflow={false}
            onRefresh={handleRefresh}
          />
        )}
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
