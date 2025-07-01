import { AppLayout } from "@/components/app-layout";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 