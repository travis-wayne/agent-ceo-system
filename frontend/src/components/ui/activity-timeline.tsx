"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LucideIcon, Clock, User } from "lucide-react";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: LucideIcon;
  avatar?: {
    src?: string;
    fallback: string;
  };
  status?: 'completed' | 'in-progress' | 'pending' | 'failed' | 'success' | 'warning' | 'error';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  itemClassName?: string;
  showAvatars?: boolean;
  showIcons?: boolean;
  showTimestamps?: boolean;
  showStatus?: boolean;
  maxItems?: number;
  loading?: boolean;
  emptyMessage?: string;
}

const sizeConfig = {
  sm: {
    container: 'space-y-3',
    item: 'gap-3',
    icon: 'h-4 w-4',
    avatar: 'h-6 w-6',
    title: 'text-sm font-medium',
    description: 'text-xs text-muted-foreground',
    timestamp: 'text-xs text-muted-foreground',
  },
  md: {
    container: 'space-y-4',
    item: 'gap-4',
    icon: 'h-5 w-5',
    avatar: 'h-8 w-8',
    title: 'text-base font-medium',
    description: 'text-sm text-muted-foreground',
    timestamp: 'text-sm text-muted-foreground',
  },
  lg: {
    container: 'space-y-6',
    item: 'gap-6',
    icon: 'h-6 w-6',
    avatar: 'h-10 w-10',
    title: 'text-lg font-medium',
    description: 'text-base text-muted-foreground',
    timestamp: 'text-base text-muted-foreground',
  },
};

const variantConfig = {
  default: {
    container: 'relative',
    item: 'relative',
    line: 'absolute left-4 top-8 bottom-0 w-0.5 bg-border',
  },
  compact: {
    container: 'space-y-2',
    item: 'flex items-center gap-3',
    line: 'hidden',
  },
  detailed: {
    container: 'relative',
    item: 'relative',
    line: 'absolute left-6 top-12 bottom-0 w-0.5 bg-border',
  },
};

const statusConfig = {
  completed: { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
  'in-progress': { color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  failed: { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  success: { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
  warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  error: { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
};

export function ActivityTimeline({
  items,
  variant = 'default',
  size = 'md',
  className,
  itemClassName,
  showAvatars = true,
  showIcons = true,
  showTimestamps = true,
  showStatus = true,
  maxItems,
  loading = false,
  emptyMessage = "No activities found",
}: ActivityTimelineProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const formatTimestamp = (timestamp: Date | string) => {
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleString();
    }
    return timestamp.toLocaleString();
  };

  const formatRelativeTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (displayItems.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className={cn(sizeStyles.container, variantStyles.container)}>
          {displayItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === displayItems.length - 1;
            const statusStyles = item.status ? statusConfig[item.status] : null;

            return (
              <div
                key={item.id}
                className={cn(
                  'flex',
                  sizeStyles.item,
                  variantStyles.item,
                  itemClassName,
                  item.className
                )}
              >
                {/* Timeline line */}
                {!isLast && variant !== 'compact' && (
                  <div className={cn(sizeStyles.line, variantStyles.line)} />
                )}

                {/* Avatar or Icon */}
                <div className="flex-shrink-0">
                  {showAvatars && item.avatar ? (
                    <Avatar className={cn(sizeStyles.avatar, statusStyles?.border)}>
                      <AvatarImage src={item.avatar.src} />
                      <AvatarFallback className={cn(statusStyles?.bg, statusStyles?.color)}>
                        {item.avatar.fallback}
                      </AvatarFallback>
                    </Avatar>
                  ) : showIcons && Icon ? (
                    <div className={cn(
                      'flex items-center justify-center rounded-full p-2',
                      sizeStyles.icon,
                      statusStyles?.bg,
                      statusStyles?.color
                    )}>
                      <Icon className="h-full w-full" />
                    </div>
                  ) : (
                    <div className={cn(
                      'flex items-center justify-center rounded-full p-2 bg-muted',
                      sizeStyles.icon
                    )}>
                      <User className="h-full w-full text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(sizeStyles.title, 'truncate')}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className={cn(sizeStyles.description, 'mt-1')}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {showStatus && item.status && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs',
                            statusStyles?.color,
                            statusStyles?.bg,
                            statusStyles?.border
                          )}
                        >
                          {item.status}
                        </Badge>
                      )}
                      
                      {showTimestamps && (
                        <div className={cn('flex items-center gap-1', sizeStyles.timestamp)}>
                          <Clock className="h-3 w-3" />
                          <span title={formatTimestamp(item.timestamp)}>
                            {formatRelativeTime(item.timestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for tight spaces
export function CompactActivityTimeline({
  items,
  className,
}: Omit<ActivityTimelineProps, 'variant' | 'size' | 'showAvatars' | 'showIcons' | 'showTimestamps' | 'showStatus'>) {
  return (
    <ActivityTimeline
      items={items}
      variant="compact"
      size="sm"
      showAvatars={false}
      showIcons={false}
      showTimestamps={false}
      showStatus={false}
      className={className}
    />
  );
}

// Detailed version with more information
export function DetailedActivityTimeline({
  items,
  className,
}: Omit<ActivityTimelineProps, 'variant' | 'size' | 'showAvatars' | 'showIcons' | 'showTimestamps' | 'showStatus'>) {
  return (
    <ActivityTimeline
      items={items}
      variant="detailed"
      size="lg"
      showAvatars={true}
      showIcons={true}
      showTimestamps={true}
      showStatus={true}
      className={className}
    />
  );
}

// Hook for easy timeline management
export function useActivityTimeline() {
  const createTimelineItem = (
    id: string,
    title: string,
    timestamp: Date | string,
    options: Partial<Omit<TimelineItem, 'id' | 'title' | 'timestamp'>> = {}
  ): TimelineItem => {
    return {
      id,
      title,
      timestamp,
      ...options,
    };
  };

  const createTimelineItemWithIcon = (
    id: string,
    title: string,
    timestamp: Date | string,
    icon: LucideIcon,
    options: Partial<Omit<TimelineItem, 'id' | 'title' | 'timestamp' | 'icon'>> = {}
  ): TimelineItem => {
    return createTimelineItem(id, title, timestamp, { ...options, icon });
  };

  const createTimelineItemWithAvatar = (
    id: string,
    title: string,
    timestamp: Date | string,
    avatar: { src?: string; fallback: string },
    options: Partial<Omit<TimelineItem, 'id' | 'title' | 'timestamp' | 'avatar'>> = {}
  ): TimelineItem => {
    return createTimelineItem(id, title, timestamp, { ...options, avatar });
  };

  const sortByTimestamp = (items: TimelineItem[], ascending = false): TimelineItem[] => {
    return [...items].sort((a, b) => {
      const dateA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
      const dateB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
      return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  const filterByStatus = (items: TimelineItem[], status: TimelineItem['status']): TimelineItem[] => {
    return items.filter(item => item.status === status);
  };

  return {
    createTimelineItem,
    createTimelineItemWithIcon,
    createTimelineItemWithAvatar,
    sortByTimestamp,
    filterByStatus,
  };
} 