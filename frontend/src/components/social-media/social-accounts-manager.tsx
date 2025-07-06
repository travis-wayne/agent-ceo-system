"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Plus, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Unlink,
  Calendar,
  BarChart3,
  Settings,
  ExternalLink,
  Zap,
  Loader2
} from "lucide-react";

// Import server actions
import { 
  getSocialAccounts, 
  disconnectSocialAccount, 
  updateAccountStatus,
  connectSocialAccount 
} from "@/app/actions/social-media";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  followerCount: number;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR';
  isActive: boolean;
  lastSyncAt: Date;
  recentMetrics: {
    totalEngagement: number;
    totalReach: number;
    avgEngagementRate: number;
    followerGrowth: number;
  };
  _count: {
    posts: number;
    campaigns: number;
    analytics: number;
  };
}

const PLATFORM_CONFIGS = {
  TWITTER: {
    name: "Twitter/X",
    color: "bg-black text-white",
    icon: "X",
    description: "Connect your Twitter/X account"
  },
  LINKEDIN: {
    name: "LinkedIn",
    color: "bg-blue-600 text-white",
    icon: "in",
    description: "Connect your LinkedIn profile"
  },
  FACEBOOK: {
    name: "Facebook",
    color: "bg-blue-500 text-white", 
    icon: "f",
    description: "Connect your Facebook page"
  },
  INSTAGRAM: {
    name: "Instagram",
    color: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
    icon: "IG",
    description: "Connect your Instagram account"
  },
  YOUTUBE: {
    name: "YouTube",
    color: "bg-red-600 text-white",
    icon: "YT",
    description: "Connect your YouTube channel"
  },
  TIKTOK: {
    name: "TikTok",
    color: "bg-black text-white",
    icon: "TT",
    description: "Connect your TikTok account"
  }
};

export default function SocialAccountsManager() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const result = await getSocialAccounts();
      
      if (result.success) {
        setAccounts(result.data || []);
      } else {
        toast.error(result.error || "Failed to fetch accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4" />;
      case 'ERROR':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  }

  async function handleConnect(platform: string) {
    try {
      setIsConnecting(true);
      
      // In a real implementation, this would:
      // 1. Open OAuth flow for the platform
      // 2. Get authorization from user
      // 3. Exchange code for access token
      // 4. Call connectSocialAccount with the token
      
      // For now, we'll simulate the process
      toast.info(`Connecting to ${platform}... (OAuth flow would open here)`);
      
      // Simulate OAuth success (in real app, this would be handled by OAuth callback)
      setTimeout(() => {
        toast.success(`Connected to ${platform} successfully!`);
        setConnectDialogOpen(false);
        setSelectedPlatform(null);
        fetchAccounts(); // Refresh the list
      }, 2000);
      
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast.error(`Failed to connect to ${platform}`);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleDisconnect(accountId: string) {
    try {
      setIsDisconnecting(accountId);
      const result = await disconnectSocialAccount(accountId);
      
      if (result.success) {
        toast.success("Account disconnected successfully");
        await fetchAccounts(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to disconnect account");
      }
    } catch (error) {
      console.error("Error disconnecting account:", error);
      toast.error("Failed to disconnect account");
    } finally {
      setIsDisconnecting(null);
    }
  }

  async function handleRefresh(accountId: string) {
    try {
      setIsRefreshing(accountId);
      
      // In a real implementation, this would sync the account data
      // For now, we'll simulate the process
      toast.info("Refreshing account data...");
      
      setTimeout(() => {
        toast.success("Account data refreshed successfully");
        fetchAccounts(); // Refresh the list
      }, 1500);
      
    } catch (error) {
      console.error("Error refreshing account:", error);
      toast.error("Failed to refresh account data");
    } finally {
      setIsRefreshing(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const connectedAccounts = accounts.filter(a => a.connectionStatus === 'CONNECTED');
  const totalFollowers = accounts.reduce((sum, a) => sum + a.followerCount, 0);
  const avgEngagementRate = accounts.reduce((sum, a) => sum + a.recentMetrics.avgEngagementRate, 0) / accounts.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Social Media Accounts</h2>
            <p className="text-slate-600">Manage your connected social media accounts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAccounts}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Social Media Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Choose a platform to connect your account:
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PLATFORM_CONFIGS).map(([key, config]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="h-20 flex-col gap-2 hover:bg-slate-50"
                      onClick={() => handleConnect(key)}
                      disabled={isConnecting}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${config.color}`}>
                        {config.icon}
                      </div>
                      <span className="text-xs font-medium">{config.name}</span>
                    </Button>
                  ))}
                </div>
                
                <p className="text-xs text-slate-500 text-center">
                  OAuth authentication will be required for each platform
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Connected Accounts</p>
                <p className="text-2xl font-bold text-slate-900">{connectedAccounts.length}</p>
                <p className="text-xs text-slate-500">of {accounts.length} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Followers</p>
                <p className="text-2xl font-bold text-slate-900">{(totalFollowers / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-500">across platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Engagement</p>
                <p className="text-2xl font-bold text-slate-900">{avgEngagementRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">engagement rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No accounts connected</h3>
              <p className="text-sm text-slate-500 text-center mb-4">
                Connect your social media accounts to start managing your content
              </p>
              <Button 
                onClick={() => setConnectDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Connect Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={account.profileImageUrl} alt={account.displayName} />
                      <AvatarFallback>
                        {PLATFORM_CONFIGS[account.platform as keyof typeof PLATFORM_CONFIGS]?.icon || account.platform.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">{account.displayName}</h3>
                        <Badge 
                          className={`${getStatusColor(account.connectionStatus)} flex items-center gap-1`}
                        >
                          {getStatusIcon(account.connectionStatus)}
                          {account.connectionStatus}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${PLATFORM_CONFIGS[account.platform as keyof typeof PLATFORM_CONFIGS]?.color || 'bg-gray-500'}`} />
                          <span>{PLATFORM_CONFIGS[account.platform as keyof typeof PLATFORM_CONFIGS]?.name || account.platform}</span>
                        </div>
                        <span>@{account.username}</span>
                        <span>{account.followerCount.toLocaleString()} followers</span>
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        Last synced: {new Date(account.lastSyncAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefresh(account.id)}
                      disabled={account.connectionStatus !== 'CONNECTED' || isRefreshing === account.id}
                    >
                      {isRefreshing === account.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisconnect(account.id)}
                      disabled={isDisconnecting === account.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {isDisconnecting === account.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Unlink className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Posts</p>
                    <p className="text-2xl font-bold text-slate-900">{account._count.posts}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Campaigns</p>
                    <p className="text-2xl font-bold text-slate-900">{account._count.campaigns}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Engagement</p>
                    <p className="text-2xl font-bold text-slate-900">{account.recentMetrics.totalEngagement.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Growth</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-green-600">+{account.recentMetrics.followerGrowth}</p>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Engagement Rate</span>
                    <span className="font-medium">{account.recentMetrics.avgEngagementRate}%</span>
                  </div>
                  <Progress value={account.recentMetrics.avgEngagementRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 