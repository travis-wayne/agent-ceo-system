import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { 
  WorkflowType, 
  WorkflowCategory, 
  TemplateStatus,
  TemplateComplexity 
} from "@prisma/client";

// GET /api/workflows/templates - Get workflow templates
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
    const templateType = searchParams.get("templateType") as WorkflowType | null;
    const category = searchParams.get("category") as WorkflowCategory | null;
    const complexity = searchParams.get("complexity") as TemplateComplexity | null;
    const isPublic = searchParams.get("isPublic") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const whereClause: any = {
      AND: [
        {
          OR: [
            { userId: session.user.id },
            { isPublic: true }
          ]
        },
        { status: TemplateStatus.PUBLISHED }
      ]
    };

    if (templateType) whereClause.templateType = templateType;
    if (category) whereClause.category = category;
    if (complexity) whereClause.complexity = complexity;
    if (isPublic !== undefined) whereClause.isPublic = isPublic;
    if (isFeatured !== undefined) whereClause.isFeatured = isFeatured;
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } }
      ];
    }

    // Get templates with related data
    const templates = await prisma.workflowTemplate.findMany({
      where: whereClause,
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
        { rating: "desc" },
        { usageCount: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.workflowTemplate.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      data: templates,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + templates.length < totalCount
      }
    });

  } catch (error) {
    console.error("Error fetching workflow templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow templates" },
      { status: 500 }
    );
  }
}

// POST /api/workflows/templates - Create a new workflow template
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

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.templateType || !body.templateDefinition) {
      return NextResponse.json(
        { error: "Name, template type, and template definition are required" },
        { status: 400 }
      );
    }

    // Create workflow template
    const template = await prisma.workflowTemplate.create({
      data: {
        userId: session.user.id,
        workspaceId: user?.workspaceId,
        name: body.name,
        description: body.description,
        templateType: body.templateType,
        category: body.category || WorkflowCategory.GENERAL,
        version: body.version || "1.0.0",
        templateDefinition: body.templateDefinition,
        defaultConfiguration: body.defaultConfiguration,
        customizationOptions: body.customizationOptions,
        tags: body.tags || [],
        industry: body.industry,
        useCase: body.useCase,
        complexity: body.complexity || TemplateComplexity.MEDIUM,
        status: TemplateStatus.DRAFT,
        isPublic: body.isPublic || false,
        isFeatured: false,
        isVerified: false,
        instructions: body.instructions,
        documentation: body.documentation,
        examples: body.examples,
        prerequisites: body.prerequisites,
        requiredIntegrations: body.requiredIntegrations || [],
        optionalIntegrations: body.optionalIntegrations || [],
        minimumPermissions: body.minimumPermissions
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
      }
    });

    return NextResponse.json({
      success: true,
      data: template
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating workflow template:", error);
    return NextResponse.json(
      { error: "Failed to create workflow template" },
      { status: 500 }
    );
  }
} 