"""
Email Service for Agent CEO system
Handles email automation, campaigns, and reporting with Gmail/SMTP APIs
"""

import os
import json
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import base64
import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import pickle

logger = logging.getLogger(__name__)

class EmailService:
    """Service for email automation and campaign management"""
    
    def __init__(self):
        # Gmail API configuration
        self.gmail_config = {
            'credentials_file': os.getenv('GMAIL_CREDENTIALS_FILE', 'credentials.json'),
            'token_file': os.getenv('GMAIL_TOKEN_FILE', 'token.pickle'),
            'scopes': ['https://www.googleapis.com/auth/gmail.send',
                      'https://www.googleapis.com/auth/gmail.readonly',
                      'https://www.googleapis.com/auth/gmail.modify']
        }
        
        # SMTP configuration
        self.smtp_config = {
            'host': os.getenv('SMTP_HOST', 'smtp.gmail.com'),
            'port': int(os.getenv('SMTP_PORT', '587')),
            'username': os.getenv('SMTP_USERNAME'),
            'password': os.getenv('SMTP_PASSWORD'),
            'use_tls': os.getenv('SMTP_USE_TLS', 'true').lower() == 'true'
        }
        
        # Email templates
        self.templates = {
            'welcome': {
                'subject': 'Welcome to {company_name}!',
                'html': '''
                <html>
                <body>
                    <h2>Welcome {name}!</h2>
                    <p>Thank you for joining {company_name}. We're excited to have you on board.</p>
                    <p>Here's what you can expect:</p>
                    <ul>
                        <li>Regular updates about our products and services</li>
                        <li>Exclusive offers and promotions</li>
                        <li>Industry insights and tips</li>
                    </ul>
                    <p>Best regards,<br>The {company_name} Team</p>
                </body>
                </html>
                '''
            },
            'newsletter': {
                'subject': '{company_name} Newsletter - {date}',
                'html': '''
                <html>
                <body>
                    <h2>{company_name} Newsletter</h2>
                    <p>Dear {name},</p>
                    <div>{content}</div>
                    <hr>
                    <p>Best regards,<br>The {company_name} Team</p>
                    <p><small>You received this email because you subscribed to our newsletter.</small></p>
                </body>
                </html>
                '''
            },
            'lead_nurture': {
                'subject': 'Valuable insights for {industry} professionals',
                'html': '''
                <html>
                <body>
                    <h2>Hello {name},</h2>
                    <p>We noticed you're interested in {topic}. Here are some insights that might be valuable:</p>
                    <div>{content}</div>
                    <p>Would you like to learn more? Feel free to reply to this email or schedule a call.</p>
                    <p>Best regards,<br>{sender_name}<br>{company_name}</p>
                </body>
                </html>
                '''
            },
            'follow_up': {
                'subject': 'Following up on our conversation',
                'html': '''
                <html>
                <body>
                    <h2>Hi {name},</h2>
                    <p>I wanted to follow up on our recent conversation about {topic}.</p>
                    <div>{content}</div>
                    <p>I'd love to continue our discussion. When would be a good time for you?</p>
                    <p>Best regards,<br>{sender_name}<br>{company_name}</p>
                </body>
                </html>
                '''
            }
        }
        
        self.gmail_service = None
    
    def authenticate_gmail(self) -> bool:
        """
        Authenticate with Gmail API
        
        Returns:
            Boolean indicating success
        """
        try:
            creds = None
            
            # Load existing token
            if os.path.exists(self.gmail_config['token_file']):
                with open(self.gmail_config['token_file'], 'rb') as token:
                    creds = pickle.load(token)
            
            # If no valid credentials, get new ones
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    if not os.path.exists(self.gmail_config['credentials_file']):
                        logger.error("Gmail credentials file not found")
                        return False
                    
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.gmail_config['credentials_file'],
                        self.gmail_config['scopes']
                    )
                    creds = flow.run_local_server(port=0)
                
                # Save credentials for next run
                with open(self.gmail_config['token_file'], 'wb') as token:
                    pickle.dump(creds, token)
            
            self.gmail_service = build('gmail', 'v1', credentials=creds)
            return True
            
        except Exception as e:
            logger.error(f"Gmail authentication error: {str(e)}")
            return False
    
    def send_email_smtp(self, to_emails: List[str], subject: str, 
                       html_content: str, text_content: str = None,
                       attachments: List[str] = None) -> Dict[str, Any]:
        """
        Send email using SMTP
        
        Args:
            to_emails: List of recipient email addresses
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text content (optional)
            attachments: List of file paths to attach
            
        Returns:
            Dictionary with sending result
        """
        try:
            if not self.smtp_config['username'] or not self.smtp_config['password']:
                return {'success': False, 'error': 'SMTP credentials not configured'}
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.smtp_config['username']
            msg['To'] = ', '.join(to_emails)
            msg['Subject'] = subject
            
            # Add text content
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Add attachments
            if attachments:
                for file_path in attachments:
                    if os.path.exists(file_path):
                        with open(file_path, 'rb') as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {os.path.basename(file_path)}'
                        )
                        msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port'])
            
            if self.smtp_config['use_tls']:
                server.starttls()
            
            server.login(self.smtp_config['username'], self.smtp_config['password'])
            server.send_message(msg)
            server.quit()
            
            return {
                'success': True,
                'method': 'smtp',
                'recipients': to_emails,
                'subject': subject,
                'sent_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"SMTP email sending error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_email_gmail(self, to_emails: List[str], subject: str,
                        html_content: str, text_content: str = None) -> Dict[str, Any]:
        """
        Send email using Gmail API
        
        Args:
            to_emails: List of recipient email addresses
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text content (optional)
            
        Returns:
            Dictionary with sending result
        """
        try:
            if not self.gmail_service:
                if not self.authenticate_gmail():
                    return {'success': False, 'error': 'Gmail authentication failed'}
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['To'] = ', '.join(to_emails)
            msg['Subject'] = subject
            
            # Add content
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Encode message
            raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
            
            # Send message
            message = {'raw': raw_message}
            result = self.gmail_service.users().messages().send(
                userId='me', body=message
            ).execute()
            
            return {
                'success': True,
                'method': 'gmail_api',
                'message_id': result.get('id'),
                'recipients': to_emails,
                'subject': subject,
                'sent_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Gmail API email sending error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_email(self, to_emails: List[str], subject: str, content: str,
                  template: str = None, template_vars: Dict[str, Any] = None,
                  method: str = 'auto', attachments: List[str] = None) -> Dict[str, Any]:
        """
        Send email using best available method
        
        Args:
            to_emails: List of recipient email addresses
            subject: Email subject
            content: Email content
            template: Template name to use
            template_vars: Variables for template substitution
            method: Sending method ('auto', 'smtp', 'gmail')
            attachments: List of file paths to attach
            
        Returns:
            Dictionary with sending result
        """
        try:
            # Process template if specified
            if template and template in self.templates:
                template_data = self.templates[template]
                template_vars = template_vars or {}
                
                # Substitute variables in subject and content
                subject = template_data['subject'].format(**template_vars)
                html_content = template_data['html'].format(content=content, **template_vars)
            else:
                html_content = f"<html><body>{content}</body></html>"
            
            # Choose sending method
            if method == 'auto':
                # Try Gmail API first, fallback to SMTP
                if self.gmail_service or self.authenticate_gmail():
                    return self.send_email_gmail(to_emails, subject, html_content)
                else:
                    return self.send_email_smtp(to_emails, subject, html_content, attachments=attachments)
            elif method == 'gmail':
                return self.send_email_gmail(to_emails, subject, html_content)
            elif method == 'smtp':
                return self.send_email_smtp(to_emails, subject, html_content, attachments=attachments)
            else:
                return {'success': False, 'error': f'Unknown method: {method}'}
                
        except Exception as e:
            logger.error(f"Email sending error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send email campaign to multiple recipients
        
        Args:
            campaign_data: Campaign configuration and recipient data
            
        Returns:
            Dictionary with campaign results
        """
        try:
            recipients = campaign_data.get('recipients', [])
            subject_template = campaign_data.get('subject', 'Campaign Email')
            content_template = campaign_data.get('content', '')
            template = campaign_data.get('template')
            method = campaign_data.get('method', 'auto')
            
            results = {
                'campaign_id': campaign_data.get('campaign_id', f"campaign_{int(datetime.utcnow().timestamp())}"),
                'total_recipients': len(recipients),
                'successful_sends': 0,
                'failed_sends': 0,
                'results': [],
                'started_at': datetime.utcnow().isoformat()
            }
            
            for recipient in recipients:
                try:
                    # Personalize content
                    recipient_vars = recipient.copy()
                    recipient_vars.update(campaign_data.get('global_vars', {}))
                    
                    subject = subject_template.format(**recipient_vars)
                    content = content_template.format(**recipient_vars)
                    
                    # Send email
                    result = self.send_email(
                        to_emails=[recipient['email']],
                        subject=subject,
                        content=content,
                        template=template,
                        template_vars=recipient_vars,
                        method=method
                    )
                    
                    results['results'].append({
                        'email': recipient['email'],
                        'success': result['success'],
                        'result': result
                    })
                    
                    if result['success']:
                        results['successful_sends'] += 1
                    else:
                        results['failed_sends'] += 1
                        
                except Exception as e:
                    results['results'].append({
                        'email': recipient.get('email', 'unknown'),
                        'success': False,
                        'error': str(e)
                    })
                    results['failed_sends'] += 1
            
            results['completed_at'] = datetime.utcnow().isoformat()
            results['success_rate'] = results['successful_sends'] / results['total_recipients'] if results['total_recipients'] > 0 else 0
            
            return {
                'success': True,
                'campaign_results': results
            }
            
        except Exception as e:
            logger.error(f"Email campaign error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def generate_email_report(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """
        Generate email activity report
        
        Args:
            start_date: Report start date
            end_date: Report end date
            
        Returns:
            Dictionary with email report data
        """
        try:
            # This would typically query a database of sent emails
            # For now, return a mock report structure
            
            report = {
                'report_period': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat(),
                    'days': (end_date - start_date).days
                },
                'email_metrics': {
                    'total_emails_sent': 245,
                    'successful_deliveries': 238,
                    'failed_deliveries': 7,
                    'delivery_rate': 97.1,
                    'bounce_rate': 2.9,
                    'open_rate': 24.5,
                    'click_rate': 3.2,
                    'unsubscribe_rate': 0.8
                },
                'campaign_performance': [
                    {
                        'campaign_id': 'newsletter_2025_01',
                        'subject': 'January Newsletter',
                        'sent_count': 150,
                        'open_rate': 28.5,
                        'click_rate': 4.1,
                        'sent_date': '2025-01-15T10:00:00Z'
                    },
                    {
                        'campaign_id': 'lead_nurture_tech',
                        'subject': 'Tech Industry Insights',
                        'sent_count': 95,
                        'open_rate': 19.2,
                        'click_rate': 2.1,
                        'sent_date': '2025-01-20T14:30:00Z'
                    }
                ],
                'top_performing_subjects': [
                    {'subject': 'Exclusive offer inside', 'open_rate': 35.2},
                    {'subject': 'Your weekly industry update', 'open_rate': 31.8},
                    {'subject': 'Important account information', 'open_rate': 29.4}
                ],
                'engagement_trends': {
                    'best_send_times': ['Tuesday 10:00 AM', 'Thursday 2:00 PM'],
                    'best_send_days': ['Tuesday', 'Wednesday', 'Thursday'],
                    'device_breakdown': {
                        'mobile': 65.2,
                        'desktop': 28.8,
                        'tablet': 6.0
                    }
                },
                'generated_at': datetime.utcnow().isoformat()
            }
            
            return {
                'success': True,
                'report': report
            }
            
        except Exception as e:
            logger.error(f"Email report generation error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def create_email_template(self, template_name: str, subject: str, 
                            html_content: str, variables: List[str] = None) -> Dict[str, Any]:
        """
        Create a new email template
        
        Args:
            template_name: Name for the template
            subject: Subject line template
            html_content: HTML content template
            variables: List of template variables
            
        Returns:
            Dictionary with creation result
        """
        try:
            self.templates[template_name] = {
                'subject': subject,
                'html': html_content,
                'variables': variables or [],
                'created_at': datetime.utcnow().isoformat()
            }
            
            return {
                'success': True,
                'template_name': template_name,
                'message': 'Template created successfully'
            }
            
        except Exception as e:
            logger.error(f"Template creation error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_email_templates(self) -> Dict[str, Any]:
        """
        Get all available email templates
        
        Returns:
            Dictionary with templates
        """
        return {
            'success': True,
            'templates': self.templates
        }
    
    def schedule_email(self, email_data: Dict[str, Any], send_time: datetime) -> Dict[str, Any]:
        """
        Schedule an email for future sending
        
        Args:
            email_data: Email configuration
            send_time: When to send the email
            
        Returns:
            Dictionary with scheduling result
        """
        try:
            # This would typically integrate with a task queue like Celery
            # For now, return a mock scheduling response
            
            schedule_id = f"schedule_{int(datetime.utcnow().timestamp())}"
            
            return {
                'success': True,
                'schedule_id': schedule_id,
                'email_data': email_data,
                'send_time': send_time.isoformat(),
                'status': 'scheduled',
                'created_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Email scheduling error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check email service health
        
        Returns:
            Dictionary with health status
        """
        health_status = {
            'service_status': 'healthy',
            'smtp_configured': bool(self.smtp_config['username'] and self.smtp_config['password']),
            'gmail_configured': os.path.exists(self.gmail_config['credentials_file']),
            'gmail_authenticated': self.gmail_service is not None,
            'templates_available': len(self.templates),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Test SMTP connection
        if health_status['smtp_configured']:
            try:
                server = smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port'])
                if self.smtp_config['use_tls']:
                    server.starttls()
                server.login(self.smtp_config['username'], self.smtp_config['password'])
                server.quit()
                health_status['smtp_connection'] = 'healthy'
            except Exception as e:
                health_status['smtp_connection'] = f'error: {str(e)}'
        else:
            health_status['smtp_connection'] = 'not_configured'
        
        return health_status

# Global email service instance
email_service = EmailService()

