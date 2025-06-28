from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # App Configuration
    app_name: str = "Agent CEO System"
    debug: bool = False
    secret_key: str = "asdf#FGSgvasgf$5$WGT"
    
    # Database Configuration
    database_url: str = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    sqlalchemy_track_modifications: bool = False
    
    # API Configuration
    api_prefix: str = "/api"
    cors_origins: list[str] = ["*"]
    
    # External Services
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # Email Configuration
    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # N8N Configuration
    n8n_webhook_url: Optional[str] = None
    n8n_api_key: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings() 