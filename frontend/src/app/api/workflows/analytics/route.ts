import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { WorkflowExecutionStatus } from "@prisma/client";

// GET /api/workflows/analytics - Get workflow analytics and statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId");
    const timeRange = searchParams.get("timeRange") || "30d"; // 1d, 7d, 30d, 90d, 1y

    // Calculate time range dates
    const now = new Date();
    const timeRangeDate = new Date();
    
    switch (timeRange) {
      case "1d":
        timeRangeDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        timeRangeDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        timeRangeDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        timeRangeDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        timeRangeDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        timeRangeDate.setDate(now.getDate() - 30);
    }

    const baseWhereClause = {
      userId: session.user.id,
      ...(workflowId && { workflowId }),
      startedAt: {
        gte: timeRangeDate
      }
    };

    // Get execution statistics
    const [
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      runningExecutions,
      cancelledExecutions,
      timeoutExecutions,
      avgExecutionTime,
      executionsToday,
      executionsThisWeek,
      executionsThisMonth
    ] = await Promise.all([
      // Total executions
      prisma.workflowExecution.count({
        where: baseWhereClause
      }),
      
      // Successful executions
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          status: WorkflowExecutionStatus.COMPLETED
        }
      }),
      
      // Failed executions
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          status: WorkflowExecutionStatus.FAILED
        }
      }),
      
      // Running executions
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          status: WorkflowExecutionStatus.RUNNING
        }
      }),
      
      // Cancelled executions
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          status: WorkflowExecutionStatus.CANCELLED
        }
      }),
      
      // Timeout executions
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          status: WorkflowExecutionStatus.TIMEOUT
        }
      }),
      
      // Average execution time
      prisma.workflowExecution.aggregate({
        where: {
          ...baseWhereClause,
          status: WorkflowExecutionStatus.COMPLETED,
          duration: { not: null }
        },
        _avg: { duration: true }
      }),
      
      // Executions today
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          startedAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          }
        }
      }),
      
      // Executions this week
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          startedAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Executions this month
      prisma.workflowExecution.count({
        where: {
          ...baseWhereClause,
          startedAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        }
      })
    ]);

    // Get workflow statistics
    const workflowStats = await prisma.workflow.aggregate({
      where: {
        userId: session.user.id,
        ...(workflowId && { id: workflowId })
      },
      _count: { id: true },
      _avg: { successRate: true }
    });

    // Get active workflows count
    const activeWorkflows = await prisma.workflow.count({
      where: {
        userId: session.user.id,
        isActive: true,
        ...(workflowId && { id: workflowId })
      }
    });

    // Get recent executions for timeline
    const recentExecutions = await prisma.workflowExecution.findMany({
      where: baseWhereClause,
      include: {
        workflow: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { startedAt: "desc" },
      take: 10
    });

    // Get execution trends by day
    const executionTrends = await prisma.$queryRaw`
      SELECT 
        DATE(startedAt) as date,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed
      FROM WorkflowExecution
      WHERE userId = ${session.user.id}
        AND startedAt >= ${timeRangeDate}
        ${workflowId ? `AND workflowId = ${workflowId}` : ''}
      GROUP BY DATE(startedAt)
      ORDER BY DATE(startedAt) ASC
    `;

    // Get top performing workflows
    const topWorkflows = await prisma.workflow.findMany({
      where: {
        userId: session.user.id,
        executionCount: { gt: 0 }
      },
      orderBy: [
        { successRate: "desc" },
        { executionCount: "desc" }
      ],
      take: 5,
      select: {
        id: true,
        name: true,
        executionCount: true,
        successCount: true,
        failureCount: true,
        successRate: true,
        avgExecutionTime: true
      }
    });

    // Get workflow type distribution
    const workflowTypeDistribution = await prisma.workflow.groupBy({
      by: ['workflowType'],
      where: {
        userId: session.user.id
      },
      _count: { id: true }
    });

    // Calculate success rate
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    const analytics = {
      // Execution Statistics
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      runningExecutions,
      cancelledExecutions,
      timeoutExecutions,
      successRate,
      
      // Time-based Statistics
      executionsToday,
      executionsThisWeek,
      executionsThisMonth,
      
      // Performance Statistics
      avgExecutionTime: avgExecutionTime._avg.duration || 0,
      
      // Workflow Statistics
      totalWorkflows: workflowStats._count.id,
      activeWorkflows,
      avgWorkflowSuccessRate: workflowStats._avg.successRate || 0,
      
      // Trends and Analytics
      executionTrends,
      topWorkflows,
      workflowTypeDistribution,
      recentExecutions,
      
      // Metadata
      timeRange,
      periodStart: timeRangeDate,
      periodEnd: now,
      workflowId
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error("Error fetching workflow analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow analytics" },
      { status: 500 }
    );
  }
} 