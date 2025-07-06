import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Workflow, 
  Play, 
  Pause, 
  Settings, 
  Zap, 
  Bot, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Link,
  Activity,
  Code,
  Webhook,
  LayoutTemplate,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import { Suspense } from "react";
import { AppLayout } from "@/components/app-layout";
import { WorkflowDashboard } from "@/components/workflow/workflow-dashboard";
import { WorkflowQuickActions } from "@/components/workflow/workflow-quick-actions";
import { WorkflowStats } from "@/components/workflow/workflow-stats";
import { RecentWorkflowExecutions } from "@/components/workflow/recent-workflow-executions";

export const metadata: Metadata = {
  title: "Workflow Automation | Agent CEO",
  description: "n8n-powered workflow automation and business process management",
};

export default function WorkflowsPage() {
  // Mock workflow data - will integrate with n8n API
  const workflows = [
    {
      id: "workflow-001",
      name: "Lead Qualification Pipeline",
      description: "Automatically qualify and route leads based on AI analysis",
      status: "active",
      triggers: 247,
      success: 234,
      errors: 2,
      successRate: 94.7,
      lastRun: "2024-01-15T10:30:00Z",
      avgDuration: "2.3s",
      category: "Lead Management",
      n8nWorkflowId: "12834"
    },
    {
      id: "workflow-002", 
      name: "Customer Onboarding Sequence",
      description: "Automated welcome emails and task creation for new customers",
      status: "active",
      triggers: 89,
      success: 87,
      errors: 0,
      successRate: 97.8,
      lastRun: "2024-01-15T09:15:00Z",
      avgDuration: "4.1s",
      category: "Customer Success",
      n8nWorkflowId: "12847"
    },
    {
      id: "workflow-003",
      name: "Social Media Content Approval",
      description: "Review and approve AI-generated content before publishing",
      status: "paused",
      triggers: 156,
      success: 142,
      errors: 3,
      successRate: 91.0,
      lastRun: "2024-01-14T16:45:00Z",
      avgDuration: "12.8s",
      category: "Content Management",
      n8nWorkflowId: "12891"
    }
  ];

  const templates = [
    {
      id: "template-001",
      name: "Email Campaign Automation",
      description: "Trigger email campaigns based on customer behavior",
      category: "Marketing",
      complexity: "Medium",
      estimated: "15-30 min",
      popular: true,
      integrations: ["Email", "CRM", "Analytics"]
    },
    {
      id: "template-002",
      name: "Data Sync & Backup",
      description: "Automatically sync and backup critical business data",
      category: "Data Management", 
      complexity: "Easy",
      estimated: "10-15 min",
      popular: false,
      integrations: ["Database", "Cloud Storage", "Notifications"]
    },
    {
      id: "template-003",
      name: "Customer Support Triage",
      description: "Automatically categorize and route support tickets",
      category: "Customer Support",
      complexity: "Hard",
      estimated: "45-60 min", 
      popular: true,
      integrations: ["Tickets", "AI", "Notifications", "CRM"]
    }
  ];

  // n8n Integration Status
  const n8nStatus = {
    connected: true, // Will be determined by actual n8n API check
    url: process.env.NEXT_PUBLIC_N8N_URL || "http://localhost:5678",
    version: "1.19.4",
    activeWorkflows: 12,
    totalExecutions: 1847
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case "Easy":
        return <Badge variant="default" className="bg-green-500 text-white">Easy</Badge>;
      case "Medium":
        return <Badge variant="default" className="bg-orange-500 text-white">Medium</Badge>;
      case "Hard":
        return <Badge variant="destructive">Hard</Badge>;
      default:
        return <Badge variant="outline">{complexity}</Badge>;
    }
  };

  const getTrendIcon = (direction: string) => {
    if (direction === "up") {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (direction === "down") {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  return (
      <><PageHeader
      items={[
        { label: "CEO Dashboard", href: "/dashboard/ceo" },
        { label: "Workflow Automation", isCurrentPage: true },
      ]} /><main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                Workflow Automation
              </h1>
              <p className="text-muted-foreground mt-2">
                Create, manage, and monitor automated workflows for your business processes
              </p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workflows</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="lg">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>}>
            <WorkflowStats />
          </Suspense>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="executions" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Executions
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common workflow operations and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
                    <WorkflowQuickActions />
                  </Suspense>
                </CardContent>
              </Card>

              {/* Recent Executions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Executions
                  </CardTitle>
                  <CardDescription>
                    Latest workflow execution history and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
                    <RecentWorkflowExecutions />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>
                  Execution trends and performance metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Workflow performance chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
              <WorkflowDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="executions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Executions</CardTitle>
                <CardDescription>
                  Detailed execution history and performance analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Workflow executions list will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>
                  Pre-built workflow templates for common business processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Workflow templates will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Integrations</CardTitle>
                <CardDescription>
                  Connect workflows with external services and APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Workflow integrations will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Monitoring</CardTitle>
                <CardDescription>
                  Real-time monitoring and alerting for workflow health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Workflow monitoring dashboard will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main></>
  );
} 