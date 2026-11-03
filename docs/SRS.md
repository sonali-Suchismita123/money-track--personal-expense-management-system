# Software Requirements Specification (SRS)
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Standard:** IEEE 830-1998 (Software Requirements Specifications)  
> **Date:** November 2026  
> **Author:** Project Developer  
> **Status:** Approved  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [System Constraints](#6-system-constraints)
7. [Use Cases](#7-use-cases)
8. [User Stories](#8-user-stories)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the functional and non-functional requirements for the MoneyTrack – Personal Expense & Budget Management System. This document is intended for use by the development team, academic evaluators, and stakeholders involved in the review and verification of the system.

The SRS serves as the authoritative reference for:
- What the system must do (functional requirements)
- How well the system must perform (non-functional requirements)
- Constraints on the system design and implementation
- The interface between the system and its environment

### 1.2 Scope

**System Name:** MoneyTrack – Personal Expense & Budget Management System  
**Tagline:** Track Your Money, Manage Your Future  
**Type:** MCA Mini Project – Full Stack Web Application  

MoneyTrack is a web-based personal finance management application that allows registered users to:
- Record and manage income and expense transactions
- Create and monitor category-wise monthly budgets
- Set and track savings goals
- View analytical reports and charts

The system consists of:
- A Python/Flask REST API backend with SQLite database
- A React.js single-page application frontend
- Session-based user authentication

The system is **not** intended to:
- Process real financial payments or bank transfers
- Integrate with banking systems or payment gateways
- Provide financial advice or investment recommendations

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **ERD** | Entity-Relationship Diagram |
| **Flask** | Python micro web framework |
| **FR** | Functional Requirement |
| **HTTP** | HyperText Transfer Protocol |
| **JSON** | JavaScript Object Notation |
| **MCA** | Master of Computer Applications |
| **MVP** | Minimum Viable Product |
| **NFR** | Non-Functional Requirement |
| **ORM** | Object-Relational Mapping |
| **PBKDF2** | Password-Based Key Derivation Function 2 |
| **React** | JavaScript library for building user interfaces |
| **REST** | Representational State Transfer |
| **SPA** | Single Page Application |
| **SQLite** | Lightweight, file-based relational database |
| **SRS** | Software Requirements Specification |
| **UC** | Use Case |
| **UI** | User Interface |
| **URL** | Uniform Resource Locator |
| **US** | User Story |
| **XSS** | Cross-Site Scripting |
| **CSRF** | Cross-Site Request Forgery |
| **OWASP** | Open Web Application Security Project |

### 1.4 References

- IEEE 830-1998: Recommended Practice for Software Requirements Specifications
- OWASP Top 10 Web Application Security Risks (2021)
- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://reactjs.org/docs/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- REST API Design Best Practices

### 1.5 Overview

This document is organized as follows:
- **Section 2** describes the overall product including its perspective, functions, user classes, operating environment, and constraints.
- **Section 3** specifies all functional requirements (FR-001 to FR-030).
- **Section 4** specifies all non-functional requirements (NFR-001 to NFR-015).
- **Section 5** describes external interface requirements.
- **Section 6** lists system constraints.
- **Section 7** presents detailed use cases (UC-001 to UC-010).
- **Section 8** lists all user stories (US-001 to US-020).

---

## 2. Overall Description

### 2.1 Product Perspective

MoneyTrack is a standalone web application developed as part of the MCA curriculum. It is a new, self-contained system that does not replace or integrate with any existing financial system. The application follows a classic 3-tier architecture:

```
[User Browser] <--HTTP--> [Flask REST API] <--SQLAlchemy--> [SQLite Database]
     (React SPA)               (Backend)                      (Data Layer)
```

The system interfaces with:
- Web browsers (Chrome, Firefox, Edge) through a React frontend
- The server-side Flask application via RESTful HTTP/JSON calls
- An SQLite database file stored on the server filesystem

### 2.2 Product Functions

At a high level, MoneyTrack performs the following primary functions:

1. **User Account Management** – Registration, authentication, and profile management
2. **Transaction Management** – Full CRUD operations on income and expense records
3. **Category Management** – Customizable categories for organizing transactions
4. **Budget Management** – Monthly budget creation and real-time utilization tracking
5. **Savings Goal Tracking** – Goal definition, fund contribution, and progress visualization
6. **Reporting & Analytics** – Monthly summaries, category breakdowns, and charts

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Level | Primary Tasks |
|------------|-------------|-----------------|---------------|
| **End User (Standard)** | Individual who registers and uses the app to track finances | Low to High | All features |
| **Administrator (Developer)** | The developer maintaining and deploying the system | High | Database management, deployment, troubleshooting |

For the scope of this project, both classes are represented by the same interface — there is no separate admin panel.

### 2.4 Operating Environment

| Component | Environment |
|-----------|-------------|
| **Operating System** | Windows 10/11, macOS 10.15+, Ubuntu 20.04+ |
| **Web Browser** | Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+ |
| **Backend Runtime** | Python 3.9+ |
| **Frontend Runtime** | Node.js 16+ (for development build) |
| **Database** | SQLite 3.x (bundled with Python) |
| **Network** | Localhost (127.0.0.1); LAN accessible |
| **Screen Resolution** | 1280×720 minimum recommended |

### 2.5 Design and Implementation Constraints

- The project must be implemented using Python/Flask and React.js as mandated by the academic syllabus
- SQLite must be used as the database to avoid external server dependencies
- The application must run without paid third-party services
- All dependencies must be open-source and freely available
- The backend API must be RESTful and return JSON responses
- Password storage must use industry-standard cryptographic hashing

### 2.6 Assumptions and Dependencies

**Assumptions:**
- The host machine has Python 3.9+ and Node.js 16+ installed
- The user has a compatible modern web browser
- The system clock is accurate on the host machine
- A single instance of the application runs at a time on localhost

**Dependencies:**
- Flask 2.3.x and its ecosystem (Flask-SQLAlchemy, Flask-Login, Flask-CORS)
- React 18.x and its ecosystem (React Router, Axios, Chart.js)
- Werkzeug (for password hashing)
- SQLAlchemy 2.x (ORM layer)

---

## 3. Functional Requirements

> Each requirement includes an ID, title, description, priority, and acceptance criteria.

### 3.1 Authentication Module

#### FR-001: User Registration
- **Description:** The system shall allow a new user to register by providing a full name, unique username, valid email address, and password.
- **Priority:** High
- **Inputs:** full_name, username, email, password
- **Outputs:** New user record created; user logged in and redirected to dashboard
- **Acceptance Criteria:**
  - Email must match standard email format (RFC 5322)
  - Username must be 3–50 characters, alphanumeric with underscores
  - Password must be at least 8 characters
  - Duplicate email or username returns HTTP 409 with descriptive error
  - Password is stored as PBKDF2-SHA256 hash

#### FR-002: User Login
- **Description:** The system shall authenticate a registered user using their email and password.
- **Priority:** High
- **Inputs:** email, password
- **Outputs:** Authenticated session created; user redirected to dashboard
- **Acceptance Criteria:**
  - Invalid credentials return HTTP 401 with generic error message (no user enumeration)
  - Successful login creates a server-side session
  - Session persists across page refreshes

#### FR-003: User Logout
- **Description:** The system shall terminate the authenticated session when the user chooses to log out.
- **Priority:** High
- **Outputs:** Session destroyed; user redirected to login page
- **Acceptance Criteria:**
  - After logout, accessing protected routes redirects to login
  - Session cookie is cleared

#### FR-004: Protected Route Access
- **Description:** All routes other than login and registration shall require an authenticated session.
- **Priority:** High
- **Acceptance Criteria:**
  - Unauthenticated API requests return HTTP 401
  - Frontend protected routes redirect to /login

#### FR-005: Profile Update
- **Description:** Authenticated users shall be able to update their full name, currency preference.
- **Priority:** Medium
- **Inputs:** full_name, currency
- **Outputs:** Updated user record in database
- **Acceptance Criteria:**
  - Email and username cannot be changed after registration
  - Changes reflect immediately in the UI

---

### 3.2 Transaction Module

#### FR-006: Add Transaction
- **Description:** Authenticated users shall be able to add a new financial transaction.
- **Priority:** High
- **Inputs:** amount (positive decimal), type (income/expense), category_id, date, description (optional)
- **Outputs:** Transaction record stored in database; reflected in dashboard totals
- **Acceptance Criteria:**
  - Amount must be > 0 and ≤ 99,999,999.99
  - Category must belong to the authenticated user or be a default category
  - Date defaults to current date if not provided
  - Description is optional, max 255 characters

#### FR-007: View Transactions List
- **Description:** Users shall be able to view a paginated, filterable list of their transactions.
- **Priority:** High
- **Inputs (filters):** date_from, date_to, category_id, type
- **Outputs:** List of transactions sorted by date descending
- **Acceptance Criteria:**
  - Only the logged-in user's transactions are shown
  - Transactions display: date, category, description, amount, type
  - Supports filtering by date range, category, and type

#### FR-008: Edit Transaction
- **Description:** Users shall be able to modify any field of an existing transaction.
- **Priority:** High
- **Inputs:** transaction_id, any subset of (amount, type, category_id, date, description)
- **Outputs:** Updated transaction record
- **Acceptance Criteria:**
  - Users can only edit their own transactions (returns 403 otherwise)
  - All validation rules from FR-006 apply
  - Dashboard totals update immediately after edit

#### FR-009: Delete Transaction
- **Description:** Users shall be able to permanently delete a transaction.
- **Priority:** High
- **Inputs:** transaction_id
- **Outputs:** Transaction removed from database; totals recalculated
- **Acceptance Criteria:**
  - Requires confirmation dialog in the UI
  - Returns 404 if transaction does not exist
  - Returns 403 if transaction belongs to another user

#### FR-010: Transaction Type Classification
- **Description:** Every transaction must be classified as either 'income' or 'expense'.
- **Priority:** High
- **Acceptance Criteria:**
  - API rejects any value other than 'income' or 'expense'
  - UI provides radio buttons or toggle for selection

---

### 3.3 Category Module

#### FR-011: View Default Categories
- **Description:** The system shall provide a set of pre-seeded default categories available to all users.
- **Priority:** High
- **Default Expense Categories:** Food & Dining, Transportation, Shopping, Entertainment, Health & Medical, Utilities, Education, Rent, Personal Care, Other Expense
- **Default Income Categories:** Salary, Freelance, Business, Investment Returns, Gift, Other Income
- **Acceptance Criteria:**
  - Default categories are available to all users without creation
  - Default categories cannot be deleted by users

#### FR-012: Create Custom Category
- **Description:** Users shall be able to create custom categories with a name, type, icon, and color.
- **Priority:** Medium
- **Inputs:** name, type (income/expense), icon (emoji or icon code), color (hex code)
- **Outputs:** New category record linked to the user
- **Acceptance Criteria:**
  - Category name: 2–50 characters
  - Category names must be unique per user per type
  - Icon and color fields are optional (defaults provided)

#### FR-013: Edit Custom Category
- **Description:** Users shall be able to modify their custom categories.
- **Priority:** Medium
- **Acceptance Criteria:**
  - Default categories (user_id = NULL) cannot be edited
  - Category name uniqueness validation applies

#### FR-014: Delete Custom Category
- **Description:** Users shall be able to delete custom categories that have no associated transactions.
- **Priority:** Medium
- **Acceptance Criteria:**
  - Categories with associated transactions cannot be deleted
  - System returns descriptive error message when deletion is blocked

---

### 3.4 Budget Module

#### FR-015: Create Budget
- **Description:** Users shall be able to create a monthly budget for any expense category.
- **Priority:** High
- **Inputs:** category_id, amount, month (1-12), year
- **Outputs:** Budget record stored
- **Acceptance Criteria:**
  - Only expense categories can have budgets
  - One budget per category per month per user
  - Amount must be > 0

#### FR-016: View Budget Dashboard
- **Description:** Users shall see all active budgets with current spending vs. limit visualized as progress bars.
- **Priority:** High
- **Outputs:** List of budgets with: budget_limit, amount_spent, percentage, status
- **Acceptance Criteria:**
  - Amount spent is dynamically calculated from transactions
  - Percentage ≥ 80% shown in yellow/warning state
  - Percentage ≥ 100% shown in red/danger state
  - Users can filter budgets by month/year

#### FR-017: Edit Budget
- **Description:** Users shall be able to update the budget amount for an existing budget entry.
- **Priority:** Medium
- **Acceptance Criteria:**
  - Only the amount field can be changed (not category or month/year)
  - Validation: amount > 0

#### FR-018: Delete Budget
- **Description:** Users shall be able to delete a budget entry.
- **Priority:** Medium
- **Acceptance Criteria:**
  - Only the budget record is deleted; associated transactions are NOT deleted
  - Confirmation required in UI

#### FR-019: Budget Utilization Calculation
- **Description:** The system shall dynamically calculate budget utilization from actual transactions.
- **Priority:** High
- **Acceptance Criteria:**
  - Utilization = SUM of transaction amounts for the given category, month, year, and user
  - Calculation is real-time (computed at query time, not stored)

---

### 3.5 Savings Goals Module

#### FR-020: Create Savings Goal
- **Description:** Users shall be able to create a savings goal with a title, target amount, and optional deadline.
- **Priority:** High
- **Inputs:** title, target_amount, deadline (optional)
- **Outputs:** Savings goal record with current_amount = 0
- **Acceptance Criteria:**
  - Title: 3–100 characters
  - Target amount > 0
  - Deadline must be a future date if provided

#### FR-021: View Savings Goals
- **Description:** Users shall see all their savings goals with progress information.
- **Priority:** High
- **Outputs:** Each goal shows: title, target_amount, current_amount, percentage, days_remaining
- **Acceptance Criteria:**
  - Completed goals (current_amount ≥ target_amount) shown with "Completed" badge
  - Progress bar fills from 0% to 100%

#### FR-022: Update Savings Progress
- **Description:** Users shall be able to add an amount to a savings goal's current amount.
- **Priority:** High
- **Inputs:** savings_id, amount_to_add
- **Outputs:** Updated current_amount
- **Acceptance Criteria:**
  - amount_to_add must be > 0
  - current_amount cannot exceed target_amount (capped at target)

#### FR-023: Edit Savings Goal
- **Description:** Users shall be able to edit the title, target amount, and deadline of a savings goal.
- **Priority:** Medium
- **Acceptance Criteria:**
  - current_amount field is not editable directly (only through FR-022)

#### FR-024: Delete Savings Goal
- **Description:** Users shall be able to delete a savings goal.
- **Priority:** Medium
- **Acceptance Criteria:**
  - Confirmation required; data is permanently deleted

---

### 3.6 Reports Module

#### FR-025: Monthly Summary Report
- **Description:** The system shall generate a summary of total income, total expense, and net savings for a given month and year.
- **Priority:** High
- **Inputs:** month, year
- **Outputs:** { total_income, total_expense, net_savings, transaction_count }
- **Acceptance Criteria:**
  - Net savings = total_income - total_expense
  - Data reflects only the logged-in user's transactions

#### FR-026: Category-wise Expense Report
- **Description:** The system shall generate a breakdown of expenses by category for a given period.
- **Priority:** High
- **Outputs:** List of { category_name, total_amount, percentage_of_total }
- **Acceptance Criteria:**
  - Only expense transactions are included
  - Sorted by total_amount descending

#### FR-027: Dashboard Summary
- **Description:** The dashboard shall display at-a-glance financial summary for the current month.
- **Priority:** High
- **Outputs:** Current month income, current month expenses, net balance, savings goal count
- **Acceptance Criteria:**
  - Data updates immediately after any new transaction is added
  - Displays data for the current calendar month

#### FR-028: Income vs. Expense Trend
- **Description:** The system shall provide monthly income vs. expense comparison data for the last 6 months.
- **Priority:** Medium
- **Outputs:** Array of { month, year, total_income, total_expense } for last 6 months
- **Acceptance Criteria:**
  - Months with zero transactions still appear with 0 values
  - Used to render a bar chart in the UI

#### FR-029: Category Spending Chart Data
- **Description:** The API shall provide category-wise spending data suitable for rendering a pie chart.
- **Priority:** Medium
- **Outputs:** Array of { category_name, color, total_amount }

#### FR-030: Transaction Search
- **Description:** Users shall be able to search transactions by description keyword.
- **Priority:** Low
- **Inputs:** search_query string
- **Outputs:** Filtered list of transactions matching the keyword
- **Acceptance Criteria:**
  - Case-insensitive search on the description field
  - Returns empty array (not error) if no matches found

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-001: Response Time
- **Description:** The system shall respond to API requests within acceptable time limits.
- **Specification:**
  - Standard CRUD operations: ≤ 500ms under normal load
  - Report generation queries: ≤ 2 seconds
  - Page initial load: ≤ 3 seconds on localhost
- **Measurement:** Browser DevTools Network tab

#### NFR-002: Database Query Performance
- **Description:** Database queries shall be optimized using indexes and efficient ORM queries.
- **Specification:**
  - Indexed columns: user_id on transactions, budgets, savings_goals; category_id on transactions
  - No N+1 query patterns in report generation
  - SQLite WAL mode enabled for better concurrent read performance

---

### 4.2 Security Requirements

#### NFR-003: Authentication Security
- **Description:** The system shall enforce secure authentication practices.
- **Specification:**
  - Passwords hashed using PBKDF2-SHA256 with salt (Werkzeug)
  - Session tokens stored server-side (Flask-Login)
  - Session expiration after 24 hours of inactivity
  - HTTP-only and Secure flags on session cookies

#### NFR-004: Authorization
- **Description:** Users shall only access their own data.
- **Specification:**
  - Every database query filters by the authenticated user's ID
  - API returns HTTP 403 (Forbidden) for cross-user access attempts
  - No object-level authorization bypass possible through ID enumeration

#### NFR-005: Input Validation & Sanitization
- **Description:** All user inputs shall be validated and sanitized before processing.
- **Specification:**
  - Backend validates all API inputs regardless of frontend validation
  - SQL injection prevented via SQLAlchemy parameterized queries (ORM)
  - XSS prevented via React's built-in JSX escaping

#### NFR-006: CSRF Protection
- **Description:** The system shall protect against Cross-Site Request Forgery attacks.
- **Specification:**
  - Flask-WTF CSRF tokens or CORS restriction to localhost origin
  - API accepts requests only from the registered frontend origin

---

### 4.3 Usability Requirements

#### NFR-007: Learnability
- **Description:** A new user shall be able to add their first transaction within 2 minutes of registration.
- **Specification:**
  - Navigation menu clearly labeled
  - Form fields have placeholder text and labels
  - Error messages in plain English (not technical codes)

#### NFR-008: Accessibility
- **Description:** The UI shall be usable by users with basic digital literacy.
- **Specification:**
  - Minimum font size: 14px
  - Sufficient color contrast (WCAG 2.1 AA level for text)
  - Form validation errors displayed inline next to the relevant field
  - Responsive layout for screen widths ≥ 768px

#### NFR-009: Consistency
- **Description:** UI components shall maintain consistent design patterns throughout the application.
- **Specification:**
  - Same color scheme, button styles, and typography across all pages
  - Consistent icon set (e.g., React Icons or Font Awesome)
  - Modal dialogs for all confirmation actions

---

### 4.4 Reliability Requirements

#### NFR-010: Availability
- **Description:** The application shall be available whenever the local server is running.
- **Specification:**
  - Application starts successfully within 10 seconds on localhost
  - No unhandled exceptions that crash the server

#### NFR-011: Error Handling
- **Description:** The system shall handle errors gracefully and return meaningful error responses.
- **Specification:**
  - All API endpoints have try-catch/exception handling
  - Unhandled exceptions return HTTP 500 with a generic error message (no stack trace exposed)
  - Frontend displays user-friendly error messages for all error states

#### NFR-012: Data Integrity
- **Description:** The database shall maintain referential integrity at all times.
- **Specification:**
  - Foreign key constraints enforced (PRAGMA foreign_keys = ON in SQLite)
  - Cascading deletes: when a user is deleted, all their data is deleted
  - Transactions roll back on partial failure

---

### 4.5 Maintainability Requirements

#### NFR-013: Code Organization
- **Description:** Code shall be organized into logical modules following established patterns.
- **Specification:**
  - Backend: Flask Blueprints (auth, transactions, categories, budgets, savings, reports)
  - Frontend: Feature-based component organization (/components, /pages, /services, /hooks)
  - Models separated from route handlers

#### NFR-014: Documentation
- **Description:** All modules, functions, and API endpoints shall be documented.
- **Specification:**
  - Python functions have docstrings
  - API endpoints documented in API_DOCUMENTATION.md
  - Complex logic has inline comments
  - 18 documentation files covering all aspects of the project

#### NFR-015: Testability
- **Description:** The codebase shall be designed for testability.
- **Specification:**
  - Backend uses application factory pattern for test isolation
  - Test configuration uses in-memory SQLite database
  - Minimum 50 test cases documented in TEST_PLAN.md
  - Test coverage target: 80% of backend routes

---

## 5. External Interface Requirements

### 5.1 User Interface Requirements

- **Framework:** React 18.x (Single Page Application)
- **Routing:** React Router v6 (client-side routing)
- **Layout:** Sidebar navigation + main content area
- **Components:** Reusable components for forms, cards, tables, modals
- **Charts:** Chart.js 4.x via react-chartjs-2 for data visualization
- **Responsive:** Minimum 768px width support (tablet and desktop)
- **Icons:** React Icons library
- **HTTP Client:** Axios for API communication

**Key UI Screens:**
1. Login / Registration Page
2. Dashboard (summary cards + charts)
3. Transactions List + Add/Edit Form
4. Categories Management
5. Budget Dashboard + Create Budget Form
6. Savings Goals List + Forms
7. Reports Page (charts and tables)
8. Profile Settings

### 5.2 API Interface Requirements

- **Style:** RESTful (Resource-oriented URLs, HTTP verbs)
- **Data Format:** JSON (application/json) for all request and response bodies
- **Authentication:** Session-based (Flask-Login session cookies)
- **Base URL:** http://localhost:5000/api
- **Versioning:** Not versioned in v1.0 (future enhancement)
- **CORS:** Configured to allow http://localhost:3000 (React dev server)

### 5.3 Database Interface Requirements

- **DBMS:** SQLite 3.x
- **ORM:** Flask-SQLAlchemy 3.x (SQLAlchemy 2.x)
- **Database File:** moneytrack.db (stored in project root)
- **Connection:** Single connection via SQLAlchemy engine
- **Migrations:** Flask-Migrate (Alembic) for schema version management
- **Initialization:** db.create_all() on first run

### 5.4 Hardware Interface Requirements

- **Processor:** Any x86-64 processor (1GHz+ recommended)
- **RAM:** 512MB minimum (2GB recommended)
- **Storage:** 100MB for application + database
- **Network:** Localhost loopback (127.0.0.1); no external network required at runtime

---

## 6. System Constraints

| # | Constraint Type | Description |
|---|----------------|-------------|
| 1 | Language | Backend must use Python 3.9+ |
| 2 | Framework | Backend must use Flask 2.x |
| 3 | Frontend | Frontend must use React 18.x |
| 4 | Database | Must use SQLite (no separate DB server) |
| 5 | Authentication | Must use session-based auth (Flask-Login) |
| 6 | Licensing | All dependencies must be open-source (MIT, Apache, BSD) |
| 7 | Cost | Zero monetary cost for all dependencies and tools |
| 8 | Deployment | Must run on localhost without cloud infrastructure |
| 9 | Single User | One user session at a time per browser |
| 10 | Data Volume | Optimized for up to 10,000 transactions per user |

---

## 7. Use Cases

### UC-001: Register New Account

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-001 |
| **Title** | Register New Account |
| **Actor** | New User |
| **Trigger** | User navigates to /register |
| **Preconditions** | User is not logged in; user has a valid email address |
| **Postconditions** | New user account created; user logged in; redirected to dashboard |

**Main Success Scenario:**
1. User navigates to the registration page
2. User enters full name, username, email, and password
3. User clicks "Register"
4. System validates all inputs
5. System checks email and username uniqueness
6. System creates user record with hashed password
7. System creates a session for the new user
8. System redirects user to the dashboard

**Alternative Flows:**
- 4a. Invalid email format → Show inline error "Please enter a valid email address"
- 4b. Password < 8 characters → Show inline error "Password must be at least 8 characters"
- 5a. Email already exists → Show error "An account with this email already exists"
- 5b. Username taken → Show error "This username is already taken"

---

### UC-002: Login to Account

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-002 |
| **Title** | User Login |
| **Actor** | Registered User |
| **Preconditions** | User has a registered account; user is not currently logged in |
| **Postconditions** | Authenticated session established; user on dashboard |

**Main Success Scenario:**
1. User navigates to /login
2. User enters email and password
3. User clicks "Login"
4. System validates credentials against stored hash
5. System creates server-side session
6. System redirects to /dashboard

**Alternative Flows:**
- 4a. Wrong password or email → "Invalid email or password" (generic to prevent enumeration)
- 2a. User clicks "Forgot Password" → Feature not available (shown as informational note)

---

### UC-003: Add Transaction

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-003 |
| **Title** | Add Financial Transaction |
| **Actor** | Authenticated User |
| **Preconditions** | User is logged in; at least one category exists |
| **Postconditions** | Transaction record created; dashboard totals updated |

**Main Success Scenario:**
1. User navigates to Transactions page
2. User clicks "Add Transaction" button
3. System displays transaction form
4. User selects type (income/expense)
5. User enters amount
6. User selects category from dropdown
7. User selects date (defaults to today)
8. User enters optional description
9. User clicks "Save"
10. System validates inputs
11. System saves transaction record
12. System closes modal and refreshes transaction list

**Alternative Flows:**
- 10a. Amount is 0 or negative → "Amount must be greater than zero"
- 10b. No category selected → "Please select a category"
- 11a. Database error → "Failed to save transaction. Please try again."

---

### UC-004: Monitor Budget

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-004 |
| **Title** | Monitor Monthly Budget |
| **Actor** | Authenticated User |
| **Preconditions** | User is logged in; at least one budget has been set |
| **Postconditions** | User views budget utilization for the selected month |

**Main Success Scenario:**
1. User navigates to Budgets page
2. System displays current month budgets by default
3. System shows each budget as a card with category, limit, spent amount, and progress bar
4. Progress bars are colored: green (<80%), yellow (80-99%), red (≥100%)
5. User can change month/year using filter controls
6. Dashboard updates to show selected period's budgets

---

### UC-005: Create Savings Goal

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-005 |
| **Title** | Create Savings Goal |
| **Actor** | Authenticated User |
| **Preconditions** | User is logged in |
| **Postconditions** | New savings goal created with current_amount = 0 |

**Main Success Scenario:**
1. User navigates to Savings Goals page
2. User clicks "New Goal"
3. User enters: title, target amount, deadline (optional)
4. User clicks "Create Goal"
5. System validates inputs
6. System creates savings goal record
7. New goal appears in the list with 0% progress

---

### UC-006: Update Savings Progress

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-006 |
| **Title** | Add Funds to Savings Goal |
| **Actor** | Authenticated User |
| **Preconditions** | User has at least one savings goal that is not completed |
| **Postconditions** | current_amount increased; progress bar updated |

**Main Success Scenario:**
1. User views their savings goals
2. User clicks "Add Funds" on a goal card
3. User enters the amount to add
4. User clicks "Confirm"
5. System validates: amount > 0
6. System adds amount to current_amount (capped at target)
7. Progress bar updates immediately

---

### UC-007: View Monthly Report

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-007 |
| **Title** | View Monthly Financial Report |
| **Actor** | Authenticated User |
| **Preconditions** | User is logged in; has at least one transaction |
| **Postconditions** | User sees summary and charts for selected month |

**Main Success Scenario:**
1. User navigates to Reports page
2. System defaults to current month
3. System displays: total income, total expense, net savings as summary cards
4. System displays income vs. expense bar chart for last 6 months
5. System displays category-wise pie chart for current month expenses
6. User can change month/year using filters

---

### UC-008: Manage Categories

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-008 |
| **Title** | Create Custom Category |
| **Actor** | Authenticated User |
| **Preconditions** | User is logged in |
| **Postconditions** | New category available for transaction assignment |

**Main Success Scenario:**
1. User navigates to Categories page
2. User clicks "Add Category"
3. User enters: name, selects type (income/expense), optionally selects icon and color
4. User clicks "Save"
5. System validates name uniqueness for the user
6. System creates category linked to user
7. Category appears in the list and is available in transaction forms

---

### UC-009: Edit Transaction

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-009 |
| **Title** | Edit Existing Transaction |
| **Actor** | Authenticated User |
| **Preconditions** | Transaction exists and belongs to the authenticated user |
| **Postconditions** | Transaction updated; dashboard and reports reflect new values |

**Main Success Scenario:**
1. User finds the transaction in the Transactions list
2. User clicks the Edit icon
3. System pre-fills the form with existing transaction data
4. User modifies desired fields
5. User clicks "Update"
6. System validates modified inputs
7. System updates the database record
8. Transaction list refreshes

---

### UC-010: Delete Account Data (Transaction/Budget/Goal)

| Field | Details |
|-------|---------|
| **Use Case ID** | UC-010 |
| **Title** | Delete a Financial Record |
| **Actor** | Authenticated User |
| **Preconditions** | Record exists and belongs to the authenticated user |
| **Postconditions** | Record permanently removed; totals recalculated |

**Main Success Scenario:**
1. User finds the record (transaction, budget, or goal)
2. User clicks the Delete icon
3. System shows confirmation dialog: "Are you sure? This cannot be undone."
4. User confirms deletion
5. System deletes the record
6. System refreshes the list; totals/progress bars update

**Alternative Flows:**
- 4a. User cancels → No action taken; dialog closed

---

## 8. User Stories

### Authentication & Profile

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| **US-001** | As a new user, I want to create an account with my email and password so that my financial data is private and secure. | High | Registration form validates email uniqueness; password hashed before storage |
| **US-002** | As a returning user, I want to log in with my credentials so that I can access my financial records. | High | Login succeeds with correct credentials; fails gracefully with wrong credentials |
| **US-003** | As a logged-in user, I want to log out so that my account is secure when I step away from the device. | High | Session is destroyed; login page shown after logout |
| **US-004** | As a user, I want to update my display name and currency preference so that the app reflects my identity and local currency. | Medium | Profile updates are saved and reflected immediately in the UI |

### Transactions

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| **US-005** | As a user, I want to add an expense transaction so that I can track where my money is going. | High | Transaction saved with amount, category, date, and optional description |
| **US-006** | As a user, I want to add an income transaction so that I can track all my earnings in one place. | High | Income transaction categorized separately from expenses |
| **US-007** | As a user, I want to see a list of all my transactions so that I can review my financial activity. | High | List shows date, category, description, amount; sorted by date |
| **US-008** | As a user, I want to filter transactions by date range so that I can see spending for a specific period. | High | Filter applies correctly; list updates dynamically |
| **US-009** | As a user, I want to filter transactions by category so that I can analyze spending in one area. | Medium | Category filter returns only matching transactions |
| **US-010** | As a user, I want to edit a transaction I made a mistake on so that my records remain accurate. | High | Edit form pre-fills with existing data; changes saved correctly |
| **US-011** | As a user, I want to delete a transaction so that incorrect entries don't affect my reports. | High | Confirmation dialog shown; deletion updates all derived figures |

### Categories

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| **US-012** | As a user, I want to use pre-defined categories so that I can start tracking immediately without setup. | High | Default categories available on first login |
| **US-013** | As a user, I want to create a custom category so that I can organize my spending the way I think about it. | Medium | Custom category appears in transaction form dropdowns |

### Budgets

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| **US-014** | As a user, I want to set a monthly budget for each spending category so that I can control overspending. | High | Budget saved with category, month, year, and limit amount |
| **US-015** | As a user, I want to see a progress bar for each budget so that I can tell at a glance how much I have left. | High | Progress bar shows correct percentage; colors indicate health |
| **US-016** | As a user, I want to be visually warned when I'm close to my budget limit so that I can adjust my spending. | High | Yellow indicator at 80%; red indicator at 100%+ |

### Savings Goals

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| **US-017** | As a user, I want to set a savings goal with a target amount and deadline so that I stay motivated to save. | High | Goal created with title, target, optional deadline; 0% initial progress |
| **US-018** | As a user, I want to add money to my savings goal so that I can track my progress over time. | High | Amount added; progress bar and percentage update correctly |

### Reports

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| **US-019** | As a user, I want to see a monthly summary of my total income, expenses, and net savings so that I know my financial health at a glance. | High | Summary cards show correct totals for selected month |
| **US-020** | As a user, I want to see a category-wise breakdown of my expenses so that I can identify my biggest spending areas. | High | Pie chart and table show category amounts and percentages |

---

*Document End – SRS v1.0 (IEEE 830 Format)*  
*MoneyTrack | MCA Mini Project | Track Your Money, Manage Your Future.*

