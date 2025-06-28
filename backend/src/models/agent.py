from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
from src.models.user import db

class Agent(db.Model):
    """AI Agent model for the Agent CEO system"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    agent_type = db.Column(db.String(50), nullable=False)  # CEO, Sales, Marketing, Operations, Analytics
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')  # active, inactive, maintenance
    configuration = db.Column(db.Text)  # JSON configuration
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tasks = db.relationship('Task', backref='agent', lazy=True)
    metrics = db.relationship('AgentMetric', backref='agent', lazy=True)

    def __repr__(self):
        return f'<Agent {self.name} ({self.agent_type})>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'agent_type': self.agent_type,
            'description': self.description,
            'status': self.status,
            'configuration': json.loads(self.configuration) if self.configuration else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def get_configuration(self):
        """Get agent configuration as dictionary"""
        return json.loads(self.configuration) if self.configuration else {}

    def set_configuration(self, config_dict):
        """Set agent configuration from dictionary"""
        self.configuration = json.dumps(config_dict)

class Task(db.Model):
    """Task model for agent activities"""
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    task_type = db.Column(db.String(50), nullable=False)  # lead_generation, content_creation, analysis, etc.
    status = db.Column(db.String(20), default='pending')  # pending, running, completed, failed
    priority = db.Column(db.Integer, default=5)  # 1-10 scale
    parameters = db.Column(db.Text)  # JSON parameters
    result = db.Column(db.Text)  # JSON result
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<Task {self.title} ({self.status})>'

    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'title': self.title,
            'description': self.description,
            'task_type': self.task_type,
            'status': self.status,
            'priority': self.priority,
            'parameters': json.loads(self.parameters) if self.parameters else {},
            'result': json.loads(self.result) if self.result else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

    def get_parameters(self):
        """Get task parameters as dictionary"""
        return json.loads(self.parameters) if self.parameters else {}

    def set_parameters(self, params_dict):
        """Set task parameters from dictionary"""
        self.parameters = json.dumps(params_dict)

    def get_result(self):
        """Get task result as dictionary"""
        return json.loads(self.result) if self.result else {}

    def set_result(self, result_dict):
        """Set task result from dictionary"""
        self.result = json.dumps(result_dict)

class AgentMetric(db.Model):
    """Performance metrics for agents"""
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    metric_name = db.Column(db.String(100), nullable=False)
    metric_value = db.Column(db.Float, nullable=False)
    metric_type = db.Column(db.String(50), nullable=False)  # performance, business, technical
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    metric_metadata = db.Column(db.Text)  # JSON metadata

    def __repr__(self):
        return f'<AgentMetric {self.metric_name}: {self.metric_value}>'

    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'metric_name': self.metric_name,
            'metric_value': self.metric_value,
            'metric_type': self.metric_type,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'metadata': json.loads(self.metric_metadata) if self.metric_metadata else {}
        }

class BusinessData(db.Model):
    """Business intelligence and analytics data"""
    id = db.Column(db.Integer, primary_key=True)
    data_type = db.Column(db.String(50), nullable=False)  # lead, customer, competitor, market
    source = db.Column(db.String(100), nullable=False)  # web_scraping, api, manual, etc.
    data_content = db.Column(db.Text, nullable=False)  # JSON data
    quality_score = db.Column(db.Float, default=0.0)  # 0-1 quality score
    processed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<BusinessData {self.data_type} from {self.source}>'

    def to_dict(self):
        return {
            'id': self.id,
            'data_type': self.data_type,
            'source': self.source,
            'data_content': json.loads(self.data_content) if self.data_content else {},
            'quality_score': self.quality_score,
            'processed': self.processed,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def get_data_content(self):
        """Get data content as dictionary"""
        return json.loads(self.data_content) if self.data_content else {}

    def set_data_content(self, data_dict):
        """Set data content from dictionary"""
        self.data_content = json.dumps(data_dict)

