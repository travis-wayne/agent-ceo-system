from flask import Blueprint, jsonify, request
from src.services.ai_service import ai_service
from src.services.agent_service import agent_service

ai_bp = Blueprint('ai', __name__)

# AI Service Routes
@ai_bp.route('/ai/generate', methods=['POST'])
def generate_text():
    """Generate text using AI"""
    data = request.json
    
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    provider = data.get('provider')
    model = data.get('model')
    max_tokens = data.get('max_tokens', 1000)
    temperature = data.get('temperature', 0.7)
    
    result = ai_service.generate_text(
        prompt=prompt,
        provider=provider,
        model=model,
        max_tokens=max_tokens,
        temperature=temperature
    )
    
    return jsonify(result)

@ai_bp.route('/ai/content', methods=['POST'])
def generate_content():
    """Generate business content"""
    data = request.json
    
    content_type = data.get('content_type')
    topic = data.get('topic')
    
    if not content_type or not topic:
        return jsonify({'error': 'content_type and topic are required'}), 400
    
    target_audience = data.get('target_audience')
    tone = data.get('tone', 'professional')
    
    result = ai_service.generate_business_content(
        content_type=content_type,
        topic=topic,
        target_audience=target_audience,
        tone=tone
    )
    
    return jsonify(result)

@ai_bp.route('/ai/analyze/sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of text"""
    data = request.json
    
    text = data.get('text')
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    
    result = ai_service.analyze_sentiment(text)
    return jsonify(result)

@ai_bp.route('/ai/analyze/keywords', methods=['POST'])
def extract_keywords():
    """Extract keywords from text"""
    data = request.json
    
    text = data.get('text')
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    
    max_keywords = data.get('max_keywords', 10)
    
    result = ai_service.extract_keywords(text, max_keywords)
    return jsonify(result)

@ai_bp.route('/ai/analyze/business', methods=['POST'])
def analyze_business_data():
    """Analyze business data"""
    data = request.json
    
    business_data = data.get('data')
    if not business_data:
        return jsonify({'error': 'Data is required'}), 400
    
    analysis_type = data.get('analysis_type', 'general')
    
    result = ai_service.analyze_business_data(business_data, analysis_type)
    return jsonify(result)

@ai_bp.route('/ai/models', methods=['GET'])
def get_models():
    """Get available AI models"""
    provider = request.args.get('provider')
    result = ai_service.get_available_models(provider)
    return jsonify(result)

@ai_bp.route('/ai/health', methods=['GET'])
def ai_health():
    """Check AI service health"""
    result = ai_service.health_check()
    return jsonify(result)

# Agent Service Routes
@ai_bp.route('/ai/agents/execute', methods=['POST'])
def execute_agent_task():
    """Execute a specific agent task"""
    data = request.json
    
    task_id = data.get('task_id')
    if not task_id:
        return jsonify({'error': 'task_id is required'}), 400
    
    try:
        result = agent_service.execute_task(task_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@ai_bp.route('/ai/agents/coordinate', methods=['POST'])
def coordinate_agents():
    """Coordinate agent activities"""
    try:
        result = agent_service.coordinate_agents()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/ai/agents/<int:agent_id>/performance', methods=['GET'])
def get_agent_performance(agent_id):
    """Get agent performance metrics"""
    days = request.args.get('days', 7, type=int)
    
    try:
        result = agent_service.get_agent_performance(agent_id, days)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@ai_bp.route('/ai/agents/create-default', methods=['POST'])
def create_default_agents():
    """Create default set of agents for the system"""
    try:
        agents_created = []
        
        # Create CEO Agent
        ceo_agent = agent_service.create_agent(
            name="CEO Agent",
            agent_type="CEO",
            description="Strategic leadership and coordination agent for the Agent CEO system"
        )
        agents_created.append(ceo_agent.to_dict())
        
        # Create Sales Agent
        sales_agent = agent_service.create_agent(
            name="Sales Agent",
            agent_type="Sales",
            description="Lead generation and sales automation agent"
        )
        agents_created.append(sales_agent.to_dict())
        
        # Create Marketing Agent
        marketing_agent = agent_service.create_agent(
            name="Marketing Agent",
            agent_type="Marketing",
            description="Content creation and marketing automation agent"
        )
        agents_created.append(marketing_agent.to_dict())
        
        # Create Operations Agent
        operations_agent = agent_service.create_agent(
            name="Operations Agent",
            agent_type="Operations",
            description="Process automation and system monitoring agent"
        )
        agents_created.append(operations_agent.to_dict())
        
        # Create Analytics Agent
        analytics_agent = agent_service.create_agent(
            name="Analytics Agent",
            agent_type="Analytics",
            description="Data analysis and business intelligence agent"
        )
        agents_created.append(analytics_agent.to_dict())
        
        return jsonify({
            'success': True,
            'message': 'Default agents created successfully',
            'agents': agents_created
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/ai/tasks/create-sample', methods=['POST'])
def create_sample_tasks():
    """Create sample tasks for testing"""
    data = request.json
    agent_id = data.get('agent_id')
    
    if not agent_id:
        return jsonify({'error': 'agent_id is required'}), 400
    
    try:
        sample_tasks = [
            {
                'title': 'Generate Marketing Content',
                'task_type': 'content_creation',
                'description': 'Create engaging blog post about business automation',
                'parameters': {
                    'content_type': 'blog_post',
                    'topic': 'Business Automation with AI',
                    'target_audience': 'business owners',
                    'tone': 'professional'
                }
            },
            {
                'title': 'Analyze Business Performance',
                'task_type': 'data_analysis',
                'description': 'Analyze recent business data and provide insights',
                'parameters': {
                    'analysis_type': 'general',
                    'data_source': 'business_data'
                }
            },
            {
                'title': 'Create Social Media Post',
                'task_type': 'social_media_post',
                'description': 'Create engaging LinkedIn post about AI trends',
                'parameters': {
                    'platform': 'linkedin',
                    'topic': 'AI trends in business',
                    'tone': 'professional'
                }
            }
        ]
        
        created_tasks = []
        for task_data in sample_tasks:
            task = agent_service.assign_task(
                agent_id=agent_id,
                title=task_data['title'],
                task_type=task_data['task_type'],
                description=task_data['description'],
                parameters=task_data['parameters']
            )
            created_tasks.append(task.to_dict())
        
        return jsonify({
            'success': True,
            'message': 'Sample tasks created successfully',
            'tasks': created_tasks
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

