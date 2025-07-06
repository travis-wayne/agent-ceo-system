"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  workflow: {
    id: string;
    name: string;
  };
  executionType: string;
  triggeredBy: string;
  errors?: any[];
  results?: any;
}

export function RecentWorkflowExecutions({ limit = 10 }: { limit?: number }) {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentExecutions();
  }, []);

  const fetchRecentExecutions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/executions?limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        setExecutions(data.data);
      }
    } catch (error) {
      console.error("Error fetching recent executions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "RUNNING":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Play className="h-3 w-3 mr-1" />
            Running
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "TIMEOUT":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Timeout
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const formatDuration = (milliseconds?: number) => {
    if (!milliseconds) return "—";
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
    return `${(milliseconds / 60000).toFixed(1)}m`;
  };

  const getExecutionTypeLabel = (type: string) => {
    switch (type) {
      case "MANUAL":
        return "Manual";
      case "TRIGGERED":
        return "Triggered";
      case "SCHEDULED":
        return "Scheduled";
      case "WEBHOOK":
        return "Webhook";
      case "API":
        return "API";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No recent workflow executions</p>
        <p className="text-sm">Execute a workflow to see results here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell>
                  <div className="font-medium">
                    {execution.workflow.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {execution.id.substring(0, 8)}...
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(execution.status)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getExecutionTypeLabel(execution.executionType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {formatDuration(execution.duration)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/ceo/workflows/${execution.workflowId}/executions/${execution.id}`}>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {executions.length >= limit && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/ceo/workflows/executions">
              View All Executions
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
} 