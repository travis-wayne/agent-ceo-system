import { NextRequest, NextResponse } from "next/server";
import { AIAgentService } from "@/lib/services";
import { TaskType, TaskPriority, TaskStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const filters: any = {};
    
    if (status) {
      filters.status = status.split(',') as TaskStatus[];
    }
    if (type) {
      filters.type = type.split(',') as TaskType[];
    }
    if (agentId) {
      filters.agentId = agentId;
    }
    if (limit) {
      filters.limit = parseInt(limit);
    }

    const tasks = await AIAgentService.getTasksByWorkspace(workspaceId, filters);

    return NextResponse.json({
      tasks,
      total: tasks.length,
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
      input,
      context,
      scheduledFor,
      dueDate,
      estimatedDuration,
      agentId,
      workspaceId,
      businessId,
      contactId
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

    const task = await AIAgentService.createTask({
      title,
      description,
      type,
      priority: priority || TaskPriority.medium,
      input: input || {},
      context: context || {},
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedDuration,
      agentId,
      workspaceId,
      businessId,
      contactId
    });

    return NextResponse.json({
      success: true,
      task,
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