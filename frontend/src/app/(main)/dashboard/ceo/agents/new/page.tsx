"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import {
  Brain,
  Briefcase,
  Palette,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Shield,
  Award,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  Star
} from "lucide-react";

// Agent type definitions from the workflow guide
const AGENT_TYPES = [
  {
    id: 'ceo',
    name: 'CEO Agent',
    emoji: '🧠',
    description: 'Strategic planning, market analysis, and business intelligence',
    icon: Brain,
    color: 'bg-blue-500',
    capabilities: [
      "Strategic Planning & Roadmapping",
      "Market Analysis & Competitive Intelligence", 
      "Business Model Innovation",
      "Investment & Growth Strategy",
      "Board & Stakeholder Communications",
      "Risk Assessment & Management",
      "Performance Analytics & KPIs",
      "Executive Decision Support"
    ],
    specializations: [
      "Strategic Decision Making",
      "Market Research",
      "Business Development",
      "Competitive Analysis",
      "Investment Planning"
    ],
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    defaultModel: "GPT-4 Turbo",
    maxConcurrentTasks: 5,
    costPerHour: 285
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    emoji: '💼',
    description: 'Lead generation, sales optimization, and revenue growth',
    icon: Briefcase,
    color: 'bg-green-500',
    capabilities: [
      "Lead Generation & Qualification",
      "Sales Process Optimization",
      "Customer Acquisition Strategy",
      "Revenue Forecasting & Analytics",
      "CRM Management & Automation",
      "Pipeline Management",
      "Conversion Optimization",
      "Customer Relationship Building"
    ],
    specializations: [
      "Pipeline Management",
      "Conversion Optimization",
      "Customer Outreach",
      "Lead Qualification",
      "Sales Analytics"
    ],
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    defaultModel: "GPT-4 Turbo",
    maxConcurrentTasks: 8,
    costPerHour: 195
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    emoji: '🎨',
    description: 'Content creation, brand strategy, and digital marketing',
    icon: Palette,
    color: 'bg-purple-500',
    capabilities: [
      "Content Strategy & Creation",
      "Brand Positioning & Messaging",
      "Digital Marketing Campaigns",
      "Social Media Management",
      "Marketing Analytics & ROI",
      "Customer Segmentation",
      "Campaign Optimization",
      "Brand Consistency"
    ],
    specializations: [
      "Brand Building",
      "Content Marketing",
      "Campaign Management",
      "Social Media",
      "SEO Optimization"
    ],
    models: ["Claude-3 Opus", "GPT-4 Turbo", "GPT-4"],
    defaultModel: "Claude-3 Opus",
    maxConcurrentTasks: 6,
    costPerHour: 165
  },
  {
    id: 'operations',
    name: 'Operations Agent',
    emoji: '⚙️',
    description: 'Process optimization, automation, and operational efficiency',
    icon: Settings,
    color: 'bg-orange-500',
    capabilities: [
      "Process Automation & Optimization",
      "Quality Management Systems",
      "Resource Allocation & Planning",
      "Cost Reduction Strategies",
      "Operational Risk Management",
      "Workflow Optimization",
      "Efficiency Monitoring",
      "System Integration"
    ],
    specializations: [
      "Process Improvement",
      "Automation",
      "Efficiency Optimization",
      "Quality Control",
      "Resource Management"
    ],
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    defaultModel: "GPT-4 Turbo",
    maxConcurrentTasks: 4,
    costPerHour: 215
  },
  {
    id: 'analytics',
    name: 'Analytics Agent',
    emoji: '📊',
    description: 'Data analysis, business intelligence, and predictive modeling',
    icon: BarChart3,
    color: 'bg-indigo-500',
    capabilities: [
      "Data Processing & Analysis",
      "Business Intelligence Reporting",
      "Predictive Analytics",
      "Performance Metrics Tracking",
      "Trend Analysis & Forecasting",
      "Data Visualization",
      "Statistical Modeling",
      "Insight Generation"
    ],
    specializations: [
      "Data Analysis",
      "Predictive Modeling",
      "Business Intelligence",
      "Data Visualization",
      "Statistical Analysis"
    ],
    models: ["Claude-3 Opus", "GPT-4 Turbo", "GPT-4"],
    defaultModel: "Claude-3 Opus",
    maxConcurrentTasks: 3,
    costPerHour: 175
  }
];

interface AgentFormData {
  name: string;
  type: string;
  specialization: string;
  model: string;
  avatar: string;
  maxConcurrentTasks: number;
  description: string;
  objectives: string[];
  riskTolerance: string;
  budget: number;
  priority: string;
}

