"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  trendClassName?: string;
}

const sizeConfig = {
  sm: {
    container: 'p-4',
    icon: 'h-4 w-4',
    value: 'text-lg font-semibold',
    title: 'text-xs text-muted-foreground',
    description: 'text-xs text-muted-foreground',
    trend: 'text-xs',
  },
  md: {
    container: 'p-6',
    icon: 'h-5 w-5',
    value: 'text-2xl font-bold',
    title: 'text-sm text-muted-foreground',
    description: 'text-sm text-muted-foreground',
    trend: 'text-sm',
  },
  lg: {
    container: 'p-8',
    icon: 'h-6 w-6',
    value: 'text-3xl font-bold',
    title: 'text-base text-muted-foreground',
    description: 'text-base text-muted-foreground',
    trend: 'text-base',
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

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  size = 'md',
  className,
  iconClassName,
  valueClassName,
  titleClassName,
  descriptionClassName,
  trendClassName,
}: StatCardProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const formatValue = () => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value === 0) return <Minus className="h-3 w-3" />;
    return trend.isPositive ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value === 0) return variantStyles.trend.neutral;
    return trend.isPositive ? variantStyles.trend.positive : variantStyles.trend.negative;
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className={cn(sizeStyles.container)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {Icon && (
                <Icon className={cn(sizeStyles.icon, variantStyles.icon, iconClassName)} />
              )}
              <span className={cn(sizeStyles.title, titleClassName)}>
                {title}
              </span>
            </div>
            
            <div className={cn(sizeStyles.value, variantStyles.value, valueClassName)}>
              {formatValue()}
            </div>
            
            {description && (
              <p className={cn(sizeStyles.description, descriptionClassName)}>
                {description}
              </p>
            )}
          </div>
          
          {trend && (
            <div className={cn('flex items-center gap-1', getTrendColor(), trendClassName)}>
              {getTrendIcon()}
              <span className={cn(sizeStyles.trend, 'font-medium')}>
                {Math.abs(trend.value)}%
              </span>
              {trend.period && (
                <span className={cn(sizeStyles.trend, 'text-muted-foreground')}>
                  {trend.period}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for tight spaces
export function CompactStatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  className,
}: Omit<StatCardProps, 'size' | 'description' | 'trend'>) {
  const variantStyles = variantConfig[variant];

  const formatValue = () => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          {Icon && (
            <Icon className={cn('h-4 w-4', variantStyles.icon)} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className={cn('text-lg font-semibold', variantStyles.value)}>
              {formatValue()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for easy stat management
export function useStatCard() {
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

  const calculateTrend = (current: number, previous: number): {
    value: number;
    isPositive: boolean;
  } => {
    if (previous === 0) return { value: 0, isPositive: true };
    
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
    };
  };

  return {
    formatCurrency,
    formatPercentage,
    formatNumber,
    calculateTrend,
  };
} 