import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Agent CEO",
    default: "Authentication | Agent CEO",
  },
  description: "Sign in or create your Agent CEO account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 