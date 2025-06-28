// Agent Management Dashboard Component
// /src/components/agent-management/agent-dashboard.tsx

'use client';

import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

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

export default function AgentDashboard() {
  const { agents, loading, error, refetch } = useAgents();
  const { tasks } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bot className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
          <Button onClick={refetch} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const activeTasks = tasks.filter(task => task.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agent Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents
          </p>
        </div>
        <CreateAgentDialog onAgentCreated={refetch} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAgents} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Total completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {agents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No agents yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first AI agent to get started
                </p>
                <CreateAgentDialog onAgentCreated={refetch} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-muted-foreground">
                  Tasks will appear here when agents start working
                </p>
              </CardContent>
            </Card>
          ) : (
            <TasksList tasks={tasks} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

