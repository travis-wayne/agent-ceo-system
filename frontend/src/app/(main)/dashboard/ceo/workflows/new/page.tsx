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
import { 
  Save, 
  Play, 
  ArrowLeft, 
  Plus, 
  Settings, 
  Zap, 
  Clock, 
  Mail,
  Database,
  Globe,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  UserPlus
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create New Workflow",
  description: "Build a new automated workflow from scratch",
};

export default function NewWorkflowPage() {
  const workflowTypes = [
    { value: "EMAIL_AUTOMATION", label: "Email Automation", icon: Mail },
    { value: "LEAD_NURTURING", label: "Lead Nurturing", icon: Users },
    { value: "CUSTOMER_ONBOARDING", label: "Customer Onboarding", icon: UserPlus },
    { value: "TASK_AUTOMATION", label: "Task Automation", icon: Zap },
    { value: "DATA_SYNC", label: "Data Synchronization", icon: Database },
    { value: "NOTIFICATION", label: "Notifications", icon: MessageSquare },
    { value: "REPORTING", label: "Reporting", icon: BarChart3 },
    { value: "INTEGRATION", label: "Integration", icon: Globe },
    { value: "CUSTOM", label: "Custom Workflow", icon: Settings }
  ];

  const triggerTypes = [
    { value: "SCHEDULE", label: "Schedule", description: "Run at specific times" },
    { value: "WEBHOOK", label: "Webhook", description: "Triggered by external events" },
    { value: "EMAIL", label: "Email", description: "When emails are received" },
    { value: "FORM_SUBMISSION", label: "Form Submission", description: "When forms are submitted" },
    { value: "DATABASE_CHANGE", label: "Database Change", description: "When data changes" },
    { value: "MANUAL", label: "Manual", description: "Run manually" }
  ];

  const actionTypes = [
    { value: "SEND_EMAIL", label: "Send Email", icon: Mail },
    { value: "CREATE_TASK", label: "Create Task", icon: Plus },
    { value: "UPDATE_DATABASE", label: "Update Database", icon: Database },
    { value: "SEND_NOTIFICATION", label: "Send Notification", icon: MessageSquare },
    { value: "GENERATE_REPORT", label: "Generate Report", icon: FileText },
    { value: "CALL_API", label: "Call API", icon: Globe },
    { value: "WAIT", label: "Wait/Delay", icon: Clock },
    { value: "CONDITION", label: "Condition", icon: Settings }
  ];

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Workflows", href: "/dashboard/ceo/workflows" },
          { label: "Create New", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Plus className="h-8 w-8 text-primary" />
                Create New Workflow
              </h1>
              <p className="text-muted-foreground mt-2">
                Build a new automated workflow from scratch
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
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Test Workflow
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Workflow Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure the basic settings for your workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input 
                      id="workflow-name"
                      placeholder="Enter workflow name"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workflow-type">Workflow Type</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select workflow type" />
                      </SelectTrigger>
                      <SelectContent>
                        {workflowTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea 
                    id="workflow-description"
                    placeholder="Describe what this workflow does"
                    className="bg-background"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">automation</Badge>
                    <Badge variant="secondary">email</Badge>
                    <Badge variant="secondary">leads</Badge>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trigger Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Trigger Configuration</CardTitle>
                <CardDescription>
                  Define when this workflow should run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trigger Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {triggerTypes.map((trigger) => (
                      <Card key={trigger.value} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-primary mt-1" />
                            <div>
                              <h4 className="font-medium">{trigger.label}</h4>
                              <p className="text-sm text-muted-foreground">
                                {trigger.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Define what actions this workflow should perform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* Action 1 */}
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Action 1</h4>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((action) => (
                          <SelectItem key={action.value} value={action.value}>
                            <div className="flex items-center gap-2">
                              <action.icon className="h-4 w-4" />
                              {action.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add Action Button */}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workflow Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Preview</CardTitle>
                <CardDescription>
                  Visual representation of your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Trigger</p>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-border"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Action</p>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure workflow behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Timeout (minutes)</Label>
                  <Input 
                    type="number" 
                    placeholder="30"
                    className="bg-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Retries</Label>
                  <Input 
                    type="number" 
                    placeholder="3"
                    className="bg-background"
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <div className="w-10 h-6 bg-primary rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Import from n8n
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
} 