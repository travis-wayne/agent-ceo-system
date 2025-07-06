"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Brain,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Zap,
  Shield,
  Globe,
  FileText
} from "lucide-react";

interface AnalyticsData {
  totalAnalyses: number;
  completedAnalyses: number;
  averageConfidenceScore: number;
  averageBusinessImpact: number;
  totalStrategicPlans: number;
  activeStrategicPlans: number;
  averageSuccessProbability: number;
  totalBusinessContexts: number;
  performanceMetrics: PerformanceMetric[];
  analysisTypeDistribution: AnalysisTypeData[];
  monthlyTrends: TrendData[];
  topPerformingAnalyses: TopAnalysis[];
  riskAssessment: RiskData[];
  strategicInsights: Insight[];
}

interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
}

interface AnalysisTypeData {
  type: string;
  count: number;
  successRate: number;
  averageTime: number;
}

interface TrendData {
  month: string;
  analyses: number;
  successRate: number;
  averageImpact: number;
}

interface TopAnalysis {
  id: string;
  title: string;
  type: string;
  confidenceScore: number;
  businessImpact: number;
  createdAt: Date;
}

interface RiskData {
  category: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  trend: 'up' | 'down' | 'stable';
}

interface Insight {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
}

export default function StrategicAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard/ceo" },
    { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
    { label: "Analytics", href: "/dashboard/ceo/strategic/analytics" }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        totalAnalyses: 156,
        completedAnalyses: 142,
        averageConfidenceScore: 0.847,
        averageBusinessImpact: 7.8,
        totalStrategicPlans: 23,
        activeStrategicPlans: 18,
        averageSuccessProbability: 0.765,
        totalBusinessContexts: 8,
        performanceMetrics: [
          {
            name: 'Analysis Completion Rate',
            current: 91.0,
            target: 95.0,
            trend: 'up',
            change: 5.2,
            unit: '%'
          },
          {
            name: 'Average Confidence Score',
            current: 84.7,
            target: 90.0,
            trend: 'up',
            change: 2.1,
            unit: '%'
          },
          {
            name: 'Business Impact Score',
            current: 7.8,
            target: 8.5,
            trend: 'stable',
            change: 0.1,
            unit: '/10'
          },
          {
            name: 'Strategic Plan Success Rate',
            current: 76.5,
            target: 80.0,
            trend: 'up',
            change: 3.8,
            unit: '%'
          }
        ],
        analysisTypeDistribution: [
          { type: 'SWOT Analysis', count: 45, successRate: 0.89, averageTime: 156 },
          { type: 'Competitive Analysis', count: 38, successRate: 0.84, averageTime: 234 },
          { type: 'Market Analysis', count: 32, successRate: 0.91, averageTime: 312 },
          { type: 'Financial Analysis', count: 28, successRate: 0.93, averageTime: 189 },
          { type: 'Risk Assessment', count: 13, successRate: 0.77, averageTime: 267 }
        ],
        monthlyTrends: [
          { month: 'Jan', analyses: 12, successRate: 0.83, averageImpact: 7.2 },
          { month: 'Feb', analyses: 15, successRate: 0.87, averageImpact: 7.5 },
          { month: 'Mar', analyses: 18, successRate: 0.89, averageImpact: 7.8 },
          { month: 'Apr', analyses: 22, successRate: 0.91, averageImpact: 8.1 },
          { month: 'May', analyses: 25, successRate: 0.88, averageImpact: 7.9 },
          { month: 'Jun', analyses: 28, successRate: 0.92, averageImpact: 8.3 }
        ],
        topPerformingAnalyses: [
          {
            id: 'ta_1',
            title: 'Q2 2024 Market Expansion Strategy',
            type: 'market_analysis',
            confidenceScore: 0.94,
            businessImpact: 9.2,
            createdAt: new Date('2024-05-15')
          },
          {
            id: 'ta_2',
            title: 'Competitive Positioning Analysis',
            type: 'competitive_analysis',
            confidenceScore: 0.91,
            businessImpact: 8.8,
            createdAt: new Date('2024-05-12')
          },
          {
            id: 'ta_3',
            title: 'Digital Transformation SWOT',
            type: 'swot_analysis',
            confidenceScore: 0.89,
            businessImpact: 8.6,
            createdAt: new Date('2024-05-08')
          }
        ],
        riskAssessment: [
          { category: 'Market Risks', level: 'medium', count: 8, trend: 'stable' },
          { category: 'Competitive Risks', level: 'high', count: 5, trend: 'up' },
          { category: 'Financial Risks', level: 'low', count: 12, trend: 'down' },
          { category: 'Operational Risks', level: 'medium', count: 7, trend: 'stable' },
          { category: 'Technology Risks', level: 'high', count: 3, trend: 'up' }
        ],
        strategicInsights: [
          {
            id: 'si_1',
            title: 'Market Expansion Opportunity',
            description: 'Analysis indicates 67% success probability for European market entry',
            priority: 'high',
            category: 'Growth',
            actionable: true
          },
          {
            id: 'si_2',
            title: 'Competitive Threat Alert',
            description: 'New competitor entered market with 15% price reduction strategy',
            priority: 'high',
            category: 'Competition',
            actionable: true
          },
          {
            id: 'si_3',
            title: 'Cost Optimization Potential',
            description: 'Operations analysis shows 12% cost reduction opportunity',
            priority: 'medium',
            category: 'Efficiency',
            actionable: true
          }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'swot_analysis': return <Target className="h-4 w-4" />;
      case 'competitive_analysis': return <Users className="h-4 w-4" />;
      case 'market_analysis': return <TrendingUp className="h-4 w-4" />;
      case 'financial_analysis': return <DollarSign className="h-4 w-4" />;
      case 'risk_assessment': return <Shield className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Strategic Analytics"
          description="Comprehensive analytics and insights for strategic intelligence"
          breadcrumbItems={breadcrumbItems}
        />
        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </>
    );
  }

  if (!analyticsData) {
    return (
      <>
        <PageHeader
          title="Strategic Analytics"
          description="Comprehensive analytics and insights for strategic intelligence"
          breadcrumbItems={breadcrumbItems}
        />
        <main className="flex-1 space-y-6 p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load analytics data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Strategic Analytics"
        description="Comprehensive analytics and insights for strategic intelligence"
        breadcrumbItems={breadcrumbItems}
      />

      <main className="flex-1 space-y-6 p-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAnalyticsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.completedAnalyses} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(analyticsData.averageConfidenceScore * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.averageBusinessImpact}/10
              </div>
              <p className="text-xs text-muted-foreground">
                Average impact score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strategic Plans</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalStrategicPlans}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.activeStrategicPlans} active
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators and targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.performanceMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <span className="text-sm text-muted-foreground">
                              {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(metric.current / metric.target) * 100} className="flex-1" />
                          <span className="text-sm font-bold">
                            {metric.current}{metric.unit}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target: {metric.target}{metric.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Type Distribution</CardTitle>
                  <CardDescription>Breakdown by analysis type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.analysisTypeDistribution.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getAnalysisTypeIcon(type.type.toLowerCase().replace(' ', '_'))}
                          <span className="text-sm font-medium">{type.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{type.count}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(type.successRate * 100)}% success
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Analyses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Analyses</CardTitle>
                <CardDescription>Highest impact and confidence analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPerformingAnalyses.map((analysis, index) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{analysis.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.type.replace('_', ' ')} • {analysis.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {Math.round(analysis.confidenceScore * 100)}% confidence
                          </Badge>
                          <Badge variant="outline">
                            {analysis.businessImpact}/10 impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate Trends</CardTitle>
                  <CardDescription>Analysis completion over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.monthlyTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">{trend.analyses} analyses</span>
                          <Progress value={trend.successRate * 100} className="w-20" />
                          <span className="text-sm font-bold">
                            {Math.round(trend.successRate * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Score Trends</CardTitle>
                  <CardDescription>Average business impact over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.monthlyTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.month}</span>
                        <div className="flex items-center gap-4">
                          <Progress value={(trend.averageImpact / 10) * 100} className="w-20" />
                          <span className="text-sm font-bold">
                            {trend.averageImpact}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Trends</CardTitle>
                <CardDescription>Monthly analysis volume and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+23%</div>
                      <div className="text-sm text-muted-foreground">Analysis Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">+5.2%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">+8.1%</div>
                      <div className="text-sm text-muted-foreground">Avg Impact</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analyticsData.monthlyTrends.map((trend, index) => (
                      <div key={index} className="grid gap-4 md:grid-cols-3 p-3 border rounded">
                        <div>
                          <div className="font-medium">{trend.month}</div>
                          <div className="text-sm text-muted-foreground">
                            {trend.analyses} analyses
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Success Rate</div>
                          <div className="flex items-center gap-2">
                            <Progress value={trend.successRate * 100} className="flex-1" />
                            <span className="text-sm">{Math.round(trend.successRate * 100)}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Avg Impact</div>
                          <div className="flex items-center gap-2">
                            <Progress value={(trend.averageImpact / 10) * 100} className="flex-1" />
                            <span className="text-sm">{trend.averageImpact}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Overview</CardTitle>
                <CardDescription>Current risk levels across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.riskAssessment.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{risk.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {risk.count} identified risks
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskLevelColor(risk.level)}>
                          {risk.level}
                        </Badge>
                        {getTrendIcon(risk.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Insights</CardTitle>
                <CardDescription>AI-generated insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.strategicInsights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          <div className="font-medium">{insight.title}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline">{insight.category}</Badge>
                          {insight.actionable && (
                            <Badge variant="outline">
                              <Zap className="h-3 w-3 mr-1" />
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {insight.actionable && (
                          <Button variant="outline" size="sm">
                            <Target className="h-4 w-4 mr-2" />
                            Create Action Plan
                          </Button>
                        )}
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