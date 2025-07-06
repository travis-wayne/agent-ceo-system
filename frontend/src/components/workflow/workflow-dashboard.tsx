"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Circle,
  Activity,
  Zap,
  Settings
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  workflowType: string;
  category: string;
  status: string;
  isActive: boolean;
  version: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  lastExecuted?: string;
  createdAt: string;
  updatedAt: string;
  triggers: any[];
  actions: any[];
  conditions: any[];
  executions: any[];
  _count: {
    triggers: number;
    actions: number;
    conditions: number;
    executions: number;
  };
}

export function WorkflowDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workflows");
      const data = await response.json();
      
      if (data.success) {
        setWorkflows(data.data);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executionType: "MANUAL",
          triggerData: {}
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh workflows to update execution stats
        fetchWorkflows();
      }
    } catch (error) {
      console.error("Error executing workflow:", error);
    }
  };

  const handleToggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !isActive,
          status: !isActive ? "ACTIVE" : "PAUSED"
        })
      });
      
      if (response.ok) {
        fetchWorkflows();
      }
    } catch (error) {
      console.error("Error toggling workflow:", error);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        fetchWorkflows();
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || workflow.status === filterStatus;
    const matchesType = filterType === "all" || workflow.workflowType === filterType;
    const matchesCategory = filterCategory === "all" || workflow.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (status === "ACTIVE" && isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    } else if (status === "PAUSED" || !isActive) {
      return <Badge variant="secondary">Paused</Badge>;
    } else if (status === "DRAFT") {
      return <Badge variant="outline">Draft</Badge>;
    } else if (status === "ERROR") {
      return <Badge variant="destructive">Error</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="LEAD_PROCESSING">Lead Processing</SelectItem>
                <SelectItem value="CUSTOMER_ONBOARDING">Customer Onboarding</SelectItem>
                <SelectItem value="CONTENT_PUBLISHING">Content Publishing</SelectItem>
                <SelectItem value="SALES_AUTOMATION">Sales Automation</SelectItem>
                <SelectItem value="MARKETING_AUTOMATION">Marketing Automation</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="SALES">Sales</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="OPERATIONS">Operations</SelectItem>
                <SelectItem value="CUSTOMER_SERVICE">Customer Service</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows ({filteredWorkflows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Executed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{workflow.name}</div>
                        {workflow.description && (
                          <div className="text-sm text-muted-foreground">
                            {workflow.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {workflow.workflowType.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(workflow.status, workflow.isActive)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {workflow._count.triggers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {workflow._count.actions}
                        </span>
                        <span className="flex items-center gap-1">
                          <Circle className="h-3 w-3" />
                          {workflow._count.conditions}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {workflow.executionCount} runs
                          </span>
                          {workflow.successRate > 0 && (
                            <span className={`text-sm font-medium ${getSuccessRateColor(workflow.successRate)}`}>
                              {workflow.successRate.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {workflow.successCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            {workflow.failureCount}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {workflow.lastExecuted 
                          ? formatDistanceToNow(new Date(workflow.lastExecuted), { addSuffix: true })
                          : "Never"
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExecuteWorkflow(workflow.id)}
                          disabled={!workflow.isActive}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/ceo/workflows/${workflow.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/ceo/workflows/${workflow.id}/settings`}>
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleWorkflow(workflow.id, workflow.isActive)}
                            >
                              {workflow.isActive ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredWorkflows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No workflows found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 