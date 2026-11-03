# Product Requirements Document (PRD)
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Date:** November 2026  
> **Author:** Project Developer  
> **Project Type:** MCA Mini Project – Full Stack Web Application  
> **Status:** Final  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [User Personas](#3-user-personas)
4. [Feature Requirements](#4-feature-requirements)
5. [Success Metrics](#5-success-metrics)
6. [Project Timeline](#6-project-timeline)
7. [Constraints & Assumptions](#7-constraints--assumptions)
8. [Out of Scope](#8-out-of-scope)

---

## 1. Executive Summary

MoneyTrack is a full-stack personal finance management web application developed as an MCA Mini Project. The system empowers individuals to take control of their personal finances by providing a centralized platform to log income and expenses, set and monitor monthly budgets, track savings goals, and visualize spending patterns through intuitive reports and charts.

The application is built using Python/Flask on the backend and React.js on the frontend, with SQLite as the data persistence layer. It targets students, working professionals, and homemakers who need a simple yet powerful tool to monitor their daily financial activities without the complexity of enterprise financial software.

**Core Problem Solved:** Most individuals lack visibility into their daily spending habits and have no system to compare actual spending against planned budgets. MoneyTrack addresses this gap by providing real-time tracking, automated calculations, and visual insights in a user-friendly interface.

---

## 2. Product Vision & Goals

### 2.1 Product Vision

> *"To be the go-to personal finance companion for every Indian household — simple enough for first-time users, yet powerful enough to drive real financial discipline."*

MoneyTrack envisions a world where every individual, regardless of their financial literacy level, can understand and manage their money effectively using technology. The application focuses on simplicity, accessibility, and actionable insights.

### 2.2 Product Goals

| Goal ID | Goal | Description | Priority |
|---------|------|-------------|----------|
| G-01 | Financial Visibility | Give users a clear picture of where their money goes each month | High |
| G-02 | Budget Discipline | Enable users to set limits and receive alerts when approaching them | High |
| G-03 | Savings Motivation | Help users define and track progress toward financial goals | High |
| G-04 | Reporting & Insights | Provide monthly/category-wise reports for informed decisions | High |
| G-05 | Ease of Use | Ensure the interface is intuitive for non-technical users | High |
| G-06 | Data Security | Protect sensitive financial data with proper authentication | High |
| G-07 | Extensibility | Design codebase to allow future enhancements easily | Medium |

### 2.3 Business Objectives

- Demonstrate full-stack development competency at MCA level
- Implement secure user authentication and authorization
- Showcase relational database design with normalization
- Apply RESTful API design principles
- Deliver a working, deployable product within 4 weeks

---

## 3. User Personas

### Persona 1: Riya Sharma – The Budget-Conscious Student

| Attribute | Details |
|-----------|---------|
| **Age** | 21 years |
| **Occupation** | MCA Student, Part-time Tutor |
| **Location** | Pune, Maharashtra |
| **Income** | ₹8,000/month (tutoring) + ₹5,000 pocket money |
| **Tech Comfort** | High – uses smartphone and laptop daily |
| **Financial Knowledge** | Basic – tracks expenses in a diary |

**Background:**  
Riya receives a fixed monthly allowance from her parents and earns extra income from tutoring. She often runs out of money before month-end and wants to understand where her money is going. She has tried using Excel but finds it tedious.

**Goals:**
- Know exactly how much she spends on food, travel, and entertainment
- Set a monthly budget for each category and stick to it
- Save ₹2,000/month toward a new laptop

**Pain Points:**
- Forgets to record expenses; loses track quickly
- No visual representation of spending patterns
- Cannot differentiate between essential and non-essential spending

**How MoneyTrack Helps:**
- Quick transaction entry with category tagging
- Visual dashboard showing budget utilization percentages
- Savings goal tracker with progress bar for the laptop fund

---

### Persona 2: Arjun Mehta – The Working Professional

| Attribute | Details |
|-----------|---------|
| **Age** | 28 years |
| **Occupation** | Software Engineer |
| **Location** | Bengaluru, Karnataka |
| **Income** | ₹75,000/month (salary) |
| **Tech Comfort** | Very High |
| **Financial Knowledge** | Intermediate – has SIP investments, pays EMI |

**Background:**  
Arjun earns well but spends heavily on eating out, online shopping, and entertainment subscriptions. Despite a good salary, he is unable to save consistently. He wants to build an emergency fund of ₹1.5 lakh within 6 months.

**Goals:**
- Track all income sources (salary + freelance)
- Monitor discretionary spending and reduce it
- Set a 6-month savings goal and track progress weekly
- See monthly income vs. expense reports

**Pain Points:**
- Multiple payment methods (UPI, credit card, cash) make tracking difficult
- No single platform to see the complete financial picture
- Tends to overspend on weekends

**How MoneyTrack Helps:**
- Income and expense transaction logging across all categories
- Budget monitoring with visual progress indicators
- Monthly summary reports comparing income vs. expenses
- Savings goal with deadline and current progress tracking

---

### Persona 3: Sunita Devi – The Homemaker

| Attribute | Details |
|-----------|---------|
| **Age** | 42 years |
| **Occupation** | Homemaker |
| **Location** | Jaipur, Rajasthan |
| **Income** | ₹30,000/month (household budget from spouse) |
| **Tech Comfort** | Low-Medium – uses WhatsApp, basic apps |
| **Financial Knowledge** | Practical – manages household expenses |

**Background:**  
Sunita manages the entire household budget including groceries, utilities, education fees, and medical expenses. She maintains a physical register but finds it cumbersome and difficult to analyze. Her husband wants monthly expense reports.

**Goals:**
- Categorize all household expenses (groceries, education, medical, utilities)
- Stay within the ₹30,000 monthly household budget
- Plan for annual expenses (school fees, festivals)
- Generate simple reports to share with husband

**Pain Points:**
- Physical register is not searchable or analyzable
- Cannot quickly recall how much was spent on a specific category last month
- Difficult to plan ahead without visibility into recurring expenses

**How MoneyTrack Helps:**
- Simple, category-based expense entry with descriptive notes
- Budget setting per category (e.g., ₹8,000 for groceries)
- Category-wise monthly reports for easy review
- Simple and clean UI requiring minimal technical knowledge

---

## 4. Feature Requirements

### 4.1 Core Features (Must Have – MVP)

#### 4.1.1 User Authentication & Profile Management

**Description:** Secure user registration, login, and profile management system.

| Requirement ID | Feature | Details |
|----------------|---------|---------|
| F-001 | User Registration | Users can create an account with full name, email, username, and password |
| F-002 | Secure Login | Email/username + password authentication with session management |
| F-003 | Logout | Secure session termination |
| F-004 | User Profile | View and update personal details and currency preference |
| F-005 | Password Security | Passwords hashed using PBKDF2-SHA256 via Werkzeug |

**Acceptance Criteria:**
- Registration validates email format, username uniqueness, and password strength
- Login creates a secure server-side session
- Unauthorized access to protected routes redirects to login page

#### 4.1.2 Transaction Management

**Description:** Core feature allowing users to log, edit, and delete financial transactions.

| Requirement ID | Feature | Details |
|----------------|---------|---------|
| F-006 | Add Transaction | Log income or expense with amount, category, date, description |
| F-007 | Edit Transaction | Modify any field of an existing transaction |
| F-008 | Delete Transaction | Remove a transaction with confirmation |
| F-009 | List Transactions | View all transactions with filtering and sorting |
| F-010 | Transaction Types | Support both income and expense transaction types |
| F-011 | Category Assignment | Every transaction must be assigned a category |
| F-012 | Date Selection | Transactions can be backdated to any date |

**Acceptance Criteria:**
- Amount must be a positive number
- Category selection is required
- Transactions are displayed in reverse chronological order by default
- Filters: by date range, category, type (income/expense)

#### 4.1.3 Category Management

**Description:** Users can create and manage custom income and expense categories.

| Requirement ID | Feature | Details |
|----------------|---------|---------|
| F-013 | Default Categories | System provides pre-seeded categories (Food, Travel, Salary, etc.) |
| F-014 | Custom Categories | Users can create their own categories with name, icon, and color |
| F-015 | Edit/Delete Category | Modify or remove custom categories |
| F-016 | Category Type | Each category is either Income or Expense type |

#### 4.1.4 Budget Tracking

**Description:** Monthly budget planning and real-time monitoring against actual spending.

| Requirement ID | Feature | Details |
|----------------|---------|---------|
| F-017 | Create Budget | Set a monthly budget limit for any expense category |
| F-018 | Budget Dashboard | View all budgets with current spending as a progress bar |
| F-019 | Budget Edit/Delete | Modify or remove budget entries |
| F-020 | Over-budget Alert | Visual indicator when spending exceeds 80% or 100% of budget |
| F-021 | Month/Year Filter | View budgets for specific month and year |

**Acceptance Criteria:**
- Budget amount must be positive
- Progress bar turns yellow at 80% utilization, red at 100%+
- Budgets are month-specific (not rolling)

#### 4.1.5 Savings Goals

**Description:** Goal-oriented savings tracker with progress monitoring.

| Requirement ID | Feature | Details |
|----------------|---------|---------|
| F-022 | Create Savings Goal | Define goal title, target amount, deadline |
| F-023 | Update Savings Progress | Add funds to a savings goal (increases current_amount) |
| F-024 | Goal Progress View | Visual progress bar showing current vs. target amount |
| F-025 | Delete Goal | Remove a savings goal |
| F-026 | Goal Status | Display days remaining and percentage achieved |

#### 4.1.6 Reports & Analytics

**Description:** Data visualization and summary reports for financial insights.

| Requirement ID | Feature | Details |
|----------------|---------|---------|
| F-027 | Monthly Summary | Total income, total expense, net savings for any month |
| F-028 | Category-wise Report | Breakdown of spending by category with percentage share |
| F-029 | Income vs. Expense Chart | Bar/line chart comparing income and expenses month-over-month |
| F-030 | Dashboard Overview | Summary cards: total balance, monthly income, monthly expenses |

---

### 4.2 Nice-to-Have Features (Future Enhancements)

| Feature ID | Feature | Description | Target Version |
|------------|---------|-------------|----------------|
| N-001 | CSV Export | Export transactions to a downloadable CSV file | v1.1 |
| N-002 | Dark Mode | Toggle between light and dark UI theme | v1.1 |
| N-003 | Budget Alerts via Email | Email notification when budget threshold is exceeded | v1.2 |
| N-004 | Recurring Transactions | Auto-log monthly recurring income/expenses | v1.2 |
| N-005 | Multi-currency Support | Support transactions in multiple currencies | v2.0 |
| N-006 | Mobile App | React Native mobile companion app | v2.0 |
| N-007 | OCR Receipt Scanning | Scan receipts to auto-log expenses | v2.0 |
| N-008 | Bank Statement Import | Parse and import PDF bank statements | v2.0 |
| N-009 | Shared Budgets | Multiple users sharing a household budget | v2.0 |
| N-010 | Investment Tracking | Track mutual funds, stocks, and FD investments | v2.0 |

---

## 5. Success Metrics

### 5.1 Functional Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| All core features implemented | 100% | Feature checklist completion |
| API endpoints functional | 100% (18 endpoints) | API test suite pass rate |
| Test case pass rate | ≥ 90% | Test report results |
| Zero critical bugs at launch | 0 critical bugs | Bug tracker |
| Page load time | < 2 seconds | Browser DevTools |

### 5.2 Academic Success Metrics

| Metric | Target |
|--------|--------|
| Complete documentation set | 18 documents |
| Working demo application | Yes |
| Code follows best practices | Verified via code review |
| Database properly normalized | 3NF compliance |
| Security measures implemented | OWASP Top 10 addressed |

### 5.3 User Experience Metrics

| Metric | Target |
|--------|--------|
| Time to add a transaction | < 30 seconds |
| Ease of navigation (self-explanatory UI) | Yes |
| Mobile responsiveness | Basic responsiveness |
| Error messages are descriptive | Yes |

---

## 6. Project Timeline

### 4-Week SDLC Timeline

```
Week 1: Requirements & Design
├── Day 1-2: Requirements gathering, PRD and SRS creation
├── Day 3-4: System design, database schema, ER diagram
├── Day 5-6: UI/UX wireframes and mockups
└── Day 7: Architecture finalization and tech setup

Week 2: Backend Development
├── Day 8-9:  Project setup, Flask app structure, database models
├── Day 10-11: Authentication API (register, login, logout)
├── Day 12-13: Transactions and Categories API
└── Day 14:   Budgets and Savings Goals API

Week 3: Frontend Development
├── Day 15-16: React project setup, routing, authentication pages
├── Day 17-18: Dashboard and Transaction Management UI
├── Day 19-20: Budget and Savings Goal UI
└── Day 21:   Reports and Charts (Chart.js integration)

Week 4: Testing, Debugging & Documentation
├── Day 22-23: Unit and integration testing
├── Day 24-25: Bug fixing and debugging
├── Day 26-27: Full documentation writing
└── Day 28:   Final review, deployment, and presentation prep
```

### Milestones

| Milestone | Target Date | Deliverable |
|-----------|-------------|-------------|
| M1: Design Complete | End of Week 1 | PRD, SRS, DB Schema, Wireframes |
| M2: Backend Complete | End of Week 2 | All API endpoints working |
| M3: Frontend Complete | End of Week 3 | Fully functional UI |
| M4: Project Complete | End of Week 4 | Tested, documented, deployable app |

---

## 7. Constraints & Assumptions

### 7.1 Technical Constraints

| Constraint | Details |
|-----------|---------|
| **Platform** | Web application only (no native mobile app in v1.0) |
| **Database** | SQLite (file-based; not suitable for multi-server deployment) |
| **Hosting** | Local development machine (localhost:5000 backend, localhost:3000 frontend) |
| **Single User Session** | One session per user at a time |
| **Browser Support** | Modern browsers only (Chrome 90+, Firefox 88+, Edge 90+) |
| **No Real-time Features** | No WebSocket or push notifications in v1.0 |

### 7.2 Business Constraints

| Constraint | Details |
|-----------|---------|
| **Timeline** | 4 weeks (academic semester constraint) |
| **Team Size** | Single developer |
| **Budget** | Zero cost (only free and open-source tools) |
| **Academic Scope** | Must demonstrate full-stack MCA-level competency |

### 7.3 Assumptions

- Users have a modern web browser installed
- Users are comfortable using web applications
- The application will run on a local machine during the demo
- All monetary amounts are in Indian Rupees (INR) by default
- Internet connection is only required for initial dependency installation, not for runtime
- SQLite is sufficient for the data volumes in the academic context
- A single user account per email address
- System date/time is correctly configured on the host machine

---

## 8. Out of Scope

The following features and capabilities are explicitly **NOT** included in MoneyTrack v1.0:

| # | Out-of-Scope Item | Reason |
|---|-------------------|--------|
| 1 | Bank account integration / Open Banking API | Requires financial licensing and complex security |
| 2 | Real-time currency conversion | Requires third-party currency API subscription |
| 3 | Investment portfolio tracking | Out of scope for personal budgeting MVP |
| 4 | Tax computation or ITR filing | Domain-specific, requires compliance expertise |
| 5 | Multi-user collaboration | Requires complex access control; planned for v2.0 |
| 6 | Mobile application (iOS/Android) | Separate development effort |
| 7 | Email/SMS notifications | Requires SMTP/SMS gateway configuration |
| 8 | Cloud deployment | Infrastructure and DevOps out of academic scope |
| 9 | Data import from bank statements | Complex parsing logic; planned enhancement |
| 10 | AI-based spending predictions | Machine learning scope beyond this project |
| 11 | Payment processing | Not a transactional banking application |
| 12 | Multi-tenancy | Single-instance, single-user-at-a-time architecture |

---

*Document End – PRD v1.0*  
*MoneyTrack | MCA Mini Project | Track Your Money, Manage Your Future.*

