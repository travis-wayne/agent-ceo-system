import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Webhook
} from "lucide-react";

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

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Workflow Automation", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workflow Automation</h1>
            <p className="text-muted-foreground">
              n8n-powered workflow automation and business process management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              n8n Settings
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* n8n Integration Status */}
        <Card className={n8nStatus.connected ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full ${n8nStatus.connected ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center`}>
                  <Workflow className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    n8n Integration {n8nStatus.connected ? "Connected" : "Disconnected"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {n8nStatus.connected 
                      ? `Version ${n8nStatus.version} • ${n8nStatus.activeWorkflows} active workflows • ${n8nStatus.totalExecutions} total executions`
                      : "Connect to n8n to enable workflow automation"
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Link className="h-4 w-4" />
                  Open n8n
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Code className="h-4 w-4" />
                  API Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Workflow className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,847</div>
              <p className="text-xs text-muted-foreground">+23% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">+1.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47hrs</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Management Tabs */}
        <Tabs defaultValue="workflows" className="space-y-4">
          <TabsList>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>Manage your automated business processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{workflow.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{workflow.category}</Badge>
                            {getStatusBadge(workflow.status)}
                            <Badge variant="secondary" className="gap-1">
                              <Code className="h-3 w-3" />
                              ID: {workflow.n8nWorkflowId}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Last run: {new Date(workflow.lastRun).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg duration: {workflow.avgDuration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{workflow.triggers}</div>
                          <div className="text-sm text-muted-foreground">Triggers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{workflow.success}</div>
                          <div className="text-sm text-muted-foreground">Success</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{workflow.errors}</div>
                          <div className="text-sm text-muted-foreground">Errors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{workflow.successRate}%</div>
                          <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Play className="h-3 w-3" />
                          Run
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Settings className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Activity className="h-3 w-3" />
                          Logs
                        </Button>
                        {workflow.status === "active" ? (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Pause className="h-3 w-3" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Play className="h-3 w-3" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>Pre-built workflows for common business processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="mt-1">{template.category}</Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getComplexityBadge(template.complexity)}
                          {template.popular && (
                            <Badge variant="default" className="bg-purple-500 text-white text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      
                      <div className="mb-3">
                        <div className="text-xs text-muted-foreground mb-1">Integrations:</div>
                        <div className="flex flex-wrap gap-1">
                          {template.integrations.map((integration) => (
                            <Badge key={integration} variant="outline" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-muted-foreground">
                          Setup: {template.estimated}
                        </div>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Endpoints</CardTitle>
                <CardDescription>Integration points for external systems and AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4" />
                        <span className="font-medium">AI Agent Task Completion</span>
                      </div>
                      <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Triggered when AI agents complete tasks or require human intervention
                    </div>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      POST /api/webhooks/agent/task-completed
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4" />
                        <span className="font-medium">Lead Status Change</span>
                      </div>
                      <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Triggered when lead status changes for workflow automation
                    </div>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      POST /api/webhooks/lead/status-change
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4" />
                        <span className="font-medium">Email Campaign Events</span>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Email open, click, and conversion events for campaign automation
                    </div>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      POST /api/webhooks/email/campaign-event
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Execution Logs</CardTitle>
                <CardDescription>View detailed workflow execution history and debugging information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Execution Logs</h3>
                  <p className="text-muted-foreground">
                    Coming soon - Detailed workflow execution logs and debugging tools
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* n8n Integration Guide */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              n8n Integration Ready
            </CardTitle>
            <CardDescription>Your n8n backend is configured and ready for workflow automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Available Webhook Endpoints:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Agent task completion triggers</li>
                  <li>• Lead qualification workflows</li>
                  <li>• Email campaign automation</li>
                  <li>• Customer onboarding sequences</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Integration Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time workflow monitoring</li>
                  <li>• Error handling and notifications</li>
                  <li>• Custom node development</li>
                  <li>• API-first architecture</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 