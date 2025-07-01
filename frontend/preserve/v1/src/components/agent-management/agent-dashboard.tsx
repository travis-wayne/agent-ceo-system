// Agent Management Dashboard Component
// /src/components/agent-management/agent-dashboard.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAgents, useTasks } from '@/hooks/use-agent-ceo';
import { Agent, Task } from '@/services/agent-ceo-api';
import { 
  Bot, 
  Plus, 
  Settings, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Users,
  Zap,
  Cog,
  BarChart3,
  Play,
  Pause,
  Target
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  description: string;
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: number;
  lastActive: string;
  capabilities: string[];
  currentTasks: number;
  maxTasks: number;
  utilizationRate: number;
}

interface Task {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  agentName: string;
  dueDate?: string;
  duration?: number;
}

const AgentStatusBadge = ({ status }: { status: Agent['status'] }) => {
  const statusConfig = {
    active: { color: 'bg-green-500', text: 'Active' },
    inactive: { color: 'bg-gray-500', text: 'Inactive' },
    busy: { color: 'bg-yellow-500', text: 'Busy' },
    error: { color: 'bg-red-500', text: 'Error' },
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      {config.text}
    </Badge>
  );
};

const AgentTypeIcon = ({ type }: { type: Agent['type'] }) => {
  const icons = {
    ceo: <Users className="w-4 h-4" />,
    sales: <TrendingUp className="w-4 h-4" />,
    marketing: <Zap className="w-4 h-4" />,
    operations: <Settings className="w-4 h-4" />,
    analytics: <Activity className="w-4 h-4" />,
  };

  return icons[type] || <Bot className="w-4 h-4" />;
};

