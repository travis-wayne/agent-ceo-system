import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Database, Brain, Target, Zap, FileText, PieChart } from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";

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

  // Prepare stat cards data
  const statCards = [
    {
      title: "Data Sources",
      value: "4",
      description: "3 active, 1 pending",
      icon: Database,
      trend: null,
      trendUp: null,
    },
    {
      title: "Total Records",
      value: "2.5M",
      description: "+15% from last month",
      icon: BarChart3,
      trend: "+15% from last month",
      trendUp: true,
    },
    {
      title: "AI Insights",
      value: "28",
      description: "Generated this month",
      icon: Brain,
      trend: null,
      trendUp: null,
    },
    {
      title: "Accuracy Rate",
      value: "94.2%",
      description: "+2.1% from last month",
      icon: Target,
      trend: "+2.1% from last month",
      trendUp: true,
    },
  ];

  const headerActions = [
    {
      label: "AI Insights",
      variant: "outline" as const,
      icon: Brain,
    },
    {
      label: "Generate Report",
      variant: "default" as const,
      icon: FileText,
    },
  ];

  const tabs = [
    {
      value: "insights",
      label: "AI Insights",
      content: (
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
                        <StatusBadge status="info" size="sm">{insight.type}</StatusBadge>
                        <StatusBadge status="secondary" size="sm">
                          {insight.confidence}% Confidence
                        </StatusBadge>
                        <StatusBadge 
                          status={insight.impact === 'High' ? 'error' : 'warning'} 
                          size="sm"
                        >
                          {insight.impact} Impact
                        </StatusBadge>
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
      ),
    },
    {
      value: "sources",
      label: "Data Sources",
      content: (
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
                      <StatusBadge 
                        status={source.status === "connected" ? "success" : "warning"} 
                        size="sm"
                      >
                        {source.status === "connected" ? "Connected" : "Pending"}
                      </StatusBadge>
                      <StatusBadge 
                        status={
                          source.health === "excellent" ? "success" : 
                          source.health === "good" ? "info" : 
                          source.health === "warning" ? "warning" : "secondary"
                        } 
                        size="sm"
                      >
                        {source.health === "excellent" ? "Excellent" : 
                         source.health === "good" ? "Good" : 
                         source.health === "warning" ? "Warning" : "Setup Required"}
                      </StatusBadge>
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
      ),
    },
    {
      value: "reports",
      label: "Reports",
      content: (
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
                    <StatusBadge 
                      status={report.status === "ready" ? "success" : "warning"} 
                      size="sm"
                    >
                      {report.status === "ready" ? "Ready" : "Generating"}
                    </StatusBadge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {report.status === "generating" ? "In progress..." : report.generated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "visualization",
      label: "Dashboards",
      content: (
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
      ),
    },
  ];

  return (
    <>
      <PageHeaderWithActions
        title="Data Analytics"
        description="AI-powered business intelligence and data analysis"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Data Analytics", isCurrentPage: true },
        ]}
        actions={headerActions}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Analytics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Data Analytics Tabs */}
        <TabbedContentLayout
          defaultValue="insights"
          tabs={tabs}
          className="space-y-4"
        />

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