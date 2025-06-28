from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from src.services.email_service import email_service

email_bp = Blueprint('email', __name__)

@email_bp.route('/email/send', methods=['POST'])
def send_email():
    """Send a single email"""
    data = request.json
    
    to_emails = data.get('to_emails', [])
    subject = data.get('subject')
    content = data.get('content')
    template = data.get('template')
    template_vars = data.get('template_vars', {})
    method = data.get('method', 'auto')
    attachments = data.get('attachments', [])
    
    if not to_emails or not subject or not content:
        return jsonify({'error': 'to_emails, subject, and content are required'}), 400
    
    result = email_service.send_email(
        to_emails=to_emails,
        subject=subject,
        content=content,
        template=template,
        template_vars=template_vars,
        method=method,
        attachments=attachments
    )
    
    return jsonify(result)

@email_bp.route('/email/campaign', methods=['POST'])
def send_campaign():
    """Send email campaign to multiple recipients"""
    data = request.json
    
    campaign_data = {
        'campaign_id': data.get('campaign_id'),
        'recipients': data.get('recipients', []),
        'subject': data.get('subject'),
        'content': data.get('content'),
        'template': data.get('template'),
        'global_vars': data.get('global_vars', {}),
        'method': data.get('method', 'auto')
    }
    
    if not campaign_data['recipients'] or not campaign_data['subject'] or not campaign_data['content']:
        return jsonify({'error': 'recipients, subject, and content are required'}), 400
    
    result = email_service.send_campaign(campaign_data)
    return jsonify(result)

