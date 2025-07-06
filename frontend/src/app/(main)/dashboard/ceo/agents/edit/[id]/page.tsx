"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  Power,
  Edit3
} from "lucide-react";

// Agent type configurations (matching the ones from creation)
const AGENT_TYPES = {
  ceo: {
    name: 'CEO Agent',
    emoji: '🧠',
    icon: Brain,
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    specializations: [
      "Strategic Decision Making",
      "Market Research", 
      "Business Development",
      "Competitive Analysis",
      "Investment Planning"
    ]
  },
  sales: {
    name: 'Sales Agent',
    emoji: '💼',
    icon: Briefcase,
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    specializations: [
      "Pipeline Management",
      "Conversion Optimization",
      "Customer Outreach",
      "Lead Qualification",
      "Sales Analytics"
    ]
  },
  marketing: {
    name: 'Marketing Agent',
    emoji: '🎨',
    icon: Palette,
    models: ["Claude-3 Opus", "GPT-4 Turbo", "GPT-4"],
    specializations: [
      "Brand Building",
      "Content Marketing",
      "Campaign Management",
      "Social Media",
      "SEO Optimization"
    ]
  },
  operations: {
    name: 'Operations Agent',
    emoji: '⚙️',
    icon: Settings,
    models: ["GPT-4 Turbo", "Claude-3 Opus", "GPT-4"],
    specializations: [
      "Process Improvement",
      "Automation",
      "Efficiency Optimization",
      "Quality Control",
      "Resource Management"
    ]
  },
  analytics: {
    name: 'Analytics Agent',
    emoji: '📊',
    icon: BarChart3,
    models: ["Claude-3 Opus", "GPT-4 Turbo", "GPT-4"],
    specializations: [
      "Data Analysis",
      "Predictive Modeling",
      "Business Intelligence",
      "Data Visualization",
      "Statistical Analysis"
    ]
  }
};

interface AgentFormData {
  name: string;
  specialization: string;
  model: string;
  avatar: string;
  maxConcurrentTasks: number;
  status: string;
}

export default function EditAgentPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    specialization: '',
    model: '',
    avatar: '',
    maxConcurrentTasks: 3,
    status: 'active'
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load agent data
  useEffect(() => {
    const loadAgent = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}`);
        if (!response.ok) throw new Error('Failed to load agent');
        
        const data = await response.json();
        if (data.success) {
          setAgent(data.agent);
          setFormData({
            name: data.agent.name,
            specialization: data.agent.specialization,
            model: data.agent.model,
            avatar: data.agent.avatar,
            maxConcurrentTasks: data.agent.maxConcurrentTasks,
            status: data.agent.status
          });
        }
      } catch (error) {
        toast.error('Failed to load agent data');
        router.push('/dashboard/ceo/agents');
      } finally {
        setIsLoading(false);
      }
    };

    if (agentId) {
      loadAgent();
    }
  }, [agentId, router]);

  // Validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Agent name is required");
    if (formData.name.length < 2) errors.push("Agent name must be at least 2 characters");
    if (formData.name.length > 100) errors.push("Agent name must be less than 100 characters");
    if (!formData.specialization.trim()) errors.push("Specialization is required");
    if (!formData.model) errors.push("AI model selection is required");
    if (formData.maxConcurrentTasks < 1 || formData.maxConcurrentTasks > 20) {
      errors.push("Max concurrent tasks must be between 1 and 20");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Agent updated successfully!');
        router.push('/dashboard/ceo/agents');
      } else {
        toast.error(data.error || 'Failed to update agent');
      }
    } catch (error) {
      toast.error('Failed to update agent');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, status: newStatus }));
        toast.success(`Agent status updated to ${newStatus}`);
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Agent deleted successfully');
        router.push('/dashboard/ceo/agents');
      } else {
        toast.error(data.error || 'Failed to delete agent');
      }
    } catch (error) {
      toast.error('Failed to delete agent');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'busy': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'maintenance': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading agent...</span>
        </div>
      </AppLayout>
    );
  }

  if (!agent) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested agent could not be found.</p>
          <Button onClick={() => router.push('/dashboard/ceo/agents')}>
            Back to Agents
          </Button>
        </div>
      </AppLayout>
    );
  }

  const agentTypeConfig = AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES];

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "AI Agents", href: "/dashboard/ceo/agents" },
          { label: agent.name, href: `/dashboard/ceo/agents/${agentId}` },
          { label: "Edit", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Edit3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Edit Agent</h1>
              </div>
              <p className="text-muted-foreground">
                Modify configuration and settings for {agent.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/ceo/agents')}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {agentTypeConfig && <agentTypeConfig.icon className="h-5 w-5" />}
                  Agent Configuration
                </CardTitle>
                <CardDescription>
                  Update basic settings and configuration for this agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter agent name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Agent Type</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-lg">{agentTypeConfig?.emoji}</span>
                      <span className="font-medium">{agentTypeConfig?.name}</span>
                      <Badge variant="secondary">Read-only</Badge>
                    </div>
                  </div>
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
                      {agentTypeConfig?.specializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model *</Label>
                    <Select 
                      value={formData.model} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {agentTypeConfig?.models.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTasks">Max Concurrent Tasks</Label>
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
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Power className="h-5 w-5" />
                  Agent Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Current Status:</span>
                  <Badge className={getStatusColor(formData.status)}>
                    {formData.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Label>Change Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(agent.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks:</span>
                  <span>{agent.totalTasks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span>{agent.successRate || 0}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Delete Agent
                </CardTitle>
                <CardDescription>
                  This action cannot be undone. This will permanently delete the agent and cancel all active tasks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Agent'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </AppLayout>
  );
} 