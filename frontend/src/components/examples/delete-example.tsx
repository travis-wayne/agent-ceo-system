"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmation, useDeleteConfirmation } from "@/components/ui/delete-confirmation";
import { Trash2, User, FileText, Database, Settings } from "lucide-react";
import { toast } from "sonner";

export function DeleteExample() {
  const { isOpen, confirmDelete, closeDelete, deleteConfig } = useDeleteConfirmation();

  const handleDeleteUser = () => {
    confirmDelete({
      title: "Delete User",
      description: "Are you sure you want to delete this user? This will permanently remove their account and all associated data.",
      itemName: "john.doe@example.com",
      itemType: "User Account",
      confirmText: "Delete User",
      variant: "danger",
    });
  };

  const handleDeleteDocument = () => {
    confirmDelete({
      title: "Delete Document",
      description: "This document will be permanently deleted and cannot be recovered.",
      itemName: "Q4_Financial_Report.pdf",
      itemType: "Document",
      confirmText: "Delete Document",
      variant: "warning",
    });
  };

  const handleDeleteDatabase = () => {
    confirmDelete({
      title: "Delete Database",
      description: "This will permanently delete the database and all its contents. This action cannot be undone.",
      itemName: "production_customers_db",
      itemType: "Database",
      confirmText: "Delete Database",
      variant: "danger",
    });
  };

  const handleDeleteConfiguration = () => {
    confirmDelete({
      title: "Reset Configuration",
      description: "This will reset all settings to their default values. Any custom configurations will be lost.",
      itemName: "Custom Theme Settings",
      itemType: "Configuration",
      confirmText: "Reset Configuration",
      variant: "default",
    });
  };

  const handleDeleteConfirm = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`${deleteConfig.itemName} deleted successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Delete Confirmation Examples</h2>
        <p className="text-muted-foreground">
          Examples of how to use the DeleteConfirmation component in different scenarios.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Delete User Account
            </CardTitle>
            <CardDescription>
              Example of deleting a user account with danger variant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeleteUser} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Delete Document
            </CardTitle>
            <CardDescription>
              Example of deleting a document with warning variant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeleteDocument} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Document
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Delete Database
            </CardTitle>
            <CardDescription>
              Example of deleting a database with danger variant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeleteDatabase} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Database
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Reset Configuration
            </CardTitle>
            <CardDescription>
              Example of resetting configuration with default variant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeleteConfiguration} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        {...deleteConfig}
      />
    </div>
  );
}

// Usage example in a component
export function ExampleUsage() {
  const { isOpen, confirmDelete, closeDelete, deleteConfig } = useDeleteConfirmation();

  const deleteItem = (item: any) => {
    confirmDelete({
      title: `Delete ${item.type}`,
      description: `Are you sure you want to delete this ${item.type.toLowerCase()}?`,
      itemName: item.name,
      itemType: item.type,
      confirmText: `Delete ${item.type}`,
      variant: item.critical ? "danger" : "warning",
    });
  };

  const handleConfirm = async () => {
    // Your delete logic here
    console.log(`Deleting ${deleteConfig.itemName}`);
  };

  return (
    <div>
      {/* Your component content */}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={closeDelete}
        onConfirm={handleConfirm}
        {...deleteConfig}
      />
    </div>
  );
} 