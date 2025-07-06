import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostStatus, PublishingType, ContentType, PostPriority } from "@prisma/client";

// GET /api/social-media/posts - Get user's social media posts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const status = searchParams.get("status") as PostStatus | null;
    const contentType = searchParams.get("contentType") as ContentType | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await prisma.socialMediaPost.findMany({
      where: {
        userId: session.user.id,
        ...(campaignId && { campaignId }),
        ...(status && { status }),
        ...(contentType && { contentType })
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            campaignType: true,
            status: true
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

    // Get total count for pagination
    const total = await prisma.socialMediaPost.count({
      where: {
        userId: session.user.id,
        ...(campaignId && { campaignId }),
        ...(status && { status }),
        ...(contentType && { contentType })
      }
    });

    // Calculate aggregate metrics
    const statusCounts = await prisma.socialMediaPost.groupBy({
      by: ['status'],
      where: { userId: session.user.id },
      _count: true
    });

    const contentTypeCounts = await prisma.socialMediaPost.groupBy({
      by: ['contentType'],
      where: { userId: session.user.id },
      _count: true
    });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      summary: {
        statusDistribution: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        contentTypeDistribution: contentTypeCounts.reduce((acc, item) => {
          acc[item.contentType] = item._count;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error("Error fetching social media posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/social-media/posts - Create new social media post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      hashtags,
      mentions,
      mediaAttachments,
      platformContent,
      status,
      publishingType,
      scheduledFor,
      targetAccounts,
      contentType,
      priority,
      tags,
      campaignId,
      isAIGenerated,
      aiModel,
      generationPrompt
    } = body;

    // Validate required fields
    if (!content || !targetAccounts || targetAccounts.length === 0) {
      return NextResponse.json(
        { error: "Content and target accounts are required" },
        { status: 400 }
      );
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { workspaceId: true }
    });

    if (!user?.workspaceId) {
      return NextResponse.json(
        { error: "User workspace not found" },
        { status: 400 }
      );
    }

    // Validate target accounts belong to user
    const accountCount = await prisma.socialMediaAccount.count({
      where: {
        id: { in: targetAccounts },
        userId: session.user.id,
        isActive: true
      }
    });

    if (accountCount !== targetAccounts.length) {
      return NextResponse.json(
        { error: "Invalid target accounts" },
        { status: 400 }
      );
    }

    // Validate campaign if provided
    if (campaignId) {
      const campaign = await prisma.socialMediaCampaign.findUnique({
        where: {
          id: campaignId,
          userId: session.user.id
        }
      });

      if (!campaign) {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        );
      }
    }

    // Create social media post
    const post = await prisma.socialMediaPost.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        campaignId,
        title,
        content,
        hashtags: hashtags || [],
        mentions: mentions || [],
        mediaAttachments,
        platformContent,
        status: status || PostStatus.DRAFT,
        publishingType: publishingType || PublishingType.IMMEDIATE,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        targetAccounts,
        contentType: contentType || ContentType.TEXT,
        priority: priority || PostPriority.MEDIUM,
        tags: tags || [],
        isAIGenerated: isAIGenerated || false,
        aiModel,
        generationPrompt
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            campaignType: true
          }
        }
      }
    });

    // TODO: If scheduled, add to publishing queue
    // if (scheduledFor && status === PostStatus.SCHEDULED) {
    //   await addToPublishingQueue(post);
    // }

    // TODO: If publishing immediately, process now
    // if (publishingType === PublishingType.IMMEDIATE && status === PostStatus.PUBLISHING) {
    //   await publishPostImmediately(post);
    // }

    return NextResponse.json({
      post,
      message: "Post created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating social media post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
} 