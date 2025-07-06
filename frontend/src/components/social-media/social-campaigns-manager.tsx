"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  Target,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  MessageSquare,
  DollarSign,
  BarChart3
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  platforms: string[];
  metrics: {
    reach: number;
    engagement: number;
    clicks: number;
    posts: number;
  };
  progress: number;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Q1 Product Launch",
    description: "Launch campaign for our new AI features",
    status: "ACTIVE",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    budget: 5000,
    spent: 2800,
    platforms: ["LINKEDIN", "TWITTER", "FACEBOOK"],
    metrics: {
      reach: 45600,
      engagement: 2840,
      clicks: 1250,
      posts: 28
    },
    progress: 65
  },
  {
    id: "2", 
    name: "Brand Awareness Drive",
    description: "Increase brand visibility across social platforms",
    status: "ACTIVE",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
    budget: 3000,
    spent: 1200,
    platforms: ["INSTAGRAM", "FACEBOOK", "LINKEDIN"],
    metrics: {
      reach: 28400,
      engagement: 1680,
      clicks: 890,
      posts: 18
    },
    progress: 40
  },
  {
    id: "3",
    name: "Holiday Special",
    description: "End of year promotional campaign",
    status: "COMPLETED",
    startDate: new Date("2023-12-01"),
    endDate: new Date("2023-12-31"),
    budget: 2500,
    spent: 2450,
    platforms: ["INSTAGRAM", "FACEBOOK"],
    metrics: {
      reach: 52300,
      engagement: 4200,
      clicks: 1850,
      posts: 22
    },
    progress: 100
  }
];

const PLATFORM_ICONS = {
  LINKEDIN: "in",
  TWITTER: "𝕏", 
  FACEBOOK: "f",
  INSTAGRAM: "📷"
};

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800", 
  COMPLETED: "bg-blue-100 text-blue-800"
};

export default function SocialCampaignsManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || campaign.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "ACTIVE").length;
  const totalReach = campaigns.reduce((sum, c) => sum + c.metrics.reach, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Campaign Management</h2>
            <p className="text-slate-600">Plan, execute, and monitor your social media campaigns</p>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Campaigns</p>
                <p className="text-3xl font-bold text-slate-900">{activeCampaigns}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Budget</p>
                <p className="text-3xl font-bold text-slate-900">${totalBudget.toLocaleString()}</p>
                <p className="text-xs text-slate-500">${totalSpent.toLocaleString()} spent</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Reach</p>
                <p className="text-3xl font-bold text-slate-900">{(totalReach / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-500">Combined audience</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Budget Utilization</p>
                <p className="text-3xl font-bold text-slate-900">{((totalSpent / totalBudget) * 100).toFixed(0)}%</p>
                <Progress 
                  value={(totalSpent / totalBudget) * 100} 
                  className="mt-2 h-2"
                />
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search campaigns..."
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
        {filteredCampaigns.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No campaigns found</h3>
            <p className="text-sm text-slate-500 text-center">
              {searchQuery ? "No campaigns match your search criteria." : "Create your first campaign to get started."}
            </p>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-slate-500">{campaign.description}</p>
                      </div>
                      <div className="flex gap-1">
                        {campaign.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS]} {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={STATUS_COLORS[campaign.status]}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>{campaign.startDate.toLocaleDateString()}</div>
                      <div className="text-slate-500">to {campaign.endDate.toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                      <div className="text-slate-500">${campaign.spent.toLocaleString()} spent</div>
                      <Progress 
                        value={(campaign.spent / campaign.budget) * 100} 
                        className="mt-1 h-1"
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        {(campaign.metrics.reach / 1000).toFixed(1)}K
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-slate-400" />
                        {campaign.metrics.engagement}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-slate-400" />
                        {campaign.metrics.clicks}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {campaign.metrics.posts}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{campaign.progress}%</div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
} 