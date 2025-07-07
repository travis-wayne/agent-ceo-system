"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  username: string;
  status: 'connected' | 'pending' | 'disconnected';
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  lastSync: string;
  profileUrl: string;
}

interface SocialPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: 'published' | 'scheduled' | 'draft';
  scheduledAt?: string;
  publishedAt?: string;
  engagement: number;
  reach: number;
  impressions: number;
}

interface SocialCampaign {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  status: 'active' | 'completed' | 'draft' | 'paused';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  impressions: number;
  engagement: number;
  conversions: number;
  posts: number;
}

interface SocialMediaContextType {
  accounts: SocialAccount[];
  posts: SocialPost[];
  campaigns: SocialCampaign[];
  selectedAccount: SocialAccount | null;
  selectedCampaign: SocialCampaign | null;
  setSelectedAccount: (account: SocialAccount | null) => void;
  setSelectedCampaign: (campaign: SocialCampaign | null) => void;
  updateAccount: (account: SocialAccount) => void;
  updatePost: (post: SocialPost) => void;
  updateCampaign: (campaign: SocialCampaign) => void;
  refreshData: () => void;
  isLoading: boolean;
}

const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

export function SocialMediaProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "acc_1",
      platform: "LinkedIn",
      accountName: "Agent CEO Official",
      username: "@agentceo",
      status: "connected",
      followers: 12500,
      following: 890,
      posts: 156,
      engagement: 4.8,
      lastSync: "2 minutes ago",
      profileUrl: "https://linkedin.com/company/agentceo"
    },
    {
      id: "acc_2",
      platform: "Twitter/X",
      accountName: "Agent CEO",
      username: "@agentceo_ai",
      status: "connected",
      followers: 8200,
      following: 1200,
      posts: 287,
      engagement: 3.2,
      lastSync: "5 minutes ago",
      profileUrl: "https://twitter.com/agentceo_ai"
    }
  ]);

  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: "post_1",
      title: "The Future of AI in Business Automation",
      content: "Exploring how AI is revolutionizing business processes...",
      platform: "LinkedIn",
      status: "published",
      publishedAt: "2024-01-15T09:00:00Z",
      engagement: 234,
      reach: 8900,
      impressions: 15600
    }
  ]);

  const [campaigns, setCampaigns] = useState<SocialCampaign[]>([
    {
      id: "campaign_1",
      name: "Product Launch - AI Agent Platform",
      description: "Comprehensive campaign to launch our new AI Agent Platform",
      platforms: ["LinkedIn", "Twitter/X", "Facebook"],
      status: "active",
      startDate: "2024-01-10T00:00:00Z",
      endDate: "2024-01-24T00:00:00Z",
      budget: 2500,
      spent: 1840,
      reach: 45200,
      impressions: 67800,
      engagement: 6.8,
      conversions: 127,
      posts: 8
    }
  ]);

  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<SocialCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateAccount = useCallback((account: SocialAccount) => {
    setAccounts(prev => prev.map(acc => acc.id === account.id ? account : acc));
  }, []);

  const updatePost = useCallback((post: SocialPost) => {
    setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  }, []);

  const updateCampaign = useCallback((campaign: SocialCampaign) => {
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  const value = {
    accounts,
    posts,
    campaigns,
    selectedAccount,
    selectedCampaign,
    setSelectedAccount,
    setSelectedCampaign,
    updateAccount,
    updatePost,
    updateCampaign,
    refreshData,
    isLoading
  };

  return (
    <SocialMediaContext.Provider value={value}>
      {children}
    </SocialMediaContext.Provider>
  );
}

export function useSocialMedia() {
  const context = useContext(SocialMediaContext);
  if (context === undefined) {
    throw new Error('useSocialMedia must be used within a SocialMediaProvider');
  }
  return context;
} 