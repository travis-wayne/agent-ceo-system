"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { 
  SocialPlatform, 
  SocialAccountType, 
  PostStatus, 
  PublishingType,
  ContentType,
  PostPriority,
  CampaignType,
  CampaignStatus,
  TemplateCategory,
  CalendarType,
  EventType,
  EventStatus,
  AnalyticsPeriod,
  ConnectionStatus
} from "@prisma/client";

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ConnectAccountRequest {
  platform: SocialPlatform;
  accountType: SocialAccountType;
  platformAccountId: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  scopes: string[];
}

interface CreatePostRequest {
  title?: string;
  content: string;
  hashtags?: string[];
  mentions?: string[];
  mediaAttachments?: any[];
  platformContent?: any;
  status: PostStatus;
  publishingType: PublishingType;
  scheduledFor?: Date;
  targetAccounts: string[];
  contentType: ContentType;
  priority: PostPriority;
  tags?: string[];
  campaignId?: string;
}

interface CreateCampaignRequest {
  name: string;
  description?: string;
  campaignType: CampaignType;
  targetPlatforms: SocialPlatform[];
  targetAccounts: string[];
  startDate?: Date;
  endDate?: Date;
  timezone: string;
  contentStrategy?: any;
  postingSchedule?: any;
  hashtagStrategy?: any;
  budget?: number;
  goals?: any;
  targetMetrics?: any;
}

interface ContentGenerationRequest {
  prompt: string;
  contentType: ContentType;
  targetPlatforms: SocialPlatform[];
  tone?: string;
  industry?: string;
  hashtags?: boolean;
  maxLength?: number;
  includeEmojis?: boolean;
}

interface AnalyticsRequest {
  accountIds?: string[];
  postIds?: string[];
  campaignIds?: string[];
  startDate: Date;
  endDate: Date;
  period: AnalyticsPeriod;
  metrics?: string[];
}

// =============================================================================
// ACCOUNT MANAGEMENT
// =============================================================================

export async function connectSocialAccount(request: ConnectAccountRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Check if account already exists
    const existingAccount = await prisma.socialMediaAccount.findUnique({
      where: {
        platformAccountId_platform: {
          platformAccountId: request.platformAccountId,
          platform: request.platform
        }
      }
    });

    if (existingAccount) {
      return { success: false, error: "Account already connected" };
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return { success: false, error: "User workspace not found" };
    }

    // Create social media account
    const account = await prisma.socialMediaAccount.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        platform: request.platform,
        accountType: request.accountType,
        platformAccountId: request.platformAccountId,
        username: request.username,
        displayName: request.displayName,
        profileImageUrl: request.profileImageUrl,
        accessToken: request.accessToken,
        refreshToken: request.refreshToken,
        tokenExpiresAt: request.tokenExpiresAt,
        scopes: request.scopes,
        connectionStatus: ConnectionStatus.CONNECTED,
        lastSyncAt: new Date()
      }
    });

    revalidatePath("/dashboard/social-media");
    return { success: true, data: account };

  } catch (error) {
    console.error("Error connecting social account:", error);
    return { success: false, error: "Failed to connect account" };
  }
}

export async function getSocialAccounts() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const accounts = await prisma.socialMediaAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            posts: true,
            campaigns: true,
            analytics: true
          }
        }
      }
    });

    return { success: true, data: accounts };

  } catch (error) {
    console.error("Error fetching social accounts:", error);
    return { success: false, error: "Failed to fetch accounts" };
  }
}

export async function updateAccountStatus(accountId: string, status: ConnectionStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const account = await prisma.socialMediaAccount.update({
      where: {
        id: accountId,
        userId: session.user.id
      },
      data: {
        connectionStatus: status,
        updatedAt: new Date()
      }
    });

    revalidatePath("/dashboard/social-media");
    return { success: true, data: account };

  } catch (error) {
    console.error("Error updating account status:", error);
    return { success: false, error: "Failed to update account status" };
  }
}

export async function disconnectSocialAccount(accountId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Update account status instead of deleting to preserve historical data
    const account = await prisma.socialMediaAccount.update({
      where: {
        id: accountId,
        userId: session.user.id
      },
      data: {
        connectionStatus: ConnectionStatus.DISCONNECTED,
        isActive: false,
        publishingEnabled: false,
        updatedAt: new Date()
      }
    });

    revalidatePath("/dashboard/social-media");
    return { success: true, data: account };

  } catch (error) {
    console.error("Error disconnecting account:", error);
    return { success: false, error: "Failed to disconnect account" };
  }
}

// =============================================================================
// CONTENT CREATION AND MANAGEMENT
// =============================================================================

