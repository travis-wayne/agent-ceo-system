import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, Users, TrendingUp, Bot, Zap, Calendar, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Email Automation | Agent CEO",
  description: "AI-powered email campaigns and automation",
};

export default function EmailPage() {
  // Mock email campaign data
  const campaigns = [
    {
      id: "campaign-001",
      name: "Q2 Product Launch Sequence",
      type: "Product Launch",
      status: "active",
      recipients: 2456,
      opened: 1834,
      clicked: 567,
      converted: 89,
      openRate: 74.7,
      clickRate: 23.1,
      conversionRate: 3.6,
      agent: "Marketing Agent",
      createdAt: "2024-01-10",
      nextSend: "2024-01-16T10:00:00Z"
    },
    {
      id: "campaign-002",
      name: "Customer Retention Outreach",
      type: "Retention",
      status: "completed",
      recipients: 1200,
      opened: 1050,
      clicked: 420,
      converted: 156,
      openRate: 87.5,
      clickRate: 35.0,
      conversionRate: 13.0,
      agent: "Customer Success Agent",
      createdAt: "2024-01-08",
      nextSend: null
    }
  ];

  const automationTemplates = [
    {
      id: "template-001",
      name: "Welcome Sequence",
      description: "5-email onboarding sequence for new customers",
      category: "Onboarding",
      emails: 5,
      avgConversion: "12.5%",
      recommended: true
    },
    {
      id: "template-002", 
      name: "Lead Nurturing",
      description: "Educational content series for prospects",
      category: "Lead Generation",
      emails: 7,
      avgConversion: "8.3%",
      recommended: false
    },
    {
      id: "template-003",
      name: "Re-engagement Campaign",
      description: "Win back inactive subscribers",
      category: "Retention",
      emails: 3,
      avgConversion: "15.7%",
      recommended: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "paused":
        return <Badge variant="destructive">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Email Automation", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Email Automation</h1>
            <p className="text-muted-foreground">
              AI-powered email campaigns and automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bot className="h-4 w-4" />
              AI Assistant
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Email Performance Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24,856</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">79.2%</div>
              <p className="text-xs text-muted-foreground">+5.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$127K</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Email Automation Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="templates">AI Templates</TabsTrigger>
            <TabsTrigger value="sequences">Automation Sequences</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaigns</CardTitle>
                <CardDescription>Manage your AI-powered email campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{campaign.type}</Badge>
                            {getStatusBadge(campaign.status)}
                            <Badge variant="secondary" className="gap-1">
                              <Bot className="h-3 w-3" />
                              {campaign.agent}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Created: {new Date(campaign.createdAt).toLocaleDateString()}
                          </div>
                          {campaign.nextSend && (
                            <div className="text-sm text-muted-foreground">
                              Next: {new Date(campaign.nextSend).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.recipients.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Recipients</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{campaign.openRate}%</div>
                          <div className="text-sm text-muted-foreground">Open Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.clickRate}%</div>
                          <div className="text-sm text-muted-foreground">Click Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{campaign.conversionRate}%</div>
                          <div className="text-sm text-muted-foreground">Conversion</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {campaign.opened.toLocaleString()} opened • {campaign.clicked.toLocaleString()} clicked • {campaign.converted} converted
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>AI Email Templates</CardTitle>
                <CardDescription>Pre-built automation templates powered by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {automationTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="mt-1">{template.category}</Badge>
                        </div>
                        {template.recommended && (
                          <Badge variant="default" className="bg-green-500 text-white">
                            <Zap className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">{template.emails}</span> emails
                        </div>
                        <div>
                          <span className="font-medium text-green-600">{template.avgConversion}</span> avg conversion
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sequences">
            <Card>
              <CardHeader>
                <CardTitle>Automation Sequences</CardTitle>
                <CardDescription>Manage your email automation workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Automation Builder</h3>
                  <p className="text-muted-foreground">
                    Coming soon - Visual automation sequence builder with AI recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Email Analytics</CardTitle>
                <CardDescription>Deep insights into your email performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">
                    Coming soon - Comprehensive email performance analytics and AI insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Enhanced Email Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Your existing email functionality is being enhanced with AI automation. 
                  Current inbox and email management features remain fully functional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 