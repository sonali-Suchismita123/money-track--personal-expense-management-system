"""
config.py
---------
Application configuration for MoneyTrack Flask backend.
Contains all configuration variables used by the Flask app.
"""

import os
from dotenv import load_dotenv

# Base directory of the application (the 'backend' folder)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env files
load_dotenv(os.path.join(BASE_DIR, '.env'))
load_dotenv(os.path.join(BASE_DIR, '..', '.env'))

# Neon PostgreSQL connection string
NEON_DATABASE_URL = "postgresql://neondb_owner:npg_DMeJrc2XLl3x@ep-mute-mud-b3u89dub-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


def get_database_uri():
    uri = os.environ.get("DATABASE_URL", NEON_DATABASE_URL)
    # SQLAlchemy 1.4+ requires postgresql:// instead of postgres://
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)
    return uri


class Config:
    """
    Main configuration class.
    All Flask and extension settings are defined here.
    """

    # ------------------------------------------------------------------ #
    # Security
    # ------------------------------------------------------------------ #
    SECRET_KEY = os.environ.get("SECRET_KEY", "moneytrack-super-secret-key-change-in-prod-2024")

    # ------------------------------------------------------------------ #
    # Database (Neon PostgreSQL)
    # ------------------------------------------------------------------ #
    SQLALCHEMY_DATABASE_URI = get_database_uri()

    # Disable Flask-SQLAlchemy event system to save memory
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Connection pooling options for Neon serverless pooler
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,     # checks connection validity before checkout
        "pool_recycle": 300,       # recycle connections older than 5 minutes
    }

    # ------------------------------------------------------------------ #
    # Session / Cookie settings
    # ------------------------------------------------------------------ #
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24 * 30  # 30 days

