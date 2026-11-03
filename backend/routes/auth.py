"""
routes/auth.py
--------------
Authentication blueprint — handles user registration, login, logout,
and profile management.

URL prefix: /api/auth
All endpoints except /register and /login are protected by @login_required.
"""

from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from models.user import User
from utils.validators import validate_email, sanitize_string

# Create the blueprint — it will be registered in app.py
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ------------------------------------------------------------------ #
# POST /api/auth/register
# ------------------------------------------------------------------ #
@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user account.

    Expected JSON body:
        {
            "username":  "rahul99",
            "email":     "rahul@example.com",
            "password":  "Secret@123",
            "full_name": "Rahul Sharma"   ← optional
        }

    Returns 201 with user dict on success.
    Returns 400 for validation errors or 409 for duplicate email/username.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # ---- Extract and sanitise fields ----
        username  = sanitize_string(data.get("username", ""))
        email     = sanitize_string(data.get("email", "")).lower()
        password  = data.get("password", "")
        full_name = sanitize_string(data.get("full_name", ""))

        # ---- Validate required fields ----
        if not username:
            return jsonify({"error": "Username is required"}), 400
        if len(username) < 3:
            return jsonify({"error": "Username must be at least 3 characters"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400
        if not validate_email(email):
            return jsonify({"error": "Invalid email address"}), 400
        if not password:
            return jsonify({"error": "Password is required"}), 400
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # ---- Check uniqueness ----
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "An account with this email already exists"}), 409
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "This username is already taken"}), 409

        # ---- Create user ----
        # generate_password_hash uses PBKDF2-SHA256 by default (secure)
        new_user = User(
            username      = username,
            email         = email,
            password_hash = generate_password_hash(password),
            full_name     = full_name or None,
        )
        db.session.add(new_user)
        db.session.commit()

        # Log the user in immediately after registration
        login_user(new_user, remember=True)

        return jsonify({
            "message": "Account created successfully",
            "user":    new_user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/auth/login
# ------------------------------------------------------------------ #
@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Log in with email + password.

    Expected JSON body:
        { "email": "rahul@example.com", "password": "Secret@123" }

    Returns 200 with user dict on success.
    Returns 401 if credentials are wrong.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        email    = sanitize_string(data.get("email", "")).lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Look up user by email
        user = User.query.filter_by(email=email).first()

        # check_password_hash compares the plain password against the stored hash
        if not user or not check_password_hash(user.password_hash, password):
            # Return the same error for both cases (prevents user enumeration)
            return jsonify({"error": "Invalid email or password"}), 401

        # remember=True keeps the session alive across browser restarts
        login_user(user, remember=True)

        return jsonify({
            "message": "Logged in successfully",
            "user":    user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/auth/logout
# ------------------------------------------------------------------ #
@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    Log out the current user by clearing their session.
    Returns 200 on success.
    """
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


# ------------------------------------------------------------------ #
# GET /api/auth/me
# ------------------------------------------------------------------ #
@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    """
    Return the currently authenticated user's information.
    Useful for the frontend to re-hydrate state on page refresh.
    """
    return jsonify({"user": current_user.to_dict()}), 200


# ------------------------------------------------------------------ #
# PUT /api/auth/profile
# ------------------------------------------------------------------ #
@auth_bp.route("/profile", methods=["PUT"])
@login_required
def update_profile():
    """
    Update the current user's profile.

    Accepted JSON fields (all optional):
        {
            "full_name": "Rahul Kumar Sharma",
            "currency":  "USD"
        }

    Password changes are NOT handled here (would need a separate
    /change-password endpoint with current_password verification).
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        user = current_user

        # Only update fields that were actually provided
        if "full_name" in data:
            user.full_name = sanitize_string(data["full_name"]) or None

        if "currency" in data:
            currency = sanitize_string(data["currency"]).upper()
            # Allow any non-empty currency code (frontend enforces the list)
            if not currency:
                return jsonify({"error": "Currency cannot be empty"}), 400
            user.currency = currency

        db.session.commit()

        return jsonify({
            "message": "Profile updated successfully",
            "user":    user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Profile update failed", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# PUT /api/auth/change-password
# ------------------------------------------------------------------ #
@auth_bp.route("/change-password", methods=["PUT"])
@login_required
def change_password():
    """
    Change user password with current password verification.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        current_password = data.get("current_password", "")
        new_password = data.get("new_password", "")

        if not current_password or not new_password:
            return jsonify({"error": "Current and new passwords are required"}), 400

        if not check_password_hash(current_user.password_hash, current_password):
            return jsonify({"error": "Current password is incorrect"}), 400

        if len(new_password) < 6:
            return jsonify({"error": "New password must be at least 6 characters"}), 400

        current_user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message": "Password changed successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to change password", "details": str(e)}), 500

