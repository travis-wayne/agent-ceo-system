import { AppLayout } from "@/components/app-layout";
import { SocialProvider } from "@/lib/social/social-context";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <SocialProvider>
        {children}
      </SocialProvider>
    </AppLayout>
  );
} 