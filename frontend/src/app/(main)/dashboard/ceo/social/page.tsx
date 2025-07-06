import { Suspense } from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, MessageSquare, Calendar, Target, BarChart3 } from "lucide-react";
import ContentGenerator from "@/components/social-media/content-generator";
import SocialAccountsManager from "@/components/social-media/social-accounts-manager";
import SocialMediaOverview from "@/components/social-media/social-media-overview";
import SocialPostsManager from "@/components/social-media/social-posts-manager";
import SocialCampaignsManager from "@/components/social-media/social-campaigns-manager";
import SocialCalendar from "@/components/social-media/social-calendar";

export const metadata: Metadata = {
  title: "Social Media Management | Agent CEO",
  description: "Manage your social media presence across multiple platforms with AI-powered content generation, scheduling, and analytics.",
};

export default async function SocialMediaPage() {
  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", isCurrentPage: true },
        ]}
      />
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Social Media Management</h1>
              <p className="text-muted-foreground">
                Manage your social media presence across multiple platforms with AI-powered automation
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                New Campaign
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <Suspense fallback={<QuickStatsLoading />}>
            <QuickStats />
          </Suspense>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-background border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <SocialMediaOverview />
            </Suspense>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <SocialAccountsManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <SocialPostsManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <SocialCampaignsManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <SocialCalendar />
            </Suspense>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <ContentGenerator />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
              <SocialAnalyticsDashboard />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

function QuickStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border bg-card">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function QuickStats() {
  // Mock data - in production, fetch from API
  const stats = {
    totalAccounts: 8,
    totalFollowers: 45600,
    postsThisMonth: 127,
    engagementRate: 4.8
  };

  const statCards = [
    {
      title: "Connected Accounts",
      value: stats.totalAccounts.toLocaleString(),
      description: "Across 5 platforms",
      icon: Users,
      trend: "+2 this month",
      trendUp: true
    },
    {
      title: "Total Followers",
      value: stats.totalFollowers.toLocaleString(),
      description: "Combined reach",
      icon: TrendingUp,
      trend: "+1.2K this month",
      trendUp: true
    },
    {
      title: "Posts This Month",
      value: stats.postsThisMonth.toLocaleString(),
      description: "Published content",
      icon: MessageSquare,
      trend: "+18% vs last month",
      trendUp: true
    },
    {
      title: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      description: "Average engagement",
      icon: Target,
      trend: "+0.3% vs last month",
      trendUp: true
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <div className="mt-2">
              <Badge 
                variant={stat.trendUp ? "default" : "secondary"}
                className="text-xs"
              >
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Temporary placeholder component until the actual component is created
function SocialAnalyticsDashboard() {
  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Social Media Analytics</CardTitle>
        <CardDescription>Comprehensive analytics and insights for your social media performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Analytics Dashboard</h3>
          <p className="text-muted-foreground">
            This section is currently under development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 