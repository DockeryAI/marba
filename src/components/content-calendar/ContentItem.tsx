/**
 * ContentItem Component
 * Displays a content calendar item with preview, platform, status, and actions
 * Tasks 306-315
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash2,
  Copy,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  FileText,
  Heart,
  MessageCircle,
  Share2,
  Eye,
} from 'lucide-react';
import type { ContentItem as ContentItemType, Platform } from '@/types/content-calendar.types';

interface ContentItemProps {
  item: ContentItemType;
  onEdit?: (item: ContentItemType) => void;
  onDelete?: (item: ContentItemType) => void;
  onDuplicate?: (item: ContentItemType) => void;
  compact?: boolean;
}

/**
 * Platform icon components
 */
const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  tiktok: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  email: <Mail className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
};

/**
 * Platform colors
 */
const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: 'bg-pink-500 text-white',
  twitter: 'bg-blue-400 text-white',
  linkedin: 'bg-blue-700 text-white',
  facebook: 'bg-blue-600 text-white',
  tiktok: 'bg-black text-white',
  email: 'bg-red-500 text-white',
  blog: 'bg-green-600 text-white',
};

/**
 * Status badge colors
 */
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 border-gray-200',
  scheduled: 'bg-orange-100 text-orange-800 border-orange-200',
  published: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

export function ContentItem({
  item,
  onEdit,
  onDelete,
  onDuplicate,
  compact = false,
}: ContentItemProps) {
  /**
   * Format date/time for display
   */
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  /**
   * Get content preview
   */
  const getContentPreview = () => {
    const maxLength = compact ? 80 : 150;
    if (item.content_text.length <= maxLength) {
      return item.content_text;
    }
    return item.content_text.substring(0, maxLength) + '...';
  };

  /**
   * Get intelligence badge icon
   */
  const getIntelligenceBadgeIcon = (badge: string) => {
    if (badge.toLowerCase().includes('synapse')) return '🧠';
    if (badge.toLowerCase().includes('data')) return '📊';
    if (badge.toLowerCase().includes('high-performing')) return '🎯';
    return '✨';
  };

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${compact ? 'p-3' : ''}`}>
      {/* Header: Platform and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Platform Badge */}
          <Badge className={`${PLATFORM_COLORS[item.platform]} px-2 py-1`}>
            <span className="flex items-center gap-1">
              {PLATFORM_ICONS[item.platform]}
              <span className="capitalize text-xs">{item.platform}</span>
            </span>
          </Badge>

          {/* Status Badge */}
          <Badge variant="outline" className={STATUS_COLORS[item.status]}>
            {item.status}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              title="Edit content"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDuplicate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(item)}
              title="Duplicate content"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item)}
              title="Delete content"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-3">
        <p className="text-sm text-foreground leading-relaxed">{getContentPreview()}</p>
      </div>

      {/* Intelligence Badges */}
      {item.intelligence_badges && item.intelligence_badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.intelligence_badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
            >
              <span className="mr-1">{getIntelligenceBadgeIcon(badge)}</span>
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Synapse Score */}
      {item.synapse_score !== undefined && item.synapse_score > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Synapse Score:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
              <div
                className={`h-2 rounded-full ${
                  item.synapse_score >= 80
                    ? 'bg-green-500'
                    : item.synapse_score >= 60
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${item.synapse_score}%` }}
              />
            </div>
            <span className="text-xs font-semibold">{item.synapse_score}/100</span>
          </div>
        </div>
      )}

      {/* Scheduled Time */}
      <div className="mb-3 text-sm text-muted-foreground">
        <span className="font-semibold">
          {item.status === 'published' ? 'Published: ' : 'Scheduled: '}
        </span>
        {formatDateTime(item.status === 'published' ? item.published_time : item.scheduled_time)}
      </div>

      {/* Engagement Metrics (if published) */}
      {item.status === 'published' && item.engagement_metrics && (
        <div className="flex items-center gap-4 pt-3 border-t">
          {item.engagement_metrics.likes > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{item.engagement_metrics.likes.toLocaleString()}</span>
            </div>
          )}
          {item.engagement_metrics.comments > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>{item.engagement_metrics.comments.toLocaleString()}</span>
            </div>
          )}
          {item.engagement_metrics.shares > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Share2 className="w-4 h-4 text-green-500" />
              <span>{item.engagement_metrics.shares.toLocaleString()}</span>
            </div>
          )}
          {item.engagement_metrics.reach > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Eye className="w-4 h-4 text-purple-500" />
              <span>{item.engagement_metrics.reach.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Error Message (if failed) */}
      {item.status === 'failed' && item.error_message && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <span className="font-semibold">Error: </span>
          {item.error_message}
        </div>
      )}
    </Card>
  );
}
