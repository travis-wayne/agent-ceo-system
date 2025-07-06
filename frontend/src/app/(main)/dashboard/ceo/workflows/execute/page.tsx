import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Zap,
  Filter,
  Search,
  Calendar,
  User,
  Activity,
  TrendingUp,
  Settings,
  Eye,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quick Execute Workflows",
  description: "Run your active workflows manually",
};

export default function QuickExecutePage() {
  const activeWorkflows = [
    {
      id: 1,
      name: "Lead Nurturing Email Sequence",
      description: "Send personalized follow-up emails to new leads",
      status: "active",
      lastRun: "2024-01-15T10:30:00Z",
      nextRun: "2024-01-16T10:30:00Z",
      successRate: 95.2,
      totalRuns: 247,
      avgDuration: 2300,
      priority: "high",
      type: "EMAIL_AUTOMATION",
      canRunManually: true,
      isRunning: false
    },
    {
      id: 2,
      name: "Customer Onboarding Flow",
      description: "Complete onboarding workflow for new customers",
      status: "active",
      lastRun: "2024-01-15T09:15:00Z",
      nextRun: "2024-01-16T09:15:00Z",
      successRate: 98.7,
      totalRuns: 89,
      avgDuration: 4500,
      priority: "critical",
      type: "CUSTOMER_ONBOARDING",
      canRunManually: true,
      isRunning: false
    },
    {
      id: 3,
      name: "Daily Sales Report",
      description: "Generate and send daily sales performance reports",
      status: "active",
      lastRun: "2024-01-15T08:00:00Z",
      nextRun: "2024-01-16T08:00:00Z",
      successRate: 100,
      totalRuns: 365,
      avgDuration: 1200,
      priority: "medium",
      type: "REPORTING",
      canRunManually: true,
      isRunning: false
    },
    {
      id: 4,
      name: "Data Backup & Sync",
      description: "Backup customer data to external storage",
      status: "active",
      lastRun: "2024-01-15T02:00:00Z",
      nextRun: "2024-01-16T02:00:00Z",
      successRate: 99.1,
      totalRuns: 456,
      avgDuration: 8900,
      priority: "high",
      type: "DATA_SYNC",
      canRunManually: true,
      isRunning: true
    }
  ];

  const recentExecutions = [
    {
      id: 1,
      workflowName: "Lead Nurturing Email Sequence",
      status: "completed",
      startTime: "2024-01-15T10:30:00Z",
      endTime: "2024-01-15T10:32:30Z",
      duration: 2300,
      triggeredBy: "manual",
      user: "John Doe"
    },
    {
      id: 2,
      workflowName: "Customer Onboarding Flow",
      status: "completed",
      startTime: "2024-01-15T09:15:00Z",
      endTime: "2024-01-15T09:19:30Z",
      duration: 4500,
      triggeredBy: "schedule",
      user: "System"
    },
    {
      id: 3,
      workflowName: "Daily Sales Report",
      status: "failed",
      startTime: "2024-01-15T08:00:00Z",
      endTime: "2024-01-15T08:01:00Z",
      duration: 1000,
      triggeredBy: "schedule",
      user: "System",
      error: "API connection timeout"
    },
    {
      id: 4,
      workflowName: "Data Backup & Sync",
      status: "running",
      startTime: "2024-01-15T14:00:00Z",
      endTime: null,
      duration: null,
      triggeredBy: "manual",
      user: "Jane Smith"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "running": return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "cancelled": return <Square className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>;
      case "running": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Running</Badge>;
      case "cancelled": return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Cancelled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Critical</Badge>;
      case "high": return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">High</Badge>;
      case "medium": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>;
      case "low": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low</Badge>;
      default: return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatDuration = (milliseconds: number) => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
    return `${(milliseconds / 60000).toFixed(1)}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Workflows", href: "/dashboard/ceo/workflows" },
          { label: "Quick Execute", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Play className="h-8 w-8 text-primary" />
                Quick Execute
              </h1>
              <p className="text-muted-foreground mt-2">
                Run your active workflows manually or view recent executions
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/ceo/workflows">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Workflows
                </Link>
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Execution Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Ready to execute</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Running Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Currently executing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98.2%</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2s</div>
              <p className="text-xs text-muted-foreground">Per execution</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="execute" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="execute" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Execute Workflows
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Execution History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="EMAIL_AUTOMATION">Email Automation</SelectItem>
                  <SelectItem value="CUSTOMER_ONBOARDING">Customer Onboarding</SelectItem>
                  <SelectItem value="REPORTING">Reporting</SelectItem>
                  <SelectItem value="DATA_SYNC">Data Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Workflows */}
            <div className="grid gap-4">
              {activeWorkflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{workflow.name}</CardTitle>
                          <CardDescription>{workflow.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(workflow.priority)}
                        <Badge variant="outline">{workflow.type.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <Label className="text-muted-foreground">Success Rate</Label>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{workflow.successRate}%</div>
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        </div>
                      </div>
                      <div className="text-sm">
                        <Label className="text-muted-foreground">Total Runs</Label>
                        <div className="font-semibold">{workflow.totalRuns}</div>
                      </div>
                      <div className="text-sm">
                        <Label className="text-muted-foreground">Avg Duration</Label>
                        <div className="font-semibold">{formatDuration(workflow.avgDuration)}</div>
                      </div>
                      <div className="text-sm">
                        <Label className="text-muted-foreground">Last Run</Label>
                        <div className="font-semibold">{formatTime(workflow.lastRun)}</div>
                      </div>
                    </div>
                    
                    {workflow.isRunning && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Execution Progress</Label>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Running
                          </Badge>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {workflow.isRunning ? (
                        <>
                          <Button variant="outline" className="flex-1">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        </>
                      ) : (
                        <Button className="flex-1" disabled={!workflow.canRunManually}>
                          <Play className="h-4 w-4 mr-2" />
                          Run Now
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
                <CardDescription>
                  Latest workflow execution history and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExecutions.map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(execution.status)}
                        <div>
                          <div className="font-medium">{execution.workflowName}</div>
                          <div className="text-sm text-muted-foreground">
                            Started: {formatTime(execution.startTime)}
                            {execution.endTime && ` • Duration: ${formatDuration(execution.duration!)}`}
                          </div>
                          {execution.error && (
                            <div className="text-sm text-red-600 mt-1">
                              Error: {execution.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground">
                          by {execution.user}
                        </div>
                        {getStatusBadge(execution.status)}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 