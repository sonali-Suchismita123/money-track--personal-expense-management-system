"""
routes/transactions.py
----------------------
Transaction CRUD blueprint.

URL prefix: /api/transactions
All routes require the user to be logged in (@login_required).

Filtering options (via query string on GET /api/transactions):
  ?type=expense
  ?category_id=3
  ?start_date=2024-01-01&end_date=2024-01-31
  ?month=11&year=2024
"""

from datetime import date, datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from extensions import db
from models.transaction import Transaction
from models.category import Category
from utils.validators import (
    validate_amount, validate_date, validate_month, validate_year,
    sanitize_string
)
from utils.helpers import get_month_date_range

transactions_bp = Blueprint("transactions", __name__, url_prefix="/api/transactions")


# ------------------------------------------------------------------ #
# GET /api/transactions  — list all transactions (with filters)
# ------------------------------------------------------------------ #
@transactions_bp.route("", methods=["GET"])
@login_required
def get_transactions():
    """
    Return a list of the current user's transactions.

    Optional query parameters:
        type        : 'income' or 'expense'
        category_id : integer
        start_date  : YYYY-MM-DD
        end_date    : YYYY-MM-DD
        month       : 1-12  (used together with year)
        year        : 4-digit year
    """
    try:
        # Start with a base query scoped to the current user
        query = Transaction.query.filter_by(user_id=current_user.id)

        # ---- Filter: type ----
        tx_type = request.args.get("type")
        if tx_type:
            if tx_type not in ("income", "expense"):
                return jsonify({"error": "type must be 'income' or 'expense'"}), 400
            query = query.filter(Transaction.type == tx_type)

        # ---- Filter: category_id ----
        cat_id = request.args.get("category_id")
        if cat_id:
            try:
                query = query.filter(Transaction.category_id == int(cat_id))
            except ValueError:
                return jsonify({"error": "category_id must be an integer"}), 400

        # ---- Filter: month + year (takes priority over start/end date) ----
        month = request.args.get("month")
        year  = request.args.get("year")
        if month and year:
            if not validate_month(month) or not validate_year(year):
                return jsonify({"error": "Invalid month or year"}), 400
            start, end = get_month_date_range(int(month), int(year))
            query = query.filter(Transaction.date >= start, Transaction.date <= end)
        else:
            # ---- Filter: start_date ----
            start_date_str = request.args.get("start_date")
            if start_date_str:
                if not validate_date(start_date_str):
                    return jsonify({"error": "start_date must be YYYY-MM-DD"}), 400
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                query = query.filter(Transaction.date >= start_date)

            # ---- Filter: end_date ----
            end_date_str = request.args.get("end_date")
            if end_date_str:
                if not validate_date(end_date_str):
                    return jsonify({"error": "end_date must be YYYY-MM-DD"}), 400
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
                query = query.filter(Transaction.date <= end_date)

        # Always return newest first
        transactions = query.order_by(Transaction.date.desc(), Transaction.id.desc()).all()

        return jsonify({
            "transactions": [t.to_dict() for t in transactions],
            "count":        len(transactions)
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch transactions", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/transactions  — create a new transaction
# ------------------------------------------------------------------ #
@transactions_bp.route("", methods=["POST"])
@login_required
def create_transaction():
    """
    Create a new transaction for the current user.

    Required JSON fields:
        amount      : positive number   (e.g. 500)
        type        : 'income' | 'expense'
        description : non-empty string  (e.g. "Lunch")
        date        : YYYY-MM-DD string (e.g. "2024-11-01")

    Optional JSON fields:
        category_id : integer
        notes       : string
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # ---- Validate required fields ----
        amount      = data.get("amount")
        tx_type     = sanitize_string(data.get("type", ""))
        description = sanitize_string(data.get("description", ""))
        date_str    = sanitize_string(data.get("date", ""))
        notes       = sanitize_string(data.get("notes", ""))
        category_id = data.get("category_id")

        if not validate_amount(amount):
            return jsonify({"error": "Amount must be a positive number"}), 400
        if tx_type not in ("income", "expense"):
            return jsonify({"error": "type must be 'income' or 'expense'"}), 400
        if not description:
            return jsonify({"error": "Description is required"}), 400
        if not validate_date(date_str):
            return jsonify({"error": "date must be in YYYY-MM-DD format"}), 400

        # ---- Validate category ownership ----
        if category_id:
            category = Category.query.get(int(category_id))
            if not category:
                return jsonify({"error": "Category not found"}), 404
            # User can use system categories (user_id is None) or their own
            if category.user_id is not None and category.user_id != current_user.id:
                return jsonify({"error": "You do not have access to this category"}), 403

        # ---- Parse date ----
        tx_date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # ---- Create transaction ----
        transaction = Transaction(
            user_id     = current_user.id,
            category_id = int(category_id) if category_id else None,
            amount      = round(float(amount), 2),
            type        = tx_type,
            description = description,
            date        = tx_date,
            notes       = notes or None,
        )
        db.session.add(transaction)
        db.session.commit()

        return jsonify({
            "message":     "Transaction created successfully",
            "transaction": transaction.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create transaction", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/transactions/<id>  — get a single transaction
# ------------------------------------------------------------------ #
@transactions_bp.route("/<int:transaction_id>", methods=["GET"])
@login_required
def get_transaction(transaction_id):
    """Return a single transaction by ID (must belong to current user)."""
    try:
        transaction = Transaction.query.filter_by(
            id      = transaction_id,
            user_id = current_user.id
        ).first()

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        return jsonify({"transaction": transaction.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch transaction", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# PUT /api/transactions/<id>  — update a transaction
# ------------------------------------------------------------------ #
@transactions_bp.route("/<int:transaction_id>", methods=["PUT"])
@login_required
def update_transaction(transaction_id):
    """
    Update an existing transaction.

    All fields are optional — only the provided fields are updated.
    The transaction must belong to the current user.
    """
    try:
        # Ensure the transaction exists and belongs to this user
        transaction = Transaction.query.filter_by(
            id      = transaction_id,
            user_id = current_user.id
        ).first()

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # ---- Update each provided field ----
        if "amount" in data:
            if not validate_amount(data["amount"]):
                return jsonify({"error": "Amount must be a positive number"}), 400
            transaction.amount = round(float(data["amount"]), 2)

        if "type" in data:
            if data["type"] not in ("income", "expense"):
                return jsonify({"error": "type must be 'income' or 'expense'"}), 400
            transaction.type = data["type"]

        if "description" in data:
            desc = sanitize_string(data["description"])
            if not desc:
                return jsonify({"error": "Description cannot be empty"}), 400
            transaction.description = desc

        if "date" in data:
            date_str = sanitize_string(data["date"])
            if not validate_date(date_str):
                return jsonify({"error": "date must be in YYYY-MM-DD format"}), 400
            transaction.date = datetime.strptime(date_str, "%Y-%m-%d").date()

        if "notes" in data:
            transaction.notes = sanitize_string(data["notes"]) or None

        if "category_id" in data:
            cat_id = data["category_id"]
            if cat_id is not None:
                category = Category.query.get(int(cat_id))
                if not category:
                    return jsonify({"error": "Category not found"}), 404
                if category.user_id is not None and category.user_id != current_user.id:
                    return jsonify({"error": "You do not have access to this category"}), 403
                transaction.category_id = int(cat_id)
            else:
                transaction.category_id = None

        db.session.commit()

        return jsonify({
            "message":     "Transaction updated successfully",
            "transaction": transaction.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update transaction", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# DELETE /api/transactions/<id>  — delete a transaction
# ------------------------------------------------------------------ #
@transactions_bp.route("/<int:transaction_id>", methods=["DELETE"])
@login_required
def delete_transaction(transaction_id):
    """Delete a transaction (must belong to current user)."""
    try:
        transaction = Transaction.query.filter_by(
            id      = transaction_id,
            user_id = current_user.id
        ).first()

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        db.session.delete(transaction)
        db.session.commit()

        return jsonify({"message": "Transaction deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete transaction", "details": str(e)}), 500
