-- CreateEnum
CREATE TYPE "company_size" AS ENUM ('startup', 'small_business', 'medium_enterprise', 'large_enterprise', 'multinational');

-- CreateEnum
CREATE TYPE "business_stage" AS ENUM ('ideation', 'startup', 'growth', 'maturity', 'transformation', 'decline');

-- CreateEnum
CREATE TYPE "analysis_type" AS ENUM ('swot_analysis', 'competitive_analysis', 'market_analysis', 'financial_analysis', 'strategic_planning', 'decision_support', 'risk_assessment', 'scenario_planning', 'business_model_analysis', 'value_chain_analysis');

-- CreateEnum
CREATE TYPE "analysis_status" AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "risk_level" AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');

-- CreateEnum
CREATE TYPE "urgency_level" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "implementation_difficulty" AS ENUM ('very_easy', 'easy', 'medium', 'hard', 'very_hard');

-- CreateEnum
CREATE TYPE "planning_status" AS ENUM ('draft', 'under_review', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold');

-- CreateEnum
CREATE TYPE "decision_status" AS ENUM ('pending', 'under_analysis', 'analysis_complete', 'decision_made', 'implemented', 'cancelled');

-- CreateTable
CREATE TABLE "business_contexts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "sector" TEXT,
    "companySize" "company_size" NOT NULL,
    "businessStage" "business_stage" NOT NULL,
    "foundedYear" INTEGER,
    "employeeCount" INTEGER,
    "annualRevenue" DOUBLE PRECISION,
    "marketCap" DOUBLE PRECISION,
    "geographicPresence" JSONB,
    "businessModel" JSONB NOT NULL,
    "valueProposition" JSONB NOT NULL,
    "competitiveAdvantages" JSONB NOT NULL,
    "currentObjectives" JSONB NOT NULL,
    "challenges" JSONB NOT NULL,
    "opportunities" JSONB NOT NULL,
    "marketConditions" JSONB NOT NULL,
    "competitiveLandscape" JSONB NOT NULL,
    "regulatoryEnvironment" JSONB NOT NULL,
    "financialProfile" JSONB NOT NULL,
    "performanceMetrics" JSONB NOT NULL,
    "budgetConstraints" JSONB NOT NULL,
    "completenessScore" DOUBLE PRECISION,
    "confidenceLevel" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSource" TEXT,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_records" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "analysisType" "analysis_type" NOT NULL,
    "requestData" JSONB NOT NULL,
    "businessContextId" TEXT,
    "resultData" JSONB NOT NULL,
    "executiveSummary" TEXT,
    "keyInsights" JSONB,
    "recommendations" JSONB,
    "actionItems" JSONB,
    "status" "analysis_status" NOT NULL DEFAULT 'pending',
    "confidenceScore" DOUBLE PRECISION,
    "complexityScore" DOUBLE PRECISION,
    "executionTimeSeconds" DOUBLE PRECISION,
    "modelUsed" TEXT,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "cost" DOUBLE PRECISION,
    "qualityScore" DOUBLE PRECISION,
    "relevanceScore" DOUBLE PRECISION,
    "actionabilityScore" DOUBLE PRECISION,
    "businessImpact" DOUBLE PRECISION,
    "riskLevel" "risk_level",
    "urgencyLevel" "urgency_level",
    "implementationDifficulty" "implementation_difficulty",
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "implementationStarted" BOOLEAN NOT NULL DEFAULT false,
    "implementationProgress" DOUBLE PRECISION,
    "implementationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "implementedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysis_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategic_plan_records" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "planningRequest" JSONB NOT NULL,
    "businessContextId" TEXT,
    "planningResult" JSONB NOT NULL,
    "executiveSummary" TEXT,
    "strategicObjectives" JSONB NOT NULL,
    "strategicOptions" JSONB NOT NULL,
    "selectedStrategy" JSONB NOT NULL,
    "implementationRoadmap" JSONB NOT NULL,
    "timeHorizonMonths" INTEGER NOT NULL,
    "complexityScore" DOUBLE PRECISION,
    "successProbability" DOUBLE PRECISION,
    "confidenceLevel" DOUBLE PRECISION,
    "status" "planning_status" NOT NULL DEFAULT 'draft',
    "budgetRequired" DOUBLE PRECISION,
    "resourceAllocation" JSONB,
    "keyMilestones" JSONB,
    "implementationStarted" BOOLEAN NOT NULL DEFAULT false,
    "implementationProgress" DOUBLE PRECISION,
    "milestonesCompleted" INTEGER DEFAULT 0,
    "totalMilestones" INTEGER,
    "currentPhase" TEXT,
    "expectedRoi" DOUBLE PRECISION,
    "actualRoi" DOUBLE PRECISION,
    "kpiTargets" JSONB,
    "kpiActuals" JSONB,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "lastReviewDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "implementationStartDate" TIMESTAMP(3),
    "targetCompletionDate" TIMESTAMP(3),
    "actualCompletionDate" TIMESTAMP(3),

    CONSTRAINT "strategic_plan_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_analysis_records" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "decisionScenario" TEXT,
    "decisionRequest" JSONB NOT NULL,
    "businessContextId" TEXT,
    "decisionResult" JSONB NOT NULL,
    "executiveSummary" TEXT,
    "decisionOptions" JSONB NOT NULL,
    "evaluationCriteria" JSONB NOT NULL,
    "riskAssessment" JSONB NOT NULL,
    "recommendedOption" JSONB,
    "recommendationStrength" DOUBLE PRECISION,
    "confidenceLevel" DOUBLE PRECISION,
    "overallRiskLevel" "risk_level",
    "numberOfOptions" INTEGER,
    "decisionComplexity" DOUBLE PRECISION,
    "stakeholdersImpacted" JSONB,
    "status" "decision_status" NOT NULL DEFAULT 'pending',
    "decisionMade" BOOLEAN NOT NULL DEFAULT false,
    "selectedOption" JSONB,
    "decisionRationale" TEXT,
    "implementationOutcome" JSONB,
    "decisionDeadline" TIMESTAMP(3),
    "decisionMadeAt" TIMESTAMP(3),
    "implementedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decision_analysis_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_contexts_workspaceId_idx" ON "business_contexts"("workspaceId");

-- CreateIndex
CREATE INDEX "business_contexts_industry_idx" ON "business_contexts"("industry");

-- CreateIndex
CREATE INDEX "business_contexts_companySize_idx" ON "business_contexts"("companySize");

-- CreateIndex
CREATE INDEX "analysis_records_workspaceId_idx" ON "analysis_records"("workspaceId");

-- CreateIndex
CREATE INDEX "analysis_records_userId_idx" ON "analysis_records"("userId");

-- CreateIndex
CREATE INDEX "analysis_records_analysisType_idx" ON "analysis_records"("analysisType");

-- CreateIndex
CREATE INDEX "analysis_records_status_idx" ON "analysis_records"("status");

-- CreateIndex
CREATE INDEX "analysis_records_createdAt_idx" ON "analysis_records"("createdAt");

-- CreateIndex
CREATE INDEX "strategic_plan_records_workspaceId_idx" ON "strategic_plan_records"("workspaceId");

-- CreateIndex
CREATE INDEX "strategic_plan_records_userId_idx" ON "strategic_plan_records"("userId");

-- CreateIndex
CREATE INDEX "strategic_plan_records_status_idx" ON "strategic_plan_records"("status");

-- CreateIndex
CREATE INDEX "strategic_plan_records_createdAt_idx" ON "strategic_plan_records"("createdAt");

-- CreateIndex
CREATE INDEX "decision_analysis_records_workspaceId_idx" ON "decision_analysis_records"("workspaceId");

-- CreateIndex
CREATE INDEX "decision_analysis_records_userId_idx" ON "decision_analysis_records"("userId");

-- CreateIndex
CREATE INDEX "decision_analysis_records_status_idx" ON "decision_analysis_records"("status");

-- CreateIndex
CREATE INDEX "decision_analysis_records_decisionDeadline_idx" ON "decision_analysis_records"("decisionDeadline");

-- CreateIndex
CREATE INDEX "decision_analysis_records_createdAt_idx" ON "decision_analysis_records"("createdAt");

-- AddForeignKey
ALTER TABLE "business_contexts" ADD CONSTRAINT "business_contexts_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_records" ADD CONSTRAINT "analysis_records_businessContextId_fkey" FOREIGN KEY ("businessContextId") REFERENCES "business_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_records" ADD CONSTRAINT "analysis_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_records" ADD CONSTRAINT "analysis_records_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategic_plan_records" ADD CONSTRAINT "strategic_plan_records_businessContextId_fkey" FOREIGN KEY ("businessContextId") REFERENCES "business_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategic_plan_records" ADD CONSTRAINT "strategic_plan_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategic_plan_records" ADD CONSTRAINT "strategic_plan_records_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_analysis_records" ADD CONSTRAINT "decision_analysis_records_businessContextId_fkey" FOREIGN KEY ("businessContextId") REFERENCES "business_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_analysis_records" ADD CONSTRAINT "decision_analysis_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_analysis_records" ADD CONSTRAINT "decision_analysis_records_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
