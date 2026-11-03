"""
routes/categories.py
--------------------
Category CRUD blueprint.

URL prefix: /api/categories
All routes require login.

Rules:
  - GET returns BOTH system categories (user_id=NULL) AND user's own categories.
  - POST creates a new user-owned category.
  - PUT / DELETE only work on the user's OWN categories (not system ones).
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from extensions import db
from models.category import Category
from utils.validators import sanitize_string

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


# ------------------------------------------------------------------ #
# GET /api/categories  — list all accessible categories
# ------------------------------------------------------------------ #
@categories_bp.route("", methods=["GET"])
@login_required
def get_categories():
    """
    Return all categories visible to the current user:
      1. System / default categories (user_id IS NULL)
      2. Categories created by the current user

    Optional query parameter:
        ?type=expense   or   ?type=income
    """
    try:
        # Build filter: system categories OR user's own
        from sqlalchemy import or_
        query = Category.query.filter(
            or_(
                Category.user_id == None,           # noqa: E711 — SQLAlchemy requires == None
                Category.user_id == current_user.id
            )
        )

        # Optional type filter
        cat_type = request.args.get("type")
        if cat_type:
            if cat_type not in ("income", "expense"):
                return jsonify({"error": "type must be 'income' or 'expense'"}), 400
            query = query.filter(Category.type == cat_type)

        categories = query.order_by(Category.user_id.asc(), Category.name.asc()).all()

        return jsonify({
            "categories": [c.to_dict() for c in categories],
            "count":      len(categories)
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch categories", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/categories  — create a custom category
# ------------------------------------------------------------------ #
@categories_bp.route("", methods=["POST"])
@login_required
def create_category():
    """
    Create a new user-owned category.

    Required JSON fields:
        name  : string  (e.g. "Gym")
        type  : 'income' | 'expense'

    Optional JSON fields:
        icon  : emoji string  (e.g. "🏋️")
        color : hex color     (e.g. "#FF5733")
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        name     = sanitize_string(data.get("name", ""))
        cat_type = sanitize_string(data.get("type", ""))
        icon     = sanitize_string(data.get("icon", "📂"))
        color    = sanitize_string(data.get("color", "#6c757d"))

        if not name:
            return jsonify({"error": "Category name is required"}), 400
        if cat_type not in ("income", "expense"):
            return jsonify({"error": "type must be 'income' or 'expense'"}), 400

        # Prevent duplicates for this user
        existing = Category.query.filter_by(
            name    = name,
            user_id = current_user.id
        ).first()
        if existing:
            return jsonify({"error": "You already have a category with this name"}), 409

        category = Category(
            name    = name,
            type    = cat_type,
            icon    = icon or "📂",
            color   = color or "#6c757d",
            user_id = current_user.id,
        )
        db.session.add(category)
        db.session.commit()

        return jsonify({
            "message":  "Category created successfully",
            "category": category.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create category", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/categories/<id>  — get a single category
# ------------------------------------------------------------------ #
@categories_bp.route("/<int:category_id>", methods=["GET"])
@login_required
def get_category(category_id):
    """Return a single category by ID (system or user-owned)."""
    try:
        from sqlalchemy import or_
        category = Category.query.filter(
            Category.id == category_id,
            or_(
                Category.user_id == None,           # noqa: E711
                Category.user_id == current_user.id
            )
        ).first()

        if not category:
            return jsonify({"error": "Category not found"}), 404

        return jsonify({"category": category.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch category", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# PUT /api/categories/<id>  — update a category
# ------------------------------------------------------------------ #
@categories_bp.route("/<int:category_id>", methods=["PUT"])
@login_required
def update_category(category_id):
    """
    Update a user-owned category.
    System categories cannot be modified.
    """
    try:
        # Only allow editing user-owned categories (user_id == current user)
        category = Category.query.filter_by(
            id      = category_id,
            user_id = current_user.id
        ).first()

        if not category:
            # Could be not found OR it's a system category
            system_cat = Category.query.filter_by(id=category_id, user_id=None).first()
            if system_cat:
                return jsonify({"error": "System categories cannot be modified"}), 403
            return jsonify({"error": "Category not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        if "name" in data:
            name = sanitize_string(data["name"])
            if not name:
                return jsonify({"error": "Category name cannot be empty"}), 400
            category.name = name

        if "type" in data:
            if data["type"] not in ("income", "expense"):
                return jsonify({"error": "type must be 'income' or 'expense'"}), 400
            category.type = data["type"]

        if "icon" in data:
            category.icon = sanitize_string(data["icon"]) or "📂"

        if "color" in data:
            category.color = sanitize_string(data["color"]) or "#6c757d"

        db.session.commit()

        return jsonify({
            "message":  "Category updated successfully",
            "category": category.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update category", "details": str(e)}), 500


# ------------------------------------------------------------------ #
# DELETE /api/categories/<id>  — delete a category
# ------------------------------------------------------------------ #
@categories_bp.route("/<int:category_id>", methods=["DELETE"])
@login_required
def delete_category(category_id):
    """
    Delete a user-owned category.
    System categories cannot be deleted.
    Transactions using this category will have their category_id set to NULL.
    """
    try:
        category = Category.query.filter_by(
            id      = category_id,
            user_id = current_user.id
        ).first()

        if not category:
            system_cat = Category.query.filter_by(id=category_id, user_id=None).first()
            if system_cat:
                return jsonify({"error": "System categories cannot be deleted"}), 403
            return jsonify({"error": "Category not found"}), 404

        db.session.delete(category)
        db.session.commit()

        return jsonify({"message": "Category deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete category", "details": str(e)}), 500
