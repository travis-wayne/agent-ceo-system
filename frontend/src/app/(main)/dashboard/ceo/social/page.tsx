"use client";

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, MessageSquare, Calendar, Target, BarChart3, Settings, RefreshCw, Zap, Bot, Sparkles, Globe, Activity, Heart, Eye } from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { useSocial } from "@/lib/social/social-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper function for status badges
const getStatusBadge = (status: string) => {
  const statusConfig = {
    connected: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Connected" },
    pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Pending" },
    disconnected: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Disconnected" },
    error: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Error" },
    draft: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: "Draft" },
    scheduled: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Scheduled" },
    published: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Published" },
    failed: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Failed" },
    active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Active" },
    paused: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Paused" },
    completed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Completed" }
  };
  
  return statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: status };
};

function SocialMediaPageContent() {
  const { 
    accounts, 
    posts, 
    campaigns, 
    analytics,
    refreshAccounts, 
    refreshPosts,
    refreshCampaigns,
    refreshAnalytics,
    isLoading,
    generateContent,
    getContentSuggestions
  } = useSocial();
  
  const router = useRouter();
  const [openCampaignModal, setOpenCampaignModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openGeneratorModal, setOpenGeneratorModal] = useState(false);
  const [generationSettings, setGenerationSettings] = useState({
    platform: "LinkedIn",
    tone: "professional",
    length: "medium",
    includeHashtags: true,
    includeEmojis: true,
    targetAudience: "business-professionals"
  });
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({
    autoSync: true,
    contentApproval: false,
    analyticsTracking: true,
    aiGeneration: true,
    autoOptimize: false,
    aiModel: "gpt-4",
    postNotifications: true,
    engagementAlerts: true,
    campaignUpdates: false
  });

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    const totalPosts = posts.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const avgEngagement = accounts.reduce((sum, acc) => sum + acc.engagement, 0) / accounts.length || 0;
    const totalEngagement = analytics?.totalEngagement || 0;
    const engagementRate = analytics?.engagementRate || 0;

    return {
      totalFollowers,
      totalPosts,
      activeCampaigns,
      avgEngagement,
      totalEngagement,
      engagementRate
    };
  }, [accounts, posts, campaigns, analytics]);

  const headerActions = useMemo(() => [
    {
      label: "Refresh Data",
      variant: "outline" as const,
      icon: RefreshCw,
      onClick: async () => {
        await Promise.all([
          refreshAccounts(),
          refreshPosts(),
          refreshCampaigns(),
          refreshAnalytics()
        ]);
      },
      disabled: isLoading,
    },
    {
      label: "Settings",
      variant: "outline" as const,
      icon: Settings,
      onClick: () => setOpenSettingsModal(true),
    },
    {
      label: "AI Generator",
      variant: "default" as const,
      icon: Zap,
      onClick: () => setOpenGeneratorModal(true),
    },
  ], [refreshAccounts, refreshPosts, refreshCampaigns, refreshAnalytics, isLoading]);

  const quickActions = useMemo(() => [
    {
      label: "Create Post",
      icon: Plus,
      onClick: () => router.push('/dashboard/ceo/social/posts?action=create'),
      href: "/dashboard/ceo/social/posts?action=create"
    },
    {
      label: "Schedule Content",
      icon: Calendar,
      onClick: () => router.push('/dashboard/ceo/social/calendar'),
      href: "/dashboard/ceo/social/calendar"
    },
    {
      label: "Generate Content",
      icon: Zap,
      onClick: () => setOpenGeneratorModal(true),
      href: "/dashboard/ceo/social/generator"
    }
  ], [router]);

  const navigationCards = [
    {
      title: "Social Accounts",
      description: "Manage your connected social media accounts",
      icon: Users,
      href: "/dashboard/ceo/social/accounts",
      stats: `${accounts.length} accounts`,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Posts & Content",
      description: "View and manage your social media posts",
      icon: MessageSquare,
      href: "/dashboard/ceo/social/posts",
      stats: `${posts.length} posts`,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Campaigns",
      description: "Track your marketing campaigns",
      icon: Target,
      href: "/dashboard/ceo/social/campaigns",
      stats: `${campaigns.length} campaigns`,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Analytics",
      description: "View performance metrics and insights",
      icon: BarChart3,
      href: "/dashboard/ceo/social/analytics",
      stats: "Real-time data",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Content Calendar",
      description: "Plan and schedule your content",
      icon: Calendar,
      href: "/dashboard/ceo/social/calendar",
      stats: "Schedule posts",
      color: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "AI Generator",
      description: "AI-powered content creation",
      icon: Bot,
      href: "/dashboard/ceo/social/generator",
      stats: "AI-powered",
      color: "text-pink-600 dark:text-pink-400"
    }
  ];

  const handleGenerateContent = async () => {
    if (!generationPrompt.trim()) {
      toast.error("Please enter a prompt for content generation");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateContent(
        "article", // type
        generationSettings.platform, // platform
        generationPrompt // topic
      );
      
      if (result) {
        toast.success("Content generated successfully!");
        setOpenGeneratorModal(false);
        setGenerationPrompt("");
        // Navigate to the generator page to show the result
        router.push('/dashboard/ceo/social/generator');
      } else {
        toast.error("Failed to generate content");
      }
    } catch (error) {
      toast.error("Error generating content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingsSave = async () => {
    try {
      // In a real app, you would save these settings to the backend
      toast.success("Settings updated successfully");
      setOpenSettingsModal(false);
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Social Media Management"
          description="Manage your social media presence across multiple platforms with AI-powered automation"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Followers"
            value={overviewStats.totalFollowers.toLocaleString()}
            description="Across all platforms"
            icon={Users}
            trend={{ value: 12, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Posts"
            value={overviewStats.totalPosts.toString()}
            description="Published content"
            icon={MessageSquare}
            trend={{ value: 8, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Active Campaigns"
            value={overviewStats.activeCampaigns.toString()}
            description="Running campaigns"
            icon={Target}
            trend={{ value: 2, isPositive: true, period: "new this month" }}
          />
          <StatCard
            title="Engagement Rate"
            value={`${overviewStats.engagementRate.toFixed(1)}%`}
            description="Average engagement"
            icon={Heart}
            trend={{ value: 0.3, isPositive: true, period: "vs last month" }}
          />
        </div>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Common tasks to manage your social media presence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${card.color}`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-gray-100">{card.title}</CardTitle>
                        <Badge variant="outline" className="mt-1 dark:border-gray-600 dark:text-gray-300">
                          {card.stats}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm dark:text-gray-400">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Latest updates from your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.slice(0, 3).map((account) => {
                const statusBadge = getStatusBadge(account.status);
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium dark:text-gray-100">{account.accountName}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          {account.platform} • Last sync: {account.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium dark:text-gray-100">{account.followers.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">followers</p>
                      <Badge className={`text-xs ${statusBadge.color}`}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2">
                <Link href="/dashboard/ceo/social/accounts">
                  <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-300">
                    View All Accounts
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* AI Generator Modal */}
      <Dialog open={openGeneratorModal} onOpenChange={setOpenGeneratorModal}>
        <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Bot className="h-5 w-5" />
              AI Content Generator
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Generate engaging social media content with AI assistance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="dark:text-gray-300">Content Prompt</Label>
              <Input
                id="prompt"
                placeholder="Describe the content you want to generate..."
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="dark:text-gray-300">Platform</Label>
                <Select value={generationSettings.platform} onValueChange={(value) => 
                  setGenerationSettings(prev => ({ ...prev, platform: value }))
                }>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone" className="dark:text-gray-300">Tone</Label>
                <Select value={generationSettings.tone} onValueChange={(value) => 
                  setGenerationSettings(prev => ({ ...prev, tone: value }))
                }>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="hashtags" 
                  checked={generationSettings.includeHashtags}
                  onCheckedChange={(checked) => 
                    setGenerationSettings(prev => ({ ...prev, includeHashtags: checked }))
                  }
                />
                <Label htmlFor="hashtags" className="dark:text-gray-300">Include hashtags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="emojis" 
                  checked={generationSettings.includeEmojis}
                  onCheckedChange={(checked) => 
                    setGenerationSettings(prev => ({ ...prev, includeEmojis: checked }))
                  }
                />
                <Label htmlFor="emojis" className="dark:text-gray-300">Include emojis</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleGenerateContent} 
              disabled={isGenerating}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={openSettingsModal} onOpenChange={setOpenSettingsModal}>
        <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Settings className="h-5 w-5" />
              Social Media Settings
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Configure your social media management preferences
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 dark:bg-gray-700">
              <TabsTrigger value="general" className="dark:text-gray-300">General</TabsTrigger>
              <TabsTrigger value="ai" className="dark:text-gray-300">AI Settings</TabsTrigger>
              <TabsTrigger value="notifications" className="dark:text-gray-300">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Auto-sync accounts</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Automatically sync data from connected accounts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSync: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Content approval</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Require approval before publishing content
                    </p>
                  </div>
                  <Switch 
                    checked={settings.contentApproval}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, contentApproval: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Analytics tracking</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Track detailed analytics for all posts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.analyticsTracking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analyticsTracking: checked }))}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">AI content generation</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Enable AI-powered content suggestions
                    </p>
                  </div>
                  <Switch 
                    checked={settings.aiGeneration}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiGeneration: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Auto-optimize posts</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Automatically optimize post timing and content
                    </p>
                  </div>
                  <Switch 
                    checked={settings.autoOptimize}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoOptimize: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">Default AI model</Label>
                  <Select value={settings.aiModel} onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, aiModel: value }))
                  }>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Post notifications</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Notify when posts are published
                    </p>
                  </div>
                  <Switch 
                    checked={settings.postNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, postNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Engagement alerts</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Alert for high engagement posts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.engagementAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, engagementAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-300">Campaign updates</Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Updates on campaign performance
                    </p>
                  </div>
                  <Switch 
                    checked={settings.campaignUpdates}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, campaignUpdates: checked }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSettingsSave}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function SocialMediaPage() {
  return <SocialMediaPageContent />;
} 