import { prisma } from "@/lib/db";
import { Agent, AgentTask, TaskExecution, AgentType, AgentStatus, TaskStatus, TaskType, TaskPriority } from "@prisma/client";

export interface CreateAgentData {
  name: string;
  type: AgentType;
  description?: string;
  capabilities: string[];
  configuration?: Record<string, any>;
  aiModel?: string;
  apiEndpoint?: string;
  apiKey?: string;
  maxConcurrentTasks?: number;
  workspaceId: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  type: TaskType;
  priority?: TaskPriority;
  input?: Record<string, any>;
  context?: Record<string, any>;
  scheduledFor?: Date;
  dueDate?: Date;
  estimatedDuration?: number;
  agentId: string;
  workspaceId: string;
  businessId?: string;
  contactId?: string;
}

export interface TaskExecutionResult {
  success: boolean;
  output?: Record<string, any>;
  error?: string;
  duration: number;
  tokensUsed?: number;
  cost?: number;
  apiCalls?: number;
}

export class AIAgentService {
  // =============================================
  // AGENT MANAGEMENT
  // =============================================

  static async createAgent(data: CreateAgentData): Promise<Agent> {
    try {
      const agent = await prisma.agent.create({
        data: {
          name: data.name,
          type: data.type,
          description: data.description,
          capabilities: data.capabilities,
          configuration: data.configuration || {},
          aiModel: data.aiModel,
          apiEndpoint: data.apiEndpoint,
          apiKey: data.apiKey, // Should be encrypted in production
          maxConcurrentTasks: data.maxConcurrentTasks || 3,
          workspaceId: data.workspaceId,
          status: AgentStatus.idle,
        },
      });

      console.log(`Agent created: ${agent.name} (${agent.id})`);
      return agent;
    } catch (error) {
      console.error("Error creating agent:", error);
      throw new Error("Failed to create agent");
    }
  }

