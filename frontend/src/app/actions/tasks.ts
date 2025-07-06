"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { 
  AgentTask, 
  Agent, 
  TaskType, 
  TaskPriority, 
  TaskStatus, 
  AgentType,
  AgentStatus
} from "@prisma/client";

export interface CreateTaskInput {
  title: string;
  description: string;
  type: TaskType;
  priority?: TaskPriority;
  agentId: string;
  workspaceId: string;
  businessId?: string;
  contactId?: string;
  dueDate?: Date;
  estimatedDuration?: number;
  businessImpact?: number;
  complexity?: string;
  category?: string;
  budgetAllocated?: number;
  stakeholders?: any[];
  deliverables?: any[];
  milestones?: any[];
  tags?: string[];
  input?: any;
  context?: any;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  status?: TaskStatus;
  progress?: number;
  startedAt?: Date;
  completedAt?: Date;
  actualDuration?: number;
  budgetSpent?: number;
  resourcesUsed?: any;
  output?: any;
}

// Task CRUD Operations

export async function createTask(data: CreateTaskInput) {
  try {
    const task = await prisma.agentTask.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority || 'medium',
        agentId: data.agentId,
        workspaceId: data.workspaceId,
        businessId: data.businessId,
        contactId: data.contactId,
        dueDate: data.dueDate,
        estimatedDuration: data.estimatedDuration,
        businessImpact: data.businessImpact,
        complexity: data.complexity,
        category: data.category,
        budgetAllocated: data.budgetAllocated,
        stakeholders: data.stakeholders,
        deliverables: data.deliverables,
        milestones: data.milestones,
        tags: data.tags || [],
        input: data.input,
        context: data.context,
      },
      include: {
        agent: true,
        business: true,
        contact: true,
        workspace: true,
      }
    });

    revalidatePath('/dashboard/ceo/tasks');
    return { success: true, task };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

export async function getTasksByWorkspace(
  workspaceId: string,
  filters?: {
    status?: TaskStatus[];
    type?: TaskType[];
    priority?: TaskPriority[];
    agentId?: string;
    limit?: number;
    offset?: number;
  }
) {
  try {
    const where: any = { workspaceId };

    if (filters?.status) {
      where.status = { in: filters.status };
    }
    if (filters?.type) {
      where.type = { in: filters.type };
    }
    if (filters?.priority) {
      where.priority = { in: filters.priority };
    }
    if (filters?.agentId) {
      where.agentId = filters.agentId;
    }

    const tasks = await prisma.agentTask.findMany({
      where,
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
        { createdAt: 'desc' }
      ],
      take: filters?.limit,
      skip: filters?.offset,
    });

    return { success: true, tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}

export async function getTaskById(id: string) {
  try {
    const task = await prisma.agentTask.findUnique({
      where: { id },
      include: {
        agent: true,
        business: true,
        contact: true,
        workspace: true,
        executions: {
          orderBy: { startedAt: 'desc' }
        }
      }
    });

    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    return { success: true, task };
  } catch (error) {
    console.error('Error fetching task:', error);
    return { success: false, error: 'Failed to fetch task' };
  }
}

export async function updateTask(data: UpdateTaskInput) {
  try {
    const { id, ...updateData } = data;
    
    const task = await prisma.agentTask.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        agent: true,
        business: true,
        contact: true,
        workspace: true,
      }
    });

    revalidatePath('/dashboard/ceo/tasks');
    revalidatePath(`/dashboard/ceo/tasks/edit/${id}`);
    return { success: true, task };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.agentTask.delete({
      where: { id }
    });

    revalidatePath('/dashboard/ceo/tasks');
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

export async function bulkDeleteTasks(ids: string[]) {
  try {
    await prisma.agentTask.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    revalidatePath('/dashboard/ceo/tasks');
    return { success: true };
  } catch (error) {
    console.error('Error bulk deleting tasks:', error);
    return { success: false, error: 'Failed to delete tasks' };
  }
}

// Task Control Operations

