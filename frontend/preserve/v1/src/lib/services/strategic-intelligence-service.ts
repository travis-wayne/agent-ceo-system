import { prisma } from "@/lib/db";
import { StrategicInsight, InsightCategory, ImpactLevel, UrgencyLevel, InsightStatus } from "@prisma/client";

export interface CreateInsightData {
  title: string;
  category: InsightCategory;
  description: string;
  confidence: number;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  recommendations: any[];
  metrics?: Record<string, any>;
  generatedBy: string;
  workspaceId: string;
  businessId?: string;
}

export interface AnalysisRequest {
  type: 'market_analysis' | 'customer_behavior' | 'competitive_intelligence' | 'revenue_optimization';
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  dataSource?: 'crm' | 'email' | 'social' | 'website' | 'all';
  workspaceId: string;
  businessId?: string;
}

export interface MarketAnalysisResult {
  trends: Array<{
    name: string;
    direction: 'up' | 'down' | 'stable';
    strength: number;
    timeframe: string;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    potential: number;
    effort: 'low' | 'medium' | 'high';
  }>;
  threats: Array<{
    title: string;
    description: string;
    probability: number;
    impact: number;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    timeline: string;
    resources: string[];
  }>;
}

export class StrategicIntelligenceService {
  // =============================================
  // INSIGHT MANAGEMENT
  // =============================================

  static async createInsight(data: CreateInsightData): Promise<StrategicInsight> {
    return prisma.strategicInsight.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        confidence: data.confidence,
        impact: data.impact,
        urgency: data.urgency,
        recommendations: data.recommendations,
        metrics: data.metrics || {},
        generatedBy: data.generatedBy,
        workspaceId: data.workspaceId,
        businessId: data.businessId,
        status: InsightStatus.new
      },
      include: {
        agent: true,
        business: true
      }
    });
  }

  static async getInsightsByWorkspace(workspaceId: string, filters?: any): Promise<StrategicInsight[]> {
    const whereClause: any = { workspaceId };

    if (filters?.category) whereClause.category = { in: filters.category };
    if (filters?.status) whereClause.status = { in: filters.status };
    if (filters?.impact) whereClause.impact = { in: filters.impact };

    return prisma.strategicInsight.findMany({
      where: whereClause,
      include: { agent: true, business: true },
      orderBy: [
        { urgency: 'desc' },
        { impact: 'desc' },
        { confidence: 'desc' },
        { createdAt: 'desc' }
      ],
      take: filters?.limit || 25
    });
  }

  static async updateInsightStatus(
    insightId: string, 
    status: InsightStatus
  ): Promise<StrategicInsight> {
    const updateData: any = { status };

    if (status === InsightStatus.reviewed) {
      updateData.reviewedAt = new Date();
    }
    if (status === InsightStatus.implemented) {
      updateData.implementedAt = new Date();
    }

    return prisma.strategicInsight.update({
      where: { id: insightId },
      data: updateData
    });
  }

  // =============================================
  // AI-POWERED ANALYSIS ENGINES
  // =============================================

  static async generateMarketAnalysis(request: AnalysisRequest): Promise<MarketAnalysisResult> {
    // Mock analysis - in production this would use real AI/data services
    const analysis: MarketAnalysisResult = {
      trends: [
        {
          name: "SaaS Automation Demand",
          direction: "up",
          strength: 85,
          timeframe: "Last 3 months"
        }
      ],
      opportunities: [
        {
          title: "AI Automation Market Entry",
          description: "40% growth opportunity in workflow automation",
          potential: 85,
          effort: "medium"
        }
      ],
      threats: [
        {
          title: "Increased Competition",
          description: "New AI platforms entering market",
          probability: 60,
          impact: 40
        }
      ],
      recommendations: [
        {
          action: "Accelerate automation features",
          priority: "high",
          timeline: "Q2 2024",
          resources: ["2 developers", "Product manager"]
        }
      ]
    };

    // Store as insight
    await this.createInsight({
      title: "Q2 Market Analysis & Strategic Recommendations",
      category: InsightCategory.market_analysis,
      description: "Market analysis revealing growth opportunities",
      confidence: 0.87,
      impact: ImpactLevel.high,
      urgency: UrgencyLevel.medium,
      recommendations: analysis.recommendations,
      generatedBy: "strategic-ai-agent",
      workspaceId: request.workspaceId
    });

    return analysis;
  }

  static async generateCustomerBehaviorAnalysis(request: AnalysisRequest) {
    // Similar implementation for customer behavior
    return {
      segments: [],
      behaviors: [],
      predictions: [],
      recommendations: []
    };
  }

  static async generateRevenueOptimization(request: AnalysisRequest) {
    // Similar implementation for revenue optimization
    return {
      currentMetrics: {},
      optimizations: [],
      projections: [],
      actionPlan: []
    };
  }

  // =============================================
  // DATA ANALYSIS HELPERS
  // =============================================

  private static async getCRMAnalysisData(workspaceId: string, timeframe: string): Promise<{
    totalCustomers: number;
    totalLeads: number;
    totalRevenue: number;
    avgDealSize: number;
    avgSalesCycle: number;
    conversionRate: number;
    avgCustomerValue: number;
    totalDataPoints: number;
  }> {
    const timeframeDays = this.getTimeframeDays(timeframe);
    const sinceDate = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);

    // Get businesses/customers
    const businesses = await prisma.business.findMany({
      where: { 
        workspaceId,
        createdAt: { gte: sinceDate }
      },
      include: {
        offers: true,
        activities: true
      }
    });

    const customers = businesses.filter(b => b.stage === 'customer');
    const leads = businesses.filter(b => b.stage !== 'customer');
    
    // Calculate metrics
    const totalRevenue = customers.reduce((sum, c) => sum + (c.contractValue || 0), 0);
    const avgDealSize = customers.length > 0 ? totalRevenue / customers.length : 0;
    
    // Mock additional metrics (in real implementation, would calculate from actual data)
    const avgSalesCycle = 45; // days
    const conversionRate = customers.length / (customers.length + leads.length) * 100;
    const avgCustomerValue = avgDealSize * 2.5; // Mock LTV calculation

    return {
      totalCustomers: customers.length,
      totalLeads: leads.length,
      totalRevenue,
      avgDealSize,
      avgSalesCycle,
      conversionRate,
      avgCustomerValue,
      totalDataPoints: businesses.length + businesses.reduce((sum, b) => sum + b.activities.length, 0)
    };
  }

  private static getTimeframeDays(timeframe: string): number {
    switch (timeframe) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 30;
    }
  }

  // =============================================
  // INSIGHT ANALYTICS
  // =============================================

  static async getInsightAnalytics(workspaceId: string) {
    const insights = await prisma.strategicInsight.findMany({
      where: { workspaceId }
    });

    return {
      totalInsights: insights.length,
      implementedInsights: insights.filter(i => i.status === InsightStatus.implemented).length,
      avgConfidence: insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length || 0,
      categoryBreakdown: {},
      impactDistribution: {},
      implementationRate: 0
    };
  }
} 