import { AppLayout } from "@/components/app-layout";

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 