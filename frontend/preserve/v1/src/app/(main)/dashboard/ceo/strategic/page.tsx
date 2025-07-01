import { Metadata } from "next";
import { StrategicDashboard } from "@/components/strategic/strategic-dashboard";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Strategic Intelligence | Agent CEO",
  description: "AI-powered strategic analysis and business intelligence",
};

export default function StrategicPage() {
  return (
    <>
      <PageHeader
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Strategic Intelligence", isCurrentPage: true },
        ]}
      />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Strategic Intelligence</h1>
            <p className="text-muted-foreground">
              AI-powered strategic analysis and business intelligence for executive decision-making
            </p>
          </div>
        </div>

        <StrategicDashboard />
      </div>
    </>
  );
} 