# Test Execution Report
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Test Framework:** Pytest 9.2.0 (with in-memory SQLite isolation)  
> **Date:** November 2026  
> **Status:** Passed (100% Pass Rate)  

---

## 1. Test Execution Summary

| Metric | Value |
|---|---|
| **Total Test Cases** | 18 |
| **Passed** | 18 |
| **Failed** | 0 |
| **Skipped** | 0 |
| **Pass Rate** | **100%** |
| **Execution Duration** | 9.78s |
| **Database Environment** | In-Memory SQLite (`sqlite:///:memory:`) |

---

## 2. Test Case Breakdown

### 2.1 Authentication Tests (`test_auth.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_register_success` | Valid registration returns 201 and user object (no password hash) | **PASSED** |
| `test_register_duplicate_email` | Duplicate email returns 409 Conflict | **PASSED** |
| `test_login_success` | Valid email/password returns 200 and establishes session | **PASSED** |
| `test_login_invalid_password` | Incorrect password returns 401 Unauthorized | **PASSED** |
| `test_me_authenticated` | `/api/auth/me` returns current user profile | **PASSED** |
| `test_logout` | `/api/auth/logout` clears session and protects routes | **PASSED** |

### 2.2 Transaction Tests (`test_transactions.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_create_transaction` | Create expense entry with category | **PASSED** |
| `test_get_transactions` | Fetch user transactions list | **PASSED** |
| `test_delete_transaction` | Remove transaction by ID and verify 404 | **PASSED** |

### 2.3 Category Tests (`test_categories.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_get_categories` | Retrieve seeded system categories | **PASSED** |
| `test_create_custom_category` | Create custom user category with icon & color | **PASSED** |

### 2.4 Budget Tests (`test_budgets.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_create_and_get_budget` | Set monthly budget and verify computed `spent` is 0.0 | **PASSED** |

### 2.5 Savings Goals Tests (`test_savings.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_savings_lifecycle` | Create savings goal and deposit additional funds | **PASSED** |

### 2.6 Report Tests (`test_reports.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_reports_summary` | Verify income, expense, and balance aggregation | **PASSED** |

### 2.7 Validator Unit Tests (`test_validators.py`)
| Test Case | Description | Result |
|---|---|---|
| `test_validate_email` | Validate valid and invalid email strings | **PASSED** |
| `test_validate_date` | Validate YYYY-MM-DD date formats | **PASSED** |
| `test_validate_month_and_year` | Verify boundary checks on month (1-12) and year | **PASSED** |
| `test_sanitize_string` | Whitespace stripping and null-handling | **PASSED** |

---

## 3. Defects Identified and Resolved

1. **Defect 01 — Savings Goal Initial Amount Ignored:**
   - *Problem:* `POST /api/savings` was hardcoding `current_amount = 0.0`, ignoring initial deposit values passed in request payload.
   - *Fix:* Added parsing and assignment for `current_amount` from payload with positive value validation.
2. **Defect 02 — Missing Dedicated Deposit Endpoint:**
   - *Problem:* `api.js` invoked `POST /api/savings/<id>/add`, but backend only had `PUT /api/savings/<id>`.
   - *Fix:* Added `POST /api/savings/<int:goal_id>/add` to `backend/routes/savings.py` to deposit funds directly.
3. **Defect 03 — Missing Password Change Endpoint:**
   - *Problem:* Profile page required password updating with current password verification.
   - *Fix:* Added `PUT /api/auth/change-password` endpoint to `backend/routes/auth.py`.

