"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { getAgentsByWorkspace } from "@/app/actions/tasks";
import { toast } from "sonner";

// Helper functions for agent data transformation
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

function getAgentCostPerHour(type: string): number {
  const costMap: Record<string, number> = {
    ceo: 285,
    sales: 195,
    marketing: 165,
    operations: 215,
    analytics: 175
  };
  return costMap[type] || 200;
}

function getAgentSpecialties(type: string): string[] {
  const specialtiesMap: Record<string, string[]> = {
    ceo: ["Strategic Decision Making", "Market Research", "Business Development"],
    sales: ["Pipeline Management", "Conversion Optimization", "Customer Outreach"],
    marketing: ["Brand Building", "Content Marketing", "Campaign Management"],
    operations: ["Process Improvement", "Automation", "Efficiency Optimization"],
    analytics: ["Data Analysis", "Predictive Modeling", "Business Intelligence"]
  };
  return specialtiesMap[type] || [];
}

import {
  Brain,
  Briefcase,
  Palette,
  Settings,
  BarChart3,
  Activity,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Star,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Lightbulb,
  Shield,
  Award,
  Plus,
  Edit,
  MoreHorizontal,
  Eye,
  Power,
  Cpu,
  Database,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Headphones,
  BookOpen,
  Rocket,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";

export default function AgentManagementPage() {
  // AI Agents with comprehensive data (using enhanced mock data for now)
  const aiAgents = [
    {
      id: "ceo_agent",
      name: "CEO Agent",
      avatar: "🧠",
      status: "active",
      description: "Strategic planning, market analysis, and business intelligence",
      capabilities: [
        "Strategic Planning & Roadmapping",
        "Market Analysis & Competitive Intelligence", 
        "Business Model Innovation",
        "Investment & Growth Strategy",
        "Board & Stakeholder Communications"
      ],
      currentTasks: 8,
      completedTasks: 147,
      successRate: 94.8,
      avgResponseTime: "4.2 hours",
      costPerHour: 285,
      totalRevenue: 52340,
      efficiency: 96,
      utilizationRate: 87,
      specialties: ["Strategic Decision Making", "Market Research", "Business Development"],
      recentActivity: [
        { action: "Completed Market Analysis for Q4 2024", timestamp: "2 hours ago", type: "completion" },
        { action: "Started Competitive Intelligence Report", timestamp: "5 hours ago", type: "start" },
        { action: "Updated Business Model Canvas", timestamp: "1 day ago", type: "update" }
      ],
      metrics: {
        tasksThisWeek: 12,
        avgBusinessImpact: 9.2,
        clientSatisfaction: 4.9,
        knowledgeBase: 2847
      }
    },
    {
      id: "sales_agent",
      name: "Sales Agent", 
      avatar: "💼",
      status: "active",
      description: "Lead generation, sales optimization, and revenue growth",
      capabilities: [
        "Lead Generation & Qualification",
        "Sales Process Optimization",
        "Customer Acquisition Strategy",
        "Revenue Forecasting & Analytics",
        "CRM Management & Automation"
      ],
      currentTasks: 15,
      completedTasks: 203,
      successRate: 96.2,
      avgResponseTime: "2.8 hours",
      costPerHour: 195,
      totalRevenue: 78450,
      efficiency: 94,
      utilizationRate: 92,
      specialties: ["Pipeline Management", "Conversion Optimization", "Customer Outreach"],
      recentActivity: [
        { action: "Generated 47 qualified leads", timestamp: "1 hour ago", type: "completion" },
        { action: "Optimized sales funnel conversion", timestamp: "3 hours ago", type: "optimization" },
        { action: "Updated CRM automation workflows", timestamp: "6 hours ago", type: "update" }
      ],
      metrics: {
        tasksThisWeek: 18,
        avgBusinessImpact: 8.9,
        clientSatisfaction: 4.8,
        knowledgeBase: 1923
      }
    },
    {
      id: "marketing_agent",
      name: "Marketing Agent",
      avatar: "🎨", 
      status: "active",
      description: "Content creation, brand strategy, and digital marketing",
      capabilities: [
        "Content Strategy & Creation",
        "Brand Positioning & Messaging",
        "Digital Marketing Campaigns",
        "Social Media Management",
        "Marketing Analytics & ROI"
      ],
      currentTasks: 11,
      completedTasks: 178,
      successRate: 91.7,
      avgResponseTime: "3.5 hours",
      costPerHour: 165,
      totalRevenue: 45230,
      efficiency: 89,
      utilizationRate: 85,
      specialties: ["Brand Building", "Content Marketing", "Campaign Management"],
      recentActivity: [
        { action: "Published Q4 content calendar", timestamp: "30 minutes ago", type: "completion" },
        { action: "Launched social media campaign", timestamp: "4 hours ago", type: "launch" },
        { action: "Created brand guidelines document", timestamp: "1 day ago", type: "creation" }
      ],
      metrics: {
        tasksThisWeek: 14,
        avgBusinessImpact: 8.4,
        clientSatisfaction: 4.7,
        knowledgeBase: 1654
      }
    },
    {
      id: "operations_agent",
      name: "Operations Agent",
      avatar: "⚙️",
      status: "maintenance", 
      description: "Process optimization, automation, and operational efficiency",
      capabilities: [
        "Process Automation & Optimization",
        "Quality Management Systems",
        "Resource Allocation & Planning",
        "Cost Reduction Strategies",
        "Operational Risk Management"
      ],
      currentTasks: 6,
      completedTasks: 98,
      successRate: 93.5,
      avgResponseTime: "5.1 hours",
      costPerHour: 215,
      totalRevenue: 34870,
      efficiency: 91,
      utilizationRate: 73,
      specialties: ["Process Improvement", "Automation", "Efficiency Optimization"],
      recentActivity: [
        { action: "Scheduled maintenance update", timestamp: "10 minutes ago", type: "maintenance" },
        { action: "Optimized workflow automation", timestamp: "2 hours ago", type: "optimization" },
        { action: "Generated efficiency report", timestamp: "8 hours ago", type: "completion" }
      ],
      metrics: {
        tasksThisWeek: 8,
        avgBusinessImpact: 8.7,
        clientSatisfaction: 4.6,
        knowledgeBase: 2156
      }
    },
    {
      id: "analytics_agent",
      name: "Analytics Agent",
      avatar: "📊",
      status: "active",
      description: "Data analysis, predictive modeling, and business intelligence",
      capabilities: [
        "Advanced Data Analytics",
        "Predictive Modeling & Forecasting", 
        "Business Intelligence Dashboards",
        "Performance Metrics & KPIs",
        "Data Visualization & Reporting"
      ],
      currentTasks: 9,
      completedTasks: 67,
      successRate: 89.3,
      avgResponseTime: "6.8 hours",
      costPerHour: 245,
      totalRevenue: 41650,
      efficiency: 87,
      utilizationRate: 79,
      specialties: ["Predictive Analytics", "Data Science", "Business Intelligence"],
      recentActivity: [
        { action: "Built predictive revenue model", timestamp: "45 minutes ago", type: "completion" },
        { action: "Updated executive dashboard", timestamp: "3 hours ago", type: "update" },
        { action: "Generated customer insights report", timestamp: "7 hours ago", type: "completion" }
      ],
      metrics: {
        tasksThisWeek: 11,
        avgBusinessImpact: 9.1,
        clientSatisfaction: 4.8,
        knowledgeBase: 3247
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "maintenance": return <AlertCircle className="h-4 w-4" />;
      case "offline": return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion": return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "start": return <Play className="h-3 w-3 text-blue-500" />;
      case "update": return <RefreshCw className="h-3 w-3 text-orange-500" />;
      case "optimization": return <Zap className="h-3 w-3 text-purple-500" />;
      case "launch": return <Rocket className="h-3 w-3 text-pink-500" />;
      case "creation": return <Plus className="h-3 w-3 text-indigo-500" />;
      case "maintenance": return <Settings className="h-3 w-3 text-yellow-500" />;
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

  // Handle status toggle
  const handleStatusToggle = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`/api/agents/${agentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
        // Refresh the page to update the UI
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to update agent status');
      }
    } catch (error) {
      toast.error('Failed to update agent status');
    }
  };

  return (
      <><PageHeader
      items={[
        { label: "CEO Dashboard", href: "/dashboard/ceo" },
        { label: "AI Agents", isCurrentPage: true },
      ]} /><main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary" />
                AI Agent Management
              </h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                Monitor, configure, and optimize your AI agents for maximum business impact
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="lg">
                <Settings className="h-4 w-4 mr-2" />
                Configure All
              </Button>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Deploy Agent
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.totalAgents}</p>
                  <p className="text-xs text-muted-foreground">Total Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.activeAgents}</p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.totalTasks}</p>
                  <p className="text-xs text-muted-foreground">Active Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.avgSuccessRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">${(overallStats.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{overallStats.avgEfficiency.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Grid */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
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
                      <Badge className={getStatusColor(agent.status)}>
                        {getStatusIcon(agent.status)}
                        <span className="ml-1 capitalize">{agent.status}</span>
                      </Badge>
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Efficiency:</span>
                        <span className="font-medium">{agent.efficiency}%</span>
                      </div>
                      <Progress value={agent.efficiency} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Utilization:</span>
                        <span className="font-medium">{agent.utilizationRate}%</span>
                      </div>
                      <Progress value={agent.utilizationRate} className="h-2" />
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
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1">
              {aiAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xl">{agent.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{agent.name}</CardTitle>
                          <Badge className={getStatusColor(agent.status)}>
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{agent.metrics.tasksThisWeek}</p>
                          <p className="text-xs text-muted-foreground">Tasks This Week</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{agent.metrics.avgBusinessImpact}</p>
                          <p className="text-xs text-muted-foreground">Avg Impact Score</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(agent.metrics.clientSatisfaction)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Client Rating</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
                      <div className="space-y-4">
                        <h4 className="font-medium">Task Performance</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Success Rate:</span>
                            <span className="font-medium">{agent.successRate}%</span>
                          </div>
                          <Progress value={agent.successRate} />
                          <div className="flex items-center justify-between text-sm">
                            <span>Efficiency:</span>
                            <span className="font-medium">{agent.efficiency}%</span>
                          </div>
                          <Progress value={agent.efficiency} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Resource Utilization</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Utilization Rate:</span>
                            <span className="font-medium">{agent.utilizationRate}%</span>
                          </div>
                          <Progress value={agent.utilizationRate} />
                          <div className="flex items-center justify-between text-sm">
                            <span>Knowledge Base:</span>
                            <span className="font-medium">{agent.metrics.knowledgeBase.toLocaleString()} items</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Financial Impact</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Revenue:</span>
                            <span className="font-medium">${agent.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost per Hour:</span>
                            <span className="font-medium">${agent.costPerHour}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROI:</span>
                            <span className="font-medium text-green-600">
                              {((agent.totalRevenue / (agent.costPerHour * agent.completedTasks * 5)) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              {aiAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-lg">{agent.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>Recent Activity</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {agent.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Activity className="h-4 w-4 mr-2" />
                      View Full Activity Log
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1">
              {aiAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xl">{agent.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{agent.name}</CardTitle>
                          <CardDescription>Configuration & Capabilities</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/ceo/agents/edit/${agent.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusToggle(agent.id, agent.status)}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          {agent.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Core Capabilities</h4>
                        <div className="grid gap-2 sm:gap-3 grid-cols-1 md:grid-cols-2">
                          {agent.capabilities.map((capability, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Performance Settings</h4>
                        <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-3">
                          <div>
                            <label className="text-sm font-medium">Max Concurrent Tasks</label>
                            <p className="text-2xl font-bold text-primary">{agent.currentTasks + 5}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Priority Level</label>
                            <Badge variant="outline">Standard</Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Auto-scaling</label>
                            <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

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
              <Link href="/dashboard/ceo/tasks/new">
                <Button className="h-16 flex-col w-full">
                  <Plus className="h-5 w-5 mb-2" />
                  <span>Create Task</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main></>
  );
} 