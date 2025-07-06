import { NextRequest, NextResponse } from 'next/server';
import { executeDecisionSupport, getDecisionAnalysesByWorkspace } from '@/app/actions/strategic-intelligence';
import { auth } from '@/lib/auth';

// POST /api/strategic/decision-support - Execute decision support analysis
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
    if (!body.title || !body.decisionOptions || body.decisionOptions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Title and decision options are required'
      }, { status: 400 });
    }

    if (!body.evaluationCriteria || body.evaluationCriteria.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Evaluation criteria are required'
      }, { status: 400 });
    }

    // Execute decision support analysis
    const result = await executeDecisionSupport(workspaceId, userId, body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error in decision support API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET /api/strategic/decision-support - Get decision analyses
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
    
    const result = await getDecisionAnalysesByWorkspace(workspaceId);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching decision analyses:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 