  static async getAgentsByWorkspace(workspaceId: string): Promise<Agent[]> {
    return prisma.agent.findMany({
      where: { workspaceId },
      include: {
        tasks: {
          where: {
            status: {
              in: [TaskStatus.pending, TaskStatus.in_progress, TaskStatus.queued]
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            tasks: true,
            executions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateAgentStatus(agentId: string, status: AgentStatus): Promise<Agent> {
    return prisma.agent.update({
      where: { id: agentId },
      data: { 
        status,
        lastActive: new Date()
      }
    });
  }

  static async updateAgentMetrics(agentId: string, metrics: {
    tasksCompleted?: number;
    successRate?: number;
    avgResponseTime?: number;
  }): Promise<Agent> {
    const updateData: any = {
      lastActive: new Date()
    };

    if (metrics.tasksCompleted !== undefined) {
      updateData.tasksCompleted = metrics.tasksCompleted;
    }
    if (metrics.successRate !== undefined) {
      updateData.successRate = metrics.successRate;
    }
    if (metrics.avgResponseTime !== undefined) {
      updateData.avgResponseTime = metrics.avgResponseTime;
    }

    return prisma.agent.update({
      where: { id: agentId },
      data: updateData
    });
  }

  // =============================================
  // TASK MANAGEMENT
  // =============================================

  static async createTask(data: CreateTaskData): Promise<AgentTask> {
    try {
      // Verify agent exists and is available
      const agent = await prisma.agent.findUnique({
        where: { id: data.agentId },
        include: {
          tasks: {
            where: {
              status: {
                in: [TaskStatus.pending, TaskStatus.in_progress, TaskStatus.queued]
              }
            }
          }
        }
      });

      if (!agent) {
        throw new Error("Agent not found");
      }

      // Check if agent has capacity
      const activeTasks = agent.tasks.length;
      if (activeTasks >= agent.maxConcurrentTasks) {
        console.log(`Agent ${agent.name} at capacity, queueing task`);
      }

      const task = await prisma.agentTask.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority || TaskPriority.medium,
          input: data.input || {},
          context: data.context || {},
          scheduledFor: data.scheduledFor,
          dueDate: data.dueDate,
          estimatedDuration: data.estimatedDuration,
          agentId: data.agentId,
          workspaceId: data.workspaceId,
          businessId: data.businessId,
          contactId: data.contactId,
          status: activeTasks >= agent.maxConcurrentTasks ? TaskStatus.queued : TaskStatus.pending
        },
        include: {
          agent: true,
          business: true,
          contact: true
        }
      });

      console.log(`Task created: ${task.title} for agent ${agent.name}`);
      
      // If agent has capacity, try to start the task
      if (activeTasks < agent.maxConcurrentTasks) {
        await this.processNextTask(data.agentId);
      }

      return task;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  }

  static async getTasksByWorkspace(workspaceId: string, filters?: {
    status?: TaskStatus[];
    type?: TaskType[];
    agentId?: string;
    limit?: number;
  }): Promise<AgentTask[]> {
    const whereClause: any = { workspaceId };

    if (filters?.status) {
      whereClause.status = { in: filters.status };
    }
    if (filters?.type) {
      whereClause.type = { in: filters.type };
    }
    if (filters?.agentId) {
      whereClause.agentId = filters.agentId;
    }

    return prisma.agentTask.findMany({
      where: whereClause,
      include: {
        agent: true,
        business: true,
        contact: true,
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 1
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      take: filters?.limit || 50
    });
  }

  static async updateTaskStatus(taskId: string, status: TaskStatus, data?: {
    progress?: number;
    output?: Record<string, any>;
    error?: string;
  }): Promise<AgentTask> {
    const updateData: any = { status };

    if (data?.progress !== undefined) {
      updateData.progress = data.progress;
    }
    if (data?.output) {
      updateData.output = data.output;
    }
    if (data?.error) {
      updateData.lastError = data.error;
    }

    if (status === TaskStatus.in_progress && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    if (status === TaskStatus.completed || status === TaskStatus.failed) {
      updateData.completedAt = new Date();
      
      // Calculate actual duration
      const task = await prisma.agentTask.findUnique({
        where: { id: taskId }
      });
      
      if (task?.startedAt) {
        const duration = Math.round((new Date().getTime() - task.startedAt.getTime()) / 60000); // minutes
        updateData.actualDuration = duration;
      }
    }

    const updatedTask = await prisma.agentTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        agent: true
      }
    });

    // If task completed, process next queued task for this agent
    if (status === TaskStatus.completed || status === TaskStatus.failed || status === TaskStatus.cancelled) {
      await this.processNextTask(updatedTask.agentId);
    }

    return updatedTask;
  }

  // =============================================
  // TASK EXECUTION
  // =============================================

  static async startTaskExecution(taskId: string): Promise<TaskExecution> {
    const task = await prisma.agentTask.findUnique({
      where: { id: taskId },
      include: { agent: true }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Update task status to in_progress
    await this.updateTaskStatus(taskId, TaskStatus.in_progress);

    // Create execution record
    const execution = await prisma.taskExecution.create({
      data: {
        taskId,
        agentId: task.agentId,
        status: "running",
        inputData: task.input || {}
      }
    });

    // Update agent status
    await this.updateAgentStatus(task.agentId, AgentStatus.busy);

    console.log(`Started execution for task: ${task.title}`);
    return execution;
  }

  static async completeTaskExecution(
    executionId: string, 
    result: TaskExecutionResult
  ): Promise<TaskExecution> {
    const execution = await prisma.taskExecution.findUnique({
      where: { id: executionId },
      include: { task: true, agent: true }
    });

    if (!execution) {
      throw new Error("Execution not found");
    }

    // Update execution record
    const updatedExecution = await prisma.taskExecution.update({
      where: { id: executionId },
      data: {
        status: result.success ? "completed" : "failed",
        completedAt: new Date(),
        duration: result.duration,
        outputData: result.output || {},
        errorMessage: result.error,
        tokensUsed: result.tokensUsed,
        cost: result.cost,
        apiCalls: result.apiCalls
      }
    });

    // Update task status
    await this.updateTaskStatus(
      execution.taskId,
      result.success ? TaskStatus.completed : TaskStatus.failed,
      {
        output: result.output,
        error: result.error,
        progress: result.success ? 100 : execution.task.progress
      }
    );

    // Update agent metrics
    await this.updateAgentPerformanceMetrics(execution.agentId);

    console.log(`Completed execution for task: ${execution.task.title}`);
    return updatedExecution;
  }

  // =============================================
  // AGENT INTELLIGENCE
  // =============================================

  static async processNextTask(agentId: string): Promise<void> {
    try {
      // Get next queued task for this agent
      const nextTask = await prisma.agentTask.findFirst({
        where: {
          agentId,
          status: TaskStatus.queued
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ]
      });

      if (nextTask) {
        await this.updateTaskStatus(nextTask.id, TaskStatus.pending);
        console.log(`Promoted queued task to pending: ${nextTask.title}`);
      } else {
        // No queued tasks, set agent to idle
        await this.updateAgentStatus(agentId, AgentStatus.idle);
      }
    } catch (error) {
      console.error("Error processing next task:", error);
    }
  }

  static async updateAgentPerformanceMetrics(agentId: string): Promise<void> {
    try {
      // Calculate performance metrics based on recent executions
      const executions = await prisma.taskExecution.findMany({
        where: { agentId },
        orderBy: { startedAt: 'desc' },
        take: 100 // Last 100 executions
      });

      if (executions.length === 0) return;

      const completedExecutions = executions.filter(e => e.status === 'completed');
      const successRate = (completedExecutions.length / executions.length) * 100;
      
      const avgResponseTime = executions
        .filter(e => e.duration)
        .reduce((sum, e) => sum + (e.duration || 0), 0) / executions.length;

      await this.updateAgentMetrics(agentId, {
        tasksCompleted: completedExecutions.length,
        successRate: Number(successRate.toFixed(1)),
        avgResponseTime: Number(avgResponseTime.toFixed(2))
      });
    } catch (error) {
      console.error("Error updating agent performance metrics:", error);
    }
  }

  // =============================================
  // UTILITIES
  // =============================================

  static async getAgentWorkload(agentId: string): Promise<{
    activeTasks: number;
    queuedTasks: number;
    capacity: number;
    utilizationRate: number;
  }> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        tasks: {
          where: {
            status: {
              in: [TaskStatus.pending, TaskStatus.in_progress, TaskStatus.queued]
            }
          }
        }
      }
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    const activeTasks = agent.tasks.filter(t => 
      t.status === TaskStatus.pending || t.status === TaskStatus.in_progress
    ).length;
    
    const queuedTasks = agent.tasks.filter(t => 
      t.status === TaskStatus.queued
    ).length;

    const utilizationRate = (activeTasks / agent.maxConcurrentTasks) * 100;

    return {
      activeTasks,
      queuedTasks,
      capacity: agent.maxConcurrentTasks,
      utilizationRate: Number(utilizationRate.toFixed(1))
    };
  }

  static async getWorkspaceAgentStats(workspaceId: string): Promise<{
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgSuccessRate: number;
  }> {
    const agents = await prisma.agent.findMany({
      where: { workspaceId },
      include: {
        tasks: true
      }
    });

    const activeAgents = agents.filter(a => a.status === AgentStatus.active || a.status === AgentStatus.busy).length;
    
    const allTasks = agents.flatMap(a => a.tasks);
    const completedTasks = allTasks.filter(t => t.status === TaskStatus.completed).length;
    const failedTasks = allTasks.filter(t => t.status === TaskStatus.failed).length;
    
    const avgSuccessRate = agents.length > 0 
      ? agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length 
      : 0;

    return {
      totalAgents: agents.length,
      activeAgents,
      totalTasks: allTasks.length,
      completedTasks,
      failedTasks,
      avgSuccessRate: Number(avgSuccessRate.toFixed(1))
    };
  }
} 