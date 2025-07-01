import { AppLayout } from "@/components/app-layout";

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 