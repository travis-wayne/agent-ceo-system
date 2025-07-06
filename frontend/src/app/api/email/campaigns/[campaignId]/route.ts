import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign,
  duplicateEmailCampaign,
  type UpdateCampaignRequest 
} from '@/app/actions/email-automation'

interface RouteParams {
  params: {
    campaignId: string
  }
}

// GET /api/email/campaigns/[campaignId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { campaignId } = params
    const result = await getEmailCampaign(campaignId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      campaign: result.campaign
    })

  } catch (error) {
    console.error('Error in GET /api/email/campaigns/[campaignId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/email/campaigns/[campaignId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { campaignId } = params
    const body = await request.json()

    // Validate email formats if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (body.fromEmail && !emailRegex.test(body.fromEmail)) {
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

    // Validate campaign type if provided
    if (body.type) {
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
    }

    // Validate scheduling if provided
    if (body.scheduledTime) {
      const scheduledDate = new Date(body.scheduledTime)
      if (scheduledDate <= new Date()) {
        return NextResponse.json(
          { error: 'Scheduled time must be in the future' },
          { status: 400 }
        )
      }
    }

    const updateData: UpdateCampaignRequest = body
    const result = await updateEmailCampaign(campaignId, updateData)

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
    })

  } catch (error) {
    console.error('Error in PATCH /api/email/campaigns/[campaignId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/email/campaigns/[campaignId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { campaignId } = params
    const result = await deleteEmailCampaign(campaignId)

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
    console.error('Error in DELETE /api/email/campaigns/[campaignId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/email/campaigns/[campaignId] (for actions like duplicate)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { campaignId } = params
    const body = await request.json()
    const { action, ...actionData } = body

    if (action === 'duplicate') {
      const result = await duplicateEmailCampaign(campaignId, actionData.newName)

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
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in POST /api/email/campaigns/[campaignId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 