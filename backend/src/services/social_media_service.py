"""
Social Media Service for Agent CEO system
Handles integration with various social media platforms
"""

import os
import json
import requests
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import base64

logger = logging.getLogger(__name__)

class SocialMediaService:
    """Service for managing social media integrations and posting"""
    
    def __init__(self):
        # Platform configurations
        self.platforms = {
            'linkedin': {
                'api_base': 'https://api.linkedin.com/v2',
                'access_token': os.getenv('LINKEDIN_ACCESS_TOKEN'),
                'client_id': os.getenv('LINKEDIN_CLIENT_ID'),
                'client_secret': os.getenv('LINKEDIN_CLIENT_SECRET')
            },
            'twitter': {
                'api_base': 'https://api.twitter.com/2',
                'bearer_token': os.getenv('TWITTER_BEARER_TOKEN'),
                'api_key': os.getenv('TWITTER_API_KEY'),
                'api_secret': os.getenv('TWITTER_API_SECRET'),
                'access_token': os.getenv('TWITTER_ACCESS_TOKEN'),
                'access_token_secret': os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
            },
            'facebook': {
                'api_base': 'https://graph.facebook.com/v18.0',
                'access_token': os.getenv('FACEBOOK_ACCESS_TOKEN'),
                'page_id': os.getenv('FACEBOOK_PAGE_ID')
            },
            'instagram': {
                'api_base': 'https://graph.facebook.com/v18.0',
                'access_token': os.getenv('INSTAGRAM_ACCESS_TOKEN'),
                'account_id': os.getenv('INSTAGRAM_ACCOUNT_ID')
            }
        }
        
        # Buffer/Hootsuite integration for scheduling
        self.buffer_config = {
            'api_base': 'https://api.bufferapp.com/1',
            'access_token': os.getenv('BUFFER_ACCESS_TOKEN')
        }
        
        self.hootsuite_config = {
            'api_base': 'https://platform.hootsuite.com/v1',
            'access_token': os.getenv('HOOTSUITE_ACCESS_TOKEN')
        }
    
    def post_to_linkedin(self, content: str, media_urls: List[str] = None) -> Dict[str, Any]:
        """
        Post content to LinkedIn
        
        Args:
            content: Text content for the post
            media_urls: Optional list of media URLs
            
        Returns:
            Dictionary with posting result
        """
        try:
            config = self.platforms['linkedin']
            if not config['access_token']:
                return {'success': False, 'error': 'LinkedIn access token not configured'}
            
            headers = {
                'Authorization': f"Bearer {config['access_token']}",
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
            
            # Get user profile ID
            profile_url = f"{config['api_base']}/people/~"
            profile_response = requests.get(profile_url, headers=headers)
            
            if profile_response.status_code != 200:
                return {'success': False, 'error': 'Failed to get LinkedIn profile'}
            
            profile_id = profile_response.json()['id']
            
            # Prepare post data
            post_data = {
                'author': f'urn:li:person:{profile_id}',
                'lifecycleState': 'PUBLISHED',
                'specificContent': {
                    'com.linkedin.ugc.ShareContent': {
                        'shareCommentary': {
                            'text': content
                        },
                        'shareMediaCategory': 'NONE'
                    }
                },
                'visibility': {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            }
            
            # Add media if provided
            if media_urls:
                post_data['specificContent']['com.linkedin.ugc.ShareContent']['shareMediaCategory'] = 'IMAGE'
                # Note: Media upload requires additional steps for LinkedIn API
            
            # Post to LinkedIn
            post_url = f"{config['api_base']}/ugcPosts"
            response = requests.post(post_url, json=post_data, headers=headers)
            
            if response.status_code == 201:
                return {
                    'success': True,
                    'platform': 'linkedin',
                    'post_id': response.json().get('id'),
                    'response': response.json()
                }
            else:
                return {
                    'success': False,
                    'error': f"LinkedIn API error: {response.status_code} - {response.text}"
                }
                
        except Exception as e:
            logger.error(f"LinkedIn posting error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def post_to_twitter(self, content: str, media_urls: List[str] = None) -> Dict[str, Any]:
        """
        Post content to Twitter/X
        
        Args:
            content: Tweet content (max 280 characters)
            media_urls: Optional list of media URLs
            
        Returns:
            Dictionary with posting result
        """
        try:
            config = self.platforms['twitter']
            if not config['bearer_token']:
                return {'success': False, 'error': 'Twitter bearer token not configured'}
            
            headers = {
                'Authorization': f"Bearer {config['bearer_token']}",
                'Content-Type': 'application/json'
            }
            
            # Prepare tweet data
            tweet_data = {
                'text': content[:280]  # Ensure character limit
            }
            
            # Add media if provided (requires media upload first)
            if media_urls:
                # Note: Media upload requires additional API calls
                pass
            
            # Post tweet
            post_url = f"{config['api_base']}/tweets"
            response = requests.post(post_url, json=tweet_data, headers=headers)
            
            if response.status_code == 201:
                return {
                    'success': True,
                    'platform': 'twitter',
                    'post_id': response.json().get('data', {}).get('id'),
                    'response': response.json()
                }
            else:
                return {
                    'success': False,
                    'error': f"Twitter API error: {response.status_code} - {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Twitter posting error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def post_to_facebook(self, content: str, media_urls: List[str] = None) -> Dict[str, Any]:
        """
        Post content to Facebook page
        
        Args:
            content: Post content
            media_urls: Optional list of media URLs
            
        Returns:
            Dictionary with posting result
        """
        try:
            config = self.platforms['facebook']
            if not config['access_token'] or not config['page_id']:
                return {'success': False, 'error': 'Facebook credentials not configured'}
            
            # Prepare post data
            post_data = {
                'message': content,
                'access_token': config['access_token']
            }
            
            # Add media if provided
            if media_urls and len(media_urls) > 0:
                post_data['link'] = media_urls[0]  # Facebook can auto-preview links
            
            # Post to Facebook
            post_url = f"{config['api_base']}/{config['page_id']}/feed"
            response = requests.post(post_url, data=post_data)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'platform': 'facebook',
                    'post_id': response.json().get('id'),
                    'response': response.json()
                }
            else:
                return {
                    'success': False,
                    'error': f"Facebook API error: {response.status_code} - {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Facebook posting error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def schedule_post_buffer(self, platform: str, content: str, 
                           schedule_time: datetime, media_urls: List[str] = None) -> Dict[str, Any]:
        """
        Schedule a post using Buffer
        
        Args:
            platform: Social media platform
            content: Post content
            schedule_time: When to post
            media_urls: Optional media URLs
            
        Returns:
            Dictionary with scheduling result
        """
        try:
            if not self.buffer_config['access_token']:
                return {'success': False, 'error': 'Buffer access token not configured'}
            
            headers = {
                'Authorization': f"Bearer {self.buffer_config['access_token']}",
                'Content-Type': 'application/json'
            }
            
            # Get Buffer profiles
            profiles_url = f"{self.buffer_config['api_base']}/profiles.json"
            profiles_response = requests.get(profiles_url, headers=headers)
            
            if profiles_response.status_code != 200:
                return {'success': False, 'error': 'Failed to get Buffer profiles'}
            
            profiles = profiles_response.json()
            target_profile = None
            
            # Find the profile for the specified platform
            for profile in profiles:
                if profile['service'].lower() == platform.lower():
                    target_profile = profile
                    break
            
            if not target_profile:
                return {'success': False, 'error': f'No Buffer profile found for {platform}'}
            
            # Prepare update data
            update_data = {
                'text': content,
                'profile_ids': [target_profile['id']],
                'scheduled_at': int(schedule_time.timestamp())
            }
            
            # Add media if provided
            if media_urls:
                update_data['media'] = {'link': media_urls[0]}
            
            # Schedule the post
            schedule_url = f"{self.buffer_config['api_base']}/updates/create.json"
            response = requests.post(schedule_url, json=update_data, headers=headers)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'platform': platform,
                    'scheduler': 'buffer',
                    'update_id': response.json().get('id'),
                    'scheduled_time': schedule_time.isoformat(),
                    'response': response.json()
                }
            else:
                return {
                    'success': False,
                    'error': f"Buffer API error: {response.status_code} - {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Buffer scheduling error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def post_to_multiple_platforms(self, platforms: List[str], content: str, 
                                 media_urls: List[str] = None) -> Dict[str, Any]:
        """
        Post content to multiple social media platforms
        
        Args:
            platforms: List of platform names
            content: Post content
            media_urls: Optional media URLs
            
        Returns:
            Dictionary with results for each platform
        """
        results = {
            'success': True,
            'platforms': {},
            'successful_posts': 0,
            'failed_posts': 0
        }
        
        for platform in platforms:
            try:
                if platform.lower() == 'linkedin':
                    result = self.post_to_linkedin(content, media_urls)
                elif platform.lower() == 'twitter':
                    result = self.post_to_twitter(content, media_urls)
                elif platform.lower() == 'facebook':
                    result = self.post_to_facebook(content, media_urls)
                else:
                    result = {'success': False, 'error': f'Unsupported platform: {platform}'}
                
                results['platforms'][platform] = result
                
                if result['success']:
                    results['successful_posts'] += 1
                else:
                    results['failed_posts'] += 1
                    
            except Exception as e:
                results['platforms'][platform] = {'success': False, 'error': str(e)}
                results['failed_posts'] += 1
        
        # Overall success if at least one platform succeeded
        results['success'] = results['successful_posts'] > 0
        
        return results
    
    def get_platform_analytics(self, platform: str, days: int = 7) -> Dict[str, Any]:
        """
        Get analytics data for a platform
        
        Args:
            platform: Social media platform
            days: Number of days to look back
            
        Returns:
            Dictionary with analytics data
        """
        try:
            # This would integrate with each platform's analytics API
            # For now, return mock data structure
            
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            mock_analytics = {
                'platform': platform,
                'period': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat(),
                    'days': days
                },
                'metrics': {
                    'posts_published': 12,
                    'total_impressions': 5420,
                    'total_engagements': 234,
                    'engagement_rate': 4.32,
                    'followers_gained': 15,
                    'clicks': 89,
                    'shares': 23,
                    'comments': 45,
                    'likes': 166
                },
                'top_performing_posts': [
                    {
                        'post_id': 'post_123',
                        'content': 'Sample high-performing post...',
                        'impressions': 1200,
                        'engagements': 89,
                        'engagement_rate': 7.42
                    }
                ]
            }
            
            return {
                'success': True,
                'analytics': mock_analytics
            }
            
        except Exception as e:
            logger.error(f"Analytics error for {platform}: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def generate_content_suggestions(self, industry: str, tone: str = 'professional') -> Dict[str, Any]:
        """
        Generate content suggestions for social media posts
        
        Args:
            industry: Business industry
            tone: Content tone (professional, casual, friendly, etc.)
            
        Returns:
            Dictionary with content suggestions
        """
        try:
            # This would integrate with AI service for content generation
            suggestions = [
                {
                    'type': 'industry_insight',
                    'content': f'Latest trends in {industry} that are shaping the future...',
                    'hashtags': ['#innovation', f'#{industry.lower()}', '#business'],
                    'best_time': '09:00',
                    'platforms': ['linkedin', 'twitter']
                },
                {
                    'type': 'tip_sharing',
                    'content': f'Pro tip for {industry} professionals: Always stay ahead...',
                    'hashtags': ['#tips', '#professional', f'#{industry.lower()}'],
                    'best_time': '13:00',
                    'platforms': ['linkedin', 'facebook']
                },
                {
                    'type': 'behind_scenes',
                    'content': 'Behind the scenes at our company: How we approach...',
                    'hashtags': ['#behindthescenes', '#company', '#team'],
                    'best_time': '17:00',
                    'platforms': ['instagram', 'facebook']
                }
            ]
            
            return {
                'success': True,
                'industry': industry,
                'tone': tone,
                'suggestions': suggestions,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Content suggestion error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check health of social media service and platform connections
        
        Returns:
            Dictionary with health status
        """
        health_status = {
            'service_status': 'healthy',
            'platforms': {},
            'schedulers': {},
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Check platform configurations
        for platform, config in self.platforms.items():
            if platform == 'linkedin' and config['access_token']:
                health_status['platforms'][platform] = 'configured'
            elif platform == 'twitter' and config['bearer_token']:
                health_status['platforms'][platform] = 'configured'
            elif platform == 'facebook' and config['access_token'] and config['page_id']:
                health_status['platforms'][platform] = 'configured'
            elif platform == 'instagram' and config['access_token'] and config['account_id']:
                health_status['platforms'][platform] = 'configured'
            else:
                health_status['platforms'][platform] = 'not_configured'
        
        # Check scheduler configurations
        if self.buffer_config['access_token']:
            health_status['schedulers']['buffer'] = 'configured'
        else:
            health_status['schedulers']['buffer'] = 'not_configured'
            
        if self.hootsuite_config['access_token']:
            health_status['schedulers']['hootsuite'] = 'configured'
        else:
            health_status['schedulers']['hootsuite'] = 'not_configured'
        
        return health_status

# Global social media service instance
social_media_service = SocialMediaService()

