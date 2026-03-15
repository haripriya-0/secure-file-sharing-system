
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # Make sure to initialize db in your app.py later

class File(db.Model):
    __tablename__ = "files"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    s3_key = db.Column(db.String(255), nullable=False)
    uploaded_by = db.Column(db.Integer, nullable=False)  # user_id
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<File {self.filename}>"