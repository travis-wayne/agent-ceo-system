import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getEmailCampaigns, 
  createEmailCampaign,
  type CreateCampaignRequest 
} from '@/app/actions/email-automation'

// GET /api/email-automation/campaigns
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
    const status = searchParams.get('status') || undefined
    const type = searchParams.get('type') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await getEmailCampaigns(workspaceId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Apply filters
    let filteredCampaigns = result.campaigns || []
    
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.status === status
      )
    }
    
    if (type) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.type === type
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      campaigns: paginatedCampaigns,
      pagination: {
        page,
        limit,
        total: filteredCampaigns.length,
        totalPages: Math.ceil(filteredCampaigns.length / limit)
      },
      statistics: result.statistics
    })

  } catch (error) {
    console.error('Error in GET /api/email-automation/campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/email-automation/campaigns
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
    const requiredFields = ['name', 'type', 'subject', 'fromName', 'fromEmail']
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.fromEmail)) {
      return NextResponse.json(
        { error: 'Invalid from email format' },
        { status: 400 }
      )
    }

    if (body.replyTo && !emailRegex.test(body.replyTo)) {
      return NextResponse.json(
        { error: 'Invalid reply-to email format' },
        { status: 400 }
      )
    }

    // Validate campaign type
    const validTypes = [
      'NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'WELCOME_SERIES',
      'LEAD_NURTURING', 'RE_ENGAGEMENT', 'PRODUCT_ANNOUNCEMENT',
      'EVENT_INVITATION', 'DRIP_CAMPAIGN', 'BEHAVIORAL_TRIGGER'
    ]
    
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid campaign type',
          validTypes 
        },
        { status: 400 }
      )
    }

    // Validate scheduling
    if (body.schedulingType === 'SCHEDULED' && !body.scheduledTime) {
      return NextResponse.json(
        { error: 'Scheduled time is required for scheduled campaigns' },
        { status: 400 }
      )
    }

    if (body.scheduledTime) {
      const scheduledDate = new Date(body.scheduledTime)
      if (scheduledDate <= new Date()) {
        return NextResponse.json(
          { error: 'Scheduled time must be in the future' },
          { status: 400 }
        )
      }
    }

    // Create campaign
    const campaignData: CreateCampaignRequest = {
      name: body.name,
      description: body.description,
      type: body.type,
      subject: body.subject,
      fromName: body.fromName,
      fromEmail: body.fromEmail,
      replyTo: body.replyTo,
      templateId: body.templateId,
      htmlContent: body.htmlContent,
      textContent: body.textContent,
      targetLists: body.targetLists || [],
      schedulingType: body.schedulingType || 'IMMEDIATE',
      scheduledTime: body.scheduledTime ? new Date(body.scheduledTime) : undefined,
      priority: body.priority || 'MEDIUM',
      tags: body.tags || []
    }

    const result = await createEmailCampaign(campaignData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      campaign: result.campaign,
      message: result.message
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/email-automation/campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 