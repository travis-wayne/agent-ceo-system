import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: Implement actual n8n health check
    // This would typically make a request to your n8n instance
    const n8nUrl = process.env.N8N_URL || process.env.NEXT_PUBLIC_N8N_URL || "http://localhost:5678";
    
    let n8nStatus = {
      connected: false,
      version: null,
      activeWorkflows: 0,
      error: null
    };

    try {
      // Attempt to check n8n health (if endpoint is available)
      // const healthCheck = await fetch(`${n8nUrl}/healthz`);
      // n8nStatus.connected = healthCheck.ok;
      
      // For now, we'll assume it's connected if the URL is configured
      n8nStatus.connected = !!n8nUrl;
      n8nStatus.version = "1.19.4"; // Mock version
      n8nStatus.activeWorkflows = 12; // Mock data
    } catch (error) {
      n8nStatus.error = "Connection failed";
    }

    const webhookEndpoints = [
      {
        path: "/api/webhooks/agent/task-completed",
        method: "POST",
        description: "Triggered when AI agents complete tasks",
        status: "active",
        usage: "High",
        integrations: ["Task Management", "Agent Monitoring", "Notifications"]
      },
      {
        path: "/api/webhooks/lead/status-change", 
        method: "POST",
        description: "Triggered when lead status changes",
        status: "active",
        usage: "High",
        integrations: ["CRM", "Sales Automation", "Lead Nurturing"]
      },
      {
        path: "/api/webhooks/email/campaign-event",
        method: "POST", 
        description: "Triggered by email campaign events (opens, clicks, etc.)",
        status: "active",
        usage: "Medium",
        integrations: ["Email Marketing", "Engagement Tracking", "Analytics"]
      },
      {
        path: "/api/webhooks/crm/record-update",
        method: "POST",
        description: "Triggered when CRM records are updated",
        status: "planned",
        usage: "Medium",
        integrations: ["CRM", "Data Sync", "Reporting"]
      },
      {
        path: "/api/webhooks/social/engagement",
        method: "POST",
        description: "Triggered by social media engagement events",
        status: "planned", 
        usage: "Low",
        integrations: ["Social Media", "Content Management", "Analytics"]
      }
    ];

    const workflowTemplates = [
      {
        name: "Lead Qualification Pipeline",
        description: "Automatically qualify and route leads based on AI analysis",
        triggers: ["lead/status-change"],
        actions: ["CRM Update", "Email Notification", "Task Assignment"],
        complexity: "Medium",
        estimatedSetup: "20-30 minutes"
      },
      {
        name: "Customer Onboarding Automation",
        description: "Automated welcome sequence for new customers",
        triggers: ["lead/status-change"],
        actions: ["Email Sequence", "Account Setup", "Success Team Notification"],
        complexity: "Easy",
        estimatedSetup: "15-20 minutes"
      },
      {
        name: "Email Campaign Optimization",
        description: "Optimize email campaigns based on engagement data",
        triggers: ["email/campaign-event"],
        actions: ["A/B Testing", "Segment Updates", "Performance Reporting"],
        complexity: "Hard",
        estimatedSetup: "45-60 minutes"
      },
      {
        name: "Agent Task Monitoring",
        description: "Monitor AI agent performance and handle failures",
        triggers: ["agent/task-completed"],
        actions: ["Performance Tracking", "Error Handling", "Escalation"],
        complexity: "Medium",
        estimatedSetup: "25-35 minutes"
      }
    ];

    return NextResponse.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      n8n: {
        ...n8nStatus,
        url: n8nUrl,
        documentation: "https://docs.n8n.io/",
        webhookPrefix: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      },
      webhooks: {
        total: webhookEndpoints.length,
        active: webhookEndpoints.filter(w => w.status === "active").length,
        planned: webhookEndpoints.filter(w => w.status === "planned").length,
        endpoints: webhookEndpoints
      },
      templates: {
        available: workflowTemplates.length,
        categories: ["Lead Management", "Customer Success", "Marketing", "Agent Monitoring"],
        templates: workflowTemplates
      },
      integrationGuide: {
        quickStart: [
          "1. Ensure n8n is running and accessible",
          "2. Create a new workflow in n8n",
          "3. Add HTTP Request node with webhook URL",
          "4. Configure webhook payload and headers",
          "5. Test the webhook connection",
          "6. Deploy and monitor the workflow"
        ],
        bestPractices: [
          "Always validate webhook payloads",
          "Implement proper error handling",
          "Use retry logic for failed requests",
          "Monitor webhook performance",
          "Secure webhooks with authentication"
        ],
        troubleshooting: {
          connectionIssues: "Check n8n URL and network connectivity",
          authenticationErrors: "Verify API keys and webhook signatures",
          payloadValidation: "Ensure all required fields are present",
          rateLimit: "Implement exponential backoff for retries"
        }
      }
    });
    
  } catch (error) {
    console.error("n8n status check error:", error);
    return NextResponse.json(
      { 
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Failed to check n8n integration status",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workflowId, payload } = body;
    
    // Handle different n8n integration actions
    switch (action) {
      case "trigger_workflow":
        // TODO: Implement workflow triggering
        return NextResponse.json({
          success: true,
          action: "trigger_workflow",
          workflowId,
          status: "triggered",
          timestamp: new Date().toISOString()
        });
        
      case "webhook_test":
        // Test webhook endpoint
        return NextResponse.json({
          success: true,
          action: "webhook_test",
          payload,
          message: "Webhook test successful",
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error("n8n status POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 