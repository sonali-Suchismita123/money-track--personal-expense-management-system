import os
import sys

# Add parent directory and backend directory to sys.path so modules can be imported
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(parent_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from app import create_app

# Vercel Serverless Function entry point
app = create_app()

if __name__ == "__main__":
    app.run(port=5000)

