import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  FileJson,
  FileText,
  Server,
  Share,
  Eye,
  Settings,
  Copy,
  Trash2,
  Link,
  Plus,
  Package,
  Database
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Export | Agent CEO",
  description: "Export data and share with external systems",
};

export default function DataExportPage() {
  // Mock data for export jobs
  const exportJobs = [
    {
      id: "export_1",
      name: "Monthly Customer Report",
      type: "Scheduled Export",
      format: "CSV",
      destination: "Email",
      status: "completed",
      schedule: "Monthly on 1st",
      lastRun: "2024-01-01T00:00:00Z",
      nextRun: "2024-02-01T00:00:00Z",
      records: 156834,
      fileSize: "12.4 MB",
      recipients: ["ceo@company.com", "analytics@company.com"],
      description: "Monthly customer data export for executive review"
    },
    {
      id: "export_2",
      name: "Lead Generation Data",
      type: "API Export",
      format: "JSON",
      destination: "Marketing Platform",
      status: "running",
      schedule: "Daily at 6:00 AM",
      lastRun: "2024-01-15T06:00:00Z",
      nextRun: "2024-01-16T06:00:00Z",
      records: 89456,
      fileSize: "8.7 MB",
      recipients: [],
      description: "Daily lead data sync to marketing automation platform"
    },
    {
      id: "export_3",
      name: "Financial Dashboard Data",
      type: "Real-time Export",
      format: "API",
      destination: "BI Tool",
      status: "active",
      schedule: "Real-time",
      lastRun: "2024-01-15T14:45:00Z",
      nextRun: "Continuous",
      records: 23456,
      fileSize: "N/A",
      recipients: [],
      description: "Real-time financial data feed for business intelligence dashboard"
    },
    {
      id: "export_4",
      name: "Compliance Report",
      type: "One-time Export",
      format: "PDF",
      destination: "File Storage",
      status: "failed",
      schedule: "Manual",
      lastRun: "2024-01-15T10:00:00Z",
      nextRun: "Manual",
      records: 0,
      fileSize: "0 MB",
      recipients: ["compliance@company.com"],
      description: "Quarterly compliance report for regulatory requirements"
    }
  ];

  const exportTemplates = [
    {
      id: "template_1",
      name: "Customer Data Export",
      description: "Standard customer information export",
      tables: ["customers", "contacts"],
      fields: ["name", "email", "phone", "address", "created_date"],
      format: "CSV",
      filters: "active = true"
    },
    {
      id: "template_2",
      name: "Sales Analytics",
      description: "Sales performance data for analysis",
      tables: ["businesses", "leads", "opportunities"],
      fields: ["company_name", "revenue", "stage", "close_date"],
      format: "JSON",
      filters: "created_date >= '2024-01-01'"
    },
    {
      id: "template_3",
      name: "Marketing Campaign Data",
      description: "Campaign performance metrics",
      tables: ["campaigns", "email_metrics", "conversions"],
      fields: ["campaign_name", "open_rate", "click_rate", "conversion_rate"],
      format: "Excel",
      filters: "status = 'completed'"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "running":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "csv":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case "json":
        return <FileJson className="h-5 w-5 text-blue-600" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />;
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case "api":
        return <Server className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Data Analytics", href: "/dashboard/ceo/data" },
          { label: "Export", isCurrentPage: true },
        ]}
      />
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Download className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
              </div>
              <p className="text-muted-foreground">
                Export data and share with external systems
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{exportJobs.length}</p>
                  <p className="text-xs text-muted-foreground">Total Exports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{exportJobs.filter(job => job.status === 'active' || job.status === 'completed').length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{exportJobs.reduce((sum, job) => sum + job.records, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Records Exported</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="exports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="exports">Export Jobs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="sharing">Sharing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          {/* Export Jobs Tab */}
          <TabsContent value="exports" className="space-y-6">
            <div className="grid gap-6">
              {exportJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <CardTitle className="text-lg">{job.name}</CardTitle>
                          <CardDescription>
                            {job.type} • {job.format} • {job.destination}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(job.format)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
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
                        <span className="text-muted-foreground">Records:</span>
                        <p className="font-medium">{job.records.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">File Size:</span>
                        <p className="font-medium">{job.fileSize}</p>
                      </div>
                    </div>
                    {job.recipients.length > 0 && (
                      <div className="mt-4">
                        <span className="text-sm text-muted-foreground">Recipients:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {job.recipients.map((recipient, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {recipient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
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
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Export Templates</CardTitle>
                    <CardDescription>Pre-configured export templates for common data exports</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {exportTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getFormatIcon(template.format)}
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                          </div>
                          <Badge variant="outline">{template.format}</Badge>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Tables:</span>
                            <p className="font-medium">{template.tables.join(", ")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fields:</span>
                            <p className="font-medium">{template.fields.slice(0, 3).join(", ")}
                              {template.fields.length > 3 && ` +${template.fields.length - 3} more`}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Filters:</span>
                            <p className="font-medium text-xs">{template.filters}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Use Template
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Sharing Tab */}
          <TabsContent value="sharing" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Share Data</CardTitle>
                  <CardDescription>Share data exports with external stakeholders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="share-email">Email Recipients</Label>
                    <Input 
                      id="share-email" 
                      placeholder="Enter email addresses separated by commas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="share-message">Message</Label>
                    <Textarea 
                      id="share-message" 
                      placeholder="Optional message to include with the shared data"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-password" />
                    <Label htmlFor="share-password">Password protect</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="share-expiry" />
                    <Label htmlFor="share-expiry">Set expiry date</Label>
                  </div>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Public Links</CardTitle>
                  <CardDescription>Create public links for data sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Customer Report Link</p>
                        <p className="text-sm text-muted-foreground">Expires in 7 days</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sales Analytics Link</p>
                        <p className="text-sm text-muted-foreground">Expires in 30 days</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Link className="h-4 w-4 mr-2" />
                    Create New Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
                <CardDescription>Configure global export preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-format">Default Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-records">Max Records Per Export</Label>
                    <Select defaultValue="100000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000">10,000</SelectItem>
                        <SelectItem value="50000">50,000</SelectItem>
                        <SelectItem value="100000">100,000</SelectItem>
                        <SelectItem value="500000">500,000</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications when exports complete
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic cleanup</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically delete old export files after 30 days
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data compression</Label>
                      <p className="text-sm text-muted-foreground">
                        Compress large exports to reduce file size
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 