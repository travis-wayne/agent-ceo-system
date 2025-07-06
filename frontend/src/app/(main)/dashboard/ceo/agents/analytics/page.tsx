"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressMetric } from "@/components/ui/progress-metric";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";
import { useAgent } from "@/lib/agents/agent-context";
import Link from "next/link";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  DollarSign,
  Users,
  Zap,
  Brain,
  AlertCircle,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Cpu,
  Database,
  Globe,
  MessageSquare,
  Award,
  Shield,
  Lightbulb,
  FileText,
  Edit,
  Eye,
  Settings,
  Rocket,
  Plus
} from "lucide-react";

export default function AgentAnalyticsPage() {
  const { agents, isLoading, refreshAgents, setSelectedAgent } = useAgent();
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");

  // Calculate overall statistics
  const overallStats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    totalTasks: agents.reduce((sum, agent) => sum + agent.performance.tasksCompleted, 0),
    avgSuccessRate: agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length,
    totalRevenue: agents.reduce((sum, agent) => sum + agent.performance.revenueGenerated, 0),
    avgEfficiency: agents.reduce((sum, agent) => sum + agent.performance.efficiency, 0) / agents.length,
    totalCostSavings: 47500,
    avgResponseTime: agents.reduce((sum, agent) => sum + agent.performance.avgResponseTime, 0) / agents.length
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "maintenance": return "bg-yellow-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const handleAgentAction = (agentId: string, action: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setSelectedAgent(agent);
    
    switch (action) {
      case 'edit':
        window.location.href = `/dashboard/ceo/agents/edit/${agentId}`;
        break;
      case 'chat':
        window.location.href = `/dashboard/ceo/chat?agent=${agentId}`;
        break;
      case 'view':
        toast.info(`Viewing detailed analytics for ${agent.name}`);
        break;
      default:
        break;
    }
  };

  // Create breadcrumbs
  const breadcrumbs = [
    { label: "CEO Dashboard", href: "/dashboard/ceo" },
    { label: "AI Agents", href: "/dashboard/ceo/agents" },
    { label: "Analytics" }
  ];

  // Create header actions
  const headerActions = [
    {
      label: "Filters",
      onClick: () => {},
      icon: Filter,
      variant: "outline" as const
    },
    {
      label: "Export Report",
      onClick: () => toast.success("Analytics report exported"),
      icon: Download,
      variant: "outline" as const
    },
    {
      label: "Refresh Data",
      onClick: refreshAgents,
      icon: RefreshCw,
      variant: "outline" as const
    }
  ];

  // Prepare stat cards
  const statCards = [
    {
      title: "Total Agents",
      value: overallStats.totalAgents.toString(),
      icon: Cpu,
      trend: { value: 12.5, isPositive: true, period: "vs last month" }
    },
    {
      title: "Active Agents",
      value: overallStats.activeAgents.toString(),
      icon: Activity,
      trend: { value: 8.3, isPositive: true, period: "vs last week" }
    },
    {
      title: "Tasks Completed",
      value: overallStats.totalTasks.toString(),
      icon: Target,
      trend: { value: 15.7, isPositive: true, period: "vs last month" }
    },
    {
      title: "Avg Success Rate",
      value: `${overallStats.avgSuccessRate.toFixed(1)}%`,
      icon: TrendingUp,
      trend: { value: 2.1, isPositive: true, period: "vs last month" }
    },
    {
      title: "Total Revenue",
      value: `$${(overallStats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      trend: { value: 18.9, isPositive: true, period: "vs last month" }
    },
    {
      title: "Avg Efficiency",
      value: `${overallStats.avgEfficiency.toFixed(1)}%`,
      icon: Zap,
      trend: { value: 3.4, isPositive: true, period: "vs last month" }
    }
  ];

  // Create tabs for different analytics views
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          {/* Agent Performance Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{agent.avatar}</div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.type}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={agent.status} size="sm" />
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'chat')}
                          title="Chat with Agent"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'edit')}
                          title="Edit Agent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'view')}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xl font-bold text-primary">{agent.performance.tasksCompleted}</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">{agent.performance.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Success</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{agent.performance.efficiency}%</p>
                      <p className="text-xs text-muted-foreground">Efficiency</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3">
                    <ProgressMetric
                      label="Success Rate"
                      value={agent.performance.successRate}
                      progress={agent.performance.successRate}
                      unit="%"
                      variant={agent.performance.successRate >= 90 ? 'success' : agent.performance.successRate >= 75 ? 'warning' : 'danger'}
                      size="sm"
                    />
                    <ProgressMetric
                      label="Efficiency"
                      value={agent.performance.efficiency}
                      progress={agent.performance.efficiency}
                      unit="%"
                      variant={agent.performance.efficiency >= 90 ? 'success' : agent.performance.efficiency >= 75 ? 'warning' : 'danger'}
                      size="sm"
                    />
                    <ProgressMetric
                      label="Utilization"
                      value={agent.performance.utilizationRate}
                      progress={agent.performance.utilizationRate}
                      unit="%"
                      variant={agent.performance.utilizationRate >= 80 ? 'success' : agent.performance.utilizationRate >= 60 ? 'warning' : 'danger'}
                      size="sm"
                    />
                  </div>

                  {/* Trends */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.successRate.direction)}`}>
                        {getTrendIcon(agent.trends.successRate.direction)}
                        <span className="font-medium">{Math.abs(agent.trends.successRate.value)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Efficiency:</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.efficiency.direction)}`}>
                        {getTrendIcon(agent.trends.efficiency.direction)}
                        <span className="font-medium">{Math.abs(agent.trends.efficiency.value)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Impact:</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.businessImpact.direction)}`}>
                        {getTrendIcon(agent.trends.businessImpact.direction)}
                        <span className="font-medium">{Math.abs(agent.trends.businessImpact.value)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response:</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(agent.trends.responseTime.direction)}`}>
                        {getTrendIcon(agent.trends.responseTime.direction)}
                        <span className="font-medium">{Math.abs(agent.trends.responseTime.value)}h</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Tasks */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Recent Tasks</h4>
                    <div className="space-y-2">
                      {agent.recentTasks.slice(0, 2).map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span className="text-sm truncate">{task.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant={task.completion === 100 ? "default" : "secondary"} className="text-xs">
                              {task.completion}%
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {task.impact}/10
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-2 border-t">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/ceo/chat?agent=${agent.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                      <Link href={`/dashboard/ceo/agents/edit/${agent.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{agent.avatar}</div>
                      <div>
                        <CardTitle className="text-xl">{agent.name}</CardTitle>
                        <CardDescription>{agent.type}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{agent.performance.tasksCompleted}</p>
                        <p className="text-xs text-muted-foreground">Total Tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{agent.performance.businessImpact}</p>
                        <p className="text-xs text-muted-foreground">Impact Score</p>
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
                      <Link href={`/dashboard/ceo/agents/edit/${agent.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
                    <div className="space-y-4">
                      <h4 className="font-medium">Task Performance</h4>
                      <div className="space-y-3">
                        <ProgressMetric
                          label="Success Rate"
                          value={agent.performance.successRate}
                          progress={agent.performance.successRate}
                          unit="%"
                          size="sm"
                        />
                        <ProgressMetric
                          label="Efficiency"
                          value={agent.performance.efficiency}
                          progress={agent.performance.efficiency}
                          unit="%"
                          size="sm"
                        />
                        <ProgressMetric
                          label="Quality Score"
                          value={agent.performance.qualityScore}
                          progress={agent.performance.qualityScore * 10}
                          unit="/10"
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Resource Utilization</h4>
                      <div className="space-y-3">
                        <ProgressMetric
                          label="Utilization Rate"
                          value={agent.performance.utilizationRate}
                          progress={agent.performance.utilizationRate}
                          unit="%"
                          size="sm"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span>Avg Response Time:</span>
                          <span className="font-medium">{agent.performance.avgResponseTime}h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Max Concurrent:</span>
                          <span className="font-medium">{agent.maxConcurrentTasks} tasks</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Financial Impact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Revenue Generated:</span>
                          <span className="font-medium">${agent.performance.revenueGenerated.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost per Hour:</span>
                          <span className="font-medium">${agent.performance.costPerHour}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ROI:</span>
                          <span className="font-medium text-green-600">
                            {((agent.performance.revenueGenerated / (agent.performance.costPerHour * agent.performance.tasksCompleted * 5)) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/ceo/chat?agent=${agent.id}`} className="block">
                        <Button size="sm" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Discuss Performance
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "insights",
      label: "Insights",
      icon: Lightbulb,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performers
                </CardTitle>
                <CardDescription>Agents with highest performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents
                    .sort((a, b) => b.performance.businessImpact - a.performance.businessImpact)
                    .slice(0, 3)
                    .map((agent, index) => (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                          <div className="text-lg">{agent.avatar}</div>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-muted-foreground">Impact: {agent.performance.businessImpact}/10</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Link href={`/dashboard/ceo/chat?agent=${agent.id}`}>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/ceo/agents/edit/${agent.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Optimization Opportunities
                </CardTitle>
                <CardDescription>Areas for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents
                    .filter(agent => agent.performance.efficiency < 90 || agent.performance.utilizationRate < 80)
                    .map((agent) => (
                      <div key={agent.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="text-lg">{agent.avatar}</div>
                            <span className="font-medium">{agent.name}</span>
                          </div>
                          <Link href={`/dashboard/ceo/agents/edit/${agent.id}`}>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-2" />
                              Optimize
                            </Button>
                          </Link>
                        </div>
                        <div className="space-y-1 text-sm">
                          {agent.performance.efficiency < 90 && (
                            <p className="text-orange-600">• Efficiency below 90% ({agent.performance.efficiency}%)</p>
                          )}
                          {agent.performance.utilizationRate < 80 && (
                            <p className="text-orange-600">• Low utilization ({agent.performance.utilizationRate}%)</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
      {/* Page Header */}
      <PageHeaderWithActions
        title="Agent Analytics"
        description="Comprehensive performance analytics and insights for all AI agents"
        breadcrumbs={breadcrumbs}
        actions={headerActions}
        icon={BarChart3}
        className="mb-6"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAgentFilter} onValueChange={setSelectedAgentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.avatar} {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overall Statistics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Analytics Tabs */}
      <TabbedContentLayout
        tabs={tabs}
        defaultTab="overview"
        className="space-y-4 sm:space-y-6"
      />

      {/* Quick Actions */}
      <Card className="mt-6 sm:mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common analytics and management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-16 flex-col" onClick={() => toast.success("Performance report generated")}>
              <FileText className="h-5 w-5 mb-2" />
              <span>Generate Report</span>
            </Button>
            <Link href="/dashboard/ceo/agents">
              <Button variant="outline" className="h-16 flex-col w-full">
                <Eye className="h-5 w-5 mb-2" />
                <span>View All Agents</span>
              </Button>
            </Link>
            <Link href="/dashboard/ceo/agents/new">
              <Button variant="outline" className="h-16 flex-col w-full">
                <Plus className="h-5 w-5 mb-2" />
                <span>Deploy New Agent</span>
              </Button>
            </Link>
            <Link href="/dashboard/ceo/chat">
              <Button className="h-16 flex-col w-full">
                <MessageSquare className="h-5 w-5 mb-2" />
                <span>Start Chat</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 