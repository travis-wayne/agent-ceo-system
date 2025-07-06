import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Eye,
  Filter,
  HardDrive,
  MemoryStick,
  Monitor,
  Network,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Shield,
  StopCircle,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  Bot,
  Target,
  BarChart3,
  Timer,
  AlertTriangle,
  Server,
  Wifi,
  HardDriveIcon
} from "lucide-react";

export const metadata: Metadata = {
  title: "Task Monitor | Agent CEO",
  description: "Real-time task monitoring and system performance tracking",
};

export default function TaskMonitorPage() {
  const systemMetrics = {
    cpu: {
      usage: 67,
      cores: 8,
      temperature: 45,
      status: "normal"
    },
    memory: {
      usage: 78,
      total: 32,
      available: 7,
      status: "warning"
    },
    storage: {
      usage: 45,
      total: 1000,
      available: 550,
      status: "normal"
    },
    network: {
      bandwidth: 85,
      latency: 12,
      packets: 1250000,
      status: "normal"
    }
  };

  const agentMetrics = [
    {
      id: "ceo-agent",
      name: "CEO Agent",
      status: "active",
      cpu: 23,
      memory: 45,
      tasks: 6,
      efficiency: 98,
      uptime: "99.9%",
      lastActivity: "2 minutes ago",
      model: "GPT-4.5 Turbo",
      avatar: "🧠"
    },
    {
      id: "sales-agent",
      name: "Sales Agent",
      status: "active",
      cpu: 18,
      memory: 38,
      tasks: 5,
      efficiency: 91,
      uptime: "99.7%",
      lastActivity: "5 minutes ago",
      model: "Claude 3 Opus",
      avatar: "💼"
    },
    {
      id: "marketing-agent",
      name: "Marketing Agent",
      status: "active",
      cpu: 15,
      memory: 42,
      tasks: 4,
      efficiency: 95,
      uptime: "99.8%",
      lastActivity: "1 minute ago",
      model: "GPT-4 Turbo",
      avatar: "🎨"
    },
    {
      id: "support-agent",
      name: "Support Agent",
      status: "warning",
      cpu: 89,
      memory: 92,
      tasks: 8,
      efficiency: 67,
      uptime: "98.2%",
      lastActivity: "30 seconds ago",
      model: "Claude 3 Sonnet",
      avatar: "🎧"
    },
    {
      id: "analytics-agent",
      name: "Analytics Agent",
      status: "inactive",
      cpu: 0,
      memory: 0,
      tasks: 0,
      efficiency: 0,
      uptime: "0%",
      lastActivity: "2 hours ago",
      model: "GPT-4",
      avatar: "📊"
    }
  ];

  const activeTasks = [
    {
      id: "task_1",
      title: "Q4 Revenue Analysis",
      agent: "CEO Agent",
      status: "running",
      progress: 67,
      priority: "high",
      startedAt: "2024-01-15T14:30:00Z",
      estimatedCompletion: "2024-01-15T16:00:00Z",
      cpu: 15,
      memory: 28
    },
    {
      id: "task_2",
      title: "Lead Qualification Campaign",
      agent: "Sales Agent",
      status: "running",
      progress: 89,
      priority: "medium",
      startedAt: "2024-01-15T13:15:00Z",
      estimatedCompletion: "2024-01-15T15:30:00Z",
      cpu: 12,
      memory: 22
    },
    {
      id: "task_3",
      title: "Social Media Content Generation",
      agent: "Marketing Agent",
      status: "running",
      progress: 34,
      priority: "low",
      startedAt: "2024-01-15T14:45:00Z",
      estimatedCompletion: "2024-01-15T16:15:00Z",
      cpu: 8,
      memory: 18
    },
    {
      id: "task_4",
      title: "Customer Support Ticket Processing",
      agent: "Support Agent",
      status: "warning",
      progress: 23,
      priority: "high",
      startedAt: "2024-01-15T12:00:00Z",
      estimatedCompletion: "2024-01-15T18:00:00Z",
      cpu: 45,
      memory: 78
    }
  ];

  const systemAlerts = [
    {
      id: "alert_1",
      type: "warning",
      title: "High Memory Usage",
      description: "Support Agent is using 92% of allocated memory",
      timestamp: "2024-01-15T14:55:00Z",
      severity: "medium"
    },
    {
      id: "alert_2",
      type: "info",
      title: "Task Completed",
      description: "Q3 Performance Review completed successfully",
      timestamp: "2024-01-15T14:30:00Z",
      severity: "low"
    },
    {
      id: "alert_3",
      type: "error",
      title: "Agent Connection Lost",
      description: "Analytics Agent disconnected unexpectedly",
      timestamp: "2024-01-15T14:15:00Z",
      severity: "high"
    }
  ];

  const performanceHistory = [
    { time: "14:00", cpu: 45, memory: 62, tasks: 18 },
    { time: "14:15", cpu: 52, memory: 68, tasks: 20 },
    { time: "14:30", cpu: 58, memory: 71, tasks: 22 },
    { time: "14:45", cpu: 67, memory: 78, tasks: 23 },
    { time: "15:00", cpu: 61, memory: 75, tasks: 21 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "inactive":
        return <StopCircle className="h-5 w-5 text-gray-500" />;
      case "running":
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Tasks", href: "/dashboard/ceo/tasks" },
          { label: "Monitor", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Task Monitor</h1>
              </div>
              <p className="text-muted-foreground">
                Real-time task monitoring and system performance tracking
              </p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="5min">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1min">1 min</SelectItem>
                  <SelectItem value="5min">5 min</SelectItem>
                  <SelectItem value="15min">15 min</SelectItem>
                  <SelectItem value="30min">30 min</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{systemMetrics.cpu.usage}%</p>
                  <p className="text-xs text-muted-foreground">CPU Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{systemMetrics.memory.usage}%</p>
                  <p className="text-xs text-muted-foreground">Memory Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{systemMetrics.storage.usage}%</p>
                  <p className="text-xs text-muted-foreground">Storage Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{systemMetrics.network.latency}ms</p>
                  <p className="text-xs text-muted-foreground">Network Latency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Monitor</TabsTrigger>
            <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* System Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system resource utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">CPU Usage</span>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.cpu.usage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpu.usage} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Memory Usage</span>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.memory.usage}%</span>
                    </div>
                    <Progress value={systemMetrics.memory.usage} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Storage Usage</span>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.storage.usage}%</span>
                    </div>
                    <Progress value={systemMetrics.storage.usage} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Network Bandwidth</span>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.network.bandwidth}%</span>
                    </div>
                    <Progress value={systemMetrics.network.bandwidth} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                  <CardDescription>System performance over the last hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceHistory.map((point, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{point.time}</span>
                        <div className="flex items-center gap-4">
                          <span>CPU: {point.cpu}%</span>
                          <span>Memory: {point.memory}%</span>
                          <span>Tasks: {point.tasks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Overall system status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="text-sm font-medium">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Agents</span>
                      <span className="text-sm font-medium">4/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Tasks</span>
                      <span className="text-sm font-medium">{activeTasks.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Status</CardTitle>
                  <CardDescription>Network connectivity and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Latency</span>
                      <span className="text-sm font-medium">{systemMetrics.network.latency}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Packets/sec</span>
                      <span className="text-sm font-medium">{(systemMetrics.network.packets / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bandwidth</span>
                      <span className="text-sm font-medium">{systemMetrics.network.bandwidth}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Storage Status</CardTitle>
                  <CardDescription>Storage utilization and health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Used</span>
                      <span className="text-sm font-medium">{systemMetrics.storage.total - systemMetrics.storage.available}GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Available</span>
                      <span className="text-sm font-medium">{systemMetrics.storage.available}GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total</span>
                      <span className="text-sm font-medium">{systemMetrics.storage.total}GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Health</span>
                      <Badge className="bg-green-100 text-green-800">Good</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agent Monitor Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid gap-6">
              {agentMetrics.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                          {agent.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription>
                            {agent.model} • {agent.tasks} active tasks • {agent.uptime} uptime
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        {getStatusBadge(agent.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">CPU Usage</span>
                        <div className="flex items-center gap-2">
                          <Progress value={agent.cpu} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{agent.cpu}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Memory Usage</span>
                        <div className="flex items-center gap-2">
                          <Progress value={agent.memory} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{agent.memory}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Efficiency</span>
                        <div className="flex items-center gap-2">
                          <Progress value={agent.efficiency} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{agent.efficiency}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Last Activity</span>
                        <p className="font-medium">{agent.lastActivity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {agent.status === 'active' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid gap-6">
              {activeTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <CardDescription>
                            {task.agent} • Started {formatDateTime(task.startedAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(task.status)}
                        <Badge className={task.priority === 'high' ? "bg-red-100 text-red-800" : task.priority === 'medium' ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">CPU Usage:</span>
                        <p className="font-medium">{task.cpu}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Memory Usage:</span>
                        <p className="font-medium">{task.memory}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ETA:</span>
                        <p className="font-medium">{formatDateTime(task.estimatedCompletion)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">1h 30m</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Performance
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button variant="outline" size="sm">
                          <StopCircle className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(alert.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={alert.severity === 'high' ? "bg-red-100 text-red-800" : alert.severity === 'medium' ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}>
                          {alert.severity}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 