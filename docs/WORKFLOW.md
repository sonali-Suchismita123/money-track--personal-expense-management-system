# Application Workflows & User Journeys
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Date:** November 2026  
> **Project Type:** MCA Mini Project  

---

## 1. User Authentication & Session Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React SPA
    participant API as Flask Auth Blueprint
    participant DB as SQLite DB

    User->>Frontend: Enter Email & Password (/login)
    Frontend->>API: POST /api/auth/login {email, password}
    API->>DB: Query User by email
    DB-->>API: Return User Record
    API->>API: Verify Werkzeug Hash (PBKDF2)
    alt Password Valid
        API->>API: login_user(user, remember=True)
        API-->>Frontend: 200 OK + Set-Cookie (session, HttpOnly, SameSite=Lax)
        Frontend->>Frontend: Update AuthContext currentUser
        Frontend-->>User: Redirect to /dashboard
    else Password Invalid / User Not Found
        API-->>Frontend: 401 Unauthorized
        Frontend-->>User: Display error message
    end
```

---

## 2. Transaction Entry & Budget Impact Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Transactions UI
    participant API as Transactions API
    participant DB as SQLite DB
    participant Budget as Budget Engine

    User->>Frontend: Click "Add Transaction"
    User->>Frontend: Fill Type (Expense), Category (Food), Amount (₹450), Date
    Frontend->>API: POST /api/transactions
    API->>API: Validate input (Sanitize, amount > 0, date format)
    API->>DB: INSERT into transactions
    DB-->>API: Confirm row inserted
    API-->>Frontend: 201 Created (Transaction Object)
    Frontend->>Frontend: Refresh Transaction List
    
    Note over Frontend,Budget: When user visits Dashboard or Budgets:
    Frontend->>API: GET /api/budgets?month=11&year=2026
    API->>DB: Query budgets + SUM(transactions) for category
    DB-->>API: Aggregate spent sum
    API-->>Frontend: Returns Budget with live spent & remaining buffer
    Frontend-->>User: Update progress bar color (Green -> Yellow -> Red)
```

---

## 3. Savings Goal Deposit Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Savings UI
    participant API as Savings API
    participant DB as SQLite DB

    User->>Frontend: Click "Add Deposit Funds" on Goal Card
    User->>Frontend: Enter deposit amount (e.g., ₹2,500)
    Frontend->>API: POST /api/savings/:id/add {amount: 2500}
    API->>DB: SELECT goal WHERE id = :id AND user_id = current_user.id
    API->>API: current_amount += amount
    API->>DB: UPDATE savings_goals SET current_amount = ...
    DB-->>API: Confirm update
    API-->>Frontend: 200 OK with updated savings_goal dict
    Frontend->>Frontend: Recalculate progress_percentage & milestone badge
    Frontend-->>User: Render animated progress bar update
```

---

## 4. Analytical Reporting Workflow

1. **Dashboard Initialization:** User logs into MoneyTrack; the Dashboard simultaneously dispatches parallel asynchronous fetch requests to:
   - `/api/reports/summary` (Income, Expense, Balance)
   - `/api/reports/monthly` (Last 12-month trend)
   - `/api/reports/category` (Current month expense distribution)
   - `/api/transactions?limit=5` (Recent 5 transactions)
2. **Data Transformation & Chart Rendering:**
   - React processes categorical aggregates into Recharts `<PieChart>` with assigned color schemes.
   - Monthly cash flows are rendered as `<BarChart>` comparing side-by-side Income vs. Expense metrics.

