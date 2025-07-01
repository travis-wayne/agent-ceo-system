import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate webhook payload
    const { leadId, previousStatus, newStatus, triggeredBy, metadata } = body;
    
    if (!leadId || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields: leadId, newStatus" },
        { status: 400 }
      );
    }

    // Log the webhook received
    console.log("Lead Status Change Webhook received:", {
      leadId,
      previousStatus,
      newStatus,
      triggeredBy,
      timestamp: new Date().toISOString()
    });

    // TODO: Implement actual lead status change logic
    // This is where you would:
    // 1. Update lead status in database
    // 2. Trigger appropriate workflows based on status
    // 3. Send notifications to relevant team members
    // 4. Update analytics and metrics
    
    // Determine workflow actions based on status change
    const workflowActions = [];
    
    switch (newStatus) {
      case "qualified":
        workflowActions.push(
          {
            type: "assign_sales_rep",
            leadId,
            priority: metadata?.priority || "medium"
          },
          {
            type: "send_welcome_email",
            leadId,
            template: "qualified_lead_welcome"
          },
          {
            type: "create_crm_tasks",
            leadId,
            tasks: [
              "Schedule discovery call",
              "Send product demo information",
              "Research company background"
            ]
          }
        );
        break;
        
      case "customer":
        workflowActions.push(
          {
            type: "trigger_onboarding",
            leadId,
            flow: "customer_onboarding_sequence"
          },
          {
            type: "create_customer_record",
            leadId,
            assignToSuccess: true
          },
          {
            type: "send_notification",
            message: `New customer: ${leadId}`,
            channels: ["slack", "email"],
            recipients: ["sales-team", "customer-success"]
          }
        );
        break;
        
      case "lost":
        workflowActions.push(
          {
            type: "nurture_sequence",
            leadId,
            sequence: "lost_lead_nurture",
            delay: "30d"
          },
          {
            type: "update_analytics",
            leadId,
            metrics: {
              conversionStage: "lost",
              lostReason: metadata?.lostReason || "unknown"
            }
          }
        );
        break;
        
      case "contacted":
        workflowActions.push(
          {
            type: "schedule_followup",
            leadId,
            followupDate: metadata?.followupDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        );
        break;
    }

    // Example response structure for n8n integration
    const response = {
      success: true,
      leadId,
      statusChange: {
        from: previousStatus,
        to: newStatus,
        triggeredBy: triggeredBy || "system",
        timestamp: new Date().toISOString()
      },
      workflowActions,
      webhookEndpoints: {
        // Suggest related webhook endpoints for n8n workflows
        salesRepAssignment: "/api/webhooks/sales/rep-assigned",
        emailCampaign: "/api/webhooks/email/campaign-trigger",
        crmUpdate: "/api/webhooks/crm/record-update"
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Lead status change webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "Lead Status Change Webhook",
    method: "POST", 
    description: "Webhook endpoint for n8n to trigger workflows based on lead status changes",
    expectedFields: {
      leadId: "string (required) - ID of the lead with status change",
      previousStatus: "string (optional) - previous lead status",
      newStatus: "string (required) - new lead status",
      triggeredBy: "string (optional) - who/what triggered the status change",
      metadata: "object (optional) - additional context about the status change"
    },
    supportedStatuses: [
      "new",
      "contacted", 
      "qualified",
      "proposal_sent",
      "negotiation",
      "customer",
      "lost",
      "nurture"
    ],
    example: {
      leadId: "lead-67890",
      previousStatus: "contacted",
      newStatus: "qualified",
      triggeredBy: "sales-agent-ai",
      metadata: {
        priority: "high", 
        qualificationScore: 0.85,
        followupDate: "2024-01-18T10:00:00Z",
        notes: "Strong interest in enterprise package"
      }
    },
    workflowTriggers: {
      qualified: ["assign_sales_rep", "send_welcome_email", "create_crm_tasks"],
      customer: ["trigger_onboarding", "create_customer_record", "notify_success_team"],
      lost: ["nurture_sequence", "update_analytics", "competitor_analysis"],
      contacted: ["schedule_followup", "log_interaction"]
    }
  });
} 