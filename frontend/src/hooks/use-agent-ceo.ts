// Agent CEO React Hooks
// /src/hooks/use-agent-ceo.ts

import { useState, useEffect, useCallback } from 'react';
import { agentCEOApi, Agent, Task, StrategicInsight, EmailCampaign, DataAnalysisResult } from '@/services/agent-ceo-api';

// Agent Management Hook
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await agentCEOApi.getAgents();
    
    if (response.success && response.data) {
      setAgents(response.data);
    } else {
      setError(response.error || 'Failed to fetch agents');
    }
    
    setLoading(false);
  }, []);

  const createAgent = useCallback(async (agentData: Partial<Agent>) => {
    const response = await agentCEOApi.createAgent(agentData);
    
    if (response.success) {
      await fetchAgents(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to create agent');
    }
  }, [fetchAgents]);

  const updateAgent = useCallback(async (agentId: string, updates: Partial<Agent>) => {
    const response = await agentCEOApi.updateAgent(agentId, updates);
    
    if (response.success) {
      await fetchAgents(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to update agent');
    }
  }, [fetchAgents]);

  const deleteAgent = useCallback(async (agentId: string) => {
    const response = await agentCEOApi.deleteAgent(agentId);
    
    if (response.success) {
      await fetchAgents(); // Refresh the list
    } else {
      throw new Error(response.error || 'Failed to delete agent');
    }
  }, [fetchAgents]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  };
}

// Task Management Hook
export function useTasks(agentId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await agentCEOApi.getTasks(agentId);
    
    if (response.success && response.data) {
      setTasks(response.data);
    } else {
      setError(response.error || 'Failed to fetch tasks');
    }
    
    setLoading(false);
  }, [agentId]);

  const createTask = useCallback(async (taskData: Partial<Task>) => {
    const response = await agentCEOApi.createTask(taskData);
    
    if (response.success) {
      await fetchTasks(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to create task');
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const response = await agentCEOApi.updateTask(taskId, updates);
    
    if (response.success) {
      await fetchTasks(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to update task');
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
  };
}

// Strategic Insights Hook
export function useStrategicInsights() {
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await agentCEOApi.getStrategicInsights();
    
    if (response.success && response.data) {
      setInsights(response.data);
    } else {
      setError(response.error || 'Failed to fetch insights');
    }
    
    setLoading(false);
  }, []);

  const generateBusinessAnalysis = useCallback(async (data: {
    business_context: string;
    industry: string;
    goals: string[];
  }) => {
    const response = await agentCEOApi.generateBusinessAnalysis(data);
    
    if (response.success) {
      await fetchInsights(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to generate business analysis');
    }
  }, [fetchInsights]);

  const generateCompetitiveAnalysis = useCallback(async (data: {
    competitors: string[];
    market_focus: string;
  }) => {
    const response = await agentCEOApi.generateCompetitiveAnalysis(data);
    
    if (response.success) {
      await fetchInsights(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to generate competitive analysis');
    }
  }, [fetchInsights]);

  const generateGrowthStrategy = useCallback(async (data: {
    current_state: string;
    target_goals: string[];
    timeframe: string;
  }) => {
    const response = await agentCEOApi.generateGrowthStrategy(data);
    
    if (response.success) {
      await fetchInsights(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to generate growth strategy');
    }
  }, [fetchInsights]);

  const getQuickInsights = useCallback(async (data: {
    query: string;
    context: string;
    urgency: 'low' | 'normal' | 'high' | 'critical';
  }) => {
    const response = await agentCEOApi.getQuickInsights(data);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to get quick insights');
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights,
    generateBusinessAnalysis,
    generateCompetitiveAnalysis,
    generateGrowthStrategy,
    getQuickInsights,
  };
}

// Email Campaigns Hook
export function useEmailCampaigns() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await agentCEOApi.getEmailCampaigns();
    
    if (response.success && response.data) {
      setCampaigns(response.data);
    } else {
      setError(response.error || 'Failed to fetch email campaigns');
    }
    
    setLoading(false);
  }, []);

  const createCampaign = useCallback(async (campaignData: {
    name: string;
    subject: string;
    content: string;
    recipients: string[];
    schedule?: string;
  }) => {
    const response = await agentCEOApi.createEmailCampaign(campaignData);
    
    if (response.success) {
      await fetchCampaigns(); // Refresh the list
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to create email campaign');
    }
  }, [fetchCampaigns]);

  const generateContent = useCallback(async (data: {
    purpose: string;
    audience: string;
    tone: string;
    key_points: string[];
    company_info: any;
  }) => {
    const response = await agentCEOApi.generateEmailContent(data);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to generate email content');
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    createCampaign,
    generateContent,
  };
}

// Data Analysis Hook
export function useDataAnalysis() {
  const [results, setResults] = useState<DataAnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFile = useCallback(async (
    file: File,
    analysisContext: {
      purpose: string;
      industry: string;
      focus_area: string;
      business_goals: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await agentCEOApi.uploadAndAnalyzeFile(file, analysisContext);
      
      if (response.success && response.data) {
        setResults(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to analyze file');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeCSV = useCallback(async (data: {
    csv_content: string;
    analysis_context: any;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await agentCEOApi.analyzeCSV(data);
      
      if (response.success && response.data) {
        setResults(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to analyze CSV');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCompetitiveAnalysis = useCallback(async (data: {
    competitor_data: any[];
    company_focus: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await agentCEOApi.generateCompetitiveAnalysisFromData(data);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate competitive analysis');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFinancialAnalysis = useCallback(async (data: {
    financial_data: any;
    time_period: string;
    context: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await agentCEOApi.generateFinancialAnalysis(data);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate financial analysis');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    analyzeFile,
    analyzeCSV,
    generateCompetitiveAnalysis,
    generateFinancialAnalysis,
  };
}

// Dashboard Hook
export function useDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await agentCEOApi.getDashboardStats();
    
    if (response.success && response.data) {
      setStats(response.data);
    } else {
      setError(response.error || 'Failed to fetch dashboard stats');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// Social Media Hook
export function useSocialMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContentSuggestions = useCallback(async (data: {
    industry: string;
    tone: string;
    platform?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await agentCEOApi.getSocialMediaContentSuggestions(data);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get content suggestions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const schedulePost = useCallback(async (data: {
    platform: string;
    content: string;
    schedule_time: string;
    media_urls?: string[];
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await agentCEOApi.schedulePost(data);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to schedule post');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getContentSuggestions,
    schedulePost,
  };
}

