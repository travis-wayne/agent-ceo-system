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

// Helper function for status badges
const getStatusBadge = (status: string) => {
  const statusConfig = {
    connected: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Connected" },
    pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Pending" },
    disconnected: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Disconnected" },
    error: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Error" },
    draft: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: "Draft" },
    scheduled: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Scheduled" },
    published: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Published" },
    failed: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Failed" },
    active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Active" },
    paused: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Paused" },
    completed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Completed" },
    generated: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Generated" }
  };
  
  return statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: status };
};

// Helper function to format date and time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

function ContentGeneratorContent() {
  const { campaigns, refreshCampaigns, isLoading } = useSocial();
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Content copied to clipboard");
  };

  return (
    <>
      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <PageHeaderWithActions
          title="AI Content Generator"
          description="Generate engaging social media content with AI assistance"
          breadcrumbs={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Social Media", href: "/dashboard/ceo/social" },
            { label: "Generator" },
          ]}
          actions={headerActions}
        />
      </div>
      
      <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Generated Content"
            value={generatedContent.length.toString()}
            description="AI-created posts"
            icon={Sparkles}
            trend={{ value: 3, isPositive: true, period: "this week" }}
          />
          <StatCard
            title="Active Campaigns"
            value={campaigns.filter(c => c.status === 'active').length.toString()}
            description="Running campaigns"
            icon={Target}
          />
          <StatCard
            title="Content Templates"
            value={contentTemplates.length.toString()}
            description="Available templates"
            icon={Bot}
          />
          <StatCard
            title="Generation Success"
            value="95%"
            description="Success rate"
            icon={CheckCircle}
            trend={{ value: 2, isPositive: true, period: "vs last week" }}
          />
        </div>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Common tasks for content generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonGroup actions={quickActions} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Content Generation Form */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                <Sparkles className="h-5 w-5" />
                Generate New Content
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Create AI-powered content for your social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform and Tone Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={generationSettings.platform} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, platform: value }))
                  }>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={generationSettings.tone} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, tone: value }))
                  }>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Length and Audience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="length">Content Length</Label>
                  <Select value={generationSettings.length} onValueChange={(value) => 
                    setGenerationSettings(prev => ({ ...prev, length: value }))
                  }>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
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
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
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
                  <Label htmlFor="hashtags" className="dark:text-gray-300">Include hashtags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="emojis" 
                    checked={generationSettings.includeEmojis}
                    onCheckedChange={(checked) => 
                      setGenerationSettings(prev => ({ ...prev, includeEmojis: checked as boolean }))
                    }
                  />
                  <Label htmlFor="emojis" className="dark:text-gray-300">Include emojis</Label>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="prompt" className="dark:text-gray-300">Custom Prompt (Optional)</Label>
                <Textarea 
                  id="prompt"
                  placeholder="Enter specific instructions for content generation..."
                  className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>

              <Button className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </CardContent>
          </Card>

          {/* Content Templates */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                <Target className="h-5 w-5" />
                Content Templates
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose from pre-built templates for different content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentTemplates.map(template => (
                  <Card key={template.id} className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:bg-gray-700 dark:border-gray-600"
                        onClick={() => setSelectedTemplate(template.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold dark:text-gray-100">{template.name}</h4>
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{template.length}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground dark:text-gray-400">Platforms:</span>
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
                          <Badge key={tag} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
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
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Bot className="h-5 w-5" />
              Recently Generated Content
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Your AI-generated content ready for review and publishing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.map(content => {
                const statusBadge = getStatusBadge(content.status);
                return (
                  <Card key={content.id} className="p-4 dark:bg-gray-700 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900">
                          <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold dark:text-gray-100">{content.title}</h3>
                            <Badge className={`text-xs ${statusBadge.color}`}>
                              {statusBadge.label}
                            </Badge>
                            <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{content.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400 mb-3">
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
                          <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg mb-3">
                            <p className="text-sm whitespace-pre-wrap line-clamp-4 dark:text-gray-200">
                              {content.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground dark:text-gray-400">Tags:</span>
                            <div className="flex gap-1">
                              {content.hashtags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(content.content)} className="dark:border-gray-600 dark:text-gray-300">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Link href={`/dashboard/ceo/social/posts?action=create&content=${content.id}`}>
                          <Button size="sm" className="dark:bg-blue-600 dark:hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function ContentGeneratorPage() {
  return <ContentGeneratorContent />;
} 