"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  Target,
  DollarSign,
  Heart,
  Settings,
  BarChart3
} from "lucide-react";

export default function CreateTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    priority: "medium",
    complexity: "medium",
    dueDate: "",
    budgetRange: "",
    selectedAgent: ""
  });

  // Mock workspace ID - in real app, get from auth context
  const workspaceId = "workspace_123";

  // Fetch agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`/api/agents?workspaceId=${workspaceId}`);
        if (response.ok) {
          const data = await response.json();
          setAgents(data.agents || []);
          // Auto-select first agent if available
          if (data.agents && data.agents.length > 0) {
            setFormData(prev => ({ ...prev, selectedAgent: data.agents[0].id }));
          }
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, [workspaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.selectedAgent || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert budget range to actual budget amount
      const budgetMap: Record<string, number> = {
        "under_1k": 500,
        "1k_5k": 3000,
        "5k_10k": 7500,
        "10k_25k": 17500,
        "over_25k": 50000
      };

      const taskData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        agentId: formData.selectedAgent,
        workspaceId: workspaceId,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        complexity: formData.complexity,
        category: formData.category,
        budgetAllocated: budgetMap[formData.budgetRange] || 5000,
        businessImpact: formData.priority === 'urgent' ? 9.5 : 
                       formData.priority === 'high' ? 8.0 : 
                       formData.priority === 'medium' ? 6.5 : 5.0
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Task created successfully!");
        router.push('/dashboard/ceo/tasks');
      } else {
        const errorData = await response.json();
        toast.error("Failed to create task: " + errorData.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskTypes = [
    { value: "strategic_analysis", label: "Strategic Analysis", icon: Target, color: "bg-purple-50" },
    { value: "revenue_generation", label: "Revenue Generation", icon: DollarSign, color: "bg-green-50" },
    { value: "marketing_initiatives", label: "Marketing Initiatives", icon: Heart, color: "bg-pink-50" },
    { value: "operational_excellence", label: "Operational Excellence", icon: Settings, color: "bg-blue-50" },
    { value: "business_intelligence", label: "Business Intelligence", icon: BarChart3, color: "bg-orange-50" }
  ];

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Tasks", href: "/dashboard/ceo/tasks" },
          { label: "Create Task", isCurrentPage: true },
        ]}
      />
      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
          <p className="text-muted-foreground mt-2">
            Create a new strategic task with AI agent assignment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                Provide the basic information for your task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Market Analysis for Q4 2024"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task objectives and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Task Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select 
                    value={formData.budgetRange} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_1k">Under $1,000</SelectItem>
                      <SelectItem value="1k_5k">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5k_10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k_25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="over_25k">Over $25,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Selection */}
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Assignment</CardTitle>
              <CardDescription>
                Select the AI agent that will handle this task
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {agents.map((agent) => (
                    <div 
                      key={agent.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        formData.selectedAgent === agent.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, selectedAgent: agent.id }))}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{agent.avatar}</div>
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-xs text-muted-foreground">{agent.specialization}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-medium">{agent.successRate || 95}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks Completed:</span>
                          <span className="font-medium">{agent.tasksCompleted || 0}</span>
                        </div>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="w-full justify-center">
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading agents...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between pt-6">
            <Link href="/dashboard/ceo/tasks">
              <Button variant="outline" type="button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Task...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Task
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
} 