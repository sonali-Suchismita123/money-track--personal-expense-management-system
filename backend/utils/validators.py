"""
utils/validators.py
-------------------
Input validation helpers used across all route files.

Each function takes a raw input value and returns True/False (or a cleaned
string for sanitize_string).  Routes call these before touching the database.
"""

import re
from datetime import datetime


# ------------------------------------------------------------------ #
# Email
# ------------------------------------------------------------------ #

def validate_email(email: str) -> bool:
    """
    Return True if 'email' matches a basic but reasonable email pattern.

    The regex checks for:
      - One or more non-whitespace characters before the @
      - A domain with at least one dot
      - A TLD of 2–10 characters
    """
    if not email or not isinstance(email, str):
        return False
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]{2,10}$"
    return bool(re.match(pattern, email.strip()))


# ------------------------------------------------------------------ #
# Amount
# ------------------------------------------------------------------ #

def validate_amount(amount) -> bool:
    """
    Return True if 'amount' is a finite, strictly positive number.

    Accepts int or float inputs (e.g. from JSON body).
    """
    try:
        val = float(amount)
        return val > 0 and not (val != val)   # val != val catches NaN
    except (TypeError, ValueError):
        return False


# ------------------------------------------------------------------ #
# Date string (YYYY-MM-DD)
# ------------------------------------------------------------------ #

def validate_date(date_str: str) -> bool:
    """
    Return True if 'date_str' is a valid date in 'YYYY-MM-DD' format.

    Examples:
        validate_date("2024-11-01")  → True
        validate_date("2024-13-01")  → False  (month 13 doesn't exist)
        validate_date("01-11-2024")  → False  (wrong format)
    """
    if not date_str or not isinstance(date_str, str):
        return False
    try:
        datetime.strptime(date_str.strip(), "%Y-%m-%d")
        return True
    except ValueError:
        return False


# ------------------------------------------------------------------ #
# Month / Year
# ------------------------------------------------------------------ #

def validate_month(month) -> bool:
    """
    Return True if 'month' is an integer between 1 and 12 (inclusive).

    Accepts both int and string inputs so query-string params work too.
    """
    try:
        m = int(month)
        return 1 <= m <= 12
    except (TypeError, ValueError):
        return False


def validate_year(year) -> bool:
    """
    Return True if 'year' is an integer between 2000 and 2100 (inclusive).

    Covers all practical use cases for a personal finance app.
    """
    try:
        y = int(year)
        return 2000 <= y <= 2100
    except (TypeError, ValueError):
        return False


# ------------------------------------------------------------------ #
# String sanitisation
# ------------------------------------------------------------------ #

def sanitize_string(s: str) -> str:
    """
    Strip leading/trailing whitespace from a string.

    Returns an empty string if the input is not a string.
    This prevents accidental whitespace-only values from being stored.
    """
    if not isinstance(s, str):
        return ""
    return s.strip()
