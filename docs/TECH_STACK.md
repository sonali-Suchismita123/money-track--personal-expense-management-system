# Technology Stack & Selection Justification
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Date:** November 2026  
> **Project Scope:** MCA Mini Project  

---

## 1. Overview Matrix

| Tier | Component | Technology | Version | Key Purpose |
|---|---|---|---|---|
| **Frontend** | UI Library | React.js | 18.2.0 | Reactive component-based single-page application |
| | Router | React Router DOM | 6.16.0 | Client-side routing with route guards |
| | Visualizations | Recharts | 2.8.0 | SVG-based interactive data charts |
| | Styling | Vanilla CSS3 | Modern CSS | CSS custom properties, responsive flexbox & grid |
| **Backend** | API Framework | Flask | 2.3.3 / 3.x | Lightweight, high-performance REST microframework |
| | ORM | Flask-SQLAlchemy | 3.1.1 | Object-Relational Mapping & query abstraction |
| | Auth | Flask-Login | 0.6.3 | Session management & user loading |
| | CORS | Flask-CORS | 6.0.5 | Cross-Origin Resource Sharing with credentials |
| | Hashing | Werkzeug Security | 3.1.x | Salted PBKDF2-SHA256 password cryptography |
| **Database** | Relational DB | SQLite 3 | Embedded | Zero-configuration ACID file persistence |
| **Testing** | Test Runner | Pytest | 9.2.0 | Unit, integration, and endpoint testing |
| | Coverage | Pytest-Cov | 7.1.0 | Code execution coverage analysis |

---

## 2. Architectural Justification

### 2.1 Why Flask for Backend?
- **Micro-framework flexibility:** Unlike Django, Flask does not impose rigid structure, making it ideal for demonstrating modular architecture (Application Factory pattern, Blueprints) for academic evaluation.
- **RESTful design clarity:** Endpoints map directly to HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) with JSON error responses.

### 2.2 Why React 18 for Frontend?
- **State management simplicity:** React Context API (`AuthContext`) manages auth status across the app without the overhead of Redux.
- **SPA responsiveness:** Eliminates full-page reloads when navigating between Dashboard, Transactions, Budgets, and Reports.

### 2.3 Why SQLite for Persistence?
- **Zero-setup portability:** File-based database (`instance/moneytrack.db`) requires no daemon setup (e.g. MySQL/PostgreSQL server setup), making local demonstration and evaluator grading effortless.
- **ACID compliance:** Provides full relational integrity, foreign keys, and transactions.

