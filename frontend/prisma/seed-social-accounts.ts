import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSocialAccounts() {
  try {
    console.log('🌱 Seeding social media accounts...');
    
    // Get the first user and workspace
    const user = await prisma.user.findFirst({
      include: { workspace: true }
    });
    
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      return;
    }
    
    console.log(`📧 Found user: ${user.email}`);
    
    // Create test social media accounts
    const accounts = await Promise.all([
      prisma.socialMediaAccount.create({
        data: {
          userId: user.id,
          workspaceId: user.workspaceId,
          platform: 'TWITTER',
          accountType: 'BUSINESS',
          platformAccountId: `twitter_${Date.now()}`,
          username: 'test_twitter_account',
          displayName: 'Test Twitter Account',
          profileImageUrl: 'https://via.placeholder.com/150',
          accessToken: 'test_twitter_token',
          scopes: ['read', 'write'],
          connectionStatus: 'CONNECTED',
          lastSyncAt: new Date(),
          isActive: true
        }
      }),
      prisma.socialMediaAccount.create({
        data: {
          userId: user.id,
          workspaceId: user.workspaceId,
          platform: 'LINKEDIN',
          accountType: 'BUSINESS',
          platformAccountId: `linkedin_${Date.now()}`,
          username: 'test_linkedin_account',
          displayName: 'Test LinkedIn Account',
          profileImageUrl: 'https://via.placeholder.com/150',
          accessToken: 'test_linkedin_token',
          scopes: ['read', 'write'],
          connectionStatus: 'CONNECTED',
          lastSyncAt: new Date(),
          isActive: true
        }
      }),
      prisma.socialMediaAccount.create({
        data: {
          userId: user.id,
          workspaceId: user.workspaceId,
          platform: 'FACEBOOK',
          accountType: 'BUSINESS',
          platformAccountId: `facebook_${Date.now()}`,
          username: 'test_facebook_account',
          displayName: 'Test Facebook Account',
          profileImageUrl: 'https://via.placeholder.com/150',
          accessToken: 'test_facebook_token',
          scopes: ['read', 'write'],
          connectionStatus: 'CONNECTED',
          lastSyncAt: new Date(),
          isActive: true
        }
      })
    ]);
    
    console.log(`✅ Created ${accounts.length} test social media accounts`);
    
    // Create a test post
    const post = await prisma.socialMediaPost.create({
      data: {
        userId: user.id,
        workspaceId: user.workspaceId,
        title: 'Welcome to Social Media Management',
        content: 'This is a test post created during the social media setup. You can now create, schedule, and manage your social media posts! 🚀 #SocialMedia #Test',
        hashtags: ['SocialMedia', 'Test', 'AgentCEO'],
        mentions: [],
        status: 'PUBLISHED',
        publishingType: 'IMMEDIATE',
        targetAccounts: [accounts[0].id],
        contentType: 'TEXT',
        priority: 'MEDIUM',
        tags: ['welcome', 'test'],
        publishedAt: new Date()
      }
    });
    
    console.log(`✅ Created test post: ${post.title}`);
    
    console.log('🎉 Social media accounts seeded successfully!');
    console.log('📝 You can now create posts using the social media management interface.');
    
  } catch (error) {
    console.error('❌ Error seeding social media accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSocialAccounts(); 