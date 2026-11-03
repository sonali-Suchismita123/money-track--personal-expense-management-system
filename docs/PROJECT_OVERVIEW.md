# Project Overview
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Date:** November 2026  
> **Project Type:** MCA Mini Project – Full Stack Web Application  
> **Tagline:** Track Your Money, Manage Your Future.  

---

## Table of Contents

1. [Project Introduction](#1-project-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Objectives](#4-objectives)
5. [Key Features](#5-key-features)
6. [Project Scope](#6-project-scope)
7. [Limitations](#7-limitations)
8. [Team Roles](#8-team-roles)
9. [Project Timeline and Milestones](#9-project-timeline-and-milestones)
10. [Expected Outcomes](#10-expected-outcomes)

---

## 1. Project Introduction

**MoneyTrack** is a full-stack web application designed to help individuals manage their personal finances with ease and clarity. Built as an MCA Mini Project, it demonstrates the integration of modern web technologies — Python/Flask for backend API development, React.js for a dynamic user interface, and SQLite for lightweight data persistence.

Personal finance management is an essential life skill that many people struggle with due to the lack of accessible, simple tools. While enterprise solutions like Tally or Quicken exist for businesses, and apps like Mint exist for US-centric banking integration, there is a significant gap for a simple, self-hosted, privacy-focused personal finance tracker suitable for Indian users.

MoneyTrack fills this gap by offering:
- A clean, intuitive web interface accessible from any browser
- Secure, private data storage (your data stays on your machine)
- Core financial management features: transaction tracking, budget monitoring, savings goals, and analytics
- No subscription fees, no bank integrations required, no data sent to third parties

### Project Identity Card

| Attribute | Details |
|-----------|---------|
| **Project Name** | MoneyTrack |
| **Full Title** | Personal Expense & Budget Management System |
| **Type** | MCA Academic Mini Project |
| **Category** | Full Stack Web Application |
| **Domain** | Personal Finance / FinTech |
| **Backend** | Python 3.11 + Flask 2.3 + Flask-SQLAlchemy |
| **Frontend** | React 18 + JSX + CSS3 |
| **Database** | SQLite 3 |
| **Authentication** | Session-based (Flask-Login + Werkzeug) |
| **API Style** | RESTful HTTP/JSON |
| **Development Period** | 4 Weeks |
| **Version** | 1.0 (MVP) |

---

## 2. Problem Statement

### 2.1 The Financial Awareness Gap

According to various financial literacy surveys, a majority of young Indians — students and early-career professionals especially — do not actively track their income and expenses. The consequences are significant:

- **Unplanned overspending:** People regularly spend beyond their means without realizing it until the month ends
- **Budget blindness:** Without a budget, there is no benchmark to measure spending against
- **Delayed savings:** Without clear visibility into discretionary spending, savings become an afterthought
- **No financial data:** Without records, it's impossible to analyze patterns or make informed decisions

### 2.2 Existing Tool Limitations

| Existing Tool | Problem |
|---------------|---------|
| **Spreadsheets (Excel/Google Sheets)** | Manual and tedious; no automation; no visual dashboards; requires prior knowledge |
| **Physical diary/notebook** | Not searchable; easily lost; cannot generate reports |
| **Banking apps** | Only show bank transactions; cannot track cash; no budget setting feature |
| **Enterprise software (Tally)** | Complex for personal use; designed for businesses; steep learning curve |
| **Foreign apps (Mint, YNAB)** | Not optimized for Indian currency/categories; require US bank account linking |

### 2.3 Target User Pain Points

1. "I never know where all my money went by month-end"
2. "I keep meaning to start saving but never do"
3. "I have a budget in my head but no way to track it"
4. "I want to save for something specific but don't know if I'm on track"
5. "I'd like to see a breakdown of how I spend, but Excel is too much work"

---

## 3. Proposed Solution

MoneyTrack addresses all the above pain points with a focused, user-friendly web application:

### 3.1 Solution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│         React SPA – Dashboard, Forms, Charts, Reports           │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/JSON (REST API calls via Axios)
┌─────────────────▼───────────────────────────────────────────────┐
│                     FLASK REST API SERVER                       │
│     Auth, Transactions, Budgets, Savings, Reports Blueprints    │
└─────────────────┬───────────────────────────────────────────────┘
                  │ SQLAlchemy ORM
┌─────────────────▼───────────────────────────────────────────────┐
│                        SQLITE DATABASE                          │
│        users, categories, transactions, budgets, savings        │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 How MoneyTrack Solves Each Problem

| Pain Point | MoneyTrack Solution |
|-----------|---------------------|
| "Don't know where money went" | Transaction logging with category tags + category-wise reports |
| "Can't save consistently" | Savings goals with progress tracking and deadline |
| "Budget only in my head" | Monthly budget creation per category with progress bars |
| "Don't know if I'm on track" | Dashboard with real-time progress bars for budgets and goals |
| "Spreadsheet too complex" | Intuitive web UI, data entry in < 30 seconds, auto-calculated charts |

---

## 4. Objectives

### 4.1 Primary Objectives

1. **Develop a working full-stack web application** that demonstrates MCA-level competency in both frontend and backend development
2. **Implement secure user authentication** using industry-standard password hashing and session management
3. **Design and implement a normalized relational database** with proper foreign keys, indexes, and constraints
4. **Build a RESTful API** following standard HTTP conventions and JSON communication
5. **Create an intuitive React frontend** with dynamic data rendering and chart visualizations
6. **Enable financial self-awareness** through transaction tracking, budget monitoring, and reports

### 4.2 Academic Objectives

1. Apply software engineering lifecycle concepts (SDLC) in a real project
2. Practice database design with ER diagrams and normalization theory
3. Demonstrate security consciousness (OWASP awareness, input validation, auth)
4. Document the project comprehensively (18 documentation files)
5. Present a working demo with a live database

### 4.3 Technical Skill Objectives

| Skill Area | Demonstration |
|-----------|---------------|
| Python/Flask | REST API, ORM, Blueprints, error handling |
| React.js | Component lifecycle, hooks, state management, routing |
| SQL/SQLite | Schema design, queries, relationships, normalization |
| HTTP/REST | Proper status codes, methods, JSON APIs |
| Security | Password hashing, session management, input validation |
| CSS3 | Responsive design, progress bars, card layouts |
| Git | Version control with meaningful commits |

---

## 5. Key Features

### 5.1 Feature: Dashboard

**Description:** The central hub displaying the user's financial health at a glance.

**What it shows:**
- Current month's total income (in large summary card)
- Current month's total expenses (in large summary card)
- Net balance (income - expenses)
- Number of active savings goals
- Budget utilization summary
- Recent transactions list (last 5)
- Quick-add transaction button

**Why it matters:** Users get an instant, bird's-eye view of their financial status without navigating anywhere.

---

### 5.2 Feature: Transaction Management

**Description:** Full CRUD operations for income and expense entries.

**Capabilities:**
- Add income or expense with amount, category, date, and description
- Edit or delete any existing transaction
- Filter by date range, category, or type
- View all transactions in a clean tabular list sorted by date

**Why it matters:** The foundation of all financial tracking; without accurate transaction data, no other feature is useful.

---

### 5.3 Feature: Custom Categories

**Description:** Organize transactions into meaningful categories.

**Capabilities:**
- 16 default categories (10 expense + 6 income) pre-loaded
- Create custom categories with name, type, icon, and color
- Edit or delete custom categories (not default ones)

**Why it matters:** Categorization enables meaningful reports and budget tracking.

---

### 5.4 Feature: Budget Tracking

**Description:** Set monthly spending limits and track utilization in real time.

**Capabilities:**
- Set a budget limit for any expense category for any month/year
- Visual progress bars for each budget
- Color-coded status: green (safe), yellow (caution at 80%), red (over budget)
- Filter budgets by month and year

**Why it matters:** Budgets create accountability. Without a set limit, there's nothing to compare against.

---

### 5.5 Feature: Savings Goals

**Description:** Goal-oriented savings tracking with visual progress.

**Capabilities:**
- Create goals with a title, target amount, and optional deadline
- Track progress by adding funds to a goal
- View percentage completion and days remaining
- Mark completed when target is reached

**Why it matters:** Goals give savings a purpose and deadline, dramatically increasing follow-through.

---

### 5.6 Feature: Reports & Analytics

**Description:** Data-driven insights into financial patterns.

**Capabilities:**
- Monthly summary: income, expenses, net savings
- Category-wise expense breakdown (table + pie chart)
- Income vs. expense trend chart for last 6 months
- Filter reports by month and year

**Why it matters:** Without analysis, tracking is just data collection. Reports turn data into actionable insights.

---

### 5.7 Feature: Secure Authentication

**Description:** Robust user account system protecting financial privacy.

**Capabilities:**
- Secure registration with email validation
- Password hashing (PBKDF2-SHA256 with salt)
- Session-based authentication
- Protected routes (unauthorized access redirected to login)

**Why it matters:** Financial data is sensitive. Security is non-negotiable.

---

## 6. Project Scope

### 6.1 In Scope

| # | Scope Item |
|---|-----------|
| 1 | User registration, login, logout, and basic profile management |
| 2 | Full CRUD for transactions (income and expense) |
| 3 | Full CRUD for categories (custom categories per user) |
| 4 | Full CRUD for monthly budgets with real-time utilization |
| 5 | Full CRUD for savings goals with progress tracking |
| 6 | Monthly and category-wise reports |
| 7 | Visual dashboard with summary cards |
| 8 | Chart.js based visualizations (bar chart, pie chart) |
| 9 | Responsive web design (desktop and tablet) |
| 10 | RESTful JSON API with 18+ endpoints |
| 11 | SQLite database with proper schema design |
| 12 | Complete documentation (18 files) |

### 6.2 Out of Scope (v1.0)

| # | Out of Scope Item | Planned For |
|---|-------------------|-------------|
| 1 | Bank account integration | Not planned |
| 2 | Email notifications | v1.2 |
| 3 | CSV/PDF export | v1.1 |
| 4 | Dark mode UI | v1.1 |
| 5 | Recurring transactions | v1.2 |
| 6 | Mobile application | v2.0 |
| 7 | Multi-user / family budgets | v2.0 |
| 8 | Investment tracking | v2.0 |
| 9 | Real-time currency exchange | v2.0 |
| 10 | Cloud/production deployment | Future |

---

## 7. Limitations

| # | Limitation | Impact | Mitigation |
|---|-----------|--------|------------|
| 1 | **SQLite is single-writer** | Cannot support concurrent multi-user writes on one server | Acceptable for single-user personal use |
| 2 | **No email verification** | Any email can be used during registration | In-scope for v1.0; planned for v1.1 |
| 3 | **No password reset** | Users cannot self-service reset forgotten passwords | Noted in User Manual; planned for v1.1 |
| 4 | **Local deployment only** | Application not accessible via internet | Acceptable for academic demo scope |
| 5 | **No automated backups** | SQLite file not automatically backed up | User advised to manually copy .db file |
| 6 | **No real-time updates** | Budget progress requires page refresh | Acceptable UX for this project stage |
| 7 | **Basic mobile responsiveness** | Not fully optimized for smartphones | Desktop and tablet primary targets |
| 8 | **No multi-currency per transaction** | Single currency per user account | Sufficient for individual use case |

---

## 8. Team Roles

MoneyTrack is developed by a single developer who wears multiple hats throughout the SDLC:

| Role | Responsibilities | Artifacts Produced |
|------|-----------------|-------------------|
| **Business Analyst** | Requirements gathering, PRD, SRS, user personas | PRD.md, SRS.md |
| **System Architect** | Architecture design, technology selection, database design | SYSTEM_ARCHITECTURE.md, DATABASE_DESIGN.md |
| **Backend Developer** | Flask API, database models, authentication, business logic | Python source files, API_DOCUMENTATION.md |
| **Frontend Developer** | React components, UI/UX, Chart.js integration | JSX/CSS source files |
| **Database Administrator** | Schema design, normalization, seeding, migrations | DATABASE_DESIGN.md, .db file |
| **QA Engineer** | Test plan creation, test case execution, bug reporting | TEST_PLAN.md, TEST_REPORT.md, DEBUGGING_LOG.md |
| **Security Analyst** | Security design, OWASP assessment, audit | SECURITY.md, SECURITY_AUDIT.md |
| **Technical Writer** | All 18 documentation files | All .md files in /docs |
| **DevOps** | Local deployment setup, dependency management | DEPLOYMENT_GUIDE.md |

---

## 9. Project Timeline and Milestones

### 4-Week Development Schedule

| Week | Phase | Key Activities | Deliverables |
|------|-------|---------------|-------------|
| **Week 1** | Planning & Design | Requirements gathering, DB design, wireframing, project setup | PRD, SRS, DB schema, wireframes |
| **Week 2** | Backend Development | Flask app factory, models, auth API, transactions API, budgets API, savings API, reports API | Working REST API, Postman-tested endpoints |
| **Week 3** | Frontend Development | React setup, routing, dashboard, all CRUD pages, charts | Functional React SPA |
| **Week 4** | Testing & Documentation | Unit tests, integration tests, bug fixes, all 18 docs | Test report, debug log, complete docs |

### Milestone Details

| Milestone | Description | Completion Criteria |
|-----------|-------------|---------------------|
| **M1: Requirements Complete** | All documentation for planning phase done | PRD.md, SRS.md approved |
| **M2: Database Schema Finalized** | ERD drawn, tables defined, normalized to 3NF | DATABASE_DESIGN.md complete |
| **M3: Backend API Live** | All 18 API endpoints functional | Postman tests pass for all endpoints |
| **M4: Frontend Connected** | React app consuming API for all features | All pages functional end-to-end |
| **M5: Testing Complete** | 50 test cases executed, bugs resolved | TEST_REPORT.md with 90%+ pass rate |
| **M6: Documentation Complete** | All 18 docs written | Full /docs directory complete |
| **M7: Demo Ready** | Project demo-able with sample data | Application runs without errors |

---

## 10. Expected Outcomes

### 10.1 Technical Outcomes

| Outcome | Description |
|---------|-------------|
| **Functional Web Application** | A running MoneyTrack application on localhost with all core features |
| **Working REST API** | 18+ endpoints handling CRUD for all resources |
| **Normalized Database** | SQLite database in Third Normal Form with proper relationships |
| **Secure Authentication** | User accounts with hashed passwords and session management |
| **Tested Codebase** | 50 test cases with ≥90% pass rate documented |
| **Clean Code** | Organized into blueprints/components, with comments and docstrings |

### 10.2 Documentation Outcomes

| Outcome | Description |
|---------|-------------|
| **18 Documentation Files** | Complete set covering all aspects of the SDLC |
| **API Reference** | Detailed documentation for every endpoint |
| **User Manual** | Non-technical guide for using the application |
| **Security Assessment** | OWASP-mapped security audit |

### 10.3 Learning Outcomes

| Area | Skill Demonstrated |
|------|-------------------|
| **Full-Stack Development** | End-to-end feature implementation across 3 tiers |
| **Database Design** | Normalization, ER modeling, foreign keys, indexes |
| **Software Engineering** | SDLC phases, documentation standards, testing |
| **Security** | Authentication, authorization, input validation, OWASP |
| **API Design** | RESTful principles, HTTP semantics, JSON contracts |
| **Frontend Engineering** | React components, hooks, state management, routing |
| **Project Management** | Timeline planning, milestone tracking, single-developer execution |

### 10.4 Academic Outcomes

- Successful completion of MCA Mini Project requirement
- Demonstration of industry-relevant technical skills
- Comprehensive portfolio project for job applications
- Practical experience in building a real-world application from scratch

---

*Document End – Project Overview v1.0*  
*MoneyTrack | MCA Mini Project | Track Your Money, Manage Your Future.*

