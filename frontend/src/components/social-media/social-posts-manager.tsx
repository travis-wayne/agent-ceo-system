"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  Calendar as CalendarIcon,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  RefreshCw,
  Loader2,
  Hash,
  AtSign,
  Sparkles,
  X,
  FileText,
  Image,
  Video,
  AlertTriangle,
  Link
} from "lucide-react";
import { format } from "date-fns";

// Import server actions
import { 
  getSocialPosts, 
  deletePost, 
  updatePostStatus,
  createSocialPost,
  getSocialAccounts,
  generateAIContent,
  connectSocialAccount
} from "@/app/actions/social-media";

interface SocialPost {
  id: string;
  title?: string;
  content: string;
  hashtags?: string[];
  mentions?: string[];
  mediaAttachments?: any[];
  platformContent?: any;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";
  publishingType: "IMMEDIATE" | "SCHEDULED" | "RECURRING";
  scheduledFor?: Date;
  publishedAt?: Date;
  contentType: "TEXT" | "IMAGE" | "VIDEO" | "CAROUSEL" | "STORY";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  tags?: string[];
  campaignId?: string;
  targetAccounts: string[];
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: Date;
  updatedAt: Date;
  campaign?: {
    id: string;
    name: string;
    campaignType: string;
    status: string;
  };
  analytics?: any[];
  _count?: {
    analytics: number;
  };
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  connectionStatus: string;
}

const PLATFORM_ICONS = {
  LINKEDIN: "in",
  TWITTER: "𝕏", 
  FACEBOOK: "f",
  INSTAGRAM: "📷"
};

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  SCHEDULED: "bg-blue-100 text-blue-800", 
  PUBLISHED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800"
};

const STATUS_ICONS = {
  DRAFT: Edit,
  SCHEDULED: Clock,
  PUBLISHED: CheckCircle,
  FAILED: XCircle
};

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

