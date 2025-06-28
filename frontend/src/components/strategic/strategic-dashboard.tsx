// Strategic Insights Dashboard Component
// /src/components/strategic/strategic-dashboard.tsx

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStrategicInsights } from '@/hooks/use-agent-ceo';
import { StrategicInsight } from '@/services/agent-ceo-api';
import { 
  Brain, 
  Plus, 
  TrendingUp, 
  Target, 
  Shield, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';

const InsightTypeIcon = ({ type }: { type: StrategicInsight['type'] }) => {
  const icons = {
    business_analysis: <BarChart3 className="w-4 h-4" />,
    competitive_analysis: <Users className="w-4 h-4" />,
    growth_strategy: <TrendingUp className="w-4 h-4" />,
    crisis_management: <Shield className="w-4 h-4" />,
  };

  return icons[type] || <Brain className="w-4 h-4" />;
};

const ConfidenceScore = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`text-sm font-medium ${getColor(score)}`}>
        {score}%
      </div>
      <Badge variant="outline" className={getColor(score)}>
        {getLabel(score)}
      </Badge>
    </div>
  );
};

const QuickInsightsDialog = ({ onInsightGenerated }: { onInsightGenerated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    query: '',
    context: '',
    urgency: 'normal' as 'low' | 'normal' | 'high' | 'critical',
  });
  const [result, setResult] = useState<string | null>(null);
  const { getQuickInsights } = useStrategicInsights();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await getQuickInsights(formData);
      setResult(response.insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
    setFormData({ query: '', context: '', urgency: 'normal' });
    onInsightGenerated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Zap className="w-4 h-4 mr-2" />
          Quick Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Quick Strategic Insights</DialogTitle>
          <DialogDescription>
            Get immediate AI-powered strategic insights for your business questions.
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Your Question</Label>
              <Textarea
                id="query"
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                placeholder="What strategic question do you need insights on?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Business Context</Label>
              <Textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Provide context about your business, industry, or situation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General planning</SelectItem>
                  <SelectItem value="normal">Normal - Regular decision</SelectItem>
                  <SelectItem value="high">High - Important decision</SelectItem>
                  <SelectItem value="critical">Critical - Urgent action needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Generating Insights...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Strategic Insights</h4>
              <ScrollArea className="h-64">
                <div className="whitespace-pre-wrap text-sm">{result}</div>
              </ScrollArea>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => navigator.clipboard.writeText(result)}>
                Copy Insights
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const GenerateAnalysisDialog = ({ type, onAnalysisGenerated }: { 
  type: 'business' | 'competitive' | 'growth';
  onAnalysisGenerated: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { generateBusinessAnalysis, generateCompetitiveAnalysis, generateGrowthStrategy } = useStrategicInsights();

  const getDialogConfig = () => {
    switch (type) {
      case 'business':
        return {
          title: 'Generate Business Analysis',
          description: 'Get comprehensive strategic business analysis',
          icon: <BarChart3 className="w-4 h-4 mr-2" />,
        };
      case 'competitive':
        return {
          title: 'Generate Competitive Analysis',
          description: 'Analyze your competitive landscape',
          icon: <Users className="w-4 h-4 mr-2" />,
        };
      case 'growth':
        return {
          title: 'Generate Growth Strategy',
          description: 'Create strategic growth plan',
          icon: <TrendingUp className="w-4 h-4 mr-2" />,
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      switch (type) {
        case 'business':
          await generateBusinessAnalysis(formData);
          break;
        case 'competitive':
          await generateCompetitiveAnalysis(formData);
          break;
        case 'growth':
          await generateGrowthStrategy(formData);
          break;
      }
      
      setOpen(false);
      setFormData({});
      onAnalysisGenerated();
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {config.icon}
          {config.title.replace('Generate ', '')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'business' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="business_context">Business Context</Label>
                <Textarea
                  id="business_context"
                  value={formData.business_context || ''}
                  onChange={(e) => setFormData({ ...formData, business_context: e.target.value })}
                  placeholder="Describe your business, current situation, and challenges"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Business Goals (comma-separated)</Label>
                <Input
                  id="goals"
                  value={formData.goals_string || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    goals_string: e.target.value,
                    goals: e.target.value.split(',').map(g => g.trim())
                  })}
                  placeholder="e.g., increase revenue, expand market, improve efficiency"
                  required
                />
              </div>
            </>
          )}
          
          {type === 'competitive' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors (comma-separated)</Label>
                <Input
                  id="competitors"
                  value={formData.competitors_string || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    competitors_string: e.target.value,
                    competitors: e.target.value.split(',').map(c => c.trim())
                  })}
                  placeholder="e.g., Company A, Company B, Company C"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_focus">Market Focus</Label>
                <Input
                  id="market_focus"
                  value={formData.market_focus || ''}
                  onChange={(e) => setFormData({ ...formData, market_focus: e.target.value })}
                  placeholder="e.g., B2B SaaS, E-commerce, Mobile apps"
                  required
                />
              </div>
            </>
          )}
          
          {type === 'growth' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="current_state">Current State</Label>
                <Textarea
                  id="current_state"
                  value={formData.current_state || ''}
                  onChange={(e) => setFormData({ ...formData, current_state: e.target.value })}
                  placeholder="Describe your current business state, metrics, and position"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_goals">Target Goals (comma-separated)</Label>
                <Input
                  id="target_goals"
                  value={formData.target_goals_string || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    target_goals_string: e.target.value,
                    target_goals: e.target.value.split(',').map(g => g.trim())
                  })}
                  placeholder="e.g., 2x revenue, enter new market, launch new product"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={formData.timeframe || ''} onValueChange={(value) => setFormData({ ...formData, timeframe: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 months">3 Months</SelectItem>
                    <SelectItem value="6 months">6 Months</SelectItem>
                    <SelectItem value="1 year">1 Year</SelectItem>
                    <SelectItem value="2 years">2 Years</SelectItem>
                    <SelectItem value="5 years">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-spin" />
                Generating Analysis...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Generate Analysis
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InsightCard = ({ insight }: { insight: StrategicInsight }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <InsightTypeIcon type={insight.type} />
            <CardTitle className="text-lg">{insight.title}</CardTitle>
          </div>
          <ConfidenceScore score={insight.confidence_score} />
        </div>
        <CardDescription>{insight.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Key Insights</h4>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {expanded ? insight.insights : `${insight.insights.substring(0, 200)}...`}
              </p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            </div>
          </div>
          
          {insight.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {insight.recommendations.slice(0, expanded ? undefined : 3).map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              {!expanded && insight.recommendations.length > 3 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto mt-1"
                  onClick={() => setExpanded(true)}
                >
                  +{insight.recommendations.length - 3} more recommendations
                </Button>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Generated: {new Date(insight.generated_at).toLocaleDateString()}</span>
            <Badge variant="outline" className="capitalize">
              {insight.type.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StrategicDashboard() {
  const { insights, loading, error, refetch } = useStrategicInsights();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading strategic insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
          <Button onClick={refetch} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const recentInsights = insights.slice(0, 3);
  const avgConfidence = insights.length > 0 
    ? Math.round(insights.reduce((sum, insight) => sum + insight.confidence_score, 0) / insights.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Strategic Insights</h1>
          <p className="text-muted-foreground">
            AI-powered strategic analysis and recommendations
          </p>
        </div>
        <div className="flex space-x-2">
          <QuickInsightsDialog onInsightGenerated={refetch} />
          <GenerateAnalysisDialog type="business" onAnalysisGenerated={refetch} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
            <p className="text-xs text-muted-foreground">
              Generated analyses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <p className="text-xs text-muted-foreground">
              Analysis accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Insights</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentInsights.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.reduce((sum, insight) => sum + insight.recommendations.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recommendations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Analysis</CardTitle>
          <CardDescription>
            Create comprehensive strategic analyses for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <GenerateAnalysisDialog type="business" onAnalysisGenerated={refetch} />
            <GenerateAnalysisDialog type="competitive" onAnalysisGenerated={refetch} />
            <GenerateAnalysisDialog type="growth" onAnalysisGenerated={refetch} />
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Strategic Insights</h2>
        
        {insights.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No insights yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first strategic analysis to get started
              </p>
              <div className="flex space-x-2">
                <QuickInsightsDialog onInsightGenerated={refetch} />
                <GenerateAnalysisDialog type="business" onAnalysisGenerated={refetch} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