@email_bp.route('/email/schedule', methods=['POST'])
def schedule_email():
    """Schedule an email for future sending"""
    data = request.json
    
    email_data = {
        'to_emails': data.get('to_emails', []),
        'subject': data.get('subject'),
        'content': data.get('content'),
        'template': data.get('template'),
        'template_vars': data.get('template_vars', {}),
        'method': data.get('method', 'auto')
    }
    
    send_time_str = data.get('send_time')
    
    if not email_data['to_emails'] or not email_data['subject'] or not send_time_str:
        return jsonify({'error': 'to_emails, subject, and send_time are required'}), 400
    
    try:
        send_time = datetime.fromisoformat(send_time_str.replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Invalid send_time format. Use ISO format.'}), 400
    
    result = email_service.schedule_email(email_data, send_time)
    return jsonify(result)

@email_bp.route('/email/templates', methods=['GET'])
def get_templates():
    """Get all available email templates"""
    result = email_service.get_email_templates()
    return jsonify(result)

@email_bp.route('/email/templates', methods=['POST'])
def create_template():
    """Create a new email template"""
    data = request.json
    
    template_name = data.get('template_name')
    subject = data.get('subject')
    html_content = data.get('html_content')
    variables = data.get('variables', [])
    
    if not template_name or not subject or not html_content:
        return jsonify({'error': 'template_name, subject, and html_content are required'}), 400
    
    result = email_service.create_email_template(
        template_name=template_name,
        subject=subject,
        html_content=html_content,
        variables=variables
    )
    
    return jsonify(result)

@email_bp.route('/email/reports/activity', methods=['GET'])
def get_email_report():
    """Generate email activity report"""
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')
    
    # Default to last 30 days if not specified
    if not end_date_str:
        end_date = datetime.utcnow()
    else:
        try:
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid end_date format. Use ISO format.'}), 400
    
    if not start_date_str:
        start_date = end_date - timedelta(days=30)
    else:
        try:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid start_date format. Use ISO format.'}), 400
    
    result = email_service.generate_email_report(start_date, end_date)
    return jsonify(result)

@email_bp.route('/email/health', methods=['GET'])
def email_health():
    """Check email service health"""
    result = email_service.health_check()
    return jsonify(result)

# AI-powered email content generation
@email_bp.route('/email/generate-content', methods=['POST'])
def generate_email_content():
    """Generate email content using AI"""
    data = request.json
    
    purpose = data.get('purpose', 'general')  # newsletter, lead_nurture, follow_up, etc.
    audience = data.get('audience', 'general')
    tone = data.get('tone', 'professional')
    key_points = data.get('key_points', [])
    company_info = data.get('company_info', {})
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Generate professional email content for the following specifications:
    
    Purpose: {purpose}
    Target Audience: {audience}
    Tone: {tone}
    Key Points to Include: {key_points}
    Company Information: {company_info}
    
    Generate:
    1. A compelling subject line
    2. Email body content (HTML format)
    3. Call-to-action suggestions
    
    The email should be engaging, professional, and tailored to the specified audience and purpose.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1500,
        temperature=0.7
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'generated_content': result['text'],
            'purpose': purpose,
            'audience': audience,
            'tone': tone,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@email_bp.route('/email/personalize', methods=['POST'])
def personalize_email():
    """Personalize email content for specific recipient"""
    data = request.json
    
    template_content = data.get('template_content')
    recipient_data = data.get('recipient_data', {})
    personalization_level = data.get('level', 'basic')  # basic, advanced, ai_powered
    
    if not template_content:
        return jsonify({'error': 'template_content is required'}), 400
    
    if personalization_level == 'ai_powered':
        from src.services.ai_service import ai_service
        
        prompt = f"""
        Personalize the following email template for the specific recipient:
        
        Template Content: {template_content}
        Recipient Data: {recipient_data}
        
        Personalize the content by:
        1. Using the recipient's name and information naturally
        2. Tailoring the message to their interests/industry if available
        3. Adjusting the tone based on their profile
        4. Making the content more relevant and engaging
        
        Return the personalized email content.
        """
        
        result = ai_service.generate_text(
            prompt=prompt,
            max_tokens=1000,
            temperature=0.6
        )
        
        if result['success']:
            personalized_content = result['text']
        else:
            return jsonify(result), 500
    else:
        # Basic personalization using template variables
        personalized_content = template_content
        for key, value in recipient_data.items():
            personalized_content = personalized_content.replace(f'{{{key}}}', str(value))
    
    return jsonify({
        'success': True,
        'personalized_content': personalized_content,
        'recipient_data': recipient_data,
        'personalization_level': personalization_level
    })

@email_bp.route('/email/analytics/optimize', methods=['POST'])
def optimize_email_campaign():
    """Get AI-powered optimization suggestions for email campaigns"""
    data = request.json
    
    campaign_data = data.get('campaign_data', {})
    performance_metrics = data.get('performance_metrics', {})
    target_metrics = data.get('target_metrics', {})
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Analyze the following email campaign performance and provide optimization recommendations:
    
    Campaign Data: {campaign_data}
    Current Performance Metrics: {performance_metrics}
    Target Metrics: {target_metrics}
    
    Provide specific recommendations for:
    1. Subject line optimization
    2. Content improvements
    3. Send time optimization
    4. Audience segmentation
    5. Call-to-action improvements
    6. Overall strategy adjustments
    
    Focus on actionable insights that can improve open rates, click rates, and conversions.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1500,
        temperature=0.4
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'optimization_recommendations': result['text'],
            'campaign_data': campaign_data,
            'performance_metrics': performance_metrics,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

# Lead nurturing workflows
@email_bp.route('/email/lead-nurture/sequence', methods=['POST'])
def create_lead_nurture_sequence():
    """Create an automated lead nurturing email sequence"""
    data = request.json
    
    lead_data = data.get('lead_data', {})
    sequence_type = data.get('sequence_type', 'general')  # general, industry_specific, product_focused
    duration_days = data.get('duration_days', 14)
    email_frequency = data.get('email_frequency', 'every_2_days')
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Create a lead nurturing email sequence with the following specifications:
    
    Lead Information: {lead_data}
    Sequence Type: {sequence_type}
    Duration: {duration_days} days
    Email Frequency: {email_frequency}
    
    Generate a sequence of 5-7 emails including:
    1. Welcome/Introduction email
    2. Value-driven content emails
    3. Social proof/case study email
    4. Educational content email
    5. Soft pitch/demo offer email
    6. Follow-up emails
    
    For each email, provide:
    - Subject line
    - Email content outline
    - Call-to-action
    - Send timing (day in sequence)
    
    Tailor the content to the lead's industry and interests if available.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=2000,
        temperature=0.6
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'nurture_sequence': result['text'],
            'lead_data': lead_data,
            'sequence_type': sequence_type,
            'duration_days': duration_days,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@email_bp.route('/email/lead-nurture/trigger', methods=['POST'])
def trigger_lead_nurture():
    """Trigger lead nurturing sequence for a specific lead"""
    data = request.json
    
    lead_email = data.get('lead_email')
    lead_data = data.get('lead_data', {})
    sequence_id = data.get('sequence_id', 'default')
    
    if not lead_email:
        return jsonify({'error': 'lead_email is required'}), 400
    
    # This would typically integrate with a workflow engine or task queue
    # For now, return a mock response
    
    return jsonify({
        'success': True,
        'message': 'Lead nurturing sequence triggered',
        'lead_email': lead_email,
        'sequence_id': sequence_id,
        'lead_data': lead_data,
        'triggered_at': datetime.utcnow().isoformat()
    })

# Email list management
@email_bp.route('/email/lists', methods=['GET'])
def get_email_lists():
    """Get all email lists"""
    # Mock email lists data
    lists = [
        {
            'list_id': 'newsletter_subscribers',
            'name': 'Newsletter Subscribers',
            'subscriber_count': 1250,
            'created_at': '2024-01-15T10:00:00Z',
            'last_campaign': '2025-01-20T14:30:00Z'
        },
        {
            'list_id': 'leads_tech_industry',
            'name': 'Tech Industry Leads',
            'subscriber_count': 340,
            'created_at': '2024-02-01T09:00:00Z',
            'last_campaign': '2025-01-18T11:00:00Z'
        },
        {
            'list_id': 'customers_active',
            'name': 'Active Customers',
            'subscriber_count': 890,
            'created_at': '2024-01-01T00:00:00Z',
            'last_campaign': '2025-01-22T16:00:00Z'
        }
    ]
    
    return jsonify({
        'success': True,
        'lists': lists,
        'total_lists': len(lists)
    })

@email_bp.route('/email/lists/<list_id>/subscribers', methods=['GET'])
def get_list_subscribers(list_id):
    """Get subscribers for a specific email list"""
    # Mock subscriber data
    subscribers = [
        {
            'email': 'john.doe@example.com',
            'name': 'John Doe',
            'subscribed_at': '2024-03-15T10:30:00Z',
            'status': 'active',
            'tags': ['tech', 'ceo']
        },
        {
            'email': 'jane.smith@company.com',
            'name': 'Jane Smith',
            'subscribed_at': '2024-03-20T14:15:00Z',
            'status': 'active',
            'tags': ['marketing', 'director']
        }
    ]
    
    return jsonify({
        'success': True,
        'list_id': list_id,
        'subscribers': subscribers,
        'total_subscribers': len(subscribers)
    })

@email_bp.route('/email/lists/<list_id>/subscribers', methods=['POST'])
def add_subscriber(list_id):
    """Add subscriber to email list"""
    data = request.json
    
    email = data.get('email')
    name = data.get('name')
    tags = data.get('tags', [])
    
    if not email:
        return jsonify({'error': 'email is required'}), 400
    
    # Mock subscriber addition
    return jsonify({
        'success': True,
        'message': 'Subscriber added successfully',
        'list_id': list_id,
        'subscriber': {
            'email': email,
            'name': name,
            'tags': tags,
            'subscribed_at': datetime.utcnow().isoformat(),
            'status': 'active'
        }
    })

