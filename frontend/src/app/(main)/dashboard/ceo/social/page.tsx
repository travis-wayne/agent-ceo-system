import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Bot, 
  Calendar, 
  Zap, 
  BarChart3,
  Plus,
  Image,
  Video
} from "lucide-react";

export const metadata: Metadata = {
  title: "Social Media Management | Agent CEO",
  description: "AI-powered social media management and content automation",
};

export default function SocialPage() {
  // Mock social media data
  const platforms = [
    {
      name: "LinkedIn",
      status: "connected",
      followers: "12.5K",
      engagement: "4.8%",
      posts: 156,
      icon: "💼",
      color: "bg-blue-600"
    },
    {
      name: "Twitter/X", 
      status: "connected",
      followers: "8.2K",
      engagement: "3.2%",
      posts: 287,
      icon: "🐦",
      color: "bg-black"
    },
    {
      name: "Facebook",
      status: "pending",
      followers: "0",
      engagement: "0%",
      posts: 0,
      icon: "📘",
      color: "bg-blue-500"
    },
    {
      name: "Instagram",
      status: "disconnected",
      followers: "0", 
      engagement: "0%",
      posts: 0,
      icon: "📷",
      color: "bg-purple-500"
    }
  ];

  const contentQueue = [
    {
      id: "content-001",
      platform: "LinkedIn",
      type: "article",
      title: "The Future of AI in Business Automation",
      content: "Exploring how AI agents are revolutionizing business processes...",
      scheduledFor: "2024-01-16T09:00:00Z",
      status: "scheduled",
      agent: "Content Marketing Agent",
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: "content-002",
      platform: "Twitter/X", 
      type: "tweet",
      title: "Quick Tip",
      content: "💡 Pro tip: Automating your lead qualification process can increase conversion rates by up to 40%! #BusinessAutomation #AI",
      scheduledFor: "2024-01-15T14:30:00Z",
      status: "published",
      agent: "Social Media Agent",
      engagement: { likes: 47, comments: 12, shares: 8 }
    }
  ];

  const campaigns = [
    {
      id: "campaign-001",
      name: "Product Launch - AI Agent Platform",
      platforms: ["LinkedIn", "Twitter/X"],
      status: "active",
      duration: "14 days",
      reach: "45.2K",
      engagement: "6.8%",
      conversions: 127,
      budget: "$2,500",
      spent: "$1,840"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="default" className="bg-green-500 text-white">Connected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "disconnected":
        return <Badge variant="outline">Disconnected</Badge>;
      case "scheduled":
        return <Badge variant="default" className="bg-blue-500 text-white">Scheduled</Badge>;
      case "published":
        return <Badge variant="default" className="bg-green-500 text-white">Published</Badge>;
      case "active":
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Social Media", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Social Media Management</h1>
            <p className="text-muted-foreground">
              AI-powered social media management and content automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bot className="h-4 w-4" />
              AI Content Generator
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Social Media Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20.7K</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">+0.6% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts This Month</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">+23 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64%</div>
              <p className="text-xs text-muted-foreground">AI-generated content</p>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Management Tabs */}
        <Tabs defaultValue="platforms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="content">Content Queue</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platforms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>Manage your social media platform connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${platform.color} flex items-center justify-center text-white text-lg`}>
                            {platform.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{platform.name}</h3>
                            {getStatusBadge(platform.status)}
                          </div>
                        </div>
                      </div>
                      
                      {platform.status === "connected" && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold">{platform.followers}</div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{platform.engagement}</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{platform.posts}</div>
                            <div className="text-xs text-muted-foreground">Posts</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-2">
                        {platform.status === "connected" ? (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">Manage</Button>
                            <Button variant="outline" size="sm">Disconnect</Button>
                          </>
                        ) : (
                          <Button size="sm" className="flex-1">Connect</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Queue</CardTitle>
                <CardDescription>Manage your scheduled and published content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentQueue.map((content) => (
                    <div key={content.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{content.platform}</Badge>
                            <Badge variant="outline">{content.type}</Badge>
                            {getStatusBadge(content.status)}
                          </div>
                          <h3 className="font-semibold">{content.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {content.content.length > 100 
                              ? content.content.substring(0, 100) + "..." 
                              : content.content
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {content.status === "scheduled" 
                              ? `Scheduled for ${new Date(content.scheduledFor).toLocaleDateString()}`
                              : "Published"
                            }
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            by {content.agent}
                          </div>
                        </div>
                      </div>
                      
                      {content.status === "published" && (
                        <div className="flex gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {content.engagement.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {content.engagement.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            {content.engagement.shares}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        {content.status === "scheduled" && (
                          <Button variant="outline" size="sm">Reschedule</Button>
                        )}
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Campaigns</CardTitle>
                <CardDescription>Manage your multi-platform marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <div className="flex gap-2 mt-2">
                            {campaign.platforms.map((platform) => (
                              <Badge key={platform} variant="outline">{platform}</Badge>
                            ))}
                            {getStatusBadge(campaign.status)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Duration: {campaign.duration}</div>
                          <div className="text-sm text-muted-foreground">Budget: {campaign.budget}</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.reach}</div>
                          <div className="text-sm text-muted-foreground">Reach</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.engagement}</div>
                          <div className="text-sm text-muted-foreground">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{campaign.conversions}</div>
                          <div className="text-sm text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.spent}</div>
                          <div className="text-sm text-muted-foreground">Spent</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Edit Campaign</Button>
                        <Button variant="outline" size="sm">Analytics</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Analytics</CardTitle>
                <CardDescription>Comprehensive analytics across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Social Analytics</h3>
                  <p className="text-muted-foreground">
                    Coming soon - Comprehensive social media analytics with AI insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Content Generation */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Content Assistant
            </CardTitle>
            <CardDescription>Let AI help you create engaging social media content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Image className="h-8 w-8" />
                <div className="font-medium">Generate Visual Content</div>
                <div className="text-xs text-muted-foreground">AI-powered image and graphics</div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <MessageCircle className="h-8 w-8" />
                <div className="font-medium">Write Captions</div>
                <div className="text-xs text-muted-foreground">Engaging captions and copy</div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Calendar className="h-8 w-8" />
                <div className="font-medium">Content Calendar</div>
                <div className="text-xs text-muted-foreground">30-day content planning</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Enhanced Social Media Management</h3>
                <p className="text-sm text-muted-foreground">
                  Building on your existing ads functionality with comprehensive social media automation.
                  Your current ad campaigns and performance data remain accessible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 