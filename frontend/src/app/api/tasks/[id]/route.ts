import { NextRequest, NextResponse } from "next/server";
import { 
  getTaskById, 
  updateTask, 
  deleteTask,
  startTask,
  pauseTask,
  completeTask
} from "@/app/actions/tasks";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const result = await getTaskById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Task not found" ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      task: result.task
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await updateTask({
      id,
      ...body
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      task: result.task,
      message: "Task updated successfully"
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const result = await deleteTask(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
} 