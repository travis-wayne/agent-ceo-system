"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteConfirmation, useDeleteConfirmation } from "@/components/ui/delete-confirmation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import our reusable components
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressMetric } from "@/components/ui/progress-metric";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";

import {
  Brain,
  Activity,
  Target,
  TrendingUp,
  CheckCircle,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Star,
  Users,
  DollarSign,
  FileText,
  Plus,
  Edit,
  Eye,
  Cpu,
  Database,
  BarChart3,
  Settings,
  RefreshCw,
  Trash2,
  Copy,
  Download,
  Upload,
  Save,
  Loader2,
  Rocket,
  Filter,
} from "lucide-react";

import { useAgent } from "@/lib/agents/agent-context";

// Helper functions
function getAgentEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    ceo: '🧠',
    sales: '💼',
    marketing: '🎨',
    operations: '⚙️',
    analytics: '📊'
  };
  return emojiMap[type] || '🤖';
}

function getAgentCapabilities(type: string): string[] {
  const capabilitiesMap: Record<string, string[]> = {
    ceo: [
      "Strategic Planning & Roadmapping",
      "Market Analysis & Competitive Intelligence", 
      "Business Model Innovation",
      "Investment & Growth Strategy",
      "Board & Stakeholder Communications"
    ],
    sales: [
      "Lead Generation & Qualification",
      "Sales Process Optimization",
      "Customer Acquisition Strategy",
      "Revenue Forecasting & Analytics",
      "CRM Management & Automation"
    ],
    marketing: [
      "Content Strategy & Creation",
      "Brand Positioning & Messaging",
      "Digital Marketing Campaigns",
      "Social Media Management",
      "Marketing Analytics & ROI"
    ],
    operations: [
      "Process Automation & Optimization",
      "Quality Management Systems",
      "Resource Allocation & Planning",
      "Cost Reduction Strategies",
      "Operational Risk Management"
    ],
    analytics: [
      "Data Processing & Analysis",
      "Business Intelligence Reporting",
      "Predictive Analytics",
      "Performance Metrics Tracking",
      "Trend Analysis & Forecasting"
    ]
  };
  return capabilitiesMap[type] || [];
}

