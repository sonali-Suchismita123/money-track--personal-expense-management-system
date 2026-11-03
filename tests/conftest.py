import pytest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app import create_app, _seed_default_categories
from extensions import db
from config import Config
from models.user import User
from werkzeug.security import generate_password_hash


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
    SECRET_KEY = "test-secret-key"


@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        _seed_default_categories()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def test_user(app):
    user = User(
        username="tester",
        email="test@example.com",
        password_hash=generate_password_hash("Password@123"),
        full_name="Test User",
        currency="INR"
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def auth_client(client, test_user):
    client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "Password@123"
    })
    return client

