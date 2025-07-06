import { NextRequest, NextResponse } from "next/server";
import { 
  getAgentsByWorkspace,
  createAgent,
  getAgentCapabilities
} from "@/app/actions/tasks";
import { AgentType, AgentStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const includeMetrics = searchParams.get('includeMetrics') === 'true';
    const status = searchParams.get('status') as AgentStatus;
    const type = searchParams.get('type') as AgentType;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const result = await getAgentsByWorkspace(workspaceId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    let agents = result.agents || [];

    // Apply filters
    if (status) {
      agents = agents.filter(agent => agent.status === status);
    }
    if (type) {
      agents = agents.filter(agent => agent.type === type);
    }

    // Enhance with capabilities
    const enhancedAgents = await Promise.all(
      agents.map(async (agent) => {
        const capabilitiesResult = await getAgentCapabilities(agent.type);
        return {
          ...agent,
          capabilities: capabilitiesResult.capabilities || [],
          currentTasks: agent.tasks?.length || 0,
          totalTasks: agent._count?.tasks || 0,
          totalExecutions: agent._count?.executions || 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      agents: enhancedAgents,
      total: enhancedAgents.length,
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
      specialization,
      model,
      avatar,
      maxConcurrentTasks,
      workspaceId
    } = body;

    // Validate required fields
    if (!name || !type || !specialization || !model || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, specialization, model, workspaceId" },
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

    // Validate name uniqueness (basic check)
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Agent name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    const result = await createAgent({
      name,
      type,
      specialization,
      model,
      avatar,
      maxConcurrentTasks: maxConcurrentTasks || 3,
      workspaceId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Enhance with capabilities
    const capabilitiesResult = await getAgentCapabilities(result.agent.type);

    return NextResponse.json({
      success: true,
      agent: {
        ...result.agent,
        capabilities: capabilitiesResult.capabilities || [],
        currentTasks: 0,
        totalTasks: 0,
        totalExecutions: 0
      },
      message: "Agent created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
} 