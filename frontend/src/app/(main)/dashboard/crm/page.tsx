import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Plus,
  Target,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CRM Dashboard | Sailsdock",
  description: "Customer Relationship Management dashboard with leads, customers, and pipeline overview",
};

// Mock data for development
const mockData = {
  metrics: {
    totalLeads: 156,
    activeLeads: 89,
    newLeadsThisWeek: 23,
    leadsGrowth: 15.3,
    totalCustomers: 342,
    newCustomersThisMonth: 18,
    customersGrowth: 8.7,
    conversionRate: 12.5,
    averageDealSize: 45000,
    totalRevenue: 2340000,
    revenueGrowth: 22.1,
    pipelineValue: 890000,
  },
  recentLeads: [
    {
      id: "1",
      name: "TechStart AS",
      contactPerson: "Erik Hansen",
      email: "erik@techstart.no",
      stage: "lead",
      value: 75000,
      source: "Website",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2", 
      name: "Nordic Solutions",
      contactPerson: "Lisa Andersen",
      email: "lisa@nordicsolutions.com",
      stage: "prospect",
      value: 120000,
      source: "Referral",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Digital Innovators",
      contactPerson: "Magnus Olsen",
      email: "magnus@digitalinnovators.no",
      stage: "qualified",
      value: 95000,
      source: "LinkedIn",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ],
  recentActivities: [
    {
      id: "1",
      type: "call",
      description: "Called TechStart AS - discussed project requirements",
      user: "Sarah Jensen",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "email",
      description: "Sent proposal to Nordic Solutions",
      user: "Tom Nielsen",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "meeting",
      description: "Demo meeting with Digital Innovators completed",
      user: "Sarah Jensen", 
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: "4",
      type: "note",
      description: "Updated contact information for RetailChain Norge",
      user: "Erik Larsen",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  ],
  pipelineData: [
    { stage: "Lead", count: 89, value: 2450000, color: "bg-blue-500" },
    { stage: "Prospect", count: 34, value: 1890000, color: "bg-indigo-500" },
    { stage: "Qualified", count: 18, value: 1340000, color: "bg-purple-500" },
    { stage: "Proposal", count: 12, value: 980000, color: "bg-pink-500" },
    { stage: "Negotiation", count: 8, value: 720000, color: "bg-orange-500" },
    { stage: "Closed Won", count: 5, value: 450000, color: "bg-green-500" },
  ],
};

function getStageVariant(stage: string) {
  switch (stage) {
    case "lead": return "secondary";
    case "prospect": return "default";
    case "qualified": return "outline";
    case "offer_sent": return "destructive";
    default: return "secondary";
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "call": return <Phone className="h-4 w-4" />;
    case "email": return <Mail className="h-4 w-4" />;
    case "meeting": return <Calendar className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Akkurat nå";
  if (diffInHours < 24) return `${diffInHours}t siden`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "I går";
  if (diffInDays < 7) return `${diffInDays} dager siden`;
  return date.toLocaleDateString("no-NO");
}

export default function CrmDashboard() {
  const { metrics, recentLeads, recentActivities, pipelineData } = mockData;

  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "CRM Dashboard", isCurrentPage: true },
        ]}
      />
      <main className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Oversikt over leads, kunder og salgspipeline
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/leads/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ny Lead
                </Button>
              </Link>
              <Link href="/customers/new">
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ny Kunde
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeLeads}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="flex items-center text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{metrics.leadsGrowth}%
                </span>
                <span>denne måneden</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Kunder</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="flex items-center text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{metrics.customersGrowth}%
                </span>
                <span>denne måneden</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Konverteringsrate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Gjennomsnitt siste 6 måneder
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Verdi</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.pipelineValue)}</div>
              <p className="text-xs text-muted-foreground">
                Aktive muligheter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Sales Pipeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Salgspipeline
              </CardTitle>
              <CardDescription>
                Oversikt over alle muligheter i pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineData.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <span className="font-medium">{stage.stage}</span>
                      <Badge variant="outline">{stage.count}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(stage.value)}</div>
                      <div className="text-xs text-muted-foreground">
                        Snitt: {formatCurrency(stage.value / stage.count)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/pipeline">
                  <Button variant="outline" className="w-full">
                    <span>Se fullstendig pipeline</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Siste Aktivitet
              </CardTitle>
              <CardDescription>
                Nylige handlinger fra teamet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/activities">
                  <Button variant="outline" className="w-full">
                    <span>Se all aktivitet</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Nyeste Leads
                </CardTitle>
                <CardDescription>
                  Sist registrerte leads som trenger oppfølging
                </CardDescription>
              </div>
              <Link href="/leads">
                <Button variant="outline">
                  <span>Se alle leads</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{lead.name}</h4>
                        <Badge variant={getStageVariant(lead.stage)}>
                          {lead.stage === "lead" ? "Ny" : 
                           lead.stage === "prospect" ? "Kontaktet" : 
                           lead.stage === "qualified" ? "Kvalifisert" : lead.stage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{lead.contactPerson}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold">{formatCurrency(lead.value)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(lead.createdAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fra: {lead.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/leads">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Administrer Leads</h3>
                  <p className="text-sm text-muted-foreground">Se og administrer alle leads</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/customers">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Kundebase</h3>
                  <p className="text-sm text-muted-foreground">Administrer eksisterende kunder</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/businesses">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Bedrifter</h3>
                  <p className="text-sm text-muted-foreground">Alle registrerte bedrifter</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 p-6">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Rapporter</h3>
                  <p className="text-sm text-muted-foreground">Salgs- og aktivitetsrapporter</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </AppLayout>
  );
} 