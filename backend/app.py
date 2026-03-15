from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from flask_jwt_extended import JWTManager
from config import JWT_SECRET_KEY
from routes.auth_routes import auth
from flask_cors import CORS

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"])
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY


jwt = JWTManager(app)


app.register_blueprint(auth)

from routes.file_routes import files
app.register_blueprint(files)

@app.route("/")
def home():
    return "Auth System Running"


if __name__ == "__main__":
    app.run()
