# Agent CEO System

**AI-Powered Business Automation Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

## Overview

Agent CEO is a comprehensive AI-powered business automation platform that provides strategic intelligence, operational automation, and comprehensive business management capabilities. The system leverages advanced AI models including GPT-4.5 and Claude 3 Opus to deliver CEO-level strategic reasoning and decision-making support.

### Key Features

- 🧠 **Strategic AI Intelligence** - Advanced business analysis and strategic planning
- 🤖 **Multi-Agent Architecture** - Specialized AI agents for different business functions
- 📧 **Email Automation** - Comprehensive email marketing and campaign management
- 📊 **Data Analysis** - AI-powered insights from CSV, Excel, JSON, and PDF files
- 📱 **Social Media Management** - Multi-platform content creation and scheduling
- 🔄 **Workflow Automation** - n8n integration for complex business processes
- 🌐 **Full-Stack Application** - Modern Next.js frontend with Flask backend
- ☁️ **Cloud Deployment** - Ready for Railway, Render, Vercel, and other platforms

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for development)
- PostgreSQL 15+ (or use Docker)

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd agent-ceo-system
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

2. **Deploy Locally**
   ```bash
   ./scripts/deploy.sh local
   ```

3. **Deploy to Cloud**
   ```bash
   # Railway (recommended)
   ./scripts/deploy.sh railway
   
   # Render
   ./scripts/deploy.sh render
   
   # Vercel (frontend only)
   ./scripts/deploy.sh vercel
   ```

### Environment Configuration

Required environment variables:

```env
# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agentceo
REDIS_URL=redis://localhost:6379

# Email Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Social Media APIs
TWITTER_API_KEY=your_twitter_api_key
LINKEDIN_API_KEY=your_linkedin_api_key
FACEBOOK_API_KEY=your_facebook_api_key
```

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Flask API     │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   (Port 3000)   │    │   (Port 5000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │      Redis      │              │
         └──────────────►│     Cache       │◄─────────────┘
                        │   (Port 6379)   │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │       n8n       │
                        │   Workflows     │
                        │   (Port 5678)   │
                        └─────────────────┘
```

### AI Agent Architecture

- **CEO Agent** - Strategic planning and decision-making
- **Sales Agent** - Lead generation and CRM automation
- **Marketing Agent** - Content creation and campaign management
- **Operations Agent** - Process optimization and monitoring
- **Analytics Agent** - Data analysis and business intelligence

## Documentation

### PDF Documentation
- 📖 **Complete Documentation** - `docs/agent-ceo-complete-documentation.pdf`
- 🔧 **API Reference** - `docs/agent-ceo-api-reference.pdf`
- 👤 **User Manual** - `docs/agent-ceo-user-manual.pdf`
- 🚀 **Deployment Guide** - `docs/agent-ceo-deployment-guide.pdf`
- 🏗️ **Implementation Guide** - `docs/agent-ceo-implementation-guide.pdf`
- 🎯 **System Design** - `docs/agent-ceo-system-design.pdf`

### Markdown Documentation
- `docs/complete-documentation.md` - Comprehensive system documentation
- `docs/api-reference.md` - Complete API documentation
- `docs/user-manual.md` - End-user guide
- `cloud-deployment-guide.md` - Cloud deployment instructions
- `frontend-integration-guide.md` - Frontend integration details

## API Endpoints

### Core Endpoints
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create new task
- `GET /api/dashboard/stats` - System statistics

### Strategic Intelligence
- `POST /api/strategic/business-analysis` - Business analysis
- `POST /api/strategic/competitive-analysis` - Competitive intelligence
- `POST /api/strategic/decision-making` - Decision support

### Email Automation
- `GET /api/email/campaigns` - List campaigns
- `POST /api/email/campaigns` - Create campaign
- `GET /api/email/templates` - List templates

### Data Analysis
- `POST /api/data-analysis/upload` - Upload data file
- `POST /api/data-analysis/analyze` - Analyze data
- `GET /api/data-analysis/results/{id}` - Get results

## Development

### Backend Development
```bash
cd backend/agent-ceo-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```bash
# Using Docker
docker run -d --name postgres \
  -e POSTGRES_DB=agentceo \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15

# Initialize database
python backend/agent-ceo-api/src/init_db.py
```

## Deployment Options

### Railway (Recommended)
- Full-stack deployment with managed services
- $5/month free credits
- Automatic deployments from Git
- Built-in PostgreSQL and Redis

### Render
- Excellent for backend services
- Generous free tier
- Automatic SSL certificates
- Git-based deployments

### Vercel
- Optimal for frontend deployment
- Global CDN and edge functions
- Automatic scaling
- Perfect Next.js integration

### Docker Compose
```bash
docker-compose up -d
```

## Configuration

### AI Models
- **Primary**: GPT-4.5-turbo (OpenAI)
- **Secondary**: Claude 3 Opus (Anthropic)
- **Fallback**: GPT-4-turbo

### Integrations
- **Email**: Gmail API, SMTP
- **Social Media**: Twitter, LinkedIn, Facebook, Instagram
- **Workflows**: n8n automation platform
- **Data**: CSV, Excel, JSON, PDF processing

## Security

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- API rate limiting and quotas
- Data encryption at rest and in transit
- Comprehensive audit logging
- CORS and security headers

## Performance

- Redis caching for improved response times
- Database query optimization
- CDN integration for static assets
- Horizontal scaling support
- Load balancing with Nginx

## Monitoring

- Health check endpoints
- Performance metrics collection
- Error tracking and alerting
- Usage analytics and reporting
- System resource monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@agentceo.com
- 💬 Discord: [Agent CEO Community](https://discord.gg/agentceo)
- 📖 Documentation: [docs.agentceo.com](https://docs.agentceo.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/agent-ceo/issues)

## Roadmap

### Version 1.1
- [ ] Advanced workflow templates
- [ ] Mobile application
- [ ] Enhanced AI model fine-tuning
- [ ] Advanced analytics dashboard

### Version 1.2
- [ ] Multi-language support
- [ ] Advanced integrations (Slack, Teams, etc.)
- [ ] Custom AI model training
- [ ] Enterprise SSO integration

### Version 2.0
- [ ] Voice interface integration
- [ ] Advanced predictive analytics
- [ ] Industry-specific agent templates
- [ ] Advanced collaboration features

---

**Built with ❤️ by the Agent CEO Team**

*Revolutionizing business automation with AI-powered intelligence*

