from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):


            # ✅ Step 1: Verify JWT first
            verify_jwt_in_request()


            # ✅ Step 2: Get claims from token
            claims = get_jwt()


            # ✅ Step 3: Check role
            if claims.get("role") != required_role:
                return jsonify({"message": "Access denied"}), 403


            return fn(*args, **kwargs)


        return wrapper
    return decorator
