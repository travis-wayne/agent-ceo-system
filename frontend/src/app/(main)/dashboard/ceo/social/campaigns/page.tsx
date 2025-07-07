"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  Share2,
  Settings,
  Play,
  Pause,
  Square,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  RefreshCw
} from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";

function SocialCampaignsContent() {
  const { campaigns, setSelectedCampaign, refreshData, isLoading } = useSocialMedia();
  const [activeTab, setActiveTab] = useState("active");

  const campaignData = [
    {
      id: "campaign_1",
      name: "Product Launch - AI Agent Platform",
      description: "Comprehensive campaign to launch our new AI Agent Platform with targeted messaging across multiple platforms",
      platforms: ["LinkedIn", "Twitter/X", "Facebook"],
      status: "active",
      startDate: "2024-01-10T00:00:00Z",
      endDate: "2024-01-24T00:00:00Z",
      duration: "14 days",
      budget: 2500,
      spent: 1840,
      reach: 45200,
      impressions: 67800,
      engagement: 6.8,
      conversions: 127,
      posts: 8,
      agent: "Marketing Campaign Agent",
      targetAudience: "Business leaders, CTOs, IT professionals",
      goals: ["Increase brand awareness", "Generate leads", "Drive platform adoption"]
    },
    {
      id: "campaign_2",
      name: "Thought Leadership Series",
      description: "Weekly thought leadership content focusing on AI trends and business automation insights",
      platforms: ["LinkedIn", "Twitter/X"],
      status: "active",
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-03-31T00:00:00Z",
      duration: "90 days",
      budget: 1500,
      spent: 890,
      reach: 28900,
      impressions: 43200,
      engagement: 4.2,
      conversions: 89,
      posts: 12,
      agent: "Content Marketing Agent",
      targetAudience: "Executives, decision makers, industry professionals",
      goals: ["Establish thought leadership", "Build credibility", "Generate engagement"]
    },
    {
      id: "campaign_3",
      name: "Customer Success Stories",
      description: "Highlighting customer success stories and case studies to build trust and credibility",
      platforms: ["LinkedIn", "Facebook"],
      status: "completed",
      startDate: "2023-12-01T00:00:00Z",
      endDate: "2023-12-31T00:00:00Z",
      duration: "30 days",
      budget: 800,
      spent: 800,
      reach: 15600,
      impressions: 23400,
      engagement: 5.1,
      conversions: 45,
      posts: 6,
      agent: "Customer Success Agent",
      targetAudience: "Prospective customers, industry peers",
      goals: ["Build trust", "Showcase results", "Generate testimonials"]
    },
    {
      id: "campaign_4",
      name: "Holiday Promotion",
      description: "Special holiday promotion campaign with limited-time offers and seasonal messaging",
      platforms: ["Instagram", "Facebook", "Twitter/X"],
      status: "draft",
      startDate: "2024-12-01T00:00:00Z",
      endDate: "2024-12-31T00:00:00Z",
      duration: "30 days",
      budget: 1200,
      spent: 0,
      reach: 0,
      impressions: 0,
      engagement: 0,
      conversions: 0,
      posts: 0,
      agent: "Promotional Agent",
      targetAudience: "General audience, holiday shoppers",
      goals: ["Increase sales", "Promote offers", "Seasonal engagement"]
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
      label: "New Campaign",
      variant: "default" as const,
      icon: Plus,
      onClick: () => {},
    },
  ], [refreshData, isLoading]);

  const quickActions = useMemo(() => [
    {
      label: "View Analytics",
      icon: BarChart3,
      onClick: () => {},
      href: "/dashboard/ceo/social/analytics"
    },
    {
      label: "View Posts",
      icon: MessageSquare,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts"
    },
    {
      label: "Schedule Content",
      icon: Calendar,
      onClick: () => {},
      href: "/dashboard/ceo/social/calendar"
    }
  ], []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "draft":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "paused":
        return <Pause className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (campaign: any) => {
    if (campaign.status === 'completed') return 100;
    if (campaign.status === 'draft') return 0;
    
    const start = new Date(campaign.startDate).getTime();
    const end = new Date(campaign.endDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const activeCampaigns = campaignData.filter(c => c.status === 'active');
  const completedCampaigns = campaignData.filter(c => c.status === 'completed');
  const draftCampaigns = campaignData.filter(c => c.status === 'draft');

  const totalBudget = campaignData.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaignData.reduce((sum, c) => sum + c.spent, 0);
  const totalReach = campaignData.reduce((sum, c) => sum + c.reach, 0);
  const totalConversions = campaignData.reduce((sum, c) => sum + c.conversions, 0);

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Social Campaigns"
          description="Manage your social media campaigns and marketing initiatives across all platforms"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Campaigns" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Budget"
            value={`$${totalBudget.toLocaleString()}`}
            description="Allocated budget"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Spent"
            value={`$${totalSpent.toLocaleString()}`}
            description="Campaign spending"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Total Reach"
            value={totalReach.toLocaleString()}
            description="People reached"
            icon={Users}
            trend={{ value: 8, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Conversions"
            value={totalConversions.toString()}
            description="Total conversions"
            icon={Target}
            trend={{ value: 5, isPositive: true, period: "vs last month" }}
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
              Navigate to related sections for campaign management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        {/* Campaigns Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Management
            </CardTitle>
            <CardDescription>
              View and manage your social media campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">
                  Active ({activeCampaigns.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedCampaigns.length})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Draft ({draftCampaigns.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <div className="grid gap-4">
                  {activeCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-green-50">
                            <Target className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              {getStatusBadge(campaign.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {campaign.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{campaign.platforms.join(', ')}</span>
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
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">${campaign.spent.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Spent of ${campaign.budget.toLocaleString()}</div>
                          <Progress value={(campaign.spent / campaign.budget) * 100} className="mt-2" />
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.reach.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Reach</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.conversions}</div>
                          <div className="text-sm text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.posts}</div>
                          <div className="text-sm text-muted-foreground">Posts</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Progress:</span>
                          <div className="flex-1 min-w-[200px]">
                            <Progress value={calculateProgress(campaign)} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{calculateProgress(campaign)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {campaign.platforms.map(platform => (
                            <div key={platform} className="flex items-center gap-1">
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-4">
                  {completedCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-blue-50">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              {getStatusBadge(campaign.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {campaign.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{campaign.platforms.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/ceo/social/analytics?campaign=${campaign.id}`}>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              View Results
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">${campaign.spent.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Spent</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.reach.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Reach</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.conversions}</div>
                          <div className="text-sm text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.engagement}%</div>
                          <div className="text-sm text-muted-foreground">Avg Engagement</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="draft" className="space-y-4">
                <div className="grid gap-4">
                  {draftCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-gray-50">
                            <Clock className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              {getStatusBadge(campaign.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {campaign.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{campaign.platforms.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Launch
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">${campaign.budget.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Budget</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.duration}</div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">{campaign.platforms.length}</div>
                          <div className="text-sm text-muted-foreground">Platforms</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-lg">-</div>
                          <div className="text-sm text-muted-foreground">Not Started</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function SocialCampaignsPage() {
  return (
    <SocialMediaProvider>
      <SocialCampaignsContent />
    </SocialMediaProvider>
  );
} 