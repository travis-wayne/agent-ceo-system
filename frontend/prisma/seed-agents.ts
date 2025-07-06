import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAgents() {
  console.log('🤖 Seeding AI Agents...');

  try {
    // Get or create a default workspace
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Default Workspace',
          plan: 'premium',
          maxUsers: 10,
        }
      });
    }

    // Define the 5 AI Agents from the workflow guide
    const agentsData = [
      {
        name: 'CEO Agent',
        type: 'ceo',
        specialization: 'Strategic planning, market analysis, and business intelligence',
        model: 'GPT-4 Turbo',
        avatar: '🧠',
        maxConcurrentTasks: 5,
        status: 'active',
        tasksCompleted: 147,
        successRate: 94.8,
        efficiency: 96.0,
      },
      {
        name: 'Sales Agent',
        type: 'sales',
        specialization: 'Lead generation, sales optimization, and revenue growth',
        model: 'GPT-4 Turbo',
        avatar: '💼',
        maxConcurrentTasks: 8,
        status: 'active',
        tasksCompleted: 203,
        successRate: 96.2,
        efficiency: 94.0,
      },
      {
        name: 'Marketing Agent',
        type: 'marketing',
        specialization: 'Content creation, brand strategy, and digital marketing',
        model: 'Claude-3 Opus',
        avatar: '🎨',
        maxConcurrentTasks: 6,
        status: 'active',
        tasksCompleted: 178,
        successRate: 91.7,
        efficiency: 89.0,
      },
      {
        name: 'Operations Agent',
        type: 'operations',
        specialization: 'Process optimization, automation, and operational efficiency',
        model: 'GPT-4 Turbo',
        avatar: '⚙️',
        maxConcurrentTasks: 4,
        status: 'maintenance',
        tasksCompleted: 98,
        successRate: 93.5,
        efficiency: 91.0,
      },
      {
        name: 'Analytics Agent',
        type: 'analytics',
        specialization: 'Data analysis, business intelligence, and predictive modeling',
        model: 'Claude-3 Opus',
        avatar: '📊',
        maxConcurrentTasks: 3,
        status: 'active',
        tasksCompleted: 156,
        successRate: 97.1,
        efficiency: 92.0,
      },
    ];

    // Create agents
    for (const agentData of agentsData) {
      const existingAgent = await prisma.agent.findFirst({
        where: {
          name: agentData.name,
          workspaceId: workspace.id,
        },
      });

      if (!existingAgent) {
        const agent = await prisma.agent.create({
          data: {
            ...agentData,
            workspaceId: workspace.id,
          },
        });
        console.log(`✅ Created ${agent.name}`);
      } else {
        console.log(`⚠️ ${agentData.name} already exists, skipping...`);
      }
    }

    console.log('🎉 Agent seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding agents:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedAgents();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export default seedAgents; 