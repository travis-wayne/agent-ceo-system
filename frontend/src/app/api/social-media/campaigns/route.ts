import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CampaignType, CampaignStatus, SocialPlatform } from "@prisma/client";

// GET /api/social-media/campaigns - Get user's social media campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const campaigns = await prisma.socialMediaCampaign.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ campaigns });

  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

// POST /api/social-media/campaigns - Create new social media campaign
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
      name,
      description,
      campaignType,
      targetPlatforms,
      targetAccounts,
      startDate,
      endDate,
      timezone,
      contentStrategy,
      postingSchedule,
      hashtagStrategy,
      budget,
      goals,
      targetMetrics
    } = body;

    // Validate required fields
    if (!name || !campaignType || !targetPlatforms || targetPlatforms.length === 0) {
      return NextResponse.json(
        { error: "Name, campaign type, and target platforms are required" },
        { status: 400 }
      );
    }

    // Validate date range
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: "End date must be after start date" },
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

    // Validate target accounts if provided
    if (targetAccounts && targetAccounts.length > 0) {
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
    }

    // Create campaign
    const campaign = await prisma.socialMediaCampaign.create({
      data: {
        userId: session.user.id,
        workspaceId: user.workspaceId,
        name,
        description,
        campaignType,
        targetPlatforms,
        targetAccounts: targetAccounts || [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        timezone: timezone || "UTC",
        contentStrategy,
        postingSchedule,
        hashtagStrategy,
        budget,
        goals,
        targetMetrics,
        status: CampaignStatus.DRAFT
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    // TODO: Initialize campaign analytics tracking
    // await initializeCampaignAnalytics(campaign);

    // TODO: Set up automated posting schedule if configured
    // if (postingSchedule) {
    //   await setupCampaignSchedule(campaign);
    // }

    return NextResponse.json({
      campaign,
      message: "Campaign created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating social media campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
} 