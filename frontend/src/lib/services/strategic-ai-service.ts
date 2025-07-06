import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Strategic AI Reasoning Service
// Advanced AI Integration for Strategic Analysis as per workflow guide

export interface AIModel {
  name: string;
  fallback: string;
  temperature: number;
  max_tokens: number;
  reasoning: string;
}

export interface StrategicAnalysisResponse {
  raw_response: string;
  processed_response: any;
  structured_insights: any;
  confidence_score: number;
  model_used: string;
  analysis_metadata: any;
}

export interface AnalysisContext {
  business_context?: any;
  analysis_type: string;
  request_data: any;
}

export class StrategicAIReasoningService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  
  constructor() {
    // Initialize AI clients
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateStrategicAnalysis(
    prompt: string, 
    context: AnalysisContext, 
    analysis_type: string, 
    model_config: any = {}
  ): Promise<StrategicAnalysisResponse> {
    try {
      // Select optimal AI model for analysis type
      const selected_model = this.selectOptimalModel(analysis_type, model_config);
      
      // Enhance prompt with strategic reasoning framework
      const enhanced_prompt = this.enhanceStrategicPrompt(prompt, analysis_type, context);
      
      // Execute AI analysis
      const ai_response = await this.executeAIAnalysis(enhanced_prompt, selected_model, context);
      
      // Process and validate AI response
      const processed_response = this.processStrategicResponse(ai_response, analysis_type);
      
      // Extract structured insights
      const structured_insights = this.extractStructuredInsights(processed_response, analysis_type);
      
      return {
        raw_response: ai_response,
        processed_response,
        structured_insights,
        confidence_score: this.calculateResponseConfidence(processed_response),
        model_used: selected_model.name,
        analysis_metadata: this.generateAnalysisMetadata(analysis_type, context)
      };
      
    } catch (error) {
      console.error('Error in strategic AI analysis:', error);
      throw new Error(`Strategic AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private selectOptimalModel(analysis_type: string, model_config: any): AIModel {
    const model_selection_rules: Record<string, any> = {
      'swot_analysis': {
        primary: 'gpt-4-turbo',
        fallback: 'claude-3-opus',
        temperature: 0.3,
        reasoning: 'Excellent at structured analysis and categorization'
      },
      'competitive_analysis': {
        primary: 'claude-3-opus',
        fallback: 'gpt-4-turbo',
        temperature: 0.2,
        reasoning: 'Superior at complex competitive intelligence analysis'
      },
      'strategic_planning': {
        primary: 'gpt-4-turbo',
        fallback: 'claude-3-opus',
        temperature: 0.4,
        reasoning: 'Excellent at long-term strategic thinking and planning'
      },
      'decision_support': {
        primary: 'claude-3-opus',
        fallback: 'gpt-4-turbo',
        temperature: 0.2,
        reasoning: 'Superior at multi-criteria decision analysis'
      },
      'market_analysis': {
        primary: 'gpt-4-turbo',
        fallback: 'claude-3-opus',
        temperature: 0.3,
        reasoning: 'Strong at market trend analysis and forecasting'
      },
      'financial_analysis': {
        primary: 'gpt-4-turbo',
        fallback: 'claude-3-opus',
        temperature: 0.2,
        reasoning: 'Excellent at financial modeling and analysis'
      }
    };

    const selection_rule = model_selection_rules[analysis_type] || model_selection_rules['strategic_planning'];
    
    // Override with user-specified model if provided
    const primary_model = model_config.model || selection_rule.primary;
    
    return {
      name: primary_model,
      fallback: selection_rule.fallback,
      temperature: model_config.temperature || selection_rule.temperature,
      max_tokens: model_config.max_tokens || 3000,
      reasoning: selection_rule.reasoning
    };
  }

  private enhanceStrategicPrompt(base_prompt: string, analysis_type: string, context: AnalysisContext): string {
    const role_definition = this.buildRoleDefinition(analysis_type);
    const context_section = this.buildContextSection(context);
    const reasoning_framework = this.buildReasoningFramework(analysis_type);
    const output_format = this.buildOutputFormat(analysis_type);
    const quality_requirements = this.buildQualityRequirements(analysis_type);

    return `${role_definition}

${context_section}

${reasoning_framework}

${base_prompt}

${output_format}

${quality_requirements}`;
  }

  private buildRoleDefinition(analysis_type: string): string {
    const role_definitions: Record<string, string> = {
      'swot_analysis': `
You are a senior strategic consultant with 20+ years of experience in business analysis and strategic planning. 
You specialize in SWOT analysis and have helped Fortune 500 companies identify strategic opportunities and threats.
Your analysis is known for being thorough, insightful, and actionable.
      `,
      'competitive_analysis': `
You are a competitive intelligence expert with deep expertise in market analysis and competitive strategy.
You have extensive experience analyzing competitive landscapes across various industries and identifying strategic advantages.
Your analysis combines quantitative data with qualitative insights to provide comprehensive competitive intelligence.
      `,
      'strategic_planning': `
You are a strategic planning expert with extensive experience in developing long-term business strategies.
You have worked with companies across various industries and stages of growth to create comprehensive strategic plans.
Your approach combines analytical rigor with creative strategic thinking to develop actionable strategic roadmaps.
      `,
      'decision_support': `
You are a decision analysis expert specializing in complex business decision-making.
You have extensive experience in multi-criteria decision analysis and helping executives make critical strategic decisions.
Your approach is systematic, thorough, and considers both quantitative and qualitative factors.
      `,
      'market_analysis': `
You are a market research expert with deep knowledge of industry trends and market dynamics.
You specialize in market sizing, segmentation, and trend analysis across various industries.
Your insights help companies understand market opportunities and develop winning market strategies.
      `,
      'financial_analysis': `
You are a financial analysis expert with extensive experience in corporate finance and performance analysis.
You specialize in financial modeling, ratio analysis, and business valuation.
Your analysis provides clear insights into financial health and performance drivers.
      `
    };

    return role_definitions[analysis_type] || role_definitions['strategic_planning'];
  }

  private buildContextSection(context: AnalysisContext): string {
    return `
BUSINESS CONTEXT:
${JSON.stringify(context.business_context || {}, null, 2)}

ANALYSIS REQUEST:
${JSON.stringify(context.request_data, null,2)}
    `;
  }

  private buildReasoningFramework(analysis_type: string): string {
    const frameworks: Record<string, string> = {
      'swot_analysis': `
ANALYSIS FRAMEWORK:
1. STRENGTHS ANALYSIS: Identify unique capabilities, resources, and competitive advantages
2. WEAKNESSES ANALYSIS: Examine limitations, gaps, and areas for improvement
3. OPPORTUNITIES ANALYSIS: Explore external factors that could benefit the organization
4. THREATS ANALYSIS: Assess external risks and challenges
5. STRATEGIC SYNTHESIS: Connect insights across all four quadrants
6. ACTION RECOMMENDATIONS: Provide specific, actionable strategic recommendations
      `,
      'competitive_analysis': `
ANALYSIS FRAMEWORK:
1. COMPETITOR IDENTIFICATION: Direct, indirect, and emerging competitors
2. COMPETITIVE POSITIONING: Market position and differentiation analysis
3. COMPETITIVE BENCHMARKING: Performance comparison across key metrics
4. STRATEGIC ASSESSMENT: Competitor strategies and capabilities
5. THREAT & OPPORTUNITY ANALYSIS: Competitive risks and openings
6. STRATEGIC RESPONSE: Recommendations for competitive advantage
      `,
      'strategic_planning': `
ANALYSIS FRAMEWORK:
1. STRATEGIC POSITION ASSESSMENT: Current state analysis
2. OBJECTIVE DEFINITION: Clear, measurable strategic goals
3. STRATEGIC OPTIONS: Alternative strategies and approaches
4. STRATEGY EVALUATION: Assessment of options against criteria
5. IMPLEMENTATION PLANNING: Roadmap and resource allocation
6. RISK ASSESSMENT: Strategic risks and mitigation strategies
      `
    };

    return frameworks[analysis_type] || '';
  }

  private buildOutputFormat(analysis_type: string): string {
    return `
OUTPUT FORMAT:
Provide your analysis as a structured JSON object with the following format:
{
  "executive_summary": "Brief overview of key findings",
  "detailed_analysis": { /* Analysis-specific structured data */ },
  "key_insights": ["Insight 1", "Insight 2", "..."],
  "recommendations": [
    {
      "action": "Specific action item",
      "priority": "High/Medium/Low",
      "timeline": "Timeline for implementation",
      "rationale": "Why this recommendation is important"
    }
  ],
  "risk_assessment": {
    "level": "High/Medium/Low",
    "factors": ["Risk factor 1", "Risk factor 2"],
    "mitigation": ["Mitigation strategy 1", "Mitigation strategy 2"]
  },
  "confidence_indicators": {
    "data_quality": 0.0-1.0,
    "analysis_depth": 0.0-1.0,
    "recommendation_strength": 0.0-1.0
  }
}
    `;
  }

  private buildQualityRequirements(analysis_type: string): string {
    return `
QUALITY REQUIREMENTS:
1. Be specific and actionable in all recommendations
2. Support insights with clear reasoning and evidence
3. Consider both short-term and long-term implications
4. Address potential risks and mitigation strategies
5. Maintain objectivity and analytical rigor
6. Provide confidence indicators for all major conclusions
    `;
  }

  private async executeAIAnalysis(enhanced_prompt: string, model: AIModel, context: AnalysisContext): Promise<string> {
    try {
      if (model.name.includes('gpt') || model.name.includes('openai')) {
        return await this.executeOpenAIAnalysis(enhanced_prompt, model);
      } else if (model.name.includes('claude') || model.name.includes('anthropic')) {
        return await this.executeAnthropicAnalysis(enhanced_prompt, model);
      } else {
        throw new Error(`Unsupported model: ${model.name}`);
      }
    } catch (error) {
      console.error(`Error with primary model ${model.name}, trying fallback:`, error);
      
      // Try fallback model
      const fallback_model = { ...model, name: model.fallback };
      if (fallback_model.name.includes('gpt')) {
        return await this.executeOpenAIAnalysis(enhanced_prompt, fallback_model);
      } else {
        return await this.executeAnthropicAnalysis(enhanced_prompt, fallback_model);
      }
    }
  }

  private async executeOpenAIAnalysis(prompt: string, model: AIModel): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: model.name,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: model.temperature,
      max_tokens: model.max_tokens
    });

    return response.choices[0]?.message?.content || '';
  }

  private async executeAnthropicAnalysis(prompt: string, model: AIModel): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: model.name.replace('claude-3-opus', 'claude-3-opus-20240229'),
      max_tokens: model.max_tokens,
      temperature: model.temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0]?.type === 'text' ? response.content[0].text : '';
  }

  private processStrategicResponse(ai_response: string, analysis_type: string): any {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(ai_response);
      return parsed;
    } catch (error) {
      // If not valid JSON, structure the response
      return {
        raw_text: ai_response,
        structured: false,
        analysis_type,
        processing_error: 'Response was not in valid JSON format'
      };
    }
  }

  private extractStructuredInsights(processed_response: any, analysis_type: string): any {
    if (processed_response.structured === false) {
      return {
        insights_available: false,
        raw_analysis: processed_response.raw_text
      };
    }

    return {
      executive_summary: processed_response.executive_summary || '',
      key_insights: processed_response.key_insights || [],
      recommendations: processed_response.recommendations || [],
      risk_assessment: processed_response.risk_assessment || {},
      detailed_analysis: processed_response.detailed_analysis || {},
      confidence_indicators: processed_response.confidence_indicators || {}
    };
  }

  private calculateResponseConfidence(processed_response: any): number {
    if (processed_response.structured === false) {
      return 0.3; // Low confidence for unstructured responses
    }

    const confidence_indicators = processed_response.confidence_indicators || {};
    const data_quality = confidence_indicators.data_quality || 0.7;
    const analysis_depth = confidence_indicators.analysis_depth || 0.7;
    const recommendation_strength = confidence_indicators.recommendation_strength || 0.7;

    return (data_quality + analysis_depth + recommendation_strength) / 3;
  }

  private generateAnalysisMetadata(analysis_type: string, context: AnalysisContext): any {
    return {
      analysis_type,
      timestamp: new Date().toISOString(),
      context_completeness: this.assessContextCompleteness(context),
      processing_version: '1.0.0'
    };
  }

  private assessContextCompleteness(context: AnalysisContext): number {
    const business_context = context.business_context || {};
    const required_fields = ['companyName', 'industry', 'companySize', 'businessStage'];
    const available_fields = required_fields.filter(field => business_context[field]);
    
    return available_fields.length / required_fields.length;
  }
}

// Export singleton instance
export const strategicAIService = new StrategicAIReasoningService(); 