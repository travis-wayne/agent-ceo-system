import { NextRequest, NextResponse } from "next/server";
import { 
  getAgentById,
  updateAgent,
  deleteAgent,
  updateAgentStatus,
  getAgentCapabilities
} from "@/app/actions/tasks";
import { AgentStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    const result = await getAgentById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Agent not found' ? 404 : 500 }
      );
    }

    // Enhance with capabilities
    const capabilitiesResult = await getAgentCapabilities(result.agent.type);

    const enhancedAgent = {
      ...result.agent,
      capabilities: capabilitiesResult.capabilities || [],
      currentTasks: result.agent.tasks?.filter(task => 
        ['pending', 'queued', 'in_progress', 'paused'].includes(task.status)
      ).length || 0,
      totalTasks: result.agent._count?.tasks || 0,
      totalExecutions: result.agent._count?.executions || 0
    };

    return NextResponse.json({
      success: true,
      agent: enhancedAgent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      specialization,
      model,
      avatar,
      maxConcurrentTasks,
      status
    } = body;

    // Validate status if provided
    if (status && !Object.values(AgentStatus).includes(status)) {
      return NextResponse.json(
        { error: `Invalid agent status. Must be one of: ${Object.values(AgentStatus).join(", ")}` },
        { status: 400 }
      );
    }

    // Validate name if provided
    if (name && (name.length < 2 || name.length > 100)) {
      return NextResponse.json(
        { error: "Agent name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    // Validate maxConcurrentTasks if provided
    if (maxConcurrentTasks && (maxConcurrentTasks < 1 || maxConcurrentTasks > 20)) {
      return NextResponse.json(
        { error: "Max concurrent tasks must be between 1 and 20" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (model !== undefined) updateData.model = model;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (maxConcurrentTasks !== undefined) updateData.maxConcurrentTasks = maxConcurrentTasks;
    if (status !== undefined) updateData.status = status;

    const result = await updateAgent(id, updateData);

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
        capabilities: capabilitiesResult.capabilities || []
      },
      message: "Agent updated successfully"
    });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await deleteAgent(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
} 