import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  getContactLists, 
  createContactList,
  importContacts,
  type CreateContactListRequest,
  type ImportContactsRequest
} from '@/app/actions/email-automation'

// GET /api/email-automation/lists
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
    const status = searchParams.get('status') || undefined
    const source = searchParams.get('source') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await getContactLists(workspaceId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Apply filters
    let filteredLists = result.contactLists || []
    
    if (type) {
      filteredLists = filteredLists.filter(list => 
        list.type === type
      )
    }
    
    if (status) {
      filteredLists = filteredLists.filter(list => 
        list.status === status
      )
    }

    if (source) {
      filteredLists = filteredLists.filter(list => 
        list.source === source
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLists = filteredLists.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      contactLists: paginatedLists,
      pagination: {
        page,
        limit,
        total: filteredLists.length,
        totalPages: Math.ceil(filteredLists.length / limit)
      },
      statistics: result.statistics
    })

  } catch (error) {
    console.error('Error in GET /api/email-automation/lists:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/email-automation/lists
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

    // Check if this is a contact import request
    if (body.action === 'import_contacts') {
      return await handleContactImport(body)
    }

    // Validate required fields for list creation
    const requiredFields = ['name', 'type', 'source']
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

    // Validate list type
    const validTypes = [
      'MARKETING', 'TRANSACTIONAL', 'INTERNAL', 'IMPORT', 'SEGMENT', 'CUSTOM'
    ]
    
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid list type',
          validTypes 
        },
        { status: 400 }
      )
    }

    // Validate list source
    const validSources = [
      'MANUAL_IMPORT', 'API_IMPORT', 'WEB_FORM', 'INTEGRATION', 
      'SEGMENT', 'PURCHASE', 'EVENT', 'REFERRAL'
    ]
    
    if (!validSources.includes(body.source)) {
      return NextResponse.json(
        { 
          error: 'Invalid list source',
          validSources 
        },
        { status: 400 }
      )
    }

    // Create contact list
    const listData: CreateContactListRequest = {
      name: body.name,
      description: body.description,
      type: body.type,
      source: body.source,
      tags: body.tags || [],
      customFields: body.customFields
    }

    const result = await createContactList(listData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contactList: result.contactList,
      message: result.message
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/email-automation/lists:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle contact import requests
async function handleContactImport(body: any) {
  try {
    // Validate import request
    const requiredFields = ['listId', 'contacts']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields for import',
          missingFields 
        },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.contacts)) {
      return NextResponse.json(
        { error: 'Contacts must be an array' },
        { status: 400 }
      )
    }

    if (body.contacts.length === 0) {
      return NextResponse.json(
        { error: 'At least one contact is required' },
        { status: 400 }
      )
    }

    // Validate contact structure
    const validContact = body.contacts.every((contact: any) => 
      contact.email && typeof contact.email === 'string'
    )

    if (!validContact) {
      return NextResponse.json(
        { error: 'Each contact must have a valid email address' },
        { status: 400 }
      )
    }

    // Set default deduplication settings if not provided
    const deduplicationSettings = body.deduplicationSettings || {
      mergeStrategy: 'keep_newest',
      keyFields: ['email']
    }

    const importData: ImportContactsRequest = {
      listId: body.listId,
      contacts: body.contacts,
      deduplicationSettings
    }

    const result = await importContacts(importData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      importResult: result.importResult,
      message: result.message
    }, { status: 200 })

  } catch (error) {
    console.error('Error importing contacts:', error)
    return NextResponse.json(
      { error: 'Failed to import contacts' },
      { status: 500 }
    )
  }
} 