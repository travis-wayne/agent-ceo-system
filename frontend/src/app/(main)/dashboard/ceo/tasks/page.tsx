"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Bot, 
  Zap, 
  Brain,
  Target,
  TrendingUp,
  Users,
  ArrowUpRight,
  Calendar,
  User,
  Star,
  Award,
  Activity,
  BarChart3,
  Timer,
  Building2,
  DollarSign,
  Briefcase,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Mail,
  Phone,
  PieChart,
  LineChart,
  FileText,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Archive,
  Copy
} from "lucide-react";

// Note: Metadata moved to layout or parent component since this is now a Client Component

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock workspace ID - in real app, get from auth context
  const workspaceId = "workspace_123";

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks, agents, and statistics in parallel
        const [tasksResponse, agentsResponse] = await Promise.all([
          fetch(`/api/tasks?workspaceId=${workspaceId}&limit=10`),
          fetch(`/api/agents?workspaceId=${workspaceId}`)
        ]);

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData.tasks || []);
        }

        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          setAgents(agentsData.agents || []);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load task data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  // Handle task deletion
  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove task from local state
        setTasks(prev => prev.filter(task => task.id !== taskId));
      } else {
        const errorData = await response.json();
        alert('Failed to delete task: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Handle task status change
  const handleTaskAction = async (taskId: string, action: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update task in local state
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, ...result.task } : task
        ));
      } else {
        const errorData = await response.json();
        alert('Failed to ' + action + ' task: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error performing task action:', error);
      alert('Failed to ' + action + ' task. Please try again.');
    }
  };

  // Comprehensive CEO-focused task management data
  const strategicMetrics = {
    activeTasks: 24,
    completedToday: 12,
    totalAgents: 5,
    averageCompletionTime: 3.8, // hours
    successRate: 96.2,
    totalTasksThisWeek: 89,
    weeklyGrowth: 22.1,
    systemEfficiency: 94, // percentage
    businessImpactScore: 8.7, // out of 10
    strategicAlignment: 92, // percentage
  };

  const agentPerformance = [
    {
      id: "ceo-agent",
      name: "CEO Agent",
      specialization: "Strategic Leadership",
      status: "active",
      currentTasks: 6,
      maxCapacity: 8,
      efficiency: 98,
      successRate: 99.1,
      model: "GPT-4.5 Turbo",
      avatar: "🧠",
      recentCompletions: 15,
    },
    {
      id: "sales-agent",
      name: "Sales Agent", 
      specialization: "Revenue Generation",
      status: "active",
      currentTasks: 5,
      maxCapacity: 8,
      efficiency: 91,
      successRate: 93.4,
      model: "Claude 3 Opus",
      avatar: "💼",
      recentCompletions: 18,
    },
    {
      id: "marketing-agent",
      name: "Marketing Agent",
      specialization: "Brand Building",
      status: "active", 
      currentTasks: 4,
      maxCapacity: 7,
      efficiency: 95,
      successRate: 94.8,
      model: "GPT-4 Turbo",
      avatar: "🎨",
      recentCompletions: 22,
    },
    {
      id: "operations-agent",
      name: "Operations Agent",
      specialization: "Process Excellence",
      status: "busy",
      currentTasks: 7,
      maxCapacity: 8,
      efficiency: 89,
      successRate: 91.7,
      model: "Claude 3 Sonnet", 
      avatar: "⚙️",
      recentCompletions: 19,
    },
    {
      id: "analytics-agent",
      name: "Analytics Agent",
      specialization: "Data Intelligence",
      status: "active",
      currentTasks: 3,
      maxCapacity: 6,
      efficiency: 96,
      successRate: 97.3,
      model: "GPT-4 + Code Interpreter",
      avatar: "📊",
      recentCompletions: 12,
    },
  ];

  const strategicTasks = [
    {
      id: "task-001",
      title: "Q4 2024 Strategic Market Analysis - Enterprise Software",
      description: "Comprehensive competitive analysis of enterprise software market with strategic recommendations and growth opportunities identification",
      agent: "CEO Agent",
      agentType: "ceo-agent",
      status: "in_progress",
      priority: "urgent",
      progress: 78,
      estimatedCompletion: "1.5 hours",
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      complexity: "very_high",
      businessValue: "critical",
      category: "Strategic Analysis",
      stakeholders: ["CEO", "Board of Directors", "Strategy Team"],
      businessImpact: 9.5,
      resourcesAllocated: ["Market Data APIs", "Competitive Intelligence", "AI Models"],
      milestones: [
        { name: "Market Research", completed: true, completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { name: "Competitive Analysis", completed: true, completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { name: "Strategic Recommendations", completed: false, estimatedCompletion: "1 hour" },
        { name: "Executive Summary", completed: false, estimatedCompletion: "30 minutes" },
      ],
    },
    {
      id: "task-002",
      title: "Healthcare Industry Revenue Optimization Strategy",
      description: "Develop comprehensive revenue optimization strategy for healthcare vertical with lead generation and conversion optimization",
      agent: "Sales Agent",
      agentType: "sales-agent",
      status: "in_progress",
      priority: "high",
      progress: 45,
      estimatedCompletion: "3 hours",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
      complexity: "high",
      businessValue: "high",
      category: "Revenue Generation",
      stakeholders: ["Sales Director", "Marketing Team", "Healthcare Vertical Lead"],
      businessImpact: 8.2,
      resourcesAllocated: ["CRM Data", "Industry Reports", "Sales Analytics"],
      milestones: [
        { name: "Market Segmentation", completed: true, completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
        { name: "Lead Scoring Model", completed: false, estimatedCompletion: "1.5 hours" },
        { name: "Campaign Strategy", completed: false, estimatedCompletion: "1 hour" },
        { name: "ROI Projections", completed: false, estimatedCompletion: "30 minutes" },
      ],
    },
    {
      id: "task-003",
      title: "AI-Powered Brand Positioning Campaign - Q1 2025",
      description: "Strategic brand positioning campaign leveraging AI insights for maximum market impact and customer engagement",
      agent: "Marketing Agent",
      agentType: "marketing-agent",
      status: "completed",
      priority: "high",
      progress: 100,
      estimatedCompletion: "Completed",
      startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      deadline: new Date(Date.now() - 1 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 45 * 60 * 1000),
      complexity: "high",
      businessValue: "high",
      category: "Brand Strategy",
      stakeholders: ["CMO", "Brand Team", "Creative Director"],
      businessImpact: 8.8,
      resourcesAllocated: ["Brand Analytics", "Customer Data", "Creative Assets"],
      milestones: [
        { name: "Brand Audit", completed: true, completedAt: new Date(Date.now() - 7 * 60 * 60 * 1000) },
        { name: "Market Positioning", completed: true, completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
        { name: "Campaign Creative", completed: true, completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { name: "Launch Strategy", completed: true, completedAt: new Date(Date.now() - 45 * 60 * 1000) },
      ],
    },
    {
      id: "task-004",
      title: "Operational Excellence Initiative - Process Automation",
      description: "Comprehensive process automation strategy to improve operational efficiency and reduce costs across all departments",
      agent: "Operations Agent",
      agentType: "operations-agent",
      status: "queued",
      priority: "medium",
      progress: 0,
      estimatedCompletion: "6 hours",
      startTime: null,
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
      complexity: "very_high",
      businessValue: "high",
      category: "Process Optimization",
      stakeholders: ["COO", "Department Heads", "IT Team"],
      businessImpact: 7.9,
      resourcesAllocated: ["Process Data", "Automation Tools", "Performance Metrics"],
      milestones: [
        { name: "Process Mapping", completed: false, estimatedCompletion: "2 hours" },
        { name: "Automation Opportunities", completed: false, estimatedCompletion: "2 hours" },
        { name: "Implementation Plan", completed: false, estimatedCompletion: "1.5 hours" },
        { name: "ROI Analysis", completed: false, estimatedCompletion: "30 minutes" },
      ],
    },
    {
      id: "task-005",
      title: "Predictive Business Intelligence Dashboard",
      description: "Advanced predictive analytics dashboard for strategic decision-making with real-time business intelligence and forecasting",
      agent: "Analytics Agent",
      agentType: "analytics-agent",
      status: "in_progress",
      priority: "medium",
      progress: 65,
      estimatedCompletion: "2.5 hours",
      startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 3 * 60 * 60 * 1000),
      complexity: "very_high",
      businessValue: "critical",
      category: "Business Intelligence",
      stakeholders: ["C-Suite", "Analytics Team", "Business Units"],
      businessImpact: 9.1,
      resourcesAllocated: ["Business Data", "ML Models", "Visualization Tools"],
      milestones: [
        { name: "Data Integration", completed: true, completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000) },
        { name: "Predictive Models", completed: true, completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
        { name: "Dashboard Development", completed: false, estimatedCompletion: "1.5 hours" },
        { name: "Testing & Validation", completed: false, estimatedCompletion: "1 hour" },
      ],
    },
  ];

  const recentActivity = [
    {
      id: "activity-001",
      type: "task_completed",
      title: "Competitive Intelligence Report - Nordic Market",
      agent: "CEO Agent",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      businessImpact: 8.9,
      status: "success",
      stakeholders: ["Strategy Team", "Board"],
    },
    {
      id: "activity-002",
      type: "milestone_reached",
      title: "Revenue Strategy - Healthcare Segmentation Complete",
      agent: "Sales Agent",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      businessImpact: 8.2,
      status: "info",
      stakeholders: ["Sales Director"],
    },
    {
      id: "activity-003",
      type: "task_started",
      title: "Process Automation Analysis Initiated",
      agent: "Operations Agent",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      businessImpact: 7.9,
      status: "info",
      stakeholders: ["COO"],
    },
    {
      id: "activity-004",
      type: "quality_alert",
      title: "Predictive Model Accuracy Optimization Required",
      agent: "Analytics Agent",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      businessImpact: 6.5,
      status: "warning",
      stakeholders: ["Analytics Team"],
    },
  ];

  const performanceData = {
    weeklyCompletion: [
      { day: "Mon", completed: 8, quality: 94, businessImpact: 8.2 },
      { day: "Tue", completed: 12, quality: 96, businessImpact: 8.7 },
      { day: "Wed", completed: 15, quality: 93, businessImpact: 8.4 },
      { day: "Thu", completed: 18, quality: 97, businessImpact: 9.1 },
      { day: "Fri", completed: 21, quality: 95, businessImpact: 8.9 },
      { day: "Sat", completed: 9, quality: 98, businessImpact: 8.6 },
      { day: "Sun", completed: 6, quality: 99, businessImpact: 9.3 },
    ],
    strategicFocus: [
      { area: "Market Analysis", tasks: 8, completion: 87, impact: 9.2 },
      { area: "Revenue Optimization", tasks: 6, completion: 92, impact: 8.8 },
      { area: "Brand Strategy", tasks: 4, completion: 95, impact: 8.5 },
      { area: "Process Excellence", tasks: 3, completion: 78, impact: 7.9 },
      { area: "Business Intelligence", tasks: 3, completion: 88, impact: 9.0 },
    ],
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500 text-white">Completed</Badge>;
      case "in_progress":
        return <Badge variant="default" className="bg-blue-500 text-white">In Progress</Badge>;
      case "queued":
        return <Badge variant="secondary">Queued</Badge>;
      case "paused":
        return <Badge variant="outline">Paused</Badge>;
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

  const getBusinessValueBadge = (value: string) => {
    switch (value) {
      case "critical":
        return <Badge variant="default" className="bg-purple-600 text-white">Critical</Badge>;
      case "high":
        return <Badge variant="default" className="bg-purple-500 text-white">High Impact</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium Impact</Badge>;
      case "low":
        return <Badge variant="outline">Low Impact</Badge>;
      default:
        return <Badge variant="outline">{value}</Badge>;
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed": return <CheckCircle className="h-4 w-4" />;
      case "task_started": return <Play className="h-4 w-4" />;
      case "milestone_reached": return <Target className="h-4 w-4" />;
      case "quality_alert": return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50";
      case "info": return "text-blue-600 bg-blue-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "error": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Tasks", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              Strategic Task Management
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered strategic task orchestration and business intelligence
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/tasks/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Strategic Task
              </Button>
            </Link>
            <Link href="/tasks/templates">
              <Button variant="outline" size="lg" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Strategic Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategicMetrics.activeTasks}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="flex items-center text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{strategicMetrics.weeklyGrowth}%
                </span>
                <span className="text-muted-foreground">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategicMetrics.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                {strategicMetrics.totalTasksThisWeek} total this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategicMetrics.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Avg: {strategicMetrics.averageCompletionTime}h completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategicMetrics.systemEfficiency}%</div>
              <p className="text-xs text-muted-foreground">
                {strategicMetrics.totalAgents} agents active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategicMetrics.businessImpactScore}/10</div>
              <p className="text-xs text-muted-foreground">
                Strategic value score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strategic Alignment</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategicMetrics.strategicAlignment}%</div>
              <p className="text-xs text-muted-foreground">
                Goal alignment score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Strategic Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Strategic Tasks
                  </CardTitle>
                  <CardDescription>
                    High-impact tasks driving business objectives
                  </CardDescription>
                </div>
                <Link href="/tasks/active">
                  <Button variant="outline" size="sm">
                    <span>View All</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {strategicTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <h4 className="font-medium leading-none">{task.title}</h4>
                          {getPriorityBadge(task.priority)}
                          {getBusinessValueBadge(task.businessValue)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.agent}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedCompletion}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {task.stakeholders.length} stakeholders
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {task.businessImpact}/10 impact
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress and Status */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        {getStatusBadge(task.status)}
                        <span className="text-muted-foreground">{task.progress}% complete</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Milestones</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {task.milestones.slice(0, 4).map((milestone, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            {milestone.completed ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className={milestone.completed ? "text-green-600" : "text-muted-foreground"}>
                              {milestone.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Agent Performance
              </CardTitle>
              <CardDescription>
                Current capacity and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentPerformance.map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(agent.status)}`} />
                      <span className="text-lg">{agent.avatar}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{agent.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {agent.efficiency}% eff
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{agent.specialization}</span>
                        <span>{agent.currentTasks}/{agent.maxCapacity}</span>
                      </div>
                      <Progress 
                        value={(agent.currentTasks / agent.maxCapacity) * 100} 
                        className="h-1"
                      />
                      <div className="text-xs text-muted-foreground">
                        {agent.recentCompletions} completed this week
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/agents">
                  <Button variant="outline" className="w-full">
                    <span>Manage Agents</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Performance Trends
              </CardTitle>
              <CardDescription>
                Task completion, quality, and business impact metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.weeklyCompletion.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="font-medium w-8">{day.day}</span>
                      <div className="flex-1">
                        <div className="bg-blue-500 h-2 rounded" 
                             style={{ width: `${(day.completed / 25) * 100}px` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-16">
                        {day.completed} tasks
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {day.quality}% quality
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {day.businessImpact} impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Recent Strategic Activity
              </CardTitle>
              <CardDescription>
                Latest high-impact updates and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.businessImpact}/10
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{activity.agent}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                        <span>•</span>
                        <span>{activity.stakeholders.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/tasks/activity">
                  <Button variant="outline" className="w-full">
                    <span>View All Activity</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Focus Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Strategic Focus Areas
            </CardTitle>
            <CardDescription>
              Task distribution and performance across key business areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {performanceData.strategicFocus.map((area) => (
                <div key={area.area} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{area.area}</span>
                    <Badge variant="outline" className="text-xs">
                      {area.tasks} tasks
                    </Badge>
                  </div>
                  <Progress value={area.completion} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{area.completion}% complete</span>
                    <span>{area.impact}/10 impact</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/tasks/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <Plus className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Create Strategic Task</h3>
                  <p className="text-sm text-muted-foreground">Launch new AI-powered initiative</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks/templates">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <Briefcase className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Strategic Templates</h3>
                  <p className="text-sm text-muted-foreground">Use proven task frameworks</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <LineChart className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Performance Analytics</h3>
                  <p className="text-sm text-muted-foreground">Deep strategic insights</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <Settings className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Agent Configuration</h3>
                  <p className="text-sm text-muted-foreground">Optimize AI performance</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Task Management Table with Full CRUD */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Active Strategic Tasks
                </CardTitle>
                <CardDescription>
                  Manage all tasks with full CRUD operations (Create, Read, Update, Delete)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Link href="/dashboard/ceo/tasks/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Loading state */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-muted-foreground">Loading tasks...</p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-2">
                    Retry
                  </Button>
                </div>
              )}

              {/* Tasks list */}
              {!loading && !error && tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
                  <Link href="/dashboard/ceo/tasks/new">
                    <Button className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              )}

              {/* Active tasks with CRUD operations */}
              {!loading && !error && tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                                      <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{task.agent?.avatar || '🤖'}</div>
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.agent?.name || 'AI Agent'} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                      </div>
                    
                                          <div className="flex items-center space-x-4">
                        <div className="text-center min-w-[80px]">
                          <div className="text-lg font-bold text-primary">{task.progress || 0}%</div>
                          <Progress value={task.progress || 0} className="h-1 w-16" />
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <Badge variant="outline" className="mb-1">
                            {task.businessImpact || 'N/A'}/10
                          </Badge>
                          <span className="text-xs text-muted-foreground">Impact</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <Badge 
                            className={
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              task.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {task.status?.replace('_', ' ') || 'pending'}
                          </Badge>
                          <Badge 
                            className={
                              task.priority === 'high' || task.priority === 'urgent' || task.priority === 'critical' ? 'bg-red-100 text-red-800 mt-1' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 mt-1' :
                              'bg-green-100 text-green-800 mt-1'
                            }
                          >
                            {task.priority || 'medium'}
                          </Badge>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">${(task.budgetAllocated || 0).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Budget</div>
                        </div>
                      </div>
                  </div>
                  
                  {/* CRUD Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    {/* READ - View Details */}
                    <Button variant="outline" size="sm" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* UPDATE - Edit Task */}
                    <Link href={`/dashboard/ceo/tasks/edit/${task.id}`}>
                      <Button variant="outline" size="sm" title="Edit Task">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    {/* Task Control Actions */}
                    {task.status === 'in_progress' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="Pause Task"
                        onClick={() => handleTaskAction(task.id, 'pause')}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : task.status === 'paused' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="Resume Task"
                        onClick={() => handleTaskAction(task.id, 'start')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    
                    {/* DELETE - Remove Task */}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      title="Delete Task"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {/* More Options */}
                    <Button variant="outline" size="sm" title="More Options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Table Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox />
                <span className="text-sm text-muted-foreground">Select all tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Bulk Archive
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Bulk Duplicate
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Bulk Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 