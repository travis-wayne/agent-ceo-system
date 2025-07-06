"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  FileText
} from "lucide-react";

// Mock analytics data following the workflow guide
const agentPerformanceData = {
  overview: {
    totalAgents: 5,
    activeAgents: 4,
    totalTasks: 142,
    avgSuccessRate: 94.8,
    totalRevenue: 231860,
    avgEfficiency: 92.4,
    totalCostSavings: 47500,
    avgResponseTime: 3.2
  },
  
  agentMetrics: [
    {
      id: "ceo_agent",
      name: "CEO Agent",
      type: "Strategic Intelligence",
      avatar: "🧠",
      status: "active",
      performance: {
        successRate: 94.8,
        efficiency: 96.0,
        tasksCompleted: 147,
        avgResponseTime: 4.2,
        businessImpact: 9.2,
        costPerHour: 285,
        revenueGenerated: 52340,
        utilizationRate: 87,
        qualityScore: 9.1,
        clientSatisfaction: 4.9
      },
      trends: {
        successRate: { value: 2.3, direction: "up" },
        efficiency: { value: 1.5, direction: "up" },
        businessImpact: { value: 0.8, direction: "up" },
        responseTime: { value: -0.5, direction: "down" }
      },
      recentTasks: [
        { name: "Market Analysis Q4 2024", completion: 100, impact: 9.5, duration: 3.2 },
        { name: "Competitive Intelligence", completion: 85, impact: 8.8, duration: 4.1 },
        { name: "Strategic Planning", completion: 100, impact: 9.8, duration: 2.8 }
      ]
    },
    {
      id: "sales_agent",
      name: "Sales Agent",
      type: "Revenue Generation",
      avatar: "💼",
      status: "active",
      performance: {
        successRate: 96.2,
        efficiency: 94.0,
        tasksCompleted: 203,
        avgResponseTime: 2.8,
        businessImpact: 8.9,
        costPerHour: 195,
        revenueGenerated: 78450,
        utilizationRate: 92,
        qualityScore: 8.7,
        clientSatisfaction: 4.8
      },
      trends: {
        successRate: { value: 1.2, direction: "up" },
        efficiency: { value: 0.8, direction: "up" },
        businessImpact: { value: 0.3, direction: "up" },
        responseTime: { value: -0.3, direction: "down" }
      },
      recentTasks: [
        { name: "Lead Generation Campaign", completion: 100, impact: 9.1, duration: 2.1 },
        { name: "Sales Pipeline Optimization", completion: 100, impact: 8.9, duration: 2.5 },
        { name: "Customer Qualification", completion: 95, impact: 8.6, duration: 1.8 }
      ]
    },
    {
      id: "marketing_agent",
      name: "Marketing Agent",
      type: "Brand & Content",
      avatar: "🎨",
      status: "active",
      performance: {
        successRate: 91.7,
        efficiency: 89.0,
        tasksCompleted: 178,
        avgResponseTime: 3.5,
        businessImpact: 8.4,
        costPerHour: 165,
        revenueGenerated: 45230,
        utilizationRate: 85,
        qualityScore: 8.3,
        clientSatisfaction: 4.7
      },
      trends: {
        successRate: { value: 0.9, direction: "up" },
        efficiency: { value: 1.2, direction: "up" },
        businessImpact: { value: 0.5, direction: "up" },
        responseTime: { value: 0.2, direction: "up" }
      },
      recentTasks: [
        { name: "Content Calendar Q4", completion: 100, impact: 8.7, duration: 3.2 },
        { name: "Brand Strategy Update", completion: 90, impact: 8.1, duration: 4.1 },
        { name: "Social Media Campaign", completion: 100, impact: 8.5, duration: 2.9 }
      ]
    },
    {
      id: "operations_agent",
      name: "Operations Agent",
      type: "Process Optimization",
      avatar: "⚙️",
      status: "maintenance",
      performance: {
        successRate: 93.5,
        efficiency: 91.0,
        tasksCompleted: 98,
        avgResponseTime: 5.1,
        businessImpact: 8.7,
        costPerHour: 215,
        revenueGenerated: 34870,
        utilizationRate: 73,
        qualityScore: 8.9,
        clientSatisfaction: 4.6
      },
      trends: {
        successRate: { value: -0.5, direction: "down" },
        efficiency: { value: 0.3, direction: "up" },
        businessImpact: { value: 0.2, direction: "up" },
        responseTime: { value: 0.8, direction: "up" }
      },
      recentTasks: [
        { name: "Workflow Optimization", completion: 85, impact: 9.2, duration: 4.8 },
        { name: "System Maintenance", completion: 100, impact: 7.5, duration: 6.2 },
        { name: "Process Automation", completion: 75, impact: 8.8, duration: 5.5 }
      ]
    },
    {
      id: "analytics_agent",
      name: "Analytics Agent",
      type: "Data Intelligence",
      avatar: "📊",
      status: "active",
      performance: {
        successRate: 97.1,
        efficiency: 92.0,
        tasksCompleted: 156,
        avgResponseTime: 3.8,
        businessImpact: 8.8,
        costPerHour: 175,
        revenueGenerated: 20970,
        utilizationRate: 88,
        qualityScore: 9.3,
        clientSatisfaction: 4.8
      },
      trends: {
        successRate: { value: 1.8, direction: "up" },
        efficiency: { value: 2.1, direction: "up" },
        businessImpact: { value: 0.6, direction: "up" },
        responseTime: { value: -0.4, direction: "down" }
      },
      recentTasks: [
        { name: "Performance Analytics", completion: 100, impact: 9.1, duration: 3.1 },
        { name: "Predictive Modeling", completion: 95, impact: 9.5, duration: 4.2 },
        { name: "Business Intelligence", completion: 100, impact: 8.6, duration: 2.8 }
      ]
    }
  ],

  businessImpact: {
    totalROI: 425,
    costSavings: 47500,
    revenueGenerated: 231860,
    efficiencyGains: 28,
    customerSatisfaction: 4.76,
    timesSaved: 156,
    processesOptimized: 23,
    decisionsSupported: 89
  },

  predictions: {
    nextMonth: {
      expectedTasks: 180,
      projectedRevenue: 285000,
      expectedEfficiency: 94.2,
      riskLevel: "low"
    },
    nextQuarter: {
      expectedTasks: 520,
      projectedRevenue: 820000,
      expectedEfficiency: 95.8,
      riskLevel: "low"
    }
  }
};

