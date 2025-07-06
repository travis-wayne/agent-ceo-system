"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Play, 
  LayoutTemplate, 
  Download, 
  Upload, 
  Settings, 
  BarChart3 
} from "lucide-react";
import Link from "next/link";

export function WorkflowQuickActions() {
  const quickActions = [
    {
      title: "Create New Workflow",
      description: "Build a workflow from scratch",
      icon: Plus,
      href: "/dashboard/ceo/workflows/new",
      variant: "default" as const
    },
    {
      title: "Browse Templates",
      description: "Start from a template",
      icon: LayoutTemplate,
      href: "/dashboard/ceo/workflows/templates",
      variant: "outline" as const
    },
    {
      title: "Quick Execute",
      description: "Run your active workflows",
      icon: Play,
      href: "/dashboard/ceo/workflows/execute",
      variant: "outline" as const
    },
    {
      title: "Import Workflow",
      description: "Import from file or n8n",
      icon: Upload,
      href: "/dashboard/ceo/workflows/import",
      variant: "outline" as const
    },
    {
      title: "Export Workflows",
      description: "Export your workflows",
      icon: Download,
      href: "/dashboard/ceo/workflows/export",
      variant: "outline" as const
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: BarChart3,
      href: "/dashboard/ceo/workflows/analytics",
      variant: "outline" as const
    },
    {
      title: "Settings",
      description: "Configure workflow settings",
      icon: Settings,
      href: "/dashboard/ceo/workflows/settings",
      variant: "outline" as const
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            asChild
            className="h-auto p-4 justify-start"
          >
            <Link href={action.href}>
              <div className="flex items-center gap-3">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
} 