from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class AgentType(str, Enum):
    """Enumeration for agent types."""
    CEO = "ceo"
    MANAGER = "manager"
    ASSISTANT = "assistant"
    ANALYST = "analyst"


class AgentStatus(str, Enum):
    """Enumeration for agent status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    BUSY = "busy"
    OFFLINE = "offline"


class AgentBase(BaseModel):
    """Base agent schema with common fields."""
    name: str = Field(..., min_length=1, max_length=100)
    agent_type: AgentType
    description: Optional[str] = None
    capabilities: List[str] = []
    configuration: Dict[str, Any] = {}


class AgentCreate(AgentBase):
    """Schema for creating a new agent."""
    user_id: int


class AgentUpdate(BaseModel):
    """Schema for updating agent information."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    agent_type: Optional[AgentType] = None
    description: Optional[str] = None
    capabilities: Optional[List[str]] = None
    configuration: Optional[Dict[str, Any]] = None
    status: Optional[AgentStatus] = None


class AgentResponse(AgentBase):
    """Schema for agent response data."""
    id: int
    user_id: int
    status: AgentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_active: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class AgentTask(BaseModel):
    """Schema for agent task assignment."""
    agent_id: int
    task_description: str
    priority: int = Field(default=1, ge=1, le=10)
    parameters: Dict[str, Any] = {}


class AgentTaskResponse(BaseModel):
    """Schema for agent task response."""
    task_id: str
    agent_id: int
    status: str
    result: Optional[Dict[str, Any]] = None
    created_at: datetime
    completed_at: Optional[datetime] = None 