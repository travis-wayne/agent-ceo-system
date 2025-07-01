import { prisma } from "@/lib/db";
import { WorkflowExecution, WorkflowStatus, TriggerType, WebhookLog } from "@prisma/client";

export interface CreateWorkflowExecutionData {
  workflowId: string;
  workflowName: string;
  executionId?: string;
  input?: Record<string, any>;
  triggeredBy: TriggerType;
  triggerData?: Record<string, any>;
  agentId?: string;
  workspaceId: string;
}

export interface WebhookLogData {
  endpoint: string;
  method: string;
  headers?: Record<string, any>;
  payload?: Record<string, any>;
  statusCode: number;
  responseBody?: Record<string, any>;
  responseTime: number;
  error?: string;
  workspaceId?: string;
  workflowExecutionId?: string;
}

export interface N8nWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'Easy' | 'Medium' | 'Hard';
  estimatedSetup: string;
  triggers: string[];
  actions: string[];
  integrations: string[];
}

export class WorkflowIntegrationService {
  // =============================================
  // WORKFLOW EXECUTION MANAGEMENT
  // =============================================

  static async createWorkflowExecution(data: CreateWorkflowExecutionData): Promise<WorkflowExecution> {
    try {
      const execution = await prisma.workflowExecution.create({
        data: {
          workflowId: data.workflowId,
          workflowName: data.workflowName,
          executionId: data.executionId,
          input: data.input || {},
          triggeredBy: data.triggeredBy,
          triggerData: data.triggerData || {},
          agentId: data.agentId,
          workspaceId: data.workspaceId,
          status: WorkflowStatus.running
        },
        include: {
          agent: true
        }
      });

      console.log(`Workflow execution started: ${execution.workflowName} (${execution.id})`);
      return execution;
    } catch (error) {
      console.error("Error creating workflow execution:", error);
      throw new Error("Failed to create workflow execution");
    }
  }

  static async updateWorkflowExecution(
    executionId: string,
    data: {
      status?: WorkflowStatus;
      output?: Record<string, any>;
      error?: string;
      duration?: number;
    }
  ): Promise<WorkflowExecution> {
    const updateData: any = {};

    if (data.status !== undefined) {
      updateData.status = data.status;
      
      if (data.status === WorkflowStatus.completed || 
          data.status === WorkflowStatus.failed || 
          data.status === WorkflowStatus.cancelled) {
        updateData.completedAt = new Date();
      }
    }

    if (data.output !== undefined) {
      updateData.output = data.output;
    }

    if (data.error !== undefined) {
      updateData.error = data.error;
    }

    if (data.duration !== undefined) {
      updateData.duration = data.duration;
    }

    return prisma.workflowExecution.update({
      where: { id: executionId },
      data: updateData
    });
  }

