import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Database, Brain, Target, Zap, FileText, PieChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Analytics | Agent CEO",
  description: "AI-powered business intelligence and data analysis",
};

export default function DataPage() {
  // Mock analytics data
  const insights = [
    {
      id: "insight-001",
      title: "Sales Performance Anomaly Detected",
      type: "Alert",
      confidence: 94,
      description: "Unusual 23% spike in conversion rates for enterprise segment suggests process optimization opportunity.",
      impact: "High",
      action: "Investigate process changes in enterprise sales team",
      date: "2024-01-15"
    },
    {
      id: "insight-002",
      title: "Customer Behavior Pattern Shift",
      type: "Trend",
      confidence: 87,
      description: "45% increase in mobile usage indicates need for mobile-first experience optimization.",
      impact: "Medium",
      action: "Prioritize mobile UX improvements",
      date: "2024-01-14"
    }
  ];

  const dataSources = [
    {
      name: "CRM Database",
      type: "Internal",
      status: "connected",
      records: "24,856",
      lastSync: "2 min ago",
      health: "excellent"
    },
    {
      name: "Email Analytics",
      type: "Integration", 
      status: "connected",
      records: "156,234",
      lastSync: "5 min ago",
      health: "good"
    },
    {
      name: "Website Analytics",
      type: "External",
      status: "connected", 
      records: "2,345,678",
      lastSync: "1 hour ago",
      health: "excellent"
    },
    {
      name: "Social Media",
      type: "External",
      status: "pending",
      records: "0",
      lastSync: "Never",
      health: "setup_required"
    }
  ];

  const reports = [
    {
      id: "report-001",
      name: "Monthly Business Review",
      type: "Executive Summary",
      generated: "2024-01-15",
      agent: "Analytics Agent",
      status: "ready",
      insights: 12,
      pages: 15
    },
    {
      id: "report-002",
      name: "Customer Segmentation Analysis",
      type: "Customer Intelligence",
      generated: "2024-01-14",
      agent: "Data Science Agent", 
      status: "ready",
      insights: 8,
      pages: 22
    },
    {
      id: "report-003",
      name: "Revenue Forecast Q2",
      type: "Financial Projection",
      generated: "In Progress",
      agent: "Forecasting Agent",
      status: "generating",
      insights: 0,
      pages: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="default" className="bg-green-500 text-white">Connected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "ready":
        return <Badge variant="default" className="bg-blue-500 text-white">Ready</Badge>;
      case "generating":
        return <Badge variant="secondary">Generating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "excellent":
        return <Badge variant="default" className="bg-green-500 text-white">Excellent</Badge>;
      case "good":
        return <Badge variant="default" className="bg-blue-500 text-white">Good</Badge>;
      case "warning":
        return <Badge variant="default" className="bg-yellow-500 text-white">Warning</Badge>;
      case "setup_required":
        return <Badge variant="outline">Setup Required</Badge>;
      default:
        return <Badge variant="outline">{health}</Badge>;
    }
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Data Analytics", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Data Analytics</h1>
            <p className="text-muted-foreground">
              AI-powered business intelligence and data analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Insights
            </Button>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">3 active, 1 pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5M</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Generated this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Analytics Tabs */}
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="visualization">Dashboards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Automated analysis and recommendations from your business data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{insight.type}</Badge>
                            <Badge variant="secondary">
                              {insight.confidence}% Confidence
                            </Badge>
                            <Badge variant={insight.impact === 'High' ? 'destructive' : 'secondary'}>
                              {insight.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{insight.date}</div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{insight.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Recommended Action:</div>
                          <div className="text-sm text-muted-foreground">{insight.action}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button size="sm">Take Action</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Manage your connected data sources and integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-muted-foreground">{source.type} • {source.records} records</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-2 mb-2">
                          {getStatusBadge(source.status)}
                          {getHealthBadge(source.health)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last sync: {source.lastSync}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Reports</CardTitle>
                <CardDescription>Automated business intelligence reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.type} • Generated by {report.agent}
                          </div>
                          {report.status === "ready" && (
                            <div className="text-sm text-muted-foreground">
                              {report.insights} insights • {report.pages} pages
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(report.status)}
                        <div className="text-sm text-muted-foreground mt-1">
                          {report.status === "generating" ? "In progress..." : report.generated}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization">
            <Card>
              <CardHeader>
                <CardTitle>Data Visualization</CardTitle>
                <CardDescription>Interactive dashboards and charts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Dashboards</h3>
                  <p className="text-muted-foreground">
                    Coming soon - Customizable dashboards with real-time data visualization
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Enhanced Data Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Your existing business data is being analyzed by AI agents. 
                  All current CRM data, customers, leads, and business information remain accessible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 