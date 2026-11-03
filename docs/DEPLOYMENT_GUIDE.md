# Setup and Deployment Guide
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Environment:** Development & Production  
> **Date:** November 2026  

---

## 1. System Prerequisites

Before running the application, ensure your environment meets the requirements:
- **Python**: Version 3.10 or higher
- **Node.js**: Version 18.x or 20.x+ (includes npm)
- **Git**: For version control

---

## 2. Local Development Setup

### 2.1 Backend Setup (Flask API)
```bash
# 1. Open terminal and enter the backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Initialize and seed database with sample data
python init_db.py

# 6. Run Flask development server
python app.py
```
Backend will be live at: **`http://localhost:5000`**

### 2.2 Frontend Setup (React Application)
```bash
# 1. Open another terminal and enter the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start development server
npm start
```
The browser will open automatically at: **`http://localhost:3000`**

---

## 3. Demo Account Credentials

You can sign in immediately using the pre-seeded demo user:
- **Email:** `demo@moneytrack.com`
- **Password:** `Demo@123`

---

## 4. Running the Pytest Test Suite

From the project root directory (with backend virtualenv active):
```bash
# Run all automated tests
pytest -v

# Run with coverage report
pytest --cov=backend tests/
```

---

## 5. Production Deployment

### 5.1 Production Backend (Waitress WSGI on Windows / Gunicorn on Linux)
```bash
# Production server on Linux
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

# Production server on Windows
waitress-serve --port=5000 app:app
```

### 5.2 Production Frontend Build
```bash
cd frontend
npm run build
```
This generates optimized static files in `frontend/build/` which can be served via Nginx or Cloudflare Pages.

