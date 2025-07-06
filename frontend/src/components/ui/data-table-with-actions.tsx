"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronDown,
  LucideIcon 
} from "lucide-react";
import { ActionItem, ActionButtonGroup } from "./action-button-group";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

export interface TableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
}

interface DataTableWithActionsProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  description?: string;
  searchKey?: keyof T | string; // Key to search in
  searchPlaceholder?: string;
  filters?: TableFilter[];
  actions?: ActionItem[];
  rowActions?: (item: T) => ActionItem[];
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  tableClassName?: string;
  searchClassName?: string;
  actionsClassName?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  showRowActions?: boolean;
  maxHeight?: string;
  striped?: boolean;
}

export function DataTableWithActions<T extends Record<string, any>>({
  data,
  columns,
  title,
  description,
  searchKey,
  searchPlaceholder = "Search...",
  filters = [],
  actions = [],
  rowActions,
  onSearch,
  onFilter,
  onSort,
  loading = false,
  emptyMessage = "No data available",
  className,
  tableClassName,
  searchClassName,
  actionsClassName,
  showSearch = true,
  showFilters = true,
  showActions = true,
  showRowActions = true,
  maxHeight,
  striped = false,
}: DataTableWithActionsProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // Apply search
    if (searchQuery && searchKey) {
      filteredData = filteredData.filter(item => {
        const value = typeof searchKey === 'string' ? item[searchKey] : item[searchKey as keyof T];
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key];
          return String(itemValue) === value;
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchQuery, searchKey, activeFilters, sortConfig]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilter = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleSort = (key: string) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    onSort?.(key, direction);
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.cell) {
      return column.cell(item);
    }

    const value = typeof column.key === 'string' ? item[column.key] : item[column.key as keyof T];
    
    // Handle different value types
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }

    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    return String(value);
  };

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const isActive = sortConfig?.key === column.key;
    const isAsc = sortConfig?.direction === 'asc';

    return (
      <ChevronDown 
        className={cn(
          'ml-1 h-3 w-3 transition-transform',
          isActive && isAsc && 'rotate-180',
          isActive && 'text-primary'
        )} 
      />
    );
  };

  return (
    <Card className={className}>
      {(title || description || showSearch || showFilters || showActions) && (
        <CardHeader>
          <div className="flex flex-col space-y-4">
            {(title || description) && (
              <div>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
                {showSearch && (
                  <div className={cn("relative", searchClassName)}>
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                )}
                
                {showFilters && filters.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {filters.map((filter) => (
                      <DropdownMenu key={filter.key}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9">
                            <Filter className="h-3 w-3 mr-1" />
                            {filter.label}
                            {activeFilters[filter.key] && (
                              <Badge variant="secondary" className="ml-1">
                                {activeFilters[filter.key]}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleFilter(filter.key, '')}>
                            All
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {filter.options.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() => handleFilter(filter.key, option.value)}
                            >
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ))}
                  </div>
                )}
              </div>
              
              {showActions && actions.length > 0 && (
                <ActionButtonGroup
                  actions={actions}
                  className={actionsClassName}
                />
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        <div className={cn("overflow-auto", maxHeight && `max-h-[${maxHeight}]`)}>
          <Table className={tableClassName}>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      column.className,
                      column.sortable && 'cursor-pointer hover:bg-muted/50',
                      column.width && `w-[${column.width}]`
                    )}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {renderSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
                {showRowActions && rowActions && (
                  <TableHead className="w-[50px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showRowActions ? 1 : 0)} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : processedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showRowActions ? 1 : 0)} className="text-center py-8">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                processedData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      striped && index % 2 === 1 && 'bg-muted/50'
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell key={String(column.key)} className={column.className}>
                        {renderCell(item, column)}
                      </TableCell>
                    ))}
                    {showRowActions && rowActions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions(item).map((action, actionIndex) => (
                              <React.Fragment key={actionIndex}>
                                <DropdownMenuItem
                                  onClick={action.onClick}
                                  disabled={action.disabled}
                                  className={cn(
                                    action.variant === 'destructive' && 'text-red-600 focus:text-red-600'
                                  )}
                                >
                                  {action.icon && (
                                    <action.icon className="mr-2 h-4 w-4" />
                                  )}
                                  {action.label}
                                </DropdownMenuItem>
                                {action.separator && <DropdownMenuSeparator />}
                              </React.Fragment>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for easy table management
export function useDataTable<T>() {
  const createColumn = <K extends keyof T>(
    key: K,
    header: string,
    options: Partial<Omit<TableColumn<T>, 'key' | 'header'>> = {}
  ): TableColumn<T> => {
    return {
      key,
      header,
      ...options,
    };
  };

  const createSortableColumn = <K extends keyof T>(
    key: K,
    header: string,
    options: Partial<Omit<TableColumn<T>, 'key' | 'header' | 'sortable'>> = {}
  ): TableColumn<T> => {
    return createColumn(key, header, { ...options, sortable: true });
  };

  const createFilter = (
    key: string,
    label: string,
    options: { value: string; label: string }[]
  ): TableFilter => {
    return { key, label, options };
  };

  return {
    createColumn,
    createSortableColumn,
    createFilter,
  };
} 