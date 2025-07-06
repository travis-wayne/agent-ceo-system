import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getContactList,
  updateContactList,
  deleteContactList,
  type UpdateContactListRequest 
} from '@/app/actions/email-automation'

interface RouteParams {
  params: {
    listId: string
  }
}

// GET /api/email/lists/[listId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { listId } = params
    const result = await getContactList(listId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      contactList: result.contactList
    })

  } catch (error) {
    console.error('Error in GET /api/email/lists/[listId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/email/lists/[listId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { listId } = params
    const body = await request.json()

    // Validate list type if provided
    if (body.type) {
      const validTypes = ['MARKETING', 'TRANSACTIONAL', 'INTERNAL', 'IMPORT', 'SEGMENT']
      
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { 
            error: 'Invalid list type',
            validTypes 
          },
          { status: 400 }
        )
      }
    }

    const updateData: UpdateContactListRequest = body
    const result = await updateContactList(listId, updateData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contactList: result.list,
      message: result.message
    })

  } catch (error) {
    console.error('Error in PATCH /api/email/lists/[listId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/email/lists/[listId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { listId } = params
    const result = await deleteContactList(listId)

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
    console.error('Error in DELETE /api/email/lists/[listId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 