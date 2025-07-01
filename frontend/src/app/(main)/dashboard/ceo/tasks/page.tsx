import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, CheckCircle, AlertCircle, Bot, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agent Tasks | Agent CEO",
  description: "Manage and monitor tasks assigned to your AI agents",
};

export default function TasksPage() {
  // Mock task data - will integrate with existing ticket system
  const tasks = [
    {
      id: "task-001",
      title: "Strategic Market Analysis for Q2",
      description: "Analyze market trends and competitive landscape for strategic planning",
      agent: "Strategic CEO Agent",
      agentType: "CEO Agent",
      status: "in_progress",
      priority: "high",
      progress: 75,
      estimatedCompletion: "2 hours",
      createdAt: "2024-01-15T10:00:00Z",
      category: "Strategic Analysis"
    },
    {
      id: "task-002", 
      title: "Lead Generation Campaign Setup",
      description: "Create automated lead generation sequence for SaaS prospects",
      agent: "Sales Automation Agent",
      agentType: "Sales Agent",
      status: "completed",
      priority: "medium",
      progress: 100,
      estimatedCompletion: "Completed",
      createdAt: "2024-01-15T08:30:00Z",
      category: "Lead Generation"
    },
    {
      id: "task-003",
      title: "Social Media Content Calendar",
      description: "Generate 30-day content calendar for LinkedIn and Twitter",
      agent: "Content Marketing Agent",
      agentType: "Marketing Agent", 
      status: "pending",
      priority: "low",
      progress: 0,
      estimatedCompletion: "4 hours",
      createdAt: "2024-01-15T14:20:00Z",
      category: "Content Creation"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500 text-white">Completed</Badge>;
      case "in_progress":
        return <Badge variant="default" className="bg-blue-500 text-white">In Progress</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge variant="default" className="bg-orange-500 text-white">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const taskStats = {
    total: 48,
    completed: 31,
    inProgress: 12,
    pending: 5,
    successRate: 94
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Tasks", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Agent Tasks</h1>
            <p className="text-muted-foreground">
              Manage and monitor tasks assigned to your AI agents
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Task
          </Button>
        </div>

        {/* Task Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.completed}</div>
              <p className="text-xs text-muted-foreground">+8 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting agents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.successRate}%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Management */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>Complete overview of all AI agent tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{task.agentType}</Badge>
                            <Badge variant="outline" className="text-xs">{task.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-2 mb-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Agent: {task.agent}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {task.status === "completed" ? "Completed" : `ETA: ${task.estimatedCompletion}`}
                        </div>
                        {task.status === "in_progress" && (
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">Progress: {task.progress}%</div>
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in_progress">
            <Card>
              <CardHeader>
                <CardTitle>Tasks In Progress</CardTitle>
                <CardDescription>Currently active AI agent tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.filter(task => task.status === "in_progress").map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm">Progress: {task.progress}%</div>
                        <div className="text-sm text-muted-foreground">ETA: {task.estimatedCompletion}</div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks waiting to be assigned to agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.filter(task => task.status === "pending").map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                      <div className="flex justify-between items-center mt-3">
                        <Badge variant="outline">{task.agentType}</Badge>
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>Successfully completed AI agent tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.filter(task => task.status === "completed").map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                      <div className="flex justify-between items-center mt-3">
                        <Badge variant="default" className="bg-green-500 text-white">Completed</Badge>
                        <div className="text-sm text-muted-foreground">Agent: {task.agent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
} 