export async function startTask(id: string) {
  try {
    const task = await prisma.agentTask.update({
      where: { id },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      }
    });

    revalidatePath('/dashboard/ceo/tasks');
    return { success: true, task };
  } catch (error) {
    console.error('Error starting task:', error);
    return { success: false, error: 'Failed to start task' };
  }
}

export async function pauseTask(id: string) {
  try {
    const task = await prisma.agentTask.update({
      where: { id },
      data: {
        status: 'paused',
      }
    });

    revalidatePath('/dashboard/ceo/tasks');
    return { success: true, task };
  } catch (error) {
    console.error('Error pausing task:', error);
    return { success: false, error: 'Failed to pause task' };
  }
}

export async function completeTask(id: string, output?: any) {
  try {
    const task = await prisma.agentTask.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
        output,
      }
    });

    // Update agent's task completion count
    await prisma.agent.update({
      where: { id: task.agentId },
      data: {
        tasksCompleted: { increment: 1 }
      }
    });

    revalidatePath('/dashboard/ceo/tasks');
    return { success: true, task };
  } catch (error) {
    console.error('Error completing task:', error);
    return { success: false, error: 'Failed to complete task' };
  }
}

// Agent Operations

export async function getAgentsByWorkspace(workspaceId: string) {
  try {
    const agents = await prisma.agent.findMany({
      where: { workspaceId },
      include: {
        tasks: {
          where: {
            status: { in: ['pending', 'queued', 'in_progress', 'paused'] }
          }
        },
        _count: {
          select: {
            tasks: true,
            executions: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return { success: true, agents };
  } catch (error) {
    console.error('Error fetching agents:', error);
    return { success: false, error: 'Failed to fetch agents' };
  }
}

export async function getAgentById(id: string) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            business: { select: { name: true } },
            contact: { select: { name: true } }
          }
        },
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            tasks: true,
            executions: true
          }
        }
      }
    });

    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    return { success: true, agent };
  } catch (error) {
    console.error('Error fetching agent:', error);
    return { success: false, error: 'Failed to fetch agent' };
  }
}

export async function createAgent(data: {
  name: string;
  type: AgentType;
  specialization: string;
  model: string;
  avatar?: string;
  maxConcurrentTasks?: number;
  workspaceId: string;
}) {
  try {
    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        type: data.type,
        specialization: data.specialization,
        model: data.model,
        avatar: data.avatar,
        maxConcurrentTasks: data.maxConcurrentTasks || 3,
        workspaceId: data.workspaceId,
      }
    });

    revalidatePath('/dashboard/ceo/agents');
    return { success: true, agent };
  } catch (error) {
    console.error('Error creating agent:', error);
    return { success: false, error: 'Failed to create agent' };
  }
}

export async function updateAgent(id: string, data: {
  name?: string;
  specialization?: string;
  model?: string;
  avatar?: string;
  maxConcurrentTasks?: number;
  status?: AgentStatus;
}) {
  try {
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    revalidatePath('/dashboard/ceo/agents');
    return { success: true, agent };
  } catch (error) {
    console.error('Error updating agent:', error);
    return { success: false, error: 'Failed to update agent' };
  }
}

export async function deleteAgent(id: string) {
  try {
    // First, cancel or complete any active tasks
    await prisma.agentTask.updateMany({
      where: { 
        agentId: id,
        status: { in: ['pending', 'queued', 'in_progress', 'paused'] }
      },
      data: { status: 'cancelled' }
    });

    // Delete the agent
    await prisma.agent.delete({
      where: { id }
    });

    revalidatePath('/dashboard/ceo/agents');
    return { success: true };
  } catch (error) {
    console.error('Error deleting agent:', error);
    return { success: false, error: 'Failed to delete agent' };
  }
}

export async function updateAgentStatus(id: string, status: AgentStatus) {
  try {
    const agent = await prisma.agent.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    revalidatePath('/dashboard/ceo/agents');
    return { success: true, agent };
  } catch (error) {
    console.error('Error updating agent status:', error);
    return { success: false, error: 'Failed to update agent status' };
  }
}

// Agent Performance Monitoring

