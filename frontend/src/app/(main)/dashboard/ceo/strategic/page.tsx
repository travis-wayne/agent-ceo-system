import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, Target, TrendingUp, BarChart3 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Strategic Intelligence | Agent CEO",
  description: "AI-powered strategic analysis and business intelligence",
};

export default function StrategicPage() {
  return (
    <><PageHeader
      items={[
        { label: "Dashboard", href: "/dashboard/ceo" },
        { label: "Strategic Intelligence", isCurrentPage: true },
      ]} />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Strategic Intelligence</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered strategic analysis and business intelligence for executive decision-making
          </p>
        </div>

        {/* Placeholder Strategic Dashboard */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Generated analyses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">
                  Analysis accuracy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Insights</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Total recommendations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Generate New Analysis</CardTitle>
              <CardDescription>
                Create comprehensive strategic analyses for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" disabled>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Business Analysis
                </Button>
                <Button variant="outline" disabled>
                  <Target className="w-4 h-4 mr-2" />
                  Competitive Analysis
                </Button>
                <Button variant="outline" disabled>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Growth Strategy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Analysis features coming soon. Backend API integration required.
              </p>
            </CardContent>
          </Card>

          {/* Placeholder Insights */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Strategic Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <CardTitle className="text-lg">Market Analysis Q2 2024</CardTitle>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">89% Confidence</span>
                  </div>
                  <CardDescription>Comprehensive analysis of current market conditions and opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Insights</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          The market shows strong growth potential in the SaaS sector with increasing demand for AI-powered business tools. Customer acquisition costs have decreased by 15% while lifetime value has increased by 23%.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <CardTitle className="text-lg">Competitive Landscape</CardTitle>
                    </div>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">76% Confidence</span>
                  </div>
                  <CardDescription>Analysis of competitor positioning and market opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Insights</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          Main competitors are focusing on enterprise customers, leaving a gap in the SMB market. Our unique positioning in AI automation gives us a competitive advantage.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Development Notice */}
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Strategic Intelligence Dashboard</h3>
              <p className="text-muted-foreground mb-4 text-center">
                This is a preview of the Strategic Intelligence features. Full functionality requires backend API integration.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Quick Insights
                </Button>
                <Button variant="outline" disabled>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
} 