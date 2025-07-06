import {
  Activity,
  BarChart3,
  Building2,
  DollarSign,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/app-layout";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CustomerStage } from "@prisma/client";
import { UpcomingActivities } from "@/components/dashboard/upcoming-activities";
import { getUpcomingActivities } from "../../../actions/activities";
import { TicketDistributionChart } from "@/components/dashboard/ticket-distribution-chart";
import { SupportOverview } from "@/components/dashboard/support-overview";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressMetric } from "@/components/ui/progress-metric";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function CeoDashboard() {
  try {
    // Fetch counts for different business stages
    const leadsCount = await prisma.business.count({
      where: { stage: CustomerStage.lead },
    });

    const prospectsCount = await prisma.business.count({
      where: { stage: CustomerStage.prospect },
    });

    const qualifiedCount = await prisma.business.count({
      where: { stage: CustomerStage.qualified },
    });

    const customersCount = await prisma.business.count({
      where: { stage: CustomerStage.customer },
    });

    // Get the most recent leads
    const recentLeads = await prisma.business.findMany({
      where: {
        stage: {
          in: [
            CustomerStage.lead,
            CustomerStage.prospect,
            CustomerStage.qualified,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get potential value sum
    const potentialValueResult = await prisma.business.aggregate({
      where: {
        stage: {
          in: [
            CustomerStage.lead,
            CustomerStage.prospect,
            CustomerStage.qualified,
          ],
        },
        potensiellVerdi: { not: null },
      },
      _sum: {
        potensiellVerdi: true,
      },
    });

    // Fetch upcoming activities
    const upcomingActivities = await getUpcomingActivities(5);

    const totalPotentialValue = potentialValueResult._sum.potensiellVerdi || 0;

    // Prepare stat cards data
    const statCards = [
      {
        title: "New Leads",
        value: leadsCount.toString(),
        description: "Leads not yet contacted",
        icon: Users,
        trend: null,
        trendUp: null,
      },
      {
        title: "In Dialogue",
        value: (prospectsCount + qualifiedCount).toString(),
        description: "Prospects and qualified leads",
        icon: Activity,
        trend: null,
        trendUp: null,
        badges: [
          { label: `${prospectsCount} Contacted`, variant: "secondary" as const },
          { label: `${qualifiedCount} Qualified`, variant: "outline" as const },
        ],
      },
      {
        title: "Customers",
        value: customersCount.toString(),
        description: "Active customers",
        icon: Building2,
        trend: null,
        trendUp: null,
      },
      {
        title: "Potential Value",
        value: new Intl.NumberFormat("no-NO", {
          style: "currency",
          currency: "NOK",
          maximumFractionDigits: 0,
        }).format(totalPotentialValue),
        description: "Total potential value in pipeline",
        icon: DollarSign,
        trend: null,
        trendUp: null,
      },
    ];

    // Prepare pipeline progress data
    const totalCount = leadsCount + prospectsCount + qualifiedCount + customersCount;
    const pipelineData = [
      {
        label: "New leads",
        value: leadsCount,
        percentage: totalCount > 0 ? (leadsCount / totalCount) * 100 : 0,
        color: "bg-blue-300",
      },
      {
        label: "Contacted",
        value: prospectsCount,
        percentage: totalCount > 0 ? (prospectsCount / totalCount) * 100 : 0,
        color: "bg-indigo-300",
      },
      {
        label: "Qualified",
        value: qualifiedCount,
        percentage: totalCount > 0 ? (qualifiedCount / totalCount) * 100 : 0,
        color: "bg-purple-300",
      },
      {
        label: "Customers",
        value: customersCount,
        percentage: totalCount > 0 ? (customersCount / totalCount) * 100 : 0,
        color: "bg-green-300",
      },
    ];

    const headerActions = [
      {
        label: "View all leads",
        href: "/leads",
        variant: "outline" as const,
        icon: ArrowUpRight,
      },
      {
        label: "Create new lead",
        href: "/leads/new",
        variant: "default" as const,
        icon: ArrowUpRight,
        disabled: true,
      },
    ];

    return (
      <AppLayout>
        <PageHeaderWithActions
          title="CRM Dashboard"
          description="Overview of your pipeline and activities"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/ceo" },
            { label: "CEO Dashboard", isCurrentPage: true },
          ]}
          actions={headerActions}
        />
        <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
          {/* Main metric cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
            {statCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Main dashboard content - three columns on large screens */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
            {/* Pipeline Overview */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Pipeline Status
                </CardTitle>
                <CardDescription>
                  Overview of leads in different stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineData.map((item, index) => (
                    <ProgressMetric
                      key={index}
                      label={item.label}
                      value={item.value}
                      percentage={item.percentage}
                      color={item.color}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <Link href="/leads">
                    <Button variant="outline" className="w-full">
                      <span>View all leads</span>
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>
                  Recently registered leads in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.length > 0 ? (
                    recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-start space-x-3 border-b pb-3 last:border-0"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{lead.name}</p>
                            <StatusBadge
                              status={
                                lead.stage === "lead"
                                  ? "new"
                                  : lead.stage === "prospect"
                                  ? "active"
                                  : "qualified"
                              }
                              size="sm"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lead.contactPerson || lead.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Registered:{" "}
                            {new Date(lead.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No new leads found
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <Link href="/leads/new">
                    <Button disabled className="w-full">
                      <span>Create new lead</span>
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Activities */}
            <Card className="lg:col-span-1">
              <UpcomingActivities activities={upcomingActivities} />
            </Card>
          </div>

          {/* Additional dashboard charts */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6 sm:mb-8">
            {/* Ticket Distribution Chart */}
            <div className="md:col-span-1">
              <TicketDistributionChart />
            </div>

            {/* Support Overview */}
            <div className="md:col-span-1">
              <SupportOverview />
            </div>
          </div>
        </main>
      </AppLayout>
    );
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return (
      <AppLayout>
        <main className="px-2 sm:px-4 md:px-6 py-4 md:py-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CRM Dashboard</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Oversikt over din pipeline og aktiviteter
            </p>
          </div>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-muted-foreground text-sm sm:text-base">
                An error occurred while loading dashboard data. Please try again later.
              </p>
            </CardContent>
          </Card>
        </main>
      </AppLayout>
    );
  }
} 