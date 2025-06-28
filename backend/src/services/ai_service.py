"""
AI Service for Agent CEO system
Handles integration with various LLM providers and AI capabilities
"""

import os
import json
import requests
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI model integration and management"""
    
    def __init__(self):
        self.providers = {
            'openai': {
                'api_key': os.getenv('OPENAI_API_KEY'),
                'base_url': 'https://api.openai.com/v1',
                'models': ['gpt-4.5-turbo', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']
            },
            'anthropic': {
                'api_key': os.getenv('ANTHROPIC_API_KEY'),
                'base_url': 'https://api.anthropic.com/v1',
                'models': ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
            }
        }
        self.default_provider = 'openai'
        self.default_model = 'gpt-4.5-turbo'  # Prioritize GPT-4.5 for strategic reasoning
    
    def generate_text(self, prompt: str, provider: str = None, model: str = None, 
                     max_tokens: int = 1000, temperature: float = 0.7) -> Dict[str, Any]:
        """
        Generate text using specified AI provider and model
        
        Args:
            prompt: Input prompt for text generation
            provider: AI provider to use (openai, anthropic)
            model: Specific model to use
            max_tokens: Maximum tokens to generate
            temperature: Creativity/randomness (0-1)
            
        Returns:
            Dictionary with generated text and metadata
        """
        provider = provider or self.default_provider
        model = model or self.default_model
        
        try:
            if provider == 'openai':
                return self._generate_openai(prompt, model, max_tokens, temperature)
            elif provider == 'anthropic':
                return self._generate_anthropic(prompt, model, max_tokens, temperature)
            else:
                raise ValueError(f"Unsupported provider: {provider}")
                
        except Exception as e:
            logger.error(f"Text generation failed: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'text': '',
                'usage': {}
            }
    
    def _generate_openai(self, prompt: str, model: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Generate text using OpenAI API"""
        api_key = self.providers['openai']['api_key']
        if not api_key:
            raise ValueError("OpenAI API key not configured")
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': model,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': max_tokens,
            'temperature': temperature
        }
        
        response = requests.post(
            f"{self.providers['openai']['base_url']}/chat/completions",
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return {
                'success': True,
                'text': result['choices'][0]['message']['content'],
                'usage': result.get('usage', {}),
                'model': model,
                'provider': 'openai'
            }
        else:
            raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
    
    def _generate_anthropic(self, prompt: str, model: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Generate text using Anthropic API"""
        api_key = self.providers['anthropic']['api_key']
        if not api_key:
            raise ValueError("Anthropic API key not configured")
        
        headers = {
            'x-api-key': api_key,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        }
        
        data = {
            'model': model,
            'max_tokens': max_tokens,
            'temperature': temperature,
            'messages': [{'role': 'user', 'content': prompt}]
        }
        
        response = requests.post(
            f"{self.providers['anthropic']['base_url']}/messages",
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return {
                'success': True,
                'text': result['content'][0]['text'],
                'usage': result.get('usage', {}),
                'model': model,
                'provider': 'anthropic'
            }
        else:
            raise Exception(f"Anthropic API error: {response.status_code} - {response.text}")
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of given text"""
        prompt = f"""
        Analyze the sentiment of the following text and provide a detailed analysis:
        
        Text: "{text}"
        
        Please provide:
        1. Overall sentiment (positive, negative, neutral)
        2. Confidence score (0-1)
        3. Key emotional indicators
        4. Brief explanation
        
        Respond in JSON format.
        """
        
        result = self.generate_text(prompt, max_tokens=500, temperature=0.3)
        
        if result['success']:
            try:
                # Try to parse JSON response
                sentiment_data = json.loads(result['text'])
                return {
                    'success': True,
                    'sentiment': sentiment_data
                }
            except json.JSONDecodeError:
                # Fallback to text response
                return {
                    'success': True,
                    'sentiment': {
                        'analysis': result['text'],
                        'raw_response': True
                    }
                }
        else:
            return result
    
    def extract_keywords(self, text: str, max_keywords: int = 10) -> Dict[str, Any]:
        """Extract keywords from text"""
        prompt = f"""
        Extract the most important keywords and phrases from the following text.
        Return up to {max_keywords} keywords ranked by importance.
        
        Text: "{text}"
        
        Respond with a JSON array of keywords.
        """
        
        result = self.generate_text(prompt, max_tokens=300, temperature=0.2)
        
        if result['success']:
            try:
                keywords = json.loads(result['text'])
                return {
                    'success': True,
                    'keywords': keywords
                }
            except json.JSONDecodeError:
                # Fallback parsing
                keywords = [kw.strip() for kw in result['text'].split(',')]
                return {
                    'success': True,
                    'keywords': keywords[:max_keywords]
                }
        else:
            return result
    
    def generate_business_content(self, content_type: str, topic: str, 
                                target_audience: str = None, tone: str = "professional") -> Dict[str, Any]:
        """
        Generate business content (emails, social posts, articles, etc.)
        
        Args:
            content_type: Type of content (email, social_post, blog_post, etc.)
            topic: Main topic or subject
            target_audience: Target audience description
            tone: Tone of content (professional, casual, friendly, etc.)
        """
        
        audience_text = f" for {target_audience}" if target_audience else ""
        
        prompts = {
            'email': f"Write a professional email about {topic}{audience_text} with a {tone} tone.",
            'social_post': f"Create an engaging social media post about {topic}{audience_text} with a {tone} tone. Keep it concise and include relevant hashtags.",
            'blog_post': f"Write a comprehensive blog post about {topic}{audience_text} with a {tone} tone. Include an introduction, main points, and conclusion.",
            'product_description': f"Write a compelling product description for {topic}{audience_text} with a {tone} tone.",
            'press_release': f"Write a professional press release about {topic}{audience_text} with a {tone} tone."
        }
        
        prompt = prompts.get(content_type, f"Create {content_type} content about {topic}{audience_text} with a {tone} tone.")
        
        result = self.generate_text(prompt, max_tokens=1500, temperature=0.7)
        
        if result['success']:
            return {
                'success': True,
                'content': result['text'],
                'content_type': content_type,
                'topic': topic,
                'metadata': {
                    'target_audience': target_audience,
                    'tone': tone,
                    'generated_at': datetime.utcnow().isoformat(),
                    'model_used': result.get('model'),
                    'provider': result.get('provider')
                }
            }
        else:
            return result
    
    def analyze_business_data(self, data: Dict[str, Any], analysis_type: str = "general") -> Dict[str, Any]:
        """
        Analyze business data and provide insights
        
        Args:
            data: Business data to analyze
            analysis_type: Type of analysis (general, sales, marketing, financial)
        """
        
        data_summary = json.dumps(data, indent=2)[:2000]  # Limit data size
        
        analysis_prompts = {
            'general': "Analyze this business data and provide key insights, trends, and recommendations:",
            'sales': "Analyze this sales data and provide insights on performance, trends, and opportunities:",
            'marketing': "Analyze this marketing data and provide insights on campaign performance and optimization:",
            'financial': "Analyze this financial data and provide insights on performance and recommendations:"
        }
        
        prompt = f"""
        {analysis_prompts.get(analysis_type, analysis_prompts['general'])}
        
        Data:
        {data_summary}
        
        Please provide:
        1. Key insights
        2. Notable trends
        3. Recommendations
        4. Potential concerns or opportunities
        
        Respond in a structured format.
        """
        
        result = self.generate_text(prompt, max_tokens=1000, temperature=0.4)
        
        if result['success']:
            return {
                'success': True,
                'analysis': result['text'],
                'analysis_type': analysis_type,
                'data_summary': data_summary,
                'generated_at': datetime.utcnow().isoformat()
            }
        else:
            return result
    
    def get_available_models(self, provider: str = None) -> Dict[str, List[str]]:
        """Get list of available models for each provider"""
        if provider:
            return {provider: self.providers.get(provider, {}).get('models', [])}
        else:
            return {p: info.get('models', []) for p, info in self.providers.items()}
    
    def health_check(self) -> Dict[str, Any]:
        """Check health of AI service and providers"""
        health_status = {
            'service_status': 'healthy',
            'providers': {},
            'timestamp': datetime.utcnow().isoformat()
        }
        
        for provider_name, provider_info in self.providers.items():
            if provider_info.get('api_key'):
                health_status['providers'][provider_name] = 'configured'
            else:
                health_status['providers'][provider_name] = 'not_configured'
        
        return health_status

# Global AI service instance
ai_service = AIService()

