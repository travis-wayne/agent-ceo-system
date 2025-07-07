"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  MessageSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Share2,
  Heart,
  MessageCircle,
  BarChart3,
  Image,
  Video,
  Link as LinkIcon,
  Settings,
  RefreshCw,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Target,
  TrendingUp,
  Users
} from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";

function SocialPostsContent() {
  const { posts: contextPosts, campaigns, refreshData, isLoading } = useSocialMedia();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const posts = [
    {
      id: "post_1",
      title: "The Future of AI in Business Automation",
      content: "Exploring how AI agents are revolutionizing business processes and decision-making. From customer service to strategic planning, AI is becoming an indispensable tool for modern enterprises. #AI #BusinessAutomation #Innovation",
      platforms: ["LinkedIn", "Twitter/X"],
      status: "scheduled",
      scheduledFor: "2024-01-16T09:00:00Z",
      publishedAt: null,
      type: "article",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      agent: "Content Marketing Agent",
      tags: ["AI", "BusinessAutomation", "Innovation"],
      campaignId: "campaign_1"
    },
    {
      id: "post_2",
      title: "Quick Tip: Lead Qualification",
      content: "💡 Pro tip: Automating your lead qualification process can increase conversion rates by up to 40%! Our AI agents can help you identify high-value prospects and prioritize your sales efforts. #BusinessAutomation #AI #Sales",
      platforms: ["Twitter/X", "LinkedIn"],
      status: "published",
      scheduledFor: "2024-01-15T14:30:00Z",
      publishedAt: "2024-01-15T14:30:00Z",
      type: "tip",
      engagement: { likes: 47, comments: 12, shares: 8, views: 1200 },
      agent: "Social Media Agent",
      tags: ["BusinessAutomation", "AI", "Sales"],
      campaignId: "campaign_2"
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
      campaignId: "campaign_1"
    },
    {
      id: "post_4",
      title: "Customer Success Story",
      content: "📈 Amazing results from our client: 300% increase in lead generation and 50% reduction in response time using our AI agents. Real results, real impact. #CustomerSuccess #AI #Results",
      platforms: ["LinkedIn"],
      status: "published",
      scheduledFor: "2024-01-14T10:00:00Z",
      publishedAt: "2024-01-14T10:00:00Z",
      type: "case-study",
      engagement: { likes: 89, comments: 23, shares: 15, views: 3400 },
      agent: "Content Marketing Agent",
      tags: ["CustomerSuccess", "AI", "Results"],
      campaignId: "campaign_3"
    }
  ];

  const headerActions = useMemo(() => [
    {
      label: "Refresh Data",
      variant: "outline" as const,
      icon: RefreshCw,
      onClick: refreshData,
      disabled: isLoading,
    },
    {
      label: "Schedule Post",
      variant: "outline" as const,
      icon: Calendar,
      onClick: () => {},
      href: "/dashboard/ceo/social/calendar"
    },
    {
      label: "Create Post",
      variant: "default" as const,
      icon: Plus,
      onClick: () => {},
    },
  ], [refreshData, isLoading]);

  const quickActions = useMemo(() => [
    {
      label: "Generate Content",
      icon: Target,
      onClick: () => {},
      href: "/dashboard/ceo/social/generator"
    },
    {
      label: "View Calendar",
      icon: Calendar,
      onClick: () => {},
      href: "/dashboard/ceo/social/calendar"
    },
    {
      label: "View Analytics",
      icon: BarChart3,
      onClick: () => {},
      href: "/dashboard/ceo/social/analytics"
    }
  ], []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "scheduled":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "draft":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
      case "YouTube":
        return <Youtube className="h-4 w-4 text-red-600" />;
      default:
        return <Share2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  const getCampaignName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : "No Campaign";
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || post.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const draftPosts = posts.filter(p => p.status === 'draft');

  const totalEngagement = publishedPosts.reduce((sum, post) => 
    sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
  );
  const totalViews = publishedPosts.reduce((sum, post) => sum + post.engagement.views, 0);

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Social Posts"
          description="Manage and schedule your social media posts across all platforms"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Posts" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Posts"
            value={posts.length.toString()}
            description="All content"
            icon={MessageSquare}
            trend={{ value: 5, isPositive: true, period: "this month" }}
          />
          <StatCard
            title="Published"
            value={publishedPosts.length.toString()}
            description="Live content"
            icon={CheckCircle}
            trend={{ value: 2, isPositive: true, period: "this week" }}
          />
          <StatCard
            title="Total Engagement"
            value={totalEngagement.toString()}
            description="Likes, comments, shares"
            icon={Heart}
            trend={{ value: 15, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            description="Content reach"
            icon={Eye}
            trend={{ value: 12, isPositive: true, period: "vs last month" }}
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
              Navigate to related sections for content management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        {/* Posts Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Posts Management
            </CardTitle>
            <CardDescription>
              View and manage all your social media posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts ({posts.length})</SelectItem>
                  <SelectItem value="published">Published ({publishedPosts.length})</SelectItem>
                  <SelectItem value="scheduled">Scheduled ({scheduledPosts.length})</SelectItem>
                  <SelectItem value="draft">Draft ({draftPosts.length})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-gray-50">
                        {getStatusIcon(post.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {getStatusBadge(post.status)}
                          <Badge variant="outline">{post.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateTime(post.scheduledFor)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{post.platforms.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{getCampaignName(post.campaignId)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{post.engagement.likes}</div>
                      <div className="text-sm text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{post.engagement.comments}</div>
                      <div className="text-sm text-muted-foreground">Comments</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{post.engagement.shares}</div>
                      <div className="text-sm text-muted-foreground">Shares</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{post.engagement.views}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg">{post.agent}</div>
                      <div className="text-sm text-muted-foreground">Agent</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Platforms:</span>
                      <div className="flex items-center gap-1">
                        {post.platforms.map(platform => (
                          <div key={platform} className="flex items-center gap-1">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Tags:</span>
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function SocialPostsPage() {
  return (
    <SocialMediaProvider>
      <SocialPostsContent />
    </SocialMediaProvider>
  );
} 