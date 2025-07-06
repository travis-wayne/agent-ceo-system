"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Shield,
  Lightbulb,
  ArrowRight,
  Settings,
  Play,
  Save,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  FileText,
  Calendar,
  Globe
} from "lucide-react";

interface AnalysisConfig {
  title: string;
  analysisType: string;
  priority: string;
  timeframe: string;
  businessContext: string;
  specificQuestions: string;
  dataSource: string[];
  confidenceLevel: string;
  deliverables: string[];
  stakeholders: string[];
  budget: string;
  deadline: string;
}

const analysisTypes = [
  {
    id: 'swot_analysis',
    name: 'SWOT Analysis',
    icon: Target,
    description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats',
    estimatedTime: '2-4 hours',
    complexity: 'Medium'
  },
  {
    id: 'competitive_analysis',
    name: 'Competitive Analysis',
    icon: Users,
    description: 'Evaluate competitive landscape and positioning',
    estimatedTime: '4-8 hours',
    complexity: 'High'
  },
  {
    id: 'market_analysis',
    name: 'Market Analysis',
    icon: TrendingUp,
    description: 'Assess market size, trends, and opportunities',
    estimatedTime: '6-12 hours',
    complexity: 'High'
  },
  {
    id: 'financial_analysis',
    name: 'Financial Analysis',
    icon: DollarSign,
    description: 'Analyze financial performance and projections',
    estimatedTime: '3-6 hours',
    complexity: 'Medium'
  },
  {
    id: 'risk_assessment',
    name: 'Risk Assessment',
    icon: Shield,
    description: 'Identify and evaluate business risks',
    estimatedTime: '4-8 hours',
    complexity: 'High'
  },
  {
    id: 'strategic_planning',
    name: 'Strategic Planning',
    icon: Brain,
    description: 'Develop comprehensive strategic plans',
    estimatedTime: '8-16 hours',
    complexity: 'Very High'
  }
];

const dataSources = [
  'Internal Financial Data',
  'Market Research Reports',
  'Customer Surveys',
  'Competitor Intelligence',
  'Industry Reports',
  'Social Media Analytics',
  'Website Analytics',
  'Sales Data',
  'Customer Support Data',
  'Employee Feedback'
];

const deliverables = [
  'Executive Summary',
  'Detailed Analysis Report',
  'Visual Dashboards',
  'Action Plan',
  'Risk Matrix',
  'Competitive Positioning Map',
  'Financial Projections',
  'Implementation Timeline',
  'Key Performance Indicators',
  'Presentation Slides'
];

export default function NewAnalysisPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<AnalysisConfig>({
    title: '',
    analysisType: '',
    priority: 'medium',
    timeframe: 'standard',
    businessContext: '',
    specificQuestions: '',
    dataSource: [],
    confidenceLevel: 'high',
    deliverables: [],
    stakeholders: [],
    budget: '',
    deadline: ''
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard/ceo" },
    { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
    { label: "New Analysis", href: "/dashboard/ceo/strategic/new-analysis" }
  ];

  const handleInputChange = (field: keyof AnalysisConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof AnalysisConfig, value: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!config.title || !config.analysisType) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Analysis started successfully!');
      
      // Redirect to analysis monitoring page
      window.location.href = '/dashboard/ceo/strategic';
      
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error('Failed to start analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedAnalysisType = () => {
    return analysisTypes.find(type => type.id === config.analysisType);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
          { label: "New Analysis", isCurrentPage: true }
        ]}
      />

      <main className="flex-1 space-y-6 p-6">
        {/* Progress Indicator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analysis Setup Progress</CardTitle>
                <CardDescription>Step {currentStep} of 4</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-sm">
              <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Analysis Type
              </span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Configuration
              </span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Data Sources
              </span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Review & Launch
              </span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={`step-${currentStep}`} className="space-y-6">
          {/* Step 1: Analysis Type Selection */}
          <TabsContent value="step-1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Analysis Type</CardTitle>
                <CardDescription>
                  Choose the type of strategic analysis you want to perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {analysisTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = config.analysisType === type.id;
                    
                    return (
                      <Card 
                        key={type.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleInputChange('analysisType', type.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-primary" />
                            <div>
                              <CardTitle className="text-base">{type.name}</CardTitle>
                              <Badge className={getComplexityColor(type.complexity)} variant="outline">
                                {type.complexity}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            {type.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{type.estimatedTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {config.analysisType && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Selected: {getSelectedAnalysisType()?.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getSelectedAnalysisType()?.description}
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!config.analysisType}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Configuration */}
          <TabsContent value="step-2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Configuration</CardTitle>
                <CardDescription>
                  Configure the parameters for your strategic analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Analysis Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter analysis title"
                      value={config.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={config.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Analysis Timeframe</Label>
                    <Select value={config.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick (1-2 hours)</SelectItem>
                        <SelectItem value="standard">Standard (4-8 hours)</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (1-2 days)</SelectItem>
                        <SelectItem value="extensive">Extensive (3-5 days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={config.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessContext">Business Context</Label>
                  <Textarea
                    id="businessContext"
                    placeholder="Provide context about your business situation, goals, and challenges"
                    value={config.businessContext}
                    onChange={(e) => handleInputChange('businessContext', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specificQuestions">Specific Questions</Label>
                  <Textarea
                    id="specificQuestions"
                    placeholder="List specific questions you want the analysis to answer"
                    value={config.specificQuestions}
                    onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={!config.title}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Data Sources */}
          <TabsContent value="step-3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources & Deliverables</CardTitle>
                <CardDescription>
                  Select data sources and specify what deliverables you need
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Data Sources</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {dataSources.map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <Checkbox
                          id={source}
                          checked={config.dataSource.includes(source)}
                          onCheckedChange={(checked) => handleArrayChange('dataSource', source, checked as boolean)}
                        />
                        <Label htmlFor={source} className="text-sm font-normal">
                          {source}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Deliverables</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {deliverables.map((deliverable) => (
                      <div key={deliverable} className="flex items-center space-x-2">
                        <Checkbox
                          id={deliverable}
                          checked={config.deliverables.includes(deliverable)}
                          onCheckedChange={(checked) => handleArrayChange('deliverables', deliverable, checked as boolean)}
                        />
                        <Label htmlFor={deliverable} className="text-sm font-normal">
                          {deliverable}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidenceLevel">Confidence Level</Label>
                  <RadioGroup 
                    value={config.confidenceLevel} 
                    onValueChange={(value) => handleInputChange('confidenceLevel', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard (Faster, less detailed)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High (Balanced speed and accuracy)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maximum" id="maximum" />
                      <Label htmlFor="maximum">Maximum (Slower, most detailed)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Review & Launch */}
          <TabsContent value="step-4" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Launch</CardTitle>
                <CardDescription>
                  Review your analysis configuration and launch the analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">Analysis Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span>{config.title || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{getSelectedAnalysisType()?.name || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant="outline">{config.priority}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span>{config.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span>{config.deadline || 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Sources:</span>
                        <span>{config.dataSource.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deliverables:</span>
                        <span>{config.deliverables.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence Level:</span>
                        <Badge variant="outline">{config.confidenceLevel}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {config.businessContext && (
                  <div>
                    <h4 className="font-medium mb-2">Business Context</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {config.businessContext}
                    </p>
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This analysis will be processed using AI-powered strategic intelligence. 
                    Estimated completion time: {getSelectedAnalysisType()?.estimatedTime || 'Unknown'}
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Starting Analysis...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Launch Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 