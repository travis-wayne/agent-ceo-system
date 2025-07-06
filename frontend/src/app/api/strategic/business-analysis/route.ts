import { NextRequest, NextResponse } from 'next/server';
import { executeBusinessAnalysis, getAnalysisRecordsByWorkspace } from '@/app/actions/strategic-intelligence';

// POST /api/strategic/business-analysis - Execute business analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract user and workspace info from headers or session
    // TODO: Implement proper authentication
    const workspaceId = body.workspaceId || 'default-workspace';
    const userId = body.userId || 'default-user';
    
    // Validate required fields
    if (!body.title || !body.analysisType) {
      return NextResponse.json({
        success: false,
        error: 'Title and analysis type are required'
      }, { status: 400 });
    }

    // Execute the business analysis
    const result = await executeBusinessAnalysis(workspaceId, userId, body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error in business analysis API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET /api/strategic/business-analysis - Get analysis records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'default-workspace';
    
    const result = await getAnalysisRecordsByWorkspace(workspaceId);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching analysis records:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 