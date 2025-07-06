import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { WorkflowExecutionStatus } from "@prisma/client";

// GET /api/workflows/executions - Get workflow executions with filtering and pagination
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
    
    // Parse query parameters
    const workflowId = searchParams.get("workflowId");
    const status = searchParams.get("status") as WorkflowExecutionStatus | null;
    const executionType = searchParams.get("executionType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "startedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const whereClause: any = {
      userId: session.user.id
    };

    if (workflowId) whereClause.workflowId = workflowId;
    if (status) whereClause.status = status;
    if (executionType) whereClause.executionType = executionType;
    
    if (startDate || endDate) {
      whereClause.startedAt = {};
      if (startDate) whereClause.startedAt.gte = new Date(startDate);
      if (endDate) whereClause.startedAt.lte = new Date(endDate);
    }

    // Get executions with related data
    const executions = await prisma.workflowExecution.findMany({
      where: whereClause,
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
            workflowType: true,
            category: true
          }
        },
        executionLogs: {
          select: {
            id: true,
            logLevel: true,
            message: true,
            timestamp: true,
            stepId: true,
            actionId: true
          },
          orderBy: { timestamp: "desc" },
          take: 10
        }
      },
      orderBy: {
        [sortBy]: sortOrder as "asc" | "desc"
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.workflowExecution.count({
      where: whereClause
    });

    // Get execution statistics for the current filter
    const executionStats = await prisma.workflowExecution.groupBy({
      by: ['status'],
      where: whereClause,
      _count: { id: true }
    });

    // Calculate average execution time
    const avgExecutionTime = await prisma.workflowExecution.aggregate({
      where: {
        ...whereClause,
        status: WorkflowExecutionStatus.COMPLETED,
        duration: { not: null }
      },
      _avg: { duration: true }
    });

    // Get execution trends by hour for the last 24 hours
    const executionTrends = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(startedAt, '%Y-%m-%d %H:00:00') as hour,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed
      FROM WorkflowExecution
      WHERE userId = ${session.user.id}
        AND startedAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ${workflowId ? `AND workflowId = ${workflowId}` : ''}
      GROUP BY DATE_FORMAT(startedAt, '%Y-%m-%d %H:00:00')
      ORDER BY hour ASC
    `;

    return NextResponse.json({
      success: true,
      data: executions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + executions.length < totalCount
      },
      statistics: {
        executionStats: executionStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        }, {} as Record<string, number>),
        avgExecutionTime: avgExecutionTime._avg.duration || 0,
        executionTrends
      }
    });

  } catch (error) {
    console.error("Error fetching workflow executions:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow executions" },
      { status: 500 }
    );
  }
} 