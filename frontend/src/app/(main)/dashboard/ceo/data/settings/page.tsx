import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Database,
  Shield,
  Clock,
  Bell,
  Users,
  Key,
  Archive,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock,
  Server,
  HardDrive,
  Zap,
  Mail,
  Smartphone,
  Globe,
  FileText,
  Calendar,
  Timer
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Settings | Agent CEO",
  description: "Configure data management settings, security, and preferences",
};

export default function DataSettingsPage() {
  return (
    <>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Data Analytics", href: "/dashboard/ceo/data" },
          { label: "Settings", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Data Settings</h1>
              </div>
              <p className="text-muted-foreground">
                Configure data management settings, security, and preferences
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">287 GB</p>
                  <p className="text-xs text-muted-foreground">Used Storage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">Active</p>
                  <p className="text-xs text-muted-foreground">Security Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Archive className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Active Backups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-xs text-muted-foreground">Last Backup</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Management Settings</CardTitle>
            <CardDescription>Configure security, backup, and data policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Data Settings</h3>
              <p className="text-muted-foreground">
                Comprehensive data management configuration coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
} 