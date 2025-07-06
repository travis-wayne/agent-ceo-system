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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Building,
  Globe,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
  Save,
  Plus,
  Minus,
  CheckCircle,
  Info,
  Upload,
  FileText,
  Calendar,
  DollarSign,
  Award,
  Lightbulb,
  Shield
} from "lucide-react";

interface BusinessContext {
  name: string;
  companyName: string;
  industry: string;
  companySize: string;
  businessStage: string;
  description: string;
  targetMarkets: string[];
  keyProducts: string[];
  competitiveAdvantages: string[];
  businessChallenges: string[];
  strategicGoals: string[];
  keyMetrics: KeyMetric[];
  stakeholders: Stakeholder[];
  budget: string;
  timeline: string;
  riskFactors: string[];
}

interface KeyMetric {
  id: string;
  name: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  importance: string;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: string;
  interest: string;
}

const industries = [
  'Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 
  'Retail', 'Education', 'Real Estate', 'Energy', 'Transportation',
  'Media & Entertainment', 'Food & Beverage', 'Consulting', 'Other'
];

const companySizes = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small Business (11-50 employees)' },
  { value: 'medium', label: 'Medium Business (51-200 employees)' },
  { value: 'large', label: 'Large Business (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
];

const businessStages = [
  { value: 'ideation', label: 'Ideation' },
  { value: 'startup', label: 'Startup' },
  { value: 'growth', label: 'Growth' },
  { value: 'maturity', label: 'Maturity' },
  { value: 'transformation', label: 'Transformation' },
  { value: 'expansion', label: 'Expansion' }
];

