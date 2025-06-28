from flask import Blueprint, jsonify, request
from src.services.n8n_service import n8n_service
from src.services.social_media_service import social_media_service

n8n_bp = Blueprint('n8n', __name__)

# n8n Workflow Routes
@n8n_bp.route('/n8n/workflows', methods=['GET'])
def list_workflows():
    """List all available n8n workflows"""
    result = n8n_service.list_workflows()
    return jsonify(result)

@n8n_bp.route('/n8n/workflows/<workflow_id>/execute', methods=['POST'])
def execute_workflow(workflow_id):
    """Execute a specific n8n workflow"""
    data = request.json or {}
    
    result = n8n_service.trigger_workflow(workflow_id, data)
    return jsonify(result)

@n8n_bp.route('/n8n/webhook/<webhook_name>', methods=['POST'])
def trigger_webhook(webhook_name):
    """Trigger an n8n webhook"""
    data = request.json or {}
    
    result = n8n_service.trigger_webhook(webhook_name, data)
    return jsonify(result)

@n8n_bp.route('/n8n/executions/<execution_id>/status', methods=['GET'])
def get_execution_status(execution_id):
    """Get the status of a workflow execution"""
    result = n8n_service.get_workflow_status(execution_id)
    return jsonify(result)

@n8n_bp.route('/n8n/health', methods=['GET'])
def n8n_health():
    """Check n8n service health"""
    result = n8n_service.health_check()
    return jsonify(result)

# Social Media Automation Routes
@n8n_bp.route('/n8n/social-media/post', methods=['POST'])
def create_social_media_post():
    """Create and post content to social media platforms"""
    data = request.json
    
    platform = data.get('platform')
    content = data.get('content')
    schedule_time = data.get('schedule_time')
    media_urls = data.get('media_urls', [])
    
    if not platform or not content:
        return jsonify({'error': 'platform and content are required'}), 400
    
    if schedule_time:
        # Use n8n for scheduled posting
        result = n8n_service.create_social_media_post(
            platform=platform,
            content=content,
            schedule_time=schedule_time,
            media_urls=media_urls
        )
    else:
        # Post immediately using social media service
        if platform.lower() == 'linkedin':
            result = social_media_service.post_to_linkedin(content, media_urls)
        elif platform.lower() == 'twitter':
            result = social_media_service.post_to_twitter(content, media_urls)
        elif platform.lower() == 'facebook':
            result = social_media_service.post_to_facebook(content, media_urls)
        else:
            result = {'success': False, 'error': f'Unsupported platform: {platform}'}
    
    return jsonify(result)

@n8n_bp.route('/n8n/social-media/multi-post', methods=['POST'])
def create_multi_platform_post():
    """Post content to multiple social media platforms"""
    data = request.json
    
    platforms = data.get('platforms', [])
    content = data.get('content')
    media_urls = data.get('media_urls', [])
    
    if not platforms or not content:
        return jsonify({'error': 'platforms and content are required'}), 400
    
    result = social_media_service.post_to_multiple_platforms(
        platforms=platforms,
        content=content,
        media_urls=media_urls
    )
    
    return jsonify(result)

@n8n_bp.route('/n8n/social-media/analytics/<platform>', methods=['GET'])
def get_social_media_analytics(platform):
    """Get social media analytics for a platform"""
    days = request.args.get('days', 7, type=int)
    
    result = social_media_service.get_platform_analytics(platform, days)
    return jsonify(result)

@n8n_bp.route('/n8n/social-media/content-suggestions', methods=['POST'])
def get_content_suggestions():
    """Get AI-generated content suggestions"""
    data = request.json
    
    industry = data.get('industry', 'technology')
    tone = data.get('tone', 'professional')
    
    result = social_media_service.generate_content_suggestions(industry, tone)
    return jsonify(result)

# Email Campaign Routes
@n8n_bp.route('/n8n/email/campaign', methods=['POST'])
def send_email_campaign():
    """Send email campaign via n8n workflow"""
    data = request.json
    
    recipients = data.get('recipients', [])
    subject = data.get('subject')
    content = data.get('content')
    template_id = data.get('template_id')
    
    if not recipients or not subject or not content:
        return jsonify({'error': 'recipients, subject, and content are required'}), 400
    
    result = n8n_service.send_email_campaign(
        recipients=recipients,
        subject=subject,
        content=content,
        template_id=template_id
    )
    
    return jsonify(result)

# Lead Generation Routes
@n8n_bp.route('/n8n/leads/generate', methods=['POST'])
def generate_leads():
    """Generate leads via n8n workflow"""
    data = request.json
    
    criteria = data.get('criteria', {})
    
    if not criteria:
        return jsonify({'error': 'criteria is required'}), 400
    
    result = n8n_service.generate_leads(criteria)
    return jsonify(result)

