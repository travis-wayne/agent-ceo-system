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
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Save,
  Play,
  Clock,
  Info,
  Plus,
  Minus,
  Award,
  BarChart3,
  FileText,
  Settings,
  Lightbulb
} from "lucide-react";

interface StrategicPlan {
  title: string;
  description: string;
  timeHorizonMonths: number;
  planType: string;
  businessObjectives: string[];
  keyInitiatives: Initiative[];
  successMetrics: Metric[];
  riskFactors: string[];
  budget: string;
  stakeholders: string[];
  timeline: TimelineItem[];
  reviewFrequency: string;
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  priority: string;
  estimatedCost: string;
  timeframe: string;
  owner: string;
  dependencies: string[];
}

interface Metric {
  id: string;
  name: string;
  description: string;
  target: string;
  measurementFrequency: string;
  currentBaseline: string;
}

interface TimelineItem {
  id: string;
  phase: string;
  description: string;
  startMonth: number;
  endMonth: number;
  deliverables: string[];
}

const planTypes = [
  {
    id: 'growth',
    name: 'Growth Strategy',
    description: 'Focus on expanding market reach and revenue',
    icon: TrendingUp,
    timeframe: '12-24 months'
  },
  {
    id: 'transformation',
    name: 'Digital Transformation',
    description: 'Modernize operations and technology',
    icon: Settings,
    timeframe: '18-36 months'
  },
  {
    id: 'innovation',
    name: 'Innovation Strategy',
    description: 'Develop new products and services',
    icon: Lightbulb,
    timeframe: '12-18 months'
  },
  {
    id: 'operational',
    name: 'Operational Excellence',
    description: 'Improve efficiency and reduce costs',
    icon: Target,
    timeframe: '6-12 months'
  },
  {
    id: 'market_entry',
    name: 'Market Entry',
    description: 'Enter new markets or segments',
    icon: BarChart3,
    timeframe: '12-24 months'
  },
  {
    id: 'competitive',
    name: 'Competitive Response',
    description: 'Respond to competitive threats',
    icon: Users,
    timeframe: '6-18 months'
  }
];

