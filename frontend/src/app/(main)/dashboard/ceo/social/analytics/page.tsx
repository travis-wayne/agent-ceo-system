import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
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
  Settings
} from "lucide-react";

export const metadata: Metadata = {
  title: "Social Analytics | Agent CEO",
  description: "Comprehensive social media analytics and performance insights",
};

export default function SocialAnalyticsPage() {
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

  const audienceInsights = {
    demographics: {
      ageGroups: [
        { age: "18-24", percentage: 12 },
        { age: "25-34", percentage: 28 },
        { age: "35-44", percentage: 34 },
        { age: "45-54", percentage: 18 },
        { age: "55+", percentage: 8 }
      ],
      gender: [
        { gender: "Male", percentage: 58 },
        { gender: "Female", percentage: 42 }
      ],
      locations: [
        { location: "United States", percentage: 45 },
        { location: "United Kingdom", percentage: 18 },
        { location: "Canada", percentage: 12 },
        { location: "Australia", percentage: 8 },
        { location: "Other", percentage: 17 }
      ]
    },
    interests: ["Technology", "Business", "Marketing", "AI", "Automation", "Leadership"]
  };

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
              <Select defaultValue="30days">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalFollowers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalPosts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.totalEngagement.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{overviewStats.avgEngagementRate}%</p>
                  <p className="text-xs text-muted-foreground">Avg Engagement Rate</p>
                </div>
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Key metrics across all platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Reach</span>
                      <span className="text-sm font-medium">{overviewStats.totalReach.toLocaleString()}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Impressions</span>
                      <span className="text-sm font-medium">{overviewStats.totalImpressions.toLocaleString()}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Clicks</span>
                      <span className="text-sm font-medium">{overviewStats.totalClicks.toLocaleString()}</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">{overviewStats.conversionRate}%</span>
                    </div>
                    <Progress value={21} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Trends</CardTitle>
                  <CardDescription>Monthly follower growth and engagement trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Follower Growth</span>
                      </div>
                      <span className="text-sm font-medium">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Engagement Rate</span>
                      </div>
                      <span className="text-sm font-medium">+0.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Reach</span>
                      </div>
                      <span className="text-sm font-medium">+18.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Impressions</span>
                      </div>
                      <span className="text-sm font-medium">-2.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid gap-6">
              {platformStats.map((platform) => (
                <Card key={platform.platform} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`h-12 w-12 rounded-lg ${platform.bgColor} flex items-center justify-center`}>
                          <platform.icon className={`h-6 w-6 ${platform.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.platform}</CardTitle>
                          <CardDescription>
                            {platform.followers.toLocaleString()} followers • {platform.posts} posts
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(platform.trendUp)}
                        <Badge className={platform.trendUp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {platform.trend}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Engagement</span>
                        <p className="font-medium">{platform.engagement.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Engagement Rate</span>
                        <p className="font-medium">{platform.engagementRate}%</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Reach</span>
                        <p className="font-medium">{platform.reach.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Impressions</span>
                        <p className="font-medium">{platform.impressions.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Detailed Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Posts
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Posts with the highest engagement and reach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {post.platform} • {post.type} • {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">{post.engagement}</p>
                          <p className="text-xs text-muted-foreground">engagement</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{post.reach.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">reach</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{post.engagementRate}%</p>
                          <p className="text-xs text-muted-foreground">rate</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Age Demographics</CardTitle>
                  <CardDescription>Age distribution of your audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceInsights.demographics.ageGroups.map((ageGroup) => (
                      <div key={ageGroup.age} className="flex items-center justify-between">
                        <span className="text-sm">{ageGroup.age}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={ageGroup.percentage} className="w-24 h-2" />
                          <span className="text-sm font-medium">{ageGroup.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top locations of your audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceInsights.demographics.locations.map((location) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <span className="text-sm">{location.location}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={location.percentage} className="w-24 h-2" />
                          <span className="text-sm font-medium">{location.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Gender breakdown of your audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceInsights.demographics.gender.map((gender) => (
                      <div key={gender.gender} className="flex items-center justify-between">
                        <span className="text-sm">{gender.gender}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={gender.percentage} className="w-24 h-2" />
                          <span className="text-sm font-medium">{gender.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Interests</CardTitle>
                  <CardDescription>Interests and topics your audience engages with</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {audienceInsights.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
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