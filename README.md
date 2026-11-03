# 💰 MoneyTrack – Personal Expense & Budget Management System

> **Track Your Money, Manage Your Future.**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue.svg)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Project Overview

**MoneyTrack** is a full-stack personal expense and budget management web application developed as an MCA Mini Project. It empowers users to take control of their finances by tracking income and expenses, setting budgets, managing savings goals, and visualizing spending patterns through interactive reports.

| Detail | Value |
|--------|-------|
| **Project Type** | MCA Mini Project |
| **Domain** | Full Stack Web Development |
| **Backend** | Python + Flask + Flask-SQLAlchemy |
| **Frontend** | React 18 + CSS3 |
| **Database** | SQLite |
| **Version** | 1.0.0 |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure registration, login, and session management |
| 💸 **Transaction Management** | Add, edit, delete income and expense transactions |
| 🏷️ **Category Management** | Custom categories with icons and colors |
| 🎯 **Budget Tracking** | Monthly budgets with real-time spending progress |
| 💎 **Savings Goals** | Track goals with progress bars and deadlines |
| 📊 **Reports & Analytics** | Interactive charts: bar, pie, line charts |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🛡️ **Security** | Password hashing, SQL injection prevention, XSS protection |

---

## 🗂️ Project Structure

```
money Tracker/
│
├── 📁 backend/                    # Flask Python Backend
│   ├── app.py                     # Main application factory
│   ├── config.py                  # Configuration settings
│   ├── init_db.py                 # Database initialization & seeding
│   ├── requirements.txt           # Python dependencies
│   │
│   ├── 📁 models/                 # SQLAlchemy ORM Models
│   │   ├── user.py                # User model
│   │   ├── category.py            # Category model
│   │   ├── transaction.py         # Transaction model
│   │   ├── budget.py              # Budget model
│   │   └── savings_goal.py        # Savings Goal model
│   │
│   ├── 📁 routes/                 # API Blueprint Routes
│   │   ├── auth.py                # Authentication endpoints
│   │   ├── transactions.py        # Transaction CRUD endpoints
│   │   ├── categories.py          # Category CRUD endpoints
│   │   ├── budgets.py             # Budget CRUD endpoints
│   │   ├── savings.py             # Savings goal endpoints
│   │   └── reports.py             # Analytics & reports endpoints
│   │
│   └── 📁 utils/                  # Utility Functions
│       ├── validators.py          # Input validation functions
│       └── helpers.py             # Helper/utility functions
│
├── 📁 frontend/                   # React Frontend
│   ├── package.json               # Node dependencies
│   ├── 📁 public/
│   │   └── index.html             # HTML entry point
│   └── 📁 src/
│       ├── App.js                 # Root component + routing
│       ├── index.js               # React DOM entry
│       ├── index.css              # Global styles
│       │
│       ├── 📁 context/
│       │   └── AuthContext.js     # Authentication context
│       │
│       ├── 📁 services/
│       │   └── api.js             # API service layer
│       │
│       ├── 📁 components/         # Reusable components
│       │   ├── 📁 Layout/         # Sidebar, Topbar, Layout
│       │   └── 📁 Common/         # Modal, Button, Input, Card, etc.
│       │
│       ├── 📁 pages/              # Application pages
│       │   ├── 📁 Auth/           # Login, Register
│       │   ├── 📁 Dashboard/      # Main dashboard
│       │   ├── 📁 Transactions/   # Transaction management
│       │   ├── 📁 Categories/     # Category management
│       │   ├── 📁 Budgets/        # Budget tracking
│       │   ├── 📁 Savings/        # Savings goals
│       │   ├── 📁 Reports/        # Charts & analytics
│       │   └── 📁 Profile/        # User profile
│       │
│       └── 📁 utils/
│           ├── formatters.js      # Date/currency formatters
│           └── constants.js       # App-wide constants
│
├── 📁 tests/                      # Test Suites (pytest)
│   ├── conftest.py                # Test fixtures & configuration
│   ├── test_auth.py               # Authentication tests
│   ├── test_transactions.py       # Transaction tests
│   ├── test_categories.py         # Category tests
│   ├── test_budgets.py            # Budget tests
│   ├── test_savings.py            # Savings tests
│   ├── test_reports.py            # Reports tests
│   ├── test_security.py           # Security tests
│   ├── test_validators.py         # Validator unit tests
│   ├── test_helpers.py            # Helper function tests
│   └── test_integration.py        # End-to-end integration tests
│
├── 📁 docs/                       # Complete Documentation
│   ├── PRD.md                     # Product Requirements Document
│   ├── SRS.md                     # Software Requirements Specification
│   ├── PROJECT_OVERVIEW.md        # Project introduction
│   ├── SYSTEM_ARCHITECTURE.md     # System architecture
│   ├── DATABASE_DESIGN.md         # Database schema & design
│   ├── WORKFLOW.md                # Application workflows
│   ├── TECH_STACK.md              # Technology documentation
│   ├── TASK_TRACKER.md            # Development task tracking
│   ├── API_DOCUMENTATION.md       # REST API reference
│   ├── SECURITY.md                # Security requirements
│   ├── TEST_PLAN.md               # Testing strategy
│   ├── TEST_REPORT.md             # Test results
│   ├── DEBUGGING_LOG.md           # Bug tracking log
│   ├── CODE_REVIEW.md             # Code review findings
│   ├── SECURITY_AUDIT.md          # Security audit report
│   ├── DEPLOYMENT_GUIDE.md        # Setup & deployment guide
│   ├── USER_MANUAL.md             # End-user guide
│   └── FUTURE_ENHANCEMENTS.md     # Roadmap & improvements
│
├── pytest.ini                     # pytest configuration
├── .gitignore                     # Git ignore rules
├── .env.example                   # Environment variable template
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher (for React frontend tooling)
- pip (Python package manager)
- npm or npx

---

### 🐍 Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Initialize database with sample data
python init_db.py

# 6. Start the Flask server
python app.py
```

