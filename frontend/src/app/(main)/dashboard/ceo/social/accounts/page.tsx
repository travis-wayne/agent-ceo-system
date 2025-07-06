import { Metadata } from "next";
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
  Videotape
} from "lucide-react";

export const metadata: Metadata = {
  title: "Social Accounts | Agent CEO",
  description: "Manage your social media accounts and connections",
};

export default function SocialAccountsPage() {
  const socialAccounts = [
    {
      id: "acc_1",
      platform: "LinkedIn",
      accountName: "Agent CEO Official",
      username: "@agentceo",
      status: "connected",
      followers: 12500,
      following: 890,
      posts: 156,
      engagement: 4.8,
      lastSync: "2 minutes ago",
      profileUrl: "https://linkedin.com/company/agentceo",
      icon: Linkedin,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "acc_2",
      platform: "Twitter/X",
      accountName: "Agent CEO",
      username: "@agentceo_ai",
      status: "connected",
      followers: 8200,
      following: 1200,
      posts: 287,
      engagement: 3.2,
      lastSync: "5 minutes ago",
      profileUrl: "https://twitter.com/agentceo_ai",
      icon: Twitter,
      color: "text-black",
      bgColor: "bg-gray-50"
    },
    {
      id: "acc_3",
      platform: "Facebook",
      accountName: "Agent CEO Business",
      username: "agentceobusiness",
      status: "pending",
      followers: 0,
      following: 0,
      posts: 0,
      engagement: 0,
      lastSync: "Never",
      profileUrl: "",
      icon: Facebook,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "acc_4",
      platform: "Instagram",
      accountName: "Agent CEO",
      username: "@agentceo_official",
      status: "disconnected",
      followers: 0,
      following: 0,
      posts: 0,
      engagement: 0,
      lastSync: "Never",
      profileUrl: "",
      icon: Instagram,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      id: "acc_5",
      platform: "YouTube",
      accountName: "Agent CEO Channel",
      username: "@agentceo",
      status: "connected",
      followers: 3400,
      following: 45,
      posts: 23,
      engagement: 2.1,
      lastSync: "1 hour ago",
      profileUrl: "https://youtube.com/@agentceo",
      icon: Videotape,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: "acc_6",
      platform: "TikTok",
      accountName: "Agent CEO Channel",
      username: "@agentceo",
      status: "connected",
      followers: 3400,
      following: 45,
      posts: 23,
      engagement: 2.1,
      lastSync: "1 hour ago",
      profileUrl: "https://youtube.com/@agentceo",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const availablePlatforms = [
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-600", description: "Professional networking" },
    { name: "Twitter/X", icon: Twitter, color: "text-black", description: "Microblogging platform" },
    { name: "Facebook", icon: Facebook, color: "text-blue-500", description: "Social networking" },
    { name: "Instagram", icon: Instagram, color: "text-purple-500", description: "Photo and video sharing" },
    { name: "YouTube", icon: Youtube, color: "text-red-600", description: "Video platform" },
    { name: "TikTok", icon: Videotape, color: "text-red-600", description: "Video platform" },
  ];

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
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
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
                  <p className="text-2xl font-bold">{socialAccounts.length}</p>
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
                  <p className="text-2xl font-bold">{socialAccounts.filter(acc => acc.status === 'connected').length}</p>
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
                  <p className="text-2xl font-bold">{socialAccounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{socialAccounts.reduce((sum, acc) => sum + acc.posts, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="add">Add Account</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Connected Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="grid gap-6">
              {socialAccounts.map((account) => (
                <Card key={account.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`h-12 w-12 rounded-lg ${account.bgColor} flex items-center justify-center`}>
                          <account.icon className={`h-6 w-6 ${account.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{account.accountName}</CardTitle>
                          <CardDescription>
                            {account.platform} • {account.username} • {account.followers.toLocaleString()} followers
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(account.status)}
                        {getStatusBadge(account.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Followers</span>
                        <p className="font-medium">{account.followers.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Following</span>
                        <p className="font-medium">{account.following.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Posts</span>
                        <p className="font-medium">{account.posts.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Engagement</span>
                        <p className="font-medium">{account.engagement}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Last Sync: {account.lastSync}</p>
                          {account.profileUrl && (
                            <p className="text-sm text-muted-foreground">Profile: {account.profileUrl}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Now
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add Account Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect New Account</CardTitle>
                <CardDescription>Add a new social media account to your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {availablePlatforms.map((platform) => (
                    <Card key={platform.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center`}>
                            <platform.icon className={`h-5 w-5 ${platform.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                            <CardDescription>{platform.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Link className="h-4 w-4 mr-2" />
                          Connect {platform.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Configure global settings for social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-sync accounts</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync account data every hour
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cross-platform posting</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow posting to multiple platforms simultaneously
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Engagement notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new followers and engagement
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sync Frequency</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sync-interval">Sync Interval</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="15min">Every 15 minutes</option>
                        <option value="30min">Every 30 minutes</option>
                        <option value="1hour">Every hour</option>
                        <option value="6hours">Every 6 hours</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retry-attempts">Retry Attempts</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="1">1 attempt</option>
                        <option value="3">3 attempts</option>
                        <option value="5">5 attempts</option>
                      </select>
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