export default function SocialPostsManager() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Create post modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [creatingTestAccount, setCreatingTestAccount] = useState(false);
  
  // Create post form state
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
  
  // Input helpers
  const [hashtagInput, setHashtagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await getSocialPosts();
      
      if (result.success) {
        setPosts(result.data || []);
      } else {
        toast.error(result.error || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const result = await getSocialAccounts();
      if (result.success) {
        const allAccounts = result.data || [];
        setAccounts(allAccounts);
        
        // Show a warning if no accounts are connected
        if (allAccounts.length === 0) {
          toast.error("No social media accounts connected. Please connect an account first.");
        } else {
          const connectedAccounts = allAccounts.filter(acc => acc.connectionStatus === 'CONNECTED');
          if (connectedAccounts.length === 0) {
            toast.error("No active social media accounts. Please check your account connections.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts");
    }
  };

  const createTestAccount = async () => {
    try {
      setCreatingTestAccount(true);
      
      // Create a test account for development
      const result = await connectSocialAccount({
        platform: "TWITTER",
        accountType: "BUSINESS",
        platformAccountId: `test_${Date.now()}`,
        username: `test_user_${Date.now()}`,
        displayName: "Test Account",
        profileImageUrl: "https://via.placeholder.com/150",
        accessToken: "test_token",
        scopes: ["read", "write"]
      });
      
      if (result.success) {
        toast.success("Test account created successfully!");
        await fetchAccounts(); // Refresh accounts
      } else {
        toast.error(result.error || "Failed to create test account");
      }
    } catch (error) {
      console.error("Error creating test account:", error);
      toast.error("Failed to create test account");
    } finally {
      setCreatingTestAccount(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setIsDeleting(postId);
      const result = await deletePost(postId);
      
      if (result.success) {
        toast.success("Post deleted successfully");
        await fetchPosts(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateStatus = async (postId: string, newStatus: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED") => {
    try {
      setIsUpdating(postId);
      const result = await updatePostStatus(postId, newStatus);
      
      if (result.success) {
        toast.success(`Post status updated to ${newStatus}`);
        await fetchPosts(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to update post status");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCreatePost = async () => {
    setCreateModalOpen(true);
    await fetchAccounts();
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

  const handleSubmitPost = async () => {
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
      setCreateLoading(true);

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
        setCreateModalOpen(false);
        resetCreateForm();
        await fetchPosts();
      } else {
        toast.error(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setCreateLoading(false);
    }
  };

  const resetCreateForm = () => {
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
    setHashtagInput("");
    setMentionInput("");
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.hashtags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === "all" || post.status === filter;
    const matchesTab = selectedTab === "all" || post.status === selectedTab.toUpperCase();
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const getStatusCounts = () => {
    return {
      all: posts.length,
      published: posts.filter(p => p.status === "PUBLISHED").length,
      scheduled: posts.filter(p => p.status === "SCHEDULED").length,
      draft: posts.filter(p => p.status === "DRAFT").length,
      failed: posts.filter(p => p.status === "FAILED").length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Posts Management</h2>
            <p className="text-slate-600">Manage and monitor your social media posts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchPosts}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={createTestAccount}
            disabled={creatingTestAccount}
          >
            {creatingTestAccount ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            Add Test Account
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={handleCreatePost}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Social Media Post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* No Accounts Warning */}
            {accounts.length === 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-5 w-5" />
                    <div>
                      <p className="font-medium">No Social Media Accounts Connected</p>
                      <p className="text-sm text-orange-600">
                        You need to connect at least one social media account to create posts. 
                        Click "Add Test Account" to create a test account for development.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  Select Platforms
                  {accounts.length === 0 && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={createTestAccount}
                      disabled={creatingTestAccount}
                    >
                      {creatingTestAccount ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Add Test Account"
                      )}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {accounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No social media accounts connected</p>
                    <p className="text-xs text-gray-400">Connect accounts to start creating posts</p>
                  </div>
                ) : (
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
                          <Badge 
                            variant={account.connectionStatus === 'CONNECTED' ? 'default' : 'secondary'}
                            className="text-xs mt-1"
                          >
                            {account.connectionStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

            {/* Settings */}
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
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPost} 
              disabled={createLoading || !formData.content.trim() || selectedAccounts.length === 0}
            >
              {createLoading ? (
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

      {/* Filters and Search */}
      <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Published ({statusCounts.published})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Scheduled ({statusCounts.scheduled})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Drafts ({statusCounts.draft})
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Failed ({statusCounts.failed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No posts found</h3>
                <p className="text-sm text-slate-500 text-center">
                  {searchQuery ? "No posts match your search criteria." : "Start creating posts to see them here."}
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600"
                  onClick={handleCreatePost}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule/Published</TableHead>
                    <TableHead>Analytics</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => {
                    const StatusIcon = STATUS_ICONS[post.status];
                    
                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="space-y-1">
                            {post.title && (
                              <p className="text-sm font-medium">{post.title}</p>
                            )}
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {post.content.substring(0, 100)}
                              {post.content.length > 100 && "..."}
                            </p>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {post.contentType}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {post.priority}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {post.campaign ? (
                            <div className="text-sm">
                              <p className="font-medium">{post.campaign.name}</p>
                              <p className="text-slate-500">{post.campaign.campaignType}</p>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">No campaign</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={`${STATUS_COLORS[post.status]} flex items-center gap-1 w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            {post.status}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {post.status === "PUBLISHED" && post.publishedAt && (
                              <div>
                                <div className="font-medium">Published</div>
                                <div className="text-slate-500">
                                  {new Date(post.publishedAt).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                            {post.status === "SCHEDULED" && post.scheduledFor && (
                              <div>
                                <div className="font-medium">Scheduled</div>
                                <div className="text-slate-500">
                                  {new Date(post.scheduledFor).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                            {(post.status === "DRAFT" || post.status === "FAILED") && (
                              <div className="text-slate-500">-</div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {post.analytics && post.analytics.length > 0 ? (
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-3 text-xs">
                                <span>📊 {post._count?.analytics || 0} records</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-slate-500 text-sm">No data</div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this post? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={isDeleting === post.id}
                                  >
                                    {isDeleting === post.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 