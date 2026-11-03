"""
utils/helpers.py
----------------
Utility / helper functions shared across the application.

These are pure functions (no Flask context needed) that perform
date arithmetic and database aggregation.
"""

import calendar
from datetime import date, timedelta


# ------------------------------------------------------------------ #
# Date range helpers
# ------------------------------------------------------------------ #

def get_month_date_range(month: int, year: int):
    """
    Return the first and last date objects for the given month/year.

    Example:
        get_month_date_range(11, 2024)
        → (date(2024, 11, 1), date(2024, 11, 30))

    Uses the calendar module so it handles leap years and 28/30/31-day
    months automatically.
    """
    first_day = date(year, month, 1)
    # monthrange returns (weekday_of_first_day, number_of_days_in_month)
    last_day_num = calendar.monthrange(year, month)[1]
    last_day  = date(year, month, last_day_num)
    return first_day, last_day


def get_last_n_months(n: int = 12):
    """
    Return a list of (month, year) tuples for the last 'n' months,
    ordered from oldest to most recent.

    Example (if today is November 2024):
        get_last_n_months(3) → [(9, 2024), (10, 2024), (11, 2024)]

    Used by the monthly report endpoint to build the trend chart.
    """
    result  = []
    today   = date.today()
    month   = today.month
    year    = today.year

    for _ in range(n):
        result.append((month, year))
        # Go one month back
        month -= 1
        if month == 0:       # wrap around from January → December
            month = 12
            year  -= 1

    # Reverse so the list goes from oldest to newest
    result.reverse()
    return result


# ------------------------------------------------------------------ #
# Budget calculation
# ------------------------------------------------------------------ #

def calculate_budget_spent(user_id: int, category_id: int, month: int, year: int) -> float:
    """
    Return the total amount spent (expense transactions) for a given
    user + category + month + year combination.

    This is the single source of truth for budget progress — called
    from both the budget model and the budget route.

    Returns 0.0 if there are no matching transactions.
    """
    # Local import prevents circular-import issues at module load time
    from extensions import db
    from models.transaction import Transaction

    start, end = get_month_date_range(month, year)

    total = (
        db.session.query(db.func.sum(Transaction.amount))
        .filter(
            Transaction.user_id     == user_id,
            Transaction.category_id == category_id,
            Transaction.type        == "expense",
            Transaction.date        >= start,
            Transaction.date        <= end,
        )
        .scalar()
    )
    return round(total or 0.0, 2)


# ------------------------------------------------------------------ #
# Currency formatting
# ------------------------------------------------------------------ #

# Mapping of currency codes to their symbols
_CURRENCY_SYMBOLS = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "CAD": "CA$",
    "AUD": "A$",
}


def format_currency(amount: float, currency: str = "INR") -> str:
    """
    Format a float amount as a human-readable currency string.

    Examples:
        format_currency(1500.5, "INR")  → "₹1,500.50"
        format_currency(99.9,   "USD")  → "$99.90"
        format_currency(200,    "XYZ")  → "XYZ 200.00"  (unknown currency)
    """
    symbol = _CURRENCY_SYMBOLS.get(currency.upper(), currency.upper() + " ")
    return f"{symbol}{amount:,.2f}"
