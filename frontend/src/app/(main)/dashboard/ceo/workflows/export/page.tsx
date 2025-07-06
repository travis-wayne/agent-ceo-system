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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  ArrowLeft, 
  FileText, 
  Code, 
  Globe, 
  Zap,
  Settings,
  CheckCircle,
  Package,
  Archive,
  Share,
  Copy,
  Eye,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Database,
  Mail,
  MessageSquare,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Export Workflows",
  description: "Export your workflows to various formats",
};

export default function ExportWorkflowPage() {
  const exportFormats = [
    {
      name: "JSON",
      extension: ".json",
      description: "Standard workflow JSON format",
      icon: Code,
      compatible: ["All Platforms"],
      popular: true
    },
    {
      name: "n8n",
      extension: ".json",
      description: "n8n compatible format",
      icon: Globe,
      compatible: ["n8n"],
      popular: true
    },
    {
      name: "Zapier",
      extension: ".json", 
      description: "Zapier compatible format",
      icon: Zap,
      compatible: ["Zapier"],
      popular: false
    },
    {
      name: "Archive",
      extension: ".zip",
      description: "Complete workflow package with assets",
      icon: Archive,
      compatible: ["Backup", "Migration"],
      popular: true
    }
  ];

  const workflows = [
    {
      id: 1,
      name: "Lead Nurturing Email Sequence",
      description: "Automated email sequence for lead nurturing",
      type: "EMAIL_AUTOMATION",
      status: "active",
      lastModified: "2024-01-15T10:30:00Z",
      createdBy: "John Doe",
      size: "2.3 KB",
      nodes: 12,
      isSelected: false
    },
    {
      id: 2,
      name: "Customer Onboarding Flow",
      description: "Complete customer onboarding workflow",
      type: "CUSTOMER_ONBOARDING",
      status: "active",
      lastModified: "2024-01-14T15:45:00Z",
      createdBy: "Jane Smith",
      size: "4.1 KB",
      nodes: 18,
      isSelected: false
    },
    {
      id: 3,
      name: "Daily Sales Report",
      description: "Automated daily sales reporting",
      type: "REPORTING",
      status: "active",
      lastModified: "2024-01-13T09:20:00Z",
      createdBy: "Mike Johnson",
      size: "1.8 KB",
      nodes: 8,
      isSelected: false
    },
    {
      id: 4,
      name: "Data Backup & Sync",
      description: "Automated data backup and synchronization",
      type: "DATA_SYNC",
      status: "paused",
      lastModified: "2024-01-12T14:10:00Z",
      createdBy: "Sarah Wilson",
      size: "3.2 KB",
      nodes: 15,
      isSelected: false
    },
    {
      id: 5,
      name: "Support Ticket Routing",
      description: "Automatic support ticket routing and assignment",
      type: "TASK_AUTOMATION",
      status: "active",
      lastModified: "2024-01-11T11:30:00Z",
      createdBy: "Tom Brown",
      size: "2.7 KB",
      nodes: 10,
      isSelected: false
    }
  ];

  const recentExports = [
    {
      id: 1,
      name: "Marketing Workflows Bundle",
      format: "Archive (.zip)",
      exportedAt: "2024-01-15T16:30:00Z",
      size: "12.4 MB",
      workflowCount: 5,
      downloadUrl: "#"
    },
    {
      id: 2,
      name: "Lead Nurturing Email Sequence",
      format: "JSON",
      exportedAt: "2024-01-14T10:15:00Z",
      size: "2.3 KB",
      workflowCount: 1,
      downloadUrl: "#"
    },
    {
      id: 3,
      name: "Customer Workflows",
      format: "n8n JSON",
      exportedAt: "2024-01-13T14:20:00Z",
      size: "8.7 KB",
      workflowCount: 3,
      downloadUrl: "#"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMAIL_AUTOMATION": return <Mail className="h-4 w-4" />;
      case "CUSTOMER_ONBOARDING": return <User className="h-4 w-4" />;
      case "REPORTING": return <BarChart3 className="h-4 w-4" />;
      case "DATA_SYNC": return <Database className="h-4 w-4" />;
      case "TASK_AUTOMATION": return <Settings className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case "paused": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Paused</Badge>;
      case "draft": return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Draft</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Workflows", href: "/dashboard/ceo/workflows" },
          { label: "Export", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Download className="h-8 w-8 text-primary" />
                Export Workflows
              </h1>
              <p className="text-muted-foreground mt-2">
                Export your workflows to various formats for backup or migration
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
                <Share className="h-4 w-4 mr-2" />
                Share Export
              </Button>
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Bulk Export
              </Button>
            </div>
          </div>
        </div>

        {/* Export Formats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Export Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportFormats.map((format) => (
              <Card key={format.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <format.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{format.name}</CardTitle>
                    </div>
                    {format.popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{format.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Format:</span>
                      <Badge variant="outline" className="text-xs">{format.extension}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Compatible: {format.compatible.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="select" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Select Workflows
            </TabsTrigger>
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configure Export
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Export History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="EMAIL_AUTOMATION">Email Automation</SelectItem>
                    <SelectItem value="CUSTOMER_ONBOARDING">Customer Onboarding</SelectItem>
                    <SelectItem value="REPORTING">Reporting</SelectItem>
                    <SelectItem value="DATA_SYNC">Data Sync</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Workflow Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Workflows to Export</CardTitle>
                    <CardDescription>
                      Choose which workflows you want to export
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Select All
                    </Button>
                    <Button variant="outline" size="sm">
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50">
                      <Checkbox id={`workflow-${workflow.id}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getTypeIcon(workflow.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{workflow.name}</h4>
                            <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{workflow.nodes} nodes</span>
                          <span>{workflow.size}</span>
                          <span>Modified {formatTime(workflow.lastModified)}</span>
                          <span>by {workflow.createdBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(workflow.status)}
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

          <TabsContent value="configure" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Export Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Settings</CardTitle>
                  <CardDescription>
                    Configure export format and options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON Format</SelectItem>
                        <SelectItem value="n8n">n8n Compatible</SelectItem>
                        <SelectItem value="zapier">Zapier Compatible</SelectItem>
                        <SelectItem value="archive">Complete Archive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Compression</Label>
                    <Select defaultValue="zip">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Compression</SelectItem>
                        <SelectItem value="zip">ZIP Archive</SelectItem>
                        <SelectItem value="tar">TAR Archive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-name">Export Name</Label>
                    <Input 
                      id="export-name"
                      placeholder="My Workflow Export"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Include in Export</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span className="text-sm">Workflow definitions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span className="text-sm">Trigger configurations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Credentials (encrypted)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span className="text-sm">Workflow metadata</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Execution history</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Preview</CardTitle>
                  <CardDescription>
                    Preview of your export package
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">My Workflow Export.zip</h4>
                        <p className="text-sm text-muted-foreground">Estimated size: 8.2 MB</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Selected workflows:</span>
                        <span>3 workflows</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total nodes:</span>
                        <span>38 nodes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span>JSON + ZIP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Includes:</span>
                        <span>Definitions, Triggers, Metadata</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Export Options</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Generate documentation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Include setup instructions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span className="text-sm">Create backup copy</span>
                      </label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Now
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export History</CardTitle>
                <CardDescription>
                  Previous workflow exports and downloads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExports.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{exportItem.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {exportItem.format} • {exportItem.size} • {exportItem.workflowCount} workflow{exportItem.workflowCount > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Exported on {formatTime(exportItem.exportedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
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