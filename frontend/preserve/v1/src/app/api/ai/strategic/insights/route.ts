import { NextRequest, NextResponse } from "next/server";
import { StrategicIntelligenceService } from "@/lib/services";
import { InsightCategory, ImpactLevel, InsightStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const impact = searchParams.get('impact');
    const limit = searchParams.get('limit');

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const filters: any = {};
    
    if (category) {
      filters.category = category.split(',') as InsightCategory[];
    }
    if (status) {
      filters.status = status.split(',') as InsightStatus[];
    }
    if (impact) {
      filters.impact = impact.split(',') as ImpactLevel[];
    }
    if (limit) {
      filters.limit = parseInt(limit);
    }

    const insights = await StrategicIntelligenceService.getInsightsByWorkspace(workspaceId, filters);
    const analytics = await StrategicIntelligenceService.getInsightAnalytics(workspaceId);

    return NextResponse.json({
      insights,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'generate_analysis') {
      const { type, timeframe, dataSource, workspaceId, businessId } = data;

      if (!type || !timeframe || !workspaceId) {
        return NextResponse.json(
          { error: "Missing required fields: type, timeframe, workspaceId" },
          { status: 400 }
        );
      }

      const analysisRequest = {
        type,
        timeframe,
        dataSource: dataSource || 'all',
        workspaceId,
        businessId
      };

      let result;
      switch (type) {
        case 'market_analysis':
          result = await StrategicIntelligenceService.generateMarketAnalysis(analysisRequest);
          break;
        case 'customer_behavior':
          result = await StrategicIntelligenceService.generateCustomerBehaviorAnalysis(analysisRequest);
          break;
        case 'revenue_optimization':
          result = await StrategicIntelligenceService.generateRevenueOptimization(analysisRequest);
          break;
        default:
          return NextResponse.json(
            { error: "Invalid analysis type" },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        analysis: result,
        type,
        generatedAt: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
} 