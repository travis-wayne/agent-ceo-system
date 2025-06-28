from flask import g
from src.models.user import db
from contextlib import contextmanager
from typing import Generator


def get_db():
    """Get database session."""
    if 'db' not in g:
        g.db = db.session
    return g.db


def close_db(e=None):
    """Close database session."""
    db = g.pop('db', None)
    if db is not None:
        db.close()


@contextmanager
def get_db_session() -> Generator:
    """Context manager for database sessions."""
    session = get_db()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db(app):
    """Initialize database with Flask app."""
    app.teardown_appcontext(close_db) 