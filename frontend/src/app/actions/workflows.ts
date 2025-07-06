"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  WorkflowType,
  WorkflowCategory,
  WorkflowStatus,
  WorkflowPriority,
  WorkflowEnvironment,
  AccessLevel,
  WorkflowExecutionStatus,
  TriggerType,
  ActionType,
  ConditionType,
  VariableType,
  TemplateStatus,
  IntegrationType,
  MonitoringType
} from "@prisma/client";

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface CreateWorkflowRequest {
  name: string;
  description?: string;
  workflowType: WorkflowType;
  category?: WorkflowCategory;
  definition: any;
  executionConfig?: any;
  retryPolicy?: any;
  timeoutSettings?: any;
  integrationConfig?: any;
  dataMapping?: any;
  tags?: string[];
  priority?: WorkflowPriority;
  environment?: WorkflowEnvironment;
  accessLevel?: AccessLevel;
  isTemplate?: boolean;
  templateId?: string;
}

interface ExecuteWorkflowRequest {
  workflowId: string;
  triggerData?: any;
  executionContext?: any;
  variables?: Record<string, any>;
  waitForCompletion?: boolean;
  useN8n?: boolean;
}

interface UpdateWorkflowRequest {
  workflowId: string;
  updates: Partial<CreateWorkflowRequest>;
  strictValidation?: boolean;
}

interface CreateTriggerRequest {
  workflowId: string;
  name: string;
  description?: string;
  triggerType: TriggerType;
  configuration: any;
  conditions?: any;
  scheduleConfig?: any;
  webhookConfig?: any;
  enabled?: boolean;
}

interface CreateActionRequest {
  workflowId: string;
  name: string;
  description?: string;
  actionType: ActionType;
  configuration: any;
  inputMapping?: any;
  outputMapping?: any;
  executionOrder?: number;
  dependencies?: string[];
  errorHandling?: any;
  retryPolicy?: any;
  timeout?: number;
}

interface CreateConditionRequest {
  workflowId: string;
  name: string;
  description?: string;
  conditionType: ConditionType;
  logicExpression: string;
  evaluationRules: any;
  inputVariables?: any;
  outputVariables?: any;
  appliesTo?: string[];
}

interface CreateTemplateRequest {
  name: string;
  description?: string;
  templateType: WorkflowType;
  category?: WorkflowCategory;
  templateDefinition: any;
  defaultConfiguration?: any;
  customizationOptions?: any;
  tags?: string[];
  instructions?: string;
  documentation?: string;
  requiredIntegrations?: string[];
  optionalIntegrations?: string[];
  isPublic?: boolean;
}

// =============================================================================
// WORKFLOW MANAGEMENT
// =============================================================================

export async function createWorkflow(request: CreateWorkflowRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return { success: false, error: "User workspace not found" };
    }

    // Create workflow
    const workflow = await prisma.workflow.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        name: request.name,
        description: request.description,
        workflowType: request.workflowType,
        category: request.category || WorkflowCategory.GENERAL,
        definition: request.definition,
        executionConfig: request.executionConfig,
        retryPolicy: request.retryPolicy,
        timeoutSettings: request.timeoutSettings,
        integrationConfig: request.integrationConfig,
        dataMapping: request.dataMapping,
        tags: request.tags || [],
        priority: request.priority || WorkflowPriority.MEDIUM,
        environment: request.environment || WorkflowEnvironment.PRODUCTION,
        accessLevel: request.accessLevel || AccessLevel.PRIVATE,
        isTemplate: request.isTemplate || false,
        templateId: request.templateId,
        status: WorkflowStatus.DRAFT,
        createdBy: session.user.id
      }
    });

    revalidatePath("/dashboard/workflows");
    return { success: true, data: workflow };

  } catch (error) {
    console.error("Error creating workflow:", error);
    return { success: false, error: "Failed to create workflow" };
  }
}

