# n8n Workflows for Agent CEO System

## Overview
This document outlines the n8n workflows needed for the Agent CEO system automation. These workflows handle social media posting, email campaigns, lead generation, web scraping, and business intelligence.

## Required n8n Workflows

### 1. Social Media Automation Workflow
**Workflow Name:** `social-media-post`
**Trigger:** Webhook
**Purpose:** Automate social media posting across multiple platforms

**Nodes:**
1. **Webhook Trigger** - Receives post data from Agent CEO API
2. **Switch Node** - Routes based on platform (LinkedIn, Twitter, Facebook, Instagram)
3. **LinkedIn Node** - Posts to LinkedIn using LinkedIn API
4. **Twitter Node** - Posts to Twitter using Twitter API v2
5. **Facebook Node** - Posts to Facebook Page using Graph API
6. **Instagram Node** - Posts to Instagram using Instagram Basic Display API
7. **Buffer/Hootsuite Node** - For scheduled posting
8. **Response Node** - Returns success/failure status

**Input Data:**
```json
{
  "platform": "linkedin",
  "content": "Your post content here",
  "schedule_time": "2025-01-01T10:00:00Z",
  "media_urls": ["https://example.com/image.jpg"],
  "hashtags": ["#business", "#ai"]
}
```

### 2. Email Campaign Workflow
**Workflow Name:** `email-campaign`
**Trigger:** Webhook
**Purpose:** Send automated email campaigns

**Nodes:**
1. **Webhook Trigger** - Receives campaign data
2. **Gmail/SMTP Node** - Sends emails using configured email service
3. **Template Processing** - Processes email templates with dynamic content
4. **Personalization Node** - Personalizes emails for each recipient
5. **Tracking Node** - Adds tracking pixels and links
6. **Response Node** - Returns campaign status

**Input Data:**
```json
{
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Your Email Subject",
  "content": "Email content with {{name}} placeholders",
  "template_id": "template_123",
  "tracking_enabled": true
}
```

### 3. Lead Generation Workflow
**Workflow Name:** `lead-generation`
**Trigger:** Webhook/Schedule
**Purpose:** Automated lead generation and qualification

**Nodes:**
1. **Webhook/Cron Trigger** - Starts lead generation process
2. **Web Scraping Nodes** - Scrape business directories, LinkedIn, etc.
3. **Data Validation** - Validates and cleans scraped data
4. **Email Finder** - Finds email addresses using Hunter.io or similar
5. **Lead Scoring** - Scores leads based on criteria
6. **CRM Integration** - Saves qualified leads to CRM
7. **Notification Node** - Notifies team of new leads

**Input Data:**
```json
{
  "criteria": {
    "industry": "technology",
    "company_size": "50-200",
    "location": "United States",
    "job_titles": ["CEO", "CTO", "VP"]
  },
  "max_leads": 100,
  "min_score": 70
}
```

### 4. Web Scraping Workflow
**Workflow Name:** `web-scraping`
**Trigger:** Webhook/Schedule
**Purpose:** Scrape business data from various sources

**Nodes:**
1. **Webhook/Cron Trigger** - Initiates scraping
2. **HTTP Request Nodes** - Fetch web pages
3. **HTML Extract Nodes** - Extract specific data elements
4. **Data Processing** - Clean and structure data
5. **Duplicate Detection** - Remove duplicate entries
6. **Database Storage** - Store data in Agent CEO database
7. **Quality Check** - Validate data quality

**Target Sources:**
- Company websites
- Business directories
- Social media profiles
- Industry publications
- Competitor websites

### 5. CRM Synchronization Workflow
**Workflow Name:** `crm-sync`
**Trigger:** Schedule/Webhook
**Purpose:** Sync data between Agent CEO and external CRMs

