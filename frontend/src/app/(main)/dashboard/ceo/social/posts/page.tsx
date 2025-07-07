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
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
  Youtube,
  Send,
  ArrowRight,
  Filter,
  Search,
  Target,
  Users,
  Zap
} from "lucide-react";

export default function SocialPostsPage() {
  const { 
    posts, 
    accounts,
    selectedPost,
    isLoading,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    schedulePost,
    publishPost,
    setSelectedPost,
    setSelectedAccount
  } = useSocial();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  // Handle URL parameters
  useEffect(() => {
    const action = searchParams.get('action');
    const postId = searchParams.get('id');
    
    if (action === 'create') {
      setShowCreateForm(true);
    }
    
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setEditingPost(post);
      }
    }
  }, [searchParams, posts, setSelectedPost]);

  // Filter posts based on current filters
  const filteredPosts = posts.filter(post => {
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || post.platforms.includes(filterPlatform);
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesPlatform && matchesSearch;
  });

  // Calculate statistics
  const postStats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalEngagement: posts.reduce((sum, p) => sum + p.engagement.likes + p.engagement.comments + p.engagement.shares, 0)
  };

  // Handle post actions
  const handleCreatePost = async (postData: any) => {
    const newPost = await createPost(postData);
    if (newPost) {
      setShowCreateForm(false);
      toast.success('Post created successfully');
    }
  };

  const handleUpdatePost = async (postId: string, updates: any) => {
    const success = await updatePost(postId, updates);
    if (success) {
      setEditingPost(null);
      toast.success('Post updated successfully');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await deletePost(postId);
      if (success) {
        toast.success('Post deleted successfully');
      }
    }
  };

  const handleSchedulePost = async (postId: string, scheduledFor: string) => {
    const success = await schedulePost(postId, scheduledFor);
    if (success) {
      toast.success('Post scheduled successfully');
    }
  };

  const handlePublishPost = async (postId: string) => {
    const success = await publishPost(postId);
    if (success) {
      toast.success('Post published successfully');
    }
  };

  // Navigation helpers
  const handleViewAnalytics = (post: any) => {
    setSelectedPost(post);
    router.push(`/dashboard/ceo/social/analytics?postId=${post.id}`);
  };

  const handleViewCampaigns = () => {
    router.push('/dashboard/ceo/social/campaigns');
  };

  const handleViewCalendar = () => {
    router.push('/dashboard/ceo/social/calendar');
  };

  const handleViewAccounts = () => {
    router.push('/dashboard/ceo/social/accounts');
  };

  const handleGenerateContent = () => {
    router.push('/dashboard/ceo/social/generator');
  };

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
              <Button variant="outline" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button variant="outline" onClick={handleGenerateContent}>
                <Zap className="h-4 w-4 mr-2" />
                Generate
              </Button>
              <Button variant="outline" onClick={() => refreshPosts()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{postStats.total}</p>
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
                  <p className="text-2xl font-bold">{postStats.published}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{postStats.scheduled}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{postStats.totalEngagement}</p>
                  <p className="text-xs text-muted-foreground">Total Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewAccounts}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">Manage Accounts</p>
                  <p className="text-sm text-muted-foreground">{accounts.filter(a => a.status === 'connected').length} connected</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewCampaigns}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium">View Campaigns</p>
                  <p className="text-sm text-muted-foreground">Manage campaigns</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewCalendar}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-medium">Content Calendar</p>
                  <p className="text-sm text-muted-foreground">Schedule posts</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/analytics')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">View insights</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Twitter/X">Twitter/X</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(post.status)}
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      {getStatusBadge(post.status)}
                    </div>
                    <CardDescription className="text-sm">
                      By {post.agent} • {formatDateTime(post.publishedAt || post.scheduledFor)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAnalytics(post)}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPost(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-1">
                        {getPlatformIcon(platform)}
                        <span className="text-xs">{platform}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {post.status === 'published' && (
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-sm font-medium">{post.engagement.likes}</p>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{post.engagement.comments}</p>
                        <p className="text-xs text-muted-foreground">Comments</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{post.engagement.shares}</p>
                        <p className="text-xs text-muted-foreground">Shares</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{post.engagement.views}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {post.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.updatedAt && `Updated ${new Date(post.updatedAt).toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.status === 'draft' && (
                        <Button size="sm" onClick={() => handleSchedulePost(post.id, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      )}
                      {post.status === 'scheduled' && (
                        <Button size="sm" onClick={() => handlePublishPost(post.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          Publish Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all' || filterPlatform !== 'all' 
                    ? 'Try adjusting your filters or search query'
                    : 'Create your first social media post to get started'
                  }
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
} 