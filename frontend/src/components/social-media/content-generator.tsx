"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Image,
  Hash,
  MessageSquare,
  TrendingUp,
  Zap
} from "lucide-react";

interface GeneratedContent {
  content: string;
  hashtags: string[];
  platformVariations: Record<string, any>;
  aiMetadata: {
    model: string;
    prompt: string;
    confidenceScore: number;
    generatedAt: Date;
  };
}

const CONTENT_TYPES = [
  { value: "TEXT", label: "Text Post" },
  { value: "IMAGE", label: "Image Post" },
  { value: "VIDEO", label: "Video Post" },
  { value: "CAROUSEL", label: "Carousel" },
  { value: "STORY", label: "Story" },
  { value: "ARTICLE", label: "Article" }
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "authoritative", label: "Authoritative" },
  { value: "humorous", label: "Humorous" },
  { value: "inspirational", label: "Inspirational" }
];

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "marketing", label: "Marketing" }
];

const PLATFORMS = [
  { id: "TWITTER", name: "Twitter/X", icon: "𝕏", maxLength: 280 },
  { id: "LINKEDIN", name: "LinkedIn", icon: "in", maxLength: 3000 },
  { id: "FACEBOOK", name: "Facebook", icon: "f", maxLength: 2000 },
  { id: "INSTAGRAM", name: "Instagram", icon: "📷", maxLength: 2200 }
];

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("TEXT");
  const [tone, setTone] = useState("professional");
  const [industry, setIndustry] = useState("");
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(["LINKEDIN"]);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [maxLength, setMaxLength] = useState(280);
  
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    try {
      setGenerating(true);
      
      // Mock AI generation - in production, call actual API
      const mockContent: GeneratedContent = {
        content: `🚀 ${prompt}

${includeEmojis ? "✨ " : ""}This breakthrough innovation is transforming ${industry || 'our industry'}! The potential impact on business operations and customer experience is remarkable.

Key benefits:
• Enhanced efficiency and productivity
• Improved user experience
• Scalable growth opportunities
• Future-ready technology integration

What are your thoughts on this development? Share your experience below! 👇

${includeHashtags ? `#innovation #technology #${industry || 'business'} #growth #AI` : ''}`,
        hashtags: includeHashtags ? [
          "#innovation",
          "#technology", 
          "#business",
          `#${industry || 'industry'}`,
          "#growth",
          "#AI",
          "#future",
          "#digital"
        ] : [],
        platformVariations: {
          TWITTER: {
            content: `🚀 ${prompt}\n\n${includeEmojis ? "✨ " : ""}Game-changer for ${industry || 'business'}! This innovation is transforming how we work.\n\n${includeHashtags ? "#innovation #tech #AI" : ""}`,
            hashtags: includeHashtags ? ["#innovation", "#tech", "#AI"] : []
          },
          LINKEDIN: {
            content: `🚀 Exciting development: ${prompt}\n\nThis breakthrough innovation is transforming ${industry || 'our industry'}! As someone who's passionate about technological advancement, I'm thrilled to see how this will impact business operations.\n\nKey insights:\n• Enhanced operational efficiency\n• Improved customer experience\n• Scalable growth opportunities\n• Future-ready technology stack\n\nWhat's your perspective on this innovation? I'd love to hear your thoughts and experiences!\n\n${includeHashtags ? "#innovation #technology #business #growth #digitaltransformation" : ""}`,
            hashtags: includeHashtags ? ["#innovation", "#technology", "#business", "#growth", "#digitaltransformation"] : []
          },
          FACEBOOK: {
            content: `🚀 ${prompt}\n\n${includeEmojis ? "✨ " : ""}This is incredibly exciting! The way technology continues to evolve and solve real-world problems never ceases to amaze me.\n\nWhat do you think about this development? Drop a comment and let me know your thoughts! 💭\n\n${includeHashtags ? "#innovation #technology #business" : ""}`,
            hashtags: includeHashtags ? ["#innovation", "#technology", "#business"] : []
          },
          INSTAGRAM: {
            content: `🚀 ${prompt}\n\n${includeEmojis ? "✨ " : ""}Love seeing innovation in action! This technology is going to change everything.\n\n${includeHashtags ? "#innovation #tech #business #future #AI" : ""}\n\n📸 Swipe to see more details!`,
            hashtags: includeHashtags ? ["#innovation", "#tech", "#business", "#future", "#AI"] : []
          }
        },
        aiMetadata: {
          model: "gpt-4",
          prompt: prompt,
          confidenceScore: 0.92,
          generatedAt: new Date()
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedContent(mockContent);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setGenerating(false);
    }
  }

  function handlePlatformToggle(platformId: string) {
    setTargetPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Content Generator</h2>
          <p className="text-slate-600">Create engaging social media content with AI assistance</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-600" />
              Content Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Content Topic or Idea</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to post about... (e.g., 'New AI features launched', 'Team achievement', 'Industry insights')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Generation Settings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Industry (Optional)</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Length</Label>
                <Input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                  min={50}
                  max={3000}
                />
              </div>
            </div>

            {/* Target Platforms */}
            <div className="space-y-3">
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={targetPlatforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <Label htmlFor={platform.id} className="flex items-center gap-2 text-sm">
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hashtags"
                    checked={includeHashtags}
                    onCheckedChange={setIncludeHashtags}
                  />
                  <Label htmlFor="hashtags" className="text-sm">Include hashtags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emojis"
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                  />
                  <Label htmlFor="emojis" className="text-sm">Include emojis</Label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!generatedContent ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Zap className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Generate</h3>
                <p className="text-sm text-slate-500">
                  Enter your content idea and click "Generate Content" to create engaging posts
                </p>
              </div>
            ) : (
              <Tabs defaultValue="base" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="base">Base Content</TabsTrigger>
                  <TabsTrigger value="platforms">Platform Variations</TabsTrigger>
                  <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                </TabsList>

                <TabsContent value="base" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Generated Post</Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedContent.content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{generatedContent.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Confidence: {(generatedContent.aiMetadata.confidenceScore * 100).toFixed(0)}%</span>
                      <span>Model: {generatedContent.aiMetadata.model}</span>
                      <span>Generated: {generatedContent.aiMetadata.generatedAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="platforms" className="space-y-4">
                  {Object.entries(generatedContent.platformVariations)
                    .filter(([platform]) => targetPlatforms.includes(platform))
                    .map(([platform, variation]) => (
                      <div key={platform} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            {PLATFORMS.find(p => p.id === platform)?.icon}
                            {PLATFORMS.find(p => p.id === platform)?.name}
                          </Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(variation.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{variation.content}</p>
                        </div>
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="hashtags" className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Suggested Hashtags</Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((hashtag) => (
                        <Badge 
                          key={hashtag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => copyToClipboard(hashtag)}
                        >
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {generatedContent && (
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Quick Actions</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Post
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Publish Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 