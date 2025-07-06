import { NextRequest, NextResponse } from 'next/server';
import { executeStrategicPlanning, getStrategicPlansByWorkspace } from '@/app/actions/strategic-intelligence';
import { auth } from '@/lib/auth';

// POST /api/strategic/strategic-planning - Execute strategic planning
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Extract workspace info - TODO: Get from user session
    const workspaceId = body.workspaceId || 'default-workspace';
    const userId = session.user.id;
    
    // Validate required fields
    if (!body.title || !body.timeHorizonMonths) {
      return NextResponse.json({
        success: false,
        error: 'Title and time horizon are required'
      }, { status: 400 });
    }

    // Execute strategic planning
    const result = await executeStrategicPlanning(workspaceId, userId, body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error in strategic planning API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET /api/strategic/strategic-planning - Get strategic plans
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'default-workspace';
    
    const result = await getStrategicPlansByWorkspace(workspaceId);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching strategic plans:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 