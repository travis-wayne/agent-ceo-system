"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Workflow, 
  Play, 
  TrendingUp, 
  Clock,
  TrendingDown,
  Activity
} from "lucide-react";

interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
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
      
      // Mock data for now
      setStats({
        totalWorkflows: 12,
        activeWorkflows: 8,
        totalExecutions: 1847,
        successfulExecutions: 1756,
        avgExecutionTime: 2300,
        successRate: 95.1,
        executionsToday: 23
      });
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

  const getTrendIcon = (direction: string) => {
    if (direction === "up") {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (direction === "down") {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Workflows */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalWorkflows}</p>
              <p className="text-xs text-muted-foreground">Total Workflows</p>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon("up")}
              <span className="text-sm font-medium text-green-600">
                +{Math.round((stats.activeWorkflows / stats.totalWorkflows) * 100)}%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Workflow className="h-3 w-3 text-blue-500" />
              <span>{stats.activeWorkflows} active</span>
              <Activity className="h-3 w-3 text-green-500" />
              <span>{stats.totalWorkflows - stats.activeWorkflows} inactive</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Executions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalExecutions}</p>
              <p className="text-xs text-muted-foreground">Total Executions</p>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon("up")}
              <span className="text-sm font-medium text-green-600">
                +{Math.round((stats.executionsToday / stats.totalExecutions) * 100)}%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Play className="h-3 w-3 text-green-500" />
              <span>{stats.executionsToday} today</span>
              <Clock className="h-3 w-3 text-blue-500" />
              <span>Last 24h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${getSuccessRateColor(stats.successRate)}`}>
                {stats.successRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon("up")}
              <span className="text-sm font-medium text-green-600">
                +2.3%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>{stats.successfulExecutions} successful</span>
              <Activity className="h-3 w-3 text-red-500" />
              <span>{stats.totalExecutions - stats.successfulExecutions} failed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Execution Time */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {formatDuration(stats.avgExecutionTime)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Execution Time</p>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon("down")}
              <span className="text-sm font-medium text-green-600">
                -12%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>Per workflow run</span>
              <Activity className="h-3 w-3 text-green-500" />
              <span>Optimized</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 