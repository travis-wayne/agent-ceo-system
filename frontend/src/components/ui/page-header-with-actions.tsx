"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronRight, Home } from "lucide-react";
import { ActionItem, ActionButtonGroup } from "./action-button-group";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface PageHeaderWithActionsProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ActionItem[];
  icon?: LucideIcon;
  variant?: 'default' | 'compact' | 'large';
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  breadcrumbClassName?: string;
  actionsClassName?: string;
  showBreadcrumbs?: boolean;
  showActions?: boolean;
  showIcon?: boolean;
  align?: 'left' | 'center' | 'right';
}

const variantConfig = {
  default: {
    container: 'space-y-4',
    title: 'text-2xl font-bold tracking-tight',
    description: 'text-muted-foreground',
    breadcrumb: 'text-sm',
    actions: 'flex-shrink-0',
  },
  compact: {
    container: 'space-y-2',
    title: 'text-xl font-semibold',
    description: 'text-sm text-muted-foreground',
    breadcrumb: 'text-xs',
    actions: 'flex-shrink-0',
  },
  large: {
    container: 'space-y-6',
    title: 'text-3xl font-bold tracking-tight',
    description: 'text-lg text-muted-foreground',
    breadcrumb: 'text-base',
    actions: 'flex-shrink-0',
  },
};

const alignConfig = {
  left: 'items-start',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

export function PageHeaderWithActions({
  title,
  description,
  breadcrumbs = [],
  actions = [],
  icon: Icon,
  variant = 'default',
  className,
  titleClassName,
  descriptionClassName,
  breadcrumbClassName,
  actionsClassName,
  showBreadcrumbs = true,
  showActions = true,
  showIcon = true,
  align = 'left',
}: PageHeaderWithActionsProps) {
  const variantStyles = variantConfig[variant];
  const alignStyles = alignConfig[align];

  const renderBreadcrumbs = () => {
    if (!showBreadcrumbs || breadcrumbs.length === 0) return null;

    return (
      <nav className={cn('flex items-center space-x-1', variantStyles.breadcrumb, breadcrumbClassName)}>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
          <Home className="h-3 w-3" />
        </Button>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            {item.href ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href={item.href}>
                  {item.icon && <item.icon className="h-3 w-3 mr-1" />}
                  {item.label}
                </a>
              </Button>
            ) : (
              <span className="text-foreground">
                {item.icon && <item.icon className="h-3 w-3 mr-1 inline" />}
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('flex flex-col', variantStyles.container)}>
        {/* Breadcrumbs */}
        {renderBreadcrumbs()}
        
        {/* Main Header */}
        <div className={cn('flex items-start justify-between gap-4', alignStyles)}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {showIcon && Icon && (
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className={cn(variantStyles.title, titleClassName)}>
                  {title}
                </h1>
                {description && (
                  <p className={cn(variantStyles.description, descriptionClassName)}>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {showActions && actions.length > 0 && (
            <div className={cn(variantStyles.actions, actionsClassName)}>
              <ActionButtonGroup
                actions={actions}
                align={align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'}
              />
            </div>
          )}
        </div>
      </div>
      
      <Separator className="mt-6" />
    </div>
  );
}

// Compact version for tight spaces
export function CompactPageHeader({
  title,
  description,
  actions = [],
  icon: Icon,
  className,
}: Omit<PageHeaderWithActionsProps, 'variant' | 'breadcrumbs' | 'showBreadcrumbs' | 'showIcon' | 'align'>) {
  return (
    <PageHeaderWithActions
      title={title}
      description={description}
      actions={actions}
      icon={Icon}
      variant="compact"
      showBreadcrumbs={false}
      showIcon={false}
      className={className}
    />
  );
}

// Large version for hero sections
export function HeroPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions = [],
  icon: Icon,
  className,
}: Omit<PageHeaderWithActionsProps, 'variant' | 'showBreadcrumbs' | 'showActions' | 'showIcon' | 'align'>) {
  return (
    <PageHeaderWithActions
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      actions={actions}
      icon={Icon}
      variant="large"
      align="center"
      className={className}
    />
  );
}

// Hook for easy header management
export function usePageHeader() {
  const createBreadcrumb = (
    label: string,
    options: Partial<Omit<BreadcrumbItem, 'label'>> = {}
  ): BreadcrumbItem => {
    return {
      label,
      ...options,
    };
  };

  const createBreadcrumbs = (items: string[]): BreadcrumbItem[] => {
    return items.map(item => createBreadcrumb(item));
  };

  const createBreadcrumbsWithLinks = (
    items: Array<{ label: string; href?: string }>
  ): BreadcrumbItem[] => {
    return items.map(item => createBreadcrumb(item.label, { href: item.href }));
  };

  return {
    createBreadcrumb,
    createBreadcrumbs,
    createBreadcrumbsWithLinks,
  };
} 