"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
}

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  itemName,
  itemType = "item",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete operation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="h-5 w-5 text-red-500" />,
          button: "bg-red-600 hover:bg-red-700 text-white",
          title: "text-red-600",
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
          button: "bg-orange-600 hover:bg-orange-700 text-white",
          title: "text-orange-600",
        };
      default:
        return {
          icon: <Trash2 className="h-5 w-5 text-gray-500" />,
          button: "bg-gray-600 hover:bg-gray-700 text-white",
          title: "text-gray-600",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${styles.title}`}>
            {styles.icon}
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
            {itemName && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">{itemName}</p>
                <p className="text-sm text-muted-foreground capitalize">{itemType}</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting || isLoading}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className={`flex-1 ${styles.button}`}
          >
            {isDeleting || isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easy usage
export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<Omit<DeleteConfirmationProps, 'isOpen' | 'onClose' | 'onConfirm'>>({
    title: "Delete Confirmation",
    description: "Are you sure you want to delete this item?",
    itemName: "",
    itemType: "item",
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger",
    isLoading: false,
  });

  const confirmDelete = (config: Omit<DeleteConfirmationProps, 'isOpen' | 'onClose' | 'onConfirm'>) => {
    setDeleteConfig(config);
    setIsOpen(true);
  };

  const closeDelete = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    confirmDelete,
    closeDelete,
    deleteConfig,
  };
} 