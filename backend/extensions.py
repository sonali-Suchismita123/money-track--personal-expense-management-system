"""
extensions.py
-------------
Central place to instantiate Flask extensions.

Why a separate file?
  If we create db = SQLAlchemy() inside app.py AND import it in models/,
  Python may run into circular imports (app.py → models → app.py …).
  By putting the extension objects here, everyone can import from extensions.py
  without pulling in the full app.py.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# The SQLAlchemy instance — shared across all models and routes
db = SQLAlchemy()

# LoginManager handles session-based authentication
login_manager = LoginManager()
