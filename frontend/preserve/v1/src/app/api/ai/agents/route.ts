import { NextRequest, NextResponse } from "next/server";
import { AIAgentService } from "@/lib/services";
import { AgentType, AgentStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const agents = await AIAgentService.getAgentsByWorkspace(workspaceId);
    const stats = await AIAgentService.getWorkspaceAgentStats(workspaceId);

    return NextResponse.json({
      agents,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      description,
      capabilities,
      configuration,
      aiModel,
      apiEndpoint,
      apiKey,
      maxConcurrentTasks,
      workspaceId
    } = body;

    // Validate required fields
    if (!name || !type || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, workspaceId" },
        { status: 400 }
      );
    }

    // Validate agent type
    if (!Object.values(AgentType).includes(type)) {
      return NextResponse.json(
        { error: `Invalid agent type. Must be one of: ${Object.values(AgentType).join(", ")}` },
        { status: 400 }
      );
    }

    const agent = await AIAgentService.createAgent({
      name,
      type,
      description,
      capabilities: capabilities || [],
      configuration: configuration || {},
      aiModel,
      apiEndpoint,
      apiKey,
      maxConcurrentTasks: maxConcurrentTasks || 3,
      workspaceId
    });

    return NextResponse.json({
      success: true,
      agent,
      message: "Agent created successfully"
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
} 