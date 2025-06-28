# Agent CEO Frontend Integration Guide

## Overview

This document provides a comprehensive guide for integrating the Next.js frontend with the Agent CEO Flask backend system.

## Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Next.js       │◄──────────────►│   Flask API     │
│   Frontend      │                 │   Backend       │
├─────────────────┤                 ├─────────────────┤
│ • React 18      │                 │ • Agent Mgmt    │
│ • TypeScript    │                 │ • Strategic AI  │
│ • ShadCN UI     │                 │ • Email Auto    │
│ • Tailwind CSS  │                 │ • Data Analysis │
│ • App Router    │                 │ • n8n Workflows │
└─────────────────┘                 └─────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update the configuration:
   ```env
   NEXT_PUBLIC_AGENT_CEO_API_URL=http://localhost:5000
   NEXT_PUBLIC_AGENT_CEO_API_KEY=your-api-key-here
   ```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Integration Components

### 1. API Client Service

**File**: `/src/services/agent-ceo-api.ts`

The API client provides a comprehensive interface to the Flask backend:

```typescript
import { agentCEOApi } from '@/services/agent-ceo-api';

// Example usage
const agents = await agentCEOApi.getAgents();
const insights = await agentCEOApi.generateBusinessAnalysis({
  business_context: "Tech startup",
  industry: "SaaS",
  goals: ["increase revenue", "expand market"]
});
```

**Key Features**:
- Type-safe API calls
- Error handling
- Request/response transformation
- Authentication support
- Timeout management

### 2. React Hooks

**File**: `/src/hooks/use-agent-ceo.ts`

Custom hooks for state management and API integration:

```typescript
import { useAgents, useStrategicInsights } from '@/hooks/use-agent-ceo';

function MyComponent() {
  const { agents, loading, error, createAgent } = useAgents();
  const { insights, generateBusinessAnalysis } = useStrategicInsights();
  
  // Component logic here
}
```

**Available Hooks**:
- `useAgents()` - Agent management
- `useTasks()` - Task management
- `useStrategicInsights()` - Strategic AI
- `useEmailCampaigns()` - Email automation
- `useDataAnalysis()` - Data analysis
- `useDashboard()` - Dashboard stats
- `useSocialMedia()` - Social media automation

### 3. UI Components

#### Agent Management Dashboard
**File**: `/src/components/agent-management/agent-dashboard.tsx`

Features:
- Agent creation and management
- Real-time status monitoring
- Task assignment and tracking
- Performance metrics
- Agent configuration

#### Strategic Insights Dashboard
**File**: `/src/components/strategic/strategic-dashboard.tsx`

Features:
- Quick insights generation
- Business analysis creation
- Competitive analysis
- Growth strategy planning
- Confidence scoring
- Recommendation tracking

## API Integration Points

### 1. Agent Management

```typescript
// Get all agents
const agents = await agentCEOApi.getAgents();

// Create new agent
const newAgent = await agentCEOApi.createAgent({
  name: "Sales Agent",
  type: "sales",
  description: "Handles sales automation",
  capabilities: ["lead generation", "email outreach"]
});

// Update agent
await agentCEOApi.updateAgent(agentId, { status: "active" });
```

### 2. Strategic AI

```typescript
// Generate business analysis
const analysis = await agentCEOApi.generateBusinessAnalysis({
  business_context: "E-commerce startup",
  industry: "Retail",
  goals: ["increase conversion rate", "expand product line"]
});

// Get quick insights
const insights = await agentCEOApi.getQuickInsights({
  query: "How can we improve customer retention?",
  context: "SaaS platform with 1000+ users",
  urgency: "high"
});
```

### 3. Email Automation

```typescript
// Create email campaign
const campaign = await agentCEOApi.createEmailCampaign({
  name: "Product Launch",
  subject: "Introducing Our New Feature",
  content: "Email content here...",
  recipients: ["user1@example.com", "user2@example.com"]
});

// Generate email content
const content = await agentCEOApi.generateEmailContent({
  purpose: "newsletter",
  audience: "tech professionals",
  tone: "professional",
  key_points: ["product updates", "industry insights"],
  company_info: { name: "TechCorp" }
});
```

