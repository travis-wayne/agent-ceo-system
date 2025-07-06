import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Share2,
  Heart,
  MessageCircle,
  BarChart3,
  Image,
  Video,
  Link,
  Settings,
  RefreshCw,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";

export const metadata: Metadata = {
  title: "Social Posts | Agent CEO",
  description: "Manage and schedule your social media posts",
};

export default function SocialPostsPage() {
  const posts = [
    {
      id: "post_1",
      title: "The Future of AI in Business Automation",
      content: "Exploring how AI agents are revolutionizing business processes and decision-making. From customer service to strategic planning, AI is becoming an indispensable tool for modern enterprises. #AI #BusinessAutomation #Innovation",
      platforms: ["LinkedIn", "Twitter/X"],
      status: "scheduled",
      scheduledFor: "2024-01-16T09:00:00Z",
      publishedAt: null,
      type: "article",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      agent: "Content Marketing Agent",
      tags: ["AI", "BusinessAutomation", "Innovation"]
    },
    {
      id: "post_2",
      title: "Quick Tip: Lead Qualification",
      content: "💡 Pro tip: Automating your lead qualification process can increase conversion rates by up to 40%! Our AI agents can help you identify high-value prospects and prioritize your sales efforts. #BusinessAutomation #AI #Sales",
      platforms: ["Twitter/X", "LinkedIn"],
      status: "published",
      scheduledFor: "2024-01-15T14:30:00Z",
      publishedAt: "2024-01-15T14:30:00Z",
      type: "tip",
      engagement: { likes: 47, comments: 12, shares: 8, views: 1200 },
      agent: "Social Media Agent",
      tags: ["BusinessAutomation", "AI", "Sales"]
    },
    {
      id: "post_3",
      title: "Product Launch Announcement",
      content: "🚀 Excited to announce the launch of our new AI Agent Platform! Streamline your business operations with intelligent automation. Early access available now. #ProductLaunch #AI #Innovation",
      platforms: ["LinkedIn", "Twitter/X", "Facebook"],
      status: "draft",
      scheduledFor: null,
      publishedAt: null,
      type: "announcement",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      agent: "Marketing Agent",
      tags: ["ProductLaunch", "AI", "Innovation"]
    },
    {
      id: "post_4",
      title: "Customer Success Story",
      content: "📈 Amazing results from our client: 300% increase in lead generation and 50% reduction in response time using our AI agents. Real results, real impact. #CustomerSuccess #AI #Results",
      platforms: ["LinkedIn"],
      status: "published",
      scheduledFor: "2024-01-14T10:00:00Z",
      publishedAt: "2024-01-14T10:00:00Z",
      type: "case-study",
      engagement: { likes: 89, comments: 23, shares: 15, views: 3400 },
      agent: "Content Marketing Agent",
      tags: ["CustomerSuccess", "AI", "Results"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "scheduled":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "draft":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Posts", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Social Posts</h1>
              </div>
              <p className="text-muted-foreground">
                Manage and schedule your social media posts
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{posts.filter(post => post.status === 'published').length}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{posts.filter(post => post.status === 'scheduled').length}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* All Posts Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(post.status)}
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>
                            {post.platforms.join(", ")} • {post.type} • {post.agent}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {post.platforms.map((platform) => (
                        <div key={platform} className="flex items-center gap-1">
                          {getPlatformIcon(platform)}
                          <span className="text-xs">{platform}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Scheduled:</span>
                        <p className="font-medium">{formatDateTime(post.scheduledFor)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Published:</span>
                        <p className="font-medium">{formatDateTime(post.publishedAt)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <p className="font-medium">
                          ❤️ {post.engagement.likes} 💬 {post.engagement.comments} 🔄 {post.engagement.shares}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Views:</span>
                        <p className="font-medium">{post.engagement.views.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
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

          {/* Scheduled Posts Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
                <CardDescription>Posts scheduled for future publication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.filter(post => post.status === 'scheduled').map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {post.platforms.join(", ")} • {formatDateTime(post.scheduledFor)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Draft Posts</CardTitle>
                <CardDescription>Unpublished posts and drafts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.filter(post => post.status === 'draft').map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {post.platforms.join(", ")} • Draft
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
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
                  <CardTitle>Post Performance</CardTitle>
                  <CardDescription>Engagement metrics for published posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Likes</span>
                      <span className="text-sm font-medium">68</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Comments</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Shares</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Views</span>
                      <span className="text-sm font-medium">2,300</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Engagement by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <span className="text-sm font-medium">4.8% engagement</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-black" />
                        <span className="text-sm">Twitter/X</span>
                      </div>
                      <span className="text-sm font-medium">3.2% engagement</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Facebook</span>
                      </div>
                      <span className="text-sm font-medium">2.1% engagement</span>
                    </div>
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