export async function getWorkflows(filters?: {
  workflowType?: WorkflowType;
  category?: WorkflowCategory;
  status?: WorkflowStatus;
  isTemplate?: boolean;
  isActive?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: session.user.id,
        ...(filters?.workflowType && { workflowType: filters.workflowType }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.isTemplate !== undefined && { isTemplate: filters.isTemplate }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive })
      },
      include: {
        triggers: {
          select: {
            id: true,
            name: true,
            triggerType: true,
            isEnabled: true,
            lastTriggered: true
          }
        },
        actions: {
          select: {
            id: true,
            name: true,
            actionType: true,
            executionOrder: true
          }
        },
        conditions: {
          select: {
            id: true,
            name: true,
            conditionType: true
          }
        },
        executions: {
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            duration: true
          },
          orderBy: { startedAt: "desc" },
          take: 5
        },
        _count: {
          select: {
            triggers: true,
            actions: true,
            conditions: true,
            executions: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return { success: true, data: workflows };

  } catch (error) {
    console.error("Error fetching workflows:", error);
    return { success: false, error: "Failed to fetch workflows" };
  }
}

export async function getWorkflowById(workflowId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId: session.user.id
      },
      include: {
        triggers: true,
        actions: {
          orderBy: { executionOrder: "asc" }
        },
        conditions: {
          orderBy: { evaluationOrder: "asc" }
        },
        variables: true,
        steps: {
          orderBy: { executionOrder: "asc" }
        },
        executions: {
          orderBy: { startedAt: "desc" },
          take: 10,
          include: {
            executionLogs: {
              orderBy: { timestamp: "desc" },
              take: 50
            }
          }
        },
        monitoringConfigs: true,
        integrations: true,
        basedOnTemplate: {
          select: {
            id: true,
            name: true,
            version: true
          }
        }
      }
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    return { success: true, data: workflow };

  } catch (error) {
    console.error("Error fetching workflow:", error);
    return { success: false, error: "Failed to fetch workflow" };
  }
}

