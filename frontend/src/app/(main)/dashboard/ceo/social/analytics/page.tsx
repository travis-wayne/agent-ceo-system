"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Target,
  DollarSign,
  Clock,
  Settings,
  ArrowRight,
  Zap,
  Globe,
  PieChart,
  Activity,
  Bookmark
} from "lucide-react";

export default function SocialAnalyticsPage() {
  const { 
    accounts, 
    posts, 
    campaigns,
    analytics,
    selectedAccount,
    selectedPost,
    selectedCampaign,
    isLoading,
    refreshAnalytics,
    getAccountAnalytics,
    getPostAnalytics,
    getCampaignAnalytics,
    setSelectedAccount,
    setSelectedPost,
    setSelectedCampaign
  } = useSocial();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timePeriod, setTimePeriod] = useState('last_30_days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [viewMode, setViewMode] = useState<'overview' | 'account' | 'post' | 'campaign'>('overview');
  const [specificAnalytics, setSpecificAnalytics] = useState<any>(null);

  // Handle URL parameters
  useEffect(() => {
    const accountId = searchParams.get('accountId');
    const postId = searchParams.get('postId');
    const campaignId = searchParams.get('campaignId');
    
    if (accountId && accounts.length > 0) {
      const account = accounts.find(a => a.id === accountId);
      if (account) {
        setSelectedAccount(account);
        setViewMode('account');
        loadAccountAnalytics(account.id);
      }
    }
    
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setViewMode('post');
        loadPostAnalytics(post.id);
      }
    }
    
    if (campaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
        setViewMode('campaign');
        loadCampaignAnalytics(campaign.id);
      }
    }
  }, [searchParams, accounts, posts, campaigns, setSelectedAccount, setSelectedPost, setSelectedCampaign]);

  const loadAccountAnalytics = async (accountId: string) => {
    const data = await getAccountAnalytics(accountId);
    setSpecificAnalytics(data);
  };

  const loadPostAnalytics = async (postId: string) => {
    const data = await getPostAnalytics(postId);
    setSpecificAnalytics(data);
  };

  const loadCampaignAnalytics = async (campaignId: string) => {
    const data = await getCampaignAnalytics(campaignId);
    setSpecificAnalytics(data);
  };

  // Calculate overview statistics from actual data
  const overviewStats = analytics ? {
    totalFollowers: analytics.totalFollowers,
    totalPosts: analytics.totalPosts,
    totalEngagement: analytics.totalEngagement,
    avgEngagementRate: analytics.engagementRate,
    totalReach: analytics.totalReach,
    followerGrowth: analytics.trends.followers.value,
    reachGrowth: analytics.trends.reach.value,
    engagementGrowth: analytics.trends.engagement.value
  } : {
    totalFollowers: 0,
    totalPosts: 0,
    totalEngagement: 0,
    avgEngagementRate: 0,
    totalReach: 0,
    followerGrowth: 0,
    reachGrowth: 0,
    engagementGrowth: 0
  };

  // Get platform statistics from analytics
  const platformStats = analytics?.platformBreakdown.map(platform => {
    const account = accounts.find(acc => acc.platform === platform.platform);
    return {
      ...platform,
      icon: getPlatformIcon(platform.platform),
      color: getPlatformColor(platform.platform),
      bgColor: getPlatformBgColor(platform.platform),
      trend: `+${Math.round(Math.random() * 20)}%`, // Mock trend
      trendUp: Math.random() > 0.3 // Mock trend direction
    };
  }) || [];

  // Navigation helpers
  const handleViewAccount = (platform: string) => {
    const account = accounts.find(acc => acc.platform === platform);
    if (account) {
      setSelectedAccount(account);
      router.push(`/dashboard/ceo/social/accounts?id=${account.id}`);
    }
  };

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    router.push(`/dashboard/ceo/social/posts?id=${post.id}`);
  };

  const handleViewCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    router.push(`/dashboard/ceo/social/campaigns?id=${campaign.id}`);
  };

  const handleCreatePost = () => {
    router.push('/dashboard/ceo/social/posts?action=create');
  };

  const handleCreateCampaign = () => {
    router.push('/dashboard/ceo/social/campaigns?action=create');
  };

  const handleViewCalendar = () => {
    router.push('/dashboard/ceo/social/calendar');
  };

  const handleGenerateContent = () => {
    router.push('/dashboard/ceo/social/generator');
  };

  function getPlatformIcon(platform: string) {
    switch (platform) {
      case "LinkedIn":
        return Linkedin;
      case "Twitter/X":
        return Twitter;
      case "Facebook":
        return Facebook;
      case "Instagram":
        return Instagram;
      case "YouTube":
        return Youtube;
      default:
        return Globe;
    }
  }

  function getPlatformColor(platform: string) {
    switch (platform) {
      case "LinkedIn":
        return "text-blue-600";
      case "Twitter/X":
        return "text-black";
      case "Facebook":
        return "text-blue-500";
      case "Instagram":
        return "text-purple-500";
      case "YouTube":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  }

  function getPlatformBgColor(platform: string) {
    switch (platform) {
      case "LinkedIn":
        return "bg-blue-50";
      case "Twitter/X":
        return "bg-gray-50";
      case "Facebook":
        return "bg-blue-50";
      case "Instagram":
        return "bg-purple-50";
      case "YouTube":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTrendIcon = (trendUp: boolean) => {
    return trendUp ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trendUp: boolean) => {
    return trendUp ? "text-green-500" : "text-red-500";
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Analytics", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Social Analytics</h1>
              </div>
              <p className="text-muted-foreground">
                Comprehensive social media analytics and performance insights
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 days</SelectItem>
                  <SelectItem value="last_year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button variant="outline" onClick={() => refreshAnalytics(timePeriod)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleGenerateContent}>
                <Zap className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalFollowers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                </div>
                <div className="ml-auto flex items-center space-x-1">
                  {getTrendIcon(overviewStats.followerGrowth > 0)}
                  <span className={`text-xs font-medium ${getTrendColor(overviewStats.followerGrowth > 0)}`}>
                    {overviewStats.followerGrowth > 0 ? '+' : ''}{overviewStats.followerGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalPosts}</p>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalEngagement.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Engagement</p>
                </div>
                <div className="ml-auto flex items-center space-x-1">
                  {getTrendIcon(overviewStats.engagementGrowth > 0)}
                  <span className={`text-xs font-medium ${getTrendColor(overviewStats.engagementGrowth > 0)}`}>
                    {overviewStats.engagementGrowth > 0 ? '+' : ''}{overviewStats.engagementGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalReach.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Reach</p>
                </div>
                <div className="ml-auto flex items-center space-x-1">
                  {getTrendIcon(overviewStats.reachGrowth > 0)}
                  <span className={`text-xs font-medium ${getTrendColor(overviewStats.reachGrowth > 0)}`}>
                    {overviewStats.reachGrowth > 0 ? '+' : ''}{overviewStats.reachGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/accounts')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">Manage Accounts</p>
                  <p className="text-sm text-muted-foreground">{accounts.filter(a => a.status === 'connected').length} connected</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/posts')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium">View Posts</p>
                  <p className="text-sm text-muted-foreground">{posts.length} total posts</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/campaigns')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-medium">View Campaigns</p>
                  <p className="text-sm text-muted-foreground">{campaigns.length} campaigns</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreatePost}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="font-medium">Create Content</p>
                  <p className="text-sm text-muted-foreground">New post or campaign</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Key metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Engagement Rate</span>
                      <span className="text-sm text-muted-foreground">{overviewStats.avgEngagementRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={overviewStats.avgEngagementRate * 10} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reach Growth</span>
                      <span className="text-sm text-muted-foreground">{overviewStats.reachGrowth.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.abs(overviewStats.reachGrowth)} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Follower Growth</span>
                      <span className="text-sm text-muted-foreground">{overviewStats.followerGrowth.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.abs(overviewStats.followerGrowth)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Content */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>Your best content this period</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/ceo/social/posts')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topPosts.slice(0, 3).map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => handleViewPost(post)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.engagement.likes + post.engagement.comments + post.engagement.shares} engagements
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {post.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {post.platforms.join(', ')}
                            </span>
                    </div>
                      </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid gap-6">
              {platformStats.map((platform) => {
                const IconComponent = platform.icon;
                return (
                <Card key={platform.platform} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                            <IconComponent className={`h-6 w-6 ${platform.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.platform}</CardTitle>
                            <CardDescription>Platform analytics</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                        {getTrendIcon(platform.trendUp)}
                            <span className={`text-sm font-medium ${getTrendColor(platform.trendUp)}`}>
                          {platform.trend}
                            </span>
                      </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAccount(platform.platform)}
                          >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{platform.followers.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{platform.posts}</p>
                          <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{platform.engagement.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                </div>
              </CardContent>
            </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Content Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>How your content is performing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => handleViewPost(post)}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.platforms.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {post.engagement.likes + post.engagement.comments + post.engagement.shares}
                          </p>
                          <p className="text-xs text-muted-foreground">engagements</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Types</CardTitle>
                  <CardDescription>Performance by content type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['article', 'tip', 'announcement', 'case-study'].map((type) => {
                      const typePosts = posts.filter(p => p.type === type);
                      const totalEngagement = typePosts.reduce((sum, p) => 
                        sum + p.engagement.likes + p.engagement.comments + p.engagement.shares, 0
                      );
                      const avgEngagement = typePosts.length > 0 ? totalEngagement / typePosts.length : 0;
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{type}</span>
                            <span className="text-sm text-muted-foreground">
                              {typePosts.length} posts • {avgEngagement.toFixed(0)} avg engagement
                            </span>
                          </div>
                          <Progress value={(typePosts.length / posts.length) * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Audience Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Who's engaging with your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Age Groups</h4>
                      <div className="space-y-2">
                        {[
                          { age: "18-24", percentage: 12 },
                          { age: "25-34", percentage: 28 },
                          { age: "35-44", percentage: 34 },
                          { age: "45-54", percentage: 18 },
                          { age: "55+", percentage: 8 }
                        ].map((group) => (
                          <div key={group.age} className="flex items-center justify-between">
                            <span className="text-sm">{group.age}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={group.percentage} className="h-2 w-20" />
                              <span className="text-sm text-muted-foreground">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Locations */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                  <CardDescription>Where your audience is located</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { location: "United States", percentage: 45 },
                      { location: "United Kingdom", percentage: 18 },
                      { location: "Canada", percentage: 12 },
                      { location: "Australia", percentage: 8 },
                      { location: "Other", percentage: 17 }
                    ].map((location) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <span className="text-sm">{location.location}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={location.percentage} className="h-2 w-20" />
                          <span className="text-sm text-muted-foreground">{location.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 