"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app-layout";
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
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";

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

  // Prepare stat cards data
  const statCards = [
    {
      title: "Total Analyses",
      value: metrics.totalAnalyses.toString(),
      description: `${metrics.completedAnalyses} completed`,
      icon: BarChart3,
      trend: null,
      trendUp: null,
    },
    {
      title: "Completion Rate",
      value: `${Math.round(metrics.completionRate)}%`,
      description: "Analysis success rate",
      icon: CheckCircle,
      trend: null,
      trendUp: null,
    },
    {
      title: "Avg Confidence",
      value: `${Math.round(metrics.avgConfidence)}%`,
      description: "Analysis confidence",
      icon: Target,
      trend: null,
      trendUp: null,
    },
    {
      title: "Business Impact",
      value: `${metrics.avgImpact.toFixed(1)}/10`,
      description: "Average impact score",
      icon: TrendingUp,
      trend: null,
      trendUp: null,
    },
  ];

  const headerActions = [
    {
      label: "New Analysis",
      variant: "outline" as const,
      icon: Plus,
      onClick: navigateToNewAnalysis,
    },
    {
      label: "New Plan",
      variant: "default" as const,
      icon: Brain,
      onClick: navigateToNewPlan,
    },
  ];

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: (
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
                      <StatusBadge 
                        status={
                          analysis.status === 'completed' ? 'success' : 
                          analysis.status === 'in_progress' ? 'warning' : 
                          analysis.status === 'failed' ? 'error' : 'secondary'
                        } 
                        size="sm"
                      >
                        {analysis.status}
                      </StatusBadge>
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
                <Brain className="h-5 w-5" />
                Strategic Plans
              </CardTitle>
              <CardDescription>
                Active strategic initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategicPlans && strategicPlans.length > 0 ? (
                  strategicPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{plan.title}</p>
                        <StatusBadge 
                          status={plan.status === 'approved' ? 'success' : 'warning'} 
                          size="sm"
                        >
                          {plan.status}
                        </StatusBadge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.round(plan.implementationProgress * 100)}%</span>
                        </div>
                        <Progress value={plan.implementationProgress * 100} className="h-2" />
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
                Create New Plan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Business Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Business Context
              </CardTitle>
              <CardDescription>
                Current business environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {businessContexts && businessContexts.length > 0 ? (
                  businessContexts.slice(0, 3).map((context) => (
                    <div key={context.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{context.name}</p>
                        <StatusBadge 
                          status={context.confidenceLevel > 0.8 ? 'success' : 'warning'} 
                          size="sm"
                        >
                          {Math.round(context.confidenceLevel * 100)}% Confidence
                        </StatusBadge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {context.companyName} • {context.industry}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No business context available
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={navigateToContext}>
                Manage Context
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "analyses",
      label: "Business Analysis",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Business Analysis</CardTitle>
            <CardDescription>Strategic analysis and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Business Analysis</h3>
              <p className="text-muted-foreground">
                This section is currently under development.
              </p>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "planning",
      label: "Strategic Planning",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Strategic Planning</CardTitle>
            <CardDescription>Strategic planning and execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Strategic Planning</h3>
              <p className="text-muted-foreground">
                This section is currently under development.
              </p>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "context",
      label: "Business Context",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Business Context</CardTitle>
            <CardDescription>Business environment and context management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Business Context</h3>
              <p className="text-muted-foreground">
                This section is currently under development.
              </p>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  if (isLoading) {
    return (
      <>
        <PageHeaderWithActions
          title="Strategic Intelligence"
          description="AI-powered strategic analysis and planning"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/ceo" },
            { label: "Strategic Intelligence", isCurrentPage: true }
          ]}
          actions={[]}
        />
        <main className="flex-1 space-y-6 p-6">
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
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeaderWithActions
        title="Strategic Intelligence"
        description="AI-powered strategic analysis and planning"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Intelligence", isCurrentPage: true }
        ]}
        actions={headerActions}
      />

      <main className="flex-1 space-y-4 sm:space-y-6 px-1 xs:px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {/* Key Metrics */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <TabbedContentLayout
          value={selectedTab}
          onValueChange={setSelectedTab}
          tabs={tabs}
          className="space-y-3 sm:space-y-4 md:space-y-6"
        />
      </main>
    </>
  );
} 