export async function getAgentPerformanceMetrics(agentId: string, timeframe: 'day' | 'week' | 'month' = 'week') {
  try {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const [
      agent,
      totalTasks,
      completedTasks,
      failedTasks,
      avgDuration,
      avgQualityScore,
      recentExecutions
    ] = await Promise.all([
      prisma.agent.findUnique({
        where: { id: agentId },
        select: { 
          id: true, 
          name: true, 
          type: true, 
          tasksCompleted: true,
          successRate: true,
          efficiency: true
        }
      }),
      prisma.agentTask.count({
        where: { 
          agentId,
          createdAt: { gte: startDate }
        }
      }),
      prisma.agentTask.count({
        where: { 
          agentId,
          status: 'completed',
          createdAt: { gte: startDate }
        }
      }),
      prisma.agentTask.count({
        where: { 
          agentId,
          status: 'failed',
          createdAt: { gte: startDate }
        }
      }),
      prisma.agentTask.aggregate({
        where: { 
          agentId,
          status: 'completed',
          actualDuration: { not: null },
          createdAt: { gte: startDate }
        },
        _avg: { actualDuration: true }
      }),
      prisma.taskExecution.aggregate({
        where: { 
          agentId,
          qualityScore: { not: null },
          startedAt: { gte: startDate }
        },
        _avg: { qualityScore: true }
      }),
      prisma.taskExecution.findMany({
        where: { 
          agentId,
          startedAt: { gte: startDate }
        },
        orderBy: { startedAt: 'desc' },
        take: 10,
        include: {
          task: {
            select: { title: true, type: true }
          }
        }
      })
    ]);

    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    const successRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const failureRate = totalTasks > 0 ? (failedTasks / totalTasks) * 100 : 0;

    return {
      success: true,
      metrics: {
        agent,
        timeframe,
        totalTasks,
        completedTasks,
        failedTasks,
        successRate: Math.round(successRate * 100) / 100,
        failureRate: Math.round(failureRate * 100) / 100,
        avgDuration: Math.round((avgDuration._avg.actualDuration || 0) / 60), // Convert to minutes
        avgQualityScore: Math.round((avgQualityScore._avg.qualityScore || 0) * 100) / 100,
        recentExecutions
      }
    };
  } catch (error) {
    console.error('Error fetching agent performance metrics:', error);
    return { success: false, error: 'Failed to fetch performance metrics' };
  }
}

export async function getAgentBusinessImpact(agentId: string, timeframe: 'week' | 'month' | 'quarter' = 'month') {
  try {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    const [
      businessImpactTasks,
      totalBudgetAllocated,
      totalBudgetSpent,
      avgBusinessImpact,
      highImpactTasks
    ] = await Promise.all([
      prisma.agentTask.findMany({
        where: { 
          agentId,
          businessImpact: { not: null },
          createdAt: { gte: startDate }
        },
        select: {
          businessImpact: true,
          budgetAllocated: true,
          budgetSpent: true,
          status: true
        }
      }),
      prisma.agentTask.aggregate({
        where: { 
          agentId,
          budgetAllocated: { not: null },
          createdAt: { gte: startDate }
        },
        _sum: { budgetAllocated: true }
      }),
      prisma.agentTask.aggregate({
        where: { 
          agentId,
          budgetSpent: { not: null },
          createdAt: { gte: startDate }
        },
        _sum: { budgetSpent: true }
      }),
      prisma.agentTask.aggregate({
        where: { 
          agentId,
          businessImpact: { not: null },
          createdAt: { gte: startDate }
        },
        _avg: { businessImpact: true }
      }),
      prisma.agentTask.count({
        where: { 
          agentId,
          businessImpact: { gte: 8.0 },
          createdAt: { gte: startDate }
        }
      })
    ]);

    const budgetEfficiency = totalBudgetAllocated._sum.budgetAllocated 
      ? ((totalBudgetAllocated._sum.budgetAllocated - (totalBudgetSpent._sum.budgetSpent || 0)) / totalBudgetAllocated._sum.budgetAllocated) * 100
      : 0;

    return {
      success: true,
      impact: {
        timeframe,
        totalTasks: businessImpactTasks.length,
        avgBusinessImpact: Math.round((avgBusinessImpact._avg.businessImpact || 0) * 100) / 100,
        highImpactTasks,
        totalBudgetAllocated: totalBudgetAllocated._sum.budgetAllocated || 0,
        totalBudgetSpent: totalBudgetSpent._sum.budgetSpent || 0,
        budgetEfficiency: Math.round(budgetEfficiency * 100) / 100,
        estimatedROI: businessImpactTasks.reduce((acc, task) => acc + (task.businessImpact || 0), 0)
      }
    };
  } catch (error) {
    console.error('Error fetching agent business impact:', error);
    return { success: false, error: 'Failed to fetch business impact' };
  }
}

