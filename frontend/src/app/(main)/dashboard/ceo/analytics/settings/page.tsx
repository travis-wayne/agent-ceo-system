import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Database,
  Bell,
  Shield,
  Clock,
  Users,
  Download,
  Upload,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  Key,
  Link,
  Mail,
  Smartphone,
  Globe,
  Zap,
  Target,
  Brain
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics Settings | Agent CEO",
  description: "Configure analytics preferences, data sources, and system settings",
};

export default function AnalyticsSettingsPage() {
  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Analytics", href: "/dashboard/ceo/analytics" },
          { label: "Settings", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Analytics Settings</h1>
              </div>
              <p className="text-muted-foreground">
                Configure analytics preferences, data sources, and system settings
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Analytics Preferences
                </CardTitle>
                <CardDescription>
                  Configure general analytics behavior and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-timeframe">Default Time Frame</Label>
                    <Select defaultValue="month">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Auto Refresh Interval</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="0">Manual only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Display Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Confidence Scores</Label>
                        <p className="text-sm text-muted-foreground">
                          Display AI confidence levels in insights
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Real-time Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically update charts and metrics
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Advanced Metrics</Label>
                        <p className="text-sm text-muted-foreground">
                          Display detailed statistical information
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis Settings
                </CardTitle>
                <CardDescription>
                  Configure AI-powered analysis and insights generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4 (Advanced)</SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 (Standard)</SelectItem>
                        <SelectItem value="claude">Claude (Alternative)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="analysis-depth">Analysis Depth</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Analysis</SelectItem>
                        <SelectItem value="standard">Standard Analysis</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Generate Insights</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate insights from new data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Predictive Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable forecasting and trend predictions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="data-sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Connected Data Sources
                </CardTitle>
                <CardDescription>
                  Manage your data connections and sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Primary Database</h4>
                        <p className="text-sm text-muted-foreground">PostgreSQL - Production</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">External API</h4>
                        <p className="text-sm text-muted-foreground">REST API - Analytics Data</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Upload className="h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">File Uploads</h4>
                        <p className="text-sm text-muted-foreground">CSV, Excel, JSON files</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button>
                    <Link className="h-4 w-4 mr-2" />
                    Add Data Source
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Processing Settings</CardTitle>
                <CardDescription>
                  Configure how data is processed and analyzed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Validation</Label>
                      <p className="text-sm text-muted-foreground">
                        Validate data quality before processing
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Duplicate Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically detect and handle duplicates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Anonymization</Label>
                      <p className="text-sm text-muted-foreground">
                        Anonymize sensitive data during processing
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure when and how you receive analytics notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Analytics Summary</Label>
                        <p className="text-sm text-muted-foreground">
                          Daily email with key metrics and insights
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Anomaly Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Immediate alerts for unusual patterns
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive weekly analytics reports
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Push Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Real-time Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Instant notifications for critical events
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Goal Achievements</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications when targets are met
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="notification-time">Notification Time</Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Alert Frequency</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>
                  Manage security settings and data privacy controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Data Privacy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">
                          Encrypt sensitive data at rest and in transit
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Retention</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically delete old analytics data
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Log all data access and modifications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Access Control</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data-retention-period">Data Retention Period</Label>
                      <Select defaultValue="365">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="730">2 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Third-Party Integrations
                </CardTitle>
                <CardDescription>
                  Connect with external tools and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Email Marketing</span>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect with email marketing platforms
                    </p>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <span className="font-medium">CRM Systems</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Salesforce, HubSpot integration
                    </p>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Mobile Apps</span>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      iOS and Android app integration
                    </p>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Key className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">API Keys</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage API access and keys
                    </p>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
} 