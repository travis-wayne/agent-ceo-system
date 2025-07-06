"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import {
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Plus,
  Eye,
  FileText,
  Lightbulb,
  Shield,
  Zap,
  ArrowRight,
  Calendar,
  Award,
  Globe,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Layers,
  LineChart,
  PieChart,
  Activity
} from "lucide-react";

// Strategic Intelligence Types
interface AnalysisRecord {
  id: string;
  title: string;
  analysisType: string;
  status: string;
  confidenceScore?: number;
  businessImpact?: number;
  createdAt: Date;
  executionTimeSeconds?: number;
}

interface BusinessContext {
  id: string;
  name: string;
  companyName: string;
  industry: string;
  companySize: string;
  businessStage: string;
  completenessScore: number;
  confidenceLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StrategicPlan {
  id: string;
  title: string;
  timeHorizonMonths: number;
  status: string;
  successProbability: number;
  implementationProgress: number;
  createdAt: Date;
}

export default function StrategicIntelligencePage() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [businessContexts, setBusinessContexts] = useState<BusinessContext[]>([]);
  const [strategicPlans, setStrategicPlans] = useState<StrategicPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const router = useRouter();



  // Navigation functions
  const navigateToNewAnalysis = () => {
    router.push('/dashboard/ceo/strategic/new-analysis');
  };

  const navigateToNewPlan = () => {
    router.push('/dashboard/ceo/strategic/new-plan');
  };

  const navigateToContext = () => {
    router.push('/dashboard/ceo/strategic/context');
  };

  const navigateToAnalytics = () => {
    router.push('/dashboard/ceo/strategic/analytics');
  };

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Mock data - replace with actual API calls
      const mockAnalyses: AnalysisRecord[] = [
        {
          id: "ar_1",
          title: "Q4 2024 SWOT Analysis",
          analysisType: "swot_analysis",
          status: "completed",
          confidenceScore: 0.87,
          businessImpact: 8.5,
          createdAt: new Date(Date.now() - 86400000),
          executionTimeSeconds: 125.5,
        },
        {
          id: "ar_2",
          title: "Competitive Landscape Analysis",
          analysisType: "competitive_analysis",
          status: "completed",
          confidenceScore: 0.82,
          businessImpact: 7.8,
          createdAt: new Date(Date.now() - 172800000),
          executionTimeSeconds: 156.8,
        },
        {
          id: "ar_3",
          title: "Market Expansion Analysis",
          analysisType: "market_analysis",
          status: "in_progress",
          createdAt: new Date(Date.now() - 3600000),
        }
      ];

