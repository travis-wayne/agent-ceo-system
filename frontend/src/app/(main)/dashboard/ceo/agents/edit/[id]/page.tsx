"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressMetric } from "@/components/ui/progress-metric";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";
import { DeleteConfirmation, useDeleteConfirmation } from "@/components/ui/delete-confirmation";
import { useAgent } from "@/lib/agents/agent-context";
import Link from "next/link";
import { toast } from "sonner";
import {
  Brain,
  Briefcase,
  Palette,
  Settings,
  BarChart3,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  Power,
  Edit3,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  DollarSign,
  Users,
  Zap,
  Star,
  Eye,
  ArrowLeft,
  RefreshCw,
  Download,
  Calendar,
  Award,
  Shield
} from "lucide-react";

// Agent type configurations (matching the ones from creation)
const AGENT_TYPES = {
  ceo: {
    name: 'CEO Agent',
    emoji: '🧠',
    icon: Brain,
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    specializations: [
      "Strategic Decision Making",
      "Market Research", 
      "Business Development",
      "Competitive Analysis",
      "Investment Planning"
    ]
  },
  sales: {
    name: 'Sales Agent',
    emoji: '💼',
    icon: Briefcase,
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    specializations: [
      "Pipeline Management",
      "Conversion Optimization",
      "Customer Outreach",
      "Lead Qualification",
      "Sales Analytics"
    ]
  },
  marketing: {
    name: 'Marketing Agent',
    emoji: '🎨',
    icon: Palette,
    models: ["Claude-3 Opus", "GPT-4 Turbo", "GPT-4"],
    specializations: [
      "Brand Building",
      "Content Marketing",
      "Campaign Management",
      "Social Media",
      "SEO Optimization"
    ]
  },
  operations: {
    name: 'Operations Agent',
    emoji: '⚙️',
    icon: Settings,
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    specializations: [
      "Process Improvement",
      "Automation",
      "Efficiency Optimization",
      "Quality Control",
      "Resource Management"
    ]
  },
  analytics: {
    name: 'Analytics Agent',
    emoji: '📊',
    icon: BarChart3,
    models: ["Claude-3 Opus", "GPT-4 Turbo", "GPT-4"],
    specializations: [
      "Data Analysis",
      "Predictive Modeling",
      "Business Intelligence",
      "Data Visualization",
      "Statistical Analysis"
    ]
  }
};

interface AgentFormData {
  name: string;
  specialization: string;
  model: string;
  avatar: string;
  maxConcurrentTasks: number;
  status: string;
}

