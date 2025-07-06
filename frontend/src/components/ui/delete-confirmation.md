# DeleteConfirmation Component

A reusable delete confirmation modal component that provides a consistent user experience for delete operations throughout the application.

## Features

- **Customizable**: Configurable title, description, item name, and item type
- **Multiple Variants**: Support for danger, warning, and default styling
- **Loading States**: Built-in loading state during delete operations
- **Accessible**: Follows accessibility best practices
- **TypeScript Support**: Fully typed with TypeScript interfaces
- **Easy Integration**: Simple hook-based API for easy usage

## Basic Usage

### Using the Hook (Recommended)

```tsx
import { useDeleteConfirmation } from "@/components/ui/delete-confirmation";

function MyComponent() {
  const { isOpen, confirmDelete, closeDelete, deleteConfig } = useDeleteConfirmation();

  const handleDeleteClick = () => {
    confirmDelete({
      title: "Delete Item",
      description: "Are you sure you want to delete this item?",
      itemName: "My Item",
      itemType: "Item",
      confirmText: "Delete",
      variant: "danger",
    });
  };

  const handleConfirm = async () => {
    // Your delete logic here
    await deleteItem();
  };

  return (
    <div>
      <button onClick={handleDeleteClick}>Delete Item</button>
      
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={closeDelete}
        onConfirm={handleConfirm}
        {...deleteConfig}
      />
    </div>
  );
}
```

### Direct Component Usage

```tsx
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    // Your delete logic here
    await deleteItem();
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Delete Item</button>
      
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        itemName="My Item"
        itemType="Item"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
```

## Props

### DeleteConfirmationProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls the visibility of the modal |
| `onClose` | `() => void` | - | Callback when the modal is closed |
| `onConfirm` | `() => void \| Promise<void>` | - | Callback when delete is confirmed |
| `title` | `string` | `"Delete Confirmation"` | Modal title |
| `description` | `string` | `"Are you sure you want to delete this item?"` | Modal description |
| `itemName` | `string` | - | Name of the item being deleted |
| `itemType` | `string` | `"item"` | Type of the item being deleted |
| `confirmText` | `string` | `"Delete"` | Text for the confirm button |
| `cancelText` | `string` | `"Cancel"` | Text for the cancel button |
| `variant` | `'default' \| 'danger' \| 'warning'` | `"danger"` | Visual variant of the modal |
| `isLoading` | `boolean` | `false` | External loading state |

## Variants

### Danger (Default)
- Red styling for critical delete operations
- Use for permanent deletions that cannot be undone

### Warning
- Orange styling for operations that can be undone
- Use for operations that can be recovered

### Default
- Gray styling for non-critical operations
- Use for resets or temporary deletions

## Hook API

### useDeleteConfirmation()

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Current open state |
| `confirmDelete` | `(config: DeleteConfig) => void` | Function to show the confirmation modal |
| `closeDelete` | `() => void` | Function to close the modal |
| `deleteConfig` | `DeleteConfig` | Current configuration object |

### DeleteConfig

```tsx
interface DeleteConfig {
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
}
```

## Examples

### Delete User Account
```tsx
confirmDelete({
  title: "Delete User",
  description: "Are you sure you want to delete this user? This will permanently remove their account and all associated data.",
  itemName: "john.doe@example.com",
  itemType: "User Account",
  confirmText: "Delete User",
  variant: "danger",
});
```

### Delete Document
```tsx
confirmDelete({
  title: "Delete Document",
  description: "This document will be permanently deleted and cannot be recovered.",
  itemName: "Q4_Financial_Report.pdf",
  itemType: "Document",
  confirmText: "Delete Document",
  variant: "warning",
});
```

### Reset Configuration
```tsx
confirmDelete({
  title: "Reset Configuration",
  description: "This will reset all settings to their default values. Any custom configurations will be lost.",
  itemName: "Custom Theme Settings",
  itemType: "Configuration",
  confirmText: "Reset Configuration",
  variant: "default",
});
```

## Best Practices

1. **Use descriptive titles and descriptions** that clearly explain what will be deleted
2. **Choose appropriate variants** based on the severity of the operation
3. **Handle errors gracefully** in the `onConfirm` callback
4. **Provide meaningful item names** to help users identify what they're deleting
5. **Use the hook pattern** for better state management and reusability

## Accessibility

The component includes:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support through CSS variables 