### 4. Data Analysis

```typescript
// Upload and analyze file
const result = await agentCEOApi.uploadAndAnalyzeFile(file, {
  purpose: "financial analysis",
  industry: "technology",
  focus_area: "revenue optimization",
  business_goals: "increase profitability"
});

// Analyze CSV data
const csvAnalysis = await agentCEOApi.analyzeCSV({
  csv_content: csvData,
  analysis_context: { focus: "customer behavior" }
});
```

### 5. Social Media Automation

```typescript
// Get content suggestions
const suggestions = await agentCEOApi.getSocialMediaContentSuggestions({
  industry: "technology",
  tone: "professional",
  platform: "linkedin"
});

// Schedule post
await agentCEOApi.schedulePost({
  platform: "twitter",
  content: "Check out our latest feature!",
  schedule_time: "2024-01-15T10:00:00Z"
});
```

## Error Handling

The API client includes comprehensive error handling:

```typescript
try {
  const result = await agentCEOApi.getAgents();
  if (result.success) {
    // Handle success
    console.log(result.data);
  } else {
    // Handle API error
    console.error(result.error);
  }
} catch (error) {
  // Handle network/system error
  console.error('Network error:', error);
}
```

## Type Safety

All API responses are fully typed:

```typescript
interface Agent {
  id: string;
  name: string;
  type: 'ceo' | 'sales' | 'marketing' | 'operations' | 'analytics';
  status: 'active' | 'inactive' | 'busy' | 'error';
  description: string;
  capabilities: string[];
  created_at: string;
  last_active: string;
  performance_metrics: {
    tasks_completed: number;
    success_rate: number;
    avg_response_time: number;
  };
}
```

## State Management

The hooks provide built-in state management:

```typescript
const { 
  agents,        // Current agents data
  loading,       // Loading state
  error,         // Error state
  refetch,       // Refresh data
  createAgent,   // Create new agent
  updateAgent,   // Update agent
  deleteAgent    // Delete agent
} = useAgents();
```

## Real-time Updates

The dashboard hooks include automatic polling for real-time updates:

```typescript
// Dashboard stats update every 30 seconds
const { stats, loading, error } = useDashboard();
```

## Authentication

The API client supports authentication via API keys:

```typescript
// Set in environment variables
NEXT_PUBLIC_AGENT_CEO_API_KEY=your-api-key

// Automatically included in requests
const api = new AgentCEOApiClient({
  baseUrl: process.env.NEXT_PUBLIC_AGENT_CEO_API_URL,
  apiKey: process.env.NEXT_PUBLIC_AGENT_CEO_API_KEY
});
```

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_AGENT_CEO_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_AGENT_CEO_API_KEY=production-api-key
NODE_ENV=production
```

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Performance Optimization

1. **API Response Caching**: Responses are cached using React Query
2. **Component Lazy Loading**: Large components are lazy-loaded
3. **Image Optimization**: Next.js Image component for optimized images
4. **Bundle Splitting**: Automatic code splitting by Next.js

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Flask backend has CORS enabled
2. **API Connection**: Verify `NEXT_PUBLIC_AGENT_CEO_API_URL` is correct
3. **Authentication**: Check API key configuration
4. **Type Errors**: Ensure TypeScript types are up to date

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=agent-ceo:*
```

## Contributing

1. Follow TypeScript best practices
2. Use the existing component patterns
3. Add proper error handling
4. Include unit tests for new features
5. Update documentation for API changes

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the backend logs
4. Create an issue in the repository

## Next Steps

1. **Authentication Integration**: Implement user authentication
2. **Real-time Notifications**: Add WebSocket support
3. **Mobile Responsiveness**: Optimize for mobile devices
4. **Performance Monitoring**: Add analytics and monitoring
5. **Advanced Features**: Implement advanced AI features

