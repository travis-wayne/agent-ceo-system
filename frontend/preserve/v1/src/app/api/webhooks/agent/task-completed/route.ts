import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate webhook payload
    const { agentId, taskId, status, result, metadata } = body;
    
    if (!agentId || !taskId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: agentId, taskId, status" },
        { status: 400 }
      );
    }

    // Log the webhook received
    console.log("Agent Task Completed Webhook received:", {
      agentId,
      taskId,
      status,
      timestamp: new Date().toISOString()
    });

    // TODO: Implement actual task completion logic
    // This is where you would:
    // 1. Update task status in database
    // 2. Trigger notifications
    // 3. Update agent performance metrics
    // 4. Trigger follow-up workflows
    
    // Example response structure for n8n integration
    const response = {
      success: true,
      taskId,
      agentId,
      status,
      processedAt: new Date().toISOString(),
      actions: [
        {
          type: "notification",
          message: `Task ${taskId} completed by ${agentId}`,
          recipients: ["admin@company.com"]
        },
        {
          type: "update_metrics",
          agentId,
          metrics: {
            tasksCompleted: 1,
            lastActivity: new Date().toISOString()
          }
        }
      ]
    };

    // If the task failed, trigger error handling workflow
    if (status === "failed") {
      response.actions.push({
        type: "error_handling",
        taskId,
        agentId,
        error: result?.error || "Unknown error",
        retryCount: metadata?.retryCount || 0
      });
    }

    // If the task succeeded, check for follow-up actions
    if (status === "completed" && result?.followUpActions) {
      response.actions.push({
        type: "trigger_followup",
        actions: result.followUpActions
      });
    }

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Agent task completion webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "Agent Task Completion Webhook",
    method: "POST",
    description: "Webhook endpoint for n8n to notify when AI agents complete tasks",
    expectedFields: {
      agentId: "string (required) - ID of the agent that completed the task",
      taskId: "string (required) - ID of the completed task", 
      status: "string (required) - completion status: 'completed' | 'failed' | 'error'",
      result: "object (optional) - task execution result data",
      metadata: "object (optional) - additional metadata about the task"
    },
    example: {
      agentId: "agent-ceo-001",
      taskId: "task-12345",
      status: "completed",
      result: {
        output: "Strategic analysis completed successfully",
        metrics: {
          processingTime: "2.3s",
          confidence: 0.94
        },
        followUpActions: [
          {
            type: "send_email",
            recipient: "ceo@company.com",
            subject: "Strategic Analysis Ready"
          }
        ]
      },
      metadata: {
        priority: "high",
        category: "strategic_analysis",
        requestedBy: "user-123"
      }
    }
  });
} 