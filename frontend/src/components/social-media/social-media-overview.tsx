"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2,
  Eye,
  Calendar,
  Target,
  BarChart3,
  Activity
} from "lucide-react";

interface OverviewMetrics {
  totalAccounts: number;
  totalFollowers: number;
  postsThisMonth: number;
  avgEngagementRate: number;
  topPerformingPosts: any[];
  platformDistribution: Record<string, number>;
  performanceTrend: any[];
  recentActivity: any[];
}

export default function SocialMediaOverview() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchOverviewData();
  }, [timeRange]);

  async function fetchOverviewData() {
    try {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      const mockData: OverviewMetrics = {
        totalAccounts: 8,
        totalFollowers: 45600,
        postsThisMonth: 127,
        avgEngagementRate: 4.8,
        topPerformingPosts: [
          {
            id: "1",
            content: "🚀 Exciting product launch announcement! Our new AI-powered features are now live...",
            platform: "LINKEDIN",
            engagement: 892,
            reach: 12400,
            publishedAt: new Date("2024-01-15"),
            engagementRate: 7.2
          },
          {
            id: "2", 
            content: "Behind the scenes of our latest project! The team has been working incredibly hard...",
            platform: "TWITTER",
            engagement: 634,
            reach: 8900,
            publishedAt: new Date("2024-01-14"),
            engagementRate: 7.1
          },
          {
            id: "3",
            content: "Industry insights: The future of AI in business operations is here! 🤖✨",
            platform: "FACEBOOK",
            engagement: 445,
            reach: 6200,
            publishedAt: new Date("2024-01-13"),
            engagementRate: 7.0
          }
        ],
        platformDistribution: {
          LINKEDIN: 3,
          TWITTER: 2,
          FACEBOOK: 2,
          INSTAGRAM: 1
        },
        performanceTrend: [
          { date: "2024-01-01", engagement: 420, reach: 5200, followers: 44200 },
          { date: "2024-01-08", engagement: 480, reach: 6100, followers: 44800 },
          { date: "2024-01-15", engagement: 520, reach: 6800, followers: 45200 },
          { date: "2024-01-22", engagement: 580, reach: 7200, followers: 45600 }
        ],
        recentActivity: [
          { type: "post_published", platform: "LINKEDIN", content: "New blog post published", time: "2 hours ago" },
          { type: "campaign_started", platform: "TWITTER", content: "Q1 Campaign launched", time: "4 hours ago" },
          { type: "account_connected", platform: "INSTAGRAM", content: "New account connected", time: "1 day ago" },
          { type: "analytics_milestone", platform: "FACEBOOK", content: "10K followers reached", time: "2 days ago" }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockData);
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <OverviewLoading />;
  }

  if (!metrics) {
    return <div>Error loading overview data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Reach</p>
                <p className="text-2xl font-bold text-blue-900">
                  {(metrics.totalFollowers + 12400).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% this month
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Engagement</p>
                <p className="text-2xl font-bold text-green-900">
                  {metrics.avgEngagementRate}%
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.3% this month
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Posts Published</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.postsThisMonth}</p>
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% this month
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-orange-900">4</p>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3" />
                  2 ending soon
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Performing Posts */}
        <Card className="lg:col-span-2 shadow-md border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Performing Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.topPerformingPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-slate-900 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.engagement} engagements
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.reach.toLocaleString()} reach
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-lg font-bold text-green-600">
                    {post.engagementRate}%
                  </div>
                  <div className="text-xs text-slate-500">
                    engagement rate
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Platform Distribution & Recent Activity */}
        <div className="space-y-6">
          {/* Platform Distribution */}
          <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(metrics.platformDistribution).map(([platform, count]) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{platform}</span>
                    <span className="text-slate-600">{count} accounts</span>
                  </div>
                  <Progress 
                    value={(count / metrics.totalAccounts) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{activity.content}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.platform}
                      </Badge>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Trend Chart Placeholder */}
      <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Performance Trend
            </CardTitle>
            <div className="flex gap-2">
              {["7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? "default" : "outline"}
                  onClick={() => setTimeRange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-600">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-slate-400" />
              <p className="text-sm">Performance Chart</p>
              <p className="text-xs text-slate-500">Interactive chart component placeholder</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OverviewLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-8 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-md border-0">
          <CardContent className="p-6">
            <div className="h-64 bg-slate-200 rounded animate-pulse" />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="h-32 bg-slate-200 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="h-32 bg-slate-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 