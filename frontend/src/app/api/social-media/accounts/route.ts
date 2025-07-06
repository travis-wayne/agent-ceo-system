import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SocialPlatform, SocialAccountType, ConnectionStatus } from "@prisma/client";

// GET /api/social-media/accounts - Get user's social media accounts
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
    const platform = searchParams.get("platform") as SocialPlatform | null;
    const status = searchParams.get("status") as ConnectionStatus | null;

    const accounts = await prisma.socialMediaAccount.findMany({
      where: {
        userId: session.user.id,
        ...(platform && { platform }),
        ...(status && { connectionStatus: status })
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            posts: true,
            campaigns: true,
            analytics: true
          }
        },
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          },
          orderBy: { date: "desc" },
          take: 7
        }
      }
    });

    // Calculate recent metrics for each account
    const accountsWithMetrics = accounts.map(account => {
      const recentAnalytics = account.analytics;
      const totalEngagement = recentAnalytics.reduce((sum, analytics) => sum + analytics.totalEngagement, 0);
      const totalReach = recentAnalytics.reduce((sum, analytics) => sum + analytics.totalReach, 0);
      const avgEngagementRate = recentAnalytics.length > 0 
        ? recentAnalytics.reduce((sum, analytics) => sum + analytics.engagementRate, 0) / recentAnalytics.length 
        : 0;

      return {
        ...account,
        recentMetrics: {
          totalEngagement,
          totalReach,
          avgEngagementRate,
          followerGrowth: recentAnalytics.length > 1 
            ? recentAnalytics[0].followerCount - recentAnalytics[recentAnalytics.length - 1].followerCount 
            : 0
        }
      };
    });

    return NextResponse.json({
      accounts: accountsWithMetrics,
      total: accounts.length,
      platforms: [...new Set(accounts.map(a => a.platform))],
      connectedCount: accounts.filter(a => a.connectionStatus === ConnectionStatus.CONNECTED).length
    });

  } catch (error) {
    console.error("Error fetching social media accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

// POST /api/social-media/accounts - Connect new social media account
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
      platform,
      accountType,
      platformAccountId,
      username,
      displayName,
      profileImageUrl,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      scopes
    } = body;

    // Validate required fields
    if (!platform || !accountType || !platformAccountId || !username || !displayName || !accessToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existingAccount = await prisma.socialMediaAccount.findUnique({
      where: {
        platformAccountId_platform: {
          platformAccountId,
          platform
        }
      }
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "Account already connected" },
        { status: 409 }
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

    // Create social media account
    const account = await prisma.socialMediaAccount.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        platform,
        accountType,
        platformAccountId,
        username,
        displayName,
        profileImageUrl,
        accessToken,
        refreshToken,
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
        scopes: scopes || [],
        connectionStatus: ConnectionStatus.CONNECTED,
        lastSyncAt: new Date()
      }
    });

    // TODO: Initialize account sync and fetch initial metrics
    // await initializeAccountSync(account);

    return NextResponse.json({
      account,
      message: "Account connected successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error connecting social media account:", error);
    return NextResponse.json(
      { error: "Failed to connect account" },
      { status: 500 }
    );
  }
} 