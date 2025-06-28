import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.agent import agent_bp
from src.routes.ai import ai_bp
from src.routes.n8n import n8n_bp
from src.routes.strategic import strategic_bp
from src.routes.email import email_bp
from src.routes.data_analysis import data_analysis_bp
from src.config import settings
from src.dependencies.database import init_db

def create_app():
    """Application factory pattern for better testing and configuration."""
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # Load configuration from settings
    app.config['SECRET_KEY'] = settings.secret_key
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = settings.sqlalchemy_track_modifications
    app.config['DEBUG'] = settings.debug

    # Enable CORS
    CORS(app, origins=settings.cors_origins)

    # Initialize database
    db.init_app(app)
    init_db(app)

    # Register blueprints
    app.register_blueprint(user_bp, url_prefix=settings.api_prefix)
    app.register_blueprint(agent_bp, url_prefix=settings.api_prefix)
    app.register_blueprint(ai_bp, url_prefix=settings.api_prefix)
    app.register_blueprint(n8n_bp, url_prefix=settings.api_prefix)
    app.register_blueprint(strategic_bp, url_prefix=settings.api_prefix)
    app.register_blueprint(email_bp, url_prefix=settings.api_prefix)
    app.register_blueprint(data_analysis_bp, url_prefix=settings.api_prefix)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app


app = create_app()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=settings.debug)
