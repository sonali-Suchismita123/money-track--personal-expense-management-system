# Software Test Plan (STP)
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Standard:** IEEE 829-2008 Standard for Software and System Test Documentation  
> **Date:** November 2026  

---

## 1. Objectives & Scope

The objective of the test plan is to define the testing strategy, test levels, tools, and pass/fail criteria to verify that MoneyTrack satisfies all functional requirements (FRs) and non-functional requirements (NFRs) outlined in the [`SRS.md`](SRS.md).

### 1.1 In-Scope Testing
- **Unit Testing:** Input validators (`validators.py`), helper functions (`helpers.py`), model computed properties (`progress_percentage`, `get_spent`).
- **API Endpoint Integration Testing:** Flask test client issuing REST calls against SQLite memory database.
- **Authentication & Security Testing:** Session persistence, unauthorized redirects, IDOR isolation.
- **UI/Build Verification:** React production build compilation and bundle verification.

---

## 2. Test Approach & Architecture

Testing uses **Pytest** with isolated in-memory SQLite fixtures (`sqlite:///:memory:`):
- Every test runs in an independent database sandbox.
- Fixtures create fresh schema and default system categories before each test.
- Tests exercise both happy paths and edge cases (e.g. invalid dates, negative amounts, duplicate emails).

---

## 3. Test Cases Specification Matrix

| Test Suite | File | Test Cases | Objective |
|---|---|---|---|
| **Authentication** | `test_auth.py` | 6 tests | Validate user registration, duplicate email rejection, login, session retention, and logout. |
| **Transactions** | `test_transactions.py` | 3 tests | Validate income and expense creation, querying, and deletion. |
| **Categories** | `test_categories.py` | 2 tests | Validate default system category visibility and custom category creation. |
| **Budgets** | `test_budgets.py` | 1 test | Validate monthly budget creation, limit validation, and live spending calculation. |
| **Savings Goals**| `test_savings.py` | 1 test | Validate goal creation, deadline tracking, and fund deposits. |
| **Reports** | `test_reports.py` | 1 test | Validate monthly income, expense, and net balance aggregation math. |
| **Validators** | `test_validators.py` | 4 tests | Unit test email regex, date formatting, month/year boundaries, and string sanitization. |

---

## 4. Pass / Fail Criteria

- **Pass Criteria:** 100% of automated test cases must pass without unhandled exceptions.
- **Coverage Goal:** Minimum 85% statement coverage across backend route blueprints and utility modules.
- **Build Goal:** Frontend compilation via `react-scripts build` must exit with code 0.

