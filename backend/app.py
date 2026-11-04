"""
app.py
------
Main Flask application factory for MoneyTrack backend.

This file:
  1. Creates and configures the Flask app
  2. Initialises extensions (SQLAlchemy, Flask-Login, Flask-CORS)
  3. Registers all blueprints (auth, transactions, categories, budgets, savings, reports)
  4. Creates database tables on startup
  5. Seeds default categories if they don't exist yet
  6. Defines global error handlers (404, 405, 500)

Run with:
    python app.py
Or in production use a WSGI server:
    waitress-serve --port=5000 app:app
"""

import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_login import LoginManager

from config import Config
from extensions import db, login_manager


def create_app(config_class=Config):
    """
    Application factory pattern.
    Creating the app inside a function makes it easy to create
    multiple instances (e.g. one for testing, one for production).
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ------------------------------------------------------------------ #
    # Initialise extensions with the app instance
    # ------------------------------------------------------------------ #
    db.init_app(app)
    login_manager.init_app(app)

    # Flask-CORS: allow requests from the React frontend (localhost and 127.0.0.1)
    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3001",
                "http://localhost:5000",
                "http://127.0.0.1:5000",
                "http://localhost:5001",
                "http://127.0.0.1:5001",
            ]
        }},
        supports_credentials=True,   # required so cookies are sent cross-origin
    )

    # ------------------------------------------------------------------ #
    # Flask-Login configuration
    # ------------------------------------------------------------------ #
    # Where to redirect unauthenticated users when they hit @login_required
    login_manager.login_view = None   # We return JSON 401, not a redirect

    @login_manager.user_loader
    def load_user(user_id):
        """
        Called by Flask-Login on every request to reload the user object
        from the session.  Must return None (not raise) if the user is gone.
        """
        from models.user import User
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        """Return JSON 401 instead of redirecting to a login page."""
        return jsonify({"error": "Authentication required. Please log in."}), 401

    # ------------------------------------------------------------------ #
    # Register blueprints
    # ------------------------------------------------------------------ #
    from routes.auth         import auth_bp
    from routes.transactions import transactions_bp
    from routes.categories   import categories_bp
    from routes.budgets      import budgets_bp
    from routes.savings      import savings_bp
    from routes.reports      import reports_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(transactions_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(budgets_bp)
    app.register_blueprint(savings_bp)
    app.register_blueprint(reports_bp)

    # ------------------------------------------------------------------ #
    # Database initialisation and seeding
    # ------------------------------------------------------------------ #
    with app.app_context():
        try:
            db.create_all()        # Create all tables (idempotent — won't drop existing data)
            _seed_default_categories()
        except Exception as e:
            app.logger.warning(f"Database auto-init note: {e}")

    # ------------------------------------------------------------------ #
    # Global error handlers — always return JSON
    # ------------------------------------------------------------------ #
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "HTTP method not allowed for this endpoint"}), 405

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()   # Roll back any failed transaction
        return jsonify({"error": "Internal server error"}), 500

    # ------------------------------------------------------------------ #
    # Health-check endpoint (no auth required)
    # ------------------------------------------------------------------ #
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "app": "MoneyTrack API"}), 200

    # ------------------------------------------------------------------ #
    # Serve React Frontend Build directly on Port 5000
    # ------------------------------------------------------------------ #
    FRONTEND_BUILD = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "build"))

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        # Don't intercept API calls
        if path.startswith("api/"):
            return jsonify({"error": "Endpoint not found"}), 404

        target = os.path.join(FRONTEND_BUILD, path)
        if path != "" and os.path.exists(target):
            return send_from_directory(FRONTEND_BUILD, path)

        index_file = os.path.join(FRONTEND_BUILD, "index.html")
        if os.path.exists(index_file):
            return send_from_directory(FRONTEND_BUILD, "index.html")

        return jsonify({"status": "ok", "app": "MoneyTrack API"}), 200

    return app


# ------------------------------------------------------------------ #
# Default category seed data
# ------------------------------------------------------------------ #
def _seed_default_categories():
    """
    Insert the built-in categories if they haven't been created yet.

    These are system categories (user_id = None) visible to all users.
    Idempotent — runs every startup but only inserts missing rows.
    """
    from models.category import Category

    default_categories = [
        # ---- Expense categories ----
        {"name": "Food & Dining",    "type": "expense", "icon": "🍔", "color": "#FF6B6B"},
        {"name": "Transport",        "type": "expense", "icon": "🚗", "color": "#4ECDC4"},
        {"name": "Shopping",         "type": "expense", "icon": "🛍️",  "color": "#A855F7"},
        {"name": "Entertainment",    "type": "expense", "icon": "🎬", "color": "#F59E0B"},
        {"name": "Bills & Utilities","type": "expense", "icon": "📋", "color": "#3B82F6"},
        {"name": "Healthcare",       "type": "expense", "icon": "🏥", "color": "#EF4444"},
        {"name": "Education",        "type": "expense", "icon": "📚", "color": "#6366F1"},
        {"name": "Travel",           "type": "expense", "icon": "✈️",  "color": "#06B6D4"},
        {"name": "Groceries",        "type": "expense", "icon": "🛒", "color": "#10B981"},
        {"name": "Other Expense",    "type": "expense", "icon": "📦", "color": "#6B7280"},
        # ---- Income categories ----
        {"name": "Salary",           "type": "income",  "icon": "💰", "color": "#22C55E"},
        {"name": "Freelance",        "type": "income",  "icon": "💻", "color": "#14B8A6"},
        {"name": "Investment",       "type": "income",  "icon": "📈", "color": "#8B5CF6"},
        {"name": "Business",         "type": "income",  "icon": "🏢", "color": "#F97316"},
        {"name": "Gift",             "type": "income",  "icon": "🎁", "color": "#EC4899"},
        {"name": "Other Income",     "type": "income",  "icon": "💵", "color": "#84CC16"},
    ]

    for cat_data in default_categories:
        # Only insert if a system category with this name doesn't already exist
        exists = Category.query.filter_by(
            name    = cat_data["name"],
            user_id = None
        ).first()
        if not exists:
            category = Category(
                name    = cat_data["name"],
                type    = cat_data["type"],
                icon    = cat_data["icon"],
                color   = cat_data["color"],
                user_id = None,   # NULL = system/global category
            )
            db.session.add(category)

    db.session.commit()


# ------------------------------------------------------------------ #
# Entry point
# ------------------------------------------------------------------ #
# Create the app at module level so 'flask run' and WSGI servers can find it
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"MoneyTrack running at http://localhost:{port} and http://127.0.0.1:{port}")
    app.run(debug=False, host="0.0.0.0", port=port)
