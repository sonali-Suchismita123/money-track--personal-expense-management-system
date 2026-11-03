# API Documentation
## MoneyTrack RESTful API Specification

> **Base URL:** `http://localhost:5000/api`  
> **Data Format:** JSON (`application/json`)  
> **Authentication:** Session Cookie via `Flask-Login` (`credentials: 'include'`)  

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123",
    "full_name": "John Doe"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "message": "Account created successfully",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "currency": "INR",
      "created_at": "2026-11-01T12:00:00"
    }
  }
  ```

### 1.2 User Login
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "demo@moneytrack.com",
    "password": "Demo@123"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Logged in successfully",
    "user": { ... }
  }
  ```

### 1.3 User Logout
- **Method:** `POST`
- **Path:** `/api/auth/logout`
- **Access:** Authenticated
- **Response (`200 OK`):** `{"message": "Logged out successfully"}`

### 1.4 Get Current User
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Access:** Authenticated
- **Response (`200 OK`):** `{"user": { ... }}`

### 1.5 Update Profile
- **Method:** `PUT`
- **Path:** `/api/auth/profile`
- **Request Body:** `{"full_name": "New Name", "currency": "USD"}`
- **Response (`200 OK`):** `{"message": "Profile updated successfully", "user": { ... }}`

### 1.6 Change Password
- **Method:** `PUT`
- **Path:** `/api/auth/change-password`
- **Request Body:** `{"current_password": "OldPassword", "new_password": "NewPassword123"}`
- **Response (`200 OK`):** `{"message": "Password changed successfully"}`

---

## 2. Transactions Endpoints (`/api/transactions`)

### 2.1 List Transactions
- **Method:** `GET`
- **Path:** `/api/transactions`
- **Query Params:**
  - `type`: `income` | `expense`
  - `category_id`: integer
  - `month`: 1-12
  - `year`: 4-digit
  - `start_date`: YYYY-MM-DD
  - `end_date`: YYYY-MM-DD
- **Response (`200 OK`):**
  ```json
  {
    "transactions": [
      {
        "id": 10,
        "user_id": 1,
        "category_id": 2,
        "category": { "id": 2, "name": "Food & Dining", "icon": "🍔", "color": "#FF6B6B" },
        "amount": 450.0,
        "type": "expense",
        "description": "Lunch at cafe",
        "date": "2026-11-01",
        "notes": "With team",
        "created_at": "2026-11-01T13:00:00"
      }
    ],
    "count": 1
  }
  ```

### 2.2 Create Transaction
- **Method:** `POST`
- **Path:** `/api/transactions`
- **Request Body:**
  ```json
  {
    "type": "expense",
    "category_id": 2,
    "amount": 450.0,
    "description": "Lunch at cafe",
    "date": "2026-11-01",
    "notes": "With team"
  }
  ```
- **Response (`201 Created`):** `{"message": "Transaction created", "transaction": { ... }}`

### 2.3 Update Transaction
- **Method:** `PUT`
- **Path:** `/api/transactions/<id>`
- **Response (`200 OK`):** `{"message": "Transaction updated", "transaction": { ... }}`

### 2.4 Delete Transaction
- **Method:** `DELETE`
- **Path:** `/api/transactions/<id>`
- **Response (`200 OK`):** `{"message": "Transaction deleted successfully"}`

---

## 3. Categories Endpoints (`/api/categories`)
- `GET /api/categories` - List categories (system defaults + user custom).
- `POST /api/categories` - Create custom category (`name`, `type`, `icon`, `color`).
- `PUT /api/categories/<id>` - Update custom category.
- `DELETE /api/categories/<id>` - Delete custom category.

---

## 4. Budgets Endpoints (`/api/budgets`)
- `GET /api/budgets?month=11&year=2026` - List budgets with real-time calculated `spent`, `remaining`, and `percentage`.
- `POST /api/budgets` - Create budget (`category_id`, `amount`, `month`, `year`).
- `PUT /api/budgets/<id>` - Update budget amount.
- `DELETE /api/budgets/<id>` - Remove budget.

---

## 5. Savings Goals Endpoints (`/api/savings`)
- `GET /api/savings` - List user savings goals with `progress_percentage` and `days_remaining`.
- `POST /api/savings` - Create goal (`title`, `target_amount`, `current_amount`, `deadline`, `description`).
- `PUT /api/savings/<id>` - Update goal details.
- `POST /api/savings/<id>/add` - Deposit additional funds (`amount`).
- `DELETE /api/savings/<id>` - Delete goal.

---

## 6. Reports Endpoints (`/api/reports`)
- `GET /api/reports/summary?month=11&year=2026` - Summary statistics (income, expense, balance, count).
- `GET /api/reports/monthly` - 12-month historical cash flow.
- `GET /api/reports/category?month=11&year=2026&type=expense` - Category breakdown with percentage share.
- `GET /api/reports/trends` - Weekly/daily trend analysis for the current month.

