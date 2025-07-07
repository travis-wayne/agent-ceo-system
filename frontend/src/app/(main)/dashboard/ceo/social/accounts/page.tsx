"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Link as LinkIcon,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Videotape,
  Calendar,
  Target,
  BarChart3
} from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";

function SocialAccountsContent() {
  const { accounts, setSelectedAccount, refreshData, isLoading } = useSocialMedia();
  const [activeTab, setActiveTab] = useState("connected");

  const socialAccounts = [
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
      icon: Linkedin,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
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
      icon: Twitter,
      color: "text-black",
      bgColor: "bg-gray-50"
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
      icon: Facebook,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
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
      icon: Instagram,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
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
      icon: Videotape,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: "acc_6",
      platform: "TikTok",
      accountName: "Agent CEO Channel",
      username: "@agentceo",
      status: "connected",
      followers: 3400,
      following: 45,
      posts: 23,
      engagement: 2.1,
      lastSync: "1 hour ago",
      profileUrl: "https://youtube.com/@agentceo",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const availablePlatforms = [
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-600", description: "Professional networking" },
    { name: "Twitter/X", icon: Twitter, color: "text-black", description: "Microblogging platform" },
    { name: "Facebook", icon: Facebook, color: "text-blue-500", description: "Social networking" },
    { name: "Instagram", icon: Instagram, color: "text-purple-500", description: "Photo and video sharing" },
    { name: "YouTube", icon: Youtube, color: "text-red-600", description: "Video platform" },
    { name: "TikTok", icon: Videotape, color: "text-red-600", description: "Video platform" },
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
      label: "Add Account",
      variant: "default" as const,
      icon: Plus,
      onClick: () => {},
    },
  ], [refreshData, isLoading]);

  const quickActions = useMemo(() => [
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
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "disconnected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800">Disconnected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const connectedAccounts = socialAccounts.filter(acc => acc.status === "connected");
  const pendingAccounts = socialAccounts.filter(acc => acc.status === "pending");
  const disconnectedAccounts = socialAccounts.filter(acc => acc.status === "disconnected");

  const totalFollowers = connectedAccounts.reduce((sum, acc) => sum + acc.followers, 0);
  const totalPosts = connectedAccounts.reduce((sum, acc) => sum + acc.posts, 0);
  const avgEngagement = connectedAccounts.reduce((sum, acc) => sum + acc.engagement, 0) / connectedAccounts.length || 0;

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Social Accounts"
          description="Manage your social media accounts and connections across all platforms"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Accounts" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Connected Accounts"
            value={connectedAccounts.length.toString()}
            description="Active connections"
            icon={Users}
            trend={{ value: 2, isPositive: true, period: "new this month" }}
          />
          <StatCard
            title="Total Followers"
            value={totalFollowers.toLocaleString()}
            description="Combined reach"
            icon={TrendingUp}
            trend={{ value: 1200, isPositive: true, period: "this month" }}
          />
          <StatCard
            title="Total Posts"
            value={totalPosts.toString()}
            description="Published content"
            icon={MessageSquare}
            trend={{ value: 18, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Avg Engagement"
            value={`${avgEngagement.toFixed(1)}%`}
            description="Engagement rate"
            icon={Heart}
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
              Common tasks for account management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        {/* Accounts Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Management
            </CardTitle>
            <CardDescription>
              Connect and manage your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connected">
                  Connected ({connectedAccounts.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingAccounts.length})
                </TabsTrigger>
                <TabsTrigger value="available">
                  Available ({availablePlatforms.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="connected" className="space-y-4">
                <div className="grid gap-4">
                  {connectedAccounts.map((account) => (
                    <Card key={account.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${account.bgColor}`}>
                            <account.icon className={`h-6 w-6 ${account.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{account.accountName}</h3>
                              {getStatusBadge(account.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.username} • {account.platform}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last sync: {account.lastSync}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-semibold">{account.followers.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{account.posts}</div>
                            <div className="text-xs text-muted-foreground">Posts</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{account.engagement}%</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-1" />
                              Settings
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <div className="grid gap-4">
                  {pendingAccounts.map((account) => (
                    <Card key={account.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${account.bgColor}`}>
                            <account.icon className={`h-6 w-6 ${account.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{account.accountName}</h3>
                              {getStatusBadge(account.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.username} • {account.platform}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Awaiting authorization
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="available" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {availablePlatforms.map((platform) => (
                    <Card key={platform.name} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gray-50">
                            <platform.icon className={`h-6 w-6 ${platform.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{platform.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {platform.description}
                            </p>
                          </div>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
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

export default function SocialAccountsPage() {
  return (
    <SocialMediaProvider>
      <SocialAccountsContent />
    </SocialMediaProvider>
  );
} 