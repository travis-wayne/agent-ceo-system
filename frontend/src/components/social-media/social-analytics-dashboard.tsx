"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Calendar,
  Target,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface AnalyticsData {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  growthRate: number;
}

interface TimeSeriesData {
  date: string;
  followers: number;
  engagement: number;
  reach: number;
  posts: number;
}

interface TopPost {
  id: string;
  content: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagementRate: number;
  publishedAt: Date;
}

const MOCK_ANALYTICS: AnalyticsData[] = [
  {
    platform: "LinkedIn",
    followers: 15600,
    engagement: 1240,
    reach: 28400,
    impressions: 45600,
    clicks: 890,
    shares: 156,
    comments: 234,
    likes: 850,
    growthRate: 12.5
  },
  {
    platform: "Twitter",
    followers: 12400,
    engagement: 980,
    reach: 22100,
    impressions: 38200,
    clicks: 650,
    shares: 120,
    comments: 180,
    likes: 680,
    growthRate: 8.7
  },
  {
    platform: "Facebook",
    followers: 8900,
    engagement: 670,
    reach: 16800,
    impressions: 29500,
    clicks: 450,
    shares: 85,
    comments: 145,
    likes: 440,
    growthRate: 6.2
  },
  {
    platform: "Instagram",
    followers: 7200,
    engagement: 890,
    reach: 18200,
    impressions: 31400,
    clicks: 520,
    shares: 95,
    comments: 210,
    likes: 585,
    growthRate: 15.3
  }
];

const MOCK_TIME_SERIES: TimeSeriesData[] = [
  { date: "Jan 1", followers: 41200, engagement: 3280, reach: 78500, posts: 12 },
  { date: "Jan 8", followers: 41800, engagement: 3450, reach: 82300, posts: 15 },
  { date: "Jan 15", followers: 42400, engagement: 3680, reach: 85600, posts: 18 },
  { date: "Jan 22", followers: 43100, engagement: 3920, reach: 88900, posts: 16 },
  { date: "Jan 29", followers: 44100, engagement: 4150, reach: 92400, posts: 20 }
];

const MOCK_TOP_POSTS: TopPost[] = [
  {
    id: "1",
    content: "🚀 Excited to announce our new AI-powered features! This breakthrough innovation...",
    platform: "LinkedIn",
    likes: 245,
    comments: 58,
    shares: 32,
    reach: 8400,
    engagementRate: 4.2,
    publishedAt: new Date("2024-01-15T10:00:00")
  },
  {
    id: "2",
    content: "💡 Industry insights: The future of automation is here. Key trends we're seeing...",
    platform: "Twitter",
    likes: 189,
    comments: 42,
    shares: 28,
    reach: 6200,
    engagementRate: 4.8,
    publishedAt: new Date("2024-01-18T14:00:00")
  },
  {
    id: "3",
    content: "🎯 Behind the scenes: How our team approaches product development...",
    platform: "Instagram",
    likes: 312,
    comments: 67,
    shares: 45,
    reach: 9800,
    engagementRate: 5.1,
    publishedAt: new Date("2024-01-20T16:30:00")
  }
];

const PLATFORM_COLORS = {
  LinkedIn: "#0077B5",
  Twitter: "#1DA1F2",
  Facebook: "#1877F2",
  Instagram: "#E4405F"
};

const ENGAGEMENT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

export default function SocialAnalyticsDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("overview");

  const filteredAnalytics = selectedPlatform === "all" 
    ? MOCK_ANALYTICS 
    : MOCK_ANALYTICS.filter(a => a.platform.toLowerCase() === selectedPlatform);

  const totalMetrics = MOCK_ANALYTICS.reduce((acc, platform) => ({
    followers: acc.followers + platform.followers,
    engagement: acc.engagement + platform.engagement,
    reach: acc.reach + platform.reach,
    impressions: acc.impressions + platform.impressions
  }), { followers: 0, engagement: 0, reach: 0, impressions: 0 });

  const avgGrowthRate = MOCK_ANALYTICS.reduce((sum, p) => sum + p.growthRate, 0) / MOCK_ANALYTICS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
            <BarChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
            <p className="text-slate-600">Track your social media performance and insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Followers</p>
                <p className="text-3xl font-bold text-slate-900">{(totalMetrics.followers / 1000).toFixed(1)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{avgGrowthRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Engagement</p>
                <p className="text-3xl font-bold text-slate-900">{(totalMetrics.engagement / 1000).toFixed(1)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+5.2%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Reach</p>
                <p className="text-3xl font-bold text-slate-900">{(totalMetrics.reach / 1000).toFixed(0)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.7%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Engagement Rate</p>
                <p className="text-3xl font-bold text-slate-900">4.2%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">-0.3%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Platform Performance */}
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="followers" fill="#8884d8" />
                    <Bar dataKey="engagement" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Distribution */}
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Engagement Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="engagement"
                    >
                      {filteredAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ENGAGEMENT_COLORS[index % ENGAGEMENT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Platform Breakdown */}
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAnalytics.map((platform, index) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: PLATFORM_COLORS[platform.platform as keyof typeof PLATFORM_COLORS] }}
                      />
                      <div>
                        <p className="font-medium">{platform.platform}</p>
                        <p className="text-sm text-slate-600">{platform.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{platform.engagement.toLocaleString()}</p>
                        <p className="text-slate-600">Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{(platform.reach / 1000).toFixed(1)}K</p>
                        <p className="text-slate-600">Reach</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-green-600">+{platform.growthRate}%</p>
                        <p className="text-slate-600">Growth</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={MOCK_TIME_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="reach" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAnalytics.map((platform) => (
                  <div key={platform.platform} className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-3">{platform.platform}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Likes</span>
                        <span className="font-medium">{platform.likes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Comments</span>
                        <span className="font-medium">{platform.comments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Shares</span>
                        <span className="font-medium">{platform.shares}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Clicks</span>
                        <span className="font-medium">{platform.clicks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_TOP_POSTS.map((post, index) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{post.platform}</Badge>
                        <span className="text-sm text-slate-500">
                          {post.publishedAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4 text-green-500" />
                          <span>{post.shares}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-purple-500" />
                          <span>{post.reach}</span>
                        </div>
                        <div className="ml-auto">
                          <Badge className="bg-green-100 text-green-800">
                            {post.engagementRate}% engagement
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 