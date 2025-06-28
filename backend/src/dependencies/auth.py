from functools import wraps
from flask import request, jsonify, current_app
from typing import Optional
import jwt
from datetime import datetime, timedelta
from src.models.user import User
from src.config import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None


def get_current_user():
    """Dependency to get current authenticated user."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({"error": "Authorization header missing"}), 401
            
            try:
                token = auth_header.split(" ")[1]
                payload = verify_token(token)
                if not payload:
                    return jsonify({"error": "Invalid or expired token"}), 401
                
                user_id = payload.get("sub")
                if not user_id:
                    return jsonify({"error": "Invalid token payload"}), 401
                
                user = User.query.get(user_id)
                if not user:
                    return jsonify({"error": "User not found"}), 401
                
                return f(user, *args, **kwargs)
            except IndexError:
                return jsonify({"error": "Invalid authorization header format"}), 401
            except Exception as e:
                return jsonify({"error": f"Authentication error: {str(e)}"}), 401
        
        return decorated_function
    return decorator


def require_auth(f):
    """Decorator to require authentication for routes."""
    return get_current_user()(f)


def optional_auth(f):
    """Decorator for optional authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
                payload = verify_token(token)
                if payload:
                    user_id = payload.get("sub")
                    user = User.query.get(user_id)
                    if user:
                        return f(user, *args, **kwargs)
            except (IndexError, Exception):
                pass
        
        return f(None, *args, **kwargs)
    
    return decorated_function 