from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from utils.password_hash import hash_password, verify_password
import psycopg2
from config import DB_URL


auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data["username"]
    password = hash_password(data["password"])
    role = data.get("role", "user")


    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()


    cur.execute(
        "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
        (username, password, role)
    )


    conn.commit()
    cur.close()
    conn.close()


    return jsonify({"message": "User registered successfully"})




@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]


    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("SELECT id, password_hash, role FROM users WHERE username=%s", (username,))
  
    user = cur.fetchone()

    

    cur.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not verify_password(user[1], password):
        return jsonify({"error": "Invalid credentials"}), 401

    if user and verify_password(user[1], password):
        access_token = create_access_token(
            identity=str(user[0]),
            additional_claims={"role": user[2]}
        )
    return jsonify({"token": access_token})




from utils.rbac import role_required
from flask import jsonify


@auth.route("/admin", methods=["GET"])
@role_required("admin")
def admin_only():
    return jsonify({"message": "Welcome Admin"})

