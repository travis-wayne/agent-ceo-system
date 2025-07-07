"use client";

import React, { useState, useEffect } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
  Youtube,
  RefreshCw,
  ArrowRight,
  Wand2,
  Send,
  Save,
  BarChart3,
  Globe,
  Zap
} from "lucide-react";

export default function ContentGeneratorPage() {
  const { 
    accounts,
    posts,
    templates,
    generateContent,
    getContentSuggestions,
    createPost,
    isLoading
  } = useSocial();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn');
  const [contentType, setContentType] = useState('article');
  const [contentTone, setContentTone] = useState('professional');
  const [contentLength, setContentLength] = useState('medium');
  const [topic, setTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState<string[]>([]);
  const [recentGenerations, setRecentGenerations] = useState<any[]>([]);

  // Load content suggestions when platform changes
  useEffect(() => {
    loadContentSuggestions();
  }, [selectedPlatform]);

  const loadContentSuggestions = async () => {
    const suggestions = await getContentSuggestions(selectedPlatform);
    setContentSuggestions(suggestions);
  };

  const connectedAccounts = accounts.filter(acc => acc.status === 'connected');
  const availablePlatforms = connectedAccounts.map(acc => acc.platform);

  // Content generation statistics
  const generationStats = {
    totalGenerated: recentGenerations.length,
    published: recentGenerations.filter(g => g.status === 'published').length,
    saved: recentGenerations.filter(g => g.status === 'saved').length,
    avgEngagement: recentGenerations.reduce((sum, g) => sum + (g.engagement?.total || 0), 0) / Math.max(1, recentGenerations.length)
  };

  // Handle content generation
  const handleGenerateContent = async () => {
    if (!topic && !customPrompt) {
      toast.error('Please provide a topic or custom prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateContent(contentType, selectedPlatform, topic || customPrompt);
      setGeneratedContent(content);
      
      // Add to recent generations
      const newGeneration = {
        id: `gen_${Date.now()}`,
        content,
        platform: selectedPlatform,
        type: contentType,
        tone: contentTone,
        topic: topic || customPrompt,
        generatedAt: new Date().toISOString(),
        status: 'generated'
      };
      setRecentGenerations(prev => [newGeneration, ...prev.slice(0, 9)]);
      
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle saving generated content as post
  const handleSaveAsPost = async () => {
    if (!generatedContent) {
      toast.error('No content to save');
      return;
    }

    const postData = {
      title: topic || 'Generated Content',
      content: generatedContent,
      platforms: [selectedPlatform],
      type: contentType,
      status: 'draft' as const,
      agent: 'AI Content Generator',
      tags: topic ? [topic.replace(/\s+/g, '')] : []
    };

    const newPost = await createPost(postData);
    if (newPost) {
      toast.success('Content saved as draft post');
      router.push(`/dashboard/ceo/social/posts?id=${newPost.id}`);
    }
  };

  // Handle publishing content directly
  const handlePublishContent = async () => {
    if (!generatedContent) {
      toast.error('No content to publish');
      return;
    }

    const postData = {
      title: topic || 'Generated Content',
      content: generatedContent,
      platforms: [selectedPlatform],
      type: contentType,
      status: 'published' as const,
      agent: 'AI Content Generator',
      tags: topic ? [topic.replace(/\s+/g, '')] : [],
      publishedAt: new Date().toISOString()
    };

    const newPost = await createPost(postData);
    if (newPost) {
      toast.success('Content published successfully');
      router.push(`/dashboard/ceo/social/posts?id=${newPost.id}`);
    }
  };

  // Navigation helpers
  const handleViewPosts = () => {
    router.push('/dashboard/ceo/social/posts');
  };

  const handleViewCampaigns = () => {
    router.push('/dashboard/ceo/social/campaigns');
  };

  const handleViewAnalytics = () => {
    router.push('/dashboard/ceo/social/analytics');
  };

  const handleViewCalendar = () => {
    router.push('/dashboard/ceo/social/calendar');
  };

  const handleViewAccounts = () => {
    router.push('/dashboard/ceo/social/accounts');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Content copied to clipboard');
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
              <Button variant="outline" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button variant="outline" onClick={loadContentSuggestions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Ideas
              </Button>
              <Button onClick={handleGenerateContent} disabled={isGenerating}>
                {isGenerating ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Content'}
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
                  <p className="text-2xl font-bold">{generationStats.totalGenerated}</p>
                  <p className="text-xs text-muted-foreground">Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{generationStats.published}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Save className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{generationStats.saved}</p>
                  <p className="text-xs text-muted-foreground">Saved as Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{generationStats.avgEngagement.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Engagement</p>
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
                        <SelectItem value="educational">Educational</SelectItem>
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
                  {templates.map((template) => (
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
              {recentGenerations.map((content) => (
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
                        {content.status === 'generated' ? (
                          <Badge className="bg-green-100 text-green-800">Generated</Badge>
                        ) : content.status === 'generating' ? (
                          <Badge className="bg-blue-100 text-blue-800">Generating</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Failed</Badge>
                        )}
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
                        <p className="font-medium">{new Date(content.generatedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <p className="font-medium">
                          ❤️ {content.engagement?.likes || 0} 💬 {content.engagement?.comments || 0} 🔄 {content.engagement?.shares || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(content.content)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSaveAsPost()}>
                          <Save className="h-4 w-4 mr-2" />
                          Save as Draft
                        </Button>
                        <Button size="sm" onClick={() => handlePublishContent()}>
                          <Send className="h-4 w-4 mr-1" />
                          Publish Now
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