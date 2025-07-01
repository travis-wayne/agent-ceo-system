// AI Agent CEO Platform Services
export { AIAgentService } from './ai-agent-service';
export { StrategicIntelligenceService } from './strategic-intelligence-service';
export { EmailAutomationService } from './email-automation-service';
export { WorkflowIntegrationService } from './workflow-integration-service';

// Existing services
export { BusinessService } from './business-service';
export { ContactService } from './contact-service';
export { LeadService } from './lead-service';

// Type exports for AI Agent CEO
export type {
  CreateAgentData,
  CreateTaskData,
  TaskExecutionResult
} from './ai-agent-service';

export type {
  CreateInsightData,
  AnalysisRequest,
  MarketAnalysisResult
} from './strategic-intelligence-service';

export type {
  CreateCampaignData,
  CampaignMetrics
} from './email-automation-service';

export type {
  CreateWorkflowExecutionData,
  WebhookLogData,
  N8nWorkflowTemplate
} from './workflow-integration-service';
