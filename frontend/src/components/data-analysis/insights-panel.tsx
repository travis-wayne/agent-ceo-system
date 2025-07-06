"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  CheckCircle,
  Star,
  Activity,
  BarChart3,
  Users,
  DollarSign,
  ArrowRight,
  Download,
  Share,
  Filter
} from "lucide-react";

interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  impact: number; // 1-10
  confidence: number; // 0-1
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  aiGenerated: boolean;
  actionable: boolean;
  relatedAnalysis: string[];
  dataPoints: number;
  trend?: 'up' | 'down' | 'stable';
}

interface InsightsPanelProps {
  insights?: Insight[];
  analysisId?: string;
  showFilters?: boolean;
  className?: string;
}

export function InsightsPanel({ 
  insights: providedInsights, 
  analysisId,
  showFilters = true,
  className = "" 
}: InsightsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Default insights data
  const defaultInsights: Insight[] = [
    {
      id: "insight_1",
      type: "opportunity",
      title: "Healthcare Segment Revenue Potential",
      description: "Healthcare customers show 31% higher profitability than average. Expanding this segment could increase overall revenue by $2.3M annually.",
      impact: 9.2,
      confidence: 0.94,
      urgency: "high",
      category: "Revenue Optimization",
      aiGenerated: true,
      actionable: true,
      relatedAnalysis: ["CUSTOMER_SEGMENTATION", "FINANCIAL"],
      dataPoints: 1247,
      trend: "up"
    },
    {
      id: "insight_2", 
      type: "risk",
      title: "Customer Churn Risk in Tech Segment",
      description: "Technology segment shows 35% churn rate among startups. Proactive retention programs needed to prevent $890K annual revenue loss.",
      impact: 8.1,
      confidence: 0.89,
      urgency: "critical",
      category: "Customer Retention",
      aiGenerated: true,
      actionable: true,
      relatedAnalysis: ["COHORT", "CUSTOMER_SEGMENTATION"],
      dataPoints: 892,
      trend: "down"
    },
    {
      id: "insight_3",
      type: "trend",
      title: "Improving Customer Satisfaction Correlation",
      description: "Customer satisfaction scores correlate 87% with revenue growth. Recent satisfaction improvements predict 15% revenue increase.",
      impact: 8.7,
      confidence: 0.91,
      urgency: "medium", 
      category: "Customer Experience",
      aiGenerated: true,
      actionable: true,
      relatedAnalysis: ["CORRELATION", "SENTIMENT"],
      dataPoints: 2156,
      trend: "up"
    },
    {
      id: "insight_4",
      type: "recommendation",
      title: "Optimize Marketing Spend Allocation",
      description: "Digital marketing shows 72% ROI correlation with revenue. Reallocating 30% of traditional spend could increase leads by 45%.",
      impact: 7.8,
      confidence: 0.86,
      urgency: "medium",
      category: "Marketing Optimization",
      aiGenerated: true,
      actionable: true,
      relatedAnalysis: ["CORRELATION", "BUSINESS_INTELLIGENCE"],
      dataPoints: 1563,
      trend: "stable"
    }
  ];

  const insights = providedInsights || defaultInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="h-5 w-5 text-green-500" />;
      case 'risk': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'trend': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'alert': return <Zap className="h-5 w-5 text-orange-500" />;
      default: return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredInsights = insights.filter(insight => {
    const categoryMatch = selectedCategory === "all" || insight.category === selectedCategory;
    const typeMatch = selectedType === "all" || insight.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const categories = Array.from(new Set(insights.map(i => i.category)));
  const types = Array.from(new Set(insights.map(i => i.type)));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-500" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Intelligent analysis results with actionable recommendations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Insights Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">
              {filteredInsights.filter(i => i.type === 'opportunity').length}
            </p>
            <p className="text-sm text-muted-foreground">Opportunities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold text-red-600">
              {filteredInsights.filter(i => i.type === 'risk').length}
            </p>
            <p className="text-sm text-muted-foreground">Risks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-yellow-600">
              {filteredInsights.filter(i => i.actionable).length}
            </p>
            <p className="text-sm text-muted-foreground">Actionable</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-purple-600">
              {(filteredInsights.reduce((acc, i) => acc + i.impact, 0) / filteredInsights.length).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Avg Impact</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{insight.title}</h3>
                    <p className="text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={getUrgencyColor(insight.urgency) as any}>
                    {insight.urgency.toUpperCase()}
                  </Badge>
                  {insight.aiGenerated && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      <Brain className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">{insight.impact}/10</p>
                  <p className="text-xs text-blue-700">Impact</p>
                  <Progress value={insight.impact * 10} className="h-2 mt-1" />
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{(insight.confidence * 100).toFixed(0)}%</p>
                  <p className="text-xs text-green-700">Confidence</p>
                  <Progress value={insight.confidence * 100} className="h-2 mt-1" />
                </div>
                
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">{insight.dataPoints.toLocaleString()}</p>
                  <p className="text-xs text-yellow-700">Data Points</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{insight.category}</Badge>
                  {insight.actionable && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Actionable
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Data
                  </Button>
                  {insight.actionable && (
                    <Button size="sm">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
