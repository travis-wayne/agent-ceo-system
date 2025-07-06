// Simple test script to create a test social media account and post
// Run this to test the social media functionality

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestAccount() {
  try {
    // First check if we have a user and workspace
    const user = await prisma.user.findFirst({
      include: { workspace: true }
    });
    
    if (!user) {
      console.log('No user found. Please create a user first.');
      return;
    }
    
    console.log('Found user:', user.email);
    
    // Create a test social media account
    const account = await prisma.socialMediaAccount.create({
      data: {
        userId: user.id,
        workspaceId: user.workspaceId,
        platform: 'TWITTER',
        accountType: 'BUSINESS',
        platformAccountId: `test_${Date.now()}`,
        username: `test_user_${Date.now()}`,
        displayName: 'Test Account',
        profileImageUrl: 'https://via.placeholder.com/150',
        accessToken: 'test_token',
        scopes: ['read', 'write'],
        connectionStatus: 'CONNECTED',
        lastSyncAt: new Date()
      }
    });
    
    console.log('Created test account:', account);
    
    // Now create a test post
    const post = await prisma.socialMediaPost.create({
      data: {
        userId: user.id,
        workspaceId: user.workspaceId,
        title: 'Test Post',
        content: 'This is a test post created programmatically.',
        hashtags: ['test', 'debug'],
        mentions: [],
        status: 'PUBLISHED',
        publishingType: 'IMMEDIATE',
        targetAccounts: [account.id],
        contentType: 'TEXT',
        priority: 'MEDIUM',
        tags: ['test']
      }
    });
    
    console.log('Created test post:', post);
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAccount(); 