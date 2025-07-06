import { NextRequest, NextResponse } from 'next/server';
import { createDataUploadSession, processUploadedFile } from '@/app/actions/data-analysis';
import { auth } from '@/lib/auth';

// POST /api/data-analysis/upload - Create upload session and process file
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
    
    // Validate required fields
    if (!body.fileName || !body.fileType || !body.fileSize) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: fileName, fileType, fileSize'
      }, { status: 400 });
    }

    // Create upload session
    const result = await createDataUploadSession({
      fileName: body.fileName,
      originalName: body.originalName || body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      filePath: body.filePath,
      processingOptions: body.processingOptions,
      analysisSettings: body.analysisSettings,
      validationRules: body.validationRules
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    // Start background processing
    if (result.data?.id) {
      processUploadedFile(result.data.id);
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'File upload session created successfully'
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET /api/data-analysis/upload - Get upload sessions
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Mock implementation - return recent upload sessions
    const uploadSessions = [
      {
        id: "upload_1",
        userId: session.user.id,
        fileName: "business_data.csv",
        originalName: "Q4_Business_Analysis.csv",
        fileType: "CSV",
        fileSize: 2048576,
        status: "COMPLETED",
        processingStage: "COMPLETED",
        progress: 100,
        uploadStarted: "2024-01-15T09:30:00Z",
        processingCompleted: "2024-01-15T09:35:00Z"
      },
      {
        id: "upload_2",
        userId: session.user.id,
        fileName: "employee_data.xlsx",
        originalName: "Employee_Productivity_2024.xlsx",
        fileType: "EXCEL",
        fileSize: 1536000,
        status: "PROCESSING",
        processingStage: "ANALYSIS",
        progress: 75,
        uploadStarted: "2024-01-16T14:20:00Z",
        processingCompleted: null
      }
    ];

    return NextResponse.json({
      success: true,
      data: uploadSessions,
      total: uploadSessions.length
    });

  } catch (error) {
    console.error('Upload sessions API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 