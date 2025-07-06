import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Code,
  Zap,
  Settings,
  Eye,
  Plus,
  Link as LinkIcon,
  Copy,
  RefreshCw,
  Workflow,
  Database,
  Mail,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Import Workflows",
  description: "Import workflows from files or external platforms",
};

export default function ImportWorkflowPage() {
  const supportedFormats = [
    {
      name: "JSON",
      extension: ".json",
      description: "Standard workflow JSON format",
      icon: Code,
      popular: true
    },
    {
      name: "n8n",
      extension: ".json",
      description: "n8n workflow export format",
      icon: Globe,
      popular: true
    },
    {
      name: "Zapier",
      extension: ".json",
      description: "Zapier workflow export format",
      icon: Zap,
      popular: false
    },
    {
      name: "Microsoft Power Automate",
      extension: ".json",
      description: "Power Automate flow export",
      icon: Settings,
      popular: false
    }
  ];

  const recentImports = [
    {
      id: 1,
      name: "Email Campaign Automation",
      source: "n8n",
      importedAt: "2024-01-15T10:30:00Z",
      status: "success",
      nodesCount: 12,
      type: "EMAIL_AUTOMATION"
    },
    {
      id: 2,
      name: "Customer Data Sync",
      source: "JSON File",
      importedAt: "2024-01-14T15:45:00Z",
      status: "success",
      nodesCount: 8,
      type: "DATA_SYNC"
    },
    {
      id: 3,
      name: "Lead Scoring Workflow",
      source: "Zapier",
      importedAt: "2024-01-13T09:20:00Z",
      status: "failed",
      nodesCount: 0,
      type: "LEAD_NURTURING",
      error: "Invalid webhook configuration"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "processing": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>;
      case "processing": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Processing</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
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
          { label: "Import", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Upload className="h-8 w-8 text-primary" />
                Import Workflows
              </h1>
              <p className="text-muted-foreground mt-2">
                Import workflows from files or external platforms like n8n
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
                <Download className="h-4 w-4 mr-2" />
                Sample Files
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Import
              </Button>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Supported Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedFormats.map((format) => (
              <Card key={format.name} className="hover:shadow-md transition-shadow">
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
                  <p className="text-sm text-muted-foreground mb-2">{format.description}</p>
                  <Badge variant="outline" className="text-xs">{format.extension}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Upload
            </TabsTrigger>
            <TabsTrigger value="n8n" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              n8n Integration
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Import History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Workflow File</CardTitle>
                  <CardDescription>
                    Upload a workflow file in JSON format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drop your workflow file here</p>
                      <p className="text-xs text-muted-foreground">or click to browse</p>
                    </div>
                    <Button className="mt-4">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input 
                      id="workflow-name"
                      placeholder="Enter a name for the imported workflow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workflow-description">Description (Optional)</Label>
                    <Textarea 
                      id="workflow-description"
                      placeholder="Describe the workflow purpose"
                      rows={3}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Workflow
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Import Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Options</CardTitle>
                  <CardDescription>
                    Configure how the workflow should be imported
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Import Mode</Label>
                    <Select defaultValue="create">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="create">Create New Workflow</SelectItem>
                        <SelectItem value="update">Update Existing Workflow</SelectItem>
                        <SelectItem value="duplicate">Duplicate and Modify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Validation Level</Label>
                    <Select defaultValue="strict">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict Validation</SelectItem>
                        <SelectItem value="moderate">Moderate Validation</SelectItem>
                        <SelectItem value="lenient">Lenient Validation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Conflict Resolution</Label>
                    <Select defaultValue="rename">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rename">Auto Rename</SelectItem>
                        <SelectItem value="overwrite">Overwrite Existing</SelectItem>
                        <SelectItem value="skip">Skip Conflicts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Import Settings</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Import workflow triggers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Import workflow actions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Import credentials (if available)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Validate connections</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="n8n" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* n8n Connection */}
              <Card>
                <CardHeader>
                  <CardTitle>n8n Connection</CardTitle>
                  <CardDescription>
                    Connect to your n8n instance to import workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="n8n-url">n8n Instance URL</Label>
                    <Input 
                      id="n8n-url"
                      placeholder="https://your-n8n-instance.com"
                      type="url"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n8n-token">API Token</Label>
                    <Input 
                      id="n8n-token"
                      placeholder="Enter your n8n API token"
                      type="password"
                    />
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your API token is encrypted and stored securely. It's only used to connect to your n8n instance.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Connect to n8n
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Available Workflows */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Workflows</CardTitle>
                  <CardDescription>
                    Workflows available in your n8n instance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Connect to n8n</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect to your n8n instance to view available workflows
                    </p>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Setup Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Import History</CardTitle>
                <CardDescription>
                  Recent workflow imports and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentImports.map((importItem) => (
                    <div key={importItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(importItem.status)}
                        <div>
                          <div className="font-medium">{importItem.name}</div>
                          <div className="text-sm text-muted-foreground">
                            From {importItem.source} • {formatTime(importItem.importedAt)}
                            {importItem.nodesCount > 0 && ` • ${importItem.nodesCount} nodes`}
                          </div>
                          {importItem.error && (
                            <div className="text-sm text-red-600 mt-1">
                              Error: {importItem.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{importItem.type.replace('_', ' ')}</Badge>
                        {getStatusBadge(importItem.status)}
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
        </Tabs>
      </main>
    </>
  );
} 