import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  FileText,
  Filter,
  Search,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  RefreshCw,
  Eye,
  Share2,
  Archive
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics Reports | Agent CEO",
  description: "Generated reports and downloadable analytics insights",
};

export default function AnalyticsReportsPage() {
  const reports = [
    {
      id: "report_1",
      title: "Q4 Revenue Analysis Executive Summary",
      description: "Executive summary of Q4 customer revenue analysis with key insights",
      type: "Executive Summary",
      format: "PDF",
      size: "2.4 MB",
      generated: "2024-01-15T09:30:00Z",
      status: "ready",
      downloads: 47,
      category: "Revenue"
    },
    {
      id: "report_2",
      title: "Employee Productivity Detailed Analysis",
      description: "Comprehensive analysis with raw data and statistical breakdowns",
      type: "Detailed Analysis",
      format: "Excel",
      size: "8.7 MB",
      generated: "2024-01-14T14:20:00Z",
      status: "ready",
      downloads: 23,
      category: "HR"
    },
    {
      id: "report_3",
      title: "Customer Segmentation Report",
      description: "ML-powered customer clustering and behavioral analysis",
      type: "Segmentation",
      format: "PDF",
      size: "3.1 MB",
      generated: "2024-01-13T11:45:00Z",
      status: "ready",
      downloads: 31,
      category: "Customer"
    },
    {
      id: "report_4",
      title: "Market Trends & Forecasting",
      description: "Predictive analysis of market trends and future projections",
      type: "Forecasting",
      format: "PowerPoint",
      size: "12.3 MB",
      generated: "2024-01-12T16:30:00Z",
      status: "ready",
      downloads: 18,
      category: "Market"
    },
    {
      id: "report_5",
      title: "Financial Health Dashboard",
      description: "Comprehensive financial metrics and KPI analysis",
      type: "Dashboard",
      format: "PDF",
      size: "5.6 MB",
      generated: "2024-01-11T10:15:00Z",
      status: "generating",
      downloads: 0,
      category: "Finance"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "excel":
        return <BarChart3 className="h-5 w-5 text-green-500" />;
      case "powerpoint":
        return <TrendingUp className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Analytics", href: "/dashboard/ceo/analytics" },
          { label: "Reports", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Analytics Reports</h1>
              </div>
              <p className="text-muted-foreground">
                Download and share comprehensive analysis reports and insights
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Reports</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by title or description..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="hr">HR & Productivity</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getFormatIcon(report.format)}
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{report.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{report.format}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{report.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline">{report.category}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Generated:</span>
                      <span className="font-medium">{formatDate(report.generated)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="font-medium">{report.downloads}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button size="sm" disabled={report.status !== "ready"}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </AppLayout>
  );
} 