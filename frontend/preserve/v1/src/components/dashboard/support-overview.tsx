import { getSupportMetrics } from "@/app/actions/tickets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export async function SupportOverview() {
  try {
    // Fetch support metrics
    const metrics = await getSupportMetrics();

    // Format hours to a readable format
    const formatHours = (hours: number) => {
      if (hours < 1) {
        return `${Math.round(hours * 60)} min`;
      }
      return `${Math.round(hours * 10) / 10} h`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Support Overview
          </CardTitle>
          <CardDescription>
            Overview of support tickets and response times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* KPI Cards */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Open tickets</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{metrics.openTickets}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.totalTickets} total
              </p>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">
                  High priority
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {metrics.highPriorityTickets}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.overdueTickets} overdue
              </p>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">
                  Resolved last week
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {metrics.resolvedLastWeek}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(metrics.resolutionRate)}% resolution rate
              </p>
            </div>

            <div className="rounded-lg border bg-card p-3 sm:col-span-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Average times
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm font-medium">First response</p>
                  <p className="text-xl font-bold">
                    {formatHours(metrics.avgFirstResponseHours)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Resolution time</p>
                  <p className="text-xl font-bold">
                    {formatHours(metrics.avgResolutionHours)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">
                  Due soon
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {metrics.upcomingDueTickets}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Within 3 days</p>
            </div>
          </div>

          {/* High Priority Tickets */}
          {metrics.urgentTickets.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Critical tickets</h3>
              <div className="space-y-2">
                {metrics.urgentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          ticket.priority === "urgent" ? "destructive" : "default"
                        }
                      >
                        {ticket.priority === "urgent" ? "Critical" : "High"}
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {ticket.title}
                      </span>
                    </div>
                    {ticket.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.dueDate).toLocaleDateString("no-NO")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link href="/tickets">
              <Button variant="outline" className="w-full">
                <span>All support tickets</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    // Handle authentication or other errors gracefully
    console.error("Error getting support metrics:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Support Overview
          </CardTitle>
          <CardDescription>
            Overview of support tickets and response times
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          <p>No support data available.</p>
          <p className="text-sm mt-1">Please log in to view support metrics.</p>
        </CardContent>
      </Card>
    );
  }
}
