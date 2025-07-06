"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export interface AgentPerformance {
  successRate: number;
  efficiency: number;
  tasksCompleted: number;
  avgResponseTime: number;
  businessImpact: number;
  costPerHour: number;
  revenueGenerated: number;
  utilizationRate: number;
  qualityScore: number;
  clientSatisfaction: number;
}

export interface AgentTrend {
  value: number;
  direction: 'up' | 'down' | 'stable';
}

export interface AgentTask {
  name: string;
  completion: number;
  impact: number;
  duration: number;
  timestamp?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  avatar: string;
  status: 'active' | 'inactive' | 'maintenance';
  description: string;
  capabilities: string[];
  specialties: string[];
  model: string;
  maxConcurrentTasks: number;
  performance: AgentPerformance;
  trends: {
    successRate: AgentTrend;
    efficiency: AgentTrend;
    businessImpact: AgentTrend;
    responseTime: AgentTrend;
  };
  recentTasks: AgentTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  agentId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    taskId?: string;
    confidence?: number;
    sources?: string[];
  };
}

export interface AgentChat {
  id: string;
  agentId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface AgentContextType {
  // Data
  agents: Agent[];
  selectedAgent: Agent | null;
  agentChats: AgentChat[];
  isLoading: boolean;
  
  // Actions
  setSelectedAgent: (agent: Agent | null) => void;
  refreshAgents: () => Promise<void>;
  updateAgent: (agentId: string, updates: Partial<Agent>) => Promise<boolean>;
  deleteAgent: (agentId: string) => Promise<boolean>;
  getAgentById: (id: string) => Agent | undefined;
  getAgentAnalytics: (agentId: string) => AgentPerformance | undefined;
  getAgentChats: (agentId: string) => AgentChat[];
  createChat: (agentId: string, title?: string) => Promise<AgentChat>;
  sendMessage: (chatId: string, content: string) => Promise<ChatMessage>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Mock data - in real app this would come from API
const mockAgents: Agent[] = [
  {
    id: "ceo_agent",
    name: "CEO Agent",
    type: "Strategic Intelligence",
    avatar: "🧠",
    status: "active",
    description: "Strategic planning, market analysis, and business intelligence",
    capabilities: [
      "Strategic Planning & Roadmapping",
      "Market Analysis & Competitive Intelligence", 
      "Business Model Innovation",
      "Investment & Growth Strategy",
      "Board & Stakeholder Communications"
    ],
    specialties: ["Strategic Decision Making", "Market Research", "Business Development"],
    model: "GPT-4 Turbo",
    maxConcurrentTasks: 5,
    performance: {
      successRate: 94.8,
      efficiency: 96.0,
      tasksCompleted: 147,
      avgResponseTime: 4.2,
      businessImpact: 9.2,
      costPerHour: 285,
      revenueGenerated: 52340,
      utilizationRate: 87,
      qualityScore: 9.1,
      clientSatisfaction: 4.9
    },
    trends: {
      successRate: { value: 2.3, direction: "up" },
      efficiency: { value: 1.5, direction: "up" },
      businessImpact: { value: 0.8, direction: "up" },
      responseTime: { value: -0.5, direction: "down" }
    },
    recentTasks: [
      { name: "Market Analysis Q4 2024", completion: 100, impact: 9.5, duration: 3.2 },
      { name: "Competitive Intelligence", completion: 85, impact: 8.8, duration: 4.1 },
      { name: "Strategic Planning", completion: 100, impact: 9.8, duration: 2.8 }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-15T14:30:00Z"
  },
  {
    id: "sales_agent",
    name: "Sales Agent",
    type: "Revenue Generation",
    avatar: "💼",
    status: "active",
    description: "Lead generation, sales optimization, and revenue growth",
    capabilities: [
      "Lead Generation & Qualification",
      "Sales Process Optimization",
      "Customer Acquisition Strategy",
      "Revenue Forecasting & Analytics",
      "CRM Management & Automation"
    ],
    specialties: ["Pipeline Management", "Conversion Optimization", "Customer Outreach"],
    model: "GPT-4 Turbo",
    maxConcurrentTasks: 8,
    performance: {
      successRate: 96.2,
      efficiency: 94.0,
      tasksCompleted: 203,
      avgResponseTime: 2.8,
      businessImpact: 8.9,
      costPerHour: 195,
      revenueGenerated: 78450,
      utilizationRate: 92,
      qualityScore: 8.7,
      clientSatisfaction: 4.8
    },
    trends: {
      successRate: { value: 1.2, direction: "up" },
      efficiency: { value: 0.8, direction: "up" },
      businessImpact: { value: 0.3, direction: "up" },
      responseTime: { value: -0.3, direction: "down" }
    },
    recentTasks: [
      { name: "Lead Generation Campaign", completion: 100, impact: 9.1, duration: 2.1 },
      { name: "Sales Pipeline Optimization", completion: 100, impact: 8.9, duration: 2.5 },
      { name: "Customer Qualification", completion: 95, impact: 8.6, duration: 1.8 }
    ],
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-03-15T16:45:00Z"
  },
  {
    id: "marketing_agent",
    name: "Marketing Agent",
    type: "Brand & Content",
    avatar: "🎨",
    status: "active",
    description: "Content creation, brand strategy, and digital marketing",
    capabilities: [
      "Content Strategy & Creation",
      "Brand Positioning & Messaging",
      "Digital Marketing Campaigns",
      "Social Media Management",
      "Marketing Analytics & ROI"
    ],
    specialties: ["Brand Building", "Content Marketing", "Campaign Management"],
    model: "Claude-3 Opus",
    maxConcurrentTasks: 6,
    performance: {
      successRate: 91.7,
      efficiency: 89.0,
      tasksCompleted: 178,
      avgResponseTime: 3.5,
      businessImpact: 8.4,
      costPerHour: 165,
      revenueGenerated: 45230,
      utilizationRate: 85,
      qualityScore: 8.3,
      clientSatisfaction: 4.7
    },
    trends: {
      successRate: { value: 0.9, direction: "up" },
      efficiency: { value: 1.2, direction: "up" },
      businessImpact: { value: 0.5, direction: "up" },
      responseTime: { value: 0.2, direction: "up" }
    },
    recentTasks: [
      { name: "Content Calendar Q4", completion: 100, impact: 8.7, duration: 3.2 },
      { name: "Brand Strategy Update", completion: 90, impact: 8.1, duration: 4.1 },
      { name: "Social Media Campaign", completion: 100, impact: 8.5, duration: 2.9 }
    ],
    createdAt: "2024-02-01T11:00:00Z",
    updatedAt: "2024-03-15T12:20:00Z"
  }
];

const mockChats: AgentChat[] = [
  {
    id: "chat_1",
    agentId: "ceo_agent",
    title: "Strategic Planning Discussion",
    messages: [
      {
        id: "msg_1",
        agentId: "ceo_agent",
        role: "user",
        content: "Can you help me analyze our Q4 market position?",
        timestamp: "2024-03-15T10:00:00Z"
      },
      {
        id: "msg_2",
        agentId: "ceo_agent",
        role: "assistant",
        content: "I'll analyze your Q4 market position. Based on current data, here are the key insights...",
        timestamp: "2024-03-15T10:01:00Z",
        metadata: {
          confidence: 0.95,
          sources: ["Market Research Report", "Competitor Analysis"]
        }
      }
    ],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:01:00Z"
  },
  {
    id: "chat_2",
    agentId: "sales_agent",
    title: "Lead Generation Strategy",
    messages: [
      {
        id: "msg_3",
        agentId: "sales_agent",
        role: "user",
        content: "What's the best approach for generating B2B leads in our industry?",
        timestamp: "2024-03-15T14:00:00Z"
      },
      {
        id: "msg_4",
        agentId: "sales_agent",
        role: "assistant",
        content: "For B2B lead generation in your industry, I recommend a multi-channel approach...",
        timestamp: "2024-03-15T14:01:00Z",
        metadata: {
          confidence: 0.92,
          sources: ["Sales Analytics", "Industry Best Practices"]
        }
      }
    ],
    createdAt: "2024-03-15T14:00:00Z",
    updatedAt: "2024-03-15T14:01:00Z"
  }
];

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentChats, setAgentChats] = useState<AgentChat[]>(mockChats);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAgents = async () => {
    setIsLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch('/api/agents');
      // const data = await response.json();
      // setAgents(data.agents);
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAgents(mockAgents);
    } catch (error) {
      toast.error('Failed to refresh agents');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAgent = async (agentId: string, updates: Partial<Agent>): Promise<boolean> => {
    try {
      // In real app, send to API
      // const response = await fetch(`/api/agents/${agentId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, ...updates, updatedAt: new Date().toISOString() }
          : agent
      ));
      
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Agent updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update agent');
      return false;
    }
  };

