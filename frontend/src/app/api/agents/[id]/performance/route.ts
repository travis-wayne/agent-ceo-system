import { NextRequest, NextResponse } from "next/server";
import { 
  getAgentPerformanceMetrics,
  getAgentBusinessImpact
} from "@/app/actions/tasks";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') as 'day' | 'week' | 'month' || 'week';
    const includeBusinessImpact = searchParams.get('includeBusinessImpact') === 'true';

    // Validate timeframe
    if (!['day', 'week', 'month'].includes(timeframe)) {
      return NextResponse.json(
        { error: "Invalid timeframe. Must be one of: day, week, month" },
        { status: 400 }
      );
    }

    // Get performance metrics
    const metricsResult = await getAgentPerformanceMetrics(id, timeframe);
    
    if (!metricsResult.success) {
      return NextResponse.json(
        { error: metricsResult.error },
        { status: metricsResult.error === 'Agent not found' ? 404 : 500 }
      );
    }

    const response: any = {
      success: true,
      performance: metricsResult.metrics,
      timestamp: new Date().toISOString()
    };

    // Include business impact if requested
    if (includeBusinessImpact) {
      const impactTimeframe = timeframe === 'day' ? 'week' : timeframe === 'week' ? 'month' : 'quarter';
      const impactResult = await getAgentBusinessImpact(id, impactTimeframe);
      
      if (impactResult.success) {
        response.businessImpact = impactResult.impact;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 