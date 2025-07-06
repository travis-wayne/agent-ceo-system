import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Bell,
  Shield,
  Database,
  Globe,
  Zap,
  Clock,
  Users,
  Mail,
  Key,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Plus,
  Link as LinkIcon,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workflow Settings",
  description: "Configure workflow settings and preferences",
};

export default function WorkflowSettingsPage() {
  const integrations = [
    {
      name: "n8n",
      description: "Connect to n8n for workflow import/export",
      icon: Globe,
      status: "connected",
      lastSync: "2024-01-15T10:30:00Z"
    },
    {
      name: "Zapier",
      description: "Import workflows from Zapier",
      icon: Zap,
      status: "disconnected",
      lastSync: null
    },
    {
      name: "Email Service",
      description: "SMTP configuration for email workflows",
      icon: Mail,
      status: "connected",
      lastSync: "2024-01-15T08:15:00Z"
    },
    {
      name: "Database",
      description: "External database connections",
      icon: Database,
      status: "connected",
      lastSync: "2024-01-15T12:45:00Z"
    }
  ];

  const notificationChannels = [
    {
      name: "Email Notifications",
      description: "Receive workflow notifications via email",
      enabled: true,
      channel: "email"
    },
    {
      name: "Slack Notifications",
      description: "Send notifications to Slack channels",
      enabled: false,
      channel: "slack"
    },
    {
      name: "Webhook Notifications",
      description: "Send notifications to custom webhooks",
      enabled: true,
      channel: "webhook"
    },
    {
      name: "In-App Notifications",
      description: "Show notifications in the application",
      enabled: true,
      channel: "app"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Connected</Badge>;
      case "disconnected": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Disconnected</Badge>;
      case "warning": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Warning</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Workflows", href: "/dashboard/ceo/workflows" },
          { label: "Settings", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Workflow Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure workflow settings, integrations, and preferences
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
                Reset to Defaults
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="execution" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Execution
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic workflow configuration and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-timeout">Default Timeout (minutes)</Label>
                    <Input 
                      id="default-timeout"
                      type="number"
                      defaultValue="30"
                      placeholder="30"
                    />
                    <p className="text-xs text-muted-foreground">
                      Default timeout for workflow executions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Max Retry Attempts</Label>
                    <Input 
                      id="max-retries"
                      type="number"
                      defaultValue="3"
                      placeholder="3"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of retry attempts for failed executions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retry-delay">Retry Delay (seconds)</Label>
                    <Input 
                      id="retry-delay"
                      type="number"
                      defaultValue="60"
                      placeholder="60"
                    />
                    <p className="text-xs text-muted-foreground">
                      Delay between retry attempts
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Workflow Behavior</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Auto-save drafts</Label>
                          <p className="text-xs text-muted-foreground">Automatically save workflow changes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Enable debug mode</Label>
                          <p className="text-xs text-muted-foreground">Show detailed execution logs</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Parallel execution</Label>
                          <p className="text-xs text-muted-foreground">Allow concurrent workflow executions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storage & Cleanup */}
              <Card>
                <CardHeader>
                  <CardTitle>Storage & Cleanup</CardTitle>
                  <CardDescription>
                    Manage workflow data retention and cleanup policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Log Retention (days)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="never">Never delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="execution-history">Execution History Retention</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="never">Never delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="failed-execution-retention">Failed Execution Retention</Label>
                    <Select defaultValue="180">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Cleanup Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Auto-cleanup old logs</Label>
                          <p className="text-xs text-muted-foreground">Automatically delete old execution logs</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Compress old data</Label>
                          <p className="text-xs text-muted-foreground">Compress execution data older than 30 days</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Execution Limits */}
              <Card>
                <CardHeader>
                  <CardTitle>Execution Limits</CardTitle>
                  <CardDescription>
                    Configure execution limits and resource constraints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-concurrent">Max Concurrent Executions</Label>
                    <Input 
                      id="max-concurrent"
                      type="number"
                      defaultValue="10"
                      placeholder="10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of workflows running simultaneously
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-execution-time">Max Execution Time (minutes)</Label>
                    <Input 
                      id="max-execution-time"
                      type="number"
                      defaultValue="60"
                      placeholder="60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="memory-limit">Memory Limit (MB)</Label>
                    <Input 
                      id="memory-limit"
                      type="number"
                      defaultValue="512"
                      placeholder="512"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpu-limit">CPU Limit (%)</Label>
                    <Input 
                      id="cpu-limit"
                      type="number"
                      defaultValue="80"
                      placeholder="80"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Queue Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Queue Settings</CardTitle>
                  <CardDescription>
                    Configure workflow execution queue behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="queue-priority">Default Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="queue-size">Max Queue Size</Label>
                    <Input 
                      id="queue-size"
                      type="number"
                      defaultValue="100"
                      placeholder="100"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Queue Behavior</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Priority-based execution</Label>
                          <p className="text-xs text-muted-foreground">Execute high-priority workflows first</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Fair scheduling</Label>
                          <p className="text-xs text-muted-foreground">Ensure fair resource allocation</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Configure how and where you receive workflow notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationChannels.map((channel) => (
                  <div key={channel.channel} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-sm text-muted-foreground">{channel.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked={channel.enabled} />
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Workflow execution started</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Workflow execution completed</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Workflow execution failed</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Workflow timeout</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Weekly summary report</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>
                  Manage connections to external services and platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(integration.status)}
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <integration.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-muted-foreground">{integration.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Last sync: {formatTime(integration.lastSync)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(integration.status)}
                      <Button 
                        variant={integration.status === "connected" ? "outline" : "default"} 
                        size="sm"
                      >
                        {integration.status === "connected" ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center pt-4">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security and access control settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Require authentication for API access</Label>
                        <p className="text-xs text-muted-foreground">Require API key for external access</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Enable audit logging</Label>
                        <p className="text-xs text-muted-foreground">Log all workflow operations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Encrypt sensitive data</Label>
                        <p className="text-xs text-muted-foreground">Encrypt workflow credentials and secrets</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">IP allowlist</Label>
                        <p className="text-xs text-muted-foreground">Restrict access to specific IP addresses</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="session-timeout"
                      type="number"
                      defaultValue="60"
                      placeholder="60"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* API Keys */}
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for external access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Production API Key</div>
                        <div className="text-xs text-muted-foreground">Created: Jan 15, 2024</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Development API Key</div>
                        <div className="text-xs text-muted-foreground">Created: Jan 10, 2024</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      API keys provide full access to your workflows. Keep them secure and rotate them regularly.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 