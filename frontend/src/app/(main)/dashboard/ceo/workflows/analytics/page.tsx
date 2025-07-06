import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Users,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  AlertTriangle,
  Target,
  Timer,
  Play,
  Pause,
  Settings,
  Eye
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workflow Analytics",
  description: "View performance metrics and insights for your workflows",
};

export default function WorkflowAnalyticsPage() {
  const performanceMetrics = {
    totalExecutions: 2847,
    successfulExecutions: 2712,
    failedExecutions: 135,
    successRate: 95.3,
    avgExecutionTime: 2.4,
    totalWorkflows: 23,
    activeWorkflows: 18,
    executionsToday: 47,
    executionsThisWeek: 312,
    executionsThisMonth: 1247
  };

  const topPerformingWorkflows = [
    {
      id: 1,
      name: "Lead Nurturing Email Sequence",
      executions: 487,
      successRate: 98.2,
      avgDuration: 2.1,
      trend: "up",
      trendValue: 12.5,
      type: "EMAIL_AUTOMATION"
    },
    {
      id: 2,
      name: "Customer Onboarding Flow",
      executions: 234,
      successRate: 96.8,
      avgDuration: 4.3,
      trend: "up",
      trendValue: 8.2,
      type: "CUSTOMER_ONBOARDING"
    },
    {
      id: 3,
      name: "Daily Sales Report",
      executions: 365,
      successRate: 100,
      avgDuration: 1.2,
      trend: "stable",
      trendValue: 0,
      type: "REPORTING"
    },
    {
      id: 4,
      name: "Data Backup & Sync",
      executions: 456,
      successRate: 94.1,
      avgDuration: 8.7,
      trend: "down",
      trendValue: -3.4,
      type: "DATA_SYNC"
    }
  ];

  const recentFailures = [
    {
      id: 1,
      workflowName: "Invoice Processing",
      failedAt: "2024-01-15T14:30:00Z",
      error: "API connection timeout",
      duration: 30000,
      retryCount: 3
    },
    {
      id: 2,
      workflowName: "Social Media Posting",
      failedAt: "2024-01-15T12:15:00Z",
      error: "Authentication failed",
      duration: 5000,
      retryCount: 1
    },
    {
      id: 3,
      workflowName: "Customer Data Sync",
      failedAt: "2024-01-15T09:45:00Z",
      error: "Database connection lost",
      duration: 15000,
      retryCount: 2
    }
  ];

  const executionTrends = [
    { date: "Jan 10", executions: 45, successful: 43, failed: 2 },
    { date: "Jan 11", executions: 52, successful: 50, failed: 2 },
    { date: "Jan 12", executions: 38, successful: 36, failed: 2 },
    { date: "Jan 13", executions: 61, successful: 58, failed: 3 },
    { date: "Jan 14", executions: 47, successful: 45, failed: 2 },
    { date: "Jan 15", executions: 55, successful: 52, failed: 3 },
    { date: "Jan 16", executions: 42, successful: 40, failed: 2 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
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
          { label: "Analytics", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                Workflow Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Performance metrics and insights for your automated workflows
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/ceo/workflows">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Workflows
                </Link>
              </Button>
              <Select defaultValue="7d">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.totalExecutions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12% from last period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{performanceMetrics.successRate}%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +2.1% from last period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.avgExecutionTime}s</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                -0.3s faster
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.activeWorkflows}</div>
              <p className="text-xs text-muted-foreground">
                of {performanceMetrics.totalWorkflows} total workflows
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="failures" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Failures
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Execution Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Execution Summary</CardTitle>
                  <CardDescription>
                    Breakdown of workflow executions by status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Successful</span>
                      </div>
                      <span className="text-sm font-medium">{performanceMetrics.successfulExecutions}</span>
                    </div>
                    <Progress value={(performanceMetrics.successfulExecutions / performanceMetrics.totalExecutions) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Failed</span>
                      </div>
                      <span className="text-sm font-medium">{performanceMetrics.failedExecutions}</span>
                    </div>
                    <Progress value={(performanceMetrics.failedExecutions / performanceMetrics.totalExecutions) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{performanceMetrics.executionsToday}</div>
                        <div className="text-xs text-muted-foreground">Today</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{performanceMetrics.executionsThisWeek}</div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{performanceMetrics.executionsThisMonth}</div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Distribution</CardTitle>
                  <CardDescription>
                    Breakdown by workflow type and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Workflow distribution chart</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Execution Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Execution Timeline</CardTitle>
                <CardDescription>
                  Daily execution trends over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Execution timeline chart</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Workflows</CardTitle>
                <CardDescription>
                  Workflows ranked by execution count and success rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingWorkflows.map((workflow, index) => (
                    <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.executions} executions • {workflow.avgDuration}s avg duration
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{workflow.successRate}%</div>
                          <div className={`text-sm flex items-center gap-1 ${getTrendColor(workflow.trend)}`}>
                            {getTrendIcon(workflow.trend)}
                            {workflow.trendValue !== 0 && `${workflow.trendValue > 0 ? '+' : ''}${workflow.trendValue}%`}
                          </div>
                        </div>
                        <Badge variant="outline">{workflow.type.replace('_', ' ')}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failures" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Failure Rate */}
              <Card>
                <CardHeader>
                  <CardTitle>Failure Analysis</CardTitle>
                  <CardDescription>
                    Common failure patterns and error types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Timeouts</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Authentication Errors</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-20 h-2" />
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Errors</span>
                      <div className="flex items-center gap-2">
                        <Progress value={15} className="w-20 h-2" />
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Other</span>
                      <div className="flex items-center gap-2">
                        <Progress value={10} className="w-20 h-2" />
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Failures */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Failures</CardTitle>
                  <CardDescription>
                    Latest workflow execution failures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentFailures.map((failure) => (
                      <div key={failure.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{failure.workflowName}</div>
                          <Badge variant="destructive" className="text-xs">Failed</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(failure.failedAt)}
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          {failure.error}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Duration: {formatDuration(failure.duration)} • Retries: {failure.retryCount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Trends</CardTitle>
                <CardDescription>
                  Historical execution patterns and performance trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Execution trends chart</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 