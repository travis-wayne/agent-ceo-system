"""
n8n Integration Service for Agent CEO system
Handles communication with n8n workflows and automation
"""

import json
import requests
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import os

logger = logging.getLogger(__name__)

class N8nService:
    """Service for integrating with n8n workflow automation"""
    
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'http://localhost:5678')
        self.n8n_api_key = os.getenv('N8N_API_KEY', '')
        self.webhook_base_url = f"{self.n8n_base_url}/webhook"
        
        # Default headers for n8n API requests
        self.headers = {
            'Content-Type': 'application/json'
        }
        
        if self.n8n_api_key:
            self.headers['Authorization'] = f'Bearer {self.n8n_api_key}'
    
    def trigger_workflow(self, workflow_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Trigger an n8n workflow by ID
        
        Args:
            workflow_id: The n8n workflow ID
            data: Data to pass to the workflow
            
        Returns:
            Dictionary with execution result
        """
        try:
            url = f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}/execute"
            
            payload = {
                'data': data,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            response = requests.post(url, json=payload, headers=self.headers, timeout=30)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'execution_id': response.json().get('data', {}).get('id'),
                    'result': response.json()
                }
            else:
                logger.error(f"n8n workflow trigger failed: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error triggering n8n workflow: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def trigger_webhook(self, webhook_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Trigger an n8n webhook
        
        Args:
            webhook_name: Name of the webhook endpoint
            data: Data to send to the webhook
            
        Returns:
            Dictionary with webhook response
        """
        try:
            url = f"{self.webhook_base_url}/{webhook_name}"
            
            response = requests.post(url, json=data, timeout=30)
            
            if response.status_code in [200, 201]:
                return {
                    'success': True,
                    'response': response.json() if response.content else {}
                }
            else:
                logger.error(f"n8n webhook trigger failed: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error triggering n8n webhook: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def create_social_media_post(self, platform: str, content: str, 
                               schedule_time: str = None, media_urls: List[str] = None) -> Dict[str, Any]:
        """
        Trigger social media posting workflow
        
        Args:
            platform: Social media platform (linkedin, twitter, facebook, etc.)
            content: Post content
            schedule_time: Optional scheduled posting time (ISO format)
            media_urls: Optional list of media URLs to attach
            
        Returns:
            Dictionary with posting result
        """
        
        webhook_data = {
            'action': 'create_post',
            'platform': platform,
            'content': content,
            'schedule_time': schedule_time,
            'media_urls': media_urls or [],
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('social-media-post', webhook_data)
    
    def send_email_campaign(self, recipients: List[str], subject: str, 
                          content: str, template_id: str = None) -> Dict[str, Any]:
        """
        Trigger email campaign workflow
        
        Args:
            recipients: List of email addresses
            subject: Email subject
            content: Email content
            template_id: Optional email template ID
            
        Returns:
            Dictionary with campaign result
        """
        
        webhook_data = {
            'action': 'send_campaign',
            'recipients': recipients,
            'subject': subject,
            'content': content,
            'template_id': template_id,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('email-campaign', webhook_data)
    
    def generate_leads(self, criteria: Dict[str, Any]) -> Dict[str, Any]:
        """
        Trigger lead generation workflow
        
        Args:
            criteria: Lead generation criteria (industry, location, company size, etc.)
            
        Returns:
            Dictionary with lead generation result
        """
        
        webhook_data = {
            'action': 'generate_leads',
            'criteria': criteria,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('lead-generation', webhook_data)
    
    def scrape_business_data(self, target_urls: List[str], data_types: List[str]) -> Dict[str, Any]:
        """
        Trigger web scraping workflow
        
        Args:
            target_urls: List of URLs to scrape
            data_types: Types of data to extract (contacts, company_info, etc.)
            
        Returns:
            Dictionary with scraping result
        """
        
        webhook_data = {
            'action': 'scrape_data',
            'target_urls': target_urls,
            'data_types': data_types,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('web-scraping', webhook_data)
    
    def sync_crm_data(self, crm_platform: str, sync_type: str = 'bidirectional') -> Dict[str, Any]:
        """
        Trigger CRM data synchronization workflow
        
        Args:
            crm_platform: CRM platform name (salesforce, hubspot, etc.)
            sync_type: Type of sync (import, export, bidirectional)
            
        Returns:
            Dictionary with sync result
        """
        
        webhook_data = {
            'action': 'sync_crm',
            'crm_platform': crm_platform,
            'sync_type': sync_type,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('crm-sync', webhook_data)
    
    def analyze_competitor_data(self, competitors: List[str], analysis_types: List[str]) -> Dict[str, Any]:
        """
        Trigger competitor analysis workflow
        
        Args:
            competitors: List of competitor companies/websites
            analysis_types: Types of analysis (pricing, content, social_media, etc.)
            
        Returns:
            Dictionary with analysis result
        """
        
        webhook_data = {
            'action': 'analyze_competitors',
            'competitors': competitors,
            'analysis_types': analysis_types,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('competitor-analysis', webhook_data)
    
    def schedule_content_calendar(self, content_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Trigger content calendar scheduling workflow
        
        Args:
            content_items: List of content items with scheduling information
            
        Returns:
            Dictionary with scheduling result
        """
        
        webhook_data = {
            'action': 'schedule_content',
            'content_items': content_items,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return self.trigger_webhook('content-calendar', webhook_data)
    
    def get_workflow_status(self, execution_id: str) -> Dict[str, Any]:
        """
        Get the status of a workflow execution
        
        Args:
            execution_id: The execution ID returned from workflow trigger
            
        Returns:
            Dictionary with execution status
        """
        try:
            url = f"{self.n8n_base_url}/api/v1/executions/{execution_id}"
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                execution_data = response.json()
                return {
                    'success': True,
                    'status': execution_data.get('data', {}).get('status'),
                    'execution_data': execution_data
                }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error getting workflow status: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def list_workflows(self) -> Dict[str, Any]:
        """
        List all available n8n workflows
        
        Returns:
            Dictionary with workflows list
        """
        try:
            url = f"{self.n8n_base_url}/api/v1/workflows"
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                workflows = response.json().get('data', [])
                return {
                    'success': True,
                    'workflows': workflows,
                    'count': len(workflows)
                }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error listing workflows: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check n8n service health
        
        Returns:
            Dictionary with health status
        """
        try:
            url = f"{self.n8n_base_url}/healthz"
            
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'status': 'healthy',
                    'n8n_url': self.n8n_base_url,
                    'timestamp': datetime.utcnow().isoformat()
                }
            else:
                return {
                    'success': False,
                    'status': 'unhealthy',
                    'error': f"HTTP {response.status_code}"
                }
                
        except Exception as e:
            return {
                'success': False,
                'status': 'unreachable',
                'error': str(e)
            }

# Global n8n service instance
n8n_service = N8nService()

