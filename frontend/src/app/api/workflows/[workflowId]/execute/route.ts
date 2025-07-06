import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { WorkflowExecutionStatus, TriggerSource } from "@prisma/client";

// POST /api/workflows/[workflowId]/execute - Execute a workflow
export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { workflowId } = params;
    const body = await request.json();

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return NextResponse.json(
        { error: "User workspace not found" },
        { status: 400 }
      );
    }

    // Load workflow with components
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId: session.user.id
      },
      include: {
        triggers: {
          where: { isEnabled: true },
          orderBy: { priority: "desc" }
        },
        actions: {
          orderBy: { executionOrder: "asc" }
        },
        conditions: {
          orderBy: { evaluationOrder: "asc" }
        },
        variables: true,
        steps: {
          orderBy: { executionOrder: "asc" }
        }
      }
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    if (!workflow.isActive) {
      return NextResponse.json(
        { error: "Workflow is not active" },
        { status: 400 }
      );
    }

    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        userId: session.user.id,
        workspaceId: user.workspaceId,
        executionType: body.executionType || "MANUAL",
        triggeredBy: body.triggeredBy || TriggerSource.MANUAL,
        triggerData: body.triggerData,
        status: WorkflowExecutionStatus.RUNNING,
        currentStep: "initialization",
        executionContext: body.executionContext,
        inputVariables: body.variables,
        executionMetadata: {
          workflowVersion: workflow.version,
          executionEnvironment: workflow.environment,
          requestedBy: session.user.id,
          requestTimestamp: new Date().toISOString()
        }
      }
    });

    // Start workflow execution (mock implementation)
    const executionResult = await executeWorkflowSteps(workflow, execution, body);

    // Update execution with results
    const completedExecution = await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: executionResult.status,
        completedAt: executionResult.status === WorkflowExecutionStatus.COMPLETED ? new Date() : undefined,
        duration: executionResult.duration,
        completedSteps: executionResult.completedSteps,
        failedSteps: executionResult.failedSteps,
        outputs: executionResult.outputs,
        results: executionResult.results,
        errors: executionResult.errors
      }
    });

    // Update workflow statistics
    await updateWorkflowExecutionStats(workflow.id, executionResult.status);

    // Log execution completion
    await prisma.workflowExecutionLog.create({
      data: {
        executionId: execution.id,
        workflowId: workflow.id,
        userId: session.user.id,
        logLevel: executionResult.status === WorkflowExecutionStatus.COMPLETED ? "INFO" : "ERROR",
        message: executionResult.status === WorkflowExecutionStatus.COMPLETED 
          ? "Workflow execution completed successfully"
          : "Workflow execution failed",
        logData: {
          executionSummary: executionResult.summary,
          performance: executionResult.performance
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        execution: completedExecution,
        result: executionResult
      }
    });

  } catch (error) {
    console.error("Error executing workflow:", error);
    return NextResponse.json(
      { error: "Failed to execute workflow" },
      { status: 500 }
    );
  }
}

// Mock workflow execution engine
async function executeWorkflowSteps(workflow: any, execution: any, requestData: any) {
  const startTime = Date.now();
  const completedSteps: string[] = [];
  const failedSteps: string[] = [];
  const errors: any[] = [];
  
  try {
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Execute triggers (mock)
    for (const trigger of workflow.triggers) {
      try {
        // Mock trigger execution
        await new Promise(resolve => setTimeout(resolve, 100));
        completedSteps.push(`trigger_${trigger.id}`);
        
        // Update trigger stats
        await prisma.workflowTrigger.update({
          where: { id: trigger.id },
          data: {
            triggerCount: { increment: 1 },
            successCount: { increment: 1 },
            lastTriggered: new Date()
          }
        });
      } catch (error) {
        failedSteps.push(`trigger_${trigger.id}`);
        errors.push({
          step: `trigger_${trigger.id}`,
          error: error.message,
          timestamp: new Date()
        });
      }
    }

    // Execute conditions (mock)
    for (const condition of workflow.conditions) {
      try {
        // Mock condition evaluation
        await new Promise(resolve => setTimeout(resolve, 50));
        completedSteps.push(`condition_${condition.id}`);
        
        // Update condition stats
        await prisma.workflowCondition.update({
          where: { id: condition.id },
          data: {
            evaluationCount: { increment: 1 },
            trueCount: { increment: 1 } // Mock: assume condition is true
          }
        });
      } catch (error) {
        failedSteps.push(`condition_${condition.id}`);
        errors.push({
          step: `condition_${condition.id}`,
          error: error.message,
          timestamp: new Date()
        });
      }
    }

    // Execute actions (mock)
    for (const action of workflow.actions) {
      try {
        // Mock action execution
        await new Promise(resolve => setTimeout(resolve, 200));
        completedSteps.push(`action_${action.id}`);
        
        // Update action stats
        await prisma.workflowAction.update({
          where: { id: action.id },
          data: {
            executionCount: { increment: 1 },
            successCount: { increment: 1 }
          }
        });
      } catch (error) {
        failedSteps.push(`action_${action.id}`);
        errors.push({
          step: `action_${action.id}`,
          error: error.message,
          timestamp: new Date()
        });
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    const status = failedSteps.length === 0 
      ? WorkflowExecutionStatus.COMPLETED 
      : WorkflowExecutionStatus.FAILED;

    return {
      status,
      duration,
      completedSteps,
      failedSteps,
      errors,
      outputs: {
        executionId: execution.id,
        workflowId: workflow.id,
        timestamp: new Date().toISOString(),
        message: status === WorkflowExecutionStatus.COMPLETED 
          ? "Workflow executed successfully" 
          : "Workflow execution completed with errors",
        stepsCompleted: completedSteps.length,
        stepsFailed: failedSteps.length
      },
      results: {
        summary: `Executed ${completedSteps.length} steps successfully, ${failedSteps.length} failed`,
        performance: {
          totalDuration: duration,
          avgStepDuration: duration / (completedSteps.length + failedSteps.length)
        }
      },
      summary: {
        totalSteps: workflow.triggers.length + workflow.conditions.length + workflow.actions.length,
        completedSteps: completedSteps.length,
        failedSteps: failedSteps.length,
        duration
      },
      performance: {
        executionTime: duration,
        stepCount: completedSteps.length + failedSteps.length,
        successRate: completedSteps.length / (completedSteps.length + failedSteps.length) * 100
      }
    };

  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      status: WorkflowExecutionStatus.FAILED,
      duration,
      completedSteps,
      failedSteps: ["workflow_execution"],
      errors: [{
        step: "workflow_execution",
        error: error.message,
        timestamp: new Date()
      }],
      outputs: {},
      results: {
        summary: "Workflow execution failed",
        error: error.message
      },
      summary: {
        totalSteps: 0,
        completedSteps: 0,
        failedSteps: 1,
        duration
      },
      performance: {
        executionTime: duration,
        stepCount: 0,
        successRate: 0
      }
    };
  }
}

async function updateWorkflowExecutionStats(workflowId: string, status: WorkflowExecutionStatus) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: {
      executionCount: true,
      successCount: true,
      failureCount: true,
      avgExecutionTime: true
    }
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