export default function EditAgentPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.id as string;
  const { getAgentById, updateAgent, deleteAgent, getAgentChats, setSelectedAgent } = useAgent();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    specialization: '',
    model: '',
    avatar: '',
    maxConcurrentTasks: 3,
    status: 'active'
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { isOpen: isDeleteOpen, confirmDelete, closeDelete, deleteConfig } = useDeleteConfirmation();

  // Load agent data
  useEffect(() => {
    const loadAgent = () => {
      const agentData = getAgentById(agentId);
      if (agentData) {
        setAgent(agentData);
        setSelectedAgent(agentData);
        setFormData({
          name: agentData.name,
          specialization: agentData.specialties[0] || '',
          model: agentData.model,
          avatar: agentData.avatar,
          maxConcurrentTasks: agentData.maxConcurrentTasks,
          status: agentData.status
        });
        setIsLoading(false);
      } else {
        toast.error('Agent not found');
        router.push('/dashboard/ceo/agents');
      }
    };

    if (agentId) {
      loadAgent();
    }
  }, [agentId, getAgentById, router, setSelectedAgent]);

  // Validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Agent name is required");
    if (formData.name.length < 2) errors.push("Agent name must be at least 2 characters");
    if (formData.name.length > 100) errors.push("Agent name must be less than 100 characters");
    if (!formData.specialization.trim()) errors.push("Specialization is required");
    if (!formData.model) errors.push("AI model selection is required");
    if (formData.maxConcurrentTasks < 1 || formData.maxConcurrentTasks > 20) {
      errors.push("Max concurrent tasks must be between 1 and 20");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const success = await updateAgent(agentId, {
        name: formData.name,
        specialties: [formData.specialization],
        model: formData.model,
        avatar: formData.avatar,
        maxConcurrentTasks: formData.maxConcurrentTasks,
        status: formData.status as any
      });

      if (success) {
        router.push('/dashboard/ceo/agents');
      }
    } catch (error) {
      toast.error('Failed to update agent');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    try {
      const success = await updateAgent(agentId, { status: newStatus as any });
      if (success) {
        setFormData(prev => ({ ...prev, status: newStatus }));
        setAgent((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update agent status');
    }
  };

  // Handle delete
  const handleDelete = () => {
    confirmDelete({
      title: "Delete Agent",
      description: "Are you sure you want to delete this agent? This action cannot be undone and will permanently remove all associated data including chat history.",
      itemName: agent?.name || "this agent",
      itemType: "AI Agent",
      confirmText: "Delete Agent",
      variant: "danger",
    });
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteAgent(agentId);
    if (success) {
      router.push('/dashboard/ceo/agents');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600";
      case "maintenance": return "text-yellow-600";
      case "inactive": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (direction: string) => {
    if (direction === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (direction === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (direction: string) => {
    if (direction === "up") return "text-green-600";
    if (direction === "down") return "text-red-600";
    return "text-gray-600";
  };

  // Get agent type info
  const agentTypeKey = agent?.type?.toLowerCase().replace(/\s+/g, '_').replace('&', '').replace('intelligence', '').replace('generation', '').replace('content', '').trim();
  const agentType = AGENT_TYPES[agentTypeKey as keyof typeof AGENT_TYPES] || AGENT_TYPES.ceo;

  // Create breadcrumbs
  const breadcrumbs = [
    { label: "CEO Dashboard", href: "/dashboard/ceo" },
    { label: "AI Agents", href: "/dashboard/ceo/agents" },
    { label: `Edit ${agent?.name || 'Agent'}` }
  ];

  // Create header actions
  const headerActions = [
    {
      label: "View Analytics",
      onClick: () => router.push(`/dashboard/ceo/agents/analytics`),
      icon: BarChart3,
      variant: "outline" as const
    },
    {
      label: "Start Chat",
      onClick: () => router.push(`/dashboard/ceo/chat?agent=${agentId}`),
      icon: MessageSquare,
      variant: "outline" as const
    },
    {
      label: "Delete Agent",
      onClick: handleDelete,
      icon: Trash2,
      variant: "destructive" as const
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading agent...</span>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Agent Not Found</h3>
          <p className="text-muted-foreground mb-4">The agent you're looking for doesn't exist.</p>
          <Link href="/dashboard/ceo/agents">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prepare performance stat cards
  const performanceStats = [
    {
      title: "Success Rate",
      value: `${agent.performance.successRate}%`,
      icon: Target,
      trend: { value: Math.abs(agent.trends.successRate.value), isPositive: agent.trends.successRate.direction === 'up', period: "vs last month" }
    },
    {
      title: "Efficiency",
      value: `${agent.performance.efficiency}%`,
      icon: Zap,
      trend: { value: Math.abs(agent.trends.efficiency.value), isPositive: agent.trends.efficiency.direction === 'up', period: "vs last month" }
    },
    {
      title: "Tasks Completed",
      value: agent.performance.tasksCompleted.toString(),
      icon: CheckCircle,
    },
    {
      title: "Business Impact",
      value: `${agent.performance.businessImpact}/10`,
      icon: TrendingUp,
      trend: { value: Math.abs(agent.trends.businessImpact.value), isPositive: agent.trends.businessImpact.direction === 'up', period: "vs last month" }
    },
    {
      title: "Revenue Generated",
      value: `$${(agent.performance.revenueGenerated / 1000).toFixed(0)}K`,
      icon: DollarSign,
    },
    {
      title: "Avg Response Time",
      value: `${agent.performance.avgResponseTime}h`,
      icon: Clock,
      trend: { value: Math.abs(agent.trends.responseTime.value), isPositive: agent.trends.responseTime.direction === 'down', period: "vs last month" }
    }
  ];

  // Create tabs for different sections
  const tabs = [
    {
      id: "configuration",
      label: "Configuration",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Configure the agent's basic settings and capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter agent name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Primary Specialization</Label>
                  <Select value={formData.specialization} onValueChange={(value) => setFormData({ ...formData, specialization: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentType.specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentType.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTasks">Max Concurrent Tasks</Label>
                  <Input
                    id="maxTasks"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxConcurrentTasks}
                    onChange={(e) => setFormData({ ...formData, maxConcurrentTasks: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="Enter emoji avatar"
                  />
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Link href="/dashboard/ceo/agents">
                  <Button variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/ceo/chat?agent=${agentId}`}>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Test Chat
                    </Button>
                  </Link>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
              <CardDescription>Core capabilities and specializations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Core Capabilities</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {agent.capabilities.map((capability: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Specializations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {agent.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "performance",
      label: "Performance",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {performanceStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Detailed Metrics */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Current performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressMetric
                  label="Success Rate"
                  value={agent.performance.successRate}
                  progress={agent.performance.successRate}
                  unit="%"
                  variant={agent.performance.successRate >= 90 ? 'success' : agent.performance.successRate >= 75 ? 'warning' : 'danger'}
                />
                <ProgressMetric
                  label="Efficiency"
                  value={agent.performance.efficiency}
                  progress={agent.performance.efficiency}
                  unit="%"
                  variant={agent.performance.efficiency >= 90 ? 'success' : agent.performance.efficiency >= 75 ? 'warning' : 'danger'}
                />
                <ProgressMetric
                  label="Utilization Rate"
                  value={agent.performance.utilizationRate}
                  progress={agent.performance.utilizationRate}
                  unit="%"
                  variant={agent.performance.utilizationRate >= 80 ? 'success' : agent.performance.utilizationRate >= 60 ? 'warning' : 'danger'}
                />
                <ProgressMetric
                  label="Quality Score"
                  value={agent.performance.qualityScore}
                  progress={agent.performance.qualityScore * 10}
                  unit="/10"
                  variant={agent.performance.qualityScore >= 8 ? 'success' : agent.performance.qualityScore >= 6 ? 'warning' : 'danger'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Trends</CardTitle>
                <CardDescription>Performance changes over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate:</span>
                    <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.successRate.direction)}`}>
                      {getTrendIcon(agent.trends.successRate.direction)}
                      <span className="font-medium">{Math.abs(agent.trends.successRate.value)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Efficiency:</span>
                    <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.efficiency.direction)}`}>
                      {getTrendIcon(agent.trends.efficiency.direction)}
                      <span className="font-medium">{Math.abs(agent.trends.efficiency.value)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Business Impact:</span>
                    <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.businessImpact.direction)}`}>
                      {getTrendIcon(agent.trends.businessImpact.direction)}
                      <span className="font-medium">{Math.abs(agent.trends.businessImpact.value)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time:</span>
                    <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.responseTime.direction)}`}>
                      {getTrendIcon(agent.trends.responseTime.direction)}
                      <span className="font-medium">{Math.abs(agent.trends.responseTime.value)}h</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Link href="/dashboard/ceo/agents/analytics" className="block">
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest completed and ongoing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agent.recentTasks.map((task: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {task.duration}h • Impact: {task.impact}/10
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.completion === 100 ? "default" : "secondary"}>
                        {task.completion}%
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(task.impact)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "chat_history",
      label: "Chat History",
      icon: MessageSquare,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Chat history and interactions with this agent</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const agentChats = getAgentChats(agentId);
                
                if (agentChats.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Conversations Yet</h3>
                      <p className="text-muted-foreground mb-4">Start a conversation with this agent to see chat history here.</p>
                      <Link href={`/dashboard/ceo/chat?agent=${agentId}`}>
                        <Button>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Start Chat
                        </Button>
                      </Link>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {agentChats.map((chat) => (
                      <div key={chat.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{chat.title}</h4>
                          <Badge variant="secondary">{chat.messages.length} messages</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Last updated: {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                        {chat.messages.length > 0 && (
                          <div className="text-sm bg-muted/30 p-2 rounded">
                            <span className="font-medium">Last message:</span> {chat.messages[chat.messages.length - 1].content.substring(0, 100)}...
                          </div>
                        )}
                        <div className="flex justify-end mt-3">
                          <Link href={`/dashboard/ceo/chat?agent=${agentId}&chat=${chat.id}`}>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Continue Chat
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <Link href={`/dashboard/ceo/chat?agent=${agentId}`} className="block">
                        <Button className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Start New Conversation
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
      {/* Page Header */}
      <PageHeaderWithActions
        title={`Edit ${agent.name}`}
        description={`Configure and manage your ${agent.type} agent`}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
        icon={Edit3}
        className="mb-6"
      />

      {/* Agent Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{agent.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold">{agent.name}</h2>
                <p className="text-muted-foreground">{agent.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{agent.type}</Badge>
                  <Badge variant="outline">{agent.model}</Badge>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{agent.performance.tasksCompleted}</p>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(agent.performance.clientSatisfaction)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Client Rating</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <TabbedContentLayout
        tabs={tabs}
        defaultTab="configuration"
        className="space-y-4 sm:space-y-6"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        {...deleteConfig}
      />
    </main>
  );
} 