import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  type UpdateTemplateRequest 
} from '@/app/actions/email-automation'

interface RouteParams {
  params: {
    templateId: string
  }
}

// GET /api/email/templates/[templateId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { templateId } = params
    const result = await getEmailTemplate(templateId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      template: result.template
    })

  } catch (error) {
    console.error('Error in GET /api/email/templates/[templateId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/email/templates/[templateId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { templateId } = params
    const body = await request.json()

    // Validate template type if provided
    if (body.type) {
      const validTypes = ['NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'WELCOME', 'FOLLOW_UP', 'REMINDER', 'SURVEY', 'ANNOUNCEMENT']
      
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { 
            error: 'Invalid template type',
            validTypes 
          },
          { status: 400 }
        )
      }
    }

    // Validate template category if provided
    if (body.category) {
      const validCategories = ['MARKETING', 'SALES', 'SUPPORT', 'PRODUCT', 'ANNOUNCEMENT', 'NEWSLETTER', 'TRANSACTIONAL']
      
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { 
            error: 'Invalid template category',
            validCategories 
          },
          { status: 400 }
        )
      }
    }

    const updateData: UpdateTemplateRequest = body
    const result = await updateEmailTemplate(templateId, updateData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template: result.template,
      message: result.message
    })

  } catch (error) {
    console.error('Error in PATCH /api/email/templates/[templateId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/email/templates/[templateId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { templateId } = params
    const result = await deleteEmailTemplate(templateId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message
    })

  } catch (error) {
    console.error('Error in DELETE /api/email/templates/[templateId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 