import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsLayout } from "@/components/settings/settings-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Innstillinger",
  description: "Behandle din konto og preferenser.",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 md:py-10">
      <SettingsHeader />
      <SettingsLayout />
    </div>
  );
}
