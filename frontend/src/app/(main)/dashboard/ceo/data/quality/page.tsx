import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  FileText,
  Database,
  Filter,
  Search,
  Eye,
  Download,
  Plus,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Quality | Agent CEO",
  description: "Monitor and manage data quality metrics and validation rules",
};

export default function DataQualityPage() {
  return (
    <AppLayout>
      <PageHeader
        items={[
          { label: "CEO Dashboard", href: "/dashboard/ceo" },
          { label: "Data Analytics", href: "/dashboard/ceo/data" },
          { label: "Data Quality", isCurrentPage: true },
        ]}
      />
      
      <main className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Data Quality</h1>
              </div>
              <p className="text-muted-foreground">
                Monitor and manage data quality metrics and validation rules
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Quality Check
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">94.2%</p>
                  <p className="text-xs text-muted-foreground">Completeness</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">87.8%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">91.5%</p>
                  <p className="text-xs text-muted-foreground">Consistency</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">96.1%</p>
                  <p className="text-xs text-muted-foreground">Validity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Quality Monitoring</CardTitle>
            <CardDescription>Quality metrics and validation rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Data Quality</h3>
              <p className="text-muted-foreground">
                Comprehensive data quality monitoring and validation coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