export async function createSocialPost(request: CreatePostRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return { success: false, error: "User workspace not found" };
    }

    // Validate target accounts belong to user
    const accountCount = await prisma.socialMediaAccount.count({
      where: {
        id: { in: request.targetAccounts },
        userId: session.user.id,
        isActive: true
      }
    });

    if (accountCount !== request.targetAccounts.length) {
      return { success: false, error: "Invalid target accounts" };
    }

    // Create social media post
    const post = await prisma.socialMediaPost.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        campaignId: request.campaignId,
        title: request.title,
        content: request.content,
        hashtags: request.hashtags || [],
        mentions: request.mentions || [],
        mediaAttachments: request.mediaAttachments,
        platformContent: request.platformContent,
        status: request.status,
        publishingType: request.publishingType,
        scheduledFor: request.scheduledFor,
        targetAccounts: request.targetAccounts,
        contentType: request.contentType,
        priority: request.priority,
        tags: request.tags || []
      }
    });

    // If scheduled, create calendar events
    if (request.scheduledFor) {
      // This would integrate with calendar management
      await createCalendarEventsForPost(post.id, request.scheduledFor, request.targetAccounts);
    }

    revalidatePath("/dashboard/social-media/posts");
    return { success: true, data: post };

  } catch (error) {
    console.error("Error creating social post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getSocialPosts(campaignId?: string, status?: PostStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const posts = await prisma.socialMediaPost.findMany({
      where: {
        userId: session.user.id,
        ...(campaignId && { campaignId }),
        ...(status && { status })
      },
      orderBy: { createdAt: "desc" },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            campaignType: true
          }
        },
        analytics: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        _count: {
          select: {
            analytics: true
          }
        }
      }
    });

    return { success: true, data: posts };

  } catch (error) {
    console.error("Error fetching social posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

export async function updatePostStatus(postId: string, status: PostStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const post = await prisma.socialMediaPost.update({
      where: {
        id: postId,
        userId: session.user.id
      },
      data: {
        status,
        ...(status === PostStatus.PUBLISHED && { publishedAt: new Date() }),
        updatedAt: new Date()
      }
    });

    revalidatePath("/dashboard/social-media/posts");
    return { success: true, data: post };

  } catch (error) {
    console.error("Error updating post status:", error);
    return { success: false, error: "Failed to update post status" };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Delete related analytics first
    await prisma.postAnalytics.deleteMany({
      where: { postId }
    });

    // Delete the post
    await prisma.socialMediaPost.delete({
      where: {
        id: postId,
        userId: session.user.id
      }
    });

    revalidatePath("/dashboard/social-media/posts");
    return { success: true };

  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

// =============================================================================
// AI CONTENT GENERATION
// =============================================================================

export async function generateAIContent(request: ContentGenerationRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Mock AI content generation - in production, integrate with OpenAI/Claude
    const generatedContent = await mockAIContentGeneration(request);

    return { 
      success: true, 
      data: {
        content: generatedContent.content,
        hashtags: generatedContent.hashtags,
        platformVariations: generatedContent.platformVariations,
        aiMetadata: {
          model: "gpt-4",
          prompt: request.prompt,
          confidenceScore: 0.92,
          generatedAt: new Date()
        }
      }
    };

  } catch (error) {
    console.error("Error generating AI content:", error);
    return { success: false, error: "Failed to generate content" };
  }
}

async function mockAIContentGeneration(request: ContentGenerationRequest) {
  // Mock implementation - replace with actual AI service
  const baseContent = `🚀 Exciting update! ${request.prompt}
  
  ${request.includeEmojis ? "✨ " : ""}This is a game-changer for ${request.industry || 'our industry'}!
  
  What are your thoughts? Share your experience below! 👇`;

  const hashtags = request.hashtags ? [
    "#innovation",
    "#technology", 
    "#business",
    `#${request.industry?.toLowerCase() || 'industry'}`,
    "#growth"
  ] : [];

  const platformVariations = {
    [SocialPlatform.TWITTER]: {
      content: baseContent.substring(0, 280),
      hashtags: hashtags.slice(0, 3)
    },
    [SocialPlatform.LINKEDIN]: {
      content: `${baseContent}\n\n#LinkedIn #Professional ${hashtags.join(' ')}`,
      hashtags: hashtags
    },
    [SocialPlatform.FACEBOOK]: {
      content: `${baseContent}\n\nWhat's your take on this?`,
      hashtags: hashtags.slice(0, 5)
    }
  };

  return {
    content: baseContent,
    hashtags,
    platformVariations
  };
}

// =============================================================================
// CAMPAIGN MANAGEMENT
// =============================================================================

export async function createCampaign(request: CreateCampaignRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return { success: false, error: "User workspace not found" };
    }

    // Validate target accounts
    const accountCount = await prisma.socialMediaAccount.count({
      where: {
        id: { in: request.targetAccounts },
        userId: session.user.id,
        isActive: true
      }
    });

    if (accountCount !== request.targetAccounts.length) {
      return { success: false, error: "Invalid target accounts" };
    }

    // Create campaign
    const campaign = await prisma.socialMediaCampaign.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        name: request.name,
        description: request.description,
        campaignType: request.campaignType,
        targetPlatforms: request.targetPlatforms,
        targetAccounts: request.targetAccounts,
        startDate: request.startDate,
        endDate: request.endDate,
        timezone: request.timezone,
        contentStrategy: request.contentStrategy,
        postingSchedule: request.postingSchedule,
        hashtagStrategy: request.hashtagStrategy,
        budget: request.budget,
        goals: request.goals,
        targetMetrics: request.targetMetrics,
        status: CampaignStatus.DRAFT
      }
    });

    revalidatePath("/dashboard/social-media/campaigns");
    return { success: true, data: campaign };

  } catch (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: "Failed to create campaign" };
  }
}

