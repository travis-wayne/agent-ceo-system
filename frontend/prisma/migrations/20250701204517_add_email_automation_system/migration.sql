-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'WELCOME_SERIES', 'LEAD_NURTURING', 'RE_ENGAGEMENT', 'PRODUCT_ANNOUNCEMENT', 'EVENT_INVITATION', 'DRIP_CAMPAIGN', 'BEHAVIORAL_TRIGGER');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'PAUSED', 'CANCELLED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CampaignPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SchedulingType" AS ENUM ('IMMEDIATE', 'SCHEDULED', 'RECURRING', 'TRIGGERED', 'OPTIMAL_TIME');

-- CreateEnum
CREATE TYPE "DeliverySpeed" AS ENUM ('SLOW', 'NORMAL', 'FAST', 'BURST');

-- CreateEnum
CREATE TYPE "SendingMethod" AS ENUM ('STANDARD', 'DEDICATED_IP', 'SHARED_POOL', 'CUSTOM_SMTP');

-- CreateEnum
CREATE TYPE "AutomationTemplateType" AS ENUM ('NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL', 'WELCOME', 'ABANDONED_CART', 'PRODUCT_UPDATE', 'EVENT_INVITATION', 'SURVEY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('MARKETING', 'SALES', 'SUPPORT', 'PRODUCT', 'ANNOUNCEMENT', 'SEASONAL', 'LIFECYCLE', 'BEHAVIORAL');

-- CreateEnum
CREATE TYPE "AutomationTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT');

-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('MARKETING', 'TRANSACTIONAL', 'INTERNAL', 'IMPORT', 'SEGMENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ListSource" AS ENUM ('MANUAL_IMPORT', 'API_IMPORT', 'WEB_FORM', 'INTEGRATION', 'SEGMENT', 'PURCHASE', 'EVENT', 'REFERRAL');

-- CreateEnum
CREATE TYPE "ListStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED', 'CLEANING');

-- CreateEnum
CREATE TYPE "EmailContactSource" AS ENUM ('MANUAL_ENTRY', 'IMPORT', 'WEB_FORM', 'API', 'INTEGRATION', 'REFERRAL', 'PURCHASE', 'EVENT_SIGNUP', 'NEWSLETTER_SIGNUP');

-- CreateEnum
CREATE TYPE "EmailContactStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BOUNCED', 'UNSUBSCRIBED', 'BLOCKED', 'PENDING');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED', 'PENDING', 'BOUNCED', 'SUPPRESSED');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REMOVED', 'PENDING');

-- CreateEnum
CREATE TYPE "SegmentType" AS ENUM ('STATIC', 'DYNAMIC', 'BEHAVIORAL', 'DEMOGRAPHIC', 'ENGAGEMENT', 'PREDICTIVE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SegmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BUILDING', 'ERROR');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BounceType" AS ENUM ('SOFT', 'HARD', 'SUPPRESSED', 'TECHNICAL', 'POLICY');

-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'UNSUBSCRIBED', 'SPAM_REPORT', 'FORWARD', 'REPLY');

-- CreateEnum
CREATE TYPE "ABTestType" AS ENUM ('SUBJECT_LINE', 'FROM_NAME', 'CONTENT', 'SEND_TIME', 'FREQUENCY', 'TEMPLATE', 'CTA', 'PERSONALIZATION');

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CampaignType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" "CampaignPriority" NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "fromName" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "replyTo" TEXT,
    "templateId" TEXT,
    "htmlContent" TEXT,
    "textContent" TEXT,
    "customContent" JSONB,
    "personalizationRules" JSONB,
    "dynamicContentRules" JSONB,
    "conditionalRules" JSONB,
    "targetLists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "segmentationRules" JSONB,
    "excludeLists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "suppressionLists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "schedulingType" "SchedulingType" NOT NULL DEFAULT 'IMMEDIATE',
    "scheduledTime" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "deliverySpeed" "DeliverySpeed" NOT NULL DEFAULT 'NORMAL',
    "sendingMethod" "SendingMethod" NOT NULL DEFAULT 'STANDARD',
    "isAbTest" BOOLEAN NOT NULL DEFAULT false,
    "abTestConfig" JSONB,
    "parentCampaignId" TEXT,
    "trackingConfig" JSONB,
    "performanceMetrics" JSONB,
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "totalDelivered" INTEGER NOT NULL DEFAULT 0,
    "totalOpened" INTEGER NOT NULL DEFAULT 0,
    "totalClicked" INTEGER NOT NULL DEFAULT 0,
    "totalBounced" INTEGER NOT NULL DEFAULT 0,
    "totalUnsubscribed" INTEGER NOT NULL DEFAULT 0,
    "totalSpam" INTEGER NOT NULL DEFAULT 0,
    "deliveryRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unsubscribeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spamRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_automation_templates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "AutomationTemplateType" NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "status" "AutomationTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "htmlContent" TEXT NOT NULL,
    "textContent" TEXT,
    "cssStyles" TEXT,
    "variables" JSONB,
    "blocks" JSONB,
    "assets" JSONB,
    "isResponsive" BOOLEAN NOT NULL DEFAULT true,
    "emailClientSupport" JSONB,
    "optimizationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "parentTemplateId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "averageOpenRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageClickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_automation_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ListType" NOT NULL,
    "source" "ListSource" NOT NULL,
    "status" "ListStatus" NOT NULL DEFAULT 'ACTIVE',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customFields" JSONB,
    "complianceSettings" JSONB,
    "accessSettings" JSONB,
    "contactCount" INTEGER NOT NULL DEFAULT 0,
    "activeContactCount" INTEGER NOT NULL DEFAULT 0,
    "subscribedCount" INTEGER NOT NULL DEFAULT 0,
    "unsubscribedCount" INTEGER NOT NULL DEFAULT 0,
    "bouncedCount" INTEGER NOT NULL DEFAULT 0,
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCleanedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "source" "EmailContactSource" NOT NULL,
    "status" "EmailContactStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'SUBSCRIBED',
    "customFields" JSONB,
    "emailPreferences" JSONB,
    "communicationFreq" TEXT,
    "preferredLanguage" TEXT,
    "timezone" TEXT,
    "totalOpens" INTEGER NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "lastOpenedAt" TIMESTAMP(3),
    "lastClickedAt" TIMESTAMP(3),
    "lastEmailSentAt" TIMESTAMP(3),
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "predictiveScores" JSONB,
    "behavioralSegments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "doubleOptIn" BOOLEAN NOT NULL DEFAULT false,
    "optInDate" TIMESTAMP(3),
    "optOutDate" TIMESTAMP(3),
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_list_members" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'SUBSCRIBED',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT,
    "source" TEXT,
    "customFields" JSONB,
    "listEngagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "contact_list_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_segments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "SegmentType" NOT NULL,
    "status" "SegmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "criteria" JSONB NOT NULL,
    "sourceListIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDynamic" BOOLEAN NOT NULL DEFAULT true,
    "refreshFrequency" TEXT,
    "mlEnhanced" BOOLEAN NOT NULL DEFAULT false,
    "mlConfig" JSONB,
    "contactCount" INTEGER NOT NULL DEFAULT 0,
    "lastRefreshedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_segment_members" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "clusterInfo" JSONB,
    "scores" JSONB,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_segment_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_deliveries" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "messageId" TEXT,
    "status" "DeliveryStatus" NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT,
    "textContent" TEXT,
    "personalizedContent" JSONB,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "firstClickAt" TIMESTAMP(3),
    "bounceType" "BounceType",
    "bounceReason" TEXT,
    "unsubscribedAt" TIMESTAMP(3),
    "spamAt" TIMESTAMP(3),
    "opens" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "trackingData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "eventType" "EmailEventType" NOT NULL,
    "eventData" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "location" JSONB,
    "linkUrl" TEXT,
    "linkText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_test_results" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "testType" "ABTestType" NOT NULL,
    "variants" JSONB NOT NULL,
    "variantResults" JSONB NOT NULL,
    "winningVariant" TEXT,
    "confidenceLevel" DOUBLE PRECISION,
    "statisticalSignificance" BOOLEAN NOT NULL DEFAULT false,
    "testStartedAt" TIMESTAMP(3) NOT NULL,
    "testEndedAt" TIMESTAMP(3),
    "sampleSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ab_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_analytics" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hour" INTEGER,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "spam" INTEGER NOT NULL DEFAULT 0,
    "deliveryRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unsubscribeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spamRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_analytics" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "campaignsUsed" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "avgOpenRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgClickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgBounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_analytics" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "newContacts" INTEGER NOT NULL DEFAULT 0,
    "removedContacts" INTEGER NOT NULL DEFAULT 0,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "avgEngagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activeContacts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment_analytics" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "contactCount" INTEGER NOT NULL DEFAULT 0,
    "growthRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgEngagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segment_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactListToContactSegment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactListToContactSegment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_contacts_email_workspaceId_key" ON "email_contacts"("email", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_list_members_contactId_listId_key" ON "contact_list_members"("contactId", "listId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_segment_members_contactId_segmentId_key" ON "contact_segment_members"("contactId", "segmentId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_analytics_campaignId_date_hour_key" ON "campaign_analytics"("campaignId", "date", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "template_analytics_templateId_date_key" ON "template_analytics"("templateId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "list_analytics_listId_date_key" ON "list_analytics"("listId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "segment_analytics_segmentId_date_key" ON "segment_analytics"("segmentId", "date");

-- CreateIndex
CREATE INDEX "_ContactListToContactSegment_B_index" ON "_ContactListToContactSegment"("B");

-- AddForeignKey
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "email_automation_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_automation_templates" ADD CONSTRAINT "email_automation_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_automation_templates" ADD CONSTRAINT "email_automation_templates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_lists" ADD CONSTRAINT "contact_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_lists" ADD CONSTRAINT "contact_lists_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_contacts" ADD CONSTRAINT "email_contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_contacts" ADD CONSTRAINT "email_contacts_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_list_members" ADD CONSTRAINT "contact_list_members_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "email_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_list_members" ADD CONSTRAINT "contact_list_members_listId_fkey" FOREIGN KEY ("listId") REFERENCES "contact_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_segments" ADD CONSTRAINT "contact_segments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_segments" ADD CONSTRAINT "contact_segments_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_segment_members" ADD CONSTRAINT "contact_segment_members_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "email_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_segment_members" ADD CONSTRAINT "contact_segment_members_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "contact_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "email_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "email_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "email_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_analytics" ADD CONSTRAINT "campaign_analytics_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_analytics" ADD CONSTRAINT "template_analytics_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "email_automation_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_analytics" ADD CONSTRAINT "list_analytics_listId_fkey" FOREIGN KEY ("listId") REFERENCES "contact_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_analytics" ADD CONSTRAINT "segment_analytics_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "contact_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactListToContactSegment" ADD CONSTRAINT "_ContactListToContactSegment_A_fkey" FOREIGN KEY ("A") REFERENCES "contact_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactListToContactSegment" ADD CONSTRAINT "_ContactListToContactSegment_B_fkey" FOREIGN KEY ("B") REFERENCES "contact_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
