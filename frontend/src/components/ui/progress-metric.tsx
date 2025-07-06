"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ProgressMetricProps {
  label: string;
  value: number | string;
  progress?: number; // 0-100
  unit?: string; // %, $, etc.
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showProgress?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  progressClassName?: string;
}

const sizeConfig = {
  sm: {
    container: 'space-y-1',
    label: 'text-xs text-muted-foreground',
    value: 'text-sm font-medium',
    progress: 'h-1',
  },
  md: {
    container: 'space-y-2',
    label: 'text-sm text-muted-foreground',
    value: 'text-base font-medium',
    progress: 'h-2',
  },
  lg: {
    container: 'space-y-3',
    label: 'text-sm text-muted-foreground',
    value: 'text-lg font-semibold',
    progress: 'h-3',
  },
};

const variantConfig = {
  default: {
    value: 'text-foreground',
    progress: 'bg-primary',
  },
  success: {
    value: 'text-green-600',
    progress: 'bg-green-500',
  },
  warning: {
    value: 'text-yellow-600',
    progress: 'bg-yellow-500',
  },
  danger: {
    value: 'text-red-600',
    progress: 'bg-red-500',
  },
  info: {
    value: 'text-blue-600',
    progress: 'bg-blue-500',
  },
};

export function ProgressMetric({
  label,
  value,
  progress,
  unit,
  icon: Icon,
  size = 'md',
  variant = 'default',
  showProgress = true,
  className,
  labelClassName,
  valueClassName,
  progressClassName,
}: ProgressMetricProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const formatValue = () => {
    if (typeof value === 'number') {
      return unit ? `${value}${unit}` : value.toString();
    }
    return value;
  };

  return (
    <div className={cn(sizeStyles.container, className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className={cn(sizeStyles.label, labelClassName)}>
            {label}
          </span>
        </div>
        <span className={cn(sizeStyles.value, variantStyles.value, valueClassName)}>
          {formatValue()}
        </span>
      </div>
      
      {showProgress && progress !== undefined && (
        <Progress 
          value={progress} 
          className={cn(sizeStyles.progress, progressClassName)}
        />
      )}
    </div>
  );
}

// Compact version for tight spaces
export function CompactProgressMetric({
  label,
  value,
  progress,
  unit,
  icon: Icon,
  variant = 'default',
  className,
}: Omit<ProgressMetricProps, 'size' | 'showProgress'>) {
  const variantStyles = variantConfig[variant];

  const formatValue = () => {
    if (typeof value === 'number') {
      return unit ? `${value}${unit}` : value.toString();
    }
    return value;
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn('text-sm font-medium', variantStyles.value)}>
          {formatValue()}
        </span>
        {progress !== undefined && (
          <Progress 
            value={progress} 
            className="w-16 h-1.5"
          />
        )}
      </div>
    </div>
  );
}

// Hook for easy metric management
export function useProgressMetric() {
  const getVariantFromValue = (value: number, thresholds: {
    success?: number;
    warning?: number;
    danger?: number;
  } = {}) => {
    const { success = 80, warning = 60, danger = 40 } = thresholds;
    
    if (value >= success) return 'success';
    if (value >= warning) return 'warning';
    if (value >= danger) return 'danger';
    return 'danger';
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  };

  return {
    getVariantFromValue,
    formatPercentage,
    formatCurrency,
  };
} 