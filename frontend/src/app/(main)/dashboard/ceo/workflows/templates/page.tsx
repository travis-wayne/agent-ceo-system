import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Mail,
  Users,
  Zap,
  Database,
  MessageSquare,
  BarChart3,
  Globe,
  Settings,
  Crown,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workflow Templates",
  description: "Browse and use pre-built workflow templates",
};

export default function WorkflowTemplatesPage() {
  const templateCategories = [
    { value: "all", label: "All Templates", count: 47 },
    { value: "email", label: "Email Automation", count: 12, icon: Mail },
    { value: "leads", label: "Lead Nurturing", count: 8, icon: Users },
    { value: "tasks", label: "Task Automation", count: 15, icon: Zap },
    { value: "data", label: "Data Sync", count: 6, icon: Database },
    { value: "notifications", label: "Notifications", count: 4, icon: MessageSquare },
    { value: "reporting", label: "Reporting", count: 2, icon: BarChart3 }
  ];

  const featuredTemplates = [
    {
      id: 1,
      name: "Lead Nurturing Email Sequence",
      description: "Automatically send personalized follow-up emails to new leads based on their behavior and engagement",
      category: "Email Automation",
      icon: Mail,
      rating: 4.8,
      downloads: 1247,
      tags: ["email", "leads", "automation"],
      complexity: "Medium",
      estimatedTime: "15 min",
      isFeatured: true,
      isVerified: true
    },
    {
      id: 2,
      name: "Customer Onboarding Flow",
      description: "Complete onboarding workflow with welcome emails, task assignments, and progress tracking",
      category: "Customer Success",
      icon: Users,
      rating: 4.9,
      downloads: 892,
      tags: ["onboarding", "customers", "tasks"],
      complexity: "Advanced",
      estimatedTime: "30 min",
      isFeatured: true,
      isVerified: true
    },
    {
      id: 3,
      name: "Data Backup & Sync",
      description: "Automated daily backup of customer data with sync to external storage and notifications",
      category: "Data Management",
      icon: Database,
      rating: 4.7,
      downloads: 634,
      tags: ["backup", "data", "sync"],
      complexity: "Simple",
      estimatedTime: "10 min",
      isFeatured: true,
      isVerified: true
    }
  ];

  const allTemplates = [
    {
      id: 4,
      name: "Weekly Sales Report",
      description: "Generate and send weekly sales performance reports to stakeholders",
      category: "Reporting",
      icon: BarChart3,
      rating: 4.6,
      downloads: 423,
      tags: ["reporting", "sales", "weekly"],
      complexity: "Simple",
      estimatedTime: "5 min",
      isFeatured: false,
      isVerified: true
    },
    {
      id: 5,
      name: "Social Media Post Scheduler",
      description: "Schedule and publish social media posts across multiple platforms",
      category: "Marketing",
      icon: Globe,
      rating: 4.5,
      downloads: 567,
      tags: ["social", "marketing", "scheduling"],
      complexity: "Medium",
      estimatedTime: "20 min",
      isFeatured: false,
      isVerified: false
    },
    {
      id: 6,
      name: "Invoice Reminder System",
      description: "Automatically send payment reminders for overdue invoices",
      category: "Finance",
      icon: MessageSquare,
      rating: 4.8,
      downloads: 789,
      tags: ["finance", "invoices", "reminders"],
      complexity: "Simple",
      estimatedTime: "8 min",
      isFeatured: false,
      isVerified: true
    },
    {
      id: 7,
      name: "Support Ticket Escalation",
      description: "Escalate support tickets based on priority and response time",
      category: "Customer Support",
      icon: Settings,
      rating: 4.4,
      downloads: 345,
      tags: ["support", "tickets", "escalation"],
      complexity: "Medium",
      estimatedTime: "12 min",
      isFeatured: false,
      isVerified: true
    },
    {
      id: 8,
      name: "Employee Onboarding Checklist",
      description: "Complete HR onboarding workflow with tasks, approvals, and notifications",
      category: "HR",
      icon: CheckCircle,
      rating: 4.7,
      downloads: 456,
      tags: ["hr", "onboarding", "employees"],
      complexity: "Advanced",
      estimatedTime: "25 min",
      isFeatured: false,
      isVerified: true
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderTemplateCard = (template: any, size: "large" | "small" = "small") => (
    <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className={size === "large" ? "pb-4" : "pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <template.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className={`${size === "large" ? "text-lg" : "text-base"} flex items-center gap-2`}>
                {template.name}
                {template.isVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                {template.isFeatured && <Crown className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{template.category}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className={size === "large" ? "text-base" : "text-sm"}>
          {template.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{template.downloads}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{template.estimatedTime}</span>
            </div>
          </div>
          <Badge className={getComplexityColor(template.complexity)}>
            {template.complexity}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Use Template
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Workflows", href: "/dashboard/ceo/workflows" },
          { label: "Templates", isCurrentPage: true }
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                Workflow Templates
              </h1>
              <p className="text-muted-foreground mt-2">
                Browse and use pre-built workflow templates to get started quickly
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/ceo/workflows">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Workflows
                </Link>
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {templateCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        {category.icon && <category.icon className="h-4 w-4" />}
                        {category.label}
                        <span className="text-muted-foreground">({category.count})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="featured" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              All Templates
            </TabsTrigger>
            <TabsTrigger value="my-templates" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              My Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid gap-6">
              {featuredTemplates.map((template) => renderTemplateCard(template, "large"))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...featuredTemplates, ...allTemplates].map((template) => renderTemplateCard(template))}
            </div>
          </TabsContent>

          <TabsContent value="my-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Templates</CardTitle>
                <CardDescription>
                  Templates you've created or customized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No custom templates yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first template from an existing workflow
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
} 