The backend will run at: **http://localhost:5000**

---

### ⚛️ Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the React development server
npm start
```

The frontend will open at: **http://localhost:3000**

---

### 🧪 Running Tests

```bash
# From the project root (money Tracker/)
# Activate backend virtual environment first

# Run all tests
pytest

# Run with coverage report
pytest --cov=backend --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v

# Run security tests only
pytest tests/test_security.py -v
```

---

## 🔑 Demo Credentials

After running `python init_db.py`, use these credentials to explore:

| Field | Value |
|-------|-------|
| **Email** | demo@moneytrack.com |
| **Password** | Demo@123 |

---

## 🌐 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Add transaction |
| GET | `/api/budgets` | List budgets |
| POST | `/api/budgets` | Create budget |
| GET | `/api/reports/summary` | Monthly summary |
| GET | `/api/reports/monthly` | 12-month trends |

See `docs/API_DOCUMENTATION.md` for the complete API reference.

---

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product Requirements Document |
| [SRS.md](docs/SRS.md) | Software Requirements Specification |
| [PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) | Project Overview & Goals |
| [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | Component & Flow Architecture |
| [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) | Relational Schema & 3NF ER Diagram |
| [WORKFLOW.md](docs/WORKFLOW.md) | Sequence Diagrams & User Journeys |
| [TECH_STACK.md](docs/TECH_STACK.md) | Technology Choices & Justification |
| [TASK_TRACKER.md](docs/TASK_TRACKER.md) | Development Milestones & Checklist |
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Full RESTful API Specification |
| [SECURITY.md](docs/SECURITY.md) | Security Policy & IDOR Mitigations |
| [SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) | OWASP Top 10 Security Audit |
| [TEST_PLAN.md](docs/TEST_PLAN.md) | Testing Strategy & Matrix |
| [TEST_REPORT.md](docs/TEST_REPORT.md) | 100% Pass Rate Test Results |
| [DEBUGGING_LOG.md](docs/DEBUGGING_LOG.md) | Resolved Issues & Bug Fixes Log |
| [CODE_REVIEW.md](docs/CODE_REVIEW.md) | Code Quality & Standards Assessment |
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Setup & Production Deployment Guide |
| [USER_MANUAL.md](docs/USER_MANUAL.md) | Step-by-Step End-User Guide |
| [FUTURE_ENHANCEMENTS.md](docs/FUTURE_ENHANCEMENTS.md) | v2.0 Roadmap & Planned Features |

---

## 🛡️ Security Features

- ✅ Password hashing with PBKDF2 (Werkzeug)
- ✅ SQL injection prevention via SQLAlchemy ORM
- ✅ Session-based authentication (Flask-Login)
- ✅ CSRF protection (SameSite cookie policy)
- ✅ Input validation and sanitization
- ✅ User data isolation (users can only access their own data)
- ✅ XSS prevention (React escapes output by default)

---

## 📊 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 18.2.0 |
| Frontend Language | JavaScript/JSX | ES6+ |
| Frontend Styling | CSS3 | - |
| Charts | Recharts | 2.8.0 |
| Routing | React Router DOM | 6.16.0 |
| Backend Framework | Flask | 2.3.3 |
| Backend Language | Python | 3.10+ |
| ORM | Flask-SQLAlchemy | 3.0.5 |
| Authentication | Flask-Login | 0.6.3 |
| CORS | Flask-CORS | 4.0.0 |
| Database | SQLite | 3 |
| Testing | pytest | Latest |

---

## 👤 Author

**MCA Mini Project**  
Developed following complete SDLC methodology including:
Requirements Analysis → System Design → Development → Testing → Security Audit → Deployment

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*MoneyTrack – Track Your Money, Manage Your Future. 💰*

