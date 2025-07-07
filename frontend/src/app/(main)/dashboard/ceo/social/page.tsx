"use client";

import React, { useState, Suspense } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, MessageSquare, Calendar, Target, BarChart3, Activity, DollarSign, Eye, Edit, Settings, RefreshCw, Filter, CheckCircle, Clock, AlertCircle, Zap, Share2, Heart, MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";
import { useSocial } from "@/lib/social/social-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import sub-page components
import SocialMediaOverview from "@/components/social-media/social-media-overview";
import SocialAccountsManager from "@/components/social-media/social-accounts-manager";
import SocialPostsManager from "@/components/social-media/social-posts-manager";
import SocialCampaignsManager from "@/components/social-media/social-campaigns-manager";
import SocialCalendar from "@/components/social-media/social-calendar";
import ContentGenerator from "@/components/social-media/content-generator";
import SocialAnalyticsDashboard from "@/components/social-media/social-analytics-dashboard";



export default function SocialMediaPage() {
  const { 
    accounts, 
    posts, 
    campaigns, 
    analytics, 
    isLoading, 
    refreshAccounts, 
    refreshPosts, 
    refreshAnalytics,
    setSelectedAccount,
    setSelectedPost,
    setSelectedCampaign
  } = useSocial();
  
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  // Calculate overview statistics
  const overviewStats = {
    totalAccounts: accounts.length,
    connectedAccounts: accounts.filter(acc => acc.status === 'connected').length,
    totalFollowers: accounts.reduce((sum, acc) => sum + acc.followers, 0),
    totalPosts: posts.length,
    publishedPosts: posts.filter(post => post.status === 'published').length,
    scheduledPosts: posts.filter(post => post.status === 'scheduled').length,
    activeCampaigns: campaigns.filter(camp => camp.status === 'active').length,
    totalEngagement: analytics?.totalEngagement || 0,
    engagementRate: analytics?.engagementRate || 0
  };

  // Handle navigation to sub-pages with context
  const handleNavigateToAccounts = () => {
    router.push('/dashboard/ceo/social/accounts');
  };

  const handleNavigateToPosts = () => {
    router.push('/dashboard/ceo/social/posts');
  };

  const handleNavigateToCampaigns = () => {
    router.push('/dashboard/ceo/social/campaigns');
  };

  const handleNavigateToAnalytics = () => {
    router.push('/dashboard/ceo/social/analytics');
  };

  const handleNavigateToCalendar = () => {
    router.push('/dashboard/ceo/social/calendar');
  };

  const handleNavigateToGenerator = () => {
    router.push('/dashboard/ceo/social/generator');
  };

  const handleViewAccount = (account: any) => {
    setSelectedAccount(account);
    handleNavigateToAccounts();
  };

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    handleNavigateToPosts();
  };

  const handleViewCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    handleNavigateToCampaigns();
  };

  const handleCreatePost = () => {
    router.push('/dashboard/ceo/social/posts?action=create');
  };

  const handleCreateCampaign = () => {
    router.push('/dashboard/ceo/social/campaigns?action=create');
  };

  // Create breadcrumbs
  const breadcrumbs = [
    { label: "CEO Dashboard", href: "/dashboard/ceo" },
    { label: "Social Media" }
  ];

  // Create tabs for different views
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreatePost}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Create Post</p>
                    <p className="text-sm text-muted-foreground">Write new content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToGenerator}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">AI Generator</p>
                    <p className="text-sm text-muted-foreground">Auto-generate content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToCalendar}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p className="text-sm text-muted-foreground">Plan your content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNavigateToAnalytics}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-muted-foreground">View insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Posts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                  <CardDescription>Your latest social media content</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleNavigateToPosts}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div 
                    key={post.id} 
                    className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleViewPost(post)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {post.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.platforms.join(', ')}
                        </span>
                      </div>
                    </div>
                    {post.status === 'published' && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Engagement</p>
                        <p className="text-sm font-medium">{post.engagement.likes + post.engagement.comments}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Connected Accounts</CardTitle>
                  <CardDescription>Your social media platforms</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleNavigateToAccounts}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {accounts.slice(0, 4).map((account) => (
                  <div 
                    key={account.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleViewAccount(account)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{account.avatar}</div>
                      <div>
                        <p className="font-medium text-sm">{account.platform}</p>
                        <p className="text-xs text-muted-foreground">{account.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{account.followers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">followers</p>
                      </div>
                      {account.status === 'connected' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {account.status === 'pending' && (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      {account.status === 'disconnected' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          {campaigns.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Active Campaigns</CardTitle>
                  <CardDescription>Your running social media campaigns</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleNavigateToCampaigns}>
                  <Target className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {campaigns.filter(camp => camp.status === 'active').slice(0, 2).map((campaign) => (
                    <div 
                      key={campaign.id} 
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewCampaign(campaign)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant="secondary">{campaign.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Spent</p>
                          <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reach</p>
                          <p className="font-medium">{campaign.performance.reach.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">{campaign.performance.engagement.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: Users,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialAccountsManager />
        </Suspense>
      ),
    },
    {
      id: "posts",
      label: "Posts",
      icon: MessageSquare,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialPostsManager />
        </Suspense>
      ),
    },
    {
      id: "campaigns",
      label: "Campaigns",
      icon: Target,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialCampaignsManager />
        </Suspense>
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialCalendar />
        </Suspense>
      ),
    },
    {
      id: "generator",
      label: "Generate",
      icon: Plus,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <ContentGenerator />
        </Suspense>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialAnalyticsDashboard />
        </Suspense>
      ),
    },
  ];

  return (
    <>
      <PageHeaderWithActions
        title="Social Media Management"
        description="Manage your social media presence across multiple platforms with AI-powered automation"
        breadcrumbs={breadcrumbs}
        actions={[
          {
            label: "New Campaign",
            onClick: handleCreateCampaign,
            variant: "outline" as const,
            icon: Target,
          },
          {
            label: "Create Post",
            onClick: handleCreatePost,
            variant: "default" as const,
            icon: Plus,
          },
        ]}
      />
      <main className="p-6">
        {/* Overall Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-8">
          <StatCard
            title="Connected Accounts"
            value={overviewStats.connectedAccounts.toString()}
            description={`of ${overviewStats.totalAccounts} total`}
            icon={Users}
            trend={{ value: 25, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Followers"
            value={overviewStats.totalFollowers.toLocaleString()}
            description="Combined reach"
            icon={TrendingUp}
            trend={{ value: 2.6, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Posts This Month"
            value={overviewStats.publishedPosts.toString()}
            description={`${overviewStats.scheduledPosts} scheduled`}
            icon={MessageSquare}
            trend={{ value: 18, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Active Campaigns"
            value={overviewStats.activeCampaigns.toString()}
            description="Running campaigns"
            icon={Target}
            trend={{ value: 50, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Engagement Rate"
            value={`${overviewStats.engagementRate.toFixed(1)}%`}
            description="Average engagement"
            icon={Heart}
            trend={{ value: 6.25, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Engagement"
            value={overviewStats.totalEngagement.toLocaleString()}
            description="Likes, comments, shares"
            icon={Activity}
            trend={{ value: 12.3, isPositive: true, period: "vs last month" }}
          />
        </div>

        {/* Main Content Tabs */}
        <TabbedContentLayout
          defaultTab="overview"
          tabs={tabs}
          className="space-y-6"
        />
      </main>
    </>
  );
}

 