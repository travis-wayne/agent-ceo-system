"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricComparisonCardProps {
  title: string;
  currentValue: number | string;
  previousValue?: number | string;
  unit?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  progressValue?: number;
  showTrend?: boolean;
  trendPeriod?: string;
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
  titleClassName?: string;
  comparisonClassName?: string;
  progressClassName?: string;
}

const sizeConfig = {
  sm: {
    container: 'p-4',
    icon: 'h-4 w-4',
    value: 'text-lg font-semibold',
    title: 'text-xs text-muted-foreground',
    comparison: 'text-xs',
    progress: 'h-1 mt-2',
  },
  md: {
    container: 'p-6',
    icon: 'h-5 w-5',
    value: 'text-2xl font-bold',
    title: 'text-sm text-muted-foreground',
    comparison: 'text-sm',
    progress: 'h-2 mt-3',
  },
  lg: {
    container: 'p-8',
    icon: 'h-6 w-6',
    value: 'text-3xl font-bold',
    title: 'text-base text-muted-foreground',
    comparison: 'text-base',
    progress: 'h-3 mt-4',
  },
};

const variantConfig = {
  default: {
    icon: 'text-primary',
    value: 'text-foreground',
    trend: {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-muted-foreground',
    },
  },
  success: {
    icon: 'text-green-500',
    value: 'text-green-600',
    trend: {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-muted-foreground',
    },
  },
  warning: {
    icon: 'text-yellow-500',
    value: 'text-yellow-600',
    trend: {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-muted-foreground',
    },
  },
  danger: {
    icon: 'text-red-500',
    value: 'text-red-600',
    trend: {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-muted-foreground',
    },
  },
  info: {
    icon: 'text-blue-500',
    value: 'text-blue-600',
    trend: {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-muted-foreground',
    },
  },
};

export function MetricComparisonCard({
  title,
  currentValue,
  previousValue,
  unit,
  icon: Icon,
  variant = 'default',
  size = 'md',
  showProgress = false,
  progressValue,
  showTrend = true,
  trendPeriod = 'vs last period',
  className,
  iconClassName,
  valueClassName,
  titleClassName,
  comparisonClassName,
  progressClassName,
}: MetricComparisonCardProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const formatValue = (value: number | string) => {
    if (typeof value === 'number') {
      return unit ? `${value}${unit}` : value.toLocaleString();
    }
    return value;
  };

  const calculateChange = () => {
    if (previousValue === undefined || typeof currentValue !== 'number' || typeof previousValue !== 'number') {
      return null;
    }

    if (previousValue === 0) return { percentage: 0, isPositive: true };

    const change = ((currentValue - previousValue) / previousValue) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change >= 0,
    };
  };

  const getTrendIcon = () => {
    const change = calculateChange();
    if (!change) return null;
    
    if (change.percentage === 0) return <Minus className="h-3 w-3" />;
    return change.isPositive ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  };

  const getTrendColor = () => {
    const change = calculateChange();
    if (!change) return '';
    
    if (change.percentage === 0) return variantStyles.trend.neutral;
    return change.isPositive ? variantStyles.trend.positive : variantStyles.trend.negative;
  };

  const change = calculateChange();

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className={sizeStyles.container}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className={cn(sizeStyles.icon, variantStyles.icon, iconClassName)} />
            )}
            <span className={cn(sizeStyles.title, titleClassName)}>
              {title}
            </span>
          </div>
        </div>
        
        <div className={cn(sizeStyles.value, variantStyles.value, valueClassName)}>
          {formatValue(currentValue)}
        </div>
        
        {showTrend && change && (
          <div className={cn('flex items-center gap-1 mt-1', getTrendColor(), comparisonClassName)}>
            {getTrendIcon()}
            <span className={cn(sizeStyles.comparison, 'font-medium')}>
              {change.percentage.toFixed(1)}%
            </span>
            <span className={cn(sizeStyles.comparison, 'text-muted-foreground')}>
              {trendPeriod}
            </span>
          </div>
        )}
        
        {showProgress && progressValue !== undefined && (
          <Progress 
            value={progressValue} 
            className={cn(sizeStyles.progress, progressClassName)}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for tight spaces
export function CompactMetricComparisonCard({
  title,
  currentValue,
  previousValue,
  unit,
  icon: Icon,
  variant = 'default',
  className,
}: Omit<MetricComparisonCardProps, 'size' | 'showProgress' | 'progressValue' | 'showTrend' | 'trendPeriod'>) {
  const variantStyles = variantConfig[variant];

  const formatValue = (value: number | string) => {
    if (typeof value === 'number') {
      return unit ? `${value}${unit}` : value.toLocaleString();
    }
    return value;
  };

  const calculateChange = () => {
    if (previousValue === undefined || typeof currentValue !== 'number' || typeof previousValue !== 'number') {
      return null;
    }

    if (previousValue === 0) return { percentage: 0, isPositive: true };

    const change = ((currentValue - previousValue) / previousValue) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change >= 0,
    };
  };

  const change = calculateChange();

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className={cn('h-4 w-4', variantStyles.icon)} />
            )}
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className={cn('text-lg font-semibold', variantStyles.value)}>
                {formatValue(currentValue)}
              </p>
            </div>
          </div>
          
          {change && (
            <div className={cn(
              'flex items-center gap-1',
              change.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {change.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-sm font-medium">
                {change.percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for easy metric comparison management
export function useMetricComparison() {
  const calculatePercentageChange = (current: number, previous: number): {
    percentage: number;
    isPositive: boolean;
  } => {
    if (previous === 0) return { percentage: 0, isPositive: true };
    
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change >= 0,
    };
  };

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number, options?: {
    notation?: 'standard' | 'compact';
    maximumFractionDigits?: number;
  }) => {
    return new Intl.NumberFormat('en-US', {
      notation: options?.notation || 'standard',
      maximumFractionDigits: options?.maximumFractionDigits || 0,
    }).format(value);
  };

  const getVariantFromChange = (change: number): 'success' | 'warning' | 'danger' | 'default' => {
    if (change >= 10) return 'success';
    if (change >= 5) return 'warning';
    if (change >= 0) return 'default';
    return 'danger';
  };

  return {
    calculatePercentageChange,
    formatCurrency,
    formatPercentage,
    formatNumber,
    getVariantFromChange,
  };
} 