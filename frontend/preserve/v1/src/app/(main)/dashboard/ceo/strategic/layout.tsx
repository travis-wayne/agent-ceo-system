import { AppLayout } from "@/components/app-layout";

export default function StrategicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 