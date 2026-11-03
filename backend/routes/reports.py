"""
routes/reports.py
-----------------
Financial reports blueprint.

URL prefix: /api/reports
All routes require login.

Endpoints:
  GET /api/reports/summary  — total income/expense/balance for a month+year
  GET /api/reports/monthly  — last 12 months breakdown
  GET /api/reports/category — spending by category for a month+year
  GET /api/reports/trends   — weekly spending trends for the current month
"""

from datetime import date, timedelta, datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from extensions import db
from models.transaction import Transaction
from models.category import Category
from utils.validators import validate_month, validate_year
from utils.helpers import get_month_date_range, get_last_n_months

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")


# ------------------------------------------------------------------ #
# GET /api/reports/summary
# ------------------------------------------------------------------ #
@reports_bp.route("/summary", methods=["GET"])
@login_required
def summary():
    """
    Return total income, total expense, balance, and transaction count
    for a given month and year.

    Query parameters:
        month : 1-12       (defaults to current month)
        year  : 4-digit    (defaults to current year)
    """
    try:
        today = date.today()
        month = request.args.get("month", today.month)
        year  = request.args.get("year",  today.year)

        if not validate_month(month) or not validate_year(year):
            return jsonify({"error": "Invalid month or year"}), 400

        month, year = int(month), int(year)
        start, end  = get_month_date_range(month, year)

        # Base filter shared by income and expense queries
        base = (
            db.session.query(Transaction)
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.date    >= start,
                Transaction.date    <= end,
            )
        )

        # Sum income transactions
        total_income = (
            db.session.query(db.func.sum(Transaction.amount))
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.type    == "income",
                Transaction.date    >= start,
                Transaction.date    <= end,
            )
            .scalar() or 0.0
        )

        # Sum expense transactions
        total_expense = (
            db.session.query(db.func.sum(Transaction.amount))
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.type    == "expense",
                Transaction.date    >= start,
                Transaction.date    <= end,
            )
            .scalar() or 0.0
        )

        total_income  = round(total_income,  2)
        total_expense = round(total_expense, 2)
        balance       = round(total_income - total_expense, 2)
        tx_count      = base.count()

        return jsonify({
            "month":             month,
            "year":              year,
            "total_income":      total_income,
            "total_expense":     total_expense,
            "balance":           balance,
            "transaction_count": tx_count,
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to generate summary", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/reports/monthly
# ------------------------------------------------------------------ #
@reports_bp.route("/monthly", methods=["GET"])
@login_required
def monthly():
    """
    Return income and expense totals for each of the last 12 months.

    Response shape:
        [
            { "month": 12, "year": 2023, "income": 50000, "expense": 30000, "balance": 20000 },
            ...
        ]

    This data is used to render the main trend chart on the dashboard.
    """
    try:
        result = []

        # get_last_n_months returns list of (month, year) tuples, oldest first
        for month, year in get_last_n_months(12):
            start, end = get_month_date_range(month, year)

            income = (
                db.session.query(db.func.sum(Transaction.amount))
                .filter(
                    Transaction.user_id == current_user.id,
                    Transaction.type    == "income",
                    Transaction.date    >= start,
                    Transaction.date    <= end,
                )
                .scalar() or 0.0
            )

            expense = (
                db.session.query(db.func.sum(Transaction.amount))
                .filter(
                    Transaction.user_id == current_user.id,
                    Transaction.type    == "expense",
                    Transaction.date    >= start,
                    Transaction.date    <= end,
                )
                .scalar() or 0.0
            )

            income  = round(income,  2)
            expense = round(expense, 2)

            # Build a short month label (e.g. "Nov 2024")
            month_label = date(year, month, 1).strftime("%b %Y")

            result.append({
                "month":       month,
                "year":        year,
                "month_label": month_label,
                "income":      income,
                "expense":     expense,
                "balance":     round(income - expense, 2),
            })

        return jsonify({"monthly_data": result}), 200

    except Exception as e:
        return jsonify({"error": "Failed to generate monthly report", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/reports/category
# ------------------------------------------------------------------ #
@reports_bp.route("/category", methods=["GET"])
@login_required
def category_report():
    """
    Return expense breakdown by category for a given month/year.

    Query parameters:
        month : 1-12       (defaults to current month)
        year  : 4-digit    (defaults to current year)
        type  : 'income' | 'expense'  (defaults to 'expense')

    Response shape:
        [
            {
                "category_id": 2,
                "category_name": "Food",
                "icon": "🍔",
                "color": "#FF5733",
                "amount": 8500.0,
                "percentage": 34.0,
                "transaction_count": 12
            },
            ...
        ]
    """
    try:
        today    = date.today()
        month    = request.args.get("month", today.month)
        year     = request.args.get("year",  today.year)
        tx_type  = request.args.get("type",  "expense")

        if not validate_month(month) or not validate_year(year):
            return jsonify({"error": "Invalid month or year"}), 400
        if tx_type not in ("income", "expense"):
            return jsonify({"error": "type must be 'income' or 'expense'"}), 400

        month, year = int(month), int(year)
        start, end  = get_month_date_range(month, year)

        # Group transactions by category and sum amounts
        rows = (
            db.session.query(
                Transaction.category_id,
                db.func.sum(Transaction.amount).label("total"),
                db.func.count(Transaction.id).label("count"),
            )
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.type    == tx_type,
                Transaction.date    >= start,
                Transaction.date    <= end,
            )
            .group_by(Transaction.category_id)
            .all()
        )

        # Grand total for percentage calculation
        grand_total = sum(row.total for row in rows) or 1  # avoid division by zero

        result = []
        for row in sorted(rows, key=lambda r: r.total, reverse=True):
            # Look up category info
            category = Category.query.get(row.category_id) if row.category_id else None

            result.append({
                "category_id":        row.category_id,
                "category_name":      category.name  if category else "Uncategorised",
                "icon":               category.icon  if category else "📂",
                "color":              category.color if category else "#6c757d",
                "amount":             round(row.total, 2),
                "percentage":         round((row.total / grand_total) * 100, 2),
                "transaction_count":  row.count,
            })

        return jsonify({
            "month":         month,
            "year":          year,
            "type":          tx_type,
            "category_data": result,
            "total":         round(grand_total, 2),
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to generate category report", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/reports/trends
# ------------------------------------------------------------------ #
@reports_bp.route("/trends", methods=["GET"])
@login_required
def trends():
    """
    Return weekly spending trends for the current month.

    Divides the current month into up to 5 week-long buckets and sums
    the income and expense for each bucket.

    Response shape:
        {
            "weeks": [
                { "week": 1, "label": "Nov 1–7",  "income": 5000, "expense": 3000 },
                { "week": 2, "label": "Nov 8–14", "income": 4000, "expense": 2500 },
                ...
            ]
        }

    Optional query parameters:
        month : 1-12       (defaults to current month)
        year  : 4-digit    (defaults to current year)
    """
    try:
        today = date.today()
        month = request.args.get("month", today.month)
        year  = request.args.get("year",  today.year)

        if not validate_month(month) or not validate_year(year):
            return jsonify({"error": "Invalid month or year"}), 400

        month, year = int(month), int(year)
        start, end  = get_month_date_range(month, year)

        # Fetch all transactions in the month once (more efficient than per-week queries)
        transactions = (
            Transaction.query
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.date    >= start,
                Transaction.date    <= end,
            )
            .all()
        )

        # Build weekly buckets: [week_start, week_end]
        weeks = []
        week_start = start
        while week_start <= end:
            week_end = min(week_start + timedelta(days=6), end)
            weeks.append((week_start, week_end))
            week_start = week_end + timedelta(days=1)

        result = []
        for i, (ws, we) in enumerate(weeks, start=1):
            # Filter transactions that fall within this week
            week_txs = [t for t in transactions if ws <= t.date <= we]

            income  = sum(t.amount for t in week_txs if t.type == "income")
            expense = sum(t.amount for t in week_txs if t.type == "expense")

            # Build a human-readable label like "Nov 1–7"
            label = f"{ws.strftime('%b %-d')}–{we.day}" if ws.month == we.month \
                    else f"{ws.strftime('%b %-d')}–{we.strftime('%b %-d')}"

            # Windows doesn't support %-d — use a safe fallback
            label = f"{ws.strftime('%b')} {ws.day}–{we.day}"

            result.append({
                "week":    i,
                "label":   label,
                "income":  round(income,  2),
                "expense": round(expense, 2),
                "balance": round(income - expense, 2),
            })

        # Also include the overall month income vs expense trend
        total_income  = sum(t.amount for t in transactions if t.type == "income")
        total_expense = sum(t.amount for t in transactions if t.type == "expense")

        return jsonify({
            "month":         month,
            "year":          year,
            "weeks":         result,
            "total_income":  round(total_income,  2),
            "total_expense": round(total_expense, 2),
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to generate trends report", "details": str(e)}), 500
