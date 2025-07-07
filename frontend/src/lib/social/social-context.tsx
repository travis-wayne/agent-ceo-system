"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Types and Interfaces
export interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  username: string;
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  lastSync: string;
  profileUrl: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor: string | null;
  publishedAt: string | null;
  type: 'article' | 'tip' | 'announcement' | 'case-study' | 'image' | 'video';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  agent: string;
  tags: string[];
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialCampaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platforms: string[];
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  posts: string[]; // post IDs
  goals: {
    type: 'reach' | 'engagement' | 'conversions' | 'brand_awareness';
    target: number;
    current: number;
  }[];
  performance: {
    reach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SocialAnalytics {
  period: string;
  totalReach: number;
  totalEngagement: number;
  totalFollowers: number;
  totalPosts: number;
  engagementRate: number;
  followerGrowth: number;
  topPosts: SocialPost[];
  platformBreakdown: {
    platform: string;
    followers: number;
    engagement: number;
    posts: number;
  }[];
  trends: {
    reach: { value: number; direction: 'up' | 'down' | 'stable' };
    engagement: { value: number; direction: 'up' | 'down' | 'stable' };
    followers: { value: number; direction: 'up' | 'down' | 'stable' };
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'article' | 'tip' | 'announcement' | 'case-study';
  template: string;
  platforms: string[];
  tags: string[];
  agent: string;
  isActive: boolean;
  createdAt: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  type: 'post' | 'campaign' | 'reminder';
  date: string;
  time: string;
  platforms: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  relatedId: string; // post or campaign ID
}

// Context Type
interface SocialContextType {
  // Data
  accounts: SocialAccount[];
  posts: SocialPost[];
  campaigns: SocialCampaign[];
  analytics: SocialAnalytics | null;
  templates: ContentTemplate[];
  calendar: ScheduledEvent[];
  selectedAccount: SocialAccount | null;
  selectedPost: SocialPost | null;
  selectedCampaign: SocialCampaign | null;
  isLoading: boolean;

  // Actions
  setSelectedAccount: (account: SocialAccount | null) => void;
  setSelectedPost: (post: SocialPost | null) => void;
  setSelectedCampaign: (campaign: SocialCampaign | null) => void;
  
  // Account Management
  refreshAccounts: () => Promise<void>;
  connectAccount: (platform: string, credentials: any) => Promise<boolean>;
  disconnectAccount: (accountId: string) => Promise<boolean>;
  syncAccount: (accountId: string) => Promise<boolean>;
  
  // Post Management
  refreshPosts: () => Promise<void>;
  createPost: (postData: Partial<SocialPost>) => Promise<SocialPost | null>;
  updatePost: (postId: string, updates: Partial<SocialPost>) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  schedulePost: (postId: string, scheduledFor: string) => Promise<boolean>;
  publishPost: (postId: string) => Promise<boolean>;
  
  // Campaign Management
  refreshCampaigns: () => Promise<void>;
  createCampaign: (campaignData: Partial<SocialCampaign>) => Promise<SocialCampaign | null>;
  updateCampaign: (campaignId: string, updates: Partial<SocialCampaign>) => Promise<boolean>;
  deleteCampaign: (campaignId: string) => Promise<boolean>;
  
  // Analytics
  refreshAnalytics: (period?: string) => Promise<void>;
  getAccountAnalytics: (accountId: string) => Promise<any>;
  getPostAnalytics: (postId: string) => Promise<any>;
  getCampaignAnalytics: (campaignId: string) => Promise<any>;
  
  // Content Generation
  generateContent: (type: string, platform: string, topic?: string) => Promise<string>;
  getContentSuggestions: (platform: string) => Promise<string[]>;
  
  // Calendar
  refreshCalendar: () => Promise<void>;
  getCalendarEvents: (startDate: string, endDate: string) => ScheduledEvent[];
}

// Mock Data
const mockAccounts: SocialAccount[] = [
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
    profileUrl: "https://linkedin.com/company/agentceo",
    avatar: "🔗",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
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
    profileUrl: "https://twitter.com/agentceo_ai",
    avatar: "🐦",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-15T09:55:00Z"
  },
  {
    id: "acc_3",
    platform: "Facebook",
    accountName: "Agent CEO Business",
    username: "agentceobusiness",
    status: "pending",
    followers: 0,
    following: 0,
    posts: 0,
    engagement: 0,
    lastSync: "Never",
    profileUrl: "",
    avatar: "📘",
    isActive: false,
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z"
  },
  {
    id: "acc_4",
    platform: "Instagram",
    accountName: "Agent CEO",
    username: "@agentceo_official",
    status: "disconnected",
    followers: 0,
    following: 0,
    posts: 0,
    engagement: 0,
    lastSync: "Never",
    profileUrl: "",
    avatar: "📷",
    isActive: false,
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z"
  },
  {
    id: "acc_5",
    platform: "YouTube",
    accountName: "Agent CEO Channel",
    username: "@agentceo",
    status: "connected",
    followers: 3400,
    following: 45,
    posts: 23,
    engagement: 2.1,
    lastSync: "1 hour ago",
    profileUrl: "https://youtube.com/@agentceo",
    avatar: "📺",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-03-15T09:00:00Z"
  }
];

const mockPosts: SocialPost[] = [
  {
    id: "post_1",
    title: "The Future of AI in Business Automation",
    content: "Exploring how AI agents are revolutionizing business processes and decision-making. From customer service to strategic planning, AI is becoming an indispensable tool for modern enterprises. #AI #BusinessAutomation #Innovation",
    platforms: ["LinkedIn", "Twitter/X"],
    status: "scheduled",
    scheduledFor: "2024-03-16T09:00:00Z",
    publishedAt: null,
    type: "article",
    engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
    agent: "Content Marketing Agent",
    tags: ["AI", "BusinessAutomation", "Innovation"],
    createdAt: "2024-03-15T08:00:00Z",
    updatedAt: "2024-03-15T08:00:00Z"
  },
  {
    id: "post_2",
    title: "Quick Tip: Lead Qualification",
    content: "💡 Pro tip: Automating your lead qualification process can increase conversion rates by up to 40%! Our AI agents can help you identify high-value prospects and prioritize your sales efforts. #BusinessAutomation #AI #Sales",
    platforms: ["Twitter/X", "LinkedIn"],
    status: "published",
    scheduledFor: "2024-03-15T14:30:00Z",
    publishedAt: "2024-03-15T14:30:00Z",
    type: "tip",
    engagement: { likes: 47, comments: 12, shares: 8, views: 1200 },
    agent: "Social Media Agent",
    tags: ["BusinessAutomation", "AI", "Sales"],
    createdAt: "2024-03-15T13:00:00Z",
    updatedAt: "2024-03-15T14:30:00Z"
  },
  {
    id: "post_3",
    title: "Product Launch Announcement",
    content: "🚀 Excited to announce the launch of our new AI Agent Platform! Streamline your business operations with intelligent automation. Early access available now. #ProductLaunch #AI #Innovation",
    platforms: ["LinkedIn", "Twitter/X", "Facebook"],
    status: "draft",
    scheduledFor: null,
    publishedAt: null,
    type: "announcement",
    engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
    agent: "Marketing Agent",
    tags: ["ProductLaunch", "AI", "Innovation"],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  }
];

const mockCampaigns: SocialCampaign[] = [
  {
    id: "camp_1",
    name: "AI Awareness Campaign",
    description: "Educational campaign about AI in business automation",
    status: "active",
    platforms: ["LinkedIn", "Twitter/X"],
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-03-31T23:59:59Z",
    budget: 5000,
    spent: 2340,
    posts: ["post_1", "post_2"],
    goals: [
      { type: "reach", target: 50000, current: 23400 },
      { type: "engagement", target: 2000, current: 890 }
    ],
    performance: {
      reach: 23400,
      impressions: 45600,
      engagement: 890,
      clicks: 234,
      conversions: 12
    },
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  }
];

const mockAnalytics: SocialAnalytics = {
  period: "last_30_days",
  totalReach: 45600,
  totalEngagement: 2340,
  totalFollowers: 24140,
  totalPosts: 15,
  engagementRate: 5.1,
  followerGrowth: 12.3,
  topPosts: mockPosts.slice(0, 3),
  platformBreakdown: [
    { platform: "LinkedIn", followers: 12500, engagement: 1200, posts: 8 },
    { platform: "Twitter/X", followers: 8200, engagement: 890, posts: 5 },
    { platform: "YouTube", followers: 3400, engagement: 250, posts: 2 }
  ],
  trends: {
    reach: { value: 15.2, direction: "up" },
    engagement: { value: 8.7, direction: "up" },
    followers: { value: 12.3, direction: "up" }
  }
};

const mockTemplates: ContentTemplate[] = [
  {
    id: "template_1",
    name: "AI Tip of the Day",
    type: "tip",
    template: "💡 Pro tip: {tip_content} #AI #BusinessTips #Automation",
    platforms: ["Twitter/X", "LinkedIn"],
    tags: ["AI", "BusinessTips", "Automation"],
    agent: "Content Marketing Agent",
    isActive: true,
    createdAt: "2024-03-01T00:00:00Z"
  },
  {
    id: "template_2",
    name: "Product Update",
    type: "announcement",
    template: "🚀 Exciting news! {announcement_content} Learn more: {link} #ProductUpdate #Innovation",
    platforms: ["LinkedIn", "Twitter/X", "Facebook"],
    tags: ["ProductUpdate", "Innovation"],
    agent: "Marketing Agent",
    isActive: true,
    createdAt: "2024-03-01T00:00:00Z"
  }
];

const mockCalendar: ScheduledEvent[] = [
  {
    id: "event_1",
    title: "AI Business Article",
    type: "post",
    date: "2024-03-16",
    time: "09:00",
    platforms: ["LinkedIn", "Twitter/X"],
    status: "scheduled",
    relatedId: "post_1"
  },
  {
    id: "event_2",
    title: "Campaign Review",
    type: "reminder",
    date: "2024-03-17",
    time: "14:00",
    platforms: [],
    status: "scheduled",
    relatedId: "camp_1"
  }
];

// Context
const SocialContext = createContext<SocialContextType | undefined>(undefined);

// Provider Component
export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>(mockAccounts);
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(mockCampaigns);
  const [analytics, setAnalytics] = useState<SocialAnalytics | null>(mockAnalytics);
  const [templates, setTemplates] = useState<ContentTemplate[]>(mockTemplates);
  const [calendar, setCalendar] = useState<ScheduledEvent[]>(mockCalendar);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<SocialCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Account Management
  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(mockAccounts);
      toast.success('Accounts refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh accounts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectAccount = useCallback(async (platform: string, credentials: any): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAccount: SocialAccount = {
        id: `acc_${Date.now()}`,
        platform,
        accountName: `${platform} Account`,
        username: `@${platform.toLowerCase()}`,
        status: 'connected',
        followers: 0,
        following: 0,
        posts: 0,
        engagement: 0,
        lastSync: 'Just now',
        profileUrl: '',
        avatar: '🔗',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAccounts(prev => [...prev, newAccount]);
      toast.success(`${platform} account connected successfully`);
      return true;
    } catch (error) {
      toast.error(`Failed to connect ${platform} account`);
      return false;
    }
  }, []);

  const disconnectAccount = useCallback(async (accountId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      toast.success('Account disconnected successfully');
      return true;
    } catch (error) {
      toast.error('Failed to disconnect account');
      return false;
    }
  }, []);

  const syncAccount = useCallback(async (accountId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, lastSync: 'Just now', updatedAt: new Date().toISOString() }
          : acc
      ));
      toast.success('Account synced successfully');
      return true;
    } catch (error) {
      toast.error('Failed to sync account');
      return false;
    }
  }, []);

  // Post Management
  const refreshPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      toast.success('Posts refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData: Partial<SocialPost>): Promise<SocialPost | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost: SocialPost = {
        id: `post_${Date.now()}`,
        title: postData.title || 'Untitled Post',
        content: postData.content || '',
        platforms: postData.platforms || [],
        status: postData.status || 'draft',
        scheduledFor: postData.scheduledFor || null,
        publishedAt: null,
        type: postData.type || 'article',
        engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
        agent: postData.agent || 'User',
        tags: postData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPosts(prev => [newPost, ...prev]);
      toast.success('Post created successfully');
      return newPost;
    } catch (error) {
      toast.error('Failed to create post');
      return null;
    }
  }, []);

  const updatePost = useCallback(async (postId: string, updates: Partial<SocialPost>): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, ...updates, updatedAt: new Date().toISOString() }
          : post
      ));
      toast.success('Post updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update post');
      return false;
    }
  }, []);

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete post');
      return false;
    }
  }, []);

  const schedulePost = useCallback(async (postId: string, scheduledFor: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'scheduled', scheduledFor, updatedAt: new Date().toISOString() }
          : post
      ));
      toast.success('Post scheduled successfully');
      return true;
    } catch (error) {
      toast.error('Failed to schedule post');
      return false;
    }
  }, []);

  const publishPost = useCallback(async (postId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const now = new Date().toISOString();
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'published', publishedAt: now, updatedAt: now }
          : post
      ));
      toast.success('Post published successfully');
      return true;
    } catch (error) {
      toast.error('Failed to publish post');
      return false;
    }
  }, []);

  // Campaign Management
  const refreshCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(mockCampaigns);
      toast.success('Campaigns refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh campaigns');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (campaignData: Partial<SocialCampaign>): Promise<SocialCampaign | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCampaign: SocialCampaign = {
        id: `camp_${Date.now()}`,
        name: campaignData.name || 'Untitled Campaign',
        description: campaignData.description || '',
        status: campaignData.status || 'draft',
        platforms: campaignData.platforms || [],
        startDate: campaignData.startDate || new Date().toISOString(),
        endDate: campaignData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        budget: campaignData.budget || 1000,
        spent: 0,
        posts: [],
        goals: campaignData.goals || [],
        performance: {
          reach: 0,
          impressions: 0,
          engagement: 0,
          clicks: 0,
          conversions: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCampaigns(prev => [newCampaign, ...prev]);
      toast.success('Campaign created successfully');
      return newCampaign;
    } catch (error) {
      toast.error('Failed to create campaign');
      return null;
    }
  }, []);

  const updateCampaign = useCallback(async (campaignId: string, updates: Partial<SocialCampaign>): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
          : campaign
      ));
      toast.success('Campaign updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update campaign');
      return false;
    }
  }, []);

  const deleteCampaign = useCallback(async (campaignId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
      toast.success('Campaign deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete campaign');
      return false;
    }
  }, []);

  // Analytics
  const refreshAnalytics = useCallback(async (period: string = 'last_30_days') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalytics({ ...mockAnalytics, period });
      toast.success('Analytics refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAccountAnalytics = useCallback(async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return null;
    
    return {
      followers: account.followers,
      engagement: account.engagement,
      posts: account.posts,
      growth: Math.random() * 20 - 10 // Mock growth percentage
    };
  }, [accounts]);

  const getPostAnalytics = useCallback(async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    
    return post.engagement;
  }, [posts]);

  const getCampaignAnalytics = useCallback(async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return null;
    
    return campaign.performance;
  }, [campaigns]);

  // Content Generation
  const generateContent = useCallback(async (type: string, platform: string, topic?: string): Promise<string> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templates = {
        tip: `💡 Pro tip: ${topic || 'AI automation'} can help streamline your business processes! #AI #BusinessTips`,
        announcement: `🚀 Exciting news! We're launching something amazing related to ${topic || 'business automation'}! #Innovation`,
        article: `Exploring the impact of ${topic || 'AI'} on modern business operations. Here's what you need to know...`,
        'case-study': `📈 Case Study: How ${topic || 'AI implementation'} helped increase efficiency by 40%! #Success`
      };
      
      return templates[type as keyof typeof templates] || `Generated content about ${topic || 'business automation'}`;
    } catch (error) {
      toast.error('Failed to generate content');
      return '';
    }
  }, []);

  const getContentSuggestions = useCallback(async (platform: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions = {
      'LinkedIn': ['AI in Business', 'Leadership Tips', 'Industry Insights', 'Company Updates'],
      'Twitter/X': ['Quick Tips', 'Industry News', 'Thought Leadership', 'Behind the Scenes'],
      'Facebook': ['Company Culture', 'Customer Stories', 'Community Building', 'Events'],
      'Instagram': ['Visual Stories', 'Behind the Scenes', 'Team Highlights', 'Product Showcases'],
      'YouTube': ['Tutorials', 'Interviews', 'Product Demos', 'Industry Analysis']
    };
    
    return suggestions[platform as keyof typeof suggestions] || ['General Content', 'Business Tips', 'Industry News'];
  }, []);

  // Calendar
  const refreshCalendar = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCalendar(mockCalendar);
      toast.success('Calendar refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh calendar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCalendarEvents = useCallback((startDate: string, endDate: string): ScheduledEvent[] => {
    return calendar.filter(event => 
      event.date >= startDate && event.date <= endDate
    );
  }, [calendar]);

  const value: SocialContextType = {
    // Data
    accounts,
    posts,
    campaigns,
    analytics,
    templates,
    calendar,
    selectedAccount,
    selectedPost,
    selectedCampaign,
    isLoading,

    // Actions
    setSelectedAccount,
    setSelectedPost,
    setSelectedCampaign,
    
    // Account Management
    refreshAccounts,
    connectAccount,
    disconnectAccount,
    syncAccount,
    
    // Post Management
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    schedulePost,
    publishPost,
    
    // Campaign Management
    refreshCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    
    // Analytics
    refreshAnalytics,
    getAccountAnalytics,
    getPostAnalytics,
    getCampaignAnalytics,
    
    // Content Generation
    generateContent,
    getContentSuggestions,
    
    // Calendar
    refreshCalendar,
    getCalendarEvents
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
}

// Hook
export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
} 