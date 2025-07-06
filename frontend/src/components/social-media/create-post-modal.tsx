"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Zap,
  Hash,
  AtSign,
  Image,
  Video,
  FileText,
  Loader2,
  X,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";

// Import server actions
import { 
  createSocialPost, 
  getSocialAccounts,
  generateAIContent 
} from "@/app/actions/social-media";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  connectionStatus: string;
}

const CONTENT_TYPES = [
  { value: "TEXT", label: "Text Post", icon: FileText },
  { value: "IMAGE", label: "Image Post", icon: Image },
  { value: "VIDEO", label: "Video Post", icon: Video },
  { value: "CAROUSEL", label: "Carousel", icon: Plus },
  { value: "STORY", label: "Story", icon: Zap }
];

const PRIORITIES = [
  { value: "LOW", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-blue-100 text-blue-800" },
  { value: "HIGH", label: "High", color: "bg-yellow-100 text-yellow-800" },
  { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-800" }
];

const AI_TONES = [
  "Professional", "Casual", "Friendly", "Formal", "Enthusiastic", 
  "Informative", "Persuasive", "Inspirational", "Humorous", "Technical"
];

export default function CreatePostModal({ open, onOpenChange, onPostCreated }: CreatePostModalProps) {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    hashtags: [] as string[],
    mentions: [] as string[],
    contentType: "TEXT" as const,
    priority: "MEDIUM" as const,
    publishingType: "IMMEDIATE" as const,
    scheduledFor: undefined as Date | undefined,
    scheduledTime: "12:00"
  });
  
  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiIncludeHashtags, setAiIncludeHashtags] = useState(true);
  const [aiIncludeEmojis, setAiIncludeEmojis] = useState(true);
  
  // Input helpers
  const [hashtagInput, setHashtagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");

  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);

  const fetchAccounts = async () => {
    try {
      const result = await getSocialAccounts();
      if (result.success) {
        const connectedAccounts = result.data?.filter(acc => acc.connectionStatus === 'CONNECTED') || [];
        setAccounts(connectedAccounts);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim().replace('#', '')]
      }));
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const addMention = () => {
    if (mentionInput.trim() && !formData.mentions.includes(mentionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        mentions: [...prev.mentions, mentionInput.trim().replace('@', '')]
      }));
      setMentionInput("");
    }
  };

  const removeMention = (mention: string) => {
    setFormData(prev => ({
      ...prev,
      mentions: prev.mentions.filter(m => m !== mention)
    }));
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt for AI generation");
      return;
    }

    try {
      setAiGenerating(true);
      
      const selectedPlatforms = accounts
        .filter(acc => selectedAccounts.includes(acc.id))
        .map(acc => acc.platform as any);

      const result = await generateAIContent({
        prompt: aiPrompt,
        contentType: formData.contentType,
        targetPlatforms: selectedPlatforms,
        tone: aiTone,
        hashtags: aiIncludeHashtags,
        includeEmojis: aiIncludeEmojis,
        maxLength: 280 // Twitter character limit as default
      });

      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          content: result.data.content,
          hashtags: [...prev.hashtags, ...(result.data.hashtags || [])],
          title: result.data.title || prev.title
        }));
        toast.success("AI content generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate AI content");
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate AI content");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      toast.error("Post content is required");
      return;
    }

    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one social media account");
      return;
    }

    if (formData.publishingType === "SCHEDULED" && !formData.scheduledFor) {
      toast.error("Please select a date and time for scheduling");
      return;
    }

    try {
      setLoading(true);

      let scheduledDateTime: Date | undefined;
      if (formData.publishingType === "SCHEDULED" && formData.scheduledFor) {
        const [hours, minutes] = formData.scheduledTime.split(':');
        scheduledDateTime = new Date(formData.scheduledFor);
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
      }

      const result = await createSocialPost({
        title: formData.title || undefined,
        content: formData.content,
        hashtags: formData.hashtags,
        mentions: formData.mentions,
        contentType: formData.contentType,
        priority: formData.priority,
        publishingType: formData.publishingType,
        scheduledFor: scheduledDateTime,
        targetAccounts: selectedAccounts,
        status: formData.publishingType === "IMMEDIATE" ? "PUBLISHED" : "SCHEDULED"
      });

      if (result.success) {
        toast.success("Post created successfully!");
        onPostCreated();
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      hashtags: [],
      mentions: [],
      contentType: "TEXT",
      priority: "MEDIUM",
      publishingType: "IMMEDIATE",
      scheduledFor: undefined,
      scheduledTime: "12:00"
    });
    setSelectedAccounts([]);
    setAiPrompt("");
    setHashtagInput("");
    setMentionInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Social Media Post
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="ai-generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            {/* Account Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Select Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAccounts.includes(account.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAccountToggle(account.id)}
                    >
                      <Checkbox 
                        checked={selectedAccounts.includes(account.id)}
                        onChange={() => handleAccountToggle(account.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{account.platform}</p>
                        <p className="text-xs text-gray-500 truncate">@{account.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Input */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Post title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind?"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <Label>Hashtags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add hashtag..."
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                />
                <Button onClick={addHashtag} variant="outline">
                  <Hash className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.hashtags.map((hashtag) => (
                  <Badge key={hashtag} variant="secondary" className="flex items-center gap-1">
                    #{hashtag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeHashtag(hashtag)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mentions */}
            <div>
              <Label>Mentions</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add mention..."
                  value={mentionInput}
                  onChange={(e) => setMentionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
                />
                <Button onClick={addMention} variant="outline">
                  <AtSign className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.mentions.map((mention) => (
                  <Badge key={mention} variant="secondary" className="flex items-center gap-1">
                    @{mention}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeMention(mention)} />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ai-prompt">Prompt *</Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder="Describe what you want to post about..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tone</Label>
                    <Select value={aiTone} onValueChange={setAiTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_TONES.map((tone) => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={aiIncludeHashtags} 
                          onCheckedChange={setAiIncludeHashtags}
                        />
                        <Label className="text-sm">Include hashtags</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={aiIncludeEmojis} 
                          onCheckedChange={setAiIncludeEmojis}
                        />
                        <Label className="text-sm">Include emojis</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAIGenerate} 
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="w-full"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Content Type</Label>
                <Select 
                  value={formData.contentType} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, contentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <Badge className={priority.color}>{priority.label}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Publishing</Label>
              <Select 
                value={formData.publishingType} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, publishingType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMMEDIATE">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Publish Now
                    </div>
                  </SelectItem>
                  <SelectItem value="SCHEDULED">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Schedule for Later
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.publishingType === "SCHEDULED" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.scheduledFor ? format(formData.scheduledFor, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.scheduledFor}
                        onSelect={(date) => setFormData(prev => ({ ...prev, scheduledFor: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.content.trim() || selectedAccounts.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              formData.publishingType === "IMMEDIATE" ? "Publish Now" : "Schedule Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 