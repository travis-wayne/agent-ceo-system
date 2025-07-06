import { NextRequest, NextResponse } from "next/server";
import { 
  updateAgentStatus
} from "@/app/actions/tasks";
import { AgentStatus } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(AgentStatus).includes(status)) {
      return NextResponse.json(
        { error: `Invalid agent status. Must be one of: ${Object.values(AgentStatus).join(", ")}` },
        { status: 400 }
      );
    }

    const result = await updateAgentStatus(id, status);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: result.agent,
      message: `Agent status updated to ${status}`
    });
  } catch (error) {
    console.error("Error updating agent status:", error);
    return NextResponse.json(
      { error: "Failed to update agent status" },
      { status: 500 }
    );
  }
} 