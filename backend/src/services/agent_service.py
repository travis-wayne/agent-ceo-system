"""
Agent Service for Agent CEO system
Manages AI agents, their tasks, and coordination
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from src.models.agent import Agent, Task, AgentMetric, BusinessData, db
from src.services.ai_service import ai_service

logger = logging.getLogger(__name__)

class AgentService:
    """Service for managing AI agents and their operations"""
    
    def __init__(self):
        self.agent_types = {
            'CEO': {
                'description': 'Strategic leadership and coordination agent',
                'capabilities': ['strategic_planning', 'decision_making', 'coordination', 'analysis'],
                'default_config': {
                    'decision_threshold': 0.8,
                    'coordination_interval': 3600,  # 1 hour
                    'strategic_review_interval': 86400  # 24 hours
                }
            },
            'Sales': {
                'description': 'Sales automation and lead management agent',
                'capabilities': ['lead_generation', 'prospect_qualification', 'outreach', 'pipeline_management'],
                'default_config': {
                    'lead_score_threshold': 0.7,
                    'outreach_frequency': 'daily',
                    'follow_up_interval': 172800  # 48 hours
                }
            },
            'Marketing': {
                'description': 'Content creation and marketing automation agent',
                'capabilities': ['content_creation', 'social_media', 'campaign_management', 'seo_optimization'],
                'default_config': {
                    'content_frequency': 'daily',
                    'social_posting_times': ['09:00', '13:00', '17:00'],
                    'campaign_optimization_interval': 86400
                }
            },
            'Operations': {
                'description': 'Process automation and system monitoring agent',
                'capabilities': ['process_automation', 'monitoring', 'optimization', 'maintenance'],
                'default_config': {
                    'monitoring_interval': 300,  # 5 minutes
                    'optimization_threshold': 0.8,
                    'maintenance_schedule': 'weekly'
                }
            },
            'Analytics': {
                'description': 'Data analysis and business intelligence agent',
                'capabilities': ['data_analysis', 'reporting', 'forecasting', 'insights'],
                'default_config': {
                    'analysis_frequency': 'daily',
                    'report_schedule': ['daily', 'weekly', 'monthly'],
                    'forecast_horizon': 30  # days
                }
            }
        }
    
    def create_agent(self, name: str, agent_type: str, description: str = None, 
                    custom_config: Dict[str, Any] = None) -> Agent:
        """Create a new AI agent"""
        
        if agent_type not in self.agent_types:
            raise ValueError(f"Invalid agent type: {agent_type}")
        
        # Get default configuration and merge with custom config
        default_config = self.agent_types[agent_type]['default_config'].copy()
        if custom_config:
            default_config.update(custom_config)
        
        # Use default description if none provided
        if not description:
            description = self.agent_types[agent_type]['description']
        
        agent = Agent(
            name=name,
            agent_type=agent_type,
            description=description,
            status='active'
        )
        agent.set_configuration(default_config)
        
        db.session.add(agent)
        db.session.commit()
        
        # Create initial metrics
        self._create_initial_metrics(agent)
        
        logger.info(f"Created new {agent_type} agent: {name}")
        return agent
    
    def _create_initial_metrics(self, agent: Agent):
        """Create initial performance metrics for a new agent"""
        initial_metrics = [
            {'name': 'tasks_completed', 'value': 0.0, 'type': 'performance'},
            {'name': 'success_rate', 'value': 0.0, 'type': 'performance'},
            {'name': 'average_execution_time', 'value': 0.0, 'type': 'performance'},
            {'name': 'business_impact_score', 'value': 0.0, 'type': 'business'}
        ]
        
        for metric_data in initial_metrics:
            metric = AgentMetric(
                agent_id=agent.id,
                metric_name=metric_data['name'],
                metric_value=metric_data['value'],
                metric_type=metric_data['type']
            )
            db.session.add(metric)
        
        db.session.commit()
    
    def assign_task(self, agent_id: int, title: str, task_type: str, 
                   description: str = None, parameters: Dict[str, Any] = None, 
                   priority: int = 5) -> Task:
        """Assign a task to an agent"""
        
        agent = Agent.query.get(agent_id)
        if not agent:
            raise ValueError(f"Agent with ID {agent_id} not found")
        
        if agent.status != 'active':
            raise ValueError(f"Agent {agent.name} is not active")
        
        task = Task(
            agent_id=agent_id,
            title=title,
            description=description or '',
            task_type=task_type,
            priority=priority,
            status='pending'
        )
        
        if parameters:
            task.set_parameters(parameters)
        
        db.session.add(task)
        db.session.commit()
        
        logger.info(f"Assigned task '{title}' to agent {agent.name}")
        return task
    
    def execute_task(self, task_id: int) -> Dict[str, Any]:
        """Execute a specific task"""
        
        task = Task.query.get(task_id)
        if not task:
            raise ValueError(f"Task with ID {task_id} not found")
        
        if task.status != 'pending':
            raise ValueError(f"Task {task.title} is not in pending status")
        
        # Update task status
        task.status = 'running'
        task.started_at = datetime.utcnow()
        db.session.commit()
        
        try:
            # Execute task based on type
            result = self._execute_task_by_type(task)
            
            # Update task with result
            task.status = 'completed'
            task.completed_at = datetime.utcnow()
            task.set_result(result)
            
            # Update agent metrics
            self._update_agent_metrics(task.agent_id, task, True)
            
            db.session.commit()
            
            logger.info(f"Successfully executed task: {task.title}")
            return {
                'success': True,
                'task_id': task_id,
                'result': result
            }
            
        except Exception as e:
            # Mark task as failed
            task.status = 'failed'
            task.completed_at = datetime.utcnow()
            task.set_result({'error': str(e)})
            
            # Update agent metrics
            self._update_agent_metrics(task.agent_id, task, False)
            
            db.session.commit()
            
            logger.error(f"Task execution failed: {task.title} - {str(e)}")
            return {
                'success': False,
                'task_id': task_id,
                'error': str(e)
            }
    
    def _execute_task_by_type(self, task: Task) -> Dict[str, Any]:
        """Execute task based on its type"""
        
        task_type = task.task_type
        parameters = task.get_parameters()
        
        if task_type == 'content_creation':
            return self._execute_content_creation(parameters)
        elif task_type == 'lead_generation':
            return self._execute_lead_generation(parameters)
        elif task_type == 'data_analysis':
            return self._execute_data_analysis(parameters)
        elif task_type == 'strategic_planning':
            return self._execute_strategic_planning(parameters)
        elif task_type == 'social_media_post':
            return self._execute_social_media_post(parameters)
        elif task_type == 'email_campaign':
            return self._execute_email_campaign(parameters)
        else:
            # Generic task execution using AI
            return self._execute_generic_task(task, parameters)
    
    def _execute_content_creation(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute content creation task"""
        
        content_type = parameters.get('content_type', 'blog_post')
        topic = parameters.get('topic', 'Business Growth')
        target_audience = parameters.get('target_audience')
        tone = parameters.get('tone', 'professional')
        
        result = ai_service.generate_business_content(
            content_type=content_type,
            topic=topic,
            target_audience=target_audience,
            tone=tone
        )
        
        if result['success']:
            return {
                'content': result['content'],
                'metadata': result['metadata'],
                'type': 'content_creation'
            }
        else:
            raise Exception(f"Content creation failed: {result.get('error')}")
    
    def _execute_lead_generation(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute lead generation task"""
        
        # This would integrate with web scraping and lead generation tools
        # For now, return a mock result
        
        target_industry = parameters.get('industry', 'technology')
        company_size = parameters.get('company_size', 'medium')
        location = parameters.get('location', 'global')
        
        # Mock lead generation result
        leads = [
            {
                'company': f'TechCorp {i}',
                'contact_name': f'John Doe {i}',
                'email': f'john.doe{i}@techcorp.com',
                'industry': target_industry,
                'size': company_size,
                'score': 0.8 + (i * 0.02)
            }
            for i in range(1, 6)
        ]
        
        return {
            'leads': leads,
            'total_leads': len(leads),
            'parameters': parameters,
            'type': 'lead_generation'
        }
    
    def _execute_data_analysis(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute data analysis task"""
        
        data_source = parameters.get('data_source', 'business_data')
        analysis_type = parameters.get('analysis_type', 'general')
        
        # Get business data for analysis
        if data_source == 'business_data':
            business_data = BusinessData.query.filter_by(processed=False).limit(10).all()
            data_for_analysis = [item.get_data_content() for item in business_data]
        else:
            data_for_analysis = parameters.get('data', {})
        
        # Perform AI analysis
        result = ai_service.analyze_business_data(
            data={'items': data_for_analysis},
            analysis_type=analysis_type
        )
        
        if result['success']:
            return {
                'analysis': result['analysis'],
                'data_source': data_source,
                'analysis_type': analysis_type,
                'type': 'data_analysis'
            }
        else:
            raise Exception(f"Data analysis failed: {result.get('error')}")
    
    def _execute_strategic_planning(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute strategic planning task"""
        
        planning_horizon = parameters.get('horizon', '3 months')
        focus_areas = parameters.get('focus_areas', ['growth', 'efficiency'])
        
        prompt = f"""
        Create a strategic plan for the next {planning_horizon} focusing on {', '.join(focus_areas)}.
        
        Please include:
        1. Key objectives
        2. Strategic initiatives
        3. Success metrics
        4. Timeline
        5. Resource requirements
        
        Provide a comprehensive but concise strategic plan.
        """
        
        result = ai_service.generate_text(prompt, max_tokens=1500, temperature=0.6)
        
        if result['success']:
            return {
                'strategic_plan': result['text'],
                'horizon': planning_horizon,
                'focus_areas': focus_areas,
                'type': 'strategic_planning'
            }
        else:
            raise Exception(f"Strategic planning failed: {result.get('error')}")
    
    def _execute_social_media_post(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute social media post creation"""
        
        platform = parameters.get('platform', 'linkedin')
        topic = parameters.get('topic', 'business insights')
        tone = parameters.get('tone', 'professional')
        
        result = ai_service.generate_business_content(
            content_type='social_post',
            topic=topic,
            tone=tone
        )
        
        if result['success']:
            return {
                'post_content': result['content'],
                'platform': platform,
                'topic': topic,
                'type': 'social_media_post'
            }
        else:
            raise Exception(f"Social media post creation failed: {result.get('error')}")
    
    def _execute_email_campaign(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute email campaign creation"""
        
        campaign_type = parameters.get('campaign_type', 'newsletter')
        subject = parameters.get('subject', 'Business Update')
        target_audience = parameters.get('target_audience', 'customers')
        
        result = ai_service.generate_business_content(
            content_type='email',
            topic=subject,
            target_audience=target_audience
        )
        
        if result['success']:
            return {
                'email_content': result['content'],
                'subject': subject,
                'campaign_type': campaign_type,
                'target_audience': target_audience,
                'type': 'email_campaign'
            }
        else:
            raise Exception(f"Email campaign creation failed: {result.get('error')}")
    
    def _execute_generic_task(self, task: Task, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute generic task using AI"""
        
        prompt = f"""
        Task: {task.title}
        Description: {task.description}
        Type: {task.task_type}
        Parameters: {json.dumps(parameters, indent=2)}
        
        Please execute this task and provide a detailed result.
        """
        
        result = ai_service.generate_text(prompt, max_tokens=1000, temperature=0.5)
        
        if result['success']:
            return {
                'result': result['text'],
                'task_type': task.task_type,
                'type': 'generic_task'
            }
        else:
            raise Exception(f"Generic task execution failed: {result.get('error')}")
    
    def _update_agent_metrics(self, agent_id: int, task: Task, success: bool):
        """Update agent performance metrics"""
        
        # Update task completion count
        self._update_metric(agent_id, 'tasks_completed', 1, 'increment')
        
        # Update success rate
        completed_tasks = Task.query.filter_by(agent_id=agent_id, status='completed').count()
        total_tasks = Task.query.filter_by(agent_id=agent_id).filter(
            Task.status.in_(['completed', 'failed'])
        ).count()
        
        if total_tasks > 0:
            success_rate = completed_tasks / total_tasks
            self._update_metric(agent_id, 'success_rate', success_rate, 'set')
        
        # Update execution time if task completed
        if success and task.started_at and task.completed_at:
            execution_time = (task.completed_at - task.started_at).total_seconds()
            self._update_metric(agent_id, 'average_execution_time', execution_time, 'average')
    
    def _update_metric(self, agent_id: int, metric_name: str, value: float, operation: str):
        """Update a specific agent metric"""
        
        if operation == 'increment':
            # Get current value and increment
            current_metric = AgentMetric.query.filter_by(
                agent_id=agent_id, metric_name=metric_name
            ).order_by(AgentMetric.timestamp.desc()).first()
            
            current_value = current_metric.metric_value if current_metric else 0
            new_value = current_value + value
            
        elif operation == 'set':
            new_value = value
            
        elif operation == 'average':
            # Calculate running average
            recent_metrics = AgentMetric.query.filter_by(
                agent_id=agent_id, metric_name=metric_name
            ).order_by(AgentMetric.timestamp.desc()).limit(10).all()
            
            if recent_metrics:
                total = sum(m.metric_value for m in recent_metrics) + value
                new_value = total / (len(recent_metrics) + 1)
            else:
                new_value = value
        else:
            new_value = value
        
        # Create new metric entry
        metric = AgentMetric(
            agent_id=agent_id,
            metric_name=metric_name,
            metric_value=new_value,
            metric_type='performance'
        )
        
        db.session.add(metric)
    
    def get_agent_performance(self, agent_id: int, days: int = 7) -> Dict[str, Any]:
        """Get agent performance metrics for specified period"""
        
        since_date = datetime.utcnow() - timedelta(days=days)
        
        # Get recent metrics
        metrics = AgentMetric.query.filter(
            AgentMetric.agent_id == agent_id,
            AgentMetric.timestamp >= since_date
        ).all()
        
        # Get recent tasks
        tasks = Task.query.filter(
            Task.agent_id == agent_id,
            Task.created_at >= since_date
        ).all()
        
        # Calculate performance summary
        performance = {
            'agent_id': agent_id,
            'period_days': days,
            'total_tasks': len(tasks),
            'completed_tasks': len([t for t in tasks if t.status == 'completed']),
            'failed_tasks': len([t for t in tasks if t.status == 'failed']),
            'pending_tasks': len([t for t in tasks if t.status == 'pending']),
            'running_tasks': len([t for t in tasks if t.status == 'running']),
            'metrics': [m.to_dict() for m in metrics]
        }
        
        if performance['total_tasks'] > 0:
            performance['success_rate'] = performance['completed_tasks'] / performance['total_tasks']
        else:
            performance['success_rate'] = 0.0
        
        return performance
    
    def coordinate_agents(self) -> Dict[str, Any]:
        """Coordinate activities between agents (CEO agent function)"""
        
        # Get all active agents
        agents = Agent.query.filter_by(status='active').all()
        
        coordination_results = {
            'timestamp': datetime.utcnow().isoformat(),
            'agents_coordinated': len(agents),
            'actions_taken': []
        }
        
        for agent in agents:
            # Check agent workload
            pending_tasks = Task.query.filter_by(
                agent_id=agent.id, status='pending'
            ).count()
            
            running_tasks = Task.query.filter_by(
                agent_id=agent.id, status='running'
            ).count()
            
            # Agent workload management
            if pending_tasks > 10:  # High workload
                coordination_results['actions_taken'].append({
                    'agent': agent.name,
                    'action': 'workload_warning',
                    'details': f'High pending task count: {pending_tasks}'
                })
            
            if running_tasks == 0 and pending_tasks > 0:
                # Start next pending task
                next_task = Task.query.filter_by(
                    agent_id=agent.id, status='pending'
                ).order_by(Task.priority.desc(), Task.created_at.asc()).first()
                
                if next_task:
                    try:
                        self.execute_task(next_task.id)
                        coordination_results['actions_taken'].append({
                            'agent': agent.name,
                            'action': 'task_started',
                            'task': next_task.title
                        })
                    except Exception as e:
                        coordination_results['actions_taken'].append({
                            'agent': agent.name,
                            'action': 'task_start_failed',
                            'error': str(e)
                        })
        
        return coordination_results

# Global agent service instance
agent_service = AgentService()

