"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSocial } from "@/lib/social/social-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Link,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Videotape,
  ArrowRight,
  BarChart3,
  Calendar,
  Target,
  Zap,
  Sync,
  ExternalLink
} from "lucide-react";

export default function SocialAccountsPage() {
  const { 
    accounts, 
    selectedAccount,
    isLoading,
    refreshAccounts,
    connectAccount,
    disconnectAccount,
    syncAccount,
    setSelectedAccount,
    getAccountAnalytics
  } = useSocial();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [accountAnalytics, setAccountAnalytics] = useState<any>(null);

  // Handle URL parameters
  useEffect(() => {
    const accountId = searchParams.get('id');
    if (accountId && accounts.length > 0) {
      const account = accounts.find(a => a.id === accountId);
      if (account) {
        setSelectedAccount(account);
        loadAccountAnalytics(account.id);
      }
    }
  }, [searchParams, accounts, setSelectedAccount]);

  const loadAccountAnalytics = async (accountId: string) => {
    const analytics = await getAccountAnalytics(accountId);
    setAccountAnalytics(analytics);
  };

  const availablePlatforms = [
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-600", description: "Professional networking", bgColor: "bg-blue-50" },
    { name: "Twitter/X", icon: Twitter, color: "text-black", description: "Microblogging platform", bgColor: "bg-gray-50" },
    { name: "Facebook", icon: Facebook, color: "text-blue-500", description: "Social networking", bgColor: "bg-blue-50" },
    { name: "Instagram", icon: Instagram, color: "text-purple-500", description: "Photo and video sharing", bgColor: "bg-purple-50" },
    { name: "YouTube", icon: Youtube, color: "text-red-600", description: "Video platform", bgColor: "bg-red-50" },
    { name: "TikTok", icon: Videotape, color: "text-red-600", description: "Short video platform", bgColor: "bg-red-50" },
  ];

  // Calculate statistics
  const accountStats = {
    total: accounts.length,
    connected: accounts.filter(a => a.status === 'connected').length,
    pending: accounts.filter(a => a.status === 'pending').length,
    totalFollowers: accounts.reduce((sum, a) => sum + a.followers, 0),
    avgEngagement: accounts.filter(a => a.status === 'connected').reduce((sum, a) => sum + a.engagement, 0) / Math.max(1, accounts.filter(a => a.status === 'connected').length)
  };

  // Handle account actions
  const handleConnectAccount = async (platform: string, credentials: any) => {
    const success = await connectAccount(platform, credentials);
    if (success) {
      setShowConnectForm(false);
      setSelectedPlatform('');
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      const success = await disconnectAccount(accountId);
      if (success && selectedAccount?.id === accountId) {
        setSelectedAccount(null);
      }
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    const success = await syncAccount(accountId);
    if (success) {
      await loadAccountAnalytics(accountId);
    }
  };

  // Navigation helpers
  const handleViewPosts = (account: any) => {
    setSelectedAccount(account);
    router.push(`/dashboard/ceo/social/posts?platform=${account.platform}`);
  };

  const handleViewAnalytics = (account: any) => {
    setSelectedAccount(account);
    router.push(`/dashboard/ceo/social/analytics?accountId=${account.id}`);
  };

  const handleViewCalendar = () => {
    router.push('/dashboard/ceo/social/calendar');
  };

  const handleViewCampaigns = () => {
    router.push('/dashboard/ceo/social/campaigns');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "disconnected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800">Disconnected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = availablePlatforms.find(p => p.name === platform);
    if (platformData) {
      const IconComponent = platformData.icon;
      return <IconComponent className={`h-6 w-6 ${platformData.color}`} />;
    }
    return <Globe className="h-6 w-6 text-gray-500" />;
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Social Media", href: "/dashboard/ceo/social" },
          { label: "Accounts", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Social Accounts</h1>
              </div>
              <p className="text-muted-foreground">
                Manage your social media accounts and connections
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button variant="outline" onClick={() => refreshAccounts()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowConnectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{accountStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{accountStats.connected}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{accountStats.totalFollowers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{accountStats.avgEngagement.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/posts')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">Manage Posts</p>
                  <p className="text-sm text-muted-foreground">Create & schedule</p>
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
                  <p className="text-sm text-muted-foreground">Marketing campaigns</p>
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
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/ceo/social/generator')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="font-medium">AI Generator</p>
                  <p className="text-sm text-muted-foreground">Generate content</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Connected Accounts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Your connected social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedAccount?.id === account.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getPlatformIcon(account.platform)}
                          <div>
                            <h4 className="font-medium">{account.accountName}</h4>
                            <p className="text-sm text-muted-foreground">{account.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(account.status)}
                          {getStatusBadge(account.status)}
                        </div>
                      </div>
                      
                      {account.status === 'connected' && (
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-lg font-semibold">{account.followers.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">{account.posts}</p>
                            <p className="text-xs text-muted-foreground">Posts</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">{account.engagement}%</p>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Last sync: {account.lastSync}
                        </p>
                        <div className="flex items-center space-x-2">
                          {account.status === 'connected' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSyncAccount(account.id)}
                              >
                                <Sync className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPosts(account)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAnalytics(account)}
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              {account.profileUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(account.profileUrl, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAccount(account)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnectAccount(account.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Available Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Platforms</CardTitle>
                <CardDescription>Connect new social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availablePlatforms.map((platform) => {
                  const isConnected = accounts.some(acc => acc.platform === platform.name && acc.status === 'connected');
                  const IconComponent = platform.icon;
                  
                  return (
                    <div
                      key={platform.name}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isConnected 
                          ? 'bg-green-50 border-green-200' 
                          : 'hover:shadow-md cursor-pointer'
                      }`}
                      onClick={() => !isConnected && handleConnectAccount(platform.name, {})}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                          <IconComponent className={`h-5 w-5 ${platform.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">{platform.description}</p>
                        </div>
                      </div>
                      {isConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Selected Account Details */}
            {selectedAccount && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Details</CardTitle>
                  <CardDescription>{selectedAccount.platform} Account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input value={selectedAccount.accountName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input value={selectedAccount.username} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedAccount.status)}
                      <span className="text-sm">{selectedAccount.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-sync</Label>
                    <div className="flex items-center space-x-2">
                      <Switch checked={selectedAccount.isActive} />
                      <span className="text-sm">Enable automatic synchronization</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => handleViewPosts(selectedAccount)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Posts
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewAnalytics(selectedAccount)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSyncAccount(selectedAccount.id)}
                    >
                      <Sync className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
} 