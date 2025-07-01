import { AppLayout } from "@/components/app-layout";

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 