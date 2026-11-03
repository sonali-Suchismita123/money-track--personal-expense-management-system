"""
models/savings_goal.py
----------------------
SQLAlchemy model for the 'savings_goals' table.

A savings goal lets the user track progress towards a financial target —
for example "Save ₹50,000 for a new laptop by December 2024."

Key computed properties:
  - progress_percentage  : (current_amount / target_amount) * 100
  - days_remaining       : how many calendar days are left before the deadline
"""

from datetime import datetime, date
from extensions import db


class SavingsGoal(db.Model):
    """
    Represents a savings goal set by the user.

    Users add money to the goal by calling the PUT /api/savings/<id> endpoint
    with an 'add_amount' field, which increments current_amount.
    """

    __tablename__ = "savings_goals"

    # ------------------------------------------------------------------ #
    # Columns
    # ------------------------------------------------------------------ #
    id             = db.Column(db.Integer, primary_key=True)

    # The user who owns this goal
    user_id        = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Short name of the goal (e.g. "Vacation Fund")
    title          = db.Column(db.String(200), nullable=False)

    # The amount the user wants to save (e.g. 50000.00)
    target_amount  = db.Column(db.Float, nullable=False)

    # How much has been saved so far — starts at 0
    current_amount = db.Column(db.Float, nullable=False, default=0.0)

    # Target date to reach the goal
    deadline       = db.Column(db.Date, nullable=True)

    # Optional description / motivation text
    description    = db.Column(db.Text, nullable=True)

    created_at     = db.Column(db.DateTime, default=datetime.utcnow)

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    user = db.relationship("User", back_populates="savings_goals")

    # ------------------------------------------------------------------ #
    # Computed properties
    # ------------------------------------------------------------------ #
    @property
    def progress_percentage(self):
        """
        Returns what percentage of the target has been saved.
        Capped at 100% so the UI doesn't show > 100%.
        """
        if self.target_amount and self.target_amount > 0:
            pct = (self.current_amount / self.target_amount) * 100
            return round(min(pct, 100.0), 2)
        return 0.0

    @property
    def days_remaining(self):
        """
        Returns the number of days left until the deadline.
        Returns None if no deadline is set.
        Returns a negative number if the deadline has passed.
        """
        if self.deadline:
            delta = self.deadline - date.today()
            return delta.days
        return None

    @property
    def is_completed(self):
        """True when the user has saved at least the target amount."""
        return self.current_amount >= self.target_amount

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def to_dict(self):
        """Return a JSON-serialisable dictionary with computed fields."""
        return {
            "id":                  self.id,
            "user_id":             self.user_id,
            "title":               self.title,
            "target_amount":       self.target_amount,
            "current_amount":      self.current_amount,
            "deadline":            self.deadline.isoformat() if self.deadline else None,
            "description":         self.description,
            "progress_percentage": self.progress_percentage,
            "days_remaining":      self.days_remaining,
            "is_completed":        self.is_completed,
            "created_at":          self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<SavingsGoal id={self.id} title={self.title!r} progress={self.progress_percentage}%>"
