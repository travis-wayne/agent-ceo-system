import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Agent CEO",
    default: "Setup | Agent CEO",
  },
  description: "Complete your Agent CEO setup",
};

export default function OnboardingLayout({
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