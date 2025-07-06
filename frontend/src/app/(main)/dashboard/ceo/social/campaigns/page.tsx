import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Youtube
} from "lucide-react";

export const metadata: Metadata = {
  title: "Social Campaigns | Agent CEO",
  description: "Manage your social media campaigns and marketing initiatives",
};

export default function SocialCampaignsPage() {
  const campaigns = [
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

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Campaigns", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Social Campaigns</h1>
              </div>
              <p className="text-muted-foreground">
                Manage your social media campaigns and marketing initiatives
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                  <p className="text-xs text-muted-foreground">Total Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Reach</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* All Campaigns Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(campaign.status)}
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <CardDescription>
                            {campaign.platforms.join(", ")} • {campaign.duration} • {campaign.agent}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(campaign.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {campaign.platforms.map((platform) => (
                        <div key={platform} className="flex items-center gap-1">
                          {getPlatformIcon(platform)}
                          <span className="text-xs">{platform}</span>
                        </div>
                      ))}
                    </div>

                    {campaign.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{calculateProgress(campaign)}%</span>
                        </div>
                        <Progress value={calculateProgress(campaign)} className="h-2" />
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Spent:</span>
                        <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reach:</span>
                        <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <p className="font-medium">{campaign.engagement}%</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm mt-4">
                      <div>
                        <span className="text-muted-foreground">Conversions:</span>
                        <p className="font-medium">{campaign.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Posts:</span>
                        <p className="font-medium">{campaign.posts}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start Date:</span>
                        <p className="font-medium">{formatDate(campaign.startDate)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date:</span>
                        <p className="font-medium">{formatDate(campaign.endDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {campaign.status === 'active' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Campaigns Tab */}
          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Currently running campaigns and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.filter(c => c.status === 'active').map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Play className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {campaign.platforms.join(", ")} • {calculateProgress(campaign)}% complete
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">${campaign.spent.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">spent</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{campaign.reach.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">reach</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Overall campaign metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Reach</span>
                      <span className="text-sm font-medium">104.7K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Impressions</span>
                      <span className="text-sm font-medium">156.8K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Engagement</span>
                      <span className="text-sm font-medium">5.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Conversions</span>
                      <span className="text-sm font-medium">261</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                  <CardDescription>Campaign spending and ROI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Budget</span>
                      <span className="text-sm font-medium">$6,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Spent</span>
                      <span className="text-sm font-medium">$3,530</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Remaining Budget</span>
                      <span className="text-sm font-medium">$2,470</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cost per Conversion</span>
                      <span className="text-sm font-medium">$13.52</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Templates</CardTitle>
                <CardDescription>Pre-built campaign templates for common marketing initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Product Launch</CardTitle>
                      <CardDescription>Comprehensive product launch campaign</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <p className="font-medium">14 days</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platforms:</span>
                          <p className="font-medium">LinkedIn, Twitter/X, Facebook</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">$2,500</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Thought Leadership</CardTitle>
                      <CardDescription>Establish industry authority and credibility</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <p className="font-medium">90 days</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platforms:</span>
                          <p className="font-medium">LinkedIn, Twitter/X</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">$1,500</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Holiday Promotion</CardTitle>
                      <CardDescription>Seasonal promotional campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <p className="font-medium">30 days</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platforms:</span>
                          <p className="font-medium">Instagram, Facebook, Twitter/X</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">$1,200</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 