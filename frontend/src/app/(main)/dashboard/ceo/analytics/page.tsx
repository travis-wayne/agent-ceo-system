import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Upload,
  FileText,
  Database,
  Brain,
  Download,
  Play,
  RefreshCw,
  Eye,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  PieChart,
  LineChart,
  BarChart,
  Activity,
  Users,
  DollarSign,
  Star,
  Plus,
  Settings,
  Lightbulb,
  Award
} from "lucide-react";
import { InteractiveChart } from "@/components/data-analysis/interactive-chart";

export const metadata: Metadata = {
  title: "Data Analysis | Agent CEO",
  description: "Advanced data analysis, processing, and AI-powered insights for business intelligence",
};

export default function DataAnalysisPage() {
  // Data Analysis Overview
  const analyticsOverview = {
    summary: {
      totalAnalyses: 127,
      completedAnalyses: 98,
      activeAnalyses: 12,
      pendingAnalyses: 17,
      successRate: 94.2,
      avgProcessingTime: "3.4 minutes",
      totalDataProcessed: "847 GB",
      avgInsightQuality: 8.7
    },
    trends: {
      analysisVolume: { value: 15.2, direction: "up" },
      successRate: { value: 3.1, direction: "up" },
      processingSpeed: { value: 23.4, direction: "up" },
      insightQuality: { value: 8.7, direction: "stable" }
    }
  };

  // Recent Analysis Records
  const recentAnalyses = [
    {
      id: "analysis_1",
      title: "Q4 Customer Revenue Analysis",
      description: "Comprehensive analysis of customer revenue patterns",
      analysisType: "COMPREHENSIVE",
      dataSourceType: "FILE_UPLOAD",
      status: "completed",
      priority: "HIGH",
      tags: ["revenue", "customers", "q4"],
      confidenceScore: 0.94,
      businessImpact: 8.7,
      createdAt: "2024-01-15T09:30:00Z",
      processingTime: "4.2 minutes"
    },
    {
      id: "analysis_2",
      title: "Employee Productivity Trends",
      description: "Trend analysis of employee productivity metrics",
      analysisType: "TREND",
      dataSourceType: "DATABASE",
      status: "completed",
      priority: "MEDIUM",
      tags: ["productivity", "hr", "trends"],
      confidenceScore: 0.89,
      businessImpact: 7.8,
      createdAt: "2024-01-14T14:20:00Z",
      processingTime: "2.8 minutes"
    },
    {
      id: "analysis_3",
      title: "Market Anomaly Detection",
      description: "Detecting unusual patterns in market data",
      analysisType: "ANOMALY_DETECTION",
      dataSourceType: "API",
      status: "processing",
      priority: "URGENT",
      tags: ["market", "anomalies", "alerts"],
      confidenceScore: null,
      businessImpact: null,
      createdAt: "2024-01-16T11:15:00Z",
      processingTime: null
    }
  ];

  // Upload Sessions
  const uploadSessions = [
    {
      id: "upload_1",
      fileName: "business_data.csv",
      originalName: "Q4_Business_Analysis.csv",
      fileType: "CSV",
      fileSize: 2048576,
      status: "COMPLETED",
      progress: 100,
      uploadStarted: "2024-01-15T09:30:00Z",
      processingCompleted: "2024-01-15T09:35:00Z"
    },
    {
      id: "upload_2", 
      fileName: "employee_data.xlsx",
      originalName: "Employee_Productivity_2024.xlsx",
      fileType: "EXCEL",
      fileSize: 1536000,
      status: "PROCESSING",
      progress: 75,
      uploadStarted: "2024-01-16T14:20:00Z",
      processingCompleted: null
    }
  ];

  // Enhanced Analysis Types with new additions
  const analysisTypes = [
    { value: "DESCRIPTIVE", label: "Descriptive Analysis", description: "Statistical summaries and data exploration", complexity: "Medium", icon: BarChart3 },
    { value: "TREND", label: "Trend Analysis", description: "Time-series analysis and forecasting", complexity: "Medium", icon: LineChart },
    { value: "PREDICTIVE", label: "Predictive Modeling", description: "Machine learning predictions", complexity: "High", icon: Brain },
    { value: "COMPREHENSIVE", label: "Comprehensive Analysis", description: "Full statistical and AI analysis", complexity: "High", icon: Target },
    { value: "ANOMALY_DETECTION", label: "Anomaly Detection", description: "Identify unusual patterns", complexity: "High", icon: AlertCircle },
    { value: "BUSINESS_INTELLIGENCE", label: "Business Intelligence", description: "Strategic insights and KPIs", complexity: "Medium", icon: Lightbulb },
    { value: "COHORT", label: "Cohort Analysis", description: "Customer retention and lifecycle analysis", complexity: "Medium", icon: Users },
    { value: "SENTIMENT", label: "Sentiment Analysis", description: "Text sentiment and emotion analysis", complexity: "Medium", icon: Activity },
    { value: "CUSTOMER_SEGMENTATION", label: "Customer Segmentation", description: "ML-powered customer clustering", complexity: "High", icon: PieChart },
    { value: "FINANCIAL", label: "Financial Analysis", description: "Comprehensive financial metrics", complexity: "Medium", icon: DollarSign },
    { value: "CORRELATION", label: "Correlation Analysis", description: "Statistical relationship discovery", complexity: "Medium", icon: TrendingUp }
  ];

  // Sample chart data for visualizations
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Revenue",
      data: [125000, 142000, 158000, 167000, 189000, 203000],
      backgroundColor: ["#3b82f6"],
      borderColor: "#3b82f6"
    }]
  };

  const industryDistributionData = {
    labels: ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail"],
    datasets: [{
      label: "Companies",
      data: [312, 289, 267, 234, 145],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    }]
  };

  const cohortRetentionData = {
    labels: ["Month 1", "Month 3", "Month 6", "Month 12"],
    datasets: [{
      label: "Retention Rate",
      data: [87, 64, 45, 32],
      backgroundColor: ["#10b981"],
      borderColor: "#10b981"
    }]
  };

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [{
      label: "Sentiment Distribution",
      data: [68, 22, 10],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"]
    }]
  };

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : direction === "down" ? (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    ) : (
      <TrendingUp className="h-4 w-4 text-gray-500" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Data Analysis", isCurrentPage: true },
        ]}
      />
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                Data Analysis & Intelligence
              </h1>
              <p className="text-muted-foreground mt-2">
                Advanced data processing, AI-powered analysis, and business intelligence platform
              </p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="lg">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsOverview.summary.totalAnalyses}</p>
                  <p className="text-xs text-muted-foreground">Total Analyses</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(analyticsOverview.trends.analysisVolume.direction)}
                  <span className="text-sm font-medium text-green-600">
                    +{analyticsOverview.trends.analysisVolume.value}%
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{analyticsOverview.summary.completedAnalyses} completed</span>
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span>{analyticsOverview.summary.activeAnalyses} active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsOverview.summary.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(analyticsOverview.trends.successRate.direction)}
                  <span className="text-sm font-medium text-green-600">
                    +{analyticsOverview.trends.successRate.value}%
                  </span>
                </div>
              </div>
              <Progress value={analyticsOverview.summary.successRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsOverview.summary.totalDataProcessed}</p>
                  <p className="text-xs text-muted-foreground">Data Processed</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(analyticsOverview.trends.processingSpeed.direction)}
                  <span className="text-sm font-medium text-green-600">
                    +{analyticsOverview.trends.processingSpeed.value}%
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span>Avg: {analyticsOverview.summary.avgProcessingTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{analyticsOverview.summary.avgInsightQuality}/10</p>
                  <p className="text-xs text-muted-foreground">Insight Quality</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Excellent Quality
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs with enhanced content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="analysis">Analysis Types</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>
                    Latest data analysis operations and their status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(analysis.status)}
                        <div>
                          <p className="font-medium">{analysis.title}</p>
                          <p className="text-sm text-muted-foreground">{analysis.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {analysis.analysisType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {analysis.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {analysis.businessImpact && (
                          <p className="text-sm font-medium">{analysis.businessImpact}/10</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {analysis.processingTime || "Processing..."}
                        </p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Status</CardTitle>
                  <CardDescription>
                    File upload sessions and processing status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{session.originalName}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.fileType} • {formatFileSize(session.fileSize)}
                          </p>
                        </div>
                        <Badge variant={session.status === "COMPLETED" ? "default" : "secondary"}>
                          {session.status}
                        </Badge>
                      </div>
                      <Progress value={session.progress} className="mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {session.progress}% complete • Started {new Date(session.uploadStarted).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* New: Interactive Charts Overview */}
            <div className="grid gap-6 md:grid-cols-2">
              <InteractiveChart
                title="Revenue Trend Analysis"
                description="Monthly revenue progression with predictive forecasting"
                chartType="line"
                data={revenueChartData}
                height={300}
                showControls={true}
                showExport={true}
              />
              
              <InteractiveChart
                title="Industry Distribution"
                description="Customer base segmentation by industry"
                chartType="pie"
                data={industryDistributionData}
                height={300}
                showControls={true}
                showExport={true}
              />
            </div>
          </TabsContent>

          {/* Enhanced Analysis Types Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {analysisTypes.map((type) => (
                <Card key={type.value} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <type.icon className="h-5 w-5 text-primary" />
                      {type.label}
                    </CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Processing Time:</span>
                        <span className="font-medium">
                          {type.complexity === "High" ? "5-8 minutes" : 
                           type.complexity === "Medium" ? "2-5 minutes" : "1-2 minutes"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Complexity:</span>
                        <Badge variant={
                          type.complexity === "High" ? "destructive" : 
                          type.complexity === "Medium" ? "default" : "secondary"
                        }>
                          {type.complexity}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Output Format:</span>
                        <span className="font-medium">
                          {type.value === "COHORT" ? "Tables + Charts" :
                           type.value === "SENTIMENT" ? "Metrics + Topics" :
                           type.value === "FINANCIAL" ? "Ratios + KPIs" :
                           "Charts + Insights"}
                        </span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Start {type.label}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Analysis Type Explanations */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Type Details</CardTitle>
                <CardDescription>
                  Comprehensive guide to our advanced analysis capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        Cohort Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Tracks customer behavior over time to understand retention patterns, lifetime value, and churn rates across different customer cohorts.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Customer Retention</Badge>
                        <Badge variant="outline" className="text-xs">Lifecycle Analysis</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        Sentiment Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Natural language processing to analyze sentiment in customer feedback, reviews, and communications for brand perception insights.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">NLP Processing</Badge>
                        <Badge variant="outline" className="text-xs">Brand Perception</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <PieChart className="h-4 w-4 text-purple-500" />
                        Customer Segmentation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Machine learning clustering to identify distinct customer segments based on behavior, demographics, and transaction patterns.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">ML Clustering</Badge>
                        <Badge variant="outline" className="text-xs">RFM Analysis</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                        Financial Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive financial health assessment including profitability, liquidity, efficiency, and leverage ratios with trend analysis.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Financial Ratios</Badge>
                        <Badge variant="outline" className="text-xs">Cash Flow</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        Correlation Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Statistical analysis to discover relationships between variables and identify key business drivers and dependencies.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Statistical Relationships</Badge>
                        <Badge variant="outline" className="text-xs">Driver Analysis</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Anomaly Detection
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced algorithms to identify unusual patterns, outliers, and anomalies that may indicate opportunities or risks.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Outlier Detection</Badge>
                        <Badge variant="outline" className="text-xs">Pattern Recognition</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New: Visualizations Tab */}
          <TabsContent value="visualizations" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <InteractiveChart
                  title="Cohort Retention Analysis"
                  description="Customer retention rates across different time periods"
                  chartType="line"
                  data={cohortRetentionData}
                  height={300}
                />
                
                <InteractiveChart
                  title="Sentiment Distribution"
                  description="Overall sentiment analysis of customer feedback"
                  chartType="pie"
                  data={sentimentData}
                  height={300}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Visualization Options</CardTitle>
                  <CardDescription>
                    Customize and export professional data visualizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                      <h4 className="font-medium mb-2">Statistical Charts</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Bar charts, histograms, box plots for statistical analysis
                      </p>
                      <Button variant="outline" size="sm">Create Chart</Button>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <LineChart className="h-8 w-8 mx-auto mb-3 text-green-500" />
                      <h4 className="font-medium mb-2">Time Series</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Trend lines, forecasting, seasonal decomposition
                      </p>
                      <Button variant="outline" size="sm">Create Chart</Button>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <PieChart className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                      <h4 className="font-medium mb-2">Distribution</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pie charts, donut charts, treemaps for proportions
                      </p>
                      <Button variant="outline" size="sm">Create Chart</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive view of completed analyses with interactive insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Analysis Results with Visualizations */}
                  {recentAnalyses.filter(a => a.status === "completed").map((analysis) => (
                    <div key={analysis.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {analysis.analysisType === "COMPREHENSIVE" && <Target className="h-5 w-5 text-blue-500" />}
                            {analysis.analysisType === "TREND" && <LineChart className="h-5 w-5 text-green-500" />}
                            {analysis.analysisType === "COHORT" && <Users className="h-5 w-5 text-purple-500" />}
                            {analysis.title}
                          </h3>
                          <p className="text-muted-foreground">{analysis.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{analysis.analysisType}</Badge>
                          <Badge variant={analysis.priority === "HIGH" ? "destructive" : "secondary"}>
                            {analysis.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Enhanced metrics grid */}
                      <div className="grid gap-4 md:grid-cols-4 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{analysis.confidenceScore}</p>
                          <p className="text-sm text-blue-700">Confidence Score</p>
                          <div className="mt-1">
                            <Progress value={analysis.confidenceScore * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{analysis.businessImpact}/10</p>
                          <p className="text-sm text-green-700">Business Impact</p>
                          <div className="mt-1 flex justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < Math.floor(analysis.businessImpact / 2) ? 'text-green-500 fill-green-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{analysis.processingTime}</p>
                          <p className="text-sm text-yellow-700">Processing Time</p>
                          <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700">
                            {analysis.analysisType === "COMPREHENSIVE" ? "Complex" : "Standard"}
                          </Badge>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-purple-700">Analysis Date</p>
                          <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700">
                            Recent
                          </Badge>
                        </div>
                      </div>

                      {/* Action buttons with enhanced options */}
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Interactive Charts
                        </Button>
                        <Button variant="outline" size="sm">
                          <Brain className="h-4 w-4 mr-2" />
                          AI Insights
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-run Analysis
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>
                  Download and share comprehensive analysis reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Q4 Revenue Analysis Executive Summary</h4>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Executive summary of Q4 customer revenue analysis with key insights
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Generated: Jan 15, 2024</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Employee Productivity Detailed Analysis</h4>
                      <Badge variant="outline">Excel</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive analysis with raw data and statistical breakdowns
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Generated: Jan 14, 2024</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    AI-Generated Insights
                  </CardTitle>
                  <CardDescription>
                    Key insights and patterns discovered by AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Revenue Trend Discovery</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Strong positive correlation (r=0.87) between employee count and revenue indicates scalable business model.
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Confidence: 94%</Badge>
                      <span className="text-xs text-blue-600">Impact: 8.7/10</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Market Opportunity</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Technology and Healthcare sectors represent 48.2% of dataset with highest profit margins.
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Confidence: 99%</Badge>
                      <span className="text-xs text-green-600">Impact: 7.8/10</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Anomaly Alert</span>
                    </div>
                    <p className="text-sm text-yellow-800">
                      23 companies show exceptional revenue outliers that require investigation for best practices.
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Confidence: 86%</Badge>
                      <span className="text-xs text-yellow-600">Impact: 8.5/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>
                    Actionable recommendations based on analysis results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Focus on High-Revenue Outliers</h4>
                      <Badge variant="destructive">HIGH</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Investigate the 23 companies with exceptional revenue for best practices
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Impact: 8.5/10 • Effort: Medium</span>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Implement
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Industry Segmentation Strategy</h4>
                      <Badge variant="secondary">MEDIUM</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Develop targeted approaches for Technology and Healthcare sectors
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Impact: 7.2/10 • Effort: Low</span>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Implement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Analysis Actions
            </CardTitle>
            <CardDescription>
              Launch common analysis workflows and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Button variant="outline" className="h-20 flex-col">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Upload & Analyze</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Cohort Analysis</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Activity className="h-6 w-6 mb-2" />
                <span className="text-sm">Sentiment Check</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-sm">Financial Health</span>
              </Button>
              <Button className="h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm">New Analysis</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
} 