  static async getWorkflowExecutionsByWorkspace(
    workspaceId: string,
    filters?: {
      status?: WorkflowStatus[];
      workflowId?: string;
      limit?: number;
    }
  ): Promise<WorkflowExecution[]> {
    const whereClause: any = { workspaceId };

    if (filters?.status) {
      whereClause.status = { in: filters.status };
    }

    if (filters?.workflowId) {
      whereClause.workflowId = filters.workflowId;
    }

    return prisma.workflowExecution.findMany({
      where: whereClause,
      include: {
        agent: true,
        tasks: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        webhookLogs: {
          take: 3,
          orderBy: { timestamp: 'desc' }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: filters?.limit || 50
    });
  }

  // =============================================
  // WEBHOOK LOGGING
  // =============================================

  static async logWebhookCall(data: WebhookLogData): Promise<WebhookLog> {
    try {
      const log = await prisma.webhookLog.create({
        data: {
          endpoint: data.endpoint,
          method: data.method,
          headers: data.headers || {},
          payload: data.payload || {},
          statusCode: data.statusCode,
          responseBody: data.responseBody || {},
          responseTime: data.responseTime,
          error: data.error,
          workspaceId: data.workspaceId,
          workflowExecutionId: data.workflowExecutionId
        }
      });

      return log;
    } catch (error) {
      console.error("Error logging webhook call:", error);
      throw new Error("Failed to log webhook call");
    }
  }

  static async getWebhookLogs(
    workspaceId?: string,
    filters?: {
      endpoint?: string;
      statusCode?: number[];
      limit?: number;
    }
  ): Promise<WebhookLog[]> {
    const whereClause: any = {};

    if (workspaceId) {
      whereClause.workspaceId = workspaceId;
    }

    if (filters?.endpoint) {
      whereClause.endpoint = { contains: filters.endpoint };
    }

    if (filters?.statusCode) {
      whereClause.statusCode = { in: filters.statusCode };
    }

    return prisma.webhookLog.findMany({
      where: whereClause,
      include: {
        workflowExecution: true
      },
      orderBy: { timestamp: 'desc' },
      take: filters?.limit || 100
    });
  }

  // =============================================
  // N8N INTEGRATION HELPERS
  // =============================================

  static async triggerN8nWorkflow(
    workflowId: string,
    payload: Record<string, any>,
    workspaceId: string
  ): Promise<{ success: boolean; executionId?: string; error?: string }> {
    try {
      const n8nUrl = process.env.N8N_URL || process.env.NEXT_PUBLIC_N8N_URL;
      
      if (!n8nUrl) {
        throw new Error("N8N URL not configured");
      }

      const startTime = Date.now();
      
      // Create workflow execution record
      const execution = await this.createWorkflowExecution({
        workflowId,
        workflowName: `Workflow ${workflowId}`,
        input: payload,
        triggeredBy: TriggerType.webhook,
        triggerData: { source: 'agent-ceo-platform' },
        workspaceId
      });

      // In a real implementation, this would make HTTP request to n8n
      // const response = await fetch(`${n8nUrl}/webhook/${workflowId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      const responseTime = Date.now() - startTime;

      // Mock successful response for now
      const mockSuccess = Math.random() > 0.1; // 90% success rate

      // Log the webhook call
      await this.logWebhookCall({
        endpoint: `/webhook/${workflowId}`,
        method: 'POST',
        payload,
        statusCode: mockSuccess ? 200 : 500,
        responseBody: mockSuccess ? { status: 'triggered' } : { error: 'Workflow failed' },
        responseTime,
        error: mockSuccess ? undefined : 'Mock workflow failure',
        workspaceId,
        workflowExecutionId: execution.id
      });

      // Update execution status
      await this.updateWorkflowExecution(execution.id, {
        status: mockSuccess ? WorkflowStatus.completed : WorkflowStatus.failed,
        output: mockSuccess ? { triggered: true } : undefined,
        error: mockSuccess ? undefined : 'Mock workflow failure',
        duration: Math.round(responseTime / 1000)
      });

      return {
        success: mockSuccess,
        executionId: execution.id,
        error: mockSuccess ? undefined : 'Mock workflow failure'
      };
    } catch (error) {
      console.error("Error triggering n8n workflow:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =============================================
  // WORKFLOW TEMPLATES
  // =============================================

  static getWorkflowTemplates(): N8nWorkflowTemplate[] {
    return [
      {
        id: "lead-qualification-pipeline",
        name: "Lead Qualification Pipeline",
        description: "Automatically qualify and route leads based on AI analysis",
        category: "Lead Management",
        complexity: "Medium",
        estimatedSetup: "20-30 minutes",
        triggers: ["lead/status-change"],
        actions: ["CRM Update", "Email Notification", "Task Assignment"],
        integrations: ["CRM", "Email", "AI Agent"]
      },
      {
        id: "customer-onboarding-automation",
        name: "Customer Onboarding Automation",
        description: "Automated welcome sequence for new customers",
        category: "Customer Success",
        complexity: "Easy",
        estimatedSetup: "15-20 minutes",
        triggers: ["lead/status-change"],
        actions: ["Email Sequence", "Account Setup", "Success Team Notification"],
        integrations: ["Email", "CRM", "Support System"]
      },
      {
        id: "email-campaign-optimization",
        name: "Email Campaign Optimization",
        description: "Optimize email campaigns based on engagement data",
        category: "Marketing",
        complexity: "Hard",
        estimatedSetup: "45-60 minutes",
        triggers: ["email/campaign-event"],
        actions: ["A/B Testing", "Segment Updates", "Performance Reporting"],
        integrations: ["Email Marketing", "Analytics", "AI Agent"]
      },
      {
        id: "agent-task-monitoring",
        name: "Agent Task Monitoring",
        description: "Monitor AI agent performance and handle failures",
        category: "Agent Management",
        complexity: "Medium",
        estimatedSetup: "25-35 minutes",
        triggers: ["agent/task-completed"],
        actions: ["Performance Tracking", "Error Handling", "Escalation"],
        integrations: ["AI Agents", "Monitoring", "Notifications"]
      }
    ];
  }

  // =============================================
  // ANALYTICS
  // =============================================

  static async getWorkflowAnalytics(workspaceId: string): Promise<{
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    avgExecutionTime: number;
    successRate: number;
    mostUsedWorkflows: Array<{ workflowId: string; name: string; count: number }>;
  }> {
    const executions = await prisma.workflowExecution.findMany({
      where: { workspaceId }
    });

    const successful = executions.filter(e => e.status === WorkflowStatus.completed);
    const failed = executions.filter(e => e.status === WorkflowStatus.failed);
    
    const avgExecutionTime = executions
      .filter(e => e.duration)
      .reduce((sum, e) => sum + (e.duration || 0), 0) / 
      Math.max(executions.filter(e => e.duration).length, 1);

    const successRate = executions.length > 0 ? (successful.length / executions.length) * 100 : 0;

    // Group by workflow ID and count
    const workflowCounts = executions.reduce((acc, execution) => {
      const key = execution.workflowId;
      if (!acc[key]) {
        acc[key] = { workflowId: key, name: execution.workflowName, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { workflowId: string; name: string; count: number }>);

    const mostUsedWorkflows = Object.values(workflowCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalExecutions: executions.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      avgExecutionTime: Number(avgExecutionTime.toFixed(2)),
      successRate: Number(successRate.toFixed(1)),
      mostUsedWorkflows
    };
  }
} 