# Web Scraping Routes
@n8n_bp.route('/n8n/scraping/business-data', methods=['POST'])
def scrape_business_data():
    """Scrape business data via n8n workflow"""
    data = request.json
    
    target_urls = data.get('target_urls', [])
    data_types = data.get('data_types', ['contacts', 'company_info'])
    
    if not target_urls:
        return jsonify({'error': 'target_urls is required'}), 400
    
    result = n8n_service.scrape_business_data(target_urls, data_types)
    return jsonify(result)

# CRM Integration Routes
@n8n_bp.route('/n8n/crm/sync', methods=['POST'])
def sync_crm_data():
    """Sync CRM data via n8n workflow"""
    data = request.json
    
    crm_platform = data.get('crm_platform')
    sync_type = data.get('sync_type', 'bidirectional')
    
    if not crm_platform:
        return jsonify({'error': 'crm_platform is required'}), 400
    
    result = n8n_service.sync_crm_data(crm_platform, sync_type)
    return jsonify(result)

# Competitor Analysis Routes
@n8n_bp.route('/n8n/competitors/analyze', methods=['POST'])
def analyze_competitors():
    """Analyze competitors via n8n workflow"""
    data = request.json
    
    competitors = data.get('competitors', [])
    analysis_types = data.get('analysis_types', ['pricing', 'content'])
    
    if not competitors:
        return jsonify({'error': 'competitors list is required'}), 400
    
    result = n8n_service.analyze_competitor_data(competitors, analysis_types)
    return jsonify(result)

# Content Calendar Routes
@n8n_bp.route('/n8n/content/schedule', methods=['POST'])
def schedule_content_calendar():
    """Schedule content calendar via n8n workflow"""
    data = request.json
    
    content_items = data.get('content_items', [])
    
    if not content_items:
        return jsonify({'error': 'content_items is required'}), 400
    
    result = n8n_service.schedule_content_calendar(content_items)
    return jsonify(result)

# Automation Status Routes
@n8n_bp.route('/n8n/automation/status', methods=['GET'])
def get_automation_status():
    """Get overall automation system status"""
    
    # Check n8n health
    n8n_health = n8n_service.health_check()
    
    # Check social media service health
    social_health = social_media_service.health_check()
    
    # Get workflow list
    workflows = n8n_service.list_workflows()
    
    status = {
        'timestamp': n8n_health.get('timestamp'),
        'n8n_service': n8n_health,
        'social_media_service': social_health,
        'workflows': workflows,
        'overall_status': 'healthy' if n8n_health.get('success') else 'degraded'
    }
    
    return jsonify(status)

# Webhook Endpoints for n8n to call back
@n8n_bp.route('/n8n/webhooks/task-completed', methods=['POST'])
def handle_task_completed():
    """Handle task completion webhook from n8n"""
    data = request.json
    
    task_id = data.get('task_id')
    workflow_id = data.get('workflow_id')
    execution_id = data.get('execution_id')
    result = data.get('result', {})
    status = data.get('status', 'completed')
    
    # Log the completion
    print(f"n8n task completed: {task_id}, workflow: {workflow_id}, status: {status}")
    
    # Here you could update your database, send notifications, etc.
    
    return jsonify({
        'success': True,
        'message': 'Task completion processed',
        'task_id': task_id
    })

@n8n_bp.route('/n8n/webhooks/workflow-error', methods=['POST'])
def handle_workflow_error():
    """Handle workflow error webhook from n8n"""
    data = request.json
    
    workflow_id = data.get('workflow_id')
    execution_id = data.get('execution_id')
    error = data.get('error', {})
    
    # Log the error
    print(f"n8n workflow error: {workflow_id}, execution: {execution_id}, error: {error}")
    
    # Here you could send alerts, update status, etc.
    
    return jsonify({
        'success': True,
        'message': 'Error processed',
        'workflow_id': workflow_id
    })

@n8n_bp.route('/n8n/webhooks/lead-generated', methods=['POST'])
def handle_lead_generated():
    """Handle new lead webhook from n8n"""
    data = request.json
    
    lead_data = data.get('lead', {})
    source = data.get('source', 'n8n_workflow')
    
    # Process the new lead
    print(f"New lead generated: {lead_data.get('email', 'unknown')} from {source}")
    
    # Here you could save to database, trigger follow-up workflows, etc.
    
    return jsonify({
        'success': True,
        'message': 'Lead processed',
        'lead_id': lead_data.get('id')
    })

