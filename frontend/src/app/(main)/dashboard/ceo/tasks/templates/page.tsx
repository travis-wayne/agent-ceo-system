import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Brain,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Target,
  Briefcase,
  Copy,
  Edit,
  Trash2,
  BookOpen,
  Zap,
  TrendingUp,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  Building2,
  DollarSign,
  Globe,
  Heart,
  Award,
  Lightbulb,
  FileText,
  Database,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Task Templates | Agent CEO",
  description: "Pre-built strategic task templates optimized for AI agents and business outcomes",
};

export default function TaskTemplatesPage() {
  // Template data organized by agent type and complexity
  const templateCategories = [
    {
      id: "strategic_analysis",
      name: "Strategic Analysis",
      agent: "CEO Agent",
      icon: "🧠",
      color: "bg-purple-500",
      description: "Market analysis, competitive intelligence, and strategic planning templates",
      templates: [
        {
          id: "market_analysis",
          name: "Comprehensive Market Analysis",
          description: "In-depth market research with competitor analysis and opportunity identification",
          complexity: "high",
          duration: "6-8 hours",
          businessImpact: 9.5,
          uses: 147,
          rating: 4.9,
          stakeholders: ["CEO", "Strategy Team", "Board"],
          deliverables: ["Market Report", "Competitive Analysis", "Strategic Recommendations"],
          tags: ["Market Research", "Competitive Intelligence", "Strategic Planning"],
        },
        {
          id: "competitive_intelligence",
          name: "Competitive Intelligence Deep Dive",
          description: "Detailed competitor analysis with SWOT assessment and strategic positioning",
          complexity: "medium",
          duration: "4-6 hours",
          businessImpact: 8.8,
          uses: 89,
          rating: 4.7,
          stakeholders: ["Strategy Team", "Product Team"],
          deliverables: ["Competitor Profiles", "SWOT Analysis", "Positioning Map"],
          tags: ["Competitor Analysis", "Market Position", "Strategic Intelligence"],
        },
        {
          id: "business_model_innovation",
          name: "Business Model Innovation Workshop",
          description: "Comprehensive business model analysis and innovation opportunities",
          complexity: "very_high",
          duration: "8-12 hours",
          businessImpact: 9.8,
          uses: 56,
          rating: 5.0,
          stakeholders: ["C-Suite", "Innovation Team"],
          deliverables: ["Business Model Canvas", "Innovation Roadmap", "Financial Projections"],
          tags: ["Innovation", "Business Model", "Strategic Transformation"],
        },
      ],
    },
    {
      id: "revenue_generation",
      name: "Revenue Generation",
      agent: "Sales Agent",
      icon: "💼",
      color: "bg-green-500",
      description: "Sales optimization, lead generation, and revenue strategy templates",
      templates: [
        {
          id: "lead_generation_campaign",
          name: "Multi-Channel Lead Generation",
          description: "Comprehensive lead generation strategy across digital and traditional channels",
          complexity: "medium",
          duration: "3-5 hours",
          businessImpact: 8.6,
          uses: 203,
          rating: 4.8,
          stakeholders: ["Sales Director", "Marketing Team"],
          deliverables: ["Campaign Strategy", "Lead Scoring Model", "Performance Metrics"],
          tags: ["Lead Generation", "Multi-Channel", "Campaign Management"],
        },
        {
          id: "sales_process_optimization",
          name: "Sales Process Excellence",
          description: "End-to-end sales process analysis and optimization framework",
          complexity: "high",
          duration: "5-7 hours",
          businessImpact: 9.1,
          uses: 134,
          rating: 4.9,
          stakeholders: ["Sales Team", "Operations"],
          deliverables: ["Process Map", "Optimization Plan", "KPI Dashboard"],
          tags: ["Process Optimization", "Sales Excellence", "Performance"],
        },
        {
          id: "customer_acquisition",
          name: "Strategic Customer Acquisition",
          description: "Targeted customer acquisition strategy with segment analysis",
          complexity: "medium",
          duration: "4-6 hours",
          businessImpact: 8.9,
          uses: 167,
          rating: 4.7,
          stakeholders: ["Sales Director", "Customer Success"],
          deliverables: ["Acquisition Strategy", "Segment Analysis", "Cost Models"],
          tags: ["Customer Acquisition", "Segmentation", "Growth Strategy"],
        },
      ],
    },
    {
      id: "brand_building",
      name: "Brand Building",
      agent: "Marketing Agent",
      icon: "🎨",
      color: "bg-pink-500",
      description: "Content creation, marketing campaigns, and brand strategy templates",
      templates: [
        {
          id: "brand_strategy_development",
          name: "Complete Brand Strategy",
          description: "Comprehensive brand positioning and strategy development framework",
          complexity: "high",
          duration: "6-8 hours",
          businessImpact: 8.7,
          uses: 178,
          rating: 4.8,
          stakeholders: ["CMO", "Brand Team", "Creative"],
          deliverables: ["Brand Strategy", "Positioning Framework", "Brand Guidelines"],
          tags: ["Brand Strategy", "Positioning", "Brand Identity"],
        },
        {
          id: "content_marketing_calendar",
          name: "Strategic Content Calendar",
          description: "30-day content marketing calendar with cross-platform optimization",
          complexity: "medium",
          duration: "3-4 hours",
          businessImpact: 8.2,
          uses: 312,
          rating: 4.6,
          stakeholders: ["Content Team", "Social Media"],
          deliverables: ["Content Calendar", "Content Strategy", "Performance Metrics"],
          tags: ["Content Marketing", "Social Media", "Campaign Planning"],
        },
        {
          id: "campaign_optimization",
          name: "Multi-Channel Campaign",
          description: "Integrated marketing campaign across digital and traditional channels",
          complexity: "high",
          duration: "5-7 hours",
          businessImpact: 8.9,
          uses: 145,
          rating: 4.9,
          stakeholders: ["Marketing Team", "Creative Team"],
          deliverables: ["Campaign Strategy", "Creative Brief", "Media Plan"],
          tags: ["Campaign Management", "Multi-Channel", "Marketing Strategy"],
        },
      ],
    },
    {
      id: "process_excellence",
      name: "Process Excellence",
      agent: "Operations Agent",
      icon: "⚙️",
      color: "bg-blue-500",
      description: "Operational optimization, automation, and efficiency templates",
      templates: [
        {
          id: "process_automation",
          name: "Process Automation Assessment",
          description: "Comprehensive process analysis and automation opportunity identification",
          complexity: "high",
          duration: "6-9 hours",
          businessImpact: 9.2,
          uses: 98,
          rating: 4.9,
          stakeholders: ["Operations Team", "IT Team"],
          deliverables: ["Process Map", "Automation Plan", "ROI Analysis"],
          tags: ["Process Automation", "Efficiency", "Digital Transformation"],
        },
        {
          id: "quality_management",
          name: "Quality Management System",
          description: "Quality assurance framework with continuous improvement processes",
          complexity: "medium",
          duration: "4-6 hours",
          businessImpact: 8.5,
          uses: 87,
          rating: 4.7,
          stakeholders: ["Quality Team", "Operations"],
          deliverables: ["Quality Framework", "KPI System", "Improvement Plan"],
          tags: ["Quality Management", "Continuous Improvement", "Standards"],
        },
        {
          id: "resource_optimization",
          name: "Resource Allocation Optimization",
          description: "Strategic resource allocation and capacity planning framework",
          complexity: "high",
          duration: "5-8 hours",
          businessImpact: 8.8,
          uses: 76,
          rating: 4.8,
          stakeholders: ["Operations", "Finance", "HR"],
          deliverables: ["Resource Plan", "Capacity Model", "Optimization Strategy"],
          tags: ["Resource Management", "Capacity Planning", "Optimization"],
        },
      ],
    },
    {
      id: "data_intelligence",
      name: "Data Intelligence",
      agent: "Analytics Agent",
      icon: "📊",
      color: "bg-orange-500",
      description: "Analytics, forecasting, and business intelligence templates",
      templates: [
        {
          id: "predictive_analytics",
          name: "Predictive Analytics Model",
          description: "Advanced predictive modeling for business forecasting and decision support",
          complexity: "very_high",
          duration: "8-12 hours",
          businessImpact: 9.6,
          uses: 67,
          rating: 5.0,
          stakeholders: ["Analytics Team", "C-Suite"],
          deliverables: ["Predictive Model", "Forecast Report", "Decision Framework"],
          tags: ["Predictive Analytics", "Machine Learning", "Forecasting"],
        },
        {
          id: "business_intelligence",
          name: "Executive BI Dashboard",
          description: "Comprehensive business intelligence dashboard for executive decision-making",
          complexity: "high",
          duration: "6-8 hours",
          businessImpact: 9.3,
          uses: 123,
          rating: 4.9,
          stakeholders: ["Executives", "Analytics Team"],
          deliverables: ["BI Dashboard", "KPI Framework", "Insights Report"],
          tags: ["Business Intelligence", "Dashboard", "Executive Reporting"],
        },
        {
          id: "customer_analytics",
          name: "Customer Behavior Analysis",
          description: "Deep customer analytics with segmentation and behavior prediction",
          complexity: "medium",
          duration: "4-6 hours",
          businessImpact: 8.7,
          uses: 156,
          rating: 4.8,
          stakeholders: ["Marketing", "Customer Success"],
          deliverables: ["Customer Segments", "Behavior Model", "Recommendations"],
          tags: ["Customer Analytics", "Segmentation", "Behavior Analysis"],
        },
      ],
    },
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "very_high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case "low": return "Low";
      case "medium": return "Medium";
      case "high": return "High";
      case "very_high": return "Very High";
      default: return complexity;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
          }`}
      />
    ));
  };

  return (

    <><PageHeader
      items={[
        { label: "CEO Dashboard", href: "/dashboard/ceo" },
        { label: "Tasks", href: "/dashboard/ceo/tasks" },
        { label: "Templates", isCurrentPage: true },
      ]} /><main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-primary" />
                Strategic Task Templates
              </h1>
              <p className="text-muted-foreground mt-2">
                Pre-built frameworks optimized for AI agents and proven business outcomes
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Template
              </Button>
              <Link href="/dashboard/ceo/tasks/new">
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search templates by name, agent, or business area..."
                  className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Total Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">1,547</p>
                  <p className="text-xs text-muted-foreground">Total Uses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">5.2h</p>
                  <p className="text-xs text-muted-foreground">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates by Agent Category */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="strategic_analysis">🧠 Strategic</TabsTrigger>
            <TabsTrigger value="revenue_generation">💼 Revenue</TabsTrigger>
            <TabsTrigger value="brand_building">🎨 Brand</TabsTrigger>
            <TabsTrigger value="process_excellence">⚙️ Operations</TabsTrigger>
            <TabsTrigger value="data_intelligence">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {templateCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{category.agent}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.templates.map((template) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {template.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getComplexityColor(template.complexity)}>
                              {getComplexityLabel(template.complexity)}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {renderStars(template.rating)}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({template.rating})
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">{template.duration}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Business Impact:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {template.businessImpact}/10
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uses:</span>
                            <span className="font-medium">{template.uses}</span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm font-medium">Deliverables:</span>
                            <div className="flex flex-wrap gap-1">
                              {template.deliverables.slice(0, 2).map((deliverable, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {deliverable}
                                </Badge>
                              ))}
                              {template.deliverables.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.deliverables.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm font-medium">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Link href={`/dashboard/ceo/tasks/new?template=${template.id}`} className="flex-1">
                              <Button size="sm" className="w-full">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Use Template
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {templateCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <CardTitle className="text-2xl">{category.name} Templates</CardTitle>
                      <CardDescription className="text-lg">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {category.templates.map((template) => (
                      <Card key={template.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="mt-2">
                                {template.description}
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderStars(template.rating)}
                              <span className="text-sm text-muted-foreground ml-2">
                                ({template.rating})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <Badge className={getComplexityColor(template.complexity)}>
                              {getComplexityLabel(template.complexity)}
                            </Badge>
                            <Badge variant="outline">
                              {template.businessImpact}/10 Impact
                            </Badge>
                            <Badge variant="outline">
                              {template.uses} Uses
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Duration:</span>
                              <span className="text-sm">{template.duration}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Stakeholders:</span>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span className="text-sm">{template.stakeholders.length}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm font-medium">Key Deliverables:</span>
                            <div className="space-y-1">
                              {template.deliverables.map((deliverable, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span className="text-sm text-muted-foreground">{deliverable}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm font-medium">Stakeholders:</span>
                            <div className="flex flex-wrap gap-1">
                              {template.stakeholders.map((stakeholder, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {stakeholder}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Link href={`/dashboard/ceo/tasks/new?template=${template.id}`} className="flex-1">
                              <Button className="w-full">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Use Template
                              </Button>
                            </Link>
                            <Button variant="outline">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </Button>
                            <Button variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Popular Templates */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Most Popular Templates
            </CardTitle>
            <CardDescription>
              Templates with highest usage and success rates across all categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {templateCategories
                .flatMap(cat => cat.templates)
                .sort((a, b) => b.uses - a.uses)
                .slice(0, 3)
                .map((template, index) => (
                  <Card key={template.id} className="relative">
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        #{index + 1}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(template.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {template.uses} uses
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/dashboard/ceo/tasks/new?template=${template.id}`}>
                        <Button size="sm" className="w-full">
                          Use Template
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </main></>
  );
} 