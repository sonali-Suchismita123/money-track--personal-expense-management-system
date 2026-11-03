"""
models/transaction.py
---------------------
SQLAlchemy model for the 'transactions' table.

Every time a user records money coming in (income) or going out (expense),
a Transaction row is created.  The 'amount' is always stored as a positive
float; the 'type' column tells us whether it is income or expense.
"""

from datetime import datetime, date
from extensions import db


class Transaction(db.Model):
    """
    Represents a single financial transaction.

    Fields:
      - amount      : positive float (e.g. 500.00)
      - type        : 'income' | 'expense'
      - description : short label (e.g. "Lunch at Subway")
      - date        : the date the transaction occurred (not necessarily today)
      - notes       : optional longer text for extra context
    """

    __tablename__ = "transactions"

    # ------------------------------------------------------------------ #
    # Columns
    # ------------------------------------------------------------------ #
    id          = db.Column(db.Integer, primary_key=True)

    # The owner of this transaction
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # What category does this belong to? (e.g. Food, Salary)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)

    # Always positive; type determines income vs expense
    amount      = db.Column(db.Float, nullable=False)

    # 'income' or 'expense'
    type        = db.Column(db.String(10), nullable=False)

    # Short description shown in the transaction list
    description = db.Column(db.String(255), nullable=False)

    # The actual date of the transaction (may differ from created_at)
    date        = db.Column(db.Date, nullable=False, default=date.today)

    # When this database record was created
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    # Optional extended notes
    notes       = db.Column(db.Text, nullable=True)

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    user     = db.relationship("User",     back_populates="transactions")
    category = db.relationship("Category", back_populates="transactions")

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def to_dict(self):
        """Return a JSON-serialisable dictionary including category info."""
        return {
            "id":          self.id,
            "user_id":     self.user_id,
            "category_id": self.category_id,
            # Embed basic category info so the frontend doesn't need a second call
            "category":    self.category.to_dict() if self.category else None,
            "amount":      self.amount,
            "type":        self.type,
            "description": self.description,
            "date":        self.date.isoformat() if self.date else None,
            "notes":       self.notes,
            "created_at":  self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Transaction id={self.id} type={self.type!r} amount={self.amount}>"
