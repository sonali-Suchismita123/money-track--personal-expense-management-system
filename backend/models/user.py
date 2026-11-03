"""
models/user.py
--------------
SQLAlchemy model for the 'users' table.

Each user has login credentials, a display name, and a preferred currency.
Flask-Login requires UserMixin which adds is_authenticated, is_active, etc.
"""

from datetime import datetime
from flask_login import UserMixin
from extensions import db  # shared db instance from extensions.py


class User(UserMixin, db.Model):
    """
    Represents a registered user of the MoneyTrack application.

    Inheriting from UserMixin provides Flask-Login with the methods it needs:
      - is_authenticated  (always True for a logged-in user)
      - is_active         (True unless the account is suspended)
      - is_anonymous      (always False for real users)
      - get_id()          (returns str(self.id))
    """

    __tablename__ = "users"

    # ------------------------------------------------------------------ #
    # Columns
    # ------------------------------------------------------------------ #
    id            = db.Column(db.Integer, primary_key=True)

    # Username must be unique across all accounts
    username      = db.Column(db.String(80), unique=True, nullable=False)

    # Email is the primary login identifier
    email         = db.Column(db.String(120), unique=True, nullable=False)

    # We never store the plain-text password; only its Werkzeug hash
    password_hash = db.Column(db.String(256), nullable=False)

    # Optional display name (e.g. "Rahul Sharma")
    full_name     = db.Column(db.String(150), nullable=True)

    # Preferred currency code — defaults to Indian Rupee
    currency      = db.Column(db.String(10), nullable=False, default="INR")

    # Automatically set when the row is first inserted
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # ------------------------------------------------------------------ #
    # Relationships (back-populated from child models)
    # ------------------------------------------------------------------ #
    transactions  = db.relationship("Transaction",  back_populates="user", lazy=True, cascade="all, delete-orphan")
    categories    = db.relationship("Category",     back_populates="user", lazy=True, cascade="all, delete-orphan")
    budgets       = db.relationship("Budget",       back_populates="user", lazy=True, cascade="all, delete-orphan")
    savings_goals = db.relationship("SavingsGoal",  back_populates="user", lazy=True, cascade="all, delete-orphan")

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def to_dict(self):
        """Return a safe, JSON-serialisable dictionary (no password hash)."""
        return {
            "id":         self.id,
            "username":   self.username,
            "email":      self.email,
            "full_name":  self.full_name,
            "currency":   self.currency,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<User id={self.id} email={self.email!r}>"
