import { AppLayout } from "@/components/app-layout";

export default function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 