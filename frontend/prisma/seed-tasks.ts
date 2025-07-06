import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTaskManagement() {
  console.log('🌱 Seeding task management system...');

  // Create a default workspace if it doesn't exist
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Agent CEO Workspace',
        email: 'admin@agentceo.com',
        plan: 'enterprise',
        maxUsers: 50,
      }
    });
    console.log('✅ Created default workspace');
  }

  // Create AI Agents
  const agents = [
    {
      name: 'CEO Agent',
      type: 'ceo' as const,
      specialization: 'Strategic Leadership & Decision Making',
      model: 'GPT-4.5 Turbo',
      avatar: '🧠',
      maxConcurrentTasks: 8,
      tasksCompleted: 156,
      successRate: 99.1,
      efficiency: 98.2,
    },
    {
      name: 'Sales Agent',
      type: 'sales' as const,
      specialization: 'Revenue Generation & Lead Conversion',
      model: 'Claude 3 Opus',
      avatar: '💼',
      maxConcurrentTasks: 8,
      tasksCompleted: 243,
      successRate: 93.4,
      efficiency: 91.7,
    },
    {
      name: 'Marketing Agent',
      type: 'marketing' as const,
      specialization: 'Brand Building & Customer Engagement',
      model: 'GPT-4 Turbo',
      avatar: '🎨',
      maxConcurrentTasks: 7,
      tasksCompleted: 198,
      successRate: 94.8,
      efficiency: 95.3,
    },
    {
      name: 'Operations Agent',
      type: 'operations' as const,
      specialization: 'Process Excellence & Automation',
      model: 'Claude 3 Sonnet',
      avatar: '⚙️',
      maxConcurrentTasks: 8,
      tasksCompleted: 167,
      successRate: 91.7,
      efficiency: 89.4,
    },
    {
      name: 'Analytics Agent',
      type: 'analytics' as const,
      specialization: 'Data Intelligence & Business Insights',
      model: 'GPT-4 + Code Interpreter',
      avatar: '📊',
      maxConcurrentTasks: 6,
      tasksCompleted: 134,
      successRate: 97.3,
      efficiency: 96.1,
    },
  ];

  const createdAgents = [];
  for (const agentData of agents) {
    const existingAgent = await prisma.agent.findFirst({
      where: { 
        name: agentData.name,
        workspaceId: workspace.id 
      }
    });

    if (!existingAgent) {
      const agent = await prisma.agent.create({
        data: {
          ...agentData,
          workspaceId: workspace.id,
        }
      });
      createdAgents.push(agent);
      console.log(`✅ Created agent: ${agent.name}`);
    } else {
      createdAgents.push(existingAgent);
      console.log(`ℹ️  Agent already exists: ${existingAgent.name}`);
    }
  }

  // Create sample tasks
  const sampleTasks = [
    {
      title: 'Q4 2024 Strategic Market Analysis - Enterprise Software',
      description: 'Comprehensive competitive analysis of enterprise software market with strategic recommendations and growth opportunities identification',
      type: 'strategic_analysis' as const,
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      progress: 78,
      businessImpact: 9.5,
      complexity: 'very_high',
      category: 'Strategic Analysis',
      budgetAllocated: 15000,
      budgetSpent: 8500,
      estimatedDuration: 480, // 8 hours in minutes
      actualDuration: 350,
      agentType: 'ceo',
      stakeholders: [
        { name: 'CEO', role: 'Sponsor', involvement: 'high' },
        { name: 'Board of Directors', role: 'Reviewer', involvement: 'high' },
        { name: 'Strategy Team', role: 'Contributor', involvement: 'high' }
      ],
      deliverables: [
        { name: 'Market Research', completed: true, dueDate: new Date('2024-12-15T12:00:00Z') },
        { name: 'Competitive Analysis', completed: true, dueDate: new Date('2024-12-15T14:00:00Z') },
        { name: 'Strategic Recommendations', completed: false, dueDate: new Date('2024-12-15T16:00:00Z') },
        { name: 'Executive Summary', completed: false, dueDate: new Date('2024-12-15T17:00:00Z') }
      ],
      tags: ['Market Research', 'Enterprise Software', 'Strategic Planning', 'Competitive Analysis'],
      dueDate: new Date('2024-12-31T23:59:59Z'),
    },
    {
      title: 'Healthcare Industry Revenue Optimization Strategy',
      description: 'Develop comprehensive revenue optimization strategy for healthcare vertical with lead generation and conversion optimization',
      type: 'revenue_generation' as const,
      priority: 'high' as const,
      status: 'in_progress' as const,
      progress: 45,
      businessImpact: 8.2,
      complexity: 'high',
      category: 'Revenue Generation',
      budgetAllocated: 12000,
      budgetSpent: 4200,
      estimatedDuration: 360, // 6 hours in minutes
      actualDuration: 180,
      agentType: 'sales',
      stakeholders: [
        { name: 'Sales Director', role: 'Sponsor', involvement: 'high' },
        { name: 'Marketing Team', role: 'Contributor', involvement: 'medium' },
        { name: 'Healthcare Vertical Lead', role: 'Contributor', involvement: 'high' }
      ],
      deliverables: [
        { name: 'Market Segmentation', completed: true, dueDate: new Date('2024-12-20T12:00:00Z') },
        { name: 'Lead Scoring Model', completed: false, dueDate: new Date('2024-12-22T16:00:00Z') },
        { name: 'Campaign Strategy', completed: false, dueDate: new Date('2024-12-24T14:00:00Z') },
        { name: 'ROI Projections', completed: false, dueDate: new Date('2024-12-26T12:00:00Z') }
      ],
      tags: ['Healthcare', 'Revenue Optimization', 'Lead Generation', 'Sales Strategy'],
      dueDate: new Date('2024-12-30T23:59:59Z'),
    },
    {
      title: 'AI-Powered Brand Positioning Campaign - Q1 2025',
      description: 'Strategic brand positioning campaign leveraging AI insights for maximum market impact and customer engagement',
      type: 'marketing_initiatives' as const,
      priority: 'high' as const,
      status: 'completed' as const,
      progress: 100,
      businessImpact: 9.1,
      complexity: 'high',
      category: 'Marketing Initiatives',
      budgetAllocated: 25000,
      budgetSpent: 23500,
      estimatedDuration: 720, // 12 hours in minutes
      actualDuration: 680,
      agentType: 'marketing',
      stakeholders: [
        { name: 'CMO', role: 'Sponsor', involvement: 'high' },
        { name: 'Brand Team', role: 'Contributor', involvement: 'high' },
        { name: 'Creative Director', role: 'Contributor', involvement: 'medium' }
      ],
      deliverables: [
        { name: 'Brand Audit', completed: true, dueDate: new Date('2024-11-15T12:00:00Z') },
        { name: 'Market Positioning Analysis', completed: true, dueDate: new Date('2024-11-20T16:00:00Z') },
        { name: 'Campaign Creative Assets', completed: true, dueDate: new Date('2024-11-25T14:00:00Z') },
        { name: 'Launch Strategy', completed: true, dueDate: new Date('2024-11-30T12:00:00Z') }
      ],
      tags: ['Brand Positioning', 'AI Marketing', 'Campaign Strategy', 'Customer Engagement'],
      dueDate: new Date('2024-11-30T23:59:59Z'),
    },
    {
      title: 'Process Automation Assessment - Manufacturing Operations',
      description: 'Comprehensive assessment of manufacturing processes with automation recommendations and implementation roadmap',
      type: 'operational_excellence' as const,
      priority: 'medium' as const,
      status: 'paused' as const,
      progress: 25,
      businessImpact: 7.8,
      complexity: 'high',
      category: 'Operational Excellence',
      budgetAllocated: 18000,
      budgetSpent: 3200,
      estimatedDuration: 600, // 10 hours in minutes
      actualDuration: 120,
      agentType: 'operations',
      stakeholders: [
        { name: 'Operations Director', role: 'Sponsor', involvement: 'high' },
        { name: 'Manufacturing Team', role: 'Contributor', involvement: 'high' },
        { name: 'IT Team', role: 'Contributor', involvement: 'medium' }
      ],
      deliverables: [
        { name: 'Current Process Analysis', completed: true, dueDate: new Date('2025-01-10T12:00:00Z') },
        { name: 'Automation Opportunities', completed: false, dueDate: new Date('2025-01-15T16:00:00Z') },
        { name: 'Implementation Roadmap', completed: false, dueDate: new Date('2025-01-20T14:00:00Z') },
        { name: 'ROI Analysis', completed: false, dueDate: new Date('2025-01-25T12:00:00Z') }
      ],
      tags: ['Process Automation', 'Manufacturing', 'Operational Excellence', 'Efficiency'],
      dueDate: new Date('2025-01-31T23:59:59Z'),
    },
    {
      title: 'Customer Behavior Analytics Dashboard - E-commerce Platform',
      description: 'Advanced analytics dashboard development for real-time customer behavior tracking and business intelligence',
      type: 'business_intelligence' as const,
      priority: 'medium' as const,
      status: 'pending' as const,
      progress: 0,
      businessImpact: 8.5,
      complexity: 'medium',
      category: 'Business Intelligence',
      budgetAllocated: 22000,
      budgetSpent: 0,
      estimatedDuration: 480, // 8 hours in minutes
      actualDuration: 0,
      agentType: 'analytics',
      stakeholders: [
        { name: 'Data Analytics Lead', role: 'Sponsor', involvement: 'high' },
        { name: 'E-commerce Team', role: 'Contributor', involvement: 'high' },
        { name: 'Product Manager', role: 'Reviewer', involvement: 'medium' }
      ],
      deliverables: [
        { name: 'Data Requirements Analysis', completed: false, dueDate: new Date('2025-02-05T12:00:00Z') },
        { name: 'Dashboard Design & Architecture', completed: false, dueDate: new Date('2025-02-10T16:00:00Z') },
        { name: 'Analytics Implementation', completed: false, dueDate: new Date('2025-02-15T14:00:00Z') },
        { name: 'Testing & Deployment', completed: false, dueDate: new Date('2025-02-20T12:00:00Z') }
      ],
      tags: ['Customer Analytics', 'Business Intelligence', 'E-commerce', 'Data Visualization'],
      dueDate: new Date('2025-02-28T23:59:59Z'),
    }
  ];

  // Create tasks
  for (const taskData of sampleTasks) {
    const agent = createdAgents.find(a => a.type === taskData.agentType);
    if (!agent) continue;

    const { agentType, ...taskCreateData } = taskData;
    
    const existingTask = await prisma.agentTask.findFirst({
      where: { 
        title: taskData.title,
        workspaceId: workspace.id 
      }
    });

    if (!existingTask) {
      const task = await prisma.agentTask.create({
        data: {
          ...taskCreateData,
          agentId: agent.id,
          workspaceId: workspace.id,
          startedAt: taskData.status === 'in_progress' || taskData.status === 'completed' || taskData.status === 'paused' 
            ? new Date(Date.now() - taskData.actualDuration * 60 * 1000) 
            : null,
          completedAt: taskData.status === 'completed' 
            ? new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
            : null,
        }
      });
      console.log(`✅ Created task: ${task.title}`);
    } else {
      console.log(`ℹ️  Task already exists: ${existingTask.title}`);
    }
  }

  console.log('🎉 Task management system seeded successfully!');
}

// Run the seed function
seedTaskManagement()
  .catch((e) => {
    console.error('❌ Error seeding task management system:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 