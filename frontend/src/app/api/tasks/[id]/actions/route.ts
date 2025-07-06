import { NextRequest, NextResponse } from "next/server";
import { 
  startTask,
  pauseTask,
  completeTask
} from "@/app/actions/tasks";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const { action, output } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'start':
        result = await startTask(id);
        break;
      case 'pause':
        result = await pauseTask(id);
        break;
      case 'complete':
        result = await completeTask(id, output);
        break;
      default:
        return NextResponse.json(
          { error: `Invalid action: ${action}. Valid actions are: start, pause, complete` },
          { status: 400 }
        );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      task: result.task,
      message: `Task ${action} successfully`
    });
  } catch (error) {
    console.error("Error performing task action:", error);
    return NextResponse.json(
      { error: "Failed to perform task action" },
      { status: 500 }
    );
  }
} 