export async function getCampaigns(status?: CampaignStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const campaigns = await prisma.socialMediaCampaign.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status })
      },
      orderBy: { createdAt: "desc" },
      include: {
        posts: {
          select: {
            id: true,
            status: true,
            publishedAt: true,
            engagementScore: true
          }
        },
        analytics: {
          orderBy: { date: "desc" },
          take: 30
        },
        _count: {
          select: {
            posts: true,
            analytics: true
          }
        }
      }
    });

    return { success: true, data: campaigns };

  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function updateCampaignStatus(campaignId: string, status: CampaignStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const campaign = await prisma.socialMediaCampaign.update({
      where: {
        id: campaignId,
        userId: session.user.id
      },
      data: {
        status,
        updatedAt: new Date()
      }
    });

    revalidatePath("/dashboard/social-media/campaigns");
    return { success: true, data: campaign };

  } catch (error) {
    console.error("Error updating campaign status:", error);
    return { success: false, error: "Failed to update campaign status" };
  }
}

// =============================================================================
// ANALYTICS AND REPORTING
// =============================================================================

export async function getAnalyticsOverview() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    // Get account metrics
    const accounts = await prisma.socialMediaAccount.findMany({
      where: { 
        userId: session.user.id,
        isActive: true 
      },
      include: {
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          orderBy: { date: "desc" }
        }
      }
    });

    // Get post metrics
    const posts = await prisma.socialMediaPost.findMany({
      where: {
        userId: session.user.id,
        status: PostStatus.PUBLISHED,
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        analytics: true
      }
    });

    // Calculate overview metrics
    const totalFollowers = accounts.reduce((sum, account) => sum + (account.followerCount || 0), 0);
    const totalPosts = posts.length;
    const totalEngagement = posts.reduce((sum, post) => sum + (post.engagementScore || 0), 0);
    const avgEngagementRate = totalPosts > 0 ? totalEngagement / totalPosts : 0;

    // Platform distribution
    const platformDistribution = accounts.reduce((acc, account) => {
      acc[account.platform] = (acc[account.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent performance trend
    const performanceTrend = accounts.flatMap(account => 
      account.analytics.map(analytics => ({
        date: analytics.date,
        platform: account.platform,
        engagement: analytics.totalEngagement,
        reach: analytics.totalReach,
        followers: analytics.followerCount
      }))
    );

    return {
      success: true,
      data: {
        totalAccounts: accounts.length,
        totalFollowers,
        totalPosts,
        avgEngagementRate,
        platformDistribution,
        performanceTrend,
        topPerformingPosts: posts
          .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0))
          .slice(0, 5)
      }
    };

  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

export async function getPostAnalytics(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const post = await prisma.socialMediaPost.findUnique({
      where: {
        id: postId,
        userId: session.user.id
      },
      include: {
        analytics: {
          orderBy: { date: "asc" }
        }
      }
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Calculate performance metrics
    const latestAnalytics = post.analytics[post.analytics.length - 1];
    const performanceOverTime = post.analytics.map(analytics => ({
      date: analytics.date,
      engagement: analytics.engagement,
      reach: analytics.reach,
      impressions: analytics.impressions,
      likes: analytics.likes,
      comments: analytics.comments,
      shares: analytics.shares,
      clicks: analytics.clicks
    }));

    return {
      success: true,
      data: {
        post,
        latestMetrics: latestAnalytics,
        performanceOverTime,
        totalAnalyticsPoints: post.analytics.length
      }
    };

  } catch (error) {
    console.error("Error fetching post analytics:", error);
    return { success: false, error: "Failed to fetch post analytics" };
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function createCalendarEventsForPost(postId: string, scheduledDate: Date, accountIds: string[]) {
  // This would create calendar events for scheduled posts
  // Implementation would depend on calendar management system
  console.log(`Creating calendar events for post ${postId} scheduled for ${scheduledDate}`);
}

// =============================================================================
// CONTENT TEMPLATES
// =============================================================================

export async function createContentTemplate(
  name: string,
  content: string,
  category: TemplateCategory,
  targetPlatforms: SocialPlatform[],
  variables?: any,
  defaultHashtags?: string[]
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return { success: false, error: "User workspace not found" };
    }

    const template = await prisma.contentTemplate.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        name,
        content,
        category,
        targetPlatforms,
        variables,
        defaultHashtags: defaultHashtags || []
      }
    });

    revalidatePath("/dashboard/social-media/templates");
    return { success: true, data: template };

  } catch (error) {
    console.error("Error creating content template:", error);
    return { success: false, error: "Failed to create template" };
  }
}

export async function getContentTemplates(category?: TemplateCategory) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const templates = await prisma.contentTemplate.findMany({
      where: {
        userId: session.user.id,
        ...(category && { category })
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, data: templates };

  } catch (error) {
    console.error("Error fetching content templates:", error);
    return { success: false, error: "Failed to fetch templates" };
  }
} 