export async function updateWorkflow(request: UpdateWorkflowRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Check if workflow exists and user has permission
    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        id: request.workflowId,
        userId: session.user.id
      }
    });

    if (!existingWorkflow) {
      return { success: false, error: "Workflow not found" };
    }

    // Update workflow
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: request.workflowId },
      data: {
        ...request.updates,
        lastModifiedBy: session.user.id,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/dashboard/workflows/${request.workflowId}`);
    return { success: true, data: updatedWorkflow };

  } catch (error) {
    console.error("Error updating workflow:", error);
    return { success: false, error: "Failed to update workflow" };
  }
}

export async function deleteWorkflow(workflowId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Check if workflow exists and user has permission
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId: session.user.id
      }
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    // Delete related records first
    await prisma.$transaction(async (tx) => {
      // Delete execution logs
      await tx.workflowExecutionLog.deleteMany({
        where: { workflowId }
      });

      // Delete executions
      await tx.workflowExecution.deleteMany({
        where: { workflowId }
      });

      // Delete workflow components
      await tx.workflowTrigger.deleteMany({
        where: { workflowId }
      });

      await tx.workflowAction.deleteMany({
        where: { workflowId }
      });

      await tx.workflowCondition.deleteMany({
        where: { workflowId }
      });

      await tx.workflowVariable.deleteMany({
        where: { workflowId }
      });

      await tx.workflowStep.deleteMany({
        where: { workflowId }
      });

      await tx.workflowMonitoring.deleteMany({
        where: { workflowId }
      });

      await tx.workflowIntegration.deleteMany({
        where: { workflowId }
      });

      // Finally delete the workflow
      await tx.workflow.delete({
        where: { id: workflowId }
      });
    });

    revalidatePath("/dashboard/workflows");
    return { success: true };

  } catch (error) {
    console.error("Error deleting workflow:", error);
    return { success: false, error: "Failed to delete workflow" };
  }
}

export async function activateWorkflow(workflowId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const workflow = await prisma.workflow.update({
      where: {
        id: workflowId,
        userId: session.user.id
      },
      data: {
        isActive: true,
        status: WorkflowStatus.ACTIVE,
        lastModifiedBy: session.user.id
      }
    });

    revalidatePath(`/dashboard/workflows/${workflowId}`);
    return { success: true, data: workflow };

  } catch (error) {
    console.error("Error activating workflow:", error);
    return { success: false, error: "Failed to activate workflow" };
  }
}

export async function deactivateWorkflow(workflowId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const workflow = await prisma.workflow.update({
      where: {
        id: workflowId,
        userId: session.user.id
      },
      data: {
        isActive: false,
        status: WorkflowStatus.PAUSED,
        lastModifiedBy: session.user.id
      }
    });

    revalidatePath(`/dashboard/workflows/${workflowId}`);
    return { success: true, data: workflow };

  } catch (error) {
    console.error("Error deactivating workflow:", error);
    return { success: false, error: "Failed to deactivate workflow" };
  }
}

// =============================================================================
// WORKFLOW EXECUTION
// =============================================================================

export async function executeWorkflow(request: ExecuteWorkflowRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return { success: false, error: "User workspace not found" };
    }

    // Load workflow
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: request.workflowId,
        userId: session.user.id
      },
      include: {
        triggers: true,
        actions: { orderBy: { executionOrder: "asc" } },
        conditions: { orderBy: { evaluationOrder: "asc" } },
        variables: true
      }
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    if (!workflow.isActive) {
      return { success: false, error: "Workflow is not active" };
    }

    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        userId: session.user.id,
        workspaceId: user.workspaceId,
        executionType: "MANUAL",
        triggeredBy: "MANUAL",
        triggerData: request.triggerData,
        status: WorkflowExecutionStatus.RUNNING,
        currentStep: "initialization",
        executionContext: request.executionContext,
        inputVariables: request.variables,
        executionMetadata: {
          workflowVersion: workflow.version,
          executionEnvironment: workflow.environment
        }
      }
    });

    // For now, create a simple mock execution
    // In a real implementation, this would execute the workflow steps
    const mockExecutionResult = await createMockWorkflowExecution(workflow, execution);

    // Update execution with results
    const completedExecution = await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: mockExecutionResult.status,
        completedAt: new Date(),
        duration: mockExecutionResult.duration,
        completedSteps: mockExecutionResult.completedSteps,
        outputs: mockExecutionResult.outputs,
        results: mockExecutionResult.results
      }
    });

    // Update workflow statistics
    await updateWorkflowStatistics(workflow.id, mockExecutionResult.status);

    revalidatePath(`/dashboard/workflows/${workflow.id}`);
    return { 
      success: true, 
      data: {
        execution: completedExecution,
        results: mockExecutionResult
      }
    };

  } catch (error) {
    console.error("Error executing workflow:", error);
    return { success: false, error: "Failed to execute workflow" };
  }
}

async function createMockWorkflowExecution(workflow: any, execution: any) {
  // Mock workflow execution for demonstration
  const startTime = Date.now();
  
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const endTime = Date.now();
  const duration = endTime - startTime;

  return {
    status: WorkflowExecutionStatus.COMPLETED,
    duration,
    completedSteps: workflow.actions.map((action: any) => `action_${action.id}`),
    outputs: {
      executionId: execution.id,
      workflowId: workflow.id,
      timestamp: new Date().toISOString(),
      message: "Workflow executed successfully"
    },
    results: {
      summary: "Mock workflow execution completed",
      stepsExecuted: workflow.actions.length,
      totalDuration: duration
    }
  };
}

async function updateWorkflowStatistics(workflowId: string, status: WorkflowExecutionStatus) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId }
  });

  if (!workflow) return;

  const newExecutionCount = workflow.executionCount + 1;
  const newSuccessCount = status === WorkflowExecutionStatus.COMPLETED 
    ? workflow.successCount + 1 
    : workflow.successCount;
  const newFailureCount = status === WorkflowExecutionStatus.FAILED 
    ? workflow.failureCount + 1 
    : workflow.failureCount;
  const newSuccessRate = newExecutionCount > 0 ? (newSuccessCount / newExecutionCount) * 100 : 0;

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      executionCount: newExecutionCount,
      successCount: newSuccessCount,
      failureCount: newFailureCount,
      successRate: newSuccessRate,
      lastExecuted: new Date()
    }
  });
}

export async function getWorkflowExecutions(workflowId: string, limit = 20) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const executions = await prisma.workflowExecution.findMany({
      where: {
        workflowId,
        userId: session.user.id
      },
      include: {
        executionLogs: {
          orderBy: { timestamp: "desc" },
          take: 10
        }
      },
      orderBy: { startedAt: "desc" },
      take: limit
    });

    return { success: true, data: executions };

  } catch (error) {
    console.error("Error fetching workflow executions:", error);
    return { success: false, error: "Failed to fetch workflow executions" };
  }
}

// =============================================================================
// WORKFLOW COMPONENTS
// =============================================================================

export async function createWorkflowTrigger(request: CreateTriggerRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Verify workflow ownership
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: request.workflowId,
        userId: session.user.id
      }
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    const trigger = await prisma.workflowTrigger.create({
      data: {
        workflowId: request.workflowId,
        userId: session.user.id,
        name: request.name,
        description: request.description,
        triggerType: request.triggerType,
        configuration: request.configuration,
        conditions: request.conditions,
        scheduleConfig: request.scheduleConfig,
        webhookConfig: request.webhookConfig,
        isEnabled: request.enabled ?? true
      }
    });

    revalidatePath(`/dashboard/workflows/${request.workflowId}`);
    return { success: true, data: trigger };

  } catch (error) {
    console.error("Error creating workflow trigger:", error);
    return { success: false, error: "Failed to create workflow trigger" };
  }
}

export async function createWorkflowAction(request: CreateActionRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Verify workflow ownership
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: request.workflowId,
        userId: session.user.id
      }
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    const action = await prisma.workflowAction.create({
      data: {
        workflowId: request.workflowId,
        userId: session.user.id,
        name: request.name,
        description: request.description,
        actionType: request.actionType,
        configuration: request.configuration,
        inputMapping: request.inputMapping,
        outputMapping: request.outputMapping,
        executionOrder: request.executionOrder ?? 0,
        dependencies: request.dependencies ?? [],
        errorHandling: request.errorHandling,
        retryPolicy: request.retryPolicy,
        timeout: request.timeout
      }
    });

    revalidatePath(`/dashboard/workflows/${request.workflowId}`);
    return { success: true, data: action };

  } catch (error) {
    console.error("Error creating workflow action:", error);
    return { success: false, error: "Failed to create workflow action" };
  }
}

export async function createWorkflowCondition(request: CreateConditionRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Verify workflow ownership
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: request.workflowId,
        userId: session.user.id
      }
    });

    if (!workflow) {
      return { success: false, error: "Workflow not found" };
    }

    const condition = await prisma.workflowCondition.create({
      data: {
        workflowId: request.workflowId,
        userId: session.user.id,
        name: request.name,
        description: request.description,
        conditionType: request.conditionType,
        logicExpression: request.logicExpression,
        evaluationRules: request.evaluationRules,
        inputVariables: request.inputVariables,
        outputVariables: request.outputVariables,
        appliesTo: request.appliesTo ?? []
      }
    });

    revalidatePath(`/dashboard/workflows/${request.workflowId}`);
    return { success: true, data: condition };

  } catch (error) {
    console.error("Error creating workflow condition:", error);
    return { success: false, error: "Failed to create workflow condition" };
  }
}

// =============================================================================
// WORKFLOW TEMPLATES
// =============================================================================

export async function createWorkflowTemplate(request: CreateTemplateRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    const template = await prisma.workflowTemplate.create({
      data: {
        userId: session.user.id,
        workspaceId: user?.workspaceId,
        name: request.name,
        description: request.description,
        templateType: request.templateType,
        category: request.category ?? WorkflowCategory.GENERAL,
        templateDefinition: request.templateDefinition,
        defaultConfiguration: request.defaultConfiguration,
        customizationOptions: request.customizationOptions,
        tags: request.tags ?? [],
        instructions: request.instructions,
        documentation: request.documentation,
        requiredIntegrations: request.requiredIntegrations ?? [],
        optionalIntegrations: request.optionalIntegrations ?? [],
        isPublic: request.isPublic ?? false,
        status: TemplateStatus.DRAFT
      }
    });

    revalidatePath("/dashboard/workflows/templates");
    return { success: true, data: template };

  } catch (error) {
    console.error("Error creating workflow template:", error);
    return { success: false, error: "Failed to create workflow template" };
  }
}

export async function getWorkflowTemplates(filters?: {
  templateType?: WorkflowType;
  category?: WorkflowCategory;
  isPublic?: boolean;
  isFeatured?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const templates = await prisma.workflowTemplate.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { isPublic: true }
        ],
        ...(filters?.templateType && { templateType: filters.templateType }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic }),
        ...(filters?.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
        status: TemplateStatus.PUBLISHED
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            createdWorkflows: true
          }
        }
      },
      orderBy: [
        { isFeatured: "desc" },
        { usageCount: "desc" },
        { createdAt: "desc" }
      ]
    });

    return { success: true, data: templates };

  } catch (error) {
    console.error("Error fetching workflow templates:", error);
    return { success: false, error: "Failed to fetch workflow templates" };
  }
}

export async function createWorkflowFromTemplate(templateId: string, customizations?: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get template
    const template = await prisma.workflowTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return { success: false, error: "Template not found" };
    }

    // Check if user has access to template
    if (!template.isPublic && template.userId !== session.user.id) {
      return { success: false, error: "Access denied to template" };
    }

    // Create workflow from template
    const workflowData = {
      name: `${template.name} - Copy`,
      description: template.description,
      workflowType: template.templateType,
      category: template.category,
      definition: template.templateDefinition,
      executionConfig: template.defaultConfiguration,
      tags: template.tags,
      templateId: template.id,
      isTemplate: false
    };

    // Apply customizations if provided
    if (customizations) {
      Object.assign(workflowData, customizations);
    }

    const workflow = await createWorkflow(workflowData);

    if (workflow.success) {
      // Update template usage count
      await prisma.workflowTemplate.update({
        where: { id: templateId },
        data: {
          usageCount: { increment: 1 }
        }
      });
    }

    return workflow;

  } catch (error) {
    console.error("Error creating workflow from template:", error);
    return { success: false, error: "Failed to create workflow from template" };
  }
}

// =============================================================================
// WORKFLOW ANALYTICS
// =============================================================================

export async function getWorkflowAnalytics(workflowId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const whereClause = {
      userId: session.user.id,
      ...(workflowId && { workflowId })
    };

    const [
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      avgExecutionTime,
      recentExecutions
    ] = await Promise.all([
      prisma.workflowExecution.count({ where: whereClause }),
      prisma.workflowExecution.count({ 
        where: { ...whereClause, status: WorkflowExecutionStatus.COMPLETED }
      }),
      prisma.workflowExecution.count({ 
        where: { ...whereClause, status: WorkflowExecutionStatus.FAILED }
      }),
      prisma.workflowExecution.aggregate({
        where: { 
          ...whereClause, 
          status: WorkflowExecutionStatus.COMPLETED,
          duration: { not: null }
        },
        _avg: { duration: true }
      }),
      prisma.workflowExecution.findMany({
        where: whereClause,
        orderBy: { startedAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          startedAt: true,
          completedAt: true,
          duration: true,
          workflow: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
    ]);

    const analytics = {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      avgExecutionTime: avgExecutionTime._avg.duration || 0,
      recentExecutions
    };

    return { success: true, data: analytics };

  } catch (error) {
    console.error("Error fetching workflow analytics:", error);
    return { success: false, error: "Failed to fetch workflow analytics" };
  }
} 