  const deleteAgent = async (agentId: string): Promise<boolean> => {
    try {
      // In real app, send to API
      // await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
      
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      setAgentChats(prev => prev.filter(chat => chat.agentId !== agentId));
      
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null);
      }
      
      toast.success('Agent deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete agent');
      return false;
    }
  };

  const getAgentById = (id: string): Agent | undefined => {
    return agents.find(agent => agent.id === id);
  };

  const getAgentAnalytics = (agentId: string): AgentPerformance | undefined => {
    const agent = getAgentById(agentId);
    return agent?.performance;
  };

  const getAgentChats = (agentId: string): AgentChat[] => {
    return agentChats.filter(chat => chat.agentId === agentId);
  };

  const createChat = async (agentId: string, title?: string): Promise<AgentChat> => {
    const agent = getAgentById(agentId);
    if (!agent) throw new Error('Agent not found');

    const newChat: AgentChat = {
      id: `chat_${Date.now()}`,
      agentId,
      title: title || `Chat with ${agent.name}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAgentChats(prev => [...prev, newChat]);
    return newChat;
  };

  const sendMessage = async (chatId: string, content: string): Promise<ChatMessage> => {
    const chat = agentChats.find(c => c.id === chatId);
    if (!chat) throw new Error('Chat not found');

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      agentId: chat.agentId,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message
    setAgentChats(prev => prev.map(c => 
      c.id === chatId 
        ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date().toISOString() }
        : c
    ));

    // Simulate agent response
    setTimeout(() => {
      const agent = getAgentById(chat.agentId);
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        agentId: chat.agentId,
        role: 'assistant',
        content: `As your ${agent?.name}, I understand you're asking about: "${content}". Let me provide you with a comprehensive response based on my expertise in ${agent?.specialties.join(', ')}.`,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.9,
          sources: agent?.capabilities.slice(0, 2) || []
        }
      };

      setAgentChats(prev => prev.map(c => 
        c.id === chatId 
          ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date().toISOString() }
          : c
      ));
    }, 1500);

    return userMessage;
  };

  const value: AgentContextType = {
    agents,
    selectedAgent,
    agentChats,
    isLoading,
    setSelectedAgent,
    refreshAgents,
    updateAgent,
    deleteAgent,
    getAgentById,
    getAgentAnalytics,
    getAgentChats,
    createChat,
    sendMessage
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
} 