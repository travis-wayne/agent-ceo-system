import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bot, TrendingUp, Users, Cog, BarChart3, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents | Agent CEO",
  description: "Manage your AI agents for business automation and strategic intelligence",
};

export default function AgentsPage() {
  // Mock agent data - will be replaced with real API
  const agents = [
    {
      id: "ceo-001",
      name: "Strategic CEO Agent",
      type: "CEO Agent",
      status: "active",
      description: "Strategic planning and decision-making",
      tasksCompleted: 156,
      successRate: 94,
      lastActive: "2 minutes ago",
      capabilities: ["Strategic Analysis", "Decision Support", "Market Intelligence"]
    },
    {
      id: "sales-001", 
      name: "Sales Automation Agent",
      type: "Sales Agent",
      status: "active",
      description: "Lead generation and sales automation",
      tasksCompleted: 89,
      successRate: 87,
      lastActive: "5 minutes ago",
      capabilities: ["Lead Generation", "Email Sequences", "CRM Management"]
    },
    {
      id: "marketing-001",
      name: "Content Marketing Agent", 
      type: "Marketing Agent",
      status: "idle",
      description: "Content creation and campaign management",
      tasksCompleted: 203,
      successRate: 91,
      lastActive: "1 hour ago",
      capabilities: ["Content Creation", "Social Media", "SEO Optimization"]
    }
  ];

  const agentTypes = [
    {
      type: "CEO Agent",
      description: "Strategic planning and decision-making",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      type: "Sales Agent", 
      description: "Lead generation and sales automation",
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      type: "Marketing Agent",
      description: "Content creation and campaign management", 
      icon: <Zap className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      type: "Operations Agent",
      description: "Process automation and optimization",
      icon: <Cog className="h-6 w-6" />,
      color: "bg-orange-500"
    },
    {
      type: "Analytics Agent",
      description: "Data analysis and reporting",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-red-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
      case "idle": 
        return <Badge variant="secondary">Idle</Badge>;
      case "offline":
        return <Badge variant="outline">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Agents", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Agents</h1>
            <p className="text-muted-foreground">
              Manage your AI agents for business automation and strategic intelligence
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </div>

        {/* Agent Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">448</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4s</div>
              <p className="text-xs text-muted-foreground">-0.3s from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Your AI Agents</CardTitle>
            <CardDescription>Manage and monitor your AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.description}</div>
                      <div className="flex gap-2 mt-1">
                        {agent.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(agent.status)}
                    <div className="text-sm text-muted-foreground mt-1">
                      {agent.tasksCompleted} tasks • {agent.successRate}% success
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last active: {agent.lastActive}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Agent Types</CardTitle>
            <CardDescription>Choose from different AI agent specializations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agentTypes.map((agentType) => (
                <div key={agentType.type} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-8 w-8 rounded-full ${agentType.color} flex items-center justify-center text-white`}>
                      {agentType.icon}
                    </div>
                    <div className="font-medium">{agentType.type}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{agentType.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 