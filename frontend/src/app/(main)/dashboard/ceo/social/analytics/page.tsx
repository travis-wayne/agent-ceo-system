"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Plus
} from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";

function SocialAnalyticsContent() {
  const { accounts, campaigns, posts } = useSocialMedia();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const overviewStats = {
    totalFollowers: 45600,
    totalPosts: 127,
    totalEngagement: 2189,
    avgEngagementRate: 4.8,
    totalReach: 234500,
    totalImpressions: 456800,
    totalClicks: 8900,
    conversionRate: 2.1
  };

  const platformStats = [
    {
      platform: "LinkedIn",
      followers: 12500,
      posts: 45,
      engagement: 600,
      engagementRate: 4.8,
      reach: 89000,
      impressions: 156000,
      icon: Linkedin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
      trendUp: true
    },
    {
      platform: "Twitter/X",
      followers: 8200,
      posts: 52,
      engagement: 820,
      engagementRate: 3.2,
      reach: 67000,
      impressions: 134000,
      icon: Twitter,
      color: "text-black",
      bgColor: "bg-gray-50",
      trend: "+8%",
      trendUp: true
    },
    {
      platform: "Facebook",
      followers: 8900,
      posts: 18,
      engagement: 450,
      engagementRate: 2.1,
      reach: 45000,
      impressions: 89000,
      icon: Facebook,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      trend: "-3%",
      trendUp: false
    },
    {
      platform: "Instagram",
      followers: 8500,
      posts: 12,
      engagement: 319,
      engagementRate: 3.8,
      reach: 33400,
      impressions: 77800,
      icon: Instagram,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      trend: "+15%",
      trendUp: true
    }
  ];

  const topPosts = [
    {
      id: "post_1",
      title: "The Future of AI in Business Automation",
      platform: "LinkedIn",
      engagement: 234,
      reach: 8900,
      impressions: 15600,
      engagementRate: 5.2,
      publishedAt: "2024-01-15T09:00:00Z",
      type: "article"
    },
    {
      id: "post_2",
      title: "Quick Tip: Lead Qualification",
      platform: "Twitter/X",
      engagement: 189,
      reach: 6700,
      impressions: 12300,
      engagementRate: 4.8,
      publishedAt: "2024-01-14T14:30:00Z",
      type: "tip"
    },
    {
      id: "post_3",
      title: "Customer Success Story",
      platform: "LinkedIn",
      engagement: 156,
      reach: 7800,
      impressions: 13400,
      engagementRate: 4.1,
      publishedAt: "2024-01-13T10:00:00Z",
      type: "case-study"
    },
    {
      id: "post_4",
      title: "Product Launch Announcement",
      platform: "Facebook",
      engagement: 134,
      reach: 5600,
      impressions: 9800,
      engagementRate: 3.8,
      publishedAt: "2024-01-12T16:00:00Z",
      type: "announcement"
    }
  ];

  const headerActions = useMemo(() => [
    {
      label: "Export Report",
      variant: "outline" as const,
      icon: Download,
      onClick: () => {},
    },
    {
      label: "Refresh Data",
      variant: "outline" as const,
      icon: RefreshCw,
      onClick: () => {},
    },
    {
      label: "Settings",
      variant: "outline" as const,
      icon: Settings,
      onClick: () => {},
    },
  ], []);

  const quickActions = useMemo(() => [
    {
      label: "View Posts",
      icon: MessageSquare,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts"
    },
    {
      label: "View Campaigns",
      icon: Target,
      onClick: () => {},
      href: "/dashboard/ceo/social/campaigns"
    },
    {
      label: "Schedule Content",
      icon: Calendar,
      onClick: () => {},
      href: "/dashboard/ceo/social/calendar"
    }
  ], []);

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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "LinkedIn":
        return <Linkedin className="h-4 w-4 text-blue-600" />;
      case "Twitter/X":
        return <Twitter className="h-4 w-4 text-black" />;
      case "Facebook":
        return <Facebook className="h-4 w-4 text-blue-500" />;
      case "Instagram":
        return <Instagram className="h-4 w-4 text-purple-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Social Analytics"
          description="Comprehensive social media analytics and performance insights across all platforms"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Analytics" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Time Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="timeRange">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="platform">Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
            title="Total Engagement"
            value={overviewStats.totalEngagement.toLocaleString()}
            description="Likes, comments, shares"
            icon={Heart}
            trend={{ value: 8, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Reach"
            value={overviewStats.totalReach.toLocaleString()}
            description="Unique users reached"
            icon={Eye}
            trend={{ value: 15, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Avg Engagement Rate"
            value={`${overviewStats.avgEngagementRate}%`}
            description="Engagement per post"
            icon={TrendingUp}
            trend={{ value: 0.3, isPositive: true, period: "vs last month" }}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Navigate to related sections for deeper insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Performance
              </CardTitle>
              <CardDescription>
                Performance metrics by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformStats.map((platform) => (
                  <div key={platform.platform} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                          <platform.icon className={`h-5 w-5 ${platform.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{platform.platform}</h4>
                          <p className="text-sm text-muted-foreground">
                            {platform.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(platform.trendUp)}
                        <span className={`text-sm font-medium ${platform.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                          {platform.trend}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{platform.posts}</div>
                        <div className="text-muted-foreground">Posts</div>
                      </div>
                      <div>
                        <div className="font-medium">{platform.engagement}</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
                      <div>
                        <div className="font-medium">{platform.engagementRate}%</div>
                        <div className="text-muted-foreground">Rate</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reach</span>
                        <span>{platform.reach.toLocaleString()}</span>
                      </div>
                      <Progress value={(platform.reach / 100000) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performing Posts
              </CardTitle>
              <CardDescription>
                Your best content from the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-1">
                          {getPlatformIcon(post.platform)}
                          <span className="text-sm text-muted-foreground">{post.platform}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{post.type}</Badge>
                    </div>
                    <h4 className="font-medium mb-2 line-clamp-2">{post.title}</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="font-medium">{post.engagement}</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
                      <div>
                        <div className="font-medium">{post.reach.toLocaleString()}</div>
                        <div className="text-muted-foreground">Reach</div>
                      </div>
                      <div>
                        <div className="font-medium">{post.engagementRate}%</div>
                        <div className="text-muted-foreground">Rate</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                        <Link href={`/dashboard/ceo/social/posts?id=${post.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link href="/dashboard/ceo/social/posts">
                  <Button variant="outline" className="w-full">
                    View All Posts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Best Posting Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monday 9:00 AM</span>
                  <Badge className="bg-green-100 text-green-800">Peak</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Wednesday 2:00 PM</span>
                  <Badge className="bg-blue-100 text-blue-800">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Friday 11:00 AM</span>
                  <Badge className="bg-blue-100 text-blue-800">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Content Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Articles</span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-16 h-2" />
                    <span className="text-sm">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tips</span>
                  <div className="flex items-center gap-2">
                    <Progress value={25} className="w-16 h-2" />
                    <span className="text-sm">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Updates</span>
                  <div className="flex items-center gap-2">
                    <Progress value={10} className="w-16 h-2" />
                    <span className="text-sm">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ROI Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost per Click</span>
                  <span className="font-medium">$0.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="font-medium">2.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue Attribution</span>
                  <span className="font-medium">$8,420</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function SocialAnalyticsPage() {
  return (
    <SocialMediaProvider>
      <SocialAnalyticsContent />
    </SocialMediaProvider>
  );
} 