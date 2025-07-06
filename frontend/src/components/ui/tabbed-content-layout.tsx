"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  className?: string;
}

interface TabbedContentLayoutProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: 'default' | 'card' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  showIcons?: boolean;
  showBadges?: boolean;
  fullWidth?: boolean;
  centered?: boolean;
}

const variantConfig = {
  default: {
    list: 'grid w-full grid-cols-1',
    trigger: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  },
  card: {
    list: 'grid w-full grid-cols-1',
    trigger: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  },
  pills: {
    list: 'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1',
    trigger: 'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
  },
  underline: {
    list: 'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
    trigger: 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  },
};

const sizeConfig = {
  sm: {
    list: 'h-8',
    trigger: 'text-xs px-2 py-1',
    icon: 'h-3 w-3',
  },
  md: {
    list: 'h-10',
    trigger: 'text-sm px-3 py-2',
    icon: 'h-4 w-4',
  },
  lg: {
    list: 'h-12',
    trigger: 'text-base px-4 py-3',
    icon: 'h-5 w-5',
  },
};

export function TabbedContentLayout({
  tabs,
  defaultTab,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  showIcons = true,
  showBadges = true,
  fullWidth = false,
  centered = false,
}: TabbedContentLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const variantStyles = variantConfig[variant];
  const sizeStyles = sizeConfig[size];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderTabTrigger = (tab: TabItem) => {
    const Icon = tab.icon;
    
    return (
      <TabsTrigger
        key={tab.id}
        value={tab.id}
        disabled={tab.disabled}
        className={cn(
          variantStyles.trigger,
          sizeStyles.trigger,
          tabsTriggerClassName,
          tab.className
        )}
      >
        <div className="flex items-center gap-2">
          {showIcons && Icon && (
            <Icon className={sizeStyles.icon} />
          )}
          <span>{tab.label}</span>
          {showBadges && tab.badge && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {tab.badge}
            </Badge>
          )}
        </div>
      </TabsTrigger>
    );
  };

  const renderTabContent = (tab: TabItem) => {
    return (
      <TabsContent
        key={tab.id}
        value={tab.id}
        className={cn(
          'mt-6',
          tabsContentClassName,
          tab.className
        )}
      >
        {variant === 'card' ? (
          <Card>
            <CardContent className="pt-6">
              {tab.content}
            </CardContent>
          </Card>
        ) : (
          tab.content
        )}
      </TabsContent>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        orientation={orientation}
        className={cn(
          'w-full',
          fullWidth && 'w-full',
          centered && 'flex flex-col items-center'
        )}
      >
        <TabsList
          className={cn(
            variantStyles.list,
            sizeStyles.list,
            tabsListClassName,
            fullWidth && 'w-full',
            centered && 'justify-center'
          )}
        >
          {tabs.map(renderTabTrigger)}
        </TabsList>
        
        {tabs.map(renderTabContent)}
      </Tabs>
    </div>
  );
}

// Compact version for tight spaces
export function CompactTabbedContent({
  tabs,
  defaultTab,
  className,
}: Omit<TabbedContentLayoutProps, 'variant' | 'size' | 'orientation' | 'showIcons' | 'showBadges' | 'fullWidth' | 'centered'>) {
  return (
    <TabbedContentLayout
      tabs={tabs}
      defaultTab={defaultTab}
      variant="pills"
      size="sm"
      showIcons={false}
      showBadges={false}
      className={className}
    />
  );
}

// Card-based version
export function CardTabbedContent({
  tabs,
  defaultTab,
  className,
}: Omit<TabbedContentLayoutProps, 'variant' | 'orientation' | 'showIcons' | 'showBadges' | 'fullWidth' | 'centered'>) {
  return (
    <TabbedContentLayout
      tabs={tabs}
      defaultTab={defaultTab}
      variant="card"
      className={className}
    />
  );
}

// Vertical layout version
export function VerticalTabbedContent({
  tabs,
  defaultTab,
  className,
}: Omit<TabbedContentLayoutProps, 'variant' | 'orientation' | 'showIcons' | 'showBadges' | 'fullWidth' | 'centered'>) {
  return (
    <TabbedContentLayout
      tabs={tabs}
      defaultTab={defaultTab}
      orientation="vertical"
      className={className}
    />
  );
}

// Hook for easy tab management
export function useTabbedContent() {
  const createTab = (
    id: string,
    label: string,
    content: React.ReactNode,
    options: Partial<Omit<TabItem, 'id' | 'label' | 'content'>> = {}
  ): TabItem => {
    return {
      id,
      label,
      content,
      ...options,
    };
  };

  const createTabWithIcon = (
    id: string,
    label: string,
    content: React.ReactNode,
    icon: LucideIcon,
    options: Partial<Omit<TabItem, 'id' | 'label' | 'content' | 'icon'>> = {}
  ): TabItem => {
    return createTab(id, label, content, { ...options, icon });
  };

  const createTabWithBadge = (
    id: string,
    label: string,
    content: React.ReactNode,
    badge: string | number,
    options: Partial<Omit<TabItem, 'id' | 'label' | 'content' | 'badge'>> = {}
  ): TabItem => {
    return createTab(id, label, content, { ...options, badge });
  };

  const filterEnabledTabs = (tabs: TabItem[]): TabItem[] => {
    return tabs.filter(tab => !tab.disabled);
  };

  return {
    createTab,
    createTabWithIcon,
    createTabWithBadge,
    filterEnabledTabs,
  };
} 