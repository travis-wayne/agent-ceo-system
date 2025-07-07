"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  Share2,
  Settings,
  Play,
  Pause,
  Square,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  RefreshCw,
  ArrowRight,
  Zap,
  Filter,
  Search,
  Globe,
  Activity
} from "lucide-react";

export default function SocialCampaignsPage() {
  const { 
    campaigns, 
    posts,
    accounts,
    selectedCampaign,
    isLoading,
    refreshCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignAnalytics,
    setSelectedCampaign
  } = useSocial();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState<any>(null);

  // Handle URL parameters
  useEffect(() => {
    const action = searchParams.get('action');
    const campaignId = searchParams.get('id');
    
    if (action === 'create') {
      setShowCreateForm(true);
    }
    
    if (campaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
        setEditingCampaign(campaign);
        loadCampaignAnalytics(campaign.id);
      }
    }
  }, [searchParams, campaigns, setSelectedCampaign]);

  const loadCampaignAnalytics = async (campaignId: string) => {
    const analytics = await getCampaignAnalytics(campaignId);
    setCampaignAnalytics(analytics);
  };

  // Filter campaigns based on current filters
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const campaignStats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalReach: campaigns.reduce((sum, c) => sum + c.performance.reach, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.performance.conversions, 0)
  };

  // Handle campaign actions
  const handleCreateCampaign = async (campaignData: any) => {
    const newCampaign = await createCampaign(campaignData);
    if (newCampaign) {
      setShowCreateForm(false);
      toast.success('Campaign created successfully');
    }
  };

  const handleUpdateCampaign = async (campaignId: string, updates: any) => {
    const success = await updateCampaign(campaignId, updates);
    if (success) {
      setEditingCampaign(null);
      toast.success('Campaign updated successfully');
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      const success = await deleteCampaign(campaignId);
      if (success) {
        toast.success('Campaign deleted successfully');
      }
    }
  };

  // Navigation helpers
  const handleViewAnalytics = (campaign: any) => {
    setSelectedCampaign(campaign);
    router.push(`/dashboard/ceo/social/analytics?campaignId=${campaign.id}`);
  };

  const handleViewPosts = (campaign: any) => {
    setSelectedCampaign(campaign);
    router.push(`/dashboard/ceo/social/posts?campaignId=${campaign.id}`);
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
      case "active":
        return <Play className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "draft":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "paused":
        return <Pause className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (campaign: any) => {
    if (campaign.status === 'completed') return 100;
    if (campaign.status === 'draft') return 0;
    
    const start = new Date(campaign.startDate).getTime();
    const end = new Date(campaign.endDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const calculateROI = (campaign: any) => {
    if (campaign.spent === 0) return 0;
    // Simple ROI calculation based on conversions
    const revenue = campaign.performance.conversions * 50; // Assume $50 per conversion
    return ((revenue - campaign.spent) / campaign.spent) * 100;
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Campaigns", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Social Campaigns</h1>
              </div>
              <p className="text-muted-foreground">
                Manage your social media campaigns and marketing initiatives
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
              <Button variant="outline" onClick={() => refreshCampaigns()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{campaignStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{campaignStats.active}</p>
                  <p className="text-xs text-muted-foreground">Active Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">${campaignStats.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{campaignStats.totalReach.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Reach</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/posts')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium">View Posts</p>
                  <p className="text-sm text-muted-foreground">{posts.length} total posts</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/analytics')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">Performance insights</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewCalendar}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="font-medium">Content Calendar</p>
                  <p className="text-sm text-muted-foreground">Schedule content</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search campaigns..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(campaign.status)}
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <CardDescription className="text-sm mb-2">
                      {campaign.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                      <span>•</span>
                      <span>Budget: ${campaign.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAnalytics(campaign)}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPosts(campaign)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCampaign(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {campaign.platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-1">
                        {getPlatformIcon(platform)}
                        <span className="text-xs">{platform}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{calculateProgress(campaign)}%</span>
                    </div>
                    <Progress value={calculateProgress(campaign)} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold">{campaign.performance.reach.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Reach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{campaign.performance.engagement.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{campaign.performance.conversions}</p>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{calculateROI(campaign).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Budget Usage</span>
                      <span className="text-sm text-muted-foreground">
                        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Goals</span>
                    <div className="flex flex-wrap gap-2">
                      {campaign.goals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal.type}: {goal.current}/{goal.target}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {campaign.posts.length} posts
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {new Date(campaign.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateCampaign(campaign.id, { status: 'active' })}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {campaign.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateCampaign(campaign.id, { status: 'paused' })}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateCampaign(campaign.id, { status: 'active' })}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewAnalytics(campaign)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your filters or search query'
                    : 'Create your first social media campaign to get started'
                  }
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
} 