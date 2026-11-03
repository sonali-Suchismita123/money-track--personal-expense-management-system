"""
routes/budgets.py
-----------------
Budget CRUD blueprint.

URL prefix: /api/budgets
All routes require login.

When returning a budget, we always include the dynamically computed
'spent' and 'percentage' fields (see Budget.to_dict()).

Optional query parameters for GET /api/budgets:
    ?month=11&year=2024
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from extensions import db
from models.budget import Budget
from models.category import Category
from utils.validators import (
    validate_amount, validate_month, validate_year, sanitize_string
)

budgets_bp = Blueprint("budgets", __name__, url_prefix="/api/budgets")


# ------------------------------------------------------------------ #
# GET /api/budgets  — list budgets
# ------------------------------------------------------------------ #
@budgets_bp.route("", methods=["GET"])
@login_required
def get_budgets():
    """
    Return all budgets for the current user.

    Optional query parameters:
        month : 1-12
        year  : 4-digit year
    """
    try:
        query = Budget.query.filter_by(user_id=current_user.id)

        month = request.args.get("month")
        year  = request.args.get("year")

        if month:
            if not validate_month(month):
                return jsonify({"error": "month must be between 1 and 12"}), 400
            query = query.filter(Budget.month == int(month))

        if year:
            if not validate_year(year):
                return jsonify({"error": "year must be a 4-digit year"}), 400
            query = query.filter(Budget.year == int(year))

        budgets = query.all()

        return jsonify({
            "budgets": [b.to_dict() for b in budgets],
            "count":   len(budgets)
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch budgets", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/budgets  — create a budget
# ------------------------------------------------------------------ #
@budgets_bp.route("", methods=["POST"])
@login_required
def create_budget():
    """
    Create a monthly budget for a category.

    Required JSON fields:
        category_id : integer
        amount      : positive number
        month       : 1-12
        year        : 4-digit year
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        category_id = data.get("category_id")
        amount      = data.get("amount")
        month       = data.get("month")
        year        = data.get("year")

        # ---- Validate all required fields ----
        if not category_id:
            return jsonify({"error": "category_id is required"}), 400
        if not validate_amount(amount):
            return jsonify({"error": "amount must be a positive number"}), 400
        if not validate_month(month):
            return jsonify({"error": "month must be between 1 and 12"}), 400
        if not validate_year(year):
            return jsonify({"error": "year must be a 4-digit year (2000-2100)"}), 400

        # ---- Check category access ----
        from sqlalchemy import or_
        category = Category.query.filter(
            Category.id == int(category_id),
            or_(Category.user_id == None, Category.user_id == current_user.id)  # noqa: E711
        ).first()
        if not category:
            return jsonify({"error": "Category not found or not accessible"}), 404

        # Only expense categories make sense for budgets
        if category.type != "expense":
            return jsonify({"error": "Budgets can only be set for expense categories"}), 400

        # ---- Prevent duplicate budget for same category+month+year ----
        existing = Budget.query.filter_by(
            user_id     = current_user.id,
            category_id = int(category_id),
            month       = int(month),
            year        = int(year)
        ).first()
        if existing:
            return jsonify({"error": "A budget for this category and month already exists"}), 409

        budget = Budget(
            user_id     = current_user.id,
            category_id = int(category_id),
            amount      = round(float(amount), 2),
            month       = int(month),
            year        = int(year),
        )
        db.session.add(budget)
        db.session.commit()

        return jsonify({
            "message": "Budget created successfully",
            "budget":  budget.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create budget", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/budgets/<id>  — get a single budget
# ------------------------------------------------------------------ #
@budgets_bp.route("/<int:budget_id>", methods=["GET"])
@login_required
def get_budget(budget_id):
    """Return a single budget by ID (must belong to current user)."""
    try:
        budget = Budget.query.filter_by(
            id      = budget_id,
            user_id = current_user.id
        ).first()

        if not budget:
            return jsonify({"error": "Budget not found"}), 404

        return jsonify({"budget": budget.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch budget", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# PUT /api/budgets/<id>  — update a budget
# ------------------------------------------------------------------ #
@budgets_bp.route("/<int:budget_id>", methods=["PUT"])
@login_required
def update_budget(budget_id):
    """
    Update an existing budget.

    Updatable fields:
        amount : positive number
        month  : 1-12
        year   : 4-digit year
    """
    try:
        budget = Budget.query.filter_by(
            id      = budget_id,
            user_id = current_user.id
        ).first()

        if not budget:
            return jsonify({"error": "Budget not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        if "amount" in data:
            if not validate_amount(data["amount"]):
                return jsonify({"error": "amount must be a positive number"}), 400
            budget.amount = round(float(data["amount"]), 2)

        if "month" in data:
            if not validate_month(data["month"]):
                return jsonify({"error": "month must be between 1 and 12"}), 400
            budget.month = int(data["month"])

        if "year" in data:
            if not validate_year(data["year"]):
                return jsonify({"error": "year must be a 4-digit year"}), 400
            budget.year = int(data["year"])

        db.session.commit()

        return jsonify({
            "message": "Budget updated successfully",
            "budget":  budget.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update budget", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# DELETE /api/budgets/<id>  — delete a budget
# ------------------------------------------------------------------ #
@budgets_bp.route("/<int:budget_id>", methods=["DELETE"])
@login_required
def delete_budget(budget_id):
    """Delete a budget (must belong to current user)."""
    try:
        budget = Budget.query.filter_by(
            id      = budget_id,
            user_id = current_user.id
        ).first()

        if not budget:
            return jsonify({"error": "Budget not found"}), 404

        db.session.delete(budget)
        db.session.commit()

        return jsonify({"message": "Budget deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete budget", "details": str(e)}), 500
