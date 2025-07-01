import { prisma } from "@/lib/db";
import { EmailCampaign, CampaignEvent, CampaignType, CampaignStatus, EventType } from "@prisma/client";

export interface CreateCampaignData {
  name: string;
  description?: string;
  type: CampaignType;
  subject: string;
  content: string;
  htmlContent?: string;
  targetSegment?: Record<string, any>;
  scheduledFor?: Date;
  generatedBy?: string; // Agent ID
  workspaceId: string;
}

export interface CampaignMetrics {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  unsubscribeRate: number;
  bounceRate: number;
}

export class EmailAutomationService {
  // =============================================
  // CAMPAIGN MANAGEMENT
  // =============================================

  static async createCampaign(data: CreateCampaignData): Promise<EmailCampaign> {
    try {
      const campaign = await prisma.emailCampaign.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          subject: data.subject,
          content: data.content,
          htmlContent: data.htmlContent,
          targetSegment: data.targetSegment || {},
          scheduledFor: data.scheduledFor,
          generatedBy: data.generatedBy,
          workspaceId: data.workspaceId,
          status: data.scheduledFor ? CampaignStatus.scheduled : CampaignStatus.draft
        }
      });

      console.log(`Email campaign created: ${campaign.name}`);
      return campaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw new Error("Failed to create email campaign");
    }
  }

  static async getCampaignsByWorkspace(workspaceId: string): Promise<EmailCampaign[]> {
    return prisma.emailCampaign.findMany({
      where: { workspaceId },
      include: {
        events: {
          take: 10,
          orderBy: { timestamp: 'desc' }
        },
        agent: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateCampaignStatus(
    campaignId: string, 
    status: CampaignStatus,
    metrics?: Partial<{
      delivered: number;
      opened: number;
      clicked: number;
      unsubscribed: number;
      bounced: number;
      converted: number;
    }>
  ): Promise<EmailCampaign> {
    const updateData: any = { status };

    if (status === CampaignStatus.sending) {
      updateData.sentAt = new Date();
    }

    if (metrics) {
      Object.assign(updateData, metrics);
    }

    return prisma.emailCampaign.update({
      where: { id: campaignId },
      data: updateData
    });
  }

  // =============================================
  // EVENT TRACKING
  // =============================================

  static async trackCampaignEvent(data: {
    campaignId: string;
    eventType: EventType;
    recipientEmail: string;
    recipientId?: string;
    metadata?: Record<string, any>;
    businessId?: string;
    contactId?: string;
  }): Promise<CampaignEvent> {
    try {
      const event = await prisma.campaignEvent.create({
        data: {
          campaignId: data.campaignId,
          eventType: data.eventType,
          recipientEmail: data.recipientEmail,
          recipientId: data.recipientId,
          metadata: data.metadata || {},
          businessId: data.businessId,
          contactId: data.contactId
        }
      });

      // Update campaign metrics
      await this.updateCampaignMetrics(data.campaignId, data.eventType);

      return event;
    } catch (error) {
      console.error("Error tracking campaign event:", error);
      throw new Error("Failed to track campaign event");
    }
  }

  private static async updateCampaignMetrics(campaignId: string, eventType: EventType): Promise<void> {
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) return;

    const updateData: any = {};

    switch (eventType) {
      case EventType.delivered:
        updateData.delivered = campaign.delivered + 1;
        break;
      case EventType.opened:
        updateData.opened = campaign.opened + 1;
        break;
      case EventType.clicked:
        updateData.clicked = campaign.clicked + 1;
        break;
      case EventType.unsubscribed:
        updateData.unsubscribed = campaign.unsubscribed + 1;
        break;
      case EventType.bounced:
        updateData.bounced = campaign.bounced + 1;
        break;
      case EventType.converted:
        updateData.converted = campaign.converted + 1;
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: updateData
      });
    }
  }

  // =============================================
  // ANALYTICS
  // =============================================

  static async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const totalSent = campaign.recipientCount || 1; // Avoid division by zero

    return {
      deliveryRate: (campaign.delivered / totalSent) * 100,
      openRate: (campaign.opened / Math.max(campaign.delivered, 1)) * 100,
      clickRate: (campaign.clicked / Math.max(campaign.opened, 1)) * 100,
      conversionRate: (campaign.converted / Math.max(campaign.delivered, 1)) * 100,
      unsubscribeRate: (campaign.unsubscribed / Math.max(campaign.delivered, 1)) * 100,
      bounceRate: (campaign.bounced / totalSent) * 100
    };
  }

  static async getWorkspaceEmailStats(workspaceId: string): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalRecipients: number;
    avgOpenRate: number;
    avgClickRate: number;
    totalConversions: number;
  }> {
    const campaigns = await prisma.emailCampaign.findMany({
      where: { workspaceId }
    });

    const activeCampaigns = campaigns.filter(c => 
      c.status === CampaignStatus.sending || c.status === CampaignStatus.scheduled
    ).length;

    const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipientCount, 0);
    const totalDelivered = campaigns.reduce((sum, c) => sum + c.delivered, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.converted, 0);

    const avgOpenRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const avgClickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalRecipients,
      avgOpenRate: Number(avgOpenRate.toFixed(1)),
      avgClickRate: Number(avgClickRate.toFixed(1)),
      totalConversions
    };
  }
} 