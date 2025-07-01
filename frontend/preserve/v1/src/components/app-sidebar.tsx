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
} from "@tabler/icons-react";
import {
  Bot,
  TrendingUp,
  Users,
  Cog,
  BarChart3,
  Zap,
  Globe,
  Building2,
  UserCheck,
  CreditCard,
  Mail,
  Calendar,
  Settings,
  HelpCircle,
  ChevronUp,
  FileText,
  Workflow,
  Target,
  Database,
  Inbox,
  Ticket
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "@/components/nav-secondary";
import { useSession } from "@/lib/auth/client";
import { TicketBadge } from "./ticket-badge";
import { InboxBadge } from "./inbox-badge";
import { useCommandPalette } from "@/providers/command-palette-provider";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const { toggle: toggleCommandPalette } = useCommandPalette();

  // Function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === "/" && pathname === "/") return true;
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
        logo: Bot,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "AI Agent CEO",
        url: "#",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: "CEO Dashboard",
            url: "/dashboard/ceo",
          },
          {
            title: "AI Agents",
            url: "/dashboard/ceo/agents",
          },
          {
            title: "Tasks",
            url: "/dashboard/ceo/tasks",
          },
          {
            title: "Strategic Intelligence",
            url: "/dashboard/ceo/strategic",
          },
          {
            title: "Email Automation",
            url: "/dashboard/ceo/email",
          },
          {
            title: "Data Analytics",
            url: "/dashboard/ceo/data",
          },
          {
            title: "Social Media",
            url: "/dashboard/ceo/social",
          },
          {
            title: "Workflows",
            url: "/dashboard/ceo/workflows",
          },
        ],
      },
      {
        title: "CRM & Business",
        url: "#",
        icon: Building2,
        items: [
          {
            title: "CRM Dashboard",
            url: "/dashboard/crm",
          },
          {
            title: "Leads",
            url: "/dashboard/crm/leads",
          },
          {
            title: "Customers",
            url: "/dashboard/crm/customers",
          },
          {
            title: "Businesses",
            url: "/dashboard/crm/businesses",
          },
          {
            title: "Applications",
            url: "/dashboard/crm/applications",
          },
          {
            title: "Tickets",
            url: "/dashboard/crm/tickets",
          },
          {
            title: "Inbox",
            url: "/dashboard/crm/inbox",
          },
          {
            title: "Advertising",
            url: "/dashboard/crm/ads",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Market Analysis Q2",
        url: "#",
        icon: TrendingUp,
      },
      {
        name: "Sales Automation",
        url: "#",
        icon: Users,
      },
      {
        name: "Customer Success",
        url: "#",
        icon: UserCheck,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Support",
        url: "#",
        icon: HelpCircle,
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
  }));

  const supportWithActive = data.navMain[1].items.map((item) => ({
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
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
          <NavUser user={data.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
