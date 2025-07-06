import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveChart } from "@/components/data-analysis/interactive-chart";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Download,
  Share2,
  Settings,
  RefreshCw,
  Maximize2,
  Filter,
  Plus,
  Eye,
  Grid3x3,
  Layout,
  Zap,
  Target,
  Activity,
  Users,
  DollarSign
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Visualizations | Agent CEO Analytics",
  description: "Interactive charts, graphs, and visual analytics for business intelligence",
};

export default function AnalyticsVisualizationsPage() {
  const chartConfigs = [
    {
      id: "revenue_trend",
      title: "Revenue Trend Analysis",
      description: "Monthly revenue growth and forecasting",
      type: "line",
      category: "Revenue",
      status: "active",
      lastUpdated: "2024-01-15T09:30:00Z",
      dataPoints: 12,
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Revenue",
          data: [125000, 142000, 158000, 167000, 189000, 203000, 221000, 238000, 255000, 272000, 289000, 306000],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true
        }]
      }
    },
    {
      id: "customer_segments",
      title: "Customer Segmentation",
      description: "Customer distribution by industry and size",
      type: "pie",
      category: "Customer",
      status: "active",
      lastUpdated: "2024-01-14T14:20:00Z",
      dataPoints: 5,
      chartData: {
        labels: ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail"],
        datasets: [{
          data: [312, 289, 267, 234, 145],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
        }]
      }
    },
    {
      id: "performance_metrics",
      title: "Performance Metrics Dashboard",
      description: "Key performance indicators and metrics",
      type: "bar",
      category: "Performance",
      status: "active",
      lastUpdated: "2024-01-13T11:45:00Z",
      dataPoints: 8,
      chartData: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Revenue",
            data: [450000, 520000, 580000, 650000],
            backgroundColor: "#3b82f6"
          },
          {
            label: "Profit",
            data: [120000, 145000, 165000, 190000],
            backgroundColor: "#10b981"
          }
        ]
      }
    },
    {
      id: "user_activity",
      title: "User Activity Heatmap",
      description: "User engagement patterns and activity trends",
      type: "heatmap",
      category: "Activity",
      status: "active",
      lastUpdated: "2024-01-12T16:30:00Z",
      dataPoints: 168,
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Activity",
          data: [
            [0, 0, 45], [0, 1, 62], [0, 2, 78], [0, 3, 89], [0, 4, 95], [0, 5, 87], [0, 6, 72],
            [1, 0, 52], [1, 1, 68], [1, 2, 85], [1, 3, 94], [1, 4, 98], [1, 5, 91], [1, 6, 76],
            [2, 0, 48], [2, 1, 65], [2, 2, 82], [2, 3, 91], [2, 4, 96], [2, 5, 88], [2, 6, 73],
            [3, 0, 55], [3, 1, 71], [3, 2, 88], [3, 3, 97], [3, 4, 99], [3, 5, 94], [3, 6, 79],
            [4, 0, 51], [4, 1, 67], [4, 2, 84], [4, 3, 93], [4, 4, 97], [4, 5, 90], [4, 6, 75],
            [5, 0, 32], [5, 1, 45], [5, 2, 58], [5, 3, 67], [5, 4, 72], [5, 5, 65], [5, 6, 48],
            [6, 0, 28], [6, 1, 41], [6, 2, 54], [6, 3, 63], [6, 4, 68], [6, 5, 61], [6, 6, 44]
          ]
        }]
      }
    }
  ];

  const dashboardLayouts = [
    { id: "grid", name: "Grid Layout", icon: Grid3x3 },
    { id: "masonry", name: "Masonry Layout", icon: Layout },
    { id: "single", name: "Single View", icon: Maximize2 }
  ];

  const getChartIcon = (type: string) => {
    switch (type) {
      case "line":
        return <LineChart className="h-5 w-5 text-blue-500" />;
      case "bar":
        return <BarChart3 className="h-5 w-5 text-green-500" />;
      case "pie":
        return <PieChart className="h-5 w-5 text-purple-500" />;
      case "heatmap":
        return <Activity className="h-5 w-5 text-orange-500" />;
      default:
        return <BarChart3 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Revenue":
        return "bg-blue-100 text-blue-800";
      case "Customer":
        return "bg-green-100 text-green-800";
      case "Performance":
        return "bg-purple-100 text-purple-800";
      case "Activity":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Analytics", href: "/dashboard/ceo/analytics" },
          { label: "Visualizations", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Data Visualizations</h1>
              </div>
              <p className="text-muted-foreground">
                Interactive charts, graphs, and visual analytics for business intelligence
              </p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="grid">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dashboardLayouts.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id}>
                      <div className="flex items-center gap-2">
                        <layout.icon className="h-4 w-4" />
                        {layout.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Chart
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{chartConfigs.length}</p>
                  <p className="text-xs text-muted-foreground">Active Charts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">847</p>
                  <p className="text-xs text-muted-foreground">Data Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Dashboards</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-xs text-muted-foreground">Views Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="charts">Interactive Charts</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="builder">Chart Builder</TabsTrigger>
          </TabsList>

          {/* Interactive Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Chart Gallery</h2>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="line">Line Charts</SelectItem>
                    <SelectItem value="bar">Bar Charts</SelectItem>
                    <SelectItem value="pie">Pie Charts</SelectItem>
                    <SelectItem value="heatmap">Heatmaps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {chartConfigs.map((chart) => (
                <Card key={chart.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getChartIcon(chart.type)}
                        <div>
                          <CardTitle className="text-lg">{chart.title}</CardTitle>
                          <CardDescription>{chart.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(chart.category)}>
                        {chart.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                        <p>Chart Preview</p>
                        <p className="text-sm">{chart.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Data Points:</span>
                        <span className="font-medium">{chart.dataPoints}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline" className="text-xs">
                          {chart.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        Updated: {new Date(chart.lastUpdated).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Maximize2 className="h-4 w-4 mr-2" />
                          Fullscreen
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Dashboards Tab */}
          <TabsContent value="dashboards" className="space-y-6">
            <div className="text-center py-12">
              <Layout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Dashboards</h3>
              <p className="text-muted-foreground mb-4">
                Create and manage custom dashboard layouts with your favorite charts
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Dashboard
              </Button>
            </div>
          </TabsContent>

          {/* Chart Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Chart Builder
                </CardTitle>
                <CardDescription>
                  Create custom visualizations from your data sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="chart-title">Chart Title</Label>
                    <Input id="chart-title" placeholder="Enter chart title..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Chart Type</Label>
                    <Select defaultValue="bar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="scatter">Scatter Plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <Select defaultValue="database">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="csv">CSV Upload</SelectItem>
                        <SelectItem value="api">API Endpoint</SelectItem>
                        <SelectItem value="manual">Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select defaultValue="performance">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
} 