export default function AgentAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("month");
  const [selectedAgent, setSelectedAgent] = useState("all");

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? 
      <ArrowUp className="h-4 w-4 text-green-500" /> : 
      <ArrowDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (direction: string) => {
    return direction === "up" ? "text-green-600" : "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'busy': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'maintenance': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const filteredAgents = selectedAgent === "all" 
    ? agentPerformanceData.agentMetrics 
    : agentPerformanceData.agentMetrics.filter(agent => agent.id === selectedAgent);

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "AI Agents", href: "/dashboard/ceo/agents" },
          { label: "Analytics", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Agent Performance Analytics</h1>
              </div>
              <p className="text-muted-foreground">
                Comprehensive insights into AI agent performance, business impact, and optimization opportunities
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{agentPerformanceData.overview.totalAgents}</p>
                  <p className="text-xs text-muted-foreground">Total Agents</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {agentPerformanceData.overview.activeAgents} active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{agentPerformanceData.overview.avgSuccessRate}%</p>
                  <p className="text-xs text-muted-foreground">Avg Success Rate</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +2.1% from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">${(agentPerformanceData.overview.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Revenue Generated</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +18.5% growth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{agentPerformanceData.overview.avgEfficiency}%</p>
                  <p className="text-xs text-muted-foreground">Avg Efficiency</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +1.3% improvement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="business-impact">Business Impact</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Agent Performance Metrics</h2>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agentPerformanceData.agentMetrics.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6">
              {filteredAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{agent.avatar}</div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription>{agent.type}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {/* Core Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">CORE METRICS</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Success Rate</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{agent.performance.successRate}%</span>
                              {getTrendIcon(agent.trends.successRate.direction)}
                              <span className={`text-xs ${getTrendColor(agent.trends.successRate.direction)}`}>
                                {agent.trends.successRate.value}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Efficiency</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{agent.performance.efficiency}%</span>
                              {getTrendIcon(agent.trends.efficiency.direction)}
                              <span className={`text-xs ${getTrendColor(agent.trends.efficiency.direction)}`}>
                                {agent.trends.efficiency.value}%
                              </span>
                            </div>
                          </div>
                          <Progress value={agent.performance.efficiency} className="h-2" />
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">PERFORMANCE</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Response Time</span>
                            <span className="font-medium">{agent.performance.avgResponseTime}h</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Tasks Completed</span>
                            <span className="font-medium">{agent.performance.tasksCompleted}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Utilization</span>
                            <span className="font-medium">{agent.performance.utilizationRate}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Business Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">BUSINESS IMPACT</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Business Impact</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{agent.performance.businessImpact}/10</span>
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Revenue Generated</span>
                            <span className="font-medium">${(agent.performance.revenueGenerated / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Client Satisfaction</span>
                            <span className="font-medium">{agent.performance.clientSatisfaction}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Tasks */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">RECENT TASKS</h4>
                        <div className="space-y-2">
                          {agent.recentTasks.map((task, index) => (
                            <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                              <div className="font-medium">{task.name}</div>
                              <div className="flex justify-between text-muted-foreground mt-1">
                                <span>{task.completion}% complete</span>
                                <span>{task.duration}h</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Business Impact Tab */}
          <TabsContent value="business-impact" className="space-y-6">
            <h2 className="text-xl font-semibold">Business Impact Analysis</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-green-600">
                      {agentPerformanceData.businessImpact.totalROI}%
                    </p>
                    <p className="text-sm text-muted-foreground">Total ROI</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingDown className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-blue-600">
                      ${(agentPerformanceData.businessImpact.costSavings / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-muted-foreground">Cost Savings</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-orange-600">
                      {agentPerformanceData.businessImpact.timesSaved}h
                    </p>
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-purple-600">
                      {agentPerformanceData.businessImpact.customerSatisfaction}
                    </p>
                    <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Gains</CardTitle>
                  <CardDescription>Process improvements and automation benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Efficiency Improvement</span>
                    <span className="font-bold text-green-600">+{agentPerformanceData.businessImpact.efficiencyGains}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Processes Optimized</span>
                    <span className="font-medium">{agentPerformanceData.businessImpact.processesOptimized}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Decisions Supported</span>
                    <span className="font-medium">{agentPerformanceData.businessImpact.decisionsSupported}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Impact</CardTitle>
                  <CardDescription>Direct and indirect revenue contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Revenue Generated</span>
                    <span className="font-bold text-green-600">
                      ${(agentPerformanceData.businessImpact.revenueGenerated / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cost Reduction</span>
                    <span className="font-medium">
                      ${(agentPerformanceData.businessImpact.costSavings / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Net Business Value</span>
                    <span className="font-bold text-primary">
                      ${((agentPerformanceData.businessImpact.revenueGenerated + agentPerformanceData.businessImpact.costSavings) / 1000).toFixed(0)}K
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <h2 className="text-xl font-semibold">Predictive Analytics & Forecasts</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Next Month Forecast
                  </CardTitle>
                  <CardDescription>Projected performance for next 30 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Expected Tasks</span>
                    <span className="font-bold">{agentPerformanceData.predictions.nextMonth.expectedTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projected Revenue</span>
                    <span className="font-bold text-green-600">
                      ${(agentPerformanceData.predictions.nextMonth.projectedRevenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expected Efficiency</span>
                    <span className="font-bold">{agentPerformanceData.predictions.nextMonth.expectedEfficiency}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Risk Level</span>
                    <Badge variant="secondary" className="capitalize">
                      {agentPerformanceData.predictions.nextMonth.riskLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quarterly Outlook
                  </CardTitle>
                  <CardDescription>Strategic projections for next quarter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Expected Tasks</span>
                    <span className="font-bold">{agentPerformanceData.predictions.nextQuarter.expectedTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projected Revenue</span>
                    <span className="font-bold text-green-600">
                      ${(agentPerformanceData.predictions.nextQuarter.projectedRevenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expected Efficiency</span>
                    <span className="font-bold">{agentPerformanceData.predictions.nextQuarter.expectedEfficiency}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Risk Level</span>
                    <Badge variant="secondary" className="capitalize">
                      {agentPerformanceData.predictions.nextQuarter.riskLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends & Insights</CardTitle>
                <CardDescription>Key patterns and recommendations based on historical data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Positive Trends
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Success rates improving across all agent types
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Response times decreasing with optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Revenue generation exceeding projections
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Operations Agent needs maintenance optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Marketing Agent utilization could be improved
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Consider scaling high-performing agents
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <h2 className="text-xl font-semibold">Optimization Recommendations</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Smart Recommendations
                  </CardTitle>
                  <CardDescription>AI-powered suggestions to improve agent performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-medium text-green-700 dark:text-green-400">High Priority</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Scale CEO Agent capacity by 20% to handle increased strategic analysis demand
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Expected ROI: +15%</Badge>
                        <Badge variant="secondary">Implementation: 2 days</Badge>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-950/20">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Medium Priority</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Optimize Marketing Agent workflow to reduce average response time by 0.5 hours
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Expected ROI: +8%</Badge>
                        <Badge variant="secondary">Implementation: 1 week</Badge>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-950/20">
                      <h4 className="font-medium text-orange-700 dark:text-orange-400">Low Priority</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        Schedule maintenance window for Operations Agent to improve utilization rate
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Expected ROI: +5%</Badge>
                        <Badge variant="secondary">Implementation: 3 days</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Performance Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Task Distribution</span>
                        <Badge variant="outline">Optimize</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resource Allocation</span>
                        <Badge variant="outline">Balanced</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Model Configuration</span>
                        <Badge variant="outline">Review</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Workflow Efficiency</span>
                        <Badge variant="outline">Good</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Budget Utilization</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cost per Task</span>
                        <span className="font-medium text-green-600">-12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ROI Efficiency</span>
                        <span className="font-medium text-green-600">+425%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Potential Savings</span>
                        <span className="font-medium">$8.2K/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
} 