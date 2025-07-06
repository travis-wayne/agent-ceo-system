import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { 
  WorkflowType, 
  WorkflowCategory, 
  WorkflowStatus,
  WorkflowPriority,
  WorkflowEnvironment,
  AccessLevel 
} from "@prisma/client";

// GET /api/workflows - Get all workflows for the authenticated user
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
    const workflowType = searchParams.get("workflowType") as WorkflowType | null;
    const category = searchParams.get("category") as WorkflowCategory | null;
    const status = searchParams.get("status") as WorkflowStatus | null;
    const isTemplate = searchParams.get("isTemplate") === "true";
    const isActive = searchParams.get("isActive") === "true";
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const whereClause: any = {
      userId: session.user.id
    };

    if (workflowType) whereClause.workflowType = workflowType;
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (isTemplate !== undefined) whereClause.isTemplate = isTemplate;
    if (isActive !== undefined) whereClause.isActive = isActive;
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } }
      ];
    }

    // Get workflows with related data
    const workflows = await prisma.workflow.findMany({
      where: whereClause,
      include: {
        triggers: {
          select: {
            id: true,
            name: true,
            triggerType: true,
            isEnabled: true,
            lastTriggered: true,
            triggerCount: true
          }
        },
        actions: {
          select: {
            id: true,
            name: true,
            actionType: true,
            executionOrder: true,
            executionCount: true,
            successCount: true
          },
          orderBy: { executionOrder: "asc" }
        },
        conditions: {
          select: {
            id: true,
            name: true,
            conditionType: true,
            evaluationCount: true
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
            executions: true,
            variables: true
          }
        }
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.workflow.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      data: workflows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + workflows.length < totalCount
      }
    });

  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.workflowType) {
      return NextResponse.json(
        { error: "Name and workflow type are required" },
        { status: 400 }
      );
    }

    // Create workflow
    const workflow = await prisma.workflow.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        name: body.name,
        description: body.description,
        workflowType: body.workflowType,
        category: body.category || WorkflowCategory.GENERAL,
        definition: body.definition || {},
        executionConfig: body.executionConfig,
        retryPolicy: body.retryPolicy,
        timeoutSettings: body.timeoutSettings,
        integrationConfig: body.integrationConfig,
        dataMapping: body.dataMapping,
        n8nWorkflowId: body.n8nWorkflowId,
        n8nConfig: body.n8nConfig,
        useN8nExecution: body.useN8nExecution || false,
        tags: body.tags || [],
        priority: body.priority || WorkflowPriority.MEDIUM,
        environment: body.environment || WorkflowEnvironment.PRODUCTION,
        accessLevel: body.accessLevel || AccessLevel.PRIVATE,
        isTemplate: body.isTemplate || false,
        templateId: body.templateId,
        status: WorkflowStatus.DRAFT,
        createdBy: session.user.id
      },
      include: {
        _count: {
          select: {
            triggers: true,
            actions: true,
            conditions: true,
            executions: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: workflow
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
} 