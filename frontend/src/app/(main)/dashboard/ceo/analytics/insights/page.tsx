import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Lightbulb,
  TrendingUp,
  Target,
  AlertCircle,
  Award,
  Play,
  Star,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  RefreshCw,
  Filter,
  Download,
  Share2,
  BookOpen
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Insights | Agent CEO Analytics",
  description: "AI-powered insights, patterns, and actionable recommendations from your data",
};

export default function AnalyticsInsightsPage() {
  const aiInsights = [
    {
      id: "insight_1",
      title: "Revenue Growth Acceleration",
      description: "Strong positive correlation (r=0.87) between employee count and revenue indicates scalable business model",
      type: "trend",
      category: "Revenue",
      confidence: 94,
      impact: 8.7,
      priority: "high",
      status: "active",
      generatedAt: "2024-01-15T09:30:00Z",
      tags: ["revenue", "growth", "scaling", "correlation"]
    },
    {
      id: "insight_2",
      title: "Market Opportunity Discovery",
      description: "Technology and Healthcare sectors represent 48.2% of dataset with highest profit margins",
      type: "opportunity",
      category: "Market",
      confidence: 99,
      impact: 7.8,
      priority: "high",
      status: "active",
      generatedAt: "2024-01-14T14:20:00Z",
      tags: ["market", "opportunity", "sectors", "profit"]
    },
    {
      id: "insight_3",
      title: "Customer Retention Pattern",
      description: "Customers acquired through referrals show 34% higher lifetime value and 67% better retention",
      type: "pattern",
      category: "Customer",
      confidence: 91,
      impact: 8.2,
      priority: "medium",
      status: "active",
      generatedAt: "2024-01-13T11:45:00Z",
      tags: ["retention", "referrals", "ltv", "customer"]
    },
    {
      id: "insight_4",
      title: "Operational Efficiency Anomaly",
      description: "23 companies show exceptional revenue outliers that require investigation for best practices",
      type: "anomaly",
      category: "Operations",
      confidence: 86,
      impact: 8.5,
      priority: "urgent",
      status: "investigating",
      generatedAt: "2024-01-12T16:30:00Z",
      tags: ["efficiency", "outliers", "best-practices", "investigation"]
    },
    {
      id: "insight_5",
      title: "Seasonal Demand Prediction",
      description: "Q4 consistently shows 23% higher demand with 89% accuracy in predictive models",
      type: "prediction",
      category: "Demand",
      confidence: 89,
      impact: 7.3,
      priority: "medium",
      status: "active",
      generatedAt: "2024-01-11T10:15:00Z",
      tags: ["seasonal", "demand", "prediction", "q4"]
    }
  ];

  const recommendations = [
    {
      id: "rec_1",
      title: "Focus on High-Revenue Outliers",
      description: "Investigate the 23 companies with exceptional revenue for best practices and replicable strategies",
      priority: "high",
      impact: 8.5,
      effort: "medium",
      timeline: "2-3 weeks",
      status: "pending",
      category: "Operations",
      expectedRoi: "340%"
    },
    {
      id: "rec_2",
      title: "Industry Segmentation Strategy",
      description: "Develop targeted approaches for Technology and Healthcare sectors based on profit margin analysis",
      priority: "medium",
      impact: 7.2,
      effort: "low",
      timeline: "1-2 weeks",
      status: "pending",
      category: "Market",
      expectedRoi: "220%"
    },
    {
      id: "rec_3",
      title: "Referral Program Enhancement",
      description: "Expand referral programs based on 34% higher LTV and 67% better retention data",
      priority: "high",
      impact: 8.2,
      effort: "medium",
      timeline: "3-4 weeks",
      status: "in_progress",
      category: "Customer",
      expectedRoi: "280%"
    },
    {
      id: "rec_4",
      title: "Q4 Demand Preparation",
      description: "Prepare for 23% Q4 demand increase with inventory and staffing adjustments",
      priority: "medium",
      impact: 7.3,
      effort: "high",
      timeline: "8-10 weeks",
      status: "pending",
      category: "Operations",
      expectedRoi: "150%"
    }
  ];

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "opportunity":
        return <Target className="h-5 w-5 text-green-600" />;
      case "pattern":
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      case "anomaly":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "prediction":
        return <Brain className="h-5 w-5 text-indigo-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case "trend":
        return "bg-blue-50 border-blue-200";
      case "opportunity":
        return "bg-green-50 border-green-200";
      case "pattern":
        return "bg-purple-50 border-purple-200";
      case "anomaly":
        return "bg-yellow-50 border-yellow-200";
      case "prediction":
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
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
          { label: "AI Insights", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">AI-Powered Insights</h1>
              </div>
              <p className="text-muted-foreground">
                Discover patterns, trends, and actionable recommendations from your business data
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Generate Insights
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{aiInsights.length}</p>
                  <p className="text-xs text-muted-foreground">Active Insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                  <p className="text-xs text-muted-foreground">Recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">91%</p>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">8.1</p>
                  <p className="text-xs text-muted-foreground">Avg Impact Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          </TabsList>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Generated Insights</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6">
              {aiInsights.map((insight) => (
                <Card key={insight.id} className={`border-l-4 ${getInsightTypeColor(insight.type)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getInsightTypeIcon(insight.type)}
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription className="mt-1 text-base">
                            {insight.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                        <Badge className={getStatusColor(insight.status)}>
                          {insight.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Confidence</span>
                          <span className="font-medium">{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Impact Score</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{insight.impact}/10</span>
                          </div>
                        </div>
                        <Progress value={insight.impact * 10} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Category</span>
                          <Badge variant="outline">{insight.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-1">
                        {insight.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Actionable Recommendations</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-purple-500 mt-1" />
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1 text-base">
                            {rec.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        <Badge className={getStatusColor(rec.status)}>
                          {rec.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Impact Score</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{rec.impact}/10</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Effort</span>
                        <span className="font-medium capitalize">{rec.effort}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Timeline</span>
                        <span className="font-medium">{rec.timeline}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Expected ROI</span>
                        <span className="font-medium text-green-600">{rec.expectedRoi}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <Badge variant="outline">{rec.category}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Implement
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pattern Analysis Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pattern Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Advanced pattern recognition and trend analysis coming soon
              </p>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Enable Pattern Analysis
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
} 