export default function CreateAgentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    type: '',
    specialization: '',
    model: '',
    avatar: '',
    maxConcurrentTasks: 3,
    description: '',
    objectives: [],
    riskTolerance: 'moderate',
    budget: 5000,
    priority: 'high'
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Get selected agent type details
  const selectedAgentType = AGENT_TYPES.find(type => type.id === formData.type);

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.type) errors.push("Please select an agent type");
        break;
      case 2:
        if (!formData.name.trim()) errors.push("Agent name is required");
        if (formData.name.length < 2) errors.push("Agent name must be at least 2 characters");
        if (formData.name.length > 100) errors.push("Agent name must be less than 100 characters");
        if (!formData.specialization.trim()) errors.push("Specialization is required");
        break;
      case 3:
        if (!formData.model) errors.push("AI model selection is required");
        if (formData.maxConcurrentTasks < 1 || formData.maxConcurrentTasks > 20) {
          errors.push("Max concurrent tasks must be between 1 and 20");
        }
        break;
      case 4:
        if (!formData.description.trim()) errors.push("Agent description is required");
        if (formData.objectives.length === 0) errors.push("At least one objective is required");
        break;
      case 5:
        if (formData.budget < 100) errors.push("Budget must be at least $100");
        if (formData.budget > 100000) errors.push("Budget cannot exceed $100,000");
        break;
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setValidationErrors([]);
  };

  const handleAgentTypeSelect = (typeId: string) => {
    const agentType = AGENT_TYPES.find(type => type.id === typeId);
    if (agentType) {
      setFormData(prev => ({
        ...prev,
        type: typeId,
        model: agentType.defaultModel,
        avatar: agentType.emoji,
        maxConcurrentTasks: agentType.maxConcurrentTasks,
        specialization: agentType.specializations[0] // Default to first specialization
      }));
    }
  };

  const handleObjectiveToggle = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(obj => obj !== objective)
        : [...prev.objectives, objective]
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsCreating(true);
    try {
      // Simulate API call to create agent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${formData.name} has been created successfully!`);
      router.push('/dashboard/ceo/agents');
    } catch (error) {
      toast.error('Failed to create agent. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Select Agent Type</h2>
              <p className="text-muted-foreground">
                Choose the type of AI agent that best fits your business needs
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {AGENT_TYPES.map((agentType) => {
                const Icon = agentType.icon;
                const isSelected = formData.type === agentType.id;
                
                return (
                  <Card
                    key={agentType.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    onClick={() => handleAgentTypeSelect(agentType.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full ${agentType.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{agentType.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{agentType.description}</p>
                      <div className="flex justify-center items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>${agentType.costPerHour}/hour</span>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-primary mx-auto mt-3" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Agent Configuration</h2>
              <p className="text-muted-foreground">
                Configure your {selectedAgentType?.name} with basic settings
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Strategic Analysis AI"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select 
                  value={formData.specialization} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedAgentType?.specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAgentType && (
                <div className="space-y-4">
                  <Label>Capabilities</Label>
                  <div className="grid gap-2">
                    {selectedAgentType.capabilities.map(capability => (
                      <div key={capability} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Technical Configuration</h2>
              <p className="text-muted-foreground">
                Configure AI model and performance settings
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model">AI Model *</Label>
                <Select 
                  value={formData.model} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedAgentType?.models.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTasks">Max Concurrent Tasks</Label>
                <div className="space-y-2">
                  <Input
                    id="maxTasks"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxConcurrentTasks}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxConcurrentTasks: parseInt(e.target.value) || 1 
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: {selectedAgentType?.maxConcurrentTasks} tasks
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Performance Expectations</Label>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Response Time</span>
                    <Badge variant="secondary">2-4 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="secondary">95%+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Cost per Hour</span>
                    <Badge variant="secondary">${selectedAgentType?.costPerHour}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Business Objectives</h2>
              <p className="text-muted-foreground">
                Define goals and operational parameters for your agent
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Agent Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this agent will be responsible for..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Objectives *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select the main objectives this agent should focus on
                </p>
                <div className="grid gap-2">
                  {selectedAgentType?.capabilities.map(capability => (
                    <div
                      key={capability}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.objectives.includes(capability)
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/50 border-border hover:bg-muted'
                      }`}
                      onClick={() => handleObjectiveToggle(capability)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{capability}</span>
                        {formData.objectives.includes(capability) && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select 
                  value={formData.riskTolerance} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative - Minimize risks</SelectItem>
                    <SelectItem value="moderate">Moderate - Balanced approach</SelectItem>
                    <SelectItem value="aggressive">Aggressive - High-risk, high-reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Budget & Priority</h2>
              <p className="text-muted-foreground">
                Set budget limits and deployment priority
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="100"
                  max="100000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    budget: parseInt(e.target.value) || 100 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Estimated usage: ~{Math.round(formData.budget / (selectedAgentType?.costPerHour || 200))} hours/month
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Deployment Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Deploy when resources available</SelectItem>
                    <SelectItem value="medium">Medium - Standard deployment queue</SelectItem>
                    <SelectItem value="high">High - Priority deployment</SelectItem>
                    <SelectItem value="urgent">Urgent - Immediate deployment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Configuration Summary */}
              <div className="space-y-4">
                <Label>Configuration Summary</Label>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Agent Type:</span>
                      <span className="font-medium">{selectedAgentType?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Model:</span>
                      <span className="font-medium">{formData.model}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Tasks:</span>
                      <span className="font-medium">{formData.maxConcurrentTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Budget:</span>
                      <span className="font-medium">${formData.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Objectives:</span>
                      <span className="font-medium">{formData.objectives.length} selected</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    
      <><PageHeader
      items={[
        { label: "CEO Dashboard", href: "/dashboard/ceo" },
        { label: "AI Agents", href: "/dashboard/ceo/agents" },
        { label: "Create Agent", isCurrentPage: true },
      ]} /><main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Create New AI Agent</h1>
          </div>
          <p className="text-muted-foreground">
            Deploy a specialized AI agent to automate and optimize your business processes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button onClick={handleNextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy Agent
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main></>
  );
} 