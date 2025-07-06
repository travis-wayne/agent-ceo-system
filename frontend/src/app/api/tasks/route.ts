import { NextRequest, NextResponse } from "next/server";
import { 
  createTask, 
  getTasksByWorkspace, 
  deleteTask,
  bulkDeleteTasks,
  getTaskStatistics
} from "@/app/actions/tasks";
import { TaskType, TaskPriority } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const filters: any = {};
    
    if (status) {
      filters.status = status.split(',');
    }
    if (type) {
      filters.type = type.split(',');
    }
    if (priority) {
      filters.priority = priority.split(',');
    }
    if (agentId) {
      filters.agentId = agentId;
    }
    if (limit) {
      filters.limit = parseInt(limit);
    }
    if (offset) {
      filters.offset = parseInt(offset);
    }

    const result = await getTasksByWorkspace(workspaceId, filters);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tasks: result.tasks,
      total: result.tasks?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
      title,
      description,
      type,
      priority,
      agentId,
      workspaceId,
      businessId,
      contactId,
      dueDate,
      estimatedDuration,
      businessImpact,
      complexity,
      category,
      budgetAllocated,
      stakeholders,
      deliverables,
      milestones,
      tags,
      input,
      context
    } = body;

    // Validate required fields
    if (!title || !description || !type || !agentId || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, type, agentId, workspaceId" },
        { status: 400 }
      );
    }

    // Validate task type
    if (!Object.values(TaskType).includes(type)) {
      return NextResponse.json(
        { error: `Invalid task type. Must be one of: ${Object.values(TaskType).join(", ")}` },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !Object.values(TaskPriority).includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${Object.values(TaskPriority).join(", ")}` },
        { status: 400 }
      );
    }

    const result = await createTask({
      title,
      description,
      type,
      priority: priority || 'medium',
      agentId,
      workspaceId,
      businessId,
      contactId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedDuration,
      businessImpact,
      complexity,
      category,
      budgetAllocated,
      stakeholders,
      deliverables,
      milestones,
      tags,
      input,
      context
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
      message: "Task created successfully"
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    const bulkIds = searchParams.get('bulkIds');

    if (bulkIds) {
      // Bulk delete
      const ids = bulkIds.split(',');
      const result = await bulkDeleteTasks(ids);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${ids.length} tasks`
      });
    } else if (taskId) {
      // Single delete
      const result = await deleteTask(taskId);
      
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
    } else {
      return NextResponse.json(
        { error: "Task ID or bulk IDs required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting task(s):", error);
    return NextResponse.json(
      { error: "Failed to delete task(s)" },
      { status: 500 }
    );
  }
} 