**Nodes:**
1. **Cron/Webhook Trigger** - Scheduled or manual sync
2. **CRM API Nodes** (Salesforce, HubSpot, Pipedrive)
3. **Data Mapping** - Map fields between systems
4. **Conflict Resolution** - Handle data conflicts
5. **Bidirectional Sync** - Import and export data
6. **Audit Log** - Log all sync activities

### 6. Competitor Analysis Workflow
**Workflow Name:** `competitor-analysis`
**Trigger:** Schedule
**Purpose:** Monitor and analyze competitor activities

**Nodes:**
1. **Cron Trigger** - Daily/weekly analysis
2. **Web Scraping** - Scrape competitor websites
3. **Social Media Monitoring** - Monitor competitor social media
4. **Price Monitoring** - Track competitor pricing
5. **Content Analysis** - Analyze competitor content
6. **AI Analysis** - Generate insights using AI
7. **Report Generation** - Create analysis reports

### 7. Content Calendar Workflow
**Workflow Name:** `content-calendar`
**Trigger:** Schedule
**Purpose:** Automate content planning and scheduling

**Nodes:**
1. **Cron Trigger** - Daily content planning
2. **AI Content Generation** - Generate content ideas
3. **Content Approval** - Route for approval if needed
4. **Multi-Platform Scheduling** - Schedule across platforms
5. **Performance Tracking** - Track content performance
6. **Optimization** - Optimize posting times and content

### 8. Business Intelligence Workflow
**Workflow Name:** `business-intelligence`
**Trigger:** Schedule
**Purpose:** Generate business reports and insights

**Nodes:**
1. **Cron Trigger** - Daily/weekly/monthly reports
2. **Data Collection** - Gather data from various sources
3. **Data Processing** - Clean and aggregate data
4. **AI Analysis** - Generate insights using AI
5. **Report Generation** - Create visual reports
6. **Distribution** - Send reports to stakeholders

## n8n Setup Instructions

### 1. Installation
```bash
# Using Docker
docker run -d --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n

# Using npm
npm install n8n -g
n8n start
```

### 2. Configuration
1. Access n8n at `http://localhost:5678`
2. Create admin account
3. Configure credentials for:
   - Social media platforms (LinkedIn, Twitter, Facebook)
   - Email services (Gmail, SMTP)
   - CRM systems (Salesforce, HubSpot)
   - Web scraping tools

### 3. Webhook Configuration
Set up webhooks in n8n to receive data from Agent CEO API:
- Base webhook URL: `http://localhost:5678/webhook/`
- Configure webhook endpoints for each workflow
- Set up authentication if needed

### 4. Environment Variables
Configure the following environment variables:

```bash
# Social Media APIs
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Email Services
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# CRM APIs
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
HUBSPOT_API_KEY=your_hubspot_api_key

# Other Services
HUNTER_IO_API_KEY=your_hunter_io_api_key
CLEARBIT_API_KEY=your_clearbit_api_key
```

### 5. Workflow Import
1. Create each workflow in n8n interface
2. Configure nodes according to specifications above
3. Test each workflow with sample data
4. Set up error handling and notifications

## Integration with Agent CEO API

The Agent CEO Flask API integrates with n8n through:

1. **Webhook Triggers** - API calls n8n webhooks to start workflows
2. **Status Monitoring** - API checks workflow execution status
3. **Data Exchange** - Bidirectional data flow between systems
4. **Error Handling** - Proper error handling and retry mechanisms

## Monitoring and Maintenance

1. **Health Checks** - Regular health checks of n8n service
2. **Performance Monitoring** - Monitor workflow execution times
3. **Error Alerts** - Set up alerts for workflow failures
4. **Data Quality** - Monitor data quality and accuracy
5. **Security** - Regular security updates and credential rotation

## Scaling Considerations

1. **Resource Allocation** - Ensure adequate CPU and memory
2. **Workflow Optimization** - Optimize workflows for performance
3. **Load Balancing** - Consider multiple n8n instances for high load
4. **Database Performance** - Optimize database queries and indexes
5. **Caching** - Implement caching for frequently accessed data

