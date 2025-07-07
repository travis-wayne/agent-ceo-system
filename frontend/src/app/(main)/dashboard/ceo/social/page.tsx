"use client";

import React, { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, MessageSquare, Calendar, Target, BarChart3, Settings, RefreshCw } from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";
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

function SocialMediaPageContent() {
  const { accounts, posts, campaigns, refreshData, isLoading } = useSocialMedia();
  const [openCampaignModal, setOpenCampaignModal] = React.useState(false);
  const [openSettingsModal, setOpenSettingsModal] = React.useState(false);

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    const totalPosts = posts.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const avgEngagement = accounts.reduce((sum, acc) => sum + acc.engagement, 0) / accounts.length || 0;

    return {
      totalFollowers,
      totalPosts,
      activeCampaigns,
      avgEngagement
    };
  }, [accounts, posts, campaigns]);

  const headerActions = useMemo(() => [
    {
      label: "Refresh Data",
      variant: "outline" as const,
      icon: RefreshCw,
      onClick: refreshData,
      disabled: isLoading,
    },
    {
      label: "Settings",
      variant: "outline" as const,
      icon: Settings,
      onClick: () => setOpenSettingsModal(true),
    },
    {
      label: "New Campaign",
      variant: "default" as const,
      icon: Plus,
      onClick: () => setOpenCampaignModal(true),
    },
  ], [refreshData, isLoading]);

  const quickActions = useMemo(() => [
    {
      label: "Create Post",
      icon: Plus,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts?action=create"
    },
    {
      label: "Schedule Content",
      icon: Calendar,
      onClick: () => {},
      href: "/dashboard/ceo/social/calendar"
    },
    {
      label: "Generate Content",
      icon: Target,
      onClick: () => {},
      href: "/dashboard/ceo/social/generator"
    }
  ], []);

  const navigationCards = [
    {
      title: "Social Accounts",
      description: "Manage your connected social media accounts",
      icon: Users,
      href: "/dashboard/ceo/social/accounts",
      stats: `${accounts.length} accounts`,
      color: "text-blue-600"
    },
    {
      title: "Posts & Content",
      description: "View and manage your social media posts",
      icon: MessageSquare,
      href: "/dashboard/ceo/social/posts",
      stats: `${posts.length} posts`,
      color: "text-green-600"
    },
    {
      title: "Campaigns",
      description: "Track your marketing campaigns",
      icon: Target,
      href: "/dashboard/ceo/social/campaigns",
      stats: `${campaigns.length} campaigns`,
      color: "text-purple-600"
    },
    {
      title: "Analytics",
      description: "View performance metrics and insights",
      icon: BarChart3,
      href: "/dashboard/ceo/social/analytics",
      stats: "Real-time data",
      color: "text-orange-600"
    },
    {
      title: "Content Calendar",
      description: "Plan and schedule your content",
      icon: Calendar,
      href: "/dashboard/ceo/social/calendar",
      stats: "Schedule posts",
      color: "text-indigo-600"
    },
    {
      title: "Content Generator",
      description: "AI-powered content creation",
      icon: TrendingUp,
      href: "/dashboard/ceo/social/generator",
      stats: "AI-powered",
      color: "text-pink-600"
    }
  ];

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
      
      <Dialog open={openCampaignModal} onOpenChange={setOpenCampaignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Campaign</DialogTitle>
            <DialogDescription>Create a new social media campaign here.</DialogDescription>
          </DialogHeader>
          {/* Replace with your campaign form */}
          <div className="py-4">[Campaign creation form goes here]</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openSettingsModal} onOpenChange={setOpenSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Adjust your social media management settings.</DialogDescription>
          </DialogHeader>
          {/* Replace with your settings form */}
          <div className="py-4">[Settings form goes here]</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            title="Avg Engagement"
            value={`${overviewStats.avgEngagement.toFixed(1)}%`}
            description="Engagement rate"
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
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-50 ${card.color}`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {card.stats}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.slice(0, 3).map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{account.accountName}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.platform} • Last sync: {account.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{account.followers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">followers</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/dashboard/ceo/social/accounts">
                  <Button variant="outline" className="w-full">
                    View All Accounts
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function SocialMediaPage() {
  return (
    <SocialMediaProvider>
      <SocialMediaPageContent />
    </SocialMediaProvider>
  );
} 