import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Sparkles,
  MessageSquare,
  Image,
  Video,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Share2,
  Settings,
  Bot,
  Target,
  TrendingUp,
  Users,
  Hash,
  Link,
  Eye,
  Edit,
  Trash2,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";

export const metadata: Metadata = {
  title: "Content Generator | Agent CEO",
  description: "AI-powered social media content generation and optimization",
};

export default function ContentGeneratorPage() {
  const generatedContent = [
    {
      id: "content_1",
      title: "The Future of AI in Business Automation",
      content: "🚀 Exploring how AI agents are revolutionizing business processes and decision-making. From customer service to strategic planning, AI is becoming an indispensable tool for modern enterprises.\n\nKey insights:\n• 40% increase in operational efficiency\n• 60% reduction in response times\n• Enhanced decision-making capabilities\n\n#AI #BusinessAutomation #Innovation #DigitalTransformation",
      platform: "LinkedIn",
      type: "article",
      tone: "professional",
      length: "medium",
      hashtags: ["AI", "BusinessAutomation", "Innovation", "DigitalTransformation"],
      engagement: { likes: 0, comments: 0, shares: 0 },
      status: "generated",
      agent: "Content Marketing Agent",
      generatedAt: "2024-01-15T14:30:00Z"
    },
    {
      id: "content_2",
      title: "Quick Tip: Lead Qualification",
      content: "💡 Pro tip: Automating your lead qualification process can increase conversion rates by up to 40%!\n\nOur AI agents can help you:\n✅ Identify high-value prospects\n✅ Prioritize sales efforts\n✅ Reduce manual work\n✅ Improve response times\n\nReady to transform your sales process? #BusinessAutomation #AI #Sales #LeadGeneration",
      platform: "Twitter/X",
      type: "tip",
      tone: "casual",
      length: "short",
      hashtags: ["BusinessAutomation", "AI", "Sales", "LeadGeneration"],
      engagement: { likes: 0, comments: 0, shares: 0 },
      status: "generated",
      agent: "Social Media Agent",
      generatedAt: "2024-01-15T14:25:00Z"
    },
    {
      id: "content_3",
      title: "Customer Success Story",
      content: "📈 Amazing results from our client: 300% increase in lead generation and 50% reduction in response time using our AI agents.\n\nReal results, real impact. See how AI automation can transform your business operations.\n\n#CustomerSuccess #AI #Results #BusinessTransformation",
      platform: "Facebook",
      type: "case-study",
      tone: "enthusiastic",
      length: "short",
      hashtags: ["CustomerSuccess", "AI", "Results", "BusinessTransformation"],
      engagement: { likes: 0, comments: 0, shares: 0 },
      status: "generated",
      agent: "Content Marketing Agent",
      generatedAt: "2024-01-15T14:20:00Z"
    }
  ];

  const contentTemplates = [
    {
      id: "template_1",
      name: "Thought Leadership",
      description: "Establish industry authority with insightful content",
      platforms: ["LinkedIn", "Twitter/X"],
      tone: "professional",
      length: "medium",
      tags: ["thought-leadership", "industry-insights", "expertise"]
    },
    {
      id: "template_2",
      name: "Product Announcement",
      description: "Launch new products or features with excitement",
      platforms: ["All Platforms"],
      tone: "enthusiastic",
      length: "short",
      tags: ["product-launch", "announcement", "excitement"]
    },
    {
      id: "template_3",
      name: "Quick Tips",
      description: "Share valuable insights in bite-sized content",
      platforms: ["Twitter/X", "LinkedIn"],
      tone: "casual",
      length: "short",
      tags: ["tips", "insights", "value"]
    },
    {
      id: "template_4",
      name: "Customer Success",
      description: "Highlight customer achievements and testimonials",
      platforms: ["LinkedIn", "Facebook"],
      tone: "enthusiastic",
      length: "medium",
      tags: ["customer-success", "testimonials", "results"]
    }
  ];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return <Badge className="bg-green-100 text-green-800">Generated</Badge>;
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800">Generating</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Content Generator", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
              </div>
              <p className="text-muted-foreground">
                AI-powered social media content generation and optimization
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
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
                  <p className="text-2xl font-bold">{generatedContent.length}</p>
                  <p className="text-xs text-muted-foreground">Generated Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">AI Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="generated">Generated</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Generation</CardTitle>
                  <CardDescription>Configure your content generation parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Theme</Label>
                    <Input 
                      id="topic" 
                      placeholder="e.g., AI automation, business efficiency, customer success"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Target Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="all">All Platforms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="tip">Quick Tip</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="case-study">Case Study</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Content Length</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                        <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                        <SelectItem value="long">Long (6+ sentences)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (optional)</Label>
                    <Input 
                      id="keywords" 
                      placeholder="e.g., AI, automation, efficiency, business"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-hashtags" defaultChecked />
                      <Label htmlFor="include-hashtags">Include relevant hashtags</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="optimize-engagement" defaultChecked />
                      <Label htmlFor="optimize-engagement">Optimize for engagement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-call-to-action" />
                      <Label htmlFor="include-call-to-action">Include call-to-action</Label>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Agent Selection</CardTitle>
                  <CardDescription>Choose the AI agent for content generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <Bot className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Content Marketing Agent</h4>
                        <p className="text-sm text-muted-foreground">Specializes in thought leadership and educational content</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <Bot className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Social Media Agent</h4>
                        <p className="text-sm text-muted-foreground">Creates engaging, platform-optimized content</p>
                      </div>
                      <Checkbox />
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <Bot className="h-5 w-5 text-purple-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Brand Voice Agent</h4>
                        <p className="text-sm text-muted-foreground">Maintains consistent brand voice and messaging</p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Generation Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="multiple-variations">Generate multiple variations</Label>
                        <Switch id="multiple-variations" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-schedule">Auto-schedule generated content</Label>
                        <Switch id="auto-schedule" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="optimize-timing">Optimize posting time</Label>
                        <Switch id="optimize-timing" defaultChecked />
                      </div>
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
                <CardTitle>Content Templates</CardTitle>
                <CardDescription>Pre-built templates for common content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {contentTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Platforms:</span>
                            <p className="font-medium">{template.platforms.join(", ")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tone:</span>
                            <p className="font-medium capitalize">{template.tone}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Length:</span>
                            <p className="font-medium capitalize">{template.length}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generated Tab */}
          <TabsContent value="generated" className="space-y-6">
            <div className="grid gap-6">
              {generatedContent.map((content) => (
                <Card key={content.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {getPlatformIcon(content.platform)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          <CardDescription>
                            {content.platform} • {content.type} • {content.agent}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(content.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <p className="text-sm whitespace-pre-wrap">{content.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {content.hashtags.map((hashtag) => (
                        <Badge key={hashtag} variant="outline" className="text-xs">
                          #{hashtag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tone:</span>
                        <p className="font-medium capitalize">{content.tone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Length:</span>
                        <p className="font-medium capitalize">{content.length}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Generated:</span>
                        <p className="font-medium">{formatDateTime(content.generatedAt)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <p className="font-medium">
                          ❤️ {content.engagement.likes} 💬 {content.engagement.comments} 🔄 {content.engagement.shares}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generator Settings</CardTitle>
                <CardDescription>Configure AI content generation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Content Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Include emojis in content</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-generate hashtags</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include call-to-action</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Optimize for platform algorithms</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">AI Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="creativity-level">Creativity Level</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-length">Maximum Length</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (280 chars)</SelectItem>
                          <SelectItem value="medium">Medium (500 chars)</SelectItem>
                          <SelectItem value="long">Long (1000 chars)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 