"""
models/category.py
------------------
SQLAlchemy model for the 'categories' table.

A category can be:
  - A SYSTEM category  → user_id is NULL  (seeded in app.py; visible to everyone)
  - A USER category    → user_id points to the creator (private to that user)

The 'type' column restricts whether the category applies to income or expense.
"""

from datetime import datetime
from extensions import db


class Category(db.Model):
    """
    Represents a transaction category (e.g. Food 🍔, Salary 💰).

    System categories have user_id = None.
    User-created categories are linked to the user who created them.
    """

    __tablename__ = "categories"

    # ------------------------------------------------------------------ #
    # Columns
    # ------------------------------------------------------------------ #
    id      = db.Column(db.Integer, primary_key=True)

    # Human-readable name shown in the UI (e.g. "Groceries")
    name    = db.Column(db.String(100), nullable=False)

    # 'income' or 'expense' — enforced at the application layer
    type    = db.Column(db.String(10), nullable=False)

    # Emoji icon displayed alongside the category name (e.g. "🍔")
    icon    = db.Column(db.String(10), nullable=True, default="📂")

    # Hex colour code used for charts (e.g. "#FF5733")
    color   = db.Column(db.String(20), nullable=True, default="#6c757d")

    # NULL → system/default category; integer → user-created category
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    user         = db.relationship("User",        back_populates="categories")
    transactions = db.relationship("Transaction", back_populates="category", lazy=True)
    budgets      = db.relationship("Budget",      back_populates="category", lazy=True)

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def to_dict(self):
        """Return a JSON-serialisable dictionary."""
        return {
            "id":         self.id,
            "name":       self.name,
            "type":       self.type,
            "icon":       self.icon,
            "color":      self.color,
            "user_id":    self.user_id,
            "is_system":  self.user_id is None,   # convenience flag for the frontend
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Category id={self.id} name={self.name!r} type={self.type!r}>"