export default function BusinessContextPage() {
  const [context, setContext] = useState<BusinessContext>({
    name: '',
    companyName: '',
    industry: '',
    companySize: '',
    businessStage: '',
    description: '',
    targetMarkets: [''],
    keyProducts: [''],
    competitiveAdvantages: [''],
    businessChallenges: [''],
    strategicGoals: [''],
    keyMetrics: [],
    stakeholders: [],
    budget: '',
    timeline: '',
    riskFactors: ['']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [completenessScore, setCompletenessScore] = useState(0);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard/ceo" },
    { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
    { label: "Business Context", href: "/dashboard/ceo/strategic/context" }
  ];

  const handleContextChange = (field: keyof BusinessContext, value: any) => {
    setContext(prev => ({
      ...prev,
      [field]: value
    }));
    calculateCompleteness();
  };

  const handleArrayItemChange = (field: keyof BusinessContext, index: number, value: string) => {
    setContext(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
    calculateCompleteness();
  };

  const addArrayItem = (field: keyof BusinessContext) => {
    setContext(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof BusinessContext, index: number) => {
    setContext(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
    calculateCompleteness();
  };

  const addMetric = () => {
    const newMetric: KeyMetric = {
      id: Date.now().toString(),
      name: '',
      currentValue: '',
      targetValue: '',
      unit: '',
      importance: 'medium'
    };
    setContext(prev => ({
      ...prev,
      keyMetrics: [...prev.keyMetrics, newMetric]
    }));
  };

  const updateMetric = (id: string, field: keyof KeyMetric, value: any) => {
    setContext(prev => ({
      ...prev,
      keyMetrics: prev.keyMetrics.map(metric => 
        metric.id === id ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const removeMetric = (id: string) => {
    setContext(prev => ({
      ...prev,
      keyMetrics: prev.keyMetrics.filter(metric => metric.id !== id)
    }));
  };

  const addStakeholder = () => {
    const newStakeholder: Stakeholder = {
      id: Date.now().toString(),
      name: '',
      role: '',
      influence: 'medium',
      interest: 'medium'
    };
    setContext(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, newStakeholder]
    }));
  };

  const updateStakeholder = (id: string, field: keyof Stakeholder, value: any) => {
    setContext(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.map(stakeholder => 
        stakeholder.id === id ? { ...stakeholder, [field]: value } : stakeholder
      )
    }));
  };

  const removeStakeholder = (id: string) => {
    setContext(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.filter(stakeholder => stakeholder.id !== id)
    }));
  };

  const calculateCompleteness = () => {
    const requiredFields = [
      'name', 'companyName', 'industry', 'companySize', 'businessStage', 'description'
    ];
    
    const filledRequired = requiredFields.filter(field => 
      context[field as keyof BusinessContext] && 
      (context[field as keyof BusinessContext] as string).trim() !== ''
    ).length;
    
    const arrayFields = ['targetMarkets', 'keyProducts', 'competitiveAdvantages', 'strategicGoals'];
    const filledArrays = arrayFields.filter(field => 
      (context[field as keyof BusinessContext] as string[]).some(item => item.trim() !== '')
    ).length;
    
    const totalFields = requiredFields.length + arrayFields.length + 
      (context.keyMetrics.length > 0 ? 1 : 0) + 
      (context.stakeholders.length > 0 ? 1 : 0);
    
    const filledFields = filledRequired + filledArrays + 
      (context.keyMetrics.length > 0 ? 1 : 0) + 
      (context.stakeholders.length > 0 ? 1 : 0);
    
    const score = Math.round((filledFields / totalFields) * 100);
    setCompletenessScore(score);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!context.name || !context.companyName || !context.industry) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Business context saved successfully!');
      
      // Redirect to strategic intelligence page
      window.location.href = '/dashboard/ceo/strategic';
      
    } catch (error) {
      console.error('Error saving business context:', error);
      toast.error('Failed to save business context');
    } finally {
      setIsLoading(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInfluenceColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
          { label: "Business Context", isCurrentPage: true }
        ]}
      />

      <main className="flex-1 space-y-6 p-6">
        {/* Completeness Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Context Completeness</CardTitle>
                <CardDescription>
                  Complete your business context to improve analysis accuracy
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{completenessScore}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={completenessScore} className="mb-2" />
            <div className="text-sm text-muted-foreground">
              {completenessScore < 50 && "Add more details to improve analysis quality"}
              {completenessScore >= 50 && completenessScore < 80 && "Good progress! Add more context for better insights"}
              {completenessScore >= 80 && "Excellent! Your context is comprehensive"}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Core details about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Context Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Q4 2024 Strategic Context"
                    value={context.name}
                    onChange={(e) => handleContextChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Your company name"
                    value={context.companyName}
                    onChange={(e) => handleContextChange('companyName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={context.industry} onValueChange={(value) => handleContextChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={context.companySize} onValueChange={(value) => handleContextChange('companySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessStage">Business Stage</Label>
                  <Select value={context.businessStage} onValueChange={(value) => handleContextChange('businessStage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 2024-2025"
                    value={context.timeline}
                    onChange={(e) => handleContextChange('timeline', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your business, mission, and core activities"
                  value={context.description}
                  onChange={(e) => handleContextChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Market & Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Market & Products
              </CardTitle>
              <CardDescription>
                Your target markets and key products/services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Target Markets</Label>
                {context.targetMarkets.map((market, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter target market"
                      value={market}
                      onChange={(e) => handleArrayItemChange('targetMarkets', index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('targetMarkets', index)}
                      disabled={context.targetMarkets.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('targetMarkets')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Market
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Key Products/Services</Label>
                {context.keyProducts.map((product, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter product/service"
                      value={product}
                      onChange={(e) => handleArrayItemChange('keyProducts', index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('keyProducts', index)}
                      disabled={context.keyProducts.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('keyProducts')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Competitive Advantages</Label>
                {context.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter competitive advantage"
                      value={advantage}
                      onChange={(e) => handleArrayItemChange('competitiveAdvantages', index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('competitiveAdvantages', index)}
                      disabled={context.competitiveAdvantages.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('competitiveAdvantages')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Advantage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Goals & Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Strategic Goals & Challenges
              </CardTitle>
              <CardDescription>
                Your strategic objectives and key challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Strategic Goals</Label>
                {context.strategicGoals.map((goal, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter strategic goal"
                      value={goal}
                      onChange={(e) => handleArrayItemChange('strategicGoals', index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('strategicGoals', index)}
                      disabled={context.strategicGoals.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('strategicGoals')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Business Challenges</Label>
                {context.businessChallenges.map((challenge, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter business challenge"
                      value={challenge}
                      onChange={(e) => handleArrayItemChange('businessChallenges', index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('businessChallenges', index)}
                      disabled={context.businessChallenges.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('businessChallenges')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Challenge
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Risk Factors</Label>
                {context.riskFactors.map((risk, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter risk factor"
                      value={risk}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('riskFactors', index)}
                      disabled={context.riskFactors.length === 1}
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
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Key Metrics
              </CardTitle>
              <CardDescription>
                Important business metrics to track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Business Metrics</Label>
                <Button variant="outline" size="sm" onClick={addMetric}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Metric
                </Button>
              </div>
              
              <div className="space-y-4">
                {context.keyMetrics.map((metric) => (
                  <Card key={metric.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Metric #{context.keyMetrics.indexOf(metric) + 1}</h4>
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
                          placeholder="e.g., Monthly Revenue"
                          value={metric.name}
                          onChange={(e) => updateMetric(metric.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          placeholder="e.g., USD, %, count"
                          value={metric.unit}
                          onChange={(e) => updateMetric(metric.id, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Value</Label>
                        <Input
                          placeholder="Current value"
                          value={metric.currentValue}
                          onChange={(e) => updateMetric(metric.id, 'currentValue', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Target Value</Label>
                        <Input
                          placeholder="Target value"
                          value={metric.targetValue}
                          onChange={(e) => updateMetric(metric.id, 'targetValue', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <Label>Importance</Label>
                      <Select 
                        value={metric.importance} 
                        onValueChange={(value) => updateMetric(metric.id, 'importance', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stakeholders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Key Stakeholders
            </CardTitle>
            <CardDescription>
              Important stakeholders and their influence levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Stakeholder Map</Label>
              <Button variant="outline" size="sm" onClick={addStakeholder}>
                <Plus className="h-4 w-4 mr-2" />
                Add Stakeholder
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {context.stakeholders.map((stakeholder) => (
                <Card key={stakeholder.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Stakeholder #{context.stakeholders.indexOf(stakeholder) + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStakeholder(stakeholder.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Stakeholder name"
                        value={stakeholder.name}
                        onChange={(e) => updateStakeholder(stakeholder.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        placeholder="e.g., CEO, Board Member, Customer"
                        value={stakeholder.role}
                        onChange={(e) => updateStakeholder(stakeholder.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Influence Level</Label>
                        <Select 
                          value={stakeholder.influence} 
                          onValueChange={(value) => updateStakeholder(stakeholder.id, 'influence', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Interest Level</Label>
                        <Select 
                          value={stakeholder.interest} 
                          onValueChange={(value) => updateStakeholder(stakeholder.id, 'interest', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Save Business Context</CardTitle>
            <CardDescription>
              Save your business context for strategic analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                A comprehensive business context improves the accuracy and relevance of strategic analyses. 
                Aim for at least 80% completeness for best results.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import from File
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Context
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
} 