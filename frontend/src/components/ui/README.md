# Reusable UI Components

This directory contains a comprehensive set of reusable UI components designed to provide consistent, accessible, and maintainable interfaces throughout the application.

## 🚀 Quick Start

```tsx
import { 
  StatusBadge, 
  StatCard, 
  ActionButtonGroup,
  DataTableWithActions 
} from '@/components/ui';
```

## 📋 Component Overview

### 1. StatusBadge
A flexible badge component that automatically applies the correct colors and styling based on status type.

```tsx
<StatusBadge status="active" />
<StatusBadge status="pending" variant="outline" size="lg" />
```

**Features:**
- 30+ predefined status types
- Multiple variants and sizes
- Automatic color coding
- Custom labels support
- Icon support

### 2. ProgressMetric
Displays a label, value, and progress bar with consistent styling.

```tsx
<ProgressMetric 
  label="Conversion Rate" 
  value={75} 
  progress={75} 
  unit="%" 
  variant="success" 
/>
```

**Features:**
- Multiple size variants
- Progress visualization
- Unit formatting
- Icon support
- Compact version available

### 3. StatCard
Displays statistics with icons, values, labels, and optional trends.

```tsx
<StatCard 
  title="Total Revenue" 
  value="$45,231" 
  description="+20.1% from last month"
  trend={{ value: 20.1, isPositive: true, period: "vs last month" }}
  icon={DollarSign}
/>
```

**Features:**
- Trend indicators
- Multiple variants
- Icon support
- Compact version
- Responsive design

### 4. ActionButtonGroup
Displays a group of action buttons with consistent styling and spacing.

```tsx
<ActionButtonGroup 
  actions={[
    { label: "Edit", onClick: handleEdit, icon: Edit },
    { label: "Delete", onClick: handleDelete, variant: "destructive" }
  ]}
  maxVisible={3}
/>
```

**Features:**
- Automatic dropdown for overflow
- Multiple variants
- Icon support
- Separators
- Compact and stacked versions

### 5. DataTableWithActions
A comprehensive data table with search, filtering, sorting, and actions.

```tsx
<DataTableWithActions 
  data={users}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', cell: (user) => <StatusBadge status={user.status} /> }
  ]}
  actions={[
    { label: "Add User", onClick: handleAddUser, icon: Plus }
  ]}
  rowActions={(user) => [
    { label: "Edit", onClick: () => handleEdit(user) },
    { label: "Delete", onClick: () => handleDelete(user), variant: "destructive" }
  ]}
/>
```

**Features:**
- Built-in search
- Column filtering
- Sorting
- Row actions
- Loading states
- Empty states

### 6. PageHeaderWithActions
Displays a page title, description, breadcrumbs, and action buttons.

```tsx
<PageHeaderWithActions 
  title="User Management"
  description="Manage your application users"
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users" }
  ]}
  actions={[
    { label: "Add User", onClick: handleAddUser, icon: Plus }
  ]}
/>
```

**Features:**
- Breadcrumb navigation
- Action buttons
- Multiple variants
- Icon support
- Responsive design

### 7. TabbedContentLayout
Provides a consistent tabbed interface with content areas.

```tsx
<TabbedContentLayout 
  tabs={[
    { id: 'overview', label: 'Overview', content: <OverviewContent /> },
    { id: 'settings', label: 'Settings', content: <SettingsContent /> }
  ]}
  defaultTab="overview"
/>
```

**Features:**
- Multiple variants (default, pills, underline)
- Icon and badge support
- Vertical orientation
- Card-based content
- Compact version

### 8. MetricComparisonCard
Displays metrics with comparison data and trends.

```tsx
<MetricComparisonCard 
  title="Revenue"
  currentValue={45231}
  previousValue={37650}
  unit="$"
  trendPeriod="vs last month"
  variant="success"
/>
```

**Features:**
- Trend calculations
- Progress visualization
- Multiple variants
- Compact version
- Responsive design

### 9. ActivityTimeline
Displays a timeline of activities with icons, timestamps, and descriptions.

```tsx
<ActivityTimeline 
  items={[
    {
      id: '1',
      title: 'User registered',
      description: 'New user account created',
      timestamp: new Date(),
      status: 'completed'
    }
  ]}
/>
```

**Features:**
- Multiple variants
- Avatar support
- Status indicators
- Relative timestamps
- Loading states

### 10. FilterBar
Provides search, filters, and sorting functionality in a consistent layout.

```tsx
<FilterBar 
  searchPlaceholder="Search users..."
  onSearch={handleSearch}
  filters={[
    { key: 'status', label: 'Status', type: 'select', options: statusOptions }
  ]}
  onFilterChange={handleFilterChange}
  sortOptions={[
    { key: 'name', label: 'Name', direction: 'asc' }
  ]}
  onSortChange={handleSortChange}
/>
```

**Features:**
- Search functionality
- Multiple filter types
- Sorting options
- Clear all filters
- Multiple variants

## 🎨 Design System

All components follow a consistent design system:

### Variants
- `default` - Standard styling
- `success` - Green color scheme
- `warning` - Yellow color scheme
- `danger` - Red color scheme
- `info` - Blue color scheme

### Sizes
- `sm` - Small (compact)
- `md` - Medium (default)
- `lg` - Large (prominent)

### Spacing
- Consistent padding and margins
- Responsive breakpoints
- Flexible layouts

## 🔧 Customization

All components support extensive customization:

```tsx
<StatusBadge 
  status="custom"
  className="bg-purple-100 text-purple-800 border-purple-200"
  children="Custom Status"
/>
```

## 📱 Responsive Design

Components are built with responsive design in mind:

- Mobile-first approach
- Flexible layouts
- Adaptive sizing
- Touch-friendly interactions

## ♿ Accessibility

All components include accessibility features:

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

## 🧪 Testing

Components are designed to be easily testable:

- Stable component APIs
- Predictable behavior
- Clear prop interfaces
- Comprehensive TypeScript types

## 📚 Usage Examples

See individual component files for detailed usage examples and API documentation.

## 🤝 Contributing

When adding new components:

1. Follow the existing patterns
2. Include TypeScript types
3. Add comprehensive props
4. Include accessibility features
5. Add to the index file
6. Update this documentation

## 📄 License

These components are part of the application's design system and follow the same licensing terms. 