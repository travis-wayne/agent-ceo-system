/*
  Warnings:

  - Added the required column `workspaceId` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "workspace_role" AS ENUM ('admin', 'manager', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "churn_risk_level" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "contact_method" AS ENUM ('email', 'phone', 'sms');

-- CreateEnum
CREATE TYPE "sms_status" AS ENUM ('pending', 'sent', 'delivered', 'failed');

-- CreateEnum
CREATE TYPE "message_direction" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "agent_type" AS ENUM ('ceo', 'sales', 'marketing', 'operations', 'analytics');

-- CreateEnum
CREATE TYPE "agent_status" AS ENUM ('active', 'busy', 'inactive', 'maintenance');

-- CreateEnum
CREATE TYPE "task_type" AS ENUM ('strategic_analysis', 'market_research', 'lead_qualification', 'email_campaign', 'content_creation', 'data_analysis', 'customer_outreach', 'social_media_post', 'report_generation', 'competitive_analysis', 'workflow_automation', 'revenue_generation', 'marketing_initiatives', 'operational_excellence', 'business_intelligence');

-- CreateEnum
CREATE TYPE "task_priority" AS ENUM ('low', 'medium', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('draft', 'pending', 'queued', 'in_progress', 'paused', 'completed', 'failed', 'cancelled', 'retrying');

-- CreateEnum
CREATE TYPE "execution_status" AS ENUM ('running', 'completed', 'failed', 'timeout', 'cancelled');

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "accountManager" TEXT,
ADD COLUMN     "churnRisk" "churn_risk_level" DEFAULT 'low',
ADD COLUMN     "contractRenewalDate" TIMESTAMP(3),
ADD COLUMN     "contractType" TEXT,
ADD COLUMN     "contractValue" DOUBLE PRECISION,
ADD COLUMN     "customerSegment" TEXT,
ADD COLUMN     "customerSince" TIMESTAMP(3),
ADD COLUMN     "lastReviewDate" TIMESTAMP(3),
ADD COLUMN     "npsScore" INTEGER,
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "preferredContactMethod" "contact_method",
ADD COLUMN     "smsOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "workspaceId" TEXT;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "estimatedTime" INTEGER,
ADD COLUMN     "workspaceId" TEXT;

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgNumber" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "planExpiry" TIMESTAMP(3),
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "company" TEXT,
    "workspaceId" TEXT,
    "workspaceRole" "workspace_role" NOT NULL DEFAULT 'member',
    "department" TEXT,
    "timezone" TEXT,
    "bio" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_template" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_syncs" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "htmlBody" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "toEmail" TEXT[],
    "ccEmail" TEXT[],
    "bccEmail" TEXT[],
    "attachments" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "folderPath" TEXT,
    "threadId" TEXT,
    "importance" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT,
    "contactId" TEXT,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "email_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "sms_status" NOT NULL,
    "direction" "message_direction" NOT NULL,
    "businessId" TEXT,
    "contactId" TEXT,

    CONSTRAINT "sms_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "agent_type" NOT NULL,
    "specialization" TEXT NOT NULL,
    "status" "agent_status" NOT NULL DEFAULT 'active',
    "maxConcurrentTasks" INTEGER NOT NULL DEFAULT 3,
    "model" TEXT NOT NULL,
    "avatar" TEXT,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "efficiency" DOUBLE PRECISION,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "task_type" NOT NULL,
    "priority" "task_priority" NOT NULL DEFAULT 'medium',
    "status" "task_status" NOT NULL DEFAULT 'pending',
    "input" JSONB,
    "output" JSONB,
    "context" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "businessImpact" DOUBLE PRECISION,
    "complexity" TEXT,
    "category" TEXT,
    "budgetAllocated" DOUBLE PRECISION,
    "budgetSpent" DOUBLE PRECISION,
    "resourcesUsed" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "lastError" TEXT,
    "agentId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "businessId" TEXT,
    "contactId" TEXT,
    "stakeholders" JSONB,
    "deliverables" JSONB,
    "milestones" JSONB,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_executions" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "status" "execution_status" NOT NULL,
    "inputData" JSONB,
    "outputData" JSONB,
    "errorMessage" TEXT,
    "stackTrace" TEXT,
    "tokensUsed" INTEGER,
    "cost" DOUBLE PRECISION,
    "apiCalls" INTEGER,
    "qualityScore" DOUBLE PRECISION,
    "clientSatisfaction" DOUBLE PRECISION,
    "taskId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "task_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_orgNumber_key" ON "workspaces"("orgNumber");

-- CreateIndex
CREATE INDEX "user_workspaceId_idx" ON "user"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_provider_userId_key" ON "email_provider"("userId");

-- CreateIndex
CREATE INDEX "email_syncs_userId_businessId_idx" ON "email_syncs"("userId", "businessId");

-- CreateIndex
CREATE INDEX "email_syncs_userId_sentAt_idx" ON "email_syncs"("userId", "sentAt");

-- CreateIndex
CREATE INDEX "email_syncs_threadId_idx" ON "email_syncs"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "email_syncs_userId_externalId_key" ON "email_syncs"("userId", "externalId");

-- CreateIndex
CREATE INDEX "agents_workspaceId_idx" ON "agents"("workspaceId");

-- CreateIndex
CREATE INDEX "agents_type_idx" ON "agents"("type");

-- CreateIndex
CREATE INDEX "agents_status_idx" ON "agents"("status");

-- CreateIndex
CREATE INDEX "agent_tasks_workspaceId_idx" ON "agent_tasks"("workspaceId");

-- CreateIndex
CREATE INDEX "agent_tasks_agentId_idx" ON "agent_tasks"("agentId");

-- CreateIndex
CREATE INDEX "agent_tasks_status_idx" ON "agent_tasks"("status");

-- CreateIndex
CREATE INDEX "agent_tasks_type_idx" ON "agent_tasks"("type");

-- CreateIndex
CREATE INDEX "agent_tasks_priority_idx" ON "agent_tasks"("priority");

-- CreateIndex
CREATE INDEX "agent_tasks_scheduledFor_idx" ON "agent_tasks"("scheduledFor");

-- CreateIndex
CREATE INDEX "task_executions_taskId_idx" ON "task_executions"("taskId");

-- CreateIndex
CREATE INDEX "task_executions_agentId_idx" ON "task_executions"("agentId");

-- CreateIndex
CREATE INDEX "task_executions_startedAt_idx" ON "task_executions"("startedAt");

-- CreateIndex
CREATE INDEX "businesses_workspaceId_idx" ON "businesses"("workspaceId");

-- CreateIndex
CREATE INDEX "job_applications_workspaceId_idx" ON "job_applications"("workspaceId");

-- CreateIndex
CREATE INDEX "tickets_workspaceId_idx" ON "tickets"("workspaceId");

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_provider" ADD CONSTRAINT "email_provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_syncs" ADD CONSTRAINT "email_syncs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_syncs" ADD CONSTRAINT "email_syncs_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_syncs" ADD CONSTRAINT "email_syncs_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_syncs" ADD CONSTRAINT "email_syncs_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "email_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_messages" ADD CONSTRAINT "sms_messages_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_messages" ADD CONSTRAINT "sms_messages_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_executions" ADD CONSTRAINT "task_executions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "agent_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_executions" ADD CONSTRAINT "task_executions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
