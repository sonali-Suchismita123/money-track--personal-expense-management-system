"""
models/budget.py
----------------
SQLAlchemy model for the 'budgets' table.

A budget lets a user set a spending limit for a particular category
within a specific month and year.  The 'spent' amount is computed
dynamically by querying the transactions table.
"""

from datetime import datetime
from extensions import db


class Budget(db.Model):
    """
    Represents a monthly budget for a specific category.

    Example: "I want to spend at most ₹5,000 on Food in November 2024."

    'spent' is NOT stored in the database — it is always calculated on the
    fly from the transactions table to ensure accuracy.
    """

    __tablename__ = "budgets"

    # ------------------------------------------------------------------ #
    # Columns
    # ------------------------------------------------------------------ #
    id          = db.Column(db.Integer, primary_key=True)

    # The user who created this budget
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Which category this budget applies to
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    # The maximum amount the user wishes to spend
    amount      = db.Column(db.Float, nullable=False)

    # Month (1 = January … 12 = December)
    month       = db.Column(db.Integer, nullable=False)

    # 4-digit year (e.g. 2024)
    year        = db.Column(db.Integer, nullable=False)

    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    user     = db.relationship("User",     back_populates="budgets")
    category = db.relationship("Category", back_populates="budgets")

    # ------------------------------------------------------------------ #
    # Computed helpers
    # ------------------------------------------------------------------ #
    def get_spent(self):
        """
        Calculate the total amount spent in this category for this month/year.

        Imports Transaction here (inside the method) to avoid circular imports
        at module load time.
        """
        from models.transaction import Transaction
        from datetime import date

        # Build the date range for the given month/year
        import calendar
        # last day of the month
        last_day = calendar.monthrange(self.year, self.month)[1]
        start    = date(self.year, self.month, 1)
        end      = date(self.year, self.month, last_day)

        # Sum all expense transactions for this user + category in the date range
        result = (
            db.session.query(db.func.sum(Transaction.amount))
            .filter(
                Transaction.user_id     == self.user_id,
                Transaction.category_id == self.category_id,
                Transaction.type        == "expense",
                Transaction.date        >= start,
                Transaction.date        <= end,
            )
            .scalar()
        )
        # scalar() returns None if there are no matching rows — default to 0.0
        return round(result or 0.0, 2)

    def to_dict(self):
        """Return a JSON-serialisable dict including computed spent & percentage."""
        spent      = self.get_spent()
        percentage = round((spent / self.amount * 100), 2) if self.amount > 0 else 0.0

        return {
            "id":          self.id,
            "user_id":     self.user_id,
            "category_id": self.category_id,
            "category":    self.category.to_dict() if self.category else None,
            "amount":      self.amount,
            "month":       self.month,
            "year":        self.year,
            "spent":       spent,
            "remaining":   round(self.amount - spent, 2),
            "percentage":  percentage,            # how much of the budget is used (%)
            "created_at":  self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Budget id={self.id} category_id={self.category_id} {self.month}/{self.year}>"
