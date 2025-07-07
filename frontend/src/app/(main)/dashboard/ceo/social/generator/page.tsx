"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Link as LinkIcon,
  Eye,
  Edit,
  Trash2,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ActionButtonGroup } from "@/components/ui/action-button-group";
import { SocialMediaProvider, useSocialMedia } from "@/lib/contexts/social-media-context";

function ContentGeneratorContent() {
  const { campaigns, refreshData, isLoading } = useSocialMedia();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generationSettings, setGenerationSettings] = useState({
    platform: "LinkedIn",
    tone: "professional",
    length: "medium",
    includeHashtags: true,
    includeEmojis: true,
    targetAudience: "business-professionals"
  });

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

  const headerActions = useMemo(() => [
    {
      label: "Settings",
      variant: "outline" as const,
      icon: Settings,
      onClick: () => {},
    },
    {
      label: "Generate Content",
      variant: "default" as const,
      icon: Sparkles,
      onClick: () => {},
    },
  ], []);

  const quickActions = useMemo(() => [
    {
      label: "View Posts",
      icon: MessageSquare,
      onClick: () => {},
      href: "/dashboard/ceo/social/posts"
    },
    {
      label: "Schedule Content",
      icon: Calendar,
      onClick: () => {},
      href: "/dashboard/ceo/social/calendar"
    },
    {
      label: "View Analytics",
      icon: BarChart3,
      onClick: () => {},
      href: "/dashboard/ceo/social/analytics"
    }
  ], []);

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
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="Content Generator"
          description="AI-powered social media content generation and optimization for all platforms"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Generator" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Generated Content"
            value={generatedContent.length.toString()}
            description="AI-created posts"
            icon={Sparkles}
            trend={{ value: 5, isPositive: true, period: "this week" }}
          />
          <StatCard
            title="Templates Available"
            value={contentTemplates.length.toString()}
            description="Content templates"
            icon={Target}
          />
          <StatCard
            title="Success Rate"
            value="92%"
            description="Generation success"
            icon={CheckCircle}
            trend={{ value: 3, isPositive: true, period: "vs last month" }}
          />
          <StatCard
            title="Time Saved"
            value="24h"
            description="This month"
            icon={Clock}
            trend={{ value: 6, isPositive: true, period: "vs last month" }}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Navigate to related sections for content management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Content Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate New Content
              </CardTitle>
              <CardDescription>
                Create AI-powered content for your social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <Label htmlFor="template">Content Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generation Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={generationSettings.platform} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, platform: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={generationSettings.tone} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, tone: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="length">Content Length</Label>
                  <Select value={generationSettings.length} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, length: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={generationSettings.targetAudience} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, targetAudience: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business-professionals">Business Professionals</SelectItem>
                      <SelectItem value="general-audience">General Audience</SelectItem>
                      <SelectItem value="tech-enthusiasts">Tech Enthusiasts</SelectItem>
                      <SelectItem value="decision-makers">Decision Makers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hashtags" 
                    checked={generationSettings.includeHashtags}
                    onCheckedChange={(checked) => 
                      setGenerationSettings(prev => ({ ...prev, includeHashtags: checked as boolean }))
                    }
                  />
                  <Label htmlFor="hashtags">Include hashtags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="emojis" 
                    checked={generationSettings.includeEmojis}
                    onCheckedChange={(checked) => 
                      setGenerationSettings(prev => ({ ...prev, includeEmojis: checked as boolean }))
                    }
                  />
                  <Label htmlFor="emojis">Include emojis</Label>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
                <Textarea 
                  id="prompt"
                  placeholder="Enter specific instructions for content generation..."
                  className="min-h-[100px]"
                />
              </div>

              <Button className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </CardContent>
          </Card>

          {/* Content Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Content Templates
              </CardTitle>
              <CardDescription>
                Choose from pre-built templates for different content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentTemplates.map(template => (
                  <Card key={template.id} className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedTemplate(template.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{template.name}</h4>
                      <Badge variant="outline">{template.length}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Platforms:</span>
                        <div className="flex gap-1">
                          {template.platforms.map(platform => (
                            <div key={platform} className="flex items-center">
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Recently Generated Content
            </CardTitle>
            <CardDescription>
              Your AI-generated content ready for review and publishing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.map(content => (
                <Card key={content.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-green-50">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{content.title}</h3>
                          {getStatusBadge(content.status)}
                          <Badge variant="outline">{content.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            {getPlatformIcon(content.platform)}
                            <span>{content.platform}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDateTime(content.generatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bot className="h-4 w-4" />
                            <span>{content.agent}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm whitespace-pre-wrap line-clamp-4">
                            {content.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Tags:</span>
                          <div className="flex gap-1">
                            {content.hashtags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Link href={`/dashboard/ceo/social/posts?action=create&content=${content.id}`}>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function ContentGeneratorPage() {
  return (
    <SocialMediaProvider>
      <ContentGeneratorContent />
    </SocialMediaProvider>
  );
} 