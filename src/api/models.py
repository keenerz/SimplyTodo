from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import enum

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Todos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    task = db.Column(db.String(250), nullable=False)
    stage = db.Column(db.Enum("notdone", "inprogress", "done", name="TodoType"), nullable=False)
    duedate = db.Column(db.Date(), nullable=True)
    created_at = db.Column(db.DateTime(timezone=False), nullable=True, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=False), nullable=True, onupdate=datetime.utcnow)
    user = db.relationship(User)

    def serialize(self):
        return {
            "id": self.id,
            "creator": self.creator,
            "task": self.task,
            "stage": self.stage,
            "duedate": self.duedate,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    def __repr__(self):
            return f'user {self.creator}'