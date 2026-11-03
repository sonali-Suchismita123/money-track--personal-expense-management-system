"""
routes/savings.py
-----------------
Savings Goals CRUD blueprint.

URL prefix: /api/savings
All routes require login.

Special feature: PUT /api/savings/<id> accepts an 'add_amount' field
to increment the current_amount (rather than replacing it), allowing
users to record deposits towards a goal without knowing the previous value.
"""

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from extensions import db
from models.savings_goal import SavingsGoal
from utils.validators import (
    validate_amount, validate_date, sanitize_string
)

savings_bp = Blueprint("savings", __name__, url_prefix="/api/savings")


# ------------------------------------------------------------------ #
# GET /api/savings  — list all savings goals
# ------------------------------------------------------------------ #
@savings_bp.route("", methods=["GET"])
@login_required
def get_savings():
    """Return all savings goals for the current user, newest first."""
    try:
        goals = (
            SavingsGoal.query
            .filter_by(user_id=current_user.id)
            .order_by(SavingsGoal.created_at.desc())
            .all()
        )

        return jsonify({
            "savings_goals": [g.to_dict() for g in goals],
            "count":         len(goals)
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch savings goals", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/savings  — create a savings goal
# ------------------------------------------------------------------ #
@savings_bp.route("", methods=["POST"])
@login_required
def create_savings():
    """
    Create a new savings goal.

    Required JSON fields:
        title         : string  (e.g. "New Laptop Fund")
        target_amount : positive number

    Optional JSON fields:
        deadline    : YYYY-MM-DD string
        description : text
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        title         = sanitize_string(data.get("title", ""))
        target_amount = data.get("target_amount")
        deadline_str  = sanitize_string(data.get("deadline", ""))
        description   = sanitize_string(data.get("description", ""))

        # ---- Validate ----
        if not title:
            return jsonify({"error": "Title is required"}), 400
        if not validate_amount(target_amount):
            return jsonify({"error": "target_amount must be a positive number"}), 400

        deadline = None
        if deadline_str:
            if not validate_date(deadline_str):
                return jsonify({"error": "deadline must be in YYYY-MM-DD format"}), 400
            deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()

        # Optional initial current_amount
        current_amount_val = 0.0
        if "current_amount" in data and data["current_amount"] is not None:
            try:
                parsed_current = float(data["current_amount"])
                if parsed_current >= 0:
                    current_amount_val = round(parsed_current, 2)
            except (ValueError, TypeError):
                pass

        goal = SavingsGoal(
            user_id        = current_user.id,
            title          = title,
            target_amount  = round(float(target_amount), 2),
            current_amount = current_amount_val,
            deadline       = deadline,
            description    = description or None,
        )
        db.session.add(goal)
        db.session.commit()

        return jsonify({
            "message":      "Savings goal created successfully",
            "savings_goal": goal.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create savings goal", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/savings/<id>  — get a single savings goal
# ------------------------------------------------------------------ #
@savings_bp.route("/<int:goal_id>", methods=["GET"])
@login_required
def get_saving(goal_id):
    """Return a single savings goal by ID."""
    try:
        goal = SavingsGoal.query.filter_by(
            id      = goal_id,
            user_id = current_user.id
        ).first()

        if not goal:
            return jsonify({"error": "Savings goal not found"}), 404

        return jsonify({"savings_goal": goal.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch savings goal", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# PUT /api/savings/<id>  — update or add money to a savings goal
# ------------------------------------------------------------------ #
@savings_bp.route("/<int:goal_id>", methods=["PUT"])
@login_required
def update_saving(goal_id):
    """
    Update a savings goal's details OR add money to it.

    To add money, pass 'add_amount' (positive number).
    To edit fields, pass any of: title, target_amount, deadline, description.

    Example — add ₹1,000 to goal:
        { "add_amount": 1000 }

    Example — update the deadline:
        { "deadline": "2025-06-30" }
    """
    try:
        goal = SavingsGoal.query.filter_by(
            id      = goal_id,
            user_id = current_user.id
        ).first()

        if not goal:
            return jsonify({"error": "Savings goal not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # ---- Special field: add_amount (increments current_amount) ----
        if "add_amount" in data:
            add_amount = data["add_amount"]
            if not validate_amount(add_amount):
                return jsonify({"error": "add_amount must be a positive number"}), 400
            goal.current_amount = round(goal.current_amount + float(add_amount), 2)

        # ---- Regular field updates ----
        if "title" in data:
            title = sanitize_string(data["title"])
            if not title:
                return jsonify({"error": "Title cannot be empty"}), 400
            goal.title = title

        if "target_amount" in data:
            if not validate_amount(data["target_amount"]):
                return jsonify({"error": "target_amount must be a positive number"}), 400
            goal.target_amount = round(float(data["target_amount"]), 2)

        if "current_amount" in data:
            # Allow direct override of current_amount (e.g. correcting a mistake)
            try:
                val = float(data["current_amount"])
                if val < 0:
                    return jsonify({"error": "current_amount cannot be negative"}), 400
                goal.current_amount = round(val, 2)
            except (TypeError, ValueError):
                return jsonify({"error": "current_amount must be a number"}), 400

        if "deadline" in data:
            deadline_str = sanitize_string(data["deadline"])
            if deadline_str:
                if not validate_date(deadline_str):
                    return jsonify({"error": "deadline must be in YYYY-MM-DD format"}), 400
                goal.deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()
            else:
                goal.deadline = None  # Allow removing the deadline

        if "description" in data:
            goal.description = sanitize_string(data["description"]) or None

        db.session.commit()

        return jsonify({
            "message":      "Savings goal updated successfully",
            "savings_goal": goal.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update savings goal", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/savings/<id>/add  — deposit funds into a savings goal
# ------------------------------------------------------------------ #
@savings_bp.route("/<int:goal_id>/add", methods=["POST"])
@login_required
def add_funds(goal_id):
    """Deposit/add funds into an existing savings goal."""
    try:
        goal = SavingsGoal.query.filter_by(
            id      = goal_id,
            user_id = current_user.id
        ).first()

        if not goal:
            return jsonify({"error": "Savings goal not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        amount = data.get("amount") or data.get("add_amount")
        if not validate_amount(amount):
            return jsonify({"error": "amount must be a positive number"}), 400

        goal.current_amount = round(goal.current_amount + float(amount), 2)
        db.session.commit()

        return jsonify({
            "message": "Funds added successfully",
            "savings_goal": goal.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add funds", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# DELETE /api/savings/<id>  — delete a savings goal
# ------------------------------------------------------------------ #
@savings_bp.route("/<int:goal_id>", methods=["DELETE"])
@login_required
def delete_saving(goal_id):
    """Delete a savings goal (must belong to current user)."""
    try:
        goal = SavingsGoal.query.filter_by(
            id      = goal_id,
            user_id = current_user.id
        ).first()

        if not goal:
            return jsonify({"error": "Savings goal not found"}), 404

        db.session.delete(goal)
        db.session.commit()

        return jsonify({"message": "Savings goal deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete savings goal", "details": str(e)}), 500
