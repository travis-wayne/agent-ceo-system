'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Users, 
  FileText, 
  BarChart3,
  Send,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  MoreHorizontal,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Types
interface Campaign {
  id: string
  name: string
  description?: string
  type: string
  status: string
  priority: string
  tags: string[]
  subject: string
  fromName: string
  fromEmail: string
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
  bounceRate: number
  schedulingType: string
  scheduledTime?: Date
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  estimatedAudience?: number
}

interface EmailAutomationOverview {
  totalCampaigns: number
  activeCampaigns: number
  totalContacts: number
  totalTemplates: number
  thisMonth: {
    emailsSent: number
    avgOpenRate: number
    avgClickRate: number
    avgBounceRate: number
    revenue: number
    conversions: number
  }
  trends: {
    emailsSentGrowth: number
    openRateGrowth: number
    clickRateGrowth: number
    revenueGrowth: number
  }
  topPerformingCampaigns: Array<{
    id: string
    name: string
    openRate: number
    clickRate: number
    revenue: number
  }>
  recentActivity: Array<{
    type: string
    campaignName?: string
    templateName?: string
    listName?: string
    contactsImported?: number
    timestamp: Date
    result: string
  }>
}

export default function EmailPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [overview, setOverview] = useState<EmailAutomationOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch campaigns and overview in parallel
      const [campaignsResponse, overviewResponse] = await Promise.all([
        fetch('/api/email/campaigns'),
        fetch('/api/email/analytics?type=overview')
      ])

      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json()
        setCampaigns(campaignsData.campaigns || [])
      }

      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json()
        setOverview(overviewData.overview)
      }

    } catch (error) {
      console.error('Error fetching email automation data:', error)
      toast.error('Failed to load email automation data')
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignAction = async (campaignId: string, action: string) => {
    try {
      const response = await fetch(`/api/email/campaigns/${campaignId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      })

      if (response.ok) {
        toast.success(`Campaign ${action} successfully`)
        fetchData() // Refresh data
      } else {
        toast.error(`Failed to ${action} campaign`)
      }
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'SENDING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'PAUSED': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <>
        <PageHeader
          items={[
            { label: "CEO Dashboard", href: "/dashboard/ceo" },
            { label: "Email Automation", isCurrentPage: true },
          ]}
        />
        <main className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Email Automation", isCurrentPage: true },
        ]}
      />
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Email Automation</h1>
              <p className="text-muted-foreground">
                Manage campaigns, templates, and analyze performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Total Campaigns</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{overview?.totalCampaigns || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {overview?.activeCampaigns || 0} active campaigns
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(overview?.totalContacts || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all lists
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Emails Sent</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(overview?.thisMonth.emailsSent || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className={overview?.trends.emailsSentGrowth && overview.trends.emailsSentGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {overview?.trends.emailsSentGrowth || 0}%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(overview?.thisMonth.revenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className={overview?.trends.revenueGrowth && overview.trends.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {overview?.trends.revenueGrowth || 0}%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Open Rate</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {overview?.thisMonth.avgOpenRate?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className={overview?.trends.openRateGrowth && overview.trends.openRateGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {overview?.trends.openRateGrowth || 0}%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Click Rate</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {overview?.thisMonth.avgClickRate?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className={overview?.trends.clickRateGrowth && overview.trends.clickRateGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {overview?.trends.clickRateGrowth || 0}%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Bounce Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {overview?.thisMonth.avgBounceRate?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lower is better
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Campaigns */}
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Top Performing Campaigns</CardTitle>
                <CardDescription>
                  Campaigns with highest engagement this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overview?.topPerformingCampaigns?.length ? (
                  <div className="space-y-4">
                    {overview.topPerformingCampaigns.map((campaign, index) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-foreground">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{campaign.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Revenue: {formatCurrency(campaign.revenue)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {campaign.openRate.toFixed(1)}% open
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.clickRate.toFixed(1)}% click
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No campaigns data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                <CardDescription>
                  Latest email automation activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overview?.recentActivity?.length ? (
                  <div className="space-y-4">
                    {overview.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            {activity.type === 'campaign_sent' && `Campaign "${activity.campaignName}" was sent`}
                            {activity.type === 'template_created' && `Template "${activity.templateName}" was created`}
                            {activity.type === 'contacts_imported' && `${activity.contactsImported} contacts imported to "${activity.listName}"`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()} - {activity.result}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Filters and Search */}
            <Card className="border bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="SENDING">Sending</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="NEWSLETTER">Newsletter</SelectItem>
                      <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                      <SelectItem value="WELCOME_SERIES">Welcome Series</SelectItem>
                      <SelectItem value="PRODUCT_ANNOUNCEMENT">Product Announcement</SelectItem>
                      <SelectItem value="EVENT_PROMOTION">Event Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns List */}
            <div className="space-y-4">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="border bg-card">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 text-foreground">{campaign.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={getStatusColor(campaign.status)}
                            >
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline">{campaign.type}</Badge>
                            <Badge variant="outline">{campaign.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Subject: {campaign.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            From: {campaign.fromName} &lt;{campaign.fromEmail}&gt;
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {campaign.status === 'SENDING' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, 'pause')}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </Button>
                          )}
                          {campaign.status === 'PAUSED' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, 'resume')}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-xl font-bold text-foreground">{formatNumber(campaign.totalSent)}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-foreground">{campaign.deliveryRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Delivered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{campaign.openRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">{campaign.clickRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-600">{campaign.bounceRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Bounced</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                        <div>
                          Created: {new Date(campaign.createdAt).toLocaleDateString()}
                          {campaign.scheduledTime && (
                            <span className="ml-4">
                              Scheduled: {new Date(campaign.scheduledTime).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View Report</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Duplicate</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border bg-card">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-foreground">No campaigns found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                          ? 'Try adjusting your filters' 
                          : 'Create your first email campaign to get started'
                        }
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="border bg-card">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Email Templates</h3>
                  <p className="text-muted-foreground mb-4">
                    Create and manage reusable email templates
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border bg-card">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Deep insights into your email performance
                  </p>
                  <Button>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
} 