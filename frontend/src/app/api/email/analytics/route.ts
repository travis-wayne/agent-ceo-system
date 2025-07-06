import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getCampaignAnalytics,
  getEmailAutomationOverview
} from '@/app/actions/email-automation'

// GET /api/email-automation/analytics
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
    const type = searchParams.get('type') || 'overview'
    const campaignId = searchParams.get('campaignId')
    const timeframe = searchParams.get('timeframe') || '30d'
    const workspaceId = searchParams.get('workspaceId') || undefined

    // Validate timeframe
    const validTimeframes = ['7d', '30d', '90d', '6m', '1y', 'all']
    if (!validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        { 
          error: 'Invalid timeframe',
          validTimeframes 
        },
        { status: 400 }
      )
    }

    if (type === 'campaign') {
      // Campaign-specific analytics
      if (!campaignId) {
        return NextResponse.json(
          { error: 'Campaign ID is required for campaign analytics' },
          { status: 400 }
        )
      }

      const result = await getCampaignAnalytics(campaignId, timeframe)

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        type: 'campaign',
        analytics: result.analytics
      })

    } else if (type === 'overview') {
      // Email automation overview analytics
      const result = await getEmailAutomationOverview(workspaceId)

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        type: 'overview',
        overview: result.overview
      })

    } else {
      return NextResponse.json(
        { 
          error: 'Invalid analytics type',
          validTypes: ['overview', 'campaign']
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in GET /api/email-automation/analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 