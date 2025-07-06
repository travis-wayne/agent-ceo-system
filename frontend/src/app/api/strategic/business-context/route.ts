import { NextRequest, NextResponse } from 'next/server';
import { createBusinessContext, getBusinessContextsByWorkspace } from '@/app/actions/strategic-intelligence';

// POST /api/strategic/business-context - Create business context
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract workspace info from headers or session
    // TODO: Implement proper authentication
    const workspaceId = body.workspaceId || 'default-workspace';
    
    // Validate required fields
    if (!body.name || !body.companyName || !body.industry) {
      return NextResponse.json({
        success: false,
        error: 'Name, company name, and industry are required'
      }, { status: 400 });
    }

    // Create the business context
    const result = await createBusinessContext(workspaceId, body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    console.error('Error in business context creation API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET /api/strategic/business-context - Get business contexts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'default-workspace';
    
    const result = await getBusinessContextsByWorkspace(workspaceId);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching business contexts:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 