import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from utils.validators import (
    validate_email,
    validate_date,
    validate_month,
    validate_year,
    sanitize_string,
)


def test_validate_email():
    assert validate_email("user@example.com") is True
    assert validate_email("invalid-email") is False
    assert validate_email("@domain.com") is False


def test_validate_date():
    assert validate_date("2026-11-01") is True
    assert validate_date("01-11-2026") is False
    assert validate_date("invalid") is False


def test_validate_month_and_year():
    assert validate_month(1) is True
    assert validate_month(12) is True
    assert validate_month(13) is False
    assert validate_year(2026) is True
    assert validate_year("202") is False


def test_sanitize_string():
    assert sanitize_string("  hello world  ") == "hello world"
    assert sanitize_string(None) == ""

