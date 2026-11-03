# Security Policy & Implementation Architecture
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Standard:** OWASP Top 10 Security Architecture  
> **Date:** November 2026  

---

## 1. Authentication & Cryptography

### 1.1 Password Storage
- Plain-text passwords are never stored or logged.
- Passwords are encrypted using **Werkzeug's `generate_password_hash`**, which implements salted **PBKDF2-SHA256** with high iteration counts, preventing rainbow table attacks.
- Verification uses constant-time string comparison (`check_password_hash`) to defeat timing attacks.

### 1.2 Session Management
- Sessions are maintained using `Flask-Login` via cryptographically signed session cookies.
- Cookies are configured with:
  - `HttpOnly = True`: Prevents client-side scripts from reading the cookie, mitigating XSS session hijacking.
  - `SameSite = 'Lax'`: Protects against Cross-Site Request Forgery (CSRF).
  - Explicit session invalidation on `/api/auth/logout`.

---

## 2. Authorization & Data Isolation (IDOR Defense)

In Multi-User web applications, **Insecure Direct Object Reference (IDOR)** is a primary vulnerability. MoneyTrack defends against IDOR at the database query level:
- Every protected route checks `@login_required`.
- Records are filtered strictly by `current_user.id`. For example:
  ```python
  query = Transaction.query.filter_by(user_id=current_user.id)
  ```
- No user can view, edit, or delete transactions, budgets, or savings goals belonging to another account.

---

## 3. Input Validation & Injection Defenses

### 3.1 SQL Injection Prevention
- All database operations utilize **SQLAlchemy ORM** parameter binding.
- Raw SQL query concatenation is prohibited, neutralizing SQL injection vectors.

### 3.2 Cross-Site Scripting (XSS)
- React inherently escapes variable interpolations in JSX (`{tx.description}`).
- Backend sanitizes user-provided strings through `sanitize_string` before storage.

### 3.3 Strict Numerical & Type Validation
- `validate_amount`: Ensures transaction and budget figures are positive numerical values.
- `validate_month` and `validate_year`: Validates month range (1–12) and 4-digit years.
- `validate_date`: Enforces ISO 8601 `YYYY-MM-DD` formatting.

