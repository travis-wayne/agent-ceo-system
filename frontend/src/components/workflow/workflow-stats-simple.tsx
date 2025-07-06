"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Workflow, 
  Play, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Clock
} from "lucide-react";

interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgExecutionTime: number;
  successRate: number;
  executionsToday: number;
}

export function WorkflowStats() {
  const [stats, setStats] = useState<WorkflowStats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    avgExecutionTime: 0,
    successRate: 0,
    executionsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch workflows
      const workflowsResponse = await fetch("/api/workflows");
      const workflowsData = await workflowsResponse.json();
      
      // Fetch analytics
      const analyticsResponse = await fetch("/api/workflows/analytics");
      const analyticsData = await analyticsResponse.json();
      
      if (workflowsData.success && analyticsData.success) {
        const workflows = workflowsData.data || [];
        const analytics = analyticsData.data || {};
        
        setStats({
          totalWorkflows: workflows.length,
          activeWorkflows: workflows.filter((w: any) => w.isActive).length,
          totalExecutions: analytics.totalExecutions || 0,
          successfulExecutions: analytics.successfulExecutions || 0,
          failedExecutions: analytics.failedExecutions || 0,
          avgExecutionTime: analytics.avgExecutionTime || 0,
          successRate: analytics.successRate || 0,
          executionsToday: analytics.executionsToday || 0
        });
      }
    } catch (error) {
      console.error("Error fetching workflow stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (milliseconds: number) => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
    return `${(milliseconds / 60000).toFixed(1)}m`;
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Workflows */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          <Workflow className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeWorkflows} active workflows
          </p>
        </CardContent>
      </Card>

      {/* Total Executions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
          <Play className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalExecutions}</div>
          <p className="text-xs text-muted-foreground">
            {stats.executionsToday} today
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSuccessRateColor(stats.successRate)}`}>
            {stats.successRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.successfulExecutions} successful
          </p>
        </CardContent>
      </Card>

      {/* Average Execution Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(stats.avgExecutionTime)}
          </div>
          <p className="text-xs text-muted-foreground">
            Per workflow run
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 