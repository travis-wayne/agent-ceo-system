"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  X,
  ChevronDown,
  LucideIcon 
} from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  value: string;
}

export interface SortOption {
  key: string;
  label: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'dropdown' | 'search';
  options?: FilterOption[];
  placeholder?: string;
  multiple?: boolean;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string | string[]>;
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
  sortOptions?: SortOption[];
  activeSort?: string;
  onSortChange?: (sort: string) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  showClearAll?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  searchClassName?: string;
  filtersClassName?: string;
  sortClassName?: string;
  loading?: boolean;
}

const variantConfig = {
  default: {
    container: 'flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg',
    search: 'w-full sm:w-80',
    filters: 'flex gap-2 flex-wrap',
    sort: 'flex-shrink-0',
  },
  compact: {
    container: 'flex items-center gap-2 p-2 bg-muted/30 rounded-md',
    search: 'w-64',
    filters: 'flex gap-1',
    sort: 'flex-shrink-0',
  },
  minimal: {
    container: 'flex items-center gap-3',
    search: 'w-72',
    filters: 'flex gap-2',
    sort: 'flex-shrink-0',
  },
};

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue = '',
  onSearch,
  filters = [],
  activeFilters = {},
  onFilterChange,
  sortOptions = [],
  activeSort,
  onSortChange,
  showSearch = true,
  showFilters = true,
  showSort = true,
  showClearAll = true,
  variant = 'default',
  className,
  searchClassName,
  filtersClassName,
  sortClassName,
  loading = false,
}: FilterBarProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const variantStyles = variantConfig[variant];

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...activeFilters };
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
    } else {
      if (value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
    }
    
    onFilterChange?.(newFilters);
  };

  const handleSortChange = (value: string) => {
    onSortChange?.(value);
  };

  const clearAllFilters = () => {
    onSearch?.('');
    setLocalSearchValue('');
    onFilterChange?.({});
    onSortChange?.('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localSearchValue) count++;
    count += Object.keys(activeFilters).length;
    if (activeSort) count++;
    return count;
  };

  const renderFilter = (filter: FilterConfig) => {
    const currentValue = activeFilters[filter.key];

    if (filter.type === 'select') {
      return (
        <Select
          key={filter.key}
          value={Array.isArray(currentValue) ? currentValue[0] || '' : (currentValue as string) || ''}
          onValueChange={(value) => handleFilterChange(filter.key, value)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder={filter.placeholder || filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (filter.type === 'dropdown') {
      return (
        <DropdownMenu key={filter.key}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-3 w-3 mr-1" />
              {filter.label}
              {currentValue && (
                <Badge variant="secondary" className="ml-1">
                  {Array.isArray(currentValue) ? currentValue.length : 1}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleFilterChange(filter.key, '')}>
              All {filter.label}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {filter.options?.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFilterChange(filter.key, option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  const renderSort = () => {
    if (!showSort || sortOptions.length === 0) return null;

    return (
      <Select value={activeSort || ''} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              <div className="flex items-center gap-2">
                {option.direction === 'asc' ? (
                  <SortAsc className="h-3 w-3" />
                ) : (
                  <SortDesc className="h-3 w-3" />
                )}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className={cn(variantStyles.container, className)}>
      <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
        {showSearch && (
          <div className={cn("relative", variantStyles.search, searchClassName)}>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={localSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
              disabled={loading}
            />
          </div>
        )}
        
        {showFilters && filters.length > 0 && (
          <div className={cn(variantStyles.filters, filtersClassName)}>
            {filters.map(renderFilter)}
          </div>
        )}
      </div>
      
      <div className={cn("flex items-center gap-2", variantStyles.sort, sortClassName)}>
        {renderSort()}
        
        {showClearAll && getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-9"
            disabled={loading}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

// Compact version for tight spaces
export function CompactFilterBar({
  searchPlaceholder,
  searchValue,
  onSearch,
  filters,
  activeFilters,
  onFilterChange,
  sortOptions,
  activeSort,
  onSortChange,
  className,
}: Omit<FilterBarProps, 'variant' | 'showSearch' | 'showFilters' | 'showSort' | 'showClearAll'>) {
  return (
    <FilterBar
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
      onSearch={onSearch}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      sortOptions={sortOptions}
      activeSort={activeSort}
      onSortChange={onSortChange}
      variant="compact"
      showSearch={true}
      showFilters={true}
      showSort={true}
      showClearAll={false}
      className={className}
    />
  );
}

// Minimal version with just search
export function MinimalFilterBar({
  searchPlaceholder,
  searchValue,
  onSearch,
  className,
}: Pick<FilterBarProps, 'searchPlaceholder' | 'searchValue' | 'onSearch' | 'className'>) {
  return (
    <FilterBar
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
      onSearch={onSearch}
      variant="minimal"
      showSearch={true}
      showFilters={false}
      showSort={false}
      showClearAll={false}
      className={className}
    />
  );
}

// Hook for easy filter management
export function useFilterBar() {
  const createFilterConfig = (
    key: string,
    label: string,
    type: FilterConfig['type'],
    options?: FilterOption[],
    options2?: Partial<Omit<FilterConfig, 'key' | 'label' | 'type' | 'options'>>
  ): FilterConfig => {
    return {
      key,
      label,
      type,
      options,
      ...options2,
    };
  };

  const createSelectFilter = (
    key: string,
    label: string,
    options: FilterOption[],
    options2?: Partial<Omit<FilterConfig, 'key' | 'label' | 'type' | 'options'>>
  ): FilterConfig => {
    return createFilterConfig(key, label, 'select', options, options2);
  };

  const createDropdownFilter = (
    key: string,
    label: string,
    options: FilterOption[],
    options2?: Partial<Omit<FilterConfig, 'key' | 'label' | 'type' | 'options'>>
  ): FilterConfig => {
    return createFilterConfig(key, label, 'dropdown', options, options2);
  };

  const createSortOption = (
    key: string,
    label: string,
    direction: 'asc' | 'desc' = 'asc'
  ): SortOption => {
    return { key, label, direction };
  };

  const createFilterOption = (
    key: string,
    label: string,
    value: string
  ): FilterOption => {
    return { key, label, value };
  };

  return {
    createFilterConfig,
    createSelectFilter,
    createDropdownFilter,
    createSortOption,
    createFilterOption,
  };
} 