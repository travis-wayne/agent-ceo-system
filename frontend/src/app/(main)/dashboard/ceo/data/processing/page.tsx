import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Cpu,
  Play,
  Pause,
  Square,
  Shuffle,
  Edit,
  Trash2,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Plus
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Processing | Agent CEO",
  description: "Manage ETL pipelines, data jobs, and processing workflows",
};

export default function DataProcessingPage() {
  // Mock data for processing jobs
  const processingJobs = [
    {
      id: "job_1",
      name: "Customer Data Enrichment",
      type: "ETL Pipeline",
      status: "running",
      progress: 67,
      source: "CRM Database",
      target: "Analytics Warehouse",
      startTime: "2024-01-15T14:30:00Z",
      estimatedCompletion: "2024-01-15T15:45:00Z",
      recordsProcessed: 45678,
      totalRecords: 68234,
      description: "Enriching customer data with external demographics and behavioral insights",
      schedule: "Daily at 2:00 AM",
      lastRun: "2024-01-15T02:00:00Z",
      nextRun: "2024-01-16T02:00:00Z"
    },
    {
      id: "job_2",
      name: "Sales Analytics Aggregation",
      type: "Data Transformation",
      status: "completed",
      progress: 100,
      source: "Multiple Sources",
      target: "Analytics Dashboard",
      startTime: "2024-01-15T12:00:00Z",
      estimatedCompletion: "2024-01-15T12:45:00Z",
      recordsProcessed: 156789,
      totalRecords: 156789,
      description: "Aggregating sales data for real-time dashboard updates",
      schedule: "Every 30 minutes",
      lastRun: "2024-01-15T14:00:00Z",
      nextRun: "2024-01-15T14:30:00Z"
    },
    {
      id: "job_3",
      name: "Email Campaign Data Sync",
      type: "Data Sync",
      status: "failed",
      progress: 23,
      source: "Email Platform API",
      target: "Marketing Database",
      startTime: "2024-01-15T13:15:00Z",
      estimatedCompletion: "2024-01-15T13:30:00Z",
      recordsProcessed: 12456,
      totalRecords: 54321,
      description: "Synchronizing email campaign metrics and subscriber data",
      schedule: "Every 2 hours",
      lastRun: "2024-01-15T13:15:00Z",
      nextRun: "2024-01-15T15:15:00Z"
    },
    {
      id: "job_4",
      name: "Financial Data Processing",
      type: "Data Validation",
      status: "pending",
      progress: 0,
      source: "Financial System",
      target: "Data Warehouse",
      startTime: null,
      estimatedCompletion: null,
      recordsProcessed: 0,
      totalRecords: 98765,
      description: "Processing and validating financial transaction data",
      schedule: "Weekly on Sundays",
      lastRun: "2024-01-07T00:00:00Z",
      nextRun: "2024-01-14T00:00:00Z"
    }
  ];

  const transformationRules = [
    {
      id: "rule_1",
      name: "Customer Name Standardization",
      type: "Text Transformation",
      description: "Standardize customer names to proper case format",
      field: "customer_name",
      operation: "PROPER_CASE",
      isActive: true
    },
    {
      id: "rule_2",
      name: "Email Validation",
      type: "Data Validation",
      description: "Validate email addresses and flag invalid entries",
      field: "email",
      operation: "EMAIL_VALIDATION",
      isActive: true
    },
    {
      id: "rule_3",
      name: "Revenue Calculation",
      type: "Calculated Field",
      description: "Calculate total revenue from line items",
      field: "total_revenue",
      operation: "SUM(line_items.amount)",
      isActive: true
    },
    {
      id: "rule_4",
      name: "Date Normalization",
      type: "Date Transformation",
      description: "Convert all dates to ISO 8601 format",
      field: "created_date",
      operation: "ISO_DATE_FORMAT",
      isActive: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "paused":
        return <Pause className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Data Analytics", href: "/dashboard/ceo/data" },
          { label: "Processing", isCurrentPage: true },
        ]}
      />
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Data Processing</h1>
              </div>
              <p className="text-muted-foreground">
                ETL pipelines, data jobs, and processing workflows
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Cpu className="h-4 w-4 mr-2" />
                Run All
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{processingJobs.length}</p>
                  <p className="text-xs text-muted-foreground">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{processingJobs.filter(job => job.status === 'running').length}</p>
                  <p className="text-xs text-muted-foreground">Running</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{(processingJobs.reduce((sum, job) => sum + job.recordsProcessed, 0)).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Records Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Processing Jobs</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
          {/* Processing Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid gap-6">
              {processingJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <CardTitle className="text-lg">{job.name}</CardTitle>
                          <CardDescription>
                            {job.type} • {job.source} → {job.target}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    {job.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {job.recordsProcessed.toLocaleString()} / {job.totalRecords.toLocaleString()} records
                          </span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                          <span>Started: {formatDateTime(job.startTime)}</span>
                          <span>ETA: {formatDateTime(job.estimatedCompletion)}</span>
                        </div>
                      </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Schedule:</span>
                        <p className="font-medium">{job.schedule}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Run:</span>
                        <p className="font-medium">{formatDateTime(job.lastRun)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Run:</span>
                        <p className="font-medium">{formatDateTime(job.nextRun)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Records:</span>
                        <p className="font-medium">{job.totalRecords.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        {job.status === 'running' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Run
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Logs
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {/* Transformations Tab */}
          <TabsContent value="transformations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transformation Rules</CardTitle>
                    <CardDescription>
                      Configure data transformation and validation rules
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transformationRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shuffle className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{rule.type}</Badge>
                            <Badge variant="outline" className="text-xs">{rule.field}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={rule.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Performance</CardTitle>
                  <CardDescription>Real-time processing metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">43%</span>
                    </div>
                    <Progress value={43} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queue Length</span>
                      <span className="text-sm font-medium">12 jobs</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Error Summary</CardTitle>
                  <CardDescription>Recent processing errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Connection timeout</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Data validation warning</span>
                      </div>
                      <span className="text-xs text-muted-foreground">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">API rate limit exceeded</span>
                      </div>
                      <span className="text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 