"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 
  | 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'running' | 'stopped'
  | 'online' | 'offline' | 'maintenance' | 'error' | 'warning' | 'success' | 'info'
  | 'draft' | 'published' | 'archived' | 'deleted' | 'suspended' | 'processing'
  | 'high' | 'medium' | 'low' | 'critical' | 'easy' | 'hard'
  | 'connected' | 'disconnected' | 'ready' | 'excellent' | 'good' | 'poor';

export type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusBadgeProps {
  status: StatusType;
  variant?: StatusVariant;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const statusConfig: Record<StatusType, {
  label: string;
  colors: string;
  icon?: string;
}> = {
  // Agent/Task Statuses
  active: { label: 'Active', colors: 'bg-green-100 text-green-800 border-green-200' },
  inactive: { label: 'Inactive', colors: 'bg-gray-100 text-gray-800 border-gray-200' },
  pending: { label: 'Pending', colors: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  completed: { label: 'Completed', colors: 'bg-green-100 text-green-800 border-green-200' },
  failed: { label: 'Failed', colors: 'bg-red-100 text-red-800 border-red-200' },
  running: { label: 'Running', colors: 'bg-blue-100 text-blue-800 border-blue-200' },
  stopped: { label: 'Stopped', colors: 'bg-gray-100 text-gray-800 border-gray-200' },
  
  // System Statuses
  online: { label: 'Online', colors: 'bg-green-100 text-green-800 border-green-200' },
  offline: { label: 'Offline', colors: 'bg-red-100 text-red-800 border-red-200' },
  maintenance: { label: 'Maintenance', colors: 'bg-orange-100 text-orange-800 border-orange-200' },
  error: { label: 'Error', colors: 'bg-red-100 text-red-800 border-red-200' },
  warning: { label: 'Warning', colors: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  success: { label: 'Success', colors: 'bg-green-100 text-green-800 border-green-200' },
  info: { label: 'Info', colors: 'bg-blue-100 text-blue-800 border-blue-200' },
  
  // Content Statuses
  draft: { label: 'Draft', colors: 'bg-gray-100 text-gray-800 border-gray-200' },
  published: { label: 'Published', colors: 'bg-green-100 text-green-800 border-green-200' },
  archived: { label: 'Archived', colors: 'bg-gray-100 text-gray-800 border-gray-200' },
  deleted: { label: 'Deleted', colors: 'bg-red-100 text-red-800 border-red-200' },
  suspended: { label: 'Suspended', colors: 'bg-orange-100 text-orange-800 border-orange-200' },
  processing: { label: 'Processing', colors: 'bg-blue-100 text-blue-800 border-blue-200' },
  
  // Priority Levels
  high: { label: 'High', colors: 'bg-orange-100 text-orange-800 border-orange-200' },
  medium: { label: 'Medium', colors: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  low: { label: 'Low', colors: 'bg-green-100 text-green-800 border-green-200' },
  critical: { label: 'Critical', colors: 'bg-red-100 text-red-800 border-red-200' },
  easy: { label: 'Easy', colors: 'bg-green-100 text-green-800 border-green-200' },
  hard: { label: 'Hard', colors: 'bg-red-100 text-red-800 border-red-200' },
  
  // Connection Statuses
  connected: { label: 'Connected', colors: 'bg-green-100 text-green-800 border-green-200' },
  disconnected: { label: 'Disconnected', colors: 'bg-red-100 text-red-800 border-red-200' },
  ready: { label: 'Ready', colors: 'bg-blue-100 text-blue-800 border-blue-200' },
  excellent: { label: 'Excellent', colors: 'bg-green-100 text-green-800 border-green-200' },
  good: { label: 'Good', colors: 'bg-blue-100 text-blue-800 border-blue-200' },
  poor: { label: 'Poor', colors: 'bg-red-100 text-red-800 border-red-200' },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export function StatusBadge({
  status,
  variant = 'outline',
  size = 'md',
  showIcon = false,
  className,
  children,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    console.warn(`Unknown status type: ${status}`);
    return (
      <Badge variant={variant} className={cn(sizeClasses[size], className)}>
        {children || status}
      </Badge>
    );
  }

  return (
    <Badge 
      variant={variant} 
      className={cn(
        sizeClasses[size],
        config.colors,
        className
      )}
    >
      {showIcon && config.icon && (
        <span className="mr-1">{config.icon}</span>
      )}
      {children || config.label}
    </Badge>
  );
}

// Hook for easy status management
export function useStatusBadge() {
  const getStatusConfig = (status: StatusType) => {
    return statusConfig[status] || { label: status, colors: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const isValidStatus = (status: string): status is StatusType => {
    return status in statusConfig;
  };

  return {
    getStatusConfig,
    isValidStatus,
    statusConfig,
  };
} 