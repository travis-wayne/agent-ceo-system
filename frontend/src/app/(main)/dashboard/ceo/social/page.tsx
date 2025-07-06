import { Suspense } from "react";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, MessageSquare, Calendar, Target, BarChart3 } from "lucide-react";
import ContentGenerator from "@/components/social-media/content-generator";
import SocialAccountsManager from "@/components/social-media/social-accounts-manager";
import SocialMediaOverview from "@/components/social-media/social-media-overview";
import SocialPostsManager from "@/components/social-media/social-posts-manager";
import SocialCampaignsManager from "@/components/social-media/social-campaigns-manager";
import SocialCalendar from "@/components/social-media/social-calendar";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { TabbedContentLayout } from "@/components/ui/tabbed-content-layout";

export const metadata: Metadata = {
  title: "Social Media Management | Agent CEO",
  description: "Manage your social media presence across multiple platforms with AI-powered content generation, scheduling, and analytics.",
};

export default async function SocialMediaPage() {
  const headerActions = [
    {
      label: "New Campaign",
      variant: "outline" as const,
      icon: Target,
    },
    {
      label: "Create Post",
      variant: "default" as const,
      icon: Plus,
    },
  ];

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      icon: TrendingUp,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialMediaOverview />
        </Suspense>
      ),
    },
    {
      value: "accounts",
      label: "Accounts",
      icon: Users,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialAccountsManager />
        </Suspense>
      ),
    },
    {
      value: "posts",
      label: "Posts",
      icon: MessageSquare,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialPostsManager />
        </Suspense>
      ),
    },
    {
      value: "campaigns",
      label: "Campaigns",
      icon: Target,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialCampaignsManager />
        </Suspense>
      ),
    },
    {
      value: "calendar",
      label: "Calendar",
      icon: Calendar,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <SocialCalendar />
        </Suspense>
      ),
    },
    {
      value: "generator",
      label: "Generate",
      icon: Plus,
      content: (
        <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
          <ContentGenerator />
        </Suspense>
      ),
    },
    {
      value: "analytics",
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
        breadcrumbs={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", isCurrentPage: true },
        ]}
        actions={headerActions}
      />
      <main className="p-6">
        {/* Quick Stats */}
        <div className="mb-8">
          <Suspense fallback={<QuickStatsLoading />}>
            <QuickStats />
          </Suspense>
        </div>

        {/* Main Content Tabs */}
        <TabbedContentLayout
          defaultValue="overview"
          tabs={tabs}
          className="space-y-6"
        />
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
        <StatCard key={index} {...stat} />
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