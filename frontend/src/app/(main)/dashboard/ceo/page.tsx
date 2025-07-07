"use client";

import React, { useMemo } from 'react';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app-layout";
import { PageHeaderWithActions } from "@/components/ui/page-header-with-actions";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressMetric } from "@/components/ui/progress-metric";
import { TicketDistributionChart } from "@/components/dashboard/ticket-distribution-chart";
import { SupportOverview } from "@/components/dashboard/support-overview";
import { UpcomingActivities } from "@/components/dashboard/upcoming-activities";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Target,
} from "lucide-react";

// Mock data - in production, this would come from your API
const mockData = {
  totalLeads: 1247,
  newLeads: 89,
  qualifiedLeads: 234,
  totalRevenue: 456000,
  recentLeads: [
    {
      id: "1",
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      contactPerson: "John Smith",
      stage: "lead",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Innovate Labs",
      email: "hello@innovatelabs.com",
      contactPerson: "Sarah Johnson",
      stage: "prospect",
      createdAt: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      name: "Global Systems Inc",
      email: "info@globalsystems.com",
      contactPerson: "Mike Davis",
      stage: "qualified",
      createdAt: "2024-01-13T09:15:00Z",
    },
  ],
  upcomingActivities: [
    {
      id: "1",
      title: "Follow-up call with TechCorp",
      type: "call",
      scheduledFor: "2024-01-16T10:00:00Z",
      lead: "TechCorp Solutions",
    },
    {
      id: "2",
      title: "Proposal presentation to Innovate Labs",
      type: "meeting",
      scheduledFor: "2024-01-17T14:00:00Z",
      lead: "Innovate Labs",
    },
    {
      id: "3",
      title: "Contract negotiation with Global Systems",
      type: "meeting",
      scheduledFor: "2024-01-18T11:30:00Z",
      lead: "Global Systems Inc",
    },
  ],
};

export default function CeoDashboard() {
  // Create header actions using useMemo to ensure client-side creation
  const headerActions = useMemo(() => [
    {
      label: "View all leads",
      href: "/leads",
      variant: "outline" as const,
      icon: ArrowUpRight,
      onClick: () => {},
    },
    {
      label: "Create new lead",
      href: "/leads/new",
      variant: "default" as const,
      icon: ArrowUpRight,
      onClick: () => {},
      disabled: true,
    },
  ], []);

  // Calculate pipeline data
  const { totalLeads, newLeads, qualifiedLeads, totalRevenue, recentLeads, upcomingActivities } = mockData;
  
  const prospectsCount = Math.floor(totalLeads * 0.3);
  const customersCount = Math.floor(totalLeads * 0.15);
  const totalCount = totalLeads;

    // Prepare stat cards data
  const statCards = useMemo(() => [
    {
      title: "Total Leads",
      value: totalLeads.toLocaleString(),
      description: "All time",
        icon: Users,
      trend: "+12% this month",
      trendUp: true,
    },
    {
      title: "New Leads",
      value: newLeads.toString(),
      description: "This month",
      icon: Target,
      trend: "+8% vs last month",
      trendUp: true,
    },
    {
      title: "Qualified Leads",
      value: qualifiedLeads.toString(),
      description: "Ready for sales",
      icon: TrendingUp,
      trend: "+15% vs last month",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      description: "This year",
        icon: DollarSign,
      trend: "+23% vs last year",
      trendUp: true,
    },
  ], [totalLeads, newLeads, qualifiedLeads, totalRevenue]);

  // Prepare pipeline data
  const pipelineData = useMemo(() => [
    {
      label: "New",
      value: newLeads,
      percentage: totalCount > 0 ? (newLeads / totalCount) * 100 : 0,
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
      value: qualifiedLeads,
      percentage: totalCount > 0 ? (qualifiedLeads / totalCount) * 100 : 0,
        color: "bg-purple-300",
      },
      {
        label: "Customers",
        value: customersCount,
        percentage: totalCount > 0 ? (customersCount / totalCount) * 100 : 0,
        color: "bg-green-300",
      },
  ], [newLeads, prospectsCount, qualifiedLeads, customersCount, totalCount]);

    return (
      <AppLayout>
        <PageHeaderWithActions
          title="CRM Dashboard"
          description="Overview of your pipeline and activities"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/ceo" },
          { label: "CEO Dashboard" },
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
} 