const CreateAgentDialog = ({ onAgentCreated }: { onAgentCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'ceo' as Agent['type'],
    description: '',
    capabilities: '',
  });
  const { createAgent } = useAgents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAgent({
        ...formData,
        capabilities: formData.capabilities.split(',').map(c => c.trim()),
        status: 'inactive',
      });
      
      setOpen(false);
      setFormData({ name: '', type: 'ceo', description: '', capabilities: '' });
      onAgentCreated();
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Create a new AI agent to help automate your business processes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter agent name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Agent Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Agent['type'] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ceo">CEO - Strategic Leadership</SelectItem>
                <SelectItem value="sales">Sales - Revenue Generation</SelectItem>
                <SelectItem value="marketing">Marketing - Brand & Growth</SelectItem>
                <SelectItem value="operations">Operations - Process Management</SelectItem>
                <SelectItem value="analytics">Analytics - Data Insights</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this agent will do"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capabilities">Capabilities (comma-separated)</Label>
            <Input
              id="capabilities"
              value={formData.capabilities}
              onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
              placeholder="e.g., strategic planning, market analysis, reporting"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">Create Agent</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AgentCard = ({ agent }: { agent: Agent }) => {
  const { tasks } = useTasks(agent.id);
  const activeTasks = tasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <AgentTypeIcon type={agent.type} />
          <CardTitle className="text-lg">{agent.name}</CardTitle>
        </div>
        <AgentStatusBadge status={agent.status} />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{agent.description}</CardDescription>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Performance</span>
            <span>{agent.performance_metrics.success_rate}%</span>
          </div>
          <Progress value={agent.performance_metrics.success_rate} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{activeTasks} active</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{completedTasks} completed</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {capability}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground">
            Last active: {new Date(agent.last_active).toLocaleDateString()}
          </span>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TasksList = ({ tasks }: { tasks: Task[] }) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(task.status)}
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                <Badge variant="outline" className="capitalize">
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Created: {new Date(task.created_at).toLocaleDateString()}
              {task.completed_at && (
                <span className="ml-4">
                  Completed: {new Date(task.completed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalTasks: 0,
    completedTasks: 0,
    avgSuccessRate: 0
  });

  // Mock data - in production, this would come from the AIAgentService API
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: "ceo-001",
        name: "Strategic CEO Agent",
        type: "CEO Agent",
        status: "active",
        description: "Strategic planning, market analysis, and executive decision-making",
        tasksCompleted: 156,
        successRate: 94.2,
        avgResponseTime: 2.1,
        lastActive: "2 minutes ago",
        capabilities: ["Market Analysis", "Strategic Planning", "Competitive Intelligence", "Revenue Optimization"],
        currentTasks: 2,
        maxTasks: 5,
        utilizationRate: 40
      },
      {
        id: "sales-001", 
        name: "Sales Automation Agent",
        type: "Sales Agent",
        status: "busy",
        description: "Lead generation, qualification, and sales process automation",
        tasksCompleted: 289,
        successRate: 87.3,
        avgResponseTime: 1.8,
        lastActive: "Active now",
        capabilities: ["Lead Generation", "Email Sequences", "CRM Management", "Sales Analytics"],
        currentTasks: 4,
        maxTasks: 4,
        utilizationRate: 100
      },
      {
        id: "marketing-001",
        name: "Content Marketing Agent", 
        type: "Marketing Agent",
        status: "idle",
        description: "Content creation, social media management, and campaign optimization",
        tasksCompleted: 203,
        successRate: 91.7,
        avgResponseTime: 3.2,
        lastActive: "12 minutes ago",
        capabilities: ["Content Creation", "Social Media", "SEO Optimization", "Campaign Analytics"],
        currentTasks: 0,
        maxTasks: 3,
        utilizationRate: 0
      },
      {
        id: "ops-001",
        name: "Operations Agent",
        type: "Operations Agent", 
        status: "active",
        description: "Process automation, workflow optimization, and operational efficiency",
        tasksCompleted: 134,
        successRate: 96.1,
        avgResponseTime: 1.5,
        lastActive: "5 minutes ago",
        capabilities: ["Process Automation", "Workflow Management", "Quality Control", "Resource Optimization"],
        currentTasks: 1,
        maxTasks: 6,
        utilizationRate: 17
      },
      {
        id: "analytics-001",
        name: "Analytics Intelligence Agent",
        type: "Analytics Agent",
        status: "active", 
        description: "Data analysis, predictive modeling, and business intelligence",
        tasksCompleted: 178,
        successRate: 98.5,
        avgResponseTime: 4.7,
        lastActive: "1 minute ago",
        capabilities: ["Data Analysis", "Predictive Modeling", "Report Generation", "KPI Monitoring"],
        currentTasks: 3,
        maxTasks: 4,
        utilizationRate: 75
      }
    ];

    const mockTasks: Task[] = [
      {
        id: "task-001",
        title: "Q2 Market Analysis & Strategic Recommendations",
        type: "Strategic Analysis",
        status: "in_progress",
        priority: "high",
        progress: 78,
        agentName: "Strategic CEO Agent",
        dueDate: "2024-12-24",
        duration: 45
      },
      {
        id: "task-002", 
        title: "Lead Qualification Pipeline Optimization",
        type: "Sales Automation",
        status: "in_progress",
        priority: "urgent",
        progress: 92,
        agentName: "Sales Automation Agent",
        duration: 23
      },
      {
        id: "task-003",
        title: "Email Campaign Performance Analysis",
        type: "Marketing Analysis", 
        status: "completed",
        priority: "medium",
        progress: 100,
        agentName: "Content Marketing Agent",
        duration: 18
      },
      {
        id: "task-004",
        title: "Customer Churn Prediction Model",
        type: "Predictive Analytics",
        status: "in_progress", 
        priority: "high",
        progress: 45,
        agentName: "Analytics Intelligence Agent",
        dueDate: "2024-12-25"
      },
      {
        id: "task-005",
        title: "Workflow Automation Setup",
        type: "Process Optimization",
        status: "pending",
        priority: "medium", 
        progress: 0,
        agentName: "Operations Agent"
      }
    ];

    setAgents(mockAgents);
    setTasks(mockTasks);
    setStats({
      totalAgents: mockAgents.length,
      activeAgents: mockAgents.filter(a => a.status === 'active' || a.status === 'busy').length,
      totalTasks: mockTasks.length,
      completedTasks: mockTasks.filter(t => t.status === 'completed').length,
      avgSuccessRate: mockAgents.reduce((sum, a) => sum + a.successRate, 0) / mockAgents.length
    });
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500 text-white",
      busy: "bg-blue-500 text-white", 
      idle: "bg-gray-500 text-white",
      offline: "bg-red-500 text-white"
    };
    return <Badge className={styles[status] || "bg-gray-500 text-white"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      urgent: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-blue-500 text-white", 
      low: "bg-gray-500 text-white"
    };
    return <Badge className={styles[priority] || "bg-gray-500 text-white"}>{priority}</Badge>;
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'CEO Agent': return <TrendingUp className="h-5 w-5" />;
      case 'Sales Agent': return <Users className="h-5 w-5" />;
      case 'Marketing Agent': return <Zap className="h-5 w-5" />;
      case 'Operations Agent': return <Cog className="h-5 w-5" />;
      case 'Analytics Agent': return <BarChart3 className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">{stats.activeAgents} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks - stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">{stats.completedTasks} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average across all agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.4K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getAgentIcon(agent.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(agent.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Tasks Completed</div>
                        <div className="font-semibold">{agent.tasksCompleted}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Success Rate</div>
                        <div className="font-semibold">{agent.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Response</div>
                        <div className="font-semibold">{agent.avgResponseTime}s</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Active</div>
                        <div className="font-semibold">{agent.lastActive}</div>
                      </div>
                    </div>

                    {/* Workload */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Workload ({agent.currentTasks}/{agent.maxTasks})</span>
                        <span>{agent.utilizationRate}%</span>
                      </div>
                      <Progress value={agent.utilizationRate} className="h-2" />
                    </div>

                    {/* Capabilities */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Capabilities</div>
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getTaskStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{task.agentName}</span>
                          <span>•</span>
                          <span>{task.type}</span>
                          {task.dueDate && (
                            <>
                              <span>•</span>
                              <span>Due {task.dueDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(task.priority)}
                      <div className="text-right">
                        <div className="text-sm font-semibold">{task.progress}%</div>
                        {task.duration && (
                          <div className="text-xs text-muted-foreground">{task.duration}m</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {task.status === 'in_progress' && (
                    <div className="mt-3">
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAgentIcon(agent.type)}
                        <span className="text-sm font-medium">{agent.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">{agent.successRate}%</div>
                        <Progress value={agent.successRate} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAgentIcon(agent.type)}
                        <span className="text-sm font-medium">{agent.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">{agent.currentTasks}/{agent.maxTasks}</div>
                        <Progress value={agent.utilizationRate} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

