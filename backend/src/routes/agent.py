from flask import Blueprint, jsonify, request
from datetime import datetime
from src.models.agent import Agent, Task, AgentMetric, BusinessData, db

agent_bp = Blueprint('agent', __name__)

# Agent Management Routes
@agent_bp.route('/agents', methods=['GET'])
def get_agents():
    """Get all agents"""
    agents = Agent.query.all()
    return jsonify([agent.to_dict() for agent in agents])

@agent_bp.route('/agents', methods=['POST'])
def create_agent():
    """Create a new agent"""
    data = request.json
    
    agent = Agent(
        name=data['name'],
        agent_type=data['agent_type'],
        description=data.get('description', ''),
        status=data.get('status', 'active')
    )
    
    if 'configuration' in data:
        agent.set_configuration(data['configuration'])
    
    db.session.add(agent)
    db.session.commit()
    
    return jsonify(agent.to_dict()), 201

@agent_bp.route('/agents/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get a specific agent"""
    agent = Agent.query.get_or_404(agent_id)
    return jsonify(agent.to_dict())

@agent_bp.route('/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    """Update an agent"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.json
    
    agent.name = data.get('name', agent.name)
    agent.agent_type = data.get('agent_type', agent.agent_type)
    agent.description = data.get('description', agent.description)
    agent.status = data.get('status', agent.status)
    
    if 'configuration' in data:
        agent.set_configuration(data['configuration'])
    
    agent.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(agent.to_dict())

@agent_bp.route('/agents/<int:agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    """Delete an agent"""
    agent = Agent.query.get_or_404(agent_id)
    db.session.delete(agent)
    db.session.commit()
    return '', 204

# Task Management Routes
@agent_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    agent_id = request.args.get('agent_id')
    status = request.args.get('status')
    
    query = Task.query
    
    if agent_id:
        query = query.filter_by(agent_id=agent_id)
    if status:
        query = query.filter_by(status=status)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@agent_bp.route('/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    data = request.json
    
    task = Task(
        agent_id=data['agent_id'],
        title=data['title'],
        description=data.get('description', ''),
        task_type=data['task_type'],
        priority=data.get('priority', 5)
    )
    
    if 'parameters' in data:
        task.set_parameters(data['parameters'])
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

@agent_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task"""
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

@agent_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    task = Task.query.get_or_404(task_id)
    data = request.json
    
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.task_type = data.get('task_type', task.task_type)
    task.status = data.get('status', task.status)
    task.priority = data.get('priority', task.priority)
    
    if 'parameters' in data:
        task.set_parameters(data['parameters'])
    
    if 'result' in data:
        task.set_result(data['result'])
    
    # Update timestamps based on status
    if data.get('status') == 'running' and not task.started_at:
        task.started_at = datetime.utcnow()
    elif data.get('status') in ['completed', 'failed'] and not task.completed_at:
        task.completed_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(task.to_dict())

@agent_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

# Agent Metrics Routes
@agent_bp.route('/agents/<int:agent_id>/metrics', methods=['GET'])
def get_agent_metrics(agent_id):
    """Get metrics for a specific agent"""
    metrics = AgentMetric.query.filter_by(agent_id=agent_id).order_by(AgentMetric.timestamp.desc()).all()
    return jsonify([metric.to_dict() for metric in metrics])

@agent_bp.route('/agents/<int:agent_id>/metrics', methods=['POST'])
def create_agent_metric(agent_id):
    """Create a new metric for an agent"""
    data = request.json
    
    metric = AgentMetric(
        agent_id=agent_id,
        metric_name=data['metric_name'],
        metric_value=data['metric_value'],
        metric_type=data['metric_type'],
        metric_metadata=data.get('metadata', '{}')
    )
    
    db.session.add(metric)
    db.session.commit()
    
    return jsonify(metric.to_dict()), 201

# Business Data Routes
@agent_bp.route('/business-data', methods=['GET'])
def get_business_data():
    """Get business data"""
    data_type = request.args.get('data_type')
    source = request.args.get('source')
    processed = request.args.get('processed')
    
    query = BusinessData.query
    
    if data_type:
        query = query.filter_by(data_type=data_type)
    if source:
        query = query.filter_by(source=source)
    if processed is not None:
        query = query.filter_by(processed=processed.lower() == 'true')
    
    data = query.order_by(BusinessData.created_at.desc()).all()
    return jsonify([item.to_dict() for item in data])

@agent_bp.route('/business-data', methods=['POST'])
def create_business_data():
    """Create new business data entry"""
    data = request.json
    
    business_data = BusinessData(
        data_type=data['data_type'],
        source=data['source'],
        quality_score=data.get('quality_score', 0.0),
        processed=data.get('processed', False)
    )
    
    business_data.set_data_content(data['data_content'])
    
    db.session.add(business_data)
    db.session.commit()
    
    return jsonify(business_data.to_dict()), 201

@agent_bp.route('/business-data/<int:data_id>', methods=['GET'])
def get_business_data_item(data_id):
    """Get a specific business data item"""
    data_item = BusinessData.query.get_or_404(data_id)
    return jsonify(data_item.to_dict())

@agent_bp.route('/business-data/<int:data_id>', methods=['PUT'])
def update_business_data(data_id):
    """Update business data"""
    data_item = BusinessData.query.get_or_404(data_id)
    data = request.json
    
    data_item.data_type = data.get('data_type', data_item.data_type)
    data_item.source = data.get('source', data_item.source)
    data_item.quality_score = data.get('quality_score', data_item.quality_score)
    data_item.processed = data.get('processed', data_item.processed)
    
    if 'data_content' in data:
        data_item.set_data_content(data['data_content'])
    
    data_item.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(data_item.to_dict())

# Dashboard and Analytics Routes
@agent_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    stats = {
        'total_agents': Agent.query.count(),
        'active_agents': Agent.query.filter_by(status='active').count(),
        'total_tasks': Task.query.count(),
        'pending_tasks': Task.query.filter_by(status='pending').count(),
        'running_tasks': Task.query.filter_by(status='running').count(),
        'completed_tasks': Task.query.filter_by(status='completed').count(),
        'failed_tasks': Task.query.filter_by(status='failed').count(),
        'business_data_items': BusinessData.query.count(),
        'unprocessed_data': BusinessData.query.filter_by(processed=False).count()
    }
    
    # Agent type breakdown
    agent_types = db.session.query(Agent.agent_type, db.func.count(Agent.id)).group_by(Agent.agent_type).all()
    stats['agent_types'] = {agent_type: count for agent_type, count in agent_types}
    
    # Task type breakdown
    task_types = db.session.query(Task.task_type, db.func.count(Task.id)).group_by(Task.task_type).all()
    stats['task_types'] = {task_type: count for task_type, count in task_types}
    
    return jsonify(stats)

@agent_bp.route('/dashboard/performance', methods=['GET'])
def get_performance_metrics():
    """Get performance metrics for dashboard"""
    # Get recent metrics for all agents
    recent_metrics = AgentMetric.query.order_by(AgentMetric.timestamp.desc()).limit(100).all()
    
    performance_data = {}
    for metric in recent_metrics:
        agent_id = metric.agent_id
        if agent_id not in performance_data:
            performance_data[agent_id] = []
        performance_data[agent_id].append(metric.to_dict())
    
    return jsonify(performance_data)