export default function AgentManagementPage() {
  const { agents, isLoading, refreshAgents, setSelectedAgent, updateAgent, deleteAgent } = useAgent();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfigureAllOpen, setIsConfigureAllOpen] = useState(false);
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<any>(null);
  
  // Delete confirmation hook
  const { isOpen: isDeleteOpen, confirmDelete, closeDelete, deleteConfig } = useDeleteConfirmation();

  // Handler functions
  const handleDeployAgent = () => {
    // Redirect to the dedicated agent creation page
    window.location.href = '/dashboard/ceo/agents/new';
  };

  const handleConfigureAll = () => {
    setIsConfigureAllOpen(true);
  };

  const handleViewDetails = (agent: any) => {
    setSelectedAgentForModal(agent);
    setSelectedAgent(agents.find(a => a.id === agent.id) || null);
    setIsDetailsModalOpen(true);
  };

  const handleEditAgent = (agent: any) => {
    setSelectedAgent(agents.find(a => a.id === agent.id) || null);
    window.location.href = `/dashboard/ceo/agents/edit/${agent.id}`;
  };

  const handleDuplicateAgent = (agent: any) => {
    toast.success(`${agent.name} configuration copied to clipboard`);
  };

  const handleExportAgent = (agent: any) => {
    toast.success(`${agent.name} configuration exported`);
  };

  const handleDeleteAgent = (agent: any) => {
    confirmDelete({
      title: "Delete Agent",
      description: "Are you sure you want to delete this agent? This action cannot be undone and will permanently remove all associated data.",
      itemName: agent.name,
      itemType: "AI Agent",
      confirmText: "Delete Agent",
      variant: "danger",
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfig.itemName) {
      const agent = agents.find(a => a.name === deleteConfig.itemName);
      if (agent) {
        await deleteAgent(agent.id);
      }
    }
  };

  const handleRestartAgent = async (agent: any) => {
    const contextAgent = agents.find(a => a.id === agent.id);
    if (contextAgent) {
      await updateAgent(contextAgent.id, { status: 'active' });
      toast.success(`${agent.name} restarted successfully`);
    }
  };

  const handlePauseAgent = async (agent: any) => {
    const contextAgent = agents.find(a => a.id === agent.id);
    if (contextAgent) {
      await updateAgent(contextAgent.id, { status: 'inactive' });
      toast.success(`${agent.name} paused successfully`);
    }
  };

  const handleResumeAgent = async (agent: any) => {
    const contextAgent = agents.find(a => a.id === agent.id);
    if (contextAgent) {
      await updateAgent(contextAgent.id, { status: 'active' });
      toast.success(`${agent.name} resumed successfully`);
    }
  };

  const handleViewLogs = (agent: any) => {
    toast.info(`Viewing logs for ${agent.name}`);
  };

  const handleViewAnalytics = (agent: any) => {
    toast.info(`Viewing analytics for ${agent.name}`);
  };

  // Create breadcrumbs
  const breadcrumbs = useMemo(() => [
    { label: "CEO Dashboard", href: "/dashboard/ceo" },
    { label: "AI Agents" }
  ], []);

  // Create header actions using useMemo to ensure client-side creation
  const headerActions = useMemo(() => [
    {
      label: "Filters",
      onClick: () => {},
      icon: Filter,
      variant: "outline" as const
    },
    {
      label: "Configure All",
      onClick: handleConfigureAll,
      icon: Settings,
      variant: "outline" as const
    },
    {
      label: "Deploy Agent",
      onClick: handleDeployAgent,
      icon: Plus,
      variant: "default" as const
    }
  ], [handleConfigureAll, handleDeployAgent]);

  // Transform agents from context to match the expected format for the UI
  const aiAgents = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    avatar: agent.avatar,
    status: agent.status,
    description: agent.description,
    capabilities: agent.capabilities,
    currentTasks: Math.floor(Math.random() * 20) + 5, // Random current tasks for demo
    completedTasks: agent.performance.tasksCompleted,
    successRate: agent.performance.successRate,
    avgResponseTime: `${agent.performance.avgResponseTime} hours`,
    costPerHour: agent.performance.costPerHour,
    totalRevenue: agent.performance.revenueGenerated,
    efficiency: agent.performance.efficiency,
    utilizationRate: agent.performance.utilizationRate,
    specialties: agent.specialties,
    recentActivity: agent.recentTasks.map(task => ({
      action: task.name,
      timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
      type: task.completion === 100 ? "completion" : "start"
    })),
    metrics: {
      tasksThisWeek: Math.floor(Math.random() * 20) + 5,
      avgBusinessImpact: agent.performance.businessImpact,
      clientSatisfaction: agent.performance.clientSatisfaction,
      knowledgeBase: Math.floor(Math.random() * 3000) + 1000
    }
  }));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion": return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "start": return <Play className="h-3 w-3 text-blue-500" />;
      case "update": return <RefreshCw className="h-3 w-3 text-orange-500" />;
      case "optimization": return <Zap className="h-3 w-3 text-purple-500" />;
      case "launch": return <Rocket className="h-3 w-3 text-pink-500" />;
      case "creation": return <Plus className="h-3 w-3 text-indigo-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  // Overall statistics
  const overallStats = {
    totalAgents: aiAgents.length,
    activeAgents: aiAgents.filter(a => a.status === 'active').length,
    totalTasks: aiAgents.reduce((sum, agent) => sum + agent.currentTasks, 0),
    avgSuccessRate: aiAgents.reduce((sum, agent) => sum + agent.successRate, 0) / aiAgents.length,
    totalRevenue: aiAgents.reduce((sum, agent) => sum + agent.totalRevenue, 0),
    avgEfficiency: aiAgents.reduce((sum, agent) => sum + agent.efficiency, 0) / aiAgents.length,
  };

  // Prepare stat cards data
  const statCards = [
    {
      title: "Total Agents",
      value: overallStats.totalAgents.toString(),
      icon: Cpu,
    },
    {
      title: "Active Now",
      value: overallStats.activeAgents.toString(),
      icon: Activity,
    },
    {
      title: "Active Tasks",
      value: overallStats.totalTasks.toString(),
      icon: Target,
    },
    {
      title: "Avg Success Rate",
      value: `${overallStats.avgSuccessRate.toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      title: "Total Revenue",
      value: `$${(overallStats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
    },
    {
      title: "Avg Efficiency",
      value: `${overallStats.avgEfficiency.toFixed(0)}%`,
      icon: Zap,
    },
  ];

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {aiAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/10 to-primary/20">
                        {agent.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription className="text-sm">{agent.description}</CardDescription>
                    </div>
                  </div>
                  <StatusBadge 
                    status={agent.status as any} 
                    size="sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{agent.currentTasks}</p>
                    <p className="text-xs text-muted-foreground">Active Tasks</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{agent.successRate}%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <ProgressMetric
                    label="Efficiency"
                    value={agent.efficiency}
                    progress={agent.efficiency}
                    unit="%"
                    variant={agent.efficiency >= 80 ? 'success' : agent.efficiency >= 60 ? 'warning' : 'danger'}
                  />
                  <ProgressMetric
                    label="Utilization"
                    value={agent.utilizationRate}
                    progress={agent.utilizationRate}
                    unit="%"
                    variant={agent.utilizationRate >= 80 ? 'success' : agent.utilizationRate >= 60 ? 'warning' : 'danger'}
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Response:</span>
                    <span className="font-medium">{agent.avgResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cost/Hour:</span>
                    <span className="font-medium">${agent.costPerHour}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-medium">${(agent.totalRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium">{agent.completedTasks}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Specialties:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {agent.specialties.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{agent.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleViewDetails(agent)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Configuration
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateAgent(agent)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportAgent(agent)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Configuration
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewLogs(agent)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewAnalytics(agent)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRestartAgent(agent)}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restart Agent
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => agent.status === 'active' ? handlePauseAgent(agent) : handleResumeAgent(agent)}
                        className={agent.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                      >
                        {agent.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Agent
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume Agent
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteAgent(agent)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Agent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Page Header */}
        <PageHeaderWithActions
          title="AI Agent Management"
          description="Monitor, configure, and optimize your AI agents for maximum business impact"
          breadcrumbs={breadcrumbs}
          actions={headerActions}
          className="mb-6"
        />

        {/* Overall Statistics */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Agent Grid */}
        <TabbedContentLayout
          tabs={tabs}
          defaultTab="overview"
          className="space-y-4 sm:space-y-6"
        />

        {/* Quick Actions */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common management tasks and optimizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-16 flex-col">
                <RefreshCw className="h-5 w-5 mb-2" />
                <span>Restart All Agents</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Database className="h-5 w-5 mb-2" />
                <span>Update Knowledge Base</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span>Generate Report</span>
              </Button>
              <Link href="/dashboard/ceo/agents/new">
                <Button className="h-16 flex-col w-full">
                  <Plus className="h-5 w-5 mb-2" />
                  <span>Deploy Agent</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Agent Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-lg">{selectedAgentForModal?.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedAgentForModal?.name}</div>
                <div className="text-sm font-normal text-muted-foreground">{selectedAgentForModal?.description}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedAgentForModal && (
            <div className="space-y-6">
              {/* Status and Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{selectedAgentForModal.currentTasks}</p>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedAgentForModal.successRate}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedAgentForModal.efficiency}%</p>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">${selectedAgentForModal.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="font-medium mb-3">Core Capabilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedAgentForModal.capabilities.map((capability: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Efficiency</span>
                        <span className="font-medium">{selectedAgentForModal.efficiency}%</span>
                      </div>
                      <Progress value={selectedAgentForModal.efficiency} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Utilization Rate</span>
                        <span className="font-medium">{selectedAgentForModal.utilizationRate}%</span>
                      </div>
                      <Progress value={selectedAgentForModal.utilizationRate} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span className="font-medium">{selectedAgentForModal.successRate}%</span>
                      </div>
                      <Progress value={selectedAgentForModal.successRate} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Financial Metrics</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-medium">${selectedAgentForModal.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost per Hour:</span>
                      <span className="font-medium">${selectedAgentForModal.costPerHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Tasks:</span>
                      <span className="font-medium">{selectedAgentForModal.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time:</span>
                      <span className="font-medium">{selectedAgentForModal.avgResponseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="font-medium text-green-600">
                        {((selectedAgentForModal.totalRevenue / (selectedAgentForModal.costPerHour * selectedAgentForModal.completedTasks * 5)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {selectedAgentForModal.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-medium mb-3">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgentForModal.specialties.map((specialty: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure All Modal */}
      <Dialog open={isConfigureAllOpen} onOpenChange={setIsConfigureAllOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure All Agents
            </DialogTitle>
            <DialogDescription>
              Apply bulk configuration changes to all agents in your workspace.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Global Settings */}
            <div>
              <h4 className="font-medium mb-3">Global Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Priority Level</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Auto-scaling</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Performance Thresholds */}
            <div>
              <h4 className="font-medium mb-3">Performance Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Min Success Rate (%)</Label>
                  <Input type="number" defaultValue="85" min="0" max="100" />
                </div>
                <div className="space-y-2">
                  <Label>Max Response Time (hours)</Label>
                  <Input type="number" defaultValue="24" min="1" />
                </div>
                <div className="space-y-2">
                  <Label>Min Efficiency (%)</Label>
                  <Input type="number" defaultValue="80" min="0" max="100" />
                </div>
              </div>
            </div>

            {/* Agent Selection */}
            <div>
              <h4 className="font-medium mb-3">Apply to Agents</h4>
              <div className="space-y-2">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <input type="checkbox" id={agent.id} defaultChecked />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-sm">{agent.avatar}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor={agent.id} className="flex-1 cursor-pointer">
                      {agent.name}
                    </Label>
                    <StatusBadge 
                      status={agent.status as any} 
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigureAllOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Apply Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        {...deleteConfig}
      />
    </>
  );
} 