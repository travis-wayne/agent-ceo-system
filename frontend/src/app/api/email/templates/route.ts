import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getEmailTemplates, 
  createEmailTemplate,
  type CreateTemplateRequest 
} from '@/app/actions/email-automation'

// GET /api/email-automation/templates
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const workspaceId = searchParams.get('workspaceId') || undefined
    const type = searchParams.get('type') || undefined
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await getEmailTemplates(workspaceId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Apply filters
    let filteredTemplates = result.templates || []
    
    if (type) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.type === type
      )
    }
    
    if (category) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.category === category
      )
    }

    if (status) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.status === status
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      templates: paginatedTemplates,
      pagination: {
        page,
        limit,
        total: filteredTemplates.length,
        totalPages: Math.ceil(filteredTemplates.length / limit)
      },
      statistics: result.statistics
    })

  } catch (error) {
    console.error('Error in GET /api/email-automation/templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/email-automation/templates
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'type', 'category', 'htmlContent']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields 
        },
        { status: 400 }
      )
    }

    // Validate template type
    const validTypes = [
      'NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'WELCOME',
      'ABANDONED_CART', 'PRODUCT_UPDATE', 'EVENT_INVITATION', 'SURVEY', 'CUSTOM'
    ]
    
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid template type',
          validTypes 
        },
        { status: 400 }
      )
    }

    // Validate template category
    const validCategories = [
      'MARKETING', 'SALES', 'SUPPORT', 'PRODUCT', 
      'ANNOUNCEMENT', 'SEASONAL', 'LIFECYCLE', 'BEHAVIORAL'
    ]
    
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { 
          error: 'Invalid template category',
          validCategories 
        },
        { status: 400 }
      )
    }

    // Validate HTML content
    if (!body.htmlContent || body.htmlContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'HTML content cannot be empty' },
        { status: 400 }
      )
    }

    // Basic HTML validation (check for basic structure)
    const hasBasicHtmlStructure = body.htmlContent.includes('<html') || 
                                 body.htmlContent.includes('<body') ||
                                 body.htmlContent.includes('<table') ||
                                 body.htmlContent.includes('<div')
    
    if (!hasBasicHtmlStructure) {
      return NextResponse.json(
        { 
          error: 'HTML content should contain valid HTML structure',
          hint: 'Include basic HTML elements like <html>, <body>, <table>, or <div>'
        },
        { status: 400 }
      )
    }

    // Create template
    const templateData: CreateTemplateRequest = {
      name: body.name,
      description: body.description,
      type: body.type,
      category: body.category,
      htmlContent: body.htmlContent,
      textContent: body.textContent,
      cssStyles: body.cssStyles,
      variables: body.variables,
      tags: body.tags || []
    }

    const result = await createEmailTemplate(templateData)

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
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/email-automation/templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 