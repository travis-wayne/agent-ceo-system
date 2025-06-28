// Agent CEO Backend API Client
// /src/services/agent-ceo-api.ts

export interface AgentCEOConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'ceo' | 'sales' | 'marketing' | 'operations' | 'analytics';
  status: 'active' | 'inactive' | 'busy' | 'error';
  description: string;
  capabilities: string[];
  created_at: string;
  last_active: string;
  performance_metrics: {
    tasks_completed: number;
    success_rate: number;
    avg_response_time: number;
  };
}

export interface Task {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  completed_at?: string;
  result?: any;
}

export interface StrategicInsight {
  id: string;
  type: 'business_analysis' | 'competitive_analysis' | 'growth_strategy' | 'crisis_management';
  title: string;
  summary: string;
  insights: string;
  recommendations: string[];
  confidence_score: number;
  generated_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  recipients: number;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  scheduled_at?: string;
}

export interface DataAnalysisResult {
  id: string;
  file_name: string;
  file_type: string;
  analysis_type: string;
  insights: string;
  statistics: any;
  generated_at: string;
}

export class AgentCEOApiClient {
  private config: AgentCEOConfig;

  constructor(config: AgentCEOConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      defaultHeaders['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Agent Management
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return this.request<Agent[]>('/api/agents');
  }

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/api/agents/${agentId}`);
  }

  async createAgent(agentData: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/api/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAgent(agentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  // Task Management
  async getTasks(agentId?: string): Promise<ApiResponse<Task[]>> {
    const endpoint = agentId ? `/api/tasks?agent_id=${agentId}` : '/api/tasks';
    return this.request<Task[]>(endpoint);
  }

  async createTask(taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Strategic AI
  async getStrategicInsights(): Promise<ApiResponse<StrategicInsight[]>> {
    return this.request<StrategicInsight[]>('/api/strategic/insights');
  }

  async generateBusinessAnalysis(data: {
    business_context: string;
    industry: string;
    goals: string[];
  }): Promise<ApiResponse<StrategicInsight>> {
    return this.request<StrategicInsight>('/api/strategic/business-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateCompetitiveAnalysis(data: {
    competitors: string[];
    market_focus: string;
  }): Promise<ApiResponse<StrategicInsight>> {
    return this.request<StrategicInsight>('/api/strategic/competitive-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateGrowthStrategy(data: {
    current_state: string;
    target_goals: string[];
    timeframe: string;
  }): Promise<ApiResponse<StrategicInsight>> {
    return this.request<StrategicInsight>('/api/strategic/growth-strategy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuickInsights(data: {
    query: string;
    context: string;
    urgency: 'low' | 'normal' | 'high' | 'critical';
  }): Promise<ApiResponse<{ insights: string }>> {
    return this.request<{ insights: string }>('/api/strategic/quick-insights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Email Automation
  async getEmailCampaigns(): Promise<ApiResponse<EmailCampaign[]>> {
    return this.request<EmailCampaign[]>('/api/email/campaigns');
  }

  async createEmailCampaign(campaignData: {
    name: string;
    subject: string;
    content: string;
    recipients: string[];
    schedule?: string;
  }): Promise<ApiResponse<EmailCampaign>> {
    return this.request<EmailCampaign>('/api/email/campaign', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async generateEmailContent(data: {
    purpose: string;
    audience: string;
    tone: string;
    key_points: string[];
    company_info: any;
  }): Promise<ApiResponse<{ generated_content: string }>> {
    return this.request<{ generated_content: string }>('/api/email/generate-content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmailTemplates(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/email/templates');
  }

  async getEmailReports(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return this.request<any>(`/api/email/reports/activity?${params.toString()}`);
  }

  // Data Analysis
  async uploadAndAnalyzeFile(
    file: File,
    analysisContext: {
      purpose: string;
      industry: string;
      focus_area: string;
      business_goals: string;
    }
  ): Promise<ApiResponse<DataAnalysisResult>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', analysisContext.purpose);
    formData.append('industry', analysisContext.industry);
    formData.append('focus_area', analysisContext.focus_area);
    formData.append('business_goals', analysisContext.business_goals);

    return this.request<DataAnalysisResult>('/api/data-analysis/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async analyzeCSV(data: {
    csv_content: string;
    analysis_context: any;
  }): Promise<ApiResponse<DataAnalysisResult>> {
    return this.request<DataAnalysisResult>('/api/data-analysis/csv', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateCompetitiveAnalysisFromData(data: {
    competitor_data: any[];
    company_focus: string;
  }): Promise<ApiResponse<{ analysis: string }>> {
    return this.request<{ analysis: string }>('/api/data-analysis/competitive', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateFinancialAnalysis(data: {
    financial_data: any;
    time_period: string;
    context: string;
  }): Promise<ApiResponse<{ analysis: string }>> {
    return this.request<{ analysis: string }>('/api/data-analysis/financial', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // n8n Workflow Integration
  async getWorkflowHealth(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/api/n8n/health');
  }

  async triggerWorkflow(workflowId: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/n8n/trigger/${workflowId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSocialMediaContentSuggestions(data: {
    industry: string;
    tone: string;
    platform?: string;
  }): Promise<ApiResponse<{ suggestions: string[] }>> {
    return this.request<{ suggestions: string[] }>('/api/n8n/social-media/content-suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async schedulePost(data: {
    platform: string;
    content: string;
    schedule_time: string;
    media_urls?: string[];
  }): Promise<ApiResponse<{ scheduled: boolean }>> {
    return this.request<{ scheduled: boolean }>('/api/n8n/social-media/schedule-post', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard and Analytics
  async getDashboardStats(): Promise<ApiResponse<{
    total_agents: number;
    active_tasks: number;
    completed_tasks: number;
    success_rate: number;
    recent_insights: number;
    email_campaigns: number;
  }>> {
    return this.request('/api/dashboard/stats');
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; services: any }>> {
    return this.request<{ status: string; services: any }>('/api/health');
  }
}

// Default instance
export const agentCEOApi = new AgentCEOApiClient({
  baseUrl: process.env.NEXT_PUBLIC_AGENT_CEO_API_URL || 'http://localhost:5000',
  apiKey: process.env.NEXT_PUBLIC_AGENT_CEO_API_KEY,
});

// Hook for using the API client
export function useAgentCEOApi() {
  return agentCEOApi;
}

