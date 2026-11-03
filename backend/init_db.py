"""
init_db.py
----------
Database initialization and seed script for MoneyTrack.
Creates all database tables and seeds demo data (user, transactions, budgets, savings goals).

Usage:
    cd backend
    python init_db.py
"""

from datetime import date, datetime, timedelta
from werkzeug.security import generate_password_hash

from app import create_app, _seed_default_categories
from extensions import db
from models.user import User
from models.category import Category
from models.transaction import Transaction
from models.budget import Budget
from models.savings_goal import SavingsGoal


def seed_database():
    app = create_app()

    with app.app_context():
        print("Creating all database tables...")
        db.create_all()

        print("Seeding default system categories...")
        _seed_default_categories()

        # Check if demo user already exists
        demo_email = "demo@moneytrack.com"
        demo_user = User.query.filter_by(email=demo_email).first()

        if not demo_user:
            print("Creating demo user (demo@moneytrack.com)...")
            demo_user = User(
                username="demouser",
                email=demo_email,
                password_hash=generate_password_hash("Demo@123"),
                full_name="Demo User",
                currency="INR",
            )
            db.session.add(demo_user)
            db.session.commit()
            print("Demo user created.")
        else:
            print("Demo user already exists.")

        # Find categories for transactions
        categories = {c.name: c.id for c in Category.query.all()}

        today = date.today()
        current_year = today.year
        current_month = today.month

        # Seed sample transactions if user has none
        if not Transaction.query.filter_by(user_id=demo_user.id).first():
            print("Seeding sample transactions for demo user...")
            sample_transactions = [
                # Income
                {
                    "amount": 75000.0,
                    "type": "income",
                    "category_id": categories.get("Salary"),
                    "description": "Monthly Salary - Tech Corp",
                    "date": today.replace(day=1),
                    "notes": "Direct deposit",
                },
                {
                    "amount": 15000.0,
                    "type": "income",
                    "category_id": categories.get("Freelance"),
                    "description": "Web Development Project",
                    "date": today.replace(day=10) if today.day >= 10 else today,
                    "notes": "Client project milestone payment",
                },
                # Expenses
                {
                    "amount": 4200.0,
                    "type": "expense",
                    "category_id": categories.get("Groceries"),
                    "description": "Supermarket Weekly Grocery",
                    "date": today - timedelta(days=2),
                    "notes": "Vegetables, dairy, essentials",
                },
                {
                    "amount": 1850.0,
                    "type": "expense",
                    "category_id": categories.get("Food & Dining"),
                    "description": "Dinner with Friends",
                    "date": today - timedelta(days=5),
                    "notes": "Italian bistro",
                },
                {
                    "amount": 2500.0,
                    "type": "expense",
                    "category_id": categories.get("Transport"),
                    "description": "Metro & Fuel Expenses",
                    "date": today - timedelta(days=8),
                    "notes": "Monthly metro card recharge + fuel",
                },
                {
                    "amount": 3200.0,
                    "type": "expense",
                    "category_id": categories.get("Bills & Utilities"),
                    "description": "Electricity & Wi-Fi Bill",
                    "date": today.replace(day=5) if today.day >= 5 else today,
                    "notes": "Broadband and state electricity board",
                },
                {
                    "amount": 3499.0,
                    "type": "expense",
                    "category_id": categories.get("Shopping"),
                    "description": "Clothing & Shoes",
                    "date": today - timedelta(days=12),
                    "notes": "Winter wear purchase",
                },
                {
                    "amount": 799.0,
                    "type": "expense",
                    "category_id": categories.get("Entertainment"),
                    "description": "Streaming Subscriptions",
                    "date": today.replace(day=3) if today.day >= 3 else today,
                    "notes": "Netflix and Spotify subscriptions",
                },
            ]

            for tx_data in sample_transactions:
                tx = Transaction(
                    user_id=demo_user.id,
                    category_id=tx_data["category_id"],
                    amount=tx_data["amount"],
                    type=tx_data["type"],
                    description=tx_data["description"],
                    date=tx_data["date"],
                    notes=tx_data.get("notes"),
                )
                db.session.add(tx)
            db.session.commit()
            print("Sample transactions added.")

        # Seed sample budgets if user has none
        if not Budget.query.filter_by(user_id=demo_user.id).first():
            print("Seeding monthly budgets for demo user...")
            sample_budgets = [
                {"category_id": categories.get("Food & Dining"), "amount": 8000.0},
                {"category_id": categories.get("Groceries"), "amount": 10000.0},
                {"category_id": categories.get("Transport"), "amount": 5000.0},
                {"category_id": categories.get("Shopping"), "amount": 6000.0},
                {"category_id": categories.get("Bills & Utilities"), "amount": 5000.0},
                {"category_id": categories.get("Entertainment"), "amount": 3000.0},
            ]

            for b_data in sample_budgets:
                if b_data["category_id"]:
                    budget = Budget(
                        user_id=demo_user.id,
                        category_id=b_data["category_id"],
                        amount=b_data["amount"],
                        month=current_month,
                        year=current_year,
                    )
                    db.session.add(budget)
            db.session.commit()
            print("Sample budgets added.")

        # Seed sample savings goals if user has none
        if not SavingsGoal.query.filter_by(user_id=demo_user.id).first():
            print("Seeding sample savings goals for demo user...")
            sample_goals = [
                {
                    "title": "Emergency Fund",
                    "target_amount": 100000.0,
                    "current_amount": 65000.0,
                    "deadline": date(current_year, 12, 31),
                    "description": "6 months of living expenses buffer fund.",
                },
                {
                    "title": "New Laptop & Setup",
                    "target_amount": 80000.0,
                    "current_amount": 48000.0,
                    "deadline": date(current_year + 1, 3, 31),
                    "description": "High performance workstation for coding.",
                },
                {
                    "title": "Goa Trip with Friends",
                    "target_amount": 25000.0,
                    "current_amount": 25000.0,
                    "deadline": date(current_year, 11, 20),
                    "description": "Year-end vacation trip.",
                },
            ]

            for g_data in sample_goals:
                goal = SavingsGoal(
                    user_id=demo_user.id,
                    title=g_data["title"],
                    target_amount=g_data["target_amount"],
                    current_amount=g_data["current_amount"],
                    deadline=g_data["deadline"],
                    description=g_data["description"],
                )
                db.session.add(goal)
            db.session.commit()
            print("Sample savings goals added.")

        print("\n=========================================")
        print(" MoneyTrack Database Initialized Successfully!")
        print("=========================================")
        print(f" Demo User Email:    demo@moneytrack.com")
        print(f" Demo User Password: Demo@123")
        print("=========================================\n")


if __name__ == "__main__":
    seed_database()

