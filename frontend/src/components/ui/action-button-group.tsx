"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LucideIcon, MoreHorizontal, ChevronDown } from "lucide-react";

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  separator?: boolean; // Add separator after this item
}

interface ActionButtonGroupProps {
  actions: ActionItem[];
  variant?: 'default' | 'compact' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  maxVisible?: number; // Max buttons to show before collapsing to dropdown
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  showLabels?: boolean; // Show text labels or just icons
  align?: 'left' | 'center' | 'right';
}

const sizeConfig = {
  sm: {
    button: 'h-8 px-2 text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1',
  },
  md: {
    button: 'h-9 px-3 text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
  },
  lg: {
    button: 'h-10 px-4 text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
  },
};

const variantConfig = {
  default: 'flex items-center',
  compact: 'flex items-center space-x-1',
  stacked: 'flex flex-col space-y-2',
};

const alignConfig = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export function ActionButtonGroup({
  actions,
  variant = 'default',
  size = 'md',
  maxVisible = 3,
  className,
  buttonClassName,
  dropdownClassName,
  showLabels = true,
  align = 'left',
}: ActionButtonGroupProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];
  const alignStyles = alignConfig[align];

  const visibleActions = actions.slice(0, maxVisible);
  const dropdownActions = actions.slice(maxVisible);

  const renderActionButton = (action: ActionItem, index: number) => {
    const Icon = action.icon;
    
    return (
      <Button
        key={`${action.label}-${index}`}
        variant={action.variant || 'outline'}
        size={action.size || size}
        onClick={action.onClick}
        disabled={action.disabled}
        className={cn(
          sizeStyles.button,
          buttonClassName
        )}
      >
        {Icon && <Icon className={cn(sizeStyles.icon, 'mr-1')} />}
        {showLabels && action.label}
      </Button>
    );
  };

  const renderDropdownMenu = () => {
    if (dropdownActions.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={cn(
              sizeStyles.button,
              'flex items-center gap-1',
              dropdownClassName
            )}
          >
            <MoreHorizontal className={sizeStyles.icon} />
            {showLabels && (
              <>
                <span>More</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {dropdownActions.map((action, index) => (
            <React.Fragment key={`dropdown-${action.label}-${index}`}>
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  action.variant === 'destructive' && 'text-red-600 focus:text-red-600'
                )}
              >
                {action.icon && (
                  <action.icon className={cn(sizeStyles.icon, 'mr-2')} />
                )}
                {action.label}
              </DropdownMenuItem>
              {action.separator && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className={cn(
      variantStyles,
      sizeStyles.gap,
      alignStyles,
      className
    )}>
      {visibleActions.map((action, index) => renderActionButton(action, index))}
      {renderDropdownMenu()}
    </div>
  );
}

// Icon-only version for compact spaces
export function IconActionButtonGroup({
  actions,
  size = 'md',
  maxVisible = 5,
  className,
  buttonClassName,
}: Omit<ActionButtonGroupProps, 'variant' | 'showLabels' | 'align'>) {
  return (
    <ActionButtonGroup
      actions={actions}
      variant="compact"
      size={size}
      maxVisible={maxVisible}
      showLabels={false}
      className={className}
      buttonClassName={buttonClassName}
    />
  );
}

// Vertical stacked version
export function StackedActionButtonGroup({
  actions,
  size = 'md',
  className,
  buttonClassName,
}: Omit<ActionButtonGroupProps, 'variant' | 'maxVisible' | 'showLabels' | 'align'>) {
  return (
    <ActionButtonGroup
      actions={actions}
      variant="stacked"
      size={size}
      maxVisible={actions.length}
      showLabels={true}
      align="left"
      className={className}
      buttonClassName={buttonClassName}
    />
  );
}

// Hook for easy action management
export function useActionButtonGroup() {
  const createAction = (
    label: string,
    onClick: () => void,
    options: Partial<Omit<ActionItem, 'label' | 'onClick'>> = {}
  ): ActionItem => {
    return {
      label,
      onClick,
      ...options,
    };
  };

  const createDestructiveAction = (
    label: string,
    onClick: () => void,
    options: Partial<Omit<ActionItem, 'label' | 'onClick' | 'variant'>> = {}
  ): ActionItem => {
    return createAction(label, onClick, { ...options, variant: 'destructive' });
  };

  const createSeparator = (): ActionItem => {
    return {
      label: 'separator',
      onClick: () => {},
      separator: true,
    };
  };

  const filterEnabledActions = (actions: ActionItem[]): ActionItem[] => {
    return actions.filter(action => !action.disabled);
  };

  return {
    createAction,
    createDestructiveAction,
    createSeparator,
    filterEnabledActions,
  };
} 