      const mockContexts: BusinessContext[] = [
        {
          id: "bc_1",
          name: "Q4 2024 Strategic Context",
          companyName: "TechCorp Inc",
          industry: "Technology",
          companySize: "medium_enterprise",
          businessStage: "growth",
          completenessScore: 0.85,
          confidenceLevel: 0.9,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const mockPlans: StrategicPlan[] = [
        {
          id: "sp_1",
          title: "2024-2025 Growth Strategy",
          timeHorizonMonths: 18,
          status: "approved",
          successProbability: 0.78,
          implementationProgress: 0.25,
          createdAt: new Date(Date.now() - 2592000000),
        }
      ];

      setAnalyses(mockAnalyses);
      setBusinessContexts(mockContexts);
      setStrategicPlans(mockPlans);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'swot_analysis': return <Target className="h-4 w-4" />;
      case 'competitive_analysis': return <Users className="h-4 w-4" />;
      case 'market_analysis': return <TrendingUp className="h-4 w-4" />;
      case 'financial_analysis': return <DollarSign className="h-4 w-4" />;
      case 'strategic_planning': return <Brain className="h-4 w-4" />;
      case 'decision_support': return <Lightbulb className="h-4 w-4" />;
      case 'risk_assessment': return <Shield className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getAnalysisTypeName = (type: string) => {
    const names: Record<string, string> = {
      swot_analysis: 'SWOT Analysis',
      competitive_analysis: 'Competitive Analysis',
      market_analysis: 'Market Analysis',
      financial_analysis: 'Financial Analysis',
      strategic_planning: 'Strategic Planning',
      decision_support: 'Decision Support',
      risk_assessment: 'Risk Assessment',
      scenario_planning: 'Scenario Planning'
    };
    return names[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      case 'failed': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const calculateOverallMetrics = () => {
    if (!analyses || analyses.length === 0) {
      return {
        totalAnalyses: 0,
        completedAnalyses: 0,
        completionRate: 0,
        avgConfidence: 0,
        avgImpact: 0
      };
    }

    const totalAnalyses = analyses.length;
    const completedAnalyses = analyses.filter(a => a.status === 'completed').length;
    const avgConfidence = analyses.reduce((sum, a) => sum + (a.confidenceScore || 0), 0) / totalAnalyses;
    const avgImpact = analyses.reduce((sum, a) => sum + (a.businessImpact || 0), 0) / totalAnalyses;
    
    return {
      totalAnalyses,
      completedAnalyses,
      completionRate: totalAnalyses > 0 ? (completedAnalyses / totalAnalyses) * 100 : 0,
      avgConfidence: avgConfidence * 100,
      avgImpact
    };
  };

  const metrics = calculateOverallMetrics();

  if (isLoading) {
    return (
        <><PageHeader
        items={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Intelligence", isCurrentPage: true }
        ]} /><main className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main></>
    );
  }

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Intelligence", isCurrentPage: true }
        ]}
      />

      <main className="flex-1 space-y-4 sm:space-y-6 px-1 xs:px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {/* Key Metrics */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.completedAnalyses} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(metrics.completionRate)}%</div>
              <p className="text-xs text-muted-foreground">
                Analysis success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(metrics.avgConfidence)}%</div>
              <p className="text-xs text-muted-foreground">
                Analysis confidence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgImpact.toFixed(1)}/10</div>
              <p className="text-xs text-muted-foreground">
                Average impact score
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-3 sm:space-y-4 md:space-y-6">
          <TabsList className="flex w-full overflow-x-auto gap-2 sm:gap-0 grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analyses">Business Analysis</TabsTrigger>
            <TabsTrigger value="planning">Strategic Planning</TabsTrigger>
            <TabsTrigger value="context">Business Context</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Analyses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Analyses
                  </CardTitle>
                  <CardDescription>
                    Latest strategic analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyses && analyses.length > 0 ? (
                      analyses.slice(0, 3).map((analysis) => (
                        <div key={analysis.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAnalysisTypeIcon(analysis.analysisType)}
                            <div>
                              <p className="text-sm font-medium">{analysis.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {analysis.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(analysis.status)}>
                            {analysis.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No analyses available
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={navigateToAnalytics}>
                    View All Analyses
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Strategic Plans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Strategic Plans
                  </CardTitle>
                  <CardDescription>
                    Active strategic plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {strategicPlans && strategicPlans.length > 0 ? (
                      strategicPlans.map((plan) => (
                        <div key={plan.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{plan.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {plan.timeHorizonMonths} months timeline
                              </p>
                            </div>
                            <Badge variant="secondary">{plan.status}</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round(plan.implementationProgress * 100)}%</span>
                            </div>
                            <Progress value={plan.implementationProgress * 100} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No strategic plans available
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={navigateToNewPlan}>
                    View All Plans
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Start new strategic analysis or planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
                    <Button 
                      variant="outline" 
                      className="h-14 sm:h-16 px-2 py-2 flex flex-col items-center justify-center text-center whitespace-normal break-words"
                      onClick={navigateToNewAnalysis}
                    >
                      <Target className="h-5 w-5 mb-1" />
                      <span className="text-[11px] sm:text-xs font-medium leading-tight">SWOT Analysis</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-14 sm:h-16 px-2 py-2 flex flex-col items-center justify-center text-center whitespace-normal break-words"
                      onClick={navigateToNewAnalysis}
                    >
                      <Users className="h-5 w-5 mb-1" />
                      <span className="text-[11px] sm:text-xs font-medium leading-tight">Competitive Analysis</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-14 sm:h-16 px-2 py-2 flex flex-col items-center justify-center text-center whitespace-normal break-words"
                      onClick={navigateToNewAnalysis}
                    >
                      <TrendingUp className="h-5 w-5 mb-1" />
                      <span className="text-[11px] sm:text-xs font-medium leading-tight">Market Analysis</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-14 sm:h-16 px-2 py-2 flex flex-col items-center justify-center text-center whitespace-normal break-words"
                      onClick={navigateToNewPlan}
                    >
                      <Brain className="h-5 w-5 mb-1" />
                      <span className="text-[11px] sm:text-xs font-medium leading-tight">Strategic Planning</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Business Analysis Tab */}
          <TabsContent value="analyses" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 md:gap-6">
              <h2 className="text-xl sm:text-2xl font-bold">Business Analysis</h2>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={navigateToNewAnalysis}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1">
              {analyses && analyses.length > 0 ? (
                analyses.map((analysis) => (
                  <Card key={analysis.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getAnalysisTypeIcon(analysis.analysisType)}
                          <div>
                            <CardTitle>{analysis.title}</CardTitle>
                            <CardDescription>
                              {getAnalysisTypeName(analysis.analysisType)} • {analysis.createdAt.toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(analysis.status)}>
                          {getStatusIcon(analysis.status)}
                          <span className="ml-1">{analysis.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Confidence Score</p>
                          <p className="text-2xl font-bold">
                            {analysis.confidenceScore ? `${Math.round(analysis.confidenceScore * 100)}%` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Business Impact</p>
                          <p className="text-2xl font-bold">
                            {analysis.businessImpact ? `${analysis.businessImpact}/10` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Execution Time</p>
                          <p className="text-2xl font-bold">
                            {analysis.executionTimeSeconds ? `${Math.round(analysis.executionTimeSeconds)}s` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={navigateToAnalytics}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={navigateToNewAnalysis}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No analyses found. Create your first analysis to get started.</p>
                    <Button className="mt-4" onClick={navigateToNewAnalysis}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Strategic Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 md:gap-6">
              <h2 className="text-xl sm:text-2xl font-bold">Strategic Planning</h2>
              <Button className="mt-2 sm:mt-0" onClick={navigateToNewPlan}>
                <Plus className="h-4 w-4 mr-2" />
                New Strategic Plan
              </Button>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1">
              {strategicPlans && strategicPlans.length > 0 ? (
                strategicPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{plan.title}</CardTitle>
                          <CardDescription>
                            {plan.timeHorizonMonths} months • {plan.createdAt.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{plan.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium">Success Probability</p>
                          <p className="text-2xl font-bold">{Math.round(plan.successProbability * 100)}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Implementation Progress</p>
                          <p className="text-2xl font-bold">{Math.round(plan.implementationProgress * 100)}%</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{Math.round(plan.implementationProgress * 100)}%</span>
                        </div>
                        <Progress value={plan.implementationProgress * 100} />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={navigateToAnalytics}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Plan
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={navigateToNewPlan}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Update Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No strategic plans found. Create your first plan to get started.</p>
                    <Button className="mt-4" onClick={navigateToNewPlan}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Business Context Tab */}
          <TabsContent value="context" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 md:gap-6">
              <h2 className="text-xl sm:text-2xl font-bold">Business Context</h2>
              <Button className="mt-2 sm:mt-0" onClick={navigateToContext}>
                <Plus className="h-4 w-4 mr-2" />
                Add Context
              </Button>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1">
              {businessContexts && businessContexts.length > 0 ? (
                businessContexts.map((context) => (
                  <Card key={context.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{context.name}</CardTitle>
                          <CardDescription>
                            {context.companyName} • {context.industry}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{context.businessStage}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Company Size</p>
                          <p className="text-lg font-semibold">{context.companySize}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Completeness</p>
                          <p className="text-lg font-semibold">{Math.round(context.completenessScore * 100)}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Confidence</p>
                          <p className="text-lg font-semibold">{Math.round(context.confidenceLevel * 100)}%</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Data Completeness</span>
                          <span>{Math.round(context.completenessScore * 100)}%</span>
                        </div>
                        <Progress value={context.completenessScore * 100} />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={navigateToContext}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={navigateToContext}>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Context
                        </Button>
                        <Button variant="outline" size="sm" onClick={navigateToNewAnalysis}>
                          <Brain className="h-4 w-4 mr-2" />
                          Run Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No business context found. Add context to improve analysis accuracy.</p>
                    <Button className="mt-4" onClick={navigateToContext}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Context
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 