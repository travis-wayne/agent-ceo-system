"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconUsers,
  IconBuildingStore,
  IconUserSearch,
  IconTicket,
  IconMail,
  IconInnerShadowTop,
  IconSettings,
  IconHelp,
  IconSearch,
  IconUserCircle,
  IconBuildingSkyscraper,
  IconAd,
  IconInbox,
  IconRobot,
  IconBuilding,
  IconTrendingUp,
  IconUserCheck,
  IconHelpCircle,
  IconBrain,
  IconListCheck,
  IconBulb,
  IconMailBolt,
  IconChartBar,
  IconBrandTwitter,
  IconGitBranch,
  IconChartPie,
  IconTarget,
  IconPhone,
  IconBriefcase,
  IconMessageCircle,
  IconReportAnalytics,
  IconFileText,
  IconEye,
  IconAdjustments,
  IconDatabase,
  IconCpu,
  IconShield,
  IconDownload,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { useSession } from "@/lib/auth/client";
import { TicketBadge } from "./ticket-badge";
import { InboxBadge } from "./inbox-badge";
import { useCommandPalette } from "@/providers/command-palette-provider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const { toggle: toggleCommandPalette } = useCommandPalette();

  // Function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === "/dashboard" && pathname === "/") return true;
    return pathname === path;
  };

  // Sidebar navigation data
  const data = {
    user: {
      name: session?.user?.name || "Guest",
      email: session?.user?.email || "",
      avatar: session?.user?.image || "",
    },
    teams: [
      {
        name: "Agent CEO Platform",
        logo: IconRobot,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "AI Agent CEO",
        url: "#",
        icon: IconRobot,
        isActive: true,
        items: [
          {
            title: "CEO Dashboard",
            url: "/dashboard/ceo",
            icon: IconDashboard,
          },
          {
            title: "AI Agents",
            url: "/dashboard/ceo/agents",
            icon: IconBrain,
          },
          {
            title: "Tasks",
            url: "/dashboard/ceo/tasks",
            icon: IconListCheck,
          },
          {
            title: "Strategic Intelligence",
            url: "/dashboard/ceo/strategic",
            icon: IconBulb,
          },
          {
            title: "Email Automation",
            url: "/dashboard/ceo/email",
            icon: IconMailBolt,
          },
          {
            title: "AI Chat",
            url: "/dashboard/ceo/chat",
            icon: IconMessageCircle,
          },
          {
            title: "Data Analytics",
            url: "/dashboard/ceo/data",
            icon: IconChartBar,
            items: [
              {
                title: "Data Dashboard",
                url: "/dashboard/ceo/data",
                icon: IconChartBar,
              },
              {
                title: "Data Sources",
                url: "/dashboard/ceo/data/sources",
                icon: IconDatabase,
              },
              {
                title: "Data Processing",
                url: "/dashboard/ceo/data/processing",
                icon: IconCpu,
              },
              {
                title: "Data Quality",
                url: "/dashboard/ceo/data/quality",
                icon: IconShield,
              },
              {
                title: "Data Export",
                url: "/dashboard/ceo/data/export",
                icon: IconDownload,
              },
              {
                title: "Data Settings",
                url: "/dashboard/ceo/data/settings",
                icon: IconSettings,
              },
            ],
          },
          {
            title: "Social Media",
            url: "/dashboard/ceo/social",
            icon: IconBrandTwitter,
          },
          {
            title: "Workflows",
            url: "/dashboard/ceo/workflows",
            icon: IconGitBranch,
          },
        ],
      },
      {
        title: "Analytics & Insights",
        url: "#",
        icon: IconReportAnalytics,
        items: [
          {
            title: "Analytics Dashboard",
            url: "/dashboard/ceo/analytics",
            icon: IconChartBar,
          },
          {
            title: "AI Insights",
            url: "/dashboard/ceo/analytics/insights",
            icon: IconBulb,
          },
          {
            title: "Visualizations",
            url: "/dashboard/ceo/analytics/visualizations",
            icon: IconEye,
          },
          {
            title: "Reports",
            url: "/dashboard/ceo/analytics/reports",
            icon: IconFileText,
          },
          {
            title: "Settings",
            url: "/dashboard/ceo/analytics/settings",
            icon: IconAdjustments,
          },
        ],
      },
      {
        title: "CRM & Business",
        url: "#",
        icon: IconBuilding,
        items: [
          {
            title: "CRM Dashboard",
            url: "/dashboard/crm",
            icon: IconChartPie,
          },
          {
            title: "Leads",
            url: "/dashboard/crm/leads",
            icon: IconTarget,
          },
          {
            title: "Customers",
            url: "/dashboard/crm/customers",
            icon: IconUserCircle,
          },
          {
            title: "Businesses",
            url: "/dashboard/crm/businesses",
            icon: IconBuildingSkyscraper,
          },
          {
            title: "Applications",
            url: "/dashboard/crm/applications",
            icon: IconUserSearch,
          },
          {
            title: "Tickets",
            url: "/dashboard/crm/tickets",
            icon: IconTicket,
          },
          {
            title: "Inbox",
            url: "/dashboard/crm/inbox",
            icon: IconInbox,
          },
          {
            title: "Advertising",
            url: "/dashboard/crm/ads",
            icon: IconAd,
          },
        ],
      },
    ],
    projects: [
      {
        name: "Market Analysis Q2",
        url: "#",
        icon: IconTrendingUp,
      },
      {
        name: "Sales Automation",
        url: "#",
        icon: IconUsers,
      },
      {
        name: "Customer Success",
        url: "#",
        icon: IconUserCheck,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
      },
      {
        title: "Status",
        url: "/status",
        icon: IconHelpCircle,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
        action: toggleCommandPalette,
      },
    ],
  };

  // Update data with active states
  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: isActivePath(item.url),
    items: item.items?.map((subItem) => ({
      ...subItem,
      isActive: isActivePath(subItem.url),
    })),
  }));

  const projectsWithActive = data.projects.map((item) => ({
    ...item,
    isActive: isActivePath(item.url),
  }));

  const navSecondaryWithActive = data.navSecondary.map((item) => ({
    ...item,
    isActive: isActivePath(item.url),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard/ceo">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">AGENT CEO</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavDocuments items={projectsWithActive} title="Projects" />
        <NavSecondary items={navSecondaryWithActive} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                <div className="grid flex-1 text-left text-sm leading-tight gap-1.5">
                  <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted opacity-70" />
                </div>
                <div className="ml-auto h-4 w-4 animate-pulse rounded bg-muted" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <NavUser
            user={{
              name: session?.user?.name || "Guest",
              email: session?.user?.email || "",
              avatar: session?.user?.image || "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