export default function NewStrategicPlanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<StrategicPlan>({
    title: '',
    description: '',
    timeHorizonMonths: 12,
    planType: '',
    businessObjectives: [''],
    keyInitiatives: [],
    successMetrics: [],
    riskFactors: [''],
    budget: '',
    stakeholders: [''],
    timeline: [],
    reviewFrequency: 'monthly'
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard/ceo" },
    { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
    { label: "New Strategic Plan", href: "/dashboard/ceo/strategic/new-plan" }
  ];

  const handlePlanChange = (field: keyof StrategicPlan, value: any) => {
    setPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayItemChange = (field: keyof StrategicPlan, index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: keyof StrategicPlan) => {
    setPlan(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof StrategicPlan, index: number) => {
    setPlan(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addInitiative = () => {
    const newInitiative: Initiative = {
      id: Date.now().toString(),
      title: '',
      description: '',
      priority: 'medium',
      estimatedCost: '',
      timeframe: '',
      owner: '',
      dependencies: []
    };
    setPlan(prev => ({
      ...prev,
      keyInitiatives: [...prev.keyInitiatives, newInitiative]
    }));
  };

  const updateInitiative = (id: string, field: keyof Initiative, value: any) => {
    setPlan(prev => ({
      ...prev,
      keyInitiatives: prev.keyInitiatives.map(init => 
        init.id === id ? { ...init, [field]: value } : init
      )
    }));
  };

  const removeInitiative = (id: string) => {
    setPlan(prev => ({
      ...prev,
      keyInitiatives: prev.keyInitiatives.filter(init => init.id !== id)
    }));
  };

  const addMetric = () => {
    const newMetric: Metric = {
      id: Date.now().toString(),
      name: '',
      description: '',
      target: '',
      measurementFrequency: 'monthly',
      currentBaseline: ''
    };
    setPlan(prev => ({
      ...prev,
      successMetrics: [...prev.successMetrics, newMetric]
    }));
  };

  const updateMetric = (id: string, field: keyof Metric, value: any) => {
    setPlan(prev => ({
      ...prev,
      successMetrics: prev.successMetrics.map(metric => 
        metric.id === id ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const removeMetric = (id: string) => {
    setPlan(prev => ({
      ...prev,
      successMetrics: prev.successMetrics.filter(metric => metric.id !== id)
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Validate required fields
      if (!plan.title || !plan.planType) {
        toast.error('Please fill in all required fields');
        return;
      }
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Strategic plan created successfully!');
      // Redirect to analytics page with plan title as query param
      window.location.href = `/dashboard/ceo/analytics?planTitle=${encodeURIComponent(plan.title)}`;
    } catch (error) {
      console.error('Error creating strategic plan:', error);
      toast.error('Failed to create strategic plan');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedPlanType = () => {
    return planTypes.find(type => type.id === plan.planType);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
          { label: "New Strategic Plan", isCurrentPage: true }
        ]}
      />

      <main className="flex-1 space-y-6 p-6">
        {/* Progress Indicator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plan Creation Progress</CardTitle>
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
                Plan Type
              </span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Objectives
              </span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Initiatives
              </span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Review & Create
              </span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={`step-${currentStep}`} className="space-y-6">
          {/* Step 1: Plan Type Selection */}
          <TabsContent value="step-1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Plan Type</CardTitle>
                <CardDescription>
                  Choose the type of strategic plan you want to create
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {planTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = plan.planType === type.id;
                    
                    return (
                      <Card 
                        key={type.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handlePlanChange('planType', type.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-primary" />
                            <div>
                              <CardTitle className="text-base">{type.name}</CardTitle>
                              <Badge variant="outline">
                                {type.timeframe}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Plan Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter strategic plan title"
                        value={plan.title}
                        onChange={(e) => handlePlanChange('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeHorizon">Time Horizon (months)</Label>
                      <Select 
                        value={plan.timeHorizonMonths.toString()} 
                        onValueChange={(value) => handlePlanChange('timeHorizonMonths', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="18">18 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Plan Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the strategic plan's purpose and scope"
                      value={plan.description}
                      onChange={(e) => handlePlanChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!plan.title || !plan.planType}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Objectives & Stakeholders */}
          <TabsContent value="step-2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Objectives & Stakeholders</CardTitle>
                <CardDescription>
                  Define the key objectives and identify stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Business Objectives</Label>
                  {plan.businessObjectives.map((objective, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Enter business objective"
                        value={objective}
                        onChange={(e) => handleArrayItemChange('businessObjectives', index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('businessObjectives', index)}
                        disabled={plan.businessObjectives.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('businessObjectives')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Key Stakeholders</Label>
                  {plan.stakeholders.map((stakeholder, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Enter stakeholder name/role"
                        value={stakeholder}
                        onChange={(e) => handleArrayItemChange('stakeholders', index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('stakeholders', index)}
                        disabled={plan.stakeholders.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('stakeholders')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stakeholder
                  </Button>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Risk Factors</Label>
                  {plan.riskFactors.map((risk, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Enter potential risk factor"
                        value={risk}
                        onChange={(e) => handleArrayItemChange('riskFactors', index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('riskFactors', index)}
                        disabled={plan.riskFactors.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('riskFactors')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Risk Factor
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Allocation</Label>
                    <Input
                      id="budget"
                      placeholder="Enter budget amount"
                      value={plan.budget}
                      onChange={(e) => handlePlanChange('budget', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewFrequency">Review Frequency</Label>
                    <Select 
                      value={plan.reviewFrequency} 
                      onValueChange={(value) => handlePlanChange('reviewFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annually">Semi-annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Initiatives & Metrics */}
          <TabsContent value="step-3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Initiatives & Success Metrics</CardTitle>
                <CardDescription>
                  Define the initiatives and metrics to track success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Key Initiatives</Label>
                    <Button variant="outline" size="sm" onClick={addInitiative}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Initiative
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {plan.keyInitiatives.map((initiative) => (
                      <Card key={initiative.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Initiative #{plan.keyInitiatives.indexOf(initiative) + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInitiative(initiative.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              placeholder="Initiative title"
                              value={initiative.title}
                              onChange={(e) => updateInitiative(initiative.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select 
                              value={initiative.priority} 
                              onValueChange={(value) => updateInitiative(initiative.id, 'priority', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Estimated Cost</Label>
                            <Input
                              placeholder="Cost estimate"
                              value={initiative.estimatedCost}
                              onChange={(e) => updateInitiative(initiative.id, 'estimatedCost', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Timeframe</Label>
                            <Input
                              placeholder="e.g., Q1 2024"
                              value={initiative.timeframe}
                              onChange={(e) => updateInitiative(initiative.id, 'timeframe', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe the initiative"
                            value={initiative.description}
                            onChange={(e) => updateInitiative(initiative.id, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Success Metrics</Label>
                    <Button variant="outline" size="sm" onClick={addMetric}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Metric
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {plan.successMetrics.map((metric) => (
                      <Card key={metric.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Metric #{plan.successMetrics.indexOf(metric) + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMetric(metric.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Metric Name</Label>
                            <Input
                              placeholder="e.g., Revenue Growth"
                              value={metric.name}
                              onChange={(e) => updateMetric(metric.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Target Value</Label>
                            <Input
                              placeholder="e.g., 25% increase"
                              value={metric.target}
                              onChange={(e) => updateMetric(metric.id, 'target', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Current Baseline</Label>
                            <Input
                              placeholder="Current value"
                              value={metric.currentBaseline}
                              onChange={(e) => updateMetric(metric.id, 'currentBaseline', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Measurement Frequency</Label>
                            <Select 
                              value={metric.measurementFrequency} 
                              onValueChange={(value) => updateMetric(metric.id, 'measurementFrequency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe how this metric will be measured"
                            value={metric.description}
                            onChange={(e) => updateMetric(metric.id, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
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

          {/* Step 4: Review & Create */}
          <TabsContent value="step-4" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Create Plan</CardTitle>
                <CardDescription>
                  Review your strategic plan configuration and create the plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">Plan Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span>{plan.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{getSelectedPlanType()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Horizon:</span>
                        <span>{plan.timeHorizonMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span>{plan.budget || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Review Frequency:</span>
                        <span>{plan.reviewFrequency}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Plan Components</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Objectives:</span>
                        <span>{plan.businessObjectives.filter(obj => obj.trim()).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Initiatives:</span>
                        <span>{plan.keyInitiatives.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Metrics:</span>
                        <span>{plan.successMetrics.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stakeholders:</span>
                        <span>{plan.stakeholders.filter(s => s.trim()).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Factors:</span>
                        <span>{plan.riskFactors.filter(r => r.trim()).length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {plan.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {plan.description}
                    </p>
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This strategic plan will be created with AI-powered insights and recommendations. 
                    You can modify and refine it after creation.
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
                          Creating Plan...
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4 mr-2" />
                          Create Strategic Plan
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