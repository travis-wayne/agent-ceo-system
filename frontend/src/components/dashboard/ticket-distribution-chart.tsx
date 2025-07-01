import { getTicketDistributionStats } from "@/app/actions/tickets";
import { TicketChart } from "./ticket-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, BarChart3 } from "lucide-react";

export async function TicketDistributionChart() {
  // Fetch ticket distribution data
  try {
    const { distributionData, totalTickets } =
      await getTicketDistributionStats();

    // If there's no data, don't render the chart
    if (!distributionData.length || totalTickets === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sak Distribusjon
            </CardTitle>
            <CardDescription>Oversikt over saker etter status og prioritet</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <div className="py-8">
              <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Ingen saker funnet.</p>
              <p className="text-sm mt-1">Opprett saker for å se statistikk.</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Render the chart with the data
    return <TicketChart data={distributionData} totalTickets={totalTickets} />;
  } catch (error) {
    // Handle authentication errors and other issues gracefully
    console.error("Error loading ticket distribution data:", error);
    
    // Check if it's an authentication error
    const isAuthError = error instanceof Error && error.message.includes("Authentication required");
    
    if (isAuthError) {
      // Show placeholder data when not authenticated (development mode)
      const mockData = [
        { status: "open", low: 2, medium: 3, high: 1, urgent: 0, total: 6 },
        { status: "in_progress", low: 1, medium: 2, high: 2, urgent: 1, total: 6 },
        { status: "resolved", low: 5, medium: 4, high: 2, urgent: 1, total: 12 },
        { status: "closed", low: 8, medium: 6, high: 3, urgent: 1, total: 18 },
      ];
      
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sak Distribusjon (Demo Data)
            </CardTitle>
            <CardDescription>Oversikt over saker etter status og prioritet - demo data</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketChart data={mockData} totalTickets={42} />
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Dette er demo data. Logg inn for å se reelle statistikker.
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Handle other errors
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sak Distribusjon
          </CardTitle>
          <CardDescription>Oversikt over saker etter status og prioritet</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <div className="py-8">
            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Kunne ikke laste statistikk.</p>
            <p className="text-sm mt-1">Prøv igjen senere.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
}