export async function getAgentCapabilities(agentType: AgentType) {
  // Return capabilities based on agent type following the workflow guide
  const capabilitiesMap = {
    ceo: [
      "Strategic Planning & Roadmapping",
      "Market Analysis & Competitive Intelligence", 
      "Business Model Innovation",
      "Investment & Growth Strategy",
      "Board & Stakeholder Communications",
      "Risk Assessment & Management",
      "Performance Analytics & KPIs",
      "Executive Decision Support"
    ],
    sales: [
      "Lead Generation & Qualification",
      "Sales Process Optimization",
      "Customer Acquisition Strategy",
      "Revenue Forecasting & Analytics",
      "CRM Management & Automation",
      "Pipeline Management",
      "Conversion Optimization",
      "Customer Relationship Building"
    ],
    marketing: [
      "Content Strategy & Creation",
      "Brand Positioning & Messaging",
      "Digital Marketing Campaigns",
      "Social Media Management",
      "Marketing Analytics & ROI",
      "Customer Segmentation",
      "Campaign Optimization",
      "Brand Consistency"
    ],
    operations: [
      "Process Automation & Optimization",
      "Quality Management Systems",
      "Resource Allocation & Planning",
      "Cost Reduction Strategies",
      "Operational Risk Management",
      "Workflow Optimization",
      "Efficiency Monitoring",
      "System Integration"
    ],
    analytics: [
      "Data Processing & Analysis",
      "Business Intelligence Reporting",
      "Predictive Analytics",
      "Performance Metrics Tracking",
      "Trend Analysis & Forecasting",
      "Data Visualization",
      "Statistical Modeling",
      "Insight Generation"
    ]
  };

  return { success: true, capabilities: capabilitiesMap[agentType] || [] };
}

// Dashboard Statistics

export async function getTaskStatistics(workspaceId: string) {
  try {
    const [
      totalTasks,
      activeTasks,
      completedTasks,
      failedTasks,
      avgCompletionTime,
      topPerformingAgent
    ] = await Promise.all([
      prisma.agentTask.count({ where: { workspaceId } }),
      prisma.agentTask.count({
        where: { 
          workspaceId,
          status: { in: ['pending', 'queued', 'in_progress'] }
        }
      }),
      prisma.agentTask.count({
        where: { workspaceId, status: 'completed' }
      }),
      prisma.agentTask.count({
        where: { workspaceId, status: 'failed' }
      }),
      prisma.agentTask.aggregate({
        where: { 
          workspaceId,
          status: 'completed',
          actualDuration: { not: null }
        },
        _avg: { actualDuration: true }
      }),
      prisma.agent.findFirst({
        where: { workspaceId },
        orderBy: { tasksCompleted: 'desc' },
        include: { _count: { select: { tasks: true } } }
      })
    ]);

    const successRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      success: true,
      statistics: {
        totalTasks,
        activeTasks,
        completedTasks,
        failedTasks,
        successRate: Math.round(successRate * 100) / 100,
        avgCompletionTime: Math.round((avgCompletionTime._avg.actualDuration || 0) / 60), // Convert to hours
        topPerformingAgent,
      }
    };
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    return { success: false, error: 'Failed to fetch statistics' };
  }
} 