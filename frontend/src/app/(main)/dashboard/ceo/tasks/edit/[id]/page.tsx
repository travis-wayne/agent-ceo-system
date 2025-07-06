import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  Archive,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Clock,
  Target,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  FileText,
  Settings,
  Brain,
  Briefcase,
  Palette,
  BarChart3,
  Zap,
  Edit,
  Copy,
  Share,
  MessageSquare,
  Bell,
  History,
  Activity,
  TrendingUp,
  Award,
  Star,
  Plus,
  Minus,
  X,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Task | Agent CEO",
  description: "Edit and update strategic task details, resources, and configuration",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditTaskPage({ params }: PageProps) {
  // Mock task data - in real app, this would be fetched based on params.id
  const taskData = {
    id: params.id,
    title: "Market Analysis - European Expansion",
    description: "Comprehensive market research and competitive intelligence analysis for potential European market expansion, focusing on DACH region opportunities and strategic entry points.",
    status: "in_progress",
    priority: "high",
    complexity: "high",
    category: "strategic_analysis",
    businessImpact: 9.2,
    progress: 72,
    agent: {
      id: "ceo_agent",
      name: "CEO Agent",
      avatar: "🧠"
    },
    timeline: {
      startDate: "2024-01-15T09:30:00Z",
      dueDate: "2024-01-15T17:30:00Z",
      estimatedDuration: "8 hours",
      actualDuration: "5h 45m"
    },
    budget: {
      allocated: 5000,
      spent: 1850,
      currency: "USD"
    },
    stakeholders: [
      { id: "ceo", name: "CEO", role: "Sponsor", involvement: "high" },
      { id: "strategy_team", name: "Strategy Team", role: "Contributor", involvement: "high" },
      { id: "board", name: "Board Members", role: "Reviewer", involvement: "medium" }
    ],
    deliverables: [
      { name: "Market Size Analysis", completed: true, dueDate: "2024-01-15T12:00:00Z" },
      { name: "Competitive Landscape Report", completed: true, dueDate: "2024-01-15T14:00:00Z" },
      { name: "Entry Strategy Recommendations", completed: false, dueDate: "2024-01-15T16:00:00Z" },
      { name: "Risk Assessment", completed: false, dueDate: "2024-01-15T17:00:00Z" }
    ],
    tags: ["Market Research", "European Markets", "Strategic Planning", "Competitive Analysis"],
    resources: {
      cpu: 85,
      memory: 67,
      tokens: 245000,
      apiCalls: 1247
    },
    metrics: {
      qualityScore: 9.1,
      clientSatisfaction: 4.8,
      timeToCompletion: 0.72,
      costEfficiency: 8.9
    },
    history: [
      { action: "Task created", user: "John Doe", timestamp: "2024-01-15T09:30:00Z" },
      { action: "Priority updated to High", user: "Sarah Smith", timestamp: "2024-01-15T10:15:00Z" },
      { action: "Milestone 1 completed", user: "System", timestamp: "2024-01-15T12:00:00Z" },
      { action: "Milestone 2 completed", user: "System", timestamp: "2024-01-15T14:00:00Z" }
    ]
  };

  const taskCategories = [
    { id: "strategic_analysis", name: "Strategic Analysis", icon: Target },
    { id: "revenue_generation", name: "Revenue Generation", icon: DollarSign },
    { id: "marketing_initiatives", name: "Marketing Initiatives", icon: Award },
    { id: "operational_excellence", name: "Operational Excellence", icon: Settings },
    { id: "data_analytics", name: "Data & Analytics", icon: BarChart3 }
  ];

  const priorityLevels = [
    { id: "critical", name: "Critical", color: "bg-red-100 text-red-800", description: "Urgent business impact" },
    { id: "high", name: "High", color: "bg-orange-100 text-orange-800", description: "Significant business value" },
    { id: "medium", name: "Medium", color: "bg-yellow-100 text-yellow-800", description: "Important for growth" },
    { id: "low", name: "Low", color: "bg-blue-100 text-blue-800", description: "Nice to have" }
  ];

  const statusOptions = [
    { id: "draft", name: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
    { id: "queued", name: "Queued", color: "bg-blue-100 text-blue-800", icon: Clock },
    { id: "in_progress", name: "In Progress", color: "bg-green-100 text-green-800", icon: Play },
    { id: "paused", name: "Paused", color: "bg-yellow-100 text-yellow-800", icon: Pause },
    { id: "completed", name: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
    { id: "cancelled", name: "Cancelled", color: "bg-red-100 text-red-800", icon: X }
  ];

  const availableAgents = [
    { id: "ceo_agent", name: "CEO Agent", avatar: "🧠", specialization: "Strategic Analysis" },
    { id: "sales_agent", name: "Sales Agent", avatar: "💼", specialization: "Revenue Generation" },
    { id: "marketing_agent", name: "Marketing Agent", avatar: "🎨", specialization: "Brand Building" },
    { id: "operations_agent", name: "Operations Agent", avatar: "⚙️", specialization: "Process Optimization" },
    { id: "analytics_agent", name: "Analytics Agent", avatar: "📊", specialization: "Data Intelligence" }
  ];

  const stakeholderRoles = [
    { id: "sponsor", name: "Sponsor", description: "Project oversight and approval" },
    { id: "contributor", name: "Contributor", description: "Active participation and input" },
    { id: "reviewer", name: "Reviewer", description: "Review and feedback" },
    { id: "observer", name: "Observer", description: "Information only" }
  ];

  const getStatusIcon = (statusId: string) => {
    const status = statusOptions.find(s => s.id === statusId);
    return status ? <status.icon className="h-4 w-4" /> : <Activity className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Tasks", href: "/dashboard/ceo/tasks" },
          { label: "Edit Task", isCurrentPage: true },
        ]}
      />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Edit className="h-8 w-8 text-primary" />
                Edit Strategic Task
              </h1>
              <p className="text-muted-foreground mt-2">
                Update task details, configuration, and manage resources
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/dashboard/ceo/tasks/monitor`}>
                <Button variant="outline" size="lg">
                  <Eye className="h-4 w-4 mr-2" />
                  View Monitor
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
              <Button size="lg">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Task Status Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Task Status: {taskData.status.replace('_', ' ').toUpperCase()}</AlertTitle>
          <AlertDescription>
            This task is currently {taskData.status.replace('_', ' ')} with {taskData.progress}% completion. 
            Last updated {new Date().toLocaleDateString()}.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Task Details</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update task title, description, and categorization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input 
                        id="task-title"
                        defaultValue={taskData.title}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea 
                        id="task-description"
                        defaultValue={taskData.description}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select defaultValue={taskData.category}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {taskCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center space-x-2">
                                  <category.icon className="h-4 w-4" />
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Assigned Agent</Label>
                        <Select defaultValue={taskData.agent.id}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAgents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{agent.avatar}</span>
                                  <div>
                                    <span>{agent.name}</span>
                                    <p className="text-xs text-muted-foreground">{agent.specialization}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Priority & Status</CardTitle>
                    <CardDescription>
                      Configure task priority, status, and complexity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Priority Level</Label>
                      <RadioGroup defaultValue={taskData.priority} className="space-y-3">
                        {priorityLevels.map((priority) => (
                          <div key={priority.id} className="flex items-center space-x-3">
                            <RadioGroupItem value={priority.id} id={priority.id} />
                            <div className="flex-1">
                              <Label htmlFor={priority.id} className="cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <Badge className={priority.color}>
                                    {priority.name}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {priority.description}
                                  </span>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Task Status</Label>
                      <RadioGroup defaultValue={taskData.status} className="space-y-3">
                        {statusOptions.map((status) => (
                          <div key={status.id} className="flex items-center space-x-3">
                            <RadioGroupItem value={status.id} id={status.id} />
                            <div className="flex-1">
                              <Label htmlFor={status.id} className="cursor-pointer">
                                <Badge className={status.color}>
                                  {getStatusIcon(status.id)}
                                  <span className="ml-2">{status.name}</span>
                                </Badge>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="complexity">Complexity Level</Label>
                      <Select defaultValue={taskData.complexity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Straightforward execution</SelectItem>
                          <SelectItem value="medium">Medium - Some dependencies</SelectItem>
                          <SelectItem value="high">High - Multiple complexities</SelectItem>
                          <SelectItem value="very_high">Very High - Strategic complexity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Timeline & Budget</CardTitle>
                    <CardDescription>
                      Adjust deadlines and budget allocation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input 
                          id="start-date"
                          type="datetime-local"
                          defaultValue={taskData.timeline.startDate.slice(0, 16)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Input 
                          id="due-date"
                          type="datetime-local"
                          defaultValue={taskData.timeline.dueDate.slice(0, 16)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Allocated</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-muted-foreground text-sm rounded-l-md">
                            USD
                          </span>
                          <Input 
                            id="budget"
                            type="number"
                            defaultValue={taskData.budget.allocated}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated-duration">Estimated Duration</Label>
                        <Input 
                          id="estimated-duration"
                          defaultValue={taskData.timeline.estimatedDuration}
                          placeholder="e.g., 8 hours"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Allocation</CardTitle>
                    <CardDescription>
                      Monitor and adjust computational resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>CPU Usage</span>
                            <span className="font-medium">{taskData.resources.cpu}%</span>
                          </div>
                          <Progress value={taskData.resources.cpu} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Memory Usage</span>
                            <span className="font-medium">{taskData.resources.memory}%</span>
                          </div>
                          <Progress value={taskData.resources.memory} className="h-3" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{(taskData.resources.tokens / 1000).toFixed(0)}K</p>
                          <p className="text-sm text-muted-foreground">Tokens Used</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{taskData.resources.apiCalls.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">API Calls</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Performance Metrics</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Quality Score</span>
                          <Badge variant="outline">{taskData.metrics.qualityScore}/10</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Client Satisfaction</span>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(taskData.metrics.clientSatisfaction)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Time Efficiency</span>
                          <Badge variant="outline">{(taskData.metrics.timeToCompletion * 100).toFixed(0)}%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Cost Efficiency</span>
                          <Badge variant="outline">{taskData.metrics.costEfficiency}/10</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stakeholders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Task Stakeholders</CardTitle>
                        <CardDescription>
                          Manage people involved in this task
                        </CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stakeholder
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {taskData.stakeholders.map((stakeholder, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{stakeholder.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{stakeholder.name}</p>
                              <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {stakeholder.involvement}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deliverables" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Task Deliverables</CardTitle>
                        <CardDescription>
                          Manage expected outputs and milestones
                        </CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Deliverable
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {taskData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {deliverable.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                            <div>
                              <p className={`font-medium ${deliverable.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {deliverable.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Due: {formatDateTime(deliverable.dueDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{taskData.progress}%</div>
                  <Progress value={taskData.progress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">Task Completion</p>
                </div>
                
                <div className="grid gap-3">
                  <div className="flex justify-between text-sm">
                    <span>Time Elapsed:</span>
                    <span className="font-medium">{taskData.timeline.actualDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Budget Used:</span>
                    <span className="font-medium">${taskData.budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impact Score:</span>
                    <Badge variant="outline">{taskData.businessImpact}/10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Resume Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Share Task
                </Button>
                <Separator />
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Task
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              </CardContent>
            </Card>

            {/* Task Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {taskData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taskData.history.slice(0, 4).map((event, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{event.action}</p>
                      <p className="text-muted-foreground text-xs">
                        by {event.user} • {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    <History className="h-4 w-4 mr-2" />
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-8 border-t">
          <Link href="/dashboard/ceo/tasks">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
} 