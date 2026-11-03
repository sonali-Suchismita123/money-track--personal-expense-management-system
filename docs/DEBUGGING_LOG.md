# Debugging & Issue Resolution Log
## MoneyTrack – Personal Expense & Budget Management System

> **Document Version:** 1.0  
> **Date:** November 2026  

---

## 1. Issue Log & Resolution Matrix

### Issue 01: `The file cannot be accessed by the system` on Python invocation
- **Symptom:** Running `python --version` failed with an ApplicationFailedException in PowerShell.
- **Root Cause:** WindowsApps alias was registered in PATH pointing to the zero-byte Microsoft Store execution alias.
- **Resolution:** Targeted the full Python 3.12 binary (`python3.12.exe`) which resolved the execution path.

### Issue 02: Initial Savings Deposit Not Persisted in Goal Creation
- **Symptom:** `test_savings_lifecycle` failed with `assert 0.0 > 0` on goal creation with initial deposit.
- **Root Cause:** In `backend/routes/savings.py`, the `create_savings` route was hardcoding `current_amount = 0.0` instead of reading `current_amount` from `request.get_json()`.
- **Resolution:** Added conditional parsing of `current_amount` in `savings.py`, falling back to `0.0` only when omitted.

### Issue 03: 404 Endpoint Not Found on Savings Fund Deposit
- **Symptom:** Calling `POST /api/savings/<id>/add` from the frontend returned 404.
- **Root Cause:** Backend had implemented amount updates via `PUT /api/savings/<id>` using an `add_amount` parameter, while frontend `api.js` was configured to call `POST /api/savings/<id>/add`.
- **Resolution:** Implemented the dedicated `POST /api/savings/<int:goal_id>/add` route in `backend/routes/savings.py` supporting both formats.

### Issue 04: Missing `esutils` & Incomplete npm Installation
- **Symptom:** `npm run build` failed with `Error: Cannot find module 'esutils'`.
- **Root Cause:** An interrupted previous `npm install` had left several nested packages as empty directories.
- **Resolution:** Cleared corrupted `node_modules` and `package-lock.json`, performed a fresh `npm install --no-audit`, and successfully verified the compilation.

### Issue 05: Missing Password Change API Route
- **Symptom:** Frontend profile settings had a form for changing passwords, but no backend handler existed.
- **Root Cause:** The `auth.py` blueprint ended after `/profile`.
- **Resolution:** Created `PUT /api/auth/change